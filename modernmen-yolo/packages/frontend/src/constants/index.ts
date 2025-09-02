// =============================================================================
// CONSTANTS INDEX - Application constants and configuration
// =============================================================================

// -----------------------------------------------------------------------------
// COMPONENT TYPES - Available component types for builder
// -----------------------------------------------------------------------------
export const COMPONENT_TYPES = {
  UI: 'ui',
  FORM: 'form',
  LAYOUT: 'layout',
  DATA: 'data',
  FEEDBACK: 'feedback'
} as const

// -----------------------------------------------------------------------------
// RELATIONSHIP TYPES - Component relationship types
// -----------------------------------------------------------------------------
export const RELATIONSHIP_TYPES = {
  PARENT: 'parent',
  CHILD: 'child',
  SIBLING: 'sibling',
  DEPENDENCY: 'dependency'
} as const

// -----------------------------------------------------------------------------
// NOTIFICATION TYPES - Available notification types
// -----------------------------------------------------------------------------
export const NOTIFICATION_TYPES = {
  INFO: 'info',
  SUCCESS: 'success',
  WARNING: 'warning',
  ERROR: 'error'
} as const

// -----------------------------------------------------------------------------
// APPOINTMENT STATUSES - Available appointment statuses
// -----------------------------------------------------------------------------
export const APPOINTMENT_STATUSES = {
  CONFIRMED: 'confirmed',
  PENDING: 'pending',
  CANCELLED: 'cancelled',
  COMPLETED: 'completed'
} as const

// -----------------------------------------------------------------------------
// API ENDPOINTS - Common API endpoint paths
// -----------------------------------------------------------------------------
export const API_ENDPOINTS = {
  APPOINTMENTS: '/api/appointments',
  CUSTOMERS: '/api/customers',
  SERVICES: '/api/services',
  STATS: '/api/stats',
  NOTIFICATIONS: '/api/notifications'
} as const

// -----------------------------------------------------------------------------
// UI CONSTANTS - UI-related constants
// -----------------------------------------------------------------------------
export const UI_CONSTANTS = {
  DEBOUNCE_DELAY: 300,
  ANIMATION_DURATION: 200,
  MAX_FILE_SIZE: 5 * 1024 * 1024, // 5MB
  ITEMS_PER_PAGE: 20
} as const

// -----------------------------------------------------------------------------
// TYPE EXPORTS - Constant types
// -----------------------------------------------------------------------------
export type ComponentType = typeof COMPONENT_TYPES[keyof typeof COMPONENT_TYPES]
export type RelationshipType = typeof RELATIONSHIP_TYPES[keyof typeof RELATIONSHIP_TYPES]
export type NotificationType = typeof NOTIFICATION_TYPES[keyof typeof NOTIFICATION_TYPES]
export type AppointmentStatus = typeof APPOINTMENT_STATUSES[keyof typeof APPOINTMENT_STATUSES]
