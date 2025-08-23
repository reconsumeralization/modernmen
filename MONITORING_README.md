# Modern Men Salon - Monitoring & Analytics

This document describes the comprehensive monitoring and analytics system implemented for the Modern Men Salon application.

## 🚀 Overview

The monitoring system provides:
- **Error Tracking**: Capture and report errors to Sentry
- **Session Recording**: User session recordings via LogRocket
- **Performance Monitoring**: Core Web Vitals and custom metrics
- **User Analytics**: Track user interactions and behavior
- **API Monitoring**: Monitor API call performance and success rates

## 📋 Features

### Core Monitoring Services

#### 1. Sentry Integration
- **Error Tracking**: Automatic error capture and reporting
- **Performance Monitoring**: Transaction tracing and performance metrics
- **Release Tracking**: Track errors by deployment version
- **Issue Management**: Group similar errors and track resolution

#### 2. LogRocket Integration
- **Session Recordings**: Record user sessions for debugging
- **User Interaction Tracking**: See exactly what users did
- **Console Logs**: Capture browser console output
- **Network Requests**: Monitor API calls and responses

#### 3. Custom Analytics
- **Performance Metrics**: Core Web Vitals (LCP, FID, CLS)
- **User Actions**: Track clicks, form submissions, rches
- **API Performance**: Monitor endpoint response times
- **Component Performance**: Track component render times

### Monitoring Hooks

#### `useMonitoring()`
Main hook for accessing all monitoring functions:

```typescript
import { useMonitoring } from '@/hooks/useMonitoring'

function MyComponent() {
  const {
    captureError,
    trackMetric,
    trackAction,
    addBreadcrumb,
    trackApiCall,
    trackPageView,
    trackFormSubmission,
    trackrch
  } = useMonitoring()

  // Use monitoring functions...
}
```

#### `useComponentPerformance(componentName)`
Automatically tracks component render performance:

```typescript
import { useComponentPerformance } from '@/hooks/useMonitoring'

function MyComponent() {
  useComponentPerformance('MyComponent')
  // Component render time is automatically tracked
}
```

#### `upiPerformance()`
Track API call performance:

```typescript
import { upiPerformance } from '@/hooks/useMonitoring'

function MyComponent() {
  const { trackApiRequest } = upiPerformance()

  const fetchData = async () => {
    const result = await trackApiRequest(
      '/api/data',
      'GET',
      async () => {
        const response = await fetch('/api/data')
        return response.json()
      }
    )
  }
}
```

#### `useInteractionTracking()`
Track user interactions:

```typescript
import { useInteractionTracking } from '@/hooks/useMonitoring'

function MyComponent() {
  const { trackClick, trackFormInteraction } = useInteractionTracking()

  return (
    <button onClick={() => trackClick('my-button')}>
      Click me
    </button>
  )
}
```

#### `useErrorBoundary()`
Integrate with error boundaries:

```typescript
import { useErrorBoundary } from '@/hooks/useMonitoring'

function MyComponent() {
  const { reportError } = useErrorBoundary()

  useEffect(() => {
    try {
      // Some operation
    } catch (error) {
      reportError(error instanceof Error ? error : new Error('Unknown error'))
    }
  }, [])
}
```

## ⚙️ Configuration

### Environment Variables

Copy `.env.example` to `.env.local` and configure:

```bash
# Sentry Configuration
NEXT_PUBLIC_SENTRY_DSN=https://your-sentry-dsn@sentry.io/project-id
NEXT_PUBLIC_SENTRY_ENVIRONMENT=production

# LogRocket Configuration
NEXT_PUBLIC_LOGROCKET_APP_ID=your-logrocket-app-id

# Analytics Configuration
NEXT_PUBLIC_ENABLE_ANALYTICS=true
NEXT_PUBLIC_ENABLE_PERFORMANCE_TRACKING=true
NEXT_PUBLIC_ENABLE_ERROR_TRACKING=true
```

### Runtime Configuration

The monitoring system automatically:
1. Initializes on app startup
2. Sets user context when authenticated
3. Tracks Core Web Vitals
4. Monitors network connectivity
5. Captures unhandled errors

## 📊 Metrics Tracked

