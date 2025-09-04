import { z } from 'zod'
import { CollectionConfig } from 'payload/types'

// =============================================================================
// FLEXIBLE COLLECTION GENERATOR
// =============================================================================
// This system provides dynamic generation of types, services, and CRUD operations
// from Payload CMS collection definitions, making the system highly adaptable.

export interface GeneratedCollection {
  name: string
  slug: string
  fields: GeneratedField[]
  relationships: GeneratedRelationship[]
  hooks: CollectionHooks
  access: CollectionAccess
  admin: CollectionAdmin
  typescript: GeneratedTypeScript
  service: GeneratedService
  validation: GeneratedValidation
}

export interface GeneratedField {
  name: string
  type: FieldType
  required: boolean
  defaultValue?: any
  validation?: z.ZodType
  admin: FieldAdmin
  relationship?: {
    relationTo: string
    hasMany: boolean
  }
  array?: {
    fields: GeneratedField[]
  }
  group?: {
    fields: GeneratedField[]
  }
}

export interface GeneratedRelationship {
  name: string
  type: 'hasOne' | 'hasMany' | 'belongsTo' | 'belongsToMany'
  target: string
  foreignKey: string
  localKey?: string
}

export interface CollectionHooks {
  beforeCreate?: string[]
  afterCreate?: string[]
  beforeUpdate?: string[]
  afterUpdate?: string[]
  beforeDelete?: string[]
  afterDelete?: string[]
}

export interface CollectionAccess {
  create?: string
  read?: string
  update?: string
  delete?: string
}

export interface CollectionAdmin {
  group?: string
  useAsTitle?: string
  defaultColumns?: string[]
  icon?: string
}

export interface GeneratedTypeScript {
  interface: string
  createInput: string
  updateInput: string
  filterInput: string
  sortInput: string
}

export interface GeneratedService {
  className: string
  methods: ServiceMethod[]
  queries: ServiceQuery[]
}

export interface ServiceMethod {
  name: string
  operation: 'create' | 'read' | 'update' | 'delete' | 'list'
  parameters: string[]
  returnType: string
  implementation: string
}

export interface ServiceQuery {
  name: string
  type: 'simple' | 'complex' | 'aggregate'
  filters: QueryFilter[]
  sorting: QuerySort[]
  pagination: boolean
}

export interface QueryFilter {
  field: string
  operator: 'eq' | 'ne' | 'gt' | 'gte' | 'lt' | 'lte' | 'in' | 'nin' | 'contains' | 'startsWith' | 'endsWith'
  type: 'string' | 'number' | 'boolean' | 'date' | 'array'
}

export interface QuerySort {
  field: string
  direction: 'asc' | 'desc'
}

export interface GeneratedValidation {
  createSchema: z.ZodObject<any>
  updateSchema: z.ZodObject<any>
  filterSchema: z.ZodObject<any>
}

export type FieldType =
  | 'text'
  | 'textarea'
  | 'number'
  | 'email'
  | 'date'
  | 'checkbox'
  | 'select'
  | 'relationship'
  | 'array'
  | 'group'
  | 'upload'
  | 'richText'
  | 'json'
  | 'point'
  | 'radio'

export interface FieldAdmin {
  position?: 'sidebar' | 'main'
  readOnly?: boolean
  hidden?: boolean
  condition?: string
  description?: string
  placeholder?: string
}

// =============================================================================
// COLLECTION PARSER
// =============================================================================

export class CollectionParser {
  private collection: CollectionConfig

  constructor(collection: CollectionConfig) {
    this.collection = collection
  }

  parse(): GeneratedCollection {
    return {
      name: this.getCollectionName(),
      slug: this.collection.slug,
      fields: this.parseFields(),
      relationships: this.parseRelationships(),
      hooks: this.parseHooks(),
      access: this.parseAccess(),
      admin: this.parseAdmin(),
      typescript: this.generateTypeScript(),
      service: this.generateService(),
      validation: this.generateValidation()
    }
  }

  private getCollectionName(): string {
    return this.collection.slug
      .split('-')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join('')
  }

