'use client'

import Link from 'next/link'
import { Phone, MapPin, Mail, Facebook, Instagram } from 'lucide-react'

export function Footer() {
  return (
    <footer className="bg-slate-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="col-span-1 md:col-span-2">
            <Link href="/" className="text-3xl font-bold text-white mb-4 block">
              Modern Men
            </Link>
            <p className="text-gray-300 mb-6 max-w-md">
              Regina's premier destination for men's grooming. Experience the highest level of 
              service and satisfaction with our team of talented stylists and barbers.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-amber-400 transition-colors">
                <Facebook className="h-6 w-6" />
              </a>
              <a href="#" className="text-gray-400 hover:text-amber-400 transition-colors">
                <Instagram className="h-6 w-6" />
              </a>
            </div>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Contact</h3>
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-amber-400" />
                <span className="text-gray-300">(306) 522-4111</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-amber-400" />
                <span className="text-gray-300">(306) 541-5511</span>
              </div>
              <div className="flex items-start gap-2">
                <MapPin className="h-4 w-4 text-amber-400 mt-1" />
                <div className="text-gray-300">
                  <p>#4 - 425 Victoria Ave East</p>
                  <p>Regina, SK, S4N 0N8</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-amber-400" />
                <span className="text-gray-300">info@modernmen.ca</span>
              </div>
            </div>
          </div>

          {/* Hours */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Hours</h3>
            <div className="space-y-2 text-sm text-gray-300">
              <div className="flex justify-between">
                <span>Mon</span>
                <span>9am - 6pm</span>
              </div>
              <div className="flex justify-between">
                <span>Tue</span>
                <span>9am - 5pm</span>
              </div>
              <div className="flex justify-between">
                <span>Wed</span>
                <span>9am - 8pm</span>
              </div>
              <div className="flex justify-between">
                <span>Thu</span>
                <span>9am - 8pm</span>
              </div>
              <div className="flex justify-between">
                <span>Fri</span>
                <span>9am - 5pm</span>
              </div>
              <div className="flex justify-between">
                <span>Sat</span>
                <span>9am - 5pm</span>
              </div>
              <div className="flex justify-between">
                <span>Sun</span>
                <span>Closed</span>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-12 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400 text-sm">
              © 2024 Modern Men Hair Salon. All rights reserved.
            </p>
            <div className="mt-4 md:mt-0">
              <p className="text-gray-400 text-sm">
                Please give us 24 hours notice for cancellations
              </p>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}