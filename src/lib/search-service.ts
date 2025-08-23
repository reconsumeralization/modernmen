/**
 * Documentation Search Service
 * Provides comprehensive search functionality with role-based filtering,
 * analytics tracking, and multiple search providers support
 */

import {
  SearchQuery,
  SearchResponse,
  SearchResult,
  SearchConfig,
  SearchIndexDocument,
  SearchAnalytics,
  SearchFallback,
  AutocompleteResult,
  SearchMetrics,
  ContentType,
  SearchRankingConfig
} from '@/types/search'
import { UserRole } from '@/types/documentation'

export class DocumentationSearchService {
  private config: SearchConfig
  private searchIndex: Map<string, SearchIndexDocument> = new Map()
  private searchAnalytics: SearchAnalytics[] = []
  private synonyms: Map<string, string[]> = new Map()

  constructor(config: SearchConfig) {
    this.config = config
    this.initializeSynonyms()
    this.initializeSampleData()
  }

  /**
   * Perform a comprehensive search with role-based filtering
   */
  async search(query: SearchQuery, userRole: UserRole): Promise<SearchResponse> {
    const startTime = Date.now()
    
    try {
      // Normalize and expand query
      const expandedQuery = this.expandQuery(query.query)
      
      // Get all documents that match the query
      const matchingDocuments = this.findMatchingDocuments(expandedQuery, query, userRole)
      
      // Apply role-based filtering
      const filteredDocuments = this.applyRoleFiltering(matchingDocuments, userRole)
      
      // Apply additional filters
      const filteredResults = this.applyFilters(filteredDocuments, query.filters)
      
      // Calculate relevance scores
      const scoredResults = this.calculateRelevanceScores(filteredResults, expandedQuery, userRole)
      
      // Sort results
      const sortedResults = this.sortResults(scoredResults, query.sorting)
      
      // Apply pagination
      const paginatedResults = this.applyPagination(sortedResults, query.pagination)
      
      // Generate highlights
      const highlightedResults = this.generateHighlights(paginatedResults, expandedQuery)
      
      // Generate facets
      const facets = this.generateFacets(filteredResults, query.filters)
      
      // Generate suggestions
      const suggestions = this.generateSuggestions(query.query, filteredResults.length === 0)
      
      const executionTime = Date.now() - startTime
      
      // Track analytics
      const analytics = this.trackSearchAnalytics(query, userRole, filteredResults.length, executionTime)
      
      return {
        results: highlightedResults,
        totalCount: filteredResults.length,
        facets,
        suggestions,
        analytics,
        pagination: query.pagination,
        query,
        executionTime
      }
    } catch (error) {
      console.error('Search error:', error)
      return this.handleSearchError(query, userRole, error)
    }
  }

  /**
   * Get autocomplete suggestions
   */
  async autocomplete(query: string, userRole: UserRole): Promise<AutocompleteResult> {
    const normalizedQuery = query.toLowerCase().trim()
    
    if (normalizedQuery.length < 2) {
      return {
        suggestions: [],
        recentQueries: this.getRecentQueries(userRole),
        popularQueries: this.getPopularQueries(userRole),
        categories: this.getAvailableCategories(userRole)
      }
    }

    const suggestions = []
    
    // Content-based suggestions
    for (const doc of this.searchIndex.values()) {
      if (!this.canUserAccessContent(doc, userRole)) continue
      
      if (doc.title.toLowerCase().includes(normalizedQuery)) {
        suggestions.push({
          text: doc.title,
          type: 'content' as const,
          score: 0.9,
          metadata: {
            contentType: doc.type,
            role: doc.role,
            category: doc.category
          }
        })
      }
    }

    // Query completion suggestions
    const queryCompletions = this.generateQueryCompletions(normalizedQuery)
    suggestions.push(...queryCompletions)

    // Sort by score and limit
    const sortedSuggestions = suggestions
      .sort((a, b) => b.score - a.score)
      .slice(0, 10)

    return {
      suggestions: sortedSuggestions,
      recentQueries: this.getRecentQueries(userRole),
      popularQueries: this.getPopularQueries(userRole),
      categories: this.getAvailableCategories(userRole)
    }
  }

