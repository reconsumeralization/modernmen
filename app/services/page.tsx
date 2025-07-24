'use client'

import { motion } from 'framer-motion'
import { ScissorsIcon, SparklesIcon, BeakerIcon } from '@heroicons/react/24/outline'

export default function ServicesPage() {
  const services = [
    {
      icon: ScissorsIcon,
      title: "Men's Haircuts & Styling",
      description: "Classic to contemporary styles, fades, and precision cuts by our skilled stylists.",
      price: "Starting at $45"
    },
    {
      icon: SparklesIcon,
      title: "Beard Grooming & Shaving",
      description: "Professional beard trimming, shaping, and traditional wet shave services.",
      price: "Starting at $25"
    },
    {
      icon: BeakerIcon,
      title: "Hair Tattoos & Design",
      description: "Creative undercuts, hair tattoos, and unique edge designs by Ella.",
      price: "Starting at $35"
    }
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
          <h2 className="text-4xl font-bold text-salon-dark mb-4">
            Our Services
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Professional grooming services tailored for the modern gentleman
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {services.map((service, index) => (
            <motion.div
              key={service.title}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="bg-gray-50 p-8 rounded-lg text-center hover:shadow-lg transition-shadow"
            >
              <service.icon className="h-12 w-12 text-salon-gold mx-auto mb-4" />
              <h3 className="text-xl font-bold text-salon-dark mb-2">
                {service.title}
              </h3>
              <p className="text-gray-600 mb-4">
                {service.description}
              </p>
              <p className="text-salon-gold font-bold text-lg">
                {service.price}
              </p>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          viewport={{ once: true }}
          className="mt-16 bg-salon-dark text-white p-8 rounded-lg"
        >
          <h3 className="text-2xl font-bold mb-6 text-center">
            Specialty Services
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
            <div>
              <h4 className="text-salon-gold font-semibold mb-2">Hicham's Expertise</h4>
              <p className="text-sm">Traditional barbering with modern techniques</p>
            </div>
            <div>
              <h4 className="text-salon-gold font-semibold mb-2">Ella's Specialties</h4>
              <p className="text-sm">Creative fades, hair tattoos & textured cuts</p>
            </div>
            <div>
              <h4 className="text-salon-gold font-semibold mb-2">Tri's Focus</h4>
              <p className="text-sm">Personalized styling & modern trends</p>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
