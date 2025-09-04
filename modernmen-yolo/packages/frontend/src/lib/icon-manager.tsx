import React from 'react'
import Image from 'next/image'
// import BusinessIcons from '../../../cms/src/admin/customIcons' // CMS not available in frontend package

'use client'

// =============================================================================
// ICON MANAGEMENT SYSTEM
// =============================================================================
// Centralized icon management with Modern Men branding and custom icons
// Replaces all Payload CMS icons with branded alternatives

export interface IconConfig {
  name: string
  component: React.ComponentType<any>
  category: 'collection' | 'action' | 'status' | 'navigation' | 'brand'
  tags: string[]
  description?: string
}

export class IconManager {
  private static instance: IconManager
  private icons = new Map<string, IconConfig>()
  private iconCache = new Map<string, React.ComponentType<any>>()

  constructor() {
    this.initializeIcons()
  }

  static getInstance(): IconManager {
    if (!IconManager.instance) {
      IconManager.instance = new IconManager()
    }
    return IconManager.instance
  }

  // =============================================================================
  // ICON INITIALIZATION
  // =============================================================================

  private initializeIcons(): void {
    // Collection Icons (replacing Payload CMS collection icons)
    // Temporarily disabled - CMS BusinessIcons not available in frontend
    console.log('Icon manager initialized - CMS BusinessIcons temporarily disabled')

    // Initialize with basic brand icons that don't require CMS
    this.registerBrandIcons()
    // Comment out other icon registrations that depend on BusinessIcons
    // this.registerActionIcons()
    // this.registerStatusIcons()
    // this.registerNavigationIcons()
  }

  private registerBrandIcons(): void {
    // Modern Men brand icons
    this.registerIcon('modern-men-logo', {
      name: 'Modern Men Logo',
      component: () => (
        <Image
          src="/modernmen-logo.svg"
          alt="Modern Men Hair Salon"
          width={32}
          height={32}
          className="w-8 h-8"
        />
      ),
      category: 'brand',
      tags: ['logo', 'brand', 'modern-men'],
      description: 'Modern Men Hair Salon logo'
    })

    this.registerIcon('modern-men-admin', {
      name: 'Modern Men Admin',
      component: () => (
        <Image
          src="/modernmen-admin-icon.svg"
          alt="Modern Men Admin"
          width={24}
          height={24}
          className="w-6 h-6"
        />
      ),
      category: 'brand',
      tags: ['admin', 'brand', 'modern-men'],
      description: 'Modern Men admin interface icon'
    })
  }

  private registerActionIcons(): void {
    // Action icons for buttons and interactions
    this.registerIcon('book-appointment', {
      name: 'Book Appointment',
      component: () => (
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
          <path d="M6 4H14V16H6V4Z" fill="currentColor"/>
          <path d="M8 2V4M12 2V4M6 8H14M6 12H14" stroke="currentColor" strokeWidth="1.5"/>
        </svg>
      ),
      category: 'action',
      tags: ['book', 'appointment', 'schedule', 'calendar'],
      description: 'Book appointment action'
    })

    this.registerIcon('contact-us', {
      name: 'Contact Us',
      component: () => (
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
          <path d="M18 14L10 18L2 14V6L10 2L18 6V14Z" fill="currentColor"/>
          <path d="M10 2V10M2 6L10 10L18 6" stroke="currentColor" strokeWidth="1.5"/>
        </svg>
      ),
      category: 'action',
      tags: ['contact', 'email', 'message', 'communication'],
      description: 'Contact us action'
    })
  }

  private registerStatusIcons(): void {
    // Status indicators
    this.registerIcon('status-active', {
      name: 'Active Status',
      component: () => (
        <div className="w-3 h-3 bg-green-500 rounded-full"></div>
      ),
      category: 'status',
      tags: ['active', 'online', 'available', 'status'],
      description: 'Active/online status indicator'
    })

    this.registerIcon('status-inactive', {
      name: 'Inactive Status',
      component: () => (
        <div className="w-3 h-3 bg-gray-400 rounded-full"></div>
      ),
      category: 'status',
      tags: ['inactive', 'offline', 'unavailable', 'status'],
      description: 'Inactive/offline status indicator'
    })

    this.registerIcon('status-pending', {
      name: 'Pending Status',
      component: () => (
        <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
      ),
      category: 'status',
      tags: ['pending', 'waiting', 'processing', 'status'],
      description: 'Pending/processing status indicator'
    })
  }

