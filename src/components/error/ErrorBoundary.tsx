'use client'

import React, { Component, ErrorInfo, ReactNode } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { AlertTriangle, RefreshCw, Home, Bug } from 'lucide-react'

interface Props {
  children: ReactNode
  fallback?: ReactNode
  onError?: (error: Error, errorInfo: ErrorInfo) => void
}

interface State {
  hasError: boolean
  error: Error | null
  errorInfo: ErrorInfo | null
  retryCount: number
}

export class ErrorBoundary extends Component<Props, State> {
  private maxRetries = 3

  constructor(props: Props) {
    super(props)

    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
      retryCount: 0
    }
  }

  static getDerivedStateFromError(error: Error): Partial<State> {
    return {
      hasError: true,
      error
    }
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // Log error to monitoring service
    console.error('Error caught by boundary:', error, errorInfo)

    // Report to error monitoring service (e.g., Sentry)
    if (typeof window !== 'undefined' && (window as any).Sentry) {
      (window as any).Sentry.captureException(error, {
        contexts: {
          react: {
            componentStack: errorInfo.componentStack
          }
        }
      })
    }

    this.setState({
      errorInfo
    })

    // Call custom error handler
    this.props.onError?.(error, errorInfo)
  }

  handleRetry = () => {
    if (this.state.retryCount < this.maxRetries) {
      this.setState(prevState => ({
        hasError: false,
        error: null,
        errorInfo: null,
        retryCount: prevState.retryCount + 1
      }))
    }
  }

  handleGoHome = () => {
    if (typeof window !== 'undefined') {
      window.location.href = '/'
    }
  }

  render() {
    if (this.state.hasError) {
      // Custom fallback UI
      if (this.props.fallback) {
        return this.props.fallback
      }

      // Default error UI
      return (
        <div className="min-h-screen bg-gradient-to-br from-red-50 to-orange-50 flex items-center justify-center p-4">
          <Card className="max-w-lg w-full border-red-200 shadow-xl">
            <CardHeader className="text-center">
              <div className="mx-auto w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
                <AlertTriangle className="h-8 w-8 text-red-600" />
              </div>
              <CardTitle className="text-2xl text-red-800 mb-2">
                Oops! Something went wrong
              </CardTitle>
              <CardDescription className="text-gray-600">
                We're sorry, but an unexpected error occurred. Our team has been notified.
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-4">
              {/* Error details in development */}
              {process.env.NODE_ENV === 'development' && (
                <div className="bg-gray-100 p-4 rounded-lg">
                  <h4 className="font-semibold text-gray-800 mb-2 flex items-center gap-2">
                    <Bug className="h-4 w-4" />
                    Error Details (Development)
                  </h4>
                  <div className="text-sm text-gray-700 space-y-2">
                    <div>
                      <strong>Error:</strong> {this.state.error?.message}
                    </div>
                    {this.state.errorInfo && (
                      <details className="mt-2">
                        <summary className="cursor-pointer text-blue-600 hover:text-blue-800">
                          Component Stack
                        </summary>
                        <pre className="mt-2 text-xs bg-white p-2 rounded border overflow-auto max-h-32">
                          {this.state.errorInfo.componentStack}
                        </pre>
                      </details>
                    )}
                  </div>
                </div>
              )}

              {/* Action buttons */}
              <div className="flex gap-3 justify-center">
                {this.state.retryCount < this.maxRetries && (
                  <Button
                    onClick={this.handleRetry}
                    className="bg-blue-600 hover:bg-blue-700"
                  >
                    <RefreshCw className="h-4 w-4 mr-2" />
                    Try Again ({this.maxRetries - this.state.retryCount} left)
                  </Button>
                )}

                <Button
                  variant="outline"
                  onClick={this.handleGoHome}
                  className="border-gray-300 hover:bg-gray-50"
                >
                  <Home className="h-4 w-4 mr-2" />
                  Go Home
                </Button>
              </div>

              {/* Support information */}
              <div className="text-center text-sm text-gray-500 mt-6 p-4 bg-gray-50 rounded-lg">
                <p>If this problem persists, please contact our support team:</p>
                <p className="font-medium text-gray-700 mt-1">
                  📞 (306) 522-4111 | ✉️ support@modernmen.ca
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      )
    }

    return this.props.children
  }
}

// Hook for error reporting
export function useErrorReporting() {
  const reportError = React.useCallback((error: Error, context?: Record<string, any>) => {
    console.error('Error reported:', error, context)

    // Report to monitoring service
    if (typeof window !== 'undefined' && (window as any).Sentry) {
      (window as any).Sentry.captureException(error, {
        tags: {
          source: 'useErrorReporting'
        },
        extra: context
      })
    }

    // Could also send to custom error reporting service
    // Example: sendErrorToService(error, context)
  }, [])

  const reportUserFeedback = React.useCallback((feedback: string, context?: Record<string, any>) => {
    console.log('User feedback:', feedback, context)

    // Report user feedback to monitoring service
    if (typeof window !== 'undefined' && (window as any).Sentry) {
      (window as any).Sentry.captureMessage(`User Feedback: ${feedback}`, {
        level: 'info',
        tags: {
          type: 'user-feedback'
        },
        extra: context
      })
    }
  }, [])

  return {
    reportError,
    reportUserFeedback
  }
}

// Error boundary for specific sections
export function SectionErrorBoundary({
  children,
  sectionName,
  fallback
}: {
  children: ReactNode
  sectionName: string
  fallback?: ReactNode
}) {
  return (
    <ErrorBoundary
      fallback={fallback}
      onError={(error, errorInfo) => {
        console.error(`Error in ${sectionName} section:`, error, errorInfo)

        // Report section-specific error
        if (typeof window !== 'undefined' && (window as any).Sentry) {
          (window as any).Sentry.captureException(error, {
            tags: {
              section: sectionName
            },
            contexts: {
              react: {
                componentStack: errorInfo.componentStack
              }
            }
          })
        }
      }}
    >
      {children}
    </ErrorBoundary>
  )
}