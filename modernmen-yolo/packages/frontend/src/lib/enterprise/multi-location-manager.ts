// Enterprise Multi-Location Management System
// Advanced chain management, franchise operations, and business intelligence

export interface Location {
  id: string
  name: string
  address: {
    street: string
    city: string
    state: string
    zipCode: string
    country: string
  }
  coordinates: {
    latitude: number
    longitude: number
  }
  type: 'owned' | 'franchise' | 'partner'
  status: 'active' | 'inactive' | 'maintenance'
  managerId: string
  operatingHours: {
    [key: string]: {
      open: string
      close: string
      isClosed: boolean
    }
  }
  capacity: {
    maxConcurrentBookings: number
    totalStaff: number
    serviceStations: number
  }
  performance: {
    monthlyRevenue: number
    customerSatisfaction: number
    occupancyRate: number
    avgServiceTime: number
  }
  integrations: {
    posSystem?: string
    inventorySystem?: string
    crmSystem?: string
  }
}

export interface Franchise {
  id: string
  locationId: string
  franchiseeId: string
  contractStart: Date
  contractEnd: Date
  royaltyRate: number
  marketingFee: number
  territory: {
    radius: number // in miles
    exclusive: boolean
    restrictions: string[]
  }
  performance: {
    monthlyRevenue: number
    royaltyPaid: number
    customerCount: number
    satisfactionScore: number
  }
  compliance: {
    lastAudit: Date
    auditScore: number
    violations: string[]
    certifications: string[]
  }
}

export interface ChainAnalytics {
  totalLocations: number
  totalRevenue: number
  avgRevenuePerLocation: number
  topPerformingLocations: Location[]
  underPerformingLocations: Location[]
  marketPenetration: {
    [city: string]: {
      locations: number
      marketShare: number
      competition: string[]
    }
  }
  expansionOpportunities: {
    city: string
    population: number
    incomeLevel: number
    competition: number
    demandScore: number
    recommended: boolean
  }[]
}

export interface ResourceAllocation {
  staff: {
    barberId: string
    locationId: string
    schedule: {
      [date: string]: {
        start: string
        end: string
        location: string
      }
    }
    utilization: number
  }[]
  equipment: {
    type: string
    locationId: string
    availability: number
    maintenanceSchedule: Date[]
  }[]
  inventory: {
    productId: string
    locationId: string
    stockLevel: number
    reorderPoint: number
    supplier: string
  }[]
}

class MultiLocationManager {
  private readonly API_BASE = '/api/enterprise'

  // Location Management
  async getAllLocations(): Promise<Location[]> {
    try {
      const response = await fetch(`${this.API_BASE}/locations`)
      if (!response.ok) throw new Error('Failed to fetch locations')

      const locations = await response.json()
      return locations.map(this.transformLocationData)
    } catch (error) {
      console.error('Failed to get locations:', error)
      throw error
    }
  }

