import { SALON_SERVICES } from '@/components/ai/ChatBotService'

export interface UserProfile {
  userId: string
  demographics: {
    age?: number
    gender?: 'male' | 'female' | 'other'
    location?: string
  }
  preferences: {
    priceRange: {
      min: number
      max: number
    }
    preferredServices: string[]
    preferredTimes: string[]
    preferredStylists: string[]
    skinType?: string
    hairType?: string
    allergies?: string[]
    specialRequests?: string[]
  }
  history: {
    pastServices: ServiceHistoryItem[]
    ratings: ServiceRating[]
    cancellations: CancellationRecord[]
    noShows: number
  }
  loyalty: {
    tier: 'bronze' | 'silver' | 'gold' | 'platinum'
    points: number
    memberSince: Date
    lastVisit?: Date
  }
  behavioral: {
    averageSpend: number
    visitFrequency: number
    preferredDayOfWeek: string[]
    preferredTimeOfDay: string
    bookingLeadTime: number // days in advance
    cancellationRate: number
  }
}

export interface ServiceHistoryItem {
  serviceId: string
  serviceName: string
  date: Date
  stylist: string
  price: number
  rating?: number
  notes?: string
}

export interface ServiceRating {
  serviceId: string
  rating: number
  date: Date
  comment?: string
}

export interface CancellationRecord {
  serviceId: string
  date: Date
  reason?: string
}

export interface ServiceRecommendation {
  serviceId: string
  serviceName: string
  confidence: number
  reasons: string[]
  predictedRating?: number
  estimatedPrice: number
  estimatedDuration: number
  nextBestTime?: string
  personalizedMessage: string
}

export interface ProductRecommendation {
  productId: string
  productName: string
  category: string
  price: number
  confidence: number
  reasons: string[]
  complementaryTo?: string[]
  usage: string
}

export interface RecommendationContext {
  currentIntent?: string
  currentService?: string
  timeOfDay?: string
  dayOfWeek?: string
  season?: string
  occasion?: string
  budget?: number
  urgency?: 'low' | 'medium' | 'high'
}

export class RecommendationEngine {
  private readonly API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || '/api'

  async generateServiceRecommendations(
    userId: string,
    context: RecommendationContext = {},
    limit: number = 5
  ): Promise<ServiceRecommendation[]> {
    try {
      // Get user profile
      const userProfile = await this.getUserProfile(userId)

      // Get available services
      const availableServices = await this.getAvailableServices()

      // Calculate recommendations
      const recommendations = await this.calculateServiceRecommendations(
        userProfile,
        availableServices,
        context
      )

      // Sort by confidence and limit results
      return recommendations
        .sort((a, b) => b.confidence - a.confidence)
        .slice(0, limit)

    } catch (error) {
      console.error('Service recommendation error:', error)
      return this.getFallbackRecommendations()
    }
  }

  async generateProductRecommendations(
    userId: string,
    context: RecommendationContext = {},
    limit: number = 3
  ): Promise<ProductRecommendation[]> {
    try {
      const userProfile = await this.getUserProfile(userId)
      const recommendations = await this.calculateProductRecommendations(userProfile, context)

      return recommendations
        .sort((a, b) => b.confidence - a.confidence)
        .slice(0, limit)

    } catch (error) {
      console.error('Product recommendation error:', error)
      return []
    }
  }

  private async getUserProfile(userId: string): Promise<UserProfile> {
    try {
      const response = await fetch(`${this.API_BASE_URL}/users/${userId}/profile`)

      if (!response.ok) {
        throw new Error('Failed to get user profile')
      }

      const profile = await response.json()
      return this.enrichUserProfile(profile)

    } catch (error) {
      console.error('User profile fetch error:', error)
      return this.createDefaultProfile(userId)
    }
  }

  private enrichUserProfile(profile: any): UserProfile {
    // Calculate behavioral metrics
    const pastServices = profile.history?.pastServices || []
    const totalSpent = pastServices.reduce((sum, service) => sum + service.price, 0)
    const averageSpend = pastServices.length > 0 ? totalSpent / pastServices.length : 0

    const visitDates = pastServices.map(s => new Date(s.date).getTime()).sort()
    const visitFrequency = this.calculateVisitFrequency(visitDates)

    const preferredDayOfWeek = this.calculatePreferredDays(pastServices)
    const preferredTimeOfDay = this.calculatePreferredTimeOfDay(pastServices)

    return {
      ...profile,
      behavioral: {
        averageSpend,
        visitFrequency,
        preferredDayOfWeek,
        preferredTimeOfDay,
        bookingLeadTime: this.calculateAverageLeadTime(pastServices),
        cancellationRate: this.calculateCancellationRate(profile.history?.cancellations || [], pastServices.length)
      }
    }
  }

