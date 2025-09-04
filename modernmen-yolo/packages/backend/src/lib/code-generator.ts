import * as fs from 'fs'
import * as path from 'path'
import { CollectionConfig } from 'payload/types'
import { ServiceConfig } from './dynamic-service-generator'

// =============================================================================
// CODE GENERATOR
// =============================================================================
// Automatically generates TypeScript types, services, API routes, and validation
// schemas from Payload CMS collection definitions.

export interface CodeGenerationOptions {
  outputDir: string
  collections: CollectionConfig[]
  generateTypes?: boolean
  generateServices?: boolean
  generateRoutes?: boolean
  generateValidation?: boolean
  generateTests?: boolean
  overwriteExisting?: boolean
  baseUrl?: string
}

export interface GeneratedFiles {
  types: Map<string, string>
  services: Map<string, string>
  routes: Map<string, string>
  validation: Map<string, string>
  tests: Map<string, string>
}

export class CodeGenerator {
  private options: CodeGenerationOptions

  constructor(options: CodeGenerationOptions) {
    this.options = {
      generateTypes: true,
      generateServices: true,
      generateRoutes: true,
      generateValidation: true,
      generateTests: false,
      overwriteExisting: false,
      baseUrl: '/api',
      ...options
    }
  }

  async generate(): Promise<GeneratedFiles> {
    const result: GeneratedFiles = {
      types: new Map(),
      services: new Map(),
      routes: new Map(),
      validation: new Map(),
      tests: new Map()
    }

    // Ensure output directory exists
    this.ensureDirectoryExists(this.options.outputDir)

    for (const collection of this.options.collections) {
      const collectionName = this.slugToPascalCase(collection.slug)

      if (this.options.generateTypes) {
        const types = this.generateTypes(collection)
        result.types.set(collection.slug, types)
        this.writeFile(`types/${collection.slug}.ts`, types)
      }

      if (this.options.generateServices) {
        const service = this.generateService(collection)
        result.services.set(collection.slug, service)
        this.writeFile(`services/${collection.slug}.ts`, service)
      }

      if (this.options.generateRoutes) {
        const route = this.generateRoute(collection)
        result.routes.set(collection.slug, route)
        this.writeFile(`routes/${collection.slug}.ts`, route)
      }

      if (this.options.generateValidation) {
        const validation = this.generateValidation(collection)
        result.validation.set(collection.slug, validation)
        this.writeFile(`validation/${collection.slug}.ts`, validation)
      }

      if (this.options.generateTests) {
        const test = this.generateTest(collection)
        result.tests.set(collection.slug, test)
        this.writeFile(`tests/${collection.slug}.test.ts`, test)
      }
    }

    // Generate index files
    this.generateIndexFiles(result)

    return result
  }

  private generateTypes(collection: CollectionConfig): string {
    const collectionName = this.slugToPascalCase(collection.slug)
    const fields = this.parseFields(collection.fields)

    const interfaceFields = fields.map(field => {
      const optional = field.required ? '' : '?'
      return `  ${field.name}${optional}: ${field.type}`
    }).join('\n')

    const createFields = fields
      .filter(field => field.name !== 'id' && !field.readOnly)
      .map(field => `  ${field.name}${field.required ? '' : '?'}: ${field.type}`)
      .join('\n')

    const updateFields = fields
      .filter(field => field.name !== 'id')
      .map(field => `  ${field.name}?: ${field.type}`)
      .join('\n')

    return `// =============================================================================
// ${collectionName.toUpperCase()} TYPES - Auto-generated from collection
// =============================================================================

export interface ${collectionName} {
${interfaceFields}
  createdAt: Date
  updatedAt: Date
}

export interface Create${collectionName}Input {
${createFields}
}

export interface Update${collectionName}Input {
${updateFields}
}

export interface ${collectionName}FilterInput {
  search?: string
  status?: string
  dateFrom?: Date
  dateTo?: Date
  limit?: number
  offset?: number
  sortBy?: string
  sortOrder?: 'asc' | 'desc'
}

export interface ${collectionName}SortInput {
  field: string
  direction: 'asc' | 'desc'
}

// Export convenience types
export type ${collectionName}Create = Create${collectionName}Input
export type ${collectionName}Update = Update${collectionName}Input
export type ${collectionName}Filter = ${collectionName}FilterInput
export type ${collectionName}Sort = ${collectionName}SortInput`
  }

