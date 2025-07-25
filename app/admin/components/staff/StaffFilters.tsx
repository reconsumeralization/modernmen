'use client'

import React from 'react'
import SearchBar from '../ui/SearchBar'
import FilterDropdown from '../ui/FilterDropdown'
import { Plus } from 'lucide-react'

interface StaffFiltersProps {
  searchTerm: string
  onSearchChange: (value: string) => void
  roleFilter: string
  onRoleFilterChange: (value: string) => void
  activeFilter: string
  onActiveFilterChange: (value: string) => void
  onNewStaff: () => void
}

const StaffFilters = ({
  searchTerm,
  onSearchChange,
  roleFilter,
  onRoleFilterChange,
  activeFilter,
  onActiveFilterChange,
  onNewStaff
}: StaffFiltersProps) => {
  const roleOptions = [
    { value: 'OWNER', label: 'Owner' },
    { value: 'MANAGER', label: 'Manager' },
    { value: 'STYLIST', label: 'Stylist' },
    { value: 'BARBER', label: 'Barber' },
    { value: 'RECEPTIONIST', label: 'Receptionist' }
  ]

  const activeOptions = [
    { value: 'true', label: 'Active' },
    { value: 'false', label: 'Inactive' }
  ]

  return (
    <div className="flex items-center justify-between gap-4 mb-6">
      <div className="flex items-center space-x-4 flex-1">
        <SearchBar
          value={searchTerm}
          onChange={onSearchChange}
          placeholder="Search staff..."
          className="max-w-md"
        />
        <FilterDropdown
          value={roleFilter}
          onChange={onRoleFilterChange}
          options={roleOptions}
          placeholder="All Roles"
        />
        <FilterDropdown
          value={activeFilter}
          onChange={onActiveFilterChange}
          options={activeOptions}
          placeholder="All Staff"
        />
      </div>
      
      <button
        onClick={onNewStaff}
        className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
      >
        <Plus className="w-4 h-4" />
        <span>Add Staff</span>
      </button>
    </div>
  )
}

export default StaffFilters