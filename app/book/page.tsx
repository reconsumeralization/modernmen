'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import PersonalInfo from '../components/booking/PersonalInfo'
import ServiceSelection from '../components/booking/ServiceSelection'
import DateTimeSelection from '../components/booking/DateTimeSelection'
import FormField from '../components/forms/FormField'
import Textarea from '../components/forms/Textarea'

export default function BookPage() {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    service: '',
    staff: '',
    date: '',
    time: '',
    message: ''
  })

  const [isSubmitted, setIsSubmitted] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    try {
      const response = await fetch('/api/bookings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })
      
      const result = await response.json()
      
      if (response.ok) {
        console.log('Booking submitted:', result)
        setIsSubmitted(true)
        
        // Reset form after 3 seconds
        setTimeout(() => {
          setIsSubmitted(false)
          setFormData({
            name: '',
            phone: '',
            email: '',
            service: '',
            staff: '',
            date: '',
            time: '',
            message: ''
          })
        }, 3000)
      } else {
        console.error('Booking failed:', result)
        alert('Booking failed: ' + (result.error || 'Unknown error'))
      }
    } catch (error) {
      console.error('Network error:', error)
      alert('Network error. Please try again.')
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  if (isSubmitted) {
    return (
      <section className="py-24 bg-gray-50">
        <div className="max-w-3xl mx-auto px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded-lg"
          >
            <h3 className="text-2xl font-bold mb-2">Booking Request Submitted!</h3>
            <p>We'll contact you within 24 hours to confirm your appointment.</p>
          </motion.div>
        </div>
      </section>
    )
  }

  return (
    <section className="py-24 bg-gray-50">
      <div className="max-w-3xl mx-auto px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Book Your Appointment
          </h2>
          <p className="text-xl text-gray-600">
            Schedule your visit with us today
          </p>
        </motion.div>

        <motion.form
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          viewport={{ once: true }}
          onSubmit={handleSubmit}
          className="bg-white p-8 rounded-lg shadow-lg space-y-6"
        >
          <PersonalInfo formData={formData} handleChangeAction={handleChange} />
          <ServiceSelection formData={formData} handleChange={handleChange} />
          <DateTimeSelection formData={formData} handleChange={handleChange} />

          <FormField label="Additional Notes">
            <Textarea
              id="message"
              name="message"
              rows={4}
              value={formData.message}
              onChange={handleChange}
              placeholder="Any specific requests or preferences..."
            />
          </FormField>

          <button
            type="submit"
            className="w-full btn-primary"
          >
            Submit Booking Request
          </button>
        </motion.form>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          viewport={{ once: true }}
          className="mt-8 p-6 bg-yellow-50 border border-yellow-200 rounded-lg"
        >
          <h3 className="text-lg font-bold text-gray-900 mb-2">Cancellation Policy</h3>
          <p className="text-gray-700">
            We appreciate your loyalty & respect to kindly give us 24 Hours of Notice to fill your scheduled time 
            if you can no longer make your appointment. Late cancellations & Missed appointments will be subject 
            to payment for the relevant service that was scheduled.
          </p>
        </motion.div>

        {/* Customer Account CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          viewport={{ once: true }}
          className="mt-6 p-6 bg-blue-50 border border-blue-200 rounded-lg"
        >
          <h3 className="text-lg font-bold text-gray-900 mb-2">🎯 Get More with Your Account</h3>
          <p className="text-gray-700 mb-4">
            Create a free account to manage appointments, track your visit history, earn loyalty points, and get exclusive member offers!
          </p>
          <div className="flex flex-col sm:flex-row gap-3">
            <a 
              href="/portal/register"
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors text-center font-medium"
            >
              Create Free Account
            </a>
            <a 
              href="/portal/login"
              className="bg-white text-blue-600 border border-blue-600 px-6 py-2 rounded-lg hover:bg-blue-50 transition-colors text-center font-medium"
            >
              Sign In
            </a>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
