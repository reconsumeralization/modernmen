// Application constants for Modern Men Hair Salon

// Business Information
export const BUSINESS_INFO = {
  name: 'Modern Men Hair Salon',
  address: {
    street: '123 Style Street',
    city: 'Regina',
    state: 'Saskatchewan',
    zipCode: 'S4P 1A1',
    country: 'Canada'
  },
  phone: '+1 (306) 555-0123',
  email: 'info@modernmen.ca',
  website: 'https://modernmen.ca'
} as const

// Business Hours (in 24-hour format)
export const BUSINESS_HOURS = {
  monday: { open: '09:00', close: '19:00', closed: false },
  tuesday: { open: '09:00', close: '19:00', closed: false },
  wednesday: { open: '09:00', close: '19:00', closed: false },
  thursday: { open: '09:00', close: '19:00', closed: false },
  friday: { open: '09:00', close: '20:00', closed: false },
  saturday: { open: '08:00', close: '18:00', closed: false },
  sunday: { open: '10:00', close: '16:00', closed: false }
} as const

// Service Categories
export const SERVICE_CATEGORIES = [
  'Haircuts',
  'Hair Styling',
  'Hair Coloring',
  'Beard Grooming',
  'Facials',
  'Massage',
  'Special Treatments'
] as const

// Appointment Statuses
export const APPOINTMENT_STATUSES = [
  'pending',
  'confirmed',
  'in_progress',
  'completed',
  'cancelled',
  'no_show'
] as const

// User Roles
export const USER_ROLES = [
  'customer',
  'stylist',
  'admin'
] as const

// Payment Methods
export const PAYMENT_METHODS = [
  'cash',
  'credit_card',
  'debit_card',
  'gift_card',
  'online'
] as const

// Time Slots (30-minute intervals)
export const TIME_SLOTS = [
  '09:00', '09:30', '10:00', '10:30', '11:00', '11:30',
  '12:00', '12:30', '13:00', '13:30', '14:00', '14:30',
  '15:00', '15:30', '16:00', '16:30', '17:00', '17:30',
  '18:00', '18:30', '19:00'
] as const

// Service Durations (in minutes)
export const SERVICE_DURATIONS = [
  15, 30, 45, 60, 75, 90, 120
] as const

// Price Ranges
export const PRICE_RANGES = {
  low: { min: 0, max: 50 },
  medium: { min: 51, max: 100 },
  high: { min: 101, max: 200 },
  premium: { min: 201, max: 500 }
} as const

// File Upload Limits
export const FILE_UPLOAD_LIMITS = {
  maxSize: 10 * 1024 * 1024, // 10MB
  allowedTypes: [
    'image/jpeg',
    'image/jpg',
    'image/png',
    'image/webp',
    'image/gif'
  ],
  maxFiles: 5
} as const

// Pagination Defaults
export const PAGINATION_DEFAULTS = {
  page: 1,
  limit: 20,
  maxLimit: 100
} as const

// Cache TTL (in seconds)
export const CACHE_TTL = {
  short: 300,    // 5 minutes
  medium: 1800,  // 30 minutes
  long: 3600,    // 1 hour
  day: 86400     // 24 hours
} as const

// API Rate Limits
export const RATE_LIMITS = {
  auth: { windowMs: 15 * 60 * 1000, max: 5 },    // 5 attempts per 15 minutes
  api: { windowMs: 15 * 60 * 1000, max: 100 },   // 100 requests per 15 minutes
  booking: { windowMs: 60 * 60 * 1000, max: 10 } // 10 bookings per hour
} as const

// Email Templates
export const EMAIL_TEMPLATES = {
  appointmentConfirmation: 'appointment-confirmation',
  appointmentReminder: 'appointment-reminder',
  appointmentCancellation: 'appointment-cancellation',
  welcome: 'welcome',
  passwordReset: 'password-reset'
} as const

// Social Media Links
export const SOCIAL_LINKS = {
  facebook: 'https://facebook.com/modernmen',
  instagram: 'https://instagram.com/modernmen',
  twitter: 'https://twitter.com/modernmen'
} as const

// Feature Flags (for gradual rollouts)
export const FEATURE_FLAGS = {
  onlineBooking: true,
  loyaltyProgram: true,
  smsReminders: false,
  mobileApp: false,
  videoConsultation: false
} as const
