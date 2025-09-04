import { useState, useEffect, useCallback, useRef, useMemo } from 'react'

// Enhanced state management hook with caching, optimistic updates, and error recovery
export interface OptimizedStateOptions<T> {
  initialData?: T
  cacheKey?: string
  cacheTimeout?: number // in milliseconds
  enableOptimisticUpdates?: boolean
  enablePersistence?: boolean
  onError?: (error: Error) => void
  onSuccess?: (data: T) => void
}

export interface OptimizedState<T> {
  data: T | null
  loading: boolean
  error: Error | null
  isStale: boolean
  lastUpdated: Date | null
  refetch: () => Promise<void>
  mutate: (updater: T | ((prev: T | null) => T)) => void
  optimisticUpdate: (updater: T | ((prev: T | null) => T)) => void
  rollback: () => void
  clearError: () => void
  reset: () => void
}

export function useOptimizedState<T>(
  fetcher: () => Promise<T>,
  options: OptimizedStateOptions<T> = {}
): OptimizedState<T> {
  const {
    initialData = null,
    cacheKey,
    cacheTimeout = 5 * 60 * 1000, // 5 minutes
    enableOptimisticUpdates = true,
    enablePersistence = false,
    onError,
    onSuccess
  } = options

  const [data, setData] = useState<T | null>(initialData)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<Error | null>(null)
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null)

  // Refs for optimistic updates
  const originalDataRef = useRef<T | null>(null)
  const abortControllerRef = useRef<AbortController | null>(null)

  // Cache management
  const cache = useMemo(() => {
    if (typeof window === 'undefined' || !cacheKey) return null

    return {
      get: () => {
        try {
          const cached = localStorage.getItem(`cache_${cacheKey}`)
          if (!cached) return null

          const { data: cachedData, timestamp } = JSON.parse(cached)
          if (Date.now() - timestamp > cacheTimeout) {
            localStorage.removeItem(`cache_${cacheKey}`)
            return null
          }

          return cachedData
        } catch {
          return null
        }
      },
      set: (data: T) => {
        try {
          localStorage.setItem(`cache_${cacheKey}`, JSON.stringify({
            data,
            timestamp: Date.now()
          }))
        } catch {
          // Ignore cache errors
        }
      },
      clear: () => {
        try {
          localStorage.removeItem(`cache_${cacheKey}`)
        } catch {
          // Ignore cache errors
        }
      }
    }
  }, [cacheKey, cacheTimeout])

  // Persistence management
  const persistence = useMemo(() => {
    if (typeof window === 'undefined' || !enablePersistence || !cacheKey) return null

    return {
      get: () => {
        try {
          const persisted = localStorage.getItem(`persist_${cacheKey}`)
          return persisted ? JSON.parse(persisted) : null
        } catch {
          return null
        }
      },
      set: (data: T) => {
        try {
          localStorage.setItem(`persist_${cacheKey}`, JSON.stringify(data))
        } catch {
          // Ignore persistence errors
        }
      }
    }
  }, [enablePersistence, cacheKey])

  // Check if data is stale
  const isStale = useMemo(() => {
    if (!lastUpdated) return true
    return Date.now() - lastUpdated.getTime() > cacheTimeout
  }, [lastUpdated, cacheTimeout])

  // Load initial data from cache or persistence
  useEffect(() => {
    const loadInitialData = async () => {
      // Try persistence first
      if (persistence) {
        const persisted = persistence.get()
        if (persisted) {
          setData(persisted)
          setLastUpdated(new Date())
          return
        }
      }

      // Try cache
      if (cache) {
        const cached = cache.get()
        if (cached) {
          setData(cached)
          setLastUpdated(new Date())
          return
        }
      }

      // Fetch fresh data if no cache/persistence
      if (!data) {
        await refetch()
      }
    }

    loadInitialData()
  }, [])

  // Cleanup abort controller on unmount
  useEffect(() => {
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort()
      }
    }
  }, [])

  const refetch = useCallback(async () => {
    setLoading(true)
    setError(null)

    // Cancel previous request
    if (abortControllerRef.current) {
      abortControllerRef.current.abort()
    }

    // Create new abort controller
    abortControllerRef.current = new AbortController()

    try {
      const result = await fetcher()

      setData(result)
      setLastUpdated(new Date())
      setError(null)

      // Update cache and persistence
      if (cache) cache.set(result)
      if (persistence) persistence.set(result)

      onSuccess?.(result)
    } catch (err) {
      if (err instanceof Error && err.name !== 'AbortError') {
        const error = err instanceof Error ? err : new Error('Unknown error')
        setError(error)
        onError?.(error)
      }
    } finally {
      setLoading(false)
      abortControllerRef.current = null
    }
  }, [fetcher, cache, persistence, onError, onSuccess])

  const mutate = useCallback((updater: T | ((prev: T | null) => T)) => {
    setData(prev => {
      const newData = typeof updater === 'function' ? updater(prev) : updater

      // Update cache and persistence
      if (cache) cache.set(newData)
      if (persistence) persistence.set(newData)

      return newData
    })
    setLastUpdated(new Date())
    setError(null)
  }, [cache, persistence])

  const optimisticUpdate = useCallback((updater: T | ((prev: T | null) => T)) => {
    if (!enableOptimisticUpdates) return

    // Store original data for rollback
    originalDataRef.current = data

    mutate(updater)
  }, [data, mutate, enableOptimisticUpdates])

  const rollback = useCallback(() => {
    if (originalDataRef.current) {
      setData(originalDataRef.current)
      setLastUpdated(new Date())
      originalDataRef.current = null
    }
  }, [])

  const clearError = useCallback(() => {
    setError(null)
  }, [])

  const reset = useCallback(() => {
    setData(initialData)
    setLoading(false)
    setError(null)
    setLastUpdated(null)
    originalDataRef.current = null

    // Clear cache and persistence
    if (cache) cache.clear()
  }, [initialData, cache])

  return {
    data,
    loading,
    error,
    isStale,
    lastUpdated,
    refetch,
    mutate,
    optimisticUpdate,
    rollback,
    clearError,
    reset
  }
}

