'use client'

import { useEffect } from 'react'
import { logger } from '@/lib/logger'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { AlertTriangle, Home, RefreshCw } from 'lucide-react'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    // Log the error to our custom logger
    logger.error('Next.js Error Page triggered', {
      error: error.message,
      stack: error.stack,
      digest: error.digest,
      timestamp: new Date().toISOString(),
      userAgent: typeof window !== 'undefined' ? window.navigator.userAgent : 'unknown'
    }, error)
  }, [error])

  const handleRetry = () => {
    logger.info('User clicked retry button on error page', {
      error: error.message,
      timestamp: new Date().toISOString()
    })
    reset()
  }

  const handleGoHome = () => {
    logger.info('User clicked go home button on error page', {
      error: error.message,
      timestamp: new Date().toISOString()
    })
    window.location.href = '/'
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <Card className="w-full max-w-lg">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <div className="rounded-full bg-destructive/10 p-3">
              <AlertTriangle className="h-8 w-8 text-destructive" />
            </div>
          </div>
          <CardTitle className="text-2xl font-bold text-foreground">
            Oops! Something went wrong
          </CardTitle>
        </CardHeader>

        <CardContent className="space-y-6">
          <div className="text-center">
            <p className="text-muted-foreground mb-4">
              We're experiencing some technical difficulties. Our team has been notified and is working to fix the issue.
            </p>

            <div className="text-sm text-muted-foreground bg-muted/50 rounded-lg p-3 mb-6">
              <strong>Error ID:</strong> {error.digest || 'Unknown'}
            </div>
          </div>

          <div className="space-y-3">
            <Button
              onClick={handleRetry}
              className="w-full"
              variant="default"
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              Try Again
            </Button>

            <Button
              onClick={handleGoHome}
              className="w-full"
              variant="outline"
            >
              <Home className="h-4 w-4 mr-2" />
              Go to Homepage
            </Button>
          </div>

          <div className="text-center">
            <p className="text-xs text-muted-foreground">
              If this problem persists, please contact our support team with the error ID above.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
