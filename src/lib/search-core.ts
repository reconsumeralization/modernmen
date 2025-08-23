// Core search interfaces and types
export interface SearchQuery {
  query: string
  filters?: {
    category?: string[]
    type?: string[]
    difficulty?: string[]
    tags?: string[]
  }
  limit?: number
  offset?: number
  sortBy?: 'relevance' | 'date' | 'title'
}

export interface SearchResult {
  id: string
  title: string
  description: string
  url: string
  type: 'component' | 'guide' | 'api' | 'reference'
  category: string
  tags: string[]
  relevanceScore: number
  highlights?: string[]
  metadata: {
    author?: string
    lastUpdated?: Date
    difficulty?: string
    estimatedTime?: number
  }
}

export interface SearchAnalytics {
  query: string
  resultsCount: number
  filters: SearchQuery['filters']
  responseTime: number
  timestamp: Date
  userAgent?: string
  sessionId?: string
}
