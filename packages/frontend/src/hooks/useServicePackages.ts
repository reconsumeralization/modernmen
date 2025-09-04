'use client';

import { useState, useEffect, useCallback } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

export interface ServicePackage {
  id: string;
  name: string;
  description: string;
  price: number;
  originalPrice?: number;
  discountPercentage?: number;
  services: string[]; // Service IDs included in package
  servicesData?: Array<{
    id: string;
    name: string;
    duration: number;
    price: number;
  }>;
  duration: number; // Total duration in minutes
  category: string;
  image?: string;
  isActive: boolean;
  featured: boolean;
  tags?: string[];
  validityDays?: number; // How many days the package is valid
  usageLimit?: number; // How many times it can be used
  bookingRestrictions?: {
    advanceBookingDays?: number;
    blackoutDates?: string[];
    availableDays?: string[]; // ['monday', 'tuesday', etc.]
  };
  createdAt: string;
  updatedAt: string;
}

export interface CreateServicePackageData {
  name: string;
  description: string;
  price: number;
  originalPrice?: number;
  discountPercentage?: number;
  services: string[];
  category: string;
  image?: string;
  tags?: string[];
  validityDays?: number;
  usageLimit?: number;
  bookingRestrictions?: ServicePackage['bookingRestrictions'];
}

