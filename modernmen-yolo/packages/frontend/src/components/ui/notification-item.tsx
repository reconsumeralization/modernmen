import * as React from "react"
import { X, Check } from "lucide-react"
import { Button } from "./button"
import { Badge } from "./badge"
import { cn } from "../../lib/utils"

interface NotificationItem {
  id: string
  title: string
  message: string
  type: "info" | "success" | "warning" | "error"
  read: boolean
  timestamp: Date
  actions?: Array<{
    label: string
    onClick: () => void
    variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link"
  }>
}

interface NotificationItemProps {
  notification: NotificationItem
  onMarkAsRead?: (id: string) => void
  onClick?: (notification: NotificationItem) => void
  className?: string
}

export function NotificationItem({
  notification,
  onMarkAsRead,
  onClick,
  className,
}: NotificationItemProps) {
  const handleMarkAsRead = (e: React.MouseEvent) => {
    e.stopPropagation()
    if (onMarkAsRead) {
      onMarkAsRead(notification.id)
    }
  }

  const handleClick = () => {
    if (onClick) {
      onClick(notification)
    }
  }

  return (
    <div
      className={cn(
        "p-4 border-b last:border-b-0 cursor-pointer hover:bg-muted/50 transition-colors",
        !notification.read && "bg-blue-50 dark:bg-blue-950/20",
        className
      )}
      onClick={handleClick}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-2">
            <h4 className={cn(
              "text-sm font-medium truncate",
              !notification.read && "font-semibold"
            )}>
              {notification.title}
            </h4>
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
            {!notification.read && (
              <div className="w-2 h-2 bg-blue-500 rounded-full flex-shrink-0" />
            )}
          </div>

          <p className="text-sm text-muted-foreground mb-2">
            {notification.message}
          </p>

          <div className="flex items-center justify-between">
            <p className="text-xs text-muted-foreground">
              {notification.timestamp.toLocaleString()}
            </p>

            {notification.actions && notification.actions.length > 0 && (
              <div className="flex gap-2">
                {notification.actions.map((action, index) => (
                  <Button
                    key={index}
                    variant={action.variant || "outline"}
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation()
                      action.onClick()
                    }}
                    className="text-xs h-7"
                  >
                    {action.label}
                  </Button>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="flex flex-col gap-2">
          {!notification.read && onMarkAsRead && (
            <Button
              variant="ghost"
              size="sm"
              onClick={handleMarkAsRead}
              className="h-8 w-8 p-0 hover:bg-muted"
              title="Mark as read"
            >
              <Check className="h-4 w-4" />
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}