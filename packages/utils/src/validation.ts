import { z } from 'zod'

// Common validation schemas
export const emailSchema = z.string().email('Invalid email format')

export const phoneSchema = z.string().regex(
  /^\+?[\d\s\-\(\)]+$/,
  'Invalid phone number format'
)

export const passwordSchema = z.string()
  .min(8, 'Password must be at least 8 characters')
  .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
  .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
  .regex(/\d/, 'Password must contain at least one number')

export const nameSchema = z.string()
  .min(1, 'Name is required')
  .max(50, 'Name must be less than 50 characters')
  .regex(/^[a-zA-Z\s]+$/, 'Name can only contain letters and spaces')

export const dateSchema = z.string().refine(
  (date) => !isNaN(Date.parse(date)),
  'Invalid date format'
)

export const timeSchema = z.string().regex(
  /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/,
  'Invalid time format (HH:MM)'
)

export const currencySchema = z.number()
  .positive('Amount must be positive')
  .max(10000, 'Amount cannot exceed $10,000')

// Validation helper functions
export const validateEmail = (email: string) => {
  return emailSchema.safeParse(email)
}

export const validatePhone = (phone: string) => {
  return phoneSchema.safeParse(phone)
}

export const validatePassword = (password: string) => {
  return passwordSchema.safeParse(password)
}

export const validateName = (name: string) => {
  return nameSchema.safeParse(name)
}

export const validateDate = (date: string) => {
  return dateSchema.safeParse(date)
}

export const validateTime = (time: string) => {
  return timeSchema.safeParse(time)
}

export const validateCurrency = (amount: number) => {
  return currencySchema.safeParse(amount)
}

// Sanitization functions
export const sanitizeString = (str: string): string => {
  return str.trim().replace(/[<>]/g, '')
}

export const sanitizePhone = (phone: string): string => {
  return phone.replace(/[^\d+\-\s\(\)]/g, '').trim()
}

export const formatPhone = (phone: string): string => {
  const cleaned = phone.replace(/\D/g, '')
  if (cleaned.length === 10) {
    return `(${cleaned.slice(0, 3)}) ${cleaned.slice(3, 6)}-${cleaned.slice(6)}`
  }
  return phone
}

// Custom validation for business rules
export const validateAppointmentTime = (date: string, time: string): boolean => {
  const appointmentDateTime = new Date(`${date}T${time}`)
  const now = new Date()

  // Cannot book appointments in the past
  if (appointmentDateTime <= now) {
    return false
  }

  // Cannot book appointments more than 6 months in advance
  const sixMonthsFromNow = new Date()
  sixMonthsFromNow.setMonth(sixMonthsFromNow.getMonth() + 6)

  if (appointmentDateTime > sixMonthsFromNow) {
    return false
  }

  return true
}

export const validateBusinessHours = (time: string): boolean => {
  const [hours, minutes] = time.split(':').map(Number)
  const totalMinutes = hours * 60 + minutes

  // Business hours: 9:00 AM to 7:00 PM (540 to 1140 minutes)
  const businessStart = 9 * 60 // 9:00 AM
  const businessEnd = 19 * 60 // 7:00 PM

  return totalMinutes >= businessStart && totalMinutes <= businessEnd
}
