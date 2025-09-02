// =============================================================================
// CUSTOM HOOKS INDEX - Centralized hook exports
// =============================================================================

// -----------------------------------------------------------------------------
// BUILDER HOOKS - Component builder functionality
// -----------------------------------------------------------------------------
export { useBuilder } from "./use-builder"
export { useComponentSelection } from "./use-component-selection"

// -----------------------------------------------------------------------------
// NOTIFICATION HOOKS - Notification management
// -----------------------------------------------------------------------------
export { useNotifications } from "./use-notifications"

// -----------------------------------------------------------------------------
// FORM WIZARD HOOKS - Multi-step form management
// -----------------------------------------------------------------------------
export { useFormWizard } from "../components/ui/form-wizard"

// -----------------------------------------------------------------------------
// UTILITY HOOKS - Common utility hooks
// -----------------------------------------------------------------------------
export { useMobileOptimization } from "./use-mobile-optimization"
export { useMobile } from "./use-mobile"

// -----------------------------------------------------------------------------
// ERROR HANDLING HOOKS - Error management
// -----------------------------------------------------------------------------
export { useErrorHandler } from "../lib/error-handling"

// -----------------------------------------------------------------------------
// TYPE EXPORTS - Hook-related types
// -----------------------------------------------------------------------------
export type { BuilderState } from "../types"
