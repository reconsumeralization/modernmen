// =============================================================================
// UI COMPONENTS INDEX - Organized by Category for Easy Import/Export
// =============================================================================

// -----------------------------------------------------------------------------
// FORM COMPONENTS - Input, controls, and form-related elements
// -----------------------------------------------------------------------------
export { Button, buttonVariants } from "./button"
export { Input } from "./input"
export { Label } from "./label"
export { Textarea } from "./textarea"
export { Checkbox } from "./checkbox"
export { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./select"

// -----------------------------------------------------------------------------
// LAYOUT COMPONENTS - Structure and layout elements
// -----------------------------------------------------------------------------
export { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "./card"
export { Badge, badgeVariants } from "./badge"
export { ScrollArea } from "./scroll-area"

// -----------------------------------------------------------------------------
// DATA DISPLAY COMPONENTS - Tables, lists, and data presentation
// -----------------------------------------------------------------------------
export { DataTable } from "./data-table"
export { DataTableContent } from "./data-table-content"
export { DataTablePagination } from "./data-table-pagination"
export { Progress } from "./progress"

// -----------------------------------------------------------------------------
// OVERLAY COMPONENTS - Modals, popovers, tooltips
// -----------------------------------------------------------------------------
export { Popover, PopoverContent, PopoverTrigger } from "./popover"

// -----------------------------------------------------------------------------
// MENU COMPONENTS - Dropdowns and context menus
// -----------------------------------------------------------------------------
export {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuPortal,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger
} from "./dropdown-menu"

// -----------------------------------------------------------------------------
// CUSTOM APPLICATION COMPONENTS - Domain-specific components
// -----------------------------------------------------------------------------
export { AppointmentCalendar } from "./appointment-calendar"
export { BookingModal } from "./booking-modal"
export { FormWizard, useFormWizard } from "./form-wizard"
export { NotificationCenter } from "./notification-center"
export { NotificationItem } from "./notification-item"
export {
  StatsCard,
  RevenueStatsCard,
  AppointmentsStatsCard,
  CustomerStatsCard
} from "./stats-card"

// -----------------------------------------------------------------------------
// NOTIFICATION TYPES - Type definitions for notifications
// -----------------------------------------------------------------------------
export type { NotificationType, NotificationGroup, NotificationPreferences, NotificationSettings } from "./notification-types"

// -----------------------------------------------------------------------------
// LAYOUT COMPONENTS - Page-level layouts from layout directory
// -----------------------------------------------------------------------------
export { DashboardLayout } from "../layout/dashboard-layout"

// -----------------------------------------------------------------------------
// UTILITY EXPORTS - Re-export all component internals for advanced usage
// -----------------------------------------------------------------------------
export * from "./button"
export * from "./input"
export * from "./label"
export * from "./textarea"
export * from "./checkbox"
export * from "./select"
export * from "./card"
export * from "./badge"
export * from "./scroll-area"
export * from "./progress"
export * from "./data-table"
export * from "./popover"
export * from "./dropdown-menu"
