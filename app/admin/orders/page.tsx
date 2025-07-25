'use client'

import AdminLayout from '../components/AdminLayout'
import OrderManager from '../components/OrderManager'

export default function AdminOrdersPage() {
  return (
    <AdminLayout currentPage="orders">
      <OrderManager />
    </AdminLayout>
  )
}