'use client'

import { motion } from 'framer-motion'
import { CheckCircle } from 'lucide-react'

export function AboutSection() {
  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl sm:text-5xl font-bold tracking-tight text-slate-900 mb-6">
              Why Choose Modern Men?
            </h2>
            <p className="text-lg text-gray-600 mb-6">
              At Modern Men Salon we take Men's Grooming to the highest level of experience 
              and satisfaction. We are a group of highly skilled individuals who love what we 
              do and genuinely care about your experience!
            </p>
            <p className="text-lg text-gray-600 mb-8">
              Our love for this male focused grooming industry is growing along with the industry 
              itself and our team of incomparably talented men's stylists and barbers.
            </p>
            
            <div className="space-y-4">
              {[
                'Highly skilled and experienced stylists',
                'Premium products and equipment',
                'Personalized service for every client',
                'Modern facility in downtown Regina',
                'Flexible scheduling and online booking'
              ].map((feature, index) => (
                <motion.div
                  key={feature}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="flex items-center gap-3"
                >
                  <CheckCircle className="h-5 w-5 text-amber-600 flex-shrink-0" />
                  <span className="text-gray-700">{feature}</span>
                </motion.div>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="relative"
          >
            <div className="aspect-square rounded-2xl overflow-hidden shadow-2xl">
              <img
                src="https://images.unsplash.com/photo-1621605815971-fbc98d665033?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80"
                alt="Modern Men Hair Salon Interior"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="absolute -bottom-6 -right-6 bg-amber-600 text-white p-6 rounded-xl shadow-xl">
              <div className="text-center">
                <div className="text-3xl font-bold">20+</div>
                <div className="text-sm">Years Experience</div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}