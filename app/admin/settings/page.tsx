'use client'

import AdminLayout from '../components/AdminLayout'
import Settings from '../components/Settings'

export default function AdminSettingsPage() {
  return (
    <AdminLayout currentPage="settings">
      <Settings />
    </AdminLayout>
  )
}