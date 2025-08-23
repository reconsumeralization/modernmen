'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  rch, 
  Filter, 
  Clock, 
  TrendingUp, 
  FileText, 
  Code, 
  Cog,
  X,
  Loader2,
  AlertTriangle,
  Star,
  Eye,
  Calendar
} from '@/lib/icon-mapping';
import { 
  rchQuery, 
  rchResponse, 
  rchResult, 
  rchFilters,
  ContentType,
  DifficultyLevel,
  AutocompleteResult
} from '@/types/rch';
import { UserRole } from '@/types/documentation';
import { DocumentationrchService } from '@/lib/rch-service';
import { getUserRoleFromSession } from '@/lib/documentation-permissions';
import { formatDistanceToNow } from 'date-fns';

interface DocumentationrchProps {
  initialQuery?: string;
  showFilters?: boolean;
  compact?: boolean;
  onResultClick?: (result: rchResult) => void;
  className?: string;
}

export function Documentationrch({
  initialQuery = '',
  showFilters = true,
  compact = false,
  onResultClick,
  className = ''
}: DocumentationrchProps) {
  const { data: session } = useSession();
  const router = useRouter();
  const rchInputRef = useRef<HTMLInputElement>(null);
  const [rchService] = useState(() => new DocumentationrchService({
    provider: 'local',
    indexName: 'documentation',
    maxResults: 50,
    enableFacets: true,
    enableSuggestions: true,
    enableAnalytics: true,
    enableHighlighting: true,
    enableTypoTolerance: true,
    enableSynonyms: true,
    rankingConfig: {
      roleBasedBoost: {
        guest: 1,
        salon_customer: 1.1,
        salon_employee: 1.2,
        salon_owner: 1.3,
        developer: 1.4,
        system_admin: 1.5
      },
      recencyBoost: 0.01,
      popularityBoost: 0.001,
      accuracyBoost: 1.5,
      completionRateBoost: 0.5,
      ratingBoost: 0.3,
      viewsBoost: 0.0001,
      titleBoost: 3,
      descriptionBoost: 2,
      contentBoost: 1,
      tagsBoost: 2
    }
  }));

  const [query, setQuery] = useState(initialQuery);
  const [rchResponse, setrchResponse] = useState<rchResponse | null>(null);
  const [autocomplete, setAutocomplete] = useState<AutocompleteResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [showAutocomplete, setShowAutocomplete] = useState(false);
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
  const [filters, setFilters] = useState<rchFilters>({
    roles: [],
    categories: [],
    tags: [],
    contentTypes: [],
    difficulty: [],
    authors: [],
    sections: []
  });

  const userRole: UserRole = getUserRoleFromSession(session);

  // Debounced rch function
  const debouncedrch = useCallback(
    debounce(async (rchQuery: string, rchFilters: rchFilters) => {
      if (!rchQuery.trim()) {
        setrchResponse(null);
        return;
      }

      setLoading(true);
      try {
        const rchQueryObj: rchQuery = {
          query: rchQuery,
          filters: rchFilters,
          pagination: { page: 1, limit: 20, offset: 0 },
          sorting: { field: 'relevance', direction: 'desc' }
        };

        const response = await rchService.rch(rchQueryObj, userRole);
        setrchResponse(response);
      } catch (error) {
        console.error('rch error:', error);
        setrchResponse(null);
      } finally {
        setLoading(false);
      }
    }, 300),
    [rchService, userRole]
  );

  // Debounced autocomplete function
  const debouncedAutocomplete = useCallback(
    debounce(async (rchQuery: string) => {
      if (rchQuery.length < 2) {
        setAutocomplete(null);
        return;
      }

      try {
        const result = await rchService.autocomplete(rchQuery, userRole);
        setAutocomplete(result);
      } catch (error) {
        console.error('Autocomplete error:', error);
        setAutocomplete(null);
      }
    }, 150),
    [rchService, userRole]
  );

  // Handle rch input change
  const handlerchChange = (value: string) => {
    setQuery(value);
    
    if (value.trim()) {
      debouncedrch(value, filters);
      debouncedAutocomplete(value);
      setShowAutocomplete(true);
    } else {
      setrchResponse(null);
      setAutocomplete(null);
      setShowAutocomplete(false);
    }
  };

  // Handle rch submit
  const handlerchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setShowAutocomplete(false);
    if (query.trim()) {
      debouncedrch(query, filters);
    }
  };

  // Handle filter change
  const handleFilterChange = (filterType: keyof rchFilters, value: string, checked: boolean) => {
    const newFilters = { ...filters };
    const filterArray = newFilters[filterType] as string[];
    
    if (checked) {
      if (!filterArray.includes(value)) {
        filterArray.push(value);
      }
    } else {
      const index = filterArray.indexOf(value);
      if (index > -1) {
        filterArray.splice(index, 1);
      }
    }
    
    setFilters(newFilters);
    
    if (query.trim()) {
      debouncedrch(query, newFilters);
    }
  };

  // Handle result click
  const handleResultClick = (result: rchResult) => {
    if (onResultClick) {
      onResultClick(result);
    } else {
      router.push(result.path);
    }
  };

  // Handle autocomplete selection
  const handleAutocompleteSelect = (suggestion: string) => {
    setQuery(suggestion);
    setShowAutocomplete(false);
    debouncedrch(suggestion, filters);
  };

  // Get content type icon
  const getContentTypeIcon = (type: ContentType) => {
    switch (type) {
      case 'guide':
        return <FileText className="h-4 w-4" />;
      case 'api':
        return <Code className="h-4 w-4" />;
      case 'component':
        return <Cog className="h-4 w-4" />;
      case 'page':
        return <FileText className="h-4 w-4" />;
      default:
        return <FileText className="h-4 w-4" />;
    }
  };

  // Get difficulty color
  const getDifficultyColor = (difficulty?: DifficultyLevel) => {
    switch (difficulty) {
      case 'beginner':
        return 'bg-green-500';
      case 'intermediate':
        return 'bg-yellow-500';
      case 'advanced':
        return 'bg-red-500';
      default:
        return 'bg-gray-500';
    }
  };

  useEffect(() => {
    if (initialQuery) {
      handlerchChange(initialQuery);
    }
  }, [initialQuery]);

  return (
    <div className={`relative ${className}`}>
      {/* rch Input */}
      <form onSubmit={handlerchSubmit} className="relative">
        <div className="relative">
          <rch className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
          <Input
            ref={rchInputRef}
            type="text"
            placeholder="rch documentation..."
            value={query}
            onChange={(e) => handlerchChange(e.target.value)}
            onFocus={() => setShowAutocomplete(true)}
            onBlur={() => setTimeout(() => setShowAutocomplete(false), 200)}
            className="pl-10 pr-12 py-3 bg-slate-800/50 border-slate-700 text-slate-200 placeholder:text-slate-400"
          />
          {loading && (
            <Loader2 className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400 animate-spin" />
          )}
          {showFilters && (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
              className="absolute right-1 top-1/2 transform -translate-y-1/2 h-8 w-8 p-0"
            >
              <Filter className="h-4 w-4" />
            </Button>
          )}
        </div>
      </form>

      {/* Autocomplete Dropdown */}
      {showAutocomplete && autocomplete && (
        <Card className="absolute top-full left-0 right-0 z-50 mt-1 bg-slate-800 border-slate-700 shadow-lg">
          <CardContent className="p-0">
            {autocomplete.suggestions.length > 0 && (
              <div className="p-3 border-b border-slate-700">
                <h4 className="text-sm font-medium text-slate-300 mb-2">Suggestions</h4>
                <div className="space-y-1">
                  {autocomplete.suggestions.map((suggestion, index) => (
                    <button
                      key={index}
                      onClick={() => handleAutocompleteSelect(suggestion.text)}
                      className="w-full text-left px-2 py-1 text-sm text-slate-300 hover:bg-slate-700 rounded"
                    >
                      {suggestion.text}
                    </button>
                  ))}
                </div>
              </div>
            )}
            
            {autocomplete.popularQueries.length > 0 && (
              <div className="p-3">
                <h4 className="text-sm font-medium text-slate-300 mb-2 flex items-center gap-1">
                  <TrendingUp className="h-3 w-3" />
                  Popular rches
                </h4>
                <div className="flex flex-wrap gap-1">
                  {autocomplete.popularQueries.map((query, index) => (
                    <Badge
                      key={index}
                      variant="secondary"
                      className="text-xs cursor-pointer hover:bg-slate-600"
                      onClick={() => handleAutocompleteSelect(query)}
                    >
                      {query}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Advanced Filters */}
      {showAdvancedFilters && showFilters && rchResponse && (
        <Card className="mt-4 bg-slate-800/50 border-slate-700">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg text-slate-100 flex items-center justify-between">
              <span>Filters</span>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowAdvancedFilters(false)}
              >
                <X className="h-4 w-4" />
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Tabs defaultValue="content" className="w-full">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="content">Content</TabsTrigger>
                <TabsTrigger value="type">Type</TabsTrigger>
                <TabsTrigger value="difficulty">Level</TabsTrigger>
                <TabsTrigger value="meta">Meta</TabsTrigger>
              </TabsList>
              
              <TabsContent value="content" className="space-y-3">
                {rchResponse.facets.categories.length > 0 && (
                  <div>
                    <h4 className="text-sm font-medium text-slate-200 mb-2">Categories</h4>
                    <div className="flex flex-wrap gap-2">
                      {rchResponse.facets.categories.map((facet) => (
                        <label key={facet.value} className="flex items-center gap-2 text-sm">
                          <input
                            type="checkbox"
                            checked={facet.selected}
                            onChange={(e) => handleFilterChange('categories', facet.value, e.target.checked)}
                            className="rounded border-slate-600"
                          />
                          <span className="text-slate-300">{facet.value} ({facet.count})</span>
                        </label>
                      ))}
                    </div>
                  </div>
                )}
                
                {rchResponse.facets.tags.length > 0 && (
                  <div>
                    <h4 className="text-sm font-medium text-slate-200 mb-2">Tags</h4>
                    <div className="flex flex-wrap gap-1">
                      {rchResponse.facets.tags.slice(0, 10).map((facet) => (
                        <Badge
                          key={facet.value}
                          variant={facet.selected ? "default" : "secondary"}
                          className="text-xs cursor-pointer"
                          onClick={() => handleFilterChange('tags', facet.value, !facet.selected)}
                        >
                          {facet.value} ({facet.count})
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </TabsContent>
              
              <TabsContent value="type" className="space-y-3">
                {rchResponse.facets.contentTypes.length > 0 && (
                  <div>
                    <h4 className="text-sm font-medium text-slate-200 mb-2">Content Types</h4>
                    <div className="space-y-2">
                      {rchResponse.facets.contentTypes.map((facet) => (
                        <label key={facet.value} className="flex items-center gap-2 text-sm">
                          <input
                            type="checkbox"
                            checked={facet.selected}
                            onChange={(e) => handleFilterChange('contentTypes', facet.value, e.target.checked)}
                            className="rounded border-slate-600"
                          />
                          <div className="flex items-center gap-2">
                            {getContentTypeIcon(facet.value as ContentType)}
                            <span className="text-slate-300">{facet.value} ({facet.count})</span>
                          </div>
                        </label>
                      ))}
                    </div>
                  </div>
                )}
              </TabsContent>
              
              <TabsContent value="difficulty" className="space-y-3">
                {rchResponse.facets.difficulty.length > 0 && (
                  <div>
                    <h4 className="text-sm font-medium text-slate-200 mb-2">Difficulty Level</h4>
                    <div className="space-y-2">
                      {rchResponse.facets.difficulty.map((facet) => (
                        <label key={facet.value} className="flex items-center gap-2 text-sm">
                          <input
                            type="checkbox"
                            checked={facet.selected}
                            onChange={(e) => handleFilterChange('difficulty', facet.value, e.target.checked)}
                            className="rounded border-slate-600"
                          />
                          <div className="flex items-center gap-2">
                            <div className={`w-2 h-2 rounded-full ${getDifficultyColor(facet.value as DifficultyLevel)}`} />
                            <span className="text-slate-300 capitalize">{facet.value} ({facet.count})</span>
                          </div>
                        </label>
                      ))}
                    </div>
                  </div>
                )}
              </TabsContent>
              
              <TabsContent value="meta" className="space-y-3">
                {rchResponse.facets.authors.length > 0 && (
                  <div>
                    <h4 className="text-sm font-medium text-slate-200 mb-2">Authors</h4>
                    <div className="space-y-2">
                      {rchResponse.facets.authors.slice(0, 5).map((facet) => (
                        <label key={facet.value} className="flex items-center gap-2 text-sm">
                          <input
                            type="checkbox"
                            checked={facet.selected}
                            onChange={(e) => handleFilterChange('authors', facet.value, e.target.checked)}
                            className="rounded border-slate-600"
                          />
                          <span className="text-slate-300">{facet.value} ({facet.count})</span>
                        </label>
                      ))}
                    </div>
                  </div>
                )}
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      )}

      {/* rch Results */}
      {rchResponse && (
        <div className="mt-6 space-y-4">
          {/* Results Header */}
          <div className="flex items-center justify-between">
            <div className="text-sm text-slate-400">
              {rchResponse.totalCount > 0 ? (
                <>
                  Found {rchResponse.totalCount} result{rchResponse.totalCount !== 1 ? 's' : ''} 
                  {query && ` for "${query}"`}
                  <span className="ml-2 text-xs">({rchResponse.executionTime}ms)</span>
                </>
              ) : (
                <>No results found{query && ` for "${query}"`}</>
              )}
            </div>
            
            {rchResponse.totalCount > 0 && (
              <div className="flex items-center gap-2">
                <span className="text-xs text-slate-400">Sort by:</span>
                <select className="text-xs bg-slate-800 border border-slate-600 rounded px-2 py-1 text-slate-300">
                  <option value="relevance">Relevance</option>
                  <option value="date">Date</option>
                  <option value="title">Title</option>
                  <option value="popularity">Popularity</option>
                </select>
              </div>
            )}
          </div>

          {/* Results List */}
          {rchResponse.results.length > 0 ? (
            <div className="space-y-4">
              {rchResponse.results.map((result) => (
                <Card 
                  key={result.id} 
                  className="bg-slate-800/50 border-slate-700 hover:border-cyan-600 transition-colors cursor-pointer"
                  onClick={() => handleResultClick(result)}
                >
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center gap-2">
                        {getContentTypeIcon(result.type)}
                        <h3 className="font-medium text-slate-100 hover:text-cyan-400 transition-colors">
                          {result.highlights.find(h => h.field === 'title')?.fragments[0] ? (
                            <span dangerouslySetInnerHTML={{ 
                              __html: result.highlights.find(h => h.field === 'title')!.fragments[0] 
                            }} />
                          ) : (
                            result.title
                          )}
                        </h3>
                      </div>
                      <div className="flex items-center gap-2">
                        {result.difficulty && (
                          <div className={`w-2 h-2 rounded-full ${getDifficultyColor(result.difficulty)}`} />
                        )}
                        <Badge variant="secondary" className="text-xs">
                          {result.type}
                        </Badge>
                      </div>
                    </div>
                    
                    <p className="text-sm text-slate-300 mb-3">
                      {result.highlights.find(h => h.field === 'description')?.fragments[0] ? (
                        <span dangerouslySetInnerHTML={{ 
                          __html: result.highlights.find(h => h.field === 'description')!.fragments[0] 
                        }} />
                      ) : (
                        result.description
                      )}
                    </p>
                    
                    {result.highlights.find(h => h.field === 'content') && (
                      <div className="mb-3">
                        <div className="text-xs text-slate-400 mb-1">Content matches:</div>
                        <div className="space-y-1">
                          {result.highlights.find(h => h.field === 'content')!.fragments.map((fragment, index) => (
                            <div 
                              key={index} 
                              className="text-xs text-slate-400 bg-slate-900/50 p-2 rounded"
                              dangerouslySetInnerHTML={{ __html: `...${fragment}...` }}
                            />
                          ))}
                        </div>
                      </div>
                    )}
                    
                    <div className="flex items-center justify-between text-xs text-slate-400">
                      <div className="flex items-center gap-4">
                        <span className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          {formatDistanceToNow(result.lastUpdated, { addSuffix: true })}
                        </span>
                        <span className="flex items-center gap-1">
                          <Eye className="h-3 w-3" />
                          {result.metadata.views}
                        </span>
                        {result.metadata.rating > 0 && (
                          <span className="flex items-center gap-1">
                            <Star className="h-3 w-3" />
                            {result.metadata.rating.toFixed(1)}
                          </span>
                        )}
                        {result.estimatedReadTime && (
                          <span className="flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            {result.estimatedReadTime} min
                          </span>
                        )}
                      </div>
                      
                      <div className="flex flex-wrap gap-1">
                        {result.tags.slice(0, 3).map((tag) => (
                          <Badge key={tag} variant="outline" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            // No Results State
            <Card className="bg-slate-800/50 border-slate-700">
              <CardContent className="p-8 text-center">
                <AlertTriangle className="h-12 w-12 text-slate-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-slate-200 mb-2">No results found</h3>
                <p className="text-slate-400 mb-4">
                  Try adjusting your rch terms or filters to find what you're looking for.
                </p>
                
                {rchResponse.suggestions.length > 0 && (
                  <div className="mb-4">
                    <h4 className="text-sm font-medium text-slate-300 mb-2">Did you mean:</h4>
                    <div className="flex flex-wrap gap-2 justify-center">
                      {rchResponse.suggestions.map((suggestion, index) => (
                        <Button
                          key={index}
                          variant="outline"
                          size="sm"
                          onClick={() => handleAutocompleteSelect(suggestion.text)}
                          className="text-xs"
                        >
                          {suggestion.text}
                        </Button>
                      ))}
                    </div>
                  </div>
                )}
                
                <div className="flex flex-wrap gap-2 justify-center">
                  <Button variant="outline" size="sm" onClick={() => router.push('/documentation')}>
                    Browse Documentation
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => router.push('/documentation/shared/faq')}>
                    Check FAQ
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      )}
    </div>
  );
}

// Utility function for debouncing
function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout;
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
}