  private parseFields(): GeneratedField[] {
    return this.collection.fields.map(field => this.parseField(field))
  }

  private parseField(field: any): GeneratedField {
    const baseField = {
      name: field.name,
      type: field.type as FieldType,
      required: field.required || false,
      defaultValue: field.defaultValue,
      admin: {
        position: field.admin?.position,
        readOnly: field.admin?.readOnly,
        hidden: field.admin?.hidden,
        condition: field.admin?.condition,
        description: field.admin?.description,
        placeholder: field.admin?.placeholder
      }
    }

    switch (field.type) {
      case 'relationship':
        return {
          ...baseField,
          relationship: {
            relationTo: field.relationTo,
            hasMany: field.hasMany || false
          }
        }

      case 'array':
        return {
          ...baseField,
          array: {
            fields: field.fields.map((f: any) => this.parseField(f))
          }
        }

      case 'group':
        return {
          ...baseField,
          group: {
            fields: field.fields.map((f: any) => this.parseField(f))
          }
        }

      default:
        return baseField
    }
  }

  private parseRelationships(): GeneratedRelationship[] {
    const relationships: GeneratedRelationship[] = []

    this.collection.fields.forEach(field => {
      if (field.type === 'relationship') {
        const type = field.hasMany ? 'hasMany' : 'belongsTo'
        relationships.push({
          name: field.name,
          type,
          target: field.relationTo,
          foreignKey: `${field.name}_id`,
          localKey: field.hasMany ? undefined : 'id'
        })
      }
    })

    return relationships
  }

  private parseHooks(): CollectionHooks {
    const hooks: CollectionHooks = {}

    if (this.collection.hooks?.beforeChange) {
      hooks.beforeCreate = ['validateData']
      hooks.beforeUpdate = ['validateData']
    }

    if (this.collection.hooks?.afterChange) {
      hooks.afterCreate = ['sendNotifications']
      hooks.afterUpdate = ['sendNotifications']
    }

    return hooks
  }

  private parseAccess(): CollectionAccess {
    return {
      create: this.collection.access?.create || 'authenticated',
      read: this.collection.access?.read || 'authenticated',
      update: this.collection.access?.update || 'authenticated',
      delete: this.collection.access?.delete || 'adminOnly'
    }
  }

  private parseAdmin(): CollectionAdmin {
    return {
      group: this.collection.admin?.group,
      useAsTitle: this.collection.admin?.useAsTitle,
      defaultColumns: this.collection.admin?.defaultColumns,
      icon: this.collection.admin?.icon
    }
  }

  private generateTypeScript(): GeneratedTypeScript {
    const fields = this.parseFields()
    const collectionName = this.getCollectionName()

    const interfaceFields = fields.map(field => {
      let typeString = 'any'

      switch (field.type) {
        case 'text':
        case 'textarea':
        case 'email':
          typeString = 'string'
          break
        case 'number':
          typeString = 'number'
          break
        case 'date':
          typeString = 'Date'
          break
        case 'checkbox':
          typeString = 'boolean'
          break
        case 'select':
          typeString = 'string'
          break
        case 'relationship':
          typeString = field.relationship?.hasMany ? 'string[]' : 'string'
          break
        case 'array':
          typeString = 'any[]'
          break
        case 'group':
          typeString = 'Record<string, any>'
          break
      }

      const optional = field.required ? '' : '?'
      return `  ${field.name}${optional}: ${typeString}`
    }).join('\n')

    const interface = `export interface ${collectionName} {
${interfaceFields}
  createdAt: Date
  updatedAt: Date
}`

    const createFields = fields
      .filter(field => field.name !== 'id' && !field.admin.readOnly)
      .map(field => `  ${field.name}${field.required ? '' : '?'}: ${this.getFieldType(field)}`)
      .join('\n')

    const createInput = `export interface Create${collectionName}Input {
${createFields}
}`

    const updateFields = fields
      .filter(field => field.name !== 'id')
      .map(field => `  ${field.name}?: ${this.getFieldType(field)}`)
      .join('\n')

    const updateInput = `export interface Update${collectionName}Input {
${updateFields}
}`

    return {
      interface,
      createInput,
      updateInput,
      filterInput: this.generateFilterInput(collectionName),
      sortInput: this.generateSortInput(collectionName)
    }
  }

