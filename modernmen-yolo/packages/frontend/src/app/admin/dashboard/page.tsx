"use client"

import * as React from "react"
import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { StatsCard, RevenueStatsCard, AppointmentsStatsCard, CustomerStatsCard } from "@/components/ui/stats-card"
import { DataTable } from "@/components/ui/data-table"
import { AppointmentCalendar } from "@/components/ui/appointment-calendar"
import { NotificationCenter } from "@/components/ui/notification-center"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Users,
  Calendar,
  DollarSign,
  TrendingUp,
  Clock,
  AlertCircle,
  CheckCircle,
  UserPlus,
  BarChart3,
  PieChart as PieChartIcon,
  Activity,
  Target,
  BookOpen,
  Users as UsersIcon,
} from "lucide-react"
import { AdminIcon } from "@/components/ui/admin-icon"
import { AnalyticsDashboard } from "@/components/dashboard/AnalyticsDashboard"
import { RevenueAnalytics } from "@/components/analytics/RevenueAnalytics"
import { CustomerInsights } from "@/components/analytics/CustomerInsights"
import { TutorialSystem } from "@/components/tutorial/TutorialSystem"
import {
  mockStats,
  mockRecentAppointments,
  mockNotifications,
  mockPopularServices
} from "@/data"

const mockColumns = [
  {
    accessorKey: "customer",
    header: "Customer",
  },
  {
    accessorKey: "service",
    header: "Service",
  },
  {
    accessorKey: "time",
    header: "Time",
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }: any) => {
      const status = row.getValue("status")
      return (
        <Badge
          variant={status === "confirmed" ? "default" : "secondary"}
          className={
            status === "confirmed"
              ? "bg-green-100 text-green-800"
              : "bg-yellow-100 text-yellow-800"
          }
        >
          {status}
        </Badge>
      )
    },
  },
]