  async createLocation(locationData: Omit<Location, 'id'>): Promise<Location> {
    try {
      const response = await fetch(`${this.API_BASE}/locations`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(locationData)
      })

      if (!response.ok) throw new Error('Failed to create location')
      const location = await response.json()
      return this.transformLocationData(location)
    } catch (error) {
      console.error('Failed to create location:', error)
      throw error
    }
  }

  async updateLocation(locationId: string, updates: Partial<Location>): Promise<Location> {
    try {
      const response = await fetch(`${this.API_BASE}/locations/${locationId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates)
      })

      if (!response.ok) throw new Error('Failed to update location')
      const location = await response.json()
      return this.transformLocationData(location)
    } catch (error) {
      console.error('Failed to update location:', error)
      throw error
    }
  }

  // Franchise Management
  async getFranchises(): Promise<Franchise[]> {
    try {
      const response = await fetch(`${this.API_BASE}/franchises`)
      if (!response.ok) throw new Error('Failed to fetch franchises')

      const franchises = await response.json()
      return franchises.map(this.transformFranchiseData)
    } catch (error) {
      console.error('Failed to get franchises:', error)
      throw error
    }
  }

  async createFranchise(franchiseData: Omit<Franchise, 'id'>): Promise<Franchise> {
    try {
      const response = await fetch(`${this.API_BASE}/franchises`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...franchiseData,
          contractStart: franchiseData.contractStart.toISOString(),
          contractEnd: franchiseData.contractEnd.toISOString()
        })
      })

      if (!response.ok) throw new Error('Failed to create franchise')
      const franchise = await response.json()
      return this.transformFranchiseData(franchise)
    } catch (error) {
      console.error('Failed to create franchise:', error)
      throw error
    }
  }

  // Chain Analytics
  async getChainAnalytics(): Promise<ChainAnalytics> {
    try {
      const response = await fetch(`${this.API_BASE}/analytics/chain`)
      if (!response.ok) throw new Error('Failed to fetch chain analytics')

      return await response.json()
    } catch (error) {
      console.error('Failed to get chain analytics:', error)
      throw error
    }
  }

  async getLocationAnalytics(locationId: string): Promise<{
    revenue: number[]
    customers: number[]
    satisfaction: number[]
    utilization: number[]
    topServices: Array<{service: string, revenue: number}>
    peakHours: Array<{hour: string, bookings: number}>
  }> {
    try {
      const response = await fetch(`${this.API_BASE}/analytics/location/${locationId}`)
      if (!response.ok) throw new Error('Failed to fetch location analytics')

      return await response.json()
    } catch (error) {
      console.error('Failed to get location analytics:', error)
      throw error
    }
  }

  // Resource Allocation
  async optimizeResourceAllocation(): Promise<ResourceAllocation> {
    try {
      const response = await fetch(`${this.API_BASE}/optimization/resources`)
      if (!response.ok) throw new Error('Failed to optimize resources')

      return await response.json()
    } catch (error) {
      console.error('Failed to optimize resources:', error)
      throw error
    }
  }

  async scheduleStaffAcrossLocations(
    staffId: string,
    schedule: Array<{
      date: string
      locationId: string
      startTime: string
      endTime: string
    }>
  ): Promise<void> {
    try {
      const response = await fetch(`${this.API_BASE}/staff/${staffId}/schedule`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ schedule })
      })

      if (!response.ok) throw new Error('Failed to schedule staff')
    } catch (error) {
      console.error('Failed to schedule staff:', error)
      throw error
    }
  }

  // Market Analysis
  async analyzeMarketExpansion(): Promise<{
    recommendedLocations: Array<{
      city: string
      coordinates: {lat: number, lng: number}
      population: number
      incomeLevel: number
      competition: number
      demandScore: number
      estimatedRevenue: number
      setupCost: number
      paybackPeriod: number
    }>
    marketPenetration: {
      [region: string]: {
        currentLocations: number
        optimalLocations: number
        marketShare: number
        growthPotential: number
      }
    }
  }> {
    try {
      const response = await fetch(`${this.API_BASE}/market-analysis`)
      if (!response.ok) throw new Error('Failed to analyze market')

      return await response.json()
    } catch (error) {
      console.error('Failed to analyze market:', error)
      throw error
    }
  }

  // Cross-location booking
  async findAvailableSlots(
    serviceId: string,
    preferredLocationId?: string,
    radius?: number // in miles
  ): Promise<Array<{
    locationId: string
    locationName: string
    distance: number
    availableSlots: Array<{
      date: string
      time: string
      barberId: string
      barberName: string
    }>
  }>> {
    try {
      const params = new URLSearchParams({
        serviceId,
        ...(preferredLocationId && { locationId: preferredLocationId }),
        ...(radius && { radius: radius.toString() })
      })

      const response = await fetch(`${this.API_BASE}/availability?${params}`)
      if (!response.ok) throw new Error('Failed to find available slots')

      return await response.json()
    } catch (error) {
      console.error('Failed to find available slots:', error)
      throw error
    }
  }

  // Performance Monitoring
  async getPerformanceMetrics(): Promise<{
    overall: {
      totalRevenue: number
      totalCustomers: number
      avgSatisfaction: number
      systemEfficiency: number
    }
    byLocation: Array<{
      locationId: string
      revenue: number
      customers: number
      satisfaction: number
      efficiency: number
    }>
    trends: {
      revenueGrowth: number
      customerGrowth: number
      satisfactionTrend: number
      efficiencyTrend: number
    }
  }> {
    try {
      const response = await fetch(`${this.API_BASE}/performance`)
      if (!response.ok) throw new Error('Failed to get performance metrics')

      return await response.json()
    } catch (error) {
      console.error('Failed to get performance metrics:', error)
      throw error
    }
  }

  // Compliance and Auditing
  async runComplianceAudit(): Promise<{
    locationId: string
    auditDate: Date
    score: number
    violations: Array<{
      severity: 'low' | 'medium' | 'high' | 'critical'
      category: string
      description: string
      remediation: string
    }>
    certifications: string[]
    recommendations: string[]
  }[]> {
    try {
      const response = await fetch(`${this.API_BASE}/compliance/audit`)
      if (!response.ok) throw new Error('Failed to run compliance audit')

      const audits = await response.json()
      return audits.map((audit: any) => ({
        ...audit,
        auditDate: new Date(audit.auditDate)
      }))
    } catch (error) {
      console.error('Failed to run compliance audit:', error)
      throw error
    }
  }

  // Helper Methods
  private transformLocationData(data: any): Location {
    return {
      ...data,
      performance: {
        ...data.performance,
        monthlyRevenue: parseFloat(data.performance.monthlyRevenue)
      }
    }
  }

  private transformFranchiseData(data: any): Franchise {
    return {
      ...data,
      contractStart: new Date(data.contractStart),
      contractEnd: new Date(data.contractEnd),
      lastAudit: new Date(data.compliance.lastAudit)
    }
  }
}

export const multiLocationManager = new MultiLocationManager()

// React Hook for Multi-Location Management
export function useMultiLocation() {
  return {
    getAllLocations: multiLocationManager.getAllLocations.bind(multiLocationManager),
    createLocation: multiLocationManager.createLocation.bind(multiLocationManager),
    updateLocation: multiLocationManager.updateLocation.bind(multiLocationManager),
    getFranchises: multiLocationManager.getFranchises.bind(multiLocationManager),
    createFranchise: multiLocationManager.createFranchise.bind(multiLocationManager),
    getChainAnalytics: multiLocationManager.getChainAnalytics.bind(multiLocationManager),
    getLocationAnalytics: multiLocationManager.getLocationAnalytics.bind(multiLocationManager),
    optimizeResourceAllocation: multiLocationManager.optimizeResourceAllocation.bind(multiLocationManager),
    scheduleStaffAcrossLocations: multiLocationManager.scheduleStaffAcrossLocations.bind(multiLocationManager),
    analyzeMarketExpansion: multiLocationManager.analyzeMarketExpansion.bind(multiLocationManager),
    findAvailableSlots: multiLocationManager.findAvailableSlots.bind(multiLocationManager),
    getPerformanceMetrics: multiLocationManager.getPerformanceMetrics.bind(multiLocationManager),
    runComplianceAudit: multiLocationManager.runComplianceAudit.bind(multiLocationManager)
  }
}
