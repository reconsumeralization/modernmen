// =============================================================================
// USE COMPONENT SELECTION HOOK - Component selection management
// =============================================================================

import { useState, useCallback } from 'react'

export function useComponentSelection() {
  const [selectedComponents, setSelectedComponents] = useState<string[]>([])

  const selectComponent = useCallback((componentId: string) => {
    setSelectedComponents(prev =>
      prev.includes(componentId)
        ? prev.filter(id => id !== componentId)
        : [...prev, componentId]
    )
  }, [])

  const clearSelection = useCallback(() => {
    setSelectedComponents([])
  }, [])

  const isSelected = useCallback((componentId: string) => {
    return selectedComponents.includes(componentId)
  }, [selectedComponents])

  const selectMultiple = useCallback((componentIds: string[]) => {
    setSelectedComponents(componentIds)
  }, [])

  const toggleSelection = useCallback((componentId: string) => {
    selectComponent(componentId)
  }, [selectComponent])

  const selectAll = useCallback((componentIds: string[]) => {
    setSelectedComponents(componentIds)
  }, [])

  return {
    selectedComponents,
    selectComponent,
    clearSelection,
    isSelected,
    selectMultiple,
    toggleSelection,
    selectAll,
    hasSelection: selectedComponents.length > 0,
    selectionCount: selectedComponents.length
  }
}
