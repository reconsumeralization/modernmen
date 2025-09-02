import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { Toaster } from 'sonner'
import { AuthProvider } from '@/components/auth/AuthProvider'
// Service worker registration will be handled by next-pwa plugin
// import PWAInstall from '@/components/ui/pwa-install'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Modern Men Hair Salon',
  description: 'Professional grooming services for the modern gentleman',
  keywords: 'hair salon, barber, grooming, men\'s hair, beard grooming',
  authors: [{ name: 'Modern Men Hair Salon' }],
  creator: 'Modern Men Hair Salon',
  publisher: 'Modern Men Hair Salon',
  openGraph: {
    title: 'Modern Men Hair Salon',
    description: 'Professional grooming services for the modern gentleman',
    url: 'https://modernmen.com',
    siteName: 'Modern Men Hair Salon',
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Modern Men Hair Salon',
    description: 'Professional grooming services for the modern gentleman',
    creator: '@modernmen',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <AuthProvider>
          {children}
          <Toaster
            position="top-right"
            richColors
            closeButton
            duration={4000}
          />
        </AuthProvider>
        {/* PWA components temporarily disabled for deployment stability */}
      </body>
    </html>
  )
}