  private getFieldType(field: GeneratedField): string {
    switch (field.type) {
      case 'text':
      case 'textarea':
      case 'email':
        return 'string'
      case 'number':
        return 'number'
      case 'date':
        return 'Date'
      case 'checkbox':
        return 'boolean'
      case 'select':
        return 'string'
      case 'relationship':
        return field.relationship?.hasMany ? 'string[]' : 'string'
      case 'array':
        return 'any[]'
      case 'group':
        return 'Record<string, any>'
      default:
        return 'any'
    }
  }

  private generateFilterInput(collectionName: string): string {
    return `export interface ${collectionName}FilterInput {
  search?: string
  status?: string
  dateFrom?: Date
  dateTo?: Date
  limit?: number
  offset?: number
  sortBy?: string
  sortOrder?: 'asc' | 'desc'
}`
  }

  private generateSortInput(collectionName: string): string {
    return `export interface ${collectionName}SortInput {
  field: string
  direction: 'asc' | 'desc'
}`
  }

  private generateService(): GeneratedService {
    const collectionName = this.getCollectionName()
    const fields = this.parseFields()

    const methods: ServiceMethod[] = [
      {
        name: 'findMany',
        operation: 'list',
        parameters: ['filters?: any', 'pagination?: any'],
        returnType: `Promise<{ data: ${collectionName}[], total: number }>`,
        implementation: this.generateFindManyImplementation(collectionName)
      },
      {
        name: 'findById',
        operation: 'read',
        parameters: ['id: string'],
        returnType: `Promise<${collectionName} | null>`,
        implementation: this.generateFindByIdImplementation(collectionName)
      },
      {
        name: 'create',
        operation: 'create',
        parameters: [`data: Create${collectionName}Input`],
        returnType: `Promise<${collectionName}>`,
        implementation: this.generateCreateImplementation(collectionName)
      },
      {
        name: 'update',
        operation: 'update',
        parameters: ['id: string', `data: Update${collectionName}Input`],
        returnType: `Promise<${collectionName}>`,
        implementation: this.generateUpdateImplementation(collectionName)
      },
      {
        name: 'delete',
        operation: 'delete',
        parameters: ['id: string'],
        returnType: 'Promise<boolean>',
        implementation: this.generateDeleteImplementation(collectionName)
      }
    ]

    return {
      className: `${collectionName}Service`,
      methods,
      queries: this.generateServiceQueries(collectionName, fields)
    }
  }

  private generateFindManyImplementation(collectionName: string): string {
    return `const { data, error, count } = await supabase
  .from('${this.collection.slug}')
  .select('*', { count: 'exact' })
  .range(
    (pagination?.offset || 0),
    (pagination?.offset || 0) + (pagination?.limit || 10) - 1
  )

if (error) throw error
return { data: data || [], total: count || 0 }`
  }

  private generateFindByIdImplementation(collectionName: string): string {
    return `const { data, error } = await supabase
  .from('${this.collection.slug}')
  .select('*')
  .eq('id', id)
  .single()

if (error) {
  if (error.code === 'PGRST116') return null
  throw error
}
return data`
  }

  private generateCreateImplementation(collectionName: string): string {
    return `const { data, error } = await supabase
  .from('${this.collection.slug}')
  .insert(data)
  .select()
  .single()

if (error) throw error
return data`
  }

  private generateUpdateImplementation(collectionName: string): string {
    return `const { data, error } = await supabase
  .from('${this.collection.slug}')
  .update(data)
  .eq('id', id)
  .select()
  .single()

if (error) throw error
return data`
  }

  private generateDeleteImplementation(collectionName: string): string {
    return `const { error } = await supabase
  .from('${this.collection.slug}')
  .delete()
  .eq('id', id)

if (error) throw error
return true`
  }

