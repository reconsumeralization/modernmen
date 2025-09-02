// =============================================================================
// APPOINTMENT STATUS TRACKER - Real-time appointment status and notifications
// =============================================================================

"use client"

import React, { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  Clock,
  CheckCircle,
  AlertCircle,
  User,
  MapPin,
  Phone,
  MessageSquare,
  Bell,
  Zap,
  Timer,
  Calendar,
  Star,
  Coffee,

  Sparkles
} from "lucide-react"
import { cn } from "@/lib/utils"

// Enhanced appointment status types
interface AppointmentStatus {
  id: string
  appointmentId: string
  status: 'scheduled' | 'confirmed' | 'checked_in' | 'in_progress' | 'completed' | 'cancelled' | 'no_show'
  timestamp: Date
  message: string
  estimatedDuration?: number
  currentStep?: number
  totalSteps?: number
  barberNotes?: string
  customerNotes?: string
}

interface LiveAppointment {
  id: string
  customerName: string
  customerAvatar?: string
  service: string
  barber: string
  barberAvatar?: string
  date: string
  time: string
  duration: number
  status: AppointmentStatus['status']
  currentStatus: AppointmentStatus
  statusHistory: AppointmentStatus[]
  estimatedWaitTime?: number
  estimatedCompletionTime?: string
  specialRequests?: string[]
  notifications: {
    id: string
    type: 'info' | 'warning' | 'success'
    title: string
    message: string
    timestamp: Date
    read: boolean
  }[]
}

interface AppointmentStatusTrackerProps {
  appointment: LiveAppointment
  onStatusUpdate?: (appointmentId: string, status: AppointmentStatus['status']) => void
  onContactBarber?: (appointmentId: string) => void
  onReschedule?: (appointmentId: string) => void
  onCancel?: (appointmentId: string) => void
  className?: string
}

const statusConfig = {
  scheduled: {
    label: 'Scheduled',
    color: 'bg-blue-100 text-blue-800',
    icon: Calendar,
    description: 'Appointment is scheduled'
  },
  confirmed: {
    label: 'Confirmed',
    color: 'bg-green-100 text-green-800',
    icon: CheckCircle,
    description: 'Appointment confirmed'
  },
  checked_in: {
    label: 'Checked In',
    color: 'bg-purple-100 text-purple-800',
    icon: User,
    description: 'You have checked in'
  },
  in_progress: {
    label: 'In Progress',
    color: 'bg-orange-100 text-orange-800',
    icon: () => (
      <div className="w-5 h-5 bg-red-600 rounded-full flex items-center justify-center">
        <span className="text-white text-xs font-bold">M</span>
      </div>
    ),
    description: 'Service in progress'
  },
  completed: {
    label: 'Completed',
    color: 'bg-emerald-100 text-emerald-800',
    icon: Star,
    description: 'Service completed'
  },
  cancelled: {
    label: 'Cancelled',
    color: 'bg-red-100 text-red-800',
    icon: AlertCircle,
    description: 'Appointment cancelled'
  },
  no_show: {
    label: 'No Show',
    color: 'bg-gray-100 text-gray-800',
    icon: Clock,
    description: 'Did not arrive'
  }
}

const statusSteps = [
  { status: 'scheduled', label: 'Appointment Scheduled', duration: 0 },
  { status: 'confirmed', label: 'Confirmation Received', duration: 5 },
  { status: 'checked_in', label: 'Checked In', duration: 10 },
  { status: 'in_progress', label: 'Service Started', duration: 15 },
  { status: 'completed', label: 'Service Completed', duration: 60 }
]

