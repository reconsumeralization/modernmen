// Builder related types
export interface BuilderState {
  isLoading: boolean
  components: any[]
  relationships: any[]
  error: string | null
}

export interface ComponentRelationship {
  id: string
  sourceComponent: string
  targetComponent: string
  relationshipType: 'parent' | 'child' | 'sibling' | 'dependency'
  metadata?: Record<string, any>
}

export interface ComponentNode {
  id: string
  name: string
  type: string
  relationships: ComponentRelationship[]
  metadata?: Record<string, any>
}

export interface BuilderConfig {
  projectId: string
  apiKey: string
  databaseUrl: string
}

export interface ModernMenCollection {
  name: string
  fields: any[]
}

export interface ModernMenConfig {
  collections: ModernMenCollection[]
}
