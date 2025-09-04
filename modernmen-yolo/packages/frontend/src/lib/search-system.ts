/**
 * Advanced Search and Filtering System for ModernMen Barbershop
 * Comprehensive search capabilities with intelligent filtering and ranking
 */

import { supabase } from '@/lib/supabase/client'
import { AppError, createErrorResponse, handleApiError } from '@/lib/error-handling'

// Search interfaces
export interface SearchQuery {
  query: string
  filters: SearchFilters
  pagination: SearchPagination
  sorting: SearchSorting
}

export interface SearchFilters {
  dateRange?: {
    start: string
    end: string
  }
  services?: string[]
  barbers?: string[]
  status?: string[]
  priceRange?: {
    min: number
    max: number
  }
  location?: string
  tags?: string[]
  customFields?: Record<string, any>
}

export interface SearchPagination {
  page: number
  limit: number
}

export interface SearchSorting {
  field: string
  direction: 'asc' | 'desc'
  secondarySort?: {
    field: string
    direction: 'asc' | 'desc'
  }
}

export interface SearchResult<T> {
  items: T[]
  total: number
  facets: SearchFacets
  suggestions: string[]
  searchTime: number
  hasMore: boolean
  aggregations?: Record<string, any>
}

export interface SearchFacets {
  services: FacetItem[]
  barbers: FacetItem[]
  status: FacetItem[]
  priceRanges: FacetItem[]
  dateRanges: FacetItem[]
  locations: FacetItem[]
}

export interface FacetItem {
  value: string
  label: string
  count: number
  selected: boolean
}

// Appointment search interface
export interface AppointmentSearchResult {
  id: string
  customerName: string
  customerEmail: string
  service: string
  barber: string
  date: string
  time: string
  status: string
  duration: number
  price: number
  notes: string
  created_at: string
  searchScore: number
  highlightedFields: Record<string, string>
}

// Customer search interface
export interface CustomerSearchResult {
  id: string
  name: string
  email: string
  phone: string
  totalAppointments: number
  totalSpent: number
  lastVisit: string
  averageRating: number
  tags: string[]
  searchScore: number
  highlightedFields: Record<string, string>
}

// Service search interface
export interface ServiceSearchResult {
  id: string
  name: string
  description: string
  category: string
  duration: number
  price: number
  popularity: number
  averageRating: number
  availableBarbers: string[]
  searchScore: number
  highlightedFields: Record<string, string>
}

class SearchSystem {
  private searchCache: Map<string, any> = new Map()
  private cacheTimeout = 5 * 60 * 1000 // 5 minutes

  /**
   * Search appointments with advanced filtering and ranking
   */
  async searchAppointments(searchQuery: SearchQuery): Promise<SearchResult<AppointmentSearchResult>> {
    const startTime = performance.now()
    
    try {
      // Build the search query
      let query = supabase
        .from('appointments')
        .select(`
          *,
          customers:customer_id (
            id,
            name,
            email,
            phone
          ),
          services:service_id (
            id,
            name,
            description,
            category,
            duration,
            price
          ),
          staff:staff_id (
            id,
            name,
            email
          )
        `, { count: 'exact' })

      // Apply text search
      if (searchQuery.query.trim()) {
        const searchTerms = this.parseSearchQuery(searchQuery.query)
        query = this.applyTextSearch(query, searchTerms, [
          'customers.name',
          'customers.email',
          'services.name',
          'staff.name',
          'notes'
        ])
      }

      // Apply filters
      query = this.applyFilters(query, searchQuery.filters)

      // Apply sorting
      query = this.applySorting(query, searchQuery.sorting)

      // Apply pagination
      const { page, limit } = searchQuery.pagination
      const from = (page - 1) * limit
      query = query.range(from, from + limit - 1)

      const { data, error, count } = await query

      if (error) throw error

      // Transform and score results
      const scoredResults = this.scoreAndTransformAppointments(data || [], searchQuery.query)

      // Generate facets
      const facets = await this.generateAppointmentFacets(searchQuery.filters)

      // Generate suggestions
      const suggestions = this.generateSearchSuggestions(searchQuery.query, 'appointments')

      const searchTime = performance.now() - startTime

      return {
        items: scoredResults,
        total: count || 0,
        facets,
        suggestions,
        searchTime,
        hasMore: (count || 0) > from + limit,
        aggregations: await this.generateAppointmentAggregations(searchQuery.filters)
      }

    } catch (error) {
      console.error('Appointment search error:', error)
      throw new Error('Failed to search appointments')
    }
  }