  private generateService(collection: CollectionConfig): string {
    const collectionName = this.slugToPascalCase(collection.slug)
    const serviceName = `${collectionName}Service`
    const config = this.generateServiceConfig(collection)

    return `// =============================================================================
// ${serviceName.toUpperCase()} - Auto-generated service
// =============================================================================

import { ServiceFactory, DynamicService } from '@/lib/dynamic-service-generator'
import { ${collectionName}, Create${collectionName}, Update${collectionName} } from '@/types/${collection.slug}'

const ${serviceName.toLowerCase()}Config = ${JSON.stringify(config, null, 2)}

export class ${serviceName} extends DynamicService<${collectionName}> {
  constructor() {
    super(${serviceName.toLowerCase()}Config)
  }

  // Custom methods can be added here
  async findUpcoming(limit = 10): Promise<${collectionName}[]> {
    const result = await this.findMany({
      filters: [
        { field: 'status', operator: 'eq', value: 'confirmed' },
        { field: 'appointment_date', operator: 'gte', value: new Date() }
      ],
      sorting: [{ field: 'appointment_date', direction: 'asc' }],
      pagination: { limit }
    })
    return result.data
  }

  async findByCustomer(customerId: string): Promise<${collectionName}[]> {
    const result = await this.findMany({
      filters: [
        { field: 'customer_id', operator: 'eq', value: customerId }
      ],
      sorting: [{ field: 'appointment_date', direction: 'desc' }]
    })
    return result.data
  }

  async getStats(): Promise<{
    total: number
    confirmed: number
    pending: number
    cancelled: number
    completed: number
  }> {
    const [total, confirmed, pending, cancelled, completed] = await Promise.all([
      this.count(),
      this.count([{ field: 'status', operator: 'eq', value: 'confirmed' }]),
      this.count([{ field: 'status', operator: 'eq', value: 'pending' }]),
      this.count([{ field: 'status', operator: 'eq', value: 'cancelled' }]),
      this.count([{ field: 'status', operator: 'eq', value: 'completed' }])
    ])

    return { total, confirmed, pending, cancelled, completed }
  }
}

export const ${serviceName.toLowerCase()} = new ${serviceName}()
export default ${serviceName}`
  }

