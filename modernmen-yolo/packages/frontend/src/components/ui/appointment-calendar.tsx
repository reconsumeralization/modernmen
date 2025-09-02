"use client"

import * as React from "react"
import { Calendar } from "@/components/ui/calendar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { format, isToday, isTomorrow } from "date-fns"
import { Clock, User } from "lucide-react"

interface Appointment {
  id: string
  customerName: string
  service: string
  time: string
  duration: number
  status: "confirmed" | "pending" | "completed" | "cancelled"
  barber: string
}

interface AppointmentCalendarProps {
  appointments: Appointment[]
  selectedDate?: Date
  onDateSelect?: (date: Date) => void
  onAppointmentClick?: (appointment: Appointment) => void
}

const statusColors = {
  confirmed: "bg-green-500",
  pending: "bg-yellow-500",
  completed: "bg-blue-500",
  cancelled: "bg-red-500",
}

const statusLabels = {
  confirmed: "Confirmed",
  pending: "Pending",
  completed: "Completed",
  cancelled: "Cancelled",
}

export function AppointmentCalendar({
  appointments,
  selectedDate,
  onDateSelect,
  onAppointmentClick,
}: AppointmentCalendarProps) {
  const [date, setDate] = React.useState<Date | undefined>(selectedDate || new Date())

  const handleDateSelect = (newDate: Date | undefined) => {
    setDate(newDate)
    if (newDate && onDateSelect) {
      onDateSelect(newDate)
    }
  }

  const getDayAppointments = (targetDate: Date) => {
    return appointments.filter(appointment => {
      const appointmentDate = new Date(appointment.time)
      return format(appointmentDate, "yyyy-MM-dd") === format(targetDate, "yyyy-MM-dd")
    })
  }

  const dayAppointments = date ? getDayAppointments(date) : []

  const formatAppointmentTime = (timeString: string) => {
    const date = new Date(timeString)
    return format(date, "HH:mm")
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Calendar */}
      <Card className="lg:col-span-2">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5" />
            Appointment Calendar
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Calendar
            mode="single"
            selected={date}
            onSelect={handleDateSelect}
            className="rounded-md border"
            modifiers={{
              hasAppointments: appointments.map(apt => new Date(apt.time))
            }}
            modifiersStyles={{
              hasAppointments: {
                backgroundColor: "hsl(var(--primary))",
                color: "hsl(var(--primary-foreground))",
                fontWeight: "bold"
              }
            }}
          />
        </CardContent>
      </Card>

      {/* Daily Appointments */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">
            {date ? (
              <>
                {isToday(date) && "Today"}
                {isTomorrow(date) && "Tomorrow"}
                {!isToday(date) && !isTomorrow(date) && format(date, "EEEE, MMM d")}
              </>
            ) : (
              "Select a date"
            )}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-[400px]">
            {dayAppointments.length === 0 ? (
              <div className="text-center text-muted-foreground py-8">
                No appointments scheduled
              </div>
            ) : (
              <div className="space-y-3">
                {dayAppointments.map((appointment) => (
                  <div
                    key={appointment.id}
                    className="p-3 border rounded-lg hover:bg-muted/50 cursor-pointer transition-colors"
                    onClick={() => onAppointmentClick?.(appointment)}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <User className="h-4 w-4" />
                        <span className="font-medium text-sm">
                          {appointment.customerName}
                        </span>
                      </div>
                      <Badge
                        variant="secondary"
                        className={`${statusColors[appointment.status]} text-white text-xs`}
                      >
                        {statusLabels[appointment.status]}
                      </Badge>
                    </div>

                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-4 h-4 bg-red-600 rounded-full flex items-center justify-center">
                        <span className="text-white text-xs font-bold">M</span>
                      </div>
                      <span className="text-sm text-muted-foreground">
                        {appointment.service}
                      </span>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        <span className="text-xs">
                          {formatAppointmentTime(appointment.time)}
                        </span>
                        <span className="text-xs text-muted-foreground">
                          ({appointment.duration}min)
                        </span>
                      </div>
                      <span className="text-xs text-muted-foreground">
                        {appointment.barber}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </ScrollArea>
        </CardContent>
      </Card>
    </div>
  )
}
