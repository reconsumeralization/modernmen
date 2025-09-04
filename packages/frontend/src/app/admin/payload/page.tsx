import { Metadata } from 'next'
import { PayloadDashboard } from '@/components/admin/PayloadDashboard'

export const metadata: Metadata = {
  title: 'Payload CMS Dashboard - Modern Men Hair Salon',
  description: 'Manage salon data and content through Payload CMS integration',
}

export default function PayloadDashboardPage() {
  return <PayloadDashboard />
}