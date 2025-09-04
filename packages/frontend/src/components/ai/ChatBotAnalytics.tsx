'use client'

import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell
} from 'recharts'
import {
  MessageCircle,
  Calendar,
  Users,
  TrendingUp,
  Clock,
  Bot,
  User,
  Star,
  Download
} from 'lucide-react'

interface ChatAnalytics {
  totalConversations: number
  totalMessages: number
  averageSessionDuration: number
  bookingConversionRate: number
  topQueries: Array<{
    query: string
    count: number
    category: string
  }>
  hourlyActivity: Array<{
    hour: string
    conversations: number
    messages: number
  }>
  intentBreakdown: Array<{
    intent: string
    count: number
    percentage: number
  }>
  userSatisfaction: {
    rating: number
    totalRatings: number
  }
}

const mockAnalytics: ChatAnalytics = {
  totalConversations: 1247,
  totalMessages: 5832,
  averageSessionDuration: 4.2,
  bookingConversionRate: 23.5,
  topQueries: [
    { query: 'Book appointment', count: 342, category: 'Booking' },
    { query: 'Service prices', count: 289, category: 'Information' },
    { query: 'Opening hours', count: 198, category: 'Information' },
    { query: 'Location', count: 156, category: 'Information' },
    { query: 'Cancel appointment', count: 134, category: 'Management' },
    { query: 'Reschedule', count: 98, category: 'Management' }
  ],
  hourlyActivity: [
    { hour: '9 AM', conversations: 45, messages: 180 },
    { hour: '10 AM', conversations: 67, messages: 245 },
    { hour: '11 AM', conversations: 89, messages: 312 },
    { hour: '12 PM', conversations: 123, messages: 456 },
    { hour: '1 PM', conversations: 98, messages: 378 },
    { hour: '2 PM', conversations: 87, messages: 334 },
    { hour: '3 PM', conversations: 76, messages: 298 },
    { hour: '4 PM', conversations: 65, messages: 256 },
    { hour: '5 PM', conversations: 54, messages: 212 },
    { hour: '6 PM', conversations: 43, messages: 178 },
    { hour: '7 PM', conversations: 32, messages: 134 },
    { hour: '8 PM', conversations: 21, messages: 89 }
  ],
  intentBreakdown: [
    { intent: 'Booking', count: 423, percentage: 34 },
    { intent: 'Service Inquiry', count: 356, percentage: 29 },
    { intent: 'Information', count: 267, percentage: 21 },
    { intent: 'Management', count: 134, percentage: 11 },
    { intent: 'Other', count: 67, percentage: 5 }
  ],
  userSatisfaction: {
    rating: 4.7,
    totalRatings: 892
  }
}

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6']

