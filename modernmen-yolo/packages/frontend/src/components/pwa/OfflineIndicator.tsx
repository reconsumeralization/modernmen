'use client'

import React, { useState, useEffect } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  Wifi,
  WifiOff,
  AlertCircle,
  CheckCircle,
  RefreshCw,
  Smartphone,
  Clock,
  User,
  Scissors
} from 'lucide-react'

export function OfflineIndicator() {
  const [isOnline, setIsOnline] = useState(true)
  const [showIndicator, setShowIndicator] = useState(false)
  const [lastOnlineTime, setLastOnlineTime] = useState<Date | null>(null)

  useEffect(() => {
    // Check initial online status
    setIsOnline(navigator.onLine)

    const handleOnline = () => {
      setIsOnline(true)
      setShowIndicator(true)
      setLastOnlineTime(null)

      // Hide the "back online" indicator after 3 seconds
      setTimeout(() => setShowIndicator(false), 3000)
    }

    const handleOffline = () => {
      setIsOnline(false)
      setShowIndicator(true)
      setLastOnlineTime(new Date())
    }

    window.addEventListener('online', handleOnline)
    window.addEventListener('offline', handleOffline)

    return () => {
      window.removeEventListener('online', handleOnline)
      window.removeEventListener('offline', handleOffline)
    }
  }, [])

  const handleRetryConnection = () => {
    // Trigger a connection test
    fetch('/api/health', {
      method: 'HEAD',
      cache: 'no-cache'
    })
    .then(() => {
      console.log('Connection test successful')
    })
    .catch((error) => {
      console.log('Connection test failed:', error)
    })
  }

  // Don't show anything if online and not showing the "back online" message
  if (isOnline && !showIndicator) {
    return null
  }

  return (
    <div className="fixed top-4 left-4 right-4 z-50 md:left-auto md:right-4 md:max-w-sm">
      <Card className={`shadow-lg transition-all duration-300 ${
        isOnline
          ? 'border-green-200 bg-green-50'
          : 'border-orange-200 bg-orange-50'
      }`}>
        <CardContent className="p-3">
          <div className="flex items-center gap-3">
            <div className={`p-1.5 rounded-full ${
              isOnline ? 'bg-green-100' : 'bg-orange-100'
            }`}>
              {isOnline ? (
                <Wifi className="h-4 w-4 text-green-600" />
              ) : (
                <WifiOff className="h-4 w-4 text-orange-600" />
              )}
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <p className={`text-sm font-medium ${
                  isOnline ? 'text-green-800' : 'text-orange-800'
                }`}>
                  {isOnline ? 'Back Online' : 'Offline Mode'}
                </p>
                {isOnline && (
                  <CheckCircle className="h-3 w-3 text-green-600" />
                )}
              </div>

              <p className={`text-xs ${
                isOnline ? 'text-green-700' : 'text-orange-700'
              }`}>
                {isOnline
                  ? 'All features are now available'
                  : 'Some features may be limited'
                }
              </p>

              {!isOnline && (
                <div className="mt-2 space-y-1">
                  <div className="flex items-center gap-1 text-xs text-orange-700">
                    <CheckCircle className="h-3 w-3" />
                    <span>View appointments</span>
                  </div>
                  <div className="flex items-center gap-1 text-xs text-orange-700">
                    <CheckCircle className="h-3 w-3" />
                    <span>Browse services</span>
                  </div>
                  <div className="flex items-center gap-1 text-xs text-orange-700">
                    <AlertCircle className="h-3 w-3" />
                    <span>Book new appointments</span>
                  </div>
                  <div className="flex items-center gap-1 text-xs text-orange-700">
                    <AlertCircle className="h-3 w-3" />
                    <span>Real-time updates</span>
                  </div>
                </div>
              )}
            </div>

            <div className="flex flex-col gap-1">
              {!isOnline && (
                <Button
                  size="sm"
                  variant="outline"
                  onClick={handleRetryConnection}
                  className="h-6 px-2 text-xs"
                >
                  <RefreshCw className="h-3 w-3" />
                </Button>
              )}

              <Button
                size="sm"
                variant="ghost"
                onClick={() => setShowIndicator(false)}
                className="h-6 w-6 p-0"
              >
                ×
              </Button>
            </div>
          </div>

          {lastOnlineTime && !isOnline && (
            <div className="mt-2 pt-2 border-t border-orange-200">
              <p className="text-xs text-orange-600">
                Last online: {lastOnlineTime.toLocaleTimeString()}
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

// Hook for managing online/offline state
export function useOnlineStatus() {
  const [isOnline, setIsOnline] = useState(true)
  const [wasOffline, setWasOffline] = useState(false)

  useEffect(() => {
    setIsOnline(navigator.onLine)

    const handleOnline = () => {
      setIsOnline(true)
      setWasOffline(true)

      // Reset wasOffline after showing "back online" message
      setTimeout(() => setWasOffline(false), 5000)
    }

    const handleOffline = () => {
      setIsOnline(false)
      setWasOffline(false)
    }

    window.addEventListener('online', handleOnline)
    window.addEventListener('offline', handleOffline)

    return () => {
      window.removeEventListener('online', handleOnline)
      window.removeEventListener('offline', handleOffline)
    }
  }, [])

  return { isOnline, wasOffline }
}

// Cache status component
export function CacheStatus() {
  const [cacheSize, setCacheSize] = useState<string>('Calculating...')
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null)

  useEffect(() => {
    const checkCacheStatus = async () => {
      if ('caches' in window) {
        try {
          const cacheNames = await caches.keys()
          let totalSize = 0

          for (const cacheName of cacheNames) {
            const cache = await caches.open(cacheName)
            const keys = await cache.keys()

            for (const request of keys) {
              try {
                const response = await cache.match(request)
                if (response) {
                  const blob = await response.blob()
                  totalSize += blob.size
                }
              } catch (error) {
                // Skip problematic cache entries
              }
            }
          }

          const sizeInMB = (totalSize / (1024 * 1024)).toFixed(2)
          setCacheSize(`${sizeInMB} MB`)
          setLastUpdate(new Date())
        } catch (error) {
          setCacheSize('Unable to calculate')
        }
      } else {
        setCacheSize('Not supported')
      }
    }

    checkCacheStatus()

    // Check cache status every 30 seconds
    const interval = setInterval(checkCacheStatus, 30000)

    return () => clearInterval(interval)
  }, [])

  const clearCache = async () => {
    if ('caches' in window) {
      try {
        const cacheNames = await caches.keys()
        await Promise.all(
          cacheNames.map(cacheName => caches.delete(cacheName))
        )
        setCacheSize('0.00 MB')
        setLastUpdate(new Date())
        console.log('Cache cleared successfully')
      } catch (error) {
        console.error('Error clearing cache:', error)
      }
    }
  }

  return (
    <div className="flex items-center justify-between p-2 bg-muted/50 rounded text-xs">
      <div className="flex items-center gap-2">
        <Smartphone className="h-3 w-3" />
        <span>Cache: {cacheSize}</span>
        {lastUpdate && (
          <span className="text-muted-foreground">
            (Updated {lastUpdate.toLocaleTimeString()})
          </span>
        )}
      </div>
      <Button
        size="sm"
        variant="ghost"
        onClick={clearCache}
        className="h-6 px-2 text-xs"
      >
        Clear
      </Button>
    </div>
  )
}
