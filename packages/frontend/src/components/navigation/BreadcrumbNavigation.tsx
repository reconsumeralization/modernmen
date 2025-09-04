'use client'

import { usePathname } from 'next/navigation'
import Link from 'next/link'
import { ChevronRight, Home } from 'lucide-react'
import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'

// Breadcrumb configuration for different routes
const breadcrumbConfig: Record<string, { name: string; href?: string }[]> = {
  '/': [{ name: 'Home' }],
  '/services': [
    { name: 'Home', href: '/' },
    { name: 'Services' }
  ],
  '/team': [
    { name: 'Home', href: '/' },
    { name: 'Our Team' }
  ],
  '/gallery': [
    { name: 'Home', href: '/' },
    { name: 'Gallery' }
  ],
  '/contact': [
    { name: 'Home', href: '/' },
    { name: 'Contact' }
  ],
  '/booking': [
    { name: 'Home', href: '/' },
    { name: 'Book Appointment' }
  ],
  '/search': [
    { name: 'Home', href: '/' },
    { name: 'Search' }
  ],

  // Customer routes
  '/profile': [
    { name: 'Home', href: '/' },
    { name: 'My Profile' }
  ],
  '/appointments': [
    { name: 'Home', href: '/' },
    { name: 'My Appointments' }
  ],
  '/loyalty': [
    { name: 'Home', href: '/' },
    { name: 'Loyalty Points' }
  ],
  '/settings': [
    { name: 'Home', href: '/' },
    { name: 'Settings' }
  ],

  // Stylist routes
  '/stylist/dashboard': [
    { name: 'Home', href: '/' },
    { name: 'Stylist', href: '/stylist/dashboard' },
    { name: 'Dashboard' }
  ],
  '/stylist/schedule': [
    { name: 'Home', href: '/' },
    { name: 'Stylist', href: '/stylist/dashboard' },
    { name: 'Schedule' }
  ],
  '/stylist/appointments': [
    { name: 'Home', href: '/' },
    { name: 'Stylist', href: '/stylist/dashboard' },
    { name: 'Appointments' }
  ],
  '/stylist/services': [
    { name: 'Home', href: '/' },
    { name: 'Stylist', href: '/stylist/dashboard' },
    { name: 'Services' }
  ],
  '/stylist/profile': [
    { name: 'Home', href: '/' },
    { name: 'Stylist', href: '/stylist/dashboard' },
    { name: 'Profile' }
  ],
  '/stylist/clients': [
    { name: 'Home', href: '/' },
    { name: 'Stylist', href: '/stylist/dashboard' },
    { name: 'Clients' }
  ],
  '/stylist/time-off': [
    { name: 'Home', href: '/' },
    { name: 'Stylist', href: '/stylist/dashboard' },
    { name: 'Time Off' }
  ],

  // Staff routes
  '/staff/dashboard': [
    { name: 'Home', href: '/' },
    { name: 'Staff', href: '/staff/dashboard' },
    { name: 'Dashboard' }
  ],
  '/staff/appointments': [
    { name: 'Home', href: '/' },
    { name: 'Staff', href: '/staff/dashboard' },
    { name: 'Appointments' }
  ],
  '/staff/clients': [
    { name: 'Home', href: '/' },
    { name: 'Staff', href: '/staff/dashboard' },
    { name: 'Clients' }
  ],
  '/staff/services': [
    { name: 'Home', href: '/' },
    { name: 'Staff', href: '/staff/dashboard' },
    { name: 'Services' }
  ],
  '/staff/schedule': [
    { name: 'Home', href: '/' },
    { name: 'Staff', href: '/staff/dashboard' },
    { name: 'Schedule' }
  ],
  '/staff/reports': [
    { name: 'Home', href: '/' },
    { name: 'Staff', href: '/staff/dashboard' },
    { name: 'Reports' }
  ],
  '/staff/inventory': [
    { name: 'Home', href: '/' },
    { name: 'Staff', href: '/staff/dashboard' },
    { name: 'Inventory' }
  ],

  // Manager routes
  '/manager/dashboard': [
    { name: 'Home', href: '/' },
    { name: 'Management', href: '/manager/dashboard' },
    { name: 'Dashboard' }
  ],
  '/manager/appointments': [
    { name: 'Home', href: '/' },
    { name: 'Management', href: '/manager/dashboard' },
    { name: 'Appointments' }
  ],
  '/manager/staff': [
    { name: 'Home', href: '/' },
    { name: 'Management', href: '/manager/dashboard' },
    { name: 'Staff Management' }
  ],
  '/manager/clients': [
    { name: 'Home', href: '/' },
    { name: 'Management', href: '/manager/dashboard' },
    { name: 'Client Management' }
  ],
  '/manager/services': [
    { name: 'Home', href: '/' },
    { name: 'Management', href: '/manager/dashboard' },
    { name: 'Services' }
  ],
  '/manager/reports': [
    { name: 'Home', href: '/' },
    { name: 'Management', href: '/manager/dashboard' },
    { name: 'Reports' }
  ],
  '/manager/analytics': [
    { name: 'Home', href: '/' },
    { name: 'Management', href: '/manager/dashboard' },
    { name: 'Analytics' }
  ],
  '/manager/inventory': [
    { name: 'Home', href: '/' },
    { name: 'Management', href: '/manager/dashboard' },
    { name: 'Inventory' }
  ],
  '/manager/marketing': [
    { name: 'Home', href: '/' },
    { name: 'Management', href: '/manager/dashboard' },
    { name: 'Marketing' }
  ],

  // Admin routes
  '/admin/dashboard': [
    { name: 'Home', href: '/' },
    { name: 'Administration', href: '/admin/dashboard' },
    { name: 'Dashboard' }
  ],
  '/admin/users': [
    { name: 'Home', href: '/' },
    { name: 'Administration', href: '/admin/dashboard' },
    { name: 'User Management' }
  ],
  '/admin/appointments': [
    { name: 'Home', href: '/' },
    { name: 'Administration', href: '/admin/dashboard' },
    { name: 'All Appointments' }
  ],
  '/admin/services': [
    { name: 'Home', href: '/' },
    { name: 'Administration', href: '/admin/dashboard' },
    { name: 'Service Management' }
  ],
  '/admin/content': [
    { name: 'Home', href: '/' },
    { name: 'Administration', href: '/admin/dashboard' },
    { name: 'Content Management' }
  ],
  '/admin/analytics': [
    { name: 'Home', href: '/' },
    { name: 'Administration', href: '/admin/dashboard' },
    { name: 'Analytics' }
  ],
  '/admin/reports': [
    { name: 'Home', href: '/' },
    { name: 'Administration', href: '/admin/dashboard' },
    { name: 'Reports' }
  ],
  '/admin/settings': [
    { name: 'Home', href: '/' },
    { name: 'Administration', href: '/admin/dashboard' },
    { name: 'Settings' }
  ],
  '/admin/logs': [
    { name: 'Home', href: '/' },
    { name: 'Administration', href: '/admin/dashboard' },
    { name: 'System Logs' }
  ],
  '/admin/backup': [
    { name: 'Home', href: '/' },
    { name: 'Administration', href: '/admin/dashboard' },
    { name: 'Data Backup' }
  ],
  '/admin/payload': [
    { name: 'Home', href: '/' },
    { name: 'Administration', href: '/admin/dashboard' },
    { name: 'Content Management System' }
  ],
  '/admin/system-settings': [
    { name: 'Home', href: '/' },
    { name: 'Administration', href: '/admin/dashboard' },
    { name: 'System Settings' }
  ],

  // Auth routes
  '/auth/signin': [
    { name: 'Home', href: '/' },
    { name: 'Sign In' }
  ],
  '/auth/signup': [
    { name: 'Home', href: '/' },
    { name: 'Sign Up' }
  ],
  '/auth/forgot-password': [
    { name: 'Home', href: '/' },
    { name: 'Forgot Password' }
  ],
  '/auth/reset-password': [
    { name: 'Home', href: '/' },
    { name: 'Reset Password' }
  ],

  // Documentation routes
  '/documentation': [
    { name: 'Home', href: '/' },
    { name: 'Documentation' }
  ],
  '/documentation/business': [
    { name: 'Home', href: '/' },
    { name: 'Documentation', href: '/documentation' },
    { name: 'Business' }
  ],
  '/documentation/business/owner': [
    { name: 'Home', href: '/' },
    { name: 'Documentation', href: '/documentation' },
    { name: 'Business', href: '/documentation/business' },
    { name: 'Owner Guide' }
  ],
  '/documentation/business/employee': [
    { name: 'Home', href: '/' },
    { name: 'Documentation', href: '/documentation' },
    { name: 'Business', href: '/documentation/business' },
    { name: 'Employee Guide' }
  ],
  '/documentation/business/customer': [
    { name: 'Home', href: '/' },
    { name: 'Documentation', href: '/documentation' },
    { name: 'Business', href: '/documentation/business' },
    { name: 'Customer Guide' }
  ],
  '/documentation/developer': [
    { name: 'Home', href: '/' },
    { name: 'Documentation', href: '/documentation' },
    { name: 'Developer Guide' }
  ],
  '/documentation/admin': [
    { name: 'Home', href: '/' },
    { name: 'Documentation', href: '/documentation' },
    { name: 'Admin Guide' }
  ],
  '/documentation/shared': [
    { name: 'Home', href: '/' },
    { name: 'Documentation', href: '/documentation' },
    { name: 'Shared Resources' }
  ],

  // Other routes
  '/portal': [
    { name: 'Home', href: '/' },
    { name: 'Customer Portal' }
  ],
  '/portal/book': [
    { name: 'Home', href: '/' },
    { name: 'Customer Portal', href: '/portal' },
    { name: 'Book Appointment' }
  ],
  '/portal/profile': [
    { name: 'Home', href: '/' },
    { name: 'Customer Portal', href: '/portal' },
    { name: 'Profile' }
  ],
  '/portal/services': [
    { name: 'Home', href: '/' },
    { name: 'Customer Portal', href: '/portal' },
    { name: 'Services' }
  ],
  '/team/[id]': [
    { name: 'Home', href: '/' },
    { name: 'Our Team', href: '/team' },
    { name: 'Team Member' }
  ],
  '/builder': [
    { name: 'Home', href: '/' },
    { name: 'Page Builder' }
  ],
  '/editor': [
    { name: 'Home', href: '/' },
    { name: 'Content Editor' }
  ],
  '/search': [
    { name: 'Home', href: '/' },
    { name: 'Search Results' }
  ],
  '/offline': [
    { name: 'Home', href: '/' },
    { name: 'Offline' }
  ],
  '/payload-status': [
    { name: 'Home', href: '/' },
    { name: 'System Status' }
  ],
}

