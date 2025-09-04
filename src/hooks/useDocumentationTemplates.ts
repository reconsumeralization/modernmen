'use client';

import { useState, useEffect, useCallback } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

export interface DocumentationTemplate {
  id: string;
  name: string;
  description: string;
  category: string;
  templateContent: any; // Rich text template content
  placeholders: Array<{
    key: string;
    label: string;
    type: 'text' | 'textarea' | 'select' | 'date' | 'number';
    required: boolean;
    options?: string[]; // For select type
    defaultValue?: any;
  }>;
  isActive: boolean;
  usageCount: number;
  createdBy: string;
  createdByData?: {
    id: string;
    name: string;
    email: string;
  };
  tags: string[];
  accessLevel: 'public' | 'staff' | 'admin';
  tenant?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateDocumentationTemplateData {
  name: string;
  description: string;
  category: string;
  templateContent: any;
  placeholders?: DocumentationTemplate['placeholders'];
  tags?: string[];
  accessLevel?: DocumentationTemplate['accessLevel'];
  tenant?: string;
}

export function useDocumentationTemplates() {
  const queryClient = useQueryClient();

  // Get all documentation templates
  const {
    data: templates = [],
    isLoading,
    error,
    refetch
  } = useQuery({
    queryKey: ['documentation-templates'],
    queryFn: async () => {
      const response = await fetch('/api/documentation-templates');
      if (!response.ok) throw new Error('Failed to fetch documentation templates');
      return response.json();
    }
  });

  // Create documentation template
  const createTemplateMutation = useMutation({
    mutationFn: async (data: CreateDocumentationTemplateData) => {
      const response = await fetch('/api/documentation-templates', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      if (!response.ok) throw new Error('Failed to create documentation template');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['documentation-templates'] });
    }
  });

