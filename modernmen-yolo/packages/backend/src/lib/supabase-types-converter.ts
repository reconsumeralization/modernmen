import { CollectionConfig } from 'payload/types'
import { Field } from 'payload/types'

// =============================================================================
// SUPABASE TYPES TO COLLECTIONS CONVERTER
// =============================================================================
// Converts Supabase generated TypeScript types into Payload CMS collections
// Supports reverse-engineering existing databases into manageable collections

export interface SupabaseTypeDefinition {
  Tables: Record<string, SupabaseTableDefinition>
  Views: Record<string, SupabaseViewDefinition>
  Functions: Record<string, SupabaseFunctionDefinition>
  Enums: Record<string, string[]>
  CompositeTypes: Record<string, SupabaseCompositeType>
}

export interface SupabaseTableDefinition {
  Row: Record<string, any>
  Insert: Record<string, any>
  Update: Record<string, any>
  Relationships: SupabaseRelationship[]
}

export interface SupabaseViewDefinition {
  Row: Record<string, any>
  Relationships: SupabaseRelationship[]
}

export interface SupabaseFunctionDefinition {
  Args: Record<string, any>
  Returns: any
}

export interface SupabaseCompositeType {
  [key: string]: any
}

export interface SupabaseRelationship {
  foreignKeyName: string
  columns: string[]
  isOneToOne: boolean
  referencedRelation: string
  referencedColumns: string[]
}

export class SupabaseTypesConverter {
  private types: SupabaseTypeDefinition

  constructor(types: SupabaseTypeDefinition) {
    this.types = types
  }

  // =============================================================================
  // MAIN CONVERSION METHODS
  // =============================================================================

  convertToCollections(): CollectionConfig[] {
    const collections: CollectionConfig[] = []

    // Convert each table to a collection
    Object.entries(this.types.Tables).forEach(([tableName, tableDef]) => {
      const collection = this.convertTableToCollection(tableName, tableDef)
      if (collection) {
        collections.push(collection)
      }
    })

    return collections
  }

  convertToViews(): CollectionConfig[] {
    const collections: CollectionConfig[] = []

    // Convert views to read-only collections
    Object.entries(this.types.Views).forEach(([viewName, viewDef]) => {
      const collection = this.convertViewToCollection(viewName, viewDef)
      if (collection) {
        collections.push(collection)
      }
    })

    return collections
  }

  private convertTableToCollection(
    tableName: string,
    tableDef: SupabaseTableDefinition
  ): CollectionConfig | null {
    try {
      const fields = this.convertRowToFields(tableDef.Row, tableName)

      // Skip system tables
      if (this.isSystemTable(tableName)) {
        return null
      }

      const collection: CollectionConfig = {
        slug: this.tableNameToSlug(tableName),
        admin: {
          useAsTitle: this.guessTitleField(fields),
          defaultColumns: this.guessDefaultColumns(fields)
        },
        fields,
        timestamps: this.hasTimestamps(tableDef.Row),
        access: {
          create: 'authenticated',
          read: 'authenticated',
          update: 'authenticated',
          delete: 'authenticated'
        }
      }

      return collection
    } catch (error) {
      console.error(`Error converting table ${tableName}:`, error)
      return null
    }
  }

  private convertViewToCollection(
    viewName: string,
    viewDef: SupabaseViewDefinition
  ): CollectionConfig | null {
    try {
      const fields = this.convertRowToFields(viewDef.Row, viewName)

      const collection: CollectionConfig = {
        slug: this.tableNameToSlug(viewName),
        admin: {
          useAsTitle: this.guessTitleField(fields),
          defaultColumns: this.guessDefaultColumns(fields),
          description: 'Read-only view'
        },
        fields,
        timestamps: false,
        access: {
          create: 'adminOnly', // Views are read-only
          read: 'authenticated',
          update: 'adminOnly',
          delete: 'adminOnly'
        }
      }

      return collection
    } catch (error) {
      console.error(`Error converting view ${viewName}:`, error)
      return null
    }
  }

  // =============================================================================
  // FIELD CONVERSION
  // =============================================================================

  private convertRowToFields(row: Record<string, any>, tableName: string): Field[] {
    const fields: Field[] = []

    Object.entries(row).forEach(([columnName, columnType]) => {
      // Skip system columns
      if (this.isSystemColumn(columnName)) {
        return
      }

      const field = this.convertColumnToField(columnName, columnType, tableName)
      if (field) {
        fields.push(field)
      }
    })

    return fields
  }

