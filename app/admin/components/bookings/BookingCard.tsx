'use client'

import React from 'react'
import { Calendar, Clock, User, Phone } from 'lucide-react'
import StatusBadge from '../ui/StatusBadge'

interface BookingCardProps {
  booking: {
    id: string
    client: { firstName: string; lastName: string; phone: string }
    staff: { firstName: string; lastName: string }
    service: { name: string }
    date: string
    startTime: string
    status: string
    totalPrice: number
  }
  onStatusUpdate: (id: string, status: string) => void
  onView: (booking: any) => void
}

const BookingCard = ({ booking, onStatusUpdate, onView }: BookingCardProps) => {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString()
  }

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center space-x-2">
          <User className="w-4 h-4 text-gray-500" />
          <span className="font-medium">
            {booking.client.firstName} {booking.client.lastName}
          </span>
        </div>
        <StatusBadge status={booking.status} variant="booking" />
      </div>

      <div className="grid grid-cols-2 gap-4 text-sm text-gray-600 mb-3">
        <div className="flex items-center space-x-2">
          <Calendar className="w-4 h-4" />
          <span>{formatDate(booking.date)}</span>
        </div>
        <div className="flex items-center space-x-2">
          <Clock className="w-4 h-4" />
          <span>{booking.startTime}</span>
        </div>
        <div className="flex items-center space-x-2">
          <Phone className="w-4 h-4" />
          <span>{booking.client.phone}</span>
        </div>
        <div>
          <span className="font-medium">${booking.totalPrice}</span>
        </div>
      </div>

      <div className="flex items-center justify-between">
        <div className="text-sm">
          <p className="font-medium">{booking.service.name}</p>
          <p className="text-gray-500">with {booking.staff.firstName} {booking.staff.lastName}</p>
        </div>
        
        <div className="flex space-x-2">
          <button
            onClick={() => onView(booking)}
            className="px-3 py-1 text-xs bg-blue-100 text-blue-700 rounded hover:bg-blue-200"
          >
            View
          </button>
          {booking.status === 'PENDING' && (
            <button
              onClick={() => onStatusUpdate(booking.id, 'CONFIRMED')}
              className="px-3 py-1 text-xs bg-green-100 text-green-700 rounded hover:bg-green-200"
            >
              Confirm
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

export default BookingCard