# 🚨 Comprehensive Error Handling System

This directory contains a complete error handling solution for the Modern Men Hair Salon application, designed to prevent crashes, provide better user experience, and enable effective debugging.

## 📁 Structure

```
src/lib/error-handling/
├── index.ts                    # Main exports and setup
├── README.md                   # This documentation
├── ErrorBoundary.tsx          # React error boundary component
├── safe-access.ts             # Array/object bounds checking
├── enhanced-api-errors.ts     # API error handling utilities
├── error-monitoring.ts        # Error logging and monitoring
└── form-validation.ts         # Form validation utilities
```

## 🎯 Features

### ✅ Error Boundary Component
- **React Error Boundary** with retry functionality
- **Comprehensive error display** with details and actions
- **Breadcrumb tracking** for debugging
- **Multiple retry attempts** with backoff
- **User-friendly error messages**

### ✅ Safe Array/Object Access
- **Bounds checking** for array access
- **Null/undefined protection** for object properties
- **Safe iteration** methods
- **Validation utilities** for data integrity
- **Type-safe operations**

### ✅ Enhanced API Error Handling
- **Structured error responses** with codes and details
- **Validation error formatting** from Zod
- **HTTP status code mapping**
- **Request context logging**
- **Error categorization**

### ✅ Error Monitoring & Logging
- **Real-time error tracking** with severity levels
- **Breadcrumb system** for user action tracking
- **Error pattern detection** and categorization
- **Performance monitoring**
- **Global error handlers**

### ✅ Form Validation System
- **Input sanitization** and validation
- **Safe form data extraction**
- **Array bounds validation**
- **Type-safe validation schemas**
- **Error aggregation and reporting**

## 🚀 Quick Start

### 1. Setup Error Handling System

```typescript
// In your app root or layout
import { setupErrorHandling } from '@/lib/error-handling'

export default function RootLayout({ children }) {
  // Setup comprehensive error handling
  React.useEffect(() => {
    setupErrorHandling()
  }, [])

  return (
    <ErrorBoundary>
      {children}
    </ErrorBoundary>
  )
}
```

### 2. Use Error Boundary

```typescript
import { ErrorBoundary } from '@/lib/error-handling'

function MyComponent() {
  return (
    <ErrorBoundary
      maxRetries={3}
      onError={(error, errorInfo) => {
        console.log('Custom error handling:', error, errorInfo)
      }}
    >
      <PotentiallyErrorProneComponent />
    </ErrorBoundary>
  )
}
```

### 3. Safe Array/Object Access

```typescript
import { safeGet, safeMap, SafeArray } from '@/lib/error-handling'

// Safe array access
const item = safeGet(myArray, 5, 'default value')

// Safe iteration
const results = safeMap(myArray, (item, index) => {
  return item.name // Safe even if item is undefined
})

// Using SafeArray wrapper
const safeArray = new SafeArray(myArray, 'MyComponent')
const firstItem = safeArray.get(0)
const isValid = safeArray.set(5, newItem)
```

### 4. Enhanced API Error Handling

```typescript
import { withEnhancedErrorHandler, APIErrorFactory } from '@/lib/error-handling'

// API route with enhanced error handling
export const POST = withEnhancedErrorHandler(async (request) => {
  const { data } = await request.json()

  if (!data.name) {
    throw APIErrorFactory.missingRequiredField('name')
  }

  // Your API logic here
  return createEnhancedSuccessResponse(result, 'Success message')
})
```

### 5. Form Validation

```typescript
import { ValidationSchemas, validateWithMonitoring } from '@/lib/error-handling'

// Validate form data
const result = await validateWithMonitoring(
  ValidationSchemas.userRegistration,
  formData,
  'UserRegistrationForm'
)

if (!result.success) {
  // Handle validation errors
  console.log('Validation errors:', result.errors)
}
```

### 6. Error Monitoring

