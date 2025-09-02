"use client"

import * as React from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  CheckCircle,
  AlertCircle,
  Info,
  X,
  Loader2,
  ArrowRight,
  ArrowLeft,
  Home,
  Search,
  Filter,
  SortAsc,
  Eye,
  EyeOff,
  RefreshCw,
  Settings,
  HelpCircle,
  MessageSquare
} from "lucide-react"
import { cn } from "@/lib/utils"

// UX Pattern Components

// 1. Status Messages and Notifications
interface StatusMessageProps {
  type: "success" | "error" | "warning" | "info" | "loading"
  title: string
  message?: string
  action?: {
    label: string
    onClick: () => void
  }
  dismissible?: boolean
  onDismiss?: () => void
  className?: string
}

export function StatusMessage({
  type,
  title,
  message,
  action,
  dismissible = false,
  onDismiss,
  className
}: StatusMessageProps) {
  const getIcon = () => {
    switch (type) {
      case "success":
        return <CheckCircle className="w-5 h-5 text-green-500" />
      case "error":
        return <AlertCircle className="w-5 h-5 text-red-500" />
      case "warning":
        return <AlertCircle className="w-5 h-5 text-yellow-500" />
      case "info":
        return <Info className="w-5 h-5 text-blue-500" />
      case "loading":
        return <Loader2 className="w-5 h-5 text-blue-500 animate-spin" />
    }
  }

  const getStyles = () => {
    switch (type) {
      case "success":
        return "bg-green-50 border-green-200 text-green-800"
      case "error":
        return "bg-red-50 border-red-200 text-red-800"
      case "warning":
        return "bg-yellow-50 border-yellow-200 text-yellow-800"
      case "info":
        return "bg-blue-50 border-blue-200 text-blue-800"
      case "loading":
        return "bg-blue-50 border-blue-200 text-blue-800"
    }
  }

  return (
    <div className={cn(
      "flex items-start space-x-3 p-4 border rounded-lg",
      getStyles(),
      className
    )}>
      {getIcon()}
      <div className="flex-1 min-w-0">
        <h4 className="font-medium">{title}</h4>
        {message && <p className="text-sm mt-1">{message}</p>}
        {action && (
          <Button
            variant="outline"
            size="sm"
            className="mt-2"
            onClick={action.onClick}
          >
            {action.label}
          </Button>
        )}
      </div>
      {dismissible && (
        <Button
          variant="ghost"
          size="icon"
          className="h-6 w-6 flex-shrink-0"
          onClick={onDismiss}
        >
          <X className="w-4 h-4" />
        </Button>
      )}
    </div>
  )
}

// 2. Action Confirmation Dialog
interface ConfirmDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  title: string
  description: string
  confirmLabel?: string
  cancelLabel?: string
  variant?: "default" | "destructive"
  onConfirm: () => void
  loading?: boolean
}

