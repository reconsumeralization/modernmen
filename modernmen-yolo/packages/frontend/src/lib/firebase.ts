// Firebase configuration for push notifications
import { initializeApp } from 'firebase/app'
import { getMessaging, getToken, onMessage } from 'firebase/messaging'

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || "demo-key",
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || "modern-men-demo.firebaseapp.com",
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || "modern-men-demo",
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || "modern-men-demo.appspot.com",
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || "123456789",
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || "1:123456789:web:abcdef123456"
}

// Initialize Firebase
const app = initializeApp(firebaseConfig)

// Initialize Firebase Messaging
let messaging: any = null
if (typeof window !== 'undefined') {
  try {
    messaging = getMessaging(app)
  } catch (error) {
    console.warn('Firebase messaging not supported:', error)
  }
}

export { app, messaging }

// Request notification permission and get token
export async function requestNotificationPermission(): Promise<string | null> {
  try {
    if (!messaging) {
      console.warn('Firebase messaging not initialized')
      return null
    }

    const permission = await Notification.requestPermission()
    if (permission !== 'granted') {
      console.warn('Notification permission denied')
      return null
    }

    const token = await getToken(messaging, {
      vapidKey: process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY
    })

    console.log('FCM token:', token)
    return token
  } catch (error) {
    console.error('Error getting FCM token:', error)
    return null
  }
}

// Listen for foreground messages
export function onForegroundMessage(callback: (payload: any) => void) {
  if (!messaging) return

  onMessage(messaging, (payload) => {
    console.log('Foreground message received:', payload)
    callback(payload)
  })
}

// Send token to server for storage
export async function registerDeviceToken(userId: string, token: string) {
  try {
    const response = await fetch('/api/notifications/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        userId,
        token,
        platform: 'web'
      })
    })

    if (!response.ok) {
      throw new Error('Failed to register device token')
    }

    console.log('Device token registered successfully')
    return true
  } catch (error) {
    console.error('Error registering device token:', error)
    return false
  }
}

// Initialize push notifications for the app
export async function initializePushNotifications(userId?: string) {
  if (typeof window === 'undefined' || !messaging) return

  try {
    const token = await requestNotificationPermission()
    if (token && userId) {
      await registerDeviceToken(userId, token)
    }

    // Set up foreground message handler
    onForegroundMessage((payload) => {
      // Show notification if app is in foreground
      if (Notification.permission === 'granted') {
        const notification = new Notification(payload.notification.title, {
          body: payload.notification.body,
          icon: payload.notification.icon || '/icon-192x192.png',
          badge: payload.notification.badge || '/icon-192x192.png',
          data: payload.data
        })

        notification.onclick = () => {
          const url = payload.data?.url || '/'
          window.focus()
          window.location.href = url
        }
      }
    })

    console.log('Push notifications initialized')
  } catch (error) {
    console.error('Error initializing push notifications:', error)
  }
}
