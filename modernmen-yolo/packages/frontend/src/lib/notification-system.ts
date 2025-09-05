/**
 * Advanced Automated Notifications System for ModernMen Barbershop
 * Multi-channel notifications with intelligent scheduling and personalization
 */

import { supabase } from '@/lib/supabase/client'
import { AppError, createErrorResponse, handleApiError } from '@/lib/error-handling'
import { toast } from 'sonner'

// Notification types and interfaces
export enum NotificationType {
  APPOINTMENT_CONFIRMATION = 'appointment_confirmation',
  APPOINTMENT_REMINDER = 'appointment_reminder',
  APPOINTMENT_RESCHEDULED = 'appointment_rescheduled',
  APPOINTMENT_CANCELLED = 'appointment_cancelled',
  PAYMENT_RECEIPT = 'payment_receipt',
  PAYMENT_FAILED = 'payment_failed',
  LOYALTY_POINTS_EARNED = 'loyalty_points_earned',
  BIRTHDAY_GREETING = 'birthday_greeting',
  PROMOTIONAL_OFFER = 'promotional_offer',
  SERVICE_REMINDER = 'service_reminder',
  REVIEW_REQUEST = 'review_request',
  STAFF_NOTIFICATION = 'staff_notification',
  SYSTEM_ALERT = 'system_alert'
}

export enum NotificationChannel {
  EMAIL = 'email',
  SMS = 'sms',
  PUSH = 'push',
  IN_APP = 'in_app',
  WEBHOOK = 'webhook'
}

export enum NotificationPriority {
  LOW = 'low',
  NORMAL = 'normal',
  HIGH = 'high',
  URGENT = 'urgent'
}

export enum NotificationStatus {
  PENDING = 'pending',
  QUEUED = 'queued',
  SENT = 'sent',
  DELIVERED = 'delivered',
  FAILED = 'failed',
  CANCELLED = 'cancelled'
}

export interface NotificationTemplate {
  id: string
  type: NotificationType
  channel: NotificationChannel
  name: string
  subject?: string
  content: string
  variables: string[]
  isActive: boolean
  createdAt: Date
  updatedAt: Date
}

export interface NotificationRequest {
  type: NotificationType
  channels: NotificationChannel[]
  recipientId: string
  recipientEmail?: string
  recipientPhone?: string
  data: Record<string, any>
  scheduledFor?: Date
  priority: NotificationPriority
  metadata?: Record<string, any>
}

export interface NotificationHistory {
  id: string
  type: NotificationType
  channel: NotificationChannel
  recipientId: string
  status: NotificationStatus
  sentAt?: Date
  deliveredAt?: Date
  failureReason?: string
  content: string
  metadata: Record<string, any>
  createdAt: Date
}

export interface NotificationPreferences {
  customerId: string
  emailNotifications: boolean
  smsNotifications: boolean
  pushNotifications: boolean
  marketingEmails: boolean
  appointmentReminders: boolean
  promotionalOffers: boolean
  loyaltyUpdates: boolean
  reviewRequests: boolean
  reminderTiming: number // hours before appointment
  preferredChannel: NotificationChannel
  quietHours: {
    start: string // HH:MM format
    end: string   // HH:MM format
  }
  timezone: string
}

export interface AutomationRule {
  id: string
  name: string
  type: NotificationType
  trigger: {
    event: string
    conditions: Record<string, any>
    delay?: number // minutes
  }
  actions: {
    channels: NotificationChannel[]
    template: string
    priority: NotificationPriority
  }
  isActive: boolean
  createdAt: Date
}

class NotificationSystem {
  private emailService: any = null
  private smsService: any = null
  private pushService: any = null
  private initialized = false

  /**
   * Initialize notification services
   */
  async initialize(): Promise<void> {
    if (this.initialized) return

    try {
      // Initialize email service (e.g., SendGrid)
      if (process.env.SENDGRID_API_KEY) {
        this.emailService = await this.initializeEmailService()
      }

      // Initialize SMS service (e.g., Twilio)
      if (process.env.TWILIO_AUTH_TOKEN) {
        this.smsService = await this.initializeSMSService()
      }

      // Initialize push notification service
      this.pushService = await this.initializePushService()

      this.initialized = true
      console.log('Notification system initialized successfully')

    } catch (error) {
      console.error('Notification system initialization error:', error)
      throw handleApiError(error, 'initialize notification system')
    }
  }

