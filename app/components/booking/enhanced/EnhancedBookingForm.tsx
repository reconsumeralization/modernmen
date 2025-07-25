'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import AvailabilityCalendar from './AvailabilityCalendar'
import { CheckCircleIcon } from '@heroicons/react/24/solid'

interface Service {
  id: string
  name: string
  price: number
  duration: number
  category: string
}

interface Staff {
  id: string
  firstName: string
  lastName: string
  specialties: string[]
  isActive: boolean
}

export default function EnhancedBookingForm() {
  const [step, setStep] = useState(1)
  const [services, setServices] = useState<Service[]>([])
  const [staff, setStaff] = useState<Staff[]>([])
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    // Personal Info
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    // Service Selection
    serviceId: '',
    staffId: '',
    // Date & Time
    date: '',
    time: '',
    // Additional
    notes: '',
    marketingConsent: false
  })
  
  // Fetch services on mount
  useEffect(() => {
    fetchServices()
    fetchStaff()
  }, [])  
  const fetchServices = async () => {
    try {
      const response = await fetch('/api/services')
      if (response.ok) {
        const data = await response.json()
        setServices(data)
      }
    } catch (error) {
      console.error('Error fetching services:', error)
    }
  }
  
  const fetchStaff = async () => {
    try {
      const response = await fetch('/api/staff')
      if (response.ok) {
        const data = await response.json()
        setStaff(data.filter((s: Staff) => s.isActive))
      }
    } catch (error) {
      console.error('Error fetching staff:', error)
    }
  }
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    }))
  }
  
  const handleTimeSelect = (date: string, time: string) => {
    setFormData(prev => ({
      ...prev,
      date,
      time
    }))
  }  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    
    try {
      // Create client first
      const clientResponse = await fetch('/api/clients', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email,
          phone: formData.phone
        })
      })
      
      if (!clientResponse.ok) {
        throw new Error('Failed to create client')
      }
      
      const client = await clientResponse.json()
      
      // Get service details
      const selectedService = services.find(s => s.id === formData.serviceId)
      
      // Create booking
      const bookingResponse = await fetch('/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          clientId: client.id,
          staffId: formData.staffId,
          serviceId: formData.serviceId,
          date: `${formData.date}T${formData.time}:00`,
          duration: selectedService?.duration || 30,
          price: selectedService?.price || 0,
          notes: formData.notes,
          status: 'PENDING'
        })
      })      
      if (!bookingResponse.ok) {
        throw new Error('Failed to create booking')
      }
      
      // Success - move to confirmation
      setStep(4)
    } catch (error) {
      console.error('Booking error:', error)
      alert('Failed to create booking. Please try again.')
    } finally {
      setLoading(false)
    }
  }
  
  const canProceed = () => {
    switch (step) {
      case 1:
        return formData.firstName && formData.lastName && formData.email && formData.phone
      case 2:
        return formData.serviceId && formData.staffId
      case 3:
        return formData.date && formData.time
      default:
        return false
    }
  }
  
  return (
    <div className="max-w-4xl mx-auto">
      {/* Progress Bar */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          {['Personal Info', 'Service & Staff', 'Date & Time', 'Confirmation'].map((label, index) => (
            <div key={label} className="flex-1 relative">              <div className={`
                flex items-center justify-center w-10 h-10 rounded-full border-2 
                ${step > index + 1 
                  ? 'bg-green-500 border-green-500 text-white' 
                  : step === index + 1
                  ? 'bg-gray-900 border-gray-900 text-white'
                  : 'bg-white border-gray-300 text-gray-500'
                }
              `}>
                {step > index + 1 ? (
                  <CheckCircleIcon className="w-6 h-6" />
                ) : (
                  <span className="text-sm font-medium">{index + 1}</span>
                )}
              </div>
              <span className={`
                absolute top-12 left-1/2 transform -translate-x-1/2 text-xs whitespace-nowrap
                ${step >= index + 1 ? 'text-gray-900' : 'text-gray-500'}
              `}>
                {label}
              </span>
              {index < 3 && (
                <div className={`
                  absolute top-5 left-10 w-full h-0.5 -z-10
                  ${step > index + 1 ? 'bg-green-500' : 'bg-gray-300'}
                `} />
              )}
            </div>
          ))}
        </div>
      </div>      
      {/* Form Steps */}
      <motion.div
        key={step}
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -20 }}
        transition={{ duration: 0.3 }}
      >
        {/* Step 1: Personal Information */}
        {step === 1 && (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Personal Information</h2>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  First Name *
                </label>
                <input
                  type="text"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-900"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Last Name *
                </label>
                <input
                  type="text"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-900"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email *
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-900"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Phone *
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-900"
                  required
                />
              </div>
            </div>
            <div className="mt-6">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  name="marketingConsent"
                  checked={formData.marketingConsent}
                  onChange={handleInputChange}
                  className="h-4 w-4 text-gray-900 focus:ring-gray-900 border-gray-300 rounded"
                />
                <span className="ml-2 text-sm text-gray-600">
                  I agree to receive promotional emails and SMS messages
                </span>
              </label>
            </div>
          </div>
        )}        
        {/* Step 2: Service & Staff Selection */}
        {step === 2 && (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Select Service & Stylist</h2>
            
            {/* Service Selection */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Choose Your Service *
              </label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {services.map(service => (
                  <button
                    key={service.id}
                    type="button"
                    onClick={() => setFormData(prev => ({ ...prev, serviceId: service.id }))}
                    className={
                      `p-4 rounded-lg border-2 text-left transition-all ${formData.serviceId === service.id ? 'border-gray-900 bg-gray-50' : 'border-gray-200 hover:border-gray-300'}`
                    }
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="font-medium text-gray-900">{service.name}</h4>
                        <p className="text-sm text-gray-600 mt-1">
                          {service.duration} minutes
                        </p>
                      </div>
                      <span className="text-lg font-bold text-gray-900">
                        ${service.price}
                      </span>
                    </div>
                  </button>
                ))}
              </div>
            </div>            
            {/* Staff Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Choose Your Stylist *
              </label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {staff.map(member => (
                  <button
                    key={member.id}
                    type="button"
                    onClick={() => setFormData(prev => ({ ...prev, staffId: member.id }))}
                    className={
                      `p-4 rounded-lg border-2 text-left transition-all ${formData.staffId === member.id ? 'border-gray-900 bg-gray-50' : 'border-gray-200 hover:border-gray-300'}`
                    }
                  >
                    <h4 className="font-medium text-gray-900">
                      {member.firstName} {member.lastName}
                    </h4>
                    <p className="text-sm text-gray-600 mt-1">
                      {member.specialties.join(', ')}
                    </p>
                  </button>
                ))}
                <button
                  type="button"
                  onClick={() => setFormData(prev => ({ ...prev, staffId: 'any' }))}
                  className={
                    `p-4 rounded-lg border-2 text-left transition-all ${formData.staffId === 'any' ? 'border-gray-900 bg-gray-50' : 'border-gray-200 hover:border-gray-300'}`
                  }
                >
                  <h4 className="font-medium text-gray-900">No Preference</h4>
                  <p className="text-sm text-gray-600 mt-1">
                    We'll assign the best available stylist
                  </p>
                </button>
              </div>
            </div>
          </div>
        )}        
        {/* Step 3: Date & Time Selection */}
        {step === 3 && (
          <div className="space-y-6">
            <AvailabilityCalendar
              staffId={formData.staffId}
              serviceId={formData.serviceId}
              onSelectSlot={handleTimeSelect}
            />
            
            {/* Additional Notes */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Additional Notes (Optional)
              </label>
              <textarea
                name="notes"
                value={formData.notes}
                onChange={handleInputChange}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-900"
                placeholder="Any special requests or things we should know?"
              />
            </div>
          </div>
        )}
        
        {/* Step 4: Confirmation */}
        {step === 4 && (
          <div className="bg-green-50 rounded-lg p-8 text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircleIcon className="w-10 h-10 text-green-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Booking Confirmed!
            </h2>
            <p className="text-gray-600 mb-6">
              We've received your booking request and will send you a confirmation email shortly.
            </p>
            <div className="bg-white rounded-lg p-4 text-left max-w-md mx-auto">
              <h3 className="font-medium text-gray-900 mb-2">Booking Details:</h3>
              <div className="space-y-1 text-sm text-gray-600">
                <p>Date: {formData.date}</p>
                <p>Time: {formData.time}</p>
                <p>Service: {services.find(s => s.id === formData.serviceId)?.name}</p>
                <p>Stylist: {staff.find(s => s.id === formData.staffId)?.firstName || 'To be assigned'}</p>
              </div>
            </div>
          </div>
        )}
      </motion.div>      
      {/* Navigation Buttons */}
      {step < 4 && (
        <div className="flex justify-between mt-8">
          <button
            type="button"
            onClick={() => setStep(step - 1)}
            disabled={step === 1}
            className={
              `px-6 py-2 rounded-md font-medium transition-all ${step === 1 ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`
            }
          >
            Back
          </button>
          
          {step < 3 ? (
            <button
              type="button"
              onClick={() => setStep(step + 1)}
              disabled={!canProceed()}
              className={
                `px-6 py-2 rounded-md font-medium transition-all ${canProceed() ? 'bg-gray-900 text-white hover:bg-gray-800' : 'bg-gray-100 text-gray-400 cursor-not-allowed'}`
              }
            >
              Next
            </button>
          ) : (
            <button
              type="button"
              onClick={handleSubmit}
              disabled={!canProceed() || loading}
              className={
                `px-6 py-2 rounded-md font-medium transition-all flex items-center gap-2 ${canProceed() && !loading ? 'bg-gray-900 text-white hover:bg-gray-800' : 'bg-gray-100 text-gray-400 cursor-not-allowed'}`
              }
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  Confirming...
                </>
              ) : (
                'Confirm Booking'
              )}
            </button>
          )}
        </div>
      )}
    </div>
  )
}