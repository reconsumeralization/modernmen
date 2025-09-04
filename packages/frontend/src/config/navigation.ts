import { UserRole, NavigationItem, UserNavigation, NavigationConfig } from '@/types/navigation';

// Common navigation items available to all users
const publicNavigation: NavigationItem[] = [
  { name: 'Home', href: '/', icon: 'home', description: 'Return to homepage' },
  { name: 'About', href: '/about', icon: 'info', description: 'Learn more about us' },
  { name: 'Services', href: '/services', icon: 'scissors', description: 'Our salon services' },
  { name: 'Book Appointment', href: '/booking', icon: 'calendar', description: 'Schedule your visit' },
  { name: 'Contact', href: '/contact', icon: 'phone', description: 'Get in touch' },
];

// Customer-specific navigation
const customerNavigation: UserNavigation = {
  main: [
    ...publicNavigation,
    { name: 'Book Appointment', href: '/booking', icon: 'calendar', description: 'Schedule your visit' },
  ],
  secondary: [
    { name: 'My Profile', href: '/profile', icon: 'user', description: 'Manage your account' },
    { name: 'My Appointments', href: '/appointments', icon: 'calendar', description: 'View your bookings' },
    { name: 'Loyalty Points', href: '/loyalty', icon: 'star', description: 'Your rewards' },
  ],
  user: [
    { name: 'Settings', href: '/settings', icon: 'settings', description: 'Account preferences' },
    { name: 'Support', href: '/support', icon: 'help', description: 'Get help' },
  ]
};

// Stylist navigation
const stylistNavigation: UserNavigation = {
  main: [
    { name: 'Dashboard', href: '/stylist/dashboard', icon: 'dashboard', description: 'Your dashboard' },
    { name: 'Schedule', href: '/stylist/schedule', icon: 'calendar', description: 'Manage your schedule' },
    { name: 'Appointments', href: '/stylist/appointments', icon: 'calendar', description: 'Client appointments' },
    { name: 'Services', href: '/stylist/services', icon: 'scissors', description: 'Your services' },
  ],
  secondary: [
    { name: 'Profile', href: '/stylist/profile', icon: 'user', description: 'Your profile' },
    { name: 'Clients', href: '/stylist/clients', icon: 'users', description: 'Client management' },
    { name: 'Time Off', href: '/stylist/time-off', icon: 'clock', description: 'Request time off' },
  ],
  user: [
    { name: 'Settings', href: '/settings', icon: 'settings', description: 'Account preferences' },
    { name: 'Support', href: '/support', icon: 'help', description: 'Get help' },
  ]
};

// Staff navigation
const staffNavigation: UserNavigation = {
  main: [
    { name: 'Dashboard', href: '/staff/dashboard', icon: 'dashboard', description: 'Staff dashboard' },
    { name: 'Appointments', href: '/staff/appointments', icon: 'calendar', description: 'All appointments' },
    { name: 'Clients', href: '/staff/clients', icon: 'users', description: 'Client management' },
    { name: 'Services', href: '/staff/services', icon: 'scissors', description: 'Service management' },
  ],
  secondary: [
    { name: 'Schedule', href: '/staff/schedule', icon: 'calendar', description: 'Staff schedules' },
    { name: 'Reports', href: '/staff/reports', icon: 'chart', description: 'Daily reports' },
    { name: 'Inventory', href: '/staff/inventory', icon: 'package', description: 'Manage inventory' },
  ],
  user: [
    { name: 'Profile', href: '/profile', icon: 'user', description: 'Your profile' },
    { name: 'Settings', href: '/settings', icon: 'settings', description: 'Account preferences' },
  ]
};

// Manager navigation
const managerNavigation: UserNavigation = {
  main: [
    { name: 'Dashboard', href: '/manager/dashboard', icon: 'dashboard', description: 'Management dashboard' },
    { name: 'Appointments', href: '/manager/appointments', icon: 'calendar', description: 'All appointments' },
    { name: 'Staff', href: '/manager/staff', icon: 'users', description: 'Staff management' },
    { name: 'Clients', href: '/manager/clients', icon: 'users', description: 'Client management' },
    { name: 'Services', href: '/manager/services', icon: 'scissors', description: 'Service management' },
  ],
  secondary: [
    { name: 'Reports', href: '/manager/reports', icon: 'chart', description: 'Business reports' },
    { name: 'Analytics', href: '/manager/analytics', icon: 'analytics', description: 'Performance analytics' },
    { name: 'Inventory', href: '/manager/inventory', icon: 'package', description: 'Inventory management' },
    { name: 'Marketing', href: '/manager/marketing', icon: 'megaphone', description: 'Marketing tools' },
  ],
  user: [
    { name: 'Profile', href: '/profile', icon: 'user', description: 'Your profile' },
    { name: 'Settings', href: '/settings', icon: 'settings', description: 'Account preferences' },
  ]
};