// Hook for managing multiple async operations with better error handling
export function useAsyncOperations() {
  const [operations, setOperations] = useState<Map<string, {
    loading: boolean
    error: Error | null
    data?: any
  }>>(new Map())

  const execute = useCallback(async <T,>(
    key: string,
    operation: () => Promise<T>,
    options: {
      onSuccess?: (data: T) => void
      onError?: (error: Error) => void
      optimisticData?: T
    } = {}
  ): Promise<T | null> => {
    const { onSuccess, onError, optimisticData } = options

    // Set optimistic data if provided
    if (optimisticData !== undefined) {
      setOperations(prev => new Map(prev).set(key, {
        loading: true,
        error: null,
        data: optimisticData
      }))
    } else {
      setOperations(prev => new Map(prev).set(key, {
        loading: true,
        error: null
      }))
    }

    try {
      const result = await operation()

      setOperations(prev => new Map(prev).set(key, {
        loading: false,
        error: null,
        data: result
      }))

      onSuccess?.(result)
      return result
    } catch (error) {
      const err = error instanceof Error ? error : new Error('Operation failed')

      setOperations(prev => new Map(prev).set(key, {
        loading: false,
        error: err
      }))

      onError?.(err)
      return null
    }
  }, [])

  const getOperation = useCallback((key: string) => {
    return operations.get(key) || { loading: false, error: null }
  }, [operations])

  const clearOperation = useCallback((key: string) => {
    setOperations(prev => {
      const newMap = new Map(prev)
      newMap.delete(key)
      return newMap
    })
  }, [])

  const clearAll = useCallback(() => {
    setOperations(new Map())
  }, [])

  return {
    execute,
    getOperation,
    clearOperation,
    clearAll,
    operations: Array.from(operations.entries())
  }
}

