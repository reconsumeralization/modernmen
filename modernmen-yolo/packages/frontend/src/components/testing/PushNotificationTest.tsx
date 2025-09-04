'use client'

import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Badge } from '@/components/ui/badge'
import { Switch } from '@/components/ui/switch'
import {
  Bell,
  BellRing,
  TestTube,
  CheckCircle,
  XCircle,
  AlertCircle,
  Smartphone,
  Send,
  Settings,
  User,
  Globe
} from 'lucide-react'
import {
  initializePushNotifications,
  requestNotificationPermission,
  onForegroundMessage
} from '@/lib/firebase'
import { pushService } from '@/services/pushService'

export function PushNotificationTest() {
  const [permissionStatus, setPermissionStatus] = useState<NotificationPermission>('default')
  const [testResults, setTestResults] = useState<Record<string, boolean>>({})
  const [isTesting, setIsTesting] = useState(false)
  const [userId, setUserId] = useState('test-user-123')
  const [lastTestResult, setLastTestResult] = useState<string>('')
  const [foregroundMessages, setForegroundMessages] = useState<any[]>([])

  useEffect(() => {
    // Check current permission status
    if (typeof window !== 'undefined') {
      setPermissionStatus(Notification.permission)
    }

    // Listen for foreground messages
    onForegroundMessage((payload) => {
      setForegroundMessages(prev => [...prev, {
        ...payload,
        timestamp: new Date().toISOString()
      }])
    })
  }, [])

  const requestPermission = async () => {
    setIsTesting(true)
    try {
      const permission = await Notification.requestPermission()
      setPermissionStatus(permission)

      if (permission === 'granted') {
        setTestResults(prev => ({ ...prev, permission: true }))
        setLastTestResult('✅ Notification permission granted')
      } else {
        setTestResults(prev => ({ ...prev, permission: false }))
        setLastTestResult('❌ Notification permission denied')
      }
    } catch (error) {
      setTestResults(prev => ({ ...prev, permission: false }))
      setLastTestResult(`❌ Permission request failed: ${error}`)
    }
    setIsTesting(false)
  }

  const testFirebaseInit = async () => {
    setIsTesting(true)
    try {
      await initializePushNotifications(userId)
      setTestResults(prev => ({ ...prev, firebaseInit: true }))
      setLastTestResult('✅ Firebase push notifications initialized')
    } catch (error) {
      setTestResults(prev => ({ ...prev, firebaseInit: false }))
      setLastTestResult(`❌ Firebase initialization failed: ${error}`)
    }
    setIsTesting(false)
  }

  const testTokenRegistration = async () => {
    setIsTesting(true)
    try {
      const token = await requestNotificationPermission()
      if (token) {
        setTestResults(prev => ({ ...prev, tokenRegistration: true }))
        setLastTestResult(`✅ FCM token obtained: ${token.substring(0, 20)}...`)
      } else {
        setTestResults(prev => ({ ...prev, tokenRegistration: false }))
        setLastTestResult('❌ Failed to obtain FCM token')
      }
    } catch (error) {
      setTestResults(prev => ({ ...prev, tokenRegistration: false }))
      setLastTestResult(`❌ Token registration failed: ${error}`)
    }
    setIsTesting(false)
  }

  const testMockPushNotification = async () => {
    setIsTesting(true)
    try {
      // Create a test notification
      const testNotification = {
        title: 'Test Notification',
        body: 'This is a test push notification from Modern Men!',
        icon: '/icon-192x192.png',
        badge: '/icon-192x192.png',
        url: '/test/push',
        data: {
          type: 'test',
          timestamp: new Date().toISOString()
        },
        tag: 'test-notification'
      }

      // Show notification using browser API (fallback)
      if (Notification.permission === 'granted') {
        const notification = new Notification(testNotification.title, {
          body: testNotification.body,
          icon: testNotification.icon,
          badge: testNotification.badge,
          data: testNotification.data,
          tag: testNotification.tag
        })

        notification.onclick = () => {
          window.focus()
          console.log('Test notification clicked')
        }

        setTestResults(prev => ({ ...prev, mockPush: true }))
        setLastTestResult('✅ Mock push notification sent (check browser)')
      } else {
        setTestResults(prev => ({ ...prev, mockPush: false }))
        setLastTestResult('❌ Notification permission not granted')
      }
    } catch (error) {
      setTestResults(prev => ({ ...prev, mockPush: false }))
      setLastTestResult(`❌ Mock push notification failed: ${error}`)
    }
    setIsTesting(false)
  }

  const testAppointmentReminder = async () => {
    setIsTesting(true)
    try {
      const appointment = {
        id: 'test-appointment-123',
        serviceName: 'Premium Haircut',
        barberName: 'John Doe',
        date: '2024-01-20',
        time: '14:30'
      }

      // This will use the mock implementation
      await pushService.sendAppointmentReminder(userId, appointment)

      setTestResults(prev => ({ ...prev, appointmentReminder: true }))
      setLastTestResult('✅ Appointment reminder notification sent (mock)')
    } catch (error) {
      setTestResults(prev => ({ ...prev, appointmentReminder: false }))
      setLastTestResult(`❌ Appointment reminder failed: ${error}`)
    }
    setIsTesting(false)
  }

  const runAllTests = async () => {
    await requestPermission()
    await testFirebaseInit()
    await testTokenRegistration()
    await testMockPushNotification()
    await testAppointmentReminder()
  }

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bell className="h-6 w-6" />
            Push Notifications Test Suite
            <Badge variant="secondary">Phase 2</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Permission Status */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium">Permission</p>
                    <p className="text-xs text-muted-foreground">Browser access</p>
                  </div>
                  <Badge variant={
                    permissionStatus === 'granted' ? 'default' :
                    permissionStatus === 'denied' ? 'destructive' : 'secondary'
                  }>
                    {permissionStatus}
                  </Badge>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium">Firebase</p>
                    <p className="text-xs text-muted-foreground">SDK init</p>
                  </div>
                  {testResults.firebaseInit ? (
                    <CheckCircle className="h-5 w-5 text-green-500" />
                  ) : testResults.firebaseInit === false ? (
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
                    <p className="text-sm font-medium">Token</p>
                    <p className="text-xs text-muted-foreground">FCM registration</p>
                  </div>
                  {testResults.tokenRegistration ? (
                    <CheckCircle className="h-5 w-5 text-green-500" />
                  ) : testResults.tokenRegistration === false ? (
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
                    <p className="text-sm font-medium">Push Test</p>
                    <p className="text-xs text-muted-foreground">Notification send</p>
                  </div>
                  {testResults.mockPush ? (
                    <CheckCircle className="h-5 w-5 text-green-500" />
                  ) : testResults.mockPush === false ? (
                    <XCircle className="h-5 w-5 text-red-500" />
                  ) : (
                    <AlertCircle className="h-5 w-5 text-yellow-500" />
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* User Configuration */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Test Configuration</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="userId">Test User ID</Label>
                <Input
                  id="userId"
                  value={userId}
                  onChange={(e) => setUserId(e.target.value)}
                  placeholder="Enter test user ID"
                />
              </div>
              <div className="flex items-end">
                <Button
                  onClick={() => setUserId('test-user-' + Date.now())}
                  variant="outline"
                  className="w-full"
                >
                  Generate New ID
                </Button>
              </div>
            </div>
          </div>

          {/* Test Actions */}
          <div className="flex flex-wrap gap-3">
            <Button
              onClick={requestPermission}
              disabled={isTesting}
              variant="outline"
            >
              <Bell className="h-4 w-4 mr-2" />
              Request Permission
            </Button>

            <Button
              onClick={testFirebaseInit}
              disabled={isTesting}
              variant="outline"
            >
              <Settings className="h-4 w-4 mr-2" />
              Init Firebase
            </Button>

            <Button
              onClick={testTokenRegistration}
              disabled={isTesting}
              variant="outline"
            >
              <User className="h-4 w-4 mr-2" />
              Register Token
            </Button>

            <Button
              onClick={testMockPushNotification}
              disabled={isTesting}
              variant="outline"
            >
              <Send className="h-4 w-4 mr-2" />
              Test Push
            </Button>

            <Button
              onClick={testAppointmentReminder}
              disabled={isTesting}
              variant="outline"
            >
              <BellRing className="h-4 w-4 mr-2" />
              Appointment Reminder
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

          {/* Foreground Messages */}
          {foregroundMessages.length > 0 && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Foreground Messages</h3>
              <div className="space-y-2">
                {foregroundMessages.map((message, index) => (
                  <Alert key={index}>
                    <Bell className="h-4 w-4" />
                    <AlertDescription>
                      <strong>{message.notification?.title}</strong>: {message.notification?.body}
                      <br />
                      <small className="text-muted-foreground">
                        {new Date(message.timestamp).toLocaleTimeString()}
                      </small>
                    </AlertDescription>
                  </Alert>
                ))}
              </div>
            </div>
          )}

          {/* Test Results */}
          {lastTestResult && (
            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{lastTestResult}</AlertDescription>
            </Alert>
          )}

          {/* Setup Instructions */}
          <div className="bg-muted p-4 rounded-lg">
            <h3 className="font-semibold mb-2">🚀 Firebase Setup Instructions</h3>
            <div className="text-sm space-y-1">
              <p>1. Create Firebase project at <a href="https://console.firebase.google.com/" className="text-primary underline">console.firebase.google.com</a></p>
              <p>2. Enable Cloud Messaging in Project Settings</p>
              <p>3. Generate server key and sender ID</p>
              <p>4. Update .env.local with Firebase config</p>
              <p>5. Generate VAPID keys for web push</p>
              <p>6. Update manifest.json with Firebase config</p>
            </div>
          </div>

          {/* Environment Variables Template */}
          <div className="bg-muted p-4 rounded-lg">
            <h3 className="font-semibold mb-2">📝 Required Environment Variables</h3>
            <pre className="text-xs bg-background p-2 rounded border overflow-x-auto">
{`# Firebase Configuration
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=modern-men-pwa.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=modern-men-pwa
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=modern-men-pwa.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456789
NEXT_PUBLIC_FIREBASE_APP_ID=1:123456789:web:abcdef123456

# VAPID Keys for Push Notifications
NEXT_PUBLIC_VAPID_PUBLIC_KEY=your_vapid_public_key
VAPID_PRIVATE_KEY=your_vapid_private_key`}
            </pre>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
