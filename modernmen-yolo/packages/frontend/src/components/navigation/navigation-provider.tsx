"use client"

import * as React from "react"
import { usePathname, useRouter, useSearchParams } from "next/navigation"

interface NavigationState {
  currentPath: string
  previousPath: string | null
  isNavigating: boolean
  navigationHistory: string[]
  breadcrumbs: Array<{ label: string; href: string }>
}

interface NavigationContextType extends NavigationState {
  navigate: (path: string, options?: { replace?: boolean }) => void
  goBack: () => void
  goForward: () => void
  refresh: () => void
  setLoading: (loading: boolean) => void
  clearHistory: () => void
}

const NavigationContext = React.createContext<NavigationContextType | undefined>(undefined)

interface NavigationProviderProps {
  children: React.ReactNode
  maxHistorySize?: number
}

export function NavigationProvider({
  children,
  maxHistorySize = 10
}: NavigationProviderProps) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const [state, setState] = React.useState<NavigationState>({
    currentPath: pathname,
    previousPath: null,
    isNavigating: false,
    navigationHistory: [pathname],
    breadcrumbs: []
  })

  // Update state when pathname changes
  React.useEffect(() => {
    const currentPath = pathname + (searchParams.toString() ? `?${searchParams.toString()}` : "")

    setState(prevState => {
      const newHistory = [...prevState.navigationHistory]
      if (newHistory[newHistory.length - 1] !== currentPath) {
        newHistory.push(currentPath)
        if (newHistory.length > maxHistorySize) {
          newHistory.shift()
        }
      }

      return {
        currentPath,
        previousPath: prevState.currentPath,
        isNavigating: false,
        navigationHistory: newHistory,
        breadcrumbs: generateBreadcrumbs(currentPath)
      }
    })
  }, [pathname, searchParams, maxHistorySize])

  const navigate = React.useCallback((path: string, options?: { replace?: boolean }) => {
    setState(prev => ({ ...prev, isNavigating: true }))

    if (options?.replace) {
      router.replace(path)
    } else {
      router.push(path)
    }
  }, [router])

  const goBack = React.useCallback(() => {
    if (state.navigationHistory.length > 1) {
      const newHistory = [...state.navigationHistory]
      newHistory.pop()
      const previousPath = newHistory[newHistory.length - 1]

      setState(prev => ({
        ...prev,
        isNavigating: true,
        navigationHistory: newHistory
      }))

      router.back()
    }
  }, [state.navigationHistory, router])

  const goForward = React.useCallback(() => {
    // Note: Next.js doesn't have a built-in goForward method
    // This would need to be implemented with a custom history stack
    console.warn("goForward not implemented - requires custom history management")
  }, [])

  const refresh = React.useCallback(() => {
    setState(prev => ({ ...prev, isNavigating: true }))
    router.refresh()
  }, [router])

  const setLoading = React.useCallback((loading: boolean) => {
    setState(prev => ({ ...prev, isNavigating: loading }))
  }, [])

  const clearHistory = React.useCallback(() => {
    setState(prev => ({
      ...prev,
      navigationHistory: [prev.currentPath]
    }))
  }, [])

  const contextValue: NavigationContextType = {
    ...state,
    navigate,
    goBack,
    goForward,
    refresh,
    setLoading,
    clearHistory
  }

  return (
    <NavigationContext.Provider value={contextValue}>
      {children}
    </NavigationContext.Provider>
  )
}

// Generate breadcrumbs from path
function generateBreadcrumbs(path: string): Array<{ label: string; href: string }> {
  const segments = path.split('/').filter(Boolean)
  const breadcrumbs: Array<{ label: string; href: string }> = []

  let currentPath = ''

  // Add home
  breadcrumbs.push({ label: 'Home', href: '/' })

  for (const segment of segments) {
    currentPath += `/${segment}`

    // Skip query parameters
    const cleanPath = currentPath.split('?')[0]

    // Generate readable label
    const label = segment
      .split('-')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ')

    breadcrumbs.push({ label, href: cleanPath })
  }

  return breadcrumbs
}

// Hook to use navigation context
export function useNavigation() {
  const context = React.useContext(NavigationContext)
  if (context === undefined) {
    throw new Error('useNavigation must be used within a NavigationProvider')
  }
  return context
}

// Hook for programmatic navigation
export function useNavigate() {
  const { navigate, goBack, goForward, refresh } = useNavigation()

  return {
    push: navigate,
    replace: (path: string) => navigate(path, { replace: true }),
    back: goBack,
    forward: goForward,
    refresh
  }
}

// Hook for navigation state
export function useNavigationState() {
  const { currentPath, previousPath, isNavigating, navigationHistory, breadcrumbs } = useNavigation()

  return {
    currentPath,
    previousPath,
    isNavigating,
    navigationHistory,
    breadcrumbs,
    canGoBack: navigationHistory.length > 1
  }
}

// Hook for page transitions
export function usePageTransition() {
  const { isNavigating, setLoading } = useNavigation()
  const [isTransitioning, setIsTransitioning] = React.useState(false)

  React.useEffect(() => {
    if (isNavigating) {
      setIsTransitioning(true)
      const timer = setTimeout(() => setIsTransitioning(false), 300)
      return () => clearTimeout(timer)
    }
  }, [isNavigating])

  return {
    isTransitioning,
    startTransition: () => setLoading(true),
    endTransition: () => setLoading(false)
  }
}
