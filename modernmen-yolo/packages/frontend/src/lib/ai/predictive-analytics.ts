// AI-Powered Predictive Analytics Engine
// Advanced customer behavior prediction, demand forecasting, and business intelligence

export interface CustomerBehavior {
  customerId: string
  bookingFrequency: number
  preferredServices: string[]
  preferredTimes: string[]
  preferredBarbers: string[]
  averageSpend: number
  cancellationRate: number
  noShowRate: number
  loyaltyScore: number
  lifetimeValue: number
  churnRisk: 'low' | 'medium' | 'high'
  nextBookingPrediction: Date
  preferredUpgradePath: string[]
}

export interface DemandForecast {
  date: string
  predictedBookings: number
  confidenceLevel: number
  peakHours: string[]
  recommendedStaffing: number
  seasonalAdjustment: number
  weatherImpact?: number
  localEventsImpact?: number
}

export interface ServiceRecommendation {
  customerId: string
  recommendedServices: Array<{
    serviceId: string
    serviceName: string
    confidence: number
    reasoning: string
    expectedRevenue: number
    conversionProbability: number
  }>
  upsellOpportunities: Array<{
    currentService: string
    recommendedAddOn: string
    priceDifference: number
    expectedUplift: number
  }>
}

export interface BusinessIntelligence {
  revenueForecast: Array<{
    month: string
    predictedRevenue: number
    confidenceInterval: [number, number]
    growthRate: number
  }>
  customerInsights: {
    acquisitionChannels: Array<{
      channel: string
      customers: number
      revenue: number
      retention: number
    }>
    churnAnalysis: {
      churnRate: number
      riskFactors: string[]
      preventionStrategies: string[]
    }
    lifetimeValue: {
      average: number
      segments: Array<{
        segment: string
        averageValue: number
        count: number
      }>
    }
  }
  operationalEfficiency: {
    staffUtilization: Array<{
      barberId: string
      utilizationRate: number
      productivityScore: number
      recommendations: string[]
    }>
    serviceOptimization: Array<{
      serviceId: string
      demandPattern: string
      pricingOptimization: number
      timeSlotOptimization: string[]
    }>
  }
}

class PredictiveAnalyticsEngine {
  private readonly API_BASE = '/api/ai'

  // Customer Behavior Analysis
  async analyzeCustomerBehavior(customerId: string): Promise<CustomerBehavior> {
    try {
      const response = await fetch(`${this.API_BASE}/customer-behavior/${customerId}`)
      if (!response.ok) throw new Error('Failed to analyze customer behavior')

      const data = await response.json()

      return {
        customerId,
        bookingFrequency: data.bookingFrequency,
        preferredServices: data.preferredServices,
        preferredTimes: data.preferredTimes,
        preferredBarbers: data.preferredBarbers,
        averageSpend: data.averageSpend,
        cancellationRate: data.cancellationRate,
        noShowRate: data.noShowRate,
        loyaltyScore: data.loyaltyScore,
        lifetimeValue: data.lifetimeValue,
        churnRisk: this.calculateChurnRisk(data),
        nextBookingPrediction: new Date(data.nextBookingPrediction),
        preferredUpgradePath: data.upgradePath
      }
    } catch (error) {
      console.error('Customer behavior analysis failed:', error)
      throw error
    }
  }

  // Demand Forecasting
  async forecastDemand(
    startDate: Date,
    endDate: Date,
    locationId?: string
  ): Promise<DemandForecast[]> {
    try {
      const params = new URLSearchParams({
        start: startDate.toISOString(),
        end: endDate.toISOString(),
        ...(locationId && { location: locationId })
      })

      const response = await fetch(`${this.API_BASE}/demand-forecast?${params}`)
      if (!response.ok) throw new Error('Failed to forecast demand')

      const forecasts = await response.json()

      return forecasts.map((forecast: any) => ({
        date: forecast.date,
        predictedBookings: forecast.predictedBookings,
        confidenceLevel: forecast.confidenceLevel,
        peakHours: forecast.peakHours,
        recommendedStaffing: forecast.recommendedStaffing,
        seasonalAdjustment: forecast.seasonalAdjustment,
        weatherImpact: forecast.weatherImpact,
        localEventsImpact: forecast.localEventsImpact
      }))
    } catch (error) {
      console.error('Demand forecasting failed:', error)
      throw error
    }
  }

