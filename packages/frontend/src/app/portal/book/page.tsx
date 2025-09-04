'use client'

import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'

import { Icons } from '@/lib/icons'
import { Calendar, Clock, Scissors, Star, Users, Award, CheckCircle, MapPin, Phone, ArrowLeft, ArrowRight } from '@/lib/icon-mapping'
import { toast } from 'sonner'
import { z } from 'zod'
import { BookingFormSkeleton, ServiceCardSkeleton } from '@/components/ui/loading'

// Validation schemas
const serviceSchema = z.object({
  service: z.string().min(1, 'Please select a service'),
})

const dateTimeSchema = z.object({
  date: z.string().min(1, 'Please select a date'),
  time: z.string().min(1, 'Please select a time'),
})

const notesSchema = z.object({
  notes: z.string().optional(),
})

const bookingSchema = z.object({
  service: z.string().min(1, 'Please select a service'),
  date: z.string().min(1, 'Please select a date'),
  time: z.string().min(1, 'Please select a time'),
  notes: z.string().optional(),
})

export default function BookAppointmentPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [currentStep, setCurrentStep] = useState(0)
  const [isLoading, setIsLoading] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})

  const [formData, setFormData] = useState({
    service: '',
    date: '',
    time: '',
    notes: ''
  })

  const steps = [
    { title: 'Choose Service', description: 'Select your preferred service' },
    { title: 'Pick Date & Time', description: 'Choose your appointment schedule' },
    { title: 'Add Notes', description: 'Any special requests?' },
    { title: 'Confirm Booking', description: 'Review and confirm your appointment' }
  ]

  useEffect(() => {
    if (status === 'loading') return
    if (!session) {
      router.push('/portal/login')
    }
  }, [session, status, router])

  const services = [
    { 
      id: 'classic-haircut', 
      name: 'Classic Haircut', 
      price: '$35', 
      duration: '30 min',
      description: 'Professional cut and style',
      popular: true,
      category: 'Haircut'
    },
    { 
      id: 'premium-haircut', 
      name: 'Premium Haircut', 
      price: '$45', 
      duration: '45 min',
      description: 'Cut, wash, and style',
      popular: false,
      category: 'Haircut'
    },
    { 
      id: 'beard-trim', 
      name: 'Beard Trim & Shape', 
      price: '$25', 
      duration: '20 min',
      description: 'Professional beard grooming',
      popular: true,
      category: 'Beard'
    },
    { 
      id: 'beard-shave', 
      name: 'Hot Towel Shave', 
      price: '$40', 
      duration: '30 min',
      description: 'Traditional hot towel shave',
      popular: false,
      category: 'Beard'
    },
    { 
      id: 'hair-color', 
      name: 'Hair Coloring', 
      price: '$85', 
      duration: '90 min',
      description: 'Professional hair coloring',
      popular: false,
      category: 'Color'
    },
    { 
      id: 'styling', 
      name: 'Hair Styling', 
      price: '$45', 
      duration: '45 min',
      description: 'Special occasion styling',
      popular: false,
      category: 'Styling'
    },
    { 
      id: 'facial', 
      name: 'Facial Treatment', 
      price: '$65', 
      duration: '60 min',
      description: 'Deep cleansing facial',
      popular: false,
      category: 'Facial'
    },
    { 
      id: 'complete-package', 
      name: 'Complete Package', 
      price: '$150', 
      duration: '2 hours',
      description: 'Haircut, beard trim, and facial',
      popular: true,
      category: 'Package'
    }
  ]

  const timeSlots = [
    '9:00 AM', '9:30 AM', '10:00 AM', '10:30 AM', '11:00 AM', '11:30 AM',
    '12:00 PM', '12:30 PM', '1:00 PM', '1:30 PM', '2:00 PM', '2:30 PM',
    '3:00 PM', '3:30 PM', '4:00 PM', '4:30 PM', '5:00 PM', '5:30 PM'
  ]

  const validateStep = (step: number): boolean => {
    try {
      switch (step) {
        case 0:
          serviceSchema.parse(formData)
          break
        case 1:
          dateTimeSchema.parse(formData)
          break
        case 2:
          notesSchema.parse(formData)
          break
        case 3:
          bookingSchema.parse(formData)
          break
      }
      setErrors({})
      return true
    } catch (error) {
      if (error instanceof z.ZodError) {
        const stepErrors: Record<string, string> = {}
        error.errors.forEach(err => {
          if (err.path[0]) {
            stepErrors[err.path[0] as string] = err.message
          }
        })
        setErrors(stepErrors)
      }
      return false
    }
  }

  const nextStep = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(prev => Math.min(prev + 1, steps.length - 1))
    }
  }

  const prevStep = () => {
    setCurrentStep(prev => Math.max(prev - 1, 0))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateStep(currentStep)) {
      return
    }

    setIsLoading(true)

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000))

      toast.success('Appointment booked successfully!', {
        description: `Your ${formData.service} appointment is scheduled for ${formData.date} at ${formData.time}`
      })

      router.push('/portal')
    } catch (error) {
      toast.error('Failed to book appointment. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }))
    }
  }

  // Keyboard navigation handler
  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (isLoading) return

    switch (event.key) {
      case 'ArrowLeft':
        if (currentStep > 0) {
          event.preventDefault()
          prevStep()
        }
        break
      case 'ArrowRight':
        if (currentStep < steps.length - 1) {
          event.preventDefault()
          nextStep()
        }
        break
      case 'Enter':
        if (currentStep < steps.length - 1 && event.target instanceof HTMLElement && event.target.tagName !== 'BUTTON' && event.target.tagName !== 'TEXTAREA') {
          event.preventDefault()
          nextStep()
        }
        break
      case 'Escape':
        // Could add modal close functionality here if needed
        break
    }
  }

  if (status === 'loading') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-amber-50 via-white to-blue-50 flex items-center justify-center">
        <div className="flex items-center space-x-2">
          <Icons.spinner className="h-6 w-6 animate-spin text-amber-600" />
          <span className="text-gray-600">Loading...</span>
        </div>
      </div>
    )
  }

  if (!session) {
    return null
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-white to-blue-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-amber-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-600 via-amber-600 to-blue-800 rounded-full flex items-center justify-center shadow-lg">
                <span className="text-xl text-white font-bold">✂</span>
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 via-amber-600 to-blue-800 bg-clip-text text-transparent">
                  Book Appointment
                </h1>
                <p className="text-sm text-gray-600">Schedule your next visit</p>
              </div>
            </div>
            <Button
              variant="outline"
              onClick={() => router.push('/portal')}
              className="border-amber-200 hover:border-amber-300 hover:bg-amber-50"
            >
              Back to Dashboard
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Page Header */}
        <motion.div 
          className="text-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <Badge 
            variant="secondary" 
            className="bg-amber-100 text-amber-800 px-4 py-2 text-sm font-medium mb-4"
          >
            📅 Book Your Appointment
          </Badge>
          <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-4">
            Schedule Your <span className="bg-gradient-to-r from-amber-600 to-amber-500 bg-clip-text text-transparent">Perfect Look</span>
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Choose from our premium services and book your appointment with our expert stylists
          </p>
        </motion.div>

        {/* Progress Bar */}
        <div className="mb-8" role="progressbar" aria-valuenow={(currentStep + 1) / steps.length * 100} aria-valuemin={0} aria-valuemax={100} aria-label={`Step ${currentStep + 1} of ${steps.length}: ${steps[currentStep].title}`}>
          <div className="flex items-center justify-between mb-4">
            {steps.map((step, index) => (
              <div key={step.title} className="flex items-center">
                <div
                  className={`flex items-center justify-center w-10 h-10 rounded-full border-2 transition-all duration-300 ${
                    index <= currentStep
                      ? 'bg-amber-500 border-amber-500 text-white'
                      : 'border-gray-300 text-gray-400'
                  }`}
                  aria-current={index === currentStep ? 'step' : undefined}
                  aria-label={`Step ${index + 1}: ${step.title}`}
                >
                  {index < currentStep ? <CheckCircle className="h-5 w-5" aria-hidden="true" /> : index + 1}
                </div>
                {index < steps.length - 1 && (
                  <div
                    className={`w-16 h-0.5 mx-2 transition-all duration-300 ${
                      index < currentStep ? 'bg-amber-500' : 'bg-gray-300'
                    }`}
                    aria-hidden="true"
                  />
                )}
              </div>
            ))}
          </div>
          <div className="text-center">
            <h3 className="text-lg font-semibold text-gray-800 mb-1">
              {steps[currentStep].title}
            </h3>
            <p className="text-sm text-gray-600">
              {steps[currentStep].description}
            </p>
          </div>
          <div className="mt-4 bg-gray-200 rounded-full h-2 overflow-hidden">
            <motion.div
              className="h-full bg-gradient-to-r from-amber-500 to-amber-600 rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${(currentStep + 1) / steps.length * 100}%` }}
              transition={{ duration: 0.5, ease: "easeInOut" }}
            />
          </div>
        </div>

        {/* Status Announcements for Screen Readers */}
        <div aria-live="polite" aria-atomic="true" className="sr-only">
          {isLoading && "Processing your booking request"}
          {!isLoading && `Current step: ${steps[currentStep].title} - ${steps[currentStep].description}`}
          {Object.keys(errors).length > 0 && `Form has ${Object.keys(errors).length} validation error${Object.keys(errors).length > 1 ? 's' : ''}`}
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
          {/* Booking Form */}
          <motion.div
            className="xl:col-span-2"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <Card className="border-0 shadow-2xl bg-white/90 backdrop-blur-sm">
              <CardHeader className="bg-gradient-to-r from-amber-600 to-amber-500 text-white rounded-t-xl">
                <CardTitle className="flex items-center space-x-3 text-xl">
                  <div className="p-2 rounded-full bg-white/20">
                    <Calendar className="h-5 w-5" />
                  </div>
                  <span>{steps[currentStep].title}</span>
                </CardTitle>
                <CardDescription className="text-amber-100">
                  {steps[currentStep].description}
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-8">
                <form onKeyDown={handleKeyDown} role="form" aria-labelledby="booking-form-title">
                  <AnimatePresence mode="wait">
                  {isLoading ? (
                    <motion.div
                      key="loading"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="flex flex-col items-center justify-center py-12"
                    >
                      <div className="w-16 h-16 border-4 border-amber-200 border-t-amber-600 rounded-full animate-spin mb-4"></div>
                      <p className="text-gray-600 text-lg">Processing your booking...</p>
                      <p className="text-gray-500 text-sm mt-2">Please wait while we confirm your appointment</p>
                    </motion.div>
                  ) : currentStep === 0 && (
                    <motion.div
                      key="step-0"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      transition={{ duration: 0.3 }}
                      className="space-y-6"
                    >
                      <div className="space-y-3">
                        <Label htmlFor="service" className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                          <Scissors className="h-4 w-4 text-amber-600" />
                          Select Service
                        </Label>
                        <select
                          id="service"
                          value={formData.service}
                          onChange={(e) => handleInputChange('service', e.target.value)}
                          aria-describedby={errors.service ? "service-error" : undefined}
                          aria-invalid={!!errors.service}
                          aria-required="true"
                          className={`w-full p-4 border-2 rounded-xl focus:ring-amber-500 bg-white shadow-sm hover:shadow-md transition-all duration-300 ${
                            errors.service ? 'border-red-500 focus:border-red-500' : 'border-gray-200 focus:border-amber-500'
                          }`}
                        >
                          <option value="">Choose a service...</option>
                          {services.map(service => (
                            <option key={service.id} value={service.name}>
                              {service.name} - {service.price} ({service.duration})
                            </option>
                          ))}
                        </select>
                        {errors.service && (
                          <p id="service-error" className="text-sm text-red-600 flex items-center gap-1" role="alert" aria-live="polite">
                            <span aria-hidden="true">⚠️</span> {errors.service}
                          </p>
                        )}
                      </div>
                    </motion.div>
                  )}

                  {currentStep === 1 && (
                    <motion.div
                      key="step-1"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      transition={{ duration: 0.3 }}
                      className="space-y-6"
                    >
                      <div className="space-y-3">
                        <Label htmlFor="date" className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                          <Calendar className="h-4 w-4 text-amber-600" />
                          Preferred Date
                        </Label>
                        <Input
                          id="date"
                          type="date"
                          value={formData.date}
                          onChange={(e) => handleInputChange('date', e.target.value)}
                          min={new Date().toISOString().split('T')[0]}
                          aria-describedby={errors.date ? "date-error" : undefined}
                          aria-invalid={!!errors.date}
                          aria-required="true"
                          aria-label="Select your preferred appointment date"
                          className={`p-4 border-2 rounded-xl focus:ring-amber-500 shadow-sm hover:shadow-md transition-all duration-300 ${
                            errors.date ? 'border-red-500 focus:border-red-500' : 'border-gray-200 focus:border-amber-500'
                          }`}
                        />
                        {errors.date && (
                          <p id="date-error" className="text-sm text-red-600 flex items-center gap-1" role="alert" aria-live="polite">
                            <span aria-hidden="true">⚠️</span> {errors.date}
                          </p>
                        )}
                      </div>

                      <div className="space-y-3">
                        <Label htmlFor="time" className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                          <Clock className="h-4 w-4 text-amber-600" />
                          Preferred Time
                        </Label>
                        <select
                          id="time"
                          value={formData.time}
                          onChange={(e) => handleInputChange('time', e.target.value)}
                          aria-describedby={errors.time ? "time-error" : undefined}
                          aria-invalid={!!errors.time}
                          aria-required="true"
                          aria-label="Select your preferred appointment time"
                          className={`w-full p-4 border-2 rounded-xl focus:ring-amber-500 bg-white shadow-sm hover:shadow-md transition-all duration-300 ${
                            errors.time ? 'border-red-500 focus:border-red-500' : 'border-gray-200 focus:border-amber-500'
                          }`}
                        >
                          <option value="">Choose a time...</option>
                          {timeSlots.map(time => (
                            <option key={time} value={time}>{time}</option>
                          ))}
                        </select>
                        {errors.time && (
                          <p id="time-error" className="text-sm text-red-600 flex items-center gap-1" role="alert" aria-live="polite">
                            <span aria-hidden="true">⚠️</span> {errors.time}
                          </p>
                        )}
                      </div>
                    </motion.div>
                  )}

                  {currentStep === 2 && (
                    <motion.div
                      key="step-2"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      transition={{ duration: 0.3 }}
                      className="space-y-6"
                    >
                      <div className="space-y-3">
                        <Label htmlFor="notes" className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                          <span className="text-amber-600">📝</span>
                          Special Notes (Optional)
                        </Label>
                        <Textarea
                          id="notes"
                          value={formData.notes}
                          onChange={(e) => handleInputChange('notes', e.target.value)}
                          placeholder="Any special requests or notes for your stylist..."
                          rows={6}
                          className="p-4 border-2 border-gray-200 rounded-xl focus:border-amber-500 focus:ring-amber-500 resize-none shadow-sm hover:shadow-md transition-all duration-300"
                        />
                        <p className="text-sm text-gray-600">
                          Let us know about any specific preferences, allergies, or special requests.
                        </p>
                      </div>
                    </motion.div>
                  )}

                  {currentStep === 3 && (
                    <motion.div
                      key="step-3"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      transition={{ duration: 0.3 }}
                      className="space-y-6"
                    >
                      <div className="bg-gradient-to-r from-amber-50 to-blue-50 rounded-xl p-6 border border-amber-100">
                        <h4 className="text-lg font-semibold text-gray-800 mb-4">Appointment Summary</h4>
                        <div className="space-y-3">
                          <div className="flex justify-between items-center">
                            <span className="text-gray-600">Service:</span>
                            <span className="font-semibold text-gray-800">{formData.service || 'Not selected'}</span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-gray-600">Date:</span>
                            <span className="font-semibold text-gray-800">
                              {formData.date ? new Date(formData.date).toLocaleDateString() : 'Not selected'}
                            </span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-gray-600">Time:</span>
                            <span className="font-semibold text-gray-800">{formData.time || 'Not selected'}</span>
                          </div>
                          {formData.notes && (
                            <div className="pt-3 border-t border-amber-200">
                              <span className="text-gray-600 block mb-1">Notes:</span>
                              <p className="text-sm text-gray-700 italic">"{formData.notes}"</p>
                            </div>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                  {/* Navigation Buttons */}
                  <div className="flex gap-4 pt-6">
                    {currentStep > 0 && (
                      <motion.div
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className="flex-1"
                      >
                        <Button
                          type="button"
                          onClick={prevStep}
                          aria-label={`Go back to ${steps[currentStep - 1].title} step`}
                          className="w-full border-amber-200 text-amber-600 hover:bg-amber-50 py-4 rounded-xl transition-all duration-300"
                        >
                          <ArrowLeft className="mr-2 h-5 w-5" aria-hidden="true" />
                          Previous
                        </Button>
                      </motion.div>
                    )}

                    {currentStep < steps.length - 1 ? (
                      <motion.div
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className="flex-1"
                      >
                        <Button
                          type="button"
                          onClick={nextStep}
                          aria-label={`Continue to ${steps[currentStep + 1].title} step`}
                          className="w-full bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white font-semibold py-4 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
                        >
                          Next
                          <ArrowRight className="ml-2 h-5 w-5" aria-hidden="true" />
                        </Button>
                      </motion.div>
                    ) : (
                      <motion.div
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className="flex-1"
                      >
                        <Button
                          type="submit"
                          disabled={isLoading}
                          aria-label="Confirm and submit your appointment booking"
                          aria-describedby="booking-confirmation"
                          className="w-full bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white font-semibold py-4 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 text-lg"
                        >
                          {isLoading ? (
                            <div className="flex items-center gap-2">
                              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" aria-hidden="true"></div>
                              Booking Appointment...
                            </div>
                          ) : (
                            <div className="flex items-center gap-2">
                              <Calendar className="h-5 w-5" aria-hidden="true" />
                              Confirm Booking
                            </div>
                          )}
                        </Button>
                      </motion.div>
                    )}
                  </div>
                </form>
              </CardContent>
            </Card>
          </motion.div>

          {/* Services Preview */}
          <motion.div 
            className="space-y-6"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            <Card className="border-0 shadow-2xl bg-white/90 backdrop-blur-sm">
              <CardHeader className="bg-gradient-to-r from-slate-800 to-slate-700 text-white rounded-t-xl">
                <CardTitle className="flex items-center space-x-3 text-xl">
                  <div className="p-2 rounded-full bg-white/20">
                    <Scissors className="h-5 w-5" />
                  </div>
                  <span>Our Services</span>
                </CardTitle>
                <CardDescription className="text-slate-200">
                  Professional hair care services
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="space-y-4">
                  {services.length === 0 ? (
                    // Show skeleton loading for services
                    Array.from({ length: 6 }).map((_, index) => (
                      <div key={index} className="animate-pulse">
                        <div className="p-4 rounded-xl border-2 border-gray-200 bg-gray-50">
                          <div className="flex justify-between items-start">
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-2">
                                <div className="h-5 bg-gray-200 rounded w-3/4"></div>
                                <div className="w-16 h-6 bg-gray-200 rounded-full"></div>
                              </div>
                              <div className="h-4 bg-gray-200 rounded w-full mb-1"></div>
                              <div className="h-4 bg-gray-200 rounded w-2/3 mb-3"></div>
                              <div className="flex items-center gap-4 text-xs">
                                <div className="h-3 bg-gray-200 rounded w-12"></div>
                                <div className="h-5 bg-gray-200 rounded w-16"></div>
                              </div>
                            </div>
                            <div className="h-6 bg-gray-200 rounded w-12"></div>
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    services.map((service, index) => (
                    <motion.div
                      key={service.id}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.6, delay: 0.6 + index * 0.1 }}
                      className="group cursor-pointer"
                      onClick={() => handleInputChange('service', service.name)}
                    >
                      <div className={`p-4 rounded-xl border-2 transition-all duration-300 ${
                        formData.service === service.name 
                          ? 'border-amber-500 bg-amber-50 shadow-lg' 
                          : 'border-gray-200 bg-gray-50 hover:border-amber-300 hover:bg-amber-50/50'
                      }`}>
                        <div className="flex justify-between items-start">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <h4 className="font-semibold text-gray-800 group-hover:text-amber-600 transition-colors">
                                {service.name}
                              </h4>
                              {service.popular && (
                                <Badge variant="secondary" className="bg-amber-100 text-amber-800 text-xs">
                                  Popular
                                </Badge>
                              )}
                            </div>
                            <p className="text-sm text-gray-600 mb-1">{service.description}</p>
                            <div className="flex items-center gap-4 text-xs text-gray-500">
                              <span className="flex items-center gap-1">
                                <Clock className="h-3 w-3" />
                                {service.duration}
                              </span>
                              <Badge variant="outline" className="text-xs">
                                {service.category}
                              </Badge>
                            </div>
                          </div>
                          <span className="font-bold text-lg text-amber-600">{service.price}</span>
                        </div>
                      </div>
                    </motion.div>
                  ))
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Booking Tips */}
            <Card className="border-0 shadow-lg">
              <CardHeader className="bg-gradient-to-r from-blue-800 to-amber-700 text-white rounded-t-lg">
                <CardTitle className="flex items-center space-x-2">
                  <Icons.info className="h-5 w-5" />
                  <span>Booking Tips</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-6">
                <ul className="space-y-3 text-sm text-gray-600">
                  <li className="flex items-start space-x-2">
                    <span className="text-blue-500 mt-1">•</span>
                    <span>Appointments can be rescheduled up to 24 hours in advance</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <span className="text-blue-500 mt-1">•</span>
                    <span>Please arrive 5-10 minutes early for your appointment</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <span className="text-blue-500 mt-1">•</span>
                    <span>We'll send you a confirmation email with appointment details</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <span className="text-blue-500 mt-1">•</span>
                    <span>Cancellation policy: 24 hours notice required</span>
                  </li>
                </ul>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>

      {/* Footer */}
      <div className="mt-16 bg-white border-t border-amber-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <p className="text-sm text-gray-500">
              © 2025 Modern Men Barbershop. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
