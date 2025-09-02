// =============================================================================
// MAIN APPLICATION INDEX - Centralized exports for the entire application
// =============================================================================

// -----------------------------------------------------------------------------
// COMPONENTS - All UI components organized by category
// -----------------------------------------------------------------------------
export * from "./components/ui"

// -----------------------------------------------------------------------------
// HOOKS - All custom hooks
// -----------------------------------------------------------------------------
export * from "./hooks"

// -----------------------------------------------------------------------------
// SERVICES - All data and API services
// -----------------------------------------------------------------------------
export * from "./services"

// -----------------------------------------------------------------------------
// LIBRARIES - Utility libraries and helpers
// -----------------------------------------------------------------------------
export * from "./lib"

// -----------------------------------------------------------------------------
// TYPES - All TypeScript type definitions
// -----------------------------------------------------------------------------
// Export specific types to avoid conflicts
export type {
  User,
  Appointment,
  ApiResponse
} from "./types"

// -----------------------------------------------------------------------------
// DATA - Mock data and data utilities
// -----------------------------------------------------------------------------
export * from "./data"

// -----------------------------------------------------------------------------
// CONSTANTS - Application constants
// -----------------------------------------------------------------------------
// Export specific constants to avoid conflicts
export {
  APPOINTMENT_STATUSES,
  API_ENDPOINTS,
  UI_CONSTANTS,
  COMPONENT_TYPES,
  RELATIONSHIP_TYPES,
  type AppointmentStatus,
  type ComponentType,
  type RelationshipType
} from "./constants"

// -----------------------------------------------------------------------------
// CONFIGURATION - Application configuration
// -----------------------------------------------------------------------------
export * from "./config"

// -----------------------------------------------------------------------------
// LAYOUT COMPONENTS - Page-level layouts
// -----------------------------------------------------------------------------
export { DashboardLayout } from "./components/layout/dashboard-layout"
