// =============================================================================
// USE NOTIFICATIONS HOOK - Notification state management
// =============================================================================

import { useState } from "react"
import { NotificationItem } from "@/components/ui/notification-types"

export function useNotifications() {
  const [notifications, setNotifications] = useState<NotificationItem[]>([])

  const addNotification = (notification: Omit<NotificationItem, "id" | "timestamp" | "read">) => {
    const newNotification: NotificationItem = {
      ...notification,
      id: Math.random().toString(36).substr(2, 9),
      timestamp: new Date(),
      read: false,
    }

    setNotifications(prev => [newNotification, ...prev])
  }

  const markAsRead = (id: string) => {
    setNotifications(prev =>
      prev.map(notification =>
        notification.id === id ? { ...notification, read: true } : notification
      )
    )
  }

  const markAllAsRead = () => {
    setNotifications(prev =>
      prev.map(notification => ({ ...notification, read: true }))
    )
  }

  const deleteNotification = (id: string) => {
    setNotifications(prev => prev.filter(notification => notification.id !== id))
  }

  const clearAll = () => {
    setNotifications([])
  }

  const getUnreadCount = () => {
    return notifications.filter(n => !n.read).length
  }

  const getNotificationsByType = (type: NotificationItem["type"]) => {
    return notifications.filter(n => n.type === type)
  }

  return {
    notifications,
    addNotification,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    clearAll,
    getUnreadCount,
    getNotificationsByType,
    unreadCount: getUnreadCount(),
  }
}
