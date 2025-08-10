'use client'

import EnhancedBookingForm from '../components/booking/enhanced/EnhancedBookingForm'
import { CalendarDaysIcon, ClockIcon, UserGroupIcon, SparklesIcon } from '@heroicons/react/24/outline'

export default function EnhancedBookPage() {
  const features = [
    {
      icon: CalendarDaysIcon,
      title: 'Real-time Availability',
      description: 'See available slots instantly'
    },
    {
      icon: UserGroupIcon,
      title: 'Choose Your Stylist',
      description: 'Pick your preferred barber'
    },
    {
      icon: ClockIcon,
      title: '24/7 Booking',
      description: 'Book anytime, anywhere'
    },
    {
      icon: SparklesIcon,
      title: 'Instant Confirmation',
      description: 'Get confirmation immediately'
    }
  ]
  
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-b from-gray-900 to-gray-800 text-white py-16">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Book Your Appointment
          </h1>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            Experience the convenience of online booking with real-time availability
          </p>
        </div>
      </section>      
      {/* Features */}
      <section className="py-12 border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <div
                key={feature.title}
                className="text-center"
              >
                <feature.icon className="h-10 w-10 text-gray-900 mx-auto mb-2" />
                <h3 className="font-medium text-gray-900">{feature.title}</h3>
                <p className="text-sm text-gray-600 mt-1">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
      
      {/* Booking Form */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <EnhancedBookingForm />
        </div>
      </section>
      
      {/* Trust Badges */}
      <section className="py-12 bg-white border-t border-gray-200">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 text-center">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <h4 className="text-2xl font-bold text-gray-900">1000+</h4>
              <p className="text-gray-600 mt-1">Happy Customers</p>
            </div>
            <div>
              <h4 className="text-2xl font-bold text-gray-900">4.9/5</h4>
              <p className="text-gray-600 mt-1">Average Rating</p>
            </div>
            <div>
              <h4 className="text-2xl font-bold text-gray-900">15+</h4>
              <p className="text-gray-600 mt-1">Years Experience</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}