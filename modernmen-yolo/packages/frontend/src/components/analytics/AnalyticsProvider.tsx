'use client'

import { useEffect } from 'react'
import { usePathname, useSearchParams } from 'next/navigation'
import { analyticsService } from '@/lib/analytics'

interface AnalyticsProviderProps {
  children: React.ReactNode
  trackingId?: string
  debug?: boolean
}

export function AnalyticsProvider({
  children,
  trackingId,
  debug = false
}: AnalyticsProviderProps) {
  const pathname = usePathname()
  const searchParams = useSearchParams()

  // Initialize analytics on mount
  useEffect(() => {
    if (trackingId && typeof window !== 'undefined') {
      analyticsService.initialize({
        trackingId,
        debug,
        testMode: process.env.NODE_ENV === 'development'
      })

      // Track initial page view
      analyticsService.trackPageView(pathname + (searchParams?.toString() ? `?${searchParams.toString()}` : ''))
    }
  }, [trackingId, debug, pathname, searchParams])

  // Track page changes
  useEffect(() => {
    if (analyticsService.isInitialized()) {
      const url = pathname + (searchParams?.toString() ? `?${searchParams.toString()}` : '')
      analyticsService.trackPageView(url)
    }
  }, [pathname, searchParams])

  // Track scroll depth
  useEffect(() => {
    if (typeof window === 'undefined') return

    let maxScrollDepth = 0
    const trackScrollDepth = () => {
      const scrollTop = window.scrollY
      const windowHeight = window.innerHeight
      const documentHeight = document.documentElement.scrollHeight
      const scrollPercentage = Math.round((scrollTop / (documentHeight - windowHeight)) * 100)

      if (scrollPercentage > maxScrollDepth && scrollPercentage <= 100) {
        maxScrollDepth = scrollPercentage

        // Track significant scroll milestones
        if ([25, 50, 75, 90, 100].includes(scrollPercentage)) {
          analyticsService.trackScrollDepth(scrollPercentage)
        }
      }
    }

    const throttledTrackScroll = throttle(trackScrollDepth, 1000)
    window.addEventListener('scroll', throttledTrackScroll)

    return () => window.removeEventListener('scroll', throttledTrackScroll)
  }, [])

  // Track time spent on page
  useEffect(() => {
    if (typeof window === 'undefined') return

    const startTime = Date.now()

    const trackTimeSpent = () => {
      const duration = (Date.now() - startTime) / 1000 // in seconds
      analyticsService.trackTimeSpent(duration, pathname)
    }

    // Track time spent when user leaves the page
    const handleBeforeUnload = () => trackTimeSpent()
    const handleVisibilityChange = () => {
      if (document.hidden) {
        trackTimeSpent()
      }
    }

    window.addEventListener('beforeunload', handleBeforeUnload)
    document.addEventListener('visibilitychange', handleVisibilityChange)

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload)
      document.removeEventListener('visibilitychange', handleVisibilityChange)
      trackTimeSpent() // Track final time spent
    }
  }, [pathname])

  return <>{children}</>
}

// Utility function for throttling
function throttle(func: Function, limit: number) {
  let inThrottle: boolean
  return function(this: any, ...args: any[]) {
    if (!inThrottle) {
      func.apply(this, args)
      inThrottle = true
      setTimeout(() => inThrottle = false, limit)
    }
  }
}
