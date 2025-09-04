'use client';

import { useState, useEffect, useCallback } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

export interface Page {
  id: string;
  title: string;
  slug: string;
  content: any; // Rich text content from Lexical
  excerpt?: string;
  featuredImage?: string;
  status: 'draft' | 'published';
  author?: string;
  tenant?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreatePageData {
  title: string;
  slug: string;
  content: any;
  excerpt?: string;
  featuredImage?: string;
  status?: 'draft' | 'published';
  author?: string;
  tenant?: string;
}

export function usePages() {
  const queryClient = useQueryClient();

  // Get all pages
  const {
    data: pages = [],
    isLoading,
    error,
    refetch
  } = useQuery({
    queryKey: ['pages'],
    queryFn: async () => {
      const response = await fetch('/api/pages');
      if (!response.ok) throw new Error('Failed to fetch pages');
      return response.json();
    }
  });

  // Create page
  const createPageMutation = useMutation({
    mutationFn: async (data: CreatePageData) => {
      const response = await fetch('/api/pages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      if (!response.ok) throw new Error('Failed to create page');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['pages'] });
    }
  });

  // Update page
  const updatePageMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Partial<Page> }) => {
      const response = await fetch(`/api/pages/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      if (!response.ok) throw new Error('Failed to update page');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['pages'] });
    }
  });

  // Delete page
  const deletePageMutation = useMutation({
    mutationFn: async (id: string) => {
      const response = await fetch(`/api/pages/${id}`, {
        method: 'DELETE'
      });
      if (!response.ok) throw new Error('Failed to delete page');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['pages'] });
    }
  });

  // Get page by ID
  const getPageById = useCallback((id: string) => {
    return pages.find(page => page.id === id);
  }, [pages]);

  // Get page by slug
  const getPageBySlug = useCallback((slug: string) => {
    return pages.find(page => page.slug === slug);
  }, [pages]);

  // Get published pages
  const getPublishedPages = useCallback(() => {
    return pages.filter(page => page.status === 'published');
  }, [pages]);

  // Get pages by status
  const getPagesByStatus = useCallback((status: Page['status']) => {
    return pages.filter(page => page.status === status);
  }, [pages]);

  // Get pages by category
  const getPagesByCategory = useCallback((category: string) => {
    return pages.filter(page =>
      page.category?.toLowerCase() === category.toLowerCase()
    );
  }, [pages]);

  // Get child pages
  const getChildPages = useCallback((parentId: string) => {
    return pages.filter(page => page.parent === parentId);
  }, [pages]);

  // Get top-level pages
  const getTopLevelPages = useCallback(() => {
    return pages.filter(page => !page.parent);
  }, [pages]);

  // Get homepage
  const getHomePage = useCallback(() => {
    return pages.find(page => page.isHomePage) || pages.find(page => page.slug === 'home');
  }, [pages]);

  // Search pages
  const searchPages = useCallback((query: string) => {
    const lowercaseQuery = query.toLowerCase();
    return pages.filter(page =>
      page.title.toLowerCase().includes(lowercaseQuery) ||
      page.excerpt?.toLowerCase().includes(lowercaseQuery) ||
      page.content?.toLowerCase().includes(lowercaseQuery) ||
      page.seo?.title?.toLowerCase().includes(lowercaseQuery) ||
      page.seo?.description?.toLowerCase().includes(lowercaseQuery) ||
      page.tags?.some(tag => tag.toLowerCase().includes(lowercaseQuery))
    );
  }, [pages]);

  // Get categories
  const getCategories = useCallback(() => {
    const categories = [...new Set(pages.map(page => page.category).filter(Boolean))];
    return categories.sort();
  }, [pages]);

  // Get tags
  const getTags = useCallback(() => {
    const allTags = pages.flatMap(page => page.tags || []);
    return [...new Set(allTags)].sort();
  }, [pages]);

  // Get page hierarchy (for navigation)
  const getPageHierarchy = useCallback(() => {
    const hierarchy: Record<string, Page[]> = {};

    pages.forEach(page => {
      if (!page.parent) {
        hierarchy[page.id] = [page];
      } else {
        if (!hierarchy[page.parent]) {
          hierarchy[page.parent] = [];
        }
        hierarchy[page.parent].push(page);
      }
    });

    // Sort by order
    Object.values(hierarchy).forEach(pages => {
      pages.sort((a, b) => (a.order || 0) - (b.order || 0));
    });

    return hierarchy;
  }, [pages]);

  // Get navigation menu
  const getNavigationMenu = useCallback(() => {
    const topLevelPages = getTopLevelPages()
      .filter(page => page.status === 'published')
      .sort((a, b) => (a.order || 0) - (b.order || 0));

    return topLevelPages.map(page => ({
      ...page,
      children: getChildPages(page.id)
        .filter(child => child.status === 'published')
        .sort((a, b) => (a.order || 0) - (b.order || 0))
    }));
  }, [getTopLevelPages, getChildPages]);

  // Get page statistics
  const getPageStats = useCallback(() => {
    const stats = {
      total: pages.length,
      published: pages.filter(p => p.status === 'published').length,
      draft: pages.filter(p => p.status === 'draft').length,
      archived: pages.filter(p => p.status === 'archived').length,
      byCategory: {} as Record<string, number>,
      byStatus: {} as Record<Page['status'], number>,
      withImages: pages.filter(p => p.featuredImage).length,
      withSEO: pages.filter(p => p.seo?.title || p.seo?.description).length
    };

    pages.forEach(page => {
      stats.byStatus[page.status] = (stats.byStatus[page.status] || 0) + 1;
      if (page.category) {
        stats.byCategory[page.category] = (stats.byCategory[page.category] || 0) + 1;
      }
    });

    return stats;
  }, [pages]);

  // Generate slug from title
  const generateSlug = useCallback((title: string) => {
    return title
      .toLowerCase()
      .replace(/[^\w\s-]/g, '') // Remove special characters
      .replace(/[\s_-]+/g, '-') // Replace spaces and underscores with hyphens
      .replace(/^-+|-+$/g, ''); // Remove leading/trailing hyphens
  }, []);

  // Check if slug is unique
  const isSlugUnique = useCallback((slug: string, excludeId?: string) => {
    return !pages.some(page => page.slug === slug && page.id !== excludeId);
  }, [pages]);

  // Publish page
  const publishPage = useCallback(async (id: string) => {
    try {
      await updatePageMutation.mutateAsync({
        id,
        data: {
          status: 'published',
          publishedAt: new Date().toISOString()
        }
      });
      return true;
    } catch (err) {
      console.error('Failed to publish page:', err);
      return false;
    }
  }, [updatePageMutation]);

  // Unpublish page
  const unpublishPage = useCallback(async (id: string) => {
    try {
      await updatePageMutation.mutateAsync({
        id,
        data: {
          status: 'draft',
          publishedAt: undefined
        }
      });
      return true;
    } catch (err) {
      console.error('Failed to unpublish page:', err);
      return false;
    }
  }, [updatePageMutation]);

  return {
    pages,
    isLoading,
    error,
    refetch,
    createPage: createPageMutation.mutate,
    updatePage: updatePageMutation.mutate,
    deletePage: deletePageMutation.mutate,
    isCreating: createPageMutation.isPending,
    isUpdating: updatePageMutation.isPending,
    isDeleting: deletePageMutation.isPending,
    getPageById,
    getPageBySlug,
    getPublishedPages,
    getPagesByStatus,
    getPagesByCategory,
    getChildPages,
    getTopLevelPages,
    getHomePage,
    searchPages,
    getCategories,
    getTags,
    getPageHierarchy,
    getNavigationMenu,
    getPageStats,
    generateSlug,
    isSlugUnique,
    publishPage,
    unpublishPage
  };
}
