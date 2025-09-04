import { WebSocketMessage } from './websocket'
import { NLPAnalysis } from './nlp-engine'
import { ConversationContext } from './conversation-context'

export interface UserBehaviorPattern {
  userId: string
  patterns: {
    timePreferences: TimePattern[]
    serviceSequences: ServiceSequence[]
    bookingFrequency: FrequencyPattern
    priceSensitivity: PricePattern
    cancellationPatterns: CancellationPattern
    seasonalPreferences: SeasonalPattern[]
    communicationStyle: CommunicationPattern
  }
  predictions: {
    nextService: ServicePrediction
    nextBookingTime: Date | null
    priceRange: { min: number; max: number }
    preferredStylist: string | null
    loyaltyTier: 'bronze' | 'silver' | 'gold' | 'platinum'
  }
  lastUpdated: Date
}

export interface TimePattern {
  dayOfWeek: string
  timeOfDay: string
  confidence: number
  frequency: number
}

export interface ServiceSequence {
  fromService: string
  toService: string
  confidence: number
  averageGap: number // days between services
}

export interface FrequencyPattern {
  averageInterval: number // days between bookings
  consistency: number // 0-1, how consistent the pattern is
  trend: 'increasing' | 'decreasing' | 'stable'
}

export interface PricePattern {
  averageSpend: number
  priceRange: { min: number; max: number }
  sensitivity: 'low' | 'medium' | 'high'
  preferredTier: 'budget' | 'mid-range' | 'premium'
}

export interface CancellationPattern {
  rate: number
  commonReasons: string[]
  riskFactors: string[]
  preventionSuggestions: string[]
}

export interface SeasonalPattern {
  season: string
  preferredServices: string[]
  bookingFrequency: number
  confidence: number
}

export interface CommunicationPattern {
  preferredChannel: 'text' | 'voice' | 'mixed'
  responseTime: number // average response time in minutes
  conversationLength: number // average messages per conversation
  formality: 'casual' | 'formal' | 'professional'
}

export interface ServicePrediction {
  serviceId: string
  serviceName: string
  confidence: number
  reasoning: string[]
  suggestedTime: Date | null
  estimatedPrice: number
}

export interface ProactiveSuggestion {
  id: string
  type: 'service' | 'booking' | 'product' | 'loyalty' | 'reminder'
  title: string
  message: string
  confidence: number
  urgency: 'low' | 'medium' | 'high'
  suggestedAction: {
    type: 'book' | 'view' | 'purchase' | 'contact' | 'dismiss'
    payload: any
  }
  expiresAt?: Date
  triggeredBy: string[]
}

export class PredictiveSuggestionsEngine {
  private readonly API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || '/api'
  private behaviorPatterns: Map<string, UserBehaviorPattern> = new Map()

  async analyzeUserBehavior(userId: string): Promise<UserBehaviorPattern> {
    try {
      // Get user history from API
      const userHistory = await this.getUserHistory(userId)

      // Analyze patterns
      const patterns = await this.analyzePatterns(userHistory)

      // Generate predictions
      const predictions = this.generatePredictions(patterns, userHistory)

      const behaviorPattern: UserBehaviorPattern = {
        userId,
        patterns,
        predictions,
        lastUpdated: new Date()
      }

      this.behaviorPatterns.set(userId, behaviorPattern)
      return behaviorPattern

    } catch (error) {
      console.error('User behavior analysis error:', error)
      return this.createDefaultPattern(userId)
    }
  }

