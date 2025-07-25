'use client'

import Hero from './components/Hero'
import ChatBot from './components/ChatBot'
import BookingOptions from './components/booking/BookingOptions'
import HoursSection from './components/hours/HoursSection'
import Link from 'next/link'

export default function Home() {
  const hours = [
    { day: 'Monday', time: 'Closed' },
    { day: 'Tuesday', time: '10:00 AM - 7:00 PM' },
    { day: 'Wednesday', time: '10:00 AM - 7:00 PM' },
    { day: 'Thursday', time: '10:00 AM - 7:00 PM' },
    { day: 'Friday', time: '10:00 AM - 7:00 PM' },
    { day: 'Saturday', time: '10:00 AM - 7:00 PM' },
    { day: 'Sunday', time: '12:00 PM - 5:00 PM' },
  ]

  return (
    <main>
      <Hero />
      
      {/* Services Section */}
      <section className="section-padding bg-gray-50">
        <div className="container-max">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Book Now:
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Three convenient ways to schedule your appointment with Regina's premier men's grooming destination
            </p>
          </div>
          
          <BookingOptions />
          
          <div className="text-center mt-8">
            <p className="text-sm text-gray-500">
              If you require prompt or timely response please call the salon directly during business hours
            </p>
          </div>
        </div>
      </section>

      <HoursSection hours={hours} />

      {/* About Section */}
      <section className="section-padding bg-gray-50">
        <div className="container-max text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">
            Taking Men's Grooming to the Highest Level
          </h2>
          <p className="text-lg text-gray-600 max-w-4xl mx-auto mb-8 leading-relaxed">
            At Modern Men Salon we take Men's Grooming to the highest level of experience and satisfaction. 
            It is our mission to continually deliver a level of consistency in service that creates long term 
            value and support for the gentlemen we are passionate about serving. Our love for this male focused 
            grooming industry is growing along with the industry itself and our team of incomparably talented 
            men's stylists and barbers.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/about" className="btn-primary">
              Learn More About Us
            </Link>
            <Link href="/team" className="btn-secondary">
              Meet Our Team
            </Link>
          </div>
        </div>
      </section>

      <ChatBot />
    </main>
  )
}
