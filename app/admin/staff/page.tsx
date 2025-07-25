'use client'

import AdminLayout from '../components/AdminLayout'
import StaffManager from '../components/StaffManager'

export default function AdminStaffPage() {
  return (
    <AdminLayout currentPage="staff">
      <StaffManager />
    </AdminLayout>
  )
}