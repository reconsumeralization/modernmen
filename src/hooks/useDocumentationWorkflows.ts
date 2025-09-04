'use client';

import { useState, useEffect, useCallback } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

export interface WorkflowStep {
  id: string;
  name: string;
  description: string;
  order: number;
  assigneeRole: 'author' | 'reviewer' | 'approver' | 'publisher';
  assigneeId?: string; // Specific user ID
  isRequired: boolean;
  estimatedDuration: number; // in hours
  instructions?: string;
  automatedActions?: Array<{
    type: 'notification' | 'email' | 'status_update' | 'assignment';
    config: any;
  }>;
}

export interface DocumentationWorkflow {
  id: string;
  name: string;
  description: string;
  category: string;
  isActive: boolean;
  isDefault: boolean;
  steps: WorkflowStep[];
  triggers: Array<{
    event: 'created' | 'updated' | 'submitted_for_review' | 'published';
    conditions?: any;
    actions: Array<{
      type: 'assign_step' | 'send_notification' | 'update_status';
      config: any;
    }>;
  }>;
  slaHours?: number; // Service Level Agreement
  createdBy: string;
  createdByData?: {
    id: string;
    name: string;
    email: string;
  };
  usageCount: number;
  tenant?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateDocumentationWorkflowData {
  name: string;
  description: string;
  category: string;
  steps: Omit<WorkflowStep, 'id'>[];
  triggers?: DocumentationWorkflow['triggers'];
  slaHours?: number;
  tenant?: string;
}

export function useDocumentationWorkflows() {
  const queryClient = useQueryClient();

  // Get all documentation workflows
  const {
    data: workflows = [],
    isLoading,
    error,
    refetch
  } = useQuery({
    queryKey: ['documentation-workflows'],
    queryFn: async () => {
      const response = await fetch('/api/documentation-workflows');
      if (!response.ok) throw new Error('Failed to fetch documentation workflows');
      return response.json();
    }
  });

  // Create documentation workflow
  const createWorkflowMutation = useMutation({
    mutationFn: async (data: CreateDocumentationWorkflowData) => {
      const response = await fetch('/api/documentation-workflows', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      if (!response.ok) throw new Error('Failed to create documentation workflow');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['documentation-workflows'] });
    }
  });

