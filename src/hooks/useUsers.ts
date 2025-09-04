'use client';

import { useState, useEffect, useCallback } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

export interface User {
  id: string;
  name?: string;
  email: string;
  role: 'admin' | 'manager' | 'staff' | 'barber' | 'customer' | 'client';
  tenant?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateUserData {
  email: string;
  name?: string;
  role: User['role'];
  phone?: string;
  tenant?: string;
}

export function useUsers() {
  const queryClient = useQueryClient();

  // Get all users
  const {
    data: users = [],
    isLoading,
    error,
    refetch
  } = useQuery({
    queryKey: ['users'],
    queryFn: async () => {
      const response = await fetch('/api/users');
      if (!response.ok) throw new Error('Failed to fetch users');
      return response.json();
    }
  });

  // Create user
  const createUserMutation = useMutation({
    mutationFn: async (data: CreateUserData) => {
      const response = await fetch('/api/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      if (!response.ok) throw new Error('Failed to create user');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
    }
  });

  // Update user
  const updateUserMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Partial<User> }) => {
      const response = await fetch(`/api/users/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      if (!response.ok) throw new Error('Failed to update user');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
    }
  });

  // Delete user
  const deleteUserMutation = useMutation({
    mutationFn: async (id: string) => {
      const response = await fetch(`/api/users/${id}`, {
        method: 'DELETE'
      });
      if (!response.ok) throw new Error('Failed to delete user');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
    }
  });

  // Get user by ID
  const getUserById = useCallback((id: string) => {
    return users.find(user => user.id === id);
  }, [users]);

  // Get users by role
  const getUsersByRole = useCallback((role: User['role']) => {
    return users.filter(user => user.role === role);
  }, [users]);

  // Get active users
  const getActiveUsers = useCallback(() => {
    return users.filter(user => user.isActive);
  }, [users]);

  // Search users
  const searchUsers = useCallback((query: string) => {
    const lowercaseQuery = query.toLowerCase();
    return users.filter(user =>
      user.name?.toLowerCase().includes(lowercaseQuery) ||
      user.email.toLowerCase().includes(lowercaseQuery) ||
      user.role.toLowerCase().includes(lowercaseQuery)
    );
  }, [users]);

  // Get user statistics
  const getUserStats = useCallback(() => {
    const stats = {
      total: users.length,
      active: users.filter(u => u.isActive).length,
      byRole: {} as Record<User['role'], number>
    };

    users.forEach(user => {
      stats.byRole[user.role] = (stats.byRole[user.role] || 0) + 1;
    });

    return stats;
  }, [users]);

  // Get recent users
  const getRecentUsers = useCallback((limit: number = 10) => {
    return [...users]
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, limit);
  }, [users]);

  return {
    users,
    isLoading,
    error,
    refetch,
    createUser: createUserMutation.mutate,
    updateUser: updateUserMutation.mutate,
    deleteUser: deleteUserMutation.mutate,
    isCreating: createUserMutation.isPending,
    isUpdating: updateUserMutation.isPending,
    isDeleting: deleteUserMutation.isPending,
    getUserById,
    getUsersByRole,
    getActiveUsers,
    searchUsers,
    getUserStats,
    getRecentUsers
  };
}