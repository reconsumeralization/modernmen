// Demo Module Types
// Type definitions for demo and example components

export interface DemoComponent {
  id: string
  name: string
  description: string
  category: 'analytics' | 'navigation' | 'monitoring' | 'testing' | 'version-control'
  component: React.ComponentType<any>
  enabled: boolean
}

export interface DemoPage {
  id: string
  path: string
  title: string
  description: string
  component: React.ComponentType<any>
  category: string
  requiresAuth?: boolean
}

export interface DemoConfig {
  enabled: boolean
  showInNavigation: boolean
  categories: string[]
  components: DemoComponent[]
  pages: DemoPage[]
}

export interface AnalyticsDemoData {
  contentId: string
  contentType: string
  userRole: string
  viewCount: number
  completionRate: number
  feedbackCount: number
}

export interface NavigationDemoItem {
  role: string
  icon: string
  color: string
  description: string
  features: string[]
  navigation: string[]
}

export interface MonitoringDemoMetrics {
  componentName: string
  performance: {
    loadTime: number
    renderTime: number
    memoryUsage: number
  }
  interactions: {
    clicks: number
    forms: number
    errors: number
  }
  timestamp: Date
}
