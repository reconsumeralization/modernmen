#!/usr/bin/env tsx

// 🎯 AMAZING Collection Types Generator - Handles Sub-Collections
import fs from 'fs'
import path from 'path'
import { CollectionConfig, Field } from 'payload'
import { logger } from '../src/lib/logger'
import { pathToFileURL } from 'url'

interface CollectionGroup {
  name: string
  collections: CollectionConfig[]
  path: string
}

interface TypeGenerationResult {
  success: boolean
  types: string
  errors: string[]
  collectionsFound: number
}

// Type guard to check if a field has a name property
function hasName(field: Field): field is Field & { name: string } {
  return 'name' in field && typeof (field as any).name === 'string'
}

// Type guard to check if a field has a required property
function hasRequired(field: Field): field is Field & { required?: boolean } {
  return 'required' in field
}

// Type guard to check if a field has admin property with readOnly
function hasReadOnlyAdmin(field: Field): field is Field & { admin?: { readOnly?: boolean } } {
  return 'admin' in field && field.admin !== undefined
}

class AmazingTypesGenerator {
  private projectRoot: string
  private collectionGroups: CollectionGroup[] = []
  private generatedTypes: Map<string, string> = new Map()

  constructor() {
    this.projectRoot = path.resolve(process.cwd())
  }

  // 🎯 Main generation function
  async generate(): Promise<void> {
    logger.info('🚀 Starting Amazing Collection Types Generation...')

    try {
      await this.stepDiscoverCollections()
      await this.stepAnalyzeCollections()
      await this.stepGenerateTypes()
      await this.stepWriteTypesFile()
      await this.stepValidateTypes()

      logger.info('✅ Amazing Collection Types Generation Complete!')
      this.showSuccessMessage()

    } catch (error) {
      logger.error('❌ Types generation failed:', {}, error instanceof Error ? error : new Error(String(error)))
      this.showErrorMessage(error)
      process.exit(1)
    }
  }

  private async stepDiscoverCollections(): Promise<void> {
    logger.info('🔍 Discovering collections across sub-directories...')

    const collectionDirs = [
      'commerce',
      'content',
      'crm',
      'staff',
      'system',
      'builder'
    ]

    // Check both main project and modernmen-yolo subdirectory
    const searchPaths = [
      path.join(this.projectRoot, 'src/payload/collections'),
      path.join(this.projectRoot, 'modernmen-yolo/src/payload/collections')
    ]

    for (const basePath of searchPaths) {
      if (!fs.existsSync(basePath)) continue

      logger.info(`🔍 Searching in: ${path.relative(this.projectRoot, basePath)}`)

      // Process files directly in basePath
      const baseFiles = fs.readdirSync(basePath)
        .filter(file => file.endsWith('.ts') && !file.endsWith('.d.ts') && !file.endsWith('.backup') && fs.lstatSync(path.join(basePath, file)).isFile());

      const baseCollections: CollectionConfig[] = [];
      for (const file of baseFiles) {
        const filePath = path.join(basePath, file);
        try {
          const absolutePath = path.resolve(filePath);
          const collectionModule = await import(absolutePath);
          const collection = collectionModule.default || collectionModule;

          if (this.isValidCollection(collection)) {
            baseCollections.push(collection);
            logger.info(`📄 Found collection: ${collection.slug} (${file})`);
          } else {
            logger.warn(`⚠️ Invalid collection in ${file}`, { file });
          }
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : String(error);
          logger.warn(`⚠️ Failed to import ${file}:`, { file, error: errorMessage });
        }
      }

      if (baseCollections.length > 0) {
        this.collectionGroups.push({
          name: 'general', // Or any other suitable name for the group
          collections: baseCollections,
          path: basePath
        });
        logger.info(`✅ Found ${baseCollections.length} collections in the root of ${path.relative(this.projectRoot, basePath)}`);
      }

      for (const dir of collectionDirs) {
        const dirPath = path.join(basePath, dir)

        if (fs.existsSync(dirPath)) {
          const files = fs.readdirSync(dirPath)
            .filter(file => file.endsWith('.ts') && !file.endsWith('.d.ts') && !file.endsWith('.backup'))

          const collections: CollectionConfig[] = []

          for (const file of files) {
            const filePath = path.join(dirPath, file)
            try {
              // Dynamic import of collection with absolute path
              const absolutePath = path.resolve(filePath)
          const fileUrl = pathToFileURL(absolutePath).href
          console.log(`Attempting to import: ${fileUrl}`)
          const collectionModule = await import(fileUrl)
          console.log(`Successfully imported: ${fileUrl}`)
              const collectionName = path.basename(file, '.ts')
              const collection = collectionModule.default || collectionModule[collectionName]

              if (this.isValidCollection(collection)) {
                console.log(`Collection is valid: ${collection.slug}`)
                collections.push(collection)
                logger.info(`📄 Found collection: ${collection.slug} (${file})`)
              } else {
                console.log(`Collection is NOT valid: ${file}`, collection)
                logger.warn(`⚠️ Invalid collection in ${file}`, { file })
              }
            } catch (error) {
              const errorMessage = error instanceof Error ? error.message : String(error)
              console.log(`Error importing ${file}: ${errorMessage}`)
              logger.warn(`⚠️ Failed to import ${file}:`, { file, error: errorMessage })
            }
          }

          if (collections.length > 0) {
            this.collectionGroups.push({
              name: dir,
              collections,
              path: dirPath
            })

            logger.info(`✅ Found ${collections.length} collections in ${dir}`)
          }
        }
      }
    }

    logger.info(`📊 Total collections discovered: ${this.collectionGroups.reduce((sum, group) => sum + group.collections.length, 0)}`)
  }

