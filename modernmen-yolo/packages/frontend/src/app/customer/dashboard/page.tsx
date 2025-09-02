"use client"

import * as React from "react"
import Link from "next/link"
import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { StatsCard } from "@/components/ui/stats-card"
import { DataTable } from "@/components/ui/data-table"
import { BookingModal } from "@/components/ui/booking-modal"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Calendar,
  Clock,
  DollarSign,
  Star,
  User,

  Phone,
  MapPin,
  CreditCard,
  Gift
} from "lucide-react"

// Mock data - in real app this would come from API
const mockUpcomingAppointments = [
  {
    id: "1",
    service: "Classic Haircut",
    barber: "Mike Johnson",
    date: "2024-01-15",
    time: "14:00",
    duration: 30,
    price: 35,
    status: "confirmed",
  },
  {
    id: "2",
    service: "Beard Grooming",
    barber: "Sarah Davis",
    date: "2024-01-22",
    time: "10:30",
    duration: 25,
    price: 25,
    status: "confirmed",
  },
]

const mockAppointmentHistory = [
  {
    id: "3",
    service: "Hair & Beard Combo",
    barber: "Mike Johnson",
    date: "2024-01-08",
    time: "15:00",
    duration: 55,
    price: 55,
    status: "completed",
    rating: 5,
  },
  {
    id: "4",
    service: "Classic Haircut",
    barber: "Sarah Davis",
    date: "2024-01-01",
    time: "11:00",
    duration: 30,
    price: 35,
    status: "completed",
    rating: 4,
  },
]

const mockServices = [
  {
    id: "1",
    name: "Classic Haircut",
    duration: 30,
    price: 35,
    description: "Traditional barbering techniques with modern precision",
  },
  {
    id: "2",
    name: "Beard Grooming",
    duration: 25,
    price: 25,
    description: "Expert beard trimming, shaping, and maintenance",
  },
  {
    id: "3",
    name: "Hair & Beard Combo",
    duration: 55,
    price: 55,
    description: "Complete grooming package for the discerning gentleman",
  },
]

const mockBarbers = [
  {
    id: "1",
    name: "Mike Johnson",
    avatar: "/placeholder-user.jpg",
    specialties: ["Haircuts", "Fades", "Traditional"],
    rating: 4.8,
  },
  {
    id: "2",
    name: "Sarah Davis",
    avatar: "/placeholder-user.jpg",
    specialties: ["Beard Grooming", "Shaves", "Modern Styles"],
    rating: 4.9,
  },
  {
    id: "3",
    name: "Alex Rodriguez",
    avatar: "/placeholder-user.jpg",
    specialties: ["Color", "Styling", "Consultation"],
    rating: 4.7,
  },
]

