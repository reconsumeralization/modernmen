'use client';

import { useState, useCallback, useEffect } from 'react';

export interface ApiState<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
  status: 'idle' | 'loading' | 'success' | 'error';
}

export interface ApiActions<T> {
  execute: (...args: any[]) => Promise<T | null>;
  reset: () => void;
  setData: (data: T | null) => void;
  setError: (error: string | null) => void;
}

export interface UseApiOptions<T> {
  immediate?: boolean;
  onSuccess?: (data: T) => void;
  onError?: (error: string) => void;
  initialData?: T | null;
}

export function useApi<T = any>(
  apiFunction: (...args: any[]) => Promise<T>,
  options: UseApiOptions<T> = {}
): ApiState<T> & ApiActions<T> {
  const { immediate = false, onSuccess, onError, initialData = null } = options;

  const [data, setData] = useState<T | null>(initialData);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

  const execute = useCallback(async (...args: any[]): Promise<T | null> => {
    setLoading(true);
    setError(null);
    setStatus('loading');

    try {
      const result = await apiFunction(...args);
      setData(result);
      setStatus('success');

      if (onSuccess) {
        onSuccess(result);
      }

      return result;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An error occurred';
      setError(errorMessage);
      setStatus('error');

      if (onError) {
        onError(errorMessage);
      }

      return null;
    } finally {
      setLoading(false);
    }
  }, [apiFunction, onSuccess, onError]);

  const reset = useCallback(() => {
    setData(initialData);
    setLoading(false);
    setError(null);
    setStatus('idle');
  }, [initialData]);

  // Execute immediately if requested
  useEffect(() => {
    if (immediate) {
      execute();
    }
  }, [immediate, execute]);

  return {
    data,
    loading,
    error,
    status,
    execute,
    reset,
    setData,
    setError
  };
}

// Specialized hooks for common API patterns

export function useCreateAppointment() {
  return useApi(async (appointmentData: any) => {
    const response = await fetch('/api/appointments', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(appointmentData)
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to create appointment');
    }

    return response.json();
  });
}

export function useUpdateAppointment() {
  return useApi(async (id: string, appointmentData: any) => {
    const response = await fetch(`/api/appointments/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(appointmentData)
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to update appointment');
    }

    return response.json();
  });
}

export function useDeleteAppointment() {
  return useApi(async (id: string) => {
    const response = await fetch(`/api/appointments/${id}`, {
      method: 'DELETE'
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to delete appointment');
    }

    return response.json();
  });
}

export function useCreateCustomer() {
  return useApi(async (customerData: any) => {
    const response = await fetch('/api/customers', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(customerData)
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to create customer');
    }

    return response.json();
  });
}

export function useUpdateCustomer() {
  return useApi(async (id: string, customerData: any) => {
    const response = await fetch(`/api/customers/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(customerData)
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to update customer');
    }

    return response.json();
  });
}

export function useCreateService() {
  return useApi(async (serviceData: any) => {
    const response = await fetch('/api/services', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(serviceData)
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to create service');
    }

    return response.json();
  });
}

export function useUpdateService() {
  return useApi(async (id: string, serviceData: any) => {
    const response = await fetch(`/api/services/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(serviceData)
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to update service');
    }

    return response.json();
  });
}

export function useCheckAvailability() {
  return useApi(async (stylistId: string, date: string, time: string, serviceId: string) => {
    const response = await fetch('/api/availability/check', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ stylistId, date, time, serviceId })
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to check availability');
    }

    const result = await response.json();
    return result.available;
  });
}

export function useSendNotification() {
  return useApi(async (notificationData: any) => {
    const response = await fetch('/api/notifications/send', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(notificationData)
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to send notification');
    }

    return response.json();
  });
}

export function useUploadFile() {
  return useApi(async (file: File, type: 'image' | 'document' = 'image') => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('type', type);

    const response = await fetch('/api/upload', {
      method: 'POST',
      body: formData
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to upload file');
    }

    return response.json();
  });
}

export function useAnalytics() {
  return useApi(async (dateRange?: { start: Date; end: Date }) => {
    const params = new URLSearchParams();
    if (dateRange) {
      params.append('startDate', dateRange.start.toISOString());
      params.append('endDate', dateRange.end.toISOString());
    }

    const response = await fetch(`/api/analytics?${params}`);

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to fetch analytics');
    }

    return response.json();
  });
}

// Generic API hook for any endpoint
export function useFetch(endpoint: string, options: RequestInit = {}) {
  return useApi(async () => {
    const response = await fetch(endpoint, options);

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || `Failed to fetch ${endpoint}`);
    }

    return response.json();
  });
}
