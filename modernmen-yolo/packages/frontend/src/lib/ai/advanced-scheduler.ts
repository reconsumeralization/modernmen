// AI-Powered Advanced Scheduling System
// Intelligent booking optimization, conflict resolution, and resource management

export interface SchedulingConstraints {
  barberId: string
  date: string
  availableHours: {
    start: string
    end: string
  }
  skills: string[]
  preferences: {
    maxConsecutiveHours: number
    preferredBreakTimes: string[]
    workloadPreference: 'low' | 'medium' | 'high'
  }
  currentBookings: Array<{
    startTime: string
    endTime: string
    serviceId: string
    customerId: string
  }>
}

export interface BookingRequest {
  customerId: string
  serviceId: string
  preferredDate: string
  preferredTime?: string
  flexibility: {
    dateRange: number // days willing to wait
    timeFlexibility: number // hours of flexibility
    locationFlexibility: boolean
  }
  specialRequests?: string
  urgency: 'low' | 'medium' | 'high'
}

export interface OptimizedSchedule {
  barberId: string
  date: string
  bookings: Array<{
    id: string
    customerId: string
    serviceId: string
    startTime: string
    endTime: string
    confidence: number
    reasoning: string
  }>
  utilization: number
  breaks: Array<{
    startTime: string
    endTime: string
    type: 'lunch' | 'rest' | 'maintenance'
  }>
  efficiency: {
    totalRevenue: number
    customerSatisfaction: number
    barberFatigue: number
  }
}

export interface ConflictResolution {
  conflictId: string
  type: 'double_booking' | 'staff_unavailable' | 'resource_conflict' | 'time_constraint'
  severity: 'low' | 'medium' | 'high' | 'critical'
  affectedBookings: string[]
  resolution: {
    recommendedAction: 'reschedule' | 'reassign' | 'cancel' | 'split_service'
    alternativeSlots: Array<{
      barberId: string
      date: string
      time: string
      confidence: number
    }>
    impact: {
      revenueLoss: number
      customerSatisfaction: number
      operationalEfficiency: number
    }
  }
}

export interface SchedulingInsights {
  peakDemandHours: Array<{
    hour: string
    demand: number
    capacity: number
    utilization: number
  }>
  servicePatterns: Array<{
    serviceId: string
    optimalDuration: number
    setupTime: number
    cleanupTime: number
    revenuePerHour: number
  }>
  barberPerformance: Array<{
    barberId: string
    efficiency: number
    customerSatisfaction: number
    revenueGenerated: number
    fatigueIndex: number
  }>
  optimization: {
    potentialRevenueIncrease: number
    customerWaitTimeReduction: number
    staffUtilizationImprovement: number
    recommendations: string[]
  }
}

class AdvancedScheduler {
  private readonly API_BASE = '/api/ai/scheduling'

