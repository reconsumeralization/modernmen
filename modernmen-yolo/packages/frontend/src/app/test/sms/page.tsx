import { SMSTest } from '@/components/testing/SMSTest'

export default function SMSTestPage() {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold">SMS Integration Testing</h1>
          <p className="text-muted-foreground mt-2">
            Test and verify SMS notification functionality for appointment confirmations,
            reminders, and cancellations.
          </p>
        </div>
        <SMSTest />
      </div>
    </div>
  )
}

export const metadata = {
  title: 'SMS Integration Test | Modern Men',
  description: 'Test SMS notification functionality for the Modern Men Hair Salon system.',
}
