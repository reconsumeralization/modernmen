import { z } from 'zod'

// Validation schemas for API data
export const StaffSchema = z.object({
  name: z.string().min(1, 'Name is required').max(100, 'Name is too long'),
  email: z.string().email('Invalid email format'),
  phone: z.string().regex(/^[\+]?[1-9][\d]{0,15}$/, 'Invalid phone number'),
  role: z.enum(['barber', 'stylist', 'manager', 'admin'], { errorMap: () => ({ message: 'Invalid role' }) }),
  specialties: z.array(z.string()).default([]),
  bio: z.string().max(500, 'Bio is too long').optional(),
  avatar: z.string().url('Invalid avatar URL').optional(),
  hireDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Invalid date format'),
  hourlyRate: z.number().positive('Hourly rate must be positive').optional(),
  commissionRate: z.number().min(0).max(100, 'Commission rate must be between 0 and 100').optional(),
  workingHours: z.object({
    monday: z.object({
      start: z.string().regex(/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Invalid time format'),
      end: z.string().regex(/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Invalid time format'),
      isWorking: z.boolean()
    }),
    tuesday: z.object({
      start: z.string().regex(/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Invalid time format'),
      end: z.string().regex(/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Invalid time format'),
      isWorking: z.boolean()
    }),
    wednesday: z.object({
      start: z.string().regex(/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Invalid time format'),
      end: z.string().regex(/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Invalid time format'),
      isWorking: z.boolean()
    }),
    thursday: z.object({
      start: z.string().regex(/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Invalid time format'),
      end: z.string().regex(/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Invalid time format'),
      isWorking: z.boolean()
    }),
    friday: z.object({
      start: z.string().regex(/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Invalid time format'),
      end: z.string().regex(/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Invalid time format'),
      isWorking: z.boolean()
    }),
    saturday: z.object({
      start: z.string().regex(/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Invalid time format'),
      end: z.string().regex(/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Invalid time format'),
      isWorking: z.boolean()
    }),
    sunday: z.object({
      start: z.string().regex(/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Invalid time format'),
      end: z.string().regex(/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Invalid time format'),
      isWorking: z.boolean()
    })
  }).optional(),
  emergencyContact: z.object({
    name: z.string().min(1, 'Emergency contact name is required'),
    relationship: z.string().min(1, 'Relationship is required'),
    phone: z.string().regex(/^[\+]?[1-9][\d]{0,15}$/, 'Invalid phone number')
  }).optional(),
  isActive: z.boolean().default(true)
})

export const ServiceSchema = z.object({
  name: z.string().min(1, 'Service name is required').max(100, 'Service name is too long'),
  description: z.string().max(1000, 'Description is too long').optional(),
  shortDescription: z.string().max(200, 'Short description is too long').optional(),
  category: z.string().min(1, 'Category is required'),
  price: z.number().positive('Price must be positive'),
  duration: z.number().positive('Duration must be positive').max(480, 'Duration cannot exceed 8 hours'),
  isActive: z.boolean().default(true),
  featured: z.boolean().default(false),
  images: z.array(z.string().url('Invalid image URL')).default([]),
  benefits: z.array(z.string()).default([]),
  preparationInstructions: z.string().max(1000, 'Preparation instructions are too long').optional(),
  aftercareInstructions: z.string().max(1000, 'Aftercare instructions are too long').optional(),
  advanceBookingDays: z.number().min(0).max(365, 'Advance booking days cannot exceed 1 year').default(30),
  cancellationHours: z.number().min(0).max(168, 'Cancellation hours cannot exceed 1 week').default(24),
  requiresDeposit: z.boolean().default(false),
  depositPercentage: z.number().min(0).max(100, 'Deposit percentage must be between 0 and 100').default(25),
  metaTitle: z.string().max(60, 'Meta title is too long').optional(),
  metaDescription: z.string().max(160, 'Meta description is too long').optional(),
  keywords: z.array(z.string()).default([])
})

export const AppointmentSchema = z.object({
  customerId: z.string().uuid('Invalid customer ID'),
  serviceId: z.string().uuid('Invalid service ID'),
  staffId: z.string().uuid('Invalid staff ID'),
  appointmentDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Invalid date format'),
  startTime: z.string().regex(/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Invalid time format'),
  duration: z.number().positive('Duration must be positive').max(480, 'Duration cannot exceed 8 hours').default(60),
  notes: z.string().max(500, 'Notes are too long').optional(),
  customerNotes: z.string().max(500, 'Customer notes are too long').optional()
})

export const CustomerSchema = z.object({
  name: z.string().min(1, 'Name is required').max(100, 'Name is too long'),
  email: z.string().email('Invalid email format'),
  phone: z.string().regex(/^[\+]?[1-9][\d]{0,15}$/, 'Invalid phone number'),
  dateOfBirth: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Invalid date format').optional(),
  gender: z.enum(['male', 'female', 'other']).optional(),
  address: z.object({
    street: z.string().min(1, 'Street is required'),
    city: z.string().min(1, 'City is required'),
    state: z.string().min(1, 'State is required'),
    zipCode: z.string().regex(/^\d{5}(-\d{4})?$/, 'Invalid zip code'),
    country: z.string().min(1, 'Country is required')
  }).optional(),
  preferences: z.object({
    preferredServices: z.array(z.string()).default([]),
    preferredTimes: z.array(z.string()).default([]),
    preferredBarbers: z.array(z.string()).default([]),
    allergies: z.array(z.string()).default([]),
    specialRequests: z.array(z.string()).default([])
  }).default({
    preferredServices: [],
    preferredTimes: [],
    preferredBarbers: [],
    allergies: [],
    specialRequests: []
  }),
  isActive: z.boolean().default(true)
})

// Pagination schema
export const PaginationSchema = z.object({
  page: z.number().int().positive().default(1),
  limit: z.number().int().positive().max(100).default(20)
})

// Filter schemas
export const StaffFiltersSchema = z.object({
  role: z.string().optional(),
  isActive: z.boolean().optional(),
  search: z.string().optional()
})

export const ServiceFiltersSchema = z.object({
  category: z.string().optional(),
  isActive: z.boolean().optional(),
  featured: z.boolean().optional(),
  search: z.string().optional()
})

export const AppointmentFiltersSchema = z.object({
  status: z.enum(['pending', 'confirmed', 'in_progress', 'completed', 'cancelled', 'no_show']).optional(),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Invalid date format').optional(),
  customerId: z.string().uuid('Invalid customer ID').optional(),
  staffId: z.string().uuid('Invalid staff ID').optional(),
  search: z.string().optional()
})

// Validation helper functions
export function validateData<T>(
  schema: z.ZodSchema<T>,
  data: unknown
): { success: true; data: T } | { success: false; errors: string[] } {
  try {
    const validData = schema.parse(data)
    return { success: true, data: validData }
  } catch (error) {
    if (error instanceof z.ZodError) {
      const errors = error.errors.map(err => `${err.path.join('.')}: ${err.message}`)
      return { success: false, errors }
    }
    return { success: false, errors: ['Unknown validation error'] }
  }
}

// Sanitization functions
export function sanitizeString(str: string): string {
  return str
    .trim()
    .replace(/[<>\"'&]/g, '') // Remove potentially dangerous characters
    .substring(0, 1000) // Limit length
}

export function sanitizeEmail(email: string): string {
  return email.toLowerCase().trim()
}

export function sanitizePhone(phone: string): string {
  return phone.replace(/[^\d\+\-\(\)\s]/g, '').trim()
}

// Rate limiting validation
export function validateRateLimit(
  requests: number,
  windowMs: number,
  maxRequests: number
): boolean {
  return requests <= maxRequests
}

// Input sanitization middleware
export function sanitizeInput(input: any): any {
  if (typeof input === 'string') {
    return sanitizeString(input)
  }

  if (typeof input === 'object' && input !== null) {
    const sanitized: any = {}

    for (const [key, value] of Object.entries(input)) {
      if (key.toLowerCase().includes('email')) {
        sanitized[key] = sanitizeEmail(value as string)
      } else if (key.toLowerCase().includes('phone')) {
        sanitized[key] = sanitizePhone(value as string)
      } else if (typeof value === 'string') {
        sanitized[key] = sanitizeString(value)
      } else if (typeof value === 'object') {
        sanitized[key] = sanitizeInput(value)
      } else {
        sanitized[key] = value
      }
    }

    return sanitized
  }

  return input
}

// Password validation
export const PasswordSchema = z.object({
  password: z.string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, 'Password must contain at least one uppercase letter, one lowercase letter, and one number')
})

// Authentication schemas
export const LoginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required')
})

export const RegisterSchema = z.object({
  name: z.string().min(1, 'Name is required').max(100, 'Name is too long'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  phone: z.string().regex(/^[\+]?[1-9][\d]{0,15}$/, 'Invalid phone number'),
  role: z.enum(['customer', 'staff']).default('customer')
})

// Search validation
export const SearchSchema = z.object({
  query: z.string().min(1, 'Search query is required').max(100, 'Search query is too long'),
  filters: z.record(z.any()).optional(),
  sortBy: z.string().optional(),
  sortOrder: z.enum(['asc', 'desc']).default('asc'),
  page: z.number().int().positive().default(1),
  limit: z.number().int().positive().max(100).default(20)
})

// File upload validation
export const FileUploadSchema = z.object({
  file: z.object({
    name: z.string(),
    size: z.number().max(5 * 1024 * 1024, 'File size must be less than 5MB'),
    type: z.string().refine(
      (type) => ['image/jpeg', 'image/png', 'image/webp'].includes(type),
      'File must be a JPEG, PNG, or WebP image'
    )
  }),
  alt: z.string().max(200, 'Alt text is too long').optional()
})

// Export types
export type StaffInput = z.infer<typeof StaffSchema>
export type ServiceInput = z.infer<typeof ServiceSchema>
export type AppointmentInput = z.infer<typeof AppointmentSchema>
export type CustomerInput = z.infer<typeof CustomerSchema>
export type LoginInput = z.infer<typeof LoginSchema>
export type RegisterInput = z.infer<typeof RegisterSchema>
export type SearchInput = z.infer<typeof SearchSchema>
export type FileUploadInput = z.infer<typeof FileUploadSchema>
