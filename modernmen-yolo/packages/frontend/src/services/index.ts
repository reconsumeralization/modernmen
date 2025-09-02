// =============================================================================
// SERVICES INDEX - Data and API service exports
// =============================================================================

// -----------------------------------------------------------------------------
// BUILDER SERVICES - Component builder data services
// -----------------------------------------------------------------------------
export { BuilderIntegration, createBuilderIntegration } from "../lib/supabase/builder-integration"

// -----------------------------------------------------------------------------
// COMPONENT RELATIONSHIPS - Component relationship management
// -----------------------------------------------------------------------------
export { ComponentRelationships, createComponentRelationships } from "../lib/builder/relationships"

// -----------------------------------------------------------------------------
// APPLICATION SERVICES - Domain-specific data services
// -----------------------------------------------------------------------------
export { AppointmentsService, appointmentsService, createAppointmentsService } from "./appointments"
export { StatsService, statsService, createStatsService } from "./stats"
export { NotificationsService, notificationsService, createNotificationsService } from "./notifications"

// -----------------------------------------------------------------------------
// TYPE EXPORTS - Service-related types
// -----------------------------------------------------------------------------
export type { BuilderConfig } from "../types/builder"
export type { ComponentRelationship, ComponentNode } from "../types/builder"
