'use client';

import { useState, useEffect, useCallback } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

export interface Location {
  id: string;
  name: string;
  address?: string;
  phone?: string;
  tenant?: string;
  active?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateLocationData {
  name: string;
  address?: string;
  phone?: string;
  tenant?: string;
  active?: boolean;
}

export function useLocations() {
  const queryClient = useQueryClient();

  // Get all locations
  const {
    data: locations = [],
    isLoading,
    error,
    refetch
  } = useQuery({
    queryKey: ['locations'],
    queryFn: async () => {
      const response = await fetch('/api/locations');
      if (!response.ok) throw new Error('Failed to fetch locations');
      return response.json();
    }
  });

  // Create location
  const createLocationMutation = useMutation({
    mutationFn: async (data: CreateLocationData) => {
      const response = await fetch('/api/locations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      if (!response.ok) throw new Error('Failed to create location');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['locations'] });
    }
  });

  // Update location
  const updateLocationMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Partial<Location> }) => {
      const response = await fetch(`/api/locations/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      if (!response.ok) throw new Error('Failed to update location');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['locations'] });
    }
  });

  // Delete location
  const deleteLocationMutation = useMutation({
    mutationFn: async (id: string) => {
      const response = await fetch(`/api/locations/${id}`, {
        method: 'DELETE'
      });
      if (!response.ok) throw new Error('Failed to delete location');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['locations'] });
    }
  });

  // Get location by ID
  const getLocationById = useCallback((id: string) => {
    return locations.find(location => location.id === id);
  }, [locations]);

  // Get active locations
  const getActiveLocations = useCallback(() => {
    return locations.filter(location => location.isActive);
  }, [locations]);

  // Search locations
  const searchLocations = useCallback((query: string) => {
    const lowercaseQuery = query.toLowerCase();
    return locations.filter(location =>
      location.name.toLowerCase().includes(lowercaseQuery) ||
      location.address.city.toLowerCase().includes(lowercaseQuery) ||
      location.address.state.toLowerCase().includes(lowercaseQuery) ||
      location.address.zipCode.includes(query)
    );
  }, [locations]);

  // Get locations by city
  const getLocationsByCity = useCallback((city: string) => {
    return locations.filter(location =>
      location.address.city.toLowerCase() === city.toLowerCase()
    );
  }, [locations]);

  // Get locations by state
  const getLocationsByState = useCallback((state: string) => {
    return locations.filter(location =>
      location.address.state.toLowerCase() === state.toLowerCase()
    );
  }, [locations]);

  // Get locations that offer specific service
  const getLocationsByService = useCallback((serviceId: string) => {
    return locations.filter(location =>
      location.services.includes(serviceId)
    );
  }, [locations]);

  // Check if location is open at specific time
  const isLocationOpen = useCallback((locationId: string, date: string, time: string) => {
    const location = getLocationById(locationId);
    if (!location) return false;

    const dayOfWeek = new Date(date).toLocaleLowerCase().slice(0, 3) as keyof Location['businessHours'];
    const hours = location.businessHours[dayOfWeek];

    if (!hours || hours.closed) return false;

    const appointmentTime = new Date(`${date} ${time}`);
    const openTime = new Date(`${date} ${hours.open}`);
    const closeTime = new Date(`${date} ${hours.close}`);

    return appointmentTime >= openTime && appointmentTime <= closeTime;
  }, [getLocationById]);

  // Get next available time slots for a location
  const getAvailableTimeSlots = useCallback((
    locationId: string,
    date: string,
    duration: number = 60
  ) => {
    const location = getLocationById(locationId);
    if (!location) return [];

    const dayOfWeek = new Date(date).toLocaleLowerCase().slice(0, 3) as keyof Location['businessHours'];
    const hours = location.businessHours[dayOfWeek];

    if (!hours || hours.closed) return [];

    const slots = [];
    const openTime = new Date(`${date} ${hours.open}`);
    const closeTime = new Date(`${date} ${hours.close}`);

    let currentTime = new Date(openTime);

    while (currentTime.getTime() + (duration * 60000) <= closeTime.getTime()) {
      const timeString = currentTime.toTimeString().slice(0, 5); // HH:MM format
      slots.push(timeString);
      currentTime.setMinutes(currentTime.getMinutes() + 30); // 30-minute intervals
    }

    return slots;
  }, [getLocationById]);

  // Get cities
  const getCities = useCallback(() => {
    const cities = [...new Set(locations.map(location => location.address.city))];
    return cities.sort();
  }, [locations]);

  // Get states
  const getStates = useCallback(() => {
    const states = [...new Set(locations.map(location => location.address.state))];
    return states.sort();
  }, [locations]);

  // Get location statistics
  const getLocationStats = useCallback(() => {
    const stats = {
      total: locations.length,
      active: locations.filter(l => l.isActive).length,
      byCity: {} as Record<string, number>,
      byState: {} as Record<string, number>,
      totalCapacity: locations.reduce((sum, location) => sum + (location.capacity || 0), 0),
      averageCapacity: locations.length > 0
        ? locations.reduce((sum, location) => sum + (location.capacity || 0), 0) / locations.length
        : 0
    };

    locations.forEach(location => {
      stats.byCity[location.address.city] = (stats.byCity[location.address.city] || 0) + 1;
      stats.byState[location.address.state] = (stats.byState[location.address.state] || 0) + 1;
    });

    return stats;
  }, [locations]);

  // Format address
  const formatAddress = useCallback((location: Location) => {
    const { street, city, state, zipCode, country } = location.address;
    return `${street}, ${city}, ${state} ${zipCode}${country !== 'US' ? `, ${country}` : ''}`;
  }, []);

  // Get distance between two coordinates (simple implementation)
  const getDistance = useCallback((location1: Location, location2: Location) => {
    if (!location1.coordinates || !location2.coordinates) return null;

    const R = 6371; // Earth's radius in kilometers
    const dLat = (location2.coordinates.latitude - location1.coordinates.latitude) * Math.PI / 180;
    const dLon = (location2.coordinates.longitude - location1.coordinates.longitude) * Math.PI / 180;

    const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(location1.coordinates.latitude * Math.PI / 180) * Math.cos(location2.coordinates.latitude * Math.PI / 180) *
      Math.sin(dLon/2) * Math.sin(dLon/2);

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c; // Distance in kilometers
  }, []);

  return {
    locations,
    isLoading,
    error,
    refetch,
    createLocation: createLocationMutation.mutate,
    updateLocation: updateLocationMutation.mutate,
    deleteLocation: deleteLocationMutation.mutate,
    isCreating: createLocationMutation.isPending,
    isUpdating: updateLocationMutation.isPending,
    isDeleting: deleteLocationMutation.isPending,
    getLocationById,
    getActiveLocations,
    searchLocations,
    getLocationsByCity,
    getLocationsByState,
    getLocationsByService,
    isLocationOpen,
    getAvailableTimeSlots,
    getCities,
    getStates,
    getLocationStats,
    formatAddress,
    getDistance
  };
}
