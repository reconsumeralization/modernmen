'use client'

import React, { useEffect, useState } from 'react'
import { InstallPrompt, usePWAInstall } from './InstallPrompt'
import { OfflineIndicator, CacheStatus } from './OfflineIndicator'
import { useOnlineStatus } from './OfflineIndicator'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from '@/components/ui/dialog'
import {
  Smartphone,
  Download,
  Wifi,
  WifiOff,
  Settings,
  Info,
  Zap,
  Shield,
  RefreshCw
} from 'lucide-react'

interface PWAManagerProps {
  children: React.ReactNode
}

export function PWAManager({ children }: PWAManagerProps) {
  const { canInstall, isInstalled, install } = usePWAInstall()
  const { isOnline } = useOnlineStatus()
  const [showUpdateDialog, setShowUpdateDialog] = useState(false)

  useEffect(() => {
    // Listen for service worker update events
    const handleUpdateAvailable = (event: CustomEvent) => {
      setShowUpdateDialog(true)
    }

    window.addEventListener('sw-update-available', handleUpdateAvailable as EventListener)

    return () => {
      window.removeEventListener('sw-update-available', handleUpdateAvailable as EventListener)
    }
  }, [])

  useEffect(() => {
    // Register service worker on component mount
    if ('serviceWorker' in navigator && typeof window !== 'undefined') {
      navigator.serviceWorker
        .register('/sw.js')
        .then((registration) => {
          console.log('PWA: Service Worker registered successfully', registration)

          // Handle service worker updates
          registration.addEventListener('updatefound', () => {
            const newWorker = registration.installing
            if (newWorker) {
              newWorker.addEventListener('statechange', () => {
                if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                  // New content is available
                  console.log('PWA: New content available')
                  // Could show update notification here
                }
              })
            }
          })
        })
        .catch((error) => {
          console.error('PWA: Service Worker registration failed', error)
        })
    }
  }, [])

  const handleInstall = async () => {
    const success = await install()
    if (success) {
      console.log('PWA: Installation successful')
    } else {
      console.log('PWA: Installation cancelled or failed')
    }
  }

  const checkPWASupport = () => {
    const features = {
      serviceWorker: 'serviceWorker' in navigator,
      pushManager: 'PushManager' in window,
      notification: 'Notification' in window,
      backgroundSync: 'serviceWorker' in navigator && 'sync' in (window as any).ServiceWorkerRegistration?.prototype,
      backgroundFetch: 'serviceWorker' in navigator && 'backgroundFetch' in (window as any).ServiceWorkerRegistration?.prototype,
      periodicSync: 'serviceWorker' in navigator && 'periodicSync' in (window as any).ServiceWorkerRegistration?.prototype,
      persistentStorage: 'storage' in navigator && 'persist' in navigator.storage,
      webAppManifest: 'manifest' in document.createElement('link'),
      standalone: window.matchMedia('(display-mode: standalone)').matches,
      fullscreen: 'fullscreenEnabled' in document || 'webkitFullscreenEnabled' in document,
    }

    return features
  }

  return (
    <>
      {children}

      {/* PWA Install Prompt */}
      <InstallPrompt />

      {/* Offline Indicator */}
      <OfflineIndicator />

      {/* PWA Status Widget (for development/debugging) */}
      {process.env.NODE_ENV === 'development' && (
        <div className="fixed bottom-4 right-4 z-40">
          <Dialog>
            <DialogTrigger asChild>
              <Button
                size="sm"
                variant="outline"
                className="rounded-full h-10 w-10 p-0 shadow-lg"
              >
                <Smartphone className="h-4 w-4" />
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  <Smartphone className="h-5 w-5" />
                  PWA Status
                </DialogTitle>
              </DialogHeader>

              <div className="space-y-4">
                {/* Installation Status */}
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm">Installation</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Status</span>
                      <Badge variant={isInstalled ? "default" : "secondary"}>
                        {isInstalled ? "Installed" : "Not Installed"}
                      </Badge>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-sm">Can Install</span>
                      <Badge variant={canInstall ? "default" : "secondary"}>
                        {canInstall ? "Yes" : "No"}
                      </Badge>
                    </div>

                    {canInstall && !isInstalled && (
                      <Button onClick={handleInstall} className="w-full">
                        <Download className="h-4 w-4 mr-2" />
                        Install PWA
                      </Button>
                    )}
                  </CardContent>
                </Card>

                {/* Connection Status */}
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm">Connection</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Online Status</span>
                      <div className="flex items-center gap-2">
                        {isOnline ? (
                          <Wifi className="h-4 w-4 text-green-500" />
                        ) : (
                          <WifiOff className="h-4 w-4 text-orange-500" />
                        )}
                        <Badge variant={isOnline ? "default" : "secondary"}>
                          {isOnline ? "Online" : "Offline"}
                        </Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Cache Status */}
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm">Cache</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CacheStatus />
                  </CardContent>
                </Card>

                {/* PWA Features Support */}
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm">Feature Support</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      {Object.entries(checkPWASupport()).map(([feature, supported]) => (
                        <div key={feature} className="flex items-center justify-between">
                          <span className="capitalize">{feature.replace(/([A-Z])/g, ' $1').trim()}</span>
                          <Badge variant={supported ? "default" : "secondary"} className="text-xs">
                            {supported ? "✓" : "✗"}
                          </Badge>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Quick Actions */}
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => window.location.reload()}
                    className="flex-1"
                  >
                    <RefreshCw className="h-4 w-4 mr-2" />
                    Reload
                  </Button>

                  <Dialog>
                    <DialogTrigger asChild>
                      <Button variant="outline" size="sm" className="flex-1">
                        <Info className="h-4 w-4 mr-2" />
                        Info
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>PWA Information</DialogTitle>
                      </DialogHeader>
                      <div className="space-y-3 text-sm">
                        <p>
                          <strong>Progressive Web App (PWA)</strong> features enhance your experience
                          with offline access, push notifications, and app-like functionality.
                        </p>

                        <div className="space-y-2">
                          <h4 className="font-medium">Current Features:</h4>
                          <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                            <li>Offline page caching</li>
                            <li>Background sync for offline actions</li>
                            <li>Push notification support</li>
                            <li>Installable web app</li>
                            <li>Service worker for performance</li>
                          </ul>
                        </div>

                        <div className="space-y-2">
                          <h4 className="font-medium">Benefits:</h4>
                          <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                            <li>Faster loading times</li>
                            <li>Works offline</li>
                            <li>Push notifications</li>
                            <li>Native app experience</li>
                            <li>No app store required</li>
                          </ul>
                        </div>
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      )}

      {/* Update Confirmation Dialog */}
      <Dialog open={showUpdateDialog} onOpenChange={setShowUpdateDialog}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <RefreshCw className="h-5 w-5" />
              Update Available
            </DialogTitle>
          </DialogHeader>

          <p className="text-sm text-muted-foreground">
            A new version of the app is available. Would you like to reload to get the latest features?
          </p>

          <DialogFooter className="flex gap-2">
            <Button
              variant="outline"
              onClick={() => setShowUpdateDialog(false)}
            >
              Later
            </Button>
            <Button
              onClick={() => {
                setShowUpdateDialog(false)
                window.location.reload()
              }}
            >
              Reload Now
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}

// Hook for PWA functionality
export function usePWA() {
  const { canInstall, isInstalled, install } = usePWAInstall()
  const { isOnline, wasOffline } = useOnlineStatus()

  const updateServiceWorker = () => {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.ready.then((registration) => {
        registration.update()
      })
    }
  }

  const checkForUpdates = async () => {
    if ('serviceWorker' in navigator) {
      const registration = await navigator.serviceWorker.ready
      await registration.update()

      // Check if there's a new service worker waiting
      if (registration.waiting) {
        // New content is available, notify user
        setShowUpdateDialog(true)
      }
    }
  }

  return {
    canInstall,
    isInstalled,
    isOnline,
    wasOffline,
    install,
    updateServiceWorker,
    checkForUpdates
  }
}
