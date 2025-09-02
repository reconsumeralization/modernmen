'use client'

import React, { useState, useEffect, useCallback } from 'react'
import { useAuth } from '@/components/auth/AuthProvider'
import { BookingService, Service, Barber, TimeSlot } from '@/services/bookingService'
import { PaymentService } from '@/services/paymentService'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Checkbox } from '@/components/ui/checkbox'
import { Calendar, Clock, User, CreditCard, CheckCircle, AlertCircle, Loader2 } from 'lucide-react'
import { toast } from 'sonner'

interface BookingFormData {
  serviceId: string
  barberId: string
  date: string
  time: string
  notes: string
}

export function EnhancedBookingForm() {
  const { user, loading: authLoading } = useAuth()
  const [step, setStep] = useState(1)
  const [loading, setLoading] = useState(false)
  const [services, setServices] = useState<Service[]>([])
  const [barbers, setBarbers] = useState<Barber[]>([])
  const [availableTimeSlots, setAvailableTimeSlots] = useState<TimeSlot[]>([])
  const [formData, setFormData] = useState<BookingFormData>({
    serviceId: '',
    barberId: '',
    date: '',
    time: '',
    notes: ''
  })

  // Load services and barbers on component mount
  useEffect(() => {
    if (!authLoading) {
      loadServices()
      loadBarbers()
    }
  }, [authLoading])

  const loadAvailableTimeSlots = useCallback(async () => {
    try {
      const service = services.find(s => s.id === formData.serviceId)
      if (!service) return

      const timeSlots = await BookingService.getAvailableTimeSlots(
        formData.date,
        formData.barberId,
        service.duration
      )
      setAvailableTimeSlots(timeSlots)
    } catch (error) {
      toast.error('Failed to load available time slots')
      console.error('Error loading time slots:', error)
    }
  }, [services, formData.serviceId, formData.date, formData.barberId])

  // Load available time slots when date, barber, or service changes
  useEffect(() => {
    if (formData.date && formData.barberId && formData.serviceId) {
      loadAvailableTimeSlots()
    }
  }, [formData.date, formData.barberId, formData.serviceId, loadAvailableTimeSlots])

  const loadServices = async () => {
    try {
      const servicesData = await BookingService.getServices()
      setServices(servicesData)
    } catch (error) {
      toast.error('Failed to load services')
      console.error('Error loading services:', error)
    }
  }

  const loadBarbers = async () => {
    try {
      const barbersData = await BookingService.getBarbers()
      setBarbers(barbersData)
    } catch (error) {
      toast.error('Failed to load barbers')
      console.error('Error loading barbers:', error)
    }
  }



  const handleInputChange = (field: keyof BookingFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    
    // Reset dependent fields when service or barber changes
    if (field === 'serviceId' || field === 'barberId') {
      setFormData(prev => ({ ...prev, date: '', time: '' }))
    }
    if (field === 'date') {
      setFormData(prev => ({ ...prev, time: '' }))
    }
  }

  const handleNext = () => {
    if (step < 4) setStep(step + 1)
  }

  const handleBack = () => {
    if (step > 1) setStep(step - 1)
  }

  const handleSubmit = async () => {
    if (!user) {
      toast.error('Please sign in to book an appointment')
      return
    }

    setLoading(true)
    try {
      // Create appointment
      const appointment = await BookingService.createAppointment({
        serviceId: formData.serviceId,
        barberId: formData.barberId,
        date: formData.date,
        time: formData.time,
        customerId: user.id,
        notes: formData.notes
      })

      // Create payment intent
      const service = services.find(s => s.id === formData.serviceId)
      if (service) {
        const paymentIntent = await PaymentService.createPaymentIntent(
          appointment.id,
          service.price * 100 // Convert to cents
        )

        // Process payment
        const result = await PaymentService.processPayment(paymentIntent)
        
        if (result.success) {
          await PaymentService.confirmPayment(appointment.id, paymentIntent.id)
          toast.success('Appointment booked successfully!')
          setStep(5)
        } else {
          toast.error(`Payment failed: ${result.error}`)
          // Optionally cancel the appointment if payment fails
          await BookingService.cancelAppointment(appointment.id)
        }
      }
    } catch (error) {
      toast.error('Failed to book appointment')
      console.error('Error booking appointment:', error)
    } finally {
      setLoading(false)
    }
  }

  const canProceed = () => {
    switch (step) {
      case 1: return formData.serviceId !== ''
      case 2: return formData.barberId !== ''
      case 3: return formData.date !== '' && formData.time !== ''
      case 4: return true // Notes are optional
      default: return false
    }
  }

  const selectedService = services.find(s => s.id === formData.serviceId)
  const selectedBarber = barbers.find(b => b.id === formData.barberId)

  if (authLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    )
  }

  if (!user) {
    return (
      <div className="text-center py-8">
        <AlertCircle className="w-16 h-16 text-yellow-500 mx-auto mb-4" />
        <h2 className="text-2xl font-bold mb-2">Sign In Required</h2>
        <p className="text-muted-foreground mb-6">
          Please sign in to book an appointment
        </p>
        <Button onClick={() => window.location.href = '/signin'}>
          Sign In
        </Button>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl lg:text-4xl font-bold mb-4">Book Your Appointment</h1>
          <p className="text-lg text-muted-foreground">
            Welcome back, {user.user_metadata?.name || user.email}
          </p>
        </div>

        {/* Progress Indicator */}
        <div className="flex justify-center mb-8">
          <div className="flex items-center space-x-4">
            {[1, 2, 3, 4].map((stepNumber) => (
              <div key={stepNumber} className="flex items-center">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-semibold ${
                  step >= stepNumber ? 'bg-primary text-white' : 'bg-muted text-muted-foreground'
                }`}>
                  {stepNumber}
                </div>
                {stepNumber < 4 && (
                  <div className={`w-12 h-0.5 mx-2 ${
                    step > stepNumber ? 'bg-primary' : 'bg-muted'
                  }`} />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Step Content */}
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
                <RadioGroup value={formData.serviceId} onValueChange={(value) => handleInputChange('serviceId', value)}>
                  {services.map((service) => (
                    <div key={service.id} className="flex items-center space-x-3 p-4 border rounded-lg hover:bg-muted/50">
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
                            <div className="font-bold text-primary">${service.price}</div>
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
                  Select your preferred barber for {selectedService?.name}.
                </p>
                <RadioGroup value={formData.barberId} onValueChange={(value) => handleInputChange('barberId', value)}>
                  {barbers.map((barber) => (
                    <div key={barber.id} className="flex items-center space-x-3 p-4 border rounded-lg hover:bg-muted/50">
                      <RadioGroupItem value={barber.id} id={barber.id} />
                      <Label htmlFor={barber.id} className="flex-1 cursor-pointer">
                        <div className="flex justify-between items-center">
                          <div>
                            <div className="font-semibold">{barber.name}</div>
                            <div className="text-sm text-muted-foreground">
                              {barber.bio}
                            </div>
                            <div className="text-sm text-muted-foreground">
                              Specialties: {barber.specialties?.join(', ')}
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
                  Choose your preferred date and time for your appointment.
                </p>

                {/* Date Selection */}
                <div>
                  <Label htmlFor="date" className="text-base font-semibold">Select Date</Label>
                  <Input
                    id="date"
                    type="date"
                    value={formData.date}
                    onChange={(e) => handleInputChange('date', e.target.value)}
                    min={new Date().toISOString().split('T')[0]}
                    className="mt-2"
                  />
                </div>

                {/* Time Selection */}
                {formData.date && availableTimeSlots.length > 0 && (
                  <div>
                    <Label className="text-base font-semibold">Select Time</Label>
                    <div className="grid grid-cols-3 gap-2 mt-2">
                      {availableTimeSlots.map((slot) => (
                        <Button
                          key={slot.time}
                          variant={formData.time === slot.time ? "default" : "outline"}
                          size="sm"
                          onClick={() => handleInputChange('time', slot.time)}
                          className="text-sm"
                          disabled={!slot.available}
                        >
                          {slot.time}
                        </Button>
                      ))}
                    </div>
                    {availableTimeSlots.every(slot => !slot.available) && (
                      <p className="text-sm text-red-500 mt-2">
                        No available time slots for this date. Please select another date.
                      </p>
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
                    onChange={(e) => handleInputChange('notes', e.target.value)}
                    placeholder="Any special requests or notes for your barber..."
                    rows={3}
                  />
                </div>

                {/* Booking Summary */}
                <div className="bg-muted p-4 rounded-lg">
                  <h3 className="font-semibold mb-3">Booking Summary</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>Service:</span>
                      <span>{selectedService?.name}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Barber:</span>
                      <span>{selectedBarber?.name}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Date & Time:</span>
                      <span>{formData.date} at {formData.time}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Duration:</span>
                      <span>{selectedService?.duration} minutes</span>
                    </div>
                    <div className="flex justify-between font-semibold border-t pt-2">
                      <span>Total:</span>
                      <span>${selectedService?.price}</span>
                    </div>
                  </div>
                </div>

                {/* Payment Information */}
                <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                  <h3 className="font-semibold mb-2 text-blue-900">Payment</h3>
                  <p className="text-sm text-blue-700">
                    Payment will be processed securely through Stripe. You'll be charged ${selectedService?.price} for this appointment.
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
                  Your appointment has been successfully scheduled and payment processed. You will receive a confirmation email shortly.
                </p>
                <div className="bg-muted p-4 rounded-lg mb-6">
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>Service:</span>
                      <span>{selectedService?.name}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Barber:</span>
                      <span>{selectedBarber?.name}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Date & Time:</span>
                      <span>{formData.date} at {formData.time}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Total Paid:</span>
                      <span>${selectedService?.price}</span>
                    </div>
                  </div>
                </div>
                <div className="flex gap-4 justify-center">
                  <Button onClick={() => window.location.href = '/dashboard'}>
                    View Dashboard
                  </Button>
                  <Button variant="outline" onClick={() => window.location.href = '/'}>
                    Return to Home
                  </Button>
                </div>
              </div>
            )}

            {/* Navigation Buttons */}
            {step < 5 && (
              <div className="flex justify-between mt-8">
                {step > 1 && (
                  <Button variant="outline" onClick={handleBack}>
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
                      disabled={!canProceed() || loading}
                      className="min-w-[120px]"
                    >
                      {loading ? (
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
