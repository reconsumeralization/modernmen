"use client"

import * as React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { ChevronRight, Home } from "lucide-react"
import { cn } from "@/lib/utils"
import { breadcrumbConfig } from "@/lib/navigation"

interface BreadcrumbProps {
  className?: string
  showHome?: boolean
  maxItems?: number
}

export function Breadcrumb({ className, showHome = true, maxItems = 5 }: BreadcrumbProps) {
  const pathname = usePathname()

  const generateBreadcrumbs = () => {
    const breadcrumbs: Array<{ label: string; href: string; isActive: boolean }> = []

    // Always include home if requested
    if (showHome) {
      breadcrumbs.push({
        label: "Home",
        href: "/",
        isActive: pathname === "/"
      })
    }

    // Build breadcrumb trail
    const pathSegments = pathname.split("/").filter(Boolean)
    let currentPath = ""

    for (let i = 0; i < pathSegments.length; i++) {
      currentPath += `/${pathSegments[i]}`
      const config = breadcrumbConfig[currentPath]

      if (config) {
        // Skip home if we already added it
        if (currentPath !== "/" || !showHome) {
          breadcrumbs.push({
            label: config.label,
            href: currentPath,
            isActive: currentPath === pathname
          })
        }
      } else {
        // Generate fallback breadcrumb from path segment
        const segment = pathSegments[i]
        const label = segment
          .split("-")
          .map(word => word.charAt(0).toUpperCase() + word.slice(1))
          .join(" ")

        breadcrumbs.push({
          label,
          href: currentPath,
          isActive: currentPath === pathname
        })
      }
    }

    // Limit number of breadcrumbs if specified
    if (maxItems && breadcrumbs.length > maxItems) {
      const startIndex = breadcrumbs.length - maxItems
      breadcrumbs.splice(0, startIndex, {
        label: "...",
        href: breadcrumbs[startIndex - 1]?.href || "/",
        isActive: false
      })
    }

    return breadcrumbs
  }

  const breadcrumbs = generateBreadcrumbs()

  // Don't render if we only have one item (home)
  if (breadcrumbs.length <= 1) {
    return null
  }

  return (
    <nav
      className={cn("flex items-center space-x-1 text-sm text-muted-foreground", className)}
      aria-label="Breadcrumb"
    >
      {breadcrumbs.map((crumb, index) => (
        <React.Fragment key={crumb.href}>
          {index > 0 && (
            <ChevronRight className="h-4 w-4 text-muted-foreground/50" />
          )}
          {crumb.isActive ? (
            <span
              className="font-medium text-foreground"
              aria-current="page"
            >
              {crumb.label}
            </span>
          ) : (
            <Link
              href={crumb.href}
              className="hover:text-foreground transition-colors flex items-center"
            >
              {crumb.label === "Home" && <Home className="h-4 w-4 mr-1" />}
              {crumb.label}
            </Link>
          )}
        </React.Fragment>
      ))}
    </nav>
  )
}

// Breadcrumb with container wrapper
export function BreadcrumbContainer({ children, className }: { children: React.ReactNode, className?: string }) {
  return (
    <div className={cn("py-4 border-b bg-muted/30", className)}>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {children}
      </div>
    </div>
  )
}

// Page header with breadcrumb and title
interface PageHeaderProps {
  title: string
  description?: string
  breadcrumb?: boolean
  actions?: React.ReactNode
  className?: string
}

export function PageHeader({
  title,
  description,
  breadcrumb = true,
  actions,
  className
}: PageHeaderProps) {
  return (
    <div className={cn("space-y-4", className)}>
      {breadcrumb && (
        <BreadcrumbContainer>
          <Breadcrumb />
        </BreadcrumbContainer>
      )}

      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h1 className="text-2xl font-bold tracking-tight">{title}</h1>
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
  )
}
