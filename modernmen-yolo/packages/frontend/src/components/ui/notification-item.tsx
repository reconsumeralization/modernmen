// =============================================================================
// NOTIFICATION ITEM - Individual notification component
// =============================================================================

"use client"

import React from "react"
import { formatDistanceToNow } from "date-fns"
import { X, AlertCircle, Info, CheckCircle } from "lucide-react"
import { Button } from "./button"
import { cn } from "@/lib/utils"
import { Notification, NotificationItemProps, notificationIcons, notificationColors } from "./notification-types"

const iconComponents = {
  info: Info,
  success: CheckCircle,
  warning: AlertCircle,
  error: AlertCircle,
}

export function NotificationItem({
  notification,
  onClick,
  onMarkAsRead,
  onDelete,
  onAction,
}: NotificationItemProps) {
  const Icon = iconComponents[notification.type]

  const handleNotificationClick = () => {
    if (!notification.read && onMarkAsRead) {
      onMarkAsRead(notification.id)
    }

    if (notification.actionUrl && onAction) {
      onAction(notification)
    }

    onClick?.(notification)
  }

  const handleActionClick = (e: React.MouseEvent) => {
    e.stopPropagation()
    onAction?.(notification)
  }

  const handleDeleteClick = (e: React.MouseEvent) => {
    e.stopPropagation()
    onDelete?.(notification.id)
  }

  return (
    <div
      className={cn(
        "group p-4 hover:bg-muted/50 cursor-pointer transition-colors border-b border-border/50 last:border-b-0",
        !notification.read && "bg-blue-50/30 dark:bg-blue-950/20"
      )}
      onClick={handleNotificationClick}
    >
      <div className="flex items-start gap-3">
        <div className="flex-shrink-0 mt-0.5">
          <Icon className={cn("h-5 w-5", notificationColors[notification.type])} />
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between mb-1">
            <h5 className="text-sm font-medium truncate">
              {notification.title}
            </h5>
            {!notification.read && (
              <div className="w-2 h-2 bg-blue-500 rounded-full flex-shrink-0" />
            )}
          </div>

          <p className="text-sm text-muted-foreground mb-2 line-clamp-2">
            {notification.message}
          </p>

          <div className="flex items-center justify-between">
            <span className="text-xs text-muted-foreground">
              {formatDistanceToNow(notification.timestamp, { addSuffix: true })}
            </span>

            {notification.actionLabel && (
              <Button
                variant="ghost"
                size="sm"
                className="h-6 px-2 text-xs opacity-0 group-hover:opacity-100 transition-opacity"
                onClick={handleActionClick}
              >
                {notification.actionLabel}
              </Button>
            )}
          </div>
        </div>

        <Button
          variant="ghost"
          size="icon"
          className="h-6 w-6 flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity"
          onClick={handleDeleteClick}
        >
          <X className="h-3 w-3" />
        </Button>
      </div>
    </div>
  )
}
