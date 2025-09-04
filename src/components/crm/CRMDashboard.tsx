'use client'

import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Users,
  Calendar,
  DollarSign,
  TrendingUp,
  TrendingDown,
  Star,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  BarChart3,
  PieChart,
  Activity,
  Target,
  Award
} from '@/lib/icon-mapping'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { cn } from '@/lib/utils'
import { errorMonitor, ErrorCategory, ErrorSeverity } from '@/lib/error-monitoring'

interface DashboardData {
  summary: {
    totalCustomers: number
    activeCustomers: number
    totalAppointments: number
    completedAppointments: number
    totalRevenue: number
    averageRevenue: number
    customerRetentionRate: number
    appointmentCompletionRate: number
  }
  customers: {
    newCustomers: number
    returningCustomers: number
    topCustomers: Array<{
      id: string
      name: string
      email: string
      totalSpent: number
      tier: string
      lastVisit?: string
    }>
    loyaltyMetrics: {
      totalPoints: number
      tierBreakdown: {
        bronze: number
        silver: number
        gold: number
        platinum: number
      }
      averagePointsPerCustomer: number
    }
  }
  appointments: {
    statusBreakdown: {
      confirmed: number
      pending: number
      completed: number
      cancelled: number
      'no-show': number
    }
    upcomingAppointments: Array<{
      id: string
      customerName: string
      stylistName: string
      dateTime: string
      services: string
      status: string
    }>
    revenueByService: Array<{
      serviceId: string
      serviceName: string
      appointments: number
      revenue: number
    }>
  }
  performance: {
    customerRetentionRate: number
    appointmentCompletionRate: number
    averageAppointmentsPerCustomer: number
    revenuePerCustomer: number
  }
  period: {
    start: string
    end: string
    period: string
  }
}

interface CRMDashboardProps {
  className?: string
}

const statusColors = {
  confirmed: 'bg-green-100 text-green-800',
  pending: 'bg-yellow-100 text-yellow-800',
  completed: 'bg-blue-100 text-blue-800',
  cancelled: 'bg-red-100 text-red-800',
  'no-show': 'bg-gray-100 text-gray-800'
}

