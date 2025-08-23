/**
 * Simplified Search Service
 * Provides basic search functionality for the Modern Men Hair Salon application
 */

import type { UserRole } from '../types/documentation'

/**
 * Basic search result interface
 */
export interface SearchResult {
  id: string
  title: string
  description: string
  content: string
  path: string
  type: 'service' | 'stylist' | 'page' | 'faq'
  category: string
  tags: string[]
  relevanceScore: number
  highlights: SearchHighlight[]
}

/**
 * Search highlight interface
 */
export interface SearchHighlight {
  field: string
  fragments: string[]
}

/**
 * Search query interface
 */
export interface SearchQuery {
  query: string
  filters?: {
    categories?: string[]
    types?: string[]
    tags?: string[]
  }
  pagination?: {
    page: number
    limit: number
  }
}

/**
 * Search response interface
 */
export interface SearchResponse {
  results: SearchResult[]
  totalCount: number
  query: SearchQuery
  executionTime: number
}

/**
 * Simplified Search Service
 */
export class SearchService {
  private searchIndex: Map<string, SearchResult> = new Map()

  constructor() {
    this.initializeSampleData()
  }

  /**
   * Perform a search
   */
  async search(query: SearchQuery, userRole: UserRole): Promise<SearchResponse> {
    const startTime = Date.now()
    
    try {
      const normalizedQuery = query.query.toLowerCase().trim()
      
      if (!normalizedQuery) {
        return {
          results: [],
          totalCount: 0,
          query,
          executionTime: Date.now() - startTime
        }
      }

      // Find matching documents
      const matchingResults = this.findMatchingDocuments(normalizedQuery, query.filters)
      
      // Calculate relevance scores
      const scoredResults = this.calculateRelevanceScores(matchingResults, normalizedQuery)
      
      // Sort by relevance
      const sortedResults = scoredResults.sort((a, b) => b.relevanceScore - a.relevanceScore)
      
      // Apply pagination
      const paginatedResults = this.applyPagination(sortedResults, query.pagination)
      
      // Generate highlights
      const highlightedResults = this.generateHighlights(paginatedResults, normalizedQuery)

      return {
        results: highlightedResults,
        totalCount: sortedResults.length,
        query,
        executionTime: Date.now() - startTime
      }
    } catch (error) {
      console.error('Search error:', error)
      return {
        results: [],
        totalCount: 0,
        query,
        executionTime: Date.now() - startTime
      }
    }
  }

  /**
   * Find documents that match the query
   */
  private findMatchingDocuments(query: string, filters?: SearchQuery['filters']): SearchResult[] {
    const results: SearchResult[] = []
    
    for (const [id, document] of Array.from(this.searchIndex.entries())) {
      // Check if document matches query
      const matchesQuery = 
        document.title.toLowerCase().includes(query) ||
        document.description.toLowerCase().includes(query) ||
        document.content.toLowerCase().includes(query) ||
        document.tags.some(tag => tag.toLowerCase().includes(query))

      if (!matchesQuery) continue

      // Apply filters if provided
      if (filters) {
        if (filters.categories && !filters.categories.includes(document.category)) {
          continue
        }
        if (filters.types && !filters.types.includes(document.type)) {
          continue
        }
        if (filters.tags && !filters.tags.some(tag => document.tags.includes(tag))) {
          continue
        }
      }

      results.push(document)
    }

    return results
  }

  /**
   * Calculate relevance scores for search results
   */
  private calculateRelevanceScores(results: SearchResult[], query: string): SearchResult[] {
    return results.map(result => {
      let score = 0
      
      // Title matches get highest score
      if (result.title.toLowerCase().includes(query)) {
        score += 10
      }
      
      // Description matches get medium score
      if (result.description.toLowerCase().includes(query)) {
        score += 5
      }
      
      // Content matches get lower score
      if (result.content.toLowerCase().includes(query)) {
        score += 2
      }
      
      // Tag matches get bonus score
      result.tags.forEach(tag => {
        if (tag.toLowerCase().includes(query)) {
          score += 3
        }
      })

      return {
        ...result,
        relevanceScore: score
      }
    })
  }

