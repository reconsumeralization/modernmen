'use client';

import { useState, useEffect, useCallback } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

export interface WaitListEntry {
  id: string;
  customerId: string;
  customer?: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
  };
  serviceId: string;
  service?: {
    id: string;
    name: string;
    duration: number;
    price: number;
  };
  preferredStylist?: string;
  preferredStylistData?: {
    id: string;
    name: string;
  };
  preferredDate?: string;
  preferredTime?: string;
  notes?: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  status: 'waiting' | 'contacted' | 'scheduled' | 'cancelled' | 'expired';
  waitTimeDays?: number;
  estimatedWaitTime?: string;
  notificationMethod: 'email' | 'sms' | 'phone' | 'app';
  notificationsSent: number;
  lastContactDate?: string;
  expiryDate?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateWaitListEntryData {
  customerId: string;
  serviceId: string;
  preferredStylist?: string;
  preferredDate?: string;
  preferredTime?: string;
  notes?: string;
  priority?: WaitListEntry['priority'];
  notificationMethod?: WaitListEntry['notificationMethod'];
  expiryDate?: string;
}

export function useWaitList() {
  const queryClient = useQueryClient();

  // Get all waitlist entries
  const {
    data: waitList = [],
    isLoading,
    error,
    refetch
  } = useQuery({
    queryKey: ['waitlist'],
    queryFn: async () => {
      const response = await fetch('/api/waitlist');
      if (!response.ok) throw new Error('Failed to fetch waitlist');
      return response.json();
    }
  });

  // Create waitlist entry
  const createWaitListEntryMutation = useMutation({
    mutationFn: async (data: CreateWaitListEntryData) => {
      const response = await fetch('/api/waitlist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      if (!response.ok) throw new Error('Failed to create waitlist entry');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['waitlist'] });
    }
  });

  // Update waitlist entry
  const updateWaitListEntryMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Partial<WaitListEntry> }) => {
      const response = await fetch(`/api/waitlist/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      if (!response.ok) throw new Error('Failed to update waitlist entry');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['waitlist'] });
    }
  });

  // Delete waitlist entry
  const deleteWaitListEntryMutation = useMutation({
    mutationFn: async (id: string) => {
      const response = await fetch(`/api/waitlist/${id}`, {
        method: 'DELETE'
      });
      if (!response.ok) throw new Error('Failed to delete waitlist entry');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['waitlist'] });
    }
  });

  // Get waitlist entry by ID
  const getWaitListEntryById = useCallback((id: string) => {
    return waitList.find(entry => entry.id === id);
  }, [waitList]);

  // Get active waitlist entries
  const getActiveWaitList = useCallback(() => {
    return waitList.filter(entry =>
      entry.status === 'waiting' || entry.status === 'contacted'
    );
  }, [waitList]);

  // Get waitlist by status
  const getWaitListByStatus = useCallback((status: WaitListEntry['status']) => {
    return waitList.filter(entry => entry.status === status);
  }, [waitList]);

  // Get waitlist by service
  const getWaitListByService = useCallback((serviceId: string) => {
    return waitList.filter(entry => entry.serviceId === serviceId);
  }, [waitList]);

  // Get waitlist by stylist
  const getWaitListByStylist = useCallback((stylistId: string) => {
    return waitList.filter(entry => entry.preferredStylist === stylistId);
  }, [waitList]);

  // Get urgent waitlist entries
  const getUrgentWaitList = useCallback(() => {
    return waitList.filter(entry => entry.priority === 'urgent');
  }, [waitList]);

  // Get expiring waitlist entries
  const getExpiringWaitList = useCallback((days: number = 7) => {
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() + days);

    return waitList.filter(entry => {
      if (!entry.expiryDate) return false;
      return new Date(entry.expiryDate) <= cutoffDate;
    });
  }, [waitList]);

  // Get expired waitlist entries
  const getExpiredWaitList = useCallback(() => {
    const today = new Date();
    return waitList.filter(entry => {
      if (!entry.expiryDate) return false;
      return new Date(entry.expiryDate) < today;
    });
  }, [waitList]);

  // Calculate average wait time
  const calculateAverageWaitTime = useCallback(() => {
    const entriesWithWaitTime = waitList.filter(entry => entry.waitTimeDays);
    if (entriesWithWaitTime.length === 0) return 0;

    const totalWaitTime = entriesWithWaitTime.reduce((sum, entry) => sum + (entry.waitTimeDays || 0), 0);
    return totalWaitTime / entriesWithWaitTime.length;
  }, [waitList]);

  // Get waitlist statistics
  const getWaitListStats = useCallback(() => {
    const stats = {
      total: waitList.length,
      active: waitList.filter(e => e.status === 'waiting' || e.status === 'contacted').length,
      scheduled: waitList.filter(e => e.status === 'scheduled').length,
      cancelled: waitList.filter(e => e.status === 'cancelled').length,
      expired: waitList.filter(e => e.status === 'expired').length,
      urgent: waitList.filter(e => e.priority === 'urgent').length,
      averageWaitTime: calculateAverageWaitTime(),
      byPriority: {} as Record<WaitListEntry['priority'], number>,
      byService: {} as Record<string, number>,
      byStylist: {} as Record<string, number>,
      expiringSoon: getExpiringWaitList(7).length
    };

    waitList.forEach(entry => {
      stats.byPriority[entry.priority] = (stats.byPriority[entry.priority] || 0) + 1;
      stats.byService[entry.serviceId] = (stats.byService[entry.serviceId] || 0) + 1;
      if (entry.preferredStylist) {
        stats.byStylist[entry.preferredStylist] = (stats.byStylist[entry.preferredStylist] || 0) + 1;
      }
    });

    return stats;
  }, [waitList, calculateAverageWaitTime, getExpiringWaitList]);

  // Update waitlist status
  const updateWaitListStatus = useCallback(async (
    id: string,
    status: WaitListEntry['status'],
    notes?: string
  ) => {
    try {
      const updateData: Partial<WaitListEntry> = {
        status,
        lastContactDate: status === 'contacted' ? new Date().toISOString() : undefined
      };

      if (notes) {
        updateData.notes = notes;
      }

      await updateWaitListEntryMutation.mutateAsync({
        id,
        data: updateData
      });
      return true;
    } catch (err) {
      console.error('Failed to update waitlist status:', err);
      return false;
    }
  }, [updateWaitListEntryMutation]);

  // Convert to appointment
  const convertToAppointment = useCallback(async (
    waitListId: string,
    appointmentData: {
      date: string;
      time: string;
      stylistId: string;
    }
  ) => {
    try {
      const waitListEntry = getWaitListEntryById(waitListId);
      if (!waitListEntry) return false;

      // Create appointment
      const appointmentResponse = await fetch('/api/appointments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customerId: waitListEntry.customerId,
          serviceId: waitListEntry.serviceId,
          stylistId: appointmentData.stylistId,
          date: appointmentData.date,
          time: appointmentData.time,
          notes: `Converted from waitlist: ${waitListEntry.notes || ''}`
        })
      });

      if (!appointmentResponse.ok) throw new Error('Failed to create appointment');

      // Update waitlist status
      await updateWaitListStatus(waitListId, 'scheduled', 'Converted to appointment');

      return true;
    } catch (err) {
      console.error('Failed to convert waitlist to appointment:', err);
      return false;
    }
  }, [getWaitListEntryById, updateWaitListStatus]);

  // Send notification to waitlist customer
  const sendNotification = useCallback(async (waitListId: string, message?: string) => {
    try {
      const response = await fetch(`/api/waitlist/${waitListId}/notify`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message })
      });

      if (!response.ok) throw new Error('Failed to send notification');

      // Update notifications sent count
      const waitListEntry = getWaitListEntryById(waitListId);
      if (waitListEntry) {
        await updateWaitListEntryMutation.mutateAsync({
          id: waitListId,
          data: {
            notificationsSent: waitListEntry.notificationsSent + 1,
            lastContactDate: new Date().toISOString()
          }
        });
      }

      return true;
    } catch (err) {
      console.error('Failed to send notification:', err);
      return false;
    }
  }, [getWaitListEntryById, updateWaitListEntryMutation]);

  return {
    waitList,
    isLoading,
    error,
    refetch,
    createWaitListEntry: createWaitListEntryMutation.mutate,
    updateWaitListEntry: updateWaitListEntryMutation.mutate,
    deleteWaitListEntry: deleteWaitListEntryMutation.mutate,
    isCreating: createWaitListEntryMutation.isPending,
    isUpdating: updateWaitListEntryMutation.isPending,
    isDeleting: deleteWaitListEntryMutation.isPending,
    getWaitListEntryById,
    getActiveWaitList,
    getWaitListByStatus,
    getWaitListByService,
    getWaitListByStylist,
    getUrgentWaitList,
    getExpiringWaitList,
    getExpiredWaitList,
    calculateAverageWaitTime,
    getWaitListStats,
    updateWaitListStatus,
    convertToAppointment,
    sendNotification
  };
}
