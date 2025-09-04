/**
 * Advanced Validation System for ModernMen Barbershop
 * Comprehensive form validation, business rules, and data integrity checks
 */

import { z } from 'zod'
import { toast } from 'sonner'

// Custom error classes for validation
export class ValidationError extends Error {
  constructor(
    message: string,
    public field?: string,
    public value?: any,
    public rule?: string
  ) {
    super(message)
    this.name = 'ValidationError'
  }
}

export class BusinessRuleError extends Error {
  constructor(
    message: string,
    public rule: string,
    public context?: any
  ) {
    super(message)
    this.name = 'BusinessRuleError'
  }
}

// Validation result interfaces
export interface ValidationResult {
  isValid: boolean
  errors: FieldError[]
  warnings: FieldWarning[]
}

export interface FieldError {
  field: string
  message: string
  value?: any
  rule?: string
}

export interface FieldWarning {
  field: string
  message: string
  value?: any
}

// Base validator schema definitions using Zod
const phoneRegex = /^[\+]?[(]?[\d\s\-\(\)]{10,}$/
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

// Customer information schema
export const customerInfoSchema = z.object({
  firstName: z.string()
    .min(1, 'First name is required')
    .min(2, 'First name must be at least 2 characters')
    .max(50, 'First name must be less than 50 characters')
    .regex(/^[a-zA-Z\s\-']+$/, 'First name can only contain letters, spaces, hyphens, and apostrophes'),
  
  lastName: z.string()
    .min(1, 'Last name is required')
    .min(2, 'Last name must be at least 2 characters')
    .max(50, 'Last name must be less than 50 characters')
    .regex(/^[a-zA-Z\s\-']+$/, 'Last name can only contain letters, spaces, hyphens, and apostrophes'),
  
  email: z.string()
    .min(1, 'Email is required')
    .email('Please enter a valid email address')
    .max(100, 'Email must be less than 100 characters')
    .toLowerCase(),
  
  phone: z.string()
    .min(1, 'Phone number is required')
    .regex(phoneRegex, 'Please enter a valid phone number')
    .transform(val => val.replace(/\D/g, '')), // Remove non-digits
  
  dateOfBirth: z.string()
    .optional()
    .refine((val) => {
      if (!val) return true
      const date = new Date(val)
      const today = new Date()
      const age = today.getFullYear() - date.getFullYear()
      return age >= 16 && age <= 100
    }, 'Age must be between 16 and 100'),
  
  preferences: z.object({
    communicationMethod: z.enum(['email', 'sms', 'both']).default('email'),
    marketingOptIn: z.boolean().default(false),
    appointmentReminders: z.boolean().default(true)
  }).optional()
})

// Booking form schema
export const bookingFormSchema = z.object({
  serviceId: z.string()
    .min(1, 'Please select a service'),
  
  barberId: z.string()
    .min(1, 'Please select a barber'),
  
  date: z.string()
    .min(1, 'Please select a date')
    .refine((val) => {
      const selectedDate = new Date(val)
      const today = new Date()
      today.setHours(0, 0, 0, 0)
      return selectedDate >= today
    }, 'Date cannot be in the past')
    .refine((val) => {
      const selectedDate = new Date(val)
      const maxDate = new Date()
      maxDate.setMonth(maxDate.getMonth() + 3) // 3 months ahead
      return selectedDate <= maxDate
    }, 'Date cannot be more than 3 months in advance'),
  
  time: z.string()
    .min(1, 'Please select a time')
    .regex(/^\d{1,2}:\d{2}\s?(AM|PM)$/i, 'Invalid time format'),
  
  duration: z.number()
    .min(15, 'Minimum appointment duration is 15 minutes')
    .max(180, 'Maximum appointment duration is 3 hours'),
  
  notes: z.string()
    .max(500, 'Notes must be less than 500 characters')
    .optional(),
  
  customerInfo: customerInfoSchema.optional()
})

// Payment information schema
export const paymentInfoSchema = z.object({
  amount: z.number()
    .min(0, 'Amount must be positive')
    .max(500, 'Amount cannot exceed $500'),
  
  paymentMethod: z.enum(['card', 'cash', 'gift_card'], {
    errorMap: () => ({ message: 'Please select a valid payment method' })
  }),
  
  cardInfo: z.object({
    last4: z.string().length(4).optional(),
    brand: z.string().optional(),
    token: z.string().min(1, 'Payment token is required')
  }).optional(),
  
  giftCardCode: z.string().optional()
}).refine((data) => {
  if (data.paymentMethod === 'card' && !data.cardInfo?.token) {
    return false
  }
  if (data.paymentMethod === 'gift_card' && !data.giftCardCode) {
    return false
  }
  return true
}, {
  message: 'Required payment information is missing'
})

class ValidationSystem {
  /**
   * Validate customer information
   */
  validateCustomerInfo(data: any): ValidationResult {
    return this.validateWithSchema(customerInfoSchema, data, 'Customer Information')
  }

  /**
   * Validate booking form data
   */
  validateBookingForm(data: any): ValidationResult {
    const result = this.validateWithSchema(bookingFormSchema, data, 'Booking Form')
    
    // Add business rule validations
    const businessValidation = this.validateBookingBusinessRules(data)
    result.errors.push(...businessValidation.errors)
    result.warnings.push(...businessValidation.warnings)
    result.isValid = result.isValid && businessValidation.errors.length === 0
    
    return result
  }

  /**
   * Validate payment information
   */
  validatePaymentInfo(data: any): ValidationResult {
    return this.validateWithSchema(paymentInfoSchema, data, 'Payment Information')
  }

  /**
   * Validate business rules for booking
   */
  private validateBookingBusinessRules(data: any): { errors: FieldError[], warnings: FieldWarning[] } {
    const errors: FieldError[] = []
    const warnings: FieldWarning[] = []

    // Check if booking is within business hours
    if (data.time) {
      const time = this.parseTime(data.time)
      const businessStart = 9 // 9 AM
      const businessEnd = 21 // 9 PM

      if (time < businessStart || time > businessEnd) {
        errors.push({
          field: 'time',
          message: 'Selected time is outside business hours (9 AM - 9 PM)',
          value: data.time,
          rule: 'business_hours'
        })
      }
    }

    // Check if booking is on a valid day
    if (data.date) {
      const selectedDate = new Date(data.date)
      const dayOfWeek = selectedDate.getDay()
      
      // Assuming closed on Mondays (day 1)
      if (dayOfWeek === 1) {
        errors.push({
          field: 'date',
          message: 'We are closed on Mondays. Please select another date.',
          value: data.date,
          rule: 'closed_day'
        })
      }

      // Warn about weekend pricing
      if (dayOfWeek === 0 || dayOfWeek === 6) {
        warnings.push({
          field: 'date',
          message: 'Weekend appointments may have additional charges.',
          value: data.date
        })
      }
    }

    // Validate service and barber compatibility
    if (data.serviceId && data.barberId) {
      const compatibility = this.checkServiceBarberCompatibility(data.serviceId, data.barberId)
      if (!compatibility.compatible) {
        warnings.push({
          field: 'barberId',
          message: compatibility.message || 'This barber may not specialize in the selected service.',
          value: data.barberId
        })
      }
    }

    return { errors, warnings }
  }

  /**
   * Validate email format with additional checks
   */
  validateEmail(email: string): { isValid: boolean, message?: string } {
    if (!email) {
      return { isValid: false, message: 'Email is required' }
    }

    if (!emailRegex.test(email)) {
      return { isValid: false, message: 'Please enter a valid email address' }
    }

    // Check for common typos in domains
    const commonDomains = ['gmail.com', 'yahoo.com', 'outlook.com', 'hotmail.com']
    const domain = email.split('@')[1]?.toLowerCase()
    
    if (domain) {
      // Suggest corrections for common typos
      if (domain === 'gmai.com' || domain === 'gmial.com') {
        return { isValid: false, message: 'Did you mean gmail.com?' }
      }
      if (domain === 'yaho.com' || domain === 'yahooo.com') {
        return { isValid: false, message: 'Did you mean yahoo.com?' }
      }
    }

    return { isValid: true }
  }

  /**
   * Validate phone number with formatting
   */
  validatePhone(phone: string): { isValid: boolean, formatted?: string, message?: string } {
    if (!phone) {
      return { isValid: false, message: 'Phone number is required' }
    }

    // Remove all non-digit characters
    const digits = phone.replace(/\D/g, '')

    // Check length
    if (digits.length < 10) {
      return { isValid: false, message: 'Phone number must have at least 10 digits' }
    }

    if (digits.length > 11) {
      return { isValid: false, message: 'Phone number cannot have more than 11 digits' }
    }

    // Format phone number
    let formatted: string
    if (digits.length === 10) {
      formatted = `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6)}`
    } else if (digits.length === 11 && digits[0] === '1') {
      formatted = `+1 (${digits.slice(1, 4)}) ${digits.slice(4, 7)}-${digits.slice(7)}`
    } else {
      return { isValid: false, message: 'Invalid phone number format' }
    }

    return { isValid: true, formatted }
  }

  /**
   * Real-time field validation
   */
  validateField(field: string, value: any, schema: z.ZodObject<any>): FieldError | null {
    try {
      const fieldSchema = schema.shape[field]
      if (!fieldSchema) return null

      fieldSchema.parse(value)
      return null
    } catch (error) {
      if (error instanceof z.ZodError) {
        return {
          field,
          message: error.errors[0]?.message || 'Invalid value',
          value,
          rule: error.errors[0]?.code
        }
      }
      return {
        field,
        message: 'Validation error',
        value
      }
    }
  }

  /**
   * Check for duplicate bookings
   */
  async validateUniqueBooking(customerId: string, date: string, time: string): Promise<ValidationResult> {
    // In a real application, this would check against the database
    // For now, simulate with a mock check
    
    const errors: FieldError[] = []
    const warnings: FieldWarning[] = []

    try {
      // Mock API call to check for existing bookings
      const hasExistingBooking = false // This would be the actual check
      
      if (hasExistingBooking) {
        errors.push({
          field: 'time',
          message: 'You already have an appointment at this time. Please select a different time.',
          value: time,
          rule: 'duplicate_booking'
        })
      }

      // Check for close bookings (within 2 hours)
      const hasCloseBooking = false // This would check for bookings within 2 hours
      
      if (hasCloseBooking) {
        warnings.push({
          field: 'time',
          message: 'You have another appointment within 2 hours of this time.',
          value: time
        })
      }

    } catch (error) {
      errors.push({
        field: 'general',
        message: 'Unable to verify booking availability. Please try again.',
        rule: 'validation_error'
      })
    }

    return {
      isValid: errors.length === 0,
      errors,
      warnings
    }
  }

  /**
   * Comprehensive form validation with user feedback
   */
  async validateCompleteBookingForm(data: any): Promise<ValidationResult> {
    const schemaValidation = this.validateBookingForm(data)
    
    // Add async validations if needed
    if (schemaValidation.isValid && data.customerId) {
      const uniqueValidation = await this.validateUniqueBooking(
        data.customerId,
        data.date,
        data.time
      )
      
      schemaValidation.errors.push(...uniqueValidation.errors)
      schemaValidation.warnings.push(...uniqueValidation.warnings)
      schemaValidation.isValid = schemaValidation.isValid && uniqueValidation.isValid
    }

    return schemaValidation
  }

  /**
   * Display validation results to user
   */
  displayValidationResults(result: ValidationResult, options: {
    showToast?: boolean
    focusFirstError?: boolean
  } = {}): void {
    const { showToast = true, focusFirstError = true } = options

    if (!result.isValid && result.errors.length > 0) {
      if (showToast) {
        if (result.errors.length === 1) {
          toast.error(result.errors[0].message)
        } else {
          toast.error(`Please fix ${result.errors.length} field errors`)
        }
      }

      // Focus first error field
      if (focusFirstError && typeof document !== 'undefined') {
        const firstErrorField = result.errors[0]?.field
        if (firstErrorField) {
          const element = document.getElementById(firstErrorField) || 
                          document.querySelector(`[name="${firstErrorField}"]`)
          if (element && 'focus' in element) {
            (element as HTMLElement).focus()
          }
        }
      }
    }

    // Show warnings as info toasts
    if (showToast && result.warnings.length > 0) {
      result.warnings.forEach(warning => {
        toast.info(warning.message)
      })
    }
  }

  /**
   * Private helper methods
   */
  private validateWithSchema(schema: z.ZodSchema, data: any, context: string): ValidationResult {
    try {
      schema.parse(data)
      return {
        isValid: true,
        errors: [],
        warnings: []
      }
    } catch (error) {
      if (error instanceof z.ZodError) {
        const errors = error.errors.map(err => ({
          field: err.path.join('.'),
          message: err.message,
          value: err.path.reduce((obj, key) => obj?.[key], data),
          rule: err.code
        }))

        return {
          isValid: false,
          errors,
          warnings: []
        }
      }

      return {
        isValid: false,
        errors: [{
          field: 'general',
          message: `${context} validation failed`,
          rule: 'unknown_error'
        }],
        warnings: []
      }
    }
  }

  private parseTime(timeStr: string): number {
    const match = timeStr.match(/^(\d{1,2}):(\d{2})\s?(AM|PM)$/i)
    if (!match) return -1

    let hours = parseInt(match[1])
    const minutes = parseInt(match[2])
    const period = match[3].toUpperCase()

    if (period === 'PM' && hours !== 12) {
      hours += 12
    } else if (period === 'AM' && hours === 12) {
      hours = 0
    }

    return hours + (minutes / 60)
  }

  private checkServiceBarberCompatibility(serviceId: string, barberId: string): { compatible: boolean, message?: string } {
    // Mock compatibility check - in real app, this would check against database
    // This is where you'd implement business logic for service/barber matching
    
    const specialtyServices = {
      'beard-specialist': ['beard-trim', 'beard-design'],
      'fade-expert': ['modern-fade', 'skin-fade'],
      'classic-barber': ['classic-cut', 'traditional-shave']
    }

    // For now, return compatible for all combinations
    return { compatible: true }
  }
}

// Export singleton instance
export const validationSystem = new ValidationSystem()

// Schemas are already exported above as const declarations

// Export convenience functions
export const validateCustomerInfo = (data: any) => validationSystem.validateCustomerInfo(data)
export const validateBookingForm = (data: any) => validationSystem.validateBookingForm(data)
export const validatePaymentInfo = (data: any) => validationSystem.validatePaymentInfo(data)
export const validateEmail = (email: string) => validationSystem.validateEmail(email)
export const validatePhone = (phone: string) => validationSystem.validatePhone(phone)