  private convertColumnToField(
    columnName: string,
    columnType: any,
    tableName: string
  ): Field | null {
    // Handle array types
    if (Array.isArray(columnType)) {
      return this.convertArrayColumn(columnName, columnType)
    }

    // Handle enum types
    if (typeof columnType === 'string' && columnType.startsWith('enum.')) {
      return this.convertEnumColumn(columnName, columnType)
    }

    // Handle relationship types (UUIDs that reference other tables)
    if (columnType === 'string' && this.isForeignKey(columnName, tableName)) {
      return this.convertRelationshipColumn(columnName, tableName)
    }

    // Handle basic types
    return this.convertBasicColumn(columnName, columnType)
  }

  private convertBasicColumn(columnName: string, columnType: any): Field {
    let fieldType: string
    let fieldConfig: any = {
      name: columnName,
      label: this.columnNameToLabel(columnName),
      required: false
    }

    // Determine field type based on TypeScript type
    switch (columnType) {
      case 'string':
        fieldType = this.guessStringFieldType(columnName)
        break
      case 'number':
        fieldType = 'number'
        break
      case 'boolean':
        fieldType = 'checkbox'
        break
      case 'Date':
        fieldType = 'date'
        break
      case 'Json':
        fieldType = 'json'
        break
      default:
        fieldType = 'text'
    }

    fieldConfig.type = fieldType

    // Add validation for specific field types
    if (fieldType === 'email' && columnName.includes('email')) {
      fieldConfig.validate = (value: string) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        return emailRegex.test(value) || 'Please enter a valid email address'
      }
    }

