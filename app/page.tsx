'use client'

import Hero from './components/Hero'
import ChatBot from './components/ChatBot'
import Link from 'next/link'

export default function Home() {
  return (
    <main>
      <Hero />
      
      {/* Quick Navigation Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-salon-dark mb-4">
              Explore Our Services
            </h2>
            <p className="text-xl text-gray-600">
              Everything you need for the perfect grooming experience
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Link href="/services" className="group">
              <div className="bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 text-center">
                <div className="text-4xl mb-4">✂️</div>
                <h3 className="text-xl font-bold text-salon-dark mb-2">Services</h3>
                <p className="text-gray-600">Professional cuts & styling</p>
              </div>
            </Link>
            
            <Link href="/team" className="group">
              <div className="bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 text-center">
                <div className="text-4xl mb-4">👥</div>
                <h3 className="text-xl font-bold text-salon-dark mb-2">Our Team</h3>
                <p className="text-gray-600">Meet our skilled stylists</p>
              </div>
            </Link>
            
            <Link href="/products" className="group">
              <div className="bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 text-center">
                <div className="text-4xl mb-4">🛍️</div>
                <h3 className="text-xl font-bold text-salon-dark mb-2">Products</h3>
                <p className="text-gray-600">Premium grooming products</p>
              </div>
            </Link>
            
            <Link href="/book" className="group">
              <div className="bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 text-center">
                <div className="text-4xl mb-4">📅</div>
                <h3 className="text-xl font-bold text-salon-dark mb-2">Book Now</h3>
                <p className="text-gray-600">Schedule your appointment</p>
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="py-16 bg-salon-dark text-white">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-6">
            Taking Men's Grooming to the Highest Level
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto mb-8">
            At Modern Men Salon we take Men's Grooming to the highest level of experience and satisfaction. 
            It is our mission to continually deliver a level of consistency in service that creates long term 
            value and support for the gentlemen we are passionate about serving.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/about" className="btn-primary">
              Learn More About Us
            </Link>
            <Link href="/hours-contact" className="btn-secondary">
              Visit Us Today
            </Link>
          </div>
        </div>
      </section>

      <ChatBot />
    </main>
  )
}
