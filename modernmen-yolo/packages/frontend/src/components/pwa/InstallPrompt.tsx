'use client'

import React, { useState, useEffect } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import {
  Smartphone,
  Download,
  X,
  Star,
  Zap,
  Wifi,
  Bell,
  Clock,
  CheckCircle,
  Info
} from 'lucide-react'

interface BeforeInstallPromptEvent extends Event {
  readonly platforms: string[]
  readonly userChoice: Promise<{
    outcome: 'accepted' | 'dismissed'
    platform: string
  }>
  prompt(): Promise<void>
}

export function InstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null)
  const [showPrompt, setShowPrompt] = useState(false)
  const [isInstalled, setIsInstalled] = useState(false)
  const [installOutcome, setInstallOutcome] = useState<'accepted' | 'dismissed' | null>(null)

  useEffect(() => {
    // Check if already installed
    if (typeof window !== 'undefined') {
      const isStandalone = window.matchMedia('(display-mode: standalone)').matches
      const isInWebAppiOS = (window.navigator as any).standalone === true
      setIsInstalled(isStandalone || isInWebAppiOS)
    }

    // Listen for the beforeinstallprompt event
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault()
      setDeferredPrompt(e as BeforeInstallPromptEvent)

      // Show prompt after a delay to not be too intrusive
      setTimeout(() => {
        if (!isInstalled) {
          setShowPrompt(true)
        }
      }, 30000) // 30 seconds delay
    }

    // Listen for successful installation
    const handleAppInstalled = () => {
      setIsInstalled(true)
      setShowPrompt(false)
      setInstallOutcome('accepted')
      console.log('PWA was installed successfully')
    }

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt)
    window.addEventListener('appinstalled', handleAppInstalled)

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt)
      window.removeEventListener('appinstalled', handleAppInstalled)
    }
  }, [isInstalled])

  const handleInstallClick = async () => {
    if (!deferredPrompt) return

    // Show the install prompt
    deferredPrompt.prompt()

    // Wait for the user to respond to the prompt
    const { outcome } = await deferredPrompt.userChoice

    setInstallOutcome(outcome)
    setDeferredPrompt(null)
    setShowPrompt(false)

    console.log(`User response to install prompt: ${outcome}`)
  }

  const handleDismiss = () => {
    setShowPrompt(false)
    // Remember that user dismissed the prompt (could use localStorage)
    localStorage.setItem('pwa-install-dismissed', Date.now().toString())
  }

  // Don't show if already installed or recently dismissed
  if (isInstalled || installOutcome === 'accepted') {
    return null
  }

  // Check if recently dismissed (within 24 hours)
  const dismissedTime = localStorage.getItem('pwa-install-dismissed')
  if (dismissedTime && Date.now() - parseInt(dismissedTime) < 24 * 60 * 60 * 1000) {
    return null
  }

  // Don't show on non-mobile devices (optional)
  if (typeof window !== 'undefined' && !/Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
    return null
  }

  if (!showPrompt || !deferredPrompt) {
    return null
  }

  return (
    <div className="fixed bottom-4 left-4 right-4 z-50 md:left-auto md:right-4 md:max-w-sm">
      <Card className="shadow-lg border-2 border-primary/20 bg-gradient-to-r from-primary/5 to-primary/10">
        <CardContent className="p-4">
          <div className="flex items-start gap-3">
            <div className="flex-shrink-0">
              <div className="p-2 bg-primary/10 rounded-lg">
                <Smartphone className="h-6 w-6 text-primary" />
              </div>
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-semibold text-sm">Install Modern Men</h3>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleDismiss}
                  className="h-6 w-6 p-0"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>

              <p className="text-xs text-muted-foreground mb-3">
                Get the full experience with offline access, push notifications, and quick booking.
              </p>

              <div className="grid grid-cols-2 gap-2 mb-3">
                <div className="flex items-center gap-1 text-xs">
                  <Wifi className="h-3 w-3 text-green-500" />
                  <span>Offline</span>
                </div>
                <div className="flex items-center gap-1 text-xs">
                  <Bell className="h-3 w-3 text-blue-500" />
                  <span>Alerts</span>
                </div>
                <div className="flex items-center gap-1 text-xs">
                  <Zap className="h-3 w-3 text-yellow-500" />
                  <span>Fast</span>
                </div>
                <div className="flex items-center gap-1 text-xs">
                  <Star className="h-3 w-3 text-purple-500" />
                  <span>Rewards</span>
                </div>
              </div>

              <div className="flex gap-2">
                <Button
                  size="sm"
                  onClick={handleInstallClick}
                  className="flex-1 text-xs"
                >
                  <Download className="h-3 w-3 mr-1" />
                  Install App
                </Button>

                <Dialog>
                  <DialogTrigger asChild>
                    <Button variant="outline" size="sm" className="text-xs">
                      <Info className="h-3 w-3 mr-1" />
                      Learn More
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Why Install Modern Men?</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div className="grid grid-cols-1 gap-4">
                        <div className="flex items-start gap-3">
                          <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />
                          <div>
                            <h4 className="font-medium">Offline Access</h4>
                            <p className="text-sm text-muted-foreground">
                              Book appointments and view your dashboard even without internet.
                            </p>
                          </div>
                        </div>

                        <div className="flex items-start gap-3">
                          <Bell className="h-5 w-5 text-blue-500 mt-0.5" />
                          <div>
                            <h4 className="font-medium">Push Notifications</h4>
                            <p className="text-sm text-muted-foreground">
                              Get reminders for appointments and special offers.
                            </p>
                          </div>
                        </div>

                        <div className="flex items-start gap-3">
                          <Clock className="h-5 w-5 text-purple-500 mt-0.5" />
                          <div>
                            <h4 className="font-medium">Quick Access</h4>
                            <p className="text-sm text-muted-foreground">
                              One-tap access from your home screen for instant booking.
                            </p>
                          </div>
                        </div>

                        <div className="flex items-start gap-3">
                          <Star className="h-5 w-5 text-yellow-500 mt-0.5" />
                          <div>
                            <h4 className="font-medium">Better Experience</h4>
                            <p className="text-sm text-muted-foreground">
                              Native app-like performance and features.
                            </p>
                          </div>
                        </div>
                      </div>

                      <div className="bg-muted p-3 rounded-lg">
                        <p className="text-xs text-muted-foreground">
                          <strong>Note:</strong> The PWA works on both mobile and desktop.
                          You'll get the same great experience as our native app.
                        </p>
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

// Hook for managing PWA install state
export function usePWAInstall() {
  const [canInstall, setCanInstall] = useState(false)
  const [isInstalled, setIsInstalled] = useState(false)
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null)

  useEffect(() => {
    // Check if already installed
    if (typeof window !== 'undefined') {
      const isStandalone = window.matchMedia('(display-mode: standalone)').matches
      const isInWebAppiOS = (window.navigator as any).standalone === true
      setIsInstalled(isStandalone || isInWebAppiOS)
    }

    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault()
      setDeferredPrompt(e as BeforeInstallPromptEvent)
      setCanInstall(true)
    }

    const handleAppInstalled = () => {
      setIsInstalled(true)
      setCanInstall(false)
    }

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt)
    window.addEventListener('appinstalled', handleAppInstalled)

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt)
      window.removeEventListener('appinstalled', handleAppInstalled)
    }
  }, [])

  const install = async () => {
    if (!deferredPrompt) return false

    deferredPrompt.prompt()
    const { outcome } = await deferredPrompt.userChoice

    setDeferredPrompt(null)
    setCanInstall(false)

    return outcome === 'accepted'
  }

  return {
    canInstall,
    isInstalled,
    install
  }
}
