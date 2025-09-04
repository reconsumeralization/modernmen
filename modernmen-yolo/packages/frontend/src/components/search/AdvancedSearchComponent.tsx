'use client'

import React, { useState, useEffect, useCallback, useRef } from 'react'
import { 
  searchAppointments, 
  searchCustomers, 
  searchServices, 
  getAutocomplete,
  SearchQuery,
  SearchFilters,
  AppointmentSearchResult,
  CustomerSearchResult,
  ServiceSearchResult,
  FacetItem
} from '@/lib/search-system'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Checkbox } from '@/components/ui/checkbox'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'
import { 
  Search, 
  Filter, 
  Calendar, 
  User, 
  Scissors, 
  Clock, 
  DollarSign, 
  SlidersHorizontal,
  X,
  Loader2,
  TrendingUp,
  Star,
  MapPin
} from 'lucide-react'
import { toast } from 'sonner'
import { cn } from '@/lib/utils'

interface AdvancedSearchProps {
  type: 'appointments' | 'customers' | 'services'
  onResultSelect?: (result: any) => void
  className?: string
}

export function AdvancedSearchComponent({ type, onResultSelect, className }: AdvancedSearchProps) {
  const [query, setQuery] = useState('')
  const [filters, setFilters] = useState<SearchFilters>({})
  const [results, setResults] = useState<any[]>([])
  const [suggestions, setSuggestions] = useState<string[]>([])
  const [autocomplete, setAutocomplete] = useState<string[]>([])
  const [facets, setFacets] = useState<any>({})
  
  const [loading, setLoading] = useState(false)
  const [searchTime, setSearchTime] = useState(0)
  const [totalResults, setTotalResults] = useState(0)
  const [currentPage, setCurrentPage] = useState(1)
  const [showFilters, setShowFilters] = useState(false)
  
  const searchTimeoutRef = useRef<NodeJS.Timeout>()
  const autocompleteTimeoutRef = useRef<NodeJS.Timeout>()

  // Perform the actual search
  const performSearch = useCallback(async (searchQuery: string, searchFilters: SearchFilters, page: number = 1) => {
    setLoading(true)
    try {
      const searchRequest: SearchQuery = {
        query: searchQuery,
        filters: searchFilters,
        pagination: { page, limit: 20 },
        sorting: { field: 'created_at', direction: 'desc' }
      }

      let searchResult
      switch (type) {
        case 'appointments':
          searchResult = await searchAppointments(searchRequest)
          break
        case 'customers':
          searchResult = await searchCustomers(searchRequest)
          break
        case 'services':
          searchResult = await searchServices(searchRequest)
          break
        default:
          throw new Error('Invalid search type')
      }

      setResults(searchResult.items)
      setTotalResults(searchResult.total)
      setFacets(searchResult.facets)
      setSuggestions(searchResult.suggestions)
      setSearchTime(searchResult.searchTime)
      setCurrentPage(page)

      // Clear autocomplete when showing results
      setAutocomplete([])

    } catch (error) {
      console.error('Search error:', error)
      toast.error('Search failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }, [type])

  // Debounced search function
  const debouncedSearch = useCallback((searchQuery: string, searchFilters: SearchFilters) => {
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current)
    }

    searchTimeoutRef.current = setTimeout(async () => {
      await performSearch(searchQuery, searchFilters)
    }, 300)
  }, [performSearch])

  // Debounced autocomplete
  const debouncedAutocomplete = useCallback((searchQuery: string) => {
    if (autocompleteTimeoutRef.current) {
      clearTimeout(autocompleteTimeoutRef.current)
    }

    if (searchQuery.length < 2) {
      setAutocomplete([])
      return
    }

    autocompleteTimeoutRef.current = setTimeout(async () => {
      try {
        const suggestions = await getAutocomplete(searchQuery, type)
        setAutocomplete(suggestions)
      } catch (error) {
        console.error('Autocomplete error:', error)
      }
    }, 150)
  }, [type])

  // Handle query change
  const handleQueryChange = (value: string) => {
    setQuery(value)
    debouncedAutocomplete(value)
    
    if (value.trim() || Object.keys(filters).length > 0) {
      debouncedSearch(value, filters)
    } else {
      setResults([])
      setTotalResults(0)
    }
  }

  // Handle filter change
  const handleFilterChange = (key: keyof SearchFilters, value: any) => {
    const newFilters = { ...filters, [key]: value }
    setFilters(newFilters)
    debouncedSearch(query, newFilters)
  }

  // Handle facet selection
  const handleFacetSelect = (facetType: string, value: string) => {
    const currentValues = filters[facetType as keyof SearchFilters] as string[] || []
    const newValues = currentValues.includes(value)
      ? currentValues.filter(v => v !== value)
      : [...currentValues, value]
    
    handleFilterChange(facetType as keyof SearchFilters, newValues)
  }

  // Clear all filters
  const clearFilters = () => {
    setFilters({})
    debouncedSearch(query, {})
  }

  // Handle pagination
  const handlePageChange = (page: number) => {
    performSearch(query, filters, page)
  }

  // Render search input with autocomplete
  const renderSearchInput = () => (
    <div className="relative">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
        <Input
          type="text"
          placeholder={`Search ${type}...`}
          value={query}
          onChange={(e) => handleQueryChange(e.target.value)}
          className="pl-10 pr-4 py-2 w-full"
        />
        {loading && (
          <Loader2 className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 animate-spin text-muted-foreground" />
        )}
      </div>
      
      {/* Autocomplete dropdown */}
      {autocomplete.length > 0 && (
        <div className="absolute top-full left-0 right-0 z-50 bg-background border rounded-md shadow-lg mt-1">
          {autocomplete.map((suggestion, index) => (
            <button
              key={index}
              className="w-full text-left px-3 py-2 hover:bg-muted transition-colors"
              onClick={() => handleQueryChange(suggestion)}
            >
              {suggestion}
            </button>
          ))}
        </div>
      )}
    </div>
  )

  // Render filters panel
  const renderFilters = () => (
    <Card className={cn("transition-all duration-200", showFilters ? "opacity-100" : "opacity-0 pointer-events-none absolute")}>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm font-medium flex items-center gap-2">
            <SlidersHorizontal className="w-4 h-4" />
            Filters
          </CardTitle>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" onClick={clearFilters}>
              Clear All
            </Button>
            <Button variant="ghost" size="sm" onClick={() => setShowFilters(false)}>
              <X className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Date Range Filter */}
        <div>
          <Label className="text-sm font-medium mb-2 block">Date Range</Label>
          <div className="grid grid-cols-2 gap-2">
            <Input
              type="date"
              value={filters.dateRange?.start || ''}
              onChange={(e) => handleFilterChange('dateRange', {
                ...filters.dateRange,
                start: e.target.value
              })}
            />
            <Input
              type="date"
              value={filters.dateRange?.end || ''}
              onChange={(e) => handleFilterChange('dateRange', {
                ...filters.dateRange,
                end: e.target.value
              })}
            />
          </div>
        </div>

        {/* Price Range Filter */}
        <div>
          <Label className="text-sm font-medium mb-2 block">Price Range</Label>
          <div className="grid grid-cols-2 gap-2">
            <Input
              type="number"
              placeholder="Min"
              value={filters.priceRange?.min || ''}
              onChange={(e) => handleFilterChange('priceRange', {
                ...filters.priceRange,
                min: parseFloat(e.target.value) || 0
              })}
            />
            <Input
              type="number"
              placeholder="Max"
              value={filters.priceRange?.max || ''}
              onChange={(e) => handleFilterChange('priceRange', {
                ...filters.priceRange,
                max: parseFloat(e.target.value) || 1000
              })}
            />
          </div>
        </div>

        {/* Dynamic facets based on search type */}
        {Object.entries(facets).map(([facetKey, facetItems]) => (
          <div key={facetKey}>
            <Label className="text-sm font-medium mb-2 block capitalize">
              {facetKey.replace(/([A-Z])/g, ' $1').trim()}
            </Label>
            <div className="space-y-2 max-h-32 overflow-y-auto">
              {(facetItems as FacetItem[]).map((item) => (
                <div key={item.value} className="flex items-center space-x-2">
                  <Checkbox
                    id={`${facetKey}-${item.value}`}
                    checked={item.selected}
                    onCheckedChange={() => handleFacetSelect(facetKey, item.value)}
                  />
                  <Label
                    htmlFor={`${facetKey}-${item.value}`}
                    className="text-sm flex-1 cursor-pointer"
                  >
                    {item.label} ({item.count})
                  </Label>
                </div>
              ))}
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  )

  // Render result item based on type
  const renderResultItem = (item: any, index: number) => {
    switch (type) {
      case 'appointments':
        return renderAppointmentResult(item as AppointmentSearchResult, index)
      case 'customers':
        return renderCustomerResult(item as CustomerSearchResult, index)
      case 'services':
        return renderServiceResult(item as ServiceSearchResult, index)
      default:
        return null
    }
  }

  const renderAppointmentResult = (item: AppointmentSearchResult, index: number) => (
    <Card 
      key={item.id} 
      className="cursor-pointer hover:shadow-md transition-shadow"
      onClick={() => onResultSelect?.(item)}
    >
      <CardContent className="p-4">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <h3 className="font-semibold">{item.customerName}</h3>
              <Badge variant={item.status === 'confirmed' ? 'default' : 'secondary'}>
                {item.status}
              </Badge>
            </div>
            <div className="grid grid-cols-2 gap-2 text-sm text-muted-foreground">
              <div className="flex items-center gap-1">
                <Scissors className="w-3 h-3" />
                {item.service}
              </div>
              <div className="flex items-center gap-1">
                <User className="w-3 h-3" />
                {item.barber}
              </div>
              <div className="flex items-center gap-1">
                <Calendar className="w-3 h-3" />
                {item.date} at {item.time}
              </div>
              <div className="flex items-center gap-1">
                <DollarSign className="w-3 h-3" />
                ${item.price}
              </div>
            </div>
            {item.notes && (
              <p className="text-sm text-muted-foreground mt-2 line-clamp-2">
                {item.notes}
              </p>
            )}
          </div>
          <div className="text-xs text-muted-foreground">
            Score: {item.searchScore.toFixed(1)}
          </div>
        </div>
      </CardContent>
    </Card>
  )

  const renderCustomerResult = (item: CustomerSearchResult, index: number) => (
    <Card 
      key={item.id} 
      className="cursor-pointer hover:shadow-md transition-shadow"
      onClick={() => onResultSelect?.(item)}
    >
      <CardContent className="p-4">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <h3 className="font-semibold">{item.name}</h3>
              <div className="flex items-center gap-1">
                <Star className="w-3 h-3 text-yellow-500" />
                <span className="text-xs">{item.averageRating}</span>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-2 text-sm text-muted-foreground">
              <div>{item.email}</div>
              <div>{item.phone}</div>
              <div className="flex items-center gap-1">
                <TrendingUp className="w-3 h-3" />
                {item.totalAppointments} visits
              </div>
              <div className="flex items-center gap-1">
                <DollarSign className="w-3 h-3" />
                ${item.totalSpent} spent
              </div>
            </div>
            <div className="flex gap-1 mt-2">
              {item.tags.map(tag => (
                <Badge key={tag} variant="outline" className="text-xs">
                  {tag}
                </Badge>
              ))}
            </div>
          </div>
          <div className="text-xs text-muted-foreground">
            Score: {item.searchScore.toFixed(1)}
          </div>
        </div>
      </CardContent>
    </Card>
  )

  const renderServiceResult = (item: ServiceSearchResult, index: number) => (
    <Card 
      key={item.id} 
      className="cursor-pointer hover:shadow-md transition-shadow"
      onClick={() => onResultSelect?.(item)}
    >
      <CardContent className="p-4">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <h3 className="font-semibold">{item.name}</h3>
              <Badge variant="secondary">{item.category}</Badge>
              <div className="flex items-center gap-1">
                <Star className="w-3 h-3 text-yellow-500" />
                <span className="text-xs">{item.averageRating}</span>
              </div>
            </div>
            <p className="text-sm text-muted-foreground mb-2 line-clamp-2">
              {item.description}
            </p>
            <div className="grid grid-cols-3 gap-2 text-sm text-muted-foreground">
              <div className="flex items-center gap-1">
                <Clock className="w-3 h-3" />
                {item.duration}min
              </div>
              <div className="flex items-center gap-1">
                <DollarSign className="w-3 h-3" />
                ${item.price}
              </div>
              <div className="flex items-center gap-1">
                <TrendingUp className="w-3 h-3" />
                {item.popularity} bookings
              </div>
            </div>
          </div>
          <div className="text-xs text-muted-foreground">
            Score: {item.searchScore.toFixed(1)}
          </div>
        </div>
      </CardContent>
    </Card>
  )

  // Render search suggestions
  const renderSuggestions = () => (
    suggestions.length > 0 && (
      <div className="mb-4">
        <Label className="text-sm font-medium mb-2 block">Try these searches:</Label>
        <div className="flex flex-wrap gap-2">
          {suggestions.map((suggestion, index) => (
            <Button
              key={index}
              variant="outline"
              size="sm"
              onClick={() => handleQueryChange(suggestion)}
            >
              {suggestion}
            </Button>
          ))}
        </div>
      </div>
    )
  )

  return (
    <div className={cn("w-full space-y-4", className)}>
      {/* Search Header */}
      <div className="flex items-center gap-2">
        <div className="flex-1">
          {renderSearchInput()}
        </div>
        <Button
          variant="outline"
          onClick={() => setShowFilters(!showFilters)}
          className="flex items-center gap-2"
        >
          <Filter className="w-4 h-4" />
          Filters
        </Button>
      </div>

      {/* Active filters display */}
      {Object.keys(filters).length > 0 && (
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-sm text-muted-foreground">Active filters:</span>
          {Object.entries(filters).map(([key, value]) => 
            Array.isArray(value) ? value.map(v => (
              <Badge key={`${key}-${v}`} variant="secondary" className="gap-1">
                {v}
                <X 
                  className="w-3 h-3 cursor-pointer" 
                  onClick={() => handleFacetSelect(key, v)}
                />
              </Badge>
            )) : value && (
              <Badge key={key} variant="secondary">
                {key}: {typeof value === 'object' ? JSON.stringify(value) : value}
              </Badge>
            )
          )}
        </div>
      )}

      {/* Filters Panel */}
      {showFilters && renderFilters()}

      {/* Search Results Header */}
      {(results.length > 0 || loading) && (
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <span>
              {loading ? 'Searching...' : `${totalResults.toLocaleString()} results`}
            </span>
            {searchTime > 0 && (
              <span>in {searchTime.toFixed(0)}ms</span>
            )}
          </div>
        </div>
      )}

      {/* Search Suggestions */}
      {renderSuggestions()}

      {/* Search Results */}
      <div className="space-y-3">
        {loading ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="w-6 h-6 animate-spin" />
          </div>
        ) : results.length > 0 ? (
          results.map((result, index) => renderResultItem(result, index))
        ) : query.trim() || Object.keys(filters).length > 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <Search className="w-12 h-12 mx-auto mb-2 opacity-50" />
            <p>No results found</p>
            <p className="text-sm">Try adjusting your search or filters</p>
          </div>
        ) : null}
      </div>

      {/* Pagination */}
      {totalResults > 20 && (
        <div className="flex items-center justify-center gap-2 pt-4">
          <Button
            variant="outline"
            size="sm"
            disabled={currentPage === 1}
            onClick={() => handlePageChange(currentPage - 1)}
          >
            Previous
          </Button>
          <span className="text-sm text-muted-foreground">
            Page {currentPage} of {Math.ceil(totalResults / 20)}
          </span>
          <Button
            variant="outline"
            size="sm"
            disabled={currentPage >= Math.ceil(totalResults / 20)}
            onClick={() => handlePageChange(currentPage + 1)}
          >
            Next
          </Button>
        </div>
      )}
    </div>
  )
}