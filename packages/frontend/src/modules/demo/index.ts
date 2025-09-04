// Demo Module Exports
// This module contains demo and example components for the Modern Men Hair Salon system

// Components
export { default as MonitoringExample } from './components/MonitoringExample'

// Pages
export { default as AnalyticsDemoPage } from './pages/AnalyticsDemoPage'
export { default as NavigationDemoPage } from './pages/NavigationDemoPage'
export { default as VersionControlDemoPage } from './pages/VersionControlDemoPage'
export { default as TestGuidePage } from './pages/TestGuidePage'

// Utils
export { DemoAnalyticsService } from './utils/analytics-service'
export { DemoNavigationService } from './utils/navigation-service'

// Types
export * from './types/demo-types'

// Re-export manifest for module registry
export { default as demoManifest } from './manifest.json'