export function ChatBotAnalytics() {
  const [analytics, setAnalytics] = useState<ChatAnalytics>(mockAnalytics)
  const [timeRange, setTimeRange] = useState('7d')

  // In a real implementation, this would fetch data from your analytics service
  useEffect(() => {
    // fetchAnalytics(timeRange).then(setAnalytics)
  }, [timeRange])

  const exportData = () => {
    const data = {
      ...analytics,
      exportedAt: new Date().toISOString(),
      timeRange
    }

    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `chatbot-analytics-${timeRange}-${new Date().toISOString().split('T')[0]}.json`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-gray-900">ChatBot Analytics</h2>
          <p className="text-gray-600">Monitor chatbot performance and user interactions</p>
        </div>
        <div className="flex gap-2">
          <select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md text-sm"
          >
            <option value="1d">Last 24 Hours</option>
            <option value="7d">Last 7 Days</option>
            <option value="30d">Last 30 Days</option>
            <option value="90d">Last 90 Days</option>
          </select>
          <Button onClick={exportData} variant="outline" size="sm">
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Conversations</CardTitle>
            <MessageCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analytics.totalConversations.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-green-600">+12%</span> from last period
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Booking Conversion</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analytics.bookingConversionRate}%</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-green-600">+5.2%</span> from last period
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Session Duration</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analytics.averageSessionDuration}min</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-green-600">+0.8min</span> from last period
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">User Satisfaction</CardTitle>
            <Star className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold flex items-center gap-1">
              {analytics.userSatisfaction.rating}
              <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
            </div>
            <p className="text-xs text-muted-foreground">
              Based on {analytics.userSatisfaction.totalRatings} ratings
            </p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="activity" className="space-y-4">
        <TabsList>
          <TabsTrigger value="activity">Activity</TabsTrigger>
          <TabsTrigger value="intents">Intents</TabsTrigger>
          <TabsTrigger value="queries">Top Queries</TabsTrigger>
        </TabsList>

        <TabsContent value="activity" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Hourly Activity</CardTitle>
              <CardDescription>Conversations and messages by hour of day</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={analytics.hourlyActivity}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="hour" />
                  <YAxis />
                  <Tooltip />
                  <Line
                    type="monotone"
                    dataKey="conversations"
                    stroke="#3b82f6"
                    strokeWidth={2}
                    name="Conversations"
                  />
                  <Line
                    type="monotone"
                    dataKey="messages"
                    stroke="#10b981"
                    strokeWidth={2}
                    name="Messages"
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="intents" className="space-y-4">
          <div className="grid md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Intent Breakdown</CardTitle>
                <CardDescription>User intent distribution</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={analytics.intentBreakdown}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={120}
                      paddingAngle={5}
                      dataKey="count"
                    >
                      {analytics.intentBreakdown.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Intent Statistics</CardTitle>
                <CardDescription>Detailed breakdown by category</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {analytics.intentBreakdown.map((intent, index) => (
                    <div key={intent.intent} className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div
                          className="w-3 h-3 rounded-full"
                          style={{ backgroundColor: COLORS[index % COLORS.length] }}
                        />
                        <span className="font-medium">{intent.intent}</span>
                      </div>
                      <div className="text-right">
                        <div className="font-semibold">{intent.count}</div>
                        <div className="text-sm text-gray-500">{intent.percentage}%</div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="queries" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Top User Queries</CardTitle>
              <CardDescription>Most frequently asked questions and requests</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {analytics.topQueries.map((query, index) => (
                  <div key={index} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                    <div className="flex items-center gap-4">
                      <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                        <span className="text-blue-600 font-semibold text-sm">#{index + 1}</span>
                      </div>
                      <div>
                        <h4 className="font-medium">{query.query}</h4>
                        <Badge variant="outline" className="text-xs">
                          {query.category}
                        </Badge>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-blue-600">{query.count}</div>
                      <div className="text-sm text-gray-500">queries</div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Performance Insights */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5" />
            Performance Insights
          </CardTitle>
          <CardDescription>Key insights and recommendations</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                <h4 className="font-semibold text-green-800 mb-2">✅ Strengths</h4>
                <ul className="text-sm text-green-700 space-y-1">
                  <li>• High booking conversion rate ({analytics.bookingConversionRate}%)</li>
                  <li>• Excellent user satisfaction ({analytics.userSatisfaction.rating}⭐)</li>
                  <li>• Good session duration ({analytics.averageSessionDuration}min)</li>
                  <li>• Effective intent recognition</li>
                </ul>
              </div>

              <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <h4 className="font-semibold text-blue-800 mb-2">📈 Opportunities</h4>
                <ul className="text-sm text-blue-700 space-y-1">
                  <li>• Peak activity between 11 AM - 2 PM</li>
                  <li>• High demand for booking assistance</li>
                  <li>• Service information is popular</li>
                  <li>• Good engagement during business hours</li>
                </ul>
              </div>
            </div>

            <div className="space-y-4">
              <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                <h4 className="font-semibold text-yellow-800 mb-2">🎯 Recommendations</h4>
                <ul className="text-sm text-yellow-700 space-y-1">
                  <li>• Add more service-specific responses</li>
                  <li>• Implement proactive booking suggestions</li>
                  <li>• Add stylist availability checking</li>
                  <li>• Include promotional offers in responses</li>
                </ul>
              </div>

              <div className="p-4 bg-purple-50 border border-purple-200 rounded-lg">
                <h4 className="font-semibold text-purple-800 mb-2">🚀 Next Steps</h4>
                <ul className="text-sm text-purple-700 space-y-1">
                  <li>• Integrate with appointment calendar</li>
                  <li>• Add multi-language support</li>
                  <li>• Implement conversation history</li>
                  <li>• Add voice interaction capability</li>
                </ul>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
