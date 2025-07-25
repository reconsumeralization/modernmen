'use client'

import React from 'react'
import SearchBar from '../ui/SearchBar'
import FilterDropdown from '../ui/FilterDropdown'
import { Plus } from 'lucide-react'

interface BookingFiltersProps {
  searchTerm: string
  onSearchChange: (value: string) => void
  statusFilter: string
  onStatusFilterChange: (value: string) => void
  onNewBooking: () => void
}

const BookingFilters = ({
  searchTerm,
  onSearchChange,
  statusFilter,
  onStatusFilterChange,
  onNewBooking
}: BookingFiltersProps) => {
  const statusOptions = [
    { value: 'PENDING', label: 'Pending' },
    { value: 'CONFIRMED', label: 'Confirmed' },
    { value: 'IN_PROGRESS', label: 'In Progress' },
    { value: 'COMPLETED', label: 'Completed' },
    { value: 'CANCELLED', label: 'Cancelled' },
    { value: 'NO_SHOW', label: 'No Show' }
  ]

  return (
    <div className="flex items-center justify-between gap-4 mb-6">
      <div className="flex items-center space-x-4 flex-1">
        <SearchBar
          value={searchTerm}
          onChange={onSearchChange}
          placeholder="Search bookings..."
          className="max-w-md"
        />
        <FilterDropdown
          value={statusFilter}
          onChange={onStatusFilterChange}
          options={statusOptions}
          placeholder="All Status"
        />
      </div>
      
      <button
        onClick={onNewBooking}
        className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
      >
        <Plus className="w-4 h-4" />
        <span>New Booking</span>
      </button>
    </div>
  )
}

export default BookingFilters