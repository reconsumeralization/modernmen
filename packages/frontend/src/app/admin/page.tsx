'use client'

import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Icons } from '@/components/ui/icons'
import { toast } from 'sonner'

interface PayloadStatus {
  success: boolean
  message?: string
  error?: string
  data?: any
}

export default function AdminPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [payloadStatus, setPayloadStatus] = useState<PayloadStatus | null>(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (status === 'loading') return
    if (!session) {
      router.push('/portal/login')
      return
    }

    // Check if user has admin role
    if (session.user?.role !== 'admin') {
      toast.error('Access denied. Admin privileges required.')
      router.push('/portal')
      return
    }

    checkPayloadStatus()
  }, [session, status, router])

  const checkPayloadStatus = async () => {
    setLoading(true)
    try {
      const response = await fetch('/api/payload-test')
      const data = await response.json()
      setPayloadStatus(data)
    } catch (error) {
      setPayloadStatus({
        success: false,
        error: 'Failed to connect to Payload CMS'
      })
    } finally {
      setLoading(false)
    }
  }

  const handleAdminAccess = () => {
    window.location.href = '/admin'
  }

  const handlePayloadAction = async (action: string) => {
    try {
      const response = await fetch(`/api/admin/${action}`)
      const data = await response.json()

      if (response.ok) {
        toast.success(`${action} completed successfully`)
      } else {
        toast.error(`Failed to ${action}: ${data.error}`)
      }
    } catch (error) {
      toast.error(`Error performing ${action}`)
    }
  }

  if (status === 'loading' || loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-amber-50 via-white to-blue-50 flex items-center justify-center">
        <div className="flex items-center space-x-2">
          <Icons.spinner className="h-6 w-6 animate-spin text-amber-600" />
          <span className="text-gray-600">Loading admin dashboard...</span>
        </div>
      </div>
    )
  }

  if (!session || session.user?.role !== 'admin') {
    return null // Will redirect in useEffect
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-white to-blue-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-amber-600 text-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <span className="text-2xl">✂</span>
                <h1 className="text-2xl font-bold">Modern Men Salon</h1>
              </div>
              <span className="text-blue-200">|</span>
              <span className="text-blue-100">Admin Dashboard</span>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-blue-100">Welcome, {session.user?.name || session.user?.email}</span>
              <Button
                variant="outline"
                className="border-white text-white hover:bg-white hover:text-blue-600"
                onClick={() => router.push('/portal')}
              >
                Back to Portal
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Payload Status Card */}
        <Card className="mb-8 border-0 shadow-lg">
          <CardHeader className="bg-gradient-to-r from-green-600 to-blue-600 text-white rounded-t-lg">
            <CardTitle className="flex items-center space-x-2">
              <Icons.database className="h-5 w-5" />
              <span>Payload CMS Status</span>
            </CardTitle>
            <CardDescription className="text-green-100">
              Content Management System Integration
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-6">
            {payloadStatus ? (
              <div className="space-y-4">
                <div className={`flex items-center space-x-2 ${payloadStatus.success ? 'text-green-600' : 'text-red-600'}`}>
                  {payloadStatus.success ? <Icons.info className="h-5 w-5" /> : <Icons.x className="h-5 w-5" />}
                  <span className="font-medium">
                    {payloadStatus.success ? 'Connected' : 'Connection Failed'}
                  </span>
                </div>
                {payloadStatus.message && (
                  <p className="text-gray-600">{payloadStatus.message}</p>
                )}
                {payloadStatus.error && (
                  <p className="text-red-600">{payloadStatus.error}</p>
                )}
              </div>
            ) : (
              <p className="text-gray-600">Loading Payload CMS status...</p>
            )}
          </CardContent>
        </Card>

        {/* Quick Actions Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow duration-200">
            <CardHeader className="bg-gradient-to-r from-blue-600 to-amber-600 text-white rounded-t-lg">
              <CardTitle className="flex items-center space-x-2">
                <Icons.settings className="h-5 w-5" />
                <span>Management System</span>
              </CardTitle>
              <CardDescription className="text-blue-100">
                Access the full Payload CMS admin panel
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-6">
              <p className="text-gray-600 mb-4">
                Manage customers, appointments, services, stylists, and all salon data through the comprehensive admin interface.
              </p>
              <Button
                onClick={handleAdminAccess}
                className="w-full bg-gradient-to-r from-blue-600 to-amber-600 hover:from-blue-700 hover:to-amber-700 text-white"
              >
                Open Admin Panel
              </Button>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow duration-200">
            <CardHeader className="bg-gradient-to-r from-amber-600 to-blue-600 text-white rounded-t-lg">
              <CardTitle className="flex items-center space-x-2">
                <Icons.users className="h-5 w-5" />
                <span>Customer Data</span>
              </CardTitle>
              <CardDescription className="text-amber-100">
                Manage customer profiles and information
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-6">
              <p className="text-gray-600 mb-4">
                View and edit customer profiles, appointment history, and loyalty program data.
              </p>
              <Button
                onClick={() => handlePayloadAction('customers')}
                className="w-full bg-gradient-to-r from-amber-600 to-blue-600 hover:from-amber-700 hover:to-blue-700 text-white"
              >
                Manage Customers
              </Button>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow duration-200">
            <CardHeader className="bg-gradient-to-r from-blue-800 to-amber-700 text-white rounded-t-lg">
              <CardTitle className="flex items-center space-x-2">
                <Icons.calendar className="h-5 w-5" />
                <span>Appointments</span>
              </CardTitle>
              <CardDescription className="text-blue-100">
                Schedule and manage appointments
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-6">
              <p className="text-gray-600 mb-4">
                Create, modify, and track customer appointments with our booking system.
              </p>
              <Button
                onClick={() => handlePayloadAction('appointments')}
                className="w-full bg-gradient-to-r from-blue-800 to-amber-700 hover:from-blue-900 hover:to-amber-800 text-white"
              >
                Manage Appointments
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* System Information */}
        <Card className="border-0 shadow-lg">
          <CardHeader className="bg-gradient-to-r from-gray-700 to-gray-800 text-white rounded-t-lg">
            <CardTitle className="flex items-center space-x-2">
              <Icons.barChart3 className="h-5 w-5" />
              <span>System Information</span>
            </CardTitle>
            <CardDescription className="text-gray-300">
              Current deployment and system status
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-800">Next.js</div>
                <div className="text-sm text-gray-600">Framework</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-800">Payload CMS</div>
                <div className="text-sm text-gray-600">Content Management</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-800">Supabase</div>
                <div className="text-sm text-gray-600">Database</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-800">Vercel</div>
                <div className="text-sm text-gray-600">Deployment</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}