/**
 * Universal Business Builder System
 * Dynamically configures navigation, terminology, and features based on business type
 */

export type BusinessType = 
  | 'hair-salon' 
  | 'restaurant' 
  | 'law-firm' 
  | 'medical-practice'
  | 'retail-store'
  | 'fitness-gym'
  | 'beauty-spa'
  | 'auto-repair'
  | 'real-estate'
  | 'consulting'
  | 'generic'

export type UserRole = 'customer' | 'client' | 'staff' | 'admin' | 'owner'

export interface BusinessConfig {
  type: BusinessType
  name: string
  terminology: BusinessTerminology
  navigation: NavigationConfig
  features: BusinessFeatures
  styling: BusinessStyling
  collections: CollectionConfig
}

export interface BusinessTerminology {
  // Universal terms that change based on business type
  customer: string        // customer, client, patient, guest, member
  customers: string       // customers, clients, patients, guests, members  
  service: string         // service, product, treatment, consultation, class
  services: string        // services, products, treatments, consultations, classes
  staff: string          // staff, team, stylists, attorneys, doctors, trainers
  booking: string        // booking, appointment, reservation, consultation, session
  bookings: string       // bookings, appointments, reservations, consultations, sessions
  provider: string       // stylist, chef, attorney, doctor, trainer, consultant
  providers: string      // stylists, chefs, attorneys, doctors, trainers, consultants
}

export interface NavigationConfig {
  publicPages: NavPage[]
  portalPages: NavPage[]
  adminPages: NavPage[]
  mobileNav: NavPage[]
  primaryCTA: {
    label: string
    href: string
    icon: string
  }
}

export interface NavPage {
  id: string
  label: string
  href: string
  icon: string
  description?: string
  priority?: 'high' | 'medium' | 'low'
  showInNav?: boolean
}

export interface BusinessFeatures {
  // Core features available for this business type
  hasAppointments: boolean
  hasProducts: boolean
  hasServices: boolean
  hasGallery: boolean
  hasTeamProfiles: boolean
  hasLoyaltyProgram: boolean
  hasInventoryTracking: boolean
  hasPaymentProcessing: boolean
  hasCalendarIntegration: boolean
  hasReviews: boolean
  hasNotifications: boolean
  hasReporting: boolean
  hasMultiLocation: boolean
  hasOnlineOrdering: boolean
  hasDelivery: boolean
}

export interface BusinessStyling {
  primaryColor: string
  secondaryColor: string
  accentColor: string
  iconSet: string
  theme: 'professional' | 'modern' | 'elegant' | 'casual' | 'medical'
}

export interface CollectionConfig {
  [key: string]: {
    displayName: string
    pluralName: string
    icon: string
    group: string
    priority: number
  }
}