  // Update documentation template
  const updateTemplateMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Partial<DocumentationTemplate> }) => {
      const response = await fetch(`/api/documentation-templates/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      if (!response.ok) throw new Error('Failed to update documentation template');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['documentation-templates'] });
    }
  });

  // Delete documentation template
  const deleteTemplateMutation = useMutation({
    mutationFn: async (id: string) => {
      const response = await fetch(`/api/documentation-templates/${id}`, {
        method: 'DELETE'
      });
      if (!response.ok) throw new Error('Failed to delete documentation template');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['documentation-templates'] });
    }
  });

  // Get template by ID
  const getTemplateById = useCallback((id: string) => {
    return templates.find(template => template.id === id);
  }, [templates]);

  // Get active templates
  const getActiveTemplates = useCallback(() => {
    return templates.filter(template => template.isActive);
  }, [templates]);

  // Get templates by category
  const getTemplatesByCategory = useCallback((category: string) => {
    return templates.filter(template =>
      template.category.toLowerCase() === category.toLowerCase()
    );
  }, [templates]);

  // Get templates by access level
  const getTemplatesByAccessLevel = useCallback((accessLevel: DocumentationTemplate['accessLevel']) => {
    return templates.filter(template => template.accessLevel === accessLevel);
  }, [templates]);

  // Search templates
  const searchTemplates = useCallback((query: string) => {
    const lowercaseQuery = query.toLowerCase();
    return templates.filter(template =>
      template.name.toLowerCase().includes(lowercaseQuery) ||
      template.description.toLowerCase().includes(lowercaseQuery) ||
      template.category.toLowerCase().includes(lowercaseQuery) ||
      template.tags.some(tag => tag.toLowerCase().includes(lowercaseQuery))
    );
  }, [templates]);

  // Get categories
  const getCategories = useCallback(() => {
    const categories = [...new Set(templates.map(template => template.category))];
    return categories.sort();
  }, [templates]);

  // Get tags
  const getTags = useCallback(() => {
    const allTags = templates.flatMap(template => template.tags);
    return [...new Set(allTags)].sort();
  }, [templates]);

  // Get popular templates
  const getPopularTemplates = useCallback((limit: number = 10) => {
    return [...templates]
      .filter(template => template.isActive)
      .sort((a, b) => b.usageCount - a.usageCount)
      .slice(0, limit);
  }, [templates]);

  // Increment usage count
  const incrementUsageCount = useCallback(async (templateId: string) => {
    try {
      const template = getTemplateById(templateId);
      if (!template) return false;

      await updateTemplateMutation.mutateAsync({
        id: templateId,
        data: {
          usageCount: template.usageCount + 1
        }
      });
      return true;
    } catch (err) {
      console.error('Failed to increment usage count:', err);
      return false;
    }
  }, [getTemplateById, updateTemplateMutation]);

  // Generate content from template
  const generateContentFromTemplate = useCallback((
    templateId: string,
    placeholderValues: Record<string, any>
  ) => {
    const template = getTemplateById(templateId);
    if (!template) return null;

    let content = JSON.stringify(template.templateContent);

    // Replace placeholders
    template.placeholders.forEach(placeholder => {
      const value = placeholderValues[placeholder.key];
      if (value !== undefined) {
        const placeholderRegex = new RegExp(`{{${placeholder.key}}}`, 'g');
        content = content.replace(placeholderRegex, value);
      }
    });

    return JSON.parse(content);
  }, [getTemplateById]);

  // Validate placeholder values
  const validatePlaceholderValues = useCallback((
    templateId: string,
    values: Record<string, any>
  ) => {
    const template = getTemplateById(templateId);
    if (!template) return { isValid: false, errors: ['Template not found'] };

    const errors: string[] = [];
    const requiredPlaceholders = template.placeholders.filter(p => p.required);

    requiredPlaceholders.forEach(placeholder => {
      const value = values[placeholder.key];
      if (!value || (typeof value === 'string' && !value.trim())) {
        errors.push(`${placeholder.label} is required`);
      }
    });

    return {
      isValid: errors.length === 0,
      errors
    };
  }, [getTemplateById]);

  // Get template statistics
  const getTemplateStats = useCallback(() => {
    const stats = {
      total: templates.length,
      active: templates.filter(t => t.isActive).length,
      totalUsage: templates.reduce((sum, template) => sum + template.usageCount, 0),
      averageUsage: templates.length > 0
        ? templates.reduce((sum, template) => sum + template.usageCount, 0) / templates.length
        : 0,
      byCategory: {} as Record<string, number>,
      byAccessLevel: {} as Record<DocumentationTemplate['accessLevel'], number>,
      mostUsed: templates.reduce((prev, current) =>
        prev.usageCount > current.usageCount ? prev : current
      )
    };

    templates.forEach(template => {
      stats.byCategory[template.category] = (stats.byCategory[template.category] || 0) + 1;
      stats.byAccessLevel[template.accessLevel] = (stats.byAccessLevel[template.accessLevel] || 0) + 1;
    });

    return stats;
  }, [templates]);

  // Duplicate template
  const duplicateTemplate = useCallback(async (
    templateId: string,
    newName: string,
    newDescription?: string
  ) => {
    try {
      const template = getTemplateById(templateId);
      if (!template) return false;

      await createTemplateMutation.mutateAsync({
        name: newName,
        description: newDescription || `${template.description} (Copy)`,
        category: template.category,
        templateContent: template.templateContent,
        placeholders: template.placeholders,
        tags: [...template.tags],
        accessLevel: template.accessLevel,
        tenant: template.tenant
      });
      return true;
    } catch (err) {
      console.error('Failed to duplicate template:', err);
      return false;
    }
  }, [getTemplateById, createTemplateMutation]);

  return {
    templates,
    isLoading,
    error,
    refetch,
    createTemplate: createTemplateMutation.mutate,
    updateTemplate: updateTemplateMutation.mutate,
    deleteTemplate: deleteTemplateMutation.mutate,
    isCreating: createTemplateMutation.isPending,
    isUpdating: updateTemplateMutation.isPending,
    isDeleting: deleteTemplateMutation.isPending,
    getTemplateById,
    getActiveTemplates,
    getTemplatesByCategory,
    getTemplatesByAccessLevel,
    searchTemplates,
    getCategories,
    getTags,
    getPopularTemplates,
    incrementUsageCount,
    generateContentFromTemplate,
    validatePlaceholderValues,
    getTemplateStats,
    duplicateTemplate
  };
}
