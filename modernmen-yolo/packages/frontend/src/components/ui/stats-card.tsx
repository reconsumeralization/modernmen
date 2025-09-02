"use client"

import * as React from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import { TrendingUp, TrendingDown, Minus } from "lucide-react"

interface StatsCardProps {
  title: string
  value: string | number
  description?: string
  icon?: React.ComponentType<{ className?: string }>
  trend?: {
    value: number
    label: string
    direction: "up" | "down" | "neutral"
  }
  variant?: "default" | "success" | "warning" | "error"
  className?: string
}

const variantStyles = {
  default: "border-border",
  success: "border-green-200 bg-green-50/50",
  warning: "border-yellow-200 bg-yellow-50/50",
  error: "border-red-200 bg-red-50/50",
}

const trendIcons = {
  up: TrendingUp,
  down: TrendingDown,
  neutral: Minus,
}

const trendColors = {
  up: "text-green-600",
  down: "text-red-600",
  neutral: "text-gray-600",
}

export function StatsCard({
  title,
  value,
  description,
  icon: Icon,
  trend,
  variant = "default",
  className,
}: StatsCardProps) {
  const TrendIcon = trend ? trendIcons[trend.direction] : null

  return (
    <Card className={cn(variantStyles[variant], className)}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          {title}
        </CardTitle>
        {Icon && <Icon className="h-4 w-4 text-muted-foreground" />}
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        <div className="flex items-center justify-between mt-1">
          {description && (
            <p className="text-xs text-muted-foreground">{description}</p>
          )}
          {trend && (
            <div className="flex items-center gap-1">
              {trend.direction === "up" && <TrendingUp className={cn("h-3 w-3", trendColors[trend.direction])} />}
              {trend.direction === "down" && <TrendingDown className={cn("h-3 w-3", trendColors[trend.direction])} />}
              {trend.direction === "neutral" && <Minus className={cn("h-3 w-3", trendColors[trend.direction])} />}
              <Badge
                variant="secondary"
                className={cn(
                  "text-xs",
                  trend.direction === "up" && "text-green-700 bg-green-100",
                  trend.direction === "down" && "text-red-700 bg-red-100",
                  trend.direction === "neutral" && "text-gray-700 bg-gray-100"
                )}
              >
                {trend.value > 0 && "+"}
                {trend.value}%
              </Badge>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

// Specialized stats cards for common use cases
export function RevenueStatsCard({
  revenue,
  previousRevenue,
  className,
}: {
  revenue: number
  previousRevenue: number
  className?: string
}) {
  const change = ((revenue - previousRevenue) / previousRevenue) * 100
  const direction = change > 0 ? "up" : change < 0 ? "down" : "neutral"

  return (
    <StatsCard
      title="Revenue"
      value={`$${revenue.toLocaleString()}`}
      description="Total revenue this month"
      trend={{
        value: Math.abs(change),
        label: "vs last month",
        direction,
      }}
      variant={direction === "up" ? "success" : direction === "down" ? "error" : "default"}
      className={className}
    />
  )
}

export function AppointmentsStatsCard({
  appointments,
  previousAppointments,
  className,
}: {
  appointments: number
  previousAppointments: number
  className?: string
}) {
  const change = ((appointments - previousAppointments) / previousAppointments) * 100
  const direction = change > 0 ? "up" : change < 0 ? "down" : "neutral"

  return (
    <StatsCard
      title="Appointments"
      value={appointments}
      description="Total appointments this month"
      trend={{
        value: Math.abs(change),
        label: "vs last month",
        direction,
      }}
      variant={direction === "up" ? "success" : direction === "down" ? "error" : "default"}
      className={className}
    />
  )
}

export function CustomerStatsCard({
  customers,
  previousCustomers,
  className,
}: {
  customers: number
  previousCustomers: number
  className?: string
}) {
  const change = ((customers - previousCustomers) / previousCustomers) * 100
  const direction = change > 0 ? "up" : change < 0 ? "down" : "neutral"

  return (
    <StatsCard
      title="Customers"
      value={customers}
      description="Active customers"
      trend={{
        value: Math.abs(change),
        label: "vs last month",
        direction,
      }}
      variant={direction === "up" ? "success" : "default"}
      className={className}
    />
  )
}
