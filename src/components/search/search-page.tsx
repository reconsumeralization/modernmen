'use client'

import React, { useState, useEffect } from 'react'
import { SearchInput } from '@/components/ui/search-input'
import { SearchResults } from '@/components/ui/search-results'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Search,
  TrendingUp,
  Clock,
  Users,
  Target,
  Zap
} from 'lucide-react'
import { useMonitoring } from '@/hooks/useMonitoring'
import { SearchResult } from '@/lib/search-core'
import { searchService } from '@/lib/search-service-simple'

interface SearchPageProps {
  initialQuery?: string
  showStats?: boolean
}

export function SearchPage({ initialQuery = '', showStats = true }: SearchPageProps) {
  const [query, setQuery] = useState(initialQuery)
  const [results, setResults] = useState<SearchResult[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [searchStats, setSearchStats] = useState({
    totalSearches: 0,
    averageResponseTime: 0,
    noResultsRate: 0
  })

  const { trackPageView, addBreadcrumb } = useMonitoring()

  useEffect(() => {
    trackPageView('/search', { initialQuery })
    addBreadcrumb('Search page loaded', 'navigation', 'info')
  }, [trackPageView, addBreadcrumb, initialQuery])

  useEffect(() => {
    // Initialize search service
    searchService.initialize().then(() => {
      console.log('Search service initialized')
    })
  }, [])

  const handleSearch = async (searchQuery: string, filters?: any) => {
    if (!searchQuery.trim()) {
      setResults([])
      return
    }

    setIsLoading(true)
    setQuery(searchQuery)

    try {
      const searchResult = await searchService.search({
        query: searchQuery,
        filters,
        limit: 20
      })

      setResults(searchResult.results)

      // Update search stats
      const metrics = searchService.getSearchPerformanceMetrics()
      setSearchStats(metrics)

    } catch (error) {
      console.error('Search failed:', error)
      setResults([])
    } finally {
      setIsLoading(false)
    }
  }

  const handleResultClick = (result: SearchResult) => {
    addBreadcrumb(`Clicked search result: ${result.title}`, 'interaction', 'info')

    // Track result click
    if (typeof window !== 'undefined' && (window as any).gtag) {
      (window as any).gtag('event', 'search_result_click', {
        event_category: 'search',
        event_label: result.title,
        value: result.relevanceScore
      })
    }
  }

  const popularTerms = searchService.getPopularSearchTerms(8)

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-4">Search Documentation</h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Find components, guides, APIs, and references in our comprehensive documentation
          </p>
        </div>

        {/* Search Input */}
        <div className="max-w-4xl mx-auto mb-8">
          <SearchInput
            onSearch={handleSearch}
            placeholder="Search for components, guides, APIs, or keywords..."
            showFilters={true}
            isLoading={isLoading}
            initialQuery={initialQuery}
          />
        </div>

        {/* Stats Dashboard */}
        {showStats && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
            <Card>
              <CardContent className="p-4 text-center">
                <Search className="h-8 w-8 mx-auto mb-2 text-blue-500" />
                <div className="text-2xl font-bold">{searchStats.totalSearches}</div>
                <div className="text-sm text-muted-foreground">Total Searches</div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4 text-center">
                <Zap className="h-8 w-8 mx-auto mb-2 text-green-500" />
                <div className="text-2xl font-bold">{Math.round(searchStats.averageResponseTime)}ms</div>
                <div className="text-sm text-muted-foreground">Avg Response</div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4 text-center">
                <Target className="h-8 w-8 mx-auto mb-2 text-purple-500" />
                <div className="text-2xl font-bold">{Math.round(100 - searchStats.noResultsRate)}%</div>
                <div className="text-sm text-muted-foreground">Success Rate</div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4 text-center">
                <TrendingUp className="h-8 w-8 mx-auto mb-2 text-orange-500" />
                <div className="text-2xl font-bold">{results.length}</div>
                <div className="text-sm text-muted-foreground">Current Results</div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Popular Searches */}
        {popularTerms.length > 0 && !query && (
          <Card className="max-w-4xl mx-auto mb-8">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                Popular Searches
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {popularTerms.map(({ term, count }) => (
                  <Button
                    key={term}
                    variant="outline"
                    size="sm"
                    onClick={() => handleSearch(term)}
                    className="h-auto"
                  >
                    {term}
                    <Badge variant="secondary" className="ml-2 text-xs">
                      {count}
                    </Badge>
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Search Results */}
        <div className="max-w-4xl mx-auto">
          {query && (
            <div className="mb-4">
              <h2 className="text-lg font-semibold">
                Search Results for "{query}"
              </h2>
            </div>
          )}

          <SearchResults
            results={results}
            query={query}
            isLoading={isLoading}
            onResultClick={handleResultClick}
          />
        </div>

        {/* Search Tips */}
        {!query && !isLoading && (
          <Card className="max-w-4xl mx-auto mt-8">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Search className="h-5 w-5" />
                Search Tips
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-semibold mb-3">Search by Type</h3>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <Badge variant="outline">button</Badge>
                      <span className="text-sm">Find UI components</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline">accessibility</Badge>
                      <span className="text-sm">Find accessibility docs</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline">api</Badge>
                      <span className="text-sm">Find API documentation</span>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="font-semibold mb-3">Search by Category</h3>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <Badge variant="outline">ui</Badge>
                      <span className="text-sm">User interface components</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline">layout</Badge>
                      <span className="text-sm">Layout and structure</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline">charts</Badge>
                      <span className="text-sm">Data visualization</span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
