'use client'

import AdminLayout from './components/AdminLayout'
import AdminDashboard from './components/AdminDashboard'

export default function AdminHomePage() {
  return (
    <AdminLayout currentPage="dashboard">
      <AdminDashboard />
    </AdminLayout>
  )
}