export function CRMDashboard({ className }: CRMDashboardProps) {
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [period, setPeriod] = useState('30d')
  const [activeTab, setActiveTab] = useState('overview')

  // Fetch dashboard data
  const fetchDashboardData = async () => {
    try {
      setLoading(true)
      setError(null)

      const response = await fetch(`/api/crm/dashboard?period=${period}`)

      if (!response.ok) {
        throw new Error('Failed to fetch dashboard data')
      }

      const data = await response.json()
      setDashboardData(data)

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to load dashboard data'
      setError(errorMessage)

      await errorMonitor.captureError(
        err instanceof Error ? err : new Error(errorMessage),
        {
          component: 'CRMDashboard',
          action: 'fetchDashboardData',
          metadata: { period }
        },
        ['crm', 'dashboard', 'fetch']
      )
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchDashboardData()
  }, [period])

  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount / 100) // Assuming amount is in cents
  }

  // Format percentage
  const formatPercentage = (value: number) => {
    return `${value.toFixed(1)}%`
  }

  // Get status color
  const getStatusColor = (status: string) => {
    return statusColors[status as keyof typeof statusColors] || 'bg-gray-100 text-gray-800'
  }

  // Calculate growth indicators
  const getGrowthIndicator = (current: number, previous: number) => {
    if (previous === 0) return { value: 0, isPositive: true }

    const growth = ((current - previous) / previous) * 100
    return {
      value: Math.abs(growth),
      isPositive: growth >= 0
    }
  }

  if (loading && !dashboardData) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"></div>
          <p className="text-gray-500">Loading dashboard...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="text-red-500 mb-2">Error loading dashboard</div>
          <p className="text-gray-500 text-sm mb-4">{error}</p>
          <Button onClick={fetchDashboardData}>Try Again</Button>
        </div>
      </div>
    )
  }

  if (!dashboardData) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="text-gray-500">No dashboard data available</div>
        </div>
      </div>
    )
  }

  const { summary, customers, appointments, performance } = dashboardData

  return (
    <div className={cn("space-y-6", className)}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">CRM Dashboard</h1>
          <p className="text-gray-600">
            Business overview and key performance indicators
          </p>
        </div>
        <div className="flex items-center gap-4">
          <Select value={period} onValueChange={setPeriod}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7d">Last 7 days</SelectItem>
              <SelectItem value="30d">Last 30 days</SelectItem>
              <SelectItem value="90d">Last 90 days</SelectItem>
              <SelectItem value="1y">Last year</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" onClick={fetchDashboardData}>
            <Activity className="h-4 w-4 mr-2" />
            Refresh
          </Button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0 }}
        >
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Customers</p>
                  <p className="text-3xl font-bold">{summary.totalCustomers}</p>
                  <p className="text-sm text-green-600">
                    {summary.activeCustomers} active
                  </p>
                </div>
                <Users className="h-8 w-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Revenue</p>
                  <p className="text-3xl font-bold">{formatCurrency(summary.totalRevenue)}</p>
                  <p className="text-sm text-gray-600">
                    Avg: {formatCurrency(summary.averageRevenue)}
                  </p>
                </div>
                <DollarSign className="h-8 w-8 text-green-600" />
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Appointments</p>
                  <p className="text-3xl font-bold">{summary.totalAppointments}</p>
                  <p className="text-sm text-green-600">
                    {summary.completedAppointments} completed
                  </p>
                </div>
                <Calendar className="h-8 w-8 text-purple-600" />
              </div>
              </CardContent>
            </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Retention Rate</p>
                  <p className="text-3xl font-bold">{formatPercentage(performance.customerRetentionRate)}</p>
                  <p className="text-sm text-blue-600">
                    Completion: {formatPercentage(performance.appointmentCompletionRate)}
                  </p>
                </div>
                <Target className="h-8 w-8 text-orange-600" />
              </div>
              </CardContent>
            </Card>
        </motion.div>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="customers">Customers</TabsTrigger>
          <TabsTrigger value="appointments">Appointments</TabsTrigger>
          <TabsTrigger value="performance">Performance</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Loyalty Program Overview */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Star className="h-5 w-5" />
                  Loyalty Program
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">Total Points</span>
                    <span className="text-2xl font-bold text-blue-600">
                      {customers.loyaltyMetrics.totalPoints.toLocaleString()}
                    </span>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Bronze</span>
                      <span>{customers.loyaltyMetrics.tierBreakdown.bronze}</span>
                    </div>
                    <Progress
                      value={(customers.loyaltyMetrics.tierBreakdown.bronze / summary.totalCustomers) * 100}
                      className="h-2"
                    />
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Silver</span>
                      <span>{customers.loyaltyMetrics.tierBreakdown.silver}</span>
                    </div>
                    <Progress
                      value={(customers.loyaltyMetrics.tierBreakdown.silver / summary.totalCustomers) * 100}
                      className="h-2"
                    />
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Gold</span>
                      <span>{customers.loyaltyMetrics.tierBreakdown.gold}</span>
                    </div>
                    <Progress
                      value={(customers.loyaltyMetrics.tierBreakdown.gold / summary.totalCustomers) * 100}
                      className="h-2"
                    />
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Platinum</span>
                      <span>{customers.loyaltyMetrics.tierBreakdown.platinum}</span>
                    </div>
                    <Progress
                      value={(customers.loyaltyMetrics.tierBreakdown.platinum / summary.totalCustomers) * 100}
                      className="h-2"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Appointment Status Breakdown */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5" />
                  Appointment Status
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {Object.entries(appointments.statusBreakdown).map(([status, count]) => (
                    <div key={status} className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Badge className={getStatusColor(status)}>
                          {status}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium">{count}</span>
                        <div className="w-16 bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-blue-600 h-2 rounded-full"
                            style={{
                              width: `${summary.totalAppointments > 0 ? (count / summary.totalAppointments) * 100 : 0}%`
                            }}
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="customers" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Top Customers */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Award className="h-5 w-5" />
                  Top Customers
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {customers.topCustomers.slice(0, 5).map((customer, index) => (
                    <div key={customer.id} className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-sm font-medium">
                          {index + 1}
                        </div>
                        <div>
                          <p className="font-medium">{customer.name}</p>
                          <p className="text-sm text-gray-500">{customer.email}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-medium">{formatCurrency(customer.totalSpent)}</p>
                        <Badge variant="outline" className="text-xs">
                          {customer.tier}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Customer Growth */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5" />
                  Customer Growth
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">New Customers</span>
                    <span className="text-2xl font-bold text-green-600">
                      {customers.newCustomers}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">Returning Customers</span>
                    <span className="text-2xl font-bold text-blue-600">
                      {customers.returningCustomers}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">Growth Rate</span>
                    <span className="text-2xl font-bold text-purple-600">
                      {formatPercentage((customers.newCustomers / summary.totalCustomers) * 100)}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="appointments" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Upcoming Appointments */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="h-5 w-5" />
                  Upcoming Appointments
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {appointments.upcomingAppointments.slice(0, 5).map((appointment) => (
                    <div key={appointment.id} className="flex items-start justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-medium">{appointment.customerName}</span>
                          <Badge className={getStatusColor(appointment.status)}>
                            {appointment.status}
                          </Badge>
                        </div>
                        <p className="text-sm text-gray-600">{appointment.stylistName}</p>
                        <p className="text-sm text-gray-600">{appointment.services}</p>
                        <p className="text-xs text-gray-500">
                          {new Date(appointment.dateTime).toLocaleString()}
                        </p>
                      </div>
                    </div>
                  ))}
                  {appointments.upcomingAppointments.length === 0 && (
                    <p className="text-gray-500 text-center py-4">No upcoming appointments</p>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Revenue by Service */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <DollarSign className="h-5 w-5" />
                  Revenue by Service
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {appointments.revenueByService.slice(0, 5).map((service) => (
                    <div key={service.serviceId} className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">{service.serviceName}</p>
                        <p className="text-sm text-gray-500">{service.appointments} appointments</p>
                      </div>
                      <div className="text-right">
                        <p className="font-medium">{formatCurrency(service.revenue)}</p>
                        <p className="text-sm text-gray-500">
                          Avg: {formatCurrency(service.revenue / service.appointments)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="performance" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Customer Retention</p>
                    <p className="text-2xl font-bold">{formatPercentage(performance.customerRetentionRate)}</p>
                  </div>
                  <Target className="h-8 w-8 text-green-600" />
                </div>
                <Progress value={performance.customerRetentionRate} className="h-2" />
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Appointment Completion</p>
                    <p className="text-2xl font-bold">{formatPercentage(performance.appointmentCompletionRate)}</p>
                  </div>
                  <CheckCircle className="h-8 w-8 text-blue-600" />
                </div>
                <Progress value={performance.appointmentCompletionRate} className="h-2" />
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Avg Appointments/Customer</p>
                    <p className="text-2xl font-bold">{performance.averageAppointmentsPerCustomer.toFixed(1)}</p>
                  </div>
                  <Calendar className="h-8 w-8 text-purple-600" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Revenue/Customer</p>
                    <p className="text-2xl font-bold">{formatCurrency(performance.revenuePerCustomer)}</p>
                  </div>
                  <DollarSign className="h-8 w-8 text-green-600" />
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
