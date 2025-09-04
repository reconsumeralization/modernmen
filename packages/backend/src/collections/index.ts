// Export all Payload CMS collections for the Modern Men Hair Salon

// Main collections
export { default as Appointments } from './Appointments'
export { default as Customers } from './Customers'

// Business collections
export { default as Services } from './business/Services'

// Personnel collections
export { default as Employees } from './personnel/Employees'
export { default as Payroll } from './personnel/Payroll'
export { default as Stylists } from './personnel/Stylists'
export { default as TimeClock } from './personnel/TimeClock'
export { default as Users } from './personnel/Users'

// Scheduling collections
export { default as EmployeeSchedules } from './scheduling/EmployeeSchedules'

// Shared collections
export { default as Media } from './shared/Media'

// Re-export with aliases for consistency
export const AppointmentsCollection = Appointments
export const CustomersCollection = Customers
export const ServicesCollection = Services
export const EmployeesCollection = Employees
export const PayrollCollection = Payroll
export const StylistsCollection = Stylists
export const TimeClockCollection = TimeClock
export const UsersCollection = Users
export const EmployeeSchedulesCollection = EmployeeSchedules
export const MediaCollection = Media

// Collection registry for Payload CMS configuration
export const collections = [
  Appointments,
  Customers,
  Services,
  Employees,
  Payroll,
  Stylists,
  TimeClock,
  Users,
  EmployeeSchedules,
  Media
]

export const collectionNames = [
  'appointments',
  'customers',
  'services',
  'employees',
  'payroll',
  'stylists',
  'time-clock',
  'users',
  'employee-schedules',
  'media'
] as const

export type CollectionName = typeof collectionNames[number]