    return fieldConfig
  }

  private convertArrayColumn(columnName: string, arrayType: any[]): Field {
    return {
      name: columnName,
      label: this.columnNameToLabel(columnName),
      type: 'array',
      fields: [
        {
          name: 'value',
          type: this.guessArrayElementType(arrayType[0])
        }
      ]
    }
  }

  private convertEnumColumn(columnName: string, enumType: string): Field {
    const enumName = enumType.replace('enum.', '')
    const enumValues = this.types.Enums[enumName] || []

    return {
      name: columnName,
      label: this.columnNameToLabel(columnName),
      type: 'select',
      options: enumValues,
      required: false
    }
  }

  private convertRelationshipColumn(columnName: string, tableName: string): Field | null {
    const relationship = this.findRelationship(tableName, columnName)
    if (!relationship) {
      return null
    }

    return {
      name: columnName,
      label: this.columnNameToLabel(columnName),
      type: 'relationship',
      relationTo: this.tableNameToSlug(relationship.referencedRelation),
      required: false,
      hasMany: !relationship.isOneToOne
    }
  }

  // =============================================================================
  // HELPER METHODS
  // =============================================================================

  private isSystemTable(tableName: string): boolean {
    const systemTables = [
      'schema_migrations',
      'pg_stat',
      'pg_buffercache',
      'pg_catalog',
      'information_schema'
    ]

    return systemTables.some(sysTable =>
      tableName.includes(sysTable) || tableName.startsWith('pg_')
    )
  }

  private isSystemColumn(columnName: string): boolean {
    const systemColumns = [
      'id',
      'created_at',
      'updated_at',
      'deleted_at',
      'created_by',
      'updated_by'
    ]

    return systemColumns.includes(columnName)
  }

  private isForeignKey(columnName: string, tableName: string): boolean {
    const tableDef = this.types.Tables[tableName]
    if (!tableDef) return false

    return tableDef.Relationships.some(rel =>
      rel.columns.includes(columnName)
    )
  }

  private findRelationship(tableName: string, columnName: string): SupabaseRelationship | null {
    const tableDef = this.types.Tables[tableName]
    if (!tableDef) return null

    return tableDef.Relationships.find(rel =>
      rel.columns.includes(columnName)
    ) || null
  }

  private hasTimestamps(row: Record<string, any>): boolean {
    return 'created_at' in row && 'updated_at' in row
  }

  private guessTitleField(fields: Field[]): string {
    // Try common title fields
    const titleCandidates = ['title', 'name', 'subject', 'label']
    const titleField = fields.find(field =>
      titleCandidates.some(candidate => field.name.includes(candidate))
    )

    return titleField?.name || fields[0]?.name || 'id'
  }

  private guessDefaultColumns(fields: Field[]): string[] {
    const defaultColumns = []
    const preferredColumns = ['name', 'title', 'email', 'status', 'created_at']

    for (const preferred of preferredColumns) {
      const field = fields.find(f => f.name === preferred)
      if (field) {
        defaultColumns.push(field.name)
        if (defaultColumns.length >= 3) break
      }
    }

    // Add remaining fields if we don't have enough
    if (defaultColumns.length < 3) {
      for (const field of fields) {
        if (!defaultColumns.includes(field.name)) {
          defaultColumns.push(field.name)
          if (defaultColumns.length >= 5) break
        }
      }
    }

    return defaultColumns.slice(0, 5)
  }

  private guessStringFieldType(columnName: string): string {
    if (columnName.includes('email')) return 'email'
    if (columnName.includes('url')) return 'text' // Could be URL field
    if (columnName.includes('description') || columnName.includes('content')) return 'textarea'
    if (columnName.includes('password')) return 'password'
    return 'text'
  }

  private guessArrayElementType(elementType: any): string {
    if (typeof elementType === 'string') {
      if (elementType === 'string') return 'text'
      if (elementType === 'number') return 'number'
      if (elementType === 'boolean') return 'checkbox'
    }
    return 'text'
  }

  private tableNameToSlug(tableName: string): string {
    return tableName
      .replace(/[^a-zA-Z0-9_]/g, '_')
      .replace(/_+/g, '_')
      .replace(/^_|_$/g, '')
      .toLowerCase()
  }

  private columnNameToLabel(columnName: string): string {
    return columnName
      .split('_')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ')
  }

  // =============================================================================
  // BATCH CONVERSION METHODS
  // =============================================================================

  static convertTypesFile(typesContent: string): CollectionConfig[] {
    try {
      // Parse the TypeScript types file
      const types = this.parseTypesFile(typesContent)
      const converter = new SupabaseTypesConverter(types)
      return converter.convertToCollections()
    } catch (error) {
      console.error('Error converting types file:', error)
      return []
    }
  }

  static convertTypesObject(types: SupabaseTypeDefinition): CollectionConfig[] {
    const converter = new SupabaseTypesConverter(types)
    return converter.convertToCollections()
  }

  private static parseTypesFile(content: string): SupabaseTypeDefinition {
    // This is a simplified parser - in production you'd want a proper TypeScript AST parser
    const types: SupabaseTypeDefinition = {
      Tables: {},
      Views: {},
      Functions: {},
      Enums: {},
      CompositeTypes: {}
    }

    // Basic parsing logic - would need to be more sophisticated for complex types
    const tableMatches = content.match(/Tables\s*=\s*{([^}]*)}/s)
    if (tableMatches) {
      // Parse table definitions
    }

    return types
  }

  // =============================================================================
  // VALIDATION METHODS
  // =============================================================================

  validateCollections(collections: CollectionConfig[]): {
    valid: boolean
    errors: string[]
    warnings: string[]
  } {
    const errors: string[] = []
    const warnings: string[] = []

    collections.forEach((collection, index) => {
      // Check required fields
      if (!collection.slug) {
        errors.push(`Collection ${index}: slug is required`)
      }

      if (!collection.fields || collection.fields.length === 0) {
        errors.push(`Collection ${collection.slug || index}: must have at least one field`)
      }

      // Check for duplicate slugs
      const duplicateSlug = collections.find((c, i) =>
        i !== index && c.slug === collection.slug
      )
      if (duplicateSlug) {
        errors.push(`Duplicate slug: ${collection.slug}`)
      }

      // Validate field configurations
      collection.fields?.forEach((field, fieldIndex) => {
        if (!field.name) {
          errors.push(`Collection ${collection.slug}: field ${fieldIndex} missing name`)
        }

        if (!field.type) {
          errors.push(`Collection ${collection.slug}: field ${field.name} missing type`)
        }

        // Check relationship fields
        if (field.type === 'relationship' && !field.relationTo) {
          warnings.push(`Collection ${collection.slug}: relationship field ${field.name} missing relationTo`)
        }
      })
    })

    return {
      valid: errors.length === 0,
      errors,
      warnings
    }
  }
}

// =============================================================================
// SUPABASE TO PAYLOAD MIGRATION HELPER
// =============================================================================

