'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { 
  ArrowRightIcon, 
  SparklesIcon,
  ScissorsIcon,
  UserGroupIcon,
  StarIcon
} from '@heroicons/react/24/solid'
import HeroCarousel from './components/HeroCarousel'
//

export default function HomePage() {
  const services = [
    {
      title: 'MODERN CUT',
      price: 'from $45',
      duration: '45 min',
      description: 'Precision scissor/clipper work, clean finish, product style'
    },
    {
      title: 'SKIN FADE',
      price: 'from $45',
      duration: '45 min',
      description: 'Seamless gradient with razor-clean edges'
    },
    {
      title: 'HOT TOWEL SHAVE',
      price: 'from $45',
      duration: '45 min',
      description: 'Pre-shave oil, hot lather, multi-pass shave, cold towel, aftercare'
    },
    {
      title: 'BEARD TRIM',
      price: 'from $25',
      duration: '20 min',
      description: 'Shape, symmetry, and oil finish'
    },
    {
      title: 'CUT + BEARD',
      price: 'from $65',
      duration: '60 min',
      description: 'Complete grooming experience'
    },
    {
      title: 'EXPRESS CLEAN-UP',
      price: 'from $20',
      duration: '15 min',
      description: 'Quick neck and ear cleanup'
    }
  ]

  const testimonials = [
    {
      name: 'James M.',
      rating: 5,
      text: 'Best cut in Regina. The attention to detail is unmatched.'
    },
    {
      name: 'David L.',
      rating: 5,
      text: 'Been coming here for years. Consistent quality every time.'
    },
    {
      name: 'Michael R.',
      rating: 5,
      text: 'The hot towel shave is an experience. Highly recommend.'
    },
    {
      name: 'Chris K.',
      rating: 5,
      text: 'Professional, skilled, and always on time. 5 stars.'
    }
  ]

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section - Carousel */}
      <HeroCarousel />
      {/* Services Grid */}
      <section id="services" className="py-24 px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-5xl font-bold mb-4">YOUR NEXT LEVEL STARTS HERE</h2>
            <p className="text-xl text-gray-600">
              Precision cuts, hot shaves, and style that lasts.
            </p>
          </motion.div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {services.map((service, index) => (
              <motion.div
                key={service.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: index * 0.1 }}
                viewport={{ once: true }}
                 className="border-2 border-black p-6 hover:bg-black hover:text-white transition-all group"
              >
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-xl font-bold">{service.title}</h3>
                  <span className="text-sm font-medium">{service.duration}</span>
                </div>
                <p className="text-2xl font-bold mb-3">{service.price}</p>
                <p className="text-gray-600 group-hover:text-gray-300 mb-6 text-sm">
                  {service.description}
                </p>
                 <Link
                  href="/book-enhanced"
                  className="text-sm font-bold hover:underline inline-flex items-center gap-1"
                >
                  BOOK NOW
                  <ArrowRightIcon className="h-3 w-3" />
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
      
      {/* End of page wrapper */}
    </div>
  )
}

      {/* Signature Ritual */}
      <section className="py-24 bg-black text-white">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <h2 className="text-5xl font-bold mb-6">
                THE SIGNATURE<br />RITUAL
              </h2>
              <p className="text-xl text-gray-300 mb-8">
                Every cut deserves our signature finish. Hot towel prep, 
                precision detailing, and cooling aftercare that leaves you 
                feeling as good as you look.
              </p>
              <ul className="space-y-4 mb-8">
                <li className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-red-600 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-sm font-bold">1</span>
                  </div>
                  <span>Warm towel preparation</span>
                </li>
                <li className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-red-600 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-sm font-bold">2</span>
                  </div>
                  <span>Pre-shave oil or tonic application</span>
                </li>
                <li className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-red-600 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-sm font-bold">3</span>
                  </div>
                  <span>Hot lather neck cleanup</span>
                </li>
                <li className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-red-600 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-sm font-bold">4</span>
                  </div>
                  <span>Cooling tonic finish</span>
                </li>
                <li className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-red-600 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-sm font-bold">5</span>
                  </div>
                  <span>Aftercare product recommendation</span>
                </li>
              </ul>
              <p className="text-2xl font-bold text-red-600">Add to any service +$15</p>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="relative"
            >
              <img
                src="https://images.unsplash.com/photo-1605515682347-4d8de3d3fa19?w=1200&auto=format&fit=crop&q=70"
                alt="Signature ritual"
                className="w-full h-[600px] object-cover"
              />
            </motion.div>
          </div>
        </div>
      </section>      
      {/* Memberships */}
      <section id="memberships" className="py-24 bg-gray-50">
        <div className="max-w-6xl mx-auto px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-5xl font-bold mb-4">MODERNMEN MEMBERSHIPS</h2>
            <p className="text-xl text-gray-600">
              Stay dialed year-round with exclusive benefits
            </p>
          </motion.div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="bg-white border-2 border-black p-8"
            >
              <h3 className="text-3xl font-bold mb-4">ONCE-MONTHLY</h3>
              <p className="text-4xl font-bold mb-6">$40<span className="text-lg font-normal">/month</span></p>
              <ul className="space-y-3 mb-8">
                <li className="flex items-start gap-2">
                  <StarIcon className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
                  <span>1 cut per month</span>
                </li>
                <li className="flex items-start gap-2">
                  <StarIcon className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
                  <span>20% off add-ons & retail</span>
                </li>
                <li className="flex items-start gap-2">
                  <StarIcon className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
                  <span>Priority booking</span>
                </li>
                <li className="flex items-start gap-2">
                  <StarIcon className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
                  <span>Roll over 1 unused cut</span>
                </li>
              </ul>
              <Link
                href="/book-enhanced"
                className="block text-center px-6 py-3 bg-black text-white font-bold hover:bg-gray-800 transition-all"
              >
                GET STARTED
              </Link>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="bg-black text-white border-2 border-black p-8 relative"
            >
              <div className="absolute -top-4 right-8 bg-red-600 text-white text-sm px-4 py-2 font-bold">
                LIMITED AVAILABILITY
              </div>
              <h3 className="text-3xl font-bold mb-4">UNLIMITED</h3>
              <p className="text-4xl font-bold mb-6">$120<span className="text-lg font-normal">/month</span></p>
              <ul className="space-y-3 mb-8">
                <li className="flex items-start gap-2">
                  <StarIcon className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
                  <span>Unlimited cuts (fair use)</span>
                </li>
                <li className="flex items-start gap-2">
                  <StarIcon className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
                  <span>20% off all retail</span>
                </li>
                <li className="flex items-start gap-2">
                  <StarIcon className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
                  <span>VIP booking hours</span>
                </li>
                <li className="flex items-start gap-2">
                  <StarIcon className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
                  <span>Guest passes (2/year)</span>
                </li>
              </ul>
              <Link
                href="/book-enhanced"
                className="block text-center px-6 py-3 bg-white text-black font-bold hover:bg-gray-100 transition-all"
              >
                JOIN WAITLIST
              </Link>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Gallery/Results */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-5xl font-bold mb-4">CUTS THAT COMMAND RESPECT</h2>
            <p className="text-xl text-gray-600">Follow @modernmenregina for daily inspiration</p>
          </motion.div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              'images/optimized/barbershop-modern-cut-before-after-sm.jpg',
              'images/optimized/skin-fade-detail-razor-finish-sm.jpg',
              'images/optimized/beard-trim-line-up-hot-towel-sm.jpg',
              'images/optimized/hot-towel-shave-classic-ritual-sm.jpg',
              'images/optimized/taper-fade-clean-edges-sm.jpg',
              'images/optimized/kids-cut-clean-style-sm.jpg',
              'images/optimized/buzz-cut-clipper-only-sm.jpg',
              'images/optimized/barber-chair-interior-cinematic-sm.jpg'
            ].map((src, i) => (
              <motion.div
                key={src}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: i * 0.05 }}
                viewport={{ once: true }}
                className="aspect-square bg-gray-200 overflow-hidden"
              >
                <img
                  src={`/${src}`}
                  alt={src
                    .replace('images/optimized/', '')
                    .replace(/-/g, ' ')
                    .replace(/\.jpg$/, '')}
                  className="w-full h-full object-cover hover:scale-110 transition-transform duration-500"
                  loading="lazy"
                />
              </motion.div>
            ))}
          </div>
        </div>
      </section>