  /**
   * Search customers with intelligent ranking
   */
  async searchCustomers(searchQuery: SearchQuery): Promise<SearchResult<CustomerSearchResult>> {
    const startTime = performance.now()
    
    try {
      let query = supabase
        .from('customers')
        .select(`
          *,
          appointments (
            id,
            appointment_date,
            services (price),
            status
          )
        `, { count: 'exact' })

      // Apply text search
      if (searchQuery.query.trim()) {
        const searchTerms = this.parseSearchQuery(searchQuery.query)
        query = this.applyTextSearch(query, searchTerms, [
          'name',
          'email',
          'phone'
        ])
      }

      // Apply filters
      query = this.applyCustomerFilters(query, searchQuery.filters)

      // Apply sorting
      query = this.applySorting(query, searchQuery.sorting)

      // Apply pagination
      const { page, limit } = searchQuery.pagination
      const from = (page - 1) * limit
      query = query.range(from, from + limit - 1)

      const { data, error, count } = await query

      if (error) throw error

      // Transform and score results
      const scoredResults = this.scoreAndTransformCustomers(data || [], searchQuery.query)

      // Generate facets
      const facets = await this.generateCustomerFacets(searchQuery.filters)

      // Generate suggestions
      const suggestions = this.generateSearchSuggestions(searchQuery.query, 'customers')

      const searchTime = performance.now() - startTime

      return {
        items: scoredResults,
        total: count || 0,
        facets,
        suggestions,
        searchTime,
        hasMore: (count || 0) > from + limit
      }

    } catch (error) {
      console.error('Customer search error:', error)
      throw new Error('Failed to search customers')
    }
  }

  /**
   * Search services with popularity and availability ranking
   */
  async searchServices(searchQuery: SearchQuery): Promise<SearchResult<ServiceSearchResult>> {
    const startTime = performance.now()
    
    try {
      let query = supabase
        .from('services')
        .select(`
          *,
          appointments (
            id,
            created_at,
            staff_id
          )
        `, { count: 'exact' })

      // Apply text search
      if (searchQuery.query.trim()) {
        const searchTerms = this.parseSearchQuery(searchQuery.query)
        query = this.applyTextSearch(query, searchTerms, [
          'name',
          'description',
          'category'
        ])
      }

      // Apply filters
      query = this.applyServiceFilters(query, searchQuery.filters)

      // Apply sorting
      query = this.applySorting(query, searchQuery.sorting)

      // Apply pagination
      const { page, limit } = searchQuery.pagination
      const from = (page - 1) * limit
      query = query.range(from, from + limit - 1)

      const { data, error, count } = await query

      if (error) throw error

      // Transform and score results
      const scoredResults = this.scoreAndTransformServices(data || [], searchQuery.query)

      // Generate facets
      const facets = await this.generateServiceFacets(searchQuery.filters)

      // Generate suggestions
      const suggestions = this.generateSearchSuggestions(searchQuery.query, 'services')

      const searchTime = performance.now() - startTime

      return {
        items: scoredResults,
        total: count || 0,
        facets,
        suggestions,
        searchTime,
        hasMore: (count || 0) > from + limit
      }

    } catch (error) {
      console.error('Service search error:', error)
      throw new Error('Failed to search services')
    }
  }

  /**
   * Intelligent autocomplete suggestions
   */
  async getAutocomplete(query: string, type: 'appointments' | 'customers' | 'services'): Promise<string[]> {
    if (!query || query.length < 2) return []

    const cacheKey = `autocomplete_${type}_${query}`
    const cached = this.searchCache.get(cacheKey)
    
    if (cached && Date.now() - cached.timestamp < this.cacheTimeout) {
      return cached.data
    }

    try {
      let suggestions: string[] = []

      switch (type) {
        case 'appointments':
          suggestions = await this.getAppointmentSuggestions(query)
          break
        case 'customers':
          suggestions = await this.getCustomerSuggestions(query)
          break
        case 'services':
          suggestions = await this.getServiceSuggestions(query)
          break
      }

      // Cache the results
      this.searchCache.set(cacheKey, {
        data: suggestions,
        timestamp: Date.now()
      })

      return suggestions

    } catch (error) {
      console.error('Autocomplete error:', error)
      return []
    }
  }

