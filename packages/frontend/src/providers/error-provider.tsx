'use client'

import { createContext, useContext, useState, useCallback, ReactNode, ErrorInfo } from 'react'

export interface AppError {
  id: string
  message: string
  stack?: string
  componentStack?: string
  timestamp: Date
  userAgent?: string
  url?: string
  userId?: string
  severity: 'low' | 'medium' | 'high' | 'critical'
  category: 'network' | 'auth' | 'data' | 'ui' | 'unknown'
  isHandled: boolean
}

interface ErrorContextType {
  errors: AppError[]
  addError: (error: Error, errorInfo?: ErrorInfo, severity?: AppError['severity']) => void
  removeError: (id: string) => void
  clearErrors: () => void
  handleError: (error: AppError) => void
  reportError: (error: AppError) => Promise<void>
}

const ErrorContext = createContext<ErrorContextType | undefined>(undefined)

export function ErrorProvider({ children }: { children: ReactNode }) {
  const [errors, setErrors] = useState<AppError[]>([])

  const addError = useCallback((
    error: Error,
    errorInfo?: ErrorInfo,
    severity: AppError['severity'] = 'medium'
  ) => {
    const appError: AppError = {
      id: Math.random().toString(36).substring(2, 9),
      message: error.message,
      stack: error.stack,
      componentStack: errorInfo?.componentStack,
      timestamp: new Date(),
      userAgent: typeof window !== 'undefined' ? window.navigator.userAgent : undefined,
      url: typeof window !== 'undefined' ? window.location.href : undefined,
      severity,
      category: categorizeError(error),
      isHandled: false
    }

    setErrors(prev => [appError, ...prev])

    // Auto-report critical errors
    if (severity === 'critical' || severity === 'high') {
      reportError(appError)
    }

    // Auto-remove low severity errors after 10 seconds
    if (severity === 'low') {
      setTimeout(() => {
        removeError(appError.id)
      }, 10000)
    }
  }, [])

  const removeError = useCallback((id: string) => {
    setErrors(prev => prev.filter(error => error.id !== id))
  }, [])

  const clearErrors = useCallback(() => {
    setErrors([])
  }, [])

  const handleError = useCallback((error: AppError) => {
    setErrors(prev =>
      prev.map(err =>
        err.id === error.id
          ? { ...err, isHandled: true }
          : err
      )
    )
  }, [])

  const reportError = useCallback(async (error: AppError) => {
    try {
      // Report to error tracking service (e.g., Sentry, LogRocket, etc.)
      console.error('Reporting error:', error)

      // In a real app, you would send this to your error tracking service
      // await errorTrackingService.report(error)

      // For now, just log to console
      if (process.env.NODE_ENV === 'development') {
        console.group('🚨 Error Report')
        console.error('Message:', error.message)
        console.error('Stack:', error.stack)
        console.error('Component Stack:', error.componentStack)
        console.error('Severity:', error.severity)
        console.error('Category:', error.category)
        console.error('URL:', error.url)
        console.error('User Agent:', error.userAgent)
        console.error('Timestamp:', error.timestamp)
        console.groupEnd()
      }
    } catch (reportError) {
      console.error('Failed to report error:', reportError)
    }
  }, [])

  return (
    <ErrorContext.Provider value={{
      errors,
      addError,
      removeError,
      clearErrors,
      handleError,
      reportError
    }}>
      {children}
    </ErrorContext.Provider>
  )
}

export function useError() {
  const context = useContext(ErrorContext)
  if (!context) {
    throw new Error('useError must be used within an ErrorProvider')
  }
  return context
}

// Helper function to categorize errors
function categorizeError(error: Error): AppError['category'] {
  const message = error.message.toLowerCase()
  const stack = error.stack?.toLowerCase() || ''

  if (message.includes('network') || message.includes('fetch') || message.includes('http')) {
    return 'network'
  }

  if (message.includes('auth') || message.includes('login') || message.includes('token')) {
    return 'auth'
  }

  if (message.includes('data') || message.includes('database') || message.includes('query')) {
    return 'data'
  }

  if (message.includes('component') || message.includes('render') || message.includes('ui')) {
    return 'ui'
  }

  return 'unknown'
}

// Error Boundary Component
export class ErrorBoundary extends React.Component<
  { children: ReactNode; fallback?: ReactNode; onError?: (error: Error, errorInfo: ErrorInfo) => void },
  { hasError: boolean; error?: Error }
> {
  constructor(props: { children: ReactNode; fallback?: ReactNode; onError?: (error: Error, errorInfo: ErrorInfo) => void }) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // Report error using context if available
    try {
      // This would normally use the error context, but since this is a class component
      // we'll just log for now
      console.error('Error Boundary caught an error:', error, errorInfo)
    } catch {
      // Fallback error reporting
      console.error('Error Boundary:', error, errorInfo)
    }

    this.props.onError?.(error, errorInfo)
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback || (
        <div className="min-h-screen flex items-center justify-center bg-red-50">
          <div className="max-w-md w-full bg-white shadow-lg rounded-lg p-6 text-center">
            <h2 className="text-2xl font-bold text-red-600 mb-4">Something went wrong</h2>
            <p className="text-gray-600 mb-4">
              We're sorry, but something unexpected happened. Please try refreshing the page.
            </p>
            <button
              onClick={() => window.location.reload()}
              className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition-colors"
            >
              Refresh Page
            </button>
          </div>
        </div>
      )
    }

    return this.props.children
  }
}

// Import React for ErrorBoundary
import React from 'react'
