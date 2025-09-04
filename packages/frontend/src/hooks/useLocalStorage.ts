'use client';

import { useState, useEffect, useCallback } from 'react';

export function useLocalStorage<T>(
  key: string,
  initialValue: T
): [T, (value: T | ((prevValue: T) => T)) => void, () => void] {
  // Get value from localStorage or use initial value
  const [storedValue, setStoredValue] = useState<T>(() => {
    if (typeof window === 'undefined') {
      return initialValue;
    }

    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.error(`Error reading localStorage key "${key}":`, error);
      return initialValue;
    }
  });

  // Update localStorage and state
  const setValue = useCallback((value: T | ((prevValue: T) => T)) => {
    try {
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);

      if (typeof window !== 'undefined') {
        window.localStorage.setItem(key, JSON.stringify(valueToStore));
      }
    } catch (error) {
      console.error(`Error setting localStorage key "${key}":`, error);
    }
  }, [key, storedValue]);

  // Remove value from localStorage and reset to initial value
  const removeValue = useCallback(() => {
    try {
      setStoredValue(initialValue);
      if (typeof window !== 'undefined') {
        window.localStorage.removeItem(key);
      }
    } catch (error) {
      console.error(`Error removing localStorage key "${key}":`, error);
    }
  }, [key, initialValue]);

  return [storedValue, setValue, removeValue];
}

// Specialized hooks for common localStorage use cases

export function usePersistedState<T>(key: string, initialValue: T) {
  return useLocalStorage<T>(key, initialValue);
}

export function useUserPreferences() {
  const [preferences, setPreferences] = useLocalStorage('userPreferences', {
    theme: 'system' as 'light' | 'dark' | 'system',
    language: 'en',
    notifications: {
      email: true,
      sms: true,
      push: true
    },
    calendar: {
      defaultView: 'week' as 'day' | 'week' | 'month',
      startHour: 9,
      endHour: 18
    }
  });

  const updatePreference = useCallback((category: string, key: string, value: any) => {
    setPreferences(prev => ({
      ...prev,
      [category]: {
        ...prev[category as keyof typeof prev],
        [key]: value
      }
    }));
  }, [setPreferences]);

  return {
    preferences,
    setPreferences,
    updatePreference
  };
}

export function useRecentSearches(maxItems: number = 10) {
  const [searches, setSearches] = useLocalStorage<string[]>('recentSearches', []);

  const addSearch = useCallback((query: string) => {
    setSearches(prev => {
      const filtered = prev.filter(search => search !== query);
      return [query, ...filtered].slice(0, maxItems);
    });
  }, [setSearches, maxItems]);

  const clearSearches = useCallback(() => {
    setSearches([]);
  }, [setSearches]);

  const removeSearch = useCallback((query: string) => {
    setSearches(prev => prev.filter(search => search !== query));
  }, [setSearches]);

  return {
    searches,
    addSearch,
    clearSearches,
    removeSearch
  };
}

export function useFavoriteServices() {
  const [favorites, setFavorites] = useLocalStorage<string[]>('favoriteServices', []);

  const addFavorite = useCallback((serviceId: string) => {
    setFavorites(prev => {
      if (!prev.includes(serviceId)) {
        return [...prev, serviceId];
      }
      return prev;
    });
  }, [setFavorites]);

  const removeFavorite = useCallback((serviceId: string) => {
    setFavorites(prev => prev.filter(id => id !== serviceId));
  }, [setFavorites]);

  const toggleFavorite = useCallback((serviceId: string) => {
    setFavorites(prev => {
      if (prev.includes(serviceId)) {
        return prev.filter(id => id !== serviceId);
      } else {
        return [...prev, serviceId];
      }
    });
  }, [setFavorites]);

  const isFavorite = useCallback((serviceId: string) => {
    return favorites.includes(serviceId);
  }, [favorites]);

  const clearFavorites = useCallback(() => {
    setFavorites([]);
  }, [setFavorites]);

  return {
    favorites,
    addFavorite,
    removeFavorite,
    toggleFavorite,
    isFavorite,
    clearFavorites
  };
}

export function useAppointmentFilters() {
  const [filters, setFilters] = useLocalStorage('appointmentFilters', {
    status: [] as string[],
    stylist: [] as string[],
    service: [] as string[],
    dateRange: null as { start: string; end: string } | null,
    customer: '' as string
  });

  const updateFilter = useCallback((key: keyof typeof filters, value: any) => {
    setFilters(prev => ({
      ...prev,
      [key]: value
    }));
  }, [setFilters]);

  const clearFilters = useCallback(() => {
    setFilters({
      status: [],
      stylist: [],
      service: [],
      dateRange: null,
      customer: ''
    });
  }, [setFilters]);

  const hasActiveFilters = useCallback(() => {
    return (
      filters.status.length > 0 ||
      filters.stylist.length > 0 ||
      filters.service.length > 0 ||
      filters.dateRange !== null ||
      filters.customer.trim() !== ''
    );
  }, [filters]);

  return {
    filters,
    updateFilter,
    clearFilters,
    hasActiveFilters
  };
}

export function useDashboardLayout() {
  const [layout, setLayout] = useLocalStorage('dashboardLayout', {
    widgets: [
      'upcoming-appointments',
      'today-stats',
      'revenue-chart',
      'popular-services'
    ],
    gridSize: 'medium' as 'small' | 'medium' | 'large',
    collapsedSidebar: false
  });

  const updateWidgetOrder = useCallback((widgets: string[]) => {
    setLayout(prev => ({
      ...prev,
      widgets
    }));
  }, [setLayout]);

  const toggleSidebar = useCallback(() => {
    setLayout(prev => ({
      ...prev,
      collapsedSidebar: !prev.collapsedSidebar
    }));
  }, [setLayout]);

  const setGridSize = useCallback((gridSize: 'small' | 'medium' | 'large') => {
    setLayout(prev => ({
      ...prev,
      gridSize
    }));
  }, [setLayout]);

  return {
    layout,
    updateWidgetOrder,
    toggleSidebar,
    setGridSize
  };
}

export function useCache<T>(key: string, ttl: number = 3600000) { // 1 hour default TTL
  const [cache, setCache] = useLocalStorage<{
    data: T;
    timestamp: number;
    ttl: number;
  } | null>(`cache_${key}`, null);

  const setCachedData = useCallback((data: T) => {
    setCache({
      data,
      timestamp: Date.now(),
      ttl
    });
  }, [setCache, ttl]);

  const getCachedData = useCallback((): T | null => {
    if (!cache) return null;

    const isExpired = Date.now() - cache.timestamp > cache.ttl;
    if (isExpired) {
      setCache(null);
      return null;
    }

    return cache.data;
  }, [cache, setCache]);

  const clearCache = useCallback(() => {
    setCache(null);
  }, [setCache]);

  const isExpired = useCallback(() => {
    if (!cache) return true;
    return Date.now() - cache.timestamp > cache.ttl;
  }, [cache]);

  return {
    data: getCachedData(),
    setData: setCachedData,
    clearCache,
    isExpired
  };
}
