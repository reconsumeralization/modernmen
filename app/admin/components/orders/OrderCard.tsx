'use client'

import React from 'react'
import { Package, DollarSign, MapPin, Truck, User, Calendar } from 'lucide-react'
import StatusBadge from '../ui/StatusBadge'

interface OrderCardProps {
  order: {
    id: string
    orderNumber: string
    client: { firstName: string; lastName: string; email: string }
    items: Array<{
      quantity: number
      price: number
      product: { name: string; brand: string }
    }>
    subtotal: number
    tax: number
    total: number
    status: string
    paymentStatus: string
    paymentMethod?: string
    isPickup: boolean
    shippingAddress?: string
    createdAt: string
  }
  onStatusUpdate: (id: string, status: string) => void
  onView: (order: any) => void
}

const OrderCard = ({ order, onStatusUpdate, onView }: OrderCardProps) => {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString()
  }

  const getItemsPreview = () => {
    if (order.items.length === 1) {
      const item = order.items[0]
      return `${item.product.brand} ${item.product.name} (${item.quantity})`
    }
    return `${order.items.length} items`
  }

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between mb-3">
        <div>
          <h3 className="font-medium text-lg">{order.orderNumber}</h3>
          <p className="text-sm text-gray-500 flex items-center">
            <User className="w-4 h-4 mr-1" />
            {order.client.firstName} {order.client.lastName}
          </p>
        </div>
        <div className="flex space-x-2">
          <StatusBadge status={order.status} variant="order" />
          <StatusBadge status={order.paymentStatus} variant="payment" />
        </div>
      </div>      <div className="grid grid-cols-2 gap-4 text-sm text-gray-600 mb-3">
        <div className="flex items-center space-x-2">
          <Package className="w-4 h-4" />
          <span>{getItemsPreview()}</span>
        </div>
        <div className="flex items-center space-x-2">
          <DollarSign className="w-4 h-4" />
          <span>${Number(order.total).toFixed(2)}</span>
        </div>
        <div className="flex items-center space-x-2">
          {order.isPickup ? (
            <>
              <MapPin className="w-4 h-4" />
              <span>Store Pickup</span>
            </>
          ) : (
            <>
              <Truck className="w-4 h-4" />
              <span>Shipping</span>
            </>
          )}
        </div>
        <div className="flex items-center space-x-2">
          <Calendar className="w-4 h-4" />
          <span>{formatDate(order.createdAt)}</span>
        </div>
      </div>

      {order.paymentMethod && (
        <div className="text-sm text-gray-500 mb-3">
          Payment: {order.paymentMethod.toUpperCase()}
        </div>
      )}

      <div className="flex justify-between">
        <button
          onClick={() => onView(order)}
          className="px-3 py-1 text-xs bg-blue-100 text-blue-700 rounded hover:bg-blue-200"
        >
          View Details
        </button>
        
        <div className="flex space-x-2">
          {order.status === 'PENDING' && order.paymentStatus === 'PAID' && (
            <button
              onClick={() => onStatusUpdate(order.id, 'PROCESSING')}
              className="px-3 py-1 text-xs bg-yellow-100 text-yellow-700 rounded hover:bg-yellow-200"
            >
              Process
            </button>
          )}
          {order.status === 'PROCESSING' && (
            <button
              onClick={() => onStatusUpdate(order.id, 'READY')}
              className="px-3 py-1 text-xs bg-green-100 text-green-700 rounded hover:bg-green-200"
            >
              Mark Ready
            </button>
          )}
          {order.status === 'READY' && (
            <button
              onClick={() => onStatusUpdate(order.id, 'COMPLETED')}
              className="px-3 py-1 text-xs bg-purple-100 text-purple-700 rounded hover:bg-purple-200"
            >
              Complete
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

export default OrderCard