// =============================================================================
// BARBER EXPERIENCE COMPONENTS - Complete customer and barber experience system
// =============================================================================

export {
  CustomerExperienceDashboard,
  type CustomerExperienceDashboardProps
} from './customer-experience-dashboard'

export {
  BarberProfileCard,
  BarberProfileModal,
  type BarberProfile,
  type BarberProfileCardProps,
  type BarberProfileModalProps
} from './barber-profile-system'

export {
  AppointmentStatusTracker,
  type LiveAppointment,
  type AppointmentStatus,
  type AppointmentStatusTrackerProps
} from './appointment-status-tracker'

export {
  CustomerFeedbackForm,
  FeedbackResults,
  type FeedbackRating,
  type FeedbackResponse,
  type CustomerFeedbackFormProps,
  type FeedbackResultsProps
} from './customer-feedback-system'

export {
  LoyaltyProgram,
  TierProgress,
  type LoyaltyTier,
  type CustomerLoyalty,
  type LoyaltyProgramProps,
  type TierProgressProps
} from './loyalty-program-system'

export {
  BarberDashboard,
  CustomerVisitExperience,
  type BarberExperience,
  type VisitStage,
  type VisitAction,
  type BarberDashboardProps,
  type CustomerVisitExperienceProps
} from './barber-experience-orchestrator'

export {
  BarberExperienceHub,
  ExperienceSystemOverview
} from './barber-experience-hub'

// =============================================================================
// EXPERIENCE SYSTEM OVERVIEW
// =============================================================================

/**
 * The Barber Experience System provides a comprehensive solution for:
 *
 * 1. **Customer Experience Dashboard**
 *    - Personalized welcome and visit tracking
 *    - Real-time appointment status
 *    - Loyalty program integration
 *    - Barber preference management
 *
 * 2. **Barber Profile System**
 *    - Detailed barber profiles with portfolios
 *    - Specialties and certifications
 *    - Availability and booking management
 *    - Customer reviews and ratings
 *
 * 3. **Appointment Status Tracker**
 *    - Real-time appointment progress
 *    - Live notifications and updates
 *    - Communication between barber and customer
 *    - Status history and timeline
 *
 * 4. **Customer Feedback System**
 *    - Multi-step feedback collection
 *    - Detailed rating categories
 *    - Follow-up preferences
 *    - Feedback analytics and insights
 *
 * 5. **Loyalty Program System**
 *    - Tier-based rewards structure
 *    - Points earning and redemption
 *    - Personalized offers and perks
 *    - Achievement tracking
 *
 * 6. **Barber Experience Orchestrator**
 *    - Complete visit workflow management
 *    - Stage-by-stage progress tracking
 *    - Real-time communication
 *    - Media documentation
 *    - Service completion and feedback
 *
 * This system creates an exceptional experience for both customers and barbers,
 * enhancing satisfaction, loyalty, and operational efficiency.
 */