  private registerNavigationIcons(): void {
    // Navigation icons
    this.registerIcon('nav-home', {
      name: 'Home Navigation',
      component: () => (
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
          <path d="M3 7L10 1L17 7V17H13V11H7V17H3V7Z" fill="currentColor"/>
        </svg>
      ),
      category: 'navigation',
      tags: ['home', 'navigation', 'dashboard', 'main'],
      description: 'Home/dashboard navigation'
    })

    // this.registerIcon('nav-services', {
    //   name: 'Services Navigation',
    //   component: BusinessIcons.Services,
    //   category: 'navigation',
    //   tags: ['services', 'navigation', 'offerings', 'menu'],
    //   description: 'Services navigation'
    // })

    // this.registerIcon('nav-team', {
    //   name: 'Team Navigation',
    //   component: BusinessIcons.Staff,
    //   category: 'navigation',
    //   tags: ['team', 'staff', 'barbers', 'navigation'],
    //   description: 'Team/staff navigation'
    // })
  }

  // =============================================================================
  // ICON MANAGEMENT METHODS
  // =============================================================================

  registerIcon(key: string, config: IconConfig): void {
    this.icons.set(key, config)
    this.iconCache.set(key, config.component)
  }

  getIcon(key: string): React.ComponentType<any> | null {
    return this.iconCache.get(key) || null
  }

  getIconConfig(key: string): IconConfig | null {
    return this.icons.get(key) || null
  }

  getIconsByCategory(category: string): IconConfig[] {
    return Array.from(this.icons.values()).filter(icon => icon.category === category)
  }

  getIconsByTag(tag: string): IconConfig[] {
    return Array.from(this.icons.values()).filter(icon => icon.tags.includes(tag))
  }

  searchIcons(query: string): IconConfig[] {
    const lowercaseQuery = query.toLowerCase()
    return Array.from(this.icons.values()).filter(icon =>
      icon.name.toLowerCase().includes(lowercaseQuery) ||
      icon.tags.some(tag => tag.toLowerCase().includes(lowercaseQuery)) ||
      (icon.description && icon.description.toLowerCase().includes(lowercaseQuery))
    )
  }

  // =============================================================================
  // PAYLOAD CMS ICON REPLACEMENT
  // =============================================================================

  getPayloadIconReplacement(originalIcon: string): React.ComponentType<any> | null {
    // Map Payload CMS icon names to our custom icons
    const iconMapping: Record<string, string> = {
      'users': 'users',
      'user': 'users',
      'people': 'users',
      'person': 'users',
      'calendar': 'appointments',
      'event': 'appointments',
      'appointment': 'appointments',
      'booking': 'appointments',
      'scissors': 'barbers',
      'cut': 'barbers',
      'barber': 'barbers',
      'stylist': 'barbers',
      'service': 'services',
      'services': 'services',
      'offer': 'services',
      'customer': 'customers',
      'client': 'customers',
      'user-circle': 'customers',
      'gallery': 'gallery',
      'image': 'gallery',
      'photo': 'gallery',
      'camera': 'gallery',
      'notification': 'notifications',
      'bell': 'notifications',
      'alert': 'notifications',
      'settings': 'settings',
      'gear': 'settings',
      'cog': 'settings',
      'config': 'settings'
    }

    const mappedIcon = iconMapping[originalIcon.toLowerCase()]
    return mappedIcon ? this.getIcon(mappedIcon) : null
  }

  // =============================================================================
  // ICON RENDERING HELPERS
  // =============================================================================

  renderIcon(key: string, props: any = {}): React.ReactElement | null {
    const IconComponent = this.getIcon(key)
    return IconComponent ? React.createElement(IconComponent, props) : null
  }

  renderIconWithFallback(key: string, fallbackKey: string, props: any = {}): React.ReactElement {
    const IconComponent = this.getIcon(key) || this.getIcon(fallbackKey)
    return IconComponent ? React.createElement(IconComponent, props) : React.createElement('div', props)
  }

  // =============================================================================
  // BULK ICON OPERATIONS
  // =============================================================================

  getAllIcons(): Map<string, IconConfig> {
    return new Map(this.icons)
  }

  getIconKeys(): string[] {
    return Array.from(this.icons.keys())
  }

  getIconNames(): string[] {
    return Array.from(this.icons.values()).map(icon => icon.name)
  }

  clearCache(): void {
    this.iconCache.clear()
  }

  reloadIcons(): void {
    this.clearCache()
    this.initializeIcons()
  }
}

// =============================================================================
// REACT HOOKS FOR ICON MANAGEMENT
// =============================================================================

export function useIconManager() {
  const iconManager = IconManager.getInstance()

  return {
    getIcon: iconManager.getIcon.bind(iconManager),
    getIconConfig: iconManager.getIconConfig.bind(iconManager),
    renderIcon: iconManager.renderIcon.bind(iconManager),
    renderIconWithFallback: iconManager.renderIconWithFallback.bind(iconManager),
    getIconsByCategory: iconManager.getIconsByCategory.bind(iconManager),
    getIconsByTag: iconManager.getIconsByTag.bind(iconManager),
    searchIcons: iconManager.searchIcons.bind(iconManager),
    getPayloadIconReplacement: iconManager.getPayloadIconReplacement.bind(iconManager)
  }
}

