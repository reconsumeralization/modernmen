'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'

export default function HeroActions() {
  return (
    <motion.div
      initial={{ opacity: 0, x: -50 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.8, delay: 0.4 }}
      className="flex flex-col sm:flex-row gap-4"
    >
      <Link 
        href="/book" 
        className="bg-orange-500 text-white px-8 py-4 rounded-md font-semibold hover:bg-orange-600 transition-colors text-center inline-flex items-center justify-center gap-2"
      >
        📅 Book Appointment
      </Link>
      <a 
        href="tel:+13065224111" 
        className="border-2 border-gray-900 text-gray-900 px-8 py-4 rounded-md font-semibold hover:bg-gray-900 hover:text-white transition-colors text-center inline-flex items-center justify-center gap-2"
      >
        📞 (306) 522-4111
      </a>
    </motion.div>
  )
}
