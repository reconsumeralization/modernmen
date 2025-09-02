"use client"

import React, { useState, useEffect } from 'react'
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  AreaChart,
  Area,
  ComposedChart,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  ScatterChart,
  Scatter,
} from 'recharts'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import {
  TrendingUp,
  TrendingDown,
  DollarSign,
  Calendar,
  Target,
  Zap,
  Download,
  RefreshCw,
  BarChart3,
  PieChart as PieChartIcon,
  LineChart as LineChartIcon,
  ScatterChart as ScatterChartIcon,
  Filter,
  Eye,
  EyeOff,
} from 'lucide-react'

// Mock revenue data with detailed breakdowns
const mockRevenueData = [
  {
    month: 'Jan 2024',
    totalRevenue: 15200,
    serviceRevenue: 12800,
    productRevenue: 2400,
    appointments: 145,
    avgServiceValue: 88,
    growth: 8.5,
    topService: 'Classic Haircut',
    customerRetention: 72,
  },
  {
    month: 'Feb 2024',
    totalRevenue: 16800,
    serviceRevenue: 14200,
    productRevenue: 2600,
    appointments: 158,
    avgServiceValue: 90,
    growth: 10.5,
    topService: 'Hair & Beard Combo',
    customerRetention: 75,
  },
  {
    month: 'Mar 2024',
    totalRevenue: 14500,
    serviceRevenue: 12200,
    productRevenue: 2300,
    appointments: 142,
    avgServiceValue: 86,
    growth: -13.7,
    topService: 'Beard Grooming',
    customerRetention: 68,
  },
  {
    month: 'Apr 2024',
    totalRevenue: 18200,
    serviceRevenue: 15400,
    productRevenue: 2800,
    appointments: 165,
    avgServiceValue: 93,
    growth: 25.5,
    topService: 'Classic Haircut',
    customerRetention: 78,
  },
  {
    month: 'May 2024',
    totalRevenue: 19600,
    serviceRevenue: 16600,
    productRevenue: 3000,
    appointments: 172,
    avgServiceValue: 97,
    growth: 7.7,
    topService: 'Hair & Beard Combo',
    customerRetention: 81,
  },
  {
    month: 'Jun 2024',
    totalRevenue: 22100,
    serviceRevenue: 18700,
    productRevenue: 3400,
    appointments: 185,
    avgServiceValue: 101,
    growth: 12.8,
    topService: 'Hot Towel Shave',
    customerRetention: 84,
  },
  {
    month: 'Jul 2024',
    totalRevenue: 23800,
    serviceRevenue: 20100,
    productRevenue: 3700,
    appointments: 192,
    avgServiceValue: 105,
    growth: 7.7,
    topService: 'Classic Haircut',
    customerRetention: 86,
  },
  {
    month: 'Aug 2024',
    totalRevenue: 25200,
    serviceRevenue: 21300,
    productRevenue: 3900,
    appointments: 198,
    avgServiceValue: 108,
    growth: 5.9,
    topService: 'Hair & Beard Combo',
    customerRetention: 88,
  },
  {
    month: 'Sep 2024',
    totalRevenue: 26700,
    serviceRevenue: 22600,
    productRevenue: 4100,
    appointments: 205,
    avgServiceValue: 110,
    growth: 5.9,
    topService: 'Beard Grooming',
    customerRetention: 89,
  },
  {
    month: 'Oct 2024',
    totalRevenue: 28900,
    serviceRevenue: 24400,
    productRevenue: 4500,
    appointments: 215,
    avgServiceValue: 113,
    growth: 8.2,
    topService: 'Hot Towel Shave',
    customerRetention: 91,
  },
  {
    month: 'Nov 2024',
    totalRevenue: 31200,
    serviceRevenue: 26400,
    productRevenue: 4800,
    appointments: 228,
    avgServiceValue: 116,
    growth: 8.0,
    topService: 'Classic Haircut',
    customerRetention: 93,
  },
  {
    month: 'Dec 2024',
    totalRevenue: 33800,
    serviceRevenue: 28600,
    productRevenue: 5200,
    appointments: 242,
    avgServiceValue: 118,
    growth: 8.3,
    topService: 'Hair & Beard Combo',
    customerRetention: 94,
  },
]

const mockServiceBreakdown = [
  { name: 'Classic Haircut', revenue: 12500, percentage: 37, color: '#2563eb' },
  { name: 'Hair & Beard Combo', revenue: 9800, percentage: 29, color: '#16a34a' },
  { name: 'Beard Grooming', revenue: 6200, percentage: 18, color: '#ca8a04' },
  { name: 'Hot Towel Shave', revenue: 4200, percentage: 12, color: '#dc2626' },
  { name: 'Other Services', revenue: 1100, percentage: 4, color: '#9333ea' },
]