  /**
   * Advanced analytics search for business insights
   */
  async searchAnalytics(searchQuery: SearchQuery & {
    metrics: string[]
    groupBy: string[]
  }): Promise<{
    data: any[]
    summary: Record<string, number>
    trends: Record<string, any[]>
    insights: string[]
  }> {
    try {
      // This would implement advanced analytics queries
      // For now, return mock data structure
      return {
        data: [],
        summary: {},
        trends: {},
        insights: []
      }
    } catch (error) {
      console.error('Analytics search error:', error)
      throw new Error('Failed to search analytics')
    }
  }

  /**
   * Private helper methods
   */
  private parseSearchQuery(query: string): string[] {
    return query
      .toLowerCase()
      .split(/\s+/)
      .filter(term => term.length > 1)
      .map(term => term.replace(/[^\w]/g, ''))
  }

  private applyTextSearch(query: any, searchTerms: string[], fields: string[]) {
    if (searchTerms.length === 0) return query

    // Use Supabase's text search capabilities
    const searchConditions = searchTerms.map(term => 
      fields.map(field => `${field}.ilike.%${term}%`).join(',')
    ).join(',')

    return query.or(searchConditions)
  }

  private applyFilters(query: any, filters: SearchFilters) {
    if (filters.dateRange) {
      query = query
        .gte('appointment_date', filters.dateRange.start)
        .lte('appointment_date', filters.dateRange.end)
    }

    if (filters.services?.length) {
      query = query.in('service_id', filters.services)
    }

    if (filters.barbers?.length) {
      query = query.in('staff_id', filters.barbers)
    }

    if (filters.status?.length) {
      query = query.in('status', filters.status)
    }

    if (filters.priceRange) {
      query = query
        .gte('services.price', filters.priceRange.min)
        .lte('services.price', filters.priceRange.max)
    }

    return query
  }

  private applyCustomerFilters(query: any, filters: SearchFilters) {
    // Implement customer-specific filters
    return query
  }

  private applyServiceFilters(query: any, filters: SearchFilters) {
    if (filters.priceRange) {
      query = query
        .gte('price', filters.priceRange.min)
        .lte('price', filters.priceRange.max)
    }

    return query
  }

  private applySorting(query: any, sorting: SearchSorting) {
    query = query.order(sorting.field, { ascending: sorting.direction === 'asc' })

    if (sorting.secondarySort) {
      query = query.order(sorting.secondarySort.field, { 
        ascending: sorting.secondarySort.direction === 'asc' 
      })
    }

    return query
  }

  private scoreAndTransformAppointments(data: any[], searchQuery: string): AppointmentSearchResult[] {
    return data.map(item => {
      const score = this.calculateSearchScore(item, searchQuery, [
        'customers.name',
        'services.name',
        'staff.name'
      ])

      return {
        id: item.id,
        customerName: item.customers?.name || 'Unknown',
        customerEmail: item.customers?.email || '',
        service: item.services?.name || 'Unknown Service',
        barber: item.staff?.name || 'Unassigned',
        date: item.appointment_date,
        time: item.start_time,
        status: item.status,
        duration: item.duration,
        price: item.services?.price || 0,
        notes: item.notes || '',
        created_at: item.created_at,
        searchScore: score,
        highlightedFields: this.generateHighlights(item, searchQuery)
      }
    }).sort((a, b) => b.searchScore - a.searchScore)
  }

  private scoreAndTransformCustomers(data: any[], searchQuery: string): CustomerSearchResult[] {
    return data.map(item => {
      const score = this.calculateSearchScore(item, searchQuery, ['name', 'email'])
      const appointments = item.appointments || []
      
      return {
        id: item.id,
        name: item.name,
        email: item.email,
        phone: item.phone,
        totalAppointments: appointments.length,
        totalSpent: appointments.reduce((sum: number, apt: any) => sum + (apt.services?.price || 0), 0),
        lastVisit: appointments.length > 0 ? appointments[0]?.appointment_date : '',
        averageRating: 4.5, // Mock rating
        tags: item.tags || [],
        searchScore: score,
        highlightedFields: this.generateHighlights(item, searchQuery)
      }
    }).sort((a, b) => b.searchScore - a.searchScore)
  }

