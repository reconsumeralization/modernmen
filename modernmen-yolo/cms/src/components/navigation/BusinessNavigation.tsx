'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter, usePathname } from 'next/navigation'
import { 
  getBusinessConfig, 
  getNavigationConfig, 
  generateBreadcrumbs,
  type BusinessType,
  type NavPage 
} from '../../lib/business-builder'
import { cn } from '../../lib/utils'

interface BusinessNavigationProps {
  businessType?: BusinessType
  variant?: 'header' | 'sidebar' | 'mobile' | 'breadcrumb'
  userRole?: string
  className?: string
}

// Icon mapping for different business types
const IconMap = {
  // Universal icons
  home: '🏠',
  info: 'ℹ️',
  phone: '📞',
  user: '👤',
  users: '👥',
  calendar: '📅',
  'calendar-plus': '📅+',
  'calendar-check': '✅📅',
  dashboard: '📊',
  'layout-dashboard': '📱',
  briefcase: '💼',
  'arrow-right': '→',
  
  // Hair salon icons
  scissors: '✂️',
  image: '🖼️',
  star: '⭐',
  'user-check': '👤✅',
  'bar-chart': '📊',
  
  // Restaurant icons
  utensils: '🍽️',
  'chef-hat': '👨‍🍳',
  'map-pin': '📍',
  'shopping-bag': '🛍️',
  heart: '❤️',
  
  // Law firm icons
  scales: '⚖️',
  'user-tie': '👨‍💼',
  trophy: '🏆',
  'book-open': '📖',
  'file-text': '📄',
  'message-square': '💬',
  'credit-card': '💳',
  
  // Medical icons
  stethoscope: '🩺',
  'user-md': '👨‍⚕️',
  'file-medical': '📋',
  pill: '💊',
  flask: '🧪',
  'shield-check': '🛡️'
}

const getIcon = (iconName: string): string => {
  return IconMap[iconName as keyof typeof IconMap] || '📄'
}

