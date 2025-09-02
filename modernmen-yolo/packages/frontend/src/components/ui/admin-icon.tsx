"use client"

import * as React from "react"
import Image from "next/image"
import { useTheme } from "next-themes"

interface AdminIconProps {
  className?: string
  size?: number
}

export function AdminIcon({ className = "", size = 24 }: AdminIconProps) {
  const { theme, resolvedTheme } = useTheme()
  const [mounted, setMounted] = React.useState(false)

  React.useEffect(() => {
    setMounted(true)
  }, [])

  // Prevent hydration mismatch by not rendering until mounted
  if (!mounted) {
    return (
      <div
        className={`inline-flex items-center justify-center bg-gray-200 rounded animate-pulse ${className}`}
        style={{ width: size, height: size }}
      >
        <div className="w-4 h-4 bg-gray-300 rounded"></div>
      </div>
    )
  }

  const isDark = resolvedTheme === "dark"
  const iconSrc = isDark
    ? "/modernmen-admin-icon-dark.svg"
    : "/modernmen-admin-icon.svg"

  return (
    <Image
      src={iconSrc}
      alt="ModernMen Admin"
      width={size}
      height={size}
      className={className}
      style={{
        width: size,
        height: size,
        imageRendering: "crisp-edges"
      }}
    />
  )
}

// Hook for programmatic access
export function useAdminIcon() {
  const { theme, resolvedTheme } = useTheme()

  const getAdminIconSrc = () => {
    const isDark = resolvedTheme === "dark"
    return isDark
      ? "/modernmen-admin-icon-dark.svg"
      : "/modernmen-admin-icon.svg"
  }

  return {
    getAdminIconSrc,
    isDark: resolvedTheme === "dark",
    theme: resolvedTheme
  }
}
