'use client'

import React, { useState, useEffect, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { format, startOfMonth, endOfMonth, startOfWeek, endOfWeek, addDays, isSameMonth, isSameDay, parseISO } from 'date-fns'
import {
  ChevronLeft,
  ChevronRight,
  Plus,
  Clock,
  User,
  Scissors,
  Calendar as CalendarIcon,
  Filter,
  Search,
  MoreHorizontal,
  Eye,
  Edit,
  Trash2,
  CheckCircle,
  XCircle,
  AlertCircle
} from '@/lib/icon-mapping'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Input } from '@/components/ui/input'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { cn } from '@/lib/utils'
import { errorMonitor, ErrorCategory, ErrorSeverity } from '@/lib/error-monitoring'

interface Appointment {
  id: string
  customer: {
    id: string
    firstName: string
    lastName: string
    email: string
    phone?: string
  }
  stylist: {
    id: string
    firstName: string
    lastName: string
  }
  services: Array<{
    id: string
    name: string
    duration: number
    price: number
  }>
  dateTime: string
  duration: number
  status: 'confirmed' | 'pending' | 'in-progress' | 'completed' | 'cancelled' | 'no-show'
  pricing: {
    subtotal: number
    total: number
  }
  notes?: string
}

interface AppointmentCalendarProps {
  className?: string
  onAppointmentSelect?: (appointment: Appointment) => void
  onAppointmentEdit?: (appointment: Appointment) => void
  onAppointmentDelete?: (appointment: Appointment) => void
  onNewAppointment?: (date: Date, time?: string) => void
  selectedDate?: Date
  viewMode?: 'month' | 'week' | 'day'
  stylistFilter?: string
  statusFilter?: string
}

const statusColors = {
  confirmed: 'bg-green-100 text-green-800 border-green-200',
  pending: 'bg-yellow-100 text-yellow-800 border-yellow-200',
  'in-progress': 'bg-blue-100 text-blue-800 border-blue-200',
  completed: 'bg-gray-100 text-gray-800 border-gray-200',
  cancelled: 'bg-red-100 text-red-800 border-red-200',
  'no-show': 'bg-orange-100 text-orange-800 border-orange-200'
}

const statusIcons = {
  confirmed: CheckCircle,
  pending: AlertCircle,
  'in-progress': Clock,
  completed: CheckCircle,
  cancelled: XCircle,
  'no-show': AlertCircle
}

