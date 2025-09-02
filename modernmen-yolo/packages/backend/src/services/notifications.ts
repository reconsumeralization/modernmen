// =============================================================================
// NOTIFICATIONS SERVICE - Handles notification-related data operations
// =============================================================================

import { NotificationItem, ApiResponse } from '@/types'
import { mockNotifications } from '@/data'
import { NOTIFICATION_TYPES } from '@/constants'

export class NotificationsService {
  private baseUrl: string

  constructor(baseUrl: string = '/api/notifications') {
    this.baseUrl = baseUrl
  }

  // Get all notifications
  async getNotifications(
    filters?: {
      type?: typeof NOTIFICATION_TYPES[keyof typeof NOTIFICATION_TYPES]
      read?: boolean
      limit?: number
    }
  ): Promise<ApiResponse<NotificationItem[]>> {
    try {
      let filteredNotifications = [...mockNotifications]

      if (filters?.type) {
        filteredNotifications = filteredNotifications.filter(
          notification => notification.type === filters.type
        )
      }

      if (filters?.read !== undefined) {
        filteredNotifications = filteredNotifications.filter(
          notification => notification.read === filters.read
        )
      }

      if (filters?.limit) {
        filteredNotifications = filteredNotifications.slice(0, filters.limit)
      }

      // Sort by timestamp (most recent first)
      filteredNotifications.sort((a, b) =>
        new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
      )

      return {
        success: true,
        data: filteredNotifications
      }
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to fetch notifications'
      }
    }
  }

  // Get a single notification by ID
  async getNotificationById(id: string): Promise<ApiResponse<NotificationItem>> {
    try {
      const notification = mockNotifications.find(n => n.id === id)

      if (!notification) {
        return {
          success: false,
          error: 'Notification not found'
        }
      }

      return {
        success: true,
        data: notification
      }
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to fetch notification'
      }
    }
  }

  // Mark notification as read
  async markAsRead(id: string): Promise<ApiResponse<NotificationItem>> {
    try {
      const notificationIndex = mockNotifications.findIndex(n => n.id === id)

      if (notificationIndex === -1) {
        return {
          success: false,
          error: 'Notification not found'
        }
      }

      const updatedNotification = {
        ...mockNotifications[notificationIndex],
        read: true
      }

      mockNotifications[notificationIndex] = updatedNotification

      return {
        success: true,
        data: updatedNotification
      }
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to mark notification as read'
      }
    }
  }

  // Mark all notifications as read
  async markAllAsRead(): Promise<ApiResponse<boolean>> {
    try {
      mockNotifications.forEach(notification => {
        notification.read = true
      })

      return {
        success: true,
        data: true
      }
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to mark all notifications as read'
      }
    }
  }

  // Create a new notification
  async createNotification(
    notificationData: Omit<NotificationItem, 'id' | 'timestamp'>
  ): Promise<ApiResponse<NotificationItem>> {
    try {
      const newNotification: NotificationItem = {
        id: Date.now().toString(),
        timestamp: new Date(),
        title: notificationData.title,
        message: notificationData.message,
        type: notificationData.type as 'info' | 'success' | 'warning' | 'error',
        read: notificationData.read || false
      }

      mockNotifications.unshift(newNotification as any) // Add to beginning of array

      return {
        success: true,
        data: newNotification
      }
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to create notification'
      }
    }
  }

  // Delete a notification
  async deleteNotification(id: string): Promise<ApiResponse<boolean>> {
    try {
      const notificationIndex = mockNotifications.findIndex(n => n.id === id)

      if (notificationIndex === -1) {
        return {
          success: false,
          error: 'Notification not found'
        }
      }

      mockNotifications.splice(notificationIndex, 1)

      return {
        success: true,
        data: true
      }
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to delete notification'
      }
    }
  }

  // Get notification count by type
  async getNotificationCount(): Promise<ApiResponse<{
    total: number
    unread: number
    byType: Record<string, number>
  }>> {
    try {
      const total = mockNotifications.length
      const unread = mockNotifications.filter(n => !n.read).length

      const byType = mockNotifications.reduce((acc, notification) => {
        acc[notification.type] = (acc[notification.type] || 0) + 1
        return acc
      }, {} as Record<string, number>)

      return {
        success: true,
        data: {
          total,
          unread,
          byType
        }
      }
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to get notification count'
      }
    }
  }
}

// Export a singleton instance
export const notificationsService = new NotificationsService()

// Export factory function for custom configuration
export const createNotificationsService = (baseUrl?: string) => {
  return new NotificationsService(baseUrl)
}
