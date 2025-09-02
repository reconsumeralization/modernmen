export interface NavItem {
  name: string
  href: string
  icon?: string
  description?: string
  badge?: string
  children?: NavItem[]
  requiresAuth?: boolean
  roles?: ('admin' | 'staff' | 'customer')[]
  external?: boolean
}

export interface NavGroup {
  name: string
  items: NavItem[]
}

// Public navigation for non-authenticated users
export const publicNavigation: NavGroup[] = [
  {
    name: 'Services',
    items: [
      { name: 'Haircuts', href: '/services/haircuts', description: 'Professional haircuts and styling' },
      { name: 'Beard Grooming', href: '/services/beard', description: 'Beard trimming and shaping' },
      { name: 'Hair & Beard Combo', href: '/services/combo', description: 'Complete grooming package' },
      { name: 'Hot Towel Shave', href: '/services/shave', description: 'Luxurious straight razor shave' },
      { name: 'Hair Color', href: '/services/color', description: 'Professional hair coloring' },
      { name: 'All Services', href: '/services', description: 'View all our services' },
    ]
  },
  {
    name: 'Company',
    items: [
      { name: 'About Us', href: '/about', description: 'Learn about our story' },
      { name: 'Our Team', href: '/team', description: 'Meet our expert barbers' },
      { name: 'Gallery', href: '/gallery', description: 'View our work' },
      { name: 'Testimonials', href: '/testimonials', description: 'What our clients say' },
      { name: 'Blog', href: '/blog', description: 'Hair care tips and trends' },
    ]
  },
  {
    name: 'Support',
    items: [
      { name: 'Contact Us', href: '/contact', description: 'Get in touch' },
      { name: 'FAQ', href: '/faq', description: 'Frequently asked questions' },
      { name: 'Book Appointment', href: '/book', description: 'Schedule your visit' },
    ]
  }
]

// Main navigation for the header
export const mainNavigation: NavItem[] = [
  { name: 'Home', href: '/', icon: 'Home' },
  {
    name: 'Services',
    href: '/services',
    icon: 'ModernMen',
    children: [
      { name: 'Haircuts', href: '/services/haircuts' },
      { name: 'Beard Grooming', href: '/services/beard' },
      { name: 'Hair & Beard Combo', href: '/services/combo' },
      { name: 'Hot Towel Shave', href: '/services/shave' },
      { name: 'Hair Color', href: '/services/color' },
    ]
  },
  { name: 'Team', href: '/team', icon: 'Users' },
  { name: 'Gallery', href: '/gallery', icon: 'Image' },
  { name: 'Contact', href: '/contact', icon: 'Phone' },
  { name: 'Book Now', href: '/book', icon: 'Calendar', badge: 'primary' },
]

// Footer navigation
export const footerNavigation: NavGroup[] = [
  {
    name: 'Services',
    items: [
      { name: 'Haircuts', href: '/services/haircuts' },
      { name: 'Beard Grooming', href: '/services/beard' },
      { name: 'Hair & Beard Combo', href: '/services/combo' },
      { name: 'Hot Towel Shave', href: '/services/shave' },
      { name: 'Hair Color', href: '/services/color' },
    ]
  },
  {
    name: 'Company',
    items: [
      { name: 'About Us', href: '/about' },
      { name: 'Our Team', href: '/team' },
      { name: 'Careers', href: '/careers' },
      { name: 'Press', href: '/press' },
    ]
  },
  {
    name: 'Support',
    items: [
      { name: 'Contact Us', href: '/contact' },
      { name: 'FAQ', href: '/faq' },
      { name: 'Privacy Policy', href: '/privacy-policy' },
      { name: 'Terms of Service', href: '/terms' },
    ]
  },
  {
    name: 'Connect',
    items: [
      { name: 'Facebook', href: 'https://facebook.com/modernmen', external: true },
      { name: 'Instagram', href: 'https://instagram.com/modernmen', external: true },
      { name: 'Twitter', href: 'https://twitter.com/modernmen', external: true },
      { name: 'LinkedIn', href: 'https://linkedin.com/company/modernmen', external: true },
    ]
  }
]

// Admin navigation
export const adminNavigation: NavItem[] = [
  { name: 'Dashboard', href: '/admin/dashboard', icon: 'LayoutDashboard' },
  {
    name: 'Appointments',
    href: '/admin/appointments',
    icon: 'Calendar',
    children: [
      { name: 'All Appointments', href: '/admin/appointments' },
      { name: 'Today\'s Schedule', href: '/admin/appointments/today' },
      { name: 'Pending Confirmations', href: '/admin/appointments/pending' },
      { name: 'Cancelled', href: '/admin/appointments/cancelled' },
    ]
  },
  {
    name: 'Customers',
    href: '/admin/customers',
    icon: 'Users',
    children: [
      { name: 'All Customers', href: '/admin/customers' },
      { name: 'New Customers', href: '/admin/customers/new' },
      { name: 'VIP Customers', href: '/admin/customers/vip' },
      { name: 'Customer Feedback', href: '/admin/customers/feedback' },
    ]
  },
  {
    name: 'Staff',
    href: '/admin/staff',
    icon: 'UserCog',
    children: [
      { name: 'All Staff', href: '/admin/staff' },
      { name: 'Schedule Management', href: '/admin/staff/schedule' },
      { name: 'Performance', href: '/admin/staff/performance' },
      { name: 'Time Tracking', href: '/admin/staff/time-tracking' },
    ]
  },
  {
    name: 'Services',
    href: '/admin/services',
    icon: 'ModernMen',
    children: [
      { name: 'Service Catalog', href: '/admin/services' },
      { name: 'Pricing', href: '/admin/services/pricing' },
      { name: 'Service Categories', href: '/admin/services/categories' },
    ]
  },
  {
    name: 'Inventory',
    href: '/admin/inventory',
    icon: 'Package',
    children: [
      { name: 'Products', href: '/admin/inventory/products' },
      { name: 'Stock Levels', href: '/admin/inventory/stock' },
      { name: 'Suppliers', href: '/admin/inventory/suppliers' },
      { name: 'Low Stock Alerts', href: '/admin/inventory/alerts' },
    ]
  },
  {
    name: 'Analytics',
    href: '/admin/analytics',
    icon: 'BarChart3',
    children: [
      { name: 'Revenue Reports', href: '/admin/analytics/revenue' },
      { name: 'Customer Insights', href: '/admin/analytics/customers' },
      { name: 'Service Popularity', href: '/admin/analytics/services' },
      { name: 'Staff Performance', href: '/admin/analytics/staff' },
    ]
  },
  {
    name: 'Marketing',
    href: '/admin/marketing',
    icon: 'Megaphone',
    children: [
      { name: 'Promotions', href: '/admin/marketing/promotions' },
      { name: 'Email Campaigns', href: '/admin/marketing/email' },
      { name: 'Social Media', href: '/admin/marketing/social' },
      { name: 'Loyalty Program', href: '/admin/marketing/loyalty' },
    ]
  },
  { name: 'Settings', href: '/admin/settings', icon: 'Settings' },
]

