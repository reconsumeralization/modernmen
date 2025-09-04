import { Metadata } from 'next'
import { CustomerOnly } from '@/components/navigation/ProtectedRoute'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Separator } from '@/components/ui/separator'
import { Calendar, Star, Clock, CreditCard, Settings, Bell, Heart } from 'lucide-react'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'My Profile - Modern Men Hair Salon',
  description: 'Manage your account, view appointments, and track your loyalty rewards',
}

function ProfileContent() {
  // Mock data - in real app this would come from API
  const userProfile = {
    name: 'John Smith',
    email: 'john.smith@email.com',
    phone: '(306) 555-0123',
    joinDate: 'January 2023',
    avatar: '/avatars/john.jpg',
    loyaltyPoints: 450,
    totalVisits: 24,
    favoriteService: 'Haircut & Beard Trim'
  }

  const upcomingAppointments = [
    {
      id: '1',
      date: 'Tomorrow',
      time: '2:00 PM',
      service: 'Haircut & Beard Trim',
      stylist: 'Mike Johnson',
      duration: '45 minutes',
      status: 'confirmed'
    }
  ]

  const recentVisits = [
    { date: '2024-01-15', service: 'Haircut', stylist: 'Mike Johnson', cost: '$35' },
    { date: '2024-01-08', service: 'Beard Trim', stylist: 'Sarah Davis', cost: '$20' },
    { date: '2024-01-01', service: 'Haircut & Shave', stylist: 'Mike Johnson', cost: '$55' },
  ]

  const quickActions = [
    { title: 'Book Appointment', description: 'Schedule your next visit', icon: Calendar, href: '/booking', color: 'bg-blue-50 hover:bg-blue-100' },
    { title: 'My Appointments', description: 'View upcoming & past visits', icon: Clock, href: '/appointments', color: 'bg-green-50 hover:bg-green-100' },
    { title: 'Loyalty Rewards', description: 'Check your points & rewards', icon: Star, href: '/loyalty', color: 'bg-amber-50 hover:bg-amber-100' },
    { title: 'Account Settings', description: 'Update your preferences', icon: Settings, href: '/settings', color: 'bg-gray-50 hover:bg-gray-100' },
  ]

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">My Profile</h1>
        <p className="text-muted-foreground">
          Manage your account settings and view your salon history.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        {/* Profile Overview */}
        <Card className="md:col-span-1">
          <CardHeader>
            <CardTitle>Profile Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex flex-col items-center space-y-4">
              <Avatar className="h-20 w-20">
                <AvatarImage src={userProfile.avatar} alt={userProfile.name} />
                <AvatarFallback className="text-lg">
                  {userProfile.name.split(' ').map(n => n[0]).join('')}
                </AvatarFallback>
              </Avatar>
              <div className="text-center">
                <h3 className="text-lg font-semibold">{userProfile.name}</h3>
                <p className="text-sm text-muted-foreground">{userProfile.email}</p>
                <p className="text-sm text-muted-foreground">{userProfile.phone}</p>
              </div>
            </div>

            <Separator />

            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">Member since</span>
                <span className="text-sm text-muted-foreground">{userProfile.joinDate}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">Total visits</span>
                <span className="text-sm text-muted-foreground">{userProfile.totalVisits}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">Loyalty points</span>
                <Badge variant="secondary">{userProfile.loyaltyPoints} pts</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">Favorite service</span>
                <span className="text-sm text-muted-foreground">{userProfile.favoriteService}</span>
              </div>
            </div>

            <Button variant="outline" className="w-full" asChild>
              <Link href="/settings">
                <Settings className="h-4 w-4 mr-2" />
                Edit Profile
              </Link>
            </Button>
          </CardContent>
        </Card>

        {/* Main Content */}
        <div className="md:col-span-2 space-y-6">
          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
              <CardDescription>Common tasks and shortcuts</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-3 md:grid-cols-2">
                {quickActions.map((action) => (
                  <Button
                    key={action.title}
                    variant="outline"
                    className={`justify-start h-auto p-4 ${action.color}`}
                    asChild
                  >
                    <Link href={action.href}>
                      <action.icon className="h-5 w-5 mr-3" />
                      <div className="text-left">
                        <div className="font-medium">{action.title}</div>
                        <div className="text-xs text-muted-foreground">{action.description}</div>
                      </div>
                    </Link>
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Upcoming Appointments */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Calendar className="h-5 w-5" />
                <span>Upcoming Appointments</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {upcomingAppointments.length > 0 ? (
                <div className="space-y-4">
                  {upcomingAppointments.map((appointment) => (
                    <div key={appointment.id} className="flex items-center justify-between p-4 rounded-lg border">
                      <div className="flex items-center space-x-4">
                        <div className="flex-shrink-0">
                          <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                            <Calendar className="h-6 w-6 text-blue-600" />
                          </div>
                        </div>
                        <div>
                          <p className="font-medium">{appointment.service}</p>
                          <p className="text-sm text-muted-foreground">
                            {appointment.date} at {appointment.time} • {appointment.duration}
                          </p>
                          <p className="text-sm text-muted-foreground">with {appointment.stylist}</p>
                        </div>
                      </div>
                      <Badge
                        variant={appointment.status === 'confirmed' ? 'default' : 'secondary'}
                        className={appointment.status === 'confirmed' ? 'bg-green-100 text-green-800' : ''}
                      >
                        {appointment.status}
                      </Badge>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <Calendar className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground mb-4">No upcoming appointments</p>
                  <Button asChild>
                    <Link href="/booking">Book Your First Appointment</Link>
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Recent Visits */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Clock className="h-5 w-5" />
                <span>Recent Visits</span>
              </CardTitle>
              <CardDescription>Your last few appointments</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {recentVisits.map((visit, index) => (
                  <div key={index} className="flex items-center justify-between py-2">
                    <div>
                      <p className="font-medium">{visit.service}</p>
                      <p className="text-sm text-muted-foreground">
                        {visit.date} • {visit.stylist}
                      </p>
                    </div>
                    <Badge variant="outline">{visit.cost}</Badge>
                  </div>
                ))}
              </div>
              <Button variant="outline" className="w-full mt-4" asChild>
                <Link href="/appointments">View All Appointments</Link>
              </Button>
            </CardContent>
          </Card>

          {/* Loyalty Status */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Star className="h-5 w-5" />
                <span>Loyalty Rewards</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between mb-4">
                <div>
                  <p className="text-2xl font-bold">{userProfile.loyaltyPoints} points</p>
                  <p className="text-sm text-muted-foreground">Current balance</p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-muted-foreground">Next reward at 500 pts</p>
                  <p className="text-sm text-muted-foreground">50 points to go</p>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Progress to next reward</span>
                  <span>{Math.round((userProfile.loyaltyPoints / 500) * 100)}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-amber-500 h-2 rounded-full"
                    style={{ width: `${Math.min((userProfile.loyaltyPoints / 500) * 100, 100)}%` }}
                  ></div>
                </div>
              </div>

              <Button variant="outline" className="w-full mt-4" asChild>
                <Link href="/loyalty">
                  <Heart className="h-4 w-4 mr-2" />
                  View Rewards
                </Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

export default function Profile() {
  return (
    <CustomerOnly fallbackPath="/auth/signin">
      <div className="container mx-auto px-4 py-8">
        <ProfileContent />
      </div>
    </CustomerOnly>
  )
}