interface BreadcrumbNavigationProps {
  className?: string
  customBreadcrumbs?: Array<{ name: string; href?: string; current?: boolean }>
  showHome?: boolean
  separator?: React.ReactNode
}

export function BreadcrumbNavigation({
  className,
  customBreadcrumbs,
  showHome = true,
  separator = <ChevronRight className="h-4 w-4 text-gray-400" />
}: BreadcrumbNavigationProps) {
  const pathname = usePathname()

  // Generate breadcrumbs based on current path
  const generateBreadcrumbs = () => {
    if (customBreadcrumbs) {
      return customBreadcrumbs
    }

    // Check for exact match first
    if (breadcrumbConfig[pathname]) {
      return breadcrumbConfig[pathname]
    }

    // Check for dynamic routes (e.g., /team/[id], /documentation/business/owner/setup)
    const pathSegments = pathname.split('/').filter(Boolean)

    // Handle team member pages
    if (pathname.startsWith('/team/') && pathSegments.length === 2) {
      return [
        { name: 'Home', href: '/' },
        { name: 'Our Team', href: '/team' },
        { name: 'Team Member' }
      ]
    }

    // Handle documentation subpages
    if (pathname.startsWith('/documentation/')) {
      const docPath = pathname.replace('/documentation', '')
      if (breadcrumbConfig[`/documentation${docPath}`]) {
        return breadcrumbConfig[`/documentation${docPath}`]
      }

      // Generate breadcrumbs for deeper documentation paths
      const breadcrumbs = [
        { name: 'Home', href: '/' },
        { name: 'Documentation', href: '/documentation' }
      ]

      if (pathSegments.includes('business')) {
        breadcrumbs.push({ name: 'Business', href: '/documentation/business' })

        if (pathSegments.includes('owner')) {
          breadcrumbs.push({ name: 'Owner Guide', href: '/documentation/business/owner' })
        } else if (pathSegments.includes('employee')) {
          breadcrumbs.push({ name: 'Employee Guide', href: '/documentation/business/employee' })
        } else if (pathSegments.includes('customer')) {
          breadcrumbs.push({ name: 'Customer Guide', href: '/documentation/business/customer' })
        }
      } else if (pathSegments.includes('developer')) {
        breadcrumbs.push({ name: 'Developer Guide', href: '/documentation/developer' })
      } else if (pathSegments.includes('admin')) {
        breadcrumbs.push({ name: 'Admin Guide', href: '/documentation/admin' })
      } else if (pathSegments.includes('shared')) {
        breadcrumbs.push({ name: 'Shared Resources', href: '/documentation/shared' })
      }

      return breadcrumbs
    }

    // Default fallback - create breadcrumbs from path segments
    const breadcrumbs = [{ name: 'Home', href: '/' }]

    let currentPath = ''
    pathSegments.forEach((segment, index) => {
      currentPath += `/${segment}`
      const isLast = index === pathSegments.length - 1

      // Capitalize first letter and replace hyphens with spaces
      const name = segment
        .split('-')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ')

      breadcrumbs.push({
        name,
        href: isLast ? undefined : currentPath
      })
    })

    return breadcrumbs
  }

  const breadcrumbs = generateBreadcrumbs()

  // Don't show breadcrumbs if only home
  if (!showHome && breadcrumbs.length <= 1) {
    return null
  }

  return (
    <nav
      className={cn(
        "flex items-center space-x-2 text-sm text-gray-600",
        className
      )}
      aria-label="Breadcrumb"
    >
      {breadcrumbs.map((crumb, index) => {
        const isLast = index === breadcrumbs.length - 1
        const isFirst = index === 0

        return (
          <div key={index} className="flex items-center">
            {/* Separator (except for first item) */}
            {!isFirst && (
              <span className="mx-2 text-gray-400">
                {separator}
              </span>
            )}

            {/* Breadcrumb item */}
            {isLast || !crumb.href ? (
              // Current page (no link)
              <motion.span
                className="font-medium text-gray-900"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                {isFirst && !showHome ? null : crumb.name}
              </motion.span>
            ) : (
              // Linkable breadcrumb
              <motion.div
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                {isFirst && crumb.name === 'Home' && showHome ? (
                  <Link
                    href={crumb.href}
                    className="flex items-center hover:text-amber-600 transition-colors"
                    title="Go to homepage"
                  >
                    <Home className="h-4 w-4 mr-1" />
                    <span className="sr-only">Home</span>
                  </Link>
                ) : (
                  <Link
                    href={crumb.href}
                    className="hover:text-amber-600 transition-colors"
                  >
                    {crumb.name}
                  </Link>
                )}
              </motion.div>
            )}
          </div>
        )
      })}
    </nav>
  )
}

// Hook for getting breadcrumbs programmatically
export function useBreadcrumbs() {
  const pathname = usePathname()

  const getBreadcrumbs = (customPath?: string) => {
    const path = customPath || pathname
    return breadcrumbConfig[path] || []
  }

  const addBreadcrumb = (path: string, breadcrumbs: Array<{ name: string; href?: string }>) => {
    breadcrumbConfig[path] = breadcrumbs
  }

  return { getBreadcrumbs, addBreadcrumb }
}