export function ConfirmDialog({
  open,
  onOpenChange,
  title,
  description,
  confirmLabel = "Confirm",
  cancelLabel = "Cancel",
  variant = "default",
  onConfirm,
  loading = false
}: ConfirmDialogProps) {
  const handleConfirm = () => {
    onConfirm()
    onOpenChange(false)
  }

  return (
    <div className={cn(
      "fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50",
      !open && "hidden"
    )}>
      <div className="bg-white rounded-lg shadow-lg max-w-md w-full">
        <div className="p-6">
          <h3 className="text-lg font-semibold mb-2">{title}</h3>
          <p className="text-muted-foreground mb-6">{description}</p>
          <div className="flex space-x-3 justify-end">
            <Button
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={loading}
            >
              {cancelLabel}
            </Button>
            <Button
              variant={variant === "destructive" ? "destructive" : "default"}
              onClick={handleConfirm}
              disabled={loading}
            >
              {loading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
              {confirmLabel}
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

// 3. Progressive Disclosure Component
interface ProgressiveDisclosureProps {
  title: string
  children: React.ReactNode
  defaultOpen?: boolean
  className?: string
}

export function ProgressiveDisclosure({
  title,
  children,
  defaultOpen = false,
  className
}: ProgressiveDisclosureProps) {
  const [isOpen, setIsOpen] = React.useState(defaultOpen)

  return (
    <div className={cn("border rounded-lg", className)}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between p-4 text-left hover:bg-muted/50 transition-colors"
      >
        <span className="font-medium">{title}</span>
        <ArrowRight className={cn(
          "w-5 h-5 transition-transform",
          isOpen && "rotate-90"
        )} />
      </button>
      {isOpen && (
        <div className="px-4 pb-4">
          {children}
        </div>
      )}
    </div>
  )
}

// 4. Filter and Search Controls
interface FilterControlsProps {
  searchValue: string
  onSearchChange: (value: string) => void
  filters?: Array<{
    key: string
    label: string
    options: Array<{ value: string; label: string }>
    value: string
    onChange: (value: string) => void
  }>
  sortOptions?: Array<{ value: string; label: string }>
  sortValue?: string
  onSortChange?: (value: string) => void
  viewMode?: "grid" | "list"
  onViewModeChange?: (mode: "grid" | "list") => void
  className?: string
}

export function FilterControls({
  searchValue,
  onSearchChange,
  filters = [],
  sortOptions = [],
  sortValue,
  onSortChange,
  viewMode,
  onViewModeChange,
  className
}: FilterControlsProps) {
  const [showAdvanced, setShowAdvanced] = React.useState(false)

  return (
    <div className={cn("space-y-4", className)}>
      {/* Search Bar */}
      <div className="flex items-center space-x-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
          <input
            type="text"
            placeholder="Search..."
            value={searchValue}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>
        {filters.length > 0 && (
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowAdvanced(!showAdvanced)}
          >
            <Filter className="w-4 h-4 mr-2" />
            Filters
          </Button>
        )}
        {sortOptions.length > 0 && (
          <select
            value={sortValue}
            onChange={(e) => onSortChange?.(e.target.value)}
            className="px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
          >
            {sortOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        )}
        {viewMode && onViewModeChange && (
          <div className="flex border rounded-md">
            <Button
              variant={viewMode === "list" ? "default" : "ghost"}
              size="sm"
              onClick={() => onViewModeChange("list")}
            >
              <SortAsc className="w-4 h-4" />
            </Button>
            <Button
              variant={viewMode === "grid" ? "default" : "ghost"}
              size="sm"
              onClick={() => onViewModeChange("grid")}
            >
              <Eye className="w-4 h-4" />
            </Button>
          </div>
        )}
      </div>

      {/* Advanced Filters */}
      {showAdvanced && filters.length > 0 && (
        <Card>
          <CardContent className="p-4">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {filters.map((filter) => (
                <div key={filter.key}>
                  <label className="text-sm font-medium mb-2 block">
                    {filter.label}
                  </label>
                  <select
                    value={filter.value}
                    onChange={(e) => filter.onChange(e.target.value)}
                    className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                  >
                    <option value="">All</option>
                    {filter.options.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>
              ))}
            </div>
            <div className="flex justify-end mt-4">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowAdvanced(false)}
              >
                Close
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

// 5. Empty States
interface EmptyStateProps {
  icon?: React.ComponentType<{ className?: string }>
  title: string
  description: string
  action?: {
    label: string
    onClick: () => void
  }
  className?: string
}

export function EmptyState({
  icon: Icon,
  title,
  description,
  action,
  className
}: EmptyStateProps) {
  return (
    <div className={cn(
      "flex flex-col items-center justify-center py-12 px-4 text-center",
      className
    )}>
      {Icon && <Icon className="w-12 h-12 text-muted-foreground mb-4" />}
      <h3 className="text-lg font-medium mb-2">{title}</h3>
      <p className="text-muted-foreground mb-6 max-w-md">{description}</p>
      {action && (
        <Button onClick={action.onClick}>
          {action.label}
        </Button>
      )}
    </div>
  )
}

// 6. Loading States
interface LoadingStateProps {
  size?: "sm" | "md" | "lg"
  text?: string
  className?: string
}

export function LoadingState({
  size = "md",
  text = "Loading...",
  className
}: LoadingStateProps) {
  const sizeClasses = {
    sm: "w-4 h-4",
    md: "w-8 h-8",
    lg: "w-12 h-12"
  }

  return (
    <div className={cn(
      "flex flex-col items-center justify-center py-8",
      className
    )}>
      <Loader2 className={cn(
        "animate-spin text-primary mb-4",
        sizeClasses[size]
      )} />
      {text && <p className="text-muted-foreground">{text}</p>}
    </div>
  )
}

// 7. Pagination Component
interface PaginationProps {
  currentPage: number
  totalPages: number
  onPageChange: (page: number) => void
  showPages?: number
  className?: string
}

export function PaginationComponent({
  currentPage,
  totalPages,
  onPageChange,
  showPages = 5,
  className
}: PaginationProps) {
  const getVisiblePages = () => {
    const half = Math.floor(showPages / 2)
    let start = Math.max(1, currentPage - half)
    let end = Math.min(totalPages, start + showPages - 1)

    if (end - start + 1 < showPages) {
      start = Math.max(1, end - showPages + 1)
    }

    return Array.from({ length: end - start + 1 }, (_, i) => start + i)
  }

  if (totalPages <= 1) return null

  const visiblePages = getVisiblePages()

  return (
    <div className={cn("flex items-center justify-center space-x-2", className)}>
      <Button
        variant="outline"
        size="sm"
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
      >
        <ArrowLeft className="w-4 h-4" />
      </Button>

      {visiblePages[0] > 1 && (
        <>
          <Button
            variant="outline"
            size="sm"
            onClick={() => onPageChange(1)}
          >
            1
          </Button>
          {visiblePages[0] > 2 && <span className="px-2">...</span>}
        </>
      )}

      {visiblePages.map((page) => (
        <Button
          key={page}
          variant={page === currentPage ? "default" : "outline"}
          size="sm"
          onClick={() => onPageChange(page)}
        >
          {page}
        </Button>
      ))}

      {visiblePages[visiblePages.length - 1] < totalPages && (
        <>
          {visiblePages[visiblePages.length - 1] < totalPages - 1 && (
            <span className="px-2">...</span>
          )}
          <Button
            variant="outline"
            size="sm"
            onClick={() => onPageChange(totalPages)}
          >
            {totalPages}
          </Button>
        </>
      )}

      <Button
        variant="outline"
        size="sm"
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
      >
        <ArrowRight className="w-4 h-4" />
      </Button>
    </div>
  )
}

// 8. Data Display Patterns
interface DataCardProps {
  title: string
  value: string | number
  change?: {
    value: number
    type: "increase" | "decrease" | "neutral"
    label?: string
  }
  icon?: React.ComponentType<{ className?: string }>
  trend?: React.ReactNode
  className?: string
}

export function DataCard({
  title,
  value,
  change,
  icon: Icon,
  trend,
  className
}: DataCardProps) {
  const getChangeColor = () => {
    if (!change) return ""
    switch (change.type) {
      case "increase":
        return "text-green-600"
      case "decrease":
        return "text-red-600"
      default:
        return "text-gray-600"
    }
  }

  return (
    <Card className={className}>
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-muted-foreground">{title}</p>
            <p className="text-2xl font-bold">{value}</p>
            {change && (
              <p className={cn("text-sm", getChangeColor())}>
                {change.value > 0 && "+"}
                {change.value}{change.label && ` ${change.label}`}
              </p>
            )}
          </div>
          {Icon && <Icon className="w-8 h-8 text-muted-foreground" />}
        </div>
        {trend && <div className="mt-4">{trend}</div>}
      </CardContent>
    </Card>
  )
}

// 9. Form Field Patterns
interface FormFieldProps {
  label: string
  required?: boolean
  error?: string
  hint?: string
  children: React.ReactNode
  className?: string
}

export function FormField({
  label,
  required = false,
  error,
  hint,
  children,
  className
}: FormFieldProps) {
  return (
    <div className={cn("space-y-2", className)}>
      <label className="text-sm font-medium">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>
      {children}
      {error && (
        <p className="text-sm text-red-600 flex items-center">
          <AlertCircle className="w-4 h-4 mr-1" />
          {error}
        </p>
      )}
      {hint && !error && (
        <p className="text-sm text-muted-foreground">{hint}</p>
      )}
    </div>
  )
}

// 10. Quick Actions Menu
interface QuickActionProps {
  actions: Array<{
    label: string
    icon: React.ComponentType<{ className?: string }>
    onClick: () => void
    variant?: "default" | "destructive" | "outline"
    disabled?: boolean
  }>
  className?: string
}

export function QuickActions({
  actions,
  className
}: QuickActionProps) {
  return (
    <div className={cn("flex flex-wrap gap-2", className)}>
      {actions.map((action, index) => {
        const Icon = action.icon
        return (
          <Button
            key={index}
            variant={action.variant || "outline"}
            size="sm"
            onClick={action.onClick}
            disabled={action.disabled}
          >
            <Icon className="w-4 h-4 mr-2" />
            {action.label}
          </Button>
        )
      })}
    </div>
  )
}
