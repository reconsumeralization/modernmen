// Auto-generated collection types
// Generated from src/collections/*.ts
// Do not edit manually - regenerate with: npm run types:collections

// Collection type definitions for Payload CMS
export interface Customer {
  id: string
  firstName?: string
  lastName?: string
  email: string
  phone?: string
  dateOfBirth?: string
  address?: {
    street?: string
    city?: string
    state?: string
    zipCode?: string
    country?: string
  }
  loyaltyTier?: 'bronze' | 'silver' | 'gold' | 'platinum' | 'diamond'
  loyaltyPoints?: number
  totalSpent?: number
  visitCount?: number
  lastVisit?: string
  preferences?: {
    preferredStylist?: string
    preferredServices?: string[]
    marketingOptIn?: boolean
    smsNotifications?: boolean
    emailNotifications?: boolean
  }
  emergencyContact?: {
    name?: string
    relationship?: string
    phone?: string
  }
  isActive?: boolean
  notes?: string
  tags?: Array<{ tag: string }>
  tenant?: string
  createdAt?: string
  updatedAt?: string
}

export interface Appointment {
  id: string
  customer: string | Customer
  service: string | Service
  stylist: string | Stylist
  date: string
  startTime: string
  endTime?: string
  duration: number
  status?: 'scheduled' | 'confirmed' | 'checked_in' | 'in_progress' | 'completed' | 'no_show' | 'cancelled' | 'rescheduled'
  price: number
  discountAmount?: number
  taxAmount?: number
  totalAmount?: number
  paymentStatus?: 'pending' | 'paid' | 'refunded' | 'partial' | 'cancelled'
  bookingSource?: 'website' | 'phone' | 'walk_in' | 'mobile_app' | 'referral' | 'social_media'
  bookingReference?: string
  specialRequests?: string
  internalNotes?: string
  reminderSent?: boolean
  followUpRequired?: boolean
  followUpNotes?: string
  cancellationReason?: 'customer_request' | 'no_show' | 'emergency' | 'staff_unavailable' | 'other'
  cancellationNotes?: string
  createdBy?: string
  updatedBy?: string
  statusHistory?: Array<{
    status: string
    timestamp: string
    changedBy: string
    notes?: string
  }>
  tenant?: string
  createdAt?: string
  updatedAt?: string
}

export interface Service {
  id: string
  name: string
  description?: string
  price: number
  duration: number
  category?: string
  image?: string | { id: string; filename: string; url: string }
  isActive?: boolean
  createdAt?: string
  updatedAt?: string
}

export interface Stylist {
  id: string
  firstName: string
  lastName: string
  email: string
  phone?: string
  bio?: string
  specialties?: string[]
  image?: string | { id: string; filename: string; url: string }
  schedule?: Array<{
    dayOfWeek: string
    startTime: string
    endTime: string
    isAvailable: boolean
  }>
  isActive?: boolean
  hireDate?: string
  createdAt?: string
  updatedAt?: string
}

export interface Inventory {
  id: string
  name: string
  description?: string
  category?: string
  sku?: string
  quantity: number
  minQuantity?: number
  maxQuantity?: number
  unitCost?: number
  sellingPrice?: number
  supplier?: string
  location?: string
  image?: string | { id: string; filename: string; url: string }
  isActive?: boolean
  createdAt?: string
  updatedAt?: string
}

export interface Supplier {
  id: string
  name: string
  description?: string
  contactName?: string
  email?: string
  phone?: string
  address?: {
    street?: string
    city?: string
    state?: string
    zipCode?: string
    country?: string
  }
  paymentTerms?: string
  notes?: string
  isActive?: boolean
  createdAt?: string
  updatedAt?: string
}

export interface Commission {
  id: string
  stylist: string | Stylist
  appointment: string | Appointment
  service: string | Service
  baseAmount: number
  commissionRate: number
  commissionAmount: number
  paymentStatus?: 'pending' | 'paid' | 'cancelled'
  paymentDate?: string
  notes?: string
  createdAt?: string
  updatedAt?: string
}

export interface ServicePackage {
  id: string
  name: string
  description?: string
  services: Array<{
    service: string | Service
    quantity: number
  }>
  totalPrice: number
  discountPercentage?: number
  duration?: number
  image?: string | { id: string; filename: string; url: string }
  isActive?: boolean
  createdAt?: string
  updatedAt?: string
}

export interface WaitList {
  id: string
  customer: string | Customer
  service: string | Service
  preferredStylist?: string | Stylist
  preferredDate?: string
  preferredTime?: string
  notes?: string
  status?: 'waiting' | 'contacted' | 'scheduled' | 'cancelled'
  contactedAt?: string
  scheduledAt?: string
  createdAt?: string
  updatedAt?: string
}

// Type helpers
export type CollectionSlug = 'customers' | 'appointments' | 'services' | 'stylists' | 'inventory' | 'suppliers' | 'commissions' | 'service-packages' | 'wait-list'

export type CollectionType<T extends CollectionSlug> =
  T extends 'customers' ? Customer :
  T extends 'appointments' ? Appointment :
  T extends 'services' ? Service :
  T extends 'stylists' ? Stylist :
  T extends 'inventory' ? Inventory :
  T extends 'suppliers' ? Supplier :
  T extends 'commissions' ? Commission :
  T extends 'service-packages' ? ServicePackage :
  T extends 'wait-list' ? WaitList :
  never
