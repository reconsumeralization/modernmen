// Notification types and interfaces

export type NotificationType = "info" | "success" | "warning" | "error"

export interface NotificationItem {
  id: string
  title: string
  message: string
  type: NotificationType
  read: boolean
  timestamp: Date
  actions?: Array<{
    label: string
    onClick: () => void
    variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link"
  }>
  metadata?: Record<string, any>
}

export interface NotificationGroup {
  id: string
  title: string
  notifications: NotificationItem[]
  unreadCount: number
}

export interface NotificationPreferences {
  email: boolean
  push: boolean
  inApp: boolean
  types: {
    info: boolean
    success: boolean
    warning: boolean
    error: boolean
  }
}

export interface NotificationSettings {
  enabled: boolean
  preferences: NotificationPreferences
  quietHours: {
    enabled: boolean
    start: string // HH:MM format
    end: string // HH:MM format
  }
}

// Utility functions for notifications
export function createNotification(
  title: string,
  message: string,
  type: NotificationType = "info",
  actions?: NotificationItem["actions"]
): Omit<NotificationItem, "id" | "read" | "timestamp"> {
  return {
    title,
    message,
    type,
    actions,
  }
}

export function getNotificationTypeColor(type: NotificationType): string {
  switch (type) {
    case "error":
      return "destructive"
    case "warning":
      return "secondary"
    case "success":
      return "default"
    case "info":
    default:
      return "outline"
  }
}

export function formatNotificationTime(timestamp: Date): string {
  const now = new Date()
  const diff = now.getTime() - timestamp.getTime()
  const minutes = Math.floor(diff / (1000 * 60))
  const hours = Math.floor(diff / (1000 * 60 * 60))
  const days = Math.floor(diff / (1000 * 60 * 60 * 24))

  if (minutes < 1) return "Just now"
  if (minutes < 60) return `${minutes}m ago`
  if (hours < 24) return `${hours}h ago`
  if (days < 7) return `${days}d ago`

  return timestamp.toLocaleDateString()
}