  private generateServiceQueries(collectionName: string, fields: GeneratedField[]): ServiceQuery[] {
    const queries: ServiceQuery[] = []

    // Generate queries based on field types
    const searchableFields = fields.filter(field =>
      ['text', 'textarea', 'email'].includes(field.type)
    )

    if (searchableFields.length > 0) {
      queries.push({
        name: 'search',
        type: 'simple',
        filters: searchableFields.map(field => ({
          field: field.name,
          operator: 'contains' as const,
          type: 'string'
        })),
        sorting: [{ field: 'createdAt', direction: 'desc' }],
        pagination: true
      })
    }

    // Generate date range queries
    const dateFields = fields.filter(field => field.type === 'date')
    if (dateFields.length > 0) {
      queries.push({
        name: 'findByDateRange',
        type: 'complex',
        filters: [
          { field: dateFields[0].name, operator: 'gte', type: 'date' },
          { field: dateFields[0].name, operator: 'lte', type: 'date' }
        ],
        sorting: [{ field: dateFields[0].name, direction: 'desc' }],
        pagination: true
      })
    }

    return queries
  }

  private generateValidation(): GeneratedValidation {
    const fields = this.parseFields()
    const collectionName = this.getCollectionName()

    const createSchema = this.buildZodSchema(fields, 'create')
    const updateSchema = this.buildZodSchema(fields, 'update')
    const filterSchema = this.buildFilterSchema(collectionName)

    return {
      createSchema,
      updateSchema,
      filterSchema
    }
  }

  private buildZodSchema(fields: GeneratedField[], mode: 'create' | 'update'): z.ZodObject<any> {
    const schema: Record<string, z.ZodType> = {}

    fields.forEach(field => {
      if (mode === 'create' && field.name === 'id') return
      if (field.admin.readOnly) return

      let fieldSchema: z.ZodType

      switch (field.type) {
        case 'text':
        case 'textarea':
          fieldSchema = z.string()
          if (field.type === 'email') fieldSchema = z.string().email()
          break
        case 'number':
          fieldSchema = z.number()
          break
        case 'date':
          fieldSchema = z.date()
          break
        case 'checkbox':
          fieldSchema = z.boolean()
          break
        case 'select':
          fieldSchema = z.string()
          break
        case 'relationship':
          fieldSchema = field.relationship?.hasMany ? z.array(z.string()) : z.string()
          break
        case 'array':
          fieldSchema = z.array(z.any())
          break
        case 'group':
          fieldSchema = z.record(z.any())
          break
        default:
          fieldSchema = z.any()
      }

      if (!field.required && mode === 'update') {
        fieldSchema = fieldSchema.optional()
      } else if (field.required) {
        fieldSchema = fieldSchema as any // Remove optional if required
      }

      schema[field.name] = fieldSchema
    })

    return z.object(schema)
  }

  private buildFilterSchema(collectionName: string): z.ZodObject<any> {
    return z.object({
      search: z.string().optional(),
      status: z.string().optional(),
      dateFrom: z.date().optional(),
      dateTo: z.date().optional(),
      limit: z.number().min(1).max(100).optional(),
      offset: z.number().min(0).optional(),
      sortBy: z.string().optional(),
      sortOrder: z.enum(['asc', 'desc']).optional()
    })
  }
}

// =============================================================================
// COLLECTION GENERATOR
// =============================================================================

export class CollectionGenerator {
  private parsers: Map<string, CollectionParser> = new Map()

  registerCollection(collection: CollectionConfig): void {
    const parser = new CollectionParser(collection)
    this.parsers.set(collection.slug, parser)
  }

  generateAll(): Map<string, GeneratedCollection> {
    const generated = new Map<string, GeneratedCollection>()

    this.parsers.forEach((parser, slug) => {
      generated.set(slug, parser.parse())
    })

    return generated
  }

  generateCollection(slug: string): GeneratedCollection | null {
    const parser = this.parsers.get(slug)
    return parser ? parser.parse() : null
  }

