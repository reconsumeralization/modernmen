import type { Metadata } from 'next'
import { Inter, Roboto, Roboto_Mono } from 'next/font/google'
import { Suspense } from 'react'
import { Providers } from '@/providers/providers'
import { Toaster } from '@/components/ui/sonner'
import { GlobalErrorBoundary } from '@/components/ui/global-error-boundary'
import { Analytics } from '@vercel/analytics/react'
import { SpeedInsights } from '@vercel/speed-insights/next'
import { NavigationProvider } from '@/contexts/NavigationContext'
import { RoleBasedNavbar } from '@/components/navigation/RoleBasedNavbar'
import { BreadcrumbNavigation } from '@/components/navigation/BreadcrumbNavigation'
import { FloatingChatWidget } from '@/components/ai/FloatingChatWidget'
import './globals.css'
import { MonitoringInit } from '@/components/monitoring/MonitoringInit'

// Loading fallback component for Suspense boundaries
const LoadingFallback = () => null

const inter = Inter({ subsets: ['latin'] })
const roboto = Roboto({
  variable: '--font-roboto-sans',
  subsets: ['latin'],
  weight: ['400', '700'],
})
const robotoMono = Roboto_Mono({
  variable: '--font-roboto-mono',
  subsets: ['latin'],
  weight: ['400', '700'],
})

export const metadata: Metadata = {
  title: {
    default: 'Modern Men Hair Salon - Regina\'s Premier Men\'s Grooming',
    template: '%s | Modern Men Hair Salon'
  },
  description: 'Regina\'s best hair salon and barber shop for men. Expert cuts, traditional shaves, and beard grooming. Book your appointment today at 425 Victoria Ave East.',
  keywords: ['mens haircuts', 'barber shop', 'hair salon', 'Regina', 'Saskatchewan', 'mens grooming', 'beard trim', 'hot towel shave'],
  authors: [{ name: 'Modern Men Hair Salon' }],
  creator: 'Modern Men Hair Salon',
  publisher: 'Modern Men Hair Salon',
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
  openGraph: {
    type: 'website',
    locale: 'en_CA',
    url: 'https://modernmen.ca',
    title: 'Modern Men Hair Salon - Regina\'s Premier Men\'s Grooming',
    description: 'Regina\'s best hair salon and barber shop for men. Expert cuts, traditional shaves, and beard grooming.',
    siteName: 'Modern Men Hair Salon',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Modern Men Hair Salon - Regina\'s Premier Men\'s Grooming',
    description: 'Regina\'s best hair salon and barber shop for men. Expert cuts, traditional shaves, and beard grooming.',
    creator: '@modernmen5024',
  },
  manifest: '/manifest.json',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={`${inter.className} ${roboto.variable} ${robotoMono.variable}`}>
        <GlobalErrorBoundary>
          <Providers>
            <NavigationProvider>
              <MonitoringInit />
              <div className="relative min-h-screen bg-background">
                <div className="absolute inset-0 bg-grid-white/[0.02] bg-grid-16 [mask-image:radial-gradient(ellipse_at_center,transparent_20%,black)]" />
                <RoleBasedNavbar />
                <div className="pt-16"> {/* Account for fixed navbar */}
                  <div className="container mx-auto px-4 py-4">
                    <BreadcrumbNavigation />
                  </div>
                  <main className="relative">
                    {children}
                  </main>
                </div>
              </div>
              <Toaster position="top-right" richColors />
              <Suspense fallback={<LoadingFallback />}>
                <FloatingChatWidget />
              </Suspense>
            </NavigationProvider>
          </Providers>
        </GlobalErrorBoundary>
        <Suspense fallback={<LoadingFallback />}>
          <Analytics />
        </Suspense>
        <Suspense fallback={<LoadingFallback />}>
          <SpeedInsights />
        </Suspense>
      </body>
    </html>
  )
}