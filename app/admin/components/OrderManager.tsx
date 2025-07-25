'use client'

import React, { useState, useEffect } from 'react'
import OrderCard from './orders/OrderCard'
import SearchBar from './ui/SearchBar'
import FilterDropdown from './ui/FilterDropdown'
import LoadingSpinner from './ui/LoadingSpinner'
import ErrorState from './ui/ErrorState'
import { DollarSign, Package, Truck, MapPin } from 'lucide-react'

interface Order {
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
  status: 'PENDING' | 'PROCESSING' | 'READY' | 'COMPLETED' | 'CANCELLED'
  paymentStatus: 'UNPAID' | 'PAID' | 'PARTIAL' | 'REFUNDED'
  paymentMethod?: string
  isPickup: boolean
  shippingAddress?: string
  createdAt: string
}

const OrderManager = () => {
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [paymentFilter, setPaymentFilter] = useState('all')
  const [fulfillmentFilter, setFulfillmentFilter] = useState('all')

  useEffect(() => {
    fetchOrders()
  }, [])

  const fetchOrders = async () => {
    try {
      const token = localStorage.getItem('admin_token')
      if (!token) throw new Error('No authentication token')

      const response = await fetch('/api/admin/orders', {
        headers: { 'Authorization': `Bearer ${token}` }
      })

      if (!response.ok) throw new Error('Failed to fetch orders')
      
      const data = await response.json()
      setOrders(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load orders')
    } finally {
      setLoading(false)
    }
  }

  const updateOrderStatus = async (orderId: string, newStatus: string) => {
    try {
      const token = localStorage.getItem('admin_token')
      if (!token) throw new Error('No authentication token')

      const response = await fetch(`/api/orders/${orderId}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ status: newStatus })
      })

      if (!response.ok) throw new Error('Failed to update order')
      
      await fetchOrders()
    } catch (err) {
      console.error('Error updating order:', err)
      alert('Failed to update order status')
    }
  }

  const handleViewOrder = (order: Order) => {
    console.log('View order:', order)
    // TODO: Open order details modal
  }

  const filteredOrders = orders.filter(order => {
    const matchesSearch = 
      order.orderNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.client.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.client.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.client.email.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesStatus = statusFilter === 'all' || order.status === statusFilter
    const matchesPayment = paymentFilter === 'all' || order.paymentStatus === paymentFilter
    const matchesFulfillment = fulfillmentFilter === 'all' || 
      (fulfillmentFilter === 'pickup' && order.isPickup) ||
      (fulfillmentFilter === 'shipping' && !order.isPickup)
    
    return matchesSearch && matchesStatus && matchesPayment && matchesFulfillment
  })

  const statusOptions = [
    { value: 'PENDING', label: 'Pending' },
    { value: 'PROCESSING', label: 'Processing' },
    { value: 'READY', label: 'Ready' },
    { value: 'COMPLETED', label: 'Completed' },
    { value: 'CANCELLED', label: 'Cancelled' }
  ]

  const paymentOptions = [
    { value: 'UNPAID', label: 'Unpaid' },
    { value: 'PAID', label: 'Paid' },
    { value: 'PARTIAL', label: 'Partial' },
    { value: 'REFUNDED', label: 'Refunded' }
  ]

  const fulfillmentOptions = [
    { value: 'pickup', label: 'Pickup' },
    { value: 'shipping', label: 'Shipping' }
  ]

  // Calculate summary stats
  const stats = {
    totalOrders: orders.length,
    totalRevenue: orders.filter(o => o.paymentStatus === 'PAID').reduce((sum, o) => sum + Number(o.total), 0),
    pendingOrders: orders.filter(o => o.status === 'PENDING').length,
    pickupOrders: orders.filter(o => o.isPickup).length,
  }

  if (loading) return <LoadingSpinner />
  if (error) return <ErrorState message={error} onRetry={fetchOrders} />

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Order Management</h1>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
        <div className="bg-blue-50 p-4 rounded-lg">
          <div className="flex items-center">
            <Package className="w-8 h-8 text-blue-600 mr-3" />
            <div>
              <p className="text-sm text-blue-600">Total Orders</p>
              <p className="text-2xl font-bold text-blue-900">{stats.totalOrders}</p>
            </div>
          </div>
        </div>
        <div className="bg-green-50 p-4 rounded-lg">
          <div className="flex items-center">
            <DollarSign className="w-8 h-8 text-green-600 mr-3" />
            <div>
              <p className="text-sm text-green-600">Total Revenue</p>
              <p className="text-2xl font-bold text-green-900">${stats.totalRevenue.toFixed(2)}</p>
            </div>
          </div>
        </div>
        <div className="bg-yellow-50 p-4 rounded-lg">
          <div className="flex items-center">
            <Package className="w-8 h-8 text-yellow-600 mr-3" />
            <div>
              <p className="text-sm text-yellow-600">Pending Orders</p>
              <p className="text-2xl font-bold text-yellow-900">{stats.pendingOrders}</p>
            </div>
          </div>
        </div>
        <div className="bg-purple-50 p-4 rounded-lg">
          <div className="flex items-center">
            <MapPin className="w-8 h-8 text-purple-600 mr-3" />
            <div>
              <p className="text-sm text-purple-600">Pickup Orders</p>
              <p className="text-2xl font-bold text-purple-900">{stats.pickupOrders}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="flex items-center space-x-4 mb-6 flex-wrap gap-4">
        <SearchBar
          value={searchTerm}
          onChange={setSearchTerm}
          placeholder="Search orders..."
          className="max-w-md"
        />
        <FilterDropdown
          value={statusFilter}
          onChange={setStatusFilter}
          options={statusOptions}
          placeholder="All Status"
        />
        <FilterDropdown
          value={paymentFilter}
          onChange={setPaymentFilter}
          options={paymentOptions}
          placeholder="All Payments"
        />
        <FilterDropdown
          value={fulfillmentFilter}
          onChange={setFulfillmentFilter}
          options={fulfillmentOptions}
          placeholder="All Fulfillment"
        />
      </div>

      {/* Orders Grid */}
      <div className="grid gap-4">
        {filteredOrders.length > 0 ? (
          filteredOrders.map((order) => (
            <OrderCard
              key={order.id}
              order={order}
              onStatusUpdate={updateOrderStatus}
              onView={handleViewOrder}
            />
          ))
        ) : (
          <div className="text-center py-12">
            <Package className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500">No orders found</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default OrderManager