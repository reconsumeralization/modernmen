// Main navigation components
export { RoleBasedNavbar } from './RoleBasedNavbar'
export { BreadcrumbNavigation, useBreadcrumbs } from './BreadcrumbNavigation'

// Route protection components
export {
  ProtectedRoute,
  AdminOnly,
  ManagerOnly,
  StaffOnly,
  CustomerOnly,
  AuthenticatedOnly,
  withRoleProtection
} from './ProtectedRoute'

// Context and hooks
export { NavigationProvider, useNavigation, useRoleAccess } from '../../contexts/NavigationContext'

// Types
export type {
  UserRole,
  NavigationItem,
  NavigationGroup,
  UserNavigation,
  BreadcrumbItem,
  NavigationConfig
} from '../../types/navigation'

// Configuration
export {
  navigationConfig,
  getNavigationForRole,
  filterNavigationByRole,
  quickActions
} from '../../config/navigation'
