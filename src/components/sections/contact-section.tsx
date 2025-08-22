'use client'

import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { motion } from 'framer-motion'
import { Phone, MapPin, Clock, Calendar, Facebook, Instagram } from 'lucide-react'

const hours = [
  { day: 'Monday', time: '9am - 6pm' },
  { day: 'Tuesday', time: '9am - 5pm' },
  { day: 'Wednesday', time: '9am - 8pm' },
  { day: 'Thursday', time: '9am - 8pm' },
  { day: 'Friday', time: '9am - 5pm' },
  { day: 'Saturday', time: '9am - 5pm' },
  { day: 'Sunday', time: 'Closed' }
]

export function ContactSection() {
  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 bg-amber-50">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl sm:text-5xl font-bold tracking-tight text-slate-900 mb-4">
              Book Your Appointment
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Ready to experience the Modern Men difference? Contact us today to schedule 
              your appointment with Regina's premier men's grooming specialists.
            </p>
          </motion.div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Contact Info */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <Card className="h-full">
              <CardContent className="p-6">
                <h3 className="text-2xl font-bold text-slate-900 mb-6">Get In Touch</h3>
                
                <div className="space-y-4 mb-8">
                  <div className="flex items-start gap-3">
                    <Phone className="h-5 w-5 text-amber-600 mt-1 flex-shrink-0" />
                    <div>
                      <p className="font-medium text-slate-900">(306) 522-4111</p>
                      <p className="text-sm text-gray-600">Main Line</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3">
                    <Phone className="h-5 w-5 text-amber-600 mt-1 flex-shrink-0" />
                    <div>
                      <p className="font-medium text-slate-900">(306) 541-5511</p>
                      <p className="text-sm text-gray-600">Alternative</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3">
                    <MapPin className="h-5 w-5 text-amber-600 mt-1 flex-shrink-0" />
                    <div>
                      <p className="font-medium text-slate-900">#4 - 425 Victoria Ave East</p>
                      <p className="text-sm text-gray-600">Regina, SK, S4N 0N8</p>
                    </div>
                  </div>
                </div>

                <div className="flex gap-4">
                  <Button variant="outline" size="sm">
                    <Facebook className="h-4 w-4" />
                  </Button>
                  <Button variant="outline" size="sm">
                    <Instagram className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Hours */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            viewport={{ once: true }}
          >
            <Card className="h-full">
              <CardContent className="p-6">
                <div className="flex items-center gap-2 mb-6">
                  <Clock className="h-5 w-5 text-amber-600" />
                  <h3 className="text-2xl font-bold text-slate-900">Hours</h3>
                </div>
                
                <div className="space-y-3">
                  {hours.map((item) => (
                    <div key={item.day} className="flex justify-between items-center">
                      <span className="text-slate-900 font-medium">{item.day}</span>
                      <span className="text-gray-600">{item.time}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* CTA */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            viewport={{ once: true }}
          >
            <Card className="h-full bg-amber-600 text-white">
              <CardContent className="p-6 text-center">
                <Calendar className="h-12 w-12 mx-auto mb-4" />
                <h3 className="text-2xl font-bold mb-4">Book Online</h3>
                <p className="mb-6">
                  Schedule your appointment online for the fastest and most convenient booking experience.
                </p>
                <Button variant="secondary" className="w-full mb-4">
                  Book Appointment
                </Button>
                <p className="text-sm text-amber-100">
                  Please give us 24 hours notice for cancellations to avoid charges.
                </p>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </section>
  )
}