  private generateRoute(collection: CollectionConfig): string {
    const collectionName = this.slugToPascalCase(collection.slug)
    const serviceName = `${collectionName}Service`

    return `// =============================================================================
// ${collectionName.toUpperCase()} API ROUTES - Auto-generated
// =============================================================================

import { NextRequest, NextResponse } from 'next/server'
import { ${serviceName.toLowerCase()} } from '@/services/${collection.slug}'
import { validate${collectionName}Filter } from '@/validation/${collection.slug}'

// GET /api/${collection.slug}
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)

    // Parse query parameters
    const filters = []
    const search = searchParams.get('search')
    const status = searchParams.get('status')
    const dateFrom = searchParams.get('dateFrom')
    const dateTo = searchParams.get('dateTo')
    const limit = parseInt(searchParams.get('limit') || '10')
    const offset = parseInt(searchParams.get('offset') || '0')
    const sortBy = searchParams.get('sortBy') || 'createdAt'
    const sortOrder = (searchParams.get('sortOrder') || 'desc') as 'asc' | 'desc'

    if (status) {
      filters.push({ field: 'status', operator: 'eq', value: status })
    }

    if (dateFrom) {
      filters.push({ field: 'createdAt', operator: 'gte', value: new Date(dateFrom) })
    }

    if (dateTo) {
      filters.push({ field: 'createdAt', operator: 'lte', value: new Date(dateTo) })
    }

    const result = await ${serviceName.toLowerCase()}.findMany({
      search,
      filters,
      sorting: [{ field: sortBy, direction: sortOrder }],
      pagination: { limit, offset: offset / limit + 1 }
    })

    return NextResponse.json({
      success: true,
      data: result.data,
      pagination: {
        page: Math.floor(offset / limit) + 1,
        limit,
        total: result.total,
        totalPages: result.totalPages
      }
    })
  } catch (error) {
    console.error('Error fetching ${collection.slug}:', error)
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to fetch ${collection.slug}'
      },
      { status: 500 }
    )
  }
}

// POST /api/${collection.slug}
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    const result = await ${serviceName.toLowerCase()}.create(body)

    return NextResponse.json({
      success: true,
      data: result
    }, { status: 201 })
  } catch (error) {
    console.error('Error creating ${collection.slug}:', error)
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to create ${collection.slug}'
      },
      { status: 400 }
    )
  }
}

// Dynamic route handlers for individual items
// GET /api/${collection.slug}/[id]
export async function GET_BY_ID(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params
    const include = request.nextUrl.searchParams.get('include')?.split(',') || []

    const result = await ${serviceName.toLowerCase()}.findById(id, include)

    if (!result) {
      return NextResponse.json(
        { success: false, error: 'Not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      data: result
    })
  } catch (error) {
    console.error('Error fetching ${collection.slug}:', error)
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to fetch ${collection.slug}'
      },
      { status: 500 }
    )
  }
}

// PUT /api/${collection.slug}/[id]
export async function PUT_BY_ID(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params
    const body = await request.json()

    const result = await ${serviceName.toLowerCase()}.update(id, body)

    return NextResponse.json({
      success: true,
      data: result
    })
  } catch (error) {
    console.error('Error updating ${collection.slug}:', error)
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to update ${collection.slug}'
      },
      { status: 400 }
    )
  }
}

// DELETE /api/${collection.slug}/[id]
export async function DELETE_BY_ID(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params

    await ${serviceName.toLowerCase()}.delete(id)

    return NextResponse.json({
      success: true,
      message: '${collection.slug} deleted successfully'
    })
  } catch (error) {
    console.error('Error deleting ${collection.slug}:', error)
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to delete ${collection.slug}'
      },
      { status: 400 }
    )
  }
}`
  }

  private generateValidation(collection: CollectionConfig): string {
    const collectionName = this.slugToPascalCase(collection.slug)
    const fields = this.parseFields(collection.fields)

    const createFields = fields
      .filter(field => field.name !== 'id' && !field.readOnly)
      .map(field => `  ${field.name}: ${this.getZodType(field)}`)
      .join(',\n')

    const updateFields = fields
      .filter(field => field.name !== 'id')
      .map(field => `  ${field.name}: ${this.getZodType(field)}.optional()`)
      .join(',\n')

    return `// =============================================================================
// ${collectionName.toUpperCase()} VALIDATION - Auto-generated schemas
// =============================================================================

import { z } from 'zod'

// Create schema
export const create${collectionName}Schema = z.object({
${createFields}
})

// Update schema
export const update${collectionName}Schema = z.object({
${updateFields}
})

// Filter schema
export const ${collectionName.toLowerCase()}FilterSchema = z.object({
  search: z.string().optional(),
  status: z.string().optional(),
  dateFrom: z.date().optional(),
  dateTo: z.date().optional(),
  limit: z.number().min(1).max(100).optional(),
  offset: z.number().min(0).optional(),
  sortBy: z.string().optional(),
  sortOrder: z.enum(['asc', 'desc']).optional()
})

// Convenience functions
export function validateCreate${collectionName}(data: unknown) {
  return create${collectionName}Schema.safeParse(data)
}

export function validateUpdate${collectionName}(data: unknown) {
  return update${collectionName}Schema.safeParse(data)
}

export function validate${collectionName}Filter(data: unknown) {
  return ${collectionName.toLowerCase()}FilterSchema.safeParse(data)
}`
  }

