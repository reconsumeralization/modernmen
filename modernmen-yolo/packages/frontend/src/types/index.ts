// =============================================================================
// TYPES INDEX - Organized TypeScript type definitions
// =============================================================================

// -----------------------------------------------------------------------------
// COMMON TYPES - Generic types used across the application
// -----------------------------------------------------------------------------
export type {
  ApiResponse,
  PaginationParams,
  PaginatedResponse,
  SelectOption,
  FilterOption
} from './common'

// -----------------------------------------------------------------------------
// DASHBOARD TYPES - User interface and dashboard related types
// -----------------------------------------------------------------------------
export type {
  User,
  DashboardStats,
  Appointment,
  NotificationItem,
  ServiceData,
  DataTableColumn
} from './dashboard'

// -----------------------------------------------------------------------------
// BUILDER TYPES - Component builder and configuration types
// -----------------------------------------------------------------------------
export type {
  BuilderState,
  ComponentRelationship,
  ComponentNode,
  BuilderConfig,
  ModernMenCollection,
  ModernMenConfig
} from './builder'