// Business Type Configurations
const BUSINESS_CONFIGS: Record<BusinessType, BusinessConfig> = {
  'hair-salon': {
    type: 'hair-salon',
    name: 'Hair Salon',
    terminology: {
      customer: 'customer',
      customers: 'customers',
      service: 'service',
      services: 'services',
      staff: 'stylist',
      booking: 'appointment',
      bookings: 'appointments',
      provider: 'stylist',
      providers: 'stylists'
    },
    navigation: {
      publicPages: [
        { id: 'home', label: 'Home', href: '/', icon: 'home', priority: 'high' },
        { id: 'services', label: 'Services', href: '/services', icon: 'scissors', priority: 'high' },
        { id: 'stylists', label: 'Stylists', href: '/team', icon: 'users', priority: 'medium' },
        { id: 'gallery', label: 'Gallery', href: '/gallery', icon: 'image', priority: 'medium' },
        { id: 'about', label: 'About', href: '/about', icon: 'info', priority: 'low' },
        { id: 'contact', label: 'Contact', href: '/contact', icon: 'phone', priority: 'medium' }
      ],
      portalPages: [
        { id: 'dashboard', label: 'Dashboard', href: '/portal', icon: 'layout-dashboard' },
        { id: 'appointments', label: 'My Appointments', href: '/portal/appointments', icon: 'calendar' },
        { id: 'book', label: 'Book Appointment', href: '/portal/book', icon: 'calendar-plus' },
        { id: 'loyalty', label: 'Loyalty Points', href: '/portal/loyalty', icon: 'star' },
        { id: 'profile', label: 'Profile', href: '/portal/profile', icon: 'user' }
      ],
      adminPages: [
        { id: 'overview', label: 'Overview', href: '/admin', icon: 'dashboard' },
        { id: 'appointments', label: 'Appointments', href: '/admin/appointments', icon: 'calendar' },
        { id: 'customers', label: 'Customers', href: '/admin/customers', icon: 'users' },
        { id: 'services', label: 'Services', href: '/admin/services', icon: 'scissors' },
        { id: 'stylists', label: 'Stylists', href: '/admin/staff', icon: 'user-check' },
        { id: 'reports', label: 'Reports', href: '/admin/reports', icon: 'bar-chart' }
      ],
      mobileNav: [
        { id: 'home', label: 'Home', href: '/', icon: 'home' },
        { id: 'services', label: 'Services', href: '/services', icon: 'scissors' },
        { id: 'book', label: 'Book', href: '/book', icon: 'calendar' },
        { id: 'profile', label: 'Account', href: '/portal', icon: 'user' }
      ],
      primaryCTA: {
        label: 'Book Appointment',
        href: '/book',
        icon: 'calendar-plus'
      }
    },
    features: {
      hasAppointments: true,
      hasProducts: false,
      hasServices: true,
      hasGallery: true,
      hasTeamProfiles: true,
      hasLoyaltyProgram: true,
      hasInventoryTracking: false,
      hasPaymentProcessing: true,
      hasCalendarIntegration: true,
      hasReviews: true,
      hasNotifications: true,
      hasReporting: true,
      hasMultiLocation: false,
      hasOnlineOrdering: false,
      hasDelivery: false
    },
    styling: {
      primaryColor: '#1f2937',
      secondaryColor: '#374151',
      accentColor: '#10b981',
      iconSet: 'salon',
      theme: 'modern'
    },
    collections: {
      customers: { displayName: 'Customer', pluralName: 'Customers', icon: 'users', group: 'Customers', priority: 1 },
      appointments: { displayName: 'Appointment', pluralName: 'Appointments', icon: 'calendar', group: 'Operations', priority: 2 },
      services: { displayName: 'Service', pluralName: 'Services', icon: 'scissors', group: 'Services', priority: 3 },
      staff: { displayName: 'Stylist', pluralName: 'Stylists', icon: 'user-check', group: 'Team', priority: 4 }
    }
  },

  'restaurant': {
    type: 'restaurant',
    name: 'Restaurant',
    terminology: {
      customer: 'customer',
      customers: 'customers',
      service: 'menu item',
      services: 'menu items',
      staff: 'team member',
      booking: 'reservation',
      bookings: 'reservations',
      provider: 'chef',
      providers: 'kitchen staff'
    },
    navigation: {
      publicPages: [
        { id: 'home', label: 'Home', href: '/', icon: 'home', priority: 'high' },
        { id: 'menu', label: 'Menu', href: '/menu', icon: 'utensils', priority: 'high' },
        { id: 'chefs', label: 'Our Chefs', href: '/team', icon: 'chef-hat', priority: 'medium' },
        { id: 'location', label: 'Location', href: '/location', icon: 'map-pin', priority: 'medium' },
        { id: 'about', label: 'About', href: '/about', icon: 'info', priority: 'low' },
        { id: 'contact', label: 'Contact', href: '/contact', icon: 'phone', priority: 'medium' }
      ],
      portalPages: [
        { id: 'dashboard', label: 'Dashboard', href: '/portal', icon: 'layout-dashboard' },
        { id: 'orders', label: 'My Orders', href: '/portal/orders', icon: 'shopping-bag' },
        { id: 'reservations', label: 'Reservations', href: '/portal/reservations', icon: 'calendar' },
        { id: 'favorites', label: 'Favorites', href: '/portal/favorites', icon: 'heart' },
        { id: 'profile', label: 'Profile', href: '/portal/profile', icon: 'user' }
      ],
      adminPages: [
        { id: 'overview', label: 'Overview', href: '/admin', icon: 'dashboard' },
        { id: 'orders', label: 'Orders', href: '/admin/orders', icon: 'shopping-bag' },
        { id: 'reservations', label: 'Reservations', href: '/admin/reservations', icon: 'calendar' },
        { id: 'customers', label: 'Customers', href: '/admin/customers', icon: 'users' },
        { id: 'menu', label: 'Menu Management', href: '/admin/menu', icon: 'utensils' },
        { id: 'staff', label: 'Staff', href: '/admin/staff', icon: 'users' }
      ],
      mobileNav: [
        { id: 'home', label: 'Home', href: '/', icon: 'home' },
        { id: 'menu', label: 'Menu', href: '/menu', icon: 'utensils' },
        { id: 'order', label: 'Order', href: '/order', icon: 'shopping-bag' },
        { id: 'account', label: 'Account', href: '/portal', icon: 'user' }
      ],
      primaryCTA: {
        label: 'Order Now',
        href: '/order',
        icon: 'shopping-bag'
      }
    },
    features: {
      hasAppointments: false,
      hasProducts: true,
      hasServices: false,
      hasGallery: true,
      hasTeamProfiles: true,
      hasLoyaltyProgram: true,
      hasInventoryTracking: true,
      hasPaymentProcessing: true,
      hasCalendarIntegration: true,
      hasReviews: true,
      hasNotifications: true,
      hasReporting: true,
      hasMultiLocation: true,
      hasOnlineOrdering: true,
      hasDelivery: true
    },
    styling: {
      primaryColor: '#dc2626',
      secondaryColor: '#991b1b',
      accentColor: '#fbbf24',
      iconSet: 'restaurant',
      theme: 'casual'
    },
    collections: {
      customers: { displayName: 'Customer', pluralName: 'Customers', icon: 'users', group: 'Customers', priority: 1 },
      orders: { displayName: 'Order', pluralName: 'Orders', icon: 'shopping-bag', group: 'Operations', priority: 2 },
      menu: { displayName: 'Menu Item', pluralName: 'Menu Items', icon: 'utensils', group: 'Menu', priority: 3 },
      staff: { displayName: 'Staff Member', pluralName: 'Staff', icon: 'chef-hat', group: 'Team', priority: 4 }
    }
  },

  'law-firm': {
    type: 'law-firm',
    name: 'Law Firm',
    terminology: {
      customer: 'client',
      customers: 'clients',
      service: 'legal service',
      services: 'practice areas',
      staff: 'attorney',
      booking: 'consultation',
      bookings: 'consultations',
      provider: 'attorney',
      providers: 'attorneys'
    },
    navigation: {
      publicPages: [
        { id: 'home', label: 'Home', href: '/', icon: 'home', priority: 'high' },
        { id: 'practice-areas', label: 'Practice Areas', href: '/services', icon: 'scales', priority: 'high' },
        { id: 'attorneys', label: 'Attorneys', href: '/team', icon: 'user-tie', priority: 'high' },
        { id: 'case-results', label: 'Case Results', href: '/results', icon: 'trophy', priority: 'medium' },
        { id: 'resources', label: 'Legal Resources', href: '/resources', icon: 'book-open', priority: 'medium' },
        { id: 'about', label: 'About', href: '/about', icon: 'info', priority: 'low' },
        { id: 'contact', label: 'Contact', href: '/contact', icon: 'phone', priority: 'medium' }
      ],
      portalPages: [
        { id: 'dashboard', label: 'Client Dashboard', href: '/portal', icon: 'layout-dashboard' },
        { id: 'cases', label: 'My Cases', href: '/portal/cases', icon: 'briefcase' },
        { id: 'documents', label: 'Documents', href: '/portal/documents', icon: 'file-text' },
        { id: 'billing', label: 'Billing', href: '/portal/billing', icon: 'credit-card' },
        { id: 'communications', label: 'Communications', href: '/portal/messages', icon: 'message-square' },
        { id: 'profile', label: 'Profile', href: '/portal/profile', icon: 'user' }
      ],
      adminPages: [
        { id: 'overview', label: 'Overview', href: '/admin', icon: 'dashboard' },
        { id: 'cases', label: 'Cases', href: '/admin/cases', icon: 'briefcase' },
        { id: 'clients', label: 'Clients', href: '/admin/clients', icon: 'users' },
        { id: 'calendar', label: 'Calendar', href: '/admin/calendar', icon: 'calendar' },
        { id: 'documents', label: 'Document Library', href: '/admin/documents', icon: 'file-text' },
        { id: 'billing', label: 'Billing', href: '/admin/billing', icon: 'credit-card' },
        { id: 'attorneys', label: 'Attorneys', href: '/admin/attorneys', icon: 'user-tie' }
      ],
      mobileNav: [
        { id: 'home', label: 'Home', href: '/', icon: 'home' },
        { id: 'practice-areas', label: 'Services', href: '/services', icon: 'scales' },
        { id: 'consult', label: 'Consultation', href: '/book', icon: 'calendar-check' },
        { id: 'portal', label: 'Client Portal', href: '/portal', icon: 'user' }
      ],
      primaryCTA: {
        label: 'Schedule Consultation',
        href: '/book',
        icon: 'calendar-check'
      }
    },
    features: {
      hasAppointments: true,
      hasProducts: false,
      hasServices: true,
      hasGallery: false,
      hasTeamProfiles: true,
      hasLoyaltyProgram: false,
      hasInventoryTracking: false,
      hasPaymentProcessing: true,
      hasCalendarIntegration: true,
      hasReviews: true,
      hasNotifications: true,
      hasReporting: true,
      hasMultiLocation: true,
      hasOnlineOrdering: false,
      hasDelivery: false
    },
    styling: {
      primaryColor: '#1e40af',
      secondaryColor: '#1e3a8a',
      accentColor: '#3b82f6',
      iconSet: 'legal',
      theme: 'professional'
    },
    collections: {
      clients: { displayName: 'Client', pluralName: 'Clients', icon: 'users', group: 'Clients', priority: 1 },
      cases: { displayName: 'Case', pluralName: 'Cases', icon: 'briefcase', group: 'Practice', priority: 2 },
      services: { displayName: 'Practice Area', pluralName: 'Practice Areas', icon: 'scales', group: 'Services', priority: 3 },
      attorneys: { displayName: 'Attorney', pluralName: 'Attorneys', icon: 'user-tie', group: 'Team', priority: 4 }
    }
  },

  'medical-practice': {
    type: 'medical-practice',
    name: 'Medical Practice',
    terminology: {
      customer: 'patient',
      customers: 'patients',
      service: 'medical service',
      services: 'medical services',
      staff: 'provider',
      booking: 'appointment',
      bookings: 'appointments',
      provider: 'doctor',
      providers: 'medical staff'
    },
    navigation: {
      publicPages: [
        { id: 'home', label: 'Home', href: '/', icon: 'home', priority: 'high' },
        { id: 'services', label: 'Medical Services', href: '/services', icon: 'stethoscope', priority: 'high' },
        { id: 'providers', label: 'Our Providers', href: '/team', icon: 'user-md', priority: 'high' },
        { id: 'patient-resources', label: 'Patient Resources', href: '/resources', icon: 'file-medical', priority: 'medium' },
        { id: 'insurance', label: 'Insurance', href: '/insurance', icon: 'shield-check', priority: 'medium' },
        { id: 'about', label: 'About', href: '/about', icon: 'info', priority: 'low' },
        { id: 'contact', label: 'Contact', href: '/contact', icon: 'phone', priority: 'medium' }
      ],
      portalPages: [
        { id: 'dashboard', label: 'Patient Portal', href: '/portal', icon: 'layout-dashboard' },
        { id: 'appointments', label: 'Appointments', href: '/portal/appointments', icon: 'calendar' },
        { id: 'medical-records', label: 'Medical Records', href: '/portal/records', icon: 'file-medical' },
        { id: 'prescriptions', label: 'Prescriptions', href: '/portal/prescriptions', icon: 'pill' },
        { id: 'lab-results', label: 'Lab Results', href: '/portal/lab-results', icon: 'flask' },
        { id: 'billing', label: 'Billing', href: '/portal/billing', icon: 'credit-card' },
        { id: 'profile', label: 'Profile', href: '/portal/profile', icon: 'user' }
      ],
      adminPages: [
        { id: 'overview', label: 'Overview', href: '/admin', icon: 'dashboard' },
        { id: 'appointments', label: 'Appointments', href: '/admin/appointments', icon: 'calendar' },
        { id: 'patients', label: 'Patients', href: '/admin/patients', icon: 'users' },
        { id: 'medical-records', label: 'Medical Records', href: '/admin/records', icon: 'file-medical' },
        { id: 'providers', label: 'Providers', href: '/admin/providers', icon: 'user-md' },
        { id: 'billing', label: 'Billing', href: '/admin/billing', icon: 'credit-card' }
      ],
      mobileNav: [
        { id: 'home', label: 'Home', href: '/', icon: 'home' },
        { id: 'services', label: 'Services', href: '/services', icon: 'stethoscope' },
        { id: 'book', label: 'Book', href: '/book', icon: 'calendar' },
        { id: 'portal', label: 'Portal', href: '/portal', icon: 'user' }
      ],
      primaryCTA: {
        label: 'Book Appointment',
        href: '/book',
        icon: 'calendar-plus'
      }
    },
    features: {
      hasAppointments: true,
      hasProducts: false,
      hasServices: true,
      hasGallery: false,
      hasTeamProfiles: true,
      hasLoyaltyProgram: false,
      hasInventoryTracking: true,
      hasPaymentProcessing: true,
      hasCalendarIntegration: true,
      hasReviews: false,
      hasNotifications: true,
      hasReporting: true,
      hasMultiLocation: true,
      hasOnlineOrdering: false,
      hasDelivery: false
    },
    styling: {
      primaryColor: '#059669',
      secondaryColor: '#047857',
      accentColor: '#10b981',
      iconSet: 'medical',
      theme: 'medical'
    },
    collections: {
      patients: { displayName: 'Patient', pluralName: 'Patients', icon: 'users', group: 'Patients', priority: 1 },
      appointments: { displayName: 'Appointment', pluralName: 'Appointments', icon: 'calendar', group: 'Operations', priority: 2 },
      services: { displayName: 'Medical Service', pluralName: 'Medical Services', icon: 'stethoscope', group: 'Services', priority: 3 },
      providers: { displayName: 'Provider', pluralName: 'Providers', icon: 'user-md', group: 'Team', priority: 4 }
    }
  },

  'generic': {
    type: 'generic',
    name: 'Business',
    terminology: {
      customer: 'customer',
      customers: 'customers', 
      service: 'service',
      services: 'services',
      staff: 'team member',
      booking: 'appointment',
      bookings: 'appointments',
      provider: 'provider',
      providers: 'team'
    },
    navigation: {
      publicPages: [
        { id: 'home', label: 'Home', href: '/', icon: 'home', priority: 'high' },
        { id: 'services', label: 'Services', href: '/services', icon: 'briefcase', priority: 'high' },
        { id: 'team', label: 'Team', href: '/team', icon: 'users', priority: 'medium' },
        { id: 'about', label: 'About', href: '/about', icon: 'info', priority: 'low' },
        { id: 'contact', label: 'Contact', href: '/contact', icon: 'phone', priority: 'medium' }
      ],
      portalPages: [
        { id: 'dashboard', label: 'Dashboard', href: '/portal', icon: 'layout-dashboard' },
        { id: 'bookings', label: 'Bookings', href: '/portal/bookings', icon: 'calendar' },
        { id: 'profile', label: 'Profile', href: '/portal/profile', icon: 'user' }
      ],
      adminPages: [
        { id: 'overview', label: 'Overview', href: '/admin', icon: 'dashboard' },
        { id: 'customers', label: 'Customers', href: '/admin/customers', icon: 'users' },
        { id: 'services', label: 'Services', href: '/admin/services', icon: 'briefcase' },
        { id: 'team', label: 'Team', href: '/admin/team', icon: 'users' }
      ],
      mobileNav: [
        { id: 'home', label: 'Home', href: '/', icon: 'home' },
        { id: 'services', label: 'Services', href: '/services', icon: 'briefcase' },
        { id: 'book', label: 'Book', href: '/book', icon: 'calendar' },
        { id: 'account', label: 'Account', href: '/portal', icon: 'user' }
      ],
      primaryCTA: {
        label: 'Get Started',
        href: '/book',
        icon: 'arrow-right'
      }
    },
    features: {
      hasAppointments: true,
      hasProducts: false,
      hasServices: true,
      hasGallery: false,
      hasTeamProfiles: true,
      hasLoyaltyProgram: false,
      hasInventoryTracking: false,
      hasPaymentProcessing: true,
      hasCalendarIntegration: true,
      hasReviews: true,
      hasNotifications: true,
      hasReporting: true,
      hasMultiLocation: false,
      hasOnlineOrdering: false,
      hasDelivery: false
    },
    styling: {
      primaryColor: '#10b981',
      secondaryColor: '#374151',
      accentColor: '#3b82f6',
      iconSet: 'generic',
      theme: 'modern'
    },
    collections: {
      customers: { displayName: 'Customer', pluralName: 'Customers', icon: 'users', group: 'Customers', priority: 1 },
      bookings: { displayName: 'Booking', pluralName: 'Bookings', icon: 'calendar', group: 'Operations', priority: 2 },
      services: { displayName: 'Service', pluralName: 'Services', icon: 'briefcase', group: 'Services', priority: 3 },
      team: { displayName: 'Team Member', pluralName: 'Team', icon: 'users', group: 'Team', priority: 4 }
    }
  }
}

