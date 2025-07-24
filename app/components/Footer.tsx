'use client'

export default function Footer() {
  return (
    <footer className="bg-salon-dark text-white py-12">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-2xl font-bold text-salon-gold mb-4">
              MODERN MEN
            </h3>
            <p className="text-gray-300 leading-relaxed">
              Taking Men's Grooming to the highest level of experience and satisfaction.
            </p>
          </div>
          
          <div>
            <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li><a href="#home" className="text-gray-300 hover:text-salon-gold transition-colors">Home</a></li>
              <li><a href="#about" className="text-gray-300 hover:text-salon-gold transition-colors">About</a></li>
              <li><a href="#services" className="text-gray-300 hover:text-salon-gold transition-colors">Services</a></li>
              <li><a href="#team" className="text-gray-300 hover:text-salon-gold transition-colors">Our Team</a></li>
              <li><a href="#products" className="text-gray-300 hover:text-salon-gold transition-colors">Products</a></li>
              <li><a href="#hours" className="text-gray-300 hover:text-salon-gold transition-colors">Hours</a></li>
              <li><a href="/book" className="text-gray-300 hover:text-salon-gold transition-colors">Book Now</a></li>
              <li><a href="/privacy-policy" className="text-gray-300 hover:text-salon-gold transition-colors">Privacy Policy</a></li>
              <li><a href="/terms-of-service" className="text-gray-300 hover:text-salon-gold transition-colors">Terms of Service</a></li>
            </ul>
          </div>
          
          <div>
            <h4 className="text-lg font-semibold mb-4">Contact Info</h4>
            <div className="space-y-2 text-gray-300">
              <p>#4 - 425 Victoria Ave East</p>
              <p>Regina, SK S4N 0N8</p>
              <p>Phone: (306) 522-4111</p>
              <p>Text: (306) 541-5511</p>
              <p>Email: info@modernmen.ca</p>
            </div>
          </div>
        </div>
        
        <div className="border-t border-gray-700 mt-8 pt-8 text-center">
          <p className="text-gray-400">
            © 2025 Modern Men Hair Salon. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}