export default function AdminDashboard() {
  const [appointments, setAppointments] = React.useState(mockRecentAppointments)
  const [notifications, setNotifications] = React.useState(mockNotifications)

  const handleAppointmentClick = (appointment: any) => {
    console.log("Appointment clicked:", appointment)
  }

  const handleMarkAsRead = (id: string) => {
    setNotifications(prev =>
      prev.map(notification =>
        notification.id === id ? { ...notification, read: true } : notification
      )
    )
  }

  const handleMarkAllAsRead = () => {
    setNotifications(prev =>
      prev.map(notification => ({ ...notification, read: true }))
    )
  }

  return (
    <DashboardLayout user={{ name: "Admin User", email: "admin@modernmen.com" }}>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <AdminIcon size={40} />
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
              <p className="text-muted-foreground">
                Welcome back! Here's what's happening with your business today.
              </p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <NotificationCenter
              notifications={notifications}
              onMarkAsRead={handleMarkAsRead}
              onMarkAllAsRead={handleMarkAllAsRead}
            />
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <RevenueStatsCard
            revenue={mockStats.revenue}
            previousRevenue={mockStats.previousRevenue}
          />
          <AppointmentsStatsCard
            appointments={mockStats.appointments}
            previousAppointments={mockStats.previousAppointments}
          />
          <CustomerStatsCard
            customers={mockStats.customers}
            previousCustomers={mockStats.previousCustomers}
          />
          <StatsCard
            title="Avg. Service Time"
            value="42 min"
            description="Average appointment duration"
            trend={{
              value: 5.2,
              label: "vs last week",
              direction: "up",
            }}
          />
        </div>

        {/* Main Content Tabs */}
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-6">
            <TabsTrigger value="overview" className="flex items-center gap-2">
              <BarChart3 className="h-4 w-4" />
              Overview
            </TabsTrigger>
            <TabsTrigger value="analytics" className="flex items-center gap-2">
              <Activity className="h-4 w-4" />
              Analytics
            </TabsTrigger>
            <TabsTrigger value="revenue" className="flex items-center gap-2">
              <DollarSign className="h-4 w-4" />
              Revenue
            </TabsTrigger>
            <TabsTrigger value="customers" className="flex items-center gap-2">
              <UsersIcon className="h-4 w-4" />
              Customers
            </TabsTrigger>
            <TabsTrigger value="appointments" className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              Appointments
            </TabsTrigger>
            <TabsTrigger value="training" className="flex items-center gap-2">
              <BookOpen className="h-4 w-4" />
              Training
            </TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            <div className="grid gap-6 lg:grid-cols-3">
              {/* Appointments Table */}
              <div className="lg:col-span-2">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Calendar className="h-5 w-5" />
                      Recent Appointments
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <DataTable
                      columns={mockColumns}
                      data={appointments}
                      searchKey="customerName"
                      searchPlaceholder="Search appointments..."
                    />
                  </CardContent>
                </Card>
              </div>

              {/* Calendar Sidebar */}
              <div className="space-y-6">
                <AppointmentCalendar
                  appointments={appointments}
                  onAppointmentClick={handleAppointmentClick}
                />

                {/* Quick Actions */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <UserPlus className="h-5 w-5" />
                      Quick Actions
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <Button className="w-full justify-start" variant="outline">
                      <Calendar className="mr-2 h-4 w-4" />
                      Schedule Appointment
                    </Button>
                    <Button className="w-full justify-start" variant="outline">
                      <Users className="mr-2 h-4 w-4" />
                      Add New Customer
                    </Button>
                    <Button className="w-full justify-start" variant="outline">
                      <DollarSign className="mr-2 h-4 w-4" />
                      Process Payment
                    </Button>
                    <Button className="w-full justify-start" variant="outline">
                      <TrendingUp className="mr-2 h-4 w-4" />
                      View Reports
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          {/* Analytics Tab */}
          <TabsContent value="analytics">
            <AnalyticsDashboard />
          </TabsContent>

          {/* Revenue Tab */}
          <TabsContent value="revenue">
            <RevenueAnalytics />
          </TabsContent>

          {/* Customers Tab */}
          <TabsContent value="customers">
            <CustomerInsights />
          </TabsContent>

          {/* Appointments Tab */}
          <TabsContent value="appointments" className="space-y-6">
            <div className="grid gap-6 lg:grid-cols-3">
              <div className="lg:col-span-2">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Calendar className="h-5 w-5" />
                      All Appointments
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <DataTable
                      columns={mockColumns}
                      data={appointments}
                      searchKey="customerName"
                      searchPlaceholder="Search appointments..."
                    />
                  </CardContent>
                </Card>
              </div>

              <div className="space-y-6">
                <AppointmentCalendar
                  appointments={appointments}
                  onAppointmentClick={handleAppointmentClick}
                />

                <Card>
                  <CardHeader>
                    <CardTitle>Appointment Stats</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Total Today</span>
                      <Badge variant="secondary">12</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Completed</span>
                      <Badge variant="default">8</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Pending</span>
                      <Badge variant="outline">3</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Cancelled</span>
                      <Badge variant="destructive">1</Badge>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          {/* Training Tab */}
          <TabsContent value="training">
            <TutorialSystem userType="staff" userId="admin-123" />
          </TabsContent>
        </Tabs>

        {/* Additional Analytics */}
        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Today's Overview</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Completed Appointments</span>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span className="font-bold">12</span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Pending Appointments</span>
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-yellow-500" />
                    <span className="font-bold">3</span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Cancelled Today</span>
                  <div className="flex items-center gap-2">
                    <AlertCircle className="h-4 w-4 text-red-500" />
                    <span className="font-bold">1</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Popular Services</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {mockPopularServices.map((service) => (
                  <div key={service.name} className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span>{service.name}</span>
                      <span className="font-medium">{service.count}</span>
                    </div>
                    <div className="w-full bg-secondary rounded-full h-2">
                      <div
                        className="bg-primary h-2 rounded-full"
                        style={{ width: `${service.percentage}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  )
}
