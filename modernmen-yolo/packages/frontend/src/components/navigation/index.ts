// Navigation Components
export { Header } from "./header"
export { Footer, DashboardFooter } from "./footer"
export { Breadcrumb, BreadcrumbContainer, PageHeader } from "./breadcrumb"
export { MobileNavigation, MobileBottomNav, MobileFAB } from "./mobile-navigation"
export { PageTransition, PageSkeleton, CardSkeleton, TableSkeleton } from "./page-transition"

// Navigation Context and Hooks
export {
  NavigationProvider,
  useNavigation,
  useNavigate,
  useNavigationState,
  usePageTransition
} from "./navigation-provider"

// User Flows
export { UserFlow, useUserFlow } from "./user-flows"
export type { UserFlow as UserFlowType } from "./user-flows"

// Layout Components
export {
  MainLayout,
  DashboardLayout,
  AuthLayout,
  LandingLayout
} from "../layout/main-layout"

// Re-export navigation configuration
export {
  mainNavigation,
  adminNavigation,
  staffNavigation,
  customerNavigation,
  footerNavigation,
  breadcrumbConfig
} from "../../lib/navigation"
export type { NavItem, NavGroup } from "../../lib/navigation"
