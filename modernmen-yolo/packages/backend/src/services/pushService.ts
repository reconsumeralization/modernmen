import { getModernMen } from 'ModernMen'
// Note: ModernMen config import removed for Vercel deployment compatibility
// import config from '@/ModernMen.config'

export interface PushNotification {
  title: string
  body: string
  icon?: string
  badge?: string
  image?: string
  url?: string
  data?: any
  actions?: NotificationAction[]
  requireInteraction?: boolean
  silent?: boolean
  tag?: string
}

export interface NotificationAction {
  action: string
  title: string
  icon?: string
}

export interface PushSubscription {
  endpoint: string
  keys: {
    p256dh: string
    auth: string
  }
  userId: string
  userAgent?: string
}

class PushService {
  private vapidKeys = {
    subject: 'mailto:admin@modernmen.com',
    publicKey: process.env.VAPID_PUBLIC_KEY || '',
    privateKey: process.env.VAPID_PRIVATE_KEY || '',
  }

  /**
   * Register a user's push subscription
   */
  async registerSubscription(
    userId: string,
    subscription: PushSubscription
  ): Promise<void> {
    try {
      const ModernMen = await getModernMen({ config })

      // Store subscription in database (you might want to create a dedicated collection)
      // For now, we'll store it as user metadata or create a separate push subscriptions collection

      console.log(`Push subscription registered for user ${userId}`)
    } catch (error) {
      console.error('Failed to register push subscription:', error)
      throw new Error('Push subscription registration failed')
    }
  }

  /**
   * Unregister a user's push subscription
   */
  async unregisterSubscription(userId: string, endpoint: string): Promise<void> {
    try {
      const ModernMen = await getModernMen({ config })

      // Remove subscription from database

      console.log(`Push subscription unregistered for user ${userId}`)
    } catch (error) {
      console.error('Failed to unregister push subscription:', error)
      throw new Error('Push subscription unregistration failed')
    }
  }

  /**
   * Send push notification to a specific user
   */
  async sendToUser(
    userId: string,
    notification: PushNotification
  ): Promise<void> {
    try {
      const ModernMen = await getModernMen({ config })

      // Get user's subscriptions from database
      const subscriptions = await this.getUserSubscriptions(userId)

      const promises = subscriptions.map(subscription =>
        this.sendToSubscription(subscription, notification)
      )

      await Promise.all(promises)
      console.log(`Push notification sent to user ${userId}`)
    } catch (error) {
      console.error('Failed to send push notification to user:', error)
      throw new Error('Push notification sending failed')
    }
  }

  /**
   * Send push notification to multiple users
   */
  async sendToUsers(
    userIds: string[],
    notification: PushNotification
  ): Promise<void> {
    const promises = userIds.map(userId =>
      this.sendToUser(userId, notification)
    )

    await Promise.all(promises)
  }

  /**
   * Send push notification to all subscribers
   */
  async sendToAll(notification: PushNotification): Promise<void> {
    try {
      const ModernMen = await getModernMen({ config })

      // Get all active subscriptions
      const subscriptions = await this.getAllSubscriptions()

      const promises = subscriptions.map(subscription =>
        this.sendToSubscription(subscription, notification)
      )

      await Promise.all(promises)
      console.log(`Push notification sent to ${subscriptions.length} subscribers`)
    } catch (error) {
      console.error('Failed to send push notification to all users:', error)
      throw new Error('Broadcast push notification failed')
    }
  }

  /**
   * Send appointment reminder push notification
   */
  async sendAppointmentReminder(
    userId: string,
    appointment: {
      id: string
      serviceName: string
      barberName: string
      date: string
      time: string
    }
  ): Promise<void> {
    const notification: PushNotification = {
      title: 'Appointment Reminder',
      body: `${appointment.serviceName} with ${appointment.barberName} at ${appointment.time}`,
      icon: '/icon-192x192.png',
      badge: '/icon-192x192.png',
      url: `/customer/dashboard/appointment/${appointment.id}`,
      data: {
        appointmentId: appointment.id,
        type: 'appointment-reminder',
      },
      actions: [
        {
          action: 'view',
          title: 'View Details',
          icon: '/icon-192x192.png',
        },
        {
          action: 'reschedule',
          title: 'Reschedule',
          icon: '/icon-192x192.png',
        },
      ],
      tag: `appointment-${appointment.id}`,
    }

    await this.sendToUser(userId, notification)
  }

