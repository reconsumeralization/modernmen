import { useCallback, useEffect, useState } from 'react'
import { useErrorMonitoring } from '@/lib/error-monitoring'
import { safeGet, safeProp, safeMap } from '@/lib/safe-access'
import { APIErrorFactory } from '@/lib/enhanced-api-errors'

interface UseErrorHandlingOptions {
  componentName?: string
  enableBreadcrumbs?: boolean
  enableErrorReporting?: boolean
}

interface ErrorHandlingState {
  isLoading: boolean
  error: Error | null
  retryCount: number
}

export function useErrorHandling(options: UseErrorHandlingOptions = {}) {
  const {
    componentName = 'UnknownComponent',
    enableBreadcrumbs = true,
    enableErrorReporting = true
  } = options

  const { addBreadcrumb, captureError } = useErrorMonitoring()
  const [state, setState] = useState<ErrorHandlingState>({
    isLoading: false,
    error: null,
    retryCount: 0
  })

  // Safe data access wrapper
  const safeAccess = useCallback(<T>(
    data: any,
    path: string | number | (string | number)[],
    defaultValue?: T,
    context?: string
  ): T | null => {
    try {
      if (typeof path === 'number' || Array.isArray(path)) {
        // Array access
        return safeGet(data, path as number, defaultValue, true) as T
      } else {
        // Object access
        return safeProp(data, path, defaultValue, true) as T
      }
    } catch (error) {
      if (enableErrorReporting) {
        captureError(error instanceof Error ? error : new Error(String(error)), {
          component: componentName,
          action: 'safeAccess',
          metadata: { path, context: context || 'data_access' }
        })
      }
      return defaultValue || null
    }
  }, [componentName, enableErrorReporting, captureError])

  // Safe async operation wrapper
  const safeAsync = useCallback(async <T>(
    operation: () => Promise<T>,
    context?: string,
    maxRetries: number = 1
  ): Promise<T | null> => {
    if (enableBreadcrumbs) {
      addBreadcrumb(`Starting async operation: ${context || 'unknown'}`, 'user_action', {
        component: componentName,
        maxRetries
      })
    }

    setState(prev => ({ ...prev, isLoading: true, error: null }))

    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        const result = await operation()

        setState(prev => ({
          ...prev,
          isLoading: false,
          error: null,
          retryCount: attempt > 1 ? prev.retryCount + 1 : 0
        }))

        if (enableBreadcrumbs) {
          addBreadcrumb(`Async operation completed: ${context || 'unknown'}`, 'user_action', {
            component: componentName,
            attempt,
            success: true
          })
        }

        return result
      } catch (error) {
        if (enableErrorReporting) {
          await captureError(error instanceof Error ? error : new Error(String(error)), {
            component: componentName,
            action: context || 'async_operation',
            metadata: { attempt, maxRetries }
          })
        }

        if (attempt === maxRetries) {
          setState(prev => ({
            ...prev,
            isLoading: false,
            error: error instanceof Error ? error : new Error(String(error)),
            retryCount: prev.retryCount + attempt - 1
          }))

          if (enableBreadcrumbs) {
            addBreadcrumb(`Async operation failed: ${context || 'unknown'}`, 'error', {
              component: componentName,
              attempt,
              maxRetries,
              error: error instanceof Error ? error.message : String(error)
            })
          }

          return null
        }

        // Wait before retry (exponential backoff)
        await new Promise(resolve => setTimeout(resolve, Math.pow(2, attempt) * 100))
      }
    }

    return null
  }, [componentName, enableBreadcrumbs, enableErrorReporting, addBreadcrumb, captureError])

  // Safe array operations
  const safeArrayOps = useCallback({
    map: <T, U>(array: T[], mapper: (item: T, index: number) => U, context?: string): U[] => {
      try {
        return safeMap(array, mapper, `${componentName}.${context || 'map'}`)
      } catch (error) {
        if (enableErrorReporting) {
          captureError(error instanceof Error ? error : new Error(String(error)), {
            component: componentName,
            action: 'safeArrayOps.map',
            metadata: { arrayLength: array?.length, context }
          })
        }
        return []
      }
    },

    find: <T>(array: T[], predicate: (item: T, index: number) => boolean, context?: string): T | null => {
      try {
        return safeGet(array, array?.findIndex(predicate) || -1, null, true)
      } catch (error) {
        if (enableErrorReporting) {
          captureError(error instanceof Error ? error : new Error(String(error)), {
            component: componentName,
            action: 'safeArrayOps.find',
            metadata: { arrayLength: array?.length, context }
          })
        }
        return null
      }
    },

    get: <T>(array: T[], index: number, defaultValue?: T, context?: string): T | null => {
      try {
        return safeGet(array, index, defaultValue, true)
      } catch (error) {
        if (enableErrorReporting) {
          captureError(error instanceof Error ? error : new Error(String(error)), {
            component: componentName,
            action: 'safeArrayOps.get',
            metadata: { index, arrayLength: array?.length, context }
          })
        }
        return defaultValue || null
      }
    }
  }, [componentName, enableErrorReporting, captureError])

  // Error reporting helper
  const reportError = useCallback(async (
    error: Error,
    context?: string,
    metadata?: Record<string, any>
  ) => {
    if (enableErrorReporting) {
      await captureError(error, {
        component: componentName,
        action: context || 'manual_report',
        metadata
      })
    }
  }, [componentName, enableErrorReporting, captureError])

  // Clear error state
  const clearError = useCallback(() => {
    setState(prev => ({ ...prev, error: null }))
  }, [])

  // Reset retry count
  const resetRetries = useCallback(() => {
    setState(prev => ({ ...prev, retryCount: 0 }))
  }, [])

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (enableBreadcrumbs) {
        addBreadcrumb(`Component unmounting: ${componentName}`, 'navigation', {
          component: componentName
        })
      }
    }
  }, [componentName, enableBreadcrumbs, addBreadcrumb])

  return {
    // State
    ...state,

    // Safe operations
    safeAccess,
    safeAsync,
    safeArrayOps,

    // Error handling
    reportError,
    clearError,
    resetRetries,

    // Breadcrumb helper
    addBreadcrumb: enableBreadcrumbs ? addBreadcrumb : () => {},

    // Common error creators
    createError: {
      validation: (field: string, message: string) =>
        APIErrorFactory.validationFailed({ field, message }),
      notFound: (resource: string) =>
        APIErrorFactory.notFound(resource),
      unauthorized: () =>
        APIErrorFactory.unauthorized()
    }
  }
}

