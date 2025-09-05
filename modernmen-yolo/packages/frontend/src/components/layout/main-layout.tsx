"use client"

import * as React from "react"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Header } from "@/components/navigation/header"
import { Footer } from "@/components/navigation/footer"
import { BreadcrumbContainer, Breadcrumb } from "@/components/navigation/breadcrumb"
import { PageTransition } from "@/components/navigation/page-transition"
// Dynamic import to avoid useSearchParams in server context
import dynamic from 'next/dynamic'

const NavigationProvider = dynamic(() => import("@/components/navigation/navigation-provider").then(mod => ({ default: mod.NavigationProvider })), {
  ssr: false,
  loading: () => null
})
import { Toaster } from "@/components/ui/toaster"

interface MainLayoutProps {
  children: React.ReactNode
  showHeader?: boolean
  showFooter?: boolean
  showBreadcrumbs?: boolean
  className?: string
  user?: {
    name: string
    email: string
    avatar?: string
    role: "admin" | "staff" | "customer" | null
  }
  onAuthAction?: (action: "login" | "register" | "logout") => void
}

// Routes that don't need header/footer
const minimalRoutes = [
  "/auth",
  "/admin",
  "/staff",
  "/customer"
]

// Routes that need breadcrumbs
const breadcrumbRoutes = [
  "/services",
  "/team",
  "/gallery",
  "/blog",
  "/about",
  "/contact"
]

export function MainLayout({
  children,
  showHeader = true,
  showFooter = true,
  showBreadcrumbs = true,
  className,
  user,
  onAuthAction
}: MainLayoutProps) {
  const pathname = usePathname()

  // Determine layout type based on route
  const isMinimalLayout = minimalRoutes.some(route => pathname.startsWith(route))
  const shouldShowBreadcrumbs = showBreadcrumbs && breadcrumbRoutes.some(route => pathname.startsWith(route))
  const shouldShowHeader = showHeader && !isMinimalLayout
  const shouldShowFooter = showFooter && !isMinimalLayout

  return (
    <NavigationProvider>
      <div className={cn("min-h-screen bg-background", className)}>
        {/* Header */}
        {shouldShowHeader && (
          <Header
            user={user}
            onAuthAction={onAuthAction}
          />
        )}

        {/* Breadcrumbs */}
        {shouldShowBreadcrumbs && (
          <BreadcrumbContainer>
            <Breadcrumb />
          </BreadcrumbContainer>
        )}

        {/* Main Content */}
        <main className={cn(
          "flex-1",
          shouldShowHeader && "pt-16 lg:pt-20", // Account for fixed header
          !isMinimalLayout && "container mx-auto px-4 sm:px-6 lg:px-8 py-8"
        )}>
          <PageTransition>
            {children}
          </PageTransition>
        </main>

        {/* Footer */}
        {shouldShowFooter && <Footer />}

        {/* Global components */}
        <Toaster />
      </div>
    </NavigationProvider>
  )
}

// Dashboard layout for admin/staff/customer areas
interface DashboardLayoutProps {
  children: React.ReactNode
  title?: string
  description?: string
  actions?: React.ReactNode
  user: {
    name: string
    email: string
    avatar?: string
    role: "admin" | "staff" | "customer"
  }
  onAuthAction?: (action: "login" | "register" | "logout") => void
}

export function DashboardLayout({
  children,
  title,
  description,
  actions,
  user,
  onAuthAction
}: DashboardLayoutProps) {
  return (
    <NavigationProvider>
      <div className="min-h-screen bg-gray-50">
        {/* Dashboard Header */}
        <Header
          user={user}
          onAuthAction={onAuthAction}
        />

        {/* Page Header */}
        {(title || description || actions) && (
          <div className="bg-white border-b">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  {title && (
                    <h1 className="text-2xl font-bold tracking-tight">{title}</h1>
                  )}
                  {description && (
                    <p className="text-muted-foreground">{description}</p>
                  )}
                </div>
                {actions && (
                  <div className="flex items-center space-x-2">
                    {actions}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Dashboard Content */}
        <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <PageTransition>
            {children}
          </PageTransition>
        </main>

        {/* Dashboard Footer */}
        <Footer />

        {/* Global components */}
        <Toaster />
      </div>
    </NavigationProvider>
  )
}

// Auth layout for login/register pages
interface AuthLayoutProps {
  children: React.ReactNode
  title?: string
  description?: string
  showLogo?: boolean
  className?: string
}

export function AuthLayout({
  children,
  title = "Welcome",
  description,
  showLogo = true,
  className
}: AuthLayoutProps) {
  return (
    <div className={cn("min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8", className)}>
      <div className="max-w-md w-full space-y-8">
        {/* Logo */}
        {showLogo && (
          <div className="text-center">
            <div className="w-16 h-16 bg-black rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl font-bold text-white">MM</span>
            </div>
            <h2 className="text-2xl font-bold text-gray-900">Modern Men</h2>
            <p className="text-gray-600">Hair Salon</p>
          </div>
        )}

        {/* Title and Description */}
        {(title || description) && (
          <div className="text-center">
            {title && (
              <h1 className="text-3xl font-bold text-gray-900">{title}</h1>
            )}
            {description && (
              <p className="mt-2 text-gray-600">{description}</p>
            )}
          </div>
        )}

        {/* Auth Form */}
        <div className="bg-white py-8 px-6 shadow-lg rounded-lg">
          {children}
        </div>

        {/* Footer */}
        <div className="text-center text-sm text-gray-600">
          <p>
            © {new Date().getFullYear()} Modern Men Hair Salon.
            <span className="block sm:inline sm:ml-1">
              All rights reserved.
            </span>
          </p>
        </div>
      </div>
    </div>
  )
}

// Landing page layout
interface LandingLayoutProps {
  children: React.ReactNode
  showHeader?: boolean
  showFooter?: boolean
  className?: string
}

export function LandingLayout({
  children,
  showHeader = true,
  showFooter = true,
  className
}: LandingLayoutProps) {
  return (
    <div className={cn("min-h-screen", className)}>
      {/* Header */}
      {showHeader && <Header />}

      {/* Main Content */}
      <main>
        {children}
      </main>

      {/* Footer */}
      {showFooter && <Footer />}

      {/* Global components */}
      <Toaster />
    </div>
  )
}
