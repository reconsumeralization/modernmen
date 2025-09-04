'use client'

import { createContext, useContext, useEffect, useState, ReactNode } from 'react'
import { useSession } from 'next-auth/react'

export interface User {
  id: string
  name?: string
  email: string
  role: 'admin' | 'manager' | 'staff' | 'barber' | 'customer' | 'client'
  tenant?: string
  image?: string
}

interface AuthContextType {
  user: User | null
  isLoading: boolean
  isAuthenticated: boolean
  isAdmin: boolean
  isManager: boolean
  isStaff: boolean
  isCustomer: boolean
  hasRole: (roles: string[]) => boolean
  login: (email: string, password: string) => Promise<void>
  logout: () => Promise<void>
  refreshSession: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const { data: session, status } = useSession()
  const [user, setUser] = useState<User | null>(null)

  const isLoading = status === 'loading'
  const isAuthenticated = !!user

  // Role checks
  const isAdmin = user?.role === 'admin'
  const isManager = user?.role === 'manager' || isAdmin
  const isStaff = user?.role === 'staff' || user?.role === 'barber' || isManager
  const isCustomer = user?.role === 'customer' || user?.role === 'client'

  const hasRole = (roles: string[]) => {
    return user ? roles.includes(user.role) : false
  }

  // Sync session with user state
  useEffect(() => {
    if (session?.user) {
      setUser({
        id: session.user.id || '',
        name: session.user.name || undefined,
        email: session.user.email || '',
        role: (session.user as any).role || 'customer',
        tenant: (session.user as any).tenant || undefined,
        image: session.user.image || undefined
      })
    } else {
      setUser(null)
    }
  }, [session])

  const login = async (email: string, password: string) => {
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.message || 'Login failed')
      }

      const data = await response.json()
      setUser(data.user)

      // Trigger session refresh
      await refreshSession()
    } catch (error) {
      console.error('Login error:', error)
      throw error
    }
  }

  const logout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' })
      setUser(null)
    } catch (error) {
      console.error('Logout error:', error)
    }
  }

  const refreshSession = async () => {
    try {
      const response = await fetch('/api/auth/refresh')
      if (response.ok) {
        const data = await response.json()
        if (data.user) {
          setUser(data.user)
        }
      }
    } catch (error) {
      console.error('Session refresh error:', error)
    }
  }

  return (
    <AuthContext.Provider value={{
      user,
      isLoading,
      isAuthenticated,
      isAdmin,
      isManager,
      isStaff,
      isCustomer,
      hasRole,
      login,
      logout,
      refreshSession
    }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
