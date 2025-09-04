'use client'

import React, { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Alert, AlertDescription } from '@/components/ui/alert'
import {
  BarChart3,
  MousePointer,
  Eye,
  ShoppingCart,
  CreditCard,
  User,
  CheckCircle,
  AlertCircle,
  TestTube
} from 'lucide-react'
import { analyticsService, EVENT_ACTIONS, EVENT_CATEGORIES } from '@/lib/analytics'
import { isAnalyticsEnabled, validateGAConfig } from '@/config/analytics'

export function AnalyticsTest() {
  const [testResults, setTestResults] = useState<Record<string, boolean>>({})
  const [isTesting, setIsTesting] = useState(false)

  const runTest = async (testName: string, testFunction: () => Promise<boolean> | boolean) => {
    setIsTesting(true)
    try {
      const result = await testFunction()
      setTestResults(prev => ({ ...prev, [testName]: result }))
    } catch (error) {
      console.error(`Test ${testName} failed:`, error)
      setTestResults(prev => ({ ...prev, [testName]: false }))
    }
    setIsTesting(false)
  }

  const testPageView = async () => {
    try {
      analyticsService.trackPageView('/test-page', 'Analytics Test Page')
      await new Promise(resolve => setTimeout(resolve, 1000)) // Wait for GA to process
      return true
    } catch (error) {
      console.error('Page view test failed:', error)
      return false
    }
  }

  const testButtonClick = async () => {
    try {
      analyticsService.trackEvent({
        action: EVENT_ACTIONS.BUTTON_CLICK,
        category: EVENT_CATEGORIES.USER_ENGAGEMENT,
        label: 'test_button',
        customParameters: {
          test_type: 'analytics_validation',
          timestamp: new Date().toISOString()
        }
      })
      await new Promise(resolve => setTimeout(resolve, 1000))
      return true
    } catch (error) {
      console.error('Button click test failed:', error)
      return false
    }
  }

  const testServiceInteraction = async () => {
    try {
      analyticsService.trackServiceInteraction('test-service', EVENT_ACTIONS.SERVICE_VIEWED, {
        service_name: 'Test Haircut Service',
        price: 50,
        test_mode: true
      })
      await new Promise(resolve => setTimeout(resolve, 1000))
      return true
    } catch (error) {
      console.error('Service interaction test failed:', error)
      return false
    }
  }

  const testBarberInteraction = async () => {
    try {
      analyticsService.trackBarberInteraction('test-barber', EVENT_ACTIONS.BARBER_PROFILE_VIEWED, {
        barber_name: 'Test Barber',
        rating: 4.5,
        test_mode: true
      })
      await new Promise(resolve => setTimeout(resolve, 1000))
      return true
    } catch (error) {
      console.error('Barber interaction test failed:', error)
      return false
    }
  }

  const testEcommerceEvent = async () => {
    try {
      analyticsService.trackPurchase({
        transaction_id: 'test-transaction-123',
        value: 75.00,
        currency: 'USD',
        tax: 6.75,
        shipping: 0,
        items: [{
          item_id: 'test-service',
          item_name: 'Test Haircut Service',
          item_category: 'Hair Service',
          price: 75.00,
          quantity: 1,
          barber_id: 'test-barber',
          barber_name: 'Test Barber'
        }],
        customer_email: 'test@example.com',
        customer_id: 'test-customer'
      })
      await new Promise(resolve => setTimeout(resolve, 1000))
      return true
    } catch (error) {
      console.error('E-commerce test failed:', error)
      return false
    }
  }

  const testConfiguration = () => {
    return validateGAConfig()
  }

  const testInitialization = () => {
    return analyticsService.isInitialized()
  }

  const tests = [
    {
      name: 'Configuration',
      description: 'Check if GA4 is properly configured',
      icon: <BarChart3 className="w-4 h-4" />,
      function: testConfiguration,
      category: 'setup'
    },
    {
      name: 'Initialization',
      description: 'Check if analytics service is initialized',
      icon: <CheckCircle className="w-4 h-4" />,
      function: testInitialization,
      category: 'setup'
    },
    {
      name: 'Page View',
      description: 'Track a test page view event',
      icon: <Eye className="w-4 h-4" />,
      function: testPageView,
      category: 'tracking'
    },
    {
      name: 'Button Click',
      description: 'Track a test button click event',
      icon: <MousePointer className="w-4 h-4" />,
      function: testButtonClick,
      category: 'tracking'
    },
    {
      name: 'Service Interaction',
      description: 'Track a test service interaction',
      icon: <User className="w-4 h-4" />,
      function: testServiceInteraction,
      category: 'tracking'
    },
    {
      name: 'Barber Interaction',
      description: 'Track a test barber interaction',
      icon: <User className="w-4 h-4" />,
      function: testBarberInteraction,
      category: 'tracking'
    },
    {
      name: 'E-commerce',
      description: 'Track a test purchase event',
      icon: <ShoppingCart className="w-4 h-4" />,
      function: testEcommerceEvent,
      category: 'tracking'
    }
  ]

  const runAllTests = async () => {
    setIsTesting(true)
    const results: Record<string, boolean> = {}

    for (const test of tests) {
      try {
        const result = await test.function()
        results[test.name] = result
        setTestResults(prev => ({ ...prev, [test.name]: result }))
        // Small delay between tests
        await new Promise(resolve => setTimeout(resolve, 500))
      } catch (error) {
        console.error(`Test ${test.name} failed:`, error)
        results[test.name] = false
        setTestResults(prev => ({ ...prev, [test.name]: false }))
      }
    }

    setIsTesting(false)
  }

  const getTestStatus = (testName: string) => {
    if (!(testName in testResults)) return 'pending'
    return testResults[testName] ? 'passed' : 'failed'
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'passed': return 'bg-green-500'
      case 'failed': return 'bg-red-500'
      default: return 'bg-gray-400'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'passed': return <CheckCircle className="w-4 h-4" />
      case 'failed': return <AlertCircle className="w-4 h-4" />
      default: return <TestTube className="w-4 h-4" />
    }
  }

  if (!isAnalyticsEnabled()) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="w-5 h-5" />
            Analytics Testing
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              Analytics is not enabled. Please configure your GA4 tracking ID and ensure user consent is granted.
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <TestTube className="w-5 h-5" />
          Analytics Testing Suite
        </CardTitle>
        <div className="flex items-center gap-2">
          <Button
            onClick={runAllTests}
            disabled={isTesting}
            className="flex items-center gap-2"
          >
            {isTesting ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                Running Tests...
              </>
            ) : (
              <>
                <TestTube className="w-4 h-4" />
                Run All Tests
              </>
            )}
          </Button>
          <Badge variant="outline">
            {Object.keys(testResults).length} of {tests.length} tests run
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {tests.map((test) => {
            const status = getTestStatus(test.name)
            return (
              <div key={test.name} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center gap-3">
                  <div className={`w-3 h-3 rounded-full ${getStatusColor(status)}`} />
                  <div className="flex items-center gap-2">
                    {test.icon}
                    <div>
                      <div className="font-medium">{test.name}</div>
                      <div className="text-sm text-muted-foreground">{test.description}</div>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant={status === 'passed' ? 'default' : status === 'failed' ? 'destructive' : 'secondary'}>
                    {status}
                  </Badge>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => runTest(test.name, test.function)}
                    disabled={isTesting}
                  >
                    Test
                  </Button>
                </div>
              </div>
            )
          })}
        </div>

        <div className="mt-6 p-4 bg-muted rounded-lg">
          <h4 className="font-medium mb-2">Testing Instructions</h4>
          <ul className="text-sm text-muted-foreground space-y-1">
            <li>• Open your browser's developer console to see debug messages</li>
            <li>• Check Google Analytics Real-time reports to verify events</li>
            <li>• Tests may take a few seconds to complete</li>
            <li>• Ensure GA4 tracking ID is properly configured</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  )
}