  // Intelligent Booking Optimization
  async optimizeBooking(request: BookingRequest): Promise<{
    recommendedSlots: Array<{
      barberId: string
      date: string
      time: string
      confidence: number
      reasoning: string
      expectedSatisfaction: number
    }>
    alternatives: Array<{
      type: 'different_time' | 'different_date' | 'different_barber' | 'different_location'
      options: Array<{
        barberId: string
        date: string
        time: string
        tradeoffs: string[]
      }>
    }>
  }> {
    try {
      const response = await fetch(`${this.API_BASE}/optimize-booking`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(request)
      })

      if (!response.ok) throw new Error('Failed to optimize booking')
      return await response.json()
    } catch (error) {
      console.error('Booking optimization failed:', error)
      throw error
    }
  }

  // Automated Schedule Generation
  async generateOptimalSchedule(
    date: string,
    constraints: SchedulingConstraints[],
    existingBookings: any[]
  ): Promise<OptimizedSchedule[]> {
    try {
      const response = await fetch(`${this.API_BASE}/generate-schedule`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          date,
          constraints,
          existingBookings
        })
      })

      if (!response.ok) throw new Error('Failed to generate schedule')
      const schedules = await response.json()

      return schedules.map((schedule: any) => ({
        ...schedule,
        efficiency: {
          ...schedule.efficiency,
          totalRevenue: parseFloat(schedule.efficiency.totalRevenue)
        }
      }))
    } catch (error) {
      console.error('Schedule generation failed:', error)
      throw error
    }
  }

  // Conflict Detection and Resolution
  async detectConflicts(
    proposedBookings: any[],
    existingSchedule: any[]
  ): Promise<ConflictResolution[]> {
    try {
      const response = await fetch(`${this.API_BASE}/detect-conflicts`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          proposedBookings,
          existingSchedule
        })
      })

      if (!response.ok) throw new Error('Failed to detect conflicts')
      const conflicts = await response.json()

      return conflicts.map((conflict: any) => ({
        ...conflict,
        resolution: {
          ...conflict.resolution,
          impact: {
            ...conflict.resolution.impact,
            revenueLoss: parseFloat(conflict.resolution.impact.revenueLoss)
          }
        }
      }))
    } catch (error) {
      console.error('Conflict detection failed:', error)
      throw error
    }
  }

  // Real-time Schedule Optimization
  async optimizeRealtime(
    currentSchedule: any[],
    incomingRequests: BookingRequest[]
  ): Promise<{
    optimizedSchedule: OptimizedSchedule[]
    resolvedConflicts: ConflictResolution[]
    performance: {
      utilization: number
      revenue: number
      satisfaction: number
    }
  }> {
    try {
      const response = await fetch(`${this.API_BASE}/optimize-realtime`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          currentSchedule,
          incomingRequests
        })
      })

      if (!response.ok) throw new Error('Failed to optimize realtime')
      return await response.json()
    } catch (error) {
      console.error('Realtime optimization failed:', error)
      throw error
    }
  }

  // Predictive No-Show Analysis
  async predictNoShows(
    upcomingBookings: any[]
  ): Promise<Array<{
    bookingId: string
    noShowProbability: number
    riskFactors: string[]
    mitigationStrategies: string[]
    recommendedActions: string[]
  }>> {
    try {
      const response = await fetch(`${this.API_BASE}/predict-no-shows`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ upcomingBookings })
      })

      if (!response.ok) throw new Error('Failed to predict no-shows')
      return await response.json()
    } catch (error) {
      console.error('No-show prediction failed:', error)
      throw error
    }
  }

  // Dynamic Pricing Optimization
  async optimizePricing(
    serviceId: string,
    demand: number,
    competition: number,
    timeOfDay: string
  ): Promise<{
    recommendedPrice: number
    confidence: number
    expectedRevenue: number
    reasoning: string
  }> {
    try {
      const response = await fetch(`${this.API_BASE}/optimize-pricing`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          serviceId,
          demand,
          competition,
          timeOfDay
        })
      })

      if (!response.ok) throw new Error('Failed to optimize pricing')
      return await response.json()
    } catch (error) {
      console.error('Pricing optimization failed:', error)
      throw error
    }
  }

  // Scheduling Insights and Analytics
  async getSchedulingInsights(
    startDate: Date,
    endDate: Date
  ): Promise<SchedulingInsights> {
    try {
      const params = new URLSearchParams({
        start: startDate.toISOString(),
        end: endDate.toISOString()
      })

      const response = await fetch(`${this.API_BASE}/insights?${params}`)
      if (!response.ok) throw new Error('Failed to get scheduling insights')

      const insights = await response.json()

      return {
        ...insights,
        optimization: {
          ...insights.optimization,
          potentialRevenueIncrease: parseFloat(insights.optimization.potentialRevenueIncrease)
        }
      }
    } catch (error) {
      console.error('Scheduling insights failed:', error)
      throw error
    }
  }

  // Waitlist Management
  async manageWaitlist(
    serviceId: string,
    requestedDate: string,
    customerPreferences: any
  ): Promise<{
    availableSlots: Array<{
      date: string
      time: string
      barberId: string
      confidence: number
    }>
    waitlistPosition: number
    estimatedWaitTime: number
    alternatives: Array<{
      service: string
      date: string
      time: string
      discount: number
    }>
  }> {
    try {
      const response = await fetch(`${this.API_BASE}/waitlist`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          serviceId,
          requestedDate,
          customerPreferences
        })
      })

      if (!response.ok) throw new Error('Failed to manage waitlist')
      return await response.json()
    } catch (error) {
      console.error('Waitlist management failed:', error)
      throw error
    }
  }

  // Automated Rescheduling
  async suggestRescheduling(
    bookingId: string,
    reason: 'conflict' | 'no_show' | 'customer_request' | 'staff_unavailable'
  ): Promise<{
    alternatives: Array<{
      date: string
      time: string
      barberId: string
      confidence: number
      customerImpact: number
      businessImpact: number
    }>
    recommendedAction: 'reschedule' | 'cancel' | 'compensation'
    compensationOffer?: {
      type: 'discount' | 'free_service' | 'gift_card'
      value: number
      description: string
    }
  }> {
    try {
      const response = await fetch(`${this.API_BASE}/reschedule/${bookingId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ reason })
      })

      if (!response.ok) throw new Error('Failed to suggest rescheduling')
      return await response.json()
    } catch (error) {
      console.error('Rescheduling suggestion failed:', error)
      throw error
    }
  }

  // Load Balancing Optimization
  async balanceWorkload(
    date: string,
    barbers: string[],
    existingBookings: any[]
  ): Promise<{
    optimizedAssignments: Array<{
      bookingId: string
      originalBarber: string
      newBarber: string
      reason: string
      efficiencyGain: number
    }>
    utilizationImprovement: number
    customerImpact: number
  }> {
    try {
      const response = await fetch(`${this.API_BASE}/balance-workload`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          date,
          barbers,
          existingBookings
        })
      })

      if (!response.ok) throw new Error('Failed to balance workload')
      return await response.json()
    } catch (error) {
      console.error('Workload balancing failed:', error)
      throw error
    }
  }
}

export const advancedScheduler = new AdvancedScheduler()

// React Hook for Advanced Scheduling
export function useAdvancedScheduling() {
  return {
    optimizeBooking: advancedScheduler.optimizeBooking.bind(advancedScheduler),
    generateOptimalSchedule: advancedScheduler.generateOptimalSchedule.bind(advancedScheduler),
    detectConflicts: advancedScheduler.detectConflicts.bind(advancedScheduler),
    optimizeRealtime: advancedScheduler.optimizeRealtime.bind(advancedScheduler),
    predictNoShows: advancedScheduler.predictNoShows.bind(advancedScheduler),
    optimizePricing: advancedScheduler.optimizePricing.bind(advancedScheduler),
    getSchedulingInsights: advancedScheduler.getSchedulingInsights.bind(advancedScheduler),
    manageWaitlist: advancedScheduler.manageWaitlist.bind(advancedScheduler),
    suggestRescheduling: advancedScheduler.suggestRescheduling.bind(advancedScheduler),
    balanceWorkload: advancedScheduler.balanceWorkload.bind(advancedScheduler)
  }
}