  private scoreAndTransformServices(data: any[], searchQuery: string): ServiceSearchResult[] {
    return data.map(item => {
      const score = this.calculateSearchScore(item, searchQuery, ['name', 'description'])
      const appointments = item.appointments || []
      
      return {
        id: item.id,
        name: item.name,
        description: item.description,
        category: item.category,
        duration: item.duration,
        price: item.price,
        popularity: appointments.length,
        averageRating: 4.5, // Mock rating
        availableBarbers: Array.from(new Set(appointments.map((apt: any) => String(apt.staff_id)))) as string[],
        searchScore: score,
        highlightedFields: this.generateHighlights(item, searchQuery)
      }
    }).sort((a, b) => b.searchScore - a.searchScore)
  }

  private calculateSearchScore(item: any, searchQuery: string, fields: string[]): number {
    if (!searchQuery.trim()) return 1

    const terms = this.parseSearchQuery(searchQuery)
    let score = 0

    fields.forEach(field => {
      const value = this.getNestedValue(item, field)?.toLowerCase() || ''
      
      terms.forEach(term => {
        if (value.includes(term)) {
          // Exact match gets higher score
          if (value === term) {
            score += 10
          } else if (value.startsWith(term)) {
            score += 5
          } else {
            score += 1
          }
        }
      })
    })

    return score
  }

  private generateHighlights(item: any, searchQuery: string): Record<string, string> {
    const highlights: Record<string, string> = {}
    const terms = this.parseSearchQuery(searchQuery)
    
    // This would implement text highlighting logic
    // For now, return empty highlights
    
    return highlights
  }

  private getNestedValue(obj: any, path: string): any {
    return path.split('.').reduce((current, key) => current?.[key], obj)
  }

  private async generateAppointmentFacets(filters: SearchFilters): Promise<SearchFacets> {
    // Generate facets based on current data and filters
    // This would query the database to get counts for each facet
    
    return {
      services: [],
      barbers: [],
      status: [],
      priceRanges: [],
      dateRanges: [],
      locations: []
    }
  }

  private async generateCustomerFacets(filters: SearchFilters): Promise<SearchFacets> {
    return {
      services: [],
      barbers: [],
      status: [],
      priceRanges: [],
      dateRanges: [],
      locations: []
    }
  }

  private async generateServiceFacets(filters: SearchFilters): Promise<SearchFacets> {
    return {
      services: [],
      barbers: [],
      status: [],
      priceRanges: [],
      dateRanges: [],
      locations: []
    }
  }

  private async generateAppointmentAggregations(filters: SearchFilters): Promise<Record<string, any>> {
    // Generate aggregations like total revenue, average duration, etc.
    return {}
  }

  private generateSearchSuggestions(query: string, type: string): string[] {
    // Generate intelligent search suggestions based on query and type
    const commonSuggestions = {
      appointments: ['today', 'this week', 'confirmed', 'pending', 'cancelled'],
      customers: ['vip', 'frequent', 'new', 'inactive'],
      services: ['haircut', 'beard', 'package', 'popular', 'premium']
    }

    return commonSuggestions[type as keyof typeof commonSuggestions] || []
  }

  private async getAppointmentSuggestions(query: string): Promise<string[]> {
    const { data } = await supabase
      .from('appointments')
      .select('customers(name), services(name), staff(name)')
      .ilike('customers.name', `%${query}%`)
      .limit(10)

    return data?.map((item: any) => item.customers?.name).filter(Boolean) || []
  }

  private async getCustomerSuggestions(query: string): Promise<string[]> {
    const { data } = await supabase
      .from('customers')
      .select('name, email')
      .or(`name.ilike.%${query}%,email.ilike.%${query}%`)
      .limit(10)

    return data?.map(item => item.name).filter(Boolean) || []
  }

  private async getServiceSuggestions(query: string): Promise<string[]> {
    const { data } = await supabase
      .from('services')
      .select('name')
      .ilike('name', `%${query}%`)
      .limit(10)

    return data?.map(item => item.name).filter(Boolean) || []
  }
}

// Export singleton instance
export const searchSystem = new SearchSystem()

// Export convenience functions
export const searchAppointments = (searchQuery: SearchQuery) => searchSystem.searchAppointments(searchQuery)
export const searchCustomers = (searchQuery: SearchQuery) => searchSystem.searchCustomers(searchQuery)
export const searchServices = (searchQuery: SearchQuery) => searchSystem.searchServices(searchQuery)
export const getAutocomplete = (query: string, type: 'appointments' | 'customers' | 'services') => searchSystem.getAutocomplete(query, type)