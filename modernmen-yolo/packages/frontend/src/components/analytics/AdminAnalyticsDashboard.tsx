'use client'

import React, { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Progress } from '@/components/ui/progress'
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  AreaChart,
  Area,
  ComposedChart,
  ScatterChart,
  Scatter,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis
} from 'recharts'
import {
  TrendingUp,
  TrendingDown,
  DollarSign,
  Users,
  UserPlus,
  Calendar,
  Star,
  Target,
  Award,
  Activity,
  Download,
  RefreshCw,
  Filter,
  BarChart3,
  PieChart as PieChartIcon,
  LineChart as LineChartIcon,
  ScatterChart as ScatterChartIcon,
  Eye,
  MousePointer,
  Clock,
  Smartphone,
  Globe,
  Monitor
} from 'lucide-react'

// Mock comprehensive analytics data
const analyticsData = {
  overview: {
    totalRevenue: 45230,
    totalAppointments: 156,
    totalCustomers: 234,
    averageRating: 4.8,
    conversionRate: 12.5,
    customerRetention: 75,
    monthlyGrowth: 15.2
  },

  revenue: {
    monthly: [
      { month: 'Jan', revenue: 35200, appointments: 120, customers: 89 },
      { month: 'Feb', revenue: 38900, appointments: 135, customers: 95 },
      { month: 'Mar', revenue: 42100, appointments: 142, customers: 102 },
      { month: 'Apr', revenue: 39800, appointments: 138, customers: 98 },
      { month: 'May', revenue: 45230, appointments: 156, customers: 115 },
    ],
    byService: [
      { service: 'Haircut', revenue: 18250, percentage: 40.3 },
      { service: 'Beard Grooming', revenue: 12400, percentage: 27.4 },
      { service: 'Hair & Beard Combo', revenue: 9850, percentage: 21.8 },
      { service: 'Color Treatment', revenue: 3180, percentage: 7.0 },
      { service: 'Other', revenue: 1550, percentage: 3.4 }
    ]
  },

  customers: {
    demographics: [
      { age: '18-24', count: 45, percentage: 19.2 },
      { age: '25-34', count: 89, percentage: 38.0 },
      { age: '35-44', count: 67, percentage: 28.6 },
      { age: '45-54', count: 28, percentage: 12.0 },
      { age: '55+', count: 5, percentage: 2.1 }
    ],
    loyalty: {
      bronze: 45,
      silver: 67,
      gold: 89,
      platinum: 33
    },
    behavior: {
      newCustomers: 23,
      returningCustomers: 89,
      avgVisitsPerMonth: 2.3,
      avgSpendPerVisit: 75
    }
  },

  performance: {
    staffUtilization: [
      { staff: 'Mike Johnson', utilization: 85, revenue: 12400 },
      { staff: 'Sarah Davis', utilization: 92, revenue: 11800 },
      { staff: 'Alex Rodriguez', utilization: 78, revenue: 15600 },
      { staff: 'John Smith', utilization: 88, revenue: 11200 }
    ],
    servicePopularity: [
      { service: 'Haircut', bookings: 89, rating: 4.7 },
      { service: 'Beard Grooming', bookings: 67, rating: 4.9 },
      { service: 'Hair & Beard Combo', bookings: 45, rating: 4.8 },
      { service: 'Color Treatment', bookings: 23, rating: 4.6 },
      { service: 'Styling', bookings: 18, rating: 4.5 }
    ]
  },

  marketing: {
    channels: [
      { channel: 'Organic Search', visitors: 1250, conversions: 45, revenue: 11250 },
      { channel: 'Social Media', visitors: 890, conversions: 32, revenue: 8900 },
      { channel: 'Direct', visitors: 650, conversions: 28, revenue: 7200 },
      { channel: 'Email', visitors: 430, conversions: 18, revenue: 4800 },
      { channel: 'Referral', visitors: 320, conversions: 15, revenue: 3600 }
    ],
    campaigns: [
      { name: 'Summer Special', impressions: 12500, clicks: 890, conversions: 34 },
      { name: 'Loyalty Launch', impressions: 8900, clicks: 645, conversions: 28 },
      { name: 'New Customer', impressions: 15600, clicks: 1120, conversions: 42 }
    ]
  },

  technical: {
    pageViews: [
      { page: '/', views: 5420, bounce: 35, time: 180 },
      { page: '/services', views: 3210, bounce: 28, time: 240 },
      { page: '/book', views: 2890, bounce: 22, time: 320 },
      { page: '/team', views: 1980, bounce: 45, time: 160 },
      { page: '/contact', views: 1650, bounce: 38, time: 120 }
    ],
    devices: [
      { device: 'Mobile', users: 1420, percentage: 62 },
      { device: 'Desktop', users: 680, percentage: 30 },
      { device: 'Tablet', users: 190, percentage: 8 }
    ],
    realtime: {
      activeUsers: 23,
      pageViewsToday: 156,
      appointmentsToday: 8,
      revenueToday: 1200
    }
  }
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8']

export function AdminAnalyticsDashboard() {
  const [timeRange, setTimeRange] = useState('30d')
  const [selectedMetric, setSelectedMetric] = useState('revenue')
  const [isLoading, setIsLoading] = useState(false)
  const [lastUpdated, setLastUpdated] = useState(new Date())

  const handleRefresh = async () => {
    setIsLoading(true)
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000))
    setLastUpdated(new Date())
    setIsLoading(false)
  }

  const exportData = (format: 'csv' | 'pdf' | 'xlsx') => {
    // Mock export functionality
    // Data export initiated
    // In real implementation, this would trigger a download
  }

  return (
    <div className="space-y-6">
      {/* Header Controls */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold">Analytics Dashboard</h1>
          <p className="text-muted-foreground">
            Comprehensive business intelligence and performance metrics
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Select value={timeRange} onValueChange={setTimeRange}>
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

          <Button
            variant="outline"
            size="sm"
            onClick={handleRefresh}
            disabled={isLoading}
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={() => exportData('csv')}
          >
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      {/* Last Updated */}
      <div className="text-sm text-muted-foreground">
        Last updated: {lastUpdated.toLocaleString()}
      </div>

      {/* Overview Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Revenue</p>
                <p className="text-2xl font-bold">${analyticsData.overview.totalRevenue.toLocaleString()}</p>
                <div className="flex items-center gap-1 text-xs">
                  <TrendingUp className="h-3 w-3 text-green-500" />
                  <span className="text-green-500">+{analyticsData.overview.monthlyGrowth}%</span>
                </div>
              </div>
              <DollarSign className="h-8 w-8 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Appointments</p>
                <p className="text-2xl font-bold">{analyticsData.overview.totalAppointments}</p>
                <div className="flex items-center gap-1 text-xs">
                  <TrendingUp className="h-3 w-3 text-green-500" />
                  <span className="text-green-500">+12.5%</span>
                </div>
              </div>
              <Calendar className="h-8 w-8 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Active Customers</p>
                <p className="text-2xl font-bold">{analyticsData.overview.totalCustomers}</p>
                <div className="flex items-center gap-1 text-xs">
                  <TrendingUp className="h-3 w-3 text-green-500" />
                  <span className="text-green-500">+8.2%</span>
                </div>
              </div>
              <Users className="h-8 w-8 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Average Rating</p>
                <p className="text-2xl font-bold">{analyticsData.overview.averageRating}</p>
                <div className="flex items-center gap-1 text-xs">
                  <Star className="h-3 w-3 text-yellow-500 fill-current" />
                  <span className="text-yellow-600">4.8/5</span>
                </div>
              </div>
              <Star className="h-8 w-8 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Analytics Tabs */}
      <Tabs defaultValue="revenue" className="w-full">
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="revenue">Revenue</TabsTrigger>
          <TabsTrigger value="customers">Customers</TabsTrigger>
          <TabsTrigger value="performance">Performance</TabsTrigger>
          <TabsTrigger value="marketing">Marketing</TabsTrigger>
          <TabsTrigger value="technical">Technical</TabsTrigger>
          <TabsTrigger value="realtime">Real-time</TabsTrigger>
        </TabsList>

        {/* Revenue Analytics */}
        <TabsContent value="revenue" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Revenue Trend</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <ComposedChart data={analyticsData.revenue.monthly}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis yAxisId="left" />
                    <YAxis yAxisId="right" orientation="right" />
                    <Tooltip />
                    <Legend />
                    <Bar yAxisId="left" dataKey="revenue" fill="#8884d8" name="Revenue ($)" />
                    <Line yAxisId="right" type="monotone" dataKey="appointments" stroke="#82ca9d" name="Appointments" />
                  </ComposedChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Revenue by Service</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={analyticsData.revenue.byService}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percentage }) => `${name}: ${percentage}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="revenue"
                    >
                      {analyticsData.revenue.byService.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Customer Analytics */}
        <TabsContent value="customers" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Customer Demographics</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={analyticsData.customers.demographics}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="age" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="count" fill="#8884d8" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Loyalty Program Distribution</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {Object.entries(analyticsData.customers.loyalty).map(([tier, count]) => (
                    <div key={tier} className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Award className="h-4 w-4" />
                        <span className="capitalize">{tier}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Progress value={(count / 234) * 100} className="w-20" />
                        <span className="text-sm font-medium">{count}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Customer Behavior Metrics */}
          <div className="grid gap-4 md:grid-cols-4">
            <Card>
              <CardContent className="pt-6">
                <div className="text-center">
                  <UserPlus className="h-8 w-8 mx-auto mb-2 text-green-500" />
                  <p className="text-2xl font-bold">{analyticsData.customers.behavior.newCustomers}</p>
                  <p className="text-sm text-muted-foreground">New Customers</p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="text-center">
                  <Users className="h-8 w-8 mx-auto mb-2 text-blue-500" />
                  <p className="text-2xl font-bold">{analyticsData.customers.behavior.returningCustomers}</p>
                  <p className="text-sm text-muted-foreground">Returning</p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="text-center">
                  <Activity className="h-8 w-8 mx-auto mb-2 text-purple-500" />
                  <p className="text-2xl font-bold">{analyticsData.customers.behavior.avgVisitsPerMonth}</p>
                  <p className="text-sm text-muted-foreground">Avg Visits/Month</p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="text-center">
                  <DollarSign className="h-8 w-8 mx-auto mb-2 text-yellow-500" />
                  <p className="text-2xl font-bold">${analyticsData.customers.behavior.avgSpendPerVisit}</p>
                  <p className="text-sm text-muted-foreground">Avg Spend/Visit</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Performance Analytics */}
        <TabsContent value="performance" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Staff Utilization</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={analyticsData.performance.staffUtilization}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="staff" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="utilization" fill="#8884d8" name="Utilization %" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Service Popularity</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <ComposedChart data={analyticsData.performance.servicePopularity}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="service" />
                    <YAxis yAxisId="left" />
                    <YAxis yAxisId="right" orientation="right" />
                    <Tooltip />
                    <Legend />
                    <Bar yAxisId="left" dataKey="bookings" fill="#8884d8" name="Bookings" />
                    <Line yAxisId="right" type="monotone" dataKey="rating" stroke="#82ca9d" name="Rating" />
                  </ComposedChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Marketing Analytics */}
        <TabsContent value="marketing" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Traffic by Channel</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={analyticsData.marketing.channels}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="channel" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="visitors" fill="#8884d8" name="Visitors" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Campaign Performance</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {analyticsData.marketing.campaigns.map((campaign, index) => (
                    <div key={index} className="border rounded-lg p-4">
                      <div className="flex justify-between items-start mb-2">
                        <h4 className="font-medium">{campaign.name}</h4>
                        <Badge variant="secondary">
                          {((campaign.conversions / campaign.clicks) * 100).toFixed(1)}% CTR
                        </Badge>
                      </div>
                      <div className="grid grid-cols-3 gap-4 text-sm">
                        <div>
                          <p className="text-muted-foreground">Impressions</p>
                          <p className="font-medium">{campaign.impressions.toLocaleString()}</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Clicks</p>
                          <p className="font-medium">{campaign.clicks.toLocaleString()}</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Conversions</p>
                          <p className="font-medium">{campaign.conversions}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Technical Analytics */}
        <TabsContent value="technical" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Page Performance</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={analyticsData.technical.pageViews}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="page" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="views" fill="#8884d8" name="Page Views" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Device Usage</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={analyticsData.technical.devices}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ device, percentage }) => `${device}: ${percentage}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="users"
                    >
                      {analyticsData.technical.devices.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          {/* Device Breakdown */}
          <div className="grid gap-4 md:grid-cols-3">
            {analyticsData.technical.devices.map((device, index) => (
              <Card key={index}>
                <CardContent className="pt-6">
                  <div className="flex items-center gap-3">
                    {device.device === 'Mobile' && <Smartphone className="h-8 w-8 text-blue-500" />}
                    {device.device === 'Desktop' && <Monitor className="h-8 w-8 text-green-500" />}
                    {device.device === 'Tablet' && <Tablet className="h-8 w-8 text-purple-500" />}
                    <div>
                      <p className="font-medium">{device.device}</p>
                      <p className="text-sm text-muted-foreground">{device.percentage}% of users</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Real-time Analytics */}
        <TabsContent value="realtime" className="space-y-6">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardContent className="pt-6">
                <div className="text-center">
                  <Users className="h-8 w-8 mx-auto mb-2 text-blue-500" />
                  <p className="text-2xl font-bold">{analyticsData.technical.realtime.activeUsers}</p>
                  <p className="text-sm text-muted-foreground">Active Users</p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="text-center">
                  <Eye className="h-8 w-8 mx-auto mb-2 text-green-500" />
                  <p className="text-2xl font-bold">{analyticsData.technical.realtime.pageViewsToday}</p>
                  <p className="text-sm text-muted-foreground">Page Views Today</p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="text-center">
                  <Calendar className="h-8 w-8 mx-auto mb-2 text-purple-500" />
                  <p className="text-2xl font-bold">{analyticsData.technical.realtime.appointmentsToday}</p>
                  <p className="text-sm text-muted-foreground">Appointments Today</p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="text-center">
                  <DollarSign className="h-8 w-8 mx-auto mb-2 text-yellow-500" />
                  <p className="text-2xl font-bold">${analyticsData.technical.realtime.revenueToday}</p>
                  <p className="text-sm text-muted-foreground">Revenue Today</p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Real-time Activity Feed */}
          <Card>
            <CardHeader>
              <CardTitle>Live Activity Feed</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center gap-3 p-3 bg-muted/50 rounded">
                  <MousePointer className="h-4 w-4 text-blue-500" />
                  <div className="flex-1">
                    <p className="text-sm">New user visited /services page</p>
                    <p className="text-xs text-muted-foreground">2 minutes ago</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-3 bg-muted/50 rounded">
                  <Calendar className="h-4 w-4 text-green-500" />
                  <div className="flex-1">
                    <p className="text-sm">Appointment booked for tomorrow</p>
                    <p className="text-xs text-muted-foreground">5 minutes ago</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-3 bg-muted/50 rounded">
                  <Star className="h-4 w-4 text-yellow-500" />
                  <div className="flex-1">
                    <p className="text-sm">5-star review submitted</p>
                    <p className="text-xs text-muted-foreground">8 minutes ago</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-3 bg-muted/50 rounded">
                  <Users className="h-4 w-4 text-purple-500" />
                  <div className="flex-1">
                    <p className="text-sm">New customer registered</p>
                    <p className="text-xs text-muted-foreground">12 minutes ago</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

// Mock Tablet icon since it's not imported
const Tablet = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
  </svg>
)
