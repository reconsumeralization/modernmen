import type { Metadata } from 'next'
import './globals.css'
import Header from './components/Header'
import Footer from './components/Footer'
import { CartProvider } from './contexts/CartContext'

export const metadata: Metadata = {
  title: {
    default: 'Modernmen Barbershop – Regina | Precision Cuts, Hot Towel Shaves, Beard Trims',
    template: '%s | Modernmen Barbershop'
  },
  description: "Classic craft, modern results. Precision men's haircuts, hot towel shaves, and beard trims in Regina. Book online.",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="font-sans bg-white text-gray-900">
        {/* LocalBusiness / Barbershop Schema */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@graph': [
                {
                  '@type': 'Barbershop',
                  name: 'Modern Men Hair Salon',
                  url: 'https://modernmen.ca',
                  telephone: '+1-306-522-4111',
                  address: {
                    '@type': 'PostalAddress',
                    streetAddress: '#4 - 425 Victoria Ave East',
                    addressLocality: 'Regina',
                    addressRegion: 'SK',
                    postalCode: 'S4N 0N8',
                    addressCountry: 'CA'
                  },
                  image: 'https://modernmen.ca/images/modernmenhaircut.png',
                  openingHoursSpecification: [
                    { '@type': 'OpeningHoursSpecification', dayOfWeek: ['Monday','Tuesday','Wednesday','Thursday','Friday'], opens: '09:00', closes: '20:00' },
                    { '@type': 'OpeningHoursSpecification', dayOfWeek: 'Saturday', opens: '09:00', closes: '18:00' },
                    { '@type': 'OpeningHoursSpecification', dayOfWeek: 'Sunday', opens: '11:00', closes: '17:00' }
                  ],
                  sameAs: [
                    'https://www.instagram.com/modernmenhairsalon',
                    'https://www.facebook.com/modernmenhairsalon',
                    'https://g.page/r/CQzq0pcoq6sMEAE'
                  ],
                  priceRange: '$$'
                },
                {
                  '@type': 'Service',
                  name: 'Modern Cut',
                  provider: { '@type': 'Barbershop', name: 'Modern Men Hair Salon' },
                  areaServed: { '@type': 'City', name: 'Regina' },
                  serviceType: "Men's haircut"
                },
                {
                  '@type': 'Service',
                  name: 'Skin Fade',
                  provider: { '@type': 'Barbershop', name: 'Modern Men Hair Salon' },
                  areaServed: { '@type': 'City', name: 'Regina' },
                  serviceType: 'Fade haircut'
                },
                {
                  '@type': 'Service',
                  name: 'Beard Trim & Line-Up',
                  provider: { '@type': 'Barbershop', name: 'Modern Men Hair Salon' },
                  areaServed: { '@type': 'City', name: 'Regina' },
                  serviceType: 'Beard trim'
                },
                {
                  '@type': 'Service',
                  name: 'Hot Towel Shave',
                  provider: { '@type': 'Barbershop', name: 'Modern Men Hair Salon' },
                  areaServed: { '@type': 'City', name: 'Regina' },
                  serviceType: 'Shaving'
                },
                {
                  '@type': 'FAQPage',
                  mainEntity: [
                    {
                      '@type': 'Question',
                      name: 'Do you take walk-ins?',
                      acceptedAnswer: { '@type': 'Answer', text: 'Walk-ins are welcome when available; booking online guarantees your time.' }
                    },
                    {
                      '@type': 'Question',
                      name: 'What is the Signature Ritual?',
                      acceptedAnswer: { '@type': 'Answer', text: 'A premium add-on: warm towel, pre-shave oil, hot lather neck cleanup, cooling tonic, and aftercare recommendations.' }
                    }
                  ]
                }
              ]
            }),
          }}
        />
        <CartProvider>
          <Header />
          <main className="pt-[72px] sm:pt-[80px]">{children}</main>
          <Footer />
          {/* Sticky mobile booking bar */}
          <div className="fixed inset-x-0 bottom-0 z-50 sm:hidden">
            <div className="bg-black text-white border-t border-brand-silver/30 px-4 py-3 flex items-center justify-between" style={{ paddingBottom: 'calc(env(safe-area-inset-bottom) + 12px)' }}>
              <span className="text-sm">Ready when you are.</span>
              <a href="/book-enhanced" className="px-4 py-2 bg-white text-black text-sm font-semibold hover:bg-gray-100 transition-colors rounded">
                Book Now
              </a>
            </div>
          </div>
        </CartProvider>
      </body>
    </html>
  )
}
