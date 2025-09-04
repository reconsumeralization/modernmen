'use client'

import React, { useState, useEffect } from 'react'
import { Video } from 'lucide-react'

// Video branding system now re-enabled since collection-builder component is fixed
interface BrandingProviderProps {
  children: React.ReactNode
}

export function BrandingProvider({ children }: BrandingProviderProps) {
  const [videoLoaded, setVideoLoaded] = useState(false)
  const [videoError, setVideoError] = useState(false)

  useEffect(() => {
    // Apply comprehensive branding with video system
    if (typeof document !== 'undefined') {
      const root = document.documentElement

      // Core brand colors
      root.style.setProperty('--brand-primary', '#1a1a1a')
      root.style.setProperty('--brand-secondary', '#d4af37')
      root.style.setProperty('--brand-accent', '#8b7355')
      root.style.setProperty('--brand-text', '#333333')
      root.style.setProperty('--brand-background', '#ffffff')
      root.style.setProperty('--brand-font-family', 'Inter, sans-serif')

      // Extended branding variables
      root.style.setProperty('--brand-success', '#22c55e')
      root.style.setProperty('--brand-warning', '#f59e0b')
      root.style.setProperty('--brand-error', '#ef4444')
      root.style.setProperty('--brand-info', '#3b82f6')

      // Gradients and effects
      root.style.setProperty('--brand-gradient-primary', 'linear-gradient(135deg, #1a1a1a 0%, #d4af37 100%)')
      root.style.setProperty('--brand-gradient-secondary', 'linear-gradient(135deg, #d4af37 0%, #8b7355 100%)')
      root.style.setProperty('--brand-shadow-primary', '0 4px 14px 0 rgba(26, 26, 26, 0.25)')
      root.style.setProperty('--brand-shadow-secondary', '0 4px 14px 0 rgba(212, 175, 55, 0.25)')

      // Video branding system integration
      initializeVideoBranding()
    }
  }, [])

  const initializeVideoBranding = async () => {
    try {
      // Check if video branding is supported and available
      const videoSupported = 'mediaDevices' in navigator && 'getUserMedia' in navigator.mediaDevices

      if (videoSupported) {
        // Load video branding assets
        await loadVideoAssets()
        setVideoLoaded(true)
      } else {
        // Fallback to static branding
        console.log('Video branding not supported, using static branding')
      }
    } catch (error) {
      console.error('Video branding initialization failed:', error)
      setVideoError(true)
      // Fallback to static branding on error
    }
  }

  const loadVideoAssets = async () => {
    // Implementation for loading video branding assets
    // This would integrate with the collection-builder component for dynamic video content
    return Promise.resolve()
  }

  return (
    <>
      {/* Video branding overlay */}
      {videoLoaded && !videoError && (
        <div className="fixed inset-0 pointer-events-none z-0">
          <div className="absolute inset-0 bg-gradient-to-br from-black/20 via-transparent to-gold/20" />
          <div className="absolute top-4 right-4">
            <div className="flex items-center gap-2 bg-black/50 backdrop-blur-sm rounded-full px-3 py-1">
              <Video className="w-4 h-4 text-gold" />
              <span className="text-xs text-white">Video Branding Active</span>
            </div>
          </div>
        </div>
      )}

      {/* Main content */}
      <div className={`relative ${videoLoaded ? 'z-10' : ''}`}>
        {children}
      </div>
    </>
  )
}
