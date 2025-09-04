'use client'

import { createContext, useContext, useEffect, useState, ReactNode } from 'react'

export interface BusinessHours {
  monday?: { open: string; close: string; closed?: boolean }
  tuesday?: { open: string; close: string; closed?: boolean }
  wednesday?: { open: string; close: string; closed?: boolean }
  thursday?: { open: string; close: string; closed?: boolean }
  friday?: { open: string; close: string; closed?: boolean }
  saturday?: { open: string; close: string; closed?: boolean }
  sunday?: { open: string; close: string; closed?: boolean }
}

export interface BusinessSettings {
  id: string
  name: string
  address?: string
  phone?: string
  email?: string
  website?: string
  businessHours?: BusinessHours
  timezone: string
  currency: string
  taxRate: number
  bookingSettings?: {
    advanceBookingDays: number
    slotDuration: number
    bufferTime: number
    maxConcurrentBookings: number
    cancellationPolicy: string
  }
  notificationSettings?: {
    emailReminders: boolean
    smsReminders: boolean
    reminderTiming: number // hours before appointment
  }
  tenant?: string
  updatedAt?: string
}

interface BusinessContextType {
  settings: BusinessSettings | null
  isLoading: boolean
  updateSettings: (updates: Partial<BusinessSettings>) => Promise<void>
  refreshSettings: () => Promise<void>
}

const BusinessContext = createContext<BusinessContextType | undefined>(undefined)

const defaultSettings: BusinessSettings = {
  id: 'default',
  name: 'Modern Men Hair Salon',
  timezone: 'America/New_York',
  currency: 'USD',
  taxRate: 0,
  bookingSettings: {
    advanceBookingDays: 30,
    slotDuration: 60, // minutes
    bufferTime: 15, // minutes
    maxConcurrentBookings: 3,
    cancellationPolicy: '24 hours notice required'
  },
  notificationSettings: {
    emailReminders: true,
    smsReminders: false,
    reminderTiming: 24
  }
}

export function BusinessProvider({ children }: { children: ReactNode }) {
  const [settings, setSettings] = useState<BusinessSettings | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  const fetchSettings = async () => {
    try {
      const response = await fetch('/api/settings/business')
      if (response.ok) {
        const data = await response.json()
        setSettings({ ...defaultSettings, ...data })
      } else {
        // Use default settings if API fails
        setSettings(defaultSettings)
      }
    } catch (error) {
      console.warn('Failed to fetch business settings, using defaults:', error)
      setSettings(defaultSettings)
    } finally {
      setIsLoading(false)
    }
  }

  const updateSettings = async (updates: Partial<BusinessSettings>) => {
    try {
      const response = await fetch('/api/settings/business', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates)
      })

      if (response.ok) {
        const updatedData = await response.json()
        setSettings(prev => prev ? { ...prev, ...updatedData } : null)
      } else {
        throw new Error('Failed to update settings')
      }
    } catch (error) {
      console.error('Failed to update business settings:', error)
      throw error
    }
  }

  const refreshSettings = async () => {
    setIsLoading(true)
    await fetchSettings()
  }

  useEffect(() => {
    fetchSettings()
  }, [])

  return (
    <BusinessContext.Provider value={{
      settings,
      isLoading,
      updateSettings,
      refreshSettings
    }}>
      {children}
    </BusinessContext.Provider>
  )
}

export function useBusiness() {
  const context = useContext(BusinessContext)
  if (!context) {
    throw new Error('useBusiness must be used within a BusinessProvider')
  }
  return context
}
