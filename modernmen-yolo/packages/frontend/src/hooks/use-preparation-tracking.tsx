// =============================================================================
// PREPARATION TRACKING HOOK
// =============================================================================

import React, { useState, useCallback, useEffect } from 'react'
import { generatePreparationChecklist, getPreparationProcedure } from '@/data/preparation-procedures'

interface PreparationTrackingState {
  checklistItems: Array<{
    id: string
    completed: boolean
    completedAt?: Date
    completedBy?: string
  }>
  validationErrors: string[]
  isValid: boolean
  completionPercentage: number
  requiredCompleted: boolean
  startTime?: Date
  estimatedCompletionTime?: Date
}

interface UsePreparationTrackingOptions {
  serviceCategory: string
  serviceName: string
  customerName: string
  barberName: string
  onValidationChange?: (isValid: boolean) => void
  onCompletionChange?: (percentage: number) => void
}

export function usePreparationTracking({
  serviceCategory,
  serviceName,
  customerName,
  barberName,
  onValidationChange,
  onCompletionChange
}: UsePreparationTrackingOptions) {

  const [state, setState] = useState<PreparationTrackingState>({
    checklistItems: [],
    validationErrors: [],
    isValid: false,
    completionPercentage: 0,
    requiredCompleted: false
  })

  // Initialize checklist when service changes
  useEffect(() => {
    const procedure = getPreparationProcedure(serviceCategory, serviceName)
    if (procedure) {
      const checklist = generatePreparationChecklist(procedure)
      const checklistItems = checklist.map(item => ({
        id: item.id,
        completed: false,
        completedAt: undefined,
        completedBy: undefined
      }))

      setState(prev => ({
        ...prev,
        checklistItems,
        startTime: new Date(),
        estimatedCompletionTime: new Date(Date.now() + (procedure.preparationTime * 60 * 1000))
      }))
    }
  }, [serviceCategory, serviceName])

  // Validate checklist completion
  const validateChecklist = useCallback((items: typeof state.checklistItems) => {
    const procedure = getPreparationProcedure(serviceCategory, serviceName)
    if (!procedure) return { isValid: false, errors: ['No procedure found for this service'] }

    const checklist = generatePreparationChecklist(procedure)
    const errors: string[] = []
    let requiredCompleted = true

    // Check required items
    checklist.forEach(item => {
      if (item.required) {
        const checklistItem = items.find(ci => ci.id === item.id)
        if (!checklistItem?.completed) {
          requiredCompleted = false
          errors.push(`Required: ${item.title}`)
        }
      }
    })

    // Check for safety considerations
    const safetyItems = items.filter(item =>
      item.id.includes('safety-') && !item.completed
    )
    if (safetyItems.length > 0) {
      errors.push(`${safetyItems.length} safety consideration(s) not addressed`)
    }

    const isValid = requiredCompleted && errors.length === 0

    return { isValid, errors, requiredCompleted }
  }, [serviceCategory, serviceName, state])

  // Update checklist item completion
  const updateChecklistItem = useCallback((itemId: string, completed: boolean) => {
    setState(prev => {
      const updatedItems = prev.checklistItems.map(item =>
        item.id === itemId
          ? {
              ...item,
              completed,
              completedAt: completed ? new Date() : undefined,
              completedBy: completed ? barberName : undefined
            }
          : item
      )

      const { isValid, errors, requiredCompleted } = validateChecklist(updatedItems)
      const completedCount = updatedItems.filter(item => item.completed).length
      const completionPercentage = updatedItems.length > 0
        ? (completedCount / updatedItems.length) * 100
        : 0

      return {
        ...prev,
        checklistItems: updatedItems,
        validationErrors: errors,
        isValid,
        completionPercentage,
        requiredCompleted
      }
    })
  }, [barberName, validateChecklist])

  // Mark multiple items as completed
  const completeItems = useCallback((itemIds: string[]) => {
    setState(prev => {
      const updatedItems = prev.checklistItems.map(item =>
        itemIds.includes(item.id)
          ? {
              ...item,
              completed: true,
              completedAt: new Date(),
              completedBy: barberName
            }
          : item
      )

      const { isValid, errors, requiredCompleted } = validateChecklist(updatedItems)
      const completedCount = updatedItems.filter(item => item.completed).length
      const completionPercentage = updatedItems.length > 0
        ? (completedCount / updatedItems.length) * 100
        : 0

      return {
        ...prev,
        checklistItems: updatedItems,
        validationErrors: errors,
        isValid,
        completionPercentage,
        requiredCompleted
      }
    })
  }, [barberName, validateChecklist])

  // Get completion summary
  const getCompletionSummary = useCallback(() => {
    const total = state.checklistItems.length
    const completed = state.checklistItems.filter(item => item.completed).length
    const required = state.checklistItems.filter(item => {
      const procedure = getPreparationProcedure(serviceCategory, serviceName)
      if (!procedure) return false
      const checklistItem = generatePreparationChecklist(procedure)
        .find(ci => ci.id === item.id)
      return checklistItem?.required
    }).length

    const requiredCompleted = state.checklistItems.filter(item => {
      const procedure = getPreparationProcedure(serviceCategory, serviceName)
      if (!procedure) return false
      const checklistItem = generatePreparationChecklist(procedure)
        .find(ci => ci.id === item.id)
      return checklistItem?.required && item.completed
    }).length

    return {
      total,
      completed,
      required,
      requiredCompleted,
      completionPercentage: state.completionPercentage,
      isValid: state.isValid,
      timeElapsed: state.startTime
        ? Math.floor((Date.now() - state.startTime.getTime()) / 1000 / 60)
        : 0,
      estimatedTime: getPreparationProcedure(serviceCategory, serviceName)?.preparationTime || 0
    }
  }, [state, serviceCategory, serviceName])

  // Reset checklist
  const resetChecklist = useCallback(() => {
    const procedure = getPreparationProcedure(serviceCategory, serviceName)
    if (procedure) {
      const checklist = generatePreparationChecklist(procedure)
      const checklistItems = checklist.map(item => ({
        id: item.id,
        completed: false,
        completedAt: undefined,
        completedBy: undefined
      }))

      setState({
        checklistItems,
        validationErrors: [],
        isValid: false,
        completionPercentage: 0,
        requiredCompleted: false,
        startTime: new Date(),
        estimatedCompletionTime: new Date(Date.now() + (procedure.preparationTime * 60 * 1000))
      })
    }
  }, [serviceCategory, serviceName])

  // Notify parent components of changes
  useEffect(() => {
    onValidationChange?.(state.isValid)
  }, [state.isValid, onValidationChange])

  useEffect(() => {
    onCompletionChange?.(state.completionPercentage)
  }, [state.completionPercentage, onCompletionChange])

  return {
    // State
    checklistItems: state.checklistItems,
    validationErrors: state.validationErrors,
    isValid: state.isValid,
    completionPercentage: state.completionPercentage,
    requiredCompleted: state.requiredCompleted,
    startTime: state.startTime,
    estimatedCompletionTime: state.estimatedCompletionTime,

    // Actions
    updateChecklistItem,
    completeItems,
    resetChecklist,
    getCompletionSummary,
    validateChecklist: () => validateChecklist(state.checklistItems)
  }
}