const upcomingColumns = [
  {
    accessorKey: "service",
    header: "Service",
  },
  {
    accessorKey: "barber",
    header: "Barber",
  },
  {
    accessorKey: "date",
    header: "Date",
    cell: ({ row }: any) => {
      const date = new Date(row.getValue("date"))
      return date.toLocaleDateString()
    },
  },
  {
    accessorKey: "time",
    header: "Time",
  },
  {
    accessorKey: "price",
    header: "Price",
    cell: ({ row }: any) => `$${row.getValue("price")}`,
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

const historyColumns = [
  ...upcomingColumns,
  {
    accessorKey: "rating",
    header: "Rating",
    cell: ({ row }: any) => {
      const rating = row.getValue("rating")
      return rating ? (
        <div className="flex items-center gap-1">
          <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
          <span className="text-sm">{rating}</span>
        </div>
      ) : (
        <span className="text-muted-foreground">Not rated</span>
      )
    },
  },
]

export default function CustomerDashboard() {
  const [showBookingModal, setShowBookingModal] = React.useState(false)

  const handleBookAppointment = (data: any) => {
    console.log("Booking appointment:", data)
    // In real app, this would make an API call
  }

  const totalSpent = mockAppointmentHistory.reduce((sum, apt) => sum + apt.price, 0)
  const averageRating = mockAppointmentHistory
    .filter(apt => apt.rating)
    .reduce((sum, apt, _, arr) => sum + (apt.rating || 0) / arr.length, 0)

  return (
    <DashboardLayout user={{ name: "John Smith", email: "john@example.com", role: "customer" }}>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">My Dashboard</h1>
            <p className="text-muted-foreground">
              Manage your appointments and account preferences.
            </p>
          </div>
          <Button onClick={() => setShowBookingModal(true)}>
            <Calendar className="mr-2 h-4 w-4" />
            Book Appointment
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <StatsCard
            title="Upcoming Appointments"
            value={mockUpcomingAppointments.length.toString()}
            description="Scheduled services"
            icon={Calendar}
          />
          <StatsCard
            title="Total Spent"
            value={`$${totalSpent}`}
            description="Lifetime value"
            icon={DollarSign}
          />
          <StatsCard
            title="Average Rating"
            value={averageRating.toFixed(1)}
            description="Service satisfaction"
            icon={Star}
            trend={{
              value: 4.6,
              label: "overall",
              direction: "up",
            }}
          />
          <StatsCard
            title="Loyalty Points"
            value="250"
            description="Available rewards"
            icon={Gift}
          />
        </div>

        {/* Upcoming Appointments */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5" />
              Upcoming Appointments
            </CardTitle>
          </CardHeader>
          <CardContent>
            {mockUpcomingAppointments.length === 0 ? (
              <div className="text-center py-8">
                <Calendar className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium mb-2">No upcoming appointments</h3>
                <p className="text-muted-foreground mb-4">
                  Ready for your next grooming session?
                </p>
                <Button onClick={() => setShowBookingModal(true)}>
                  Book Your Next Appointment
                </Button>
              </div>
            ) : (
              <DataTable
                columns={upcomingColumns}
                data={mockUpcomingAppointments}
                searchKey="service"
                searchPlaceholder="Search appointments..."
              />
            )}
          </CardContent>
        </Card>

        {/* Appointment History */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              Appointment History
            </CardTitle>
          </CardHeader>
          <CardContent>
            <DataTable
              columns={historyColumns}
              data={mockAppointmentHistory}
              searchKey="service"
              searchPlaceholder="Search history..."
            />
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <div className="w-5 h-5 bg-red-600 rounded-full flex items-center justify-center">
                  <span className="text-white text-xs font-bold">M</span>
                </div>
                Services
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">
                Browse our complete range of grooming services
              </p>
              <Link href="/services">
                <Button className="w-full">View All Services</Button>
              </Link>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                Our Team
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">
                Meet our expert barbers and stylists
              </p>
              <Link href="/team">
                <Button className="w-full" variant="outline">Meet the Team</Button>
              </Link>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Phone className="h-5 w-5" />
                Contact Us
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">
                Need help? Get in touch with our team
              </p>
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm">
                  <Phone className="h-4 w-4" />
                  <span>(555) 123-4567</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <MapPin className="h-4 w-4" />
                  <span>123 Main St, City, ST</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Loyalty Program */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Gift className="h-5 w-5" />
              Loyalty Program
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="font-medium">Current Points: 250</p>
                <p className="text-sm text-muted-foreground">
                  Next reward at 300 points
                </p>
              </div>
              <Badge variant="secondary">Gold Member</Badge>
            </div>
            <div className="w-full bg-secondary rounded-full h-2 mb-4">
              <div
                className="bg-primary h-2 rounded-full"
                style={{ width: "83%" }}
              />
            </div>
            <p className="text-sm text-muted-foreground">
              Earn 1 point for every $1 spent. Redeem points for discounts and free services.
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Booking Modal */}
      <BookingModal
        open={showBookingModal}
        onOpenChange={setShowBookingModal}
        services={mockServices}
        barbers={mockBarbers}
        onBookAppointment={handleBookAppointment}
      />
    </DashboardLayout>
  )
}
