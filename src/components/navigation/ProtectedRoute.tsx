'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'
import { useAuth } from '@/hooks/useAuth'
import { LoadingSpinner } from '@/components/ui/loading'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import { AlertTriangle, Lock, ArrowLeft } from 'lucide-react'
import type { UserRole } from '@/types/navigation'

interface ProtectedRouteProps {
  children: React.ReactNode
  requiredRoles?: UserRole[]
  fallbackPath?: string
  showAccessDenied?: boolean
  loadingComponent?: React.ReactNode
  accessDeniedComponent?: React.ReactNode
}

export function ProtectedRoute({
  children,
  requiredRoles = [],
  fallbackPath = '/auth/signin',
  showAccessDenied = true,
  loadingComponent,
  accessDeniedComponent,
}: ProtectedRouteProps) {
  const router = useRouter()
  const { data: session, status } = useSession()
  const { user, isAuthenticated, isLoading } = useAuth()
  const [hasAccess, setHasAccess] = useState(false)
  const [isChecking, setIsChecking] = useState(true)

  useEffect(() => {
    const checkAccess = () => {
      // Still loading authentication state
      if (status === 'loading' || isLoading) {
        return
      }

      // User is not authenticated
      if (!isAuthenticated || !user) {
        setHasAccess(false)
        setIsChecking(false)
        return
      }

      // No role restrictions
      if (requiredRoles.length === 0) {
        setHasAccess(true)
        setIsChecking(false)
        return
      }

      // Check if user has required role
      const userHasRequiredRole = requiredRoles.includes(user.role)
      setHasAccess(userHasRequiredRole)
      setIsChecking(false)
    }

    checkAccess()
  }, [user, isAuthenticated, isLoading, status, requiredRoles])

  // Show loading state
  if (isChecking || status === 'loading' || isLoading) {
    return loadingComponent || (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner />
      </div>
    )
  }

  // User doesn't have access
  if (!hasAccess) {
    // If not authenticated, redirect to sign in
    if (!isAuthenticated) {
      useEffect(() => {
        router.push(fallbackPath)
      }, [router, fallbackPath])
      return null
    }

    // Show access denied component
    if (showAccessDenied) {
      return accessDeniedComponent || <AccessDeniedComponent userRole={user?.role} />
    }

    // Redirect to fallback path
    useEffect(() => {
      router.push(fallbackPath)
    }, [router, fallbackPath])
    return null
  }

  // User has access, render children
  return <>{children}</>
}

interface AccessDeniedComponentProps {
  userRole?: UserRole
  onGoBack?: () => void
}

function AccessDeniedComponent({ userRole, onGoBack }: AccessDeniedComponentProps) {
  const router = useRouter()

  const handleGoBack = () => {
    if (onGoBack) {
      onGoBack()
    } else {
      router.back()
    }
  }

  const handleGoHome = () => {
    router.push('/')
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="max-w-md w-full">
        <Alert className="border-red-200 bg-red-50">
          <AlertTriangle className="h-4 w-4 text-red-600" />
          <AlertTitle className="text-red-800">Access Denied</AlertTitle>
          <AlertDescription className="text-red-700 mt-2">
            You don't have permission to access this page.
            {userRole && (
              <span className="block mt-1">
                Your current role is <strong className="capitalize">{userRole}</strong>.
              </span>
            )}
          </AlertDescription>
        </Alert>

        <div className="mt-6 space-y-3">
          <Button onClick={handleGoBack} className="w-full" variant="outline">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Go Back
          </Button>

          <Button onClick={handleGoHome} className="w-full">
            <Lock className="h-4 w-4 mr-2" />
            Return to Home
          </Button>
        </div>
      </div>
    </div>
  )
}

// Higher-order component for protecting entire pages
export function withRoleProtection<P extends object>(
  Component: React.ComponentType<P>,
  requiredRoles: UserRole[],
  options?: Omit<ProtectedRouteProps, 'children' | 'requiredRoles'>
) {
  return function ProtectedComponent(props: P) {
    return (
      <ProtectedRoute requiredRoles={requiredRoles} {...options}>
        <Component {...props} />
      </ProtectedRoute>
    )
  }
}

// Specific role protection components
export function AdminOnly({ children, ...props }: Omit<ProtectedRouteProps, 'requiredRoles'>) {
  return (
    <ProtectedRoute requiredRoles={['admin']} {...props}>
      {children}
    </ProtectedRoute>
  )
}

export function ManagerOnly({ children, ...props }: Omit<ProtectedRouteProps, 'requiredRoles'>) {
  return (
    <ProtectedRoute requiredRoles={['admin', 'manager']} {...props}>
      {children}
    </ProtectedRoute>
  )
}

export function StaffOnly({ children, ...props }: Omit<ProtectedRouteProps, 'requiredRoles'>) {
  return (
    <ProtectedRoute requiredRoles={['admin', 'manager', 'staff', 'stylist']} {...props}>
      {children}
    </ProtectedRoute>
  )
}

export function CustomerOnly({ children, ...props }: Omit<ProtectedRouteProps, 'requiredRoles'>) {
  return (
    <ProtectedRoute requiredRoles={['customer', 'client']} {...props}>
      {children}
    </ProtectedRoute>
  )
}

export function AuthenticatedOnly({ children, ...props }: Omit<ProtectedRouteProps, 'requiredRoles'>) {
  return (
    <ProtectedRoute requiredRoles={[]} {...props}>
      {children}
    </ProtectedRoute>
  )
}