  private isValidCollection(obj: any): obj is CollectionConfig {
    return obj &&
           typeof obj === 'object' &&
           typeof obj.slug === 'string' &&
           Array.isArray(obj.fields)
  }

  private async stepAnalyzeCollections(): Promise<void> {
    logger.info('🔬 Analyzing collection structures...')

    for (const group of this.collectionGroups) {
      logger.info(`📋 Analyzing ${group.name} collections...`)

      for (const collection of group.collections) {
        try {
          const types = this.generateCollectionTypes(collection, group.name)
          const key = `${group.name}_${collection.slug}`
          this.generatedTypes.set(key, types)

          logger.info(`✅ Generated types for ${collection.slug}`)
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : String(error)
          logger.error(`❌ Failed to generate types for ${collection.slug}:`, { collection: collection.slug, error: errorMessage })
        }
      }
    }
  }

  private generateCollectionTypes(collection: CollectionConfig, groupName: string): string {
    const types: string[] = []

    // Collection interface
    types.push(`// ${groupName.toUpperCase()} - ${collection.slug}`)
    types.push(`export interface ${this.pascalCase(collection.slug)} {`)

    // Generate field types
    for (const field of collection.fields) {
      if (hasName(field)) {
        const fieldType = this.generateFieldType(field)
        const required = hasRequired(field) && field.required ? '' : '?'
        types.push(`  ${field.name}${required}: ${fieldType}`)
      }
    }

    types.push('}')
    types.push('')

    // Create/Update interfaces
    types.push(`export interface Create${this.pascalCase(collection.slug)} {`)
    for (const field of collection.fields) {
      if (hasName(field) && !(hasReadOnlyAdmin(field) && field.admin?.readOnly)) {
        const fieldType = this.generateFieldType(field)
        const required = hasRequired(field) && field.required ? '' : '?'
        types.push(`  ${field.name}${required}: ${fieldType}`)
      }
    }
    types.push('}')
    types.push('')

    types.push(`export interface Update${this.pascalCase(collection.slug)} extends Partial<Create${this.pascalCase(collection.slug)}> {`)
    types.push('  id: string')
    types.push('}')
    types.push('')

    return types.join('\n')
  }

  private quoteFieldName(fieldName: string): string {
    // Check if the fieldName starts with a number or contains special characters that require quoting
    if (/^[0-9]/.test(fieldName) || /[^a-zA-Z0-9_]/.test(fieldName)) {
      return `'${fieldName}'`;
    }
    return fieldName;
  }

