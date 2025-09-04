'use client'

import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Calendar,
  Clock,
  User,
  CreditCard,
  CheckCircle,
  Loader2,
  Star,
  MapPin,
  Phone,
  Mail,
  Scissors,
  Award,
  Zap,
  Sparkles,
  Heart,
  Shield,
  AlertCircle
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Checkbox } from '@/components/ui/checkbox'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Progress } from '@/components/ui/progress'
import { useAnalytics, trackBookingFunnel, trackPaymentFunnel, EVENT_ACTIONS, EVENT_CATEGORIES, analyticsService } from '@/lib/analytics'
import { StripeProvider } from '@/components/stripe/StripeProvider'
import { StripePaymentForm } from '@/components/stripe/StripePaymentForm'

interface Service {
  id: string
  name: string
  duration: number
  price: number
  description: string
  category: string
  popular?: boolean
  image?: string
}

interface Barber {
  id: string
  name: string
  avatar?: string
  rating: number
  reviewCount: number
  specialties: string[]
  experience: string
  bio: string
  availability: { [date: string]: string[] }
}

const services: Service[] = [
  {
    id: 'classic-cut',
    name: 'Classic Haircut',
    duration: 30,
    price: 35,
    description: 'Traditional haircut with precision styling',
    category: 'Hair',
    popular: true
  },
  {
    id: 'modern-fade',
    name: 'Modern Fade',
    duration: 45,
    price: 45,
    description: 'Contemporary fade with creative design',
    category: 'Hair',
    popular: true
  },
  {
    id: 'beard-trim',
    name: 'Beard Trim',
    duration: 25,
    price: 25,
    description: 'Professional beard grooming and shaping',
    category: 'Beard'
  },
  {
    id: 'hair-beard-combo',
    name: 'Hair & Beard Combo',
    duration: 55,
    price: 55,
    description: 'Complete grooming package',
    category: 'Combo',
    popular: true
  },
  {
    id: 'executive-package',
    name: 'Executive Package',
    duration: 75,
    price: 85,
    description: 'Premium grooming experience with consultation',
    category: 'Premium'
  }
]

const barbers: Barber[] = [
  {
    id: 'mike-johnson',
    name: 'Mike Johnson',
    rating: 4.9,
    reviewCount: 127,
    specialties: ['Classic Cuts', 'Traditional', 'Executive'],
    experience: '8 years',
    bio: 'Master barber specializing in classic and executive cuts',
    availability: {}
  },
  {
    id: 'sarah-davis',
    name: 'Sarah Davis',
    rating: 4.8,
    reviewCount: 95,
    specialties: ['Modern Fades', 'Beard Grooming', 'Creative'],
    experience: '6 years',
    bio: 'Creative stylist with a passion for modern techniques',
    availability: {}
  },
  {
    id: 'alex-rodriguez',
    name: 'Alex Rodriguez',
    rating: 4.9,
    reviewCount: 156,
    specialties: ['Contemporary Cuts', 'Hair Color', 'Beard Design'],
    experience: '10 years',
    bio: 'Award-winning barber with international experience',
    availability: {}
  },
  {
    id: 'jordan-smith',
    name: 'Jordan Smith',
    rating: 4.7,
    reviewCount: 89,
    specialties: ['Youth Cuts', 'Beard Styling', 'Quick Service'],
    experience: '5 years',
    bio: 'Energetic barber specializing in youth and modern styles',
    availability: {}
  }
]

const timeSlots = [
  '9:00 AM', '9:30 AM', '10:00 AM', '10:30 AM', '11:00 AM', '11:30 AM',
  '12:00 PM', '12:30 PM', '1:00 PM', '1:30 PM', '2:00 PM', '2:30 PM',
  '3:00 PM', '3:30 PM', '4:00 PM', '4:30 PM', '5:00 PM', '5:30 PM',
  '6:00 PM', '6:30 PM', '7:00 PM'
]