export function AppointmentStatusTracker({
  appointment,
  onStatusUpdate,
  onContactBarber,
  onReschedule,
  onCancel,
  className
}: AppointmentStatusTrackerProps) {
  const [showDetails, setShowDetails] = useState(false)
  const [unreadNotifications, setUnreadNotifications] = useState(0)

  useEffect(() => {
    const unread = appointment.notifications.filter(n => !n.read).length
    setUnreadNotifications(unread)
  }, [appointment.notifications])

  const currentStatusIndex = statusSteps.findIndex(step => step.status === appointment.status)
  const progressPercentage = ((currentStatusIndex + 1) / statusSteps.length) * 100

  const StatusIcon = statusConfig[appointment.status].icon

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className={cn("relative", className)}
      >
        <Card className={cn(
          "transition-all duration-300 hover:shadow-lg",
          appointment.status === 'in_progress' && "ring-2 ring-orange-200",
          appointment.status === 'completed' && "ring-2 ring-emerald-200"
        )}>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Avatar className="h-12 w-12">
                  <AvatarImage src={appointment.barberAvatar} />
                  <AvatarFallback>
                    {appointment.barber.split(' ').map(n => n[0]).join('')}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <CardTitle className="text-lg">{appointment.service}</CardTitle>
                  <p className="text-sm text-muted-foreground">with {appointment.barber}</p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                {/* Notification Bell */}
                {unreadNotifications > 0 && (
                  <Button
                    variant="ghost"
                    size="icon"
                    className="relative"
                    onClick={() => setShowDetails(true)}
                  >
                    <Bell className="h-5 w-5" />
                    <Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs">
                      {unreadNotifications}
                    </Badge>
                  </Button>
                )}

                <Badge className={statusConfig[appointment.status].color}>
                  <StatusIcon className="h-3 w-3 mr-1" />
                  {statusConfig[appointment.status].label}
                </Badge>
              </div>
            </div>
          </CardHeader>

          <CardContent className="space-y-4">
            {/* Progress Bar */}
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Progress</span>
                <span>{Math.round(progressPercentage)}%</span>
              </div>
              <Progress value={progressPercentage} className="h-2" />
            </div>

            {/* Current Status Details */}
            <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
              <div className="flex items-center gap-3">
                <StatusIcon className="h-5 w-5 text-primary" />
                <div>
                  <p className="font-medium">{appointment.currentStatus.message}</p>
                  <p className="text-sm text-muted-foreground">
                    {new Date(appointment.currentStatus.timestamp).toLocaleTimeString()}
                  </p>
                </div>
              </div>

              {appointment.estimatedWaitTime && appointment.status === 'checked_in' && (
                <div className="text-right">
                  <p className="text-sm font-medium">Est. wait</p>
                  <p className="text-sm text-muted-foreground">
                    {appointment.estimatedWaitTime} min
                  </p>
                </div>
              )}

              {appointment.estimatedCompletionTime && appointment.status === 'in_progress' && (
                <div className="text-right">
                  <p className="text-sm font-medium">Est. completion</p>
                  <p className="text-sm text-muted-foreground">
                    {appointment.estimatedCompletionTime}
                  </p>
                </div>
              )}
            </div>

            {/* Action Buttons */}
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowDetails(true)}
                className="flex-1"
              >
                View Details
              </Button>

              {['scheduled', 'confirmed'].includes(appointment.status) && (
                <>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={onContactBarber}
                  >
                    <MessageSquare className="h-4 w-4 mr-1" />
                    Contact
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={onReschedule}
                  >
                    <Calendar className="h-4 w-4 mr-1" />
                    Reschedule
                  </Button>
                </>
              )}

              {appointment.status === 'in_progress' && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={onContactBarber}
                >
                  <Coffee className="h-4 w-4 mr-1" />
                  Request Break
                </Button>
              )}
            </div>

            {/* Special Requests */}
            {appointment.specialRequests && appointment.specialRequests.length > 0 && (
              <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <AlertCircle className="h-4 w-4 text-amber-600" />
                  <span className="text-sm font-medium text-amber-800">Special Requests</span>
                </div>
                <ul className="text-sm text-amber-700 space-y-1">
                  {appointment.specialRequests.map((request, index) => (
                    <li key={index} className="flex items-center gap-2">
                      <span className="w-1 h-1 bg-amber-600 rounded-full" />
                      {request}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>

      {/* Detailed Status Modal */}
      <AppointmentStatusModal
        appointment={appointment}
        isOpen={showDetails}
        onClose={() => setShowDetails(false)}
        onStatusUpdate={onStatusUpdate}
        onContactBarber={onContactBarber}
        onReschedule={onReschedule}
        onCancel={onCancel}
      />
    </>
  )
}

interface AppointmentStatusModalProps {
  appointment: LiveAppointment
  isOpen: boolean
  onClose: () => void
  onStatusUpdate?: (appointmentId: string, status: AppointmentStatus['status']) => void
  onContactBarber?: (appointmentId: string) => void
  onReschedule?: (appointmentId: string) => void
  onCancel?: (appointmentId: string) => void
}

function AppointmentStatusModal({
  appointment,
  isOpen,
  onClose,
  onStatusUpdate,
  onContactBarber,
  onReschedule,
  onCancel
}: AppointmentStatusModalProps) {
  const [activeTab, setActiveTab] = useState<'status' | 'notifications' | 'history'>('status')

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[80vh]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3">
            <Avatar className="h-10 w-10">
              <AvatarImage src={appointment.barberAvatar} />
              <AvatarFallback>
                {appointment.barber.split(' ').map(n => n[0]).join('')}
              </AvatarFallback>
            </Avatar>
            <div>
              <div>{appointment.service}</div>
              <div className="text-sm font-normal text-muted-foreground">
                with {appointment.barber}
              </div>
            </div>
          </DialogTitle>
        </DialogHeader>

        {/* Tab Navigation */}
        <div className="flex gap-2 mb-4">
          {[
            { id: 'status', label: 'Live Status', icon: Zap },
            { id: 'notifications', label: 'Notifications', icon: Bell, count: appointment.notifications.filter(n => !n.read).length },
            { id: 'history', label: 'Status History', icon: Clock }
          ].map(({ id, label, icon: Icon, count }) => (
            <Button
              key={id}
              variant={activeTab === id ? 'default' : 'outline'}
              size="sm"
              onClick={() => setActiveTab(id as any)}
              className="flex items-center gap-2"
            >
              <Icon className="h-4 w-4" />
              {label}
              {count && count > 0 && (
                <Badge variant="destructive" className="h-5 w-5 p-0 text-xs">
                  {count}
                </Badge>
              )}
            </Button>
          ))}
        </div>

        <ScrollArea className="max-h-96">
          {activeTab === 'status' && (
            <div className="space-y-6">
              {/* Current Status */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    {React.createElement(statusConfig[appointment.status].icon, {
                      className: "h-5 w-5"
                    })}
                    Current Status
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-3 mb-4">
                    <Badge className={statusConfig[appointment.status].color}>
                      {statusConfig[appointment.status].label}
                    </Badge>
                    <span className="text-sm text-muted-foreground">
                      {statusConfig[appointment.status].description}
                    </span>
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Progress</span>
                      <span>{Math.round(((statusSteps.findIndex(s => s.status === appointment.status) + 1) / statusSteps.length) * 100)}%</span>
                    </div>
                    <Progress
                      value={(statusSteps.findIndex(s => s.status === appointment.status) + 1) / statusSteps.length * 100}
                      className="h-2"
                    />
                  </div>

                  {/* Status-specific information */}
                  {appointment.status === 'checked_in' && appointment.estimatedWaitTime && (
                    <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                      <div className="flex items-center gap-2 mb-2">
                        <Timer className="h-4 w-4 text-blue-600" />
                        <span className="font-medium text-blue-800">Estimated Wait Time</span>
                      </div>
                      <p className="text-blue-700">
                        Approximately {appointment.estimatedWaitTime} minutes until your service begins.
                      </p>
                    </div>
                  )}

                  {appointment.status === 'in_progress' && appointment.estimatedCompletionTime && (
                    <div className="mt-4 p-3 bg-orange-50 rounded-lg">
                      <div className="flex items-center gap-2 mb-2">
                        <Clock className="h-4 w-4 text-orange-600" />
                        <span className="font-medium text-orange-800">Service in Progress</span>
                      </div>
                      <p className="text-orange-700">
                        Estimated completion: {appointment.estimatedCompletionTime}
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Appointment Details */}
              <Card>
                <CardHeader>
                  <CardTitle>Appointment Details</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Service</span>
                    <span className="font-medium">{appointment.service}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Barber</span>
                    <span className="font-medium">{appointment.barber}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Date & Time</span>
                    <span className="font-medium">
                      {new Date(appointment.date).toLocaleDateString()} at {appointment.time}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Duration</span>
                    <span className="font-medium">{appointment.duration} minutes</span>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {activeTab === 'notifications' && (
            <div className="space-y-4">
              {appointment.notifications.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <Bell className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>No notifications yet</p>
                </div>
              ) : (
                appointment.notifications.map((notification) => (
                  <Card key={notification.id} className={cn(
                    "transition-colors",
                    !notification.read && "bg-blue-50/50 border-blue-200"
                  )}>
                    <CardContent className="p-4">
                      <div className="flex items-start gap-3">
                        <div className={cn(
                          "p-2 rounded-full",
                          notification.type === 'success' && "bg-green-100 text-green-600",
                          notification.type === 'warning' && "bg-yellow-100 text-yellow-600",
                          notification.type === 'info' && "bg-blue-100 text-blue-600"
                        )}>
                          {notification.type === 'success' && <CheckCircle className="h-4 w-4" />}
                          {notification.type === 'warning' && <AlertCircle className="h-4 w-4" />}
                          {notification.type === 'info' && <Bell className="h-4 w-4" />}
                        </div>
                        <div className="flex-1">
                          <h4 className="font-medium mb-1">{notification.title}</h4>
                          <p className="text-sm text-muted-foreground mb-2">
                            {notification.message}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {new Date(notification.timestamp).toLocaleString()}
                          </p>
                        </div>
                        {!notification.read && (
                          <div className="w-2 h-2 bg-blue-500 rounded-full flex-shrink-0 mt-2" />
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          )}

          {activeTab === 'history' && (
            <div className="space-y-4">
              {appointment.statusHistory.map((status, index) => (
                <Card key={status.id}>
                  <CardContent className="p-4">
                    <div className="flex items-start gap-3">
                      <div className="p-2 bg-muted rounded-full">
                        {React.createElement(statusConfig[status.status].icon, {
                          className: "h-4 w-4"
                        })}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-1">
                          <h4 className="font-medium">{statusConfig[status.status].label}</h4>
                          <span className="text-xs text-muted-foreground">
                            {new Date(status.timestamp).toLocaleString()}
                          </span>
                        </div>
                        <p className="text-sm text-muted-foreground mb-2">
                          {status.message}
                        </p>
                        {status.barberNotes && (
                          <div className="p-2 bg-muted/50 rounded text-sm">
                            <strong>Barber:</strong> {status.barberNotes}
                          </div>
                        )}
                        {status.customerNotes && (
                          <div className="p-2 bg-blue-50 rounded text-sm mt-2">
                            <strong>You:</strong> {status.customerNotes}
                          </div>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </ScrollArea>

        {/* Action Buttons */}
        <div className="flex gap-3 mt-6 pt-4 border-t">
          {['scheduled', 'confirmed', 'checked_in'].includes(appointment.status) && (
            <>
              <Button variant="outline" onClick={onContactBarber}>
                <MessageSquare className="mr-2 h-4 w-4" />
                Contact Barber
              </Button>
              <Button variant="outline" onClick={onReschedule}>
                <Calendar className="mr-2 h-4 w-4" />
                Reschedule
              </Button>
            </>
          )}

          {['scheduled', 'confirmed'].includes(appointment.status) && (
            <Button variant="destructive" onClick={onCancel}>
              <AlertCircle className="mr-2 h-4 w-4" />
              Cancel
            </Button>
          )}

          <Button variant="outline" onClick={onClose} className="ml-auto">
            Close
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}

// Export types
export type { LiveAppointment, AppointmentStatus, AppointmentStatusTrackerProps }
