'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Menu, X, Phone, Calendar } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

const navigation = [
  { name: 'Home', href: '/' },
  { name: 'Services', href: '#services' },
  { name: 'About', href: '#about' },
  { name: 'Our Team', href: '#team' },
  { name: 'Contact', href: '#contact' },
]

export function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-sm shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link href="/" className="text-2xl font-bold text-slate-900">
              Modern Men
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-8">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className="text-slate-700 hover:text-amber-600 px-3 py-2 text-sm font-medium transition-colors"
                >
                  {item.name}
                </Link>
              ))}
            </div>
          </div>

          {/* Desktop CTA Buttons */}
          <div className="hidden md:flex items-center space-x-4">
            <Button variant="outline" size="sm">
              <Phone className="h-4 w-4 mr-2" />
              (306) 522-4111
            </Button>
            <Button className="bg-amber-600 hover:bg-amber-700">
              <Calendar className="h-4 w-4 mr-2" />
              Book Now
            </Button>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-slate-700 hover:text-amber-600 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-amber-500"
            >
              {isMobileMenuOpen ? (
                <X className="block h-6 w-6" />
              ) : (
                <Menu className="block h-6 w-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-white border-t"
          >
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className="text-slate-700 hover:text-amber-600 block px-3 py-2 text-base font-medium"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {item.name}
                </Link>
              ))}
              <div className="pt-4 pb-2 space-y-3">
                <Button variant="outline" size="sm" className="w-full">
                  <Phone className="h-4 w-4 mr-2" />
                  (306) 522-4111
                </Button>
                <Button className="w-full bg-amber-600 hover:bg-amber-700">
                  <Calendar className="h-4 w-4 mr-2" />
                  Book Now
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  )
}