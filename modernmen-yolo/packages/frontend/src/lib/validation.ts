import { z } from 'zod'

// Booking Form Validation
export const bookingSchema = z.object({
  serviceId: z.string().min(1, 'Please select a service'),
  barberId: z.string().min(1, 'Please select a barber'),
  date: z.string().min(1, 'Please select a date'),
  time: z.string().min(1, 'Please select a time'),
  firstName: z.string().min(2, 'First name must be at least 2 characters'),
  lastName: z.string().min(2, 'Last name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email address'),
  phone: z.string().min(10, 'Please enter a valid phone number'),
  notes: z.string().optional(),
  customerNotes: z.string().optional(),
  paymentMethod: z.enum(['card', 'cash'], {
    required_error: 'Please select a payment method',
  }),
  agreeToTerms: z.boolean().refine(val => val === true, {
    message: 'You must agree to the terms and conditions',
  }),
})

export type BookingFormData = z.infer<typeof bookingSchema>

// Contact Form Validation
export const contactSchema = z.object({
  firstName: z.string().min(2, 'First name must be at least 2 characters'),
  lastName: z.string().min(2, 'Last name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email address'),
  phone: z.string().optional(),
  subject: z.string().min(5, 'Subject must be at least 5 characters'),
  message: z.string().min(10, 'Message must be at least 10 characters'),
})

export type ContactFormData = z.infer<typeof contactSchema>

// Customer Profile Validation
export const customerProfileSchema = z.object({
  firstName: z.string().min(2, 'First name must be at least 2 characters'),
  lastName: z.string().min(2, 'Last name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email address'),
  phone: z.string().min(10, 'Please enter a valid phone number'),
  dateOfBirth: z.string().optional(),
  address: z.object({
    street: z.string().optional(),
    city: z.string().optional(),
    state: z.string().optional(),
    zipCode: z.string().optional(),
  }).optional(),
  preferences: z.object({
    preferredBarber: z.string().optional(),
    preferredServices: z.array(z.string()).optional(),
    preferredTimes: z.array(z.string()).optional(),
    notifications: z.object({
      email: z.boolean(),
      sms: z.boolean(),
      marketing: z.boolean(),
    }),
  }).optional(),
})

export type CustomerProfileData = z.infer<typeof customerProfileSchema>

// Service Creation Validation
export const serviceSchema = z.object({
  name: z.string().min(2, 'Service name must be at least 2 characters'),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  duration: z.number().min(15, 'Duration must be at least 15 minutes').max(480, 'Duration cannot exceed 8 hours'),
  price: z.number().min(0, 'Price must be a positive number'),
  category: z.string().min(1, 'Please select a category'),
  isActive: z.boolean(),
  requiresDeposit: z.boolean(),
  depositAmount: z.number().optional(),
  maxAdvanceBooking: z.number().min(1).max(365).optional(),
})

export type ServiceData = z.infer<typeof serviceSchema>

// Barber Profile Validation
export const barberProfileSchema = z.object({
  firstName: z.string().min(2, 'First name must be at least 2 characters'),
  lastName: z.string().min(2, 'Last name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email address'),
  phone: z.string().min(10, 'Please enter a valid phone number'),
  specialties: z.array(z.string()).min(1, 'Please select at least one specialty'),
  bio: z.string().min(50, 'Bio must be at least 50 characters').max(500, 'Bio cannot exceed 500 characters'),
  experience: z.number().min(0, 'Experience cannot be negative'),
  workingHours: z.object({
    monday: z.object({ start: z.string(), end: z.string() }).optional(),
    tuesday: z.object({ start: z.string(), end: z.string() }).optional(),
    wednesday: z.object({ start: z.string(), end: z.string() }).optional(),
    thursday: z.object({ start: z.string(), end: z.string() }).optional(),
    friday: z.object({ start: z.string(), end: z.string() }).optional(),
    saturday: z.object({ start: z.string(), end: z.string() }).optional(),
    sunday: z.object({ start: z.string(), end: z.string() }).optional(),
  }),
  isActive: z.boolean(),
})

export type BarberProfileData = z.infer<typeof barberProfileSchema>

// Appointment Update Validation
export const appointmentUpdateSchema = z.object({
  status: z.enum(['confirmed', 'pending', 'cancelled', 'completed', 'no_show']),
  notes: z.string().optional(),
  customerNotes: z.string().optional(),
  paymentStatus: z.enum(['pending', 'paid', 'refunded', 'cancelled']).optional(),
  internalNotes: z.string().optional(),
})

export type AppointmentUpdateData = z.infer<typeof appointmentUpdateSchema>

// Password Change Validation
export const passwordChangeSchema = z.object({
  currentPassword: z.string().min(1, 'Current password is required'),
  newPassword: z.string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, 'Password must contain at least one lowercase letter, one uppercase letter, and one number'),
  confirmPassword: z.string(),
}).refine(data => data.newPassword === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
})

export type PasswordChangeData = z.infer<typeof passwordChangeSchema>

// Search and Filter Validation
export const appointmentSearchSchema = z.object({
  query: z.string().optional(),
  status: z.enum(['confirmed', 'pending', 'cancelled', 'completed', 'no_show']).optional(),
  barberId: z.string().optional(),
  dateFrom: z.string().optional(),
  dateTo: z.string().optional(),
  customerName: z.string().optional(),
  serviceId: z.string().optional(),
  page: z.number().min(1).optional(),
  limit: z.number().min(1).max(100).optional(),
})

export type AppointmentSearchData = z.infer<typeof appointmentSearchSchema>

// Utility function to format validation errors
export function formatValidationErrors(error: z.ZodError) {
  return error.errors.reduce((acc, err) => {
    const path = err.path.join('.')
    acc[path] = err.message
    return acc
  }, {} as Record<string, string>)
}

// Utility function to validate data
export function validateData<T>(schema: z.ZodSchema<T>, data: unknown): {
  success: boolean
  data?: T
  errors?: Record<string, string>
} {
  try {
    const validData = schema.parse(data)
    return { success: true, data: validData }
  } catch (error) {
    if (error instanceof z.ZodError) {
      return {
        success: false,
        errors: formatValidationErrors(error)
      }
    }
    return {
      success: false,
      errors: { general: 'Validation failed' }
    }
  }
}