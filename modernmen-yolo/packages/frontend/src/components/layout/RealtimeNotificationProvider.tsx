'use client'

import { RealtimeNotificationContainer, useRealtimeNotifications } from '@/hooks/useRealtimeNotifications'

export function RealtimeNotificationProvider({ children }: { children: React.ReactNode }) {
  const { notifications, removeNotification } = useRealtimeNotifications()

  return (
    <>
      {children}
      <RealtimeNotificationContainer
        notifications={notifications}
        onRemove={removeNotification}
      />
    </>
  )
}
