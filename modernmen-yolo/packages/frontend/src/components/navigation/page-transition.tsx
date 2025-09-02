"use client"

import * as React from "react"
import { cn } from "@/lib/utils"
import { useNavigationState } from "./navigation-provider"

interface PageTransitionProps {
  children: React.ReactNode
  className?: string
  loadingComponent?: React.ReactNode
  errorComponent?: React.ReactNode
}

export function PageTransition({
  children,
  className,
  loadingComponent,
  errorComponent
}: PageTransitionProps) {
  const { isNavigating } = useNavigationState()
  const [showContent, setShowContent] = React.useState(!isNavigating)
  const [error, setError] = React.useState<Error | null>(null)

  React.useEffect(() => {
    if (isNavigating) {
      setShowContent(false)
      const timer = setTimeout(() => setShowContent(true), 150)
      return () => clearTimeout(timer)
    }
  }, [isNavigating])

  const defaultLoadingComponent = (
    <div className="flex items-center justify-center min-h-[400px]">
      <div className="space-y-4 text-center">
        <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto" />
        <p className="text-muted-foreground">Loading...</p>
      </div>
    </div>
  )

  const defaultErrorComponent = error && (
    <div className="flex items-center justify-center min-h-[400px]">
      <div className="space-y-4 text-center">
        <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto">
          <span className="text-red-600 text-xl">!</span>
        </div>
        <div>
          <h3 className="font-medium text-red-900">Something went wrong</h3>
          <p className="text-red-600 text-sm">{error.message}</p>
        </div>
      </div>
    </div>
  )

  return (
    <div className={cn("relative", className)}>
      {/* Loading overlay */}
      {isNavigating && (
        <div className="absolute inset-0 z-10 bg-background/80 backdrop-blur-sm flex items-center justify-center">
          <div className="space-y-4 text-center">
            <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
            <p className="text-muted-foreground">Loading...</p>
          </div>
        </div>
      )}

      {/* Error state */}
      {error && (
        <div className="absolute inset-0 z-10 bg-background flex items-center justify-center">
          {errorComponent || defaultErrorComponent}
        </div>
      )}

      {/* Main content */}
      <div
        className={cn(
          "transition-opacity duration-300",
          showContent ? "opacity-100" : "opacity-0"
        )}
      >
        <ErrorBoundary onError={setError}>
          {children}
        </ErrorBoundary>
      </div>
    </div>
  )
}

// Error boundary component
interface ErrorBoundaryProps {
  children: React.ReactNode
  onError?: (error: Error) => void
  fallback?: React.ComponentType<{ error: Error; reset: () => void }>
}

interface ErrorBoundaryState {
  hasError: boolean
  error: Error | null
}

class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Page transition error:', error, errorInfo)
    this.props.onError?.(error)
  }

  reset = () => {
    this.setState({ hasError: false, error: null })
  }

  render() {
    if (this.state.hasError && this.state.error) {
      if (this.props.fallback) {
        const FallbackComponent = this.props.fallback
        return <FallbackComponent error={this.state.error} reset={this.reset} />
      }

      return (
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="space-y-4 text-center">
            <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto">
              <span className="text-red-600 text-xl">!</span>
            </div>
            <div>
              <h3 className="font-medium text-red-900">Something went wrong</h3>
              <p className="text-red-600 text-sm">{this.state.error.message}</p>
            </div>
            <button
              onClick={this.reset}
              className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
            >
              Try Again
            </button>
          </div>
        </div>
      )
    }

    return this.props.children
  }
}

// Skeleton loading components
export function PageSkeleton() {
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <div className="h-8 bg-muted rounded-md animate-pulse" />
        <div className="h-4 bg-muted rounded-md animate-pulse w-1/2" />
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="space-y-2">
            <div className="h-20 bg-muted rounded-md animate-pulse" />
          </div>
        ))}
      </div>

      <div className="space-y-4">
        <div className="h-6 bg-muted rounded-md animate-pulse" />
        <div className="h-32 bg-muted rounded-md animate-pulse" />
      </div>
    </div>
  )
}

export function CardSkeleton() {
  return (
    <div className="space-y-4">
      <div className="h-6 bg-muted rounded-md animate-pulse" />
      <div className="space-y-2">
        <div className="h-4 bg-muted rounded-md animate-pulse" />
        <div className="h-4 bg-muted rounded-md animate-pulse w-3/4" />
      </div>
    </div>
  )
}

export function TableSkeleton() {
  return (
    <div className="space-y-4">
      <div className="h-10 bg-muted rounded-md animate-pulse" />
      {Array.from({ length: 5 }).map((_, i) => (
        <div key={i} className="h-12 bg-muted rounded-md animate-pulse" />
      ))}
    </div>
  )
}
