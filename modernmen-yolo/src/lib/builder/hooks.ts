// Builder Hooks
// React hooks for builder functionality

import { useState, useEffect, useCallback } from 'react'
import { ComponentRelationships, createComponentRelationships } from './relationships'
import type { ComponentRelationship, ComponentNode } from '@/types/builder'
export type { ComponentRelationship, ComponentNode }

export interface UseComponentBuilderReturn {
  relationships: ComponentRelationships
  components: ComponentNode[]
  addComponent: (component: ComponentNode) => void
  removeComponent: (componentId: string) => void
  addRelationship: (relationship: ComponentRelationship) => void
  getComponentRelationships: (componentId: string) => ComponentRelationship[]
  getComponent: (componentId: string) => ComponentNode | undefined
}

export function useComponentBuilder(): UseComponentBuilderReturn {
  const [relationships] = useState(() => createComponentRelationships())
  const [components, setComponents] = useState<ComponentNode[]>([])

  const addComponent = useCallback((component: ComponentNode) => {
    relationships.addComponent(component)
    setComponents(prev => [...prev, component])
  }, [relationships])

  const removeComponent = useCallback((componentId: string) => {
    setComponents(prev => prev.filter(comp => comp.id !== componentId))
  }, [])

  const addRelationship = useCallback((relationship: ComponentRelationship) => {
    relationships.addRelationship(relationship)
  }, [relationships])

  const getComponentRelationships = useCallback((componentId: string) => {
    return relationships.getComponentRelationships(componentId)
  }, [relationships])

  const getComponent = useCallback((componentId: string) => {
    return relationships.getComponent(componentId)
  }, [relationships])

  return {
    relationships,
    components,
    addComponent,
    removeComponent,
    addRelationship,
    getComponentRelationships,
    getComponent
  }
}

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

  return {
    selectedComponents,
    selectComponent,
    clearSelection,
    isSelected
  }
}