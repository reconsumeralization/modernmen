'use client';

import { useState, useEffect, useCallback } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

export interface Tenant {
  id: string;
  name: string;
  email: string;
  status: 'active' | 'suspended' | 'pending' | 'deactivated';
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateTenantData {
  name: string;
  email: string;
  phone?: string;
  address?: Tenant['address'];
  settings?: Tenant['settings'];
}

export function useTenants() {
  const queryClient = useQueryClient();

  // Get all tenants
  const {
    data: tenants = [],
    isLoading,
    error,
    refetch
  } = useQuery({
    queryKey: ['tenants'],
    queryFn: async () => {
      const response = await fetch('/api/tenants');
      if (!response.ok) throw new Error('Failed to fetch tenants');
      return response.json();
    }
  });

  // Create tenant
  const createTenantMutation = useMutation({
    mutationFn: async (data: CreateTenantData) => {
      const response = await fetch('/api/tenants', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      if (!response.ok) throw new Error('Failed to create tenant');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tenants'] });
    }
  });

  // Update tenant
  const updateTenantMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Partial<Tenant> }) => {
      const response = await fetch(`/api/tenants/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      if (!response.ok) throw new Error('Failed to update tenant');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tenants'] });
    }
  });

  // Delete tenant
  const deleteTenantMutation = useMutation({
    mutationFn: async (id: string) => {
      const response = await fetch(`/api/tenants/${id}`, {
        method: 'DELETE'
      });
      if (!response.ok) throw new Error('Failed to delete tenant');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tenants'] });
    }
  });

  // Get tenant by ID
  const getTenantById = useCallback((id: string) => {
    return tenants.find(tenant => tenant.id === id);
  }, [tenants]);

  // Get active tenants
  const getActiveTenants = useCallback(() => {
    return tenants.filter(tenant => tenant.status === 'active');
  }, [tenants]);

  // Get tenants by status
  const getTenantsByStatus = useCallback((status: Tenant['status']) => {
    return tenants.filter(tenant => tenant.status === status);
  }, [tenants]);

  // Search tenants
  const searchTenants = useCallback((query: string) => {
    const lowercaseQuery = query.toLowerCase();
    return tenants.filter(tenant =>
      tenant.name.toLowerCase().includes(lowercaseQuery) ||
      tenant.email.toLowerCase().includes(lowercaseQuery)
    );
  }, [tenants]);

  // Get tenant statistics
  const getTenantStats = useCallback(() => {
    const stats = {
      total: tenants.length,
      active: tenants.filter(t => t.status === 'active').length,
      pending: tenants.filter(t => t.status === 'pending').length,
      suspended: tenants.filter(t => t.status === 'suspended').length,
      byStatus: {} as Record<Tenant['status'], number>
    };

    tenants.forEach(tenant => {
      stats.byStatus[tenant.status] = (stats.byStatus[tenant.status] || 0) + 1;
    });

    return stats;
  }, [tenants]);

  // Update tenant status
  const updateTenantStatus = useCallback(async (id: string, status: Tenant['status']) => {
    try {
      await updateTenantMutation.mutateAsync({
        id,
        data: { status }
      });
      return true;
    } catch (err) {
      console.error('Failed to update tenant status:', err);
      return false;
    }
  }, [updateTenantMutation]);

  return {
    tenants,
    isLoading,
    error,
    refetch,
    createTenant: createTenantMutation.mutate,
    updateTenant: updateTenantMutation.mutate,
    deleteTenant: deleteTenantMutation.mutate,
    isCreating: createTenantMutation.isPending,
    isUpdating: updateTenantMutation.isPending,
    isDeleting: deleteTenantMutation.isPending,
    getTenantById,
    getActiveTenants,
    getTenantsByStatus,
    searchTenants,
    getTenantStats,
    updateTenantStatus
  };
}
