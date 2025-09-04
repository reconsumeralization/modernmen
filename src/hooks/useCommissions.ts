'use client';

import { useState, useEffect, useCallback } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

export interface Commission {
  id: string;
  stylist?: string;
  period?: {
    startDate?: string;
    endDate?: string;
    month?: string;
    year?: string;
  };
  totalSales?: number;
  commissionRate?: number;
  commissionAmount?: number;
  status?: 'pending' | 'calculated' | 'paid' | 'cancelled';
  paymentDate?: string;
  notes?: string;
  tenant?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateCommissionData {
  stylist?: string;
  period?: {
    startDate?: string;
    endDate?: string;
    month?: string;
    year?: string;
  };
  totalSales?: number;
  commissionRate?: number;
  commissionAmount?: number;
  status?: 'pending' | 'calculated' | 'paid' | 'cancelled';
  paymentDate?: string;
  notes?: string;
  tenant?: string;
}

export function useCommissions() {
  const queryClient = useQueryClient();

  // Get all commissions
  const {
    data: commissions = [],
    isLoading,
    error,
    refetch
  } = useQuery({
    queryKey: ['commissions'],
    queryFn: async () => {
      const response = await fetch('/api/commissions');
      if (!response.ok) throw new Error('Failed to fetch commissions');
      return response.json();
    }
  });

  // Create commission
  const createCommissionMutation = useMutation({
    mutationFn: async (data: CreateCommissionData) => {
      const response = await fetch('/api/commissions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      if (!response.ok) throw new Error('Failed to create commission');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['commissions'] });
    }
  });

  // Update commission
  const updateCommissionMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Partial<Commission> }) => {
      const response = await fetch(`/api/commissions/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      if (!response.ok) throw new Error('Failed to update commission');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['commissions'] });
    }
  });

  // Delete commission
  const deleteCommissionMutation = useMutation({
    mutationFn: async (id: string) => {
      const response = await fetch(`/api/commissions/${id}`, {
        method: 'DELETE'
      });
      if (!response.ok) throw new Error('Failed to delete commission');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['commissions'] });
    }
  });

  // Get commission by ID
  const getCommissionById = useCallback((id: string) => {
    return commissions.find((commission: Commission) => commission.id === id);
  }, [commissions]);

  // Get commissions by stylist
  const getCommissionsByStylist = useCallback((stylistId: string) => {
    return commissions.filter((commission: Commission) => commission.stylist === stylistId);
  }, [commissions]);

  // Get commissions by status
  const getCommissionsByStatus = useCallback((status: Commission['status']) => {
    return commissions.filter((commission: Commission) => commission.status === status);
  }, [commissions]);

  // Get commissions by period
  const getCommissionsByPeriod = useCallback((year: string, month?: string) => {
    return commissions.filter((commission: Commission) => {
      if (!commission.period) return false;
      const matchesYear = commission.period.year === year;
      const matchesMonth = !month || commission.period.month === month;
      return matchesYear && matchesMonth;
    });
  }, [commissions]);

  // Calculate total commission amount
  const getTotalCommissionAmount = useCallback((filteredCommissions?: Commission[]) => {
    const targetCommissions = filteredCommissions || commissions;
    return targetCommissions.reduce((total: number, commission: Commission) => {
      return total + (commission.commissionAmount || 0);
    }, 0);
  }, [commissions]);

  return {
    commissions,
    isLoading,
    error,
    refetch,
    createCommission: createCommissionMutation.mutate,
    updateCommission: updateCommissionMutation.mutate,
    deleteCommission: deleteCommissionMutation.mutate,
    isCreating: createCommissionMutation.isPending,
    isUpdating: updateCommissionMutation.isPending,
    isDeleting: deleteCommissionMutation.isPending,
    getCommissionById,
    getCommissionsByStylist,
    getCommissionsByStatus,
    getCommissionsByPeriod,
    getTotalCommissionAmount
  };
}