// Hook for managing form state with validation and persistence
export function useFormState<T extends Record<string, any>>(
  initialValues: T,
  validationSchema?: (values: T) => Record<string, string>,
  options: {
    persistKey?: string
    debounceMs?: number
  } = {}
) {
  const { persistKey, debounceMs = 300 } = options

  const [values, setValues] = useState<T>(() => {
    if (persistKey && typeof window !== 'undefined') {
      try {
        const persisted = localStorage.getItem(`form_${persistKey}`)
        return persisted ? { ...initialValues, ...JSON.parse(persisted) } : initialValues
      } catch {
        return initialValues
      }
    }
    return initialValues
  })

  const [errors, setErrors] = useState<Record<string, string>>({})
  const [touched, setTouched] = useState<Record<string, boolean>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Persist form values
  useEffect(() => {
    if (persistKey && typeof window !== 'undefined') {
      const timeoutId = setTimeout(() => {
        try {
          localStorage.setItem(`form_${persistKey}`, JSON.stringify(values))
        } catch {
          // Ignore persistence errors
        }
      }, debounceMs)

      return () => clearTimeout(timeoutId)
    }
  }, [values, persistKey, debounceMs])

  const setValue = useCallback((field: keyof T, value: any) => {
    setValues(prev => ({ ...prev, [field]: value }))

    // Clear error when field changes
    if (errors[field as string]) {
      setErrors(prev => ({ ...prev, [field as string]: '' }))
    }
  }, [errors])

  const setValuesBulk = useCallback((updater: Partial<T> | ((prev: T) => T)) => {
    setValues(prev => {
      const newValues = typeof updater === 'function' ? updater(prev) : { ...prev, ...updater }

      // Clear errors for updated fields
      const newErrors = { ...errors }
      Object.keys(newValues).forEach(key => {
        if (newErrors[key]) {
          delete newErrors[key]
        }
      })
      setErrors(newErrors)

      return newValues
    })
  }, [errors])

  const setTouched = useCallback((field: keyof T, isTouched = true) => {
    setTouched(prev => ({ ...prev, [field as string]: isTouched }))
  }, [])

  const validate = useCallback(() => {
    if (!validationSchema) return true

    const validationErrors = validationSchema(values)
    setErrors(validationErrors)

    return Object.keys(validationErrors).length === 0
  }, [values, validationSchema])

  const handleSubmit = useCallback(async (
    onSubmit: (values: T) => Promise<void> | void,
    options: { validateOnSubmit?: boolean } = {}
  ) => {
    const { validateOnSubmit = true } = options

    if (validateOnSubmit && !validate()) {
      return false
    }

    setIsSubmitting(true)
    try {
      await onSubmit(values)
      return true
    } catch (error) {
      if (error instanceof Error) {
        setErrors({ submit: error.message })
      }
      return false
    } finally {
      setIsSubmitting(false)
    }
  }, [values, validate])

  const reset = useCallback(() => {
    setValues(initialValues)
    setErrors({})
    setTouched({})
    setIsSubmitting(false)

    if (persistKey && typeof window !== 'undefined') {
      try {
        localStorage.removeItem(`form_${persistKey}`)
      } catch {
        // Ignore cleanup errors
      }
    }
  }, [initialValues, persistKey])

  const isValid = useMemo(() => {
    return Object.keys(errors).length === 0
  }, [errors])

  const isDirty = useMemo(() => {
    return JSON.stringify(values) !== JSON.stringify(initialValues)
  }, [values, initialValues])

  return {
    values,
    errors,
    touched,
    isSubmitting,
    isValid,
    isDirty,
    setValue,
    setValues: setValuesBulk,
    setTouched,
    validate,
    handleSubmit,
    reset
  }
}
