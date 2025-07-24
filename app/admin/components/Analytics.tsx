'use client'

import { useState, useEffect } from 'react'
import { analyticsAPI } from '@/lib/api'
import AdminLayout from './AdminLayout'

interface AnalyticsData {
  period: number
  revenue: {
    total: number
    average: number
    bookings: number
    monthlyTrends: { month: string; revenue: number; bookings: number }[]
  }
  clients: {
    newClients: number
    topClients: { id: string; firstName: string; lastName: string; totalSpent: number; totalVisits: number; lastVisit: string | null }[]
  }
  services: {
    performance: { serviceName: string; category: string; basePrice: number; bookingCount: number; totalRevenue: number; averageRevenue: number }[]
  }
  staff: {
    performance: { staffId: string; name: string; role: string; totalBookings: number; revenue: number; rating: number }[]
  }
}

export default function Analytics() {
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [period, setPeriod] = useState(30) // Default to 30 days

  const loadAnalytics = async () => {
    try {
      setLoading(true)
      const response = await analyticsAPI.get(period)
      setAnalyticsData(response)
      setError(null)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load analytics data')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadAnalytics()
  }, [period])

  if (loading) return <div className="text-center p-8">Loading analytics...</div>
  if (error) return <div className="text-red-600 p-4 bg-red-50 rounded-md">{error}</div>
  if (!analyticsData) return <div className="text-center p-8">No analytics data available.</div>

  return (
    <AdminLayout currentPage="analytics">
      <div className="space-y-6">
        <h2 className="text-3xl font-bold text-gray-900">Analytics Dashboard</h2>

        {/* Period Selector */}
        <div className="bg-white rounded-lg shadow p-4 flex items-center space-x-4">
          <label htmlFor="period-select" className="text-gray-700">Data for last:</label>
          <select
            id="period-select"
            value={period}
            onChange={(e) => setPeriod(parseInt(e.target.value))}
            className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-salon-gold"
          >
            <option value={7}>7 Days</option>
            <option value={30}>30 Days</option>
            <option value={90}>90 Days</option>
            <option value={365}>365 Days</option>
          </select>
        </div>

        {/* Revenue Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <StatCard title="Total Revenue" value={`$${analyticsData.revenue.total.toFixed(2)}`} />
          <StatCard title="Average Booking Value" value={`$${analyticsData.revenue.average.toFixed(2)}`} />
          <StatCard title="Total Bookings" value={analyticsData.revenue.bookings.toString()} />
        </div>

        {/* Monthly Revenue Trends */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-xl font-semibold mb-4">Monthly Revenue Trends (Last 12 Months)</h3>
          <div className="space-y-2">
            {analyticsData.revenue.monthlyTrends.map((trend) => (
              <div key={trend.month} className="flex justify-between items-center border-b pb-2">
                <span className="font-medium">{trend.month}</span>
                <span>{`$${trend.revenue.toFixed(2)} (${trend.bookings} bookings)`}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Client Analytics */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-xl font-semibold mb-4">New Clients This Period</h3>
            <p className="text-4xl font-bold text-salon-gold">{analyticsData.clients.newClients}</p>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-xl font-semibold mb-4">Top Clients by Revenue</h3>
            <ul className="space-y-2">
              {analyticsData.clients.topClients.map((client) => (
                <li key={client.id} className="flex justify-between items-center border-b pb-1">
                  <span>{client.firstName} {client.lastName}</span>
                  <span className="font-medium">${client.totalSpent.toFixed(2)}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Service Performance */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-xl font-semibold mb-4">Service Performance</h3>
          <div className="space-y-2">
            {analyticsData.services.performance.map((service) => (
              <div key={service.serviceName} className="flex justify-between items-center border-b pb-2">
                <span>{service.serviceName} ({service.category})</span>
                <span>{`$${service.totalRevenue.toFixed(2)} (${service.bookingCount} bookings)`}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Staff Performance */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-xl font-semibold mb-4">Staff Performance</h3>
          <div className="space-y-2">
            {analyticsData.staff.performance.map((staff) => (
              <div key={staff.staffId} className="flex justify-between items-center border-b pb-2">
                <span>{staff.name} ({staff.role})</span>
                <span>{`$${staff.revenue.toFixed(2)} (${staff.totalBookings} bookings)`}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </AdminLayout>
  )
}

function StatCard({ title, value }: { title: string; value: string }) {
  return (
    <div className="bg-white rounded-lg shadow p-6 text-center">
      <p className="text-lg font-medium text-gray-600">{title}</p>
      <p className="text-3xl font-bold text-salon-gold mt-2">{value}</p>
    </div>
  )
}