  /**
   * Add or update a document in the search index
   */
  async indexDocument(document: SearchIndexDocument): Promise<void> {
    // Enhance document with searchable text
    const enhancedDoc = {
      ...document,
      searchableText: this.createSearchableText(document),
      keywords: this.extractKeywords(document)
    }
    
    this.searchIndex.set(document.id, enhancedDoc)
  }

  /**
   * Remove a document from the search index
   */
  async removeDocument(documentId: string): Promise<void> {
    this.searchIndex.delete(documentId)
  }

  /**
   * Get search metrics and analytics
   */
  async getSearchMetrics(userRole?: UserRole): Promise<SearchMetrics> {
    const analytics = userRole 
      ? this.searchAnalytics.filter(a => a.userRole === userRole)
      : this.searchAnalytics

    return {
      totalQueries: analytics.length,
      uniqueQueries: new Set(analytics.map(a => a.queryId)).size,
      averageResultsPerQuery: analytics.reduce((sum, a) => sum + a.resultsCount, 0) / analytics.length || 0,
      noResultsQueries: analytics.filter(a => a.resultsCount === 0).length,
      topQueries: this.getTopQueries(analytics),
      topResults: this.getTopResults(analytics),
      userEngagement: this.getUserEngagement(analytics),
      performanceMetrics: this.getPerformanceMetrics(analytics)
    }
  }

  /**
   * Get search fallback content for no results or errors
   */
  getSearchFallback(query: string, type: 'no_results' | 'error' | 'timeout'): SearchFallback {
    const baseMessage = {
      no_results: `No results found for "${query}". Try different keywords or check the suggestions below.`,
      error: 'Search is temporarily unavailable. Please try again or browse our documentation.',
      timeout: 'Search is taking longer than expected. Please try a simpler query.'
    }

    return {
      type,
      message: baseMessage[type],
      suggestions: this.generateSuggestions(query, true),
      alternativeQueries: this.generateAlternativeQueries(query),
      relatedContent: this.getRelatedContent(query),
      supportLinks: [
        { title: 'Browse Documentation', url: '/documentation' },
        { title: 'FAQ', url: '/documentation/shared/faq' },
        { title: 'Contact Support', url: '/documentation/shared/support' }
      ]
    }
  }

  // Private helper methods

  private expandQuery(query: string): string {
    let expandedQuery = query.toLowerCase().trim()
    
    // Apply synonyms
    for (const [term, synonyms] of this.synonyms) {
      if (expandedQuery.includes(term)) {
        expandedQuery += ' ' + synonyms.join(' ')
      }
    }
    
    return expandedQuery
  }

  private findMatchingDocuments(query: string, searchQuery: SearchQuery, userRole: UserRole): SearchIndexDocument[] {
    const queryTerms = query.split(/\s+/).filter(term => term.length > 1)
    const results: SearchIndexDocument[] = []
    
    for (const doc of this.searchIndex.values()) {
      if (!this.canUserAccessContent(doc, userRole)) continue
      
      const searchText = doc.searchableText.toLowerCase()
      let matchScore = 0
      
      // Check for exact phrase match
      if (searchText.includes(query)) {
        matchScore += 10
      }
      
      // Check for individual term matches
      for (const term of queryTerms) {
        if (searchText.includes(term)) {
          matchScore += 1
        }
        
        // Boost for title matches
        if (doc.title.toLowerCase().includes(term)) {
          matchScore += 5
        }
        
        // Boost for tag matches
        if (doc.tags.some(tag => tag.toLowerCase().includes(term))) {
          matchScore += 3
        }
      }
      
      if (matchScore > 0) {
        results.push(doc)
      }
    }
    
    return results
  }

  private applyRoleFiltering(documents: SearchIndexDocument[], userRole: UserRole): SearchIndexDocument[] {
    return documents.filter(doc => this.canUserAccessContent(doc, userRole))
  }