/**
 * Get business configuration based on environment variable or default
 */
export function getBusinessConfig(businessType?: BusinessType): BusinessConfig {
  const type = businessType || (process.env.BUSINESS_TYPE as BusinessType) || 'generic'
  return BUSINESS_CONFIGS[type] || BUSINESS_CONFIGS.generic
}

/**
 * Get business terminology for dynamic content
 */
export function getBusinessTerminology(businessType?: BusinessType): BusinessTerminology {
  const config = getBusinessConfig(businessType)
  return config.terminology
}

/**
 * Get navigation configuration for business type
 */
export function getNavigationConfig(businessType?: BusinessType): NavigationConfig {
  const config = getBusinessConfig(businessType)
  return config.navigation
}

/**
 * Get available features for business type
 */
export function getBusinessFeatures(businessType?: BusinessType): BusinessFeatures {
  const config = getBusinessConfig(businessType)
  return config.features
}

/**
 * Get styling configuration for business type
 */
export function getBusinessStyling(businessType?: BusinessType): BusinessStyling {
  const config = getBusinessConfig(businessType)
  return config.styling
}

/**
 * Get collection configuration for business type
 */
export function getCollectionConfig(businessType?: BusinessType): CollectionConfig {
  const config = getBusinessConfig(businessType)
  return config.collections
}

