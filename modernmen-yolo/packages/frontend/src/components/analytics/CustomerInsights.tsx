"use client"

import React, { useState, useEffect } from 'react'
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  ComposedChart,
  Area,
  AreaChart,
} from 'recharts'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Progress } from '@/components/ui/progress'
import {
  Users,
  TrendingUp,
  Star,
  Heart,
  Target,
  Calendar,
  DollarSign,
  Award,
  UserPlus,
  UserMinus,
  Activity,
  BarChart3,
  PieChart as PieChartIcon,
  Download,
  RefreshCw,
  Filter,
  Eye,
  EyeOff,
} from 'lucide-react'

// Mock customer data for comprehensive analytics
const mockCustomerSegments = [
  { segment: 'Premium Clients', count: 145, percentage: 29, avgSpend: 180, color: '#2563eb' },
  { segment: 'Regular Clients', count: 198, percentage: 40, avgSpend: 95, color: '#16a34a' },
  { segment: 'Occasional', count: 112, percentage: 22, avgSpend: 55, color: '#ca8a04' },
  { segment: 'New Clients', count: 45, percentage: 9, avgSpend: 35, color: '#dc2626' },
]

const mockLoyaltyTiers = [
  { tier: 'Bronze', customers: 265, benefits: '5% discount', color: '#cd7f32' },
  { tier: 'Silver', customers: 145, benefits: '10% discount + free drink', color: '#c0c0c0' },
  { tier: 'Gold', customers: 78, benefits: '15% discount + priority booking', color: '#ffd700' },
  { tier: 'Platinum', customers: 12, benefits: '20% discount + VIP treatment', color: '#e5e4e2' },
]

const mockCustomerJourney = [
  { stage: 'Awareness', customers: 500, conversion: 100, dropoff: 0 },
  { stage: 'Interest', customers: 400, conversion: 80, dropoff: 20 },
  { stage: 'Consideration', customers: 320, conversion: 64, dropoff: 16 },
  { stage: 'Purchase', customers: 256, conversion: 51, dropoff: 13 },
  { stage: 'Retention', customers: 205, conversion: 41, dropoff: 10 },
  { stage: 'Advocacy', customers: 164, conversion: 33, dropoff: 8 },
]

const mockDemographics = [
  { age: '18-24', count: 85, percentage: 17, avgSpend: 65 },
  { age: '25-34', count: 156, percentage: 31, avgSpend: 95 },
  { age: '35-44', count: 128, percentage: 26, avgSpend: 125 },
  { age: '45-54', count: 78, percentage: 16, avgSpend: 145 },
  { age: '55+', count: 53, percentage: 10, avgSpend: 110 },
]

const mockSatisfactionData = [
  { month: 'Jan', satisfaction: 4.2, reviews: 45, recommendations: 78 },
  { month: 'Feb', satisfaction: 4.3, reviews: 52, recommendations: 85 },
  { month: 'Mar', satisfaction: 4.1, reviews: 48, recommendations: 72 },
  { month: 'Apr', satisfaction: 4.4, reviews: 61, recommendations: 92 },
  { month: 'May', satisfaction: 4.5, reviews: 58, recommendations: 94 },
  { month: 'Jun', satisfaction: 4.6, reviews: 67, recommendations: 96 },
  { month: 'Jul', satisfaction: 4.7, reviews: 72, recommendations: 98 },
  { month: 'Aug', satisfaction: 4.6, reviews: 69, recommendations: 95 },
  { month: 'Sep', satisfaction: 4.8, reviews: 75, recommendations: 97 },
  { month: 'Oct', satisfaction: 4.7, reviews: 78, recommendations: 96 },
  { month: 'Nov', satisfaction: 4.8, reviews: 82, recommendations: 98 },
  { month: 'Dec', satisfaction: 4.9, reviews: 89, recommendations: 99 },
]

const mockRetentionData = [
  { cohort: 'Jan 2024', month1: 100, month3: 75, month6: 65, month12: 55 },
  { cohort: 'Feb 2024', month1: 100, month3: 78, month6: 68, month12: null },
  { cohort: 'Mar 2024', month1: 100, month3: 82, month6: null, month12: null },
  { cohort: 'Apr 2024', month1: 100, month3: null, month6: null, month12: null },
]

