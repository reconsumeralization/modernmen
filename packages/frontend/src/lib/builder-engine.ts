// 🎯 AMAZING DND Builder Engine - Making It F**** Amazing!
import React from 'react'
import { logger } from './logger'
import { systemManager, BuilderComponent } from '../config/system.config'

// 🎯 Enhanced Builder Engine Types
export interface BuilderPage {
  id: string
  name: string
  slug: string
  layout: BuilderLayout
  components: BuilderComponentInstance[]
  styles: BuilderStyle[]
  settings: PageSettings
  metadata: PageMetadata
  version: number
  createdAt: Date
  updatedAt: Date
  isPublished: boolean
  publishedAt?: Date
  parentId?: string // For page variants/versions
  tags: string[]
}

export interface BuilderLayout {
  id: string
  type: 'container' | 'grid' | 'flex' | 'canvas' | 'section' | 'column'
  props: Record<string, any>
  children: string[]
  styles: BuilderStyle[]
  responsive: ResponsiveSettings
  animation?: AnimationSettings
  constraints?: LayoutConstraints
}

export interface BuilderComponentInstance {
  id: string
  componentId: string
  name: string
  props: Record<string, any>
  styles: BuilderStyle[]
  interactions: BuilderInteraction[]
  children?: string[]
  position: ComponentPosition
  visibility: VisibilitySettings
  animation?: AnimationSettings
  responsive?: ResponsiveSettings
  locked?: boolean
  grouped?: string // Group ID for component grouping
  // Additional metadata properties
  tags?: string[]
  preview?: string
  documentation?: string
  version?: string
  dependencies?: string[]
  validation?: Record<string, any>
  defaultStyles?: BuilderStyle[]
  accessibility?: Record<string, any>
}

export interface ComponentPosition {
  x: number
  y: number
  width: number
  height: number
  zIndex: number
  rotation?: number
  scale?: number
}

export interface VisibilitySettings {
  desktop: boolean
  tablet: boolean
  mobile: boolean
  conditions?: BuilderCondition[]
}

export interface ResponsiveSettings {
  desktop?: Record<string, any>
  tablet?: Record<string, any>
  mobile?: Record<string, any>
}

export interface AnimationSettings {
  type: 'fade' | 'slide' | 'scale' | 'rotate' | 'bounce' | 'custom'
  duration: number
  delay: number
  easing: string
  trigger: 'load' | 'scroll' | 'hover' | 'click' | 'viewport'
  repeat?: boolean
  direction?: 'normal' | 'reverse' | 'alternate'
}

export interface LayoutConstraints {
  minWidth?: number
  maxWidth?: number
  minHeight?: number
  maxHeight?: number
  aspectRatio?: string
  sticky?: boolean
  overflow?: 'visible' | 'hidden' | 'scroll' | 'auto'
}

export interface BuilderStyle {
  property: string
  value: any
  breakpoint?: 'desktop' | 'tablet' | 'mobile'
  state?: 'default' | 'hover' | 'active' | 'focus' | 'disabled'
  important?: boolean
  unit?: string
  // Additional style properties
  variables?: Record<string, any>
  breakpoints?: Record<string, any>
  animations?: Record<string, any>
  components?: Record<string, any>
  utilities?: Record<string, any>
}

export interface BuilderInteraction {
  id: string
  event: string
  actions: BuilderAction[]
  conditions?: BuilderCondition[]
  throttle?: number
  debounce?: number
  preventDefault?: boolean
  stopPropagation?: boolean
}

export interface BuilderAction {
  type: string
  target: string
  value: any
  delay?: number
  duration?: number
  easing?: string
  metadata?: Record<string, any>
}

export interface BuilderCondition {
  type: string
  field: string
  operator: string
  value: any
  logicalOperator?: 'AND' | 'OR'
}

export interface PageSettings {
  responsive: boolean
  seo: boolean
  accessibility: boolean
  performance: boolean
  theme: string
  customCSS?: string
  customJS?: string
  favicon?: string
  language: string
  rtl?: boolean
  preloader?: boolean
  analytics?: AnalyticsSettings
}

export interface AnalyticsSettings {
  googleAnalytics?: string
  facebookPixel?: string
  customEvents?: CustomEvent[]
}

export interface CustomEvent {
  name: string
  trigger: string
  data: Record<string, any>
}

export interface PageMetadata {
  title: string
  description: string
  keywords: string[]
  ogImage?: string
  ogTitle?: string
  ogDescription?: string
  twitterCard?: string
  twitterImage?: string
  canonical?: string
  noIndex?: boolean
  noFollow?: boolean
  structuredData?: Record<string, any>
}

export interface BuilderSnapshot {
  id: string
  pageId: string
  name: string
  data: BuilderPage
  createdAt: Date
  isAutoSave: boolean
}

export interface BuilderHistory {
  actions: BuilderAction[]
  snapshots: BuilderSnapshot[]
  currentIndex: number
}

// 🎯 Enhanced Builder Engine Class
export class BuilderEngine {
  private static instance: BuilderEngine
  private pages: Map<string, BuilderPage> = new Map()
  private components: Map<string, any> = new Map()
  private templates: Map<string, BuilderPage> = new Map()
  private themes: Map<string, any> = new Map()
  private history: Map<string, BuilderHistory> = new Map()
  private snapshots: Map<string, BuilderSnapshot[]> = new Map()
  private clipboard: BuilderComponentInstance[] = []
  private groups: Map<string, string[]> = new Map()
  private eventListeners: Map<string, Function[]> = new Map()

  private constructor() {
    this.initializeComponents()
    this.initializeTemplates()
    this.initializeThemes()
    this.setupAutoSave()
  }

  static getInstance(): BuilderEngine {
    if (!BuilderEngine.instance) {
      BuilderEngine.instance = new BuilderEngine()
    }
    return BuilderEngine.instance
  }

  // 🎯 Event System
  on(event: string, callback: Function): void {
    if (!this.eventListeners.has(event)) {
      this.eventListeners.set(event, [])
    }
    this.eventListeners.get(event)!.push(callback)
  }

  off(event: string, callback: Function): void {
    const listeners = this.eventListeners.get(event)
    if (listeners) {
      const index = listeners.indexOf(callback)
      if (index > -1) {
        listeners.splice(index, 1)
      }
    }
  }

