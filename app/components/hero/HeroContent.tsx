'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'

export default function HeroContent() {
  return (
    <div className="text-left">
      <motion.div
        initial={{ opacity: 0, x: -50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8 }}
        className="mb-6"
      >
        <h1 className="text-4xl md:text-6xl font-bold text-gray-900 leading-tight">
          Modern Men
        </h1>
        <h2 className="text-2xl md:text-3xl text-orange-500 font-medium mt-2">
          Hair Salon
        </h2>
      </motion.div>
      
      <motion.p
        initial={{ opacity: 0, x: -50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8, delay: 0.2 }}
        className="text-lg md:text-xl text-gray-600 mb-6 leading-relaxed"
      >
        A Modern Haircut for a Modern Man
      </motion.p>
      
      <motion.p
        initial={{ opacity: 0, x: -50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8, delay: 0.3 }}
        className="text-base text-gray-500 mb-8 max-w-lg"
      >
        Regina's premier destination for men's grooming. Experience the highest level of 
        service and satisfaction with our team of incomparably talented stylists and barbers.
      </motion.p>
    </div>
  )
}
