'use client'

import AdminLayout from '../components/AdminLayout'
import BookingManager from '../components/BookingManager'

export default function AdminBookingsPage() {
  return (
    <AdminLayout currentPage="bookings">
      <BookingManager />
    </AdminLayout>
  )
}