// Staff navigation
export const staffNavigation: NavItem[] = [
  { name: 'Dashboard', href: '/staff/dashboard', icon: 'LayoutDashboard' },
  { name: 'My Schedule', href: '/staff/schedule', icon: 'Calendar' },
  {
    name: 'Appointments',
    href: '/staff/appointments',
    icon: 'Clock',
    children: [
      { name: 'Today\'s Appointments', href: '/staff/appointments/today' },
      { name: 'Upcoming', href: '/staff/appointments/upcoming' },
      { name: 'Completed', href: '/staff/appointments/completed' },
    ]
  },
  { name: 'Customer List', href: '/staff/customers', icon: 'Users' },
  { name: 'Time Tracking', href: '/staff/time-tracking', icon: 'Timer' },
  { name: 'Service Menu', href: '/staff/services', icon: 'ModernMen' },
  { name: 'Profile', href: '/staff/profile', icon: 'User' },
]

// Customer navigation
export const customerNavigation: NavItem[] = [
  { name: 'Dashboard', href: '/customer/dashboard', icon: 'LayoutDashboard' },
  {
    name: 'Appointments',
    href: '/customer/appointments',
    icon: 'Calendar',
    children: [
      { name: 'Book New', href: '/book' },
      { name: 'Upcoming', href: '/customer/appointments/upcoming' },
      { name: 'History', href: '/customer/appointments/history' },
      { name: 'Cancelled', href: '/customer/appointments/cancelled' },
    ]
  },
  { name: 'Services', href: '/services', icon: 'ModernMen' },
  { name: 'Loyalty Program', href: '/customer/loyalty', icon: 'Star' },
  { name: 'Profile', href: '/customer/profile', icon: 'User' },
  { name: 'Support', href: '/customer/support', icon: 'HelpCircle' },
]

// Breadcrumb configuration
export const breadcrumbConfig: Record<string, { label: string; parent?: string }> = {
  '/': { label: 'Home' },
  '/services': { label: 'Services' },
  '/services/haircuts': { label: 'Haircuts', parent: '/services' },
  '/services/beard': { label: 'Beard Grooming', parent: '/services' },
  '/services/combo': { label: 'Hair & Beard Combo', parent: '/services' },
  '/services/shave': { label: 'Hot Towel Shave', parent: '/services' },
  '/services/color': { label: 'Hair Color', parent: '/services' },
  '/team': { label: 'Our Team' },
  '/gallery': { label: 'Gallery' },
  '/contact': { label: 'Contact Us' },
  '/book': { label: 'Book Appointment' },
  '/about': { label: 'About Us' },
  '/blog': { label: 'Blog' },
  '/testimonials': { label: 'Testimonials' },
  '/faq': { label: 'FAQ' },
  '/admin': { label: 'Admin' },
  '/admin/dashboard': { label: 'Dashboard', parent: '/admin' },
  '/admin/appointments': { label: 'Appointments', parent: '/admin' },
  '/admin/customers': { label: 'Customers', parent: '/admin' },
  '/admin/staff': { label: 'Staff', parent: '/admin' },
  '/admin/services': { label: 'Services', parent: '/admin' },
  '/admin/inventory': { label: 'Inventory', parent: '/admin' },
  '/admin/analytics': { label: 'Analytics', parent: '/admin' },
  '/admin/marketing': { label: 'Marketing', parent: '/admin' },
  '/admin/settings': { label: 'Settings', parent: '/admin' },
  '/staff': { label: 'Staff' },
  '/staff/dashboard': { label: 'Dashboard', parent: '/staff' },
  '/staff/schedule': { label: 'My Schedule', parent: '/staff' },
  '/staff/appointments': { label: 'Appointments', parent: '/staff' },
  '/staff/customers': { label: 'Customers', parent: '/staff' },
  '/customer': { label: 'My Account' },
  '/customer/dashboard': { label: 'Dashboard', parent: '/customer' },
  '/customer/appointments': { label: 'Appointments', parent: '/customer' },
  '/customer/loyalty': { label: 'Loyalty Program', parent: '/customer' },
  '/customer/profile': { label: 'Profile', parent: '/customer' },
  '/customer/support': { label: 'Support', parent: '/customer' },
}
