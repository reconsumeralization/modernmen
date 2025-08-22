'use client'

import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Icons } from '@/components/ui/icons'

export default function PortalPage() {
  const { data: session, status } = useSession()
  const router = useRouter()

  useEffect(() => {
    if (status === 'loading') return // Still loading
    if (!session) {
      router.push('/portal/login')
    }
  }, [session, status, router])

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
    return null // Will redirect in useEffect
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
                  Modern Men Portal
                </h1>
                <p className="text-sm text-gray-600">Welcome back, {session.user?.name || session.user?.email}</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-500">
                {new Date().toLocaleDateString('en-US', {
                  weekday: 'long',
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </span>
              <Button
                variant="outline"
                onClick={() => router.push('/')}
                className="border-amber-200 hover:border-amber-300 hover:bg-amber-50"
              >
                Back to Website
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Appointments Card */}
          <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow duration-200">
            <CardHeader className="bg-gradient-to-r from-blue-600 to-amber-600 text-white rounded-t-lg">
              <CardTitle className="flex items-center space-x-2">
                <Icons.calendar className="h-5 w-5" />
                <span>My Appointments</span>
              </CardTitle>
              <CardDescription className="text-blue-100">
                View and manage your upcoming appointments
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-6">
              <p className="text-gray-600 mb-4">You have no upcoming appointments.</p>
              <Button className="w-full bg-gradient-to-r from-blue-600 to-amber-600 hover:from-blue-700 hover:to-amber-700 text-white">
                Book Appointment
              </Button>
            </CardContent>
          </Card>

          {/* Services Card */}
          <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow duration-200">
            <CardHeader className="bg-gradient-to-r from-amber-600 to-blue-600 text-white rounded-t-lg">
              <CardTitle className="flex items-center space-x-2">
                <Icons.scissors className="h-5 w-5" />
                <span>Our Services</span>
              </CardTitle>
              <CardDescription className="text-amber-100">
                Browse our range of professional services
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-6">
              <p className="text-gray-600 mb-4">Discover our premium hair care services.</p>
              <Button className="w-full bg-gradient-to-r from-amber-600 to-blue-600 hover:from-amber-700 hover:to-blue-700 text-white">
                View Services
              </Button>
            </CardContent>
          </Card>

          {/* Profile Card */}
          <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow duration-200">
            <CardHeader className="bg-gradient-to-r from-blue-800 to-amber-700 text-white rounded-t-lg">
              <CardTitle className="flex items-center space-x-2">
                <Icons.user className="h-5 w-5" />
                <span>My Profile</span>
              </CardTitle>
              <CardDescription className="text-blue-100">
                Manage your account information
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="space-y-2 mb-4">
                <p className="text-sm text-gray-600">
                  <strong>Email:</strong> {session.user?.email}
                </p>
                {session.user?.name && (
                  <p className="text-sm text-gray-600">
                    <strong>Name:</strong> {session.user.name}
                  </p>
                )}
              </div>
              <Button variant="outline" className="w-full border-amber-200 hover:border-amber-300 hover:bg-amber-50">
                Edit Profile
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="mt-8">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Quick Actions</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <Button
              variant="outline"
              className="h-20 flex flex-col items-center justify-center space-y-2 border-amber-200 hover:border-amber-300 hover:bg-amber-50"
            >
              <Icons.calendar className="h-6 w-6 text-amber-600" />
              <span className="text-sm font-medium">Book Appointment</span>
            </Button>
            <Button
              variant="outline"
              className="h-20 flex flex-col items-center justify-center space-y-2 border-amber-200 hover:border-amber-300 hover:bg-amber-50"
            >
              <Icons.scissors className="h-6 w-6 text-amber-600" />
              <span className="text-sm font-medium">View Services</span>
            </Button>
            <Button
              variant="outline"
              className="h-20 flex flex-col items-center justify-center space-y-2 border-amber-200 hover:border-amber-300 hover:bg-amber-50"
            >
              <Icons.user className="h-6 w-6 text-amber-600" />
              <span className="text-sm font-medium">Update Profile</span>
            </Button>
            <Button
              variant="outline"
              className="h-20 flex flex-col items-center justify-center space-y-2 border-amber-200 hover:border-amber-300 hover:bg-amber-50"
            >
              <Icons.phone className="h-6 w-6 text-amber-600" />
              <span className="text-sm font-medium">Contact Us</span>
            </Button>
          </div>
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