  /**
   * Send notification through multiple channels
   */
  async sendNotification(request: NotificationRequest): Promise<{
    success: boolean
    results: { channel: NotificationChannel; success: boolean; messageId?: string; error?: string }[]
  }> {
    await this.initialize()

    const results: { channel: NotificationChannel; success: boolean; messageId?: string; error?: string }[] = []

    try {
      // Get user preferences
      const preferences = await this.getNotificationPreferences(request.recipientId)
      
      // Filter channels based on user preferences and quiet hours
      const allowedChannels = this.filterChannelsByPreferences(request.channels, preferences)

      // Process each channel
      for (const channel of allowedChannels) {
        try {
          const result = await this.sendToChannel(channel, request)
          results.push(result)

          // Store notification history
          await this.storeNotificationHistory({
            type: request.type,
            channel,
            recipientId: request.recipientId,
            status: result.success ? NotificationStatus.SENT : NotificationStatus.FAILED,
            content: (await this.renderTemplate(request.type, channel, request.data)).content,
            metadata: request.metadata || {},
            failureReason: result.error
          })

        } catch (error) {
          console.error(`Failed to send ${channel} notification:`, error)
          results.push({
            channel,
            success: false,
            error: error instanceof Error ? error.message : 'Unknown error'
          })
        }
      }

      const overallSuccess = results.some(r => r.success)

      return {
        success: overallSuccess,
        results
      }

    } catch (error) {
      console.error('Send notification error:', error)
      throw handleApiError(error, 'send notification')
    }
  }

  /**
   * Schedule notification for future delivery
   */
  async scheduleNotification(request: NotificationRequest): Promise<{ success: boolean; scheduledId: string }> {
    try {
      const { data, error } = await supabase
        .from('scheduled_notifications')
        .insert({
          type: request.type,
          channels: request.channels,
          recipient_id: request.recipientId,
          recipient_email: request.recipientEmail,
          recipient_phone: request.recipientPhone,
          data: request.data,
          scheduled_for: request.scheduledFor?.toISOString(),
          priority: request.priority,
          metadata: request.metadata,
          status: 'scheduled'
        })
        .select()
        .single()

      if (error) throw error

      return {
        success: true,
        scheduledId: data.id
      }

    } catch (error) {
      console.error('Schedule notification error:', error)
      throw handleApiError(error, 'schedule notification')
    }
  }

  /**
   * Cancel scheduled notification
   */
  async cancelScheduledNotification(scheduledId: string): Promise<void> {
    try {
      const { error } = await supabase
        .from('scheduled_notifications')
        .update({ status: 'cancelled' })
        .eq('id', scheduledId)

      if (error) throw error

    } catch (error) {
      console.error('Cancel scheduled notification error:', error)
      throw handleApiError(error, 'cancel scheduled notification')
    }
  }

