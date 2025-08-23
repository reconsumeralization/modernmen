'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { logger } from '@/lib/logger'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Home, ArrowLeft, Search, MessageCircle } from 'lucide-react'

export default function NotFound() {
  const router = useRouter()

  useEffect(() => {
    // Log the 404 event
    logger.warn('404 Page Not Found', {
      url: typeof window !== 'undefined' ? window.location.href : 'unknown',
      userAgent: typeof window !== 'undefined' ? window.navigator.userAgent : 'unknown',
      timestamp: new Date().toISOString()
    })
  }, [])

  const handleGoHome = () => {
    logger.info('User clicked go home from 404 page', {
      from: typeof window !== 'undefined' ? window.location.href : 'unknown'
    })
    router.push('/')
  }

  const handleGoBack = () => {
    logger.info('User clicked go back from 404 page', {
      from: typeof window !== 'undefined' ? window.location.href : 'unknown'
    })
    router.back()
  }

  const handleSearch = () => {
    logger.info('User clicked search from 404 page')
    // You could implement a search modal or redirect to search page
    router.push('/?search=true')
  }

  const handleContact = () => {
    logger.info('User clicked contact from 404 page')
    // Scroll to contact section or navigate to contact page
    const contactSection = document.getElementById('contact')
    if (contactSection) {
      contactSection.scrollIntoView({ behavior: 'smooth' })
    } else {
      router.push('/#contact')
    }
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <Card className="w-full max-w-lg">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <div className="text-6xl font-bold text-muted-foreground">404</div>
          </div>
          <CardTitle className="text-2xl font-bold text-foreground">
            Page Not Found
          </CardTitle>
        </CardHeader>

        <CardContent className="space-y-6">
          <div className="text-center">
            <p className="text-muted-foreground mb-4">
              The page you're looking for doesn't exist or has been moved.
            </p>
            <p className="text-sm text-muted-foreground bg-muted/50 rounded-lg p-3">
              <strong>URL:</strong> {typeof window !== 'undefined' ? window.location.pathname : 'unknown'}
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Button
              onClick={handleGoHome}
              className="w-full"
              variant="default"
            >
              <Home className="h-4 w-4 mr-2" />
              Go Home
            </Button>

            <Button
              onClick={handleGoBack}
              className="w-full"
              variant="outline"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Go Back
            </Button>

            <Button
              onClick={handleSearch}
              className="w-full"
              variant="outline"
            >
              <Search className="h-4 w-4 mr-2" />
              Search Site
            </Button>

            <Button
              onClick={handleContact}
              className="w-full"
              variant="outline"
            >
              <MessageCircle className="h-4 w-4 mr-2" />
              Contact Us
            </Button>
          </div>

          <div className="text-center pt-4 border-t">
            <p className="text-xs text-muted-foreground">
              Looking for something specific? Try our search or contact us for help.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
