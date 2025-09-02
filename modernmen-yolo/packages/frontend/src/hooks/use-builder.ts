// =============================================================================
// USE BUILDER HOOK - Main builder functionality hook
// =============================================================================

import { useState, useEffect, useCallback } from 'react'
import { BuilderIntegration, createBuilderIntegration } from '@/services'
import { BuilderState } from '@/types'
import { env } from '@/config'
import { handleApiError } from '@/lib/error-handling'

export function useBuilder() {
  const [state, setState] = useState<BuilderState>({
    isLoading: false,
    components: [],
    relationships: [],
    error: null
  })

  const [integration, setIntegration] = useState<BuilderIntegration | null>(null)

  const initializeBuilder = useCallback(async () => {
    try {
      setState(prev => ({ ...prev, isLoading: true, error: null }))

      // Initialize Supabase integration
      const builderIntegration = createBuilderIntegration({
        projectId: env.supabase.projectId,
        apiKey: env.supabase.anonKey,
        databaseUrl: env.supabase.url
      })

      await builderIntegration.connect()
      setIntegration(builderIntegration)

      setState(prev => ({ ...prev, isLoading: false }))
    } catch (error) {
      const errorResponse = handleApiError(error, 'initialize builder')
      setState(prev => ({
        ...prev,
        isLoading: false,
        error: errorResponse.error
      }))
    }
  }, [])

  const loadComponents = useCallback(async () => {
    if (!integration) return

    try {
      setState(prev => ({ ...prev, isLoading: true, error: null }))

      // Mock component loading - replace with actual implementation
      const mockComponents = [
        { id: '1', name: 'Button', type: 'ui' },
        { id: '2', name: 'Input', type: 'form' },
        { id: '3', name: 'Card', type: 'layout' }
      ]

      setState(prev => ({
        ...prev,
        components: mockComponents,
        isLoading: false
      }))
    } catch (error) {
      const errorResponse = handleApiError(error, 'load components')
      setState(prev => ({
        ...prev,
        isLoading: false,
        error: errorResponse.error
      }))
    }
  }, [integration])

  const createComponent = useCallback(async (componentData: any) => {
    if (!integration) return

    try {
      setState(prev => ({ ...prev, isLoading: true, error: null }))

      // Mock component creation - replace with actual implementation
      const newComponent = {
        id: Date.now().toString(),
        ...componentData
      }

      setState(prev => ({
        ...prev,
        components: [...prev.components, newComponent],
        isLoading: false
      }))

      return newComponent
    } catch (error) {
      const errorResponse = handleApiError(error, 'create component')
      setState(prev => ({
        ...prev,
        isLoading: false,
        error: errorResponse.error
      }))
      throw error
    }
  }, [integration])

  const deleteComponent = useCallback(async (componentId: string) => {
    try {
      setState(prev => ({
        ...prev,
        components: prev.components.filter(c => c.id !== componentId),
        isLoading: false
      }))
    } catch (error) {
      const errorResponse = handleApiError(error, 'delete component')
      setState(prev => ({
        ...prev,
        error: errorResponse.error
      }))
      throw error
    }
  }, [])

  useEffect(() => {
    initializeBuilder()
  }, [initializeBuilder])

  return {
    ...state,
    loadComponents,
    createComponent,
    deleteComponent
  }
}
