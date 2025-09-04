export interface ChatbotMetrics {
  totalConversations: number
  totalMessages: number
  averageConversationLength: number
  averageResponseTime: number
  userSatisfaction: number
  resolutionRate: number
  escalationRate: number
  abandonmentRate: number
}

export interface TimeSeriesData {
  timestamp: Date
  conversations: number
  messages: number
  satisfaction: number
  responseTime: number
}

export interface IntentAnalytics {
  intent: string
  count: number
  successRate: number
  averageConfidence: number
  averageResolutionTime: number
  topResponses: Array<{
    response: string
    frequency: number
    satisfaction: number
  }>
}

export interface UserSegmentAnalytics {
  segment: string
  userCount: number
  conversationCount: number
  averageSatisfaction: number
  preferredChannel: string
  commonIntents: string[]
  peakUsageHours: number[]
}

export interface PerformanceInsights {
  category: 'performance' | 'engagement' | 'satisfaction' | 'efficiency'
  title: string
  description: string
  impact: 'high' | 'medium' | 'low'
  recommendation: string
  metrics: Record<string, number>
  trend: 'improving' | 'declining' | 'stable'
}

export interface ABMetrics {
  totalInteractions: number
  aiHandledConversations: number
  humanEscalatedConversations: number
  aiResolutionRate: number
  averageAIConfidence: number
  costSavings: number
  responseTimeComparison: {
    ai: number
    human: number
    improvement: number
  }
}

export interface PredictiveAnalytics {
  nextHourTraffic: number
  peakHoursPrediction: number[]
  intentTrends: Array<{
    intent: string
    growth: number
    confidence: number
  }>
  churnRiskUsers: string[]
  serviceDemandPrediction: Record<string, number>
}

export class ChatbotAnalyticsService {
  private readonly API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || '/api'
  private metricsCache: Map<string, any> = new Map()
  private cacheExpiry: Map<string, Date> = new Map()

  async getOverallMetrics(
    startDate: Date,
    endDate: Date
  ): Promise<ChatbotMetrics> {
    const cacheKey = `metrics_${startDate.toISOString()}_${endDate.toISOString()}`

    if (this.isCacheValid(cacheKey)) {
      return this.metricsCache.get(cacheKey)
    }

    try {
      const response = await fetch(
        `${this.API_BASE_URL}/analytics/chatbot/metrics?start=${startDate.toISOString()}&end=${endDate.toISOString()}`
      )

      if (!response.ok) {
        throw new Error('Failed to fetch metrics')
      }

      const metrics = await response.json()
      this.setCache(cacheKey, metrics)

      return metrics
    } catch (error) {
      console.error('Failed to fetch chatbot metrics:', error)
      return this.getMockMetrics()
    }
  }

  async getTimeSeriesData(
    startDate: Date,
    endDate: Date,
    granularity: 'hour' | 'day' | 'week' = 'day'
  ): Promise<TimeSeriesData[]> {
    const cacheKey = `timeseries_${startDate.toISOString()}_${endDate.toISOString()}_${granularity}`

    if (this.isCacheValid(cacheKey)) {
      return this.metricsCache.get(cacheKey)
    }

    try {
      const response = await fetch(
        `${this.API_BASE_URL}/analytics/chatbot/timeseries?start=${startDate.toISOString()}&end=${endDate.toISOString()}&granularity=${granularity}`
      )

      if (!response.ok) {
        throw new Error('Failed to fetch time series data')
      }

      const data = await response.json()
      this.setCache(cacheKey, data)

      return data
    } catch (error) {
      console.error('Failed to fetch time series data:', error)
      return this.getMockTimeSeriesData(startDate, endDate)
    }
  }

  async getIntentAnalytics(
    startDate: Date,
    endDate: Date,
    limit: number = 10
  ): Promise<IntentAnalytics[]> {
    const cacheKey = `intents_${startDate.toISOString()}_${endDate.toISOString()}_${limit}`

    if (this.isCacheValid(cacheKey)) {
      return this.metricsCache.get(cacheKey)
    }

    try {
      const response = await fetch(
        `${this.API_BASE_URL}/analytics/chatbot/intents?start=${startDate.toISOString()}&end=${endDate.toISOString()}&limit=${limit}`
      )

      if (!response.ok) {
        throw new Error('Failed to fetch intent analytics')
      }

      const data = await response.json()
      this.setCache(cacheKey, data)

      return data
    } catch (error) {
      console.error('Failed to fetch intent analytics:', error)
      return this.getMockIntentAnalytics()
    }
  }

