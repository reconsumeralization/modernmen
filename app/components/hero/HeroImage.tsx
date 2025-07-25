'use client'

import { motion } from 'framer-motion'
import Image from 'next/image'

export default function HeroImage() {
  return (
    <motion.div
      initial={{ opacity: 0, x: 50 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.8, delay: 0.3 }}
      className="relative h-[600px] rounded-lg overflow-hidden shadow-xl"
    >
      <Image
        src="/images/modernmenchairs.png"
        alt="Modern Men Hair Salon Interior - Clean, Professional Salon in Regina"
        fill
        className="object-cover"
        priority
      />
    </motion.div>
  )
}