  private emit(event: string, data?: any): void {
    const listeners = this.eventListeners.get(event)
    if (listeners) {
      listeners.forEach(callback => callback(data))
    }
  }

  // 🎯 Enhanced component initialization
  private initializeComponents(): void {
    const config = systemManager.getConfig()

    config.builder.components.forEach(component => {
      // Enhanced component with validation and metadata
      const enhancedComponent = {
        ...component,
        category: component.category || 'general',
        tags: component.tags ?? [],
        preview: component.preview ?? '',
        documentation: component.documentation ?? '',
        version: component.version ?? '1.0.0',
        dependencies: component.dependencies ?? [],
        validation: component.validation ?? {},
        defaultStyles: component.defaultStyles ?? [],
        responsive: component.responsive !== false,
        accessibility: component.accessibility ?? {}
      }
      this.components.set(component.id, enhancedComponent)
    })

    logger.info(`✅ Initialized ${config.builder.components.length} enhanced builder components`)
  }

  // 🎯 Enhanced template initialization
  private initializeTemplates(): void {
    // Enhanced landing page template
    const landingTemplate: BuilderPage = {
      id: 'landing-template',
      name: 'Modern Landing Page',
      slug: 'landing',
      version: 1,
      createdAt: new Date(),
      updatedAt: new Date(),
      isPublished: false,
      tags: ['landing', 'business', 'modern'],
      layout: {
        id: 'root',
        type: 'container',
        props: { maxWidth: '1200px', margin: '0 auto', padding: '0 20px' },
        children: ['header', 'hero', 'services', 'about', 'testimonials', 'contact', 'footer'],
        styles: [],
        responsive: {
          desktop: { maxWidth: '1200px' },
          tablet: { maxWidth: '768px' },
          mobile: { maxWidth: '100%', padding: '0 16px' }
        }
      },
      components: [
        this.createComponentInstance('hero', 'hero', {
          title: 'Welcome to Modern Men',
          subtitle: 'Premium grooming services for the modern gentleman',
          backgroundImage: '/images/hero-bg.jpg',
          ctaText: 'Book Now',
          ctaLink: '/book',
          overlay: true,
          overlayOpacity: 0.4
        }, { x: 0, y: 0, width: 1200, height: 600, zIndex: 1 }),
        this.createComponentInstance('services', 'services-grid', {
          services: [],
          columns: 3,
          showPrices: true,
          animation: 'fadeInUp',
          spacing: 'large'
        }, { x: 0, y: 600, width: 1200, height: 400, zIndex: 1 }),
        this.createComponentInstance('testimonials', 'testimonial-carousel', {
          testimonials: [],
          autoPlay: true,
          showRating: true,
          interval: 5000,
          showDots: true,
          showArrows: true
        }, { x: 0, y: 1000, width: 1200, height: 300, zIndex: 1 })
      ],
      styles: [
        {
          property: 'backgroundColor',
          value: '#ffffff',
          breakpoint: 'desktop'
        },
        {
          property: 'fontFamily',
          value: 'Inter, sans-serif'
        }
      ],
      settings: {
        responsive: true,
        seo: true,
        accessibility: true,
        performance: true,
        theme: 'modern-dark',
        language: 'en',
        preloader: true,
        analytics: {
          googleAnalytics: '',
          customEvents: []
        }
      },
      metadata: {
        title: 'Modern Men Hair Salon - Premium Grooming Services',
        description: 'Experience premium grooming services for the modern gentleman. Professional haircuts, styling, and grooming in a luxurious environment.',
        keywords: ['hair salon', 'barber', 'grooming', 'men', 'haircut', 'styling'],
        ogTitle: 'Modern Men Hair Salon',
        ogDescription: 'Premium grooming services for men',
        ogImage: '/images/og-image.jpg',
        twitterCard: 'summary_large_image',
        structuredData: {
          '@type': 'LocalBusiness',
          'name': 'Modern Men Hair Salon',
          'description': 'Premium grooming services for men'
        }
      }
    }

    // Blog template
    const blogTemplate: BuilderPage = {
      id: 'blog-template',
      name: 'Blog Layout',
      slug: 'blog',
      version: 1,
      createdAt: new Date(),
      updatedAt: new Date(),
      isPublished: false,
      tags: ['blog', 'content', 'articles'],
      layout: {
        id: 'blog-root',
        type: 'grid',
        props: { 
          columns: '1fr 300px',
          gap: '40px',
          maxWidth: '1200px',
          margin: '0 auto'
        },
        children: ['main-content', 'sidebar'],
        styles: [],
        responsive: {
          desktop: { gridTemplateColumns: '1fr 300px' },
          tablet: { gridTemplateColumns: '1fr' },
          mobile: { gridTemplateColumns: '1fr', gap: '20px' }
        }
      },
      components: [],
      styles: [],
      settings: {
        responsive: true,
        seo: true,
        accessibility: true,
        performance: true,
        theme: 'blog-clean',
        language: 'en'
      },
      metadata: {
        title: 'Blog',
        description: 'Latest articles and insights',
        keywords: ['blog', 'articles', 'insights']
      }
    }

    this.templates.set('landing', landingTemplate)
    this.templates.set('blog', blogTemplate)
    logger.info('✅ Initialized enhanced builder templates')
  }

  // 🎯 Enhanced theme initialization
  private initializeThemes(): void {
    const themes = systemManager.getConfig().builder.styles

    themes.forEach(theme => {
      const enhancedTheme = {
        ...theme,
        variables: theme.variables ?? {},
        breakpoints: theme.breakpoints ?? {
          mobile: '768px',
          tablet: '1024px',
          desktop: '1200px'
        },
        animations: theme.animations ?? {},
        components: theme.components ?? {},
        utilities: theme.utilities ?? {}
      }
      this.themes.set(theme.id, enhancedTheme)
    })

    logger.info(`✅ Initialized ${themes.length} enhanced builder themes`)
  }

  // 🎯 Auto-save setup
  private setupAutoSave(): void {
    setInterval(() => {
      this.pages.forEach((page, pageId) => {
        this.createSnapshot(pageId, `Auto-save ${new Date().toLocaleTimeString()}`, true)
      })
    }, 30000) // Auto-save every 30 seconds
  }