  private generateFieldType(field: any): string {
    switch (field.type) {
      case 'text':
      case 'textarea':
      case 'email':
      case 'code':
        return 'string'

      case 'number':
        return 'number'

      case 'checkbox':
        return 'boolean'

      case 'date':
        return 'Date | string'

      case 'select':
        if (field.options && Array.isArray(field.options)) {
          const values = field.options.map((opt: any) => `'${opt.value}'`).join(' | ')
          return values || 'string'
        }
        return 'string'

      case 'relationship':
        if (field.relationTo) {
          if (Array.isArray(field.relationTo)) {
            return field.relationTo.map((rel: string) => this.pascalCase(rel)).join(' | ')
          }
          return this.pascalCase(field.relationTo)
        }
        return 'string'

      case 'array':
        if (field.fields) {
          const subFields = field.fields.map((subField: any) => {
            const subType = this.generateFieldType(subField)
            const required = subField.required ? '' : '?'
            return `  ${this.quoteFieldName(subField.name)}${required}: ${subType}`
          }).join('\n')
          return `Array<{\n${subFields}\n}>`
        }
        return 'any[]'

      case 'group':
        if (field.fields) {
          const subFields = field.fields.map((subField: any) => {
            const subType = this.generateFieldType(subField)
            const required = subField.required ? '' : '?'
            return `  ${this.quoteFieldName(subField.name)}${required}: ${subType}`
          }).join('\n')
          return `{\n${subFields}\n}`
        }
        return 'Record<string, any>'

      case 'json':
        return 'Record<string, any>'

      case 'upload':
        return 'Media'

      case 'richText':
        return 'any' // Could be more specific with lexical types

      default:
        return 'any'
    }
  }

  private pascalCase(str: string): string {
    return str
      .split(/[-_\s]+/)
      .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join('')
  }

  private async stepGenerateTypes(): Promise<void> {
    logger.info('🎯 Generating comprehensive type definitions...')

    // Generate main types file
    const mainTypes = this.generateMainTypesFile()

    // Write to temporary file first
    const tempPath = path.join(this.projectRoot, 'src/generated-collection-types.ts')
    fs.writeFileSync(tempPath, mainTypes)

    logger.info('✅ Type definitions generated')
  }

  private generateMainTypesFile(): string {
    const lines: string[] = []

    // Header
    lines.push('// 🎯 AMAZING Collection Types - Auto-generated')
    lines.push('// Do not edit this file manually - it will be overwritten')
    lines.push('// Generated by: scripts/generate-collection-types.ts')
    lines.push(`// Generated at: ${new Date().toISOString()}`)
    lines.push('')
    lines.push('// Base types')
    lines.push('export interface BaseCollection {')
    lines.push('  id: string')
    lines.push('  createdAt: Date')
    lines.push('  updatedAt: Date')
    lines.push('}')
    lines.push('')
    lines.push('export interface Media extends BaseCollection {')
    lines.push('  filename: string')
    lines.push('  mimeType: string')
    lines.push('  filesize: number')
    lines.push('  width?: number')
    lines.push('  height?: number')
    lines.push('  alt?: string')
    lines.push('  caption?: string')
    lines.push('}')
    lines.push('')

    // Group types by category
    const groupedTypes = new Map<string, string[]>()

    for (const [key, types] of this.generatedTypes) {
      const [group] = key.split('_')
      if (!groupedTypes.has(group)) {
        groupedTypes.set(group, [])
      }
      groupedTypes.get(group)!.push(types)
    }

    // Generate types by group
    for (const [group, groupTypes] of groupedTypes) {
      lines.push(`// ${group.toUpperCase()} COLLECTIONS`)
      lines.push(`// ========================================`)
      lines.push('')

      for (const types of groupTypes) {
        lines.push(types)
      }
    }

    // Generate union types
    lines.push('// UNION TYPES')
    lines.push('// ============')
    lines.push('')

    // All collections
    const allCollections = Array.from(this.generatedTypes.keys()).map(key => {
      const [group, slug] = key.split('_')
      return this.pascalCase(slug)
    })

    lines.push(`export type AllCollections = ${allCollections.join(' | ')}`)
    lines.push('')

    // Group-specific unions
    for (const [group, groupTypes] of groupedTypes) {
      const groupCollections = groupTypes.map(types => {
        const lines = types.split('\n')
        const interfaceLine = lines.find(line => line.startsWith('export interface '))
        if (interfaceLine) {
          const match = interfaceLine.match(/export interface (\w+)/)
          return match ? match[1] : null
        }
        return null
      }).filter(Boolean)

      if (groupCollections.length > 0) {
        lines.push(`export type ${this.pascalCase(group)}Collections = ${groupCollections.join(' | ')}`)
        lines.push('')
      }
    }

    return lines.join('\n')
  }

