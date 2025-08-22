'use client'

import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Icons } from '@/components/ui/icons'

export default function AdminPage() {
  const { data: session, status } = useSession()
  const router = useRouter()

  useEffect(() => {
    if (status === 'loading') return
    if (!session) {
      router.push('/portal/login')
    }
  }, [session, status, router])

  const handleAdminAccess = () => {
    window.location.href = '/admin'
  }

  if (status === 'loading') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-amber-50 via-white to-blue-50 flex items-center justify-center">
        <div className="flex items-center space-x-2">
          <Icons.spinner className="h-6 w-6 animate-spin text-amber-600" />
          <span className="text-gray-600">Loading...</span>
        </div>
      </div>
    )
  }

  if (!session) {
    return null
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-white to-blue-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-amber-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-600 via-amber-600 to-blue-800 rounded-full flex items-center justify-center shadow-lg">
                <span className="text-xl text-white font-bold">✂</span>
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 via-amber-600 to-blue-800 bg-clip-text text-transparent">
                  Salon Management System
                </h1>
                <p className="text-sm text-gray-600">Access the admin dashboard</p>
              </div>
            </div>
            <Button
              variant="outline"
              onClick={() => router.push('/portal')}
              className="border-amber-200 hover:border-amber-300 hover:bg-amber-50"
            >
              Back to Portal
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-800 mb-4">
            Modern Men Salon Management
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Access the comprehensive management system to handle customers, appointments,
            services, stylists, and business operations.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow duration-200">
            <CardHeader className="bg-gradient-to-r from-blue-600 to-amber-600 text-white rounded-t-lg">
              <CardTitle className="flex items-center space-x-2">
                <Icons.users className="h-5 w-5" />
                <span>Customer Management</span>
              </CardTitle>
              <CardDescription className="text-blue-100">
                Manage customer profiles and information
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-6">
              <ul className="space-y-2 text-sm text-gray-600">
                <li className="flex items-center space-x-2">
                  <div className="w-1.5 h-1.5 bg-amber-500 rounded-full"></div>
                  <span>Customer profiles and history</span>
                </li>
                <li className="flex items-center space-x-2">
                  <div className="w-1.5 h-1.5 bg-amber-500 rounded-full"></div>
                  <span>Loyalty program management</span>
                </li>
                <li className="flex items-center space-x-2">
                  <div className="w-1.5 h-1.5 bg-amber-500 rounded-full"></div>
                  <span>Customer preferences</span>
                </li>
              </ul>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow duration-200">
            <CardHeader className="bg-gradient-to-r from-amber-600 to-blue-600 text-white rounded-t-lg">
              <CardTitle className="flex items-center space-x-2">
                <Icons.calendar className="h-5 w-5" />
                <span>Appointment System</span>
              </CardTitle>
              <CardDescription className="text-amber-100">
                Schedule and manage appointments
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-6">
              <ul className="space-y-2 text-sm text-gray-600">
                <li className="flex items-center space-x-2">
                  <div className="w-1.5 h-1.5 bg-blue-500 rounded-full"></div>
                  <span>Appointment scheduling</span>
                </li>
                <li className="flex items-center space-x-2">
                  <div className="w-1.5 h-1.5 bg-blue-500 rounded-full"></div>
                  <span>Calendar management</span>
                </li>
                <li className="flex items-center space-x-2">
                  <div className="w-1.5 h-1.5 bg-blue-500 rounded-full"></div>
                  <span>Stylist availability</span>
                </li>
              </ul>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow duration-200">
            <CardHeader className="bg-gradient-to-r from-blue-800 to-amber-700 text-white rounded-t-lg">
              <CardTitle className="flex items-center space-x-2">
                <Icons.scissors className="h-5 w-5" />
                <span>Services & Stylists</span>
              </CardTitle>
              <CardDescription className="text-blue-100">
                Manage services and staff
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-6">
              <ul className="space-y-2 text-sm text-gray-600">
                <li className="flex items-center space-x-2">
                  <div className="w-1.5 h-1.5 bg-amber-500 rounded-full"></div>
                  <span>Service catalog management</span>
                </li>
                <li className="flex items-center space-x-2">
                  <div className="w-1.5 h-1.5 bg-amber-500 rounded-full"></div>
                  <span>Stylist profiles and schedules</span>
                </li>
                <li className="flex items-center space-x-2">
                  <div className="w-1.5 h-1.5 bg-amber-500 rounded-full"></div>
                  <span>Pricing and packages</span>
                </li>
              </ul>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow duration-200">
            <CardHeader className="bg-gradient-to-r from-amber-700 to-blue-800 text-white rounded-t-lg">
              <CardTitle className="flex items-center space-x-2">
                <Icons.barChart3 className="h-5 w-5" />
                <span>Business Analytics</span>
              </CardTitle>
              <CardDescription className="text-amber-100">
                Reports and business insights
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-6">
              <ul className="space-y-2 text-sm text-gray-600">
                <li className="flex items-center space-x-2">
                  <div className="w-1.5 h-1.5 bg-blue-500 rounded-full"></div>
                  <span>Revenue and commission reports</span>
                </li>
                <li className="flex items-center space-x-2">
                  <div className="w-1.5 h-1.5 bg-blue-500 rounded-full"></div>
                  <span>Customer analytics</span>
                </li>
                <li className="flex items-center space-x-2">
                  <div className="w-1.5 h-1.5 bg-blue-500 rounded-full"></div>
                  <span>Performance metrics</span>
                </li>
              </ul>
            </CardContent>
          </Card>
        </div>

        {/* Access Admin System */}
        <div className="text-center">
          <Card className="border-0 shadow-lg max-w-md mx-auto">
            <CardHeader className="bg-gradient-to-r from-blue-600 via-amber-600 to-blue-800 text-white rounded-t-lg">
              <CardTitle>Access Management System</CardTitle>
              <CardDescription className="text-blue-100">
                Secure admin dashboard for salon management
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-6">
              <p className="text-gray-600 mb-6">
                Access the comprehensive Payload CMS management system to handle all aspects
                of your salon operations.
              </p>
              <Button
                onClick={handleAdminAccess}
                className="w-full bg-gradient-to-r from-blue-600 to-amber-600 hover:from-blue-700 hover:to-amber-700 text-white font-semibold py-3 rounded-lg shadow-lg hover:shadow-xl transition-all duration-200"
              >
                <Icons.settings className="mr-2 h-5 w-5" />
                Access Admin Dashboard
              </Button>
              <p className="text-xs text-gray-500 mt-4">
                Requires administrator privileges
              </p>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Footer */}
      <div className="mt-16 bg-white border-t border-amber-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <p className="text-sm text-gray-500">
              © 2025 Modern Men Barbershop. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}