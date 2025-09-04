'use client'

import React, { useState, useEffect } from 'react'
import { useRealtimeBooking } from '@/hooks/useRealtimeBooking'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Progress } from '@/components/ui/progress'
import { 
  Calendar, 
  Clock, 
  User, 
  CreditCard, 
  CheckCircle, 
  AlertTriangle, 
  Loader2,
  Timer,
  Users,
  Zap
} from 'lucide-react'
import { toast } from 'sonner'
import { cn } from '@/lib/utils'

interface Service {
  id: string
  name: string
  description: string
  duration: number
  price: number
  category: string
}

interface Barber {
  id: string
  name: string
  bio: string
  specialties: string[]
  avatar?: string
  rating?: number
}

const mockServices: Service[] = [
  { 
    id: 'classic-cut', 
    name: 'Classic Haircut', 
    description: 'Traditional scissor cut with styling',
    duration: 30, 
    price: 45,
    category: 'Haircut'
  },
  { 
    id: 'modern-fade', 
    name: 'Modern Fade', 
    description: 'Contemporary fade with texture on top',
    duration: 45, 
    price: 55,
    category: 'Haircut'
  },
  { 
    id: 'beard-trim', 
    name: 'Beard Trim & Shape', 
    description: 'Professional beard trimming and styling',
    duration: 25, 
    price: 30,
    category: 'Grooming'
  },
  { 
    id: 'deluxe-package', 
    name: 'Deluxe Grooming Package', 
    description: 'Haircut, beard trim, and hot towel treatment',
    duration: 75, 
    price: 85,
    category: 'Package'
  }
]

const mockBarbers: Barber[] = [
  { 
    id: 'mike-johnson', 
    name: 'Mike Johnson', 
    bio: 'Master barber with 15 years experience',
    specialties: ['Classic Cuts', 'Traditional Shaves'],
    rating: 4.9
  },
  { 
    id: 'sarah-davis', 
    name: 'Sarah Davis', 
    bio: 'Modern styling expert and fade specialist',
    specialties: ['Modern Fades', 'Beard Grooming'],
    rating: 4.8
  },
  { 
    id: 'alex-rodriguez', 
    name: 'Alex Rodriguez', 
    bio: 'Creative cuts and contemporary styles',
    specialties: ['Creative Cuts', 'Hair Design'],
    rating: 4.7
  }
]

interface BookingFormData {
  serviceId: string
  barberId: string
  date: string
  time: string
  notes: string
}

