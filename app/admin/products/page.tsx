'use client'

import AdminLayout from '../components/AdminLayout'
import ProductManager from '../components/ProductManager'

export default function AdminProductsPage() {
  return (
    <AdminLayout currentPage="products">
      <ProductManager />
    </AdminLayout>
  )
}