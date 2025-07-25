'use client'

import { motion } from 'framer-motion'
import Image from 'next/image'
import HoursDisplay from './HoursDisplay'
import { ClockIcon } from '@heroicons/react/24/outline'

interface HoursSectionProps {
  hours: Array<{
    day: string
    time: string
  }>
}

export default function HoursSection({ hours }: HoursSectionProps) {
  return (
    <section className="section-padding bg-white">
      <div className="container-max">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <div className="flex items-center mb-6">
                <ClockIcon className="h-8 w-8 text-orange-500 mr-3" />
                <h2 className="text-3xl font-bold text-gray-900">Hours</h2>
              </div>
              <HoursDisplay hours={hours} />
            </motion.div>
          </div>
          
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            viewport={{ once: true }}
            className="relative h-96 rounded-lg overflow-hidden shadow-lg"
          >
            <Image
              src="/images/modernmencashowroom.png"
              alt="Modern Men Hair Salon Showroom"
              fill
              className="object-cover"
            />
          </motion.div>
        </div>
      </div>
    </section>
  )
}
