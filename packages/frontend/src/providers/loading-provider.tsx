'use client'

import { createContext, useContext, useState, useCallback, ReactNode } from 'react'

interface LoadingState {
  id: string
  message?: string
  type: 'spinner' | 'progress' | 'skeleton'
  progress?: number // 0-100 for progress type
}

interface LoadingContextType {
  loadingStates: LoadingState[]
  isLoading: boolean
  startLoading: (id: string, message?: string, type?: LoadingState['type']) => void
  updateProgress: (id: string, progress: number) => void
  stopLoading: (id: string) => void
  clearAll: () => void
  withLoading: <T>(
    id: string,
    asyncFn: () => Promise<T>,
    message?: string,
    type?: LoadingState['type']
  ) => Promise<T>
}

const LoadingContext = createContext<LoadingContextType | undefined>(undefined)

export function LoadingProvider({ children }: { children: ReactNode }) {
  const [loadingStates, setLoadingStates] = useState<LoadingState[]>([])

  const isLoading = loadingStates.length > 0

  const startLoading = useCallback((
    id: string,
    message?: string,
    type: LoadingState['type'] = 'spinner'
  ) => {
    setLoadingStates(prev => {
      // Remove existing state with same id
      const filtered = prev.filter(state => state.id !== id)
      return [...filtered, { id, message, type, progress: 0 }]
    })
  }, [])

  const updateProgress = useCallback((id: string, progress: number) => {
    setLoadingStates(prev =>
      prev.map(state =>
        state.id === id
          ? { ...state, progress: Math.max(0, Math.min(100, progress)) }
          : state
      )
    )
  }, [])

  const stopLoading = useCallback((id: string) => {
    setLoadingStates(prev => prev.filter(state => state.id !== id))
  }, [])

  const clearAll = useCallback(() => {
    setLoadingStates([])
  }, [])

  const withLoading = useCallback(async <T,>(
    id: string,
    asyncFn: () => Promise<T>,
    message?: string,
    type: LoadingState['type'] = 'spinner'
  ): Promise<T> => {
    startLoading(id, message, type)
    try {
      const result = await asyncFn()
      return result
    } finally {
      stopLoading(id)
    }
  }, [startLoading, stopLoading])

  return (
    <LoadingContext.Provider value={{
      loadingStates,
      isLoading,
      startLoading,
      updateProgress,
      stopLoading,
      clearAll,
      withLoading
    }}>
      {children}
    </LoadingContext.Provider>
  )
}

export function useLoading() {
  const context = useContext(LoadingContext)
  if (!context) {
    throw new Error('useLoading must be used within a LoadingProvider')
  }
  return context
}

// Convenience hook for common loading patterns
export function useAsyncLoading() {
  const { withLoading } = useLoading()

  const withApiCall = useCallback(<T,>(
    asyncFn: () => Promise<T>,
    loadingMessage = 'Loading...'
  ) => {
    const id = `api-${Date.now()}`
    return withLoading(id, asyncFn, loadingMessage)
  }, [withLoading])

  const withFormSubmission = useCallback(<T,>(
    asyncFn: () => Promise<T>,
    formMessage = 'Submitting...'
  ) => {
    const id = `form-${Date.now()}`
    return withLoading(id, asyncFn, formMessage)
  }, [withLoading])

  const withFileUpload = useCallback(<T,>(
    asyncFn: () => Promise<T>,
    uploadMessage = 'Uploading...'
  ) => {
    const id = `upload-${Date.now()}`
    return withLoading(id, asyncFn, uploadMessage)
  }, [withLoading])

  return {
    withApiCall,
    withFormSubmission,
    withFileUpload
  }
}
