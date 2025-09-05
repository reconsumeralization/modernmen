"use client"

import React from 'react'
import { MODERNMEN_BRANDING } from './branding-config'

// =============================================================================
// VIDEO & BRANDING INTEGRATION SYSTEM
// =============================================================================
// Manages Modern Men videos, logos, and branding throughout the application
// Unified with branding-config.ts for consistent theming

export interface VideoConfig {
  id: string
  name: string
  src: string
  poster?: string
  duration?: number
  type: 'background' | 'hero' | 'feature' | 'testimonial' | 'branding'
  autoplay?: boolean
  loop?: boolean
  muted?: boolean
  controls?: boolean
  preload?: 'none' | 'metadata' | 'auto'
  className?: string
  style?: React.CSSProperties
}

export interface LogoConfig {
  id: string
  name: string
  src: string
  alt: string
  type: 'primary' | 'secondary' | 'icon' | 'favicon' | 'admin'
  width?: number
  height?: number
  className?: string
}

export interface BrandingConfig {
  primaryColor: string
  secondaryColor: string
  accentColor: string
  textColor: string
  backgroundColor: string
  fontFamily: string
  logo: LogoConfig
  videos: VideoConfig[]
}

export class VideoBrandingManager {
  private static instance: VideoBrandingManager
  private videos = new Map<string, VideoConfig>()
  private logos = new Map<string, LogoConfig>()
  private brandingConfig: BrandingConfig

  constructor() {
    this.initializeBranding()
  }

  static getInstance(): VideoBrandingManager {
    if (!VideoBrandingManager.instance) {
      VideoBrandingManager.instance = new VideoBrandingManager()
    }
    return VideoBrandingManager.instance
  }

  // =============================================================================
  // INITIALIZATION
  // =============================================================================

  private initializeBranding(): void {
    // Initialize branding configuration using unified MODERNMEN_BRANDING
    this.brandingConfig = {
      primaryColor: MODERNMEN_BRANDING.colors.primary,
      secondaryColor: MODERNMEN_BRANDING.colors.secondary,
      accentColor: MODERNMEN_BRANDING.colors.accent,
      textColor: MODERNMEN_BRANDING.colors.text,
      backgroundColor: MODERNMEN_BRANDING.colors.background,
      fontFamily: MODERNMEN_BRANDING.fonts.primary,
      logo: {
        id: 'modern-men-logo',
        name: MODERNMEN_BRANDING.name,
        src: MODERNMEN_BRANDING.logo.primary,
        alt: MODERNMEN_BRANDING.name,
        type: 'primary',
        width: 200,
        height: 60
      },
      videos: []
    }

    // Initialize videos
    this.initializeVideos()

    // Initialize logos
    this.initializeLogos()
  }

