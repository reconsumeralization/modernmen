'use client';

import { useState, useEffect, useCallback } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

export interface Documentation {
  id: string;
  title: string;
  slug: string;
  content: any; // Rich text content
  excerpt?: string;
  category: string;
  tags: string[];
  author: string;
  authorData?: {
    id: string;
    name: string;
    email: string;
  };
  status: 'draft' | 'review' | 'published' | 'archived';
  version: number;
  templateId?: string;
  workflowId?: string;
  reviewers?: string[];
  approvedBy?: string;
  publishedAt?: string;
  lastReviewedAt?: string;
  reviewComments?: Array<{
    reviewerId: string;
    reviewerName: string;
    comment: string;
    status: 'approved' | 'rejected' | 'needs_revision';
    createdAt: string;
  }>;
  seo?: {
    title?: string;
    description?: string;
    keywords?: string[];
  };
  accessLevel: 'public' | 'staff' | 'admin';
  viewCount: number;
  helpfulCount: number;
  tenant?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateDocumentationData {
  title: string;
  content: any;
  excerpt?: string;
  category: string;
  tags?: string[];
  templateId?: string;
  workflowId?: string;
  reviewers?: string[];
  seo?: Documentation['seo'];
  accessLevel?: Documentation['accessLevel'];
  tenant?: string;
}

export function useDocumentation() {
  const queryClient = useQueryClient();

  // Get all documentation
  const {
    data: documentation = [],
    isLoading,
    error,
    refetch
  } = useQuery({
    queryKey: ['documentation'],
    queryFn: async () => {
      const response = await fetch('/api/documentation');
      if (!response.ok) throw new Error('Failed to fetch documentation');
      return response.json();
    }
  });

  // Create documentation
  const createDocumentationMutation = useMutation({
    mutationFn: async (data: CreateDocumentationData) => {
      const response = await fetch('/api/documentation', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      if (!response.ok) throw new Error('Failed to create documentation');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['documentation'] });
    }
  });