  // Service Recommendations
  async getServiceRecommendations(customerId: string): Promise<ServiceRecommendation> {
    try {
      const response = await fetch(`${this.API_BASE}/service-recommendations/${customerId}`)
      if (!response.ok) throw new Error('Failed to get service recommendations')

      const data = await response.json()

      return {
        customerId,
        recommendedServices: data.recommendations.map((rec: any) => ({
          serviceId: rec.serviceId,
          serviceName: rec.serviceName,
          confidence: rec.confidence,
          reasoning: rec.reasoning,
          expectedRevenue: rec.expectedRevenue,
          conversionProbability: rec.conversionProbability
        })),
        upsellOpportunities: data.upsells.map((upsell: any) => ({
          currentService: upsell.currentService,
          recommendedAddOn: upsell.recommendedAddOn,
          priceDifference: upsell.priceDifference,
          expectedUplift: upsell.expectedUplift
        }))
      }
    } catch (error) {
      console.error('Service recommendations failed:', error)
      throw error
    }
  }

  // Business Intelligence Dashboard
  async getBusinessIntelligence(
    startDate: Date,
    endDate: Date
  ): Promise<BusinessIntelligence> {
    try {
      const params = new URLSearchParams({
        start: startDate.toISOString(),
        end: endDate.toISOString()
      })

      const response = await fetch(`${this.API_BASE}/business-intelligence?${params}`)
      if (!response.ok) throw new Error('Failed to get business intelligence')

      const data = await response.json()

      return {
        revenueForecast: data.revenueForecast,
        customerInsights: {
          acquisitionChannels: data.customerInsights.acquisitionChannels,
          churnAnalysis: {
            churnRate: data.customerInsights.churnRate,
            riskFactors: data.customerInsights.riskFactors,
            preventionStrategies: data.customerInsights.preventionStrategies
          },
          lifetimeValue: data.customerInsights.lifetimeValue
        },
        operationalEfficiency: {
          staffUtilization: data.operationalEfficiency.staffUtilization,
          serviceOptimization: data.operationalEfficiency.serviceOptimization
        }
      }
    } catch (error) {
      console.error('Business intelligence failed:', error)
      throw error
    }
  }

  // Churn Risk Calculation
  private calculateChurnRisk(data: any): 'low' | 'medium' | 'high' {
    const score = (
      data.cancellationRate * 0.3 +
      data.noShowRate * 0.2 +
      (100 - data.loyaltyScore) * 0.3 +
      (data.daysSinceLastBooking / 30) * 0.2
    )

    if (score < 30) return 'low'
    if (score < 60) return 'medium'
    return 'high'
  }

  // Real-time Customer Insights
  async getRealtimeInsights(): Promise<{
    activeCustomers: number
    bookingTrends: Array<{hour: number, bookings: number}>
    servicePopularity: Array<{service: string, bookings: number}>
    revenueToday: number
    avgServiceTime: number
  }> {
    try {
      const response = await fetch(`${this.API_BASE}/realtime-insights`)
      if (!response.ok) throw new Error('Failed to get realtime insights')

      return await response.json()
    } catch (error) {
      console.error('Realtime insights failed:', error)
      throw error
    }
  }

  // Predictive Pricing Optimization
  async optimizePricing(): Promise<{
    serviceId: string
    currentPrice: number
    optimalPrice: number
    expectedRevenueIncrease: number
    confidence: number
  }[]> {
    try {
      const response = await fetch(`${this.API_BASE}/pricing-optimization`)
      if (!response.ok) throw new Error('Failed to optimize pricing')

      return await response.json()
    } catch (error) {
      console.error('Pricing optimization failed:', error)
      throw error
    }
  }

  // Customer Segmentation
  async segmentCustomers(): Promise<{
    segment: string
    customerCount: number
    averageValue: number
    characteristics: string[]
    recommendedActions: string[]
  }[]> {
    try {
      const response = await fetch(`${this.API_BASE}/customer-segmentation`)
      if (!response.ok) throw new Error('Failed to segment customers')

      return await response.json()
    } catch (error) {
      console.error('Customer segmentation failed:', error)
      throw error
    }
  }
}

export const predictiveAnalytics = new PredictiveAnalyticsEngine()

// React Hook for AI Analytics
export function usePredictiveAnalytics() {
  return {
    analyzeCustomerBehavior: predictiveAnalytics.analyzeCustomerBehavior.bind(predictiveAnalytics),
    forecastDemand: predictiveAnalytics.forecastDemand.bind(predictiveAnalytics),
    getServiceRecommendations: predictiveAnalytics.getServiceRecommendations.bind(predictiveAnalytics),
    getBusinessIntelligence: predictiveAnalytics.getBusinessIntelligence.bind(predictiveAnalytics),
    getRealtimeInsights: predictiveAnalytics.getRealtimeInsights.bind(predictiveAnalytics),
    optimizePricing: predictiveAnalytics.optimizePricing.bind(predictiveAnalytics),
    segmentCustomers: predictiveAnalytics.segmentCustomers.bind(predictiveAnalytics)
  }
}
