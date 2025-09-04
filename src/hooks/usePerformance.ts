import { useEffect, useState, useCallback } from 'react'

// Performance monitoring hook
export function usePerformance() {
  const [metrics, setMetrics] = useState({
    fcp: 0, // First Contentful Paint
    lcp: 0, // Largest Contentful Paint
    fid: 0, // First Input Delay
    cls: 0, // Cumulative Layout Shift
    ttfb: 0, // Time to First Byte
  })

  const [isLoaded, setIsLoaded] = useState(false)

  useEffect(() => {
    // Only run on client side
    if (typeof window === 'undefined') return

    // Performance observer for LCP
    const lcpObserver = new PerformanceObserver((list) => {
      const entries = list.getEntries()
      const lastEntry = entries[entries.length - 1]

      setMetrics(prev => ({
        ...prev,
        lcp: lastEntry.startTime
      }))
    })

    // Performance observer for CLS
    const clsObserver = new PerformanceObserver((list) => {
      let clsValue = 0
      for (const entry of list.getEntries()) {
        if (!(entry as any).hadRecentInput) {
          clsValue += (entry as any).value
        }
      }

      setMetrics(prev => ({
        ...prev,
        cls: clsValue
      }))
    })

    // Performance observer for FID
    const fidObserver = new PerformanceObserver((list) => {
      const entries = list.getEntries()
      const lastEntry = entries[entries.length - 1]

      setMetrics(prev => ({
        ...prev,
        fid: (lastEntry as any).processingStart - lastEntry.startTime
      }))
    })

    try {
      lcpObserver.observe({ entryTypes: ['largest-contentful-paint'] })
      clsObserver.observe({ entryTypes: ['layout-shift'] })
      fidObserver.observe({ entryTypes: ['first-input'] })

      // Get navigation timing for TTFB
      const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming
      if (navigation) {
        setMetrics(prev => ({
          ...prev,
          ttfb: navigation.responseStart - navigation.requestStart
        }))
      }

      // Get paint timing for FCP
      const paintEntries = performance.getEntriesByType('paint')
      const fcpEntry = paintEntries.find(entry => entry.name === 'first-contentful-paint')
      if (fcpEntry) {
        setMetrics(prev => ({
          ...prev,
          fcp: fcpEntry.startTime
        }))
      }

    } catch (error) {
      console.warn('Performance monitoring not fully supported:', error)
    }

    setIsLoaded(true)

    return () => {
      try {
        lcpObserver.disconnect()
        clsObserver.disconnect()
        fidObserver.disconnect()
      } catch (error) {
        // Ignore cleanup errors
      }
    }
  }, [])

  const getScore = useCallback((metric: keyof typeof metrics, value: number) => {
    switch (metric) {
      case 'fcp':
      case 'lcp':
        if (value <= 1800) return { score: 'good', color: 'text-green-600' }
        if (value <= 3000) return { score: 'needs-improvement', color: 'text-yellow-600' }
        return { score: 'poor', color: 'text-red-600' }

      case 'fid':
        if (value <= 100) return { score: 'good', color: 'text-green-600' }
        if (value <= 300) return { score: 'needs-improvement', color: 'text-yellow-600' }
        return { score: 'poor', color: 'text-red-600' }

      case 'cls':
        if (value <= 0.1) return { score: 'good', color: 'text-green-600' }
        if (value <= 0.25) return { score: 'needs-improvement', color: 'text-yellow-600' }
        return { score: 'poor', color: 'text-red-600' }

      case 'ttfb':
        if (value <= 800) return { score: 'good', color: 'text-green-600' }
        if (value <= 1800) return { score: 'needs-improvement', color: 'text-yellow-600' }
        return { score: 'poor', color: 'text-red-600' }

      default:
        return { score: 'unknown', color: 'text-gray-600' }
    }
  }, [])

  return {
    metrics,
    isLoaded,
    getScore
  }
}

// Hook for lazy loading with intersection observer
export function useLazyLoading(options: {
  threshold?: number
  rootMargin?: string
  triggerOnce?: boolean
} = {}) {
  const { threshold = 0.1, rootMargin = '50px', triggerOnce = true } = options
  const [isIntersecting, setIsIntersecting] = useState(false)
  const [hasTriggered, setHasTriggered] = useState(false)
  const [element, setElement] = useState<Element | null>(null)

  const shouldLoad = triggerOnce ? !hasTriggered && isIntersecting : isIntersecting

  useEffect(() => {
    if (!element) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsIntersecting(entry.isIntersecting)

        if (entry.isIntersecting && triggerOnce && !hasTriggered) {
          setHasTriggered(true)
        }
      },
      { threshold, rootMargin }
    )

    observer.observe(element)

    return () => observer.disconnect()
  }, [element, threshold, rootMargin, triggerOnce, hasTriggered])

  return {
    ref: setElement,
    shouldLoad,
    isIntersecting
  }
}

// Hook for debouncing values
export function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value)

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value)
    }, delay)

    return () => {
      clearTimeout(handler)
    }
  }, [value, delay])

  return debouncedValue
}

// Hook for throttling function calls
export function useThrottle<T extends (...args: any[]) => any>(
  callback: T,
  delay: number
): T {
  const lastCallRef = useRef<number>(0)
  const timeoutRef = useRef<NodeJS.Timeout | null>(null)

  return useCallback(
    ((...args: Parameters<T>) => {
      const now = Date.now()

      if (now - lastCallRef.current >= delay) {
        lastCallRef.current = now
        return callback(...args)
      } else {
        if (timeoutRef.current) {
          clearTimeout(timeoutRef.current)
        }

        timeoutRef.current = setTimeout(() => {
          lastCallRef.current = Date.now()
          callback(...args)
        }, delay - (now - lastCallRef.current))
      }
    }) as T,
    [callback, delay]
  )
}

// Hook for measuring component render time
export function useRenderTime(componentName: string) {
  const startTimeRef = useRef<number>(0)

  useEffect(() => {
    startTimeRef.current = performance.now()
  })

  useEffect(() => {
    const endTime = performance.now()
    const renderTime = endTime - startTimeRef.current

    // Log render time for development
    if (process.env.NODE_ENV === 'development') {
      console.log(`${componentName} render time: ${renderTime.toFixed(2)}ms`)
    }
  })
}
