"use client"

import * as React from "react"
import { ModernMenLogo } from "@/lib/video-branding"

interface LogoProps {
  className?: string
  size?: "sm" | "md" | "lg" | "xl"
  variant?: "primary" | "dark" | "icon" | "favicon" | "default"
}

export function Logo({ className = "", size = "md", variant = "primary" }: LogoProps) {
  const [mounted, setMounted] = React.useState(false)

  React.useEffect(() => {
    setMounted(true)
  }, [])

  // Prevent hydration mismatch by not rendering until mounted
  if (!mounted) {
    return (
      <div
        className={`inline-flex items-center justify-center bg-gray-200 rounded-full animate-pulse ${getSizeClasses(size)} ${className}`}
      >
        <div className="w-4 h-4 bg-gray-300 rounded"></div>
      </div>
    )
  }

  // Map legacy variants to video branding variants
  const brandingVariant = variant === "favicon" ? "favicon" :
                         variant === "default" ? "primary" : variant

  return (
    <ModernMenLogo
      variant={brandingVariant}
      className={`${getSizeClasses(size)} ${className}`}
    />
  )
}

// Helper function to get size classes
function getSizeClasses(size: LogoProps["size"]) {
  switch (size) {
    case "sm":
      return "h-8 w-auto"
    case "md":
      return "h-12 w-auto"
    case "lg":
      return "h-16 w-auto"
    case "xl":
      return "h-20 w-auto"
    default:
      return "h-12 w-auto"
  }
}

// Export hook for programmatic access using video branding system
export function useLogo() {
  const { getLogo } = React.useMemo(() => {
    const manager = require('@/lib/video-branding').videoBrandingManager
    return manager
  }, [])

  const getLogoSrc = (variant: "primary" | "dark" | "icon" | "favicon" = "primary") => {
    const logo = getLogo(`modern-men-logo-${variant}`)
    return logo?.src || "/modernmen-logo.svg"
  }

  return {
    getLogoSrc,
    getLogo,
    manager: require('@/lib/video-branding').videoBrandingManager
  }
}
