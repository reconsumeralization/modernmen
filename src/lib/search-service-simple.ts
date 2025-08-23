// Simplified search service for immediate implementation
import { logger } from './logger'
import { SearchQuery, SearchResult, SearchAnalytics } from './search-core'

class SearchService {
  private static instance: SearchService
  private searchIndex: Map<string, SearchResult> = new Map()
  private analytics: SearchAnalytics[] = []

  static getInstance(): SearchService {
    if (!SearchService.instance) {
      SearchService.instance = new SearchService()
    }
    return SearchService.instance
  }

  // Initialize with mock data for demonstration
  async initialize(): Promise<void> {
    this.searchIndex.set('button-component', {
      id: 'button-component',
      title: 'Button Component',
      description: 'A reusable button component with multiple variants and states',
      url: '/documentation/components/button',
      type: 'component',
      category: 'ui',
      tags: ['button', 'ui', 'interactive', 'click'],
      relevanceScore: 1.0,
      metadata: {
        author: 'Design System Team',
        lastUpdated: new Date(),
        difficulty: 'beginner'
      }
    })

    logger.info('Search service initialized with mock data')
  }

  async search(query: SearchQuery): Promise<{
    results: SearchResult[]
    total: number
    analytics: SearchAnalytics
  }> {
    const startTime = performance.now()

    const results = Array.from(this.searchIndex.values()).filter(item =>
      item.title.toLowerCase().includes(query.query.toLowerCase()) ||
      item.description.toLowerCase().includes(query.query.toLowerCase())
    )

    const analytics: SearchAnalytics = {
      query: query.query,
      resultsCount: results.length,
      filters: query.filters,
      responseTime: performance.now() - startTime,
      timestamp: new Date(),
      userAgent: typeof window !== 'undefined' ? window.navigator.userAgent : undefined
    }

    return {
      results: results.slice(0, query.limit || 10),
      total: results.length,
      analytics
    }
  }
}

export const searchService = SearchService.getInstance()