  async getUserSegmentAnalytics(
    startDate: Date,
    endDate: Date
  ): Promise<UserSegmentAnalytics[]> {
    const cacheKey = `segments_${startDate.toISOString()}_${endDate.toISOString()}`

    if (this.isCacheValid(cacheKey)) {
      return this.metricsCache.get(cacheKey)
    }

    try {
      const response = await fetch(
        `${this.API_BASE_URL}/analytics/chatbot/segments?start=${startDate.toISOString()}&end=${endDate.toISOString()}`
      )

      if (!response.ok) {
        throw new Error('Failed to fetch user segment analytics')
      }

      const data = await response.json()
      this.setCache(cacheKey, data)

      return data
    } catch (error) {
      console.error('Failed to fetch user segment analytics:', error)
      return this.getMockUserSegmentAnalytics()
    }
  }

  async getPerformanceInsights(
    startDate: Date,
    endDate: Date
  ): Promise<PerformanceInsights[]> {
    const metrics = await this.getOverallMetrics(startDate, endDate)
    const intentAnalytics = await this.getIntentAnalytics(startDate, endDate)
    const timeSeriesData = await this.getTimeSeriesData(startDate, endDate)

    return this.generateInsights(metrics, intentAnalytics, timeSeriesData)
  }

  async getABMetrics(
    startDate: Date,
    endDate: Date
  ): Promise<ABMetrics> {
    const cacheKey = `ab_metrics_${startDate.toISOString()}_${endDate.toISOString()}`

    if (this.isCacheValid(cacheKey)) {
      return this.metricsCache.get(cacheKey)
    }

    try {
      const response = await fetch(
        `${this.API_BASE_URL}/analytics/chatbot/ab-metrics?start=${startDate.toISOString()}&end=${endDate.toISOString()}`
      )

      if (!response.ok) {
        throw new Error('Failed to fetch A/B metrics')
      }

      const data = await response.json()
      this.setCache(cacheKey, data)

      return data
    } catch (error) {
      console.error('Failed to fetch A/B metrics:', error)
      return this.getMockABMetrics()
    }
  }

  async getPredictiveAnalytics(): Promise<PredictiveAnalytics> {
    const cacheKey = 'predictive_analytics'

    if (this.isCacheValid(cacheKey)) {
      return this.metricsCache.get(cacheKey)
    }

    try {
      const response = await fetch(`${this.API_BASE_URL}/analytics/chatbot/predictive`)

      if (!response.ok) {
        throw new Error('Failed to fetch predictive analytics')
      }

      const data = await response.json()
      this.setCache(cacheKey, data, 30 * 60 * 1000) // Cache for 30 minutes

      return data
    } catch (error) {
      console.error('Failed to fetch predictive analytics:', error)
      return this.getMockPredictiveAnalytics()
    }
  }

  private generateInsights(
    metrics: ChatbotMetrics,
    intents: IntentAnalytics[],
    timeSeries: TimeSeriesData[]
  ): PerformanceInsights[] {
    const insights: PerformanceInsights[] = []

    // Response time insights
    if (metrics.averageResponseTime > 30) {
      insights.push({
        category: 'performance',
        title: 'Slow Response Times',
        description: `Average response time is ${metrics.averageResponseTime.toFixed(1)} seconds, which may impact user experience.`,
        impact: 'high',
        recommendation: 'Consider optimizing AI processing or implementing response caching.',
        metrics: { averageResponseTime: metrics.averageResponseTime },
        trend: this.calculateTrend(timeSeries.map(d => d.responseTime))
      })
    }

    // Satisfaction insights
    if (metrics.userSatisfaction < 4.0) {
      insights.push({
        category: 'satisfaction',
        title: 'Low User Satisfaction',
        description: `User satisfaction score is ${metrics.userSatisfaction.toFixed(1)}/5.0, indicating room for improvement.`,
        impact: 'high',
        recommendation: 'Review common failure points and improve response quality for low-performing intents.',
        metrics: { userSatisfaction: metrics.userSatisfaction },
        trend: this.calculateTrend(timeSeries.map(d => d.satisfaction))
      })
    }

    // Escalation insights
    if (metrics.escalationRate > 0.3) {
      insights.push({
        category: 'efficiency',
        title: 'High Escalation Rate',
        description: `${(metrics.escalationRate * 100).toFixed(1)}% of conversations are escalated to human agents.`,
        impact: 'medium',
        recommendation: 'Train AI on common escalation scenarios or improve intent recognition.',
        metrics: { escalationRate: metrics.escalationRate },
        trend: 'stable'
      })
    }

    // Intent performance insights
    const lowPerformingIntents = intents.filter(intent => intent.successRate < 0.7)
    if (lowPerformingIntents.length > 0) {
      insights.push({
        category: 'performance',
        title: 'Low-Performing Intents',
        description: `${lowPerformingIntents.length} intent(s) have success rates below 70%.`,
        impact: 'medium',
        recommendation: 'Review and improve training data for these intents.',
        metrics: { lowPerformingIntents: lowPerformingIntents.length },
        trend: 'stable'
      })
    }

    // Engagement insights
    const avgConversationLength = metrics.averageConversationLength
    if (avgConversationLength < 3) {
      insights.push({
        category: 'engagement',
        title: 'Short Conversations',
        description: `Average conversation length is ${avgConversationLength.toFixed(1)} messages, suggesting users may not be finding what they need.`,
        impact: 'medium',
        recommendation: 'Improve conversation flow and ensure users can easily find information.',
        metrics: { averageConversationLength: avgConversationLength },
        trend: 'stable'
      })
    }

    return insights
  }