export function RealtimeBookingForm() {
  const [step, setStep] = useState(1)
  const [formData, setFormData] = useState<BookingFormData>({
    serviceId: '',
    barberId: '',
    date: '',
    time: '',
    notes: ''
  })

  const selectedService = mockServices.find(s => s.id === formData.serviceId)
  const selectedBarber = mockBarbers.find(b => b.id === formData.barberId)

  const {
    availableSlots,
    loading: slotsLoading,
    error: slotsError,
    tentativeBooking,
    createTentativeBooking,
    cancelTentativeBooking,
    confirmBooking,
    refreshSlots
  } = useRealtimeBooking({
    date: formData.date,
    barberId: formData.barberId,
    serviceDuration: selectedService?.duration || 0
  })

  const [submitting, setSubmitting] = useState(false)
  const [conflictWarning, setConflictWarning] = useState<string | null>(null)

  // Format timer display
  const formatTimer = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = seconds % 60
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`
  }

  // Handle form field changes
  const handleFieldChange = (field: keyof BookingFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    
    // Reset dependent fields
    if (field === 'serviceId' || field === 'barberId') {
      setFormData(prev => ({ ...prev, date: '', time: '' }))
      if (tentativeBooking) {
        cancelTentativeBooking()
      }
    }
    if (field === 'date') {
      setFormData(prev => ({ ...prev, time: '' }))
      if (tentativeBooking) {
        cancelTentativeBooking()
      }
    }
  }

  // Handle time slot selection
  const handleTimeSelection = async (time: string) => {
    if (tentativeBooking) {
      await cancelTentativeBooking()
    }

    const success = await createTentativeBooking(time)
    if (success) {
      setFormData(prev => ({ ...prev, time }))
      setConflictWarning(null)
    }
  }

  // Navigation handlers
  const handleNext = () => {
    if (step < 4) setStep(step + 1)
  }

  const handleBack = () => {
    if (step > 1) setStep(step - 1)
  }

  // Form validation
  const canProceed = () => {
    switch (step) {
      case 1: return formData.serviceId !== ''
      case 2: return formData.barberId !== ''
      case 3: return formData.date !== '' && formData.time !== '' && tentativeBooking !== null
      case 4: return true
      default: return false
    }
  }

  // Final booking submission
  const handleSubmit = async () => {
    if (!selectedService || !selectedBarber || !tentativeBooking) return

    setSubmitting(true)
    try {
      // In a real app, you'd get the user ID from auth context
      const mockUserId = 'user-123'

      const appointment = await confirmBooking({
        serviceId: formData.serviceId,
        customerId: mockUserId,
        notes: formData.notes
      })

      if (appointment) {
        toast.success('Appointment booked successfully!')
        setStep(5)
      }
    } catch (error) {
      console.error('Error submitting booking:', error)
      toast.error('Failed to book appointment')
    } finally {
      setSubmitting(false)
    }
  }

  // Check for conflicts when available slots change
  useEffect(() => {
    if (formData.time && availableSlots.length > 0) {
      const selectedSlot = availableSlots.find(slot => slot.time === formData.time)
      if (selectedSlot && !selectedSlot.available && !tentativeBooking) {
        setConflictWarning(`The ${formData.time} slot is no longer available. Please select another time.`)
      } else {
        setConflictWarning(null)
      }
    }
  }, [availableSlots, formData.time, tentativeBooking])

  return (
    <div className="min-h-screen bg-background py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Zap className="w-6 h-6 text-primary" />
            <h1 className="text-3xl lg:text-4xl font-bold">Real-time Booking</h1>
          </div>
          <p className="text-lg text-muted-foreground">
            Live availability updates • Instant slot reservation • No double bookings
          </p>
        </div>

        {/* Progress Indicator */}
        <div className="flex justify-center mb-8">
          <div className="flex items-center space-x-4">
            {[1, 2, 3, 4].map((stepNumber) => (
              <div key={stepNumber} className="flex items-center">
                <div className={cn(
                  "w-10 h-10 rounded-full flex items-center justify-center text-sm font-semibold transition-all",
                  step >= stepNumber 
                    ? 'bg-primary text-white shadow-lg' 
                    : 'bg-muted text-muted-foreground'
                )}>
                  {stepNumber}
                </div>
                {stepNumber < 4 && (
                  <div className={cn(
                    "w-12 h-0.5 mx-2 transition-all",
                    step > stepNumber ? 'bg-primary' : 'bg-muted'
                  )} />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Tentative Booking Alert */}
        {tentativeBooking && (
          <Alert className="mb-6 border-orange-200 bg-orange-50">
            <Timer className="h-4 w-4 text-orange-600" />
            <AlertDescription className="text-orange-800">
              <div className="flex items-center justify-between">
                <span>
                  Time slot reserved: <strong>{tentativeBooking.slotTime}</strong>
                </span>
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4" />
                    <span className="font-mono font-bold text-lg">
                      {formatTimer(tentativeBooking.timer)}
                    </span>
                  </div>
                  <Button 
                    size="sm" 
                    variant="outline"
                    onClick={cancelTentativeBooking}
                    className="text-orange-700 border-orange-300"
                  >
                    Release
                  </Button>
                </div>
              </div>
              <Progress 
                value={((600 - tentativeBooking.timer) / 600) * 100} 
                className="mt-2 h-2"
              />
            </AlertDescription>
          </Alert>
        )}

        {/* Conflict Warning */}
        {conflictWarning && (
          <Alert className="mb-6 border-red-200 bg-red-50">
            <AlertTriangle className="h-4 w-4 text-red-600" />
            <AlertDescription className="text-red-800">
              {conflictWarning}
            </AlertDescription>
          </Alert>
        )}

        {/* Main Form Card */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              {step === 1 && <><Calendar className="w-5 h-5" /> Select Service</>}
              {step === 2 && <><User className="w-5 h-5" /> Choose Barber</>}
              {step === 3 && <><Clock className="w-5 h-5" /> Pick Date & Time</>}
              {step === 4 && <><CreditCard className="w-5 h-5" /> Review & Confirm</>}
              {step === 5 && <><CheckCircle className="w-5 h-5 text-green-500" /> Booking Confirmed</>}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {/* Step 1: Service Selection */}
            {step === 1 && (
              <div className="space-y-4">
                <p className="text-muted-foreground mb-6">
                  Choose the service that best fits your grooming needs.
                </p>
                <RadioGroup 
                  value={formData.serviceId} 
                  onValueChange={(value) => handleFieldChange('serviceId', value)}
                >
                  {mockServices.map((service) => (
                    <div key={service.id} className="flex items-center space-x-3 p-4 border rounded-lg hover:bg-muted/50 transition-colors">
                      <RadioGroupItem value={service.id} id={service.id} />
                      <Label htmlFor={service.id} className="flex-1 cursor-pointer">
                        <div className="flex justify-between items-center">
                          <div>
                            <div className="font-semibold">{service.name}</div>
                            <div className="text-sm text-muted-foreground">
                              {service.description}
                            </div>
                            <div className="text-sm text-muted-foreground">
                              {service.duration} minutes
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="font-bold text-primary text-lg">${service.price}</div>
                            <Badge variant="secondary">{service.category}</Badge>
                          </div>
                        </div>
                      </Label>
                    </div>
                  ))}
                </RadioGroup>
              </div>
            )}

            {/* Step 2: Barber Selection */}
            {step === 2 && (
              <div className="space-y-4">
                <p className="text-muted-foreground mb-6">
                  Select your preferred barber for <strong>{selectedService?.name}</strong>.
                </p>
                <RadioGroup 
                  value={formData.barberId} 
                  onValueChange={(value) => handleFieldChange('barberId', value)}
                >
                  {mockBarbers.map((barber) => (
                    <div key={barber.id} className="flex items-center space-x-3 p-4 border rounded-lg hover:bg-muted/50 transition-colors">
                      <RadioGroupItem value={barber.id} id={barber.id} />
                      <Label htmlFor={barber.id} className="flex-1 cursor-pointer">
                        <div className="flex justify-between items-center">
                          <div>
                            <div className="font-semibold flex items-center gap-2">
                              {barber.name}
                              {barber.rating && (
                                <span className="text-xs text-yellow-600">★ {barber.rating}</span>
                              )}
                            </div>
                            <div className="text-sm text-muted-foreground">
                              {barber.bio}
                            </div>
                            <div className="text-sm text-muted-foreground">
                              Specialties: {barber.specialties.join(', ')}
                            </div>
                          </div>
                          <Badge variant="secondary">Available</Badge>
                        </div>
                      </Label>
                    </div>
                  ))}
                </RadioGroup>
              </div>
            )}

            {/* Step 3: Date & Time Selection */}
            {step === 3 && (
              <div className="space-y-6">
                <p className="text-muted-foreground">
                  Choose your preferred date and time. Availability updates in real-time.
                </p>

                {/* Date Selection */}
                <div>
                  <Label htmlFor="date" className="text-base font-semibold">Select Date</Label>
                  <Input
                    id="date"
                    type="date"
                    value={formData.date}
                    onChange={(e) => handleFieldChange('date', e.target.value)}
                    min={new Date().toISOString().split('T')[0]}
                    className="mt-2"
                  />
                </div>

                {/* Time Selection */}
                {formData.date && formData.barberId && (
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <Label className="text-base font-semibold">Available Times</Label>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Users className="w-4 h-4" />
                        Live updates enabled
                        {slotsLoading && <Loader2 className="w-4 h-4 animate-spin" />}
                      </div>
                    </div>

                    {slotsError ? (
                      <Alert className="border-red-200 bg-red-50">
                        <AlertTriangle className="h-4 w-4 text-red-600" />
                        <AlertDescription className="text-red-800">
                          {slotsError}
                          <Button 
                            size="sm" 
                            variant="outline" 
                            className="mt-2" 
                            onClick={refreshSlots}
                          >
                            Retry
                          </Button>
                        </AlertDescription>
                      </Alert>
                    ) : availableSlots.length > 0 ? (
                      <>
                        <div className="grid grid-cols-3 gap-2">
                          {availableSlots.map((slot) => (
                            <Button
                              key={slot.time}
                              variant={
                                formData.time === slot.time 
                                  ? "default" 
                                  : slot.available 
                                    ? "outline" 
                                    : "secondary"
                              }
                              size="sm"
                              onClick={() => slot.available && handleTimeSelection(slot.time)}
                              disabled={!slot.available}
                              className={cn(
                                "text-sm relative transition-all",
                                !slot.available && "opacity-50 cursor-not-allowed",
                                slot.tentativelyBooked && "border-orange-300 bg-orange-50",
                                formData.time === slot.time && tentativeBooking && "bg-primary shadow-md"
                              )}
                            >
                              {slot.time}
                              {slot.tentativelyBooked && (
                                <span className="absolute -top-1 -right-1 w-2 h-2 bg-orange-500 rounded-full"></span>
                              )}
                              {!slot.available && !slot.tentativelyBooked && (
                                <span className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full"></span>
                              )}
                            </Button>
                          ))}
                        </div>
                        <div className="flex flex-wrap gap-4 mt-3 text-xs text-muted-foreground">
                          <div className="flex items-center gap-2">
                            <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                            Available
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="w-2 h-2 bg-orange-500 rounded-full"></span>
                            Tentatively booked
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="w-2 h-2 bg-red-500 rounded-full"></span>
                            Unavailable
                          </div>
                        </div>
                      </>
                    ) : (
                      <Alert>
                        <AlertTriangle className="h-4 w-4" />
                        <AlertDescription>
                          No available time slots for the selected date. Please choose another date.
                        </AlertDescription>
                      </Alert>
                    )}
                  </div>
                )}
              </div>
            )}

            {/* Step 4: Review & Confirm */}
            {step === 4 && (
              <div className="space-y-6">
                <p className="text-muted-foreground">
                  Review your booking details and add any special notes.
                </p>

                <div>
                  <Label htmlFor="notes">Special Notes (Optional)</Label>
                  <Textarea
                    id="notes"
                    value={formData.notes}
                    onChange={(e) => handleFieldChange('notes', e.target.value)}
                    placeholder="Any special requests or notes for your barber..."
                    rows={3}
                  />
                </div>

                {/* Booking Summary */}
                <div className="bg-muted p-6 rounded-lg">
                  <h3 className="font-semibold mb-4 text-lg">Booking Summary</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground">Service:</span>
                      <span className="font-medium">{selectedService?.name}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground">Barber:</span>
                      <span className="font-medium">{selectedBarber?.name}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground">Date & Time:</span>
                      <span className="font-medium">{formData.date} at {formData.time}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground">Duration:</span>
                      <span className="font-medium">{selectedService?.duration} minutes</span>
                    </div>
                    <div className="flex justify-between items-center pt-3 border-t">
                      <span className="font-semibold">Total:</span>
                      <span className="font-bold text-lg text-primary">${selectedService?.price}</span>
                    </div>
                  </div>
                </div>

                {/* Payment Notice */}
                <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                  <h3 className="font-semibold mb-2 text-blue-900">Payment Information</h3>
                  <p className="text-sm text-blue-700">
                    Payment will be processed securely. You'll be charged ${selectedService?.price} for this appointment.
                  </p>
                </div>
              </div>
            )}

            {/* Step 5: Confirmation */}
            {step === 5 && (
              <div className="text-center py-8">
                <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
                <h2 className="text-2xl font-bold mb-2">Booking Confirmed!</h2>
                <p className="text-muted-foreground mb-6">
                  Your appointment has been successfully scheduled. You will receive a confirmation email shortly.
                </p>
                <div className="bg-muted p-6 rounded-lg mb-6 max-w-md mx-auto">
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>Service:</span>
                      <span className="font-medium">{selectedService?.name}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Barber:</span>
                      <span className="font-medium">{selectedBarber?.name}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Date & Time:</span>
                      <span className="font-medium">{formData.date} at {formData.time}</span>
                    </div>
                    <div className="flex justify-between pt-2 border-t">
                      <span>Total:</span>
                      <span className="font-bold">${selectedService?.price}</span>
                    </div>
                  </div>
                </div>
                <div className="flex gap-4 justify-center">
                  <Button onClick={() => window.location.href = '/dashboard'}>
                    View Dashboard
                  </Button>
                  <Button variant="outline" onClick={() => window.location.href = '/'}>
                    Return Home
                  </Button>
                </div>
              </div>
            )}

            {/* Navigation Buttons */}
            {step < 5 && (
              <div className="flex justify-between mt-8">
                {step > 1 && (
                  <Button variant="outline" onClick={handleBack} disabled={submitting}>
                    Back
                  </Button>
                )}
                <div className="ml-auto">
                  {step < 4 ? (
                    <Button onClick={handleNext} disabled={!canProceed()}>
                      Next
                    </Button>
                  ) : (
                    <Button 
                      onClick={handleSubmit} 
                      disabled={!canProceed() || submitting}
                      className="min-w-[140px]"
                    >
                      {submitting ? (
                        <>
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                          Processing...
                        </>
                      ) : (
                        'Complete Booking'
                      )}
                    </Button>
                  )}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}