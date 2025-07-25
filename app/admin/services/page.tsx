'use client'

import AdminLayout from '../components/AdminLayout'
import ServiceManager from '../components/ServiceManager'

export default function AdminServicesPage() {
  return (
    <AdminLayout currentPage="services">
      <ServiceManager />
    </AdminLayout>
  )
}