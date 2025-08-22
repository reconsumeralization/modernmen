'use client'

import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Icons } from '@/components/ui/icons'
import { toast } from 'sonner'

export default function BookAppointmentPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({
    service: '',
    date: '',
    time: '',
    notes: ''
  })

  useEffect(() => {
    if (status === 'loading') return
    if (!session) {
      router.push('/portal/login')
    }
  }, [session, status, router])

  const services = [
    { id: 'haircut', name: 'Classic Haircut', price: '$35', duration: '30 min' },
    { id: 'hair-color', name: 'Hair Coloring', price: '$85', duration: '90 min' },
    { id: 'styling', name: 'Hair Styling', price: '$45', duration: '45 min' },
    { id: 'beard-trim', name: 'Beard Trim', price: '$25', duration: '20 min' },
    { id: 'facial', name: 'Facial Treatment', price: '$65', duration: '60 min' },
    { id: 'package', name: 'Complete Package', price: '$150', duration: '2 hours' }
  ]

  const timeSlots = [
    '9:00 AM', '9:30 AM', '10:00 AM', '10:30 AM', '11:00 AM', '11:30 AM',
    '12:00 PM', '12:30 PM', '1:00 PM', '1:30 PM', '2:00 PM', '2:30 PM',
    '3:00 PM', '3:30 PM', '4:00 PM', '4:30 PM', '5:00 PM', '5:30 PM'
  ]

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
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
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Booking Form */}
          <Card className="border-0 shadow-lg">
            <CardHeader className="bg-gradient-to-r from-blue-600 to-amber-600 text-white rounded-t-lg">
              <CardTitle className="flex items-center space-x-2">
                <Icons.calendar className="h-5 w-5" />
                <span>Appointment Details</span>
              </CardTitle>
              <CardDescription className="text-blue-100">
                Fill in your appointment preferences
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-6">
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Service Selection */}
                <div className="space-y-2">
                  <Label htmlFor="service" className="text-sm font-medium text-gray-700">
                    Select Service
                  </Label>
                  <select
                    id="service"
                    value={formData.service}
                    onChange={(e) => handleInputChange('service', e.target.value)}
                    required
                    className="w-full p-3 border border-amber-200 rounded-lg focus:border-amber-400 focus:ring-amber-400 bg-white"
                  >
                    <option value="">Choose a service...</option>
                    {services.map(service => (
                      <option key={service.id} value={service.name}>
                        {service.name} - {service.price} ({service.duration})
                      </option>
                    ))}
                  </select>
                </div>

                {/* Date Selection */}
                <div className="space-y-2">
                  <Label htmlFor="date" className="text-sm font-medium text-gray-700">
                    Preferred Date
                  </Label>
                  <Input
                    id="date"
                    type="date"
                    value={formData.date}
                    onChange={(e) => handleInputChange('date', e.target.value)}
                    required
                    min={new Date().toISOString().split('T')[0]}
                    className="border-amber-200 focus:border-amber-400 focus:ring-amber-400"
                  />
                </div>

                {/* Time Selection */}
                <div className="space-y-2">
                  <Label htmlFor="time" className="text-sm font-medium text-gray-700">
                    Preferred Time
                  </Label>
                  <select
                    id="time"
                    value={formData.time}
                    onChange={(e) => handleInputChange('time', e.target.value)}
                    required
                    className="w-full p-3 border border-amber-200 rounded-lg focus:border-amber-400 focus:ring-amber-400 bg-white"
                  >
                    <option value="">Choose a time...</option>
                    {timeSlots.map(time => (
                      <option key={time} value={time}>{time}</option>
                    ))}
                  </select>
                </div>

                {/* Notes */}
                <div className="space-y-2">
                  <Label htmlFor="notes" className="text-sm font-medium text-gray-700">
                    Special Notes (Optional)
                  </Label>
                  <Textarea
                    id="notes"
                    value={formData.notes}
                    onChange={(e) => handleInputChange('notes', e.target.value)}
                    placeholder="Any special requests or notes for your stylist..."
                    rows={4}
                    className="border-amber-200 focus:border-amber-400 focus:ring-amber-400 resize-none"
                  />
                </div>

                <Button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-gradient-to-r from-blue-600 to-amber-600 hover:from-blue-700 hover:to-amber-700 text-white font-semibold py-3 rounded-lg shadow-lg hover:shadow-xl transition-all duration-200"
                >
                  {isLoading ? (
                    <>
                      <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
                      Booking Appointment...
                    </>
                  ) : (
                    <>
                      <Icons.calendar className="mr-2 h-4 w-4" />
                      Book Appointment
                    </>
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Services Preview */}
          <div className="space-y-6">
            <Card className="border-0 shadow-lg">
              <CardHeader className="bg-gradient-to-r from-amber-600 to-blue-600 text-white rounded-t-lg">
                <CardTitle className="flex items-center space-x-2">
                  <Icons.scissors className="h-5 w-5" />
                  <span>Our Services</span>
                </CardTitle>
                <CardDescription className="text-amber-100">
                  Professional hair care services
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="space-y-4">
                  {services.map(service => (
                    <div key={service.id} className="flex justify-between items-center p-3 bg-gradient-to-r from-amber-50 to-blue-50 rounded-lg border border-amber-100">
                      <div>
                        <h4 className="font-semibold text-gray-800">{service.name}</h4>
                        <p className="text-sm text-gray-600">{service.duration}</p>
                      </div>
                      <span className="font-bold text-blue-600">{service.price}</span>
                    </div>
                  ))}
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
          </div>
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
