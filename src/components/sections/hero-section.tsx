'use client'

import { Button } from '@/components/ui/button'
import { Calendar, Phone, MapPin } from 'lucide-react'
import { motion } from 'framer-motion'

export function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Background Image Overlay */}
      <div className="absolute inset-0 bg-black/50 z-10" />
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: "url('https://images.unsplash.com/photo-1585747860715-2ba37e788b70?ixlib=rb-4.0.3&auto=format&fit=crop&w=2074&q=80')"
        }}
      />
      
      <div className="relative z-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-white">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold tracking-tight mb-6">
            Modern Men
            <span className="block text-3xl sm:text-4xl lg:text-5xl font-light text-amber-400 mt-2">
              Hair Salon
            </span>
          </h1>
          <p className="text-xl sm:text-2xl lg:text-3xl font-light mb-4 text-amber-100">
            A Modern Haircut for a Modern Man
          </p>
          <p className="text-lg sm:text-xl text-gray-200 mb-8 max-w-3xl mx-auto">
            Regina's premier destination for men's grooming. Experience the highest level of 
            service and satisfaction with our team of incomparably talented stylists and barbers.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12"
        >
          <Button size="lg" className="bg-amber-600 hover:bg-amber-700 text-white font-semibold px-8 py-4 text-lg">
            <Calendar className="mr-2 h-5 w-5" />
            Book Appointment
          </Button>
          <Button variant="outline" size="lg" className="border-white text-white hover:bg-white hover:text-slate-900 px-8 py-4 text-lg">
            <Phone className="mr-2 h-5 w-5" />
            (306) 522-4111
          </Button>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="flex flex-col sm:flex-row gap-6 justify-center items-center text-sm text-gray-300"
        >
          <div className="flex items-center gap-2">
            <MapPin className="h-4 w-4" />
            <span>#4 - 425 Victoria Ave East, Regina, SK</span>
          </div>
          <div className="hidden sm:block w-px h-4 bg-gray-400" />
          <div>
            <span>Mon-Sat: 9am-8pm</span>
          </div>
        </motion.div>
      </div>
    </section>
  )
}