  private initializeVideos(): void {
    // Modern Men brand videos using actual video files and unified branding
    const videoConfigs: VideoConfig[] = [
      {
        id: 'modern-men-fire',
        name: `${MODERNMEN_BRANDING.name} Fire Background`,
        src: '/video/ModernMenFire.mp4',
        poster: '/video/modern-men-poster.jpg',
        type: 'background',
        autoplay: true,
        loop: true,
        muted: true,
        preload: 'metadata',
        className: 'absolute inset-0 w-full h-full object-cover'
      },
      {
        id: 'modern-men-haze',
        name: `${MODERNMEN_BRANDING.name} Haze Hero`,
        src: '/video/ModernMenhaze.mp4',
        poster: '/video/modern-men-haze-poster.jpg',
        type: 'hero',
        autoplay: true,
        loop: true,
        muted: true,
        preload: 'metadata',
        className: 'w-full h-full object-cover rounded-lg'
      },
      {
        id: 'modern-men-lit-loop',
        name: `${MODERNMEN_BRANDING.name} Lit Loop Feature`,
        src: '/video/ModernMenLitLoop.mp4',
        poster: '/video/modern-men-lit-poster.jpg',
        type: 'feature',
        autoplay: true,
        loop: true,
        muted: true,
        controls: true,
        preload: 'metadata',
        className: 'w-full aspect-video rounded-lg shadow-lg'
      },
      {
        id: 'modern-men-wet',
        name: `${MODERNMEN_BRANDING.name} Wet Branding`,
        src: '/video/ModernMenWet.mp4',
        poster: '/video/modern-men-wet-poster.jpg',
        type: 'branding',
        autoplay: false,
        loop: false,
        muted: false,
        controls: true,
        preload: 'metadata',
        className: 'w-full h-64 object-cover rounded-lg'
      }
    ]

    // Add videos from MODERNMEN_BRANDING if they exist and aren't already included
    if (MODERNMEN_BRANDING.videos) {
      Object.entries(MODERNMEN_BRANDING.videos).forEach(([key, videoSrc]) => {
        const existingVideo = videoConfigs.find(v => v.src === videoSrc)
        if (!existingVideo) {
          videoConfigs.push({
            id: `modern-men-${key}`,
            name: `${MODERNMEN_BRANDING.name} ${key.charAt(0).toUpperCase() + key.slice(1)}`,
            src: videoSrc,
            type: key === 'hero' ? 'hero' : key === 'services' ? 'feature' : 'branding',
            autoplay: key === 'hero',
            loop: key === 'hero',
            muted: key !== 'testimonials',
            controls: key === 'testimonials',
            preload: 'metadata',
            className: key === 'hero' ? 'w-full h-full object-cover rounded-lg' : 'w-full aspect-video rounded-lg shadow-lg'
          })
        }
      })
    }

    videoConfigs.forEach(config => {
      this.registerVideo(config)
    })
  }

  private initializeLogos(): void {
    // Modern Men logos using unified branding configuration
    const logoConfigs: LogoConfig[] = [
      {
        id: 'modern-men-logo-primary',
        name: `${MODERNMEN_BRANDING.name} Logo Primary`,
        src: MODERNMEN_BRANDING.logo.primary,
        alt: MODERNMEN_BRANDING.name,
        type: 'primary',
        width: 200,
        height: 60,
        className: 'h-12 w-auto'
      },
      {
        id: 'modern-men-logo-dark',
        name: `${MODERNMEN_BRANDING.name} Logo Dark`,
        src: MODERNMEN_BRANDING.logo.white || MODERNMEN_BRANDING.logo.primary,
        alt: MODERNMEN_BRANDING.name,
        type: 'primary',
        width: 200,
        height: 60,
        className: 'h-12 w-auto'
      },
      {
        id: 'modern-men-icon',
        name: `${MODERNMEN_BRANDING.name} Icon`,
        src: MODERNMEN_BRANDING.logo.icon,
        alt: MODERNMEN_BRANDING.name,
        type: 'icon',
        width: 32,
        height: 32,
        className: 'h-8 w-8'
      },
      {
        id: 'modern-men-admin',
        name: `${MODERNMEN_BRANDING.name} Admin`,
        src: MODERNMEN_BRANDING.admin.brandLogo || MODERNMEN_BRANDING.logo.icon,
        alt: `${MODERNMEN_BRANDING.name} Admin`,
        type: 'admin',
        width: 24,
        height: 24,
        className: 'h-6 w-6'
      },
      {
        id: 'modern-men-favicon',
        name: `${MODERNMEN_BRANDING.name} Favicon`,
        src: MODERNMEN_BRANDING.logo.favicon,
        alt: MODERNMEN_BRANDING.name,
        type: 'favicon',
        width: 32,
        height: 32,
        className: 'h-8 w-8'
      }
    ]

    logoConfigs.forEach(config => {
      this.registerLogo(config)
    })
  }

  // =============================================================================
  // VIDEO MANAGEMENT
  // =============================================================================

  registerVideo(config: VideoConfig): void {
    this.videos.set(config.id, config)
  }

  getVideo(id: string): VideoConfig | null {
    return this.videos.get(id) || null
  }

