// 🎯 Complete Validation Manager
import { z } from 'zod'
import { getPayload } from 'payload'
import { supabase } from './supabase'
import { logger } from './logger'

// 🎯 Core Validation Schemas
export const userSchema = z.object({
  email: z.string().email('Invalid email format'),
  name: z.string().min(1, 'Name is required').max(100, 'Name too long'),
  role: z.enum(['admin', 'manager', 'staff', 'barber', 'customer', 'client']),
  tenant: z.string().optional()
})

export const serviceSchema = z.object({
  name: z.string().min(1, 'Service name is required').max(100, 'Name too long'),
  description: z.string().optional(),
  price: z.number().min(0, 'Price must be positive'),
  duration: z.number().min(15, 'Duration must be at least 15 minutes').max(480, 'Duration too long'),
  category: z.string().optional(),
  image: z.string().optional()
})

export const customerSchema = z.object({
  firstName: z.string().min(1, 'First name is required').max(50, 'First name too long'),
  lastName: z.string().min(1, 'Last name is required').max(50, 'Last name too long'),
  email: z.string().email('Invalid email format'),
  phone: z.string().optional()
})

export const appointmentSchema = z.object({
  customer: z.string().min(1, 'Customer is required'),
  service: z.string().min(1, 'Service is required'),
  stylist: z.string().optional(),
  date: z.string().min(1, 'Date is required'),
  status: z.enum(['scheduled', 'completed', 'cancelled']).default('scheduled')
})

export const productSchema = z.object({
  name: z.string().min(1, 'Product name is required').max(100, 'Name too long'),
  description: z.string().optional(),
  price: z.number().min(0, 'Price must be positive'),
  category: z.string().optional(),
  brand: z.string().optional(),
  sku: z.string().optional(),
  inStock: z.boolean().default(true),
  featured: z.boolean().default(false)
})

export const locationSchema = z.object({
  name: z.string().min(1, 'Location name is required').max(100, 'Name too long'),
  address: z.string().optional(),
  phone: z.string().optional(),
  tenant: z.string().optional(),
  active: z.boolean().default(true)
})

export const pageSchema = z.object({
  title: z.string().min(1, 'Title is required').max(200, 'Title too long'),
  slug: z.string().min(1, 'Slug is required').max(100, 'Slug too long'),
  content: z.any(),
  excerpt: z.string().optional(),
  featuredImage: z.string().optional(),
  status: z.enum(['draft', 'published']).default('draft'),
  author: z.string().optional(),
  tenant: z.string().optional()
})

export const commissionSchema = z.object({
  stylist: z.string().min(1, 'Stylist is required'),
  totalSales: z.number().min(0, 'Sales must be positive'),
  commissionRate: z.number().min(0, 'Rate must be positive').max(1, 'Rate cannot exceed 100%'),
  commissionAmount: z.number().min(0, 'Amount must be positive'),
  status: z.enum(['pending', 'calculated', 'paid', 'cancelled']).default('pending'),
  paymentDate: z.string().optional(),
  notes: z.string().optional()
})

// 🎯 Validation Manager Class
export class ValidationManager {
  private static instance: ValidationManager
  private schemaMap: Map<string, z.ZodSchema> = new Map()

  private constructor() {
    this.initializeSchemas()
  }

  static getInstance(): ValidationManager {
    if (!ValidationManager.instance) {
      ValidationManager.instance = new ValidationManager()
    }
    return ValidationManager.instance
  }

  private initializeSchemas() {
    this.schemaMap.set('users', userSchema)
    this.schemaMap.set('services', serviceSchema)
    this.schemaMap.set('customers', customerSchema)
    this.schemaMap.set('appointments', appointmentSchema)
    this.schemaMap.set('products', productSchema)
    this.schemaMap.set('locations', locationSchema)
    this.schemaMap.set('pages', pageSchema)
    this.schemaMap.set('commissions', commissionSchema)
    this.schemaMap.set('inventory', this.createInventorySchema())
    this.schemaMap.set('notifications', this.createNotificationSchema())
  }

