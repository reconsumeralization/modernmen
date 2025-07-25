import type { Metadata } from 'next'
import './globals.css'
import Header from './components/Header'
import Footer from './components/Footer'
import { CartProvider } from './contexts/CartContext'

export const metadata: Metadata = {
  title: 'Modern Men Hair Salon - Regina, Saskatchewan',
  description: 'At Modern Men Salon we take Men\'s Grooming to the highest level of experience and satisfaction.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="font-sans bg-white text-gray-900">
        <CartProvider>
          <Header />
          {children}
          <Footer />
        </CartProvider>
      </body>
    </html>
  )
}