  getVideosByType(type: VideoConfig['type']): VideoConfig[] {
    return Array.from(this.videos.values()).filter(video => video.type === type)
  }

  getAllVideos(): VideoConfig[] {
    return Array.from(this.videos.values())
  }

  // =============================================================================
  // LOGO MANAGEMENT
  // =============================================================================

  registerLogo(config: LogoConfig): void {
    this.logos.set(config.id, config)
  }

  getLogo(id: string): LogoConfig | null {
    return this.logos.get(id) || null
  }

  getLogosByType(type: LogoConfig['type']): LogoConfig[] {
    return Array.from(this.logos.values()).filter(logo => logo.type === type)
  }

  getPrimaryLogo(): LogoConfig | null {
    return this.getLogo('modern-men-logo-primary')
  }

  getAdminLogo(): LogoConfig | null {
    return this.getLogo('modern-men-admin')
  }

  // =============================================================================
  // BRANDING CONFIGURATION
  // =============================================================================

  getBrandingConfig(): BrandingConfig {
    return { ...this.brandingConfig }
  }

  updateBrandingConfig(updates: Partial<BrandingConfig>): void {
    this.brandingConfig = { ...this.brandingConfig, ...updates }
  }

  getCSSVariables(): Record<string, string> {
    return {
      '--brand-primary': this.brandingConfig.primaryColor,
      '--brand-secondary': this.brandingConfig.secondaryColor,
      '--brand-accent': this.brandingConfig.accentColor,
      '--brand-text': this.brandingConfig.textColor,
      '--brand-background': this.brandingConfig.backgroundColor,
      '--brand-font-family': this.brandingConfig.fontFamily
    }
  }

  // =============================================================================
  // VIDEO COMPONENT RENDERING
  // =============================================================================

  renderVideo(id: string, additionalProps: any = {}): React.ReactElement | null {
    const videoConfig = this.getVideo(id)
    if (!videoConfig) return null

    const videoProps = {
      src: videoConfig.src,
      poster: videoConfig.poster,
      autoPlay: videoConfig.autoplay,
      loop: videoConfig.loop,
      muted: videoConfig.muted,
      controls: videoConfig.controls,
      preload: videoConfig.preload,
      className: videoConfig.className,
      style: videoConfig.style,
      ...additionalProps
    }

    return React.createElement('video', videoProps)
  }

  renderVideoPlayer(config: Partial<VideoConfig>, additionalProps: any = {}): React.ReactElement {
    const defaultConfig: VideoConfig = {
      id: 'video-player',
      name: 'Video Player',
      src: '',
      type: 'feature',
      autoplay: false,
      loop: false,
      muted: false,
      controls: true,
      preload: 'metadata',
      className: 'w-full aspect-video rounded-lg shadow-lg',
      ...config
    }

    return this.renderVideo(defaultConfig.id, {
      ...defaultConfig,
      ...additionalProps
    }) || React.createElement('div', { className: 'w-full aspect-video bg-gray-200 rounded-lg flex items-center justify-center' },
      React.createElement('span', { className: 'text-gray-500' }, 'Video not available')
    )
  }

  // =============================================================================
  // LOGO COMPONENT RENDERING
  // =============================================================================

  renderLogo(id: string, additionalProps: any = {}): React.ReactElement | null {
    const logoConfig = this.getLogo(id)
    if (!logoConfig) return null

    const imgProps = {
      src: logoConfig.src,
      alt: logoConfig.alt,
      width: logoConfig.width,
      height: logoConfig.height,
      className: logoConfig.className,
      ...additionalProps
    }

    return React.createElement('img', imgProps)
  }

  renderPrimaryLogo(additionalProps: any = {}): React.ReactElement | null {
    return this.renderLogo('modern-men-logo-primary', additionalProps)
  }

  renderAdminLogo(additionalProps: any = {}): React.ReactElement | null {
    return this.renderLogo('modern-men-admin', additionalProps)
  }

  // =============================================================================
  // BACKGROUND VIDEO COMPONENTS
  // =============================================================================