```typescript
import { useErrorMonitoring } from '@/lib/error-handling'

function MyComponent() {
  const { addBreadcrumb, captureError } = useErrorMonitoring()

  const handleAction = async () => {
    addBreadcrumb('User clicked action button', 'user_action', {
      buttonId: 'submit'
    })

    try {
      await riskyOperation()
    } catch (error) {
      await captureError(error, {
        component: 'MyComponent',
        action: 'handleAction'
      })
    }
  }

  return <button onClick={handleAction}>Action</button>
}
```

## 🔧 Advanced Usage

### Custom Error Types

```typescript
import { APIErrorFactory } from '@/lib/error-handling'

// Create custom API errors
throw APIErrorFactory.businessRuleViolation(
  'Appointment time must be in business hours',
  { requestedTime: '18:00', businessHours: '9:00-17:00' }
)

// Create array bounds error
throw APIErrorFactory.indexOutOfBounds(10, 5, 'Service selection')
```

### Error Pattern Detection

```typescript
import { errorMonitor } from '@/lib/error-handling'

// Monitor specific error patterns
errorMonitor.onError((error) => {
  if (error.category === 'array_bounds') {
    // Handle array bounds errors specifically
    console.log('Array bounds error detected:', error)
  }
})
```

### Safe Component Rendering

```typescript
import { safeMap } from '@/lib/error-handling'

function ComponentList({ components }) {
  return (
    <div>
      {safeMap(components, (component, index) => {
        if (!component || !component.id) {
          return null // Skip invalid components
        }

        return (
          <ComponentItem
            key={component.id}
            component={component}
            onError={(error) => {
              console.error(`Error in component ${component.id}:`, error)
            }}
          />
        )
      })}
    </div>
  )
}
```

## 📊 Error Categories

| Category | Description | Severity |
|----------|-------------|----------|
| `network` | Network and API errors | Medium |
| `auth` | Authentication/authorization | High |
| `validation` | Input validation errors | Low |
| `database` | Database operation errors | High |
| `ui` | UI rendering errors | Medium |
| `array_bounds` | Array index errors | High |
| `performance` | Performance-related errors | Medium |
| `business_logic` | Business rule violations | Medium |

## 🔍 Error Monitoring Dashboard

The error monitoring system provides:

- **Real-time error tracking** with severity levels
- **Error statistics** by category and time
- **User journey tracking** with breadcrumbs
- **Error resolution tracking**
- **Performance metrics**

Access the error dashboard:
```typescript
import { errorMonitor } from '@/lib/error-handling'

const stats = errorMonitor.getErrorStats()
const errors = errorMonitor.getErrors()
const unresolved = errors.filter(e => !e.resolved)
```

## 🛠️ Development Tools

### Error Simulation

```typescript
import { ErrorUtils } from '@/lib/error-handling'

// Simulate different error types
await ErrorUtils.withMonitoring(
  () => {
    // Code that might throw errors
    throw new Error('Simulated error')
  },
  { component: 'TestComponent' }
)
```

### Debug Mode

```typescript
// Enable detailed error logging in development
if (process.env.NODE_ENV === 'development') {
  console.log('Error monitoring stats:', errorMonitor.getErrorStats())
}
```

## 📋 Best Practices

### 1. Error Boundary Placement
```typescript
// Wrap entire app
<ErrorBoundary>
  <App />
</ErrorBoundary>

// Wrap route components
<ErrorBoundary>
  <Dashboard />
</ErrorBoundary>

// Wrap complex components
<ErrorBoundary maxRetries={2}>
  <ComplexDataTable />
</ErrorBoundary>
```

### 2. Safe Data Access
```typescript
// Always use safe access for user data
const userName = safeProp(user, 'profile.name', 'Unknown User')
const firstItem = safeGet(items, 0, { id: 'default', name: 'Default Item' })

// Use SafeArray for complex array operations
const safeItems = new SafeArray(items, 'ItemsList')
const filtered = safeItems.filter(item => item.active)
```