  /**
   * Apply pagination to results
   */
  private applyPagination(results: SearchResult[], pagination?: SearchQuery['pagination']): SearchResult[] {
    if (!pagination) {
      return results.slice(0, 20) // Default limit
    }

    const { page = 1, limit = 20 } = pagination
    const startIndex = (page - 1) * limit
    const endIndex = startIndex + limit

    return results.slice(startIndex, endIndex)
  }

  /**
   * Generate highlights for search results
   */
  private generateHighlights(results: SearchResult[], query: string): SearchResult[] {
    return results.map(result => {
      const highlights: SearchHighlight[] = []
      
      // Highlight title matches
      if (result.title.toLowerCase().includes(query)) {
        highlights.push({
          field: 'title',
          fragments: [this.highlightText(result.title, query)]
        })
      }
      
      // Highlight description matches
      if (result.description.toLowerCase().includes(query)) {
        highlights.push({
          field: 'description',
          fragments: [this.highlightText(result.description, query)]
        })
      }

      return {
        ...result,
        highlights
      }
    })
  }

  /**
   * Highlight matching text in a string
   */
  private highlightText(text: string, query: string): string {
    const regex = new RegExp(`(${query})`, 'gi')
    return text.replace(regex, '<mark>$1</mark>')
  }

  /**
   * Initialize sample search data
   */
  private initializeSampleData() {
    const sampleData: SearchResult[] = [
      {
        id: 'haircut',
        title: 'Hair Cut & Style',
        description: 'Professional haircut and styling service for men',
        content: 'Our expert stylists provide personalized haircuts and styling to suit your face shape and lifestyle.',
        path: '/services/haircut',
        type: 'service',
        category: 'Hair Services',
        tags: ['haircut', 'styling', 'men', 'professional'],
        relevanceScore: 0,
        highlights: []
      },
      {
        id: 'beard-trim',
        title: 'Beard Trim & Shape',
        description: 'Professional beard trimming and shaping service',
        content: 'Get your beard professionally trimmed and shaped to maintain a clean, well-groomed appearance.',
        path: '/services/beard-trim',
        type: 'service',
        category: 'Grooming Services',
        tags: ['beard', 'trim', 'grooming', 'shaping'],
        relevanceScore: 0,
        highlights: []
      },
      {
        id: 'alex-rodriguez',
        title: 'Alex Rodriguez',
        description: 'Master barber with 8 years of experience',
        content: 'Alex specializes in modern fades and classic cuts. He has been with Modern Men for 8 years.',
        path: '/team/alex-rodriguez',
        type: 'stylist',
        category: 'Team',
        tags: ['barber', 'fades', 'classic cuts', 'experienced'],
        relevanceScore: 0,
        highlights: []
      },
      {
        id: 'booking',
        title: 'Book Appointment',
        description: 'Schedule your next haircut or grooming service',
        content: 'Book your appointment online or call us to schedule your next visit.',
        path: '/booking',
        type: 'page',
        category: 'Booking',
        tags: ['appointment', 'booking', 'schedule'],
        relevanceScore: 0,
        highlights: []
      }
    ]

    sampleData.forEach(item => {
      this.searchIndex.set(item.id, item)
    })
  }

  /**
   * Add a document to the search index
   */
  addDocument(document: SearchResult) {
    this.searchIndex.set(document.id, document)
  }

  /**
   * Remove a document from the search index
   */
  removeDocument(id: string) {
    this.searchIndex.delete(id)
  }

  /**
   * Clear the search index
   */
  clearIndex() {
    this.searchIndex.clear()
  }
}

// Export a default instance
export const searchService = new SearchService()