  // 🎯 Enhanced page creation
  createPage(template?: string, options?: { name?: string; slug?: string }): BuilderPage {
    const basePage: BuilderPage = {
      id: this.generateId(),
      name: options?.name || 'New Page',
      slug: options?.slug || this.generateSlug(options?.name || 'new-page'),
      version: 1,
      createdAt: new Date(),
      updatedAt: new Date(),
      isPublished: false,
      tags: [],
      layout: {
        id: 'root',
        type: 'container',
        props: { padding: '20px' },
        children: [],
        styles: [],
        responsive: {
          desktop: { maxWidth: '1200px', margin: '0 auto' },
          tablet: { maxWidth: '768px', margin: '0 auto' },
          mobile: { maxWidth: '100%', margin: '0 auto' }
        }
      },
      components: [],
      styles: [],
      settings: {
        responsive: true,
        seo: true,
        accessibility: true,
        performance: true,
        theme: 'modern-dark',
        language: 'en'
      },
      metadata: {
        title: options?.name || 'New Page',
        description: '',
        keywords: []
      }
    }

    if (template && this.templates.has(template)) {
      const templateData = this.templates.get(template)!
      const newPage = {
        ...templateData,
        id: this.generateId(),
        name: options?.name || `${templateData.name} Copy`,
        slug: options?.slug || this.generateSlug(options?.name || templateData.name),
        createdAt: new Date(),
        updatedAt: new Date(),
        isPublished: false
      }
      
      this.savePage(newPage)
      this.initializeHistory(newPage.id)
      this.emit('pageCreated', newPage)
      return newPage
    }

    this.savePage(basePage)
    this.initializeHistory(basePage.id)
    this.emit('pageCreated', basePage)
    return basePage
  }

  // 🎯 Enhanced component addition with validation
  addComponent(pageId: string, componentId: string, position: { x: number; y: number }, options?: {
    props?: Record<string, any>
    styles?: BuilderStyle[]
    parentId?: string
  }): BuilderComponentInstance {
    const page = this.pages.get(pageId)
    if (!page) throw new Error(`Page ${pageId} not found`)

    const component = this.components.get(componentId)
    if (!component) throw new Error(`Component ${componentId} not found`)

    // Validate component dependencies
    if (component.dependencies?.length > 0) {
      const missingDeps = component.dependencies.filter((dep: string) =>
        !page.components.some(c => c.componentId === dep)
      )
      if (missingDeps.length > 0) {
        logger.warn(`Missing dependencies for ${componentId}: ${missingDeps.join(', ')}`)
      }
    }

    const instance = this.createComponentInstance(
      this.generateId(),
      componentId,
      options?.props || {},
      { ...position, width: component.defaultWidth || 200, height: component.defaultHeight || 100, zIndex: this.getNextZIndex(page) }
    )

    // Apply default styles
    if (component.defaultStyles) {
      instance.styles.push(...component.defaultStyles)
    }

    // Apply custom styles
    if (options?.styles) {
      instance.styles.push(...options.styles)
    }

    page.components.push(instance)
    
    // Add to parent or root layout
    const parentId = options?.parentId || page.layout.id
    if (parentId === page.layout.id) {
      page.layout.children.push(instance.id)
    } else {
      const parent = page.components.find(c => c.id === parentId)
      if (parent && parent.children) {
        parent.children.push(instance.id)
      }
    }

    page.updatedAt = new Date()

    this.recordAction(pageId, {
      type: 'add_component',
      target: instance.id,
      value: instance,
      metadata: { componentId, position, options }
    })

    this.emit('componentAdded', { pageId, component: instance })
    logger.info(`✅ Added component ${componentId} to page ${pageId}`)
    
    return instance
  }

  // 🎯 Enhanced component removal with cleanup
  removeComponent(pageId: string, componentId: string): void {
    const page = this.pages.get(pageId)
    if (!page) throw new Error(`Page ${pageId} not found`)

    const componentIndex = page.components.findIndex(c => c.id === componentId)
    if (componentIndex === -1) throw new Error(`Component ${componentId} not found`)

    const component = page.components[componentIndex]
    
    // Remove children first
    if (component.children?.length) {
      component.children.forEach(childId => {
        this.removeComponent(pageId, childId)
      })
    }

    // Remove from parent
    this.removeFromParent(page, componentId)
    
    // Remove from page
    page.components.splice(componentIndex, 1)
    page.updatedAt = new Date()

    this.recordAction(pageId, {
      type: 'remove_component',
      target: componentId,
      value: component
    })

    this.emit('componentRemoved', { pageId, componentId, component })
    logger.info(`✅ Removed component ${componentId} from page ${pageId}`)
  }

  // 🎯 Enhanced component updates with validation
  updateComponent(pageId: string, componentId: string, updates: Partial<BuilderComponentInstance>): void {
    const page = this.pages.get(pageId)
    if (!page) throw new Error(`Page ${pageId} not found`)

    const component = page.components.find(c => c.id === componentId)
    if (!component) throw new Error(`Component ${componentId} not found`)

    const oldData = { ...component }
    
    // Validate updates
    if (updates.props) {
      const componentDef = this.components.get(component.componentId)
      if (componentDef?.validation) {
        this.validateProps(updates.props, componentDef.validation)
      }
    }

    Object.assign(component, updates)
    page.updatedAt = new Date()

    this.recordAction(pageId, {
      type: 'update_component',
      target: componentId,
      value: { old: oldData, new: component }
    })

    this.emit('componentUpdated', { pageId, componentId, updates, component })
    logger.info(`✅ Updated component ${componentId} in page ${pageId}`)
  }

  // 🎯 Component grouping
  groupComponents(pageId: string, componentIds: string[], groupName?: string): string {
    const groupId = this.generateId()
    const finalGroupName = groupName || `Group ${groupId.slice(-4)}`
    
    this.groups.set(groupId, componentIds)
    
    componentIds.forEach(componentId => {
      this.updateComponent(pageId, componentId, { grouped: groupId })
    })

    this.recordAction(pageId, {
      type: 'group_components',
      target: groupId,
      value: { componentIds, groupName: finalGroupName }
    })

    this.emit('componentsGrouped', { pageId, groupId, componentIds, groupName: finalGroupName })
    return groupId
  }

  // 🎯 Component ungrouping
  ungroupComponents(pageId: string, groupId: string): void {
    const componentIds = this.groups.get(groupId)
    if (!componentIds) return

    componentIds.forEach(componentId => {
      this.updateComponent(pageId, componentId, { grouped: undefined })
    })

    this.groups.delete(groupId)

    this.recordAction(pageId, {
      type: 'ungroup_components',
      target: groupId,
      value: { componentIds }
    })

    this.emit('componentsUngrouped', { pageId, groupId, componentIds })
  }