export function useServicePackages() {
  const queryClient = useQueryClient();

  // Get all service packages
  const {
    data: servicePackages = [],
    isLoading,
    error,
    refetch
  } = useQuery({
    queryKey: ['servicePackages'],
    queryFn: async () => {
      const response = await fetch('/api/service-packages');
      if (!response.ok) throw new Error('Failed to fetch service packages');
      return response.json();
    }
  });

  // Create service package
  const createServicePackageMutation = useMutation({
    mutationFn: async (data: CreateServicePackageData) => {
      const response = await fetch('/api/service-packages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      if (!response.ok) throw new Error('Failed to create service package');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['servicePackages'] });
    }
  });

  // Update service package
  const updateServicePackageMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Partial<ServicePackage> }) => {
      const response = await fetch(`/api/service-packages/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      if (!response.ok) throw new Error('Failed to update service package');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['servicePackages'] });
    }
  });

  // Delete service package
  const deleteServicePackageMutation = useMutation({
    mutationFn: async (id: string) => {
      const response = await fetch(`/api/service-packages/${id}`, {
        method: 'DELETE'
      });
      if (!response.ok) throw new Error('Failed to delete service package');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['servicePackages'] });
    }
  });

  // Get service package by ID
  const getServicePackageById = useCallback((id: string) => {
    return servicePackages.find(pkg => pkg.id === id);
  }, [servicePackages]);

  // Get active service packages
  const getActiveServicePackages = useCallback(() => {
    return servicePackages.filter(pkg => pkg.isActive);
  }, [servicePackages]);

  // Get featured service packages
  const getFeaturedServicePackages = useCallback(() => {
    return servicePackages.filter(pkg => pkg.featured && pkg.isActive);
  }, [servicePackages]);

  // Get service packages by category
  const getServicePackagesByCategory = useCallback((category: string) => {
    return servicePackages.filter(pkg =>
      pkg.category.toLowerCase() === category.toLowerCase()
    );
  }, [servicePackages]);

  // Search service packages
  const searchServicePackages = useCallback((query: string) => {
    const lowercaseQuery = query.toLowerCase();
    return servicePackages.filter(pkg =>
      pkg.name.toLowerCase().includes(lowercaseQuery) ||
      pkg.description.toLowerCase().includes(lowercaseQuery) ||
      pkg.category.toLowerCase().includes(lowercaseQuery) ||
      pkg.tags?.some(tag => tag.toLowerCase().includes(lowercaseQuery))
    );
  }, [servicePackages]);

  // Get categories
  const getCategories = useCallback(() => {
    const categories = [...new Set(servicePackages.map(pkg => pkg.category))];
    return categories.sort();
  }, [servicePackages]);

  // Calculate savings for package
  const calculateSavings = useCallback((pkg: ServicePackage) => {
    if (!pkg.originalPrice) return 0;
    return pkg.originalPrice - pkg.price;
  }, []);

  // Calculate savings percentage
  const calculateSavingsPercentage = useCallback((pkg: ServicePackage) => {
    if (!pkg.originalPrice) return 0;
    return Math.round(((pkg.originalPrice - pkg.price) / pkg.originalPrice) * 100);
  }, []);

  // Get total individual service prices
  const getTotalIndividualPrice = useCallback((pkg: ServicePackage) => {
    return pkg.servicesData?.reduce((total, service) => total + service.price, 0) || 0;
  }, []);

  // Check if package is available for booking
  const isPackageAvailable = useCallback((pkg: ServicePackage, date: string) => {
    if (!pkg.isActive) return false;

    // Check booking restrictions
    if (pkg.bookingRestrictions) {
      const bookingDate = new Date(date);
      const dayOfWeek = bookingDate.toLocaleLowerCase().slice(0, 3);

      // Check available days
      if (pkg.bookingRestrictions.availableDays &&
          !pkg.bookingRestrictions.availableDays.includes(dayOfWeek)) {
        return false;
      }

      // Check blackout dates
      if (pkg.bookingRestrictions.blackoutDates?.includes(date)) {
        return false;
      }

      // Check advance booking days
      if (pkg.bookingRestrictions.advanceBookingDays) {
        const today = new Date();
        const daysDifference = Math.ceil((bookingDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
        if (daysDifference > pkg.bookingRestrictions.advanceBookingDays) {
          return false;
        }
      }
    }

    return true;
  }, []);

  // Get popular packages (placeholder - would need analytics)
  const getPopularPackages = useCallback((limit: number = 10) => {
    return [...servicePackages]
      .filter(pkg => pkg.isActive)
      .sort((a, b) => (b.discountPercentage || 0) - (a.discountPercentage || 0))
      .slice(0, limit);
  }, [servicePackages]);

  // Get packages expiring soon
  const getExpiringPackages = useCallback((days: number = 30) => {
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() + days);

    return servicePackages.filter(pkg => {
      if (!pkg.validityDays) return false;
      const expiryDate = new Date(pkg.createdAt);
      expiryDate.setDate(expiryDate.getDate() + pkg.validityDays);
      return expiryDate <= cutoffDate;
    });
  }, [servicePackages]);

  // Get package statistics
  const getPackageStats = useCallback(() => {
    const stats = {
      total: servicePackages.length,
      active: servicePackages.filter(p => p.isActive).length,
      featured: servicePackages.filter(p => p.featured).length,
      totalValue: servicePackages.reduce((sum, pkg) => sum + pkg.price, 0),
      averagePrice: servicePackages.length > 0
        ? servicePackages.reduce((sum, pkg) => sum + pkg.price, 0) / servicePackages.length
        : 0,
      totalSavings: servicePackages.reduce((sum, pkg) => sum + calculateSavings(pkg), 0),
      byCategory: {} as Record<string, number>,
      withDiscount: servicePackages.filter(p => p.discountPercentage && p.discountPercentage > 0).length
    };

    servicePackages.forEach(pkg => {
      stats.byCategory[pkg.category] = (stats.byCategory[pkg.category] || 0) + 1;
    });

    return stats;
  }, [servicePackages, calculateSavings]);

  return {
    servicePackages,
    isLoading,
    error,
    refetch,
    createServicePackage: createServicePackageMutation.mutate,
    updateServicePackage: updateServicePackageMutation.mutate,
    deleteServicePackage: deleteServicePackageMutation.mutate,
    isCreating: createServicePackageMutation.isPending,
    isUpdating: updateServicePackageMutation.isPending,
    isDeleting: deleteServicePackageMutation.isPending,
    getServicePackageById,
    getActiveServicePackages,
    getFeaturedServicePackages,
    getServicePackagesByCategory,
    searchServicePackages,
    getCategories,
    calculateSavings,
    calculateSavingsPercentage,
    getTotalIndividualPrice,
    isPackageAvailable,
    getPopularPackages,
    getExpiringPackages,
    getPackageStats
  };
}
