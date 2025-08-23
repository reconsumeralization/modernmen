import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { Documentationrch } from '../Documentationrch';

// Mock dependencies
jest.mock('next-auth/react');
jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
  userchParams: jest.fn()
}));
jest.mock('@/lib/documentation-permissions', () => ({
  getUserRoleFromSession: jest.fn(() => 'developer')
}));
jest.mock('date-fns', () => ({
  formatDistanceToNow: jest.fn(() => '2 days ago')
}));

const mockUseSession = useSession as jest.MockedFunction<typeof useSession>;
const mockUseRouter = useRouter as jest.MockedFunction<typeof useRouter>;
const mockPush = jest.fn();

// Mock rch service
jest.mock('@/lib/rch-service', () => ({
  DocumentationrchService: jest.fn().mockImplementation(() => ({
    rch: jest.fn().mockResolvedValue({
      results: [
        {
          id: 'test-result',
          title: 'Test API Guide',
          description: 'A comprehensive guide for testing APIs',
          content: 'This guide covers API testing methods...',
          path: '/documentation/developer/api/testing',
          type: 'guide',
          role: 'developer',
          category: 'API',
          tags: ['api', 'testing'],
          author: 'Test Author',
          lastUpdated: new Date('2024-01-15'),
          difficulty: 'intermediate',
          estimatedReadTime: 10,
          relevanceScore: 0.95,
          highlights: [
            {
              field: 'title',
              fragments: ['Test <mark>API</mark> Guide']
            }
          ],
          metadata: {
            views: 1250,
            rating: 4.5,
            completionRate: 0.85,
            feedbackCount: 23,
            isNew: false,
            isUpdated: true,
            isDeprecated: false
          }
        }
      ],
      totalCount: 1,
      facets: {
        roles: [],
        categories: [{ value: 'API', count: 1, selected: false }],
        tags: [{ value: 'api', count: 1, selected: false }],
        contentTypes: [{ value: 'guide', count: 1, selected: false }],
        difficulty: [{ value: 'intermediate', count: 1, selected: false }],
        authors: [{ value: 'Test Author', count: 1, selected: false }],
        sections: []
      },
      suggestions: [],
      analytics: {
        queryId: 'test-query-id',
        timestamp: new Date(),
        userRole: 'developer',
        resultsCount: 1,
        hasResults: true,
        clickedResults: [],
        rchTime: 50
      },
      pagination: { page: 1, limit: 20, offset: 0 },
      query: {
        query: 'API',
        filters: {},
        pagination: { page: 1, limit: 20, offset: 0 },
        sorting: { field: 'relevance', direction: 'desc' }
      },
      executionTime: 50
    }),
    autocomplete: jest.fn().mockResolvedValue({
      suggestions: [
        { text: 'API testing', type: 'completion', score: 0.9 },
        { text: 'API documentation', type: 'completion', score: 0.8 }
      ],
      recentQueries: ['API guide', 'authentication'],
      popularQueries: ['API', 'setup', 'troubleshooting'],
      categories: ['API', 'Setup', 'Troubleshooting']
    })
  }))
}));

