'use client';

import { useState, useEffect, useCallback } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

export interface Staff {
  id: string;
  name: string;
  email: string;
  phone?: string;
  bio?: string;
  profileImage?: string;
  user?: string;
  isActive?: boolean;
  rating?: number;
  reviewCount?: number;
  experience?: number;
  specialties?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateStaffData {
  name: string;
  email: string;
  phone?: string;
  bio?: string;
  profileImage?: string;
  user?: string;
  isActive?: boolean;
  rating?: number;
  reviewCount?: number;
  experience?: number;
  specialties?: string;
}

export function useStaff() {
  const queryClient = useQueryClient();

  // Get all staff
  const {
    data: staff = [],
    isLoading,
    error,
    refetch
  } = useQuery({
    queryKey: ['staff'],
    queryFn: async () => {
      const response = await fetch('/api/staff');
      if (!response.ok) throw new Error('Failed to fetch staff');
      return response.json();
    }
  });

  // Create staff
  const createStaffMutation = useMutation({
    mutationFn: async (data: CreateStaffData) => {
      const response = await fetch('/api/staff', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      if (!response.ok) throw new Error('Failed to create staff member');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['staff'] });
    }
  });

  // Update staff
  const updateStaffMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Partial<Staff> }) => {
      const response = await fetch(`/api/staff/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      if (!response.ok) throw new Error('Failed to update staff member');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['staff'] });
    }
  });

  // Delete staff
  const deleteStaffMutation = useMutation({
    mutationFn: async (id: string) => {
      const response = await fetch(`/api/staff/${id}`, {
        method: 'DELETE'
      });
      if (!response.ok) throw new Error('Failed to delete staff member');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['staff'] });
    }
  });

  // Get active staff
  const getActiveStaff = useCallback(() => {
    return staff.filter(member => member.isActive);
  }, [staff]);

  // Get staff by role
  const getStaffByRole = useCallback((role: Staff['role']) => {
    return staff.filter(member => member.role === role);
  }, [staff]);

  // Get staff by specialty
  const getStaffBySpecialty = useCallback((specialty: string) => {
    return staff.filter(member =>
      member.specialties.some(spec => spec.toLowerCase().includes(specialty.toLowerCase()))
    );
  }, [staff]);

  // Get top rated staff
  const getTopRatedStaff = useCallback((limit: number = 10) => {
    return [...staff]
      .filter(member => member.isActive)
      .sort((a, b) => b.rating - a.rating)
      .slice(0, limit);
  }, [staff]);

  // Get staff by ID
  const getStaffById = useCallback((id: string) => {
    return staff.find(member => member.id === id);
  }, [staff]);

  // Get available staff for a specific time
  const getAvailableStaff = useCallback((
    date: string,
    time: string,
    duration: number = 60
  ) => {
    const dayOfWeek = new Date(date).toLocaleLowerCase().slice(0, 3) as keyof Staff['workingHours'];

    return staff.filter(member => {
      if (!member.isActive) return false;

      const workingHours = member.workingHours[dayOfWeek];
      if (!workingHours) return false;

      const appointmentStart = new Date(`${date} ${time}`);
      const appointmentEnd = new Date(appointmentStart.getTime() + duration * 60000);

      const workStart = new Date(`${date} ${workingHours.start}`);
      const workEnd = new Date(`${date} ${workingHours.end}`);

      return appointmentStart >= workStart && appointmentEnd <= workEnd;
    });
  }, [staff]);

  // Check if staff member is available at specific time
  const isStaffAvailable = useCallback((
    staffId: string,
    date: string,
    time: string,
    duration: number = 60
  ) => {
    const member = getStaffById(staffId);
    if (!member) return false;

    const availableStaff = getAvailableStaff(date, time, duration);
    return availableStaff.some(staff => staff.id === staffId);
  }, [getStaffById, getAvailableStaff]);

  // Get staff schedule for a specific day
  const getStaffSchedule = useCallback((staffId: string, date: string) => {
    const member = getStaffById(staffId);
    if (!member) return null;

    const dayOfWeek = new Date(date).toLocaleLowerCase().slice(0, 3) as keyof Staff['workingHours'];
    return member.workingHours[dayOfWeek] || null;
  }, [getStaffById]);

  // Update staff rating
  const updateStaffRating = useCallback(async (
    staffId: string,
    newRating: number,
    newReviewCount?: number
  ) => {
    const member = getStaffById(staffId);
    if (!member) return false;

    try {
      const currentRating = member.rating;
      const currentCount = member.reviewCount;
      const newCount = newReviewCount || currentCount + 1;

      // Calculate new average rating
      const updatedRating = ((currentRating * currentCount) + newRating) / newCount;

      await updateStaffMutation.mutateAsync({
        id: staffId,
        data: {
          rating: updatedRating,
          reviewCount: newCount
        }
      });
      return true;
    } catch (err) {
      console.error('Failed to update staff rating:', err);
      return false;
    }
  }, [getStaffById, updateStaffMutation]);

  // Get staff specialties
  const getAllSpecialties = useCallback(() => {
    const allSpecialties = staff.flatMap(member => member.specialties);
    return [...new Set(allSpecialties)].sort();
  }, [staff]);

  // Search staff
  const searchStaff = useCallback((query: string) => {
    const lowercaseQuery = query.toLowerCase();
    return staff.filter(member =>
      member.name.toLowerCase().includes(lowercaseQuery) ||
      member.email.toLowerCase().includes(lowercaseQuery) ||
      member.specialties.some(spec => spec.toLowerCase().includes(lowercaseQuery))
    );
  }, [staff]);

  return {
    staff,
    isLoading,
    error,
    refetch,
    createStaff: createStaffMutation.mutate,
    updateStaff: updateStaffMutation.mutate,
    deleteStaff: deleteStaffMutation.mutate,
    isCreating: createStaffMutation.isPending,
    isUpdating: updateStaffMutation.isPending,
    isDeleting: deleteStaffMutation.isPending,
    getActiveStaff,
    getStaffByRole,
    getStaffBySpecialty,
    getTopRatedStaff,
    getStaffById,
    getAvailableStaff,
    isStaffAvailable,
    getStaffSchedule,
    updateStaffRating,
    getAllSpecialties,
    searchStaff
  };
}
