import type { UserRole } from '../types/documentation';

export interface SearchResult {
  id: string;
  title: string;
  description: string;
  content: string;
  path: string;
  type: 'service' | 'stylist' | 'page' | 'faq' | 'customer' | 'documentation';
  category: string;
  tags: string[];
  relevanceScore: number;
  highlights: SearchHighlight[];
}

export interface SearchHighlight {
  field: string;
  fragments: string[];
}

export interface SearchQuery {
  query: string;
  filters?: {
    categories?: string[];
    types?: string[];
    tags?: string[];
  };
  pagination?: {
    page: number;
    limit: number;
  };
}

export interface SearchResponse {
  results: SearchResult[];
  totalCount: number;
  query: SearchQuery;
  executionTime: number;
}

export class SearchService {
  async search(query: SearchQuery, userRole: UserRole): Promise<SearchResponse> {
    const startTime = Date.now();
    try {
      const { query: q, filters, pagination } = query;
      const params = new URLSearchParams({
        q,
        limit: (pagination?.limit || 20).toString(),
        collections: filters?.types?.join(',') || 'services,stylists,customers,documentation',
      });

      const response = await fetch(`/api/search?${params.toString()}`);
      const data = await response.json();

      const results = data.results.map((item: any) => ({
        id: item.id,
        title: item.name || item.title || `${item.firstName} ${item.lastName}`,
        description: item.description || item.bio || '',
        content: item.content || '',
        path: `/${item.type}/${item.id}`,
        type: item.type,
        category: item.category || '',
        tags: item.tags || [],
        relevanceScore: 0, // will be calculated on the client
        highlights: [], // will be calculated on the client
      }));

      return {
        results,
        totalCount: data.total,
        query,
        executionTime: Date.now() - startTime,
      };
    } catch (error) {
      console.error('Search error:', error);
      return {
        results: [],
        totalCount: 0,
        query,
        executionTime: Date.now() - startTime,
      };
    }
  }
}

export const searchService = new SearchService();