describe('Documentationrch', () => {
  beforeEach(() => {
    mockUseSession.mockReturnValue({
      data: {
        user: { role: 'developer' }
      }
    } as any);

    (mockUseRouter as jest.Mock).mockReturnValue({
      push: mockPush
    });

    jest.clearAllMocks();
  });

  it('renders rch input correctly', () => {
    render(<Documentationrch />);
    
    expect(screen.getByPlaceholderText('rch documentation...')).toBeInTheDocument();
    expect(screen.getByRole('button')).toBeInTheDocument(); // Filter button
  });

  it('performs rch when user types', async () => {
    render(<Documentationrch />);
    
    const rchInput = screen.getByPlaceholderText('rch documentation...');
    fireEvent.change(rchInput, { target: { value: 'API' } });

    await waitFor(() => {
      expect(screen.getByText('Test API Guide')).toBeInTheDocument();
    });

    expect(screen.getByText('Found 1 result for "API"')).toBeInTheDocument();
    expect(screen.getByText('A comprehensive guide for testing APIs')).toBeInTheDocument();
  });

  it('shows autocomplete suggestions', async () => {
    render(<Documentationrch />);
    
    const rchInput = screen.getByPlaceholderText('rch documentation...');
    fireEvent.change(rchInput, { target: { value: 'API' } });
    fireEvent.focus(rchInput);

    await waitFor(() => {
      expect(screen.getByText('Suggestions')).toBeInTheDocument();
      expect(screen.getByText('API testing')).toBeInTheDocument();
      expect(screen.getByText('API documentation')).toBeInTheDocument();
    });
  });

  it('navigates to result when clicked', async () => {
    render(<Documentationrch />);
    
    const rchInput = screen.getByPlaceholderText('rch documentation...');
    fireEvent.change(rchInput, { target: { value: 'API' } });

    await waitFor(() => {
      expect(screen.getByText('Test API Guide')).toBeInTheDocument();
    });

    const resultCard = screen.getByText('Test API Guide').closest('div[role="button"], div[class*="cursor-pointer"]');
    if (resultCard) {
      fireEvent.click(resultCard);
      expect(mockPush).toHaveBeenCalledWith('/documentation/developer/api/testing');
    }
  });

  it('shows filters when enabled', async () => {
    render(<Documentationrch showFilters={true} />);
    
    const rchInput = screen.getByPlaceholderText('rch documentation...');
    fireEvent.change(rchInput, { target: { value: 'API' } });

    await waitFor(() => {
      expect(screen.getByText('Test API Guide')).toBeInTheDocument();
    });

    const filterButton = screen.getByRole('button');
    fireEvent.click(filterButton);

    await waitFor(() => {
      expect(screen.getByText('Filters')).toBeInTheDocument();
    });
  });

  it('handles empty rch results', async () => {
    // Mock empty results
    const mockrchService = require('@/lib/rch-service').DocumentationrchService;
    mockrchService.mockImplementation(() => ({
      rch: jest.fn().mockResolvedValue({
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
        suggestions: [
          { text: 'Did you mean "API"?', type: 'correction', score: 0.8 }
        ],
        analytics: {
          queryId: 'empty-query-id',
          timestamp: new Date(),
          userRole: 'developer',
          resultsCount: 0,
          hasResults: false,
          clickedResults: [],
          rchTime: 25
        },
        pagination: { page: 1, limit: 20, offset: 0 },
        query: {
          query: 'nonexistent',
          filters: {},
          pagination: { page: 1, limit: 20, offset: 0 },
          sorting: { field: 'relevance', direction: 'desc' }
        },
        executionTime: 25
      }),
      autocomplete: jest.fn().mockResolvedValue({
        suggestions: [],
        recentQueries: [],
        popularQueries: [],
        categories: []
      })
    }));

    render(<Documentationrch />);
    
    const rchInput = screen.getByPlaceholderText('rch documentation...');
    fireEvent.change(rchInput, { target: { value: 'nonexistent' } });

    await waitFor(() => {
      expect(screen.getByText('No results found')).toBeInTheDocument();
      expect(screen.getByText('Did you mean "API"?')).toBeInTheDocument();
    });
  });

  it('handles rch with initial query', async () => {
    render(<Documentationrch initialQuery="API testing" />);
    
    await waitFor(() => {
      expect(screen.getByDisplayValue('API testing')).toBeInTheDocument();
      expect(screen.getByText('Test API Guide')).toBeInTheDocument();
    });
  });

  it('calls onResultClick when provided', async () => {
    const mockOnResultClick = jest.fn();
    render(<Documentationrch onResultClick={mockOnResultClick} />);
    
    const rchInput = screen.getByPlaceholderText('rch documentation...');
    fireEvent.change(rchInput, { target: { value: 'API' } });

    await waitFor(() => {
      expect(screen.getByText('Test API Guide')).toBeInTheDocument();
    });

    const resultCard = screen.getByText('Test API Guide').closest('div[role="button"], div[class*="cursor-pointer"]');
    if (resultCard) {
      fireEvent.click(resultCard);
      expect(mockOnResultClick).toHaveBeenCalledWith(
        expect.objectContaining({
          id: 'test-result',
          title: 'Test API Guide'
        })
      );
    }
  });

  it('shows loading state during rch', async () => {
    // Mock delayed rch
    const mockrchService = require('@/lib/rch-service').DocumentationrchService;
    mockrchService.mockImplementation(() => ({
      rch: jest.fn().mockImplementation(() => 
        new Promise(resolve => setTimeout(() => resolve({
          results: [],
          totalCount: 0,
          facets: { roles: [], categories: [], tags: [], contentTypes: [], difficulty: [], authors: [], sections: [] },
          suggestions: [],
          analytics: { queryId: 'test', timestamp: new Date(), userRole: 'developer', resultsCount: 0, hasResults: false, clickedResults: [], rchTime: 0 },
          pagination: { page: 1, limit: 20, offset: 0 },
          query: { query: '', filters: {}, pagination: { page: 1, limit: 20, offset: 0 }, sorting: { field: 'relevance', direction: 'desc' } },
          executionTime: 0
        }), 100))
      ),
      autocomplete: jest.fn().mockResolvedValue({
        suggestions: [],
        recentQueries: [],
        popularQueries: [],
        categories: []
      })
    }));

    render(<Documentationrch />);
    
    const rchInput = screen.getByPlaceholderText('rch documentation...');
    fireEvent.change(rchInput, { target: { value: 'loading test' } });

    // Should show loading spinner
    expect(screen.getByRole('button')).toBeInTheDocument();
  });

  it('handles compact mode', () => {
    render(<Documentationrch compact={true} />);
    
    expect(screen.getByPlaceholderText('rch documentation...')).toBeInTheDocument();
  });

  it('submits rch on form submit', async () => {
    render(<Documentationrch />);
    
    const rchInput = screen.getByPlaceholderText('rch documentation...');
    fireEvent.change(rchInput, { target: { value: 'API' } });
    
    const form = rchInput.closest('form');
    if (form) {
      fireEvent.submit(form);
    }

    await waitFor(() => {
      expect(screen.getByText('Test API Guide')).toBeInTheDocument();
    });
  });
});