  // 🎯 Copy components to clipboard
  copyComponents(pageId: string, componentIds: string[]): void {
    const page = this.pages.get(pageId)
    if (!page) return

    this.clipboard = componentIds
      .map(id => page.components.find(c => c.id === id))
      .filter(Boolean) as BuilderComponentInstance[]

    this.emit('componentsCopied', { pageId, componentIds, count: this.clipboard.length })
    logger.info(`📋 Copied ${this.clipboard.length} components to clipboard`)
  }

  // 🎯 Paste components from clipboard
  pasteComponents(pageId: string, position: { x: number; y: number }): BuilderComponentInstance[] {
    if (this.clipboard.length === 0) return []

    const pastedComponents: BuilderComponentInstance[] = []
    let offsetX = 0
    let offsetY = 0

    this.clipboard.forEach(component => {
      const newComponent = {
        ...component,
        id: this.generateId(),
        position: {
          ...component.position,
          x: position.x + offsetX,
          y: position.y + offsetY
        }
      }

      const instance = this.addComponent(pageId, component.componentId, 
        { x: newComponent.position.x, y: newComponent.position.y },
        { props: newComponent.props, styles: newComponent.styles }
      )

      pastedComponents.push(instance)
      offsetX += 20
      offsetY += 20
    })

    this.emit('componentsPasted', { pageId, components: pastedComponents })
    logger.info(`📋 Pasted ${pastedComponents.length} components`)
    
    return pastedComponents
  }

  // 🎯 Enhanced history management
  private initializeHistory(pageId: string): void {
    this.history.set(pageId, {
      actions: [],
      snapshots: [],
      currentIndex: -1
    })
  }

  private recordAction(pageId: string, action: BuilderAction): void {
    const history = this.history.get(pageId)
    if (!history) return

    // Remove any actions after current index (for redo functionality)
    history.actions = history.actions.slice(0, history.currentIndex + 1)
    
    // Add new action
    history.actions.push({
      ...action,
      metadata: {
        ...action.metadata,
        timestamp: Date.now(),
        id: this.generateId()
      }
    })
    
    history.currentIndex++

    // Limit history size
    if (history.actions.length > 100) {
      history.actions.shift()
      history.currentIndex--
    }
  }

  // 🎯 Enhanced undo with better state management
  undo(pageId: string): boolean {
    const history = this.history.get(pageId)
    if (!history || history.currentIndex < 0) return false

    const action = history.actions[history.currentIndex]
    this.reverseAction(pageId, action)
    history.currentIndex--

    this.emit('actionUndone', { pageId, action })
    logger.info(`↩️ Undid action: ${action.type}`)
    return true
  }

  // 🎯 Enhanced redo with better state management
  redo(pageId: string): boolean {
    const history = this.history.get(pageId)
    if (!history || history.currentIndex >= history.actions.length - 1) return false

    history.currentIndex++
    const action = history.actions[history.currentIndex]
    this.applyAction(pageId, action)

    this.emit('actionRedone', { pageId, action })
    logger.info(`↪️ Redid action: ${action.type}`)
    return true
  }

  // 🎯 Snapshot management
  createSnapshot(pageId: string, name: string, isAutoSave: boolean = false): BuilderSnapshot {
    const page = this.pages.get(pageId)
    if (!page) throw new Error(`Page ${pageId} not found`)

    const snapshot: BuilderSnapshot = {
      id: this.generateId(),
      pageId,
      name,
      data: JSON.parse(JSON.stringify(page)), // Deep clone
      createdAt: new Date(),
      isAutoSave
    }

    let snapshots = this.snapshots.get(pageId) || []
    snapshots.push(snapshot)

    // Limit snapshots (keep last 20 manual, 10 auto-saves)
    const manualSnapshots = snapshots.filter(s => !s.isAutoSave)
    const autoSnapshots = snapshots.filter(s => s.isAutoSave)

    if (manualSnapshots.length > 20) {
      manualSnapshots.splice(0, manualSnapshots.length - 20)
    }
    if (autoSnapshots.length > 10) {
      autoSnapshots.splice(0, autoSnapshots.length - 10)
    }

    snapshots = [...manualSnapshots, ...autoSnapshots].sort((a, b) => 
      a.createdAt.getTime() - b.createdAt.getTime()
    )

    this.snapshots.set(pageId, snapshots)
    this.emit('snapshotCreated', snapshot)
    
    return snapshot
  }

  restoreSnapshot(pageId: string, snapshotId: string): void {
    const snapshots = this.snapshots.get(pageId)
    if (!snapshots) throw new Error(`No snapshots found for page ${pageId}`)

    const snapshot = snapshots.find(s => s.id === snapshotId)
    if (!snapshot) throw new Error(`Snapshot ${snapshotId} not found`)

    this.pages.set(pageId, { ...snapshot.data, updatedAt: new Date() })
    this.emit('snapshotRestored', { pageId, snapshot })
    logger.info(`🔄 Restored snapshot: ${snapshot.name}`)
  }

  // 🎯 Enhanced export with multiple formats
  exportPage(pageId: string, format: 'react' | 'html' | 'json' | 'vue' = 'react'): string {
    const page = this.pages.get(pageId)
    if (!page) throw new Error(`Page ${pageId} not found`)

    switch (format) {
      case 'react':
        return this.generateReactComponent(page)
      case 'html':
        return this.generateHTMLPage(page)
      case 'json':
        return JSON.stringify(page, null, 2)
      case 'vue':
        return this.generateVueComponent(page)
      default:
        throw new Error(`Unsupported export format: ${format}`)
    }
  }

  // 🎯 Enhanced React component generation
  private generateReactComponent(page: BuilderPage): string {
    const imports = new Set(['React'])
    const componentName = this.slugToComponentName(page.slug)

    // Analyze components for required imports
    page.components.forEach(component => {
      const componentDef = this.components.get(component.componentId)
      if (componentDef?.imports) {
        componentDef.imports.forEach((imp: string) => imports.add(imp))
      }
    })

    let code = `import React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
${Array.from(imports).filter((imp: string) => imp !== 'React').map((imp: string) => `import { ${imp} } from './${imp}'`).join('\n')}

// Generated component for ${page.name}
export function ${componentName}() {
  return (
    <div 
      className="builder-page" 
      data-page-id="${page.id}"
      style={{
        ${this.generateCSSProperties(page.styles)}
      }}
    >
`

    // Generate layout with enhanced features
    code += this.generateLayoutCode(page.layout, page.components, 2)

    code += `    </div>
  )
}

// Page metadata
${componentName}.displayName = '${page.name}'
${componentName}.metadata = ${JSON.stringify(page.metadata, null, 2)}

export default ${componentName}
`

    return code
  }