export class SupabaseMigrationHelper {
  static async migrateData(
    supabaseClient: any,
    collections: CollectionConfig[],
    batchSize: number = 1000
  ): Promise<{
    success: boolean
    migratedRecords: number
    errors: string[]
  }> {
    const results = {
      success: true,
      migratedRecords: 0,
      errors: [] as string[]
    }

    for (const collection of collections) {
      try {
        console.log(`Migrating data for collection: ${collection.slug}`)

        // Get data from Supabase
        const { data, error } = await supabaseClient
          .from(collection.slug)
          .select('*')

        if (error) {
          results.errors.push(`Failed to fetch data for ${collection.slug}: ${error.message}`)
          results.success = false
          continue
        }

        if (!data || data.length === 0) {
          console.log(`No data to migrate for ${collection.slug}`)
          continue
        }

        // Migrate data in batches
        for (let i = 0; i < data.length; i += batchSize) {
          const batch = data.slice(i, i + batchSize)

          // Transform data to match Payload format
          const transformedBatch = batch.map((record: any) =>
            this.transformRecordForPayload(record, collection)
          )

          // Insert into Payload (this would need to be adapted based on your Payload setup)
          // await payload.create({ collection: collection.slug, data: transformedBatch })

          results.migratedRecords += batch.length
        }

        console.log(`✅ Migrated ${data.length} records for ${collection.slug}`)
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error'
        results.errors.push(`Failed to migrate ${collection.slug}: ${errorMessage}`)
        results.success = false
      }
    }

    return results
  }

  private static transformRecordForPayload(record: any, collection: CollectionConfig): any {
    const transformed: any = { ...record }

    // Transform relationships
    collection.fields.forEach(field => {
      if (field.type === 'relationship' && field.relationTo) {
        const foreignKey = `${field.relationTo}_id`
        if (record[foreignKey]) {
          transformed[field.name] = {
            relationTo: field.relationTo,
            value: record[foreignKey]
          }
          delete transformed[foreignKey]
        }
      }
    })

    // Remove system fields that Payload handles automatically
    delete transformed.id
    delete transformed.created_at
    delete transformed.updated_at

    return transformed
  }

  static generateMigrationSQL(
    oldSchema: string,
    newSchema: string,
    collections: CollectionConfig[]
  ): string {
    const migrations: string[] = []

    // Generate schema change migrations
    collections.forEach(collection => {
      const tableName = collection.slug

      // Rename table if schema changed
      if (oldSchema !== newSchema) {
        migrations.push(
          `ALTER TABLE ${oldSchema}.${tableName} SET SCHEMA ${newSchema};`
        )
      }

      // Add new columns
      collection.fields.forEach(field => {
        migrations.push(
          `ALTER TABLE ${newSchema}.${tableName} ADD COLUMN IF NOT EXISTS ${field.name} ${this.getPostgresType(field)};`
        )
      })
    })

    return migrations.join('\n')
  }

  private static getPostgresType(field: Field): string {
    switch (field.type) {
      case 'text':
      case 'textarea':
      case 'email':
        return 'TEXT'
      case 'number':
        return 'INTEGER'
      case 'date':
        return 'TIMESTAMP WITH TIME ZONE'
      case 'checkbox':
        return 'BOOLEAN DEFAULT false'
      case 'relationship':
        return field.hasMany ? 'UUID[]' : 'UUID'
      case 'array':
        return 'JSONB DEFAULT \'[]\'::jsonb'
      default:
        return 'TEXT'
    }
  }
}

// =============================================================================
// USAGE EXAMPLES
// =============================================================================

/*
// Convert Supabase types file to collections
import fs from 'fs'
import { SupabaseTypesConverter } from './supabase-types-converter'

const typesContent = fs.readFileSync('./supabase-types.ts', 'utf-8')
const collections = SupabaseTypesConverter.convertTypesFile(typesContent)

// Validate collections
const converter = new SupabaseTypesConverter(types)
const validation = converter.validateCollections(collections)

if (validation.valid) {
  console.log('✅ All collections are valid')
} else {
  console.error('❌ Validation errors:', validation.errors)
}

// Migrate data from Supabase to Payload
import { createClient } from '@supabase/supabase-js'
import { SupabaseMigrationHelper } from './supabase-migration-helper'

const supabase = createClient(url, key)
const migrationResult = await SupabaseMigrationHelper.migrateData(
  supabase,
  collections
)

console.log(`Migrated ${migrationResult.migratedRecords} records`)
*/