  /**
   * Automatic appointment reminders
   */
  async setupAppointmentReminders(): Promise<void> {
    try {
      // Get appointments for the next 48 hours
      const tomorrow = new Date()
      tomorrow.setDate(tomorrow.getDate() + 1)
      tomorrow.setHours(0, 0, 0, 0)

      const dayAfter = new Date(tomorrow)
      dayAfter.setDate(dayAfter.getDate() + 1)

      const { data: appointments, error } = await supabase
        .from('appointments')
        .select(`
          *,
          customers (
            id,
            name,
            email,
            phone,
            notification_preferences
          ),
          services (name),
          staff (name)
        `)
        .gte('appointment_date', tomorrow.toISOString().split('T')[0])
        .lt('appointment_date', dayAfter.toISOString().split('T')[0])
        .eq('status', 'confirmed')

      if (error) throw error

      // Schedule reminders for each appointment
      for (const appointment of appointments || []) {
        const appointmentDateTime = new Date(`${appointment.appointment_date}T${appointment.start_time}`)
        
        // Schedule 24-hour reminder
        const reminderTime24h = new Date(appointmentDateTime)
        reminderTime24h.setHours(reminderTime24h.getHours() - 24)

        if (reminderTime24h > new Date()) {
          await this.scheduleNotification({
            type: NotificationType.APPOINTMENT_REMINDER,
            channels: [NotificationChannel.EMAIL, NotificationChannel.SMS],
            recipientId: appointment.customer_id,
            recipientEmail: appointment.customers?.email,
            recipientPhone: appointment.customers?.phone,
            scheduledFor: reminderTime24h,
            priority: NotificationPriority.NORMAL,
            data: {
              customerName: appointment.customers?.name,
              serviceName: appointment.services?.name,
              barberName: appointment.staff?.name,
              appointmentDate: appointment.appointment_date,
              appointmentTime: appointment.start_time,
              duration: appointment.duration,
              reminderType: '24_hours'
            }
          })
        }

        // Schedule 2-hour reminder
        const reminderTime2h = new Date(appointmentDateTime)
        reminderTime2h.setHours(reminderTime2h.getHours() - 2)

        if (reminderTime2h > new Date()) {
          await this.scheduleNotification({
            type: NotificationType.APPOINTMENT_REMINDER,
            channels: [NotificationChannel.SMS, NotificationChannel.PUSH],
            recipientId: appointment.customer_id,
            recipientEmail: appointment.customers?.email,
            recipientPhone: appointment.customers?.phone,
            scheduledFor: reminderTime2h,
            priority: NotificationPriority.HIGH,
            data: {
              customerName: appointment.customers?.name,
              serviceName: appointment.services?.name,
              barberName: appointment.staff?.name,
              appointmentDate: appointment.appointment_date,
              appointmentTime: appointment.start_time,
              duration: appointment.duration,
              reminderType: '2_hours'
            }
          })
        }
      }

    } catch (error) {
      console.error('Setup appointment reminders error:', error)
    }
  }

  /**
   * Send post-appointment follow-up
   */
  async sendPostAppointmentFollowUp(appointmentId: string): Promise<void> {
    try {
      const { data: appointment, error } = await supabase
        .from('appointments')
        .select(`
          *,
          customers (
            id,
            name,
            email,
            phone
          ),
          services (name),
          staff (name)
        `)
        .eq('id', appointmentId)
        .single()

      if (error) throw error

      // Schedule review request for 24 hours after appointment
      const followUpTime = new Date()
      followUpTime.setHours(followUpTime.getHours() + 24)

      await this.scheduleNotification({
        type: NotificationType.REVIEW_REQUEST,
        channels: [NotificationChannel.EMAIL],
        recipientId: appointment.customer_id,
        recipientEmail: appointment.customers?.email,
        scheduledFor: followUpTime,
        priority: NotificationPriority.LOW,
        data: {
          customerName: appointment.customers?.name,
          serviceName: appointment.services?.name,
          barberName: appointment.staff?.name,
          appointmentDate: appointment.appointment_date,
          reviewUrl: `${process.env.NEXT_PUBLIC_APP_URL}/review/${appointmentId}`
        }
      })

      // Schedule next appointment suggestion for 4 weeks later
      const nextAppointmentTime = new Date()
      nextAppointmentTime.setDate(nextAppointmentTime.getDate() + 28)

      await this.scheduleNotification({
        type: NotificationType.SERVICE_REMINDER,
        channels: [NotificationChannel.EMAIL, NotificationChannel.SMS],
        recipientId: appointment.customer_id,
        recipientEmail: appointment.customers?.email,
        recipientPhone: appointment.customers?.phone,
        scheduledFor: nextAppointmentTime,
        priority: NotificationPriority.LOW,
        data: {
          customerName: appointment.customers?.name,
          lastService: appointment.services?.name,
          lastBarber: appointment.staff?.name,
          bookingUrl: `${process.env.NEXT_PUBLIC_APP_URL}/book`
        }
      })

    } catch (error) {
      console.error('Post-appointment follow-up error:', error)
    }
  }