  // 🎯 Generate HTML page
  private generateHTMLPage(page: BuilderPage): string {
    const theme = this.themes.get(page.settings.theme)
    
    return `<!DOCTYPE html>
<html lang="${page.settings.language || 'en'}" ${page.settings.rtl ? 'dir="rtl"' : ''}>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${page.metadata.title}</title>
  <meta name="description" content="${page.metadata.description}">
  <meta name="keywords" content="${page.metadata.keywords.join(', ')}">
  ${page.metadata.ogTitle ? `<meta property="og:title" content="${page.metadata.ogTitle}">` : ''}
  ${page.metadata.ogDescription ? `<meta property="og:description" content="${page.metadata.ogDescription}">` : ''}
  ${page.metadata.ogImage ? `<meta property="og:image" content="${page.metadata.ogImage}">` : ''}
  ${page.metadata.canonical ? `<link rel="canonical" href="${page.metadata.canonical}">` : ''}
  ${page.metadata.noIndex ? '<meta name="robots" content="noindex, nofollow">' : ''}
  ${page.settings.favicon ? `<link rel="icon" href="${page.settings.favicon}">` : ''}
  
  <style>
    ${this.generateCSS(page, theme)}
    ${page.settings.customCSS || ''}
  </style>
</head>
<body>
  ${this.generateHTMLContent(page)}
  
  ${page.settings.customJS ? `<script>${page.settings.customJS}</script>` : ''}
  ${page.settings.analytics?.googleAnalytics ? `
  <script async src="https://www.googletagmanager.com/gtag/js?id=${page.settings.analytics.googleAnalytics}"></script>
  <script>
    window.dataLayer = window.dataLayer || [];
    function gtag(){dataLayer.push(arguments);}
    gtag('js', new Date());
    gtag('config', '${page.settings.analytics.googleAnalytics}');
  </script>` : ''}
</body>
</html>`
  }

  // 🎯 Generate Vue component
  private generateVueComponent(page: BuilderPage): string {
    const componentName = this.slugToComponentName(page.slug)
    
    return `<template>
  <div 
    class="builder-page" 
    :data-page-id="pageId"
    :style="pageStyles"
  >
    ${this.generateVueTemplate(page.layout, page.components)}
  </div>
</template>

<script>
export default {
  name: '${componentName}',
  data() {
    return {
      pageId: '${page.id}',
      pageStyles: ${JSON.stringify(this.stylesToCSS(page.styles))}
    }
  },
  mounted() {
    // Component mounted
  }
}
</script>

<style scoped>
${this.generateScopedCSS(page)}
</style>`
  }

  // 🎯 Utility methods
  private validateProps(props: Record<string, any>, validation: Record<string, any>): void {
    Object.entries(validation).forEach(([key, rules]) => {
      const value = props[key]
      if (rules.required && (value === undefined || value === null)) {
        throw new Error(`Property ${key} is required`)
      }
      if (rules.type && typeof value !== rules.type) {
        throw new Error(`Property ${key} must be of type ${rules.type}`)
      }
      if (rules.min && value < rules.min) {
        throw new Error(`Property ${key} must be at least ${rules.min}`)
      }
      if (rules.max && value > rules.max) {
        throw new Error(`Property ${key} must be at most ${rules.max}`)
      }
    })
  }

  private removeFromParent(page: BuilderPage, componentId: string): void {
    // Remove from layout
    const layoutIndex = page.layout.children.indexOf(componentId)
    if (layoutIndex > -1) {
      page.layout.children.splice(layoutIndex, 1)
      return
    }

    // Remove from parent component
    page.components.forEach(component => {
      if (component.children) {
        const childIndex = component.children.indexOf(componentId)
        if (childIndex > -1) {
          component.children.splice(childIndex, 1)
        }
      }
    })
  }

  private getNextZIndex(page: BuilderPage): number {
    let maxZ = 0
    page.components.forEach(component => {
      if (component.position.zIndex > maxZ) {
        maxZ = component.position.zIndex
      }
    })
    return maxZ + 1
  }