  // Update documentation workflow
  const updateWorkflowMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Partial<DocumentationWorkflow> }) => {
      const response = await fetch(`/api/documentation-workflows/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      if (!response.ok) throw new Error('Failed to update documentation workflow');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['documentation-workflows'] });
    }
  });

  // Delete documentation workflow
  const deleteWorkflowMutation = useMutation({
    mutationFn: async (id: string) => {
      const response = await fetch(`/api/documentation-workflows/${id}`, {
        method: 'DELETE'
      });
      if (!response.ok) throw new Error('Failed to delete documentation workflow');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['documentation-workflows'] });
    }
  });

  // Get workflow by ID
  const getWorkflowById = useCallback((id: string) => {
    return workflows.find(workflow => workflow.id === id);
  }, [workflows]);

  // Get active workflows
  const getActiveWorkflows = useCallback(() => {
    return workflows.filter(workflow => workflow.isActive);
  }, [workflows]);

  // Get default workflow
  const getDefaultWorkflow = useCallback(() => {
    return workflows.find(workflow => workflow.isDefault);
  }, [workflows]);

  // Get workflows by category
  const getWorkflowsByCategory = useCallback((category: string) => {
    return workflows.filter(workflow =>
      workflow.category.toLowerCase() === category.toLowerCase()
    );
  }, [workflows]);

  // Search workflows
  const searchWorkflows = useCallback((query: string) => {
    const lowercaseQuery = query.toLowerCase();
    return workflows.filter(workflow =>
      workflow.name.toLowerCase().includes(lowercaseQuery) ||
      workflow.description.toLowerCase().includes(lowercaseQuery) ||
      workflow.category.toLowerCase().includes(lowercaseQuery)
    );
  }, [workflows]);

  // Get categories
  const getCategories = useCallback(() => {
    const categories = [...new Set(workflows.map(workflow => workflow.category))];
    return categories.sort();
  }, [workflows]);

  // Get workflow steps in order
  const getWorkflowSteps = useCallback((workflowId: string) => {
    const workflow = getWorkflowById(workflowId);
    if (!workflow) return [];

    return [...workflow.steps].sort((a, b) => a.order - b.order);
  }, [getWorkflowById]);

  // Calculate workflow duration
  const calculateWorkflowDuration = useCallback((workflowId: string) => {
    const steps = getWorkflowSteps(workflowId);
    return steps.reduce((total, step) => total + step.estimatedDuration, 0);
  }, [getWorkflowSteps]);

  // Get next step in workflow
  const getNextStep = useCallback((workflowId: string, currentStepId?: string) => {
    const steps = getWorkflowSteps(workflowId);
    if (!currentStepId) return steps[0];

    const currentIndex = steps.findIndex(step => step.id === currentStepId);
    if (currentIndex === -1 || currentIndex === steps.length - 1) return null;

    return steps[currentIndex + 1];
  }, [getWorkflowSteps]);

  // Get previous step in workflow
  const getPreviousStep = useCallback((workflowId: string, currentStepId: string) => {
    const steps = getWorkflowSteps(workflowId);
    const currentIndex = steps.findIndex(step => step.id === currentStepId);
    if (currentIndex <= 0) return null;

    return steps[currentIndex - 1];
  }, [getWorkflowSteps]);

  // Validate workflow steps
  const validateWorkflowSteps = useCallback((steps: Omit<WorkflowStep, 'id'>[]) => {
    const errors: string[] = [];

    // Check for duplicate orders
    const orders = steps.map(step => step.order);
    const uniqueOrders = [...new Set(orders)];
    if (orders.length !== uniqueOrders.length) {
      errors.push('Step orders must be unique');
    }

    // Check for required steps
    const hasAuthorStep = steps.some(step => step.assigneeRole === 'author');
    const hasApproverStep = steps.some(step => step.assigneeRole === 'approver');

    if (!hasAuthorStep) {
      errors.push('Workflow must have at least one author step');
    }

    if (!hasApproverStep) {
      errors.push('Workflow must have at least one approver step');
    }

    // Check step order consistency
    const sortedSteps = [...steps].sort((a, b) => a.order - b.order);
    for (let i = 0; i < sortedSteps.length; i++) {
      if (sortedSteps[i].order !== i + 1) {
        errors.push('Step orders must be consecutive starting from 1');
        break;
      }
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }, []);

  // Set as default workflow
  const setAsDefault = useCallback(async (workflowId: string) => {
    try {
      // First, unset all default workflows
      await Promise.all(
        workflows
          .filter(w => w.isDefault && w.id !== workflowId)
          .map(w => updateWorkflowMutation.mutateAsync({
            id: w.id,
            data: { isDefault: false }
          }))
      );

      // Then set the new default
      await updateWorkflowMutation.mutateAsync({
        id: workflowId,
        data: { isDefault: true }
      });

      return true;
    } catch (err) {
      console.error('Failed to set default workflow:', err);
      return false;
    }
  }, [workflows, updateWorkflowMutation]);

  // Duplicate workflow
  const duplicateWorkflow = useCallback(async (
    workflowId: string,
    newName: string,
    newDescription?: string
  ) => {
    try {
      const workflow = getWorkflowById(workflowId);
      if (!workflow) return false;

      await createWorkflowMutation.mutateAsync({
        name: newName,
        description: newDescription || `${workflow.description} (Copy)`,
        category: workflow.category,
        steps: workflow.steps.map(step => ({
          name: step.name,
          description: step.description,
          order: step.order,
          assigneeRole: step.assigneeRole,
          assigneeId: step.assigneeId,
          isRequired: step.isRequired,
          estimatedDuration: step.estimatedDuration,
          instructions: step.instructions,
          automatedActions: step.automatedActions
        })),
        triggers: workflow.triggers,
        slaHours: workflow.slaHours,
        tenant: workflow.tenant
      });
      return true;
    } catch (err) {
      console.error('Failed to duplicate workflow:', err);
      return false;
    }
  }, [getWorkflowById, createWorkflowMutation]);

  // Get workflow statistics
  const getWorkflowStats = useCallback(() => {
    const stats = {
      total: workflows.length,
      active: workflows.filter(w => w.isActive).length,
      default: workflows.filter(w => w.isDefault).length,
      totalUsage: workflows.reduce((sum, workflow) => sum + workflow.usageCount, 0),
      averageSteps: workflows.length > 0
        ? workflows.reduce((sum, workflow) => sum + workflow.steps.length, 0) / workflows.length
        : 0,
      byCategory: {} as Record<string, number>,
      averageDuration: workflows.length > 0
        ? workflows.reduce((sum, workflow) => sum + calculateWorkflowDuration(workflow.id), 0) / workflows.length
        : 0
    };

    workflows.forEach(workflow => {
      stats.byCategory[workflow.category] = (stats.byCategory[workflow.category] || 0) + 1;
    });

    return stats;
  }, [workflows, calculateWorkflowDuration]);

  // Increment usage count
  const incrementUsageCount = useCallback(async (workflowId: string) => {
    try {
      const workflow = getWorkflowById(workflowId);
      if (!workflow) return false;

      await updateWorkflowMutation.mutateAsync({
        id: workflowId,
        data: {
          usageCount: workflow.usageCount + 1
        }
      });
      return true;
    } catch (err) {
      console.error('Failed to increment usage count:', err);
      return false;
    }
  }, [getWorkflowById, updateWorkflowMutation]);

  return {
    workflows,
    isLoading,
    error,
    refetch,
    createWorkflow: createWorkflowMutation.mutate,
    updateWorkflow: updateWorkflowMutation.mutate,
    deleteWorkflow: deleteWorkflowMutation.mutate,
    isCreating: createWorkflowMutation.isPending,
    isUpdating: updateWorkflowMutation.isPending,
    isDeleting: deleteWorkflowMutation.isPending,
    getWorkflowById,
    getActiveWorkflows,
    getDefaultWorkflow,
    getWorkflowsByCategory,
    searchWorkflows,
    getCategories,
    getWorkflowSteps,
    calculateWorkflowDuration,
    getNextStep,
    getPreviousStep,
    validateWorkflowSteps,
    setAsDefault,
    duplicateWorkflow,
    getWorkflowStats,
    incrementUsageCount
  };
}
