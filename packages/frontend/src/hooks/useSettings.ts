'use client';

import { useState, useEffect, useCallback } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

export interface Setting {
  id: string;
  name: string;
  value: any;
  type?: string;
  category?: string;
  description?: string;
  isPublic?: boolean;
  isSystem?: boolean;
  tenant?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateSettingData {
  name: string;
  value: any;
  type: Setting['type'];
  category: string;
  description?: string;
  isPublic?: boolean;
  isSystem?: boolean;
  tenant?: string;
}

export function useSettings() {
  const queryClient = useQueryClient();

  // Get all settings
  const {
    data: settings = [],
    isLoading,
    error,
    refetch
  } = useQuery({
    queryKey: ['settings'],
    queryFn: async () => {
      const response = await fetch('/api/settings');
      if (!response.ok) throw new Error('Failed to fetch settings');
      return response.json();
    }
  });

  // Create setting
  const createSettingMutation = useMutation({
    mutationFn: async (data: CreateSettingData) => {
      const response = await fetch('/api/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      if (!response.ok) throw new Error('Failed to create setting');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['settings'] });
    }
  });

  // Update setting
  const updateSettingMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Partial<Setting> }) => {
      const response = await fetch(`/api/settings/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      if (!response.ok) throw new Error('Failed to update setting');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['settings'] });
    }
  });

  // Delete setting
  const deleteSettingMutation = useMutation({
    mutationFn: async (id: string) => {
      const response = await fetch(`/api/settings/${id}`, {
        method: 'DELETE'
      });
      if (!response.ok) throw new Error('Failed to delete setting');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['settings'] });
    }
  });

  // Get setting by name
  const getSettingByName = useCallback((name: string): Setting | undefined => {
    return settings.find((setting: Setting) => setting.name === name);
  }, [settings]);

  // Get setting value by name
  const getSettingValue = useCallback((name: string, defaultValue?: any) => {
    const setting = getSettingByName(name);
    return setting ? setting.value : defaultValue;
  }, [getSettingByName]);

  // Get settings by category
  const getSettingsByCategory = useCallback((category: string): Setting[] => {
    return settings.filter((setting: Setting) => setting.category === category);
  }, [settings]);

  // Get public settings
  const getPublicSettings = useCallback((): Setting[] => {
    return settings.filter((setting: Setting) => setting.isPublic);
  }, [settings]);

  // Get system settings
  const getSystemSettings = useCallback((): Setting[] => {
    return settings.filter((setting: Setting) => setting.isSystem);
  }, [settings]);

  // Get categories
  const getCategories = useCallback((): string[] => {
    const categories = [...new Set(settings.map((setting: Setting) => setting.category).filter(Boolean))];
    return categories.sort();
  }, [settings]);

  // Update setting value
  const updateSettingValue = useCallback(async (name: string, value: any) => {
    const setting = getSettingByName(name);
    if (!setting) return false;

    try {
      await updateSettingMutation.mutateAsync({
        id: setting.id,
        data: { value }
      });
      return true;
    } catch (err) {
      console.error('Failed to update setting value:', err);
      return false;
    }
  }, [getSettingByName, updateSettingMutation]);

  // Bulk update settings
  const bulkUpdateSettings = useCallback(async (updates: Record<string, any>) => {
    try {
      const promises = Object.entries(updates).map(([name, value]) =>
        updateSettingValue(name, value)
      );
      await Promise.all(promises);
      return true;
    } catch (err) {
      console.error('Failed to bulk update settings:', err);
      return false;
    }
  }, [updateSettingValue]);

  // Get business settings
  const getBusinessSettings = useCallback(() => {
    return {
      businessName: getSettingValue('business_name', 'Modern Men Hair Salon'),
      businessAddress: getSettingValue('business_address', ''),
      businessPhone: getSettingValue('business_phone', ''),
      businessEmail: getSettingValue('business_email', ''),
      businessWebsite: getSettingValue('business_website', ''),
      businessLogo: getSettingValue('business_logo', ''),
      businessDescription: getSettingValue('business_description', ''),
      timezone: getSettingValue('timezone', 'America/New_York'),
      currency: getSettingValue('currency', 'USD'),
      taxRate: getSettingValue('tax_rate', 0),
      bookingSettings: {
        advanceBookingDays: getSettingValue('advance_booking_days', 30),
        cancellationHours: getSettingValue('cancellation_hours', 24),
        reminderHours: getSettingValue('reminder_hours', 24),
        bufferTime: getSettingValue('buffer_time', 15)
      },
      workingHours: getSettingValue('working_hours', {
        monday: { open: '09:00', close: '18:00' },
        tuesday: { open: '09:00', close: '18:00' },
        wednesday: { open: '09:00', close: '18:00' },
        thursday: { open: '09:00', close: '18:00' },
        friday: { open: '09:00', close: '18:00' },
        saturday: { open: '08:00', close: '16:00' },
        sunday: { open: null, close: null }
      })
    };
  }, [getSettingValue]);

  // Get notification settings
  const getNotificationSettings = useCallback(() => {
    return {
      emailNotifications: getSettingValue('email_notifications', true),
      smsNotifications: getSettingValue('sms_notifications', true),
      pushNotifications: getSettingValue('push_notifications', true),
      appointmentReminders: getSettingValue('appointment_reminders', true),
      marketingEmails: getSettingValue('marketing_emails', false),
      systemNotifications: getSettingValue('system_notifications', true)
    };
  }, [getSettingValue]);

  // Get payment settings
  const getPaymentSettings = useCallback(() => {
    return {
      stripePublishableKey: getSettingValue('stripe_publishable_key', ''),
      stripeSecretKey: getSettingValue('stripe_secret_key', ''),
      paypalClientId: getSettingValue('paypal_client_id', ''),
      paypalClientSecret: getSettingValue('paypal_client_secret', ''),
      acceptCash: getSettingValue('accept_cash', true),
      acceptCard: getSettingValue('accept_card', true),
      acceptPaypal: getSettingValue('accept_paypal', false),
      depositRequired: getSettingValue('deposit_required', false),
      depositPercentage: getSettingValue('deposit_percentage', 50)
    };
  }, [getSettingValue]);

  // Get analytics settings
  const getAnalyticsSettings = useCallback(() => {
    return {
      googleAnalyticsId: getSettingValue('google_analytics_id', ''),
      facebookPixelId: getSettingValue('facebook_pixel_id', ''),
      enableTracking: getSettingValue('enable_tracking', true),
      trackPageViews: getSettingValue('track_page_views', true),
      trackEvents: getSettingValue('track_events', true),
      trackConversions: getSettingValue('track_conversions', true)
    };
  }, [getSettingValue]);

  // Get integration settings
  const getIntegrationSettings = useCallback(() => {
    return {
      calendarIntegration: getSettingValue('calendar_integration', 'google'),
      emailProvider: getSettingValue('email_provider', 'smtp'),
      smsProvider: getSettingValue('sms_provider', 'twilio'),
      crmIntegration: getSettingValue('crm_integration', ''),
      posIntegration: getSettingValue('pos_integration', ''),
      loyaltyProgramIntegration: getSettingValue('loyalty_program_integration', '')
    };
  }, [getSettingValue]);

  // Export settings
  const exportSettings = useCallback(() => {
    return settings.map((setting: Setting) => ({
      name: setting.name,
      value: setting.value,
      type: setting.type,
      category: setting.category,
      description: setting.description
    }));
  }, [settings]);

  // Import settings
  const importSettings = useCallback(async (settingsData: CreateSettingData[]): Promise<boolean> => {
    try {
      const promises = settingsData.map((setting: CreateSettingData) =>
        createSettingMutation.mutateAsync(setting)
      );
      await Promise.all(promises);
      return true;
    } catch (err) {
      console.error('Failed to import settings:', err);
      return false;
    }
  }, [createSettingMutation]);

  return {
    settings,
    isLoading,
    error,
    refetch,
    createSetting: createSettingMutation.mutate,
    updateSetting: updateSettingMutation.mutate,
    deleteSetting: deleteSettingMutation.mutate,
    isCreating: createSettingMutation.isPending,
    isUpdating: updateSettingMutation.isPending,
    isDeleting: deleteSettingMutation.isPending,
    getSettingByName,
    getSettingValue,
    getSettingsByCategory,
    getPublicSettings,
    getSystemSettings,
    getCategories,
    updateSettingValue,
    bulkUpdateSettings,
    getBusinessSettings,
    getNotificationSettings,
    getPaymentSettings,
    getAnalyticsSettings,
    getIntegrationSettings,
    exportSettings,
    importSettings
  };
}