export function AdvancedBookingForm() {
  const { trackEvent } = useAnalytics()

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
  const [isLoading, setIsLoading] = useState(false)
  const [availableTimes, setAvailableTimes] = useState<string[]>([])
  const [bookedTimes, setBookedTimes] = useState<string[]>([])
  const [showBarberDetails, setShowBarberDetails] = useState(false)
  const [paymentIntentId, setPaymentIntentId] = useState<string | null>(null)
  const [paymentError, setPaymentError] = useState<string | null>(null)

  const selectedServiceData = services.find(s => s.id === selectedService)
  const selectedBarberData = barbers.find(b => b.id === selectedBarber)
  const total = selectedServiceData?.price || 0
  const progressPercentage = (step / 6) * 100 // Updated for 6 steps

  // Track form interactions
  const trackFormStep = (stepName: string, stepNumber: number) => {
    trackEvent({
      action: `booking_step_${stepNumber}`,
      category: EVENT_CATEGORIES.BOOKING,
      label: stepName,
      customParameters: {
        step_number: stepNumber,
        service_id: selectedService,
        barber_id: selectedBarber,
        date_selected: selectedDate,
        time_selected: selectedTime,
        timestamp: new Date().toISOString()
      }
    })
  }

  const handleNext = () => {
    if (step < 6) {
      const nextStep = step + 1
      setStep(nextStep)

      // Track step progression
      const stepNames = ['', 'service_selection', 'barber_selection', 'datetime_selection', 'customer_info', 'payment', 'confirmation']
      trackFormStep(stepNames[nextStep], nextStep)

      // Track button click
      analyticsService.trackEvent({
        action: EVENT_ACTIONS.BUTTON_CLICK,
        category: EVENT_CATEGORIES.USER_ENGAGEMENT,
        label: 'booking_next',
        customParameters: {
          current_step: step,
          next_step: nextStep,
          step_name: stepNames[nextStep],
          form_name: 'advanced_booking_form',
          timestamp: new Date().toISOString()
        }
      })
    }
  }

  const handleBack = () => {
    if (step > 1) {
      const prevStep = step - 1
      setStep(prevStep)

      // Track button click
      analyticsService.trackEvent({
        action: EVENT_ACTIONS.BUTTON_CLICK,
        category: EVENT_CATEGORIES.USER_ENGAGEMENT,
        label: 'booking_back',
        customParameters: {
          current_step: step,
          previous_step: prevStep,
          form_name: 'advanced_booking_form',
          timestamp: new Date().toISOString()
        }
      })
    }
  }

  const handleServiceSelect = (serviceId: string) => {
    setSelectedService(serviceId)
    const service = services.find(s => s.id === serviceId)
    trackBookingFunnel.serviceSelected(serviceId, service?.name || 'Unknown Service')

    // Track service selection as button click
    analyticsService.trackEvent({
      action: EVENT_ACTIONS.BUTTON_CLICK,
      category: EVENT_CATEGORIES.USER_ENGAGEMENT,
      label: 'service_select',
      customParameters: {
        service_id: serviceId,
        service_name: service?.name || 'Unknown Service',
        service_price: service?.price || 0,
        step_number: 1,
        form_name: 'advanced_booking_form',
        timestamp: new Date().toISOString()
      }
    })
  }



  const handleDateTimeSelect = (date: string, time: string) => {
    setSelectedDate(date)
    setSelectedTime(time)
    trackBookingFunnel.dateTimeSelected(date, time)
  }

  const handleTimeSelect = (time: string) => {
    setSelectedTime(time)

    // Track time selection as button click
    analyticsService.trackEvent({
      action: EVENT_ACTIONS.BUTTON_CLICK,
      category: EVENT_CATEGORIES.USER_ENGAGEMENT,
      label: 'time_select',
      customParameters: {
        selected_time: time,
        selected_date: selectedDate,
        step_number: 3,
        form_name: 'advanced_booking_form',
        timestamp: new Date().toISOString()
      }
    })

    if (selectedDate) {
      trackBookingFunnel.dateTimeSelected(selectedDate, time)
    }
  }

  const handlePaymentSuccess = (paymentIntentId: string) => {
    setPaymentIntentId(paymentIntentId)
    setPaymentError(null)
    setStep(6) // Go to success step

    // Track successful booking completion
    trackBookingFunnel.completed(paymentIntentId, total)
    trackPaymentFunnel.completed(paymentIntentId, total, 'usd')
  }

  const handlePaymentError = (error: string) => {
    setPaymentError(error)
    setPaymentIntentId(null)
    trackPaymentFunnel.failed(error, total)
  }

  const checkBarberAvailability = async (barberId: string, date: string) => {
    setIsLoading(true)
    try {
      // Simulate API call with more realistic data
      const mockBookedTimes = [
        '10:00 AM', '2:00 PM', '4:30 PM',
        '11:30 AM', '3:30 PM', '5:00 PM'
      ]
      setBookedTimes(mockBookedTimes)
      setAvailableTimes(timeSlots.filter(time => !mockBookedTimes.includes(time)))

      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 800))
    } catch (error) {
      console.error('Error checking availability:', error)
      setAvailableTimes(timeSlots)
    } finally {
      setIsLoading(false)
    }
  }

  const handleBarberSelect = (barberId: string) => {
    setSelectedBarber(barberId)
    const barber = barbers.find(b => b.id === barberId)
    trackBookingFunnel.barberSelected(barberId, barber?.name || 'Unknown Barber')

    // Track barber selection as button click
    analyticsService.trackEvent({
      action: EVENT_ACTIONS.BUTTON_CLICK,
      category: EVENT_CATEGORIES.USER_ENGAGEMENT,
      label: 'barber_select',
      customParameters: {
        barber_id: barberId,
        barber_name: barber?.name || 'Unknown Barber',
        barber_rating: barber?.rating || 0,
        step_number: 2,
        form_name: 'advanced_booking_form',
        timestamp: new Date().toISOString()
      }
    })

    if (selectedDate) {
      checkBarberAvailability(barberId, selectedDate)
    }
  }

  const handleDateSelect = (date: string) => {
    setSelectedDate(date)
    setSelectedTime('')
    if (selectedBarber) {
      checkBarberAvailability(selectedBarber, date)
    }
  }

  const handleSubmit = async () => {
    setIsLoading(true)
    try {
      console.log('Advanced booking submitted:', {
        service: selectedServiceData,
        barber: selectedBarberData,
        date: selectedDate,
        time: selectedTime,
        customer: customerInfo,
        payment: paymentMethod,
      })

      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000))
      setStep(6) // Success step
    } catch (error) {
      console.error('Error submitting booking:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const canProceed = () => {
    switch (step) {
      case 1: return selectedService !== ''
      case 2: return selectedBarber !== ''
      case 3: return selectedDate !== '' && selectedTime !== ''
      case 4: return customerInfo.firstName && customerInfo.lastName &&
                     customerInfo.email && customerInfo.phone && agreeToTerms
      case 5: return true
      case 6: return true
      default: return false
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted/20 py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        {/* Header */}
        <motion.div
          className="text-center mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1 className="text-4xl lg:text-5xl font-black mb-4 bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent">
            Book Your Experience
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Transform your look with our premium grooming services and expert barbers
          </p>
        </motion.div>

        {/* Progress Bar */}
        <motion.div
          className="mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <div className="flex justify-between text-sm text-muted-foreground mb-2">
            <span>Step {step} of 6</span>
            <span>{Math.round(progressPercentage)}% Complete</span>
          </div>
          <Progress value={progressPercentage} className="h-3" />
        </motion.div>

        {/* Main Content */}
        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
          >
            <Card className="shadow-2xl border-0 bg-card/95 backdrop-blur-sm">
              <CardHeader className="pb-6">
                <CardTitle className="flex items-center gap-3 text-2xl">
                  {step === 1 && <><Scissors className="w-6 h-6 text-primary" /> Choose Your Service</>}
                  {step === 2 && <><User className="w-6 h-6 text-primary" /> Select Your Barber</>}
                  {step === 3 && <><Calendar className="w-6 h-6 text-primary" /> Pick Date & Time</>}
                  {step === 4 && <><User className="w-6 h-6 text-primary" /> Your Information</>}
                  {step === 5 && <><CreditCard className="w-6 h-6 text-primary" /> Secure Payment</>}
                  {step === 6 && <><CheckCircle className="w-6 h-6 text-green-500" /> Booking Confirmed!</>}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">

                {/* Step 1: Service Selection */}
                {step === 1 && (
                  <div className="space-y-6">
                    <p className="text-muted-foreground text-center">
                      Select the perfect service for your grooming needs
                    </p>
                    <div className="grid md:grid-cols-2 gap-4">
                      {services.map((service) => (
                        <motion.div
                          key={service.id}
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                        >
                          <Card
                            className={`cursor-pointer transition-all duration-300 hover:shadow-lg ${
                              selectedService === service.id
                                ? 'ring-2 ring-primary shadow-lg bg-primary/5'
                                : 'hover:bg-muted/50'
                            }`}
                            onClick={() => handleServiceSelect(service.id)}
                          >
                            <CardContent className="p-6">
                              <div className="flex justify-between items-start mb-4">
                                <div className="flex-1">
                                  <div className="flex items-center gap-2 mb-2">
                                    <h3 className="font-bold text-lg">{service.name}</h3>
                                    {service.popular && (
                                      <Badge className="bg-gradient-to-r from-primary to-accent">
                                        <Sparkles className="w-3 h-3 mr-1" />
                                        Popular
                                      </Badge>
                                    )}
                                  </div>
                                  <p className="text-sm text-muted-foreground mb-3">
                                    {service.description}
                                  </p>
                                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                                    <span className="flex items-center gap-1">
                                      <Clock className="w-4 h-4" />
                                      {service.duration} min
                                    </span>
                                    <Badge variant="outline">{service.category}</Badge>
                                  </div>
                                </div>
                                <div className="text-right">
                                  <div className="text-2xl font-bold text-primary">${service.price}</div>
                                  {selectedService === service.id && (
                                    <motion.div
                                      initial={{ scale: 0 }}
                                      animate={{ scale: 1 }}
                                      className="w-6 h-6 bg-primary rounded-full flex items-center justify-center mt-2"
                                    >
                                      <CheckCircle className="w-4 h-4 text-white" />
                                    </motion.div>
                                  )}
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Step 2: Barber Selection */}
                {step === 2 && (
                  <div className="space-y-6">
                    <p className="text-muted-foreground text-center">
                      Meet our expert barbers and choose your perfect match
                    </p>
                    <div className="grid md:grid-cols-2 gap-6">
                      {barbers.map((barber) => (
                        <motion.div
                          key={barber.id}
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                        >
                          <Card
                            className={`cursor-pointer transition-all duration-300 hover:shadow-lg ${
                              selectedBarber === barber.id
                                ? 'ring-2 ring-primary shadow-lg bg-primary/5'
                                : 'hover:bg-muted/50'
                            }`}
                            onClick={() => handleBarberSelect(barber.id)}
                          >
                            <CardContent className="p-6">
                              <div className="flex items-start gap-4">
                                <Avatar className="w-16 h-16">
                                  <AvatarImage src={barber.avatar} />
                                  <AvatarFallback className="bg-gradient-to-br from-primary to-accent text-white text-lg font-bold">
                                    {barber.name.split(' ').map(n => n[0]).join('')}
                                  </AvatarFallback>
                                </Avatar>
                                <div className="flex-1">
                                  <div className="flex items-center justify-between mb-2">
                                    <h3 className="font-bold text-lg">{barber.name}</h3>
                                    <div className="flex items-center gap-1">
                                      <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                                      <span className="font-semibold">{barber.rating}</span>
                                      <span className="text-sm text-muted-foreground">
                                        ({barber.reviewCount})
                                      </span>
                                    </div>
                                  </div>
                                  <p className="text-sm text-muted-foreground mb-3">{barber.bio}</p>
                                  <div className="flex flex-wrap gap-1 mb-3">
                                    {barber.specialties.map((specialty) => (
                                      <Badge key={specialty} variant="secondary" className="text-xs">
                                        {specialty}
                                      </Badge>
                                    ))}
                                  </div>
                                  <div className="text-sm text-muted-foreground">
                                    {barber.experience} experience
                                  </div>
                                </div>
                                {selectedBarber === barber.id && (
                                  <motion.div
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1 }}
                                    className="w-8 h-8 bg-primary rounded-full flex items-center justify-center"
                                  >
                                    <CheckCircle className="w-5 h-5 text-white" />
                                  </motion.div>
                                )}
                              </div>
                            </CardContent>
                          </Card>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Step 3: Date & Time Selection */}
                {step === 3 && (
                  <div className="space-y-6">
                    <div className="text-center">
                      <h3 className="text-lg font-semibold mb-2">
                        Schedule with {selectedBarberData?.name}
                      </h3>
                      <p className="text-muted-foreground">
                        Choose your preferred date and time
                      </p>
                    </div>

                    {/* Date Selection */}
                    <div className="max-w-md mx-auto">
                      <Label htmlFor="date" className="text-base font-semibold">Select Date</Label>
                      <Input
                        id="date"
                        type="date"
                        value={selectedDate}
                        onChange={(e) => handleDateSelect(e.target.value)}
                        min={new Date().toISOString().split('T')[0]}
                        className="mt-2"
                      />
                    </div>

                    {/* Time Selection */}
                    {selectedDate && (
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="space-y-4"
                      >
                        <div className="text-center">
                          <h4 className="font-semibold mb-2">Available Times</h4>
                          {isLoading && (
                            <div className="flex items-center justify-center gap-2 text-muted-foreground">
                              <Loader2 className="w-4 h-4 animate-spin" />
                              Checking availability...
                            </div>
                          )}
                        </div>

                        <div className="grid grid-cols-4 gap-3 max-w-2xl mx-auto">
                          {timeSlots.map((time) => {
                            const isBooked = bookedTimes.includes(time)
                            const isSelected = selectedTime === time

                            return (
                              <motion.div
                                key={time}
                                whileHover={!isBooked ? { scale: 1.05 } : {}}
                                whileTap={!isBooked ? { scale: 0.95 } : {}}
                              >
                                <Button
                                  variant={isSelected ? "default" : "outline"}
                                  size="sm"
                                  onClick={() => !isBooked && handleTimeSelect(time)}
                                  disabled={isBooked}
                                  className={`w-full text-sm relative ${
                                    isBooked
                                      ? 'opacity-50 cursor-not-allowed bg-red-50 border-red-200 text-red-600'
                                      : isSelected
                                        ? 'bg-primary text-primary-foreground shadow-lg'
                                        : 'hover:bg-primary/10 hover:border-primary/50'
                                  }`}
                                >
                                  {time}
                                  {isBooked && (
                                    <div className="absolute inset-0 bg-red-500/10 rounded-md" />
                                  )}
                                </Button>
                              </motion.div>
                            )
                          })}
                        </div>

                        <div className="flex justify-center gap-6 text-sm">
                          <div className="flex items-center gap-2">
                            <div className="w-3 h-3 bg-primary rounded-full"></div>
                            <span>Available</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                            <span>Booked</span>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </div>
                )}

                {/* Step 4: Customer Information */}
                {step === 4 && (
                  <div className="space-y-6">
                    <div className="text-center mb-6">
                      <h3 className="text-lg font-semibold mb-2">Your Information</h3>
                      <p className="text-muted-foreground">Tell us about yourself so we can provide the best service</p>
                    </div>

                    <div className="grid md:grid-cols-2 gap-6">
                      <div className="space-y-4">
                        <div>
                          <Label htmlFor="firstName">First Name</Label>
                          <Input
                            id="firstName"
                            value={customerInfo.firstName}
                            onChange={(e) => setCustomerInfo({...customerInfo, firstName: e.target.value})}
                            placeholder="Enter your first name"
                            className="mt-1"
                          />
                        </div>
                        <div>
                          <Label htmlFor="email">Email</Label>
                          <Input
                            id="email"
                            type="email"
                            value={customerInfo.email}
                            onChange={(e) => setCustomerInfo({...customerInfo, email: e.target.value})}
                            placeholder="Enter your email"
                            className="mt-1"
                          />
                        </div>
                      </div>

                      <div className="space-y-4">
                        <div>
                          <Label htmlFor="lastName">Last Name</Label>
                          <Input
                            id="lastName"
                            value={customerInfo.lastName}
                            onChange={(e) => setCustomerInfo({...customerInfo, lastName: e.target.value})}
                            placeholder="Enter your last name"
                            className="mt-1"
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
                            className="mt-1"
                          />
                        </div>
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="notes">Special Requests (Optional)</Label>
                      <Textarea
                        id="notes"
                        value={customerInfo.notes}
                        onChange={(e) => setCustomerInfo({...customerInfo, notes: e.target.value})}
                        placeholder="Any special requests or notes for your barber..."
                        rows={3}
                        className="mt-1"
                      />
                    </div>

                    {/* Terms Agreement */}
                    <div className="flex items-start space-x-3 p-4 bg-muted/50 rounded-lg">
                      <Checkbox
                        id="terms"
                        checked={agreeToTerms}
                        onCheckedChange={(checked) => setAgreeToTerms(checked === true)}
                      />
                      <Label htmlFor="terms" className="text-sm leading-relaxed">
                        I agree to the terms and conditions and understand that cancellations must be made at least 24 hours in advance for a full refund.
                      </Label>
                    </div>
                  </div>
                )}

                {/* Step 5: Secure Payment */}
                {step === 5 && (
                  <div className="space-y-6">
                    <div className="text-center mb-6">
                      <h3 className="text-lg font-semibold mb-2">Secure Payment</h3>
                      <p className="text-muted-foreground">Complete your booking with our secure payment system</p>
                    </div>

                    {/* Payment Error Display */}
                    {paymentError && (
                      <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                        <div className="flex items-center gap-2 text-red-800">
                          <AlertCircle className="w-5 h-5" />
                          <span className="font-medium">Payment Error</span>
                        </div>
                        <p className="text-red-700 mt-1">{paymentError}</p>
                      </div>
                    )}

                    {/* Stripe Payment Form */}
                    <StripeProvider>
                      <StripePaymentForm
                        amount={total}
                        onPaymentSuccess={handlePaymentSuccess}
                        onPaymentError={handlePaymentError}
                        bookingData={{
                          serviceId: selectedService,
                          serviceName: selectedServiceData?.name || '',
                          barberId: selectedBarber,
                          barberName: selectedBarberData?.name || '',
                          date: selectedDate,
                          time: selectedTime,
                          duration: selectedServiceData?.duration || 30,
                          customerEmail: customerInfo.email,
                          customerName: `${customerInfo.firstName} ${customerInfo.lastName}`,
                          customerPhone: customerInfo.phone,
                          specialRequests: customerInfo.notes,
                        }}
                      />
                    </StripeProvider>

                    {/* Payment Summary */}
                    <Card className="bg-gradient-to-r from-primary/5 to-accent/5">
                      <CardContent className="p-4">
                        <h4 className="font-semibold mb-3">Booking Summary</h4>
                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between">
                            <span>Service:</span>
                            <span className="font-medium">{selectedServiceData?.name}</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Barber:</span>
                            <span className="font-medium">{selectedBarberData?.name}</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Date & Time:</span>
                            <span className="font-medium">{selectedDate} at {selectedTime}</span>
                          </div>
                          <div className="flex justify-between font-semibold text-primary border-t pt-2">
                            <span>Total:</span>
                            <span>${total}</span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                )}

                {/* Step 6: Review & Confirm */}
                {step === 6 && (
                  <div className="space-y-6">
                    <div className="text-center">
                      <h3 className="text-lg font-semibold mb-2">Review Your Booking</h3>
                      <p className="text-muted-foreground">Please confirm all details are correct</p>
                    </div>

                    <div className="grid md:grid-cols-2 gap-6">
                      {/* Booking Summary */}
                      <Card className="bg-gradient-to-br from-primary/5 to-accent/5">
                        <CardHeader>
                          <CardTitle className="flex items-center gap-2">
                            <CheckCircle className="w-5 h-5 text-green-500" />
                            Booking Summary
                          </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Service:</span>
                            <span className="font-semibold">{selectedServiceData?.name}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Barber:</span>
                            <span className="font-semibold">{selectedBarberData?.name}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Date:</span>
                            <span className="font-semibold">
                              {selectedDate ? new Date(selectedDate).toLocaleDateString() : ''}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Time:</span>
                            <span className="font-semibold">{selectedTime}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Duration:</span>
                            <span className="font-semibold">{selectedServiceData?.duration} minutes</span>
                          </div>
                          <div className="border-t pt-4 flex justify-between text-lg font-bold">
                            <span>Total:</span>
                            <span className="text-primary">${total}</span>
                          </div>
                        </CardContent>
                      </Card>

                      {/* Customer Information */}
                      <Card>
                        <CardHeader>
                          <CardTitle className="flex items-center gap-2">
                            <User className="w-5 h-5" />
                            Your Information
                          </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3">
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Name:</span>
                            <span>{customerInfo.firstName} {customerInfo.lastName}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Email:</span>
                            <span className="text-sm">{customerInfo.email}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Phone:</span>
                            <span>{customerInfo.phone}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Payment:</span>
                            <span className="capitalize">{paymentMethod}</span>
                          </div>
                          {customerInfo.notes && (
                            <div className="pt-3 border-t">
                              <div className="text-muted-foreground text-sm mb-1">Special Notes:</div>
                              <div className="text-sm bg-muted/50 p-2 rounded">{customerInfo.notes}</div>
                            </div>
                          )}
                        </CardContent>
                      </Card>
                    </div>
                  </div>
                )}

                {/* Step 6: Confirmation */}
                {step === 6 && (
                  <motion.div
                    className="text-center py-12"
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  >
                    <motion.div
                      className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-6"
                      animate={{ scale: [1, 1.1, 1] }}
                      transition={{ duration: 2, repeat: Infinity }}
                    >
                      <CheckCircle className="w-10 h-10 text-white" />
                    </motion.div>
                    <h2 className="text-3xl font-bold mb-4 text-green-600">Booking Confirmed!</h2>
                    <p className="text-lg text-muted-foreground mb-8 max-w-md mx-auto">
                      Your appointment has been successfully scheduled. You will receive a confirmation email and SMS shortly.
                    </p>

                    <Card className="max-w-md mx-auto bg-gradient-to-br from-green-50 to-emerald-50 border-green-200">
                      <CardContent className="p-6">
                        <div className="space-y-3 text-sm">
                          <div className="flex justify-between">
                            <span className="font-medium">Service:</span>
                            <span>{selectedServiceData?.name}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="font-medium">Barber:</span>
                            <span>{selectedBarberData?.name}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="font-medium">Date & Time:</span>
                            <span>{selectedDate} at {selectedTime}</span>
                          </div>
                          <div className="flex justify-between font-semibold text-green-700 border-t pt-2">
                            <span>Total Paid:</span>
                            <span>${total}</span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    <div className="flex gap-4 justify-center mt-8">
                      <Button onClick={() => window.location.href = '/'} variant="outline">
                        Return Home
                      </Button>
                      <Button onClick={() => window.location.href = '/customer/dashboard'}>
                        View My Appointments
                      </Button>
                    </div>
                  </motion.div>
                )}

                {/* Navigation Buttons */}
                {step < 6 && (
                  <div className="flex justify-between pt-6 border-t">
                    {step > 1 && step !== 5 && (
                      <Button variant="outline" onClick={handleBack}>
                        ← Back
                      </Button>
                    )}
                    {step === 5 && (
                      <Button variant="outline" onClick={handleBack}>
                        ← Edit Information
                      </Button>
                    )}
                    <div className="ml-auto">
                      {step < 5 && (
                        <Button onClick={handleNext} disabled={!canProceed()}>
                          Next →
                        </Button>
                      )}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  )
}
