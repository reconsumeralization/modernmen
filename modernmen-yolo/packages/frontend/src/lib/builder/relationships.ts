// Builder Relationships
// This file handles component relationships and dependencies

import { ComponentRelationship, ComponentNode } from '@/types/builder'

export class ComponentRelationships {
  private relationships: Map<string, ComponentRelationship[]> = new Map()
  private components: Map<string, ComponentNode> = new Map()

  addComponent(component: ComponentNode): void {
    this.components.set(component.id, component)
    this.relationships.set(component.id, [])
  }

  addRelationship(relationship: ComponentRelationship): void {
    const sourceRelationships = this.relationships.get(relationship.sourceComponent) || []
    sourceRelationships.push(relationship)
    this.relationships.set(relationship.sourceComponent, sourceRelationships)
  }

  getComponentRelationships(componentId: string): ComponentRelationship[] {
    return this.relationships.get(componentId) || []
  }

  getComponent(componentId: string): ComponentNode | undefined {
    return this.components.get(componentId)
  }

  getAllComponents(): ComponentNode[] {
    return Array.from(this.components.values())
  }
}

export const createComponentRelationships = () => {
  return new ComponentRelationships()
}