  private async stepWriteTypesFile(): Promise<void> {
    logger.info('💾 Writing types to final location...')

    const tempPath = path.join(this.projectRoot, 'src/generated-collection-types.ts')
    const finalPath = path.join(this.projectRoot, 'src/payload/generated-types.ts')

    // Ensure directory exists
    const dir = path.dirname(finalPath)
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true })
    }

    // Move file to final location
    fs.renameSync(tempPath, finalPath)

    logger.info('✅ Types file written to src/payload/generated-types.ts')
  }

  private async stepValidateTypes(): Promise<void> {
    logger.info('🔍 Validating generated types...')

    try {
      // Try to import the generated types
      const typesPath = path.join(this.projectRoot, 'src/payload/generated-types.ts')
      await import(typesPath)

      logger.info('✅ Types validation successful')
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error)
      logger.warn('⚠️ Types validation failed, but file was generated:', { error: errorMessage })
    }
  }

  private showSuccessMessage(): void {
    const totalCollections = this.collectionGroups.reduce((sum, group) => sum + group.collections.length, 0)
    const totalGroups = this.collectionGroups.length

    console.log('')
    console.log('🎉🎉🎉 AMAZING TYPES GENERATION COMPLETE! 🎉🎉🎉')
    console.log('')
    console.log('📊 Generation Summary:')
    console.log(`   📁 Collection Groups: ${totalGroups}`)
    console.log(`   📋 Total Collections: ${totalCollections}`)
    console.log(`   🎯 Generated Types: ${this.generatedTypes.size}`)
    console.log('')
    console.log('📂 Generated Files:')
    console.log('   📄 src/payload/generated-types.ts')
    console.log('')
    console.log('🏗️ Collection Groups Found:')
    for (const group of this.collectionGroups) {
      console.log(`   📁 ${group.name}: ${group.collections.length} collections`)
    }
    console.log('')
    console.log('🎯 Available Types:')
    console.log('   • AllCollections - Union of all collection types')
    for (const group of this.collectionGroups) {
      console.log(`   • ${this.pascalCase(group.name)}Collections - ${group.name} collection types`)
    }
    console.log('')
    console.log('💡 Usage Examples:')
    console.log('   import { Customer, Service, CreateAppointment } from \'@/payload/generated-types\'')
    console.log('   import type { CommerceCollections } from \'@/payload/generated-types\'')
    console.log('')
    console.log('🔄 Next Steps:')
    console.log('   1. Import types in your components')
    console.log('   2. Update existing type imports')
    console.log('   3. Run your TypeScript checker')
    console.log('')
    console.log('🎨 Happy Coding with Amazing Types! 🚀')
    console.log('')
  }

  private showErrorMessage(error: any): void {
    console.log('')
    console.log('❌❌❌ TYPES GENERATION ENCOUNTERED ERRORS ❌❌❌')
    console.log('')
    console.log('Error:', error instanceof Error ? error.message : String(error))
    console.log('')
    console.log('🔧 Troubleshooting:')
    console.log('  1. Check that all collection files are valid TypeScript')
    console.log('  2. Ensure collection exports are correct')
    console.log('  3. Verify Payload configuration is valid')
    console.log('')
    console.log('📞 Need help?')
    console.log('  • Check the generated file for syntax errors')
    console.log('  • Run individual collection imports to debug')
    console.log('  • Check Payload documentation for field types')
    console.log('')
  }
}

// 🎯 Command line interface
async function main() {
  const args = process.argv.slice(2)
  const options: any = {}

  // Parse command line arguments
  args.forEach(arg => {
    if (arg === '--dry-run') options.dryRun = true
    if (arg === '--verbose') options.verbose = true
    if (arg.startsWith('--output=')) {
      options.output = arg.split('=')[1]
    }
  })

  const generator = new AmazingTypesGenerator()
  await generator.generate()
}

// 🎯 Run if called directly
if (require.main === module) {
  main().catch(console.error)
}

// 🎯 Export for programmatic use
export { AmazingTypesGenerator }
