'use client'

import Link from 'next/link'

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white py-12">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-2xl font-bold text-orange-500 mb-4">
              Modern Men
            </h3>
            <p className="text-gray-300 leading-relaxed">
              Taking Men's Grooming to the highest level of experience and satisfaction.
            </p>
            <p className="text-gray-400 mt-2 text-sm">
              Regina's premier destination for men's grooming.
            </p>
          </div>
          
          <div>
            <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li><Link href="/" className="text-gray-300 hover:text-orange-500 transition-colors">Home</Link></li>
              <li><Link href="/about" className="text-gray-300 hover:text-orange-500 transition-colors">About</Link></li>
              <li><Link href="/services" className="text-gray-300 hover:text-orange-500 transition-colors">Services</Link></li>
              <li><Link href="/team" className="text-gray-300 hover:text-orange-500 transition-colors">Our Team</Link></li>
              <li><Link href="/products" className="text-gray-300 hover:text-orange-500 transition-colors">Products</Link></li>
              <li><Link href="/hours-contact" className="text-gray-300 hover:text-orange-500 transition-colors">Hours & Contact</Link></li>
              <li><Link href="/book" className="text-gray-300 hover:text-orange-500 transition-colors">Book Now</Link></li>
              <li><Link href="/privacy-policy" className="text-gray-300 hover:text-orange-500 transition-colors">Privacy Policy</Link></li>
              <li><Link href="/terms-of-service" className="text-gray-300 hover:text-orange-500 transition-colors">Terms of Service</Link></li>
            </ul>
          </div>
          
          <div>
            <h4 className="text-lg font-semibold mb-4">Contact Info</h4>
            <div className="space-y-2 text-gray-300">
              <p className="font-medium text-white">#4 - 425 Victoria Ave East</p>
              <p>Regina, SK S4N 0N8</p>
              <div className="pt-2">
                <p className="text-sm text-gray-400">Phone:</p>
                <a href="tel:+13065224111" className="text-orange-500 hover:text-orange-400 transition-colors font-medium">
                  (306) 522-4111
                </a>
              </div>
              <div>
                <p className="text-sm text-gray-400">Email:</p>
                <a href="mailto:info@modernmen.ca" className="text-orange-500 hover:text-orange-400 transition-colors">
                  info@modernmen.ca
                </a>
              </div>
              <div className="pt-2">
                <p className="text-sm text-gray-400 mb-2">Follow Us:</p>
                <div className="flex space-x-3">
                  <a 
                    href="https://instagram.com/modernmenhairsalon" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-orange-500 hover:text-orange-400 transition-colors"
                  >
                    📷 Instagram
                  </a>
                  <button 
                    onClick={() => window.open('https://m.me/modernmenhairsalon', '_blank')}
                    className="text-orange-500 hover:text-orange-400 transition-colors"
                  >
                    💬 Messenger
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="border-t border-gray-700 mt-8 pt-8 text-center">
          <p className="text-gray-400">
            © 2025 Modern Men Hair Salon. All rights reserved. | Regina, Saskatchewan
          </p>
        </div>
      </div>
    </footer>
  )
}
