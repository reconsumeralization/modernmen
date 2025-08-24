import { NextRequest, NextResponse } from 'next/server'
import getPayloadClient from '@/payload'
import { logger } from '@/lib/logger'

export interface AdvancedSearchFilters {
  collections?: string[]
  dateRange?: {
    from?: string
    to?: string
  }
  priceRange?: {
    min?: number
    max?: number
  }
  status?: string[]
  tags?: string[]
  categories?: string[]
  location?: string
  rating?: {
    min?: number
    max?: number
  }
}

export interface AdvancedSearchOptions {
  sortBy?: string
  sortOrder?: 'asc' | 'desc'
  page?: number
  limit?: number
  includeInactive?: boolean
  fuzzySearch?: boolean
}

export async function POST(request: NextRequest) {
  try {
    const payload = await getPayloadClient()
    const body = await request.json()
    
    const {
      query = '',
      filters = {} as AdvancedSearchFilters,
      options = {} as AdvancedSearchOptions
    } = body

    const {
      collections = ['services', 'customers', 'stylists', 'appointments'],
      dateRange,
      priceRange,
      status,
      tags,
      categories,
      location,
      rating
    } = filters

    const {
      sortBy = 'updatedAt',
      sortOrder = 'desc',
      page = 1,
      limit = 20,
      includeInactive = false,
      fuzzySearch = true
    } = options

    logger.info('🔍 Advanced search initiated', { query, collections, filters })

    const results: any[] = []
    const searchStats = {
      totalResults: 0,
      collectionCounts: {} as Record<string, number>,
      searchTime: Date.now()
    }

    // Build base search conditions
    const buildSearchConditions = (collectionType: string) => {
      const conditions: any = { and: [] }

      // Text search conditions
      if (query) {
        const textConditions: any[] = []
        
        switch (collectionType) {
          case 'services':
            textConditions.push(
              { name: { contains: query } },
              { description: { contains: query } },
              { category: { contains: query } }
            )
            if (tags && tags.length > 0) {
              textConditions.push({ tags: { in: tags } })
            }
            break
            
          case 'customers':
            textConditions.push(
              { firstName: { contains: query } },
              { lastName: { contains: query } },
              { email: { contains: query } },
              { phone: { contains: query } }
            )
            break
            
          case 'stylists':
            textConditions.push(
              { firstName: { contains: query } },
              { lastName: { contains: query } },
              { email: { contains: query } },
              { specialty: { contains: query } },
              { bio: { contains: query } }
            )
            break
            
          case 'appointments':
            // For appointments, search in related fields would be more complex
            if (status && status.length > 0) {
              textConditions.push({ status: { in: status } })
            }
            break
        }
        
        if (textConditions.length > 0) {
          conditions.and.push({ or: textConditions })
        }
      }

      // Price range filter
      if (priceRange && (priceRange.min !== undefined || priceRange.max !== undefined)) {
        const priceCondition: any = {}
        if (priceRange.min !== undefined) priceCondition.gte = priceRange.min
        if (priceRange.max !== undefined) priceCondition.lte = priceRange.max
        conditions.and.push({ price: priceCondition })
      }

      // Date range filter
      if (dateRange && (dateRange.from || dateRange.to)) {
        const dateCondition: any = {}
        if (dateRange.from) dateCondition.gte = dateRange.from
        if (dateRange.to) dateCondition.lte = dateRange.to
        
        // Apply to different date fields based on collection
        if (collectionType === 'appointments') {
          conditions.and.push({ dateTime: dateCondition })
        } else {
          conditions.and.push({ updatedAt: dateCondition })
        }
      }

      // Category filter
      if (categories && categories.length > 0) {
        conditions.and.push({ category: { in: categories } })
      }

      // Active/inactive filter
      if (!includeInactive && collectionType !== 'appointments') {
        conditions.and.push({ isActive: { equals: true } })
      }

      // Status filter
      if (status && status.length > 0 && (collectionType === 'appointments' || collectionType === 'commissions')) {
        conditions.and.push({ status: { in: status } })
      }

      return conditions.and.length > 0 ? conditions : {}
    }

    // Search each collection
    for (const collection of collections) {
      try {
        const searchConditions = buildSearchConditions(collection)
        
        const searchQuery: any = {
          collection,
          where: searchConditions,
          limit,
          page,
          sort: sortOrder === 'desc' ? `-${sortBy}` : sortBy,
        }

        // Add population for related fields
        if (collection === 'appointments') {
          searchQuery.populate = ['customer', 'stylist', 'service']
        } else if (collection === 'commissions') {
          searchQuery.populate = ['stylist', 'appointments.appointment', 'appointments.service']
        }

        const searchResults = await payload.find(searchQuery)
        
        const enhancedResults = searchResults.docs.map((doc: any) => ({
          ...doc,
          _collection: collection,
          _relevanceScore: calculateRelevanceScore(doc, query, collection),
          _searchHighlights: generateHighlights(doc, query, collection)
        }))

        results.push(...enhancedResults)
        searchStats.collectionCounts[collection] = searchResults.docs.length
        searchStats.totalResults += searchResults.docs.length

        logger.info(`✅ Searched ${collection}: ${searchResults.docs.length} results`)

      } catch (error) {
        logger.warn(`⚠️ Search failed for collection ${collection}:`, error)
        searchStats.collectionCounts[collection] = 0
      }
    }

    // Sort combined results by relevance score
    results.sort((a, b) => {
      if (sortBy === 'relevance') {
        return sortOrder === 'desc' ? 
          (b._relevanceScore || 0) - (a._relevanceScore || 0) :
          (a._relevanceScore || 0) - (b._relevanceScore || 0)
      }
      return 0 // Keep original sort from individual queries
    })

    // Apply pagination to combined results
    const startIndex = (page - 1) * limit
    const paginatedResults = results.slice(startIndex, startIndex + limit)

    searchStats.searchTime = Date.now() - searchStats.searchTime

    logger.info('🎯 Advanced search completed', searchStats)

    return NextResponse.json({
      success: true,
      results: paginatedResults,
      pagination: {
        page,
        limit,
        total: searchStats.totalResults,
        pages: Math.ceil(searchStats.totalResults / limit)
      },
      statistics: searchStats,
      query: {
        searchQuery: query,
        filters,
        options
      }
    })

  } catch (error) {
    logger.error('❌ Advanced search failed:', { operation: 'advanced_search' }, error instanceof Error ? error : undefined)
    
    return NextResponse.json(
      {
        success: false,
        error: 'Advanced search failed',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  return NextResponse.json({
    message: 'Advanced Search API',
    description: 'POST with query, filters, and options for advanced search capabilities',
    example: {
      query: 'haircut',
      filters: {
        collections: ['services', 'stylists'],
        priceRange: { min: 20, max: 50 },
        categories: ['haircut', 'styling'],
        dateRange: { from: '2025-01-01', to: '2025-12-31' }
      },
      options: {
        sortBy: 'relevance',
        sortOrder: 'desc',
        page: 1,
        limit: 20,
        fuzzySearch: true
      }
    }
  })
}

// Helper function to calculate relevance score
function calculateRelevanceScore(doc: any, query: string, collection: string): number {
  if (!query) return 0

  let score = 0
  const queryLower = query.toLowerCase()

  // Field-based scoring weights
  const weights = {
    name: 3,
    title: 3,
    firstName: 2,
    lastName: 2,
    email: 1,
    description: 2,
    bio: 2,
    specialty: 2,
    category: 1.5
  }

  // Calculate text match scores
  Object.entries(weights).forEach(([field, weight]) => {
    const value = doc[field]
    if (typeof value === 'string') {
      const valueLower = value.toLowerCase()
      if (valueLower === queryLower) {
        score += weight * 10 // Exact match
      } else if (valueLower.includes(queryLower)) {
        score += weight * 5 // Partial match
      } else if (valueLower.startsWith(queryLower)) {
        score += weight * 7 // Starts with
      }
    }
  })

  // Collection-specific bonuses
  if (collection === 'services' && doc.isActive) score += 5
  if (collection === 'stylists' && doc.isActive) score += 5
  if (collection === 'customers' && doc.loyaltyPoints > 100) score += 2

  return score
}

// Helper function to generate search highlights
function generateHighlights(doc: any, query: string, collection: string): string[] {
  if (!query) return []

  const highlights: string[] = []
  const queryLower = query.toLowerCase()
  const highlightFields = ['name', 'title', 'firstName', 'lastName', 'description', 'bio', 'specialty']

  highlightFields.forEach(field => {
    const value = doc[field]
    if (typeof value === 'string') {
      const valueLower = value.toLowerCase()
      const index = valueLower.indexOf(queryLower)
      if (index !== -1) {
        const start = Math.max(0, index - 30)
        const end = Math.min(value.length, index + queryLower.length + 30)
        const snippet = value.substring(start, end)
        const highlighted = snippet.replace(
          new RegExp(`(${query})`, 'gi'), 
          '<mark>$1</mark>'
        )
        highlights.push(`${start > 0 ? '...' : ''}${highlighted}${end < value.length ? '...' : ''}`)
      }
    }
  })

  return highlights.slice(0, 3) // Limit to 3 highlights
}