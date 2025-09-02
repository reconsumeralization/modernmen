'use client'

import { useState } from 'react'
import { Calendar, Clock, User, CreditCard, CheckCircle } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Checkbox } from '@/components/ui/checkbox'

const services = [
  { id: 'classic-cut', name: 'Classic Haircut', duration: 30, price: 35 },
  { id: 'modern-fade', name: 'Modern Fade', duration: 45, price: 45 },
  { id: 'beard-trim', name: 'Beard Trim', duration: 25, price: 25 },
  { id: 'hair-beard-combo', name: 'Hair & Beard Combo', duration: 55, price: 55 },
  { id: 'executive-package', name: 'Executive Package', duration: 75, price: 85 },
]

const barbers = [
  { id: 'mike-johnson', name: 'Mike Johnson', specialties: ['Classic Cuts', 'Traditional'] },
  { id: 'sarah-davis', name: 'Sarah Davis', specialties: ['Modern Fades', 'Beard Grooming'] },
  { id: 'alex-rodriguez', name: 'Alex Rodriguez', specialties: ['Creative Cuts', 'Hair Color'] },
  { id: 'jordan-smith', name: 'Jordan Smith', specialties: ['Contemporary Cuts', 'Beard Design'] },
]

const timeSlots = [
  '9:00 AM', '9:30 AM', '10:00 AM', '10:30 AM', '11:00 AM', '11:30 AM',
  '12:00 PM', '12:30 PM', '1:00 PM', '1:30 PM', '2:00 PM', '2:30 PM',
  '3:00 PM', '3:30 PM', '4:00 PM', '4:30 PM', '5:00 PM', '5:30 PM',
  '6:00 PM', '6:30 PM', '7:00 PM'
]

