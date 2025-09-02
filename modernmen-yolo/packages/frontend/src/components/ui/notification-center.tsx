import * as React from "react"
import { Bell, X } from "lucide-react"
import { Button } from "./button"
import { ScrollArea } from "./scroll-area"
import { Badge } from "./badge"
import { cn } from "../../lib/utils"

interface NotificationItem {
  id: string
  title: string
  message: string
  type: "info" | "success" | "warning" | "error"
  read: boolean
  timestamp: Date
}

interface NotificationCenterProps {
  notifications: NotificationItem[]
  onMarkAsRead?: (id: string) => void
  onMarkAllAsRead?: () => void
  onNotificationClick?: (notification: NotificationItem) => void
  onClose?: () => void
  className?: string
}

export function NotificationCenter({
  notifications,
  onMarkAsRead,
  onMarkAllAsRead,
  onNotificationClick,
  onClose,
  className,
}: NotificationCenterProps) {
  const unreadCount = notifications.filter(n => !n.read).length

  return (
    <div className={cn("w-80 rounded-lg border bg-background shadow-lg", className)}>
      <div className="flex items-center justify-between p-4 border-b">
        <div className="flex items-center gap-2">
          <Bell className="h-5 w-5" />
          <h3 className="font-semibold">Notifications</h3>
          {unreadCount > 0 && (
            <Badge variant="destructive" className="ml-1">
              {unreadCount}
            </Badge>
          )}
        </div>
        <div className="flex items-center gap-2">
          {unreadCount > 0 && onMarkAllAsRead && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onMarkAllAsRead}
              className="text-xs"
            >
              Mark all read
            </Button>
          )}
          {onClose && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="h-8 w-8 p-0"
            >
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>
      </div>

      <ScrollArea className="h-96">
        {notifications.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <Bell className="h-12 w-12 text-muted-foreground mb-4" />
            <p className="text-sm text-muted-foreground">No notifications</p>
          </div>
        ) : (
          <div className="divide-y">
            {notifications.map((notification) => (
              <NotificationItem
                key={notification.id}
                notification={notification}
                onMarkAsRead={onMarkAsRead}
                onClick={onNotificationClick}
              />
            ))}
          </div>
        )}
      </ScrollArea>
    </div>
  )
}

interface NotificationItemProps {
  notification: NotificationItem
  onMarkAsRead?: (id: string) => void
  onClick?: (notification: NotificationItem) => void
}

function NotificationItem({
  notification,
  onMarkAsRead,
  onClick
}: NotificationItemProps) {
  const handleClick = () => {
    if (!notification.read && onMarkAsRead) {
      onMarkAsRead(notification.id)
    }
    if (onClick) {
      onClick(notification)
    }
  }

  return (
    <div
      className={cn(
        "p-4 cursor-pointer hover:bg-muted/50 transition-colors",
        !notification.read && "bg-blue-50 dark:bg-blue-950/20"
      )}
      onClick={handleClick}
    >
      <div className="flex items-start justify-between gap-2">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <h4 className={cn(
              "text-sm font-medium truncate",
              !notification.read && "font-semibold"
            )}>
              {notification.title}
            </h4>
            {!notification.read && (
              <div className="w-2 h-2 bg-blue-500 rounded-full flex-shrink-0" />
            )}
          </div>
          <p className="text-sm text-muted-foreground line-clamp-2">
            {notification.message}
          </p>
          <p className="text-xs text-muted-foreground mt-1">
            {notification.timestamp.toLocaleDateString()}
          </p>
        </div>
        <Badge
          variant={
            notification.type === "error" ? "destructive" :
            notification.type === "warning" ? "secondary" :
            notification.type === "success" ? "default" : "outline"
          }
          className="text-xs"
        >
          {notification.type}
        </Badge>
      </div>
    </div>
  )
}