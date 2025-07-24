'use client'

import { motion } from 'framer-motion'
import { ClockIcon, PhoneIcon, MapPinIcon } from '@heroicons/react/24/outline'

export default function HoursContactPage() {
  const hours = [
    { day: 'Monday', time: '9:00 AM - 6:00 PM' },
    { day: 'Tuesday', time: '9:00 AM - 5:00 PM' },
    { day: 'Wednesday', time: '9:00 AM - 8:00 PM' },
    { day: 'Thursday', time: '9:00 AM - 8:00 PM' },
    { day: 'Friday', time: '9:00 AM - 5:00 PM' },
    { day: 'Saturday', time: '9:00 AM - 5:00 PM' },
    { day: 'Sunday', time: 'Closed' },
  ]

  return (
    <section className="py-24 bg-salon-dark text-white">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl font-bold mb-4">
            Hours & Contact
          </h2>
          <p className="text-xl text-gray-300">
            Visit us during our operating hours
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-12">
          {/* Contact Info */}
          <div className="space-y-8">
            {/* Hours */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="bg-gray-800 p-8 rounded-lg"
            >
              <div className="flex items-center mb-6">
                <ClockIcon className="h-8 w-8 text-salon-gold mr-3" />
                <h3 className="text-2xl font-bold">Hours</h3>
              </div>
              <div className="space-y-3">
                {hours.map((schedule) => (
                  <div key={schedule.day} className="flex justify-between">
                    <span className="font-medium">{schedule.day}</span>
                    <span className="text-salon-gold">{schedule.time}</span>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Contact */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              viewport={{ once: true }}
              className="bg-gray-800 p-8 rounded-lg"
            >
              <div className="flex items-center mb-6">
                <PhoneIcon className="h-8 w-8 text-salon-gold mr-3" />
                <h3 className="text-2xl font-bold">Contact Us</h3>
              </div>
              <div className="space-y-4">
                <div>
                  <p className="text-gray-300">Give Us A Call</p>
                  <a href="tel:3065224111" className="text-salon-gold text-lg font-semibold hover:text-yellow-400 transition-colors">
                    (306) 522-4111
                  </a>
                </div>
                <div>
                  <p className="text-gray-300">Send Us A Text</p>
                  <a href="sms:3065415511" className="text-salon-gold hover:text-yellow-400 transition-colors">
                    (306) 541-5511
                  </a>
                </div>
                <div>
                  <p className="text-gray-300">Email Us</p>
                  <a href="mailto:info@modernmen.ca" className="text-salon-gold hover:text-yellow-400 transition-colors">
                    info@modernmen.ca
                  </a>
                </div>
                <div className="pt-4">
                  <p className="text-gray-300 mb-2">Connect With Us</p>
                  <div className="flex space-x-4">
                    <a 
                      href="https://instagram.com/modernmenhairsalon" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-salon-gold hover:text-yellow-400 transition-colors"
                    >
                      <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                      </svg>
                    </a>
                    <button 
                      onClick={() => window.open('https://m.me/modernmenhairsalon', '_blank')}
                      className="text-salon-gold hover:text-yellow-400 transition-colors"
                      title="Facebook Messenger"
                    >
                      <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 0C5.373 0 0 4.975 0 11.111c0 3.497 1.745 6.616 4.472 8.652V24l4.086-2.242c1.09.301 2.246.464 3.442.464 6.627 0 12-4.974 12-11.111C24 4.975 18.627 0 12 0zm1.193 14.963l-3.056-3.259-5.963 3.259L10.732 8.2l3.13 3.259L19.752 8.2l-6.559 6.763z"/>
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Google Map */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            viewport={{ once: true }}
            className="bg-gray-800 p-8 rounded-lg"
          >
            <div className="flex items-center mb-6">
              <MapPinIcon className="h-8 w-8 text-salon-gold mr-3" />
              <h3 className="text-2xl font-bold">Find Us</h3>
            </div>
            <div className="mb-4">
              <p className="text-salon-gold font-semibold">#4 - 425 Victoria Ave East</p>
              <p className="text-white">Regina, SK S4N 0N8</p>
            </div>
            
            {/* Google Maps Embed */}
            <div className="w-full h-64 rounded-lg overflow-hidden">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2540.123456789!2d-104.6177!3d50.4452!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x531c1e40fba0b5f1%3A0x123456789!2s425%20Victoria%20Ave%20E%2C%20Regina%2C%20SK%20S4N%200N8!5e0!3m2!1sen!2sca!4v1234567890"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Modern Men Hair Salon Location"
              ></iframe>
            </div>
            
            <div className="mt-4 space-y-2">
              <a 
                href="https://maps.google.com/?q=425+Victoria+Ave+E,+Regina,+SK"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block btn-primary text-center w-full"
              >
                Get Directions
              </a>
              <p className="text-sm text-gray-400 text-center">
                Free parking available
              </p>
            </div>
          </motion.div>
        </div>

        {/* Additional Options */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          viewport={{ once: true }}
          className="text-center"
        >
          <h3 className="text-2xl font-bold mb-6">More Ways to Connect</h3>
          <div className="flex flex-wrap justify-center gap-4">
            <a href="/book" className="btn-primary">
              Online Booking
            </a>
            <button 
              onClick={() => window.open('https://m.me/modernmenhairsalon', '_blank')}
              className="btn-secondary"
            >
              Facebook Messenger
            </button>
            <a href="mailto:info@modernmen.ca?subject=Work%20Opportunity" className="btn-secondary">
              Work With Us
            </a>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