  private generateTest(collection: CollectionConfig): string {
    const collectionName = this.slugToPascalCase(collection.slug)
    const serviceName = `${collectionName}Service`

    return `// =============================================================================
// ${collectionName.toUpperCase()} SERVICE TESTS - Auto-generated
// =============================================================================

import { ${serviceName.toLowerCase()} } from '@/services/${collection.slug}'
import { Create${collectionName}, Update${collectionName} } from '@/types/${collection.slug}'

describe('${serviceName}', () => {
  const testData: Create${collectionName} = {
    // Add test data based on collection fields
    name: 'Test ${collectionName}',
    // Add other required fields here
  }

  let createdId: string

  describe('CRUD Operations', () => {
    test('should create a new ${collection.slug}', async () => {
      const result = await ${serviceName.toLowerCase()}.create(testData)
      expect(result).toBeDefined()
      expect(result.id).toBeDefined()
      createdId = result.id
    })

    test('should find by id', async () => {
      const result = await ${serviceName.toLowerCase()}.findById(createdId)
      expect(result).toBeDefined()
      expect(result?.id).toBe(createdId)
    })

    test('should update ${collection.slug}', async () => {
      const updateData: Update${collectionName} = {
        name: 'Updated Test ${collectionName}'
      }
      const result = await ${serviceName.toLowerCase()}.update(createdId, updateData)
      expect(result).toBeDefined()
      expect(result.name).toBe('Updated Test ${collectionName}')
    })

    test('should find many ${collection.slug}', async () => {
      const result = await ${serviceName.toLowerCase()}.findMany({
        pagination: { page: 1, limit: 10 }
      })
      expect(result).toBeDefined()
      expect(Array.isArray(result.data)).toBe(true)
      expect(result.total).toBeGreaterThanOrEqual(0)
    })

    test('should delete ${collection.slug}', async () => {
      const result = await ${serviceName.toLowerCase()}.delete(createdId)
      expect(result).toBe(true)

      // Verify it's deleted
      const deleted = await ${serviceName.toLowerCase()}.findById(createdId)
      expect(deleted).toBeNull()
    })
  })

  describe('Search and Filter', () => {
    test('should search ${collection.slug}', async () => {
      const result = await ${serviceName.toLowerCase()}.search('test')
      expect(result).toBeDefined()
      expect(Array.isArray(result.data)).toBe(true)
    })

    test('should count ${collection.slug}', async () => {
      const count = await ${serviceName.toLowerCase()}.count()
      expect(typeof count).toBe('number')
      expect(count).toBeGreaterThanOrEqual(0)
    })
  })

  describe('Relationships', () => {
    test('should load relationships', async () => {
      // This test depends on the collection having relationships
      // Add specific relationship tests based on collection structure
    })
  })
})`
  }

  private generateServiceConfig(collection: CollectionConfig): ServiceConfig {
    return {
      tableName: collection.slug,
      primaryKey: 'id',
      searchableFields: this.getSearchableFields(collection.fields),
      filterableFields: this.getFilterableFields(collection.fields),
      sortableFields: this.getSortableFields(collection.fields),
      relationships: this.getRelationships(collection.fields),
      cache: {
        enabled: true,
        ttl: 300000 // 5 minutes
      },
      realtime: {
        enabled: true,
        events: ['INSERT', 'UPDATE', 'DELETE']
      }
    }
  }

