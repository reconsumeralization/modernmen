'use client'

import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { ThemeProvider } from 'next-themes'
// NextAuth v4 import
import { Provider as AuthProvider } from 'next-auth/client'
import { TooltipProvider } from '@/components/ui/tooltip'
import { useState } from 'react'

// Import all providers
import { SupabaseProvider } from './supabase-provider'
import { PayloadProvider } from './payload-provider'
import { NotificationProvider } from './notification-provider'
import { AuthProvider } from './auth-provider'
import { BusinessProvider } from './business-provider'
import { LoadingProvider } from './loading-provider'
import { ErrorProvider, ErrorBoundary } from './error-provider'

export function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 60 * 1000,
            refetchOnWindowFocus: false,
            retry: (failureCount, error: any) => {
              // Don't retry on 4xx errors
              if (error?.status >= 400 && error?.status < 500) {
                return false
              }
              return failureCount < 3
            },
          },
          mutations: {
            retry: 1,
          },
        },
      })
  )

  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            <TooltipProvider>
              {children}
            </TooltipProvider>
          </ThemeProvider>
        </AuthProvider>
        <ReactQueryDevtools initialIsOpen={false} />
      </QueryClientProvider>
    </ErrorBoundary>
  )
}