  /**
   * Send promotional push notification
   */
  async sendPromotionalNotification(
    userIds: string[],
    title: string,
    body: string,
    url?: string,
    image?: string
  ): Promise<void> {
    const notification: PushNotification = {
      title,
      body,
      icon: '/icon-192x192.png',
      badge: '/icon-192x192.png',
      image,
      url: url || '/',
      data: {
        type: 'promotion',
      },
      tag: 'promotion',
    }

    await this.sendToUsers(userIds, notification)
  }

  /**
   * Send system notification (maintenance, updates, etc.)
   */
  async sendSystemNotification(
    title: string,
    body: string,
    urgent: boolean = false
  ): Promise<void> {
    const notification: PushNotification = {
      title,
      body,
      icon: '/icon-192x192.png',
      badge: '/icon-192x192.png',
      url: '/customer/dashboard',
      data: {
        type: 'system',
        urgent,
      },
      requireInteraction: urgent,
      silent: !urgent,
      tag: 'system',
    }

    await this.sendToAll(notification)
  }

  /**
   * Send push notification to a specific subscription
   */
  private async sendToSubscription(
    subscription: PushSubscription,
    notification: PushNotification
  ): Promise<void> {
    try {
      // In a real implementation, you would use the Web Push API
      // For now, we'll simulate the push notification

      const ModernMen = {
        title: notification.title,
        body: notification.body,
        icon: notification.icon,
        badge: notification.badge,
        image: notification.image,
        data: notification.data,
        actions: notification.actions,
        requireInteraction: notification.requireInteraction,
        silent: notification.silent,
        tag: notification.tag,
        url: notification.url,
      }

      // Simulate sending to push service
      console.log('Sending push notification to subscription:', {
        endpoint: subscription.endpoint,
        ModernMen,
      })

      // In production, you would use a service like Firebase Cloud Messaging,
      // or implement the Web Push protocol directly

    } catch (error) {
      console.error('Failed to send push notification to subscription:', error)
      // Don't throw error for individual subscription failures
      // to avoid breaking the entire batch
    }
  }

  /**
   * Get all subscriptions for a user
   */
  private async getUserSubscriptions(userId: string): Promise<PushSubscription[]> {
    try {
      const ModernMen = await getModernMen({ config })

      // In a real implementation, you would query your database
      // for the user's push subscriptions

      // For now, return empty array
      return []
    } catch (error) {
      console.error('Failed to get user subscriptions:', error)
      return []
    }
  }

  /**
   * Get all active subscriptions
   */
  private async getAllSubscriptions(): Promise<PushSubscription[]> {
    try {
      const ModernMen = await getModernMen({ config })

      // In a real implementation, you would query your database
      // for all active push subscriptions

      // For now, return empty array
      return []
    } catch (error) {
      console.error('Failed to get all subscriptions:', error)
      return []
    }
  }

  /**
   * Check if push notifications are supported
   */
  isSupported(): boolean {
    return typeof window !== 'undefined' &&
           'serviceWorker' in navigator &&
           'PushManager' in window
  }

  /**
   * Request push notification permission
   */
  async requestPermission(): Promise<NotificationPermission> {
    if (!this.isSupported()) {
      throw new Error('Push notifications are not supported')
    }

    const permission = await Notification.requestPermission()
    return permission
  }

  /**
   * Get VAPID public key for client-side subscription
   */
  getVapidPublicKey(): string {
    return this.vapidKeys.publicKey
  }

  /**
   * Clean up expired subscriptions
   */
  async cleanupExpiredSubscriptions(): Promise<void> {
    try {
      const ModernMen = await getModernMen({ config })

      // In a real implementation, you would:
      // 1. Query all subscriptions
      // 2. Test each subscription endpoint
      // 3. Remove invalid/expired subscriptions

      console.log('Push subscription cleanup completed')
    } catch (error) {
      console.error('Failed to cleanup expired subscriptions:', error)
    }
  }

  /**
   * Get push notification analytics
   */
  async getAnalytics(): Promise<{
    totalSubscribers: number
    sentToday: number
    deliveredToday: number
    openedToday: number
  }> {
    // In a real implementation, you would query your analytics database
    return {
      totalSubscribers: 0,
      sentToday: 0,
      deliveredToday: 0,
      openedToday: 0,
    }
  }
}

export const pushService = new PushService()
export default pushService