// Hook for form error handling
export function useFormErrorHandling(formName: string) {
  const errorHandling = useErrorHandling({
    componentName: `Form_${formName}`,
    enableBreadcrumbs: true,
    enableErrorReporting: true
  })

  const [formErrors, setFormErrors] = useState<Record<string, string>>({})

  const handleFormError = useCallback(async (
    error: any,
    field?: string
  ) => {
    await errorHandling.reportError(
      error instanceof Error ? error : new Error(String(error)),
      'form_submission',
      { formName, field }
    )

    if (field) {
      setFormErrors(prev => ({ ...prev, [field]: error.message || 'Invalid input' }))
    }
  }, [errorHandling, formName])

  const clearFormError = useCallback((field?: string) => {
    if (field) {
      setFormErrors(prev => {
        const newErrors = { ...prev }
        delete newErrors[field]
        return newErrors
      })
    } else {
      setFormErrors({})
    }
  }, [])

  const validateField = useCallback(async (
    value: any,
    fieldName: string,
    validator: (value: any) => boolean | Promise<boolean>,
    errorMessage: string = 'Invalid value'
  ) => {
    try {
      const isValid = await validator(value)
      if (!isValid) {
        await handleFormError(new Error(errorMessage), fieldName)
        return false
      }

      clearFormError(fieldName)
      return true
    } catch (error) {
      await handleFormError(error, fieldName)
      return false
    }
  }, [handleFormError, clearFormError])

  return {
    ...errorHandling,
    formErrors,
    handleFormError,
    clearFormError,
    validateField,
    hasErrors: Object.keys(formErrors).length > 0,
    getFieldError: (field: string) => formErrors[field] || null
  }
}

// Hook for API error handling
export function useApiErrorHandling(endpoint: string) {
  const errorHandling = useErrorHandling({
    componentName: `API_${endpoint}`,
    enableBreadcrumbs: true,
    enableErrorReporting: true
  })

  const [apiState, setApiState] = useState({
    isLoading: false,
    error: null as Error | null,
    retryCount: 0
  })

  const apiCall = useCallback(async <T>(
    apiFunction: () => Promise<T>,
    options: {
      maxRetries?: number
      onSuccess?: (data: T) => void
      onError?: (error: Error) => void
    } = {}
  ): Promise<T | null> => {
    const { maxRetries = 1, onSuccess, onError } = options

    setApiState(prev => ({ ...prev, isLoading: true, error: null }))

    try {
      const result = await errorHandling.safeAsync(apiFunction, `api_call_${endpoint}`, maxRetries)

      if (result !== null) {
        setApiState(prev => ({ ...prev, isLoading: false, error: null }))
        onSuccess?.(result)
        return result
      } else {
        const error = new Error('API call failed after all retries')
        setApiState(prev => ({ ...prev, isLoading: false, error }))
        onError?.(error)
        return null
      }
    } catch (error) {
      const apiError = error instanceof Error ? error : new Error(String(error))
      setApiState(prev => ({ ...prev, isLoading: false, error: apiError }))
      onError?.(apiError)
      return null
    }
  }, [errorHandling, endpoint])

  return {
    ...errorHandling,
    ...apiState,
    apiCall
  }
}

export default useErrorHandling
