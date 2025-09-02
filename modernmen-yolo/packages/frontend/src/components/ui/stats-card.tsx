import * as React from "react"
import { Card, CardContent, CardHeader, CardTitle } from "./card"
import { Badge } from "./badge"
import { TrendingUp, TrendingDown } from "lucide-react"
import { cn } from "../../lib/utils"

interface Trend {
  value: number
  label: string
  direction: "up" | "down" | "neutral"
}

interface StatsCardProps {
  title: string
  value: string | number
  description?: string
  trend?: Trend
  icon?: React.ReactNode
  className?: string
}

export function StatsCard({
  title,
  value,
  description,
  trend,
  icon,
  className,
}: StatsCardProps) {
  const formatValue = (val: string | number) => {
    if (typeof val === "number") {
      if (val >= 1000000) {
        return `$${(val / 1000000).toFixed(1)}M`
      } else if (val >= 1000) {
        return `$${(val / 1000).toFixed(1)}K`
      }
      return val.toString()
    }
    return val
  }

  return (
    <Card className={cn("", className)}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        {icon && <div className="h-4 w-4 text-muted-foreground">{icon}</div>}
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{formatValue(value)}</div>
        <div className="flex items-center space-x-2 text-xs text-muted-foreground">
          {description && <span>{description}</span>}
          {trend && (
            <div className="flex items-center space-x-1">
              {trend.direction === "up" ? (
                <TrendingUp className="h-3 w-3 text-green-500" />
              ) : trend.direction === "down" ? (
                <TrendingDown className="h-3 w-3 text-red-500" />
              ) : null}
              <span
                className={cn(
                  trend.direction === "up" && "text-green-500",
                  trend.direction === "down" && "text-red-500"
                )}
              >
                {trend.value > 0 ? "+" : ""}
                {trend.value}%
              </span>
              <span>{trend.label}</span>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

export function RevenueStatsCard({
  revenue,
  previousRevenue,
}: {
  revenue: number
  previousRevenue: number
}) {
  const change = ((revenue - previousRevenue) / previousRevenue) * 100
  const trend: Trend = {
    value: Math.abs(change),
    label: "vs last month",
    direction: change > 0 ? "up" : change < 0 ? "down" : "neutral",
  }

  return (
    <StatsCard
      title="Total Revenue"
      value={revenue}
      description="Monthly revenue"
      trend={trend}
      icon={<span className="text-green-500">$</span>}
    />
  )
}

export function AppointmentsStatsCard({
  appointments,
  previousAppointments,
}: {
  appointments: number
  previousAppointments: number
}) {
  const change = ((appointments - previousAppointments) / previousAppointments) * 100
  const trend: Trend = {
    value: Math.abs(change),
    label: "vs last month",
    direction: change > 0 ? "up" : change < 0 ? "down" : "neutral",
  }

  return (
    <StatsCard
      title="Total Appointments"
      value={appointments}
      description="This month"
      trend={trend}
      icon={<span className="text-blue-500">📅</span>}
    />
  )
}

export function CustomerStatsCard({
  customers,
  previousCustomers,
}: {
  customers: number
  previousCustomers: number
}) {
  const change = ((customers - previousCustomers) / previousCustomers) * 100
  const trend: Trend = {
    value: Math.abs(change),
    label: "vs last month",
    direction: change > 0 ? "up" : change < 0 ? "down" : "neutral",
  }

  return (
    <StatsCard
      title="New Customers"
      value={customers}
      description="This month"
      trend={trend}
      icon={<span className="text-purple-500">👥</span>}
    />
  )
}