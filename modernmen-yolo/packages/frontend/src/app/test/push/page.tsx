import { PushNotificationTest } from '@/components/testing/PushNotificationTest'

export default function PushNotificationTestPage() {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold">Push Notifications Testing</h1>
          <p className="text-muted-foreground mt-2">
            Test and verify push notification functionality for appointment reminders,
            promotional messages, and system notifications.
          </p>
        </div>
        <PushNotificationTest />
      </div>
    </div>
  )
}

export const metadata = {
  title: 'Push Notifications Test | Modern Men',
  description: 'Test push notification functionality for the Modern Men Hair Salon system.',
}
