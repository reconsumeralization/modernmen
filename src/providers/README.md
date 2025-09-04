# 🎯 Modern Men Hair Salon - Provider System

This directory contains all the providers for the Modern Men Hair Salon application. Each provider manages a specific aspect of the application state and functionality.

## 📦 Available Providers

### 1. **SupabaseProvider** (`supabase-provider.tsx`)
- **Purpose**: Manages Supabase client connection and real-time subscriptions
- **Hook**: `useSupabase()`
- **Usage**:
  ```tsx
  const { supabase, isConnected } = useSupabase()
  ```

### 2. **PayloadProvider** (`payload-provider.tsx`)
- **Purpose**: Manages Payload CMS state and user/tenant data
- **Hook**: `usePayload()`
- **Usage**:
  ```tsx
  const { user, tenant, isAdmin, collections } = usePayload()
  ```

### 3. **NotificationProvider** (`notification-provider.tsx`)
- **Purpose**: Manages toast notifications and alerts
- **Hook**: `useNotifications()`
- **Usage**:
  ```tsx
  const { success, error, warning, info } = useNotifications()
  success('Appointment booked successfully!')
  ```

### 4. **AuthProvider** (`auth-provider.tsx`)
- **Purpose**: Manages authentication state and user roles
- **Hook**: `useAuth()`
- **Usage**:
  ```tsx
  const { user, isAdmin, isAuthenticated, login, logout } = useAuth()
  ```

### 5. **BusinessProvider** (`business-provider.tsx`)
- **Purpose**: Manages salon business settings and configuration
- **Hook**: `useBusiness()`
- **Usage**:
  ```tsx
  const { settings, updateSettings } = useBusiness()
  ```

### 6. **LoadingProvider** (`loading-provider.tsx`)
- **Purpose**: Manages global loading states and progress indicators
- **Hook**: `useLoading()`, `useAsyncLoading()`
- **Usage**:
  ```tsx
  const { withLoading } = useAsyncLoading()
  const result = await withLoading('saving', saveData, 'Saving...')
  ```

### 7. **ErrorProvider** (`error-provider.tsx`)
- **Purpose**: Manages error handling and reporting
- **Hook**: `useError()`
- **Components**: `ErrorBoundary`
- **Usage**:
  ```tsx
  const { addError, errors } = useError()
  ```

## 🚀 Setup

All providers are automatically included in the main `Providers` component. Simply wrap your app with it:

```tsx
import { Providers } from '@/providers'

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  )
}
```

## 🎯 Provider Hierarchy

The providers are wrapped in the following order (outermost to innermost):

```
ErrorBoundary
└── QueryClientProvider (React Query)
    └── SessionProvider (NextAuth)
        └── ThemeProvider (next-themes)
            └── ErrorProvider
                └── LoadingProvider
                    └── NotificationProvider
                        └── SupabaseProvider
                            └── PayloadProvider
                                └── AuthProvider
                                    └── BusinessProvider
                                        └── TooltipProvider
                                            └── Your App
```

## 🔧 Custom Hooks

Each provider includes custom hooks for easy access to their functionality:

- `useSupabase()` - Supabase client and connection status
- `usePayload()` - CMS state and user data
- `useNotifications()` - Toast notifications
- `useAuth()` - Authentication and user roles
- `useBusiness()` - Business settings
- `useLoading()` - Loading states
- `useAsyncLoading()` - Convenient async loading helpers
- `useError()` - Error handling

## 📝 Best Practices

1. **Always use the hooks within their respective providers** - Each hook will throw an error if used outside its provider
2. **Use `useAsyncLoading`** for API calls - It provides automatic loading states
3. **Handle errors with `useError`** - Use `addError()` to report errors consistently
4. **Use `useNotifications`** for user feedback - Success/error messages should use the notification system
5. **Check authentication with `useAuth`** - Use role-based checks for UI/permissions

## 🧪 Testing

When testing components that use these providers, wrap them with the appropriate providers:

```tsx
import { render } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { AuthProvider } from '@/providers'

const renderWithProviders = (component: React.ReactElement) => {
  const queryClient = new QueryClient()
  return render(
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        {component}
      </AuthProvider>
    </QueryClientProvider>
  )
}
```
