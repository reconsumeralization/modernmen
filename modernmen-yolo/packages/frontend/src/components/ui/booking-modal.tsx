"use client"

import * as React from "react"
import { format } from "date-fns"
import { CalendarIcon, Clock, User, DollarSign } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"
import { cn } from "@/lib/utils"

interface Service {
  id: string
  name: string
  duration: number
  price: number
  description: string
}

interface Barber {
  id: string
  name: string
  avatar?: string
  specialties: string[]
  rating: number
}

interface TimeSlot {
  time: string
  available: boolean
}

interface BookingModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  services: Service[]
  barbers: Barber[]
  onBookAppointment: (data: {
    serviceId: string
    barberId: string
    date: Date
    time: string
    notes?: string
  }) => void
}

export function BookingModal({
  open,
  onOpenChange,
  services,
  barbers,
  onBookAppointment,
}: BookingModalProps) {
  const [step, setStep] = React.useState(1)
  const [selectedService, setSelectedService] = React.useState<string>("")
  const [selectedBarber, setSelectedBarber] = React.useState<string>("")
  const [selectedDate, setSelectedDate] = React.useState<Date>()
  const [selectedTime, setSelectedTime] = React.useState<string>("")
  const [notes, setNotes] = React.useState<string>("")

  // Mock time slots - in real app, this would come from API
  const timeSlots: TimeSlot[] = [
    { time: "09:00", available: true },
    { time: "09:30", available: true },
    { time: "10:00", available: false },
    { time: "10:30", available: true },
    { time: "11:00", available: true },
    { time: "11:30", available: false },
    { time: "12:00", available: true },
    { time: "12:30", available: true },
    { time: "13:00", available: true },
    { time: "13:30", available: true },
    { time: "14:00", available: false },
    { time: "14:30", available: true },
    { time: "15:00", available: true },
    { time: "15:30", available: true },
    { time: "16:00", available: true },
    { time: "16:30", available: false },
    { time: "17:00", available: true },
    { time: "17:30", available: true },
  ]

  const resetForm = () => {
    setStep(1)
    setSelectedService("")
    setSelectedBarber("")
    setSelectedDate(undefined)
    setSelectedTime("")
    setNotes("")
  }

  const handleClose = () => {
    resetForm()
    onOpenChange(false)
  }

  const handleNext = () => {
    if (step < 4) {
      setStep(step + 1)
    } else {
      handleBook()
    }
  }

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1)
    }
  }

  const handleBook = () => {
    if (!selectedService || !selectedBarber || !selectedDate || !selectedTime) {
      return
    }

    onBookAppointment({
      serviceId: selectedService,
      barberId: selectedBarber,
      date: selectedDate,
      time: selectedTime,
      notes,
    })

    handleClose()
  }

  const canProceed = () => {
    switch (step) {
      case 1:
        return !!selectedService
      case 2:
        return !!selectedBarber
      case 3:
        return !!selectedDate && !!selectedTime
      case 4:
        return true
      default:
        return false
    }
  }

  const selectedServiceData = services.find(s => s.id === selectedService)
  const selectedBarberData = barbers.find(b => b.id === selectedBarber)

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Book Appointment</DialogTitle>
          <DialogDescription>
            Step {step} of 4: {
              step === 1 ? "Choose Service" :
              step === 2 ? "Select Barber" :
              step === 3 ? "Pick Date & Time" :
              "Confirm Booking"
            }
          </DialogDescription>
        </DialogHeader>

        <div className="py-4">
          {/* Step 1: Service Selection */}
          {step === 1 && (
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Choose a Service</h3>
              <div className="grid gap-3">
                {services.map((service) => (
                  <Card
                    key={service.id}
                    className={cn(
                      "cursor-pointer transition-colors hover:bg-muted/50",
                      selectedService === service.id && "ring-2 ring-primary"
                    )}
                    onClick={() => setSelectedService(service.id)}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="font-medium">{service.name}</h4>
                          <p className="text-sm text-muted-foreground">{service.description}</p>
                          <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
                            <span className="flex items-center gap-1">
                              <Clock className="h-4 w-4" />
                              {service.duration}min
                            </span>
                            <span className="flex items-center gap-1">
                              <DollarSign className="h-4 w-4" />
                              ${service.price}
                            </span>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {/* Step 2: Barber Selection */}
          {step === 2 && (
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Select Your Barber</h3>
              <div className="grid gap-3">
                {barbers.map((barber) => (
                  <Card
                    key={barber.id}
                    className={cn(
                      "cursor-pointer transition-colors hover:bg-muted/50",
                      selectedBarber === barber.id && "ring-2 ring-primary"
                    )}
                    onClick={() => setSelectedBarber(barber.id)}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-center gap-4">
                        <Avatar className="h-12 w-12">
                          <AvatarImage src={barber.avatar} alt={barber.name} />
                          <AvatarFallback>{barber.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <h4 className="font-medium">{barber.name}</h4>
                          <div className="flex items-center gap-2 mt-1">
                            <div className="flex">
                              {[...Array(5)].map((_, i) => (
                                <span
                                  key={i}
                                  className={cn(
                                    "text-sm",
                                    i < Math.floor(barber.rating) ? "text-yellow-400" : "text-gray-300"
                                  )}
                                >
                                  ★
                                </span>
                              ))}
                            </div>
                            <span className="text-sm text-muted-foreground">
                              {barber.rating}/5
                            </span>
                          </div>
                          <div className="flex flex-wrap gap-1 mt-2">
                            {barber.specialties.map((specialty) => (
                              <Badge key={specialty} variant="secondary" className="text-xs">
                                {specialty}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {/* Step 3: Date & Time Selection */}
          {step === 3 && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-medium mb-4">Select Date</h3>
                <Calendar
                  mode="single"
                  selected={selectedDate}
                  onSelect={setSelectedDate}
                  disabled={(date) => date < new Date()}
                  className="rounded-md border"
                />
              </div>

              {selectedDate && (
                <div>
                  <h3 className="text-lg font-medium mb-4">Available Times</h3>
                  <div className="grid grid-cols-4 gap-2">
                    {timeSlots.map((slot) => (
                      <Button
                        key={slot.time}
                        variant={selectedTime === slot.time ? "default" : "outline"}
                        size="sm"
                        disabled={!slot.available}
                        onClick={() => setSelectedTime(slot.time)}
                        className={cn(
                          !slot.available && "opacity-50 cursor-not-allowed"
                        )}
                      >
                        {slot.time}
                      </Button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Step 4: Confirmation */}
          {step === 4 && selectedServiceData && selectedBarberData && selectedDate && (
            <div className="space-y-6">
              <h3 className="text-lg font-medium">Booking Summary</h3>

              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <Avatar className="h-12 w-12">
                    <AvatarImage src={selectedBarberData.avatar} alt={selectedBarberData.name} />
                    <AvatarFallback>{selectedBarberData.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div>
                    <h4 className="font-medium">{selectedBarberData.name}</h4>
                    <p className="text-sm text-muted-foreground">Your barber</p>
                  </div>
                </div>

                <Separator />

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm font-medium">Service</p>
                    <p className="text-sm text-muted-foreground">{selectedServiceData.name}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium">Duration</p>
                    <p className="text-sm text-muted-foreground">{selectedServiceData.duration} minutes</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium">Date</p>
                    <p className="text-sm text-muted-foreground">
                      {format(selectedDate, "EEEE, MMMM d, yyyy")}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm font-medium">Time</p>
                    <p className="text-sm text-muted-foreground">{selectedTime}</p>
                  </div>
                </div>

                <Separator />

                <div className="flex justify-between items-center">
                  <span className="font-medium">Total Price</span>
                  <span className="text-lg font-bold">${selectedServiceData.price}</span>
                </div>

                <div>
                  <label className="text-sm font-medium">Notes (Optional)</label>
                  <textarea
                    className="w-full mt-1 p-2 border rounded-md text-sm"
                    placeholder="Any special requests or notes..."
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    rows={3}
                  />
                </div>
              </div>
            </div>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={handleClose}>
            Cancel
          </Button>
          {step > 1 && (
            <Button variant="outline" onClick={handleBack}>
              Back
            </Button>
          )}
          <Button onClick={handleNext} disabled={!canProceed()}>
            {step === 4 ? "Book Appointment" : "Next"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