export default function BookPage() {
  const [step, setStep] = useState(1)
  const [selectedService, setSelectedService] = useState('')
  const [selectedBarber, setSelectedBarber] = useState('')
  const [selectedDate, setSelectedDate] = useState('')
  const [selectedTime, setSelectedTime] = useState('')
  const [customerInfo, setCustomerInfo] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    notes: '',
  })
  const [paymentMethod, setPaymentMethod] = useState('')
  const [agreeToTerms, setAgreeToTerms] = useState(false)

  const selectedServiceData = services.find(s => s.id === selectedService)
  const selectedBarberData = barbers.find(b => b.id === selectedBarber)

  const total = selectedServiceData?.price || 0

  const handleNext = () => {
    if (step < 4) setStep(step + 1)
  }

  const handleBack = () => {
    if (step > 1) setStep(step - 1)
  }

  const handleSubmit = () => {
    // Handle booking submission
    console.log('Booking submitted:', {
      service: selectedServiceData,
      barber: selectedBarberData,
      date: selectedDate,
      time: selectedTime,
      customer: customerInfo,
      payment: paymentMethod,
    })
    setStep(5) // Success step
  }

  const canProceed = () => {
    switch (step) {
      case 1: return selectedService !== ''
      case 2: return selectedBarber !== ''
      case 3: return selectedDate !== '' && selectedTime !== ''
      case 4: return customerInfo.firstName && customerInfo.lastName && customerInfo.email && customerInfo.phone && paymentMethod && agreeToTerms
      default: return false
    }
  }

  return (
    <div className="min-h-screen bg-background py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl lg:text-4xl font-bold mb-4">Book Your Appointment</h1>
          <p className="text-lg text-muted-foreground">
            Follow the steps below to schedule your grooming session
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
              {step === 4 && <><CreditCard className="w-5 h-5" /> Customer Information</>}
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
                <RadioGroup value={selectedService} onValueChange={setSelectedService}>
                  {services.map((service) => (
                    <div key={service.id} className="flex items-center space-x-3 p-4 border rounded-lg hover:bg-muted/50">
                      <RadioGroupItem value={service.id} id={service.id} />
                      <Label htmlFor={service.id} className="flex-1 cursor-pointer">
                        <div className="flex justify-between items-center">
                          <div>
                            <div className="font-semibold">{service.name}</div>
                            <div className="text-sm text-muted-foreground">
                              {service.duration} minutes
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="font-bold text-primary">${service.price}</div>
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
                  Select your preferred barber for {selectedServiceData?.name}.
                </p>
                <RadioGroup value={selectedBarber} onValueChange={setSelectedBarber}>
                  {barbers.map((barber) => (
                    <div key={barber.id} className="flex items-center space-x-3 p-4 border rounded-lg hover:bg-muted/50">
                      <RadioGroupItem value={barber.id} id={barber.id} />
                      <Label htmlFor={barber.id} className="flex-1 cursor-pointer">
                        <div className="flex justify-between items-center">
                          <div>
                            <div className="font-semibold">{barber.name}</div>
                            <div className="text-sm text-muted-foreground">
                              Specializes in: {barber.specialties.join(', ')}
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
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                    min={new Date().toISOString().split('T')[0]}
                    className="mt-2"
                  />
                </div>

                {/* Time Selection */}
                {selectedDate && (
                  <div>
                    <Label className="text-base font-semibold">Select Time</Label>
                    <div className="grid grid-cols-3 gap-2 mt-2">
                      {timeSlots.map((time) => (
                        <Button
                          key={time}
                          variant={selectedTime === time ? "default" : "outline"}
                          size="sm"
                          onClick={() => setSelectedTime(time)}
                          className="text-sm"
                        >
                          {time}
                        </Button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Step 4: Customer Information */}
            {step === 4 && (
              <div className="space-y-6">
                <p className="text-muted-foreground">
                  Please provide your contact information to complete the booking.
                </p>

                {/* Personal Information */}
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="firstName">First Name</Label>
                    <Input
                      id="firstName"
                      value={customerInfo.firstName}
                      onChange={(e) => setCustomerInfo({...customerInfo, firstName: e.target.value})}
                      placeholder="Enter your first name"
                    />
                  </div>
                  <div>
                    <Label htmlFor="lastName">Last Name</Label>
                    <Input
                      id="lastName"
                      value={customerInfo.lastName}
                      onChange={(e) => setCustomerInfo({...customerInfo, lastName: e.target.value})}
                      placeholder="Enter your last name"
                    />
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={customerInfo.email}
                      onChange={(e) => setCustomerInfo({...customerInfo, email: e.target.value})}
                      placeholder="Enter your email"
                    />
                  </div>
                  <div>
                    <Label htmlFor="phone">Phone</Label>
                    <Input
                      id="phone"
                      type="tel"
                      value={customerInfo.phone}
                      onChange={(e) => setCustomerInfo({...customerInfo, phone: e.target.value})}
                      placeholder="Enter your phone number"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="notes">Special Notes (Optional)</Label>
                  <Textarea
                    id="notes"
                    value={customerInfo.notes}
                    onChange={(e) => setCustomerInfo({...customerInfo, notes: e.target.value})}
                    placeholder="Any special requests or notes for your barber..."
                    rows={3}
                  />
                </div>

                {/* Payment Method */}
                <div>
                  <Label className="text-base font-semibold">Payment Method</Label>
                  <RadioGroup value={paymentMethod} onValueChange={setPaymentMethod} className="mt-2">
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="card" id="card" />
                      <Label htmlFor="card">Credit/Debit Card</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="cash" id="cash" />
                      <Label htmlFor="cash">Pay at Salon</Label>
                    </div>
                  </RadioGroup>
                </div>

                {/* Terms Agreement */}
                <div className="flex items-start space-x-2">
                  <Checkbox
                    id="terms"
                    checked={agreeToTerms}
                    onCheckedChange={(checked) => setAgreeToTerms(checked === true)}
                  />
                  <Label htmlFor="terms" className="text-sm leading-relaxed">
                    I agree to the terms and conditions and understand that cancellations must be made at least 24 hours in advance.
                  </Label>
                </div>

                {/* Booking Summary */}
                <div className="bg-muted p-4 rounded-lg">
                  <h3 className="font-semibold mb-3">Booking Summary</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>Service:</span>
                      <span>{selectedServiceData?.name}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Barber:</span>
                      <span>{selectedBarberData?.name}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Date & Time:</span>
                      <span>{selectedDate} at {selectedTime}</span>
                    </div>
                    <div className="flex justify-between font-semibold border-t pt-2">
                      <span>Total:</span>
                      <span>${total}</span>
                    </div>
                  </div>
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
                <div className="bg-muted p-4 rounded-lg mb-6">
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>Service:</span>
                      <span>{selectedServiceData?.name}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Barber:</span>
                      <span>{selectedBarberData?.name}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Date & Time:</span>
                      <span>{selectedDate} at {selectedTime}</span>
                    </div>
                  </div>
                </div>
                <Button onClick={() => window.location.href = '/'}>
                  Return to Home
                </Button>
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
                    <Button onClick={handleSubmit} disabled={!canProceed()}>
                      Complete Booking
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
