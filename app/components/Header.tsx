'use client'

import { useState, useEffect } from 'react'
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  const navigation = [
    { name: 'HOME', href: '/' },
    { name: 'SERVICES', href: '/services' },
    { name: 'MEMBERSHIPS', href: '#memberships' },
    { name: 'THE CREW', href: '/team' },
    { name: 'ABOUT', href: '/about' },
    { name: 'CONTACT', href: '/hours-contact' },
  ]

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50)
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <header 
      className={`fixed w-full top-0 z-50 transition-all duration-300 ${
        scrolled ? 'bg-white shadow-lg' : 'bg-transparent'
      }`}
    >
      <nav className="mx-auto max-w-7xl px-6 lg:px-8" aria-label="Global">
        <div className="flex items-center justify-between py-6">
          {/* Logo */}
          <Link href="/" className="flex items-center">
            <motion.div
              whileHover={{ scale: 1.05 }}
              className={`text-2xl font-bold tracking-tight transition-colors ${
                scrolled ? 'text-black' : 'text-white'
              }`}
            >
              MODERN MEN
            </motion.div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex lg:gap-x-12 lg:items-center">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className={`text-sm font-medium tracking-wide transition-colors hover:opacity-80 ${
                  scrolled ? 'text-gray-900' : 'text-white'
                }`}
              >
                {item.name}
              </Link>
            ))}
            
            <div className="flex items-center gap-6 ml-8">
              <Link
                href="/portal/login"
                className={`text-sm font-medium tracking-wide transition-colors hover:opacity-80 ${
                  scrolled ? 'text-gray-900' : 'text-white'
                }`}
              >
                PORTAL
              </Link>
              <Link
                href="/book-enhanced"
                className={`px-6 py-3 text-sm font-medium transition-all ${
                  scrolled 
                    ? 'bg-brand-red text-white hover:opacity-90' 
                    : 'bg-white text-black hover:bg-gray-100'
                }`}
              >
                BOOK NOW
              </Link>
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="flex lg:hidden">
            <button
              type="button"
              className={`-m-2.5 inline-flex items-center justify-center rounded-md p-2.5 ${
                scrolled ? 'text-gray-700' : 'text-white'
              }`}
              onClick={() => setMobileMenuOpen(true)}
            >
              <Bars3Icon className="h-6 w-6" aria-hidden="true" />
            </button>
          </div>
        </div>
      </nav>
      {/* Mobile menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="lg:hidden fixed inset-0 z-50"
          >
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'tween', duration: 0.3 }}
              className="fixed inset-y-0 right-0 z-50 w-full overflow-y-auto bg-black px-6 py-6 sm:max-w-sm"
            >
              <div className="flex items-center justify-between">
                <Link href="/" className="text-white text-2xl font-bold">
                  MODERN MEN
                </Link>
                <button
                  type="button"
                  className="-m-2.5 rounded-md p-2.5 text-white"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <XMarkIcon className="h-6 w-6" aria-hidden="true" />
                </button>
              </div>
              <div className="mt-12 flow-root">
                <div className="-my-6 divide-y divide-gray-800">
                  <div className="space-y-2 py-6">
                    {navigation.map((item) => (
                      <Link
                        key={item.name}
                        href={item.href}
                        className="-mx-3 block px-3 py-3 text-lg font-medium text-white hover:bg-gray-900 transition-colors"
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        {item.name}
                      </Link>
                    ))}
                    <Link
                      href="/portal/login"
                      className="-mx-3 block px-3 py-3 text-lg font-medium text-white hover:bg-gray-900 transition-colors"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      CUSTOMER PORTAL
                    </Link>
                  </div>
                  <div className="py-6">
                    <Link
                      href="/book-enhanced"
                      className="block w-full bg-white text-black text-center px-6 py-3 font-medium hover:bg-gray-100 transition-colors"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      BOOK APPOINTMENT
                    </Link>
                    <a 
                      href="tel:+13065224111" 
                      className="mt-4 block text-center text-white text-lg"
                    >
                      (306) 522-4111
                    </a>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}