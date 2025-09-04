import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import { Menu, X, Scissors } from 'lucide-react';
import Navigation from './Navigation';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();

  // Determine if we're on a portal page (not marketing site)
  const isPortalPage = location.pathname.startsWith('/customer') ||
                      location.pathname.startsWith('/barber') ||
                      location.pathname.startsWith('/admin');

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <div className="flex items-center">
              <Scissors className="h-8 w-8 text-blue-600 mr-2" />
              <span className="text-xl font-bold text-gray-900">ModernMen</span>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-8">
              <Navigation />
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden">
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="text-gray-500 hover:text-gray-700 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500"
              >
                {isMobileMenuOpen ? (
                  <X className="h-6 w-6" />
                ) : (
                  <Menu className="h-6 w-6" />
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-gray-50 border-t border-gray-200">
              <Navigation mobile />
            </div>
          </div>
        )}
      </header>

      {/* Main Content */}
      <main className="flex-1">
        {children}
      </main>

      {/* Footer - Only show on marketing pages */}
      {!isPortalPage && (
        <footer className="bg-gray-900 text-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
              <div>
                <div className="flex items-center mb-4">
                  <Scissors className="h-6 w-6 text-blue-400 mr-2" />
                  <span className="text-lg font-bold">ModernMen</span>
                </div>
                <p className="text-gray-400">
                  Premium barber services with modern techniques and traditional craftsmanship.
                </p>
              </div>

              <div>
                <h3 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">
                  Services
                </h3>
                <ul className="space-y-2">
                  <li><a href="#services" className="text-gray-400 hover:text-white">Haircuts</a></li>
                  <li><a href="#services" className="text-gray-400 hover:text-white">Beard Grooming</a></li>
                  <li><a href="#services" className="text-gray-400 hover:text-white">Hot Towel Shave</a></li>
                  <li><a href="#services" className="text-gray-400 hover:text-white">Hair Coloring</a></li>
                </ul>
              </div>

              <div>
                <h3 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">
                  Company
                </h3>
                <ul className="space-y-2">
                  <li><a href="#about" className="text-gray-400 hover:text-white">About Us</a></li>
                  <li><a href="#team" className="text-gray-400 hover:text-white">Our Team</a></li>
                  <li><a href="#gallery" className="text-gray-400 hover:text-white">Gallery</a></li>
                  <li><a href="#contact" className="text-gray-400 hover:text-white">Contact</a></li>
                </ul>
              </div>

              <div>
                <h3 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">
                  Customer Portal
                </h3>
                <ul className="space-y-2">
                  <li><a href="/customer" className="text-gray-400 hover:text-white">Book Appointment</a></li>
                  <li><a href="/customer" className="text-gray-400 hover:text-white">My Account</a></li>
                  <li><a href="/customer" className="text-gray-400 hover:text-white">Appointment History</a></li>
                  <li><a href="/customer" className="text-gray-400 hover:text-white">Loyalty Program</a></li>
                </ul>
              </div>
            </div>

            <div className="border-t border-gray-800 mt-8 pt-8 text-center">
              <p className="text-gray-400">
                © 2024 ModernMen. All rights reserved.
              </p>
            </div>
          </div>
        </footer>
      )}
    </div>
  );
};

export default Layout;
