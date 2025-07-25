'use client'

export default function ContactInfo() {
  return (
    <div className="space-y-4">
      <div>
        <p className="text-gray-600 text-sm">Give Us A Call</p>
        <a href="tel:3065224111" className="text-orange-500 text-xl font-semibold hover:text-orange-600 transition-colors">
          (306) 522-4111
        </a>
      </div>
      <div>
        <p className="text-gray-600 text-sm">Email Us</p>
        <a href="mailto:info@modernmen.ca" className="text-orange-500 hover:text-orange-600 transition-colors">
          info@modernmen.ca
        </a>
      </div>
      <div className="pt-4">
        <p className="text-gray-600 text-sm mb-3">Connect With Us</p>
        <div className="flex space-x-4">
          <a 
            href="https://instagram.com/modernmenhairsalon" 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-orange-500 hover:text-orange-600 transition-colors"
          >
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
            </svg>
          </a>
          <button 
            onClick={() => window.open('https://m.me/modernmenhairsalon', '_blank')}
            className="text-orange-500 hover:text-orange-600 transition-colors"
            title="Facebook Messenger"
          >
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 0C5.373 0 0 4.975 0 11.111c0 3.497 1.745 6.616 4.472 8.652V24l4.086-2.242c1.09.301 2.246.464 3.442.464 6.627 0 12-4.974 12-11.111C24 4.975 18.627 0 12 0zm1.193 14.963l-3.056-3.259-5.963 3.259L10.732 8.2l3.13 3.259L19.752 8.2l-6.559 6.763z"/>
            </svg>
          </button>
        </div>
      </div>
    </div>
  )
}