  private createInventorySchema() {
    return z.object({
      name: z.string().min(1, 'Name is required'),
      sku: z.string().optional(),
      category: z.string().optional(),
      currentStock: z.number().min(0, 'Stock cannot be negative'),
      lowStockThreshold: z.number().min(0, 'Threshold cannot be negative'),
      unitCost: z.number().min(0, 'Cost must be positive'),
      trackInventory: z.boolean().default(true)
    })
  }

  private createNotificationSchema() {
    return z.object({
      title: z.string().min(1, 'Title is required'),
      message: z.string().min(1, 'Message is required'),
      type: z.enum(['info', 'success', 'warning', 'error']),
      recipient: z.string().optional(),
      isRead: z.boolean().default(false),
      expiresAt: z.string().optional()
    })
  }

  // 🎯 Validate data against schema
  validateData(collection: string, data: any): { success: boolean; data?: any; errors?: z.ZodError } {
    const schema = this.schemaMap.get(collection)
    if (!schema) {
      return {
        success: false,
        errors: new z.ZodError([{
          code: 'custom',
          message: `No validation schema found for collection '${collection}'`,
          path: []
        }])
      }
    }

    try {
      const validatedData = schema.parse(data)
      return { success: true, data: validatedData }
    } catch (error) {
      return { success: false, errors: error as z.ZodError }
    }
  }

  // 🎯 Validate collection data
  async validateCollection(collection: string, limit: number = 100): Promise<ValidationResult> {
    logger.info(`🔍 Validating collection: ${collection}`)

    const result: ValidationResult = {
      collection,
      totalRecords: 0,
      validRecords: 0,
      invalidRecords: 0,
      errors: []
    }

    try {
      const payload = await getPayload()
      const data = await payload.find({
        collection,
        limit
      })

      result.totalRecords = data.docs.length

      for (const record of data.docs) {
        const validation = this.validateData(collection, record)
        if (validation.success) {
          result.validRecords++
        } else {
          result.invalidRecords++
          result.errors.push({
            id: record.id,
            errors: validation.errors!.issues.map(issue => ({
              field: issue.path.join('.'),
              message: issue.message,
              code: issue.code
            }))
          })
        }
      }

      logger.info(`✅ ${collection}: ${result.validRecords}/${result.totalRecords} records valid`)

    } catch (error) {
      logger.error(`❌ Failed to validate ${collection}:`, error)
      result.errors.push({
        id: 'system',
        errors: [{ field: 'system', message: error.message, code: 'system' }]
      })
    }

    return result
  }

  // 🎯 Validate all collections
  async validateAllCollections(): Promise<ValidationResults> {
    logger.info('🔍 Starting validation of all collections...')

    const results: ValidationResults = {
      timestamp: new Date().toISOString(),
      collections: [],
      summary: {
        totalCollections: 0,
        totalRecords: 0,
        totalValid: 0,
        totalInvalid: 0,
        collectionsWithErrors: 0
      }
    }

    const collections = Array.from(this.schemaMap.keys())

    for (const collection of collections) {
      const result = await this.validateCollection(collection)
      results.collections.push(result)

      results.summary.totalCollections++
      results.summary.totalRecords += result.totalRecords
      results.summary.totalValid += result.validRecords
      results.summary.totalInvalid += result.invalidRecords

      if (result.invalidRecords > 0) {
        results.summary.collectionsWithErrors++
      }
    }

    logger.info(`✅ Validation complete: ${results.summary.totalValid}/${results.summary.totalRecords} records valid`)

    return results
  }

