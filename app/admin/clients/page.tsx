'use client'

import AdminLayout from '../components/AdminLayout'
import ClientManager from '../components/ClientManager'

export default function AdminClientsPage() {
  return (
    <AdminLayout currentPage="clients">
      <ClientManager />
    </AdminLayout>
  )
}