// API Types for Modern Men Hair Salon

// Base response interface
export interface ApiResponse<T = any> {
  success: boolean
  data?: T
  message?: string
  error?: string
  pagination?: PaginationInfo
}

// Pagination interface
export interface PaginationInfo {
  page: number
  limit: number
  total: number
  totalPages: number
  hasNextPage: boolean
  hasPrevPage: boolean
}

// Staff types
export interface Staff {
  id: string
  name: string
  email: string
  phone: string
  role: 'barber' | 'stylist' | 'manager' | 'admin'
  specialties: string[]
  bio?: string
  avatar?: string
  hire_date: string
  hourly_rate?: number
  commission_rate?: number
  working_hours: WorkingHours
  emergency_contact: EmergencyContact
  is_active: boolean
  created_at: string
  updated_at: string
}

export interface WorkingHours {
  monday: DaySchedule
  tuesday: DaySchedule
  wednesday: DaySchedule
  thursday: DaySchedule
  friday: DaySchedule
  saturday: DaySchedule
  sunday: DaySchedule
}

export interface DaySchedule {
  start: string
  end: string
  isWorking: boolean
}

export interface EmergencyContact {
  name: string
  relationship: string
  phone: string
}

// Service types
export interface Service {
  id: string
  name: string
  description?: string
  short_description?: string
  category: string
  price: number
  duration: number // in minutes
  is_active: boolean
  featured: boolean
  images: string[]
  benefits: string[]
  preparation_instructions?: string
  aftercare_instructions?: string
  advance_booking_days: number
  cancellation_hours: number
  requires_deposit: boolean
  deposit_percentage: number
  meta_title?: string
  meta_description?: string
  keywords: string[]
  created_at: string
  updated_at: string
}

// Customer types
export interface Customer {
  id: string
  name: string
  email: string
  phone: string
  date_of_birth?: string
  gender?: 'male' | 'female' | 'other'
  address?: Address
  preferences: CustomerPreferences
  loyalty_points: number
  total_spent: number
  last_visit?: string
  is_active: boolean
  created_at: string
  updated_at: string
}

export interface Address {
  street: string
  city: string
  state: string
  zip_code: string
  country: string
}

export interface CustomerPreferences {
  preferred_services: string[]
  preferred_times: string[]
  preferred_barbers: string[]
  allergies: string[]
  special_requests: string[]
}

// Appointment types
export interface Appointment {
  id: string
  customer_id: string
  service_id: string
  staff_id: string
  customer_name: string
  customer_email: string
  customer_phone: string
  service_name: string
  staff_name: string
  appointment_date: string
  start_time: string
  duration: number
  price: number
  status: AppointmentStatus
  notes?: string
  customer_notes?: string
  created_by: string
  created_at: string
  updated_at: string
  cancelled_at?: string
  cancellation_reason?: string
}

export type AppointmentStatus =
  | 'pending'
  | 'confirmed'
  | 'in_progress'
  | 'completed'
  | 'cancelled'
  | 'no_show'

// Inventory types
export interface InventoryItem {
  id: string
  name: string
  description?: string
  category: string
  sku: string
  barcode?: string
  quantity: number
  min_quantity: number
  max_quantity?: number
  unit_cost: number
  unit_price: number
  supplier_id?: string
  location: string
  is_active: boolean
  created_at: string
  updated_at: string
}

export interface InventoryTransaction {
  id: string
  item_id: string
  type: 'stock_in' | 'stock_out' | 'adjustment'
  quantity: number
  reason: string
  reference?: string
  performed_by: string
  created_at: string
}

// Auth types
export interface LoginCredentials {
  email: string
  password: string
}

export interface RegisterData {
  name: string
  email: string
  password: string
  phone: string
  role?: 'customer' | 'staff'
}

export interface AuthUser {
  id: string
  name: string
  email: string
  role: 'admin' | 'staff' | 'customer'
  avatar?: string
  permissions: string[]
}

// API request types
export interface StaffFilters {
  role?: string
  isActive?: boolean
  search?: string
}

export interface ServiceFilters {
  category?: string
  isActive?: boolean
  featured?: boolean
  search?: string
}

export interface AppointmentFilters {
  status?: AppointmentStatus
  date?: string
  customerId?: string
  staffId?: string
  search?: string
}

export interface CustomerFilters {
  search?: string
  isActive?: boolean
  hasRecentAppointment?: boolean
}

// Pagination parameters
export interface PaginationParams {
  page?: number
  limit?: number
}

// API error types
export interface ApiError {
  code: string
  message: string
  details?: any
}

// Validation error types
export interface ValidationError {
  field: string
  message: string
  code: string
}

// Response types for different endpoints
export interface StaffListResponse extends ApiResponse<Staff[]> {}
export interface StaffResponse extends ApiResponse<Staff> {}
export interface ServiceListResponse extends ApiResponse<Service[]> {}
export interface ServiceResponse extends ApiResponse<Service> {}
export interface CustomerListResponse extends ApiResponse<Customer[]> {}
export interface CustomerResponse extends ApiResponse<Customer> {}
export interface AppointmentListResponse extends ApiResponse<Appointment[]> {}
export interface AppointmentResponse extends ApiResponse<Appointment> {}
export interface InventoryListResponse extends ApiResponse<InventoryItem[]> {}
export interface InventoryResponse extends ApiResponse<InventoryItem> {}

// Form data types
export interface CreateStaffData {
  name: string
  email: string
  phone: string
  role: Staff['role']
  specialties: string[]
  bio?: string
  avatar?: string
  hireDate: string
  hourlyRate?: number
  commissionRate?: number
  workingHours?: WorkingHours
  emergencyContact?: EmergencyContact
  isActive?: boolean
}

export interface CreateServiceData {
  name: string
  description?: string
  shortDescription?: string
  category: string
  price: number
  duration: number
  isActive?: boolean
  featured?: boolean
  images?: string[]
  benefits?: string[]
  preparationInstructions?: string
  aftercareInstructions?: string
  advanceBookingDays?: number
  cancellationHours?: number
  requiresDeposit?: boolean
  depositPercentage?: number
  metaTitle?: string
  metaDescription?: string
  keywords?: string[]
}

export interface CreateAppointmentData {
  customerId: string
  serviceId: string
  staffId: string
  appointmentDate: string
  startTime: string
  duration?: number
  notes?: string
  customerNotes?: string
}

export interface UpdateAppointmentData {
  appointmentDate?: string
  startTime?: string
  duration?: number
  notes?: string
  customerNotes?: string
  status?: AppointmentStatus
}