/**
 * Generate breadcrumbs based on current path and business type
 */
export function generateBreadcrumbs(pathname: string, businessType?: BusinessType) {
  const config = getBusinessConfig(businessType)
  const segments = pathname.split('/').filter(Boolean)
  const breadcrumbs = [{ label: 'Home', href: '/' }]

  segments.forEach((segment, index) => {
    const href = '/' + segments.slice(0, index + 1).join('/')
    
    // Find matching page in navigation config
    const allPages = [
      ...config.navigation.publicPages,
      ...config.navigation.portalPages,
      ...config.navigation.adminPages
    ]
    
    const page = allPages.find(p => p.href === href || p.id === segment)
    const label = page?.label || segment.charAt(0).toUpperCase() + segment.slice(1)
    
    breadcrumbs.push({ label, href })
  })

  return breadcrumbs
}

/**
 * Check if a feature is enabled for the current business type
 */
export function hasFeature(feature: keyof BusinessFeatures, businessType?: BusinessType): boolean {
  const features = getBusinessFeatures(businessType)
  return features[feature]
}

/**
 * Get appropriate redirect path based on user role and business type
 */
export function getUserRedirectPath(userRole: UserRole, businessType?: BusinessType): string {
  const config = getBusinessConfig(businessType)
  
  switch (userRole) {
    case 'customer':
    case 'client':
      return '/portal'
    case 'staff':
      // Redirect to most relevant admin page for business type
      if (config.type === 'hair-salon') return '/admin/appointments'
      if (config.type === 'restaurant') return '/admin/orders'
      if (config.type === 'law-firm') return '/admin/cases'
      if (config.type === 'medical-practice') return '/admin/appointments'
      return '/admin/appointments'
    case 'admin':
    case 'owner':
      return '/admin'
    default:
      return '/portal'
  }
}

/**
 * Generate dynamic page title based on business type and page
 */
export function generatePageTitle(pageId: string, businessType?: BusinessType): string {
  const config = getBusinessConfig(businessType)
  const businessName = process.env.BRAND_NAME || config.name
  
  const allPages = [
    ...config.navigation.publicPages,
    ...config.navigation.portalPages,
    ...config.navigation.adminPages
  ]
  
  const page = allPages.find(p => p.id === pageId)
  const pageLabel = page?.label || pageId
  
  return `${pageLabel} | ${businessName}`
}

export default {
  getBusinessConfig,
  getBusinessTerminology,
  getNavigationConfig,
  getBusinessFeatures,
  getBusinessStyling,
  getCollectionConfig,
  generateBreadcrumbs,
  hasFeature,
  getUserRedirectPath,
  generatePageTitle
}