  // Update documentation
  const updateDocumentationMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Partial<Documentation> }) => {
      const response = await fetch(`/api/documentation/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      if (!response.ok) throw new Error('Failed to update documentation');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['documentation'] });
    }
  });

  // Delete documentation
  const deleteDocumentationMutation = useMutation({
    mutationFn: async (id: string) => {
      const response = await fetch(`/api/documentation/${id}`, {
        method: 'DELETE'
      });
      if (!response.ok) throw new Error('Failed to delete documentation');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['documentation'] });
    }
  });

  // Get documentation by ID
  const getDocumentationById = useCallback((id: string) => {
    return documentation.find(doc => doc.id === id);
  }, [documentation]);

  // Get documentation by slug
  const getDocumentationBySlug = useCallback((slug: string) => {
    return documentation.find(doc => doc.slug === slug);
  }, [documentation]);

  // Get published documentation
  const getPublishedDocumentation = useCallback(() => {
    return documentation.filter(doc => doc.status === 'published');
  }, [documentation]);

  // Get documentation by category
  const getDocumentationByCategory = useCallback((category: string) => {
    return documentation.filter(doc =>
      doc.category.toLowerCase() === category.toLowerCase()
    );
  }, [documentation]);

  // Get documentation by status
  const getDocumentationByStatus = useCallback((status: Documentation['status']) => {
    return documentation.filter(doc => doc.status === status);
  }, [documentation]);

  // Get documentation by author
  const getDocumentationByAuthor = useCallback((authorId: string) => {
    return documentation.filter(doc => doc.author === authorId);
  }, [documentation]);

  // Get documentation needing review
  const getDocumentationNeedingReview = useCallback(() => {
    return documentation.filter(doc =>
      doc.status === 'review' && doc.reviewers && doc.reviewers.length > 0
    );
  }, [documentation]);

  // Search documentation
  const searchDocumentation = useCallback((query: string) => {
    const lowercaseQuery = query.toLowerCase();
    return documentation.filter(doc =>
      doc.title.toLowerCase().includes(lowercaseQuery) ||
      doc.excerpt?.toLowerCase().includes(lowercaseQuery) ||
      doc.content?.toLowerCase().includes(lowercaseQuery) ||
      doc.category.toLowerCase().includes(lowercaseQuery) ||
      doc.tags.some(tag => tag.toLowerCase().includes(lowercaseQuery)) ||
      doc.seo?.title?.toLowerCase().includes(lowercaseQuery) ||
      doc.seo?.description?.toLowerCase().includes(lowercaseQuery)
    );
  }, [documentation]);

  // Get categories
  const getCategories = useCallback(() => {
    const categories = [...new Set(documentation.map(doc => doc.category))];
    return categories.sort();
  }, [documentation]);

  // Get tags
  const getTags = useCallback(() => {
    const allTags = documentation.flatMap(doc => doc.tags);
    return [...new Set(allTags)].sort();
  }, [documentation]);

  // Submit for review
  const submitForReview = useCallback(async (id: string, reviewers: string[]) => {
    try {
      await updateDocumentationMutation.mutateAsync({
        id,
        data: {
          status: 'review',
          reviewers,
          lastReviewedAt: new Date().toISOString()
        }
      });
      return true;
    } catch (err) {
      console.error('Failed to submit for review:', err);
      return false;
    }
  }, [updateDocumentationMutation]);

  // Approve documentation
  const approveDocumentation = useCallback(async (
    id: string,
    reviewerId: string,
    comment?: string
  ) => {
    try {
      const doc = getDocumentationById(id);
      if (!doc) return false;

      const reviewComment = {
        reviewerId,
        reviewerName: 'Reviewer', // Would get from user data
        comment: comment || 'Approved',
        status: 'approved' as const,
        createdAt: new Date().toISOString()
      };

      await updateDocumentationMutation.mutateAsync({
        id,
        data: {
          status: 'published',
          approvedBy: reviewerId,
          publishedAt: new Date().toISOString(),
          reviewComments: [...(doc.reviewComments || []), reviewComment]
        }
      });
      return true;
    } catch (err) {
      console.error('Failed to approve documentation:', err);
      return false;
    }
  }, [getDocumentationById, updateDocumentationMutation]);

  // Reject documentation
  const rejectDocumentation = useCallback(async (
    id: string,
    reviewerId: string,
    comment: string
  ) => {
    try {
      const doc = getDocumentationById(id);
      if (!doc) return false;

      const reviewComment = {
        reviewerId,
        reviewerName: 'Reviewer', // Would get from user data
        comment,
        status: 'rejected' as const,
        createdAt: new Date().toISOString()
      };

      await updateDocumentationMutation.mutateAsync({
        id,
        data: {
          status: 'draft',
          reviewComments: [...(doc.reviewComments || []), reviewComment]
        }
      });
      return true;
    } catch (err) {
      console.error('Failed to reject documentation:', err);
      return false;
    }
  }, [getDocumentationById, updateDocumentationMutation]);

  // Publish documentation
  const publishDocumentation = useCallback(async (id: string) => {
    try {
      await updateDocumentationMutation.mutateAsync({
        id,
        data: {
          status: 'published',
          publishedAt: new Date().toISOString()
        }
      });
      return true;
    } catch (err) {
      console.error('Failed to publish documentation:', err);
      return false;
    }
  }, [updateDocumentationMutation]);

  // Archive documentation
  const archiveDocumentation = useCallback(async (id: string) => {
    try {
      await updateDocumentationMutation.mutateAsync({
        id,
        data: {
          status: 'archived'
        }
      });
      return true;
    } catch (err) {
      console.error('Failed to archive documentation:', err);
      return false;
    }
  }, [updateDocumentationMutation]);

  // Mark as helpful
  const markAsHelpful = useCallback(async (id: string) => {
    try {
      const doc = getDocumentationById(id);
      if (!doc) return false;

      await updateDocumentationMutation.mutateAsync({
        id,
        data: {
          helpfulCount: doc.helpfulCount + 1,
          viewCount: doc.viewCount + 1
        }
      });
      return true;
    } catch (err) {
      console.error('Failed to mark as helpful:', err);
      return false;
    }
  }, [getDocumentationById, updateDocumentationMutation]);

  // Track view
  const trackView = useCallback(async (id: string) => {
    try {
      const doc = getDocumentationById(id);
      if (!doc) return;

      await updateDocumentationMutation.mutateAsync({
        id,
        data: {
          viewCount: doc.viewCount + 1
        }
      });
    } catch (err) {
      console.error('Failed to track view:', err);
    }
  }, [getDocumentationById, updateDocumentationMutation]);

  // Get documentation statistics
  const getDocumentationStats = useCallback(() => {
    const stats = {
      total: documentation.length,
      published: documentation.filter(d => d.status === 'published').length,
      draft: documentation.filter(d => d.status === 'draft').length,
      review: documentation.filter(d => d.status === 'review').length,
      archived: documentation.filter(d => d.status === 'archived').length,
      totalViews: documentation.reduce((sum, doc) => sum + doc.viewCount, 0),
      totalHelpful: documentation.reduce((sum, doc) => sum + doc.helpfulCount, 0),
      averageHelpfulRate: documentation.length > 0
        ? documentation.reduce((sum, doc) => sum + (doc.viewCount > 0 ? doc.helpfulCount / doc.viewCount : 0), 0) / documentation.length
        : 0,
      byCategory: {} as Record<string, number>,
      byAuthor: {} as Record<string, number>,
      needsReview: getDocumentationNeedingReview().length
    };

    documentation.forEach(doc => {
      stats.byCategory[doc.category] = (stats.byCategory[doc.category] || 0) + 1;
      stats.byAuthor[doc.author] = (stats.byAuthor[doc.author] || 0) + 1;
    });

    return stats;
  }, [documentation, getDocumentationNeedingReview]);

  return {
    documentation,
    isLoading,
    error,
    refetch,
    createDocumentation: createDocumentationMutation.mutate,
    updateDocumentation: updateDocumentationMutation.mutate,
    deleteDocumentation: deleteDocumentationMutation.mutate,
    isCreating: createDocumentationMutation.isPending,
    isUpdating: updateDocumentationMutation.isPending,
    isDeleting: deleteDocumentationMutation.isPending,
    getDocumentationById,
    getDocumentationBySlug,
    getPublishedDocumentation,
    getDocumentationByCategory,
    getDocumentationByStatus,
    getDocumentationByAuthor,
    getDocumentationNeedingReview,
    searchDocumentation,
    getCategories,
    getTags,
    submitForReview,
    approveDocumentation,
    rejectDocumentation,
    publishDocumentation,
    archiveDocumentation,
    markAsHelpful,
    trackView,
    getDocumentationStats
  };
}
