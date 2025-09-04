/**
 * DEFENSIVE PATTERNS FOR MODERNMEN CODEBASE
 * Based on OSS-Fuzz pdfplumber fix - Applied to React/Next.js context
 */

import { useCallback, useEffect, useState, useRef } from 'react'
import { useSearchParams } from 'next/navigation'

// =============================================================================
// SAFE COMPONENT WRAPPER - Prevents crashes from missing props/imports
// =============================================================================

export function withDefensiveProps<P extends Record<string, any>>(
  Component: React.ComponentType<P>,
  defaultProps: Partial<P> = {}
) {
  return function SafeComponent(props: P) {
    try {
      const safeProps = { ...defaultProps, ...props }

      // Validate critical props
      Object.entries(defaultProps).forEach(([key, defaultValue]) => {
        if (safeProps[key] === undefined || safeProps[key] === null) {
          safeProps[key] = defaultValue
        }
      })

      return <Component {...safeProps} />
    } catch (error) {
      console.error(`Component ${Component.name} crashed:`, error)

      // Return safe fallback UI
      return (
        <div className="p-4 border border-red-300 bg-red-50 rounded">
          <p className="text-red-700">
            Component temporarily unavailable. Please refresh the page.
          </p>
        </div>
      )
    }
  }
}

// =============================================================================
// SAFE ICON IMPORT - Handles missing icon imports gracefully
// =============================================================================

export function safeIconImport(iconName: string, fallbackIcon?: React.ComponentType<any>) {
  try {
    // Dynamic import with error handling
    const icons = {
      'BookOpen': () => import('lucide-react').then(m => m.BookOpen),
      'Settings': () => import('lucide-react').then(m => m.Settings),
      'AlertCircle': () => import('lucide-react').then(m => m.AlertCircle),
      'Info': () => import('lucide-react').then(m => m.Info),
      'Mail': () => import('lucide-react').then(m => m.Mail),
      'MessageCircle': () => import('lucide-react').then(m => m.MessageCircle),
      'Shield': () => import('lucide-react').then(m => m.Shield),
      'RotateCcw': () => import('lucide-react').then(m => m.RotateCcw),
      'PlayIcon': () => import('lucide-react').then(m => m.Play),
      'HistoryIcon': () => import('lucide-react').then(m => m.History),
      'CopyIcon': () => import('lucide-react').then(m => m.Copy),
      'DownloadIcon': () => import('lucide-react').then(m => m.Download),
      'CodeIcon': () => import('lucide-react').then(m => m.Code),
      'Globe': () => import('lucide-react').then(m => m.Globe),
      'Wifi': () => import('lucide-react').then(m => m.Wifi),
    }

    const iconLoader = icons[iconName]
    if (!iconLoader) {
      console.warn(`Icon "${iconName}" not found in safe import list`)
      return fallbackIcon || (() => <div>?</div>)
    }

    return iconLoader()
  } catch (error) {
    console.error(`Failed to load icon "${iconName}":`, error)
    return fallbackIcon || (() => <div>?</div>)
  }
}

// =============================================================================
// SAFE REACT HOOKS - Prevents invalid hook usage
// =============================================================================

export function useSafeSearchParams() {
  try {
    // Only use in proper React component context
    if (typeof window === 'undefined') {
      return [new URLSearchParams(), () => {}] as const
    }
    return useSearchParams()
  } catch (error) {
    console.error('useSearchParams called outside proper context:', error)
    return [new URLSearchParams(), () => {}] as const
  }
}

export function useConditionalEffect(
  effect: () => void | (() => void),
  deps: React.DependencyList,
  condition: boolean = true
) {
  const effectRef = useRef(effect)
  effectRef.current = effect

  useEffect(() => {
    if (condition) {
      return effectRef.current()
    }
  }, condition ? deps : []) // Only include deps when condition is true
}

// =============================================================================
// SAFE ASYNC OPERATIONS - Prevents unhandled promise rejections
// =============================================================================

export function safeAsyncOperation<T>(
  operation: () => Promise<T>,
  fallbackValue?: T,
  errorHandler?: (error: Error) => void
): Promise<T | undefined> {
  return operation().catch((error) => {
    console.error('Async operation failed:', error)

    if (errorHandler) {
      try {
        errorHandler(error)
      } catch (handlerError) {
        console.error('Error handler failed:', handlerError)
      }
    }

    return fallbackValue
  })
}

// =============================================================================
// SAFE COMPONENT LIFECYCLE - Prevents memory leaks and crashes
// =============================================================================

export function useSafeLifecycle() {
  const isMountedRef = useRef(true)
  const cleanupFunctionsRef = useRef<(() => void)[]>([])

  useEffect(() => {
    return () => {
      isMountedRef.current = false
      cleanupFunctionsRef.current.forEach(cleanup => {
        try {
          cleanup()
        } catch (error) {
          console.error('Cleanup function failed:', error)
        }
      })
      cleanupFunctionsRef.current = []
    }
  }, [])

  const safeCallback = useCallback((callback: () => void) => {
    if (isMountedRef.current) {
      try {
        callback()
      } catch (error) {
        console.error('Safe callback failed:', error)
      }
    }
  }, [])

  const addCleanup = useCallback((cleanup: () => void) => {
    cleanupFunctionsRef.current.push(cleanup)
  }, [])

  return { safeCallback, addCleanup, isMounted: isMountedRef.current }
}

// =============================================================================
// SAFE STATE MANAGEMENT - Prevents state corruption
// =============================================================================

export function useSafeState<T>(initialValue: T) {
  const [state, setState] = useState<T>(initialValue)
  const isMountedRef = useRef(true)

  useEffect(() => {
    return () => {
      isMountedRef.current = false
    }
  }, [])

  const safeSetState = useCallback((value: T | ((prev: T) => T)) => {
    if (isMountedRef.current) {
      try {
        setState(value)
      } catch (error) {
        console.error('Safe state update failed:', error)
      }
    }
  }, [])

  return [state, safeSetState] as const
}

// =============================================================================
// EXPORT ALL DEFENSIVE PATTERNS
// =============================================================================

export const DefensivePatterns = {
  withDefensiveProps,
  safeIconImport,
  useSafeSearchParams,
  useConditionalEffect,
  safeAsyncOperation,
  useSafeLifecycle,
  useSafeState,
}

export default DefensivePatterns</contents>
</xai:function_call">Defensive patterns created for ModernMen codebase
