import { useState, useEffect, useCallback } from 'react'

interface ViewportSize {
  width: number
  height: number
}

interface TouchCapabilities {
  hasTouch: boolean
  maxTouchPoints: number
  hasPointerEvents: boolean
  hasCoarsePointer: boolean
}

interface DeviceCapabilities {
  isMobile: boolean
  isTablet: boolean
  isDesktop: boolean
  isIOS: boolean
  isAndroid: boolean
  isSafari: boolean
  isChrome: boolean
  hasCamera: boolean
  hasGeolocation: boolean
  hasVibration: boolean
  hasBattery: boolean
}

interface PerformanceMetrics {
  connectionSpeed: 'slow' | 'medium' | 'fast'
  memoryUsage: number
  devicePixelRatio: number
  prefersReducedMotion: boolean
  prefersReducedData: boolean
}

export function useMobileOptimization() {
  const [viewportSize, setViewportSize] = useState<ViewportSize>({
    width: 0,
    height: 0,
  })

  const [deviceCapabilities, setDeviceCapabilities] = useState<DeviceCapabilities>({
    isMobile: false,
    isTablet: false,
    isDesktop: true,
    isIOS: false,
    isAndroid: false,
    isSafari: false,
    isChrome: false,
    hasCamera: false,
    hasGeolocation: false,
    hasVibration: false,
    hasBattery: false,
  })

  const [touchCapabilities, setTouchCapabilities] = useState<TouchCapabilities>({
    hasTouch: false,
    maxTouchPoints: 0,
    hasPointerEvents: false,
    hasCoarsePointer: false,
  })

  const [performanceMetrics, setPerformanceMetrics] = useState<PerformanceMetrics>({
    connectionSpeed: 'medium',
    memoryUsage: 0,
    devicePixelRatio: 1,
    prefersReducedMotion: false,
    prefersReducedData: false,
  })

  // Detect device capabilities
  const detectDeviceCapabilities = useCallback(() => {
    if (typeof window === 'undefined') return

    const userAgent = navigator.userAgent
    const platform = navigator.platform

    const capabilities: DeviceCapabilities = {
      isMobile: /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(userAgent),
      isTablet: /iPad|Android(?=.*\bMobile\b)|Tablet|PlayBook/i.test(userAgent) ||
                (platform === 'MacIntel' && navigator.maxTouchPoints > 1),
      isDesktop: !/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini|Tablet|PlayBook/i.test(userAgent),
      isIOS: /iPad|iPhone|iPod/.test(userAgent),
      isAndroid: /Android/.test(userAgent),
      isSafari: /^((?!chrome|android).)*safari/i.test(userAgent),
      isChrome: /Chrome/.test(userAgent),
      hasCamera: !!(navigator.mediaDevices && navigator.mediaDevices.getUserMedia),
      hasGeolocation: !!navigator.geolocation,
      hasVibration: !!navigator.vibrate,
      hasBattery: !!(navigator as any).getBattery,
    }

    // Adjust for iPad detection
    if (capabilities.isIOS && platform === 'MacIntel') {
      capabilities.isTablet = true
      capabilities.isMobile = false
      capabilities.isDesktop = false
    }

    setDeviceCapabilities(capabilities)
  }, [])

  // Detect touch capabilities
  const detectTouchCapabilities = useCallback(() => {
    if (typeof window === 'undefined') return

    const capabilities: TouchCapabilities = {
      hasTouch: 'ontouchstart' in window || navigator.maxTouchPoints > 0,
      maxTouchPoints: navigator.maxTouchPoints || 0,
      hasPointerEvents: 'PointerEvent' in window,
      hasCoarsePointer: window.matchMedia && window.matchMedia('(pointer: coarse)').matches,
    }

    setTouchCapabilities(capabilities)
  }, [])

  // Detect performance metrics
  const detectPerformanceMetrics = useCallback(() => {
    if (typeof window === 'undefined') return

    // Connection speed estimation
    let connectionSpeed: 'slow' | 'medium' | 'fast' = 'medium'
    if ('connection' in navigator) {
      const connection = (navigator as any).connection
      if (connection) {
        const effectiveType = connection.effectiveType
        if (effectiveType === 'slow-2g' || effectiveType === '2g') {
          connectionSpeed = 'slow'
        } else if (effectiveType === '4g') {
          connectionSpeed = 'fast'
        }
      }
    }

    // Memory usage
    let memoryUsage = 0
    if ('memory' in performance) {
      const memory = (performance as any).memory
      memoryUsage = memory.usedJSHeapSize / memory.totalJSHeapSize
    }

    const metrics: PerformanceMetrics = {
      connectionSpeed,
      memoryUsage,
      devicePixelRatio: window.devicePixelRatio || 1,
      prefersReducedMotion: window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches,
      prefersReducedData: window.matchMedia && window.matchMedia('(prefers-reduced-data: reduce)').matches,
    }

    setPerformanceMetrics(metrics)
  }, [])

  // Update viewport size
  const updateViewportSize = useCallback(() => {
    setViewportSize({
      width: window.innerWidth,
      height: window.innerHeight,
    })
  }, [])

  // Initialize on mount
  useEffect(() => {
    detectDeviceCapabilities()
    detectTouchCapabilities()
    detectPerformanceMetrics()
    updateViewportSize()

    // Listen for viewport changes
    window.addEventListener('resize', updateViewportSize)
    window.addEventListener('orientationchange', updateViewportSize)

    return () => {
      window.removeEventListener('resize', updateViewportSize)
      window.removeEventListener('orientationchange', updateViewportSize)
    }
  }, [detectDeviceCapabilities, detectTouchCapabilities, detectPerformanceMetrics, updateViewportSize])

  // Utility functions
  const isSmallScreen = viewportSize.width < 640
  const isMediumScreen = viewportSize.width >= 640 && viewportSize.width < 1024
  const isLargeScreen = viewportSize.width >= 1024

  const shouldUseMobileLayout = deviceCapabilities.isMobile || isSmallScreen
  const shouldUseTabletLayout = deviceCapabilities.isTablet && !isSmallScreen && !isLargeScreen

  // Touch gesture handlers
  const handleSwipe = useCallback((direction: 'left' | 'right' | 'up' | 'down', callback: () => void) => {
    if (!touchCapabilities.hasTouch) return

    let startX = 0
    let startY = 0
    const minSwipeDistance = 50

    const handleTouchStart = (e: TouchEvent) => {
      startX = e.touches[0].clientX
      startY = e.touches[0].clientY
    }

    const handleTouchEnd = (e: TouchEvent) => {
      if (!startX || !startY) return

      const endX = e.changedTouches[0].clientX
      const endY = e.changedTouches[0].clientY

      const diffX = startX - endX
      const diffY = startY - endY

      const isLeftSwipe = diffX > minSwipeDistance
      const isRightSwipe = diffX < -minSwipeDistance
      const isUpSwipe = diffY > minSwipeDistance
      const isDownSwipe = diffY < -minSwipeDistance

      if (
        (direction === 'left' && isLeftSwipe) ||
        (direction === 'right' && isRightSwipe) ||
        (direction === 'up' && isUpSwipe) ||
        (direction === 'down' && isDownSwipe)
      ) {
        callback()
      }
    }

    return {
      onTouchStart: handleTouchStart,
      onTouchEnd: handleTouchEnd,
    }
  }, [touchCapabilities.hasTouch])

  // Haptic feedback
  const triggerHapticFeedback = useCallback((pattern: number | number[] = 50) => {
    if (deviceCapabilities.hasVibration && navigator.vibrate) {
      navigator.vibrate(pattern)
    }
  }, [deviceCapabilities.hasVibration])

  // Camera access
  const requestCameraAccess = useCallback(async (constraints?: MediaStreamConstraints) => {
    if (!deviceCapabilities.hasCamera) {
      throw new Error('Camera not available on this device')
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: false,
        ...constraints,
      })
      return stream
    } catch (error) {
      console.error('Camera access denied:', error)
      throw error
    }
  }, [deviceCapabilities.hasCamera])

  // Geolocation
  const requestGeolocation = useCallback(() => {
    return new Promise<GeolocationPosition>((resolve, reject) => {
      if (!deviceCapabilities.hasGeolocation) {
        reject(new Error('Geolocation not available on this device'))
        return
      }

      navigator.geolocation.getCurrentPosition(
        resolve,
        reject,
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 300000, // 5 minutes
        }
      )
    })
  }, [deviceCapabilities.hasGeolocation])

  // Battery status
  const getBatteryStatus = useCallback(async () => {
    if (!deviceCapabilities.hasBattery) {
      return null
    }

    try {
      const battery = await (navigator as any).getBattery()
      return {
        level: battery.level,
        charging: battery.charging,
        chargingTime: battery.chargingTime,
        dischargingTime: battery.dischargingTime,
      }
    } catch (error) {
      console.error('Battery status not available:', error)
      return null
    }
  }, [deviceCapabilities.hasBattery])

  // Performance optimization
  const shouldLazyLoad = performanceMetrics.connectionSpeed === 'slow' ||
                         performanceMetrics.prefersReducedData

  const shouldReduceMotion = performanceMetrics.prefersReducedMotion

  const getOptimalImageSize = useCallback(() => {
    const pixelRatio = performanceMetrics.devicePixelRatio
    const width = viewportSize.width

    if (width <= 640) return { width: Math.round(640 * pixelRatio), quality: 80 }
    if (width <= 1024) return { width: Math.round(1024 * pixelRatio), quality: 85 }
    return { width: Math.round(1920 * pixelRatio), quality: 90 }
  }, [performanceMetrics.devicePixelRatio, viewportSize.width])

  return {
    // Device detection
    isMobile: deviceCapabilities.isMobile,
    isTablet: deviceCapabilities.isTablet,
    isDesktop: deviceCapabilities.isDesktop,
    isIOS: deviceCapabilities.isIOS,
    isAndroid: deviceCapabilities.isAndroid,

    // Screen size detection
    isSmallScreen,
    isMediumScreen,
    isLargeScreen,
    shouldUseMobileLayout,
    shouldUseTabletLayout,

    // Viewport information
    viewportSize,

    // Touch capabilities
    hasTouch: touchCapabilities.hasTouch,
    maxTouchPoints: touchCapabilities.maxTouchPoints,

    // Device features
    hasCamera: deviceCapabilities.hasCamera,
    hasGeolocation: deviceCapabilities.hasGeolocation,
    hasVibration: deviceCapabilities.hasVibration,

    // Performance
    connectionSpeed: performanceMetrics.connectionSpeed,
    shouldLazyLoad,
    shouldReduceMotion,
    getOptimalImageSize,

    // Utility functions
    handleSwipe,
    triggerHapticFeedback,
    requestCameraAccess,
    requestGeolocation,
    getBatteryStatus,

    // Raw data access
    deviceCapabilities,
    touchCapabilities,
    performanceMetrics,
  }
}