### 3. API Error Handling
```typescript
// Consistent error handling in API routes
export const GET = withEnhancedErrorHandler(async (request) => {
  const data = await fetchData()

  if (!data) {
    throw APIErrorFactory.notFound('Requested resource')
  }

  return createEnhancedSuccessResponse(data)
})
```

### 4. Form Validation
```typescript
// Comprehensive form validation
const handleSubmit = async (formData: FormData) => {
  const result = await validateWithMonitoring(
    ValidationSchemas.contactForm,
    Object.fromEntries(formData),
    'ContactForm'
  )

  if (!result.success) {
    setErrors(result.errors)
    return
  }

  await submitForm(result.data)
}
```

### 5. Error Monitoring
```typescript
// Add breadcrumbs for user actions
const { addBreadcrumb } = useErrorMonitoring()

const handleUserAction = () => {
  addBreadcrumb('User clicked feature button', 'user_action', {
    feature: 'advanced-search',
    timestamp: Date.now()
  })

  // Perform action
}
```

## 🚨 Common Error Patterns

### Array Bounds Errors
```typescript
// ❌ Unsafe access
const item = items[index] // May throw if index out of bounds

// ✅ Safe access
const item = safeGet(items, index, null)
if (!item) {
  console.log('Index out of bounds or array empty')
}
```

### Null Reference Errors
```typescript
// ❌ Unsafe property access
const name = user.profile.name // May throw if user or profile is null

// ✅ Safe property access
const name = safeProp(user, 'profile.name', 'Unknown')
```

### API Error Handling
```typescript
// ❌ Generic error handling
try {
  await apiCall()
} catch (error) {
  console.error('API Error:', error)
}

// ✅ Structured error handling
try {
  await apiCall()
} catch (error) {
  if (error instanceof EnhancedAPIError) {
    // Handle specific API errors
    if (error.code === ErrorCode.UNAUTHORIZED) {
      redirect('/login')
    }
  }
  await captureError(error, { component: 'APIHandler' })
}
```

## 📈 Performance Considerations

- **Error boundaries** have minimal performance impact
- **Safe access utilities** add small overhead but prevent crashes
- **Error monitoring** can be disabled in production for critical paths
- **Form validation** runs client-side to avoid server round trips

## 🔧 Configuration

### Environment Variables

```env
# Error monitoring
ERROR_MONITORING_ENABLED=true
ERROR_LOG_LEVEL=warn
ERROR_MAX_BREADCRUMBS=50

# Error boundary
ERROR_BOUNDARY_MAX_RETRIES=3
ERROR_BOUNDARY_RETRY_DELAY=1000

# API error handling
API_ERROR_LOGGING_ENABLED=true
API_ERROR_DETAILED_STACK=true
```

### Runtime Configuration

```typescript
import { errorMonitor } from '@/lib/error-handling'

// Configure error monitoring
errorMonitor.onError((error) => {
  // Custom error handling logic
  if (error.severity === 'critical') {
    // Send alert to team
    sendAlert(error)
  }
})
```

## 📞 Support

For issues or questions about the error handling system:

1. Check the error logs in the browser console
2. Review error statistics: `errorMonitor.getErrorStats()`
3. Examine recent breadcrumbs: `errorMonitor.getErrors()[0]?.breadcrumbs`
4. Check the error monitoring dashboard for patterns

## 🎯 Migration Guide

### From Basic Error Handling

```typescript
// Before
try {
  riskyOperation()
} catch (error) {
  console.error(error)
}

// After
import { ErrorUtils } from '@/lib/error-handling'

await ErrorUtils.withMonitoring(
  () => riskyOperation(),
  { component: 'MyComponent' }
)
```

### From Manual Array Bounds Checking

```typescript
// Before
if (array && index >= 0 && index < array.length) {
  const item = array[index]
}

// After
import { safeGet } from '@/lib/error-handling'

const item = safeGet(array, index, null)
```

This comprehensive error handling system ensures your application is robust, user-friendly, and maintainable. It prevents crashes, provides excellent debugging capabilities, and maintains a great user experience even when errors occur.