  private calculateTrend(values: number[]): 'improving' | 'declining' | 'stable' {
    if (values.length < 5) return 'stable'

    const recent = values.slice(-3).reduce((sum, val) => sum + val, 0) / 3
    const earlier = values.slice(0, -3).reduce((sum, val) => sum + val, 0) / (values.length - 3)

    const change = (recent - earlier) / earlier

    if (change > 0.05) return 'improving'
    if (change < -0.05) return 'declining'
    return 'stable'
  }

  // Mock data generators for development
  private getMockMetrics(): ChatbotMetrics {
    return {
      totalConversations: 1250,
      totalMessages: 8750,
      averageConversationLength: 7.0,
      averageResponseTime: 2.3,
      userSatisfaction: 4.2,
      resolutionRate: 0.78,
      escalationRate: 0.22,
      abandonmentRate: 0.15
    }
  }

  private getMockTimeSeriesData(startDate: Date, endDate: Date): TimeSeriesData[] {
    const data: TimeSeriesData[] = []
    const days = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24))

    for (let i = 0; i < days; i++) {
      const date = new Date(startDate)
      date.setDate(date.getDate() + i)

      data.push({
        timestamp: date,
        conversations: Math.floor(Math.random() * 50) + 20,
        messages: Math.floor(Math.random() * 200) + 100,
        satisfaction: Math.random() * 2 + 3,
        responseTime: Math.random() * 5 + 1
      })
    }

    return data
  }

  private getMockIntentAnalytics(): IntentAnalytics[] {
    return [
      {
        intent: 'booking',
        count: 450,
        successRate: 0.85,
        averageConfidence: 0.78,
        averageResolutionTime: 180,
        topResponses: [
          { response: 'Great! I can help you book an appointment.', frequency: 180, satisfaction: 4.5 },
          { response: 'What service would you like to book?', frequency: 120, satisfaction: 4.2 }
        ]
      },
      {
        intent: 'information',
        count: 320,
        successRate: 0.92,
        averageConfidence: 0.82,
        averageResolutionTime: 45,
        topResponses: [
          { response: 'Our hours are 9 AM to 8 PM Monday through Friday.', frequency: 95, satisfaction: 4.8 },
          { response: 'We\'re located at 123 Style Street, Downtown.', frequency: 85, satisfaction: 4.6 }
        ]
      }
    ]
  }

  private getMockUserSegmentAnalytics(): UserSegmentAnalytics[] {
    return [
      {
        segment: 'New Customers',
        userCount: 245,
        conversationCount: 180,
        averageSatisfaction: 4.1,
        preferredChannel: 'web',
        commonIntents: ['booking', 'information'],
        peakUsageHours: [10, 11, 14, 15, 16]
      },
      {
        segment: 'Returning Customers',
        userCount: 180,
        conversationCount: 320,
        averageSatisfaction: 4.5,
        preferredChannel: 'mobile',
        commonIntents: ['booking', 'loyalty'],
        peakUsageHours: [12, 13, 17, 18, 19]
      }
    ]
  }

  private getMockABMetrics(): ABMetrics {
    return {
      totalInteractions: 10000,
      aiHandledConversations: 7800,
      humanEscalatedConversations: 2200,
      aiResolutionRate: 0.78,
      averageAIConfidence: 0.75,
      costSavings: 45000,
      responseTimeComparison: {
        ai: 2.3,
        human: 45.0,
        improvement: 94.9
      }
    }
  }

  private getMockPredictiveAnalytics(): PredictiveAnalytics {
    return {
      nextHourTraffic: 45,
      peakHoursPrediction: [11, 12, 13, 17, 18, 19],
      intentTrends: [
        { intent: 'booking', growth: 0.15, confidence: 0.85 },
        { intent: 'information', growth: 0.08, confidence: 0.78 },
        { intent: 'complaint', growth: -0.05, confidence: 0.92 }
      ],
      churnRiskUsers: ['user_123', 'user_456', 'user_789'],
      serviceDemandPrediction: {
        haircut: 85,
        beard_trim: 65,
        hair_color: 45,
        treatment: 35
      }
    }
  }

  // Cache management
  private isCacheValid(key: string): boolean {
    const expiry = this.cacheExpiry.get(key)
    return expiry ? expiry > new Date() : false
  }

  private setCache(key: string, data: any, ttl: number = 5 * 60 * 1000): void { // 5 minutes default
    this.metricsCache.set(key, data)
    this.cacheExpiry.set(key, new Date(Date.now() + ttl))
  }

  // Real-time metrics updates
  async getRealtimeMetrics(): Promise<{
    activeConversations: number
    waitingInQueue: number
    averageWaitTime: number
    agentAvailability: Record<string, boolean>
  }> {
    try {
      const response = await fetch(`${this.API_BASE_URL}/analytics/chatbot/realtime`)

      if (!response.ok) {
        throw new Error('Failed to fetch realtime metrics')
      }

      return await response.json()
    } catch (error) {
      console.error('Failed to fetch realtime metrics:', error)
      return {
        activeConversations: 12,
        waitingInQueue: 3,
        averageWaitTime: 45,
        agentAvailability: {
          'agent_1': true,
          'agent_2': false,
          'agent_3': true
        }
      }
    }
  }

  // Export analytics data
  async exportAnalytics(
    startDate: Date,
    endDate: Date,
    format: 'json' | 'csv' | 'pdf' = 'json'
  ): Promise<Blob> {
    try {
      const response = await fetch(
        `${this.API_BASE_URL}/analytics/chatbot/export?start=${startDate.toISOString()}&end=${endDate.toISOString()}&format=${format}`
      )

      if (!response.ok) {
        throw new Error('Failed to export analytics')
      }

      return await response.blob()
    } catch (error) {
      console.error('Failed to export analytics:', error)
      throw error
    }
  }

  // Custom dashboard configuration
  async saveDashboardConfig(userId: string, config: any): Promise<boolean> {
    try {
      const response = await fetch(`${this.API_BASE_URL}/analytics/dashboard/config`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ userId, config })
      })

      return response.ok
    } catch (error) {
      console.error('Failed to save dashboard config:', error)
      return false
    }
  }

  async getDashboardConfig(userId: string): Promise<any> {
    try {
      const response = await fetch(`${this.API_BASE_URL}/analytics/dashboard/config/${userId}`)

      if (!response.ok) {
        throw new Error('Failed to get dashboard config')
      }

      return await response.json()
    } catch (error) {
      console.error('Failed to get dashboard config:', error)
      return this.getDefaultDashboardConfig()
    }
  }

  private getDefaultDashboardConfig(): any {
    return {
      widgets: [
        { type: 'metric', metric: 'totalConversations', position: { x: 0, y: 0, w: 3, h: 2 } },
        { type: 'chart', chart: 'conversationsOverTime', position: { x: 3, y: 0, w: 6, h: 4 } },
        { type: 'metric', metric: 'userSatisfaction', position: { x: 9, y: 0, w: 3, h: 2 } },
        { type: 'table', table: 'topIntents', position: { x: 0, y: 2, w: 6, h: 4 } },
        { type: 'chart', chart: 'userSegments', position: { x: 6, y: 2, w: 6, h: 4 } }
      ],
      refreshInterval: 300000 // 5 minutes
    }
  }
}

// Global chatbot analytics service instance
export const chatbotAnalyticsService = new ChatbotAnalyticsService()