  async generateProactiveSuggestions(
    userId: string,
    context: ConversationContext
  ): Promise<ProactiveSuggestion[]> {
    const behaviorPattern = await this.analyzeUserBehavior(userId)
    const suggestions: ProactiveSuggestion[] = []

    // Service-based suggestions
    const serviceSuggestions = await this.generateServiceSuggestions(behaviorPattern, context)
    suggestions.push(...serviceSuggestions)

    // Timing-based suggestions
    const timingSuggestions = this.generateTimingSuggestions(behaviorPattern)
    suggestions.push(...timingSuggestions)

    // Loyalty-based suggestions
    const loyaltySuggestions = this.generateLoyaltySuggestions(behaviorPattern)
    suggestions.push(...loyaltySuggestions)

    // Behavioral suggestions
    const behavioralSuggestions = this.generateBehavioralSuggestions(behaviorPattern, context)
    suggestions.push(...behavioralSuggestions)

    // Sort by confidence and urgency
    return suggestions
      .sort((a, b) => {
        const confidenceDiff = b.confidence - a.confidence
        if (Math.abs(confidenceDiff) > 0.1) return confidenceDiff

        const urgencyOrder = { high: 3, medium: 2, low: 1 }
        return urgencyOrder[b.urgency] - urgencyOrder[a.urgency]
      })
      .slice(0, 5) // Limit to top 5 suggestions
  }

  private async getUserHistory(userId: string): Promise<any> {
    try {
      const response = await fetch(`${this.API_BASE_URL}/users/${userId}/history`)

      if (!response.ok) {
        throw new Error('Failed to get user history')
      }

      return await response.json()

    } catch (error) {
      console.error('User history fetch error:', error)
      return {
        appointments: [],
        interactions: [],
        purchases: [],
        feedback: []
      }
    }
  }

  private async analyzePatterns(userHistory: any): Promise<UserBehaviorPattern['patterns']> {
    const appointments = userHistory.appointments || []

    return {
      timePreferences: this.analyzeTimePreferences(appointments),
      serviceSequences: this.analyzeServiceSequences(appointments),
      bookingFrequency: this.analyzeBookingFrequency(appointments),
      priceSensitivity: this.analyzePriceSensitivity(appointments),
      cancellationPatterns: this.analyzeCancellationPatterns(userHistory),
      seasonalPreferences: this.analyzeSeasonalPreferences(appointments),
      communicationStyle: this.analyzeCommunicationStyle(userHistory.interactions || [])
    }
  }

  private analyzeTimePreferences(appointments: any[]): TimePattern[] {
    const timeSlots: Record<string, Record<string, number>> = {}

    appointments.forEach(appointment => {
      const date = new Date(appointment.date)
      const dayOfWeek = date.toLocaleLowerCase('en-US', { weekday: 'long' })
      const hour = date.getHours()

      let timeOfDay = 'morning'
      if (hour >= 12 && hour < 17) timeOfDay = 'afternoon'
      else if (hour >= 17) timeOfDay = 'evening'

      if (!timeSlots[dayOfWeek]) timeSlots[dayOfWeek] = {}
      timeSlots[dayOfWeek][timeOfDay] = (timeSlots[dayOfWeek][timeOfDay] || 0) + 1
    })

    const patterns: TimePattern[] = []

    Object.entries(timeSlots).forEach(([dayOfWeek, times]) => {
      Object.entries(times).forEach(([timeOfDay, frequency]) => {
        patterns.push({
          dayOfWeek,
          timeOfDay,
          confidence: Math.min(frequency / appointments.length, 1),
          frequency
        })
      })
    })

    return patterns.sort((a, b) => b.confidence - a.confidence)
  }

  private analyzeServiceSequences(appointments: any[]): ServiceSequence[] {
    const sequences: Record<string, Record<string, { count: number; gaps: number[] }>> = {}

    // Sort appointments by date
    const sortedAppointments = appointments.sort((a, b) =>
      new Date(a.date).getTime() - new Date(b.date).getTime()
    )

    for (let i = 0; i < sortedAppointments.length - 1; i++) {
      const current = sortedAppointments[i]
      const next = sortedAppointments[i + 1]

      const fromService = current.serviceName
      const toService = next.serviceName

      if (!sequences[fromService]) sequences[fromService] = {}
      if (!sequences[fromService][toService]) {
        sequences[fromService][toService] = { count: 0, gaps: [] }
      }

      sequences[fromService][toService].count++
      const gap = Math.round(
        (new Date(next.date).getTime() - new Date(current.date).getTime()) / (1000 * 60 * 60 * 24)
      )
      sequences[fromService][toService].gaps.push(gap)
    }

    const serviceSequences: ServiceSequence[] = []

    Object.entries(sequences).forEach(([fromService, toServices]) => {
      Object.entries(toServices).forEach(([toService, data]) => {
        const averageGap = data.gaps.reduce((sum, gap) => sum + gap, 0) / data.gaps.length
        const confidence = data.count / sortedAppointments.length

        serviceSequences.push({
          fromService,
          toService,
          confidence,
          averageGap
        })
      })
    })

    return serviceSequences.sort((a, b) => b.confidence - a.confidence)
  }

