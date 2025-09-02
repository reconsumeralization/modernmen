'use client'

import React, { useState, useEffect, useCallback } from 'react'
import { useAuth } from '@/components/auth/AuthProvider'
import { BookingService, Appointment } from '@/services/bookingService'
import { PaymentService, PaymentMethod } from '@/services/paymentService'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Calendar, Clock, User, CreditCard, Star, Gift, History, Settings, Plus, X, Edit } from 'lucide-react'
import { TutorialSystem } from '@/components/tutorial/TutorialSystem'
import { toast } from 'sonner'

interface CustomerStats {
  totalAppointments: number
  completedAppointments: number
  loyaltyPoints: number
  currentTier: string
  nextTierPoints: number
}

export function CustomerDashboard() {
  const { user, signOut } = useAuth()
  const [activeTab, setActiveTab] = useState('overview')
  const [appointments, setAppointments] = useState<Appointment[]>([])
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([])
  const [stats, setStats] = useState<CustomerStats>({
    totalAppointments: 0,
    completedAppointments: 0,
    loyaltyPoints: 0,
    currentTier: 'Bronze',
    nextTierPoints: 100
  })
  const [loading, setLoading] = useState(true)

  const loadDashboardData = useCallback(async () => {
    try {
      setLoading(true)

      // Load appointments
      const appointmentsData = await BookingService.getCustomerAppointments(user!.id)
      setAppointments(appointmentsData)

      // Load payment methods
      const paymentMethodsData = await PaymentService.getPaymentMethods(user!.id)
      setPaymentMethods(paymentMethodsData)

      // Calculate stats
      const totalAppointments = appointmentsData.length
      const completedAppointments = appointmentsData.filter(apt => apt.status === 'completed').length
      const loyaltyPoints = user!.user_metadata?.loyaltyPoints || 0

      // Determine tier based on points
      let currentTier = 'Bronze'
      let nextTierPoints = 100

      if (loyaltyPoints >= 500) {
        currentTier = 'Platinum'
        nextTierPoints = 0
      } else if (loyaltyPoints >= 200) {
        currentTier = 'Gold'
        nextTierPoints = 500
      } else if (loyaltyPoints >= 100) {
        currentTier = 'Silver'
        nextTierPoints = 200
      }

      setStats({
        totalAppointments,
        completedAppointments,
        loyaltyPoints,
        currentTier,
        nextTierPoints
      })
    } catch (error) {
      toast.error('Failed to load dashboard data')
      console.error('Error loading dashboard:', error)
    } finally {
      setLoading(false)
    }
  }, [user])

  useEffect(() => {
    if (user) {
      loadDashboardData()
    }
  }, [user, loadDashboardData])



  const handleCancelAppointment = async (appointmentId: string) => {
    try {
      await BookingService.cancelAppointment(appointmentId)
      toast.success('Appointment cancelled successfully')
      loadDashboardData() // Reload data
    } catch (error) {
      toast.error('Failed to cancel appointment')
      console.error('Error cancelling appointment:', error)
    }
  }

  const handleRescheduleAppointment = (appointmentId: string) => {
    // Navigate to booking page with pre-filled data
    window.location.href = `/book?reschedule=${appointmentId}`
  }

  const getStatusBadge = (status: string) => {
    const variants: Record<string, "default" | "secondary" | "destructive" | "outline"> = {
      'pending': 'outline',
      'confirmed': 'default',
      'in-progress': 'secondary',
      'completed': 'default',
      'cancelled': 'destructive',
      'no-show': 'destructive'
    }

    return (
      <Badge variant={variants[status] || 'outline'}>
        {status.replace('-', ' ').toUpperCase()}
      </Badge>
    )
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  const formatTime = (timeString: string) => {
    return timeString
  }

  if (!user) {
    return (
      <div className="text-center py-8">
        <p>Please sign in to view your dashboard.</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background py-8">
      <div className="container mx-auto px-4 max-w-6xl">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl lg:text-4xl font-bold mb-2">Welcome back, {user.user_metadata?.name || 'Customer'}!</h1>
            <p className="text-lg text-muted-foreground">
              Manage your appointments, loyalty points, and account settings
            </p>
          </div>
          <div className="flex gap-3">
            <Button onClick={() => window.location.href = '/book'}>
              <Plus className="w-4 h-4 mr-2" />
              Book Appointment
            </Button>
            <Button variant="outline" onClick={() => signOut()}>
              Sign Out
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Appointments</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalAppointments}</div>
              <p className="text-xs text-muted-foreground">
                {stats.completedAppointments} completed
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Loyalty Points</CardTitle>
              <Star className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.loyaltyPoints}</div>
              <p className="text-xs text-muted-foreground">
                {stats.currentTier} Tier
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Next Tier</CardTitle>
              <Gift className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {stats.nextTierPoints > 0 ? `${stats.nextTierPoints - stats.loyaltyPoints} more` : 'Max Tier'}
              </div>
              <p className="text-xs text-muted-foreground">
                {stats.nextTierPoints > 0 ? 'points needed' : 'You\'ve reached the top!'}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Payment Methods</CardTitle>
              <CreditCard className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{paymentMethods.length}</div>
              <p className="text-xs text-muted-foreground">
                saved methods
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="appointments">Appointments</TabsTrigger>
            <TabsTrigger value="loyalty">Loyalty</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
            <TabsTrigger value="tutorials">Learn</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            {/* Upcoming Appointments */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="w-5 h-5" />
                  Upcoming Appointments
                </CardTitle>
              </CardHeader>
              <CardContent>
                {appointments.filter(apt => ['pending', 'confirmed'].includes(apt.status)).length === 0 ? (
                  <p className="text-muted-foreground text-center py-8">
                    No upcoming appointments. Book your next appointment now!
                  </p>
                ) : (
                  <div className="space-y-4">
                    {appointments
                      .filter(apt => ['pending', 'confirmed'].includes(apt.status))
                      .slice(0, 3)
                      .map((appointment) => (
                        <div key={appointment.id} className="flex items-center justify-between p-4 border rounded-lg">
                          <div className="flex items-center gap-4">
                            <div className="text-center">
                              <div className="text-sm font-medium">
                                {new Date(appointment.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                              </div>
                              <div className="text-xs text-muted-foreground">
                                {appointment.time}
                              </div>
                            </div>
                            <div>
                              <div className="font-medium">
                                {appointment.service || 'Service'}
                              </div>
                              <div className="text-sm text-muted-foreground">
                                with {appointment.barber || 'Barber'}
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            {getStatusBadge(appointment.status)}
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleRescheduleAppointment(appointment.id)}
                            >
                              <Edit className="w-4 h-4" />
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleCancelAppointment(appointment.id)}
                            >
                              <X className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                      ))}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Recent Activity */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <History className="w-5 h-5" />
                  Recent Activity
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {appointments.slice(0, 5).map((appointment) => (
                    <div key={appointment.id} className="flex items-center gap-4 p-3 border rounded-lg">
                      <div className="w-2 h-2 bg-primary rounded-full"></div>
                      <div className="flex-1">
                        <div className="text-sm">
                          <span className="font-medium">
                            {appointment.status === 'completed' ? 'Completed' : 
                             appointment.status === 'cancelled' ? 'Cancelled' : 'Updated'}
                          </span>
                          {' '}appointment for {appointment.service || 'service'}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {formatDate(appointment.date)} at {formatTime(appointment.time)}
                        </div>
                      </div>
                      {getStatusBadge(appointment.status)}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Appointments Tab */}
          <TabsContent value="appointments" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="w-5 h-5" />
                  All Appointments
                </CardTitle>
              </CardHeader>
              <CardContent>
                {appointments.length === 0 ? (
                  <p className="text-muted-foreground text-center py-8">
                    No appointments found. Book your first appointment now!
                  </p>
                ) : (
                  <div className="space-y-4">
                    {appointments.map((appointment) => (
                      <div key={appointment.id} className="border rounded-lg p-4">
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center gap-4">
                            <div className="text-center">
                              <div className="text-lg font-bold">
                                {new Date(appointment.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                              </div>
                              <div className="text-sm text-muted-foreground">
                                {appointment.time}
                              </div>
                            </div>
                            <div>
                              <div className="font-semibold text-lg">
                                {appointment.service || 'Service'}
                              </div>
                              <div className="text-muted-foreground">
                                with {appointment.barber || 'Barber'}
                              </div>
                              <div className="text-sm text-muted-foreground">
                                {appointment.duration} minutes • ${appointment.price}
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            {getStatusBadge(appointment.status)}
                            {['pending', 'confirmed'].includes(appointment.status) && (
                              <>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => handleRescheduleAppointment(appointment.id)}
                                >
                                  <Edit className="w-4 h-4 mr-2" />
                                  Reschedule
                                </Button>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => handleCancelAppointment(appointment.id)}
                                >
                                  <X className="w-4 h-4 mr-2" />
                                  Cancel
                                </Button>
                              </>
                            )}
                          </div>
                        </div>
                        {appointment.notes && (
                          <div className="bg-muted p-3 rounded-lg">
                            <div className="text-sm font-medium mb-1">Notes:</div>
                            <div className="text-sm text-muted-foreground">{appointment.notes}</div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Loyalty Tab */}
          <TabsContent value="loyalty" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Star className="w-5 h-5" />
                  Loyalty Program
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {/* Current Tier */}
                  <div className="text-center">
                    <div className="text-4xl font-bold text-primary mb-2">{stats.currentTier}</div>
                    <div className="text-lg text-muted-foreground mb-4">Current Tier</div>
                    <div className="w-full bg-muted rounded-full h-3 mb-2">
                      <div 
                        className="bg-primary h-3 rounded-full transition-all duration-300"
                        style={{ 
                          width: `${stats.nextTierPoints > 0 
                            ? Math.min((stats.loyaltyPoints / stats.nextTierPoints) * 100, 100)
                            : 100}%` 
                        }}
                      ></div>
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {stats.loyaltyPoints} / {stats.nextTierPoints > 0 ? stats.nextTierPoints : stats.loyaltyPoints} points
                    </div>
                  </div>

                  {/* Tier Benefits */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="text-center p-4 border rounded-lg">
                      <div className="text-2xl font-bold text-primary mb-2">5%</div>
                      <div className="text-sm font-medium">Discount on Services</div>
                    </div>
                    <div className="text-center p-4 border rounded-lg">
                      <div className="text-2xl font-bold text-primary mb-2">Free</div>
                      <div className="text-sm font-medium">Beard Trim</div>
                    </div>
                    <div className="text-center p-4 border rounded-lg">
                      <div className="text-2xl font-bold text-primary mb-2">Priority</div>
                      <div className="text-sm font-medium">Booking</div>
                    </div>
                  </div>

                  {/* Points History */}
                  <div>
                    <h3 className="font-semibold mb-3">Recent Points Activity</h3>
                    <div className="space-y-2">
                      <div className="flex justify-between items-center p-3 bg-muted rounded-lg">
                        <div>
                          <div className="font-medium">Appointment Completed</div>
                          <div className="text-sm text-muted-foreground">Haircut & Beard Trim</div>
                        </div>
                        <div className="text-green-600 font-semibold">+25 points</div>
                      </div>
                      <div className="flex justify-between items-center p-3 bg-muted rounded-lg">
                        <div>
                          <div className="font-medium">Referral Bonus</div>
                          <div className="text-sm text-muted-foreground">Friend signed up</div>
                        </div>
                        <div className="text-green-600 font-semibold">+50 points</div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Settings Tab */}
          <TabsContent value="settings" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Settings className="w-5 h-5" />
                  Account Settings
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {/* Profile Information */}
                  <div>
                    <h3 className="font-semibold mb-4">Profile Information</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm font-medium">Name</label>
                        <div className="mt-1 p-3 bg-muted rounded-lg">
                          {user.user_metadata?.name || 'Not set'}
                        </div>
                      </div>
                      <div>
                        <label className="text-sm font-medium">Email</label>
                        <div className="mt-1 p-3 bg-muted rounded-lg">
                          {user.email}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Payment Methods */}
                  <div>
                    <h3 className="font-semibold mb-4">Payment Methods</h3>
                    {paymentMethods.length === 0 ? (
                      <p className="text-muted-foreground">No payment methods saved</p>
                    ) : (
                      <div className="space-y-3">
                        {paymentMethods.map((method) => (
                          <div key={method.id} className="flex items-center justify-between p-3 border rounded-lg">
                            <div className="flex items-center gap-3">
                              <CreditCard className="w-5 h-5" />
                              <div>
                                <div className="font-medium">
                                  {method.card?.brand} •••• {method.card?.last4}
                                </div>
                                <div className="text-sm text-muted-foreground">
                                  Expires {method.card?.exp_month}/{method.card?.exp_year}
                                </div>
                              </div>
                            </div>
                            <Button variant="outline" size="sm">
                              Remove
                            </Button>
                          </div>
                        ))}
                      </div>
                    )}
                    <Button className="mt-4" variant="outline">
                      <Plus className="w-4 h-4 mr-2" />
                      Add Payment Method
                    </Button>
                  </div>

                  {/* Preferences */}
                  <div>
                    <h3 className="font-semibold mb-4">Preferences</h3>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="font-medium">Email Notifications</div>
                          <div className="text-sm text-muted-foreground">Receive booking confirmations and reminders</div>
                        </div>
                        <input type="checkbox" defaultChecked className="w-4 h-4" />
                      </div>
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="font-medium">SMS Notifications</div>
                          <div className="text-sm text-muted-foreground">Receive text message reminders</div>
                        </div>
                        <input type="checkbox" className="w-4 h-4" />
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Tutorials Tab */}
          <TabsContent value="tutorials" className="space-y-6">
            <TutorialSystem userType="customer" userId={user?.id || 'customer-123'} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
