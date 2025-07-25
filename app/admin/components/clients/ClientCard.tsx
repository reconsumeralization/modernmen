'use client'

import React from 'react'
import { User, Phone, Mail, Calendar, DollarSign } from 'lucide-react'

interface ClientCardProps {
  client: {
    id: string
    firstName: string
    lastName: string
    email: string
    phone: string
    totalVisits: number
    totalSpent: number
    lastVisit: string | null
    createdAt: string
  }
  onEdit: (client: any) => void
  onView: (client: any) => void
}

const ClientCard = ({ client, onEdit, onView }: ClientCardProps) => {
  const formatDate = (dateString: string | null) => {
    return dateString ? new Date(dateString).toLocaleDateString() : 'Never'
  }

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-purple-500 rounded-full flex items-center justify-center text-white font-medium">
            {client.firstName[0]}{client.lastName[0]}
          </div>
          <div>
            <h3 className="font-medium">{client.firstName} {client.lastName}</h3>
            <p className="text-sm text-gray-500">Client since {formatDate(client.createdAt)}</p>
          </div>
        </div>
      </div>      <div className="grid grid-cols-2 gap-4 text-sm text-gray-600 mb-3">
        <div className="flex items-center space-x-2">
          <Mail className="w-4 h-4" />
          <span className="truncate">{client.email}</span>
        </div>
        <div className="flex items-center space-x-2">
          <Phone className="w-4 h-4" />
          <span>{client.phone}</span>
        </div>
        <div className="flex items-center space-x-2">
          <Calendar className="w-4 h-4" />
          <span>{client.totalVisits} visits</span>
        </div>
        <div className="flex items-center space-x-2">
          <DollarSign className="w-4 h-4" />
          <span>${client.totalSpent}</span>
        </div>
      </div>

      <div className="text-sm text-gray-500 mb-3">
        Last visit: {formatDate(client.lastVisit)}
      </div>

      <div className="flex justify-between">
        <button
          onClick={() => onView(client)}
          className="px-3 py-1 text-xs bg-blue-100 text-blue-700 rounded hover:bg-blue-200"
        >
          View Details
        </button>
        <button
          onClick={() => onEdit(client)}
          className="px-3 py-1 text-xs bg-gray-100 text-gray-700 rounded hover:bg-gray-200"
        >
          Edit
        </button>
      </div>
    </div>
  )
}

export default ClientCard