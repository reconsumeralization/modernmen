import { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

export interface RealtimeNotification {
  id: string
  type: 'success' | 'warning' | 'info' | 'error'
  title: string
  message: string
  timestamp: Date
  action?: {
    label: string
    onClick: () => void
  }
  duration?: number // Auto-dismiss after this many seconds
  persistent?: boolean // Don't auto-dismiss
}

interface UseRealtimeNotificationsReturn {
  notifications: RealtimeNotification[]
  addNotification: (notification: Omit<RealtimeNotification, 'id' | 'timestamp'>) => void
  removeNotification: (id: string) => void
  clearAll: () => void
  unreadCount: number
}

export function useRealtimeNotifications(): UseRealtimeNotificationsReturn {
  const [notifications, setNotifications] = useState<RealtimeNotification[]>([])

  const removeNotification = useCallback((id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id))
  }, [])

  const addNotification = useCallback((notification: Omit<RealtimeNotification, 'id' | 'timestamp'>) => {
    const newNotification: RealtimeNotification = {
      ...notification,
      id: `notification-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      timestamp: new Date()
    }

    setNotifications(prev => [newNotification, ...prev])

    // Auto-dismiss non-persistent notifications
    if (!notification.persistent && notification.duration !== 0) {
      const duration = notification.duration || 5000 // Default 5 seconds
      setTimeout(() => {
        removeNotification(newNotification.id)
      }, duration)
    }
  }, [removeNotification])

  const clearAll = useCallback(() => {
    setNotifications([])
  }, [])

  const unreadCount = notifications.length

  // Simulate real-time updates (in a real app, this would connect to WebSocket/SSE)
  useEffect(() => {
    const interval = setInterval(() => {
      // Simulate occasional live updates
      if (Math.random() < 0.1) { // 10% chance every 30 seconds
        const messages = [
          {
            type: 'info' as const,
            title: 'Live Update',
            message: 'A new appointment slot just opened up!',
            duration: 4000
          },
          {
            type: 'success' as const,
            title: 'Appointment Confirmed',
            message: 'John D. just booked his haircut - 2:30 PM today',
            duration: 6000
          },
          {
            type: 'warning' as const,
            title: 'High Demand',
            message: 'Popular time slots filling up quickly today',
            duration: 5000
          }
        ]

        const randomMessage = messages[Math.floor(Math.random() * messages.length)]
        addNotification(randomMessage)
      }
    }, 30000) // Every 30 seconds

    return () => clearInterval(interval)
  }, [addNotification])

  return {
    notifications,
    addNotification,
    removeNotification,
    clearAll,
    unreadCount
  }
}

// Real-time Notification Component
interface RealtimeNotificationToastProps {
  notification: RealtimeNotification
  onRemove: (id: string) => void
}

export function RealtimeNotificationToast({ notification, onRemove }: RealtimeNotificationToastProps) {
  const getIcon = () => {
    switch (notification.type) {
      case 'success':
        return '✓'
      case 'warning':
        return '⚠'
      case 'error':
        return '✕'
      case 'info':
      default:
        return 'ℹ'
    }
  }

  const getBgColor = () => {
    switch (notification.type) {
      case 'success':
        return 'bg-green-500'
      case 'warning':
        return 'bg-yellow-500'
      case 'error':
        return 'bg-red-500'
      case 'info':
      default:
        return 'bg-blue-500'
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, x: 300, scale: 0.8 }}
      animate={{ opacity: 1, x: 0, scale: 1 }}
      exit={{ opacity: 0, x: 300, scale: 0.8 }}
      transition={{
        type: "spring",
        stiffness: 300,
        damping: 30
      }}
      className={`${getBgColor()} text-white p-4 rounded-lg shadow-lg max-w-sm w-full`}
    >
      <div className="flex items-start gap-3">
        <div className="flex-shrink-0 w-8 h-8 bg-white/20 rounded-full flex items-center justify-center text-lg font-bold">
          {getIcon()}
        </div>
        <div className="flex-1 min-w-0">
          <h4 className="font-semibold text-sm mb-1">{notification.title}</h4>
          <p className="text-sm text-white/90 leading-relaxed">{notification.message}</p>
          {notification.action && (
            <button
              onClick={notification.action.onClick}
              className="mt-2 text-xs underline hover:text-white/80 transition-colors"
            >
              {notification.action.label}
            </button>
          )}
        </div>
        <button
          onClick={() => onRemove(notification.id)}
          className="flex-shrink-0 w-6 h-6 bg-white/20 rounded-full flex items-center justify-center text-sm hover:bg-white/30 transition-colors"
        >
          ×
        </button>
      </div>
    </motion.div>
  )
}

// Real-time Notification Container
interface RealtimeNotificationContainerProps {
  notifications: RealtimeNotification[]
  onRemove: (id: string) => void
}

export function RealtimeNotificationContainer({ notifications, onRemove }: RealtimeNotificationContainerProps) {
  return (
    <div className="fixed top-4 right-4 z-50 space-y-2 max-w-sm">
      <AnimatePresence mode="popLayout">
        {notifications.slice(0, 3).map((notification) => (
          <RealtimeNotificationToast
            key={notification.id}
            notification={notification}
            onRemove={onRemove}
          />
        ))}
      </AnimatePresence>
      {notifications.length > 3 && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-gray-800 text-white px-4 py-2 rounded-lg shadow-lg text-sm"
        >
          +{notifications.length - 3} more notifications
        </motion.div>
      )}
    </div>
  )
}
