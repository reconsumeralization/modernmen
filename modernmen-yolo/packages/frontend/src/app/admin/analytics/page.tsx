import { AdminAnalyticsDashboard } from '@/components/analytics/AdminAnalyticsDashboard'

export default function AdminAnalyticsPage() {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto py-8">
        <AdminAnalyticsDashboard />
      </div>
    </div>
  )
}

export const metadata = {
  title: 'Analytics Dashboard | Modern Men Admin',
  description: 'Comprehensive business intelligence and performance analytics for Modern Men Hair Salon.',
}