// Admin navigation
const adminNavigation: UserNavigation = {
  main: [
    { name: 'Dashboard', href: '/admin/dashboard', icon: 'dashboard', description: 'Admin dashboard' },
    { name: 'Users', href: '/admin/users', icon: 'users', description: 'User management' },
    { name: 'Appointments', href: '/admin/appointments', icon: 'calendar', description: 'All appointments' },
    { name: 'Services', href: '/admin/services', icon: 'scissors', description: 'Service management' },
    { name: 'Content', href: '/admin/content', icon: 'file-text', description: 'Content management' },
  ],
  secondary: [
    { name: 'Analytics', href: '/admin/analytics', icon: 'analytics', description: 'System analytics' },
    { name: 'Reports', href: '/admin/reports', icon: 'chart', description: 'Business reports' },
    { name: 'Settings', href: '/admin/settings', icon: 'settings', description: 'System settings' },
    { name: 'Logs', href: '/admin/logs', icon: 'file-text', description: 'System logs' },
    { name: 'Backup', href: '/admin/backup', icon: 'archive', description: 'Data backup' },
  ],
  admin: [
    { name: 'Payload CMS', href: '/admin/payload', icon: 'database', description: 'Content management system' },
    { name: 'Documentation', href: '/documentation', icon: 'book', description: 'System documentation' },
  ],
  user: [
    { name: 'Profile', href: '/profile', icon: 'user', description: 'Your profile' },
    { name: 'System Settings', href: '/admin/system-settings', icon: 'settings', description: 'System configuration' },
  ]
};

// Guest/Public navigation (no authentication required)
const guestNavigation: UserNavigation = {
  main: publicNavigation,
  secondary: [
    { name: 'Search', href: '/search', icon: 'search', description: 'Find services' },
    { name: 'Book Now', href: '/booking', icon: 'calendar', description: 'Make an appointment' },
  ]
};

// Navigation configuration for each user role
export const navigationConfig: NavigationConfig = {
  guest: { navigation: guestNavigation },
  customer: { navigation: customerNavigation },
  client: { navigation: customerNavigation }, // Alias for customer
  stylist: { navigation: stylistNavigation },
  staff: { navigation: staffNavigation },
  manager: { navigation: managerNavigation },
  admin: { navigation: adminNavigation },
};

// Quick actions available to all authenticated users
export const quickActions: NavigationItem[] = [
  { name: 'Search', href: '/search', icon: 'search', description: 'Find services & info' },
  { name: 'Book Now', href: '/booking', icon: 'calendar', description: 'Schedule appointment', roles: ['guest', 'customer', 'client'] },
  { name: 'Call Us', href: 'tel:(306)522-4111', icon: 'phone', description: 'Call (306) 522-4111' },
];

// Utility function to get navigation for a specific role
export function getNavigationForRole(role: UserRole): UserNavigation {
  return navigationConfig[role]?.navigation || guestNavigation;
}

// Utility function to check if a navigation item is accessible to a user
export function isNavigationItemAccessible(item: NavigationItem, userRole: UserRole): boolean {
  if (!item.roles) return true; // No role restrictions
  return item.roles.includes(userRole);
}

// Utility function to filter navigation items based on user role
export function filterNavigationByRole(navigation: UserNavigation, userRole: UserRole): UserNavigation {
  const filterItems = (items: NavigationItem[]): NavigationItem[] => {
    return items
      .filter(item => isNavigationItemAccessible(item, userRole))
      .map(item => ({
        ...item,
        children: item.children ? filterItems(item.children) : undefined
      }));
  };

  return {
    main: filterItems(navigation.main),
    secondary: navigation.secondary ? filterItems(navigation.secondary) : undefined,
    user: navigation.user ? filterItems(navigation.user) : undefined,
    admin: navigation.admin ? filterItems(navigation.admin) : undefined,
  };
}
