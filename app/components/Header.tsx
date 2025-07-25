'use client'

import { useState } from 'react'
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline'
import Link from 'next/link'
import Logo from './Logo'
import CartIcon from './cart/CartIcon'
import CartDrawer from './cart/CartDrawer'

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [cartOpen, setCartOpen] = useState(false)

  const navigation = [
    { name: 'Home', href: '/' },
    { name: 'Services', href: '/services' },
    { name: 'About', href: '/about' },
    { name: 'Our Team', href: '/team' },
    { name: 'Products', href: '/products' },
    { name: 'Contact', href: '/hours-contact' },
  ]

  return (
    <>
      <header className="bg-white shadow-sm border-b border-gray-100 fixed w-full top-0 z-50">
      <nav className="mx-auto max-w-7xl px-6 lg:px-8" aria-label="Global">
        <div className="flex items-center justify-between py-4">
          <div className="flex lg:flex-1">
            <Logo />
          </div>
          <div className="flex lg:hidden">
            <button
              type="button"
              className="-m-2.5 inline-flex items-center justify-center rounded-md p-2.5 text-gray-700"
              onClick={() => setMobileMenuOpen(true)}
            >
              <Bars3Icon className="h-6 w-6" aria-hidden="true" />
            </button>
          </div>
          <div className="hidden lg:flex lg:gap-x-8 lg:items-center">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="text-sm font-medium text-gray-700 hover:text-orange-500 transition-colors px-3 py-2"
              >
                {item.name}
              </Link>
            ))}
            <div className="flex items-center gap-4 ml-8">
              <CartIcon onClick={() => setCartOpen(true)} />
              <a 
                href="tel:+13065224111" 
                className="text-sm font-medium text-gray-900 hover:text-orange-500 transition-colors inline-flex items-center gap-1"
              >
                📞 (306) 522-4111
              </a>
              <Link
                href="/book-enhanced"
                className="bg-orange-500 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-orange-600 transition-colors"
              >
                Book Now
              </Link>
              <Link
                href="/portal/login"
                className="text-sm font-medium text-gray-700 hover:text-orange-500 transition-colors px-3 py-2"
              >
                Customer Portal
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden fixed inset-0 z-50">
          <div className="fixed inset-y-0 right-0 z-50 w-full overflow-y-auto bg-white px-6 py-6 sm:max-w-sm shadow-xl">
            <div className="flex items-center justify-between">
              <Logo />
              <button
                type="button"
                className="-m-2.5 rounded-md p-2.5 text-gray-700"
                onClick={() => setMobileMenuOpen(false)}
              >
                <XMarkIcon className="h-6 w-6" aria-hidden="true" />
              </button>
            </div>
            <div className="mt-6 flow-root">
              <div className="-my-6 divide-y divide-gray-200">
                <div className="space-y-2 py-6">
                  {navigation.map((item) => (
                    <Link
                      key={item.name}
                      href={item.href}
                      className="-mx-3 block rounded-lg px-3 py-2 text-base font-medium text-gray-900 hover:bg-gray-50"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      {item.name}
                    </Link>
                  ))}
                  <div className="border-t border-gray-200 pt-4 mt-4">
                    <a 
                      href="tel:+13065224111" 
                      className="-mx-3 block rounded-lg px-3 py-2 text-base font-medium text-gray-900 hover:bg-gray-50"
                    >
                      📞 Call (306) 522-4111
                    </a>
                    <Link
                      href="/book-enhanced"
                      className="-mx-3 block rounded-lg px-3 py-2 text-base font-medium bg-orange-500 text-white hover:bg-orange-600 mt-2"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      Book Appointment
                    </Link>
                    <Link
                      href="/portal/login"
                      className="-mx-3 block rounded-lg px-3 py-2 text-base font-medium text-gray-900 hover:bg-gray-50 mt-2"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      Customer Portal
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      </header>
      <CartDrawer isOpen={cartOpen} onClose={() => setCartOpen(false)} />
    </>
  )
}
