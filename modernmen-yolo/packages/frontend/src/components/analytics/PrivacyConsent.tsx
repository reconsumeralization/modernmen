'use client'

import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Cookie, Shield, Settings } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { getUserConsent, setUserConsent } from '@/config/analytics'

interface PrivacyConsentProps {
  onConsent?: (consent: boolean) => void
  className?: string
}

export function PrivacyConsent({ onConsent, className }: PrivacyConsentProps) {
  const [showBanner, setShowBanner] = useState(false)
  const [showDetails, setShowDetails] = useState(false)
  const [userChoice, setUserChoice] = useState<boolean | null>(null)

  useEffect(() => {
    // Check if user has already made a choice
    const existingConsent = getUserConsent()
    if (existingConsent !== null) {
      setUserChoice(existingConsent)
      onConsent?.(existingConsent)
    } else {
      // Show banner if no choice has been made
      setShowBanner(true)
    }
  }, [onConsent])

  const handleAcceptAll = () => {
    setUserChoice(true)
    setUserConsent(true)
    setShowBanner(false)
    onConsent?.(true)
  }

  const handleRejectAll = () => {
    setUserChoice(false)
    setUserConsent(false)
    setShowBanner(false)
    onConsent?.(false)
  }

  const handleSavePreferences = (analytics: boolean) => {
    setUserChoice(analytics)
    setUserConsent(analytics)
    setShowBanner(false)
    setShowDetails(false)
    onConsent?.(analytics)
  }

  if (!showBanner) return null

  return (
    <AnimatePresence>
      <motion.div
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 100, opacity: 0 }}
        transition={{ type: 'spring', damping: 25, stiffness: 120 }}
        className={`fixed bottom-0 left-0 right-0 z-50 p-4 ${className}`}
      >
        <Card className="max-w-4xl mx-auto shadow-2xl border-2">
          <CardContent className="p-0">
            {!showDetails ? (
              <div className="p-6">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-start gap-3 flex-1">
                    <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                      <Cookie className="w-5 h-5 text-primary" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold mb-2">
                        🍪 Your Privacy Matters
                      </h3>
                      <p className="text-muted-foreground text-sm mb-4">
                        We use cookies and analytics to improve your experience and help us understand how our services are used. Your privacy is important to us.
                      </p>
                      <div className="flex flex-wrap gap-2 mb-4">
                        <Badge variant="outline" className="text-xs">
                          Essential Cookies
                        </Badge>
                        <Badge variant="outline" className="text-xs">
                          Analytics
                        </Badge>
                        <Badge variant="outline" className="text-xs">
                          Performance
                        </Badge>
                      </div>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowBanner(false)}
                    className="flex-shrink-0"
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>

                <div className="flex flex-col sm:flex-row gap-3 mt-6">
                  <Button
                    onClick={handleAcceptAll}
                    className="flex-1"
                  >
                    Accept All Cookies
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => setShowDetails(true)}
                    className="flex-1"
                  >
                    <Settings className="w-4 h-4 mr-2" />
                    Manage Preferences
                  </Button>
                  <Button
                    variant="ghost"
                    onClick={handleRejectAll}
                    className="flex-shrink-0"
                  >
                    Reject All
                  </Button>
                </div>
              </div>
            ) : (
              <div className="p-6">
                <CardHeader className="p-0 mb-6">
                  <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center gap-2">
                      <Shield className="w-5 h-5" />
                      Cookie Preferences
                    </CardTitle>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setShowDetails(false)}
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                </CardHeader>

                <div className="space-y-6">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium">Essential Cookies</h4>
                        <p className="text-sm text-muted-foreground">
                          Required for the website to function properly
                        </p>
                      </div>
                      <Badge variant="secondary">Always Active</Badge>
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium">Analytics & Performance</h4>
                        <p className="text-sm text-muted-foreground">
                          Help us understand how visitors interact with our website
                        </p>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleSavePreferences(false)}
                        >
                          Disable
                        </Button>
                        <Button
                          size="sm"
                          onClick={() => handleSavePreferences(true)}
                        >
                          Enable
                        </Button>
                      </div>
                    </div>
                  </div>

                  <div className="bg-muted/50 p-4 rounded-lg">
                    <h5 className="font-medium mb-2">What We Track</h5>
                    <ul className="text-sm text-muted-foreground space-y-1">
                      <li>• Page views and user journey</li>
                      <li>• Booking funnel completion</li>
                      <li>• Service and barber preferences</li>
                      <li>• Performance and error monitoring</li>
                    </ul>
                  </div>

                  <div className="bg-muted/50 p-4 rounded-lg">
                    <h5 className="font-medium mb-2">Your Rights</h5>
                    <ul className="text-sm text-muted-foreground space-y-1">
                      <li>• Withdraw consent at any time</li>
                      <li>• Request data deletion</li>
                      <li>• Data portability</li>
                      <li>• No impact on service quality</li>
                    </ul>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>
    </AnimatePresence>
  )
}

// Hook for managing privacy consent
export function usePrivacyConsent() {
  const [consent, setConsent] = useState<boolean | null>(null)

  useEffect(() => {
    setConsent(getUserConsent())
  }, [])

  const updateConsent = (newConsent: boolean) => {
    setUserConsent(newConsent)
    setConsent(newConsent)
  }

  return {
    consent,
    updateConsent,
    hasMadeChoice: consent !== null
  }
}
