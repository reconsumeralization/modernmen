'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Scissors, Zap, Brush, Award } from 'lucide-react'
import { motion } from 'framer-motion'

const services = [
  {
    icon: Scissors,
    title: 'Premium Haircuts',
    description: 'Expert cuts tailored to your style and lifestyle',
    price: 'From $45',
    features: ['Consultation', 'Wash & Style', 'Hot Towel Finish']
  },
  {
    icon: Zap,
    title: 'Traditional Shaves',
    description: 'Classic hot towel shaves for the ultimate experience',
    price: 'From $35',
    features: ['Hot Towel Treatment', 'Premium Products', 'Aftercare']
  },
  {
    icon: Brush,
    title: 'Beard Grooming',
    description: 'Professional beard trimming and styling',
    price: 'From $25',
    features: ['Trim & Shape', 'Beard Oil Treatment', 'Styling Advice']
  },
  {
    icon: Award,
    title: 'Full Service',
    description: 'Complete grooming package for the modern gentleman',
    price: 'From $75',
    features: ['Cut & Style', 'Beard Trim', 'Hot Towel Shave']
  }
]

export function ServicesSection() {
  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-50">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl sm:text-5xl font-bold tracking-tight text-slate-900 mb-4">
              Our Services
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              We take men's grooming to the highest level of experience and satisfaction. 
              Our mission is to deliver consistency in service that creates long-term value.
            </p>
          </motion.div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {services.map((service, index) => (
            <motion.div
              key={service.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: index * 0.1 }}
              viewport={{ once: true }}
            >
              <Card className="h-full hover:shadow-xl transition-all duration-300 border-0 shadow-lg">
                <CardHeader className="text-center pb-4">
                  <div className="mx-auto mb-4 p-3 bg-amber-100 rounded-full w-16 h-16 flex items-center justify-center">
                    <service.icon className="h-8 w-8 text-amber-600" />
                  </div>
                  <CardTitle className="text-xl text-slate-900">{service.title}</CardTitle>
                  <CardDescription className="text-gray-600">
                    {service.description}
                  </CardDescription>
                </CardHeader>
                <CardContent className="text-center">
                  <div className="mb-4">
                    <span className="text-2xl font-bold text-amber-600">{service.price}</span>
                  </div>
                  <ul className="space-y-2 text-sm text-gray-600">
                    {service.features.map((feature) => (
                      <li key={feature} className="flex items-center justify-center gap-2">
                        <div className="w-1.5 h-1.5 bg-amber-600 rounded-full" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}