// =============================================================================
// PREPARATION TRACKING CONTEXT
// =============================================================================

import { createContext, useContext, ReactNode } from 'react'

interface PreparationTrackingContextType {
  activePreparations: Record<string, ReturnType<typeof usePreparationTracking>>
  startPreparation: (appointmentId: string, options: UsePreparationTrackingOptions) => void
  endPreparation: (appointmentId: string) => void
  getPreparationStatus: (appointmentId: string) => ReturnType<typeof usePreparationTracking> | null
}

const PreparationTrackingContext = createContext<PreparationTrackingContextType | null>(null)

export function PreparationTrackingProvider({ children }: { children: ReactNode }) {
  const [activePreparations, setActivePreparations] = useState<Record<string, any>>({})

  const startPreparation = useCallback((appointmentId: string, options: UsePreparationTrackingOptions) => {
    // This would integrate with the hook in a real implementation
    console.log('Starting preparation tracking for:', appointmentId, options)
  }, [])

  const endPreparation = useCallback((appointmentId: string) => {
    setActivePreparations(prev => {
      const updated = { ...prev }
      delete updated[appointmentId]
      return updated
    })
  }, [])

  const getPreparationStatus = useCallback((appointmentId: string) => {
    return activePreparations[appointmentId] || null
  }, [activePreparations])

  return (
    <PreparationTrackingContext.Provider value={{
      activePreparations,
      startPreparation,
      endPreparation,
      getPreparationStatus
    }}>
      {children}
    </PreparationTrackingContext.Provider>
  )
}

export function usePreparationTrackingContext() {
  const context = useContext(PreparationTrackingContext)
  if (!context) {
    throw new Error('usePreparationTrackingContext must be used within PreparationTrackingProvider')
  }
  return context
}
