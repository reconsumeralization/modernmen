'use client'

import React, { useState, useEffect } from 'react'
import BookingFilters from './bookings/BookingFilters'
import BookingCard from './bookings/BookingCard'
import LoadingSpinner from './ui/LoadingSpinner'
import ErrorState from './ui/ErrorState'

interface Booking {
  id: string
  client: { firstName: string; lastName: string; email: string; phone: string }
  staff: { firstName: string; lastName: string }
  service: { name: string; duration: number }
  date: string
  startTime: string
  endTime: string
  status: 'PENDING' | 'CONFIRMED' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED' | 'NO_SHOW'
  totalPrice: number
  notes?: string
  createdAt: string
}

const BookingManager = () => {
  const [bookings, setBookings] = useState<Booking[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('all')

  useEffect(() => {
    fetchBookings()
  }, [])

  const fetchBookings = async () => {
    try {
      const token = localStorage.getItem('admin_token')
      if (!token) throw new Error('No authentication token')

      const response = await fetch('/api/admin/bookings', {
        headers: { 'Authorization': `Bearer ${token}` }
      })

      if (!response.ok) throw new Error('Failed to fetch bookings')
      
      const data = await response.json()
      setBookings(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load bookings')
    } finally {
      setLoading(false)
    }
  }

  const updateBookingStatus = async (bookingId: string, newStatus: string) => {
    try {
      const token = localStorage.getItem('admin_token')
      if (!token) throw new Error('No authentication token')

      const response = await fetch(`/api/admin/bookings/${bookingId}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ status: newStatus })
      })

      if (!response.ok) throw new Error('Failed to update booking')
      
      await fetchBookings() // Refresh the list
    } catch (err) {
      console.error('Error updating booking:', err)
      alert('Failed to update booking status')
    }
  }

  const handleViewBooking = (booking: Booking) => {
    // TODO: Open booking details modal
    console.log('View booking:', booking)
  }

  const handleNewBooking = () => {
    // TODO: Open new booking modal
    console.log('New booking')
  }

  const filteredBookings = bookings.filter(booking => {
    const matchesSearch = 
      booking.client.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      booking.client.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      booking.service.name.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesStatus = statusFilter === 'all' || booking.status === statusFilter
    
    return matchesSearch && matchesStatus
  })

  if (loading) return <LoadingSpinner />
  if (error) return <ErrorState message={error} onRetry={fetchBookings} />

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Booking Management</h1>
      </div>

      <BookingFilters
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        statusFilter={statusFilter}
        onStatusFilterChange={setStatusFilter}
        onNewBooking={handleNewBooking}
      />

      <div className="grid gap-4">
        {filteredBookings.length > 0 ? (
          filteredBookings.map((booking) => (
            <BookingCard
              key={booking.id}
              booking={booking}
              onStatusUpdate={updateBookingStatus}
              onView={handleViewBooking}
            />
          ))
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-500">No bookings found</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default BookingManager