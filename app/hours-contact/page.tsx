'use client'

import { motion } from 'framer-motion'
import { ClockIcon, PhoneIcon, MapPinIcon } from '@heroicons/react/24/outline'
import HoursDisplay from '../components/hours/HoursDisplay'
import ContactInfo from '../components/contact/ContactInfo'
import LocationMap from '../components/contact/LocationMap'

export default function HoursContactPage() {
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
    <section className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Hours & Contact
          </h2>
          <p className="text-xl text-gray-600">
            Visit us during our operating hours or get in touch
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
              className="bg-gray-50 p-8 rounded-lg border border-gray-200"
            >
              <div className="flex items-center mb-6">
                <ClockIcon className="h-8 w-8 text-orange-500 mr-3" />
                <h3 className="text-2xl font-bold text-gray-900">Hours</h3>
              </div>
              <HoursDisplay hours={hours} />
            </motion.div>

            {/* Contact */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              viewport={{ once: true }}
              className="bg-gray-50 p-8 rounded-lg border border-gray-200"
            >
              <div className="flex items-center mb-6">
                <PhoneIcon className="h-8 w-8 text-orange-500 mr-3" />
                <h3 className="text-2xl font-bold text-gray-900">Contact Us</h3>
              </div>
              <ContactInfo />
            </motion.div>
          </div>

          {/* Google Map */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            viewport={{ once: true }}
            className="bg-gray-50 p-8 rounded-lg border border-gray-200"
          >
            <div className="flex items-center mb-6">
              <MapPinIcon className="h-8 w-8 text-orange-500 mr-3" />
              <h3 className="text-2xl font-bold text-gray-900">Find Us</h3>
            </div>
            <LocationMap />
          </motion.div>
        </div>

        {/* Booking Options */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          viewport={{ once: true }}
          className="text-center bg-gray-50 p-8 rounded-lg border border-gray-200"
        >
          <h3 className="text-2xl font-bold text-gray-900 mb-6">Ready to Book?</h3>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <a href="/book" className="btn-primary">
              📅 Online Booking
            </a>
            <a href="tel:+13065224111" className="btn-secondary">
              📞 Call (306) 522-4111
            </a>
            <button 
              onClick={() => window.open('https://m.me/modernmenhairsalon', '_blank')}
              className="btn-secondary"
            >
              💬 Facebook Messenger
            </button>
          </div>
          <p className="text-sm text-gray-500 mt-4">
            If you require prompt or timely response please call the salon directly during business hours
          </p>
        </motion.div>
      </div>
    </section>
  )
}
