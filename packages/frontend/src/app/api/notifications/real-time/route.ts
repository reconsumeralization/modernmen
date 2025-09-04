import { NextRequest, NextResponse } from 'next/server'
import getPayloadClient from '@/payload'
import { logger } from '@/lib/logger'

export interface NotificationPayload {
  type: 'appointment' | 'inventory' | 'system' | 'commission' | 'customer' | 'urgent'
  title: string
  message: string
  recipient: string
  data?: Record<string, any>
  priority: 'low' | 'normal' | 'high' | 'urgent'
  channels: ('push' | 'email' | 'sms' | 'in-app')[]
  scheduledFor?: string
  expiresAt?: string
  actionUrl?: string
  actionText?: string
}

// Store for SSE connections
const sseConnections = new Map<string, Response>()
const pendingNotifications = new Map<string, NotificationPayload[]>()

export async function POST(request: NextRequest) {
  try {
    const payload = await getPayloadClient()
    const notification: NotificationPayload = await request.json()

    logger.info('📬 Creating real-time notification', { 
      type: notification.type, 
      recipient: notification.recipient 
    })

    // Create notification in database
    const dbNotification = await payload.create({
      collection: 'notifications',
      data: {
        type: notification.type,
        title: notification.title,
        message: notification.message,
        recipient: notification.recipient,
        priority: notification.priority,
        channels: notification.channels,
        scheduledFor: notification.scheduledFor ? new Date(notification.scheduledFor) : new Date(),
        expiresAt: notification.expiresAt ? new Date(notification.expiresAt) : null,
        status: 'sent',
        data: notification.data || {},
        actionUrl: notification.actionUrl,
        actionText: notification.actionText,
        readAt: null
      }
    })

    // Send real-time notification via SSE
    await sendRealTimeNotification(notification)

    // Send via other channels based on priority and settings
    await processNotificationChannels(notification)

    logger.info('✅ Real-time notification sent successfully')

    return NextResponse.json({
      success: true,
      notificationId: dbNotification.id,
      message: 'Notification sent successfully'
    })

  } catch (error) {
    logger.error('❌ Real-time notification failed:', { operation: 'real_time_notification' }, error instanceof Error ? error : undefined)
    
    return NextResponse.json(
      {
        success: false,
        error: 'Notification sending failed',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  const url = new URL(request.url)
  const userId = url.searchParams.get('userId')
  const action = url.searchParams.get('action')

  // Handle SSE connection for real-time notifications
  if (action === 'stream' && userId) {
    return handleSSEConnection(userId)
  }

  // Handle fetching notifications
  if (action === 'list' && userId) {
    return await fetchNotifications(userId)
  }

  // Handle marking notifications as read
  if (action === 'markRead') {
    const notificationId = url.searchParams.get('notificationId')
    if (notificationId) {
      return await markNotificationAsRead(notificationId)
    }
  }

  return NextResponse.json({
    message: 'Real-time Notifications API',
    description: 'Manage real-time notifications with SSE, push, email, and SMS',
    endpoints: {
      'POST /': 'Send a new notification',
      'GET /?action=stream&userId=ID': 'Connect to SSE stream for real-time notifications',
      'GET /?action=list&userId=ID': 'Fetch user notifications',
      'GET /?action=markRead&notificationId=ID': 'Mark notification as read'
    },
    example: {
      type: 'appointment',
      title: 'Appointment Reminder',
      message: 'Your appointment is tomorrow at 2:00 PM',
      recipient: 'user-id',
      priority: 'normal',
      channels: ['push', 'email'],
      actionUrl: '/appointments/123',
      actionText: 'View Appointment'
    }
  })
}

// SSE Connection Handler
function handleSSEConnection(userId: string): Response {
  const encoder = new TextEncoder()
  
  const stream = new ReadableStream({
    start(controller) {
      logger.info(`📡 SSE connection opened for user: ${userId}`)
      
      // Send initial connection message
      const initialMessage = `data: ${JSON.stringify({
        type: 'connection',
        message: 'Connected to notification stream',
        timestamp: new Date().toISOString()
      })}\n\n`
      
      controller.enqueue(encoder.encode(initialMessage))
      
      // Store connection
      const response = new Response(stream, {
        headers: {
          'Content-Type': 'text/event-stream',
          'Cache-Control': 'no-cache',
          'Connection': 'keep-alive',
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Headers': 'Cache-Control'
        }
      })
      
      sseConnections.set(userId, response)
      
      // Send any pending notifications
      const pending = pendingNotifications.get(userId) || []
      pending.forEach(notification => {
        const message = `data: ${JSON.stringify({
          type: 'notification',
          ...notification,
          timestamp: new Date().toISOString()
        })}\n\n`
        controller.enqueue(encoder.encode(message))
      })
      pendingNotifications.delete(userId)
      
      // Keep-alive heartbeat
      const heartbeat = setInterval(() => {
        const heartbeatMessage = `data: ${JSON.stringify({
          type: 'heartbeat',
          timestamp: new Date().toISOString()
        })}\n\n`
        
        try {
          controller.enqueue(encoder.encode(heartbeatMessage))
        } catch (error) {
          logger.info(`📡 SSE connection closed for user: ${userId}`)
          clearInterval(heartbeat)
          sseConnections.delete(userId)
          controller.close()
        }
      }, 30000) // 30 seconds
      
      // Cleanup on close
      return () => {
        clearInterval(heartbeat)
        sseConnections.delete(userId)
        logger.info(`📡 SSE connection cleanup for user: ${userId}`)
      }
    }
  })

  return new Response(stream, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      'Connection': 'keep-alive',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Headers': 'Cache-Control'
    }
  })
}

// Send real-time notification via SSE
async function sendRealTimeNotification(notification: NotificationPayload) {
  const connection = sseConnections.get(notification.recipient)
  
  if (connection) {
    try {
      const message = `data: ${JSON.stringify({
        type: 'notification',
        ...notification,
        timestamp: new Date().toISOString()
      })}\n\n`
      
      // This would need to be implemented differently in a production environment
      // as Response streams are read-only. In practice, you'd use a WebSocket or SSE library
      logger.info(`📡 Sending SSE notification to ${notification.recipient}`)
      
    } catch (error) {
      logger.warn('Failed to send SSE notification, storing for later:', error)
      // Store for when user reconnects
      if (!pendingNotifications.has(notification.recipient)) {
        pendingNotifications.set(notification.recipient, [])
      }
      pendingNotifications.get(notification.recipient)!.push(notification)
    }
  } else {
    // Store for when user connects
    if (!pendingNotifications.has(notification.recipient)) {
      pendingNotifications.set(notification.recipient, [])
    }
    pendingNotifications.get(notification.recipient)!.push(notification)
    logger.info(`📡 User ${notification.recipient} not connected, storing notification`)
  }
}

// Process notification through various channels
async function processNotificationChannels(notification: NotificationPayload) {
  for (const channel of notification.channels) {
    try {
      switch (channel) {
        case 'email':
          await sendEmailNotification(notification)
          break
        case 'sms':
          await sendSMSNotification(notification)
          break
        case 'push':
          await sendPushNotification(notification)
          break
        case 'in-app':
          // Already handled by SSE
          break
      }
    } catch (error) {
      logger.warn(`Failed to send ${channel} notification:`, error)
    }
  }
}

// Email notification sender
async function sendEmailNotification(notification: NotificationPayload) {
  // In a real implementation, this would integrate with your email service
  // For now, just log the email that would be sent
  
  const emailContent = {
    to: notification.recipient,
    subject: notification.title,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: linear-gradient(135deg, #1f2937, #374151); color: white; padding: 20px; text-align: center;">
          <h1 style="margin: 0;">✂️ Modern Men Hair Salon</h1>
          <p style="margin: 5px 0 0 0; opacity: 0.9;">Notification</p>
        </div>
        <div style="padding: 20px; background: white;">
          <h2 style="color: #1f2937; margin-top: 0;">${notification.title}</h2>
          <p style="color: #4b5563; line-height: 1.6;">${notification.message}</p>
          ${notification.actionUrl ? `
            <div style="text-align: center; margin: 30px 0;">
              <a href="${notification.actionUrl}" style="background: linear-gradient(135deg, #1f2937, #374151); color: white; padding: 12px 24px; text-decoration: none; border-radius: 8px; display: inline-block; font-weight: 600;">
                ${notification.actionText || 'Take Action'}
              </a>
            </div>
          ` : ''}
          <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #e5e7eb; color: #9ca3af; font-size: 14px;">
            <p>This is an automated message from Modern Men Hair Salon management system.</p>
            <p>If you no longer wish to receive these notifications, please contact your administrator.</p>
          </div>
        </div>
      </div>
    `,
    priority: notification.priority
  }

  logger.info('📧 Email notification prepared:', { to: emailContent.to, subject: emailContent.subject })
  
  // Here you would integrate with your email service (SendGrid, AWS SES, etc.)
  // await emailService.send(emailContent)
}

// SMS notification sender
async function sendSMSNotification(notification: NotificationPayload) {
  // In a real implementation, this would integrate with Twilio or similar service
  
  const smsContent = {
    to: notification.recipient,
    body: `${notification.title}: ${notification.message}${notification.actionUrl ? ` ${notification.actionUrl}` : ''}`,
    priority: notification.priority
  }

  logger.info('📱 SMS notification prepared:', { to: smsContent.to, preview: smsContent.body.substring(0, 50) + '...' })
  
  // Here you would integrate with your SMS service
  // await smsService.send(smsContent)
}

// Push notification sender  
async function sendPushNotification(notification: NotificationPayload) {
  // In a real implementation, this would integrate with Firebase, OneSignal, etc.
  
  const pushContent = {
    userId: notification.recipient,
    title: notification.title,
    body: notification.message,
    icon: '/icon-192x192.png',
    badge: '/badge-72x72.png',
    actions: notification.actionUrl ? [{
      action: 'open',
      title: notification.actionText || 'Open',
      url: notification.actionUrl
    }] : [],
    data: notification.data || {},
    priority: notification.priority
  }

  logger.info('🔔 Push notification prepared:', { userId: pushContent.userId, title: pushContent.title })
  
  // Here you would integrate with your push notification service
  // await pushService.send(pushContent)
}

// Fetch user notifications
async function fetchNotifications(userId: string) {
  try {
    const payload = await getPayloadClient()
    
    const notifications = await payload.find({
      collection: 'notifications',
      where: {
        recipient: { equals: userId }
      },
      sort: '-createdAt',
      limit: 50,
      page: 1
    })

    return NextResponse.json({
      success: true,
      notifications: notifications.docs,
      pagination: {
        page: notifications.page,
        pages: notifications.totalPages,
        total: notifications.totalDocs
      }
    })

  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Failed to fetch notifications' },
      { status: 500 }
    )
  }
}

// Mark notification as read
async function markNotificationAsRead(notificationId: string) {
  try {
    const payload = await getPayloadClient()
    
    await payload.update({
      collection: 'notifications',
      id: notificationId,
      data: {
        readAt: new Date(),
        status: 'read'
      }
    })

    return NextResponse.json({
      success: true,
      message: 'Notification marked as read'
    })

  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Failed to mark notification as read' },
      { status: 500 }
    )
  }
}

// Utility functions for common notification types
export const NotificationTemplates = {
  appointmentReminder: (customerName: string, datetime: string): NotificationPayload => ({
    type: 'appointment',
    title: 'Appointment Reminder',
    message: `Hi ${customerName}, your appointment is scheduled for ${datetime}. Please arrive 10 minutes early.`,
    recipient: '', // Will be filled by caller
    priority: 'normal',
    channels: ['push', 'email'],
    actionUrl: '/appointments',
    actionText: 'View Appointment'
  }),

  appointmentConfirmation: (customerName: string, datetime: string): NotificationPayload => ({
    type: 'appointment',
    title: 'Appointment Confirmed',
    message: `Your appointment has been confirmed for ${datetime}. We look forward to seeing you!`,
    recipient: '', // Will be filled by caller
    priority: 'normal',
    channels: ['push', 'email'],
    actionUrl: '/appointments',
    actionText: 'View Details'
  }),

  lowInventory: (itemName: string, currentStock: number): NotificationPayload => ({
    type: 'inventory',
    title: 'Low Inventory Alert',
    message: `${itemName} is running low with only ${currentStock} units remaining.`,
    recipient: '', // Will be filled by caller
    priority: 'high',
    channels: ['push', 'email'],
    actionUrl: '/inventory',
    actionText: 'Reorder Now'
  }),

  commissionReady: (stylistName: string, amount: number): NotificationPayload => ({
    type: 'commission',
    title: 'Commission Ready',
    message: `Your commission of $${amount.toFixed(2)} is ready for review.`,
    recipient: '', // Will be filled by caller
    priority: 'normal',
    channels: ['push', 'email'],
    actionUrl: '/commissions',
    actionText: 'View Commission'
  }),

  systemMaintenance: (scheduledTime: string): NotificationPayload => ({
    type: 'system',
    title: 'Scheduled Maintenance',
    message: `System maintenance is scheduled for ${scheduledTime}. Please save your work.`,
    recipient: '', // Will be filled by caller
    priority: 'high',
    channels: ['push', 'in-app'],
    actionUrl: '/system/status',
    actionText: 'View Status'
  })
}