  private canUserAccessContent(document: SearchIndexDocument, userRole: UserRole): boolean {
    // Role hierarchy for access control
    const roleHierarchy: Record<UserRole, number> = {
      guest: 0,
      salon_customer: 1,
      salon_employee: 2,
      salon_owner: 3,
      developer: 4,
      system_admin: 5
    }

    const userLevel = roleHierarchy[userRole] || 0
    const contentLevel = roleHierarchy[document.role] || 0

    // System admin can access everything
    if (userRole === 'system_admin') return true
    
    // Developer can access developer and shared content
    if (userRole === 'developer') {
      return ['developer', 'guest'].includes(document.role)
    }
    
    // Business users can access their level and below, plus shared content
    if (['salon_owner', 'salon_employee', 'salon_customer'].includes(userRole)) {
      return userLevel >= contentLevel || document.role === 'guest'
    }
    
    // Guest can only access guest content
    return document.role === 'guest'
  }

  private applyFilters(documents: SearchIndexDocument[], filters: any): SearchIndexDocument[] {
    let filtered = documents

    if (filters.categories?.length) {
      filtered = filtered.filter(doc => filters.categories.includes(doc.category))
    }

    if (filters.contentTypes?.length) {
      filtered = filtered.filter(doc => filters.contentTypes.includes(doc.type))
    }

    if (filters.tags?.length) {
      filtered = filtered.filter(doc => 
        filters.tags.some((tag: string) => doc.tags.includes(tag))
      )
    }

    if (filters.difficulty?.length) {
      filtered = filtered.filter(doc => 
        doc.difficulty && filters.difficulty.includes(doc.difficulty)
      )
    }

    if (filters.authors?.length) {
      filtered = filtered.filter(doc => filters.authors.includes(doc.author))
    }

    if (filters.dateRange) {
      filtered = filtered.filter(doc => {
        const docDate = new Date(doc.lastUpdated)
        return docDate >= filters.dateRange.from && docDate <= filters.dateRange.to
      })
    }

    return filtered
  }

  private calculateRelevanceScores(documents: SearchIndexDocument[], query: string, userRole: UserRole): SearchResult[] {
    const config = this.config.rankingConfig
    
    return documents.map(doc => {
      let score = 0
      
      // Base relevance score
      const queryTerms = query.split(/\s+/)
      for (const term of queryTerms) {
        if (doc.title.toLowerCase().includes(term)) score += config.titleBoost
        if (doc.description.toLowerCase().includes(term)) score += config.descriptionBoost
        if (doc.content.toLowerCase().includes(term)) score += config.contentBoost
        if (doc.tags.some(tag => tag.toLowerCase().includes(term))) score += config.tagsBoost
      }
      
      // Role-based boost
      score *= config.roleBasedBoost[userRole] || 1
      
      // Recency boost
      const daysSinceUpdate = (Date.now() - new Date(doc.lastUpdated).getTime()) / (1000 * 60 * 60 * 24)
      score *= Math.max(0.1, 1 - (daysSinceUpdate * config.recencyBoost))
      
      // Popularity boost
      score *= 1 + (doc.metadata.views * config.popularityBoost)
      
      // Quality boost
      score *= 1 + (doc.metadata.rating * config.ratingBoost)
      score *= 1 + (doc.metadata.completionRate * config.completionRateBoost)
      
      return {
        id: doc.id,
        title: doc.title,
        description: doc.description,
        content: doc.content.substring(0, 500), // Truncate for search results
        path: doc.path,
        type: doc.type,
        role: doc.role,
        category: doc.category,
        tags: doc.tags,
        author: doc.author,
        lastUpdated: new Date(doc.lastUpdated),
        difficulty: doc.difficulty,
        estimatedReadTime: doc.estimatedReadTime,
        relevanceScore: score,
        highlights: [], // Will be populated later
        metadata: {
          views: doc.metadata.views,
          rating: doc.metadata.rating,
          completionRate: doc.metadata.completionRate,
          feedbackCount: doc.metadata.feedbackCount,
          isNew: doc.metadata.isNew,
          isUpdated: doc.metadata.isUpdated,
          isDeprecated: doc.metadata.isDeprecated
        }
      }
    })
  }

  private sortResults(results: SearchResult[], sorting: any): SearchResult[] {
    return results.sort((a, b) => {
      let comparison = 0
      
      switch (sorting.field) {
        case 'relevance':
          comparison = b.relevanceScore - a.relevanceScore
          break
        case 'date':
          comparison = b.lastUpdated.getTime() - a.lastUpdated.getTime()
          break
        case 'title':
          comparison = a.title.localeCompare(b.title)
          break
        case 'popularity':
          comparison = b.metadata.views - a.metadata.views
          break
        case 'rating':
          comparison = b.metadata.rating - a.metadata.rating
          break
        default:
          comparison = b.relevanceScore - a.relevanceScore
      }
      
      return sorting.direction === 'desc' ? comparison : -comparison
    })
  }