const mockHourlyRevenue = [
  { hour: '9:00', revenue: 450, appointments: 3 },
  { hour: '10:00', revenue: 890, appointments: 6 },
  { hour: '11:00', revenue: 1200, appointments: 8 },
  { hour: '12:00', revenue: 1450, appointments: 10 },
  { hour: '13:00', revenue: 980, appointments: 7 },
  { hour: '14:00', revenue: 1350, appointments: 9 },
  { hour: '15:00', revenue: 1650, appointments: 11 },
  { hour: '16:00', revenue: 1420, appointments: 10 },
  { hour: '17:00', revenue: 1180, appointments: 8 },
  { hour: '18:00', revenue: 780, appointments: 5 },
]

const mockSeasonalData = [
  { season: 'Winter', revenue: 65700, avgTemp: 35, bookings: 545 },
  { season: 'Spring', revenue: 72300, avgTemp: 65, bookings: 597 },
  { season: 'Summer', revenue: 77800, avgTemp: 85, bookings: 635 },
  { season: 'Fall', revenue: 94900, avgTemp: 55, bookings: 783 },
]

interface RevenueAnalyticsProps {
  className?: string
}

export function RevenueAnalytics({ className }: RevenueAnalyticsProps) {
  const [timeRange, setTimeRange] = useState('12m')
  const [chartType, setChartType] = useState('line')
  const [showServiceBreakdown, setShowServiceBreakdown] = useState(true)
  const [showProductRevenue, setShowProductRevenue] = useState(true)
  const [isLoading, setIsLoading] = useState(false)

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
    }).format(value)
  }

  const formatPercentage = (value: number) => {
    return `${value > 0 ? '+' : ''}${value.toFixed(1)}%`
  }

  const handleRefresh = async () => {
    setIsLoading(true)
    setTimeout(() => setIsLoading(false), 1000)
  }

  const handleExport = () => {
    // Mock export functionality
    console.log('Exporting revenue data...')
  }

  const totalRevenue = mockRevenueData.reduce((sum, month) => sum + month.totalRevenue, 0)
  const totalAppointments = mockRevenueData.reduce((sum, month) => sum + month.appointments, 0)
  const avgServiceValue = totalRevenue / totalAppointments
  const growthRate = mockRevenueData[mockRevenueData.length - 1].growth

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Revenue Analytics</h1>
          <p className="text-muted-foreground">
            Comprehensive revenue insights and financial performance metrics
          </p>
        </div>
        <div className="flex items-center gap-4">
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="3m">3 Months</SelectItem>
              <SelectItem value="6m">6 Months</SelectItem>
              <SelectItem value="12m">12 Months</SelectItem>
              <SelectItem value="24m">24 Months</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" onClick={handleRefresh} disabled={isLoading}>
            <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
          <Button variant="outline" onClick={handleExport}>
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(totalRevenue)}</div>
            <div className="flex items-center text-xs text-muted-foreground">
              <TrendingUp className="h-3 w-3 mr-1 text-green-500" />
              {formatPercentage(growthRate)} vs last period
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Service Value</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(avgServiceValue)}</div>
            <div className="flex items-center text-xs text-muted-foreground">
              <TrendingUp className="h-3 w-3 mr-1 text-green-500" />
              {formatPercentage(5.2)} vs last period
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Appointments</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalAppointments.toLocaleString()}</div>
            <div className="flex items-center text-xs text-muted-foreground">
              <TrendingUp className="h-3 w-3 mr-1 text-green-500" />
              {formatPercentage(8.7)} vs last period
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Revenue per Customer</CardTitle>
            <Zap className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(totalRevenue / totalAppointments)}</div>
            <div className="flex items-center text-xs text-muted-foreground">
              <TrendingUp className="h-3 w-3 mr-1 text-green-500" />
              {formatPercentage(3.1)} vs last period
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Analytics Tabs */}
      <Tabs defaultValue="trends" className="space-y-6">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="trends" className="flex items-center gap-2">
            <LineChartIcon className="h-4 w-4" />
            Trends
          </TabsTrigger>
          <TabsTrigger value="breakdown" className="flex items-center gap-2">
            <PieChartIcon className="h-4 w-4" />
            Breakdown
          </TabsTrigger>
          <TabsTrigger value="performance" className="flex items-center gap-2">
            <BarChart3 className="h-4 w-4" />
            Performance
          </TabsTrigger>
          <TabsTrigger value="seasonal" className="flex items-center gap-2">
            <ScatterChartIcon className="h-4 w-4" />
            Seasonal
          </TabsTrigger>
          <TabsTrigger value="insights" className="flex items-center gap-2">
            <Target className="h-4 w-4" />
            Insights
          </TabsTrigger>
        </TabsList>

        {/* Trends Tab */}
        <TabsContent value="trends" className="space-y-6">
          <div className="flex items-center gap-4 mb-4">
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setChartType('line')}
                className={chartType === 'line' ? 'bg-primary text-primary-foreground' : ''}
              >
                <LineChartIcon className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setChartType('bar')}
                className={chartType === 'bar' ? 'bg-primary text-primary-foreground' : ''}
              >
                <BarChart3 className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setChartType('area')}
                className={chartType === 'area' ? 'bg-primary text-primary-foreground' : ''}
              >
                <BarChart3 className="h-4 w-4" />
              </Button>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowServiceBreakdown(!showServiceBreakdown)}
              >
                {showServiceBreakdown ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
                Services
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowProductRevenue(!showProductRevenue)}
              >
                {showProductRevenue ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
                Products
              </Button>
            </div>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Revenue Trends</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={400}>
                {chartType === 'line' ? (
                  <LineChart data={mockRevenueData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis tickFormatter={formatCurrency} />
                    <Tooltip formatter={(value: number) => [formatCurrency(value), 'Revenue']} />
                    <Legend />
                    <Line
                      type="monotone"
                      dataKey="totalRevenue"
                      stroke="#2563eb"
                      strokeWidth={3}
                      name="Total Revenue"
                    />
                    {showServiceBreakdown && (
                      <Line
                        type="monotone"
                        dataKey="serviceRevenue"
                        stroke="#16a34a"
                        strokeWidth={2}
                        name="Service Revenue"
                      />
                    )}
                    {showProductRevenue && (
                      <Line
                        type="monotone"
                        dataKey="productRevenue"
                        stroke="#ca8a04"
                        strokeWidth={2}
                        name="Product Revenue"
                      />
                    )}
                  </LineChart>
                ) : chartType === 'bar' ? (
                  <BarChart data={mockRevenueData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis tickFormatter={formatCurrency} />
                    <Tooltip formatter={(value: number) => [formatCurrency(value), 'Revenue']} />
                    <Legend />
                    <Bar dataKey="totalRevenue" fill="#2563eb" name="Total Revenue" />
                    {showServiceBreakdown && (
                      <Bar dataKey="serviceRevenue" fill="#16a34a" name="Service Revenue" />
                    )}
                    {showProductRevenue && (
                      <Bar dataKey="productRevenue" fill="#ca8a04" name="Product Revenue" />
                    )}
                  </BarChart>
                ) : (
                  <AreaChart data={mockRevenueData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis tickFormatter={formatCurrency} />
                    <Tooltip formatter={(value: number) => [formatCurrency(value), 'Revenue']} />
                    <Legend />
                    <Area
                      type="monotone"
                      dataKey="totalRevenue"
                      stackId="1"
                      stroke="#2563eb"
                      fill="#2563eb"
                      fillOpacity={0.6}
                      name="Total Revenue"
                    />
                    {showServiceBreakdown && (
                      <Area
                        type="monotone"
                        dataKey="serviceRevenue"
                        stackId="1"
                        stroke="#16a34a"
                        fill="#16a34a"
                        fillOpacity={0.6}
                        name="Service Revenue"
                      />
                    )}
                    {showProductRevenue && (
                      <Area
                        type="monotone"
                        dataKey="productRevenue"
                        stackId="1"
                        stroke="#ca8a04"
                        fill="#ca8a04"
                        fillOpacity={0.6}
                        name="Product Revenue"
                      />
                    )}
                  </AreaChart>
                )}
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Breakdown Tab */}
        <TabsContent value="breakdown" className="space-y-6">
          <div className="grid gap-6 lg:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Service Revenue Breakdown</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={mockServiceBreakdown}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percentage }) => `${name} ${percentage}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="revenue"
                    >
                      {mockServiceBreakdown.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value: number) => [formatCurrency(value), 'Revenue']} />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Revenue by Service</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {mockServiceBreakdown.map((service) => (
                    <div key={service.name} className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>{service.name}</span>
                        <span className="font-medium">{formatCurrency(service.revenue)}</span>
                      </div>
                      <div className="w-full bg-secondary rounded-full h-2">
                        <div
                          className="h-2 rounded-full"
                          style={{
                            width: `${service.percentage}%`,
                            backgroundColor: service.color
                          }}
                        />
                      </div>
                      <div className="text-xs text-muted-foreground text-right">
                        {service.percentage}% of total
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Performance Tab */}
        <TabsContent value="performance" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Hourly Revenue Performance</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={400}>
                <ComposedChart data={mockHourlyRevenue}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="hour" />
                  <YAxis yAxisId="revenue" orientation="left" tickFormatter={formatCurrency} />
                  <YAxis yAxisId="appointments" orientation="right" />
                  <Tooltip
                    formatter={(value: number, name: string) => [
                      name === 'Revenue' ? formatCurrency(value) : value,
                      name
                    ]}
                  />
                  <Legend />
                  <Bar yAxisId="revenue" dataKey="revenue" fill="#2563eb" name="Revenue" />
                  <Line
                    yAxisId="appointments"
                    type="monotone"
                    dataKey="appointments"
                    stroke="#dc2626"
                    strokeWidth={3}
                    name="Appointments"
                  />
                </ComposedChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Seasonal Tab */}
        <TabsContent value="seasonal" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Seasonal Revenue Analysis</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={400}>
                <ScatterChart data={mockSeasonalData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="avgTemp" name="Average Temperature (°F)" />
                  <YAxis dataKey="revenue" name="Revenue" tickFormatter={formatCurrency} />
                  <Tooltip
                    formatter={(value: number, name: string) => [
                      name === 'Revenue' ? formatCurrency(value) : `${value}°F`,
                      name
                    ]}
                  />
                  <Scatter dataKey="revenue" fill="#2563eb" />
                </ScatterChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {mockSeasonalData.map((season) => (
              <Card key={season.season}>
                <CardHeader className="pb-2">
                  <CardTitle className="text-base">{season.season}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{formatCurrency(season.revenue)}</div>
                  <div className="text-sm text-muted-foreground">
                    {season.bookings} bookings
                  </div>
                  <div className="text-xs text-muted-foreground mt-1">
                    Avg temp: {season.avgTemp}°F
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Insights Tab */}
        <TabsContent value="insights" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-green-500" />
                  Key Insights
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                    <div>
                      <div className="font-medium">Peak Performance Hours</div>
                      <div className="text-sm text-muted-foreground">
                        3:00 PM - 4:00 PM generates the highest revenue per hour
                      </div>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                    <div>
                      <div className="font-medium">Service Popularity</div>
                      <div className="text-sm text-muted-foreground">
                        Classic Haircut represents 37% of total revenue
                      </div>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-purple-500 rounded-full mt-2"></div>
                    <div>
                      <div className="font-medium">Growth Trend</div>
                      <div className="text-sm text-muted-foreground">
                        Consistent 8% monthly growth over the past year
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="h-5 w-5 text-blue-500" />
                  Recommendations
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-yellow-500 rounded-full mt-2"></div>
                    <div>
                      <div className="font-medium">Optimize Peak Hours</div>
                      <div className="text-sm text-muted-foreground">
                        Add more staff during 3:00 PM - 4:00 PM for increased capacity
                      </div>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                    <div>
                      <div className="font-medium">Product Upselling</div>
                      <div className="text-sm text-muted-foreground">
                        Focus on product sales during high-revenue services
                      </div>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-red-500 rounded-full mt-2"></div>
                    <div>
                      <div className="font-medium">Seasonal Marketing</div>
                      <div className="text-sm text-muted-foreground">
                        Target summer promotions when revenue naturally increases
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Performance Metrics */}
          <Card>
            <CardHeader>
              <CardTitle>Performance Metrics Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-6 md:grid-cols-3">
                <div className="text-center">
                  <div className="text-3xl font-bold text-green-600 mb-2">
                    {formatPercentage(growthRate)}
                  </div>
                  <div className="text-sm text-muted-foreground">Revenue Growth</div>
                  <div className="w-full bg-secondary rounded-full h-2 mt-2">
                    <div className="bg-green-500 h-2 rounded-full" style={{ width: '85%' }}></div>
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-blue-600 mb-2">
                    {formatCurrency(avgServiceValue)}
                  </div>
                  <div className="text-sm text-muted-foreground">Avg Service Value</div>
                  <div className="w-full bg-secondary rounded-full h-2 mt-2">
                    <div className="bg-blue-500 h-2 rounded-full" style={{ width: '78%' }}></div>
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-purple-600 mb-2">
                    91%
                  </div>
                  <div className="text-sm text-muted-foreground">Capacity Utilization</div>
                  <div className="w-full bg-secondary rounded-full h-2 mt-2">
                    <div className="bg-purple-500 h-2 rounded-full" style={{ width: '91%' }}></div>
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
