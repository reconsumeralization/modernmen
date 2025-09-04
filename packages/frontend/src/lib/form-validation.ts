import { z } from 'zod'
import { errorMonitor, ErrorCategory, ErrorSeverity } from './error-monitoring'

// Common validation schemas
export const ValidationSchemas = {
  // Email validation
  email: z.string()
    .min(1, 'Email is required')
    .email('Invalid email format')
    .max(254, 'Email is too long'),

  // Password validation
  password: z.string()
    .min(8, 'Password must be at least 8 characters')
    .max(128, 'Password is too long')
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, 'Password must contain at least one lowercase letter, one uppercase letter, and one number'),

  // Phone number validation
  phone: z.string()
    .min(10, 'Phone number must be at least 10 digits')
    .max(15, 'Phone number is too long')
    .regex(/^[\+]?[1-9][\d]{0,14}$/, 'Invalid phone number format'),

  // Name validation
  name: z.string()
    .min(2, 'Name must be at least 2 characters')
    .max(100, 'Name is too long')
    .regex(/^[a-zA-Z\s\-'\.]+$/, 'Name can only contain letters, spaces, hyphens, apostrophes, and periods'),

  // Array validation with bounds checking
  array: (minLength: number = 0, maxLength: number = 1000) =>
    z.array(z.any())
      .min(minLength, `Array must contain at least ${minLength} items`)
      .max(maxLength, `Array cannot contain more than ${maxLength} items`),

  // Index validation for arrays
  arrayIndex: (arrayLength: number) =>
    z.number()
      .int('Index must be an integer')
      .min(0, 'Index cannot be negative')
      .max(arrayLength - 1, `Index cannot be greater than ${arrayLength - 1}`),

  // Date validation
  date: z.date()
    .refine((date) => date >= new Date('1900-01-01'), 'Date cannot be before 1900')
    .refine((date) => date <= new Date('2100-01-01'), 'Date cannot be after 2100'),

  // Future date validation
  futureDate: z.date()
    .refine((date) => date > new Date(), 'Date must be in the future'),

  // Past date validation
  pastDate: z.date()
    .refine((date) => date < new Date(), 'Date must be in the past'),

  // URL validation
  url: z.string()
    .url('Invalid URL format')
    .max(2048, 'URL is too long'),

  // File size validation
  fileSize: (maxSizeInBytes: number) =>
    z.number()
      .max(maxSizeInBytes, `File size cannot exceed ${Math.round(maxSizeInBytes / 1024 / 1024)}MB`),

  // Positive number validation
  positiveNumber: z.number()
    .positive('Value must be positive'),

  // Non-negative number validation
  nonNegativeNumber: z.number()
    .min(0, 'Value cannot be negative'),

  // Percentage validation
  percentage: z.number()
    .min(0, 'Percentage cannot be less than 0')
    .max(100, 'Percentage cannot be greater than 100'),

  // Currency validation
  currency: z.number()
    .min(0, 'Amount cannot be negative')
    .max(999999.99, 'Amount is too large')
    .refine((val) => Number(val.toFixed(2)) === val, 'Amount can only have 2 decimal places')
}

// Validation result interface
export interface ValidationResult<T = any> {
  success: boolean
  data?: T
  errors?: ValidationError[]
  errorCount: number
}

export interface ValidationError {
  field: string
  message: string
  code: string
  value?: any
  path?: string[]
}

// Enhanced validation function with error monitoring
export async function validateWithMonitoring<T>(
  schema: z.ZodSchema<T>,
  data: unknown,
  context: string = 'validation'
): Promise<ValidationResult<T>> {
  try {
    const validData = schema.parse(data)
    return {
      success: true,
      data: validData,
      errorCount: 0
    }
  } catch (error) {
    if (error instanceof z.ZodError) {
      const validationErrors: ValidationError[] = error.errors.map(err => ({
        field: err.path.join('.'),
        message: err.message,
        code: err.code,
        value: err.received,
        path: err.path
      }))

      // Monitor validation errors
      await errorMonitor.captureError(
        new Error(`Validation failed: ${validationErrors.length} errors`),
        {
          component: context,
          action: 'validation',
          metadata: {
            errorCount: validationErrors.length,
            errors: validationErrors.slice(0, 5) // Limit to first 5 errors
          }
        },
        ['validation', 'form']
      )

      return {
        success: false,
        errors: validationErrors,
        errorCount: validationErrors.length
      }
    }

    // Handle unexpected errors
    await errorMonitor.captureError(
      error instanceof Error ? error : new Error(String(error)),
      {
        component: context,
        action: 'validation_unexpected_error'
      },
      ['validation', 'unexpected']
    )

    return {
      success: false,
      errors: [{
        field: 'unknown',
        message: 'An unexpected validation error occurred',
        code: 'VALIDATION_UNEXPECTED'
      }],
      errorCount: 1
    }
  }
}

// Safe form data extraction with validation
export class SafeFormHandler {
  private formData: FormData
  private context: string

  constructor(formData: FormData, context: string = 'form') {
    this.formData = formData
    this.context = context
  }

  // Safely get string value
  getString(key: string, defaultValue: string = ''): string {
    try {
      const value = this.formData.get(key)
      return typeof value === 'string' ? value : defaultValue
    } catch (error) {
      errorMonitor.captureError(
        error instanceof Error ? error : new Error(String(error)),
        {
          component: this.context,
          action: 'form_data_extraction',
          metadata: { key, type: 'string' }
        },
        ['form', 'extraction', 'string']
      )
      return defaultValue
    }
  }

  // Safely get number value
  getNumber(key: string, defaultValue: number = 0): number {
    try {
      const value = this.formData.get(key)
      const numValue = typeof value === 'string' ? parseFloat(value) : NaN
      return isNaN(numValue) ? defaultValue : numValue
    } catch (error) {
      errorMonitor.captureError(
        error instanceof Error ? error : new Error(String(error)),
        {
          component: this.context,
          action: 'form_data_extraction',
          metadata: { key, type: 'number' }
        },
        ['form', 'extraction', 'number']
      )
      return defaultValue
    }
  }

  // Safely get boolean value
  getBoolean(key: string, defaultValue: boolean = false): boolean {
    try {
      const value = this.formData.get(key)
      if (typeof value === 'string') {
        return value.toLowerCase() === 'true' || value === '1'
      }
      return defaultValue
    } catch (error) {
      errorMonitor.captureError(
        error instanceof Error ? error : new Error(String(error)),
        {
          component: this.context,
          action: 'form_data_extraction',
          metadata: { key, type: 'boolean' }
        },
        ['form', 'extraction', 'boolean']
      )
      return defaultValue
    }
  }

  // Safely get file
  getFile(key: string): File | null {
    try {
      const value = this.formData.get(key)
      return value instanceof File ? value : null
    } catch (error) {
      errorMonitor.captureError(
        error instanceof Error ? error : new Error(String(error)),
        {
          component: this.context,
          action: 'form_data_extraction',
          metadata: { key, type: 'file' }
        },
        ['form', 'extraction', 'file']
      )
      return null
    }
  }

  // Safely get multiple files
  getFiles(key: string): File[] {
    try {
      const files = this.formData.getAll(key)
      return files.filter((file): file is File => file instanceof File)
    } catch (error) {
      errorMonitor.captureError(
        error instanceof Error ? error : new Error(String(error)),
        {
          component: this.context,
          action: 'form_data_extraction',
          metadata: { key, type: 'files' }
        },
        ['form', 'extraction', 'files']
      )
      return []
    }
  }

  // Validate entire form with schema
  async validate<T>(schema: z.ZodSchema<T>): Promise<ValidationResult<T>> {
    try {
      const formObject: Record<string, any> = {}

      // Convert FormData to object
      for (const [key, value] of this.formData.entries()) {
        if (value instanceof File) {
          formObject[key] = value
        } else {
          formObject[key] = value
        }
      }

      return await validateWithMonitoring(schema, formObject, this.context)
    } catch (error) {
      await errorMonitor.captureError(
        error instanceof Error ? error : new Error(String(error)),
        {
          component: this.context,
          action: 'form_validation'
        },
        ['form', 'validation', 'error']
      )

      return {
        success: false,
        errors: [{
          field: 'form',
          message: 'Form validation failed',
          code: 'FORM_VALIDATION_ERROR'
        }],
        errorCount: 1
      }
    }
  }
}

// Array validation utilities
export const ArrayValidators = {
  // Validate array index
  validateIndex: (index: number, array: any[], context: string = 'array'): void => {
    if (!Array.isArray(array)) {
      throw new Error(`Expected array in ${context}, got ${typeof array}`)
    }

    if (index < 0) {
      throw new Error(`Index ${index} is negative in ${context}`)
    }

    if (index >= array.length) {
      throw new Error(`Index ${index} is out of bounds for array of length ${array.length} in ${context}`)
    }
  },

  // Validate array is not empty
  validateNotEmpty: (array: any[], context: string = 'array'): void => {
    if (!Array.isArray(array)) {
      throw new Error(`Expected array in ${context}, got ${typeof array}`)
    }

    if (array.length === 0) {
      throw new Error(`Array is empty in ${context}`)
    }
  },

  // Safe array access with validation
  safeAccess: <T>(array: T[], index: number, context: string = 'array'): T => {
    ArrayValidators.validateIndex(index, array, context)
    return array[index]
  },

  // Safe array slice with validation
  safeSlice: <T>(array: T[], start: number, end?: number, context: string = 'array'): T[] => {
    if (!Array.isArray(array)) {
      throw new Error(`Expected array in ${context}, got ${typeof array}`)
    }

    const safeStart = Math.max(0, Math.min(start, array.length))
    const safeEnd = end === undefined ? array.length : Math.max(safeStart, Math.min(end, array.length))

    return array.slice(safeStart, safeEnd)
  }
}

// Object validation utilities
export const ObjectValidators = {
  // Validate object has required properties
  validateRequired: (obj: any, properties: string[], context: string = 'object'): void => {
    if (!obj || typeof obj !== 'object') {
      throw new Error(`Expected object in ${context}, got ${typeof obj}`)
    }

    const missing = properties.filter(prop => !(prop in obj) || obj[prop] == null)
    if (missing.length > 0) {
      throw new Error(`Missing required properties in ${context}: ${missing.join(', ')}`)
    }
  },

  // Safe property access with validation
  safeAccess: <T>(obj: any, path: string | string[], context: string = 'object'): T | null => {
    if (!obj || typeof obj !== 'object') {
      return null
    }

    const keys = Array.isArray(path) ? path : path.split('.')
    let current = obj

    for (const key of keys) {
      if (!current || typeof current !== 'object' || !(key in current)) {
        return null
      }
      current = current[key]
    }

    return current as T
  }
}

// Input sanitization utilities
export const Sanitizers = {
  // Sanitize string input
  string: (input: string, options: {
    maxLength?: number
    trim?: boolean
    lowercase?: boolean
    uppercase?: boolean
    allowedChars?: RegExp
  } = {}): string => {
    if (typeof input !== 'string') {
      return ''
    }

    let sanitized = input

    if (options.trim) {
      sanitized = sanitized.trim()
    }

    if (options.maxLength) {
      sanitized = sanitized.substring(0, options.maxLength)
    }

    if (options.lowercase) {
      sanitized = sanitized.toLowerCase()
    }

    if (options.uppercase) {
      sanitized = sanitized.toUpperCase()
    }

    if (options.allowedChars) {
      sanitized = sanitized.replace(options.allowedChars, '')
    }

    return sanitized
  },

  // Sanitize email
  email: (email: string): string => {
    return Sanitizers.string(email, {
      trim: true,
      lowercase: true,
      maxLength: 254
    })
  },

  // Sanitize phone number
  phone: (phone: string): string => {
    return phone.replace(/[^\d+\-\s()]/g, '').substring(0, 15)
  },

  // Sanitize HTML (basic)
  html: (html: string): string => {
    return html
      .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
      .replace(/<[^>]*>/g, '')
      .substring(0, 10000) // Limit length
  }
}

// Common validation patterns
export const ValidationPatterns = {
  // User registration
  userRegistration: z.object({
    email: ValidationSchemas.email,
    password: ValidationSchemas.password,
    firstName: ValidationSchemas.name,
    lastName: ValidationSchemas.name,
    phone: ValidationSchemas.phone.optional()
  }),

  // Appointment booking
  appointmentBooking: z.object({
    serviceId: z.string().min(1, 'Service is required'),
    stylistId: z.string().min(1, 'Stylist is required'),
    date: ValidationSchemas.futureDate,
    time: z.string().regex(/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Invalid time format'),
    customerName: ValidationSchemas.name,
    customerEmail: ValidationSchemas.email,
    customerPhone: ValidationSchemas.phone
  }),

  // Contact form
  contactForm: z.object({
    name: ValidationSchemas.name,
    email: ValidationSchemas.email,
    subject: z.string().min(5, 'Subject must be at least 5 characters').max(200, 'Subject is too long'),
    message: z.string().min(10, 'Message must be at least 10 characters').max(2000, 'Message is too long')
  }),

  // File upload
  fileUpload: z.object({
    file: z.instanceof(File),
    maxSize: z.number().optional(),
    allowedTypes: z.array(z.string()).optional()
  }).refine((data) => {
    if (data.maxSize && data.file.size > data.maxSize) {
      return false
    }
    if (data.allowedTypes && !data.allowedTypes.includes(data.file.type)) {
      return false
    }
    return true
  }, 'File validation failed')
}

export default {
  ValidationSchemas,
  validateWithMonitoring,
  SafeFormHandler,
  ArrayValidators,
  ObjectValidators,
  Sanitizers,
  ValidationPatterns
}
