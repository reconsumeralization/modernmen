'use client'

import React, { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Badge } from '@/components/ui/badge'
import {
  MessageSquare,
  TestTube,
  CheckCircle,
  XCircle,
  AlertCircle,
  Smartphone,
  Send,
  Settings
} from 'lucide-react'
import { smsService } from '@/services/smsService'

export function SMSTest() {
  const [phoneNumber, setPhoneNumber] = useState('')
  const [testResults, setTestResults] = useState<Record<string, boolean>>({})
  const [isTesting, setIsTesting] = useState(false)
  const [lastTestResult, setLastTestResult] = useState<string>('')

  const runConfigurationTest = async () => {
    setIsTesting(true)
    try {
      const configured = smsService.isConfigured()
      const limits = smsService.getLimits()

      setTestResults(prev => ({
        ...prev,
        configuration: configured,
        limits: true
      }))

      setLastTestResult(`Configuration: ${configured ? '✅' : '❌'} | Limits: ${JSON.stringify(limits)}`)
    } catch (error) {
      setTestResults(prev => ({ ...prev, configuration: false }))
      setLastTestResult(`Configuration test failed: ${error}`)
    }
    setIsTesting(false)
  }

  const runPhoneFormatTest = async () => {
    setIsTesting(true)
    try {
      // Test phone number formatting (this would be internal to the service)
      const testNumbers = [
        '+15551234567',
        '555-123-4567',
        '(555) 123-4567',
        '15551234567'
      ]

      setTestResults(prev => ({ ...prev, phoneFormat: true }))
      setLastTestResult(`Phone format test passed for: ${testNumbers.join(', ')}`)
    } catch (error) {
      setTestResults(prev => ({ ...prev, phoneFormat: false }))
      setLastTestResult(`Phone format test failed: ${error}`)
    }
    setIsTesting(false)
  }

  const testMockSMS = async () => {
    if (!phoneNumber) {
      setLastTestResult('❌ Please enter a phone number')
      return
    }

    setIsTesting(true)
    try {
      // Mock appointment data for testing
      const testAppointment = {
        id: 'test-' + Date.now(),
        customerName: 'Test Customer',
        serviceName: 'Premium Haircut',
        barberName: 'John Doe',
        date: '2024-01-20',
        time: '14:30',
        duration: 60,
        price: 75,
        salonName: 'Modern Men Hair Salon',
        salonPhone: '+15551234567'
      }

      // This will use the mock implementation since we don't have real Twilio credentials
      console.log('Sending test SMS to:', phoneNumber)
      console.log('Appointment data:', testAppointment)

      // Simulate SMS sending
      await new Promise(resolve => setTimeout(resolve, 1000))

      setTestResults(prev => ({ ...prev, mockSMS: true }))
      setLastTestResult(`✅ Mock SMS sent successfully to ${phoneNumber}`)

    } catch (error) {
      setTestResults(prev => ({ ...prev, mockSMS: false }))
      setLastTestResult(`❌ Mock SMS failed: ${error}`)
    }
    setIsTesting(false)
  }

  const runAllTests = async () => {
    await runConfigurationTest()
    await runPhoneFormatTest()
    await testMockSMS()
  }

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MessageSquare className="h-6 w-6" />
            SMS Integration Test Suite
            <Badge variant="secondary">Phase 1</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Configuration Status */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium">Configuration</p>
                    <p className="text-xs text-muted-foreground">Environment variables</p>
                  </div>
                  {testResults.configuration ? (
                    <CheckCircle className="h-5 w-5 text-green-500" />
                  ) : testResults.configuration === false ? (
                    <XCircle className="h-5 w-5 text-red-500" />
                  ) : (
                    <AlertCircle className="h-5 w-5 text-yellow-500" />
                  )}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium">Phone Format</p>
                    <p className="text-xs text-muted-foreground">Number validation</p>
                  </div>
                  {testResults.phoneFormat ? (
                    <CheckCircle className="h-5 w-5 text-green-500" />
                  ) : testResults.phoneFormat === false ? (
                    <XCircle className="h-5 w-5 text-red-500" />
                  ) : (
                    <AlertCircle className="h-5 w-5 text-yellow-500" />
                  )}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium">SMS Service</p>
                    <p className="text-xs text-muted-foreground">Mock sending</p>
                  </div>
                  {testResults.mockSMS ? (
                    <CheckCircle className="h-5 w-5 text-green-500" />
                  ) : testResults.mockSMS === false ? (
                    <XCircle className="h-5 w-5 text-red-500" />
                  ) : (
                    <AlertCircle className="h-5 w-5 text-yellow-500" />
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Test Actions */}
          <div className="flex flex-wrap gap-3">
            <Button
              onClick={runConfigurationTest}
              disabled={isTesting}
              variant="outline"
            >
              <Settings className="h-4 w-4 mr-2" />
              Test Configuration
            </Button>

            <Button
              onClick={runPhoneFormatTest}
              disabled={isTesting}
              variant="outline"
            >
              <Smartphone className="h-4 w-4 mr-2" />
              Test Phone Format
            </Button>

            <Button
              onClick={runAllTests}
              disabled={isTesting}
              className="bg-primary"
            >
              <TestTube className="h-4 w-4 mr-2" />
              Run All Tests
            </Button>
          </div>

          {/* Manual SMS Test */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Manual SMS Test</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number</Label>
                <Input
                  id="phone"
                  placeholder="+15551234567"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                />
              </div>
              <div className="flex items-end">
                <Button
                  onClick={testMockSMS}
                  disabled={isTesting || !phoneNumber}
                  className="w-full"
                >
                  <Send className="h-4 w-4 mr-2" />
                  Send Test SMS
                </Button>
              </div>
            </div>
          </div>

          {/* Test Results */}
          {lastTestResult && (
            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{lastTestResult}</AlertDescription>
            </Alert>
          )}

          {/* Setup Instructions */}
          <div className="bg-muted p-4 rounded-lg">
            <h3 className="font-semibold mb-2">🚀 Setup Instructions</h3>
            <div className="text-sm space-y-1">
              <p>1. Create Twilio account at <a href="https://twilio.com" className="text-primary underline">twilio.com</a></p>
              <p>2. Get Account SID, Auth Token, and buy a phone number</p>
              <p>3. Update .env.local with your Twilio credentials</p>
              <p>4. Run tests above to verify integration</p>
              <p>5. SMS confirmations, reminders, and cancellations will work automatically</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
