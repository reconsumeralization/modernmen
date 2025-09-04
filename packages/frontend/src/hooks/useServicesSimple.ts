'use client';

import { useState, useEffect, useCallback } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

export interface Service {
  id: string;
  name: string;
  description?: string;
  price: number;
  duration: number;
  category?: string;
  image?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateServiceData {
  name: string;
  description?: string;
  price: number;
  duration: number;
  category?: string;
  image?: string;
}

export function useServices() {
  const queryClient = useQueryClient();

  // Get all services
  const {
    data: services = [],
    isLoading,
    error,
    refetch
  } = useQuery({
    queryKey: ['services'],
    queryFn: async () => {
      const response = await fetch('/api/services');
      if (!response.ok) throw new Error('Failed to fetch services');
      return response.json();
    }
  });

  // Create service
  const createServiceMutation = useMutation({
    mutationFn: async (data: CreateServiceData) => {
      const response = await fetch('/api/services', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      if (!response.ok) throw new Error('Failed to create service');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['services'] });
    }
  });

  // Update service
  const updateServiceMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Partial<Service> }) => {
      const response = await fetch(`/api/services/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      if (!response.ok) throw new Error('Failed to update service');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['services'] });
    }
  });

  // Delete service
  const deleteServiceMutation = useMutation({
    mutationFn: async (id: string) => {
      const response = await fetch(`/api/services/${id}`, {
        method: 'DELETE'
      });
      if (!response.ok) throw new Error('Failed to delete service');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['services'] });
    }
  });

  // Get service by ID
  const getServiceById = useCallback((id: string) => {
    return services.find(service => service.id === id);
  }, [services]);

  // Get services by category
  const getServicesByCategory = useCallback((category: string) => {
    return services.filter(service => service.category === category);
  }, [services]);

  // Search services
  const searchServices = useCallback((query: string) => {
    const lowercaseQuery = query.toLowerCase();
    return services.filter(service =>
      service.name.toLowerCase().includes(lowercaseQuery) ||
      (service.description && service.description.toLowerCase().includes(lowercaseQuery)) ||
      (service.category && service.category.toLowerCase().includes(lowercaseQuery))
    );
  }, [services]);

  // Get active services (services with valid price and duration)
  const getActiveServices = useCallback(() => {
    return services.filter(service =>
      service.price > 0 && service.duration > 0
    );
  }, [services]);

  return {
    services,
    isLoading,
    error,
    refetch,
    createService: createServiceMutation.mutate,
    updateService: updateServiceMutation.mutate,
    deleteService: deleteServiceMutation.mutate,
    isCreating: createServiceMutation.isPending,
    isUpdating: updateServiceMutation.isPending,
    isDeleting: deleteServiceMutation.isPending,
    getServiceById,
    getServicesByCategory,
    searchServices,
    getActiveServices
  };
}
