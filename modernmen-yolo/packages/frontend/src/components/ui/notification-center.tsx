// =============================================================================
// NOTIFICATION CENTER - Main notification center component
// =============================================================================

"use client";

import React, { useState } from "react";
import { Bell } from "lucide-react";
import { Button } from "./button";
import { ScrollArea } from "./scroll-area";
import { Badge } from "./badge";
import { Popover, PopoverContent, PopoverTrigger } from "./popover";
import { cn } from "@/lib/utils";
import { NotificationItem } from "./notification-item";
import { NotificationCenterProps } from "./notification-types";

export function NotificationCenter({
  notifications,
  onMarkAsRead,
  onMarkAllAsRead,
  onDelete,
  onAction,
  className,
}: NotificationCenterProps) {
  const [open, setOpen] = useState(false)

  const unreadCount = notifications.filter(n => !n.read).length
  const recentNotifications = notifications.slice(0, 5)

  const handleNotificationClick = (notification: any) => {
    if (!notification.read && onMarkAsRead) {
      onMarkAsRead(notification.id)
    }

    if (notification.actionUrl && onAction) {
      onAction(notification)
    }
  }

  const handleMarkAllAsRead = () => {
    onMarkAllAsRead?.()
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="icon" className={cn("relative", className)}>
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <Badge
              variant="destructive"
              className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs"
            >
              {unreadCount > 9 ? "9+" : unreadCount}
            </Badge>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-0" align="end">
        <div className="flex items-center justify-between p-4 border-b">
          <h4 className="font-semibold">Notifications</h4>
          {unreadCount > 0 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={handleMarkAllAsRead}
              className="text-xs"
            >
              Mark all read
            </Button>
          )}
        </div>

        <ScrollArea className="h-80">
          {recentNotifications.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-8 text-center">
              <Bell className="h-8 w-8 text-muted-foreground mb-2" />
              <p className="text-sm text-muted-foreground">No notifications</p>
            </div>
          ) : (
            <div className="divide-y">
              {recentNotifications.map((notification) => (
                <NotificationItem
                  key={notification.id}
                  notification={notification}
                  onClick={handleNotificationClick}
                  onMarkAsRead={onMarkAsRead}
                  onDelete={onDelete}
                  onAction={onAction}
                />
              ))}
            </div>
          )}
        </ScrollArea>

        {notifications.length > 5 && (
          <div className="p-4 border-t">
            <Button variant="ghost" className="w-full" size="sm">
              View all notifications
            </Button>
          </div>
        )}
      </PopoverContent>
    </Popover>
  )
}