  private generateSlug(name: string): string {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '')
  }

  private generateCSSProperties(styles: BuilderStyle[]): string {
    return styles
      .filter(style => style.breakpoint === 'desktop' || !style.breakpoint)
      .map(style => `${style.property}: ${style.value}${style.unit || ''}${style.important ? ' !important' : ''}`)
      .join(',\n        ')
  }

  private generateCSS(page: BuilderPage, theme?: any): string {
    // Generate comprehensive CSS for HTML export
    let css = `
      * { box-sizing: border-box; }
      body { margin: 0; padding: 0; font-family: ${theme?.typography?.fontFamily || 'Arial, sans-serif'}; }
      .builder-page { min-height: 100vh; }
    `

    // Add component styles
    page.components.forEach(component => {
      css += `
        .component-${component.id} {
          ${this.generateCSSProperties(component.styles)}
        }
      `
    })

    return css
  }

  private generateHTMLContent(page: BuilderPage): string {
    // Generate HTML content for static export
    return `<div class="builder-page" data-page-id="${page.id}">
      ${this.generateLayoutHTML(page.layout, page.components)}
    </div>`
  }

  private generateLayoutHTML(layout: BuilderLayout, components: BuilderComponentInstance[]): string {
    let html = `<div class="builder-layout ${layout.type}" data-layout-id="${layout.id}">`
    
    layout.children.forEach(childId => {
      const component = components.find(c => c.id === childId)
      if (component) {
        html += `<div class="component-${component.id}" data-component-id="${component.id}">
          <!-- Component: ${component.name} -->
        </div>`
      }
    })
    
    html += '</div>'
    return html
  }

  private generateVueTemplate(layout: BuilderLayout, components: BuilderComponentInstance[]): string {
    // Generate Vue template
    return `<div class="builder-layout ${layout.type}">
      <!-- Vue template generation -->
    </div>`
  }

  private generateScopedCSS(page: BuilderPage): string {
    // Generate scoped CSS for Vue component
    return page.components
      .map(component => `.component-${component.id} { ${this.generateCSSProperties(component.styles)} }`)
      .join('\n')
  }

  // 🎯 Enhanced layout code generation
  private generateLayoutCode(layout: BuilderLayout, layoutComponents: BuilderComponentInstance[], indent: number = 0): string {
    const indentStr = '  '.repeat(indent)
    const animationProps = layout.animation ? this.generateAnimationProps(layout.animation) : ''
    
    let code = `${indentStr}<motion.div
${indentStr}  className="builder-layout ${layout.type}"
${indentStr}  layoutId="${layout.id}"
${indentStr}  style={{
${indentStr}    ${this.generateCSSProperties(layout.styles)}
${indentStr}  }}
${animationProps ? `${indentStr}  ${animationProps}` : ''}
${indentStr}>
`

    layout.children.forEach(childId => {
      const component = layoutComponents.find(c => c.id === childId)
      if (component) {
        code += this.generateComponentCode(component, layoutComponents, indent + 1)
      }
    })

    code += `${indentStr}</motion.div>
`
    return code
  }

  // 🎯 Enhanced component code generation
  private generateComponentCode(component: BuilderComponentInstance, allComponents: BuilderComponentInstance[], indent: number = 0): string {
    const indentStr = '  '.repeat(indent)
    const componentDef = this.components.get(component.componentId)
    if (!componentDef) return ''

    const propsString = Object.entries(component.props)
      .map(([key, value]) => `${key}={${JSON.stringify(value)}}`)
      .join(' ')

    const stylesString = this.stylesToCSS(component.styles)
    const animationProps = component.animation ? this.generateAnimationProps(component.animation) : ''
    const visibilityClass = this.generateVisibilityClass(component.visibility)

    return `${indentStr}<motion.div
${indentStr}  className="builder-component ${component.componentId} ${visibilityClass}"
${indentStr}  data-component-id="${component.id}"
${indentStr}  style={{
${indentStr}    position: 'absolute',
${indentStr}    left: ${component.position.x}px,
${indentStr}    top: ${component.position.y}px,
${indentStr}    width: ${component.position.width}px,
${indentStr}    height: ${component.position.height}px,
${indentStr}    zIndex: ${component.position.zIndex},
${component.position.rotation ? `${indentStr}    transform: 'rotate(${component.position.rotation}deg)',` : ''}
${indentStr}    ${Object.entries(stylesString).map(([key, value]) => `${key}: ${JSON.stringify(value)}`).join(`,\n${indentStr}    `)}
${indentStr}  }}
${indentStr}  drag={!${component.locked || false}}
${indentStr}  dragMomentum={false}
${indentStr}  whileHover={{ scale: ${component.locked ? 1 : 1.02} }}
${indentStr}  whileTap={{ scale: ${component.locked ? 1 : 0.98} }}
${animationProps ? `${indentStr}  ${animationProps}` : ''}
${indentStr}>
${indentStr}  <${componentDef.name} ${propsString} />
${component.children?.length ? this.generateChildrenCode(component.children, allComponents, indent + 1) : ''}
${indentStr}</motion.div>
`
  }

  private generateChildrenCode(childIds: string[], allComponents: BuilderComponentInstance[], indent: number): string {
    return childIds
      .map(childId => {
        const child = allComponents.find(c => c.id === childId)
        return child ? this.generateComponentCode(child, allComponents, indent) : ''
      })
      .join('')
  }

  private generateAnimationProps(animation: AnimationSettings): string {
    return `initial={{ opacity: 0 }}
  animate={{ opacity: 1 }}
  transition={{ 
    duration: ${animation.duration / 1000}, 
    delay: ${animation.delay / 1000},
    ease: "${animation.easing}" 
  }}`
  }

  private generateVisibilityClass(visibility: VisibilitySettings): string {
    const classes = []
    if (!visibility.desktop) classes.push('hidden-desktop')
    if (!visibility.tablet) classes.push('hidden-tablet')
    if (!visibility.mobile) classes.push('hidden-mobile')
    return classes.join(' ')
  }

  // 🎯 Enhanced style conversion
  private stylesToCSS(styles: BuilderStyle[]): Record<string, any> {
    const css: Record<string, any> = {}

    styles.forEach(style => {
      if (style.property && style.value !== undefined) {
        const key = style.property
        let value = style.value
        
        if (style.unit && typeof value === 'number') {
          value = `${value}${style.unit}`
        }
        
        css[key] = value
      }
    })

    return css
  }

  // 🎯 Enhanced component instance creation
  private createComponentInstance(
    id: string,
    componentId: string,
    props: Record<string, any> = {},
    position: { x: number; y: number; width?: number; height?: number; zIndex?: number } = { x: 0, y: 0, width: 200, height: 100, zIndex: 1 }
  ): BuilderComponentInstance {
    const component = this.components.get(componentId)
    if (!component) throw new Error(`Component ${componentId} not found`)

    const defaultProps = component.props ? Object.entries(component.props).reduce((acc: Record<string, any>, [key, value]: [string, any]) => ({
      ...acc,
      [key]: value
    }), {}) : {}

    return {
      id,
      componentId,
      name: component.name,
      props: { ...defaultProps, ...props },
      styles: [...(component.defaultStyles || [])],
      interactions: [...(component.interactions || [])],
      position: {
        x: position.x,
        y: position.y,
        width: position.width || component.defaultWidth || 200,
        height: position.height || component.defaultHeight || 100,
        zIndex: position.zIndex || 1,
        rotation: 0,
        scale: 1
      },
      visibility: {
        desktop: true,
        tablet: true,
        mobile: true
      },
      locked: false
    }
  }

  // 🎯 Enhanced action application and reversal
  private applyAction(pageId: string, action: BuilderAction): void {
    const page = this.pages.get(pageId)
    if (!page) return

    switch (action.type) {
      case 'add_component':
        // Re-add component
        break
      case 'remove_component':
        // Re-remove component
        break
      case 'update_component':
        // Re-apply update
        break
      // Add more action types as needed
    }
  }

  private reverseAction(pageId: string, action: BuilderAction): void {
    const page = this.pages.get(pageId)
    if (!page) return

    switch (action.type) {
      case 'add_component':
        // Remove the added component
        break
      case 'remove_component':
        // Re-add the removed component
        break
      case 'update_component':
        // Revert the update
        break
      // Add more action reversals as needed
    }
  }

  // 🎯 Enhanced ID generation
  private generateId(): string {
    return `${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
  }

  // 🎯 Enhanced slug to component name conversion
  private slugToComponentName(slug: string): string {
    return slug
      .split('-')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join('')
  }

  // 🎯 Enhanced getters with filtering and sorting
  getPages(filters?: { published?: boolean; tags?: string[] }): BuilderPage[] {
    let pages = Array.from(this.pages.values())
    
    if (filters?.published !== undefined) {
      pages = pages.filter(page => page.isPublished === filters.published)
    }
    
    if (filters?.tags?.length) {
      pages = pages.filter(page => 
        filters.tags!.some((tag: string) => page.tags.includes(tag))
      )
    }
    
    return pages.sort((a, b) => b.updatedAt.getTime() - a.updatedAt.getTime())
  }

  getPage(pageId: string): BuilderPage | undefined {
    return this.pages.get(pageId)
  }

  // 🎯 Enhanced page operations
  savePage(page: BuilderPage): void {
    page.updatedAt = new Date()
    this.pages.set(page.id, page)
    this.emit('pageSaved', page)
    logger.info(`💾 Saved page: ${page.name}`)
  }

  publishPage(pageId: string): void {
    const page = this.pages.get(pageId)
    if (!page) throw new Error(`Page ${pageId} not found`)

    page.isPublished = true
    page.publishedAt = new Date()
    page.updatedAt = new Date()

    this.emit('pagePublished', page)
    logger.info(`🚀 Published page: ${page.name}`)
  }

  unpublishPage(pageId: string): void {
    const page = this.pages.get(pageId)
    if (!page) throw new Error(`Page ${pageId} not found`)

    page.isPublished = false
    page.publishedAt = undefined
    page.updatedAt = new Date()

    this.emit('pageUnpublished', page)
    logger.info(`📴 Unpublished page: ${page.name}`)
  }

  duplicatePage(pageId: string, newName?: string): BuilderPage {
    const page = this.pages.get(pageId)
    if (!page) throw new Error(`Page ${pageId} not found`)

    const duplicatedPage: BuilderPage = {
      ...JSON.parse(JSON.stringify(page)), // Deep clone
      id: this.generateId(),
      name: newName || `${page.name} Copy`,
      slug: this.generateSlug(newName || `${page.name}-copy`),
      version: 1,
      createdAt: new Date(),
      updatedAt: new Date(),
      isPublished: false,
      publishedAt: undefined
    }

    // Generate new IDs for all components
    const idMap = new Map<string, string>()
    duplicatedPage.components.forEach(component => {
      const newId = this.generateId()
      idMap.set(component.id, newId)
      component.id = newId
    })

    // Update references
    duplicatedPage.layout.children = duplicatedPage.layout.children.map(id => idMap.get(id) || id)
    duplicatedPage.components.forEach(component => {
      if (component.children) {
        component.children = component.children.map(id => idMap.get(id) || id)
      }
    })

    this.savePage(duplicatedPage)
    this.initializeHistory(duplicatedPage.id)
    this.emit('pageDuplicated', { original: page, duplicate: duplicatedPage })
    
    return duplicatedPage
  }

  deletePage(pageId: string): void {
    const page = this.pages.get(pageId)
    if (!page) throw new Error(`Page ${pageId} not found`)

    this.pages.delete(pageId)
    this.history.delete(pageId)
    this.snapshots.delete(pageId)

    this.emit('pageDeleted', page)
    logger.info(`🗑️ Deleted page: ${page.name}`)
  }

  // 🎯 Enhanced component and template getters
  getAvailableComponents(category?: string): any[] {
    let components = Array.from(this.components.values())
    
    if (category) {
      components = components.filter(comp => comp.category === category)
    }
    
    return components.sort((a, b) => a.name.localeCompare(b.name))
  }

  getComponentCategories(): string[] {
    const categories = new Set<string>()
    this.components.forEach(component => {
      categories.add(component.category || 'general')
    })
    return Array.from(categories).sort()
  }

  getAvailableTemplates(category?: string): BuilderPage[] {
    let templates = Array.from(this.templates.values())
    
    if (category) {
      templates = templates.filter(template => 
        template.tags.includes(category)
      )
    }
    
    return templates
  }

  getAvailableThemes(): any[] {
    return Array.from(this.themes.values())
  }

  // 🎯 History and snapshot getters
  getPageHistory(pageId: string): BuilderHistory | undefined {
    return this.history.get(pageId)
  }

  getPageSnapshots(pageId: string): BuilderSnapshot[] {
    return this.snapshots.get(pageId) || []
  }

  // 🎯 Search functionality
  searchPages(query: string): BuilderPage[] {
    const lowercaseQuery = query.toLowerCase()
    return Array.from(this.pages.values()).filter(page =>
      page.name.toLowerCase().includes(lowercaseQuery) ||
      page.slug.toLowerCase().includes(lowercaseQuery) ||
      page.metadata.title.toLowerCase().includes(lowercaseQuery) ||
      page.metadata.description.toLowerCase().includes(lowercaseQuery) ||
      page.tags.some((tag: string) => tag.toLowerCase().includes(lowercaseQuery))
    )
  }

  searchComponents(query: string): any[] {
    const lowercaseQuery = query.toLowerCase()
    return Array.from(this.components.values()).filter(component =>
      component.name.toLowerCase().includes(lowercaseQuery) ||
      component.category.toLowerCase().includes(lowercaseQuery) ||
      component.tags?.some((tag: any) => String(tag).toLowerCase().includes(lowercaseQuery))
    )
  }
}

// 🎯 Export enhanced singleton instance
export const builderEngine = BuilderEngine.getInstance()

// 🎯 Enhanced React Hook for Builder
export function useBuilder(pageId?: string) {
  const [currentPage, setCurrentPage] = React.useState<BuilderPage | null>(null)
  const [selectedComponent, setSelectedComponent] = React.useState<string | null>(null)
  const [selectedComponents, setSelectedComponents] = React.useState<string[]>([])
  const [isDragging, setIsDragging] = React.useState(false)
  const [isLoading, setIsLoading] = React.useState(false)
  const [error, setError] = React.useState<string | null>(null)
  const [history, setHistory] = React.useState<BuilderHistory | null>(null)
  const [snapshots, setSnapshots] = React.useState<BuilderSnapshot[]>([])

  // Load page data
  React.useEffect(() => {
    if (pageId) {
      setIsLoading(true)
      try {
        const page = builderEngine.getPage(pageId)
        setCurrentPage(page || null)
        setHistory(builderEngine.getPageHistory(pageId) || null)
        setSnapshots(builderEngine.getPageSnapshots(pageId))
        setError(null)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load page')
      } finally {
        setIsLoading(false)
      }
    }
  }, [pageId])

  // Event listeners
  React.useEffect(() => {
    const handlePageUpdate = (data: any) => {
      if (data.pageId === pageId) {
        const updatedPage = builderEngine.getPage(pageId!)
        setCurrentPage(updatedPage || null)
      }
    }

    const handleHistoryUpdate = (data: any) => {
      if (data.pageId === pageId) {
        setHistory(builderEngine.getPageHistory(pageId!) || null)
      }
    }

    const handleSnapshotUpdate = (data: any) => {
      if (data.pageId === pageId) {
        setSnapshots(builderEngine.getPageSnapshots(pageId!))
      }
    }

    builderEngine.on('componentAdded', handlePageUpdate)
    builderEngine.on('componentRemoved', handlePageUpdate)
    builderEngine.on('componentUpdated', handlePageUpdate)
    builderEngine.on('actionUndone', handleHistoryUpdate)
    builderEngine.on('actionRedone', handleHistoryUpdate)
    builderEngine.on('snapshotCreated', handleSnapshotUpdate)

    return () => {
      builderEngine.off('componentAdded', handlePageUpdate)
      builderEngine.off('componentRemoved', handlePageUpdate)
      builderEngine.off('componentUpdated', handlePageUpdate)
      builderEngine.off('actionUndone', handleHistoryUpdate)
      builderEngine.off('actionRedone', handleHistoryUpdate)
      builderEngine.off('snapshotCreated', handleSnapshotUpdate)
    }
  }, [pageId])

  // Enhanced actions
  const addComponent = React.useCallback((componentId: string, position: { x: number; y: number }, options?: any) => {
    if (!currentPage) return null
    try {
      const component = builderEngine.addComponent(currentPage.id, componentId, position, options)
      return component
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to add component')
      return null
    }
  }, [currentPage])

  const updateComponent = React.useCallback((componentId: string, updates: Partial<BuilderComponentInstance>) => {
    if (!currentPage) return
    try {
      builderEngine.updateComponent(currentPage.id, componentId, updates)
      setError(null)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update component')
    }
  }, [currentPage])

  const removeComponent = React.useCallback((componentId: string) => {
    if (!currentPage) return
    try {
      builderEngine.removeComponent(currentPage.id, componentId)
      if (selectedComponent === componentId) {
        setSelectedComponent(null)
      }
      setSelectedComponents(prev => prev.filter(id => id !== componentId))
      setError(null)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to remove component')
    }
  }, [currentPage, selectedComponent])

  const removeSelectedComponents = React.useCallback(() => {
    selectedComponents.forEach(componentId => {
      removeComponent(componentId)
    })
    setSelectedComponents([])
  }, [selectedComponents, removeComponent])

  const groupSelectedComponents = React.useCallback((groupName?: string) => {
    if (!currentPage || selectedComponents.length < 2) return null
    try {
      const groupId = builderEngine.groupComponents(currentPage.id, selectedComponents, groupName)
      setSelectedComponents([])
      return groupId
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to group components')
      return null
    }
  }, [currentPage, selectedComponents])

  const copySelectedComponents = React.useCallback(() => {
    if (!currentPage || selectedComponents.length === 0) return
    builderEngine.copyComponents(currentPage.id, selectedComponents)
  }, [currentPage, selectedComponents])

  const pasteComponents = React.useCallback((position: { x: number; y: number }) => {
    if (!currentPage) return []
    try {
      const components = builderEngine.pasteComponents(currentPage.id, position)
      setError(null)
      return components
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to paste components')
      return []
    }
  }, [currentPage])

  const undo = React.useCallback(() => {
    if (!currentPage) return false
    return builderEngine.undo(currentPage.id)
  }, [currentPage])

  const redo = React.useCallback(() => {
    if (!currentPage) return false
    return builderEngine.redo(currentPage.id)
  }, [currentPage])

  const canUndo = React.useMemo(() => {
    return history ? history.currentIndex >= 0 : false
  }, [history])

  const canRedo = React.useMemo(() => {
    return history ? history.currentIndex < history.actions.length - 1 : false
  }, [history])

  const savePage = React.useCallback(() => {
    if (!currentPage) return
    builderEngine.savePage(currentPage)
  }, [currentPage])

  const createSnapshot = React.useCallback((name: string) => {
    if (!currentPage) return null
    return builderEngine.createSnapshot(currentPage.id, name)
  }, [currentPage])

  const restoreSnapshot = React.useCallback((snapshotId: string) => {
    if (!currentPage) return
    try {
      builderEngine.restoreSnapshot(currentPage.id, snapshotId)
      setError(null)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to restore snapshot')
    }
  }, [currentPage])

  const exportPage = React.useCallback((format: 'react' | 'html' | 'json' | 'vue' = 'react') => {
    if (!currentPage) return ''
    try {
      const exported = builderEngine.exportPage(currentPage.id, format)
      setError(null)
      return exported
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to export page')
      return ''
    }
  }, [currentPage])

  const publishPage = React.useCallback(() => {
    if (!currentPage) return
    try {
      builderEngine.publishPage(currentPage.id)
      setError(null)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to publish page')
    }
  }, [currentPage])

  const duplicatePage = React.useCallback((newName?: string) => {
    if (!currentPage) return null
    try {
      const duplicate = builderEngine.duplicatePage(currentPage.id, newName)
      return duplicate
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to duplicate page')
      return null
    }
  }, [currentPage])

  // Return all the hook values
  return {
    currentPage,
    selectedComponent,
    isDragging,
    setSelectedComponent,
    setIsDragging,
    addComponent,
    updateComponent,
    removeComponent,
    undo,
    redo,
    savePage,
    exportPage,
    availableComponents: builderEngine.getAvailableComponents(),
    availableTemplates: builderEngine.getAvailableTemplates(),
    availableThemes: builderEngine.getAvailableThemes()
  }
}