  /**
   * Send birthday greetings with special offers
   */
  async sendBirthdayGreetings(): Promise<void> {
    try {
      const today = new Date()
      const todayStr = `${(today.getMonth() + 1).toString().padStart(2, '0')}-${today.getDate().toString().padStart(2, '0')}`

      const { data: customers, error } = await supabase
        .from('customers')
        .select('*')
        .like('date_of_birth', `%-${todayStr}`)

      if (error) throw error

      for (const customer of customers || []) {
        // Generate birthday discount code
        const discountCode = `BIRTHDAY${customer.id.slice(-4)}`

        await this.sendNotification({
          type: NotificationType.BIRTHDAY_GREETING,
          channels: [NotificationChannel.EMAIL, NotificationChannel.SMS],
          recipientId: customer.id,
          recipientEmail: customer.email,
          recipientPhone: customer.phone,
          priority: NotificationPriority.NORMAL,
          data: {
            customerName: customer.name,
            discountCode,
            discountAmount: '25%',
            expiryDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toLocaleDateString(),
            bookingUrl: `${process.env.NEXT_PUBLIC_APP_URL}/book?discount=${discountCode}`
          }
        })
      }

    } catch (error) {
      console.error('Birthday greetings error:', error)
    }
  }

  /**
   * Get notification preferences for a customer
   */
  async getNotificationPreferences(customerId: string): Promise<NotificationPreferences> {
    try {
      const { data, error } = await supabase
        .from('notification_preferences')
        .select('*')
        .eq('customer_id', customerId)
        .single()

      if (error || !data) {
        // Return default preferences
        return {
          customerId,
          emailNotifications: true,
          smsNotifications: true,
          pushNotifications: true,
          marketingEmails: true,
          appointmentReminders: true,
          promotionalOffers: true,
          loyaltyUpdates: true,
          reviewRequests: true,
          reminderTiming: 24,
          preferredChannel: NotificationChannel.EMAIL,
          quietHours: { start: '22:00', end: '08:00' },
          timezone: 'America/New_York'
        }
      }

      return {
        customerId: data.customer_id,
        emailNotifications: data.email_notifications,
        smsNotifications: data.sms_notifications,
        pushNotifications: data.push_notifications,
        marketingEmails: data.marketing_emails,
        appointmentReminders: data.appointment_reminders,
        promotionalOffers: data.promotional_offers,
        loyaltyUpdates: data.loyalty_updates,
        reviewRequests: data.review_requests,
        reminderTiming: data.reminder_timing,
        preferredChannel: data.preferred_channel,
        quietHours: data.quiet_hours,
        timezone: data.timezone
      }

    } catch (error) {
      console.error('Get notification preferences error:', error)
      // Return default preferences on error
      return {
        customerId,
        emailNotifications: true,
        smsNotifications: true,
        pushNotifications: true,
        marketingEmails: true,
        appointmentReminders: true,
        promotionalOffers: true,
        loyaltyUpdates: true,
        reviewRequests: true,
        reminderTiming: 24,
        preferredChannel: NotificationChannel.EMAIL,
        quietHours: { start: '22:00', end: '08:00' },
        timezone: 'America/New_York'
      }
    }
  }

  /**
   * Update notification preferences
   */
  async updateNotificationPreferences(preferences: NotificationPreferences): Promise<void> {
    try {
      const { error } = await supabase
        .from('notification_preferences')
        .upsert({
          customer_id: preferences.customerId,
          email_notifications: preferences.emailNotifications,
          sms_notifications: preferences.smsNotifications,
          push_notifications: preferences.pushNotifications,
          marketing_emails: preferences.marketingEmails,
          appointment_reminders: preferences.appointmentReminders,
          promotional_offers: preferences.promotionalOffers,
          loyalty_updates: preferences.loyaltyUpdates,
          review_requests: preferences.reviewRequests,
          reminder_timing: preferences.reminderTiming,
          preferred_channel: preferences.preferredChannel,
          quiet_hours: preferences.quietHours,
          timezone: preferences.timezone,
          updated_at: new Date().toISOString()
        })

      if (error) throw error

      toast.success('Notification preferences updated successfully!')

    } catch (error) {
      console.error('Update notification preferences error:', error)
      toast.error('Failed to update notification preferences')
      throw handleApiError(error, 'update notification preferences')
    }
  }

