'use client'

import { motion } from 'framer-motion'

export default function HeroContactInfo() {
  return (
    <>
      <motion.div
        initial={{ opacity: 0, x: -50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8, delay: 0.5 }}
        className="mt-8 flex items-center gap-2 text-sm text-gray-500"
      >
        📍 #4 - 425 Victoria Ave East, Regina, SK
      </motion.div>

      <motion.div
        initial={{ opacity: 0, x: -50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8, delay: 0.6 }}
        className="mt-2 text-sm text-gray-500"
      >
        Mon-Sat: 9am-8pm | Sunday: 12pm-5pm
      </motion.div>
    </>
  )
}
