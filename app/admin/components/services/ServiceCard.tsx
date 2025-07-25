'use client'

import React from 'react'
import { Clock, DollarSign, Tag, Eye, Edit } from 'lucide-react'
import StatusBadge from '../ui/StatusBadge'

interface ServiceCardProps {
  service: {
    id: string
    name: string
    description: string
    duration: number
    price: number
    category: string
    isActive: boolean
    addOns: string[]
  }
  onEdit: (service: any) => void
  onToggleActive: (id: string, isActive: boolean) => void
}

const ServiceCard = ({ service, onEdit, onToggleActive }: ServiceCardProps) => {
  return (
    <div className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between mb-3">
        <div>
          <h3 className="font-medium text-lg">{service.name}</h3>
          <p className="text-sm text-gray-500">{service.category}</p>
        </div>
        <div className={`px-2 py-1 rounded-full text-xs font-medium ${
          service.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
        }`}>
          {service.isActive ? 'Active' : 'Inactive'}
        </div>
      </div>

      {service.description && (
        <p className="text-sm text-gray-600 mb-3 line-clamp-2">{service.description}</p>
      )}

      <div className="grid grid-cols-2 gap-4 text-sm text-gray-600 mb-3">
        <div className="flex items-center space-x-2">
          <Clock className="w-4 h-4" />
          <span>{service.duration} min</span>
        </div>
        <div className="flex items-center space-x-2">
          <DollarSign className="w-4 h-4" />
          <span>${service.price}</span>
        </div>
      </div>      {service.addOns.length > 0 && (
        <div className="mb-3">
          <p className="text-xs text-gray-500 mb-1">Add-ons:</p>
          <div className="flex flex-wrap gap-1">
            {service.addOns.slice(0, 3).map((addon, index) => (
              <span key={index} className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded">
                {addon}
              </span>
            ))}
            {service.addOns.length > 3 && (
              <span className="text-xs text-gray-500">+{service.addOns.length - 3} more</span>
            )}
          </div>
        </div>
      )}

      <div className="flex justify-between">
        <button
          onClick={() => onEdit(service)}
          className="px-3 py-1 text-xs bg-blue-100 text-blue-700 rounded hover:bg-blue-200 flex items-center space-x-1"
        >
          <Edit className="w-3 h-3" />
          <span>Edit</span>
        </button>
        <button
          onClick={() => onToggleActive(service.id, !service.isActive)}
          className={`px-3 py-1 text-xs rounded ${
            service.isActive 
              ? 'bg-red-100 text-red-700 hover:bg-red-200' 
              : 'bg-green-100 text-green-700 hover:bg-green-200'
          }`}
        >
          {service.isActive ? 'Deactivate' : 'Activate'}
        </button>
      </div>
    </div>
  )
}

export default ServiceCard