export function BusinessNavigation({ 
  businessType, 
  variant = 'header',
  userRole = 'customer',
  className 
}: BusinessNavigationProps) {
  const pathname = usePathname()
  const router = useRouter()
  const [config, setConfig] = useState(getBusinessConfig(businessType))
  const [navConfig, setNavConfig] = useState(getNavigationConfig(businessType))

  useEffect(() => {
    const newConfig = getBusinessConfig(businessType)
    const newNavConfig = getNavigationConfig(businessType)
    setConfig(newConfig)
    setNavConfig(newNavConfig)
  }, [businessType])

  // Determine which pages to show based on variant and user role
  const getNavPages = (): NavPage[] => {
    switch (variant) {
      case 'mobile':
        return navConfig.mobileNav
      case 'sidebar':
        if (userRole === 'admin' || userRole === 'owner' || userRole === 'staff') {
          return navConfig.adminPages
        }
        return navConfig.portalPages
      case 'breadcrumb':
        return []
      default: // header
        return navConfig.publicPages.filter(page => page.showInNav !== false)
    }
  }

  const navPages = getNavPages()

  // Breadcrumb variant
  if (variant === 'breadcrumb') {
    const breadcrumbs = generateBreadcrumbs(pathname, businessType)
    
    return (
      <nav className={cn('breadcrumb-nav', className)} aria-label="Breadcrumb">
        <ol className="flex items-center space-x-2 text-sm text-gray-600">
          {breadcrumbs.map((crumb, index) => (
            <li key={crumb.href} className="flex items-center">
              {index > 0 && <span className="mx-2">/</span>}
              {index === breadcrumbs.length - 1 ? (
                <span className="text-gray-900 font-medium">{crumb.label}</span>
              ) : (
                <Link 
                  href={crumb.href}
                  className="text-blue-600 hover:text-blue-800 transition-colors"
                >
                  {crumb.label}
                </Link>
              )}
            </li>
          ))}
        </ol>
      </nav>
    )
  }

  // Mobile variant
  if (variant === 'mobile') {
    return (
      <nav className={cn('mobile-nav fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-50', className)}>
        <div className="grid grid-cols-4 gap-1 px-2 py-1">
          {navPages.map((page) => (
            <Link
              key={page.id}
              href={page.href}
              className={cn(
                'flex flex-col items-center justify-center py-2 px-1 rounded-lg transition-colors text-xs',
                pathname === page.href 
                  ? 'bg-blue-50 text-blue-600' 
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
              )}
            >
              <span className="text-lg mb-1">{getIcon(page.icon)}</span>
              <span className="truncate max-w-full">{page.label}</span>
            </Link>
          ))}
        </div>
      </nav>
    )
  }

  // Sidebar variant
  if (variant === 'sidebar') {
    // Group pages by their group property or create default groups
    const groupedPages = navPages.reduce((groups, page) => {
      // Extract group from href or use default groups
      let group = 'Main'
      if (page.href.includes('/admin/')) {
        if (page.href.includes('customers') || page.href.includes('clients') || page.href.includes('patients')) {
          group = config.terminology.customers
        } else if (page.href.includes('appointments') || page.href.includes('orders') || page.href.includes('cases')) {
          group = 'Operations'
        } else if (page.href.includes('services') || page.href.includes('menu')) {
          group = 'Services'
        } else if (page.href.includes('staff') || page.href.includes('team') || page.href.includes('attorneys')) {
          group = 'Team'
        } else if (page.href.includes('reports') || page.href.includes('analytics')) {
          group = 'Analytics'
        }
      } else if (page.href.includes('/portal/')) {
        if (page.id === 'dashboard') {
          group = 'Dashboard'
        } else {
          group = 'My Account'
        }
      }
      
      if (!groups[group]) {
        groups[group] = []
      }
      groups[group].push(page)
      return groups
    }, {} as Record<string, NavPage[]>)

    return (
      <nav className={cn('sidebar-nav w-64 bg-white border-r border-gray-200 h-full overflow-y-auto', className)}>
        <div className="p-4">
          <div className="flex items-center space-x-2 mb-6">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold">
              {config.name.charAt(0)}
            </div>
            <div>
              <h2 className="font-semibold text-gray-900">{config.name}</h2>
              <p className="text-xs text-gray-500 capitalize">{config.type.replace('-', ' ')}</p>
            </div>
          </div>
          
          {Object.entries(groupedPages).map(([groupName, pages]) => (
            <div key={groupName} className="mb-6">
              <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
                {groupName}
              </h3>
              <ul className="space-y-1">
                {pages.map((page) => (
                  <li key={page.id}>
                    <Link
                      href={page.href}
                      className={cn(
                        'flex items-center space-x-3 px-3 py-2 rounded-lg text-sm transition-colors',
                        pathname === page.href
                          ? 'bg-blue-50 text-blue-600 border border-blue-200'
                          : 'text-gray-700 hover:text-gray-900 hover:bg-gray-50'
                      )}
                    >
                      <span className="text-base">{getIcon(page.icon)}</span>
                      <span>{page.label}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </nav>
    )
  }

  // Header variant (default)
  return (
    <nav className={cn('header-nav', className)}>
      <div className="flex items-center justify-between px-6 py-4 bg-white border-b border-gray-200">
        {/* Logo/Brand */}
        <Link href="/" className="flex items-center space-x-2">
          <div 
            className="w-8 h-8 rounded-lg flex items-center justify-center text-white font-bold"
            style={{ backgroundColor: config.styling.primaryColor }}
          >
            {process.env.BRAND_NAME?.charAt(0) || config.name.charAt(0)}
          </div>
          <div>
            <h1 className="font-semibold text-gray-900">
              {process.env.BRAND_NAME || config.name}
            </h1>
            <p className="text-xs text-gray-500">
              {process.env.DEFAULT_BUSINESS_TAGLINE || `Professional ${config.type.replace('-', ' ')} services`}
            </p>
          </div>
        </Link>

        {/* Navigation Links */}
        <div className="hidden md:flex items-center space-x-6">
          {navPages.map((page) => (
            <Link
              key={page.id}
              href={page.href}
              className={cn(
                'flex items-center space-x-1 px-3 py-2 rounded-lg text-sm font-medium transition-colors',
                pathname === page.href
                  ? 'text-blue-600 bg-blue-50'
                  : 'text-gray-700 hover:text-gray-900 hover:bg-gray-50'
              )}
            >
              <span>{getIcon(page.icon)}</span>
              <span>{page.label}</span>
            </Link>
          ))}
        </div>

        {/* Primary CTA */}
        <div className="flex items-center space-x-4">
          <Link
            href={navConfig.primaryCTA.href}
            className={cn(
              'inline-flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium text-white transition-colors shadow-sm hover:shadow-md'
            )}
            style={{ 
              backgroundColor: config.styling.primaryColor,
              ':hover': { backgroundColor: config.styling.secondaryColor }
            }}
          >
            <span>{getIcon(navConfig.primaryCTA.icon)}</span>
            <span>{navConfig.primaryCTA.label}</span>
          </Link>
        </div>
      </div>
    </nav>
  )
}

// Higher-order component for automatic business type detection
export function withBusinessNavigation<P extends object>(
  Component: React.ComponentType<P>
) {
  return function BusinessNavigationWrapper(props: P) {
    const businessType = (process.env.BUSINESS_TYPE as BusinessType) || 'generic'
    
    return (
      <div className="min-h-screen bg-gray-50">
        <BusinessNavigation businessType={businessType} variant="header" />
        <div className="pb-16 md:pb-0"> {/* Account for mobile nav */}
          <Component {...props} />
        </div>
        <BusinessNavigation businessType={businessType} variant="mobile" className="md:hidden" />
      </div>
    )
  }
}

export default BusinessNavigation