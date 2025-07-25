'use client'

import React from 'react'
import { Filter } from 'lucide-react'

interface FilterDropdownProps {
  value: string
  onChange: (value: string) => void
  options: { value: string; label: string }[]
  placeholder?: string
}

const FilterDropdown = ({ 
  value, 
  onChange, 
  options, 
  placeholder = "All" 
}: FilterDropdownProps) => {
  return (
    <div className="relative">
      <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="pl-10 pr-8 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
      >
        <option value="all">{placeholder}</option>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  )
}

export default FilterDropdown