  generateTypeScriptFiles(): Map<string, string> {
    const files = new Map<string, string>()

    this.parsers.forEach((parser, slug) => {
      const generated = parser.parse()

      // Generate types file
      const typesContent = this.generateTypesFile(generated)
      files.set(`types/${slug}.ts`, typesContent)

      // Generate service file
      const serviceContent = this.generateServiceFile(generated)
      files.set(`services/${slug}.ts`, serviceContent)

      // Generate validation file
      const validationContent = this.generateValidationFile(generated)
      files.set(`validation/${slug}.ts`, validationContent)
    })

    return files
  }

  private generateTypesFile(generated: GeneratedCollection): string {
    return `// =============================================================================
// ${generated.name.toUpperCase()} TYPES - Auto-generated from collection definition
// =============================================================================

${generated.typescript.interface}

${generated.typescript.createInput}

${generated.typescript.updateInput}

${generated.typescript.filterInput}

${generated.typescript.sortInput}

// Export convenience types
export type ${generated.name} = ${generated.name}
export type Create${generated.name} = Create${generated.name}Input
export type Update${generated.name} = Update${generated.name}Input
export type ${generated.name}Filter = ${generated.name}FilterInput
export type ${generated.name}Sort = ${generated.name}SortInput`
  }

  private generateServiceFile(generated: GeneratedCollection): string {
    const methods = generated.service.methods.map(method =>
      `  async ${method.name}(${method.parameters.join(', ')}): ${method.returnType} {
${method.implementation.split('\n').map(line => `    ${line}`).join('\n')}
  }`
    ).join('\n\n')

    return `// =============================================================================
// ${generated.service.className.toUpperCase()} - Auto-generated service
// =============================================================================

import { supabase } from '@/lib/supabase'
import { ${generated.name}, Create${generated.name}, Update${generated.name} } from '@/types/${generated.slug}'

export class ${generated.service.className} {
  private tableName = '${generated.slug}'

${methods}

  // Additional utility methods
  async count(filters?: any): Promise<number> {
    const query = supabase.from(this.tableName).select('*', { count: 'exact', head: true })

    // Apply filters if provided
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          query.eq(key, value)
        }
      })
    }

    const { count, error } = await query
    if (error) throw error
    return count || 0
  }

  async exists(id: string): Promise<boolean> {
    const { data, error } = await supabase
      .from(this.tableName)
      .select('id')
      .eq('id', id)
      .single()

    if (error && error.code !== 'PGRST116') throw error
    return !!data
  }
}

export const ${generated.name.toLowerCase()}Service = new ${generated.service.className}()
export default ${generated.service.className}`
  }

  private generateValidationFile(generated: GeneratedCollection): string {
    return `// =============================================================================
// ${generated.name.toUpperCase()} VALIDATION - Auto-generated schemas
// =============================================================================

import { z } from 'zod'

// Create schema
export const create${generated.name}Schema = ${this.zodObjectToString(generated.validation.createSchema)}

// Update schema
export const update${generated.name}Schema = ${this.zodObjectToString(generated.validation.updateSchema)}

// Filter schema
export const ${generated.name.toLowerCase()}FilterSchema = ${this.zodObjectToString(generated.validation.filterSchema)}

// Convenience functions
export function validateCreate${generated.name}(data: unknown) {
  return create${generated.name}Schema.safeParse(data)
}

export function validateUpdate${generated.name}(data: unknown) {
  return update${generated.name}Schema.safeParse(data)
}

export function validate${generated.name}Filter(data: unknown) {
  return ${generated.name.toLowerCase()}FilterSchema.safeParse(data)
}`
  }

  private zodObjectToString(schema: z.ZodObject<any>): string {
    // This is a simplified representation - in a real implementation,
    // you'd need to properly serialize the Zod schema
    return 'z.object({})'
  }
}

// =============================================================================
// USAGE EXAMPLES
// =============================================================================

/*
// Example usage:
import { Appointments } from '@/collections/Appointments'
import { CollectionGenerator } from '@/lib/collection-generator'

const generator = new CollectionGenerator()
generator.registerCollection(Appointments)

const generated = generator.generateAll()
const appointmentService = generated.get('appointments')?.service

// Generate all files
const files = generator.generateTypeScriptFiles()
// files now contains all generated TypeScript files
*/