### Performance Metrics
- **LCP (Largest Contentful Paint)**: Page loading performance
- **FID (First Input Delay)**: User interaction responsiveness
- **CLS (Cumulative Layout Shift)**: Visual stability
- **Page Load Time**: Complete page loading duration
- **Component Render Time**: Individual component performance

### User Actions
- **Clicks**: Button and link interactions
- **Form Submissions**: Form completion and success rates
- **rches**: rch query tracking
- **Navigation**: Page view tracking
- **API Calls**: Endpoint usage and performance

### Error Metrics
- **JavaScript Errors**: Runtime error tracking
- **API Errors**: Failed request monitoring
- **Network Errors**: Connection and timeout issues
- **Unhandled Rejections**: Promise error tracking

## 🔧 Integration Examples

### API Route Monitoring

```typescript
// In your API routes
import { monitoringHelpers } from '@/lib/monitoring'

export async function GET(request: NextRequest) {
  const startTime = performance.now()

  try {
    const result = await yourApiLogic()

    const duration = performance.now() - startTime
    monitoringHelpers.trackApiCall('/api/your-endpoint', 'GET', duration, true)

    return NextResponse.json(result)
  } catch (error) {
    const duration = performance.now() - startTime
    monitoringHelpers.trackApiCall('/api/your-endpoint', 'GET', duration, false)

    throw error
  }
}
```

### Component Error Handling

```typescript
import { ErrorBoundary } from '@/components/ui/error-boundary'

function MyComponent() {
  return (
    <ErrorBoundary
      onError={(error, errorInfo) => {
        // Custom error handling
        console.error('Component error:', error, errorInfo)
      }}
      showErrorDetails={process.env.NODE_ENV === 'development'}
    >
      <YourComponentContent />
    </ErrorBoundary>
  )
}
```

### Form Analytics

```typescript
function ContactForm() {
  const { trackFormSubmission } = useMonitoring()

  const handleSubmit = async (data) => {
    const startTime = performance.now()

    try {
      await submitForm(data)
      const duration = performance.now() - startTime
      trackFormSubmission('contact-form', true, duration)
    } catch (error) {
      const duration = performance.now() - startTime
      trackFormSubmission('contact-form', false, duration)
    }
  }
}
```

## 🐛 Debugging

### Development Mode
- Errors are logged to console only
- Reduced sampling rates for performance
- Detailed error information in error boundaries

### Production Mode
- Errors sent to monitoring services
- Optimized sampling rates
- Minimal performance impact

### Testing Monitoring
Use the `MonitoringExample` component to test all monitoring features:

```typescript
import { MonitoringExample } from '@/components/monitoring/MonitoringExample'

// Add to any page to test monitoring
<MonitoringExample />
```

## 📈 Dashboard Integration

The monitoring data is available in:
- **Sentry Dashboard**: Error tracking and performance metrics
- **LogRocket Dashboard**: Session recordings and user analytics
- **Custom Analytics**: Available through the monitoring service API

## 🔒 Privacy & Security

- **Data Minimization**: Only essential data is collected
- **GDPR Compliance**: User data is handled according to privacy regulations
- **Anonymization**: Personal information is anonymized where possible
- **Consent Management**: Users can opt out of tracking

## 🚨 Alerts & Notifications

Configure alerts in your monitoring services:
- **Sentry**: Set up alerts for error frequency and performance issues
- **LogRocket**: Configure alerts for user experience issues
- **Custom**: Implement custom alert logic using the monitoring hooks

## 📚 Best Practices

1. **Use Descriptive Names**: Give components and actions clear, descriptive names
2. **Add Context**: Include relevant context in error reports and breadcrumbs
3. **Test Monitoring**: Use the `MonitoringExample` component to verify implementation
4. **Performance**: Monitor the performance impact of tracking
5. **Privacy**: Always consider user privacy when adding tracking

## 🔄 Continuous Improvement

The monitoring system is designed to:
- **Evolve with your needs**: Easy to add new metrics and tracking
- **Scale with your application**: Handles increased load and complexity
- **Adapt to new requirements**: Flexible architecture for future enhancements

## 📞 Support

For monitoring setup assistance:
1. Check the configuration examples in this document
2. Use the `MonitoringExample` component for testing
3. Review browser console for initialization errors
4. Check Sentry/LogRocket dashboards for data flow

---

*Last updated: December 2024*
