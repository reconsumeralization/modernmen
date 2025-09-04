// 🎯 Complete Type Management System
import { getPayload } from 'payload'
import fs from 'fs'
import path from 'path'
import { logger } from './logger'

export interface TypeDefinition {
  name: string
  collection: string
  fields: FieldDefinition[]
  relations: RelationDefinition[]
  hooks: HookDefinition[]
}

export interface FieldDefinition {
  name: string
  type: string
  required: boolean
  unique?: boolean
  defaultValue?: any
  validation?: any
  options?: any[]
}

export interface RelationDefinition {
  name: string
  relationTo: string
  hasMany?: boolean
  required?: boolean
}

export interface HookDefinition {
  type: 'beforeChange' | 'afterChange' | 'beforeDelete' | 'afterDelete'
  handler: string
}

export class TypeManager {
  private static instance: TypeManager
  private typesCache: Map<string, TypeDefinition> = new Map()
  private generatedTypesPath = path.join(process.cwd(), 'src', 'generated-types.ts')

  private constructor() {}

  static getInstance(): TypeManager {
    if (!TypeManager.instance) {
      TypeManager.instance = new TypeManager()
    }
    return TypeManager.instance
  }

  // 🔄 Generate all types from Payload collections
  async generateAllTypes() {
    logger.info('🎯 Generating all types from Payload collections...')

    try {
      const payload = await getPayload()
      const collections = payload.collections || {}

      const typeDefinitions: TypeDefinition[] = []

      for (const [slug, collection] of Object.entries(collections)) {
        const typeDef = await this.generateCollectionType(slug, collection as any)
        typeDefinitions.push(typeDef)
      }

      // Generate TypeScript file
      const tsCode = this.generateTypeScriptCode(typeDefinitions)
      await fs.promises.writeFile(this.generatedTypesPath, tsCode)

      // Update cache
      typeDefinitions.forEach(typeDef => {
        this.typesCache.set(typeDef.collection, typeDef)
      })

      logger.info(`✅ Generated types for ${typeDefinitions.length} collections`)

      return typeDefinitions

    } catch (error) {
      logger.error('❌ Failed to generate types:', error)
      throw error
    }
  }

  // 🔄 Generate type for single collection
  async generateCollectionType(slug: string, collection: any): Promise<TypeDefinition> {
    const fields: FieldDefinition[] = []
    const relations: RelationDefinition[] = []
    const hooks: HookDefinition[] = []

    // Process fields
    if (collection.fields) {
      for (const field of collection.fields) {
        if (field.type === 'relationship') {
          relations.push({
            name: field.name,
            relationTo: field.relationTo,
            hasMany: field.hasMany || false,
            required: field.required || false
          })
        }

        fields.push({
          name: field.name,
          type: this.mapFieldType(field),
          required: field.required || false,
          unique: field.unique || false,
          defaultValue: field.defaultValue,
          validation: field.validate,
          options: field.options
        })
      }
    }

    // Process hooks
    if (collection.hooks) {
      Object.entries(collection.hooks).forEach(([hookType, hookHandlers]) => {
        if (Array.isArray(hookHandlers)) {
          hookHandlers.forEach((handler: any) => {
            hooks.push({
              type: hookType as any,
              handler: typeof handler === 'function' ? handler.name : 'anonymous'
            })
          })
        }
      })
    }

    return {
      name: this.slugToTypeName(slug),
      collection: slug,
      fields,
      relations,
      hooks
    }
  }

  // 🔄 Map Payload field types to TypeScript
  private mapFieldType(field: any): string {
    switch (field.type) {
      case 'text':
      case 'textarea':
        return 'string'
      case 'number':
        return 'number'
      case 'email':
        return 'string'
      case 'checkbox':
        return 'boolean'
      case 'date':
        return 'string'
      case 'relationship':
        return field.hasMany ? 'string[]' : 'string'
      case 'array':
        return 'any[]'
      case 'json':
        return 'any'
      case 'richText':
        return 'any'
      case 'upload':
        return 'string'
      case 'select':
        return field.options ? field.options.map((opt: any) => `'${opt.value}'`).join(' | ') : 'string'
      default:
        return 'any'
    }
  }

  // 🔄 Convert slug to TypeScript type name
  private slugToTypeName(slug: string): string {
    return slug
      .split('-')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join('')
  }