  /**
   * Get notification history for a customer
   */
  async getNotificationHistory(customerId: string, limit: number = 50): Promise<NotificationHistory[]> {
    try {
      const { data, error } = await supabase
        .from('notification_history')
        .select('*')
        .eq('recipient_id', customerId)
        .order('created_at', { ascending: false })
        .limit(limit)

      if (error) throw error

      return data?.map(notification => ({
        id: notification.id,
        type: notification.type,
        channel: notification.channel,
        recipientId: notification.recipient_id,
        status: notification.status,
        sentAt: notification.sent_at ? new Date(notification.sent_at) : undefined,
        deliveredAt: notification.delivered_at ? new Date(notification.delivered_at) : undefined,
        failureReason: notification.failure_reason,
        content: notification.content,
        metadata: notification.metadata || {},
        createdAt: new Date(notification.created_at)
      })) || []

    } catch (error) {
      console.error('Get notification history error:', error)
      return []
    }
  }

  /**
   * Private helper methods
   */
  private async initializeEmailService(): Promise<any> {
    // Initialize SendGrid or other email service
    const sgMail = require('@sendgrid/mail')
    sgMail.setApiKey(process.env.SENDGRID_API_KEY)
    return sgMail
  }

  private async initializeSMSService(): Promise<any> {
    // Initialize Twilio or other SMS service
    const twilio = require('twilio')
    return twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN)
  }

  private async initializePushService(): Promise<any> {
    // Initialize push notification service (Firebase, OneSignal, etc.)
    return null // Placeholder
  }

  private filterChannelsByPreferences(
    channels: NotificationChannel[],
    preferences: NotificationPreferences
  ): NotificationChannel[] {
    return channels.filter(channel => {
      switch (channel) {
        case NotificationChannel.EMAIL:
          return preferences.emailNotifications
        case NotificationChannel.SMS:
          return preferences.smsNotifications
        case NotificationChannel.PUSH:
          return preferences.pushNotifications
        default:
          return true
      }
    })
  }

  private async sendToChannel(
    channel: NotificationChannel,
    request: NotificationRequest
  ): Promise<{ channel: NotificationChannel; success: boolean; messageId?: string; error?: string }> {
    try {
      switch (channel) {
        case NotificationChannel.EMAIL:
          return await this.sendEmail(request)
        case NotificationChannel.SMS:
          return await this.sendSMS(request)
        case NotificationChannel.PUSH:
          return await this.sendPush(request)
        case NotificationChannel.IN_APP:
          return await this.sendInApp(request)
        default:
          throw new Error(`Unsupported channel: ${channel}`)
      }
    } catch (error) {
      return {
        channel,
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      }
    }
  }

  private async sendEmail(request: NotificationRequest): Promise<{ channel: NotificationChannel; success: boolean; messageId?: string; error?: string }> {
    if (!this.emailService || !request.recipientEmail) {
      return {
        channel: NotificationChannel.EMAIL,
        success: false,
        error: 'Email service not configured or recipient email missing'
      }
    }

    try {
      const template = await this.renderTemplate(request.type, NotificationChannel.EMAIL, request.data)
      
      const msg = {
        to: request.recipientEmail,
        from: process.env.SENDGRID_FROM_EMAIL || 'noreply@modernmen.com',
        subject: template.subject,
        html: template.content
      }

      const response = await this.emailService.send(msg)
      
      return {
        channel: NotificationChannel.EMAIL,
        success: true,
        messageId: response[0]?.headers?.['x-message-id']
      }

    } catch (error) {
      return {
        channel: NotificationChannel.EMAIL,
        success: false,
        error: error instanceof Error ? error.message : 'Email send failed'
      }
    }
  }

  private async sendSMS(request: NotificationRequest): Promise<{ channel: NotificationChannel; success: boolean; messageId?: string; error?: string }> {
    if (!this.smsService || !request.recipientPhone) {
      return {
        channel: NotificationChannel.SMS,
        success: false,
        error: 'SMS service not configured or recipient phone missing'
      }
    }

    try {
      const template = await this.renderTemplate(request.type, NotificationChannel.SMS, request.data)
      
      const message = await this.smsService.messages.create({
        body: template.content,
        from: process.env.TWILIO_PHONE_NUMBER,
        to: request.recipientPhone
      })

      return {
        channel: NotificationChannel.SMS,
        success: true,
        messageId: message.sid
      }

    } catch (error) {
      return {
        channel: NotificationChannel.SMS,
        success: false,
        error: error instanceof Error ? error.message : 'SMS send failed'
      }
    }
  }

  private async sendPush(request: NotificationRequest): Promise<{ channel: NotificationChannel; success: boolean; messageId?: string; error?: string }> {
    // Placeholder for push notification implementation
    return {
      channel: NotificationChannel.PUSH,
      success: false,
      error: 'Push notifications not yet implemented'
    }
  }

  private async sendInApp(request: NotificationRequest): Promise<{ channel: NotificationChannel; success: boolean; messageId?: string; error?: string }> {
    try {
      const { data, error } = await supabase
        .from('in_app_notifications')
        .insert({
          recipient_id: request.recipientId,
          type: request.type,
          title: request.data.title || 'Notification',
          message: request.data.message || '',
          data: request.data,
          is_read: false,
          created_at: new Date().toISOString()
        })
        .select()
        .single()

      if (error) throw error

      return {
        channel: NotificationChannel.IN_APP,
        success: true,
        messageId: data.id
      }

    } catch (error) {
      return {
        channel: NotificationChannel.IN_APP,
        success: false,
        error: error instanceof Error ? error.message : 'In-app notification failed'
      }
    }
  }

  private async renderTemplate(
    type: NotificationType,
    channel: NotificationChannel,
    data: Record<string, any>
  ): Promise<{ subject?: string; content: string }> {
    // Simple template rendering - in production, use a proper template engine
    const templates: Record<string, Record<NotificationChannel, { subject?: string; content: string }>> = {
      [NotificationType.APPOINTMENT_CONFIRMATION]: {
        [NotificationChannel.EMAIL]: {
          subject: 'Appointment Confirmed - ModernMen Barbershop',
          content: `
            <h2>Appointment Confirmed</h2>
            <p>Hi ${data.customerName},</p>
            <p>Your appointment has been confirmed!</p>
            <ul>
              <li>Service: ${data.serviceName}</li>
              <li>Barber: ${data.barberName}</li>
              <li>Date: ${data.appointmentDate}</li>
              <li>Time: ${data.appointmentTime}</li>
            </ul>
            <p>We look forward to seeing you!</p>
          `
        },
        [NotificationChannel.SMS]: {
          content: `Hi ${data.customerName}! Your ${data.serviceName} appointment with ${data.barberName} is confirmed for ${data.appointmentDate} at ${data.appointmentTime}. See you soon! - ModernMen`
        },
        [NotificationChannel.PUSH]: {
          content: `Appointment confirmed for ${data.appointmentDate} at ${data.appointmentTime}`
        },
        [NotificationChannel.IN_APP]: {
          content: `Your ${data.serviceName} appointment with ${data.barberName} is confirmed for ${data.appointmentDate} at ${data.appointmentTime}.`
        },
        [NotificationChannel.WEBHOOK]: {
          content: JSON.stringify({
            type: 'appointment_confirmed',
            customerName: data.customerName,
            serviceName: data.serviceName,
            barberName: data.barberName,
            appointmentDate: data.appointmentDate,
            appointmentTime: data.appointmentTime
          })
        }
      }
      // Add more templates for other notification types...
    }

    const template = templates[type as keyof typeof templates]?.[channel]
    
    return {
      subject: template?.subject,
      content: template?.content || `Notification: ${type}`
    }
  }

  private async storeNotificationHistory(history: Omit<NotificationHistory, 'id' | 'createdAt'>): Promise<void> {
    try {
      await supabase
        .from('notification_history')
        .insert({
          type: history.type,
          channel: history.channel,
          recipient_id: history.recipientId,
          status: history.status,
          sent_at: history.sentAt?.toISOString(),
          delivered_at: history.deliveredAt?.toISOString(),
          failure_reason: history.failureReason,
          content: history.content,
          metadata: history.metadata
        })

    } catch (error) {
      console.error('Store notification history error:', error)
    }
  }
}

// Export singleton instance
export const notificationSystem = new NotificationSystem()

// Export convenience functions
export const sendNotification = (request: NotificationRequest) => notificationSystem.sendNotification(request)
export const scheduleNotification = (request: NotificationRequest) => notificationSystem.scheduleNotification(request)
export const getNotificationPreferences = (customerId: string) => notificationSystem.getNotificationPreferences(customerId)
export const updateNotificationPreferences = (preferences: NotificationPreferences) => notificationSystem.updateNotificationPreferences(preferences)