// =============================================================================
// ICON COMPONENTS FOR EASY USAGE
// =============================================================================

export function Icon({ name, ...props }: { name: string } & any) {
  const iconManager = IconManager.getInstance()
  return iconManager.renderIcon(name, props) || <div {...props} />
}

export function CollectionIcon({ collection, ...props }: { collection: string } & any) {
  const iconManager = IconManager.getInstance()

  // Try to find icon by collection name
  let iconKey = collection.toLowerCase()

  // Map common collection names to our icons
  const collectionMapping: Record<string, string> = {
    'users': 'users',
    'user': 'users',
    'appointments': 'appointments',
    'appointment': 'appointments',
    'services': 'services',
    'service': 'services',
    'customers': 'customers',
    'customer': 'customers',
    'staff': 'staff',
    'barbers': 'barbers',
    'barber': 'barbers',
    'gallery': 'gallery',
    'reviews': 'reviews',
    'review': 'reviews',
    'media': 'media',
    'notifications': 'notifications',
    'notification': 'notifications',
    'settings': 'settings'
  }

  iconKey = collectionMapping[iconKey] || iconKey

  return iconManager.renderIconWithFallback(iconKey, 'settings', props)
}

export function StatusIcon({ status, ...props }: { status: string } & any) {
  const iconManager = IconManager.getInstance()

  const statusMapping: Record<string, string> = {
    'active': 'status-active',
    'inactive': 'status-inactive',
    'pending': 'status-pending',
    'online': 'status-active',
    'offline': 'status-inactive',
    'processing': 'status-pending',
    'waiting': 'status-pending'
  }

  const iconKey = statusMapping[status.toLowerCase()] || 'status-inactive'
  return iconManager.renderIcon(iconKey, props)
}

export function ActionIcon({ action, ...props }: { action: string } & any) {
  const iconManager = IconManager.getInstance()

  const actionMapping: Record<string, string> = {
    'book': 'book-appointment',
    'contact': 'contact-us',
    'schedule': 'book-appointment',
    'message': 'contact-us',
    'email': 'contact-us'
  }

  const iconKey = actionMapping[action.toLowerCase()] || 'settings'
  return iconManager.renderIcon(iconKey, props)
}

// =============================================================================
// ICON THEME SYSTEM
// =============================================================================

export interface IconTheme {
  name: string
  primary: string
  secondary: string
  accent: string
  background: string
  foreground: string
}

export class IconThemeManager {
  private static instance: IconThemeManager
  private themes = new Map<string, IconTheme>()
  private currentTheme: string = 'modern-men'

  constructor() {
    this.initializeThemes()
  }

  static getInstance(): IconThemeManager {
    if (!IconThemeManager.instance) {
      IconThemeManager.instance = new IconThemeManager()
    }
    return IconThemeManager.instance
  }

  private initializeThemes(): void {
    // Modern Men brand theme
    this.registerTheme('modern-men', {
      name: 'Modern Men',
      primary: '#1f2937', // Gray-800
      secondary: '#374151', // Gray-700
      accent: '#f59e0b', // Amber-500
      background: '#ffffff',
      foreground: '#000000'
    })

    // Dark theme
    this.registerTheme('dark', {
      name: 'Dark',
      primary: '#ffffff',
      secondary: '#d1d5db', // Gray-300
      accent: '#f59e0b', // Amber-500
      background: '#1f2937', // Gray-800
      foreground: '#ffffff'
    })

    // High contrast theme
    this.registerTheme('high-contrast', {
      name: 'High Contrast',
      primary: '#000000',
      secondary: '#ffffff',
      accent: '#ff0000',
      background: '#ffffff',
      foreground: '#000000'
    })
  }

  registerTheme(key: string, theme: IconTheme): void {
    this.themes.set(key, theme)
  }

  getTheme(key: string): IconTheme | null {
    return this.themes.get(key) || null
  }

  getCurrentTheme(): IconTheme | null {
    return this.getTheme(this.currentTheme)
  }

  setCurrentTheme(themeKey: string): void {
    if (this.themes.has(themeKey)) {
      this.currentTheme = themeKey
    }
  }

  getAllThemes(): Map<string, IconTheme> {
    return new Map(this.themes)
  }

  getThemeKeys(): string[] {
    return Array.from(this.themes.keys())
  }
}

// Export singleton instances
export const iconManager = IconManager.getInstance()
export const iconThemeManager = IconThemeManager.getInstance()
