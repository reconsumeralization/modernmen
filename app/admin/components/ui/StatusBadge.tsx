'use client'

import React from 'react'

interface StatusBadgeProps {
  status: string
  variant?: 'booking' | 'payment' | 'order'
}

const StatusBadge = ({ status, variant = 'booking' }: StatusBadgeProps) => {
  const getStatusColor = () => {
    if (variant === 'booking') {
      switch (status.toUpperCase()) {
        case 'COMPLETED': return 'bg-green-100 text-green-800'
        case 'CONFIRMED': return 'bg-blue-100 text-blue-800'
        case 'CANCELLED': 
        case 'NO_SHOW': return 'bg-red-100 text-red-800'
        case 'IN_PROGRESS': return 'bg-yellow-100 text-yellow-800'
        default: return 'bg-gray-100 text-gray-800'
      }
    }
    
    if (variant === 'payment') {
      switch (status.toUpperCase()) {
        case 'PAID': return 'bg-green-100 text-green-800'
        case 'PARTIAL': return 'bg-yellow-100 text-yellow-800'
        case 'UNPAID': return 'bg-red-100 text-red-800'
        case 'REFUNDED': return 'bg-purple-100 text-purple-800'
        default: return 'bg-gray-100 text-gray-800'
      }
    }

    if (variant === 'order') {
      switch (status.toUpperCase()) {
        case 'PENDING': return 'bg-yellow-100 text-yellow-800'
        case 'PROCESSING': return 'bg-blue-100 text-blue-800'
        case 'READY': return 'bg-purple-100 text-purple-800'
        case 'COMPLETED': return 'bg-green-100 text-green-800'
        case 'CANCELLED': return 'bg-red-100 text-red-800'
        default: return 'bg-gray-100 text-gray-800'
      }
    }

    return 'bg-gray-100 text-gray-800'
  }

  return (
    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor()}`}>
      {status.toLowerCase().replace('_', ' ')}
    </span>
  )
}

export default StatusBadge