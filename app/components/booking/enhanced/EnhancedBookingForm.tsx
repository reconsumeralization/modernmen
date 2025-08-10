'use client'

import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import ServiceSelection from '../ServiceSelection'
import DateTimeSelection from '../DateTimeSelection'
import PersonalInfo from '../PersonalInfo'
import { Calendar, Clock, User, CreditCard } from 'lucide-react'

interface BookingFormData {
  serviceId: string
  staffId: string
  date: string
  time: string
  name: string
  email: string
  phone: string
  notes: string
  giftCardCode?: string
}

const steps = [
  { id: 1, name: 'Service', icon: Calendar },
  { id: 2, name: 'Date & Time', icon: Clock },
  { id: 3, name: 'Details', icon: User },
  { id: 4, name: 'Payment', icon: CreditCard }
]

export default function EnhancedBookingForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [currentStep, setCurrentStep] = useState(1)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formData, setFormData] = useState<BookingFormData>({
    serviceId: '',
    staffId: 'any',
    date: '',
    time: '',
    name: '',
    email: '',
    phone: '',
    notes: '',
    giftCardCode: ''
  })

  // Prefill from URL params (for chatbot deep-linking)
  useEffect(() => {
    const serviceId = searchParams.get('serviceId')
    const staffId = searchParams.get('staffId')
    const date = searchParams.get('date')
    const time = searchParams.get('time')
    
    if (serviceId) setFormData(prev => ({ ...prev, serviceId }))
    if (staffId) setFormData(prev => ({ ...prev, staffId }))
    if (date) setFormData(prev => ({ ...prev, date }))
    if (time) setFormData(prev => ({ ...prev, time }))
  }, [searchParams])

  const updateFormData = (field: keyof BookingFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const handleServiceChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target
    if (name === 'service') {
      updateFormData('serviceId', value)
    } else if (name === 'staff') {
      updateFormData('staffId', value === 'No Preference' ? 'any' : value)
    }
  }

  const nextStep = () => {
    if (currentStep < steps.length) {
      setCurrentStep(currentStep + 1)
    }
  }

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    }
  }

  const handleSubmit = async () => {
    if (!formData.serviceId || !formData.date || !formData.time || !formData.name || !formData.email || !formData.phone) {
      alert('Please fill in all required fields')
      return
    }

    setIsSubmitting(true)
    try {
      const response = await fetch('/api/bookings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          serviceId: formData.serviceId,
          staffId: formData.staffId === 'any' ? null : formData.staffId,
          date: formData.date,
          time: formData.time,
          clientName: formData.name,
          clientEmail: formData.email,
          clientPhone: formData.phone,
          notes: formData.notes,
          giftCardCode: formData.giftCardCode || undefined
        }),
      })

      const data = await response.json()

      if (data.error) {
        alert(data.error)
        return
      }

      if (data.requiresDeposit) {
        // Redirect to payment for deposit
        const paymentResponse = await fetch('/api/payment/create-session', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            items: [],
            clientId: 'guest',
            isPickup: true,
            depositAmountCents: data.depositAmountCents,
            giftCardCode: formData.giftCardCode || undefined
          })
        })

        const paymentData = await paymentResponse.json()
        if (paymentData.url) {
          window.location.href = paymentData.url
        }
      } else {
        // Booking confirmed
        router.push(`/checkout/success?booking_id=${data.bookingId}`)
      }
    } catch (error) {
      console.error('Booking failed:', error)
      alert('Booking failed. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      {/* Progress Steps */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          {steps.map((step, index) => {
            const Icon = step.icon
            const isActive = currentStep === step.id
            const isCompleted = currentStep > step.id
            
            return (
              <div key={step.id} className="flex items-center">
                <div className={`flex items-center justify-center w-10 h-10 rounded-full border-2 ${
                  isActive ? 'border-brand-red bg-brand-red text-white' :
                  isCompleted ? 'border-green-500 bg-green-500 text-white' :
                  'border-gray-300 text-gray-500'
                }`}>
                  {isCompleted ? (
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  ) : (
                    <Icon className="w-5 h-5" />
                  )}
                </div>
                <span className={`ml-2 text-sm font-medium ${
                  isActive ? 'text-brand-red' : 'text-gray-500'
                }`}>
                  {step.name}
                </span>
                {index < steps.length - 1 && (
                  <div className={`w-16 h-0.5 mx-4 ${
                    isCompleted ? 'bg-green-500' : 'bg-gray-300'
                  }`} />
                )}
              </div>
            )
          })}
        </div>
      </div>

      {/* Form Content */}
      <div className="bg-white rounded-lg shadow-lg p-6">
        {currentStep === 1 && (
          <div>
            <h3 className="text-lg font-semibold mb-4">Select Service & Staff</h3>
            <ServiceSelection
              formData={{
                service: formData.serviceId,
                staff: formData.staffId === 'any' ? 'No Preference' : formData.staffId
              }}
              handleChange={handleServiceChange}
            />
            <div className="mt-6 flex justify-end">
              <button
                onClick={nextStep}
                disabled={!formData.serviceId}
                className="px-6 py-2 bg-brand-red text-white rounded-md hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Next
              </button>
            </div>
          </div>
        )}

        {currentStep === 2 && (
          <div>
            <h3 className="text-lg font-semibold mb-4">Select Date & Time</h3>
            <p className="text-gray-600 mb-4">Date and time selection coming soon...</p>
            <div className="flex justify-between">
              <button
                onClick={prevStep}
                className="px-6 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
              >
                Back
              </button>
              <button
                onClick={nextStep}
                className="px-6 py-2 bg-brand-red text-white rounded-md hover:bg-red-700"
              >
                Next
              </button>
            </div>
          </div>
        )}

        {currentStep === 3 && (
          <div>
            <h3 className="text-lg font-semibold mb-4">Personal Information</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Name *</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => updateFormData('name', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-red focus:border-transparent"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Email *</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => updateFormData('email', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-red focus:border-transparent"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Phone *</label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => updateFormData('phone', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-red focus:border-transparent"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Notes (Optional)</label>
                <textarea
                  value={formData.notes}
                  onChange={(e) => updateFormData('notes', e.target.value)}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-red focus:border-transparent"
                  placeholder="Any special requests or things we should know?"
                />
              </div>
            </div>
            <div className="mt-6 flex justify-between">
              <button
                onClick={prevStep}
                className="px-6 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
              >
                Back
              </button>
              <button
                onClick={nextStep}
                disabled={!formData.name || !formData.email || !formData.phone}
                className="px-6 py-2 bg-brand-red text-white rounded-md hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Next
              </button>
            </div>
          </div>
        )}

        {currentStep === 4 && (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold mb-4">Payment & Confirmation</h3>
              
              {/* Booking Summary */}
              <div className="bg-gray-50 rounded-lg p-4 mb-6">
                <h4 className="font-medium mb-3">Booking Summary</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Service:</span>
                    <span className="font-medium">{formData.serviceId}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Date:</span>
                    <span className="font-medium">{formData.date || 'To be selected'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Time:</span>
                    <span className="font-medium">{formData.time || 'To be selected'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Name:</span>
                    <span className="font-medium">{formData.name}</span>
                  </div>
                </div>
              </div>

              {/* Gift Card Input */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Gift Card Code (Optional)
                </label>
                <input
                  type="text"
                  value={formData.giftCardCode}
                  onChange={(e) => updateFormData('giftCardCode', e.target.value.toUpperCase())}
                  placeholder="Enter gift card code"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-red focus:border-transparent"
                />
              </div>

              {/* Action Buttons */}
              <div className="flex justify-between">
                <button
                  onClick={prevStep}
                  className="px-6 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                >
                  Back
                </button>
                <button
                  onClick={handleSubmit}
                  disabled={isSubmitting}
                  className="px-6 py-2 bg-brand-red text-white rounded-md hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? 'Processing...' : 'Confirm Booking'}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}