  // 🎯 Cross-system validation
  async validateCrossSystem(): Promise<CrossValidationResult> {
    logger.info('🔄 Starting cross-system validation...')

    const result: CrossValidationResult = {
      timestamp: new Date().toISOString(),
      payloadToSupabase: [],
      supabaseToPayload: [],
      conflicts: []
    }

    try {
      const payload = await getPayload()
      const collections = Array.from(this.schemaMap.keys())

      for (const collection of collections) {
        // Compare record counts
        const payloadCount = await payload.find({
          collection,
          limit: 1,
          pagination: false
        })

        const { count: supabaseCount } = await supabase
          .from(collection)
          .select('*', { count: 'exact', head: true })

        if (payloadCount.totalDocs !== supabaseCount) {
          result.conflicts.push({
            collection,
            type: 'count_mismatch',
            payloadCount: payloadCount.totalDocs,
            supabaseCount: supabaseCount || 0
          })
        }

        // Check for orphaned records
        const payloadIds = new Set(payloadCount.docs.map((doc: any) => doc.id))
        const { data: supabaseRecords } = await supabase
          .from(collection)
          .select('id')

        const supabaseIds = new Set(supabaseRecords?.map(r => r.id) || [])

        const onlyInPayload = [...payloadIds].filter(id => !supabaseIds.has(id))
        const onlyInSupabase = [...supabaseIds].filter(id => !payloadIds.has(id))

        if (onlyInPayload.length > 0) {
          result.payloadToSupabase.push({
            collection,
            missingIds: onlyInPayload
          })
        }

        if (onlyInSupabase.length > 0) {
          result.supabaseToPayload.push({
            collection,
            missingIds: onlyInSupabase
          })
        }
      }

    } catch (error) {
      logger.error('❌ Cross-system validation failed:', error)
    }

    return result
  }

  // 🎯 Add custom validation schema
  addSchema(collection: string, schema: z.ZodSchema) {
    this.schemaMap.set(collection, schema)
  }

  // 🎯 Get schema for collection
  getSchema(collection: string): z.ZodSchema | undefined {
    return this.schemaMap.get(collection)
  }

  // 🎯 Validate single record
  validateRecord(collection: string, record: any): ValidationSingleResult {
    const validation = this.validateData(collection, record)
    return {
      collection,
      id: record.id,
      isValid: validation.success,
      errors: validation.errors?.issues.map(issue => ({
        field: issue.path.join('.'),
        message: issue.message,
        code: issue.code
      })) || []
    }
  }
}

// 🎯 Types
export interface ValidationResult {
  collection: string
  totalRecords: number
  validRecords: number
  invalidRecords: number
  errors: Array<{
    id: string
    errors: Array<{
      field: string
      message: string
      code: string
    }>
  }>
}

export interface ValidationResults {
  timestamp: string
  collections: ValidationResult[]
  summary: {
    totalCollections: number
    totalRecords: number
    totalValid: number
    totalInvalid: number
    collectionsWithErrors: number
  }
}

export interface ValidationSingleResult {
  collection: string
  id: string
  isValid: boolean
  errors: Array<{
    field: string
    message: string
    code: string
  }>
}

export interface CrossValidationResult {
  timestamp: string
  payloadToSupabase: Array<{
    collection: string
    missingIds: string[]
  }>
  supabaseToPayload: Array<{
    collection: string
    missingIds: string[]
  }>
  conflicts: Array<{
    collection: string
    type: string
    payloadCount: number
    supabaseCount: number
  }>
}

// 🎯 Export singleton instance
export const validationManager = ValidationManager.getInstance()

// 🎯 Utility functions
export const validateData = (collection: string, data: any) =>
  validationManager.validateData(collection, data)

export const validateCollection = (collection: string, limit?: number) =>
  validationManager.validateCollection(collection, limit)

export const validateAllCollections = () =>
  validationManager.validateAllCollections()

export const validateCrossSystem = () =>
  validationManager.validateCrossSystem()

export const validateRecord = (collection: string, record: any) =>
  validationManager.validateRecord(collection, record)
