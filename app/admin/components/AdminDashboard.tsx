'use client'

import React, { useState, useEffect } from 'react'
import { 
  Users, 
  Calendar, 
  ShoppingBag, 
  DollarSign, 
  TrendingUp,
  Clock,
  AlertCircle,
  CheckCircle
} from 'lucide-react'

interface DashboardStats {
  totalClients: number
  todayBookings: number
  monthlyRevenue: number
  pendingOrders: number
  newClientsThisMonth: number
  completedBookingsToday: number
}

interface RecentActivity {
  id: string
  type: 'booking' | 'order' | 'client'
  description: string
  time: string
  status: 'pending' | 'completed' | 'cancelled'
}

const AdminDashboard = () => {
  const [stats, setStats] = useState<DashboardStats>({
    totalClients: 0,
    todayBookings: 0,
    monthlyRevenue: 0,
    pendingOrders: 0,
    newClientsThisMonth: 0,
    completedBookingsToday: 0
  })
  
  const [recentActivity, setRecentActivity] = useState<RecentActivity[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchDashboardData()
  }, [])

  const fetchDashboardData = async () => {    try {
      setLoading(true)
      const token = localStorage.getItem('admin_token')
      
      if (!token) {
        throw new Error('No authentication token found')
      }

      // Fetch dashboard analytics
      const response = await fetch('/api/admin/dashboard', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })

      if (!response.ok) {
        throw new Error('Failed to fetch dashboard data')
      }

      const data = await response.json()
      setStats(data.stats)
      setRecentActivity(data.recentActivity)
    } catch (err) {
      console.error('Dashboard fetch error:', err)
      setError(err instanceof Error ? err.message : 'Failed to load dashboard')
    } finally {
      setLoading(false)
    }
  }

  const StatCard = ({ 
    title, 
    value, 
    icon: Icon, 
    trend, 
    trendValue,
    color = 'blue' 
  }: {
    title: string
    value: string | number
    icon: any
    trend?: 'up' | 'down'
    trendValue?: string
    color?: 'blue' | 'green' | 'purple' | 'orange' | 'red'
  }) => {
    const colorClasses = {
      blue: 'from-blue-500 to-blue-600',
      green: 'from-green-500 to-green-600',
      purple: 'from-purple-500 to-purple-600',
      orange: 'from-orange-500 to-orange-600',
      red: 'from-red-500 to-red-600'
    }

    return (
      <div className={`bg-gradient-to-r ${colorClasses[color]} rounded-lg p-6 text-white`}>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm opacity-90">{title}</p>
            <p className="text-3xl font-bold mt-1">{value}</p>
            {trend && trendValue && (
              <div className={`flex items-center mt-2 text-sm ${
                trend === 'up' ? 'text-green-200' : 'text-red-200'
              }`}>
                <TrendingUp className={`w-4 h-4 mr-1 ${
                  trend === 'down' ? 'rotate-180' : ''
                }`} />
                {trendValue}
              </div>
            )}
          </div>
          <Icon className="w-12 h-12 opacity-80" />
        </div>
      </div>
    )
  }

  const ActivityItem = ({ activity }: { activity: RecentActivity }) => {
    const getStatusIcon = () => {
      switch (activity.status) {
        case 'completed':
          return <CheckCircle className="w-4 h-4 text-green-500" />
        case 'pending':
          return <Clock className="w-4 h-4 text-yellow-500" />
        case 'cancelled':
          return <AlertCircle className="w-4 h-4 text-red-500" />
        default:
          return <Clock className="w-4 h-4 text-gray-500" />
      }
    }

    const getTypeColor = () => {
      switch (activity.type) {
        case 'booking':
          return 'text-blue-600'
        case 'order':
          return 'text-green-600'
        case 'client':
          return 'text-purple-600'
        default:
          return 'text-gray-600'
      }
    }

    return (
      <div className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg">
        <div className="flex items-center space-x-3">
          {getStatusIcon()}
          <div>
            <p className={`font-medium ${getTypeColor()}`}>
              {activity.description}
            </p>
            <p className="text-sm text-gray-500">{activity.time}</p>
          </div>
        </div>
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
          activity.status === 'completed' 
            ? 'bg-green-100 text-green-800'
            : activity.status === 'pending'
            ? 'bg-yellow-100 text-yellow-800'
            : 'bg-red-100 text-red-800'
        }`}>
          {activity.status}
        </span>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="p-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-64 mb-6"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-32 bg-gray-200 rounded-lg"></div>
            ))}
          </div>
          <div className="h-96 bg-gray-200 rounded-lg"></div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="p-6">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-center">
            <AlertCircle className="w-5 h-5 text-red-500 mr-2" />
            <p className="text-red-700 font-medium">Error loading dashboard</p>
          </div>
          <p className="text-red-600 text-sm mt-1">{error}</p>
          <button 
            onClick={fetchDashboardData}
            className="mt-3 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <button 
          onClick={fetchDashboardData}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
        >
          <TrendingUp className="w-4 h-4" />
          <span>Refresh</span>
        </button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard
          title="Total Clients"
          value={stats.totalClients}
          icon={Users}
          color="blue"
          trend="up"
          trendValue={`+${stats.newClientsThisMonth} this month`}
        />
        <StatCard
          title="Today's Bookings"
          value={stats.todayBookings}
          icon={Calendar}
          color="green"
          trend="up"
          trendValue={`${stats.completedBookingsToday} completed`}
        />
        <StatCard
          title="Monthly Revenue"
          value={`$${stats.monthlyRevenue.toLocaleString()}`}
          icon={DollarSign}
          color="purple"
          trend="up"
          trendValue="+12% from last month"
        />
        <StatCard
          title="Pending Orders"
          value={stats.pendingOrders}
          icon={ShoppingBag}
          color="orange"
        />
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">Recent Activity</h2>
        </div>
        <div className="p-6">
          {recentActivity.length > 0 ? (
            <div className="space-y-2">
              {recentActivity.slice(0, 10).map((activity) => (
                <ActivityItem key={activity.id} activity={activity} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <Clock className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">No recent activity</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default AdminDashboard