  renderBackgroundVideo(videoId?: string): React.ReactElement {
    const videoConfig = videoId ? this.getVideo(videoId) : this.getVideosByType('background')[0]

    if (!videoConfig) {
      return React.createElement('div', {
        className: 'absolute inset-0 bg-gradient-to-br from-gray-900 to-gray-700'
      })
    }

    return React.createElement('div', { className: 'absolute inset-0 overflow-hidden' },
      this.renderVideo(videoConfig.id, {
        className: 'absolute inset-0 w-full h-full object-cover',
        style: { filter: 'brightness(0.4)' }
      })
    )
  }

  renderHeroVideo(videoId?: string): React.ReactElement {
    const videoConfig = videoId ? this.getVideo(videoId) : this.getVideosByType('hero')[0]

    if (!videoConfig) {
      return React.createElement('div', {
        className: 'w-full h-96 bg-gradient-to-r from-gray-800 to-gray-600 rounded-lg flex items-center justify-center'
      },
        React.createElement('span', { className: 'text-white text-xl' }, 'Modern Men Hair Salon')
      )
    }

    return React.createElement('div', { className: 'relative w-full h-96 overflow-hidden rounded-lg' },
      this.renderVideo(videoConfig.id),
      React.createElement('div', {
        className: 'absolute inset-0 bg-black bg-opacity-30 flex items-center justify-center'
      },
        React.createElement('div', { className: 'text-center text-white' },
          React.createElement('h1', { className: 'text-4xl font-bold mb-4' }, 'Modern Men Hair Salon'),
          React.createElement('p', { className: 'text-xl' }, 'Professional grooming for the modern gentleman')
        )
      )
    )
  }

  // =============================================================================
  // BRANDING HOOKS
  // =============================================================================

  applyBrandingToDocument(): void {
    if (typeof document !== 'undefined') {
      const root = document.documentElement

      // Apply CSS custom properties
      const cssVars = this.getCSSVariables()
      Object.entries(cssVars).forEach(([property, value]) => {
        root.style.setProperty(property, value)
      })

      // Update favicon
      const favicon = document.querySelector('link[rel="icon"]') as HTMLLinkElement
      if (favicon && this.brandingConfig.logo) {
        favicon.href = this.brandingConfig.logo.src
      }

      // Update page title with branding
      document.title = `Modern Men Hair Salon${document.title.includes('Modern Men') ? '' : ' - ' + document.title.split(' - ')[1] || ''}`
    }
  }

  // =============================================================================
  // VIDEO PRELOADING
  // =============================================================================

  preloadVideos(videoIds?: string[]): void {
    const videosToPreload = videoIds || Array.from(this.videos.keys())

    videosToPreload.forEach(videoId => {
      const videoConfig = this.getVideo(videoId)
      if (videoConfig) {
        const link = document.createElement('link')
        link.rel = 'preload'
        link.as = 'video'
        link.href = videoConfig.src
        if (videoConfig.poster) {
          const posterLink = document.createElement('link')
          posterLink.rel = 'preload'
          posterLink.as = 'image'
          posterLink.href = videoConfig.poster
          document.head.appendChild(posterLink)
        }
        document.head.appendChild(link)
      }
    })
  }

  // =============================================================================
  // UTILITY METHODS
  // =============================================================================

  getVideoDuration(id: string): Promise<number> {
    return new Promise((resolve, reject) => {
      const videoConfig = this.getVideo(id)
      if (!videoConfig) {
        reject(new Error('Video not found'))
        return
      }

      const video = document.createElement('video')
      video.preload = 'metadata'
      video.src = videoConfig.src

      video.onloadedmetadata = () => {
        resolve(video.duration)
      }

      video.onerror = () => {
        reject(new Error('Failed to load video metadata'))
      }
    })
  }

  validateVideoUrl(url: string): boolean {
    try {
      new URL(url)
      return url.match(/\.(mp4|webm|ogg)$/i) !== null
    } catch {
      return false
    }
  }

