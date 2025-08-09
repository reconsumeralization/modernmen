'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { ArrowRightIcon, ClockIcon, SparklesIcon } from '@heroicons/react/24/outline'

export default function ServicesPage() {
  const coreServices = [
    {
      name: 'MODERN CUT',
      price: '$45',
      duration: '45 min',
      description: 'Precision scissor/clipper work, clean finish, product style',
      popular: true
    },
    {
      name: 'SKIN FADE',
      price: '$45',
      duration: '45 min',
      description: 'Seamless gradient, razor-clean edges, prolonged shape retention'
    },
    {
      name: 'BEARD TRIM & LINE-UP',
      price: '$25',
      duration: '20 min',
      description: 'Shape, symmetry, hot towel, oil finish'
    },
    {
      name: 'HOT TOWEL SHAVE',
      price: '$45',
      duration: '45 min',
      description: 'Pre-shave oil, hot lather, multi-pass shave, cold towel, aftercare'
    },
    {
      name: 'EXPRESS CLEAN-UP',
      price: '$20',
      duration: '15 min',
      description: 'Neck/around ears, quick style—ideal between full cuts'
    },
    {
      name: 'KIDS CUT',
      price: '$30',
      duration: '30 min',
      description: 'Patient, fun experience for the little ones'
    }
  ]

  const signatureRitual = [
    { step: 1, title: 'Warm Towel Prep', description: 'Relaxing preparation' },
    { step: 2, title: 'Pre-Shave Oil', description: 'Premium conditioning' },
    { step: 3, title: 'Hot Lather Cleanup', description: 'Precision detailing' },
    { step: 4, title: 'Cooling Tonic', description: 'Refreshing finish' },
    { step: 5, title: 'Aftercare Consult', description: 'Product recommendations' }
  ]

  const bundles = [
    {
      name: 'CUT + BEARD',
      price: '$65',
      savings: 'Save $5',
      description: 'Complete grooming experience'
    },
    {
      name: 'CUT + SHAVE',
      price: '$85',
      savings: 'Save $5',
      description: 'Ultimate transformation'
    }
  ]

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative h-[60vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-black/60 z-10" />
          <img
            src="https://images.unsplash.com/photo-1594751543129-6701ad444a57?w=1920&auto=format&fit=crop&q=70"
            alt="Barber services"
            className="w-full h-full object-cover"
          />
        </div>
        
        <div className="relative z-20 text-center text-white px-6">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-5xl md:text-7xl font-bold mb-4"
          >
            OUR SERVICES
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-xl md:text-2xl font-light"
          >
            Classic craft, modern results
          </motion.p>
        </div>
      </section>

      {/* Core Services */}
      <section className="py-20 px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold mb-4">PRECISION SERVICES</h2>
            <p className="text-xl text-gray-600">Time-boxed for your convenience</p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {coreServices.map((service, index) => (
              <motion.div
                key={service.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: index * 0.1 }}
                viewport={{ once: true }}
                className={`border-2 border-black p-8 hover:bg-black hover:text-white transition-all group ${
                  service.popular ? 'relative' : ''
                }`}
              >
                {service.popular && (
                  <div className="absolute -top-3 left-6 bg-red-600 text-white text-xs px-3 py-1 font-bold">
                    MOST POPULAR
                  </div>
                )}
                <h3 className="text-2xl font-bold mb-2">{service.name}</h3>
                <div className="flex items-center justify-between mb-4">
                  <span className="text-3xl font-bold">{service.price}</span>
                  <span className="flex items-center gap-1 text-sm">
                    <ClockIcon className="h-4 w-4" />
                    {service.duration}
                  </span>
                </div>
                <p className="text-gray-600 group-hover:text-gray-300 mb-6">
                  {service.description}
                </p>
                <Link
                  href="/book-enhanced"
                  className="inline-flex items-center gap-2 font-semibold group-hover:underline"
                >
                  BOOK NOW
                  <ArrowRightIcon className="h-4 w-4" />
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Signature Ritual */}
      <section className="py-20 bg-black text-white">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold mb-4">THE SIGNATURE RITUAL</h2>
            <p className="text-xl text-gray-300">
              Elevate any service with our premium add-on experience
            </p>
             <p className="text-3xl font-bold mt-4 text-red-600">+$15</p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-5 gap-8">
            {signatureRitual.map((step, index) => (
              <motion.div
                key={step.step}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="text-center"
              >
                <div className="w-16 h-16 bg-red-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl font-bold">{step.step}</span>
                </div>
                <h3 className="font-bold mb-2">{step.title}</h3>
                <p className="text-sm text-gray-400">{step.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Bundles */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-5xl mx-auto px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl font-bold mb-4">BUNDLE & SAVE</h2>
            <p className="text-xl text-gray-600">Popular combinations</p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {bundles.map((bundle, index) => (
              <motion.div
                key={bundle.name}
                initial={{ opacity: 0, x: index === 0 ? -50 : 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8 }}
                viewport={{ once: true }}
                className="bg-white border-2 border-black p-8"
              >
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-2xl font-bold">{bundle.name}</h3>
                  <span className="bg-red-600 text-white text-sm px-3 py-1 font-bold">
                    {bundle.savings}
                  </span>
                </div>
                <p className="text-4xl font-bold mb-4">{bundle.price}</p>
                <p className="text-gray-600 mb-6">{bundle.description}</p>
                <Link
                  href="/book-enhanced"
                  className="inline-flex items-center gap-2 font-semibold hover:underline"
                >
                  BOOK THIS BUNDLE
                  <ArrowRightIcon className="h-4 w-4" />
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Memberships CTA */}
      <section className="py-20 bg-red-600 text-white">
        <div className="max-w-4xl mx-auto text-center px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <SparklesIcon className="h-16 w-16 mx-auto mb-6" />
            <h2 className="text-4xl font-bold mb-4">MODERNMEN MEMBERSHIPS</h2>
            <p className="text-xl mb-8">
              Stay sharp year-round with exclusive benefits and priority booking
            </p>
            <div className="flex gap-4 justify-center">
              <Link
                href="/memberships"
                className="px-8 py-4 bg-white text-black font-semibold hover:bg-gray-100 transition-all"
              >
                VIEW MEMBERSHIPS
              </Link>
              <Link
                href="/book-enhanced"
                className="px-8 py-4 border-2 border-white text-white font-semibold hover:bg-white hover:text-red-600 transition-all"
              >
                BOOK NOW
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  )
}