  private calculateVisitFrequency(visitDates: number[]): number {
    if (visitDates.length < 2) return 0

    const intervals = []
    for (let i = 1; i < visitDates.length; i++) {
      intervals.push(visitDates[i] - visitDates[i - 1])
    }

    const averageInterval = intervals.reduce((sum, interval) => sum + interval, 0) / intervals.length
    const daysBetweenVisits = averageInterval / (1000 * 60 * 60 * 24)

    return daysBetweenVisits
  }

  private calculatePreferredDays(services: ServiceHistoryItem[]): string[] {
    const dayCounts: Record<string, number> = {}

    services.forEach(service => {
      const day = new Date(service.date).toLocaleLowerCase('en-US', { weekday: 'long' })
      dayCounts[day] = (dayCounts[day] || 0) + 1
    })

    return Object.entries(dayCounts)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 2)
      .map(([day]) => day)
  }

  private calculatePreferredTimeOfDay(services: ServiceHistoryItem[]): string {
    const timeSlots = services.map(service => {
      const hour = new Date(service.date).getHours()
      if (hour < 12) return 'morning'
      if (hour < 17) return 'afternoon'
      return 'evening'
    })

    const slotCounts = timeSlots.reduce((acc, slot) => {
      acc[slot] = (acc[slot] || 0) + 1
      return acc
    }, {} as Record<string, number>)

    return Object.entries(slotCounts)
      .sort(([,a], [,b]) => b - a)[0]?.[0] || 'afternoon'
  }

  private calculateAverageLeadTime(services: ServiceHistoryItem[]): number {
    const leadTimes = services.map(service => {
      const bookingDate = new Date(service.date)
      const today = new Date()
      return Math.max(0, (bookingDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24))
    })

    return leadTimes.length > 0
      ? leadTimes.reduce((sum, time) => sum + time, 0) / leadTimes.length
      : 7 // default 1 week
  }

  private calculateCancellationRate(cancellations: CancellationRecord[], totalBookings: number): number {
    return totalBookings > 0 ? cancellations.length / totalBookings : 0
  }

  private createDefaultProfile(userId: string): UserProfile {
    return {
      userId,
      demographics: {},
      preferences: {
        priceRange: { min: 0, max: 100 },
        preferredServices: [],
        preferredTimes: [],
        preferredStylists: [],
        specialRequests: []
      },
      history: {
        pastServices: [],
        ratings: [],
        cancellations: [],
        noShows: 0
      },
      loyalty: {
        tier: 'bronze',
        points: 0,
        memberSince: new Date()
      },
      behavioral: {
        averageSpend: 0,
        visitFrequency: 0,
        preferredDayOfWeek: [],
        preferredTimeOfDay: 'afternoon',
        bookingLeadTime: 7,
        cancellationRate: 0
      }
    }
  }

  private async getAvailableServices() {
    // In a real implementation, this would fetch from your services API
    return SALON_SERVICES
  }

  private async calculateServiceRecommendations(
    userProfile: UserProfile,
    availableServices: any[],
    context: RecommendationContext
  ): Promise<ServiceRecommendation[]> {
    const recommendations: ServiceRecommendation[] = []

    for (const service of availableServices) {
      const recommendation = await this.scoreServiceForUser(service, userProfile, context)
      if (recommendation.confidence > 0.3) { // Only include reasonably confident recommendations
        recommendations.push(recommendation)
      }
    }

    return recommendations
  }

  private async scoreServiceForUser(
    service: any,
    userProfile: UserProfile,
    context: RecommendationContext
  ): Promise<ServiceRecommendation> {
    let confidence = 0.5 // Base confidence
    const reasons: string[] = []

    // Price compatibility
    if (service.price >= userProfile.preferences.priceRange.min &&
        service.price <= userProfile.preferences.priceRange.max) {
      confidence += 0.2
      reasons.push(`Within your preferred price range ($${userProfile.preferences.priceRange.min}-$${userProfile.preferences.priceRange.max})`)
    }

    // Service preferences
    if (userProfile.preferences.preferredServices.includes(service.name.toLowerCase())) {
      confidence += 0.3
      reasons.push('Based on your service preferences')
    }

    // Past service history
    const pastServiceCount = userProfile.history.pastServices.filter(
      s => s.serviceId === service.id
    ).length

    if (pastServiceCount > 0) {
      confidence += 0.2
      reasons.push(`You've enjoyed this service ${pastServiceCount} time${pastServiceCount > 1 ? 's' : ''} before`)

      // Average rating for this service
      const ratings = userProfile.history.ratings.filter(r => r.serviceId === service.id)
      if (ratings.length > 0) {
        const avgRating = ratings.reduce((sum, r) => sum + r.rating, 0) / ratings.length
        if (avgRating >= 4) {
          confidence += 0.1
          reasons.push(`You rated similar services ${avgRating.toFixed(1)} stars`)
        }
      }
    }

    // Time preferences
    if (context.timeOfDay && this.isTimeCompatible(service, context.timeOfDay)) {
      confidence += 0.1
      reasons.push(`Available during your preferred ${context.timeOfDay}`)
    }

    // Seasonal/contextual factors
    if (context.season) {
      const seasonalBoost = this.getSeasonalBoost(service, context.season)
      confidence += seasonalBoost
      if (seasonalBoost > 0) {
        reasons.push(`Popular ${context.season} service`)
      }
    }

    // Urgency factor
    if (context.urgency === 'high') {
      confidence += 0.1
      reasons.push('Quick service option available')
    }

    // Loyalty program benefits
    if (userProfile.loyalty.tier !== 'bronze') {
      confidence += 0.1
      reasons.push(`${userProfile.loyalty.tier} member exclusive`)
    }

    // Behavioral patterns
    if (userProfile.behavioral.visitFrequency > 0) {
      const daysSinceLastVisit = userProfile.loyalty.lastVisit
        ? (Date.now() - userProfile.loyalty.lastVisit.getTime()) / (1000 * 60 * 60 * 24)
        : 30

      if (daysSinceLastVisit > userProfile.behavioral.visitFrequency * 1.5) {
        confidence += 0.15
        reasons.push("It's been a while since your last visit")
      }
    }

    const personalizedMessage = this.generatePersonalizedMessage(service, userProfile, reasons)

    return {
      serviceId: service.id,
      serviceName: service.name,
      confidence: Math.min(confidence, 1.0),
      reasons,
      predictedRating: this.predictServiceRating(service, userProfile),
      estimatedPrice: service.price,
      estimatedDuration: service.duration,
      nextBestTime: await this.findNextBestTime(service.id, userProfile),
      personalizedMessage
    }
  }

  private isTimeCompatible(service: any, timeOfDay: string): boolean {
    const serviceDuration = service.duration

    switch (timeOfDay) {
      case 'morning':
        return serviceDuration <= 60 // Morning slots are typically shorter
      case 'afternoon':
        return true // Most flexible
      case 'evening':
        return serviceDuration <= 90 // Evening slots can be longer
      default:
        return true
    }
  }

  private getSeasonalBoost(service: any, season: string): number {
    const seasonalServices: Record<string, string[]> = {
      summer: ['hair color', 'treatment', 'beard'],
      winter: ['haircut', 'shampoo', 'treatment'],
      spring: ['haircut', 'color', 'package'],
      fall: ['haircut', 'treatment', 'package']
    }

    const seasonServices = seasonalServices[season] || []
    const serviceName = service.name.toLowerCase()

    return seasonServices.some(s => serviceName.includes(s)) ? 0.1 : 0
  }

  private predictServiceRating(service: any, userProfile: UserProfile): number {
    // Simple collaborative filtering based on past ratings
    const similarServices = userProfile.history.ratings.filter(r =>
      this.areServicesSimilar(service, { id: r.serviceId } as any)
    )

    if (similarServices.length === 0) return 4.0 // Default prediction

    const avgRating = similarServices.reduce((sum, r) => sum + r.rating, 0) / similarServices.length
    return Math.min(avgRating + 0.1, 5.0) // Slight positive bias
  }

  private areServicesSimilar(service1: any, service2: any): boolean {
    // Simple similarity based on category and price range
    return service1.category === service2.category ||
           Math.abs(service1.price - service2.price) / service1.price < 0.3
  }

  private async findNextBestTime(serviceId: string, userProfile: UserProfile): Promise<string> {
    // Mock implementation - in reality, this would check availability
    const preferredTimes = userProfile.preferences.preferredTimes
    const preferredDays = userProfile.behavioral.preferredDayOfWeek

    if (preferredTimes.length > 0 && preferredDays.length > 0) {
      return `${preferredDays[0]} at ${preferredTimes[0]}`
    }

    return 'Tomorrow at 2:00 PM'
  }

  private generatePersonalizedMessage(
    service: any,
    userProfile: UserProfile,
    reasons: string[]
  ): string {
    const greeting = userProfile.loyalty.tier === 'gold' || userProfile.loyalty.tier === 'platinum'
      ? `Hello ${userProfile.loyalty.tier} member! `
      : 'Hi there! '

    const servicePitch = `I think you'd love our ${service.name} service.`

    const reasonText = reasons.length > 0
      ? ` ${reasons.slice(0, 2).join(' and ')}.`
      : ''

    const callToAction = userProfile.behavioral.bookingLeadTime > 0
      ? ` Would you like to book this service?`
      : ` Ready to schedule your appointment?`

    return greeting + servicePitch + reasonText + callToAction
  }

  private async calculateProductRecommendations(
    userProfile: UserProfile,
    context: RecommendationContext
  ): Promise<ProductRecommendation[]> {
    // Mock product recommendations - in reality, this would query your products API
    const mockProducts: ProductRecommendation[] = [
      {
        productId: '1',
        productName: 'Premium Hair Oil',
        category: 'Treatment',
        price: 25,
        confidence: 0.8,
        reasons: ['Perfect for your hair type', 'Highly rated by similar customers'],
        usage: 'Apply daily for healthy, shiny hair'
      },
      {
        productId: '2',
        productName: 'Beard Oil',
        category: 'Grooming',
        price: 20,
        confidence: 0.7,
        reasons: ['Complements your beard trim service', 'Natural ingredients'],
        complementaryTo: ['Beard Trim'],
        usage: 'Apply twice daily for soft, manageable beard'
      }
    ]

    return mockProducts.filter(product =>
      this.isProductRelevant(product, userProfile, context)
    )
  }

  private isProductRelevant(
    product: ProductRecommendation,
    userProfile: UserProfile,
    context: RecommendationContext
  ): boolean {
    // Check if user has used complementary services
    if (product.complementaryTo) {
      const hasUsedComplementary = product.complementaryTo.some(serviceName =>
        userProfile.history.pastServices.some(s =>
          s.serviceName.toLowerCase().includes(serviceName.toLowerCase())
        )
      )

      if (!hasUsedComplementary) return false
    }

    // Check price range
    if (product.price > userProfile.preferences.priceRange.max) return false

    return true
  }

  private getFallbackRecommendations(): ServiceRecommendation[] {
    // Return popular services as fallback
    return SALON_SERVICES.slice(0, 3).map(service => ({
      serviceId: service.id,
      serviceName: service.name,
      confidence: 0.6,
      reasons: ['Popular service', 'Highly rated'],
      estimatedPrice: service.price,
      estimatedDuration: service.duration,
      personalizedMessage: `Our ${service.name} is one of our most popular services. Would you like to learn more?`
    }))
  }

  async getTrendingServices(limit: number = 5): Promise<ServiceRecommendation[]> {
    // Mock trending services - in reality, this would analyze booking patterns
    return SALON_SERVICES.slice(0, limit).map(service => ({
      serviceId: service.id,
      serviceName: service.name,
      confidence: 0.7,
      reasons: ['Trending this month', 'Customer favorite'],
      estimatedPrice: service.price,
      estimatedDuration: service.duration,
      personalizedMessage: `${service.name} is trending! Many customers are loving this service.`
    }))
  }

  async getSeasonalRecommendations(season: string): Promise<ServiceRecommendation[]> {
    const seasonalKeywords = {
      summer: ['treatment', 'color'],
      winter: ['cut', 'shampoo'],
      spring: ['cut', 'color'],
      fall: ['treatment', 'package']
    }

    const keywords = seasonalKeywords[season as keyof typeof seasonalKeywords] || []

    return SALON_SERVICES.filter(service =>
      keywords.some(keyword => service.name.toLowerCase().includes(keyword))
    ).map(service => ({
      serviceId: service.id,
      serviceName: service.name,
      confidence: 0.8,
      reasons: [`Perfect for ${season}`, 'Seasonal favorite'],
      estimatedPrice: service.price,
      estimatedDuration: service.duration,
      personalizedMessage: `Our ${service.name} is perfect for ${season}! 🌸`
    }))
  }
}

// Global recommendation engine instance
export const recommendationEngine = new RecommendationEngine()