  private generateIndexFiles(result: GeneratedFiles): void {
    // Generate types index
    let typesIndex = '// =============================================================================\n'
    typesIndex += '// GENERATED TYPES INDEX\n'
    typesIndex += '// =============================================================================\n\n'

    for (const [slug] of result.types) {
      typesIndex += `export * from './${slug}'\n`
    }

    this.writeFile('types/index.ts', typesIndex)

    // Generate services index
    let servicesIndex = '// =============================================================================\n'
    servicesIndex += '// GENERATED SERVICES INDEX\n'
    servicesIndex += '// =============================================================================\n\n'

    for (const [slug] of result.services) {
      servicesIndex += `export * from './${slug}'\n`
    }

    this.writeFile('services/index.ts', servicesIndex)
  }

  // =============================================================================
  // UTILITY METHODS
  // =============================================================================

  private parseFields(fields: any[]): any[] {
    return fields.map(field => ({
      name: field.name,
      type: this.mapFieldType(field.type),
      required: field.required || false,
      readOnly: field.admin?.readOnly || false,
      defaultValue: field.defaultValue
    }))
  }

  private mapFieldType(fieldType: string): string {
    const typeMap: Record<string, string> = {
      text: 'string',
      textarea: 'string',
      email: 'string',
      number: 'number',
      date: 'Date',
      checkbox: 'boolean',
      select: 'string',
      relationship: 'string',
      array: 'any[]',
      group: 'Record<string, any>',
      upload: 'string',
      richText: 'string',
      json: 'any',
      point: '{ lat: number; lng: number }'
    }
    return typeMap[fieldType] || 'any'
  }

  private getZodType(field: any): string {
    switch (field.type) {
      case 'text':
      case 'textarea':
        return 'z.string()'
      case 'email':
        return 'z.string().email()'
      case 'number':
        return 'z.number()'
      case 'date':
        return 'z.date()'
      case 'checkbox':
        return 'z.boolean()'
      case 'select':
        return 'z.string()'
      case 'relationship':
        return 'z.string()'
      case 'array':
        return 'z.array(z.any())'
      case 'group':
        return 'z.record(z.any())'
      default:
        return 'z.any()'
    }
  }

  private getSearchableFields(fields: any[]): string[] {
    return fields
      .filter(field => ['text', 'textarea', 'email'].includes(field.type))
      .map(field => field.name)
  }

  private getFilterableFields(fields: any[]): string[] {
    return fields
      .filter(field => ['select', 'checkbox', 'relationship'].includes(field.type))
      .map(field => field.name)
  }

  private getSortableFields(fields: any[]): string[] {
    return ['createdAt', 'updatedAt', ...fields.map(field => field.name)]
  }

  private getRelationships(fields: any[]): any[] {
    return fields
      .filter(field => field.type === 'relationship')
      .map(field => ({
        name: field.name,
        type: field.hasMany ? 'hasMany' : 'belongsTo',
        foreignKey: `${field.name}_id`,
        relatedTable: field.relationTo
      }))
  }

  private slugToPascalCase(slug: string): string {
    return slug
      .split('-')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join('')
  }

  private ensureDirectoryExists(dirPath: string): void {
    const fullPath = path.join(this.options.outputDir, dirPath)
    if (!fs.existsSync(fullPath)) {
      fs.mkdirSync(fullPath, { recursive: true })
    }
  }

  private writeFile(filePath: string, content: string): void {
    const fullPath = path.join(this.options.outputDir, filePath)

    if (!this.options.overwriteExisting && fs.existsSync(fullPath)) {
      console.log(`Skipping ${filePath} (file already exists)`)
      return
    }

    fs.writeFileSync(fullPath, content, 'utf8')
    console.log(`Generated ${filePath}`)
  }
}

// =============================================================================
// USAGE EXAMPLES
// =============================================================================

/*
// Basic usage:
import { CodeGenerator } from '@/lib/code-generator'
import { Appointments, Services, Customers } from '@/collections'

const generator = new CodeGenerator({
  outputDir: './generated',
  collections: [Appointments, Services, Customers],
  generateTypes: true,
  generateServices: true,
  generateRoutes: true,
  generateValidation: true
})

const result = await generator.generate()
// This will generate all types, services, routes, and validation files
*/