  private applyPagination(results: SearchResult[], pagination: any): SearchResult[] {
    const start = pagination.offset || (pagination.page - 1) * pagination.limit
    const end = start + pagination.limit
    return results.slice(start, end)
  }

  private generateHighlights(results: SearchResult[], query: string): SearchResult[] {
    const queryTerms = query.split(/\s+/).filter(term => term.length > 1)
    
    return results.map(result => ({
      ...result,
      highlights: this.createHighlights(result, queryTerms)
    }))
  }

  private createHighlights(result: SearchResult, queryTerms: string[]): any[] {
    const highlights = []
    
    for (const term of queryTerms) {
      // Title highlights
      if (result.title.toLowerCase().includes(term)) {
        highlights.push({
          field: 'title',
          fragments: [this.highlightTerm(result.title, term)]
        })
      }
      
      // Description highlights
      if (result.description.toLowerCase().includes(term)) {
        highlights.push({
          field: 'description',
          fragments: [this.highlightTerm(result.description, term)]
        })
      }
      
      // Content highlights
      if (result.content.toLowerCase().includes(term)) {
        highlights.push({
          field: 'content',
          fragments: this.extractContentFragments(result.content, term)
        })
      }
    }
    
    return highlights
  }

  private highlightTerm(text: string, term: string): string {
    const regex = new RegExp(`(${term})`, 'gi')
    return text.replace(regex, '<mark>$1</mark>')
  }

  private extractContentFragments(content: string, term: string): string[] {
    const fragments = []
    const regex = new RegExp(`.{0,50}${term}.{0,50}`, 'gi')
    const matches = content.match(regex)
    
    if (matches) {
      fragments.push(...matches.slice(0, 3).map(match => this.highlightTerm(match, term)))
    }
    
    return fragments
  }

  private generateFacets(results: SearchResult[], filters: any): any {
    const facets = {
      roles: this.createFacet(results, 'role', filters.roles),
      categories: this.createFacet(results, 'category', filters.categories),
      contentTypes: this.createFacet(results, 'type', filters.contentTypes),
      tags: this.createTagsFacet(results, filters.tags),
      difficulty: this.createFacet(results, 'difficulty', filters.difficulty),
      authors: this.createFacet(results, 'author', filters.authors),
      sections: this.createSectionsFacet(results, filters.sections)
    }
    
    return facets
  }

  private createFacet(results: SearchResult[], field: string, selectedValues: string[] = []): any[] {
    const counts = new Map<string, number>()
    
    for (const result of results) {
      const value = (result as any)[field]
      if (value) {
        counts.set(value, (counts.get(value) || 0) + 1)
      }
    }
    
    return Array.from(counts.entries())
      .map(([value, count]) => ({
        value,
        count,
        selected: selectedValues.includes(value)
      }))
      .sort((a, b) => b.count - a.count)
  }