  private analyzeBookingFrequency(appointments: any[]): FrequencyPattern {
    if (appointments.length < 2) {
      return {
        averageInterval: 30, // Default 30 days
        consistency: 0,
        trend: 'stable'
      }
    }

    const intervals = []
    const sortedAppointments = appointments.sort((a, b) =>
      new Date(a.date).getTime() - new Date(b.date).getTime()
    )

    for (let i = 1; i < sortedAppointments.length; i++) {
      const interval = Math.round(
        (new Date(sortedAppointments[i].date).getTime() - new Date(sortedAppointments[i - 1].date).getTime()) /
        (1000 * 60 * 60 * 24)
      )
      intervals.push(interval)
    }

    const averageInterval = intervals.reduce((sum, interval) => sum + interval, 0) / intervals.length

    // Calculate consistency (lower variance = higher consistency)
    const variance = intervals.reduce((sum, interval) =>
      sum + Math.pow(interval - averageInterval, 2), 0
    ) / intervals.length
    const consistency = Math.max(0, 1 - variance / (averageInterval * averageInterval))

    // Determine trend
    const recentIntervals = intervals.slice(-3)
    const earlierIntervals = intervals.slice(0, -3)

    let trend: 'increasing' | 'decreasing' | 'stable' = 'stable'
    if (recentIntervals.length >= 2 && earlierIntervals.length >= 2) {
      const recentAvg = recentIntervals.reduce((sum, i) => sum + i, 0) / recentIntervals.length
      const earlierAvg = earlierIntervals.reduce((sum, i) => sum + i, 0) / earlierIntervals.length

      if (recentAvg < earlierAvg * 0.8) trend = 'increasing'
      else if (recentAvg > earlierAvg * 1.2) trend = 'decreasing'
    }

    return {
      averageInterval,
      consistency,
      trend
    }
  }

  private analyzePriceSensitivity(appointments: any[]): PricePattern {
    const prices = appointments.map(apt => apt.price).filter(price => price > 0)

    if (prices.length === 0) {
      return {
        averageSpend: 0,
        priceRange: { min: 0, max: 0 },
        sensitivity: 'medium',
        preferredTier: 'mid-range'
      }
    }

    const averageSpend = prices.reduce((sum, price) => sum + price, 0) / prices.length
    const minPrice = Math.min(...prices)
    const maxPrice = Math.max(...prices)

    // Determine sensitivity based on price variance
    const variance = prices.reduce((sum, price) =>
      sum + Math.pow(price - averageSpend, 2), 0
    ) / prices.length
    const coefficientOfVariation = Math.sqrt(variance) / averageSpend

    let sensitivity: 'low' | 'medium' | 'high' = 'medium'
    if (coefficientOfVariation < 0.2) sensitivity = 'low'
    else if (coefficientOfVariation > 0.5) sensitivity = 'high'

    // Determine preferred tier
    let preferredTier: 'budget' | 'mid-range' | 'premium' = 'mid-range'
    if (averageSpend < 30) preferredTier = 'budget'
    else if (averageSpend > 60) preferredTier = 'premium'

    return {
      averageSpend,
      priceRange: { min: minPrice, max: maxPrice },
      sensitivity,
      preferredTier
    }
  }

  private analyzeCancellationPatterns(userHistory: any): CancellationPattern {
    const appointments = userHistory.appointments || []
    const cancellations = appointments.filter((apt: any) => apt.status === 'cancelled')

    const rate = appointments.length > 0 ? cancellations.length / appointments.length : 0

    // Extract common reasons (mock implementation)
    const commonReasons = ['schedule conflict', 'illness', 'weather', 'double booking']

    // Risk factors based on patterns
    const riskFactors = []
    if (rate > 0.3) riskFactors.push('high cancellation rate')
    if (appointments.length > 0 && cancellations.length > appointments.length * 0.5) {
      riskFactors.push('frequent last-minute cancellations')
    }

    return {
      rate,
      commonReasons,
      riskFactors,
      preventionSuggestions: [
        'Send reminders 24 hours in advance',
        'Offer flexible rescheduling policy',
        'Provide weather-related service updates'
      ]
    }
  }

  private analyzeSeasonalPreferences(appointments: any[]): SeasonalPattern[] {
    const seasonalData: Record<string, { services: Record<string, number>, count: number }> = {
      spring: { services: {}, count: 0 },
      summer: { services: {}, count: 0 },
      fall: { services: {}, count: 0 },
      winter: { services: {}, count: 0 }
    }

    appointments.forEach(appointment => {
      const date = new Date(appointment.date)
      const month = date.getMonth()
      let season = 'winter'

      if (month >= 2 && month <= 4) season = 'spring'
      else if (month >= 5 && month <= 7) season = 'summer'
      else if (month >= 8 && month <= 10) season = 'fall'

      seasonalData[season].count++
      seasonalData[season].services[appointment.serviceName] =
        (seasonalData[season].services[appointment.serviceName] || 0) + 1
    })

    return Object.entries(seasonalData).map(([season, data]) => {
      const preferredServices = Object.entries(data.services)
        .sort(([,a], [,b]) => b - a)
        .slice(0, 3)
        .map(([service]) => service)

      return {
        season,
        preferredServices,
        bookingFrequency: data.count / 3, // Average per quarter
        confidence: data.count > 0 ? Math.min(data.count / appointments.length, 1) : 0
      }
    }).filter(pattern => pattern.confidence > 0.1)
  }

  private analyzeCommunicationStyle(interactions: any[]): CommunicationPattern {
    if (interactions.length === 0) {
      return {
        preferredChannel: 'text',
        responseTime: 0,
        conversationLength: 0,
        formality: 'casual'
      }
    }

    // Analyze channel preferences
    const channelCounts = interactions.reduce((acc, interaction) => {
      acc[interaction.channel || 'text'] = (acc[interaction.channel || 'text'] || 0) + 1
      return acc
    }, {} as Record<string, number>)

    const preferredChannel = Object.entries(channelCounts)
      .sort(([,a], [,b]) => b - a)[0]?.[0] as 'text' | 'voice' | 'mixed' || 'text'

    // Calculate response times
    const responseTimes = interactions
      .filter(i => i.responseTime)
      .map(i => i.responseTime)

    const responseTime = responseTimes.length > 0
      ? responseTimes.reduce((sum, time) => sum + time, 0) / responseTimes.length
      : 5 // Default 5 minutes

    // Conversation length
    const conversationLengths = interactions.map(i => i.messageCount || 1)
    const conversationLength = conversationLengths.reduce((sum, len) => sum + len, 0) / conversationLengths.length

    // Formality analysis (simplified)
    const formality = 'casual' // Could be analyzed from message content

    return {
      preferredChannel,
      responseTime,
      conversationLength,
      formality
    }
  }

  private generatePredictions(
    patterns: UserBehaviorPattern['patterns'],
    userHistory: any
  ): UserBehaviorPattern['predictions'] {
    // Predict next service
    const nextService = this.predictNextService(patterns.serviceSequences, userHistory)

    // Predict next booking time
    const nextBookingTime = this.predictNextBookingTime(patterns.bookingFrequency, userHistory)

    // Price range prediction
    const priceRange = patterns.priceSensitivity.priceRange

    // Preferred stylist (mock)
    const preferredStylist = null

    // Loyalty tier calculation
    const loyaltyTier = this.calculateLoyaltyTier(userHistory)

    return {
      nextService,
      nextBookingTime,
      priceRange,
      preferredStylist,
      loyaltyTier
    }
  }

  private predictNextService(serviceSequences: ServiceSequence[], userHistory: any): ServicePrediction {
    const lastAppointment = userHistory.appointments
      ?.sort((a: any, b: any) => new Date(b.date).getTime() - new Date(a.date).getTime())[0]

    if (!lastAppointment) {
      return {
        serviceId: 'default',
        serviceName: 'Haircut',
        confidence: 0.5,
        reasoning: ['First-time customer'],
        suggestedTime: null,
        estimatedPrice: 35
      }
    }

    // Find sequences that start with the last service
    const relevantSequences = serviceSequences.filter(seq =>
      seq.fromService === lastAppointment.serviceName
    )

    if (relevantSequences.length === 0) {
      return {
        serviceId: lastAppointment.serviceId,
        serviceName: lastAppointment.serviceName,
        confidence: 0.6,
        reasoning: ['Repeat service preference'],
        suggestedTime: null,
        estimatedPrice: lastAppointment.price
      }
    }

    const bestSequence = relevantSequences[0]

    return {
      serviceId: 'predicted',
      serviceName: bestSequence.toService,
      confidence: bestSequence.confidence,
      reasoning: [`Typically follows ${bestSequence.fromService}`, 'Based on service sequence patterns'],
      suggestedTime: new Date(Date.now() + bestSequence.averageGap * 24 * 60 * 60 * 1000),
      estimatedPrice: lastAppointment.price * 1.1 // Slight increase
    }
  }

  private predictNextBookingTime(frequency: FrequencyPattern, userHistory: any): Date | null {
    const lastAppointment = userHistory.appointments
      ?.sort((a: any, b: any) => new Date(b.date).getTime() - new Date(a.date).getTime())[0]

    if (!lastAppointment) return null

    const lastDate = new Date(lastAppointment.date)
    const predictedDate = new Date(lastDate.getTime() + frequency.averageInterval * 24 * 60 * 60 * 1000)

    return predictedDate
  }

  private calculateLoyaltyTier(userHistory: any): 'bronze' | 'silver' | 'gold' | 'platinum' {
    const appointmentCount = userHistory.appointments?.length || 0
    const totalSpent = userHistory.appointments?.reduce((sum: number, apt: any) => sum + apt.price, 0) || 0

    if (appointmentCount >= 20 || totalSpent >= 1000) return 'platinum'
    if (appointmentCount >= 10 || totalSpent >= 500) return 'gold'
    if (appointmentCount >= 5 || totalSpent >= 200) return 'silver'

    return 'bronze'
  }

  private async generateServiceSuggestions(
    behaviorPattern: UserBehaviorPattern,
    context: ConversationContext
  ): Promise<ProactiveSuggestion[]> {
    const suggestions: ProactiveSuggestion[] = []

    // Next service prediction
    if (behaviorPattern.predictions.nextService.confidence > 0.6) {
      suggestions.push({
        id: `service_${Date.now()}`,
        type: 'service',
        title: 'Recommended Service',
        message: `Based on your history, you might enjoy our ${behaviorPattern.predictions.nextService.serviceName} service.`,
        confidence: behaviorPattern.predictions.nextService.confidence,
        urgency: 'medium',
        suggestedAction: {
          type: 'book',
          payload: { serviceId: behaviorPattern.predictions.nextService.serviceId }
        },
        triggeredBy: ['service_history', 'booking_pattern']
      })
    }

    return suggestions
  }

  private generateTimingSuggestions(behaviorPattern: UserBehaviorPattern): ProactiveSuggestion[] {
    const suggestions: ProactiveSuggestion[] = []

    if (behaviorPattern.predictions.nextBookingTime) {
      const daysUntil = Math.round(
        (behaviorPattern.predictions.nextBookingTime.getTime() - Date.now()) / (1000 * 60 * 60 * 24)
      )

      if (daysUntil > 0 && daysUntil <= 7) {
        suggestions.push({
          id: `timing_${Date.now()}`,
          type: 'booking',
          title: 'Perfect Timing',
          message: `It's been a while since your last visit. How about scheduling your next appointment?`,
          confidence: 0.8,
          urgency: daysUntil <= 2 ? 'high' : 'medium',
          suggestedAction: {
            type: 'book',
            payload: { suggestedDate: behaviorPattern.predictions.nextBookingTime }
          },
          triggeredBy: ['booking_frequency', 'last_visit']
        })
      }
    }

    return suggestions
  }

  private generateLoyaltySuggestions(behaviorPattern: UserBehaviorPattern): ProactiveSuggestion[] {
    const suggestions: ProactiveSuggestion[] = []

    const tier = behaviorPattern.predictions.loyaltyTier
    if (tier === 'bronze') {
      suggestions.push({
        id: `loyalty_upgrade_${Date.now()}`,
        type: 'loyalty',
        title: 'Loyalty Program',
        message: `You're close to Silver tier! Book 2 more services to unlock exclusive perks.`,
        confidence: 0.7,
        urgency: 'low',
        suggestedAction: {
          type: 'view',
          payload: { section: 'loyalty' }
        },
        triggeredBy: ['loyalty_tier', 'appointment_count']
      })
    }

    return suggestions
  }

  private generateBehavioralSuggestions(
    behaviorPattern: UserBehaviorPattern,
    context: ConversationContext
  ): ProactiveSuggestion[] {
    const suggestions: ProactiveSuggestion[] = []

    // Cancellation prevention
    if (behaviorPattern.patterns.cancellationPatterns.rate > 0.2) {
      suggestions.push({
        id: `prevention_${Date.now()}`,
        type: 'reminder',
        title: 'Appointment Reminder',
        message: `We noticed some schedule changes recently. Would you like us to send extra reminders for your next booking?`,
        confidence: 0.6,
        urgency: 'medium',
        suggestedAction: {
          type: 'contact',
          payload: { topic: 'reminder_preferences' }
        },
        triggeredBy: ['cancellation_pattern', 'booking_history']
      })
    }

    return suggestions
  }

  private createDefaultPattern(userId: string): UserBehaviorPattern {
    return {
      userId,
      patterns: {
        timePreferences: [],
        serviceSequences: [],
        bookingFrequency: {
          averageInterval: 30,
          consistency: 0,
          trend: 'stable'
        },
        priceSensitivity: {
          averageSpend: 0,
          priceRange: { min: 0, max: 0 },
          sensitivity: 'medium',
          preferredTier: 'mid-range'
        },
        cancellationPatterns: {
          rate: 0,
          commonReasons: [],
          riskFactors: [],
          preventionSuggestions: []
        },
        seasonalPreferences: [],
        communicationStyle: {
          preferredChannel: 'text',
          responseTime: 0,
          conversationLength: 0,
          formality: 'casual'
        }
      },
      predictions: {
        nextService: {
          serviceId: 'default',
          serviceName: 'Haircut',
          confidence: 0.5,
          reasoning: ['Default recommendation'],
          suggestedTime: null,
          estimatedPrice: 35
        },
        nextBookingTime: null,
        priceRange: { min: 0, max: 100 },
        preferredStylist: null,
        loyaltyTier: 'bronze'
      },
      lastUpdated: new Date()
    }
  }

  async getTrendingServices(limit: number = 5): Promise<ProactiveSuggestion[]> {
    // Mock trending services - in reality, this would analyze current booking patterns
    return [
      {
        id: 'trending_1',
        type: 'service',
        title: 'Trending: Beard Grooming',
        message: 'Beard grooming services are very popular this month! Many customers are booking for summer.',
        confidence: 0.8,
        urgency: 'low',
        suggestedAction: {
          type: 'view',
          payload: { service: 'beard_grooming' }
        },
        triggeredBy: ['seasonal_trend', 'popular_service']
      }
    ].slice(0, limit)
  }
}

// Global predictive suggestions engine instance
export const predictiveSuggestionsEngine = new PredictiveSuggestionsEngine()
