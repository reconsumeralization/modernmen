'use client'

import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Icons } from '@/lib/icons'
import { AppointmentCardSkeleton, ServiceCardSkeleton, ProfileSkeleton } from '@/components/ui/loading'

export default function PortalPage() {
  const { data: session, status } = useSession()
  const router = useRouter()

  useEffect(() => {
    if (status === 'loading') return // Still loading
    if (!session) {
      // Redirect to the correct sign-in page with callback URL
      router.push('/auth/signin?callbackUrl=/portal')
    }
  }, [session, status, router])

  if (status === 'loading') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-amber-50 via-white to-blue-50">
        {/* Header Skeleton */}
        <div className="bg-white shadow-sm border-b border-amber-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center py-6">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-gray-200 rounded-full animate-pulse"></div>
                <div>
                  <div className="h-6 bg-gray-200 rounded w-48 mb-2 animate-pulse"></div>
                  <div className="h-4 bg-gray-200 rounded w-32 animate-pulse"></div>
                </div>
              </div>
              <div className="h-10 bg-gray-200 rounded w-32 animate-pulse"></div>
            </div>
          </div>
        </div>

        {/* Main Content Skeleton */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <AppointmentCardSkeleton />
            <ServiceCardSkeleton />
            <ProfileSkeleton />
          </div>

          {/* Quick Actions Skeleton */}
          <div className="mt-8">
            <div className="h-6 bg-gray-200 rounded w-32 mb-4 animate-pulse"></div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="h-20 bg-gray-200 rounded-lg animate-pulse"></div>
              ))}
            </div>
          </div>
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
              <div className="space-y-3 mb-4">
                <div className="flex items-center justify-between p-3 bg-gradient-to-r from-amber-50 to-blue-50 rounded-lg border border-amber-100">
                  <div>
                    <p className="font-semibold text-gray-800">Classic Haircut</p>
                    <p className="text-sm text-gray-600">March 15, 2025 - 10:00 AM</p>
                  </div>
                  <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full font-medium">
                    Confirmed
                  </span>
                </div>
                <div className="flex items-center justify-between p-3 bg-gradient-to-r from-amber-50 to-blue-50 rounded-lg border border-amber-100">
                  <div>
                    <p className="font-semibold text-gray-800">Beard Trim</p>
                    <p className="text-sm text-gray-600">April 2, 2025 - 2:30 PM</p>
                  </div>
                  <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full font-medium">
                    Upcoming
                  </span>
                </div>
              </div>
              <div className="flex space-x-2">
                <Button
                  onClick={() => router.push('/portal/book')}
                  className="flex-1 bg-gradient-to-r from-blue-600 to-amber-600 hover:from-blue-700 hover:to-amber-700 text-white"
                >
                  Book New
                </Button>
                <Button
                  variant="outline"
                  className="border-amber-200 hover:border-amber-300 hover:bg-amber-50"
                >
                  View All
                </Button>
              </div>
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
              <div className="space-y-3 mb-4">
                <div className="flex justify-between items-center p-2 bg-gradient-to-r from-amber-50 to-blue-50 rounded-lg">
                  <span className="text-sm font-medium text-gray-800">Classic Haircut</span>
                  <span className="text-sm font-bold text-blue-600">$35</span>
                </div>
                <div className="flex justify-between items-center p-2 bg-gradient-to-r from-amber-50 to-blue-50 rounded-lg">
                  <span className="text-sm font-medium text-gray-800">Hair Coloring</span>
                  <span className="text-sm font-bold text-blue-600">$85</span>
                </div>
                <div className="flex justify-between items-center p-2 bg-gradient-to-r from-amber-50 to-blue-50 rounded-lg">
                  <span className="text-sm font-medium text-gray-800">Beard Trim</span>
                  <span className="text-sm font-bold text-blue-600">$25</span>
                </div>
              </div>
              <div className="flex space-x-2">
                <Button
                  onClick={() => router.push('/portal/services')}
                  className="flex-1 bg-gradient-to-r from-amber-600 to-blue-600 hover:from-amber-700 hover:to-blue-700 text-white"
                >
                  View All Services
                </Button>
                <Button
                  onClick={() => router.push('/portal/book')}
                  variant="outline"
                  className="border-amber-200 hover:border-amber-300 hover:bg-amber-50"
                >
                  Book Now
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Profile Card */}
          <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow duration-200">
            <CardHeader className="bg-gradient-to-r from-blue-800 to-amber-700 text-white rounded-t-lg">
              <CardTitle className="flex items-center space-x-2">
                <Icons.users className="h-5 w-5" />
                <span>My Profile</span>
              </CardTitle>
              <CardDescription className="text-blue-100">
                Manage your account information
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="text-center mb-4">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-600 via-amber-600 to-blue-800 rounded-full flex items-center justify-center shadow-lg mx-auto mb-3">
                  <span className="text-xl text-white font-bold">
                    {session.user?.name?.charAt(0)?.toUpperCase() || 'U'}
                  </span>
                </div>
                <h4 className="font-semibold text-gray-800 mb-1">
                  {session.user?.name || 'User'}
                </h4>
                <p className="text-sm text-gray-600">{session.user?.email}</p>
              </div>
              <div className="space-y-3 mb-4">
                <div className="flex justify-between items-center p-2 bg-gradient-to-r from-amber-50 to-blue-50 rounded-lg">
                  <span className="text-sm text-gray-600">Member Status</span>
                  <span className="text-sm font-bold text-blue-600">Gold Member</span>
                </div>
                <div className="flex justify-between items-center p-2 bg-gradient-to-r from-amber-50 to-blue-50 rounded-lg">
                  <span className="text-sm text-gray-600">Loyalty Points</span>
                  <span className="text-sm font-bold text-amber-600">450 pts</span>
                </div>
              </div>
              <div className="flex space-x-2">
                <Button
                  onClick={() => router.push('/portal/profile')}
                  className="flex-1 bg-gradient-to-r from-blue-800 to-amber-700 hover:from-blue-900 hover:to-amber-800 text-white"
                >
                  View Profile
                </Button>
                <Button
                  variant="outline"
                  className="border-amber-200 hover:border-amber-300 hover:bg-amber-50"
                >
                  Settings
                </Button>
              </div>
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
              <Icons.users className="h-6 w-6 text-amber-600" />
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