const mockBehaviorPatterns = [
  { day: 'Monday', visits: 45, avgSpend: 85, satisfaction: 4.3 },
  { day: 'Tuesday', visits: 38, avgSpend: 78, satisfaction: 4.2 },
  { day: 'Wednesday', visits: 52, avgSpend: 92, satisfaction: 4.5 },
  { day: 'Thursday', visits: 48, avgSpend: 88, satisfaction: 4.4 },
  { day: 'Friday', visits: 65, avgSpend: 110, satisfaction: 4.6 },
  { day: 'Saturday', visits: 78, avgSpend: 125, satisfaction: 4.7 },
  { day: 'Sunday', visits: 25, avgSpend: 95, satisfaction: 4.1 },
]

interface CustomerInsightsProps {
  className?: string
}

export function CustomerInsights({ className }: CustomerInsightsProps) {
  const [activeTab, setActiveTab] = useState('overview')
  const [selectedSegment, setSelectedSegment] = useState<string | null>(null)
  const [showDemographics, setShowDemographics] = useState(true)
  const [showBehavior, setShowBehavior] = useState(true)
  const [isLoading, setIsLoading] = useState(false)

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
    }).format(value)
  }

  const formatPercentage = (value: number) => {
    return `${value}%`
  }

  const handleRefresh = async () => {
    setIsLoading(true)
    setTimeout(() => setIsLoading(false), 1000)
  }

  const totalCustomers = mockCustomerSegments.reduce((sum, segment) => sum + segment.count, 0)
  const avgSatisfaction = mockSatisfactionData[mockSatisfactionData.length - 1].satisfaction
  const retentionRate = 73 // Mock retention rate

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Customer Insights</h1>
          <p className="text-muted-foreground">
            Deep analytics on customer behavior, satisfaction, and loyalty
          </p>
        </div>
        <div className="flex items-center gap-4">
          <Button variant="outline" onClick={handleRefresh} disabled={isLoading}>
            <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Customers</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalCustomers.toLocaleString()}</div>
            <div className="flex items-center text-xs text-muted-foreground">
              <TrendingUp className="h-3 w-3 mr-1 text-green-500" />
              +12.5% vs last month
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Satisfaction</CardTitle>
            <Star className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{avgSatisfaction}/5</div>
            <div className="flex items-center text-xs text-muted-foreground">
              <TrendingUp className="h-3 w-3 mr-1 text-green-500" />
              +0.2 vs last month
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Retention Rate</CardTitle>
            <Heart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{retentionRate}%</div>
            <div className="flex items-center text-xs text-muted-foreground">
              <TrendingUp className="h-3 w-3 mr-1 text-green-500" />
              +2.1% vs last month
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Spend/Customer</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(105)}</div>
            <div className="flex items-center text-xs text-muted-foreground">
              <TrendingUp className="h-3 w-3 mr-1 text-green-500" />
              +8.3% vs last month
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Analytics Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="overview" className="flex items-center gap-2">
            <BarChart3 className="h-4 w-4" />
            Overview
          </TabsTrigger>
          <TabsTrigger value="segments" className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            Segments
          </TabsTrigger>
          <TabsTrigger value="loyalty" className="flex items-center gap-2">
            <Award className="h-4 w-4" />
            Loyalty
          </TabsTrigger>
          <TabsTrigger value="behavior" className="flex items-center gap-2">
            <Activity className="h-4 w-4" />
            Behavior
          </TabsTrigger>
          <TabsTrigger value="satisfaction" className="flex items-center gap-2">
            <Star className="h-4 w-4" />
            Satisfaction
          </TabsTrigger>
          <TabsTrigger value="journey" className="flex items-center gap-2">
            <Target className="h-4 w-4" />
            Journey
          </TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6">
          <div className="grid gap-6 lg:grid-cols-2">
            {/* Customer Segments */}
            <Card>
              <CardHeader>
                <CardTitle>Customer Segments</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={mockCustomerSegments}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ segment, percentage }) => `${segment} ${percentage}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="count"
                    >
                      {mockCustomerSegments.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Satisfaction Trend */}
            <Card>
              <CardHeader>
                <CardTitle>Customer Satisfaction Trend</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={mockSatisfactionData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis domain={[0, 5]} />
                    <Tooltip formatter={(value: number) => [`${value}/5`, 'Satisfaction']} />
                    <Line
                      type="monotone"
                      dataKey="satisfaction"
                      stroke="#2563eb"
                      strokeWidth={3}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Segments Tab */}
        <TabsContent value="segments" className="space-y-6">
          <div className="grid gap-6 lg:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Customer Segments Analysis</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {mockCustomerSegments.map((segment) => (
                    <div key={segment.segment} className="space-y-2">
                      <div className="flex justify-between items-center">
                        <div className="flex items-center gap-2">
                          <div
                            className="w-3 h-3 rounded-full"
                            style={{ backgroundColor: segment.color }}
                          />
                          <span className="font-medium">{segment.segment}</span>
                        </div>
                        <div className="text-right">
                          <div className="font-bold">{segment.count}</div>
                          <div className="text-xs text-muted-foreground">
                            {segment.percentage}%
                          </div>
                        </div>
                      </div>
                      <div className="flex justify-between text-sm text-muted-foreground">
                        <span>Avg Spend: {formatCurrency(segment.avgSpend)}</span>
                        <span>{formatPercentage(segment.percentage)} of total</span>
                      </div>
                      <div className="w-full bg-secondary rounded-full h-2">
                        <div
                          className="h-2 rounded-full"
                          style={{
                            width: `${segment.percentage}%`,
                            backgroundColor: segment.color
                          }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {showDemographics && (
              <Card>
                <CardHeader>
                  <CardTitle>Demographics</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={mockDemographics}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="age" />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="count" fill="#2563eb" />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            )}
          </div>

          <div className="flex gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowDemographics(!showDemographics)}
            >
              {showDemographics ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
              Demographics
            </Button>
          </div>
        </TabsContent>

        {/* Loyalty Tab */}
        <TabsContent value="loyalty" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Loyalty Program Tiers</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {mockLoyaltyTiers.map((tier, index) => (
                  <div key={tier.tier} className="space-y-2">
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-3">
                        <div
                          className="w-4 h-4 rounded-full"
                          style={{ backgroundColor: tier.color }}
                        />
                        <span className="font-semibold">{tier.tier} Tier</span>
                      </div>
                      <div className="text-right">
                        <div className="font-bold">{tier.customers}</div>
                        <div className="text-sm text-muted-foreground">customers</div>
                      </div>
                    </div>
                    <div className="text-sm text-muted-foreground ml-7">
                      {tier.benefits}
                    </div>
                    <div className="w-full bg-secondary rounded-full h-3 ml-7">
                      <div
                        className="h-3 rounded-full"
                        style={{
                          width: `${(tier.customers / mockLoyaltyTiers[0].customers) * 100}%`,
                          backgroundColor: tier.color
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Behavior Tab */}
        <TabsContent value="behavior" className="space-y-6">
          {showBehavior && (
            <Card>
              <CardHeader>
                <CardTitle>Weekly Behavior Patterns</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={400}>
                  <ComposedChart data={mockBehaviorPatterns}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="day" />
                    <YAxis yAxisId="visits" orientation="left" />
                    <YAxis yAxisId="spend" orientation="right" />
                    <Tooltip />
                    <Legend />
                    <Bar yAxisId="visits" dataKey="visits" fill="#2563eb" name="Visits" />
                    <Line
                      yAxisId="spend"
                      type="monotone"
                      dataKey="avgSpend"
                      stroke="#dc2626"
                      strokeWidth={3}
                      name="Avg Spend"
                    />
                  </ComposedChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          )}

          <Card>
            <CardHeader>
              <CardTitle>Cohort Analysis</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={mockRetentionData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="cohort" />
                  <YAxis />
                  <Tooltip formatter={(value: number) => [`${value}%`, 'Retention']} />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="month1"
                    stroke="#2563eb"
                    strokeWidth={2}
                    name="Month 1"
                  />
                  <Line
                    type="monotone"
                    dataKey="month3"
                    stroke="#16a34a"
                    strokeWidth={2}
                    name="Month 3"
                  />
                  <Line
                    type="monotone"
                    dataKey="month6"
                    stroke="#ca8a04"
                    strokeWidth={2}
                    name="Month 6"
                  />
                  <Line
                    type="monotone"
                    dataKey="month12"
                    stroke="#dc2626"
                    strokeWidth={2}
                    name="Month 12"
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <div className="flex gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowBehavior(!showBehavior)}
            >
              {showBehavior ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
              Weekly Patterns
            </Button>
          </div>
        </TabsContent>

        {/* Satisfaction Tab */}
        <TabsContent value="satisfaction" className="space-y-6">
          <div className="grid gap-6 lg:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Satisfaction Over Time</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <AreaChart data={mockSatisfactionData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis domain={[0, 5]} />
                    <Tooltip formatter={(value: number) => [`${value}/5`, 'Satisfaction']} />
                    <Area
                      type="monotone"
                      dataKey="satisfaction"
                      stroke="#2563eb"
                      fill="#2563eb"
                      fillOpacity={0.1}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Review Metrics</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="text-center">
                    <div className="text-4xl font-bold text-primary mb-2">4.9/5</div>
                    <div className="text-muted-foreground">Average Rating</div>
                    <div className="flex justify-center mt-2">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`h-5 w-5 ${
                            i < 4 ? 'text-yellow-400 fill-current' : 'text-gray-300'
                          }`}
                        />
                      ))}
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Total Reviews</span>
                      <Badge variant="secondary">456</Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">This Month</span>
                      <Badge variant="secondary">89</Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Recommendations</span>
                      <Badge variant="default">96%</Badge>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Journey Tab */}
        <TabsContent value="journey" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Customer Journey Funnel</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {mockCustomerJourney.map((stage, index) => (
                  <div key={stage.stage} className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="font-medium">{stage.stage}</span>
                      <div className="text-right">
                        <div className="font-bold">{stage.customers}</div>
                        <div className="text-xs text-muted-foreground">
                          {stage.conversion}% conversion
                        </div>
                      </div>
                    </div>
                    <div className="w-full bg-secondary rounded-full h-4">
                      <div
                        className="h-4 rounded-full bg-primary"
                        style={{
                          width: `${(stage.customers / mockCustomerJourney[0].customers) * 100}%`
                        }}
                      />
                    </div>
                    {stage.dropoff > 0 && (
                      <div className="text-xs text-red-600 text-right">
                        -{stage.dropoff}% dropped off
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Journey Insights</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-6 md:grid-cols-2">
                <div className="space-y-4">
                  <div className="text-center p-4 border rounded-lg">
                    <div className="text-2xl font-bold text-green-600 mb-2">67%</div>
                    <div className="text-sm font-medium">Awareness → Interest</div>
                    <div className="text-xs text-muted-foreground">Conversion Rate</div>
                  </div>
                  <div className="text-center p-4 border rounded-lg">
                    <div className="text-2xl font-bold text-blue-600 mb-2">80%</div>
                    <div className="text-sm font-medium">Interest → Purchase</div>
                    <div className="text-xs text-muted-foreground">Conversion Rate</div>
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="text-center p-4 border rounded-lg">
                    <div className="text-2xl font-bold text-purple-600 mb-2">65%</div>
                    <div className="text-sm font-medium">Purchase → Retention</div>
                    <div className="text-xs text-muted-foreground">Retention Rate</div>
                  </div>
                  <div className="text-center p-4 border rounded-lg">
                    <div className="text-2xl font-bold text-orange-600 mb-2">51%</div>
                    <div className="text-sm font-medium">Retention → Advocacy</div>
                    <div className="text-xs text-muted-foreground">Advocacy Rate</div>
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