  validateLogoUrl(url: string): boolean {
    try {
      new URL(url)
      return url.match(/\.(svg|png|jpg|jpeg|gif|webp)$/i) !== null
    } catch {
      return false
    }
  }

  // =============================================================================
  // CLEANUP METHODS
  // =============================================================================

  clearCache(): void {
    this.videos.clear()
    this.logos.clear()
    this.initializeBranding()
  }

  dispose(): void {
    this.clearCache()
  }
}

// =============================================================================
// REACT HOOKS FOR VIDEO & BRANDING
// =============================================================================

export function useVideoBranding() {
  const manager = VideoBrandingManager.getInstance()

  React.useEffect(() => {
    // Apply branding on mount
    manager.applyBrandingToDocument()

    // Preload key videos
    manager.preloadVideos(['modern-men-fire', 'modern-men-haze'])

    return () => {
      // Cleanup on unmount if needed
    }
  }, [manager])

  return {
    // Video methods
    renderVideo: manager.renderVideo.bind(manager),
    renderVideoPlayer: manager.renderVideoPlayer.bind(manager),
    renderBackgroundVideo: manager.renderBackgroundVideo.bind(manager),
    renderHeroVideo: manager.renderHeroVideo.bind(manager),
    getVideo: manager.getVideo.bind(manager),
    getVideosByType: manager.getVideosByType.bind(manager),

    // Logo methods
    renderLogo: manager.renderLogo.bind(manager),
    renderPrimaryLogo: manager.renderPrimaryLogo.bind(manager),
    renderAdminLogo: manager.renderAdminLogo.bind(manager),
    getLogo: manager.getLogo.bind(manager),
    getPrimaryLogo: manager.getPrimaryLogo.bind(manager),

    // Branding methods
    getBrandingConfig: manager.getBrandingConfig.bind(manager),
    updateBrandingConfig: manager.updateBrandingConfig.bind(manager),
    getCSSVariables: manager.getCSSVariables.bind(manager),
    applyBrandingToDocument: manager.applyBrandingToDocument.bind(manager),

    // Utility methods
    getVideoDuration: manager.getVideoDuration.bind(manager),
    validateVideoUrl: manager.validateVideoUrl.bind(manager),
    validateLogoUrl: manager.validateLogoUrl.bind(manager)
  }
}

// =============================================================================
// BRANDING COMPONENTS
// =============================================================================

export function ModernMenLogo({ variant = 'primary', ...props }: { variant?: 'primary' | 'dark' | 'icon' } & any) {
  const manager = VideoBrandingManager.getInstance()

  const logoId = variant === 'primary' ? 'modern-men-logo-primary' :
                 variant === 'dark' ? 'modern-men-logo-dark' :
                 'modern-men-icon'

  return manager.renderLogo(logoId, props) || React.createElement('div', props, 'Modern Men')
}

export function BrandingVideo({ type = 'background', videoId, ...props }: {
  type?: VideoConfig['type']
  videoId?: string
} & any) {
  const manager = VideoBrandingManager.getInstance()

  if (type === 'background') {
    return manager.renderBackgroundVideo(videoId)
  }

  if (type === 'hero') {
    return manager.renderHeroVideo(videoId)
  }

  const videoConfig = videoId ? manager.getVideo(videoId) : manager.getVideosByType(type)[0]
  return manager.renderVideoPlayer(videoConfig, props)
}

export function VideoBackground({ children, videoId, overlay = true }: {
  children?: React.ReactNode
  videoId?: string
  overlay?: boolean
}) {
  const manager = VideoBrandingManager.getInstance()

  return React.createElement('div', { className: 'relative min-h-screen' },
    manager.renderBackgroundVideo(videoId),
    overlay && React.createElement('div', {
      className: 'absolute inset-0 bg-black bg-opacity-50'
    }),
    children && React.createElement('div', { className: 'relative z-10' }, children)
  )
}

// Export singleton instance
export const videoBrandingManager = VideoBrandingManager.getInstance()
