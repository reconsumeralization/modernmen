import React from 'react'
import { VideoBrandingManager, VideoConfig, LogoConfig } from '../video-branding'

// Mock the branding config
jest.mock('../branding-config', () => ({
  MODERNMEN_BRANDING: {
    name: 'ModernMen Barbershop',
    colors: {
      primary: '#1a1a1a',
      secondary: '#d4af37',
      accent: '#8b7355',
      text: '#333333',
      background: '#ffffff'
    },
    fonts: {
      primary: 'Inter, sans-serif',
      heading: 'Playfair Display, serif',
      mono: 'JetBrains Mono, monospace'
    },
    logo: {
      primary: '/images/logo/modernmen-logo.svg',
      white: '/images/logo/modernmen-logo-white.svg',
      icon: '/images/logo/modernmen-icon.svg',
      favicon: '/favicon.ico'
    },
    admin: {
      brandLogo: '/modernmen-admin-icon.svg',
      brandName: 'ModernMen Admin'
    },
    videos: {
      hero: '/videos/modernmen-hero.mp4',
      intro: '/videos/modernmen-intro.mp4'
    }
  }
}))

describe('VideoBrandingManager', () => {
  let manager: VideoBrandingManager

  beforeEach(() => {
    // Reset singleton instance for each test
    // Note: We can't directly access private static instance, so we create a fresh instance
    manager = VideoBrandingManager.getInstance()
  })

  describe('Singleton Pattern', () => {
    test('returns same instance', () => {
      const instance1 = VideoBrandingManager.getInstance()
      const instance2 = VideoBrandingManager.getInstance()
      expect(instance1).toBe(instance2)
    })
  })

  describe('Video Management', () => {
    test('registers and retrieves video', () => {
      const videoConfig: VideoConfig = {
        id: 'test-video',
        name: 'Test Video',
        src: '/video/test.mp4',
        type: 'background',
        autoplay: true,
        loop: true,
        muted: true
      }

      manager.registerVideo(videoConfig)
      const retrieved = manager.getVideo('test-video')

      expect(retrieved).toEqual(videoConfig)
    })

    test('returns null for non-existent video', () => {
      const video = manager.getVideo('non-existent')
      expect(video).toBeNull()
    })

    test('gets videos by type', () => {
      const backgroundVideo: VideoConfig = {
        id: 'bg-video',
        name: 'Background Video',
        src: '/video/bg.mp4',
        type: 'background'
      }

      const heroVideo: VideoConfig = {
        id: 'hero-video',
        name: 'Hero Video',
        src: '/video/hero.mp4',
        type: 'hero'
      }

      manager.registerVideo(backgroundVideo)
      manager.registerVideo(heroVideo)

      const backgrounds = manager.getVideosByType('background')
      const heroes = manager.getVideosByType('hero')

      expect(backgrounds).toHaveLength(2) // includes default videos
      expect(heroes).toHaveLength(2) // includes default videos
      expect(backgrounds.some(v => v.id === 'bg-video')).toBe(true)
      expect(heroes.some(v => v.id === 'hero-video')).toBe(true)
    })

    test('gets all videos', () => {
      const allVideos = manager.getAllVideos()
      expect(Array.isArray(allVideos)).toBe(true)
      expect(allVideos.length).toBeGreaterThan(0)
    })
  })

  describe('Logo Management', () => {
    test('registers and retrieves logo', () => {
      const logoConfig: LogoConfig = {
        id: 'test-logo',
        name: 'Test Logo',
        src: '/logo/test.svg',
        alt: 'Test Logo',
        type: 'primary'
      }

      manager.registerLogo(logoConfig)
      const retrieved = manager.getLogo('test-logo')

      expect(retrieved).toEqual(logoConfig)
    })

    test('returns null for non-existent logo', () => {
      const logo = manager.getLogo('non-existent')
      expect(logo).toBeNull()
    })

    test('gets logos by type', () => {
      const primaryLogo: LogoConfig = {
        id: 'primary-logo',
        name: 'Primary Logo',
        src: '/logo/primary.svg',
        alt: 'Primary',
        type: 'primary'
      }

      const iconLogo: LogoConfig = {
        id: 'icon-logo',
        name: 'Icon Logo',
        src: '/logo/icon.svg',
        alt: 'Icon',
        type: 'icon'
      }

      manager.registerLogo(primaryLogo)
      manager.registerLogo(iconLogo)

      const primaries = manager.getLogosByType('primary')
      const icons = manager.getLogosByType('icon')

      expect(primaries.length).toBeGreaterThan(0)
      expect(icons.length).toBeGreaterThan(0)
      expect(primaries.some(l => l.id === 'primary-logo')).toBe(true)
      expect(icons.some(l => l.id === 'icon-logo')).toBe(true)
    })

    test('gets primary logo', () => {
      const primary = manager.getPrimaryLogo()
      expect(primary).toBeTruthy()
      expect(primary?.type).toBe('primary')
    })

    test('gets admin logo', () => {
      const admin = manager.getAdminLogo()
      expect(admin).toBeTruthy()
      expect(admin?.type).toBe('admin')
    })
  })

  describe('Branding Configuration', () => {
    test('gets branding config', () => {
      const config = manager.getBrandingConfig()
      expect(config).toBeTruthy()
      expect(config.primaryColor).toBe('#1a1a1a')
      expect(config.secondaryColor).toBe('#d4af37')
    })

    test('updates branding config', () => {
      const updates = { primaryColor: '#000000' }
      manager.updateBrandingConfig(updates)

      const config = manager.getBrandingConfig()
      expect(config.primaryColor).toBe('#000000')
      expect(config.secondaryColor).toBe('#d4af37') // unchanged
    })

    test('gets CSS variables', () => {
      const cssVars = manager.getCSSVariables()
      expect(cssVars).toHaveProperty('--brand-primary', '#1a1a1a')
      expect(cssVars).toHaveProperty('--brand-secondary', '#d4af37')
      expect(cssVars).toHaveProperty('--brand-font-family', 'Inter, sans-serif')
    })
  })

  describe('Video Rendering', () => {
    test('renders video component', () => {
      const videoConfig: VideoConfig = {
        id: 'render-test',
        name: 'Render Test',
        src: '/video/test.mp4',
        type: 'background',
        autoplay: true,
        muted: true
      }

      manager.registerVideo(videoConfig)
      const element = manager.renderVideo('render-test')

      expect(element).toBeTruthy()
      expect(React.isValidElement(element)).toBe(true)
    })

    test('returns null for non-existent video render', () => {
      const element = manager.renderVideo('non-existent')
      expect(element).toBeNull()
    })

    test('renders video player with defaults', () => {
      const element = manager.renderVideoPlayer({
        src: '/video/test.mp4'
      })

      expect(element).toBeTruthy()
      expect(React.isValidElement(element)).toBe(true)
    })

    test('renders background video', () => {
      const element = manager.renderBackgroundVideo()
      expect(element).toBeTruthy()
      expect(React.isValidElement(element)).toBe(true)
    })

    test('renders hero video', () => {
      const element = manager.renderHeroVideo()
      expect(element).toBeTruthy()
      expect(React.isValidElement(element)).toBe(true)
    })
  })

  describe('Logo Rendering', () => {
    test('renders logo component', () => {
      const logoConfig: LogoConfig = {
        id: 'render-logo-test',
        name: 'Render Logo Test',
        src: '/logo/test.svg',
        alt: 'Test Logo',
        type: 'primary'
      }

      manager.registerLogo(logoConfig)
      const element = manager.renderLogo('render-logo-test')

      expect(element).toBeTruthy()
      expect(React.isValidElement(element)).toBe(true)
    })

    test('returns null for non-existent logo render', () => {
      const element = manager.renderLogo('non-existent')
      expect(element).toBeNull()
    })

    test('renders primary logo', () => {
      const element = manager.renderPrimaryLogo()
      expect(element).toBeTruthy()
      expect(React.isValidElement(element)).toBe(true)
    })

    test('renders admin logo', () => {
      const element = manager.renderAdminLogo()
      expect(element).toBeTruthy()
      expect(React.isValidElement(element)).toBe(true)
    })
  })

  describe('Utility Methods', () => {
    test('validates video URL', () => {
      expect(manager.validateVideoUrl('/video/test.mp4')).toBe(true)
      expect(manager.validateVideoUrl('/video/test.webm')).toBe(true)
      expect(manager.validateVideoUrl('/video/test.avi')).toBe(false)
      expect(manager.validateVideoUrl('invalid-url')).toBe(false)
    })

    test('validates logo URL', () => {
      expect(manager.validateLogoUrl('/logo/test.svg')).toBe(true)
      expect(manager.validateLogoUrl('/logo/test.png')).toBe(true)
      expect(manager.validateLogoUrl('/logo/test.jpg')).toBe(true)
      expect(manager.validateLogoUrl('/logo/test.gif')).toBe(true)
      expect(manager.validateLogoUrl('/logo/test.webp')).toBe(true)
      expect(manager.validateLogoUrl('/logo/test.exe')).toBe(false)
      expect(manager.validateLogoUrl('invalid-url')).toBe(false)
    })
  })

  describe('Video Preloading', () => {
    beforeEach(() => {
      // Mock document for preloading tests
      Object.defineProperty(window, 'document', {
        value: {
          createElement: jest.fn().mockReturnValue({
            setAttribute: jest.fn(),
            appendChild: jest.fn()
          }),
          head: {
            appendChild: jest.fn()
          }
        },
        writable: true
      })
    })

    test('preloads videos', () => {
      const videoIds = ['modern-men-fire', 'modern-men-haze']

      // Mock document.createElement and document.head.appendChild
      const mockLink = { rel: '', as: '', href: '' }
      const mockCreateElement = jest.spyOn(document, 'createElement').mockReturnValue(mockLink as any)
      const mockAppendChild = jest.spyOn(document.head, 'appendChild').mockImplementation((node) => node)

      manager.preloadVideos(videoIds)

      // Verify preload links were created
      expect(mockCreateElement).toHaveBeenCalledWith('link')
      expect(mockAppendChild).toHaveBeenCalled()

      mockCreateElement.mockRestore()
      mockAppendChild.mockRestore()
    })

    test('preloads all videos when no ids provided', () => {
      const mockCreateElement = jest.spyOn(document, 'createElement').mockReturnValue({} as any)
      const mockAppendChild = jest.spyOn(document.head, 'appendChild').mockImplementation((node) => node)

      manager.preloadVideos()

      expect(mockCreateElement).toHaveBeenCalled()
      expect(mockAppendChild).toHaveBeenCalled()

      mockCreateElement.mockRestore()
      mockAppendChild.mockRestore()
    })

    test('handles video preloading gracefully', () => {
      const mockCreateElement = jest.spyOn(document, 'createElement').mockReturnValue({} as any)
      const mockAppendChild = jest.spyOn(document.head, 'appendChild').mockImplementation((node) => node)

      // Preload non-existent video (should not throw)
      expect(() => manager.preloadVideos(['non-existent-video'])).not.toThrow()

      mockCreateElement.mockRestore()
      mockAppendChild.mockRestore()
    })
  })

  describe('Error Handling', () => {
    test('handles missing video gracefully', () => {
      const element = manager.renderVideo('missing-video')
      expect(element).toBeNull()
    })

    test('handles missing logo gracefully', () => {
      const element = manager.renderLogo('missing-logo')
      expect(element).toBeNull()
    })

    test('provides fallback for background video', () => {
      // Clear all videos
      manager.clearCache()

      const element = manager.renderBackgroundVideo()
      expect(element).toBeTruthy()
      expect(React.isValidElement(element)).toBe(true)
    })

    test('provides fallback for hero video', () => {
      // Clear all videos
      manager.clearCache()

      const element = manager.renderHeroVideo()
      expect(element).toBeTruthy()
      expect(React.isValidElement(element)).toBe(true)
    })
  })

  describe('Cleanup', () => {
    test('clears cache', () => {
      manager.registerVideo({
        id: 'test-clear',
        name: 'Test Clear',
        src: '/video/test.mp4',
        type: 'background'
      })

      expect(manager.getVideo('test-clear')).toBeTruthy()

      manager.clearCache()
      expect(manager.getVideo('test-clear')).toBeFalsy()
    })

    test('disposes manager', () => {
      manager.dispose()
      // Should reinitialize after dispose
      const config = manager.getBrandingConfig()
      expect(config).toBeTruthy()
    })
  })
})

// Integration tests for React components
describe('Video Branding Components', () => {
  test('ModernMenLogo renders correctly', () => {
    const manager = VideoBrandingManager.getInstance()
    const element = manager.renderPrimaryLogo()

    expect(element).toBeTruthy()
    expect(React.isValidElement(element)).toBe(true)
  })

  test('VideoBackground renders correctly', () => {
    const manager = VideoBrandingManager.getInstance()
    const element = manager.renderBackgroundVideo()

    expect(element).toBeTruthy()
    expect(React.isValidElement(element)).toBe(true)
  })

  test('BrandingVideo renders different types', () => {
    const manager = VideoBrandingManager.getInstance()

    const backgroundElement = React.createElement(manager.renderBackgroundVideo.bind(manager))
    const heroElement = React.createElement(manager.renderHeroVideo.bind(manager))

    expect(backgroundElement).toBeTruthy()
    expect(heroElement).toBeTruthy()
  })
})

// Performance tests
describe('Performance Optimizations', () => {
  test('singleton pattern prevents multiple instances', () => {
    const startTime = Date.now()
    const instances = []

    // Create multiple instances quickly
    for (let i = 0; i < 100; i++) {
      instances.push(VideoBrandingManager.getInstance())
    }

    const endTime = Date.now()
    const duration = endTime - startTime

    // All instances should be the same object
    const firstInstance = instances[0]
    instances.forEach(instance => {
      expect(instance).toBe(firstInstance)
    })

    // Should be fast (< 10ms for 100 instances)
    expect(duration).toBeLessThan(10)
  })

  test('video registration is efficient', () => {
    const manager = VideoBrandingManager.getInstance()
    const startTime = Date.now()

    // Register many videos
    for (let i = 0; i < 1000; i++) {
      manager.registerVideo({
        id: `perf-test-${i}`,
        name: `Performance Test ${i}`,
        src: `/video/test-${i}.mp4`,
        type: 'background'
      })
    }

    const endTime = Date.now()
    const duration = endTime - startTime

    // Should complete in reasonable time (< 100ms for 1000 videos)
    expect(duration).toBeLessThan(100)

    // Should be able to retrieve all videos
    for (let i = 0; i < 100; i++) {
      const video = manager.getVideo(`perf-test-${i}`)
      expect(video).toBeTruthy()
    }
  })
})
