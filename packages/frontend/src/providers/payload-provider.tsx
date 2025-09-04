'use client'

import { createContext, useContext, useEffect, useState, ReactNode } from 'react'

interface PayloadContextType {
  isLoaded: boolean
  isAdmin: boolean
  user: any | null
  tenant: any | null
  collections: string[]
  setUser: (user: any) => void
  setTenant: (tenant: any) => void
  refreshData: () => Promise<void>
}

const PayloadContext = createContext<PayloadContextType>({
  isLoaded: false,
  isAdmin: false,
  user: null,
  tenant: null,
  collections: [],
  setUser: () => {},
  setTenant: () => {},
  refreshData: async () => {}
})

export function PayloadProvider({ children }: { children: ReactNode }) {
  const [isLoaded, setIsLoaded] = useState(false)
  const [user, setUser] = useState<any | null>(null)
  const [tenant, setTenant] = useState<any | null>(null)
  const [collections] = useState<string[]>([
    'users', 'tenants', 'media', 'settings', 'customers',
    'services', 'stylists', 'appointments', 'products',
    'locations', 'pages', 'commissions', 'inventory',
    'service-packages', 'wait-list', 'documentation',
    'documentation-templates', 'documentation-workflows', 'notifications'
  ])

  const isAdmin = user?.role === 'admin' || user?.role === 'manager'

  const refreshData = async () => {
    try {
      // Refresh user data if logged in
      if (user) {
        // This would typically call an API to refresh user data
        console.log('Refreshing payload data...')
      }
    } catch (error) {
      console.error('Failed to refresh payload data:', error)
    }
  }

  useEffect(() => {
    // Initialize payload connection
    const initPayload = async () => {
      try {
        // Check if user is already authenticated
        const response = await fetch('/api/auth/me')
        if (response.ok) {
          const userData = await response.json()
          setUser(userData.user)
          setTenant(userData.tenant)
        }
      } catch (error) {
        console.warn('Failed to initialize payload:', error)
      } finally {
        setIsLoaded(true)
      }
    }

    initPayload()
  }, [])

  return (
    <PayloadContext.Provider value={{
      isLoaded,
      isAdmin,
      user,
      tenant,
      collections,
      setUser,
      setTenant,
      refreshData
    }}>
      {children}
    </PayloadContext.Provider>
  )
}

export function usePayload() {
  const context = useContext(PayloadContext)
  if (!context) {
    throw new Error('usePayload must be used within a PayloadProvider')
  }
  return context
}
