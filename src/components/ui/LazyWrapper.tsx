import React, { useState, ReactNode } from 'react'
import { useLazyLoading } from '@/hooks/usePerformance'

interface LazyWrapperProps {
  children: ReactNode
  fallback?: ReactNode
  threshold?: number
  rootMargin?: string
  className?: string
}

export function LazyWrapper({
  children,
  fallback,
  threshold = 0.1,
  rootMargin = '50px',
  className
}: LazyWrapperProps) {
  const [isClient, setIsClient] = useState(false)
  const { ref, shouldLoad } = useLazyLoading({
    threshold,
    rootMargin
  })

  // Handle hydration
  React.useEffect(() => {
    setIsClient(true)
  }, [])

  if (!isClient) {
    return (
      <div ref={ref as any} className={className}>
        {fallback || <div className="animate-pulse bg-gray-200 rounded h-32" />}
      </div>
    )
  }

  return (
    <div ref={ref as any} className={className}>
      {shouldLoad ? children : (fallback || <div className="animate-pulse bg-gray-200 rounded h-32" />)}
    </div>
  )
}

// Higher-order component for lazy loading
export function withLazyLoading<P extends object>(
  Component: React.ComponentType<P>,
  options: {
    fallback?: ReactNode
    threshold?: number
    rootMargin?: string
  } = {}
) {
  const { fallback, threshold, rootMargin } = options

  return function LazyComponent(props: P) {
    return (
      <LazyWrapper
        fallback={fallback}
        threshold={threshold}
        rootMargin={rootMargin}
      >
        <Component {...props} />
      </LazyWrapper>
    )
  }
}

// Component for progressive image loading
interface ProgressiveImageProps {
  src: string
  alt: string
  className?: string
  width?: number
  height?: number
  priority?: boolean
  placeholder?: string
}

export function ProgressiveImage({
  src,
  alt,
  className,
  width,
  height,
  priority = false,
  placeholder
}: ProgressiveImageProps) {
  const [isLoaded, setIsLoaded] = useState(false)
  const [hasError, setHasError] = useState(false)

  return (
    <div className={`relative overflow-hidden ${className}`}>
      {/* Placeholder/Blur */}
      {!isLoaded && !hasError && (
        <div className="absolute inset-0 bg-gray-200 animate-pulse" />
      )}

      {/* Main Image */}
      <img
        src={src}
        alt={alt}
        width={width}
        height={height}
        className={`transition-opacity duration-300 ${
          isLoaded ? 'opacity-100' : 'opacity-0'
        }`}
        onLoad={() => setIsLoaded(true)}
        onError={() => {
          setHasError(true)
          setIsLoaded(true)
        }}
        loading={priority ? 'eager' : 'lazy'}
      />

      {/* Error state */}
      {hasError && (
        <div className="absolute inset-0 bg-gray-100 flex items-center justify-center">
          <div className="text-gray-400 text-sm">Image failed to load</div>
        </div>
      )}
    </div>
  )
}