export function AppointmentCalendar({
  className,
  onAppointmentSelect,
  onAppointmentEdit,
  onAppointmentDelete,
  onNewAppointment,
  selectedDate: initialSelectedDate,
  viewMode: initialViewMode = 'month',
  stylistFilter,
  statusFilter
}: AppointmentCalendarProps) {
  const [currentDate, setCurrentDate] = useState(initialSelectedDate || new Date())
  const [selectedDate, setSelectedDate] = useState(initialSelectedDate || new Date())
  const [viewMode, setViewMode] = useState<'month' | 'week' | 'day'>(initialViewMode)
  const [appointments, setAppointments] = useState<Appointment[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [hoveredAppointment, setHoveredAppointment] = useState<string | null>(null)

  // Fetch appointments
  const fetchAppointments = async () => {
    try {
      setLoading(true)
      setError(null)

      const startDate = viewMode === 'month'
        ? startOfMonth(currentDate)
        : viewMode === 'week'
        ? startOfWeek(currentDate)
        : selectedDate

      const endDate = viewMode === 'month'
        ? endOfMonth(currentDate)
        : viewMode === 'week'
        ? endOfWeek(currentDate)
        : selectedDate

      const params = new URLSearchParams({
        startDate: startDate.toISOString(),
        endDate: endDate.toISOString(),
        limit: '500'
      })

      if (stylistFilter) params.set('stylist', stylistFilter)
      if (statusFilter) params.set('status', statusFilter)

      const response = await fetch(`/api/appointments?${params}`)

      if (!response.ok) {
        throw new Error('Failed to fetch appointments')
      }

      const data = await response.json()
      setAppointments(data.appointments || [])

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to load appointments'
      setError(errorMessage)

      await errorMonitor.captureError(
        err instanceof Error ? err : new Error(errorMessage),
        {
          component: 'AppointmentCalendar',
          action: 'fetchAppointments',
          metadata: {
            viewMode,
            currentDate: currentDate.toISOString(),
            stylistFilter,
            statusFilter
          }
        },
        ['crm', 'appointments', 'fetch']
      )
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchAppointments()
  }, [currentDate, viewMode, stylistFilter, statusFilter])

  // Filter appointments by search term
  const filteredAppointments = useMemo(() => {
    if (!searchTerm) return appointments

    return appointments.filter(appointment =>
      appointment.customer.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      appointment.customer.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      appointment.customer.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      appointment.services.some(service =>
        service.name.toLowerCase().includes(searchTerm.toLowerCase())
      )
    )
  }, [appointments, searchTerm])

  // Group appointments by date for calendar view
  const appointmentsByDate = useMemo(() => {
    const grouped: { [key: string]: Appointment[] } = {}

    filteredAppointments.forEach(appointment => {
      const dateKey = format(parseISO(appointment.dateTime), 'yyyy-MM-dd')
      if (!grouped[dateKey]) {
        grouped[dateKey] = []
      }
      grouped[dateKey].push(appointment)
    })

    return grouped
  }, [filteredAppointments])

  // Navigation functions
  const navigatePrevious = () => {
    const newDate = new Date(currentDate)
    if (viewMode === 'month') {
      newDate.setMonth(newDate.getMonth() - 1)
    } else if (viewMode === 'week') {
      newDate.setDate(newDate.getDate() - 7)
    } else {
      newDate.setDate(newDate.getDate() - 1)
    }
    setCurrentDate(newDate)
  }

  const navigateNext = () => {
    const newDate = new Date(currentDate)
    if (viewMode === 'month') {
      newDate.setMonth(newDate.getMonth() + 1)
    } else if (viewMode === 'week') {
      newDate.setDate(newDate.getDate() + 7)
    } else {
      newDate.setDate(newDate.getDate() + 1)
    }
    setCurrentDate(newDate)
  }

  const navigateToday = () => {
    setCurrentDate(new Date())
    setSelectedDate(new Date())
  }

  // Handle appointment actions
  const handleAppointmentClick = (appointment: Appointment) => {
    if (onAppointmentSelect) {
      onAppointmentSelect(appointment)
    }
  }

  const handleEditAppointment = (appointment: Appointment) => {
    if (onAppointmentEdit) {
      onAppointmentEdit(appointment)
    }
  }

  const handleDeleteAppointment = async (appointment: Appointment) => {
    if (!confirm(`Are you sure you want to delete this appointment for ${appointment.customer.firstName} ${appointment.customer.lastName}?`)) {
      return
    }

    try {
      const response = await fetch(`/api/appointments/${appointment.id}`, {
        method: 'DELETE'
      })

      if (!response.ok) {
        throw new Error('Failed to delete appointment')
      }

      await fetchAppointments()
      if (onAppointmentDelete) {
        onAppointmentDelete(appointment)
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to delete appointment'
      setError(errorMessage)

      await errorMonitor.captureError(
        err instanceof Error ? err : new Error(errorMessage),
        {
          component: 'AppointmentCalendar',
          action: 'deleteAppointment',
          metadata: { appointmentId: appointment.id }
        },
        ['crm', 'appointments', 'delete']
      )
    }
  }

  // Render month view
  const renderMonthView = () => {
    const monthStart = startOfMonth(currentDate)
    const monthEnd = endOfMonth(currentDate)
    const startDate = startOfWeek(monthStart)
    const endDate = endOfWeek(monthEnd)

    const dateFormat = 'd'
    const rows = []
    let days = []
    let day = startDate

    while (day <= endDate) {
      for (let i = 0; i < 7; i++) {
        const cloneDay = day
        const dayAppointments = appointmentsByDate[format(day, 'yyyy-MM-dd')] || []
        const isCurrentMonth = isSameMonth(day, currentDate)
        const isToday = isSameDay(day, new Date())
        const isSelected = isSameDay(day, selectedDate)

        days.push(
          <div
            key={day.toString()}
            className={cn(
              "min-h-24 p-2 border border-gray-200 cursor-pointer hover:bg-gray-50 transition-colors",
              !isCurrentMonth && "text-gray-400 bg-gray-50",
              isToday && "bg-blue-50 border-blue-300",
              isSelected && "bg-blue-100 border-blue-400"
            )}
            onClick={() => {
              setSelectedDate(cloneDay)
              if (onNewAppointment) {
                onNewAppointment(cloneDay)
              }
            }}
          >
            <div className="text-sm font-medium mb-1">
              {format(day, dateFormat)}
            </div>
            <div className="space-y-1 max-h-16 overflow-hidden">
              {dayAppointments.slice(0, 3).map((appointment, index) => {
                const StatusIcon = statusIcons[appointment.status]
                return (
                  <motion.div
                    key={appointment.id}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: index * 0.1 }}
                    className={cn(
                      "text-xs p-1 rounded border cursor-pointer truncate",
                      statusColors[appointment.status]
                    )}
                    onClick={(e) => {
                      e.stopPropagation()
                      handleAppointmentClick(appointment)
                    }}
                    onMouseEnter={() => setHoveredAppointment(appointment.id)}
                    onMouseLeave={() => setHoveredAppointment(null)}
                  >
                    <div className="flex items-center gap-1">
                      <StatusIcon className="h-3 w-3" />
                      <span className="truncate">
                        {format(parseISO(appointment.dateTime), 'HH:mm')} - {appointment.customer.firstName}
                      </span>
                    </div>
                  </motion.div>
                )
              })}
              {dayAppointments.length > 3 && (
                <div className="text-xs text-gray-500">
                  +{dayAppointments.length - 3} more
                </div>
              )}
            </div>
          </div>
        )
        day = addDays(day, 1)
      }
      rows.push(
        <div key={day.toString()} className="grid grid-cols-7">
          {days}
        </div>
      )
      days = []
    }

    return (
      <div className="space-y-1">
        <div className="grid grid-cols-7 text-center text-sm font-medium text-gray-600 mb-2">
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
            <div key={day} className="p-2">{day}</div>
          ))}
        </div>
        {rows}
      </div>
    )
  }

  // Render week view
  const renderWeekView = () => {
    const weekStart = startOfWeek(currentDate)
    const weekDays = []

    for (let i = 0; i < 7; i++) {
      const day = addDays(weekStart, i)
      const dayAppointments = appointmentsByDate[format(day, 'yyyy-MM-dd')] || []
      const isToday = isSameDay(day, new Date())

      weekDays.push(
        <div key={day.toString()} className="flex-1 min-h-96 p-2 border border-gray-200">
          <div className={cn(
            "text-sm font-medium mb-2 p-2 rounded",
            isToday && "bg-blue-100 text-blue-800"
          )}>
            {format(day, 'EEE, MMM d')}
          </div>
          <div className="space-y-2 max-h-80 overflow-y-auto">
            {dayAppointments.map((appointment) => {
              const StatusIcon = statusIcons[appointment.status]
              return (
                <motion.div
                  key={appointment.id}
                  layout
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  className={cn(
                    "p-3 rounded-lg border cursor-pointer hover:shadow-md transition-shadow",
                    statusColors[appointment.status]
                  )}
                  onClick={() => handleAppointmentClick(appointment)}
                >
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <Avatar className="h-6 w-6">
                        <AvatarFallback className="text-xs">
                          {appointment.customer.firstName[0]}{appointment.customer.lastName[0]}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="text-sm font-medium">
                          {appointment.customer.firstName} {appointment.customer.lastName}
                        </div>
                        <div className="text-xs text-gray-600">
                          {appointment.stylist.firstName} {appointment.stylist.lastName}
                        </div>
                      </div>
                    </div>
                    <Badge variant="outline" className="text-xs">
                      <StatusIcon className="h-3 w-3 mr-1" />
                      {appointment.status}
                    </Badge>
                  </div>
                  <div className="text-xs text-gray-600 mb-2">
                    {format(parseISO(appointment.dateTime), 'HH:mm')} - {appointment.duration}min
                  </div>
                  <div className="text-xs">
                    {appointment.services.map(service => service.name).join(', ')}
                  </div>
                  <div className="text-xs font-medium mt-1">
                    ${appointment.pricing.total}
                  </div>
                </motion.div>
              )
            })}
          </div>
        </div>
      )
    }

    return (
      <div className="flex space-x-1">
        {weekDays}
      </div>
    )
  }

  // Render day view
  const renderDayView = () => {
    const dayAppointments = appointmentsByDate[format(selectedDate, 'yyyy-MM-dd')] || []

    return (
      <div className="space-y-4">
        <div className="text-center">
          <h3 className="text-lg font-medium">
            {format(selectedDate, 'EEEE, MMMM d, yyyy')}
          </h3>
          <p className="text-gray-600">
            {dayAppointments.length} appointment{dayAppointments.length !== 1 ? 's' : ''}
          </p>
        </div>

        <div className="space-y-3 max-h-96 overflow-y-auto">
          <AnimatePresence>
            {dayAppointments.map((appointment) => {
              const StatusIcon = statusIcons[appointment.status]
              return (
                <motion.div
                  key={appointment.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className={cn(
                    "p-4 rounded-lg border cursor-pointer hover:shadow-md transition-shadow",
                    statusColors[appointment.status]
                  )}
                  onClick={() => handleAppointmentClick(appointment)}
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <Avatar className="h-8 w-8">
                        <AvatarFallback>
                          {appointment.customer.firstName[0]}{appointment.customer.lastName[0]}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="font-medium">
                          {appointment.customer.firstName} {appointment.customer.lastName}
                        </div>
                        <div className="text-sm text-gray-600">
                          {appointment.stylist.firstName} {appointment.stylist.lastName}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline">
                        <StatusIcon className="h-3 w-3 mr-1" />
                        {appointment.status}
                      </Badge>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                          <Button variant="ghost" size="sm">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={(e) => {
                            e.stopPropagation()
                            handleAppointmentClick(appointment)
                          }}>
                            <Eye className="h-4 w-4 mr-2" />
                            View Details
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={(e) => {
                            e.stopPropagation()
                            handleEditAppointment(appointment)
                          }}>
                            <Edit className="h-4 w-4 mr-2" />
                            Edit Appointment
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            onClick={(e) => {
                              e.stopPropagation()
                              handleDeleteAppointment(appointment)
                            }}
                            className="text-red-600"
                          >
                            <Trash2 className="h-4 w-4 mr-2" />
                            Delete Appointment
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <div className="flex items-center gap-1 text-gray-600 mb-1">
                        <Clock className="h-4 w-4" />
                        Time
                      </div>
                      <div className="font-medium">
                        {format(parseISO(appointment.dateTime), 'HH:mm')} ({appointment.duration}min)
                      </div>
                    </div>
                    <div>
                      <div className="flex items-center gap-1 text-gray-600 mb-1">
                        <Scissors className="h-4 w-4" />
                        Services
                      </div>
                      <div className="font-medium">
                        {appointment.services.map(s => s.name).join(', ')}
                      </div>
                    </div>
                  </div>

                  <div className="mt-3 pt-3 border-t border-gray-200">
                    <div className="flex items-center justify-between">
                      <div className="text-sm text-gray-600">
                        Total: ${appointment.pricing.total}
                      </div>
                      {appointment.notes && (
                        <div className="text-xs text-gray-500 max-w-xs truncate">
                          {appointment.notes}
                        </div>
                      )}
                    </div>
                  </div>
                </motion.div>
              )
            })}
          </AnimatePresence>

          {dayAppointments.length === 0 && (
            <div className="text-center py-12">
              <CalendarIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No appointments</h3>
              <p className="text-gray-500 mb-4">
                No appointments scheduled for this day.
              </p>
              <Button onClick={() => onNewAppointment && onNewAppointment(selectedDate)}>
                <Plus className="h-4 w-4 mr-2" />
                Schedule Appointment
              </Button>
            </div>
          )}
        </div>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"></div>
          <p className="text-gray-500">Loading calendar...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="text-red-500 mb-2">Error loading calendar</div>
          <p className="text-gray-500 text-sm mb-4">{error}</p>
          <Button onClick={fetchAppointments}>Try Again</Button>
        </div>
      </div>
    )
  }

  return (
    <div className={cn("space-y-4", className)}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <h2 className="text-2xl font-bold">
            {viewMode === 'month' && format(currentDate, 'MMMM yyyy')}
            {viewMode === 'week' && `Week of ${format(startOfWeek(currentDate), 'MMM d')}`}
            {viewMode === 'day' && format(selectedDate, 'MMMM d, yyyy')}
          </h2>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={navigateToday}>
              Today
            </Button>
            <div className="flex items-center gap-1">
              <Button variant="outline" size="sm" onClick={navigatePrevious}>
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="sm" onClick={navigateNext}>
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Search appointments..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 w-64"
            />
          </div>
          <Select value={viewMode} onValueChange={(value: any) => setViewMode(value)}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="month">Month</SelectItem>
              <SelectItem value="week">Week</SelectItem>
              <SelectItem value="day">Day</SelectItem>
            </SelectContent>
          </Select>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            New Appointment
          </Button>
        </div>
      </div>

      {/* Calendar Content */}
      <Card>
        <CardContent className="p-0">
          {viewMode === 'month' && renderMonthView()}
          {viewMode === 'week' && renderWeekView()}
          {viewMode === 'day' && renderDayView()}
        </CardContent>
      </Card>

      {/* Legend */}
      <div className="flex flex-wrap gap-2">
        {Object.entries(statusColors).map(([status, colorClass]) => {
          const StatusIcon = statusIcons[status as keyof typeof statusIcons]
          return (
            <div key={status} className="flex items-center gap-2">
              <Badge className={colorClass}>
                <StatusIcon className="h-3 w-3 mr-1" />
                {status}
              </Badge>
            </div>
          )
        })}
      </div>
    </div>
  )
}