  private createTagsFacet(results: SearchResult[], selectedTags: string[] = []): any[] {
    const tagCounts = new Map<string, number>()
    
    for (const result of results) {
      for (const tag of result.tags) {
        tagCounts.set(tag, (tagCounts.get(tag) || 0) + 1)
      }
    }
    
    return Array.from(tagCounts.entries())
      .map(([value, count]) => ({
        value,
        count,
        selected: selectedTags.includes(value)
      }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 20) // Limit to top 20 tags
  }

  private createSectionsFacet(results: SearchResult[], selectedSections: string[] = []): any[] {
    const sectionCounts = new Map<string, number>()
    
    for (const result of results) {
      const section = result.path.split('/')[2] // Extract section from path
      if (section) {
        sectionCounts.set(section, (sectionCounts.get(section) || 0) + 1)
      }
    }
    
    return Array.from(sectionCounts.entries())
      .map(([value, count]) => ({
        value,
        count,
        selected: selectedSections.includes(value)
      }))
      .sort((a, b) => b.count - a.count)
  }

  private generateSuggestions(query: string, noResults: boolean): any[] {
    const suggestions = []
    
    if (noResults) {
      // Suggest corrections for typos
      suggestions.push(...this.generateTypoCorrections(query))
      
      // Suggest related terms
      suggestions.push(...this.generateRelatedTerms(query))
    }
    
    // Suggest query completions
    suggestions.push(...this.generateQueryCompletions(query))
    
    return suggestions.slice(0, 5)
  }

  private generateTypoCorrections(query: string): any[] {
    // Simple typo correction - in a real implementation, use a proper spell checker
    const corrections = []
    const commonTypos = {
      'api': ['aip', 'pai'],
      'documentation': ['documantation', 'documentaion'],
      'authentication': ['authentification', 'autentication'],
      'configuration': ['configration', 'configuraton']
    }
    
    for (const [correct, typos] of Object.entries(commonTypos)) {
      if (typos.some(typo => query.includes(typo))) {
        corrections.push({
          text: query.replace(new RegExp(typos.join('|'), 'g'), correct),
          type: 'correction',
          score: 0.8
        })
      }
    }
    
    return corrections
  }

  private generateRelatedTerms(query: string): any[] {
    const related = []
    const relatedTerms = {
      'api': ['endpoint', 'rest', 'graphql', 'authentication'],
      'setup': ['installation', 'configuration', 'getting started'],
      'booking': ['appointment', 'schedule', 'calendar'],
      'user': ['account', 'profile', 'authentication', 'permissions']
    }
    
    for (const [term, relations] of Object.entries(relatedTerms)) {
      if (query.toLowerCase().includes(term)) {
        related.push(...relations.map(rel => ({
          text: rel,
          type: 'related',
          score: 0.6
        })))
      }
    }
    
    return related.slice(0, 3)
  }

  private generateQueryCompletions(query: string): any[] {
    const completions = []
    const commonQueries = [
      'api authentication',
      'booking appointment',
      'user management',
      'setup guide',
      'troubleshooting',
      'configuration',
      'getting started'
    ]
    
    for (const commonQuery of commonQueries) {
      if (commonQuery.startsWith(query.toLowerCase()) && commonQuery !== query.toLowerCase()) {
        completions.push({
          text: commonQuery,
          type: 'completion',
          score: 0.7
        })
      }
    }
    
    return completions.slice(0, 3)
  }

  private trackSearchAnalytics(query: SearchQuery, userRole: UserRole, resultsCount: number, executionTime: number): SearchAnalytics {
    const analytics: SearchAnalytics = {
      queryId: `${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      timestamp: new Date(),
      userRole,
      resultsCount,
      hasResults: resultsCount > 0,
      clickedResults: [],
      searchTime: executionTime
    }
    
    this.searchAnalytics.push(analytics)
    
    // Keep only last 10000 analytics entries
    if (this.searchAnalytics.length > 10000) {
      this.searchAnalytics = this.searchAnalytics.slice(-10000)
    }
    
    return analytics
  }

  private handleSearchError(query: SearchQuery, userRole: UserRole, error: any): SearchResponse {
    console.error('Search error:', error)
    
    return {
      results: [],
      totalCount: 0,
      facets: {
        roles: [],
        categories: [],
        tags: [],
        contentTypes: [],
        difficulty: [],
        authors: [],
        sections: []
      },
      suggestions: this.generateSuggestions(query.query, true),
      analytics: this.trackSearchAnalytics(query, userRole, 0, 0),
      pagination: query.pagination,
      query,
      executionTime: 0
    }
  }

  private createSearchableText(document: SearchIndexDocument): string {
    return [
      document.title,
      document.description,
      document.content,
      document.tags.join(' '),
      document.category,
      document.author
    ].join(' ').toLowerCase()
  }

  private extractKeywords(document: SearchIndexDocument): string[] {
    const text = document.searchableText
    const words = text.split(/\s+/)
    const keywords = new Set<string>()
    
    // Add significant words (length > 3, not common words)
    const commonWords = new Set(['the', 'and', 'for', 'are', 'but', 'not', 'you', 'all', 'can', 'had', 'her', 'was', 'one', 'our', 'out', 'day', 'get', 'has', 'him', 'his', 'how', 'man', 'new', 'now', 'old', 'see', 'two', 'way', 'who', 'boy', 'did', 'its', 'let', 'put', 'say', 'she', 'too', 'use'])
    
    for (const word of words) {
      if (word.length > 3 && !commonWords.has(word)) {
        keywords.add(word)
      }
    }
    
    return Array.from(keywords).slice(0, 20) // Limit to 20 keywords
  }

  private initializeSynonyms(): void {
    this.synonyms.set('api', ['endpoint', 'service', 'interface'])
    this.synonyms.set('setup', ['installation', 'configuration', 'install'])
    this.synonyms.set('booking', ['appointment', 'reservation', 'schedule'])
    this.synonyms.set('user', ['account', 'profile', 'customer'])
    this.synonyms.set('guide', ['tutorial', 'documentation', 'help'])
    this.synonyms.set('error', ['bug', 'issue', 'problem'])
  }

  private initializeSampleData(): void {
    // Add sample documents for testing
    const sampleDocs: SearchIndexDocument[] = [
      {
        id: 'api-auth',
        title: 'API Authentication Guide',
        description: 'Learn how to authenticate with our API using various methods',
        content: 'This guide covers API authentication including OAuth, API keys, and JWT tokens...',
        path: '/documentation/developer/api/authentication',
        type: 'guide',
        role: 'developer',
        category: 'API',
        tags: ['api', 'authentication', 'oauth', 'jwt'],
        author: 'John Doe',
        lastUpdated: new Date('2024-01-15'),
        difficulty: 'intermediate',
        estimatedReadTime: 10,
        metadata: {
          views: 1250,
          rating: 4.5,
          completionRate: 0.85,
          feedbackCount: 23,
          isNew: false,
          isUpdated: true,
          isDeprecated: false
        },
        searchableText: '',
        keywords: []
      },
      {
        id: 'booking-guide',
        title: 'How to Book an Appointment',
        description: 'Step-by-step guide for customers to book appointments online',
        content: 'Booking an appointment is easy. Follow these steps to schedule your visit...',
        path: '/documentation/business/customer/booking-appointments',
        type: 'guide',
        role: 'salon_customer',
        category: 'Booking',
        tags: ['booking', 'appointment', 'customer', 'schedule'],
        author: 'Jane Smith',
        lastUpdated: new Date('2024-01-20'),
        difficulty: 'beginner',
        estimatedReadTime: 5,
        metadata: {
          views: 2100,
          rating: 4.8,
          completionRate: 0.92,
          feedbackCount: 45,
          isNew: true,
          isUpdated: false,
          isDeprecated: false
        },
        searchableText: '',
        keywords: []
      }
    ]

    for (const doc of sampleDocs) {
      this.indexDocument(doc)
    }
  }

  private getRecentQueries(userRole: UserRole): string[] {
    return this.searchAnalytics
      .filter(a => a.userRole === userRole)
      .slice(-10)
      .map(a => a.queryId)
      .reverse()
  }

  private getPopularQueries(userRole: UserRole): string[] {
    const queries = new Map<string, number>()
    
    for (const analytics of this.searchAnalytics) {
      if (analytics.userRole === userRole) {
        queries.set(analytics.queryId, (queries.get(analytics.queryId) || 0) + 1)
      }
    }
    
    return Array.from(queries.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([query]) => query)
  }

  private getAvailableCategories(userRole: UserRole): string[] {
    const categories = new Set<string>()
    
    for (const doc of this.searchIndex.values()) {
      if (this.canUserAccessContent(doc, userRole)) {
        categories.add(doc.category)
      }
    }
    
    return Array.from(categories).sort()
  }

  private getTopQueries(analytics: SearchAnalytics[]): any[] {
    // Implementation for top queries metrics
    return []
  }

  private getTopResults(analytics: SearchAnalytics[]): any[] {
    // Implementation for top results metrics
    return []
  }

  private getUserEngagement(analytics: SearchAnalytics[]): any[] {
    // Implementation for user engagement metrics
    return []
  }

  private getPerformanceMetrics(analytics: SearchAnalytics[]): any[] {
    // Implementation for performance metrics
    return []
  }

  private generateAlternativeQueries(query: string): string[] {
    // Generate alternative query suggestions
    return []
  }

  private getRelatedContent(query: string): SearchResult[] {
    // Get related content for fallback
    return []
  }
}