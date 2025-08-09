'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'

type Slide = {
  src: string
  headline: string
  subline: string
  ctaHref?: string
  ctaLabel?: string
}

const slides: Slide[] = [
  {
    src: '/images/optimized/barber-chair-interior-cinematic-lg.jpg',
    headline: 'WE ARE MODERNMEN',
    subline: 'Classic craft. Modern results.',
    ctaHref: '/book-enhanced',
    ctaLabel: 'Book Appointment'
  },
  {
    src: '/images/optimized/barbershop-modern-cut-before-after-lg.jpg',
    headline: 'LOOK SHARP. OWN THE ROOM.',
    subline: "Precision cuts, hot shaves, and style that lasts.",
    ctaHref: '#services',
    ctaLabel: 'View Services'
  },
  {
    src: '/images/optimized/modernmen-regina-exterior-sign-lg.jpg',
    headline: 'NEW NAME. SAME CRAFT.',
    subline: 'Premium barbershop in Regina, SK.',
    ctaHref: '/book-enhanced',
    ctaLabel: 'Reserve Your Spot'
  }
]

export default function HeroCarousel() {
  const [index, setIndex] = useState(0)

  useEffect(() => {
    const id = setInterval(() => {
      setIndex((prev) => (prev + 1) % slides.length)
    }, 5000)
    return () => clearInterval(id)
  }, [])

  const current = slides[index]

  return (
    <section className="relative h-[90vh] min-h-[560px] w-full overflow-hidden">
      <div className="absolute inset-0">
        <AnimatePresence mode="wait">
          <motion.div
            key={current.src}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8 }}
            className="absolute inset-0"
          >
            <Image
              src={current.src}
              alt={current.headline}
              fill
              priority
              sizes="100vw"
              className="object-cover"
            />
            <div className="absolute inset-0 bg-black/60" />
          </motion.div>
        </AnimatePresence>
      </div>

      <div className="relative z-10 h-full flex items-center justify-center text-center px-6">
        <div>
          <motion.h1
            key={current.headline}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="section-heading text-white"
          >
            {current.headline}
          </motion.h1>
          <motion.p
            key={current.subline}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-xl md:text-2xl text-white/90 mt-4"
          >
            {current.subline}
          </motion.p>

          {current.ctaHref && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="mt-8 flex gap-4 justify-center"
            >
              <Link href={current.ctaHref} className="px-8 py-4 bg-white text-black font-bold hover:bg-gray-100 transition-all">
                {current.ctaLabel}
              </Link>
              <Link href="/book-enhanced" className="px-8 py-4 border-2 border-white text-white font-bold hover:bg-white hover:text-black transition-all">
                Book Now
              </Link>
            </motion.div>
          )}
        </div>
      </div>

      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2 z-10">
        {slides.map((_, i) => (
          <button
            key={i}
            aria-label={`Go to slide ${i + 1}`}
            onClick={() => setIndex(i)}
            className={`h-2 w-8 transition-opacity ${i === index ? 'bg-white' : 'bg-white/40 hover:bg-white/60'}`}
          />
        ))}
      </div>
    </section>
  )
}