  // 🔄 Generate TypeScript code
  private generateTypeScriptCode(typeDefinitions: TypeDefinition[]): string {
    let code = `// 🎯 Auto-generated types from Payload CMS collections
// Generated on: ${new Date().toISOString()}
// Do not edit manually - run 'npm run generate:types' to regenerate

`

    // Generate interfaces
    typeDefinitions.forEach(typeDef => {
      code += `export interface ${typeDef.name} {
  id: string\n`

      // Add fields
      typeDef.fields.forEach(field => {
        const typeStr = field.required ? field.type : `${field.type} | undefined`
        code += `  ${field.name}${field.required ? '' : '?'}: ${typeStr}\n`
      })

      // Add timestamps
      code += `  createdAt?: string
  updatedAt?: string
}

`
    })

    // Generate collection-specific types
    typeDefinitions.forEach(typeDef => {
      const typeName = typeDef.name

      code += `export interface Create${typeName}Data {
  ${typeDef.fields
    .filter(field => field.name !== 'id' && field.name !== 'createdAt' && field.name !== 'updatedAt')
    .map(field => `${field.name}${field.required ? '' : '?'}: ${field.type}`)
    .join('\n  ')}
}

export interface Update${typeName}Data extends Partial<Create${typeName}Data> {
  id: string
}

`
    })

    // Generate union types
    const collectionNames = typeDefinitions.map(t => `'${t.collection}'`).join(' | ')
    code += `export type CollectionSlug = ${collectionNames}

export type CollectionData<T extends CollectionSlug> =
  T extends 'users' ? User :
  T extends 'services' ? Service :
  T extends 'appointments' ? Appointment :
  T extends 'customers' ? Customer :
  T extends 'products' ? Product :
  T extends 'locations' ? Location :
  T extends 'pages' ? Page :
  T extends 'commissions' ? Commission :
  T extends 'inventory' ? Inventory :
  T extends 'service-packages' ? ServicePackage :
  T extends 'wait-list' ? WaitListEntry :
  T extends 'documentation' ? Documentation :
  T extends 'notifications' ? Notification :
  any

`

    return code
  }

  // 🔄 Validate types against collections
  async validateTypes() {
    logger.info('🔍 Validating types against collections...')

    const payload = await getPayload()
    const issues: string[] = []

    for (const [slug, cachedType] of this.typesCache) {
      try {
        const collection = payload.collections?.[slug]
        if (!collection) {
          issues.push(`Collection '${slug}' not found in Payload`)
          continue
        }

        // Validate fields
        const collectionFields = collection.fields || []
        const typeFields = cachedType.fields

        // Check for missing fields
        for (const collectionField of collectionFields) {
          const typeField = typeFields.find(f => f.name === collectionField.name)
          if (!typeField) {
            issues.push(`Field '${collectionField.name}' in '${slug}' missing from types`)
          }
        }

        // Check for extra fields
        for (const typeField of typeFields) {
          const collectionField = collectionFields.find(f => f.name === typeField.name)
          if (!collectionField && !['id', 'createdAt', 'updatedAt'].includes(typeField.name)) {
            issues.push(`Field '${typeField.name}' in types not found in '${slug}' collection`)
          }
        }

      } catch (error) {
        issues.push(`Failed to validate ${slug}: ${error.message}`)
      }
    }

    if (issues.length > 0) {
      logger.warn('⚠️ Type validation issues found:')
      issues.forEach(issue => logger.warn(`  - ${issue}`))
    } else {
      logger.info('✅ All types validated successfully')
    }

    return issues
  }

  // 🔄 Get type definition
  getType(collection: string): TypeDefinition | undefined {
    return this.typesCache.get(collection)
  }

  // 🔄 Get all type definitions
  getAllTypes(): TypeDefinition[] {
    return Array.from(this.typesCache.values())
  }

  // 🔄 Update type cache
  updateType(typeDef: TypeDefinition) {
    this.typesCache.set(typeDef.collection, typeDef)
  }

  // 🔄 Clear type cache
  clearCache() {
    this.typesCache.clear()
  }
}

// 🎯 Export singleton instance
export const typeManager = TypeManager.getInstance()

// 🎯 Utility functions
export const generateAllTypes = () => typeManager.generateAllTypes()
export const validateTypes = () => typeManager.validateTypes()
export const getType = (collection: string) => typeManager.getType(collection)
export const getAllTypes = () => typeManager.getAllTypes()
