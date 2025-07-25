'use client'

import React from 'react'
import { User, Phone, Mail, Star, Calendar } from 'lucide-react'

interface StaffCardProps {
  staff: {
    id: string
    firstName: string
    lastName: string
    email: string 
    phone: string
    role: string
    specialties: string[]
    isActive: boolean
    totalBookings: number
    rating: number
  }
  onEdit: (staff: any) => void
  onToggleActive: (id: string, isActive: boolean) => void
}

const StaffCard = ({ staff, onEdit, onToggleActive }: StaffCardProps) => {
  return (
    <div className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center text-white font-medium">
            {staff.firstName[0]}{staff.lastName[0]}
          </div>
          <div>
            <h3 className="font-medium">{staff.firstName} {staff.lastName}</h3>
            <p className="text-sm text-gray-500">{staff.role}</p>
          </div>
        </div>
        <div className={`px-2 py-1 rounded-full text-xs font-medium ${
          staff.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
        }`}>
          {staff.isActive ? 'Active' : 'Inactive'}
        </div>
      </div>      <div className="grid grid-cols-2 gap-4 text-sm text-gray-600 mb-3">
        <div className="flex items-center space-x-2">
          <Mail className="w-4 h-4" />
          <span className="truncate">{staff.email}</span>
        </div>
        <div className="flex items-center space-x-2">
          <Phone className="w-4 h-4" />
          <span>{staff.phone}</span>
        </div>
        <div className="flex items-center space-x-2">
          <Calendar className="w-4 h-4" />
          <span>{staff.totalBookings} bookings</span>
        </div>
        <div className="flex items-center space-x-2">
          <Star className="w-4 h-4" />
          <span>{staff.rating || 0}/5</span>
        </div>
      </div>

      {staff.specialties.length > 0 && (
        <div className="mb-3">
          <div className="flex flex-wrap gap-1">
            {staff.specialties.map((specialty, index) => (
              <span key={index} className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded">
                {specialty}
              </span>
            ))}
          </div>
        </div>
      )}

      <div className="flex justify-between">
        <button
          onClick={() => onEdit(staff)}
          className="px-3 py-1 text-xs bg-blue-100 text-blue-700 rounded hover:bg-blue-200"
        >
          Edit
        </button>
        <button
          onClick={() => onToggleActive(staff.id, !staff.isActive)}
          className={`px-3 py-1 text-xs rounded ${
            staff.isActive 
              ? 'bg-red-100 text-red-700 hover:bg-red-200' 
              : 'bg-green-100 text-green-700 hover:bg-green-200'
          }`}
        >
          {staff.isActive ? 'Deactivate' : 'Activate'}
        </button>
      </div>
    </div>
  )
}

export default StaffCard