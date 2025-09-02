"use client"

import * as React from "react"
import Link from "next/link"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { footerNavigation } from "@/lib/navigation"
import {

  Phone,
  MapPin,
  Clock,
  Mail,
  Facebook,
  Instagram,
  Twitter,
  Youtube,
  Star,
  Award,
  Shield,
  Heart
} from "lucide-react"

interface FooterProps {
  className?: string
}

export function Footer({ className }: FooterProps) {
  const currentYear = new Date().getFullYear()

  const socialLinks = [
    { name: "Facebook", href: "https://facebook.com/modernmen", icon: Facebook },
    { name: "Instagram", href: "https://instagram.com/modernmen", icon: Instagram },
    { name: "Twitter", href: "https://twitter.com/modernmen", icon: Twitter },
    { name: "YouTube", href: "https://youtube.com/modernmen", icon: Youtube },
  ]

  return (
    <footer className={cn("bg-black text-white", className)}>
      {/* Main Footer Content */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          {/* Brand Section */}
          <div className="lg:col-span-2 space-y-4">
            <Link href="/" className="flex items-center space-x-2">
              <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center">
                <span className="text-black text-lg font-bold">M</span>
              </div>
              <div>
                <div className="text-xl font-bold">Modern Men</div>
                <div className="text-sm text-gray-400">Hair Salon</div>
              </div>
            </Link>

            <p className="text-gray-300 text-sm leading-relaxed max-w-md">
              Experience premium grooming services in a sophisticated atmosphere.
              Our expert barbers provide exceptional service for the modern gentleman.
            </p>

            {/* Contact Info */}
            <div className="space-y-2">
              <div className="flex items-center space-x-3 text-sm">
                <Phone className="w-4 h-4 text-red-500" />
                <span>(555) 123-4567</span>
              </div>
              <div className="flex items-center space-x-3 text-sm">
                <Mail className="w-4 h-4 text-red-500" />
                <span>info@modernmen.com</span>
              </div>
              <div className="flex items-center space-x-3 text-sm">
                <MapPin className="w-4 h-4 text-red-500" />
                <span>123 Main St, City, ST 12345</span>
              </div>
              <div className="flex items-center space-x-3 text-sm">
                <Clock className="w-4 h-4 text-red-500" />
                <span>Mon-Sat: 9AM-7PM, Sun: Closed</span>
              </div>
            </div>

            {/* Social Links */}
            <div className="flex space-x-4">
              {socialLinks.map((social) => {
                const Icon = social.icon
                return (
                  <Link
                    key={social.name}
                    href={social.href}
                    className="w-8 h-8 bg-gray-800 rounded-full flex items-center justify-center hover:bg-red-600 transition-colors"
                    aria-label={social.name}
                  >
                    <Icon className="w-4 h-4" />
                  </Link>
                )
              })}
            </div>
          </div>

          {/* Navigation Links */}
          {footerNavigation.map((group) => (
            <div key={group.name} className="space-y-4">
              <h3 className="text-lg font-semibold">{group.name}</h3>
              <ul className="space-y-2">
                {group.items.map((item) => (
                  <li key={item.name}>
                    <Link
                      href={item.href}
                      className="text-gray-300 hover:text-white transition-colors text-sm"
                    >
                      {item.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Newsletter Signup */}
        <div className="mt-12 pt-8 border-t border-gray-800">
          <div className="max-w-md">
            <h3 className="text-lg font-semibold mb-2">Stay Updated</h3>
            <p className="text-gray-300 text-sm mb-4">
              Get the latest hair care tips, style trends, and exclusive offers.
            </p>
            <div className="flex space-x-2">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 px-3 py-2 bg-gray-800 border border-gray-700 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500"
              />
              <Button className="bg-red-600 hover:bg-red-700">
                Subscribe
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Trust Indicators */}
      <div className="bg-gray-900 py-8">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            <div className="flex flex-col items-center space-y-2">
              <Award className="w-8 h-8 text-red-500" />
              <span className="text-sm font-medium">Certified Barbers</span>
            </div>
            <div className="flex flex-col items-center space-y-2">
              <Shield className="w-8 h-8 text-red-500" />
              <span className="text-sm font-medium">Licensed & Insured</span>
            </div>
            <div className="flex flex-col items-center space-y-2">
              <Star className="w-8 h-8 text-red-500" />
              <span className="text-sm font-medium">5-Star Reviews</span>
            </div>
            <div className="flex flex-col items-center space-y-2">
              <Heart className="w-8 h-8 text-red-500" />
              <span className="text-sm font-medium">100% Satisfaction</span>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Footer */}
      <div className="bg-gray-950 py-6">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="text-sm text-gray-400">
              © {currentYear} Modern Men Hair Salon. All rights reserved.
            </div>

            <div className="flex space-x-6 text-sm">
              <Link href="/privacy-policy" className="text-gray-400 hover:text-white transition-colors">
                Privacy Policy
              </Link>
              <Link href="/terms" className="text-gray-400 hover:text-white transition-colors">
                Terms of Service
              </Link>
              <Link href="/accessibility" className="text-gray-400 hover:text-white transition-colors">
                Accessibility
              </Link>
              <Link href="/sitemap" className="text-gray-400 hover:text-white transition-colors">
                Sitemap
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}

// Compact footer for dashboard pages
export function DashboardFooter({ className }: FooterProps) {
  const currentYear = new Date().getFullYear()

  return (
    <footer className={cn("bg-gray-50 border-t", className)}>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
          <div className="flex items-center space-x-2">
            <div className="w-5 h-5 bg-red-600 rounded-full flex items-center justify-center">
              <span className="text-white text-xs font-bold">M</span>
            </div>
            <span className="text-sm font-medium">Modern Men Hair Salon</span>
          </div>

          <div className="text-sm text-muted-foreground">
            © {currentYear} Modern Men Hair Salon. All rights reserved.
          </div>

          <div className="flex space-x-4 text-sm text-muted-foreground">
            <Link href="/privacy-policy" className="hover:text-foreground transition-colors">
              Privacy
            </Link>
            <Link href="/terms" className="hover:text-foreground transition-colors">
              Terms
            </Link>
            <Link href="/support" className="hover:text-foreground transition-colors">
              Support
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
