'use client'

import AdminLayout from '../components/AdminLayout'
import Analytics from '../components/Analytics'

export default function AdminAnalyticsPage() {
  return (
    <AdminLayout currentPage="analytics">
      <Analytics />
    </AdminLayout>
  )
}