// =============================================================================
// NOTIFICATION TYPES - Type definitions for notifications
// =============================================================================

export interface Notification {
  id: string
  title: string
  message: string
  type: "info" | "success" | "warning" | "error"
  timestamp: Date
  read: boolean
  actionUrl?: string
  actionLabel?: string
}

export interface NotificationCenterProps {
  notifications: Notification[]
  onMarkAsRead?: (id: string) => void
  onMarkAllAsRead?: () => void
  onDelete?: (id: string) => void
  onAction?: (notification: Notification) => void
  className?: string
}

export interface NotificationItemProps {
  notification: Notification
  onClick?: (notification: Notification) => void
  onMarkAsRead?: (id: string) => void
  onDelete?: (id: string) => void
  onAction?: (notification: Notification) => void
}

// Notification icons and colors mapping
export const notificationIcons = {
  info: "Info",
  success: "CheckCircle",
  warning: "AlertCircle",
  error: "AlertCircle",
} as const

export const notificationColors = {
  info: "text-blue-500",
  success: "text-green-500",
  warning: "text-yellow-500",
  error: "text-red-500",
} as const

export type NotificationType = keyof typeof notificationIcons
