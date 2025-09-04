'use client'

import React, { createContext, useContext, useState, useEffect } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'
import { useAuth } from '@/hooks/useAuth'
import { getNavigationForRole, filterNavigationByRole } from '@/config/navigation'
import type { UserRole, UserNavigation, BreadcrumbItem } from '@/types/navigation'

interface NavigationContextType {
  // Current user and role information
  userRole: UserRole
  isAuthenticated: boolean
  user: any

  // Navigation state
  navigation: UserNavigation
  activePath: string

  // Navigation actions
  navigateTo: (path: string) => void
  isActivePath: (path: string) => boolean
  canAccessPath: (path: string) => boolean

  // Breadcrumb management
  breadcrumbs: BreadcrumbItem[]
  setBreadcrumbs: (breadcrumbs: BreadcrumbItem[]) => void
  addBreadcrumb: (breadcrumb: BreadcrumbItem) => void

  // Mobile navigation
  isMobileMenuOpen: boolean
  toggleMobileMenu: () => void
  closeMobileMenu: () => void

  // Loading states
  isLoading: boolean
}

const NavigationContext = createContext<NavigationContextType | undefined>(undefined)

interface NavigationProviderProps {
  children: React.ReactNode
}

export function NavigationProvider({ children }: NavigationProviderProps) {
  const pathname = usePathname()
  const router = useRouter()
  const { data: session } = useSession()
  const { user, isAuthenticated, isLoading } = useAuth()

  // Navigation state
  const [navigation, setNavigation] = useState<UserNavigation>({ main: [], secondary: [], user: [], admin: [] })
  const [breadcrumbs, setBreadcrumbs] = useState<BreadcrumbItem[]>([])
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  // Determine user role
  const userRole: UserRole = user?.role || 'guest'

  // Update navigation when user role changes
  useEffect(() => {
    const roleNavigation = getNavigationForRole(userRole)
    const filteredNavigation = filterNavigationByRole(roleNavigation, userRole)
    setNavigation(filteredNavigation)
  }, [userRole, isAuthenticated])

  // Generate breadcrumbs based on current path
  useEffect(() => {
    const generateBreadcrumbs = () => {
      const pathSegments = pathname.split('/').filter(Boolean)
      const crumbs: BreadcrumbItem[] = [
        { name: 'Home', href: '/' }
      ]

      let currentPath = ''
      pathSegments.forEach((segment, index) => {
        currentPath += `/${segment}`
        const isLast = index === pathSegments.length - 1

        // Format segment name
        const name = segment
          .split('-')
          .map(word => word.charAt(0).toUpperCase() + word.slice(1))
          .join(' ')

        crumbs.push({
          name,
          href: isLast ? undefined : currentPath,
          current: isLast
        })
      })

      setBreadcrumbs(crumbs)
    }

    generateBreadcrumbs()
  }, [pathname])

  // Navigation actions
  const navigateTo = (path: string) => {
    router.push(path)
    closeMobileMenu()
  }

  const isActivePath = (path: string) => {
    if (path === '/') return pathname === '/'
    return pathname?.startsWith(path) || false
  }

  const canAccessPath = (path: string) => {
    // Check if path is accessible based on current navigation
    const allNavItems = [
      ...navigation.main,
      ...navigation.secondary || [],
      ...navigation.user || [],
      ...navigation.admin || []
    ]

    return allNavItems.some(item => item.href === path)
  }

  // Mobile menu actions
  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(prev => !prev)
  }

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false)
  }

  // Breadcrumb actions
  const addBreadcrumb = (breadcrumb: BreadcrumbItem) => {
    setBreadcrumbs(prev => [...prev, breadcrumb])
  }

  const value: NavigationContextType = {
    // User information
    userRole,
    isAuthenticated,
    user,

    // Navigation state
    navigation,
    activePath: pathname,

    // Navigation actions
    navigateTo,
    isActivePath,
    canAccessPath,

    // Breadcrumb management
    breadcrumbs,
    setBreadcrumbs,
    addBreadcrumb,

    // Mobile navigation
    isMobileMenuOpen,
    toggleMobileMenu,
    closeMobileMenu,

    // Loading states
    isLoading: isLoading || false
  }

  return (
    <NavigationContext.Provider value={value}>
      {children}
    </NavigationContext.Provider>
  )
}

export function useNavigation() {
  const context = useContext(NavigationContext)
  if (context === undefined) {
    throw new Error('useNavigation must be used within a NavigationProvider')
  }
  return context
}

// Higher-order component for navigation-aware components
export function withNavigation<P extends object>(
  Component: React.ComponentType<P>
) {
  return function NavigationComponent(props: P) {
    const navigationProps = useNavigation()
    return <Component {...props} {...navigationProps} />
  }
}

// Hook for checking role-based access
export function useRoleAccess(requiredRoles: UserRole[]) {
  const { userRole, isAuthenticated } = useNavigation()

  const hasAccess = () => {
    if (!isAuthenticated) return false
    if (requiredRoles.length === 0) return true
    return requiredRoles.includes(userRole)
  }

  const redirectToLogin = () => {
    // This would typically redirect to login or show access denied
    console.warn('Access denied - redirecting to login')
  }

  return {
    hasAccess: hasAccess(),
    userRole,
    isAuthenticated,
    redirectToLogin
  }
}
