'use client'

import React, { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { useToast } from '@/hooks/use-toast'
import {
  Calendar,
  Clock,
  MapPin,
  Phone,
  Mail,
  Edit,
  X,
  CheckCircle,
  AlertTriangle,
  MessageSquare,
  RefreshCw
} from 'lucide-react'

// Mock upcoming appointments
const mockUpcomingAppointments = [
  {
    id: '1',
    service: 'Classic Haircut',
    barber: 'Mike Johnson',
    barberAvatar: '/placeholder-user.jpg',
    date: '2024-01-20',
    time: '14:00',
    duration: 30,
    price: 35,
    status: 'confirmed',
    location: 'Main Salon',
    notes: 'Looking forward to my regular cut'
  },
  {
    id: '2',
    service: 'Beard Grooming',
    barber: 'Sarah Davis',
    barberAvatar: '/placeholder-user.jpg',
    date: '2024-01-25',
    time: '10:30',
    duration: 25,
    price: 25,
    status: 'confirmed',
    location: 'Main Salon',
    notes: ''
  },
  {
    id: '3',
    service: 'Hair & Beard Combo',
    barber: 'Alex Rodriguez',
    barberAvatar: '/placeholder-user.jpg',
    date: '2024-01-28',
    time: '15:00',
    duration: 55,
    price: 55,
    status: 'pending',
    location: 'Main Salon',
    notes: 'Special occasion styling'
  }
]

// Available time slots for rescheduling
const availableTimeSlots = [
  '09:00', '09:30', '10:00', '10:30', '11:00', '11:30',
  '12:00', '13:00', '13:30', '14:00', '14:30', '15:00',
  '15:30', '16:00', '16:30', '17:00', '17:30'
]

const availableDates = [
  '2024-01-21', '2024-01-22', '2024-01-23', '2024-01-24',
  '2024-01-25', '2024-01-26', '2024-01-27', '2024-01-28'
]

export function AppointmentManager() {
  const { toast } = useToast()
  const [selectedAppointment, setSelectedAppointment] = useState<any>(null)
  const [showRescheduleDialog, setShowRescheduleDialog] = useState(false)
  const [showCancelDialog, setShowCancelDialog] = useState(false)
  const [showContactDialog, setShowContactDialog] = useState(false)
  const [rescheduleData, setRescheduleData] = useState({
    date: '',
    time: '',
    reason: ''
  })
  const [cancelReason, setCancelReason] = useState('')
  const [contactMessage, setContactMessage] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleReschedule = async () => {
    if (!selectedAppointment || !rescheduleData.date || !rescheduleData.time) return

    setIsSubmitting(true)
    try {
      // In real app, this would make an API call
      console.log('Rescheduling appointment:', {
        appointmentId: selectedAppointment.id,
        newDate: rescheduleData.date,
        newTime: rescheduleData.time,
        reason: rescheduleData.reason
      })

      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000))

      setShowRescheduleDialog(false)
      setSelectedAppointment(null)
      setRescheduleData({ date: '', time: '', reason: '' })

      // Show success message
      toast({
        title: "Appointment Rescheduled",
        description: "Your appointment has been successfully rescheduled.",
        variant: "success"
      })

    } catch (error) {
      console.error('Reschedule error:', error)
      toast({
        title: "Reschedule Failed",
        description: "Failed to reschedule appointment. Please try again.",
        variant: "destructive"
      })
    }
    setIsSubmitting(false)
  }

  const handleCancel = async () => {
    if (!selectedAppointment || !cancelReason) return

    setIsSubmitting(true)
    try {
      // In real app, this would make an API call
      console.log('Cancelling appointment:', {
        appointmentId: selectedAppointment.id,
        reason: cancelReason
      })

      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000))

      setShowCancelDialog(false)
      setSelectedAppointment(null)
      setCancelReason('')

      // Show success message
      toast({
        title: "Appointment Cancelled",
        description: "Your appointment has been successfully cancelled.",
        variant: "success"
      })

    } catch (error) {
      console.error('Cancel error:', error)
      toast({
        title: "Cancellation Failed",
        description: "Failed to cancel appointment. Please try again.",
        variant: "destructive"
      })
    }
    setIsSubmitting(false)
  }

  const handleContact = async () => {
    if (!selectedAppointment || !contactMessage) return

    setIsSubmitting(true)
    try {
      // In real app, this would make an API call
      // Message queued for delivery

      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000))

      setShowContactDialog(false)
      setSelectedAppointment(null)
      setContactMessage('')

      // Show success message
      toast({
        title: "Message Sent",
        description: "Your message has been sent successfully.",
        variant: "success"
      })

    } catch (error) {
      console.error('Contact error:', error)
      toast({
        title: "Message Failed",
        description: "Failed to send message. Please try again.",
        variant: "destructive"
      })
    }
    setIsSubmitting(false)
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed': return 'bg-green-100 text-green-800'
      case 'pending': return 'bg-yellow-100 text-yellow-800'
      case 'cancelled': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'confirmed': return <CheckCircle className="h-4 w-4" />
      case 'pending': return <Clock className="h-4 w-4" />
      case 'cancelled': return <X className="h-4 w-4" />
      default: return <AlertTriangle className="h-4 w-4" />
    }
  }

  return (
    <div className="space-y-6">
      {/* Upcoming Appointments */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Manage Appointments
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {mockUpcomingAppointments.map((appointment) => (
              <div key={appointment.id} className="border rounded-lg p-4">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-4">
                    <Avatar>
                      <AvatarImage src={appointment.barberAvatar} />
                      <AvatarFallback>
                        {appointment.barber.split(' ').map(n => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <h3 className="font-semibold text-lg">{appointment.service}</h3>
                      <p className="text-muted-foreground">with {appointment.barber}</p>
                      <div className="flex items-center gap-4 mt-2">
                        <div className="flex items-center gap-1 text-sm">
                          <Calendar className="h-4 w-4" />
                          {new Date(appointment.date).toLocaleDateString()}
                        </div>
                        <div className="flex items-center gap-1 text-sm">
                          <Clock className="h-4 w-4" />
                          {appointment.time} ({appointment.duration} min)
                        </div>
                        <div className="flex items-center gap-1 text-sm">
                          <MapPin className="h-4 w-4" />
                          {appointment.location}
                        </div>
                      </div>
                      {appointment.notes && (
                        <p className="text-sm text-muted-foreground mt-2 italic">
                          "{appointment.notes}"
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge className={getStatusColor(appointment.status)}>
                      <span className="flex items-center gap-1">
                        {getStatusIcon(appointment.status)}
                        {appointment.status}
                      </span>
                    </Badge>
                    <div className="text-right">
                      <div className="font-semibold">${appointment.price}</div>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-wrap gap-2">
                  <Dialog open={showRescheduleDialog && selectedAppointment?.id === appointment.id} onOpenChange={setShowRescheduleDialog}>
                    <DialogTrigger asChild>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setSelectedAppointment(appointment)}
                      >
                        <RefreshCw className="h-4 w-4 mr-2" />
                        Reschedule
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Reschedule Appointment</DialogTitle>
                      </DialogHeader>
                      <div className="space-y-4">
                        <div className="text-center">
                          <h3 className="font-semibold">{appointment.service}</h3>
                          <p className="text-sm text-muted-foreground">
                            Currently: {appointment.date} at {appointment.time}
                          </p>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <label className="text-sm font-medium">New Date</label>
                            <Select value={rescheduleData.date} onValueChange={(value) =>
                              setRescheduleData(prev => ({ ...prev, date: value }))
                            }>
                              <SelectTrigger>
                                <SelectValue placeholder="Select date" />
                              </SelectTrigger>
                              <SelectContent>
                                {availableDates.map((date) => (
                                  <SelectItem key={date} value={date}>
                                    {new Date(date).toLocaleDateString()}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>

                          <div className="space-y-2">
                            <label className="text-sm font-medium">New Time</label>
                            <Select value={rescheduleData.time} onValueChange={(value) =>
                              setRescheduleData(prev => ({ ...prev, time: value }))
                            }>
                              <SelectTrigger>
                                <SelectValue placeholder="Select time" />
                              </SelectTrigger>
                              <SelectContent>
                                {availableTimeSlots.map((time) => (
                                  <SelectItem key={time} value={time}>
                                    {time}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                        </div>

                        <div className="space-y-2">
                          <label className="text-sm font-medium">Reason (optional)</label>
                          <Textarea
                            placeholder="Why do you need to reschedule?"
                            value={rescheduleData.reason}
                            onChange={(e) => setRescheduleData(prev => ({ ...prev, reason: e.target.value }))}
                            rows={3}
                          />
                        </div>

                        <div className="flex gap-3">
                          <Button
                            variant="outline"
                            className="flex-1"
                            onClick={() => setShowRescheduleDialog(false)}
                          >
                            Cancel
                          </Button>
                          <Button
                            className="flex-1"
                            onClick={handleReschedule}
                            disabled={isSubmitting || !rescheduleData.date || !rescheduleData.time}
                          >
                            {isSubmitting ? 'Rescheduling...' : 'Confirm Reschedule'}
                          </Button>
                        </div>
                      </div>
                    </DialogContent>
                  </Dialog>

                  <Dialog open={showCancelDialog && selectedAppointment?.id === appointment.id} onOpenChange={setShowCancelDialog}>
                    <DialogTrigger asChild>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => setSelectedAppointment(appointment)}
                      >
                        <X className="h-4 w-4 mr-2" />
                        Cancel
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Cancel Appointment</DialogTitle>
                      </DialogHeader>
                      <div className="space-y-4">
                        <Alert>
                          <AlertTriangle className="h-4 w-4" />
                          <AlertDescription>
                            Are you sure you want to cancel this appointment? This action cannot be undone.
                          </AlertDescription>
                        </Alert>

                        <div className="text-center">
                          <h3 className="font-semibold">{appointment.service}</h3>
                          <p className="text-sm text-muted-foreground">
                            {appointment.date} at {appointment.time} with {appointment.barber}
                          </p>
                        </div>

                        <div className="space-y-2">
                          <label className="text-sm font-medium">Reason for cancellation</label>
                          <Textarea
                            placeholder="Please let us know why you're cancelling..."
                            value={cancelReason}
                            onChange={(e) => setCancelReason(e.target.value)}
                            rows={3}
                          />
                        </div>

                        <div className="flex gap-3">
                          <Button
                            variant="outline"
                            className="flex-1"
                            onClick={() => setShowCancelDialog(false)}
                          >
                            Keep Appointment
                          </Button>
                          <Button
                            variant="destructive"
                            className="flex-1"
                            onClick={handleCancel}
                            disabled={isSubmitting || !cancelReason}
                          >
                            {isSubmitting ? 'Cancelling...' : 'Confirm Cancellation'}
                          </Button>
                        </div>
                      </div>
                    </DialogContent>
                  </Dialog>

                  <Dialog open={showContactDialog && selectedAppointment?.id === appointment.id} onOpenChange={setShowContactDialog}>
                    <DialogTrigger asChild>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setSelectedAppointment(appointment)}
                      >
                        <MessageSquare className="h-4 w-4 mr-2" />
                        Contact
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Contact About Appointment</DialogTitle>
                      </DialogHeader>
                      <div className="space-y-4">
                        <div className="text-center">
                          <h3 className="font-semibold">{appointment.service}</h3>
                          <p className="text-sm text-muted-foreground">
                            {appointment.date} at {appointment.time}
                          </p>
                        </div>

                        <div className="space-y-2">
                          <label className="text-sm font-medium">Your message</label>
                          <Textarea
                            placeholder="How can we help you with this appointment?"
                            value={contactMessage}
                            onChange={(e) => setContactMessage(e.target.value)}
                            rows={4}
                          />
                        </div>

                        <div className="bg-muted p-3 rounded-lg text-sm">
                          <p className="font-medium mb-1">Contact Options:</p>
                          <div className="space-y-1">
                            <div className="flex items-center gap-2">
                              <Phone className="h-3 w-3" />
                              <span>Call us: (555) 123-4567</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Mail className="h-3 w-3" />
                              <span>Email: support@modernmen.com</span>
                            </div>
                          </div>
                        </div>

                        <div className="flex gap-3">
                          <Button
                            variant="outline"
                            className="flex-1"
                            onClick={() => setShowContactDialog(false)}
                          >
                            Cancel
                          </Button>
                          <Button
                            className="flex-1"
                            onClick={handleContact}
                            disabled={isSubmitting || !contactMessage}
                          >
                            {isSubmitting ? 'Sending...' : 'Send Message'}
                          </Button>
                        </div>
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Phone className="h-5 w-5" />
            Quick Actions
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Button variant="outline" className="h-20 flex-col gap-2">
              <Calendar className="h-6 w-6" />
              <span>Book New Appointment</span>
            </Button>
            <Button variant="outline" className="h-20 flex-col gap-2">
              <MessageSquare className="h-6 w-6" />
              <span>Contact Support</span>
            </Button>
            <Button variant="outline" className="h-20 flex-col gap-2">
              <Phone className="h-6 w-6" />
              <span>Call Salon</span>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
