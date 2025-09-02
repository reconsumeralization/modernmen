"use client"

import * as React from "react"
import Image from "next/image"
import { useTheme } from "next-themes"

interface LogoProps {
  className?: string
  size?: "sm" | "md" | "lg" | "xl"
  variant?: "default" | "favicon"
}

export function Logo({ className = "", size = "md", variant = "default" }: LogoProps) {
  const { theme, resolvedTheme } = useTheme()
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

  const isDark = resolvedTheme === "dark"
  const logoSrc = variant === "favicon"
    ? "/favicon.svg"
    : isDark
      ? "/modernmen-logo-dark.svg"
      : "/modernmen-logo.svg"

  return (
    <Image
      src={logoSrc}
      alt="ModernMen Hair Salon"
      width={size === "sm" ? 32 : size === "md" ? 48 : size === "lg" ? 64 : 80}
      height={size === "sm" ? 32 : size === "md" ? 48 : size === "lg" ? 64 : 80}
      className={`object-contain ${getSizeClasses(size)} ${className}`}
      style={{ imageRendering: "crisp-edges" }}
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

// Export hook for programmatic access
export function useLogo() {
  const { theme, resolvedTheme } = useTheme()

  const getLogoSrc = (variant: "default" | "favicon" = "default") => {
    const isDark = resolvedTheme === "dark"
    return variant === "favicon"
      ? "/favicon.svg"
      : isDark
        ? "/modernmen-logo-dark.svg"
        : "/modernmen-logo.svg"
  }

  return {
    getLogoSrc,
    isDark: resolvedTheme === "dark",
    theme: resolvedTheme
  }
}
