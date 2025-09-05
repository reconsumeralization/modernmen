import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { Toaster } from 'sonner'
import { AuthProvider } from '@/components/auth/AuthProvider'
import './globals.css'
import { BrandingProvider } from '@/components/ui/branding-provider'
import { RealtimeNotificationProvider } from '@/components/layout/RealtimeNotificationProvider'
// Dynamic import to avoid useSearchParams in server context
import dynamic from 'next/dynamic'

const AnalyticsProvider = dynamic(() => import('@/components/analytics/AnalyticsProvider').then(mod => ({ default: mod.AnalyticsProvider })), {
  ssr: false,
  loading: () => null
})
import { PrivacyConsent } from '@/components/analytics/PrivacyConsent'
import { PWAManager } from '@/components/pwa/PWAManager'

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
        <PWAManager>
          <AnalyticsProvider
            trackingId={process.env.NEXT_PUBLIC_GA_TRACKING_ID}
            debug={process.env.NODE_ENV === 'development'}
          >
            <BrandingProvider>
              <AuthProvider>
                <RealtimeNotificationProvider>
                  {children}
                  <Toaster
                    position="top-right"
                    richColors
                    closeButton
                    duration={4000}
                  />
                  <PrivacyConsent />
                </RealtimeNotificationProvider>
              </AuthProvider>
            </BrandingProvider>
          </AnalyticsProvider>
        </PWAManager>
      </body>
    </html>
  )
}
