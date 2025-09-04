import { Metadata } from 'next'
import { StaffOnly } from '@/components/navigation/ProtectedRoute'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Calendar, Clock, Users, Star, DollarSign, Scissors, CheckCircle } from 'lucide-react'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Stylist Dashboard - Modern Men Hair Salon',
  description: 'Your personal dashboard for managing appointments and clients',
}

function StylistDashboardContent() {
  // Mock data - in real app this would come from API
  const todayAppointments = [
    {
      id: '1',
      time: '09:00',
      client: 'John Smith',
      service: 'Haircut & Shave',
      duration: '45 min',
      status: 'confirmed'
    },
    {
      id: '2',
      time: '11:00',
      client: 'Mike Johnson',
      service: 'Beard Trim',
      duration: '30 min',
      status: 'confirmed'
    },
    {
      id: '3',
      time: '14:30',
      client: 'David Wilson',
      service: 'Haircut',
      duration: '30 min',
      status: 'pending'
    }
  ]

  const stylistStats = [
    { title: 'Today\'s Appointments', value: '3', icon: Calendar, color: 'text-blue-600' },
    { title: 'This Week', value: '12', icon: Calendar, color: 'text-green-600' },
    { title: 'Total Clients', value: '89', icon: Users, color: 'text-purple-600' },
    { title: 'Avg Rating', value: '4.8', icon: Star, color: 'text-amber-600' },
  ]

  const quickActions = [
    { title: 'View Schedule', description: 'Check your appointments', icon: Calendar, href: '/stylist/schedule', color: 'bg-blue-50 hover:bg-blue-100' },
    { title: 'Client List', description: 'Manage your clients', icon: Users, href: '/stylist/clients', color: 'bg-green-50 hover:bg-green-100' },
    { title: 'My Services', description: 'Update your services', icon: Scissors, href: '/stylist/services', color: 'bg-purple-50 hover:bg-purple-100' },
    { title: 'Time Off', description: 'Request time off', icon: Clock, href: '/stylist/time-off', color: 'bg-amber-50 hover:bg-amber-100' },
  ]

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">Stylist Dashboard</h1>
        <p className="text-muted-foreground">
          Welcome back! Here's your schedule and client overview for today.
        </p>
      </div>

      {/* Stats Overview */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stylistStats.map((stat) => (
          <Card key={stat.title} className="hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
              <stat.icon className={`h-4 w-4 ${stat.color}`} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Today's Appointments */}
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Calendar className="h-5 w-5" />
              <span>Today's Appointments</span>
            </CardTitle>
            <CardDescription>Your schedule for today</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {todayAppointments.map((appointment) => (
                <div key={appointment.id} className="flex items-center space-x-4 p-3 rounded-lg border">
                  <div className="flex-shrink-0">
                    <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                      <Clock className="h-5 w-5 text-blue-600" />
                    </div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900">{appointment.time}</p>
                    <p className="text-sm text-gray-500">{appointment.client}</p>
                    <p className="text-xs text-gray-400">{appointment.service} • {appointment.duration}</p>
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
            <Button className="w-full mt-4" asChild>
              <Link href="/stylist/schedule">View Full Schedule</Link>
            </Button>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Common tasks and shortcuts</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-3">
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
      </div>

      {/* Recent Clients */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Users className="h-5 w-5" />
            <span>Recent Clients</span>
          </CardTitle>
          <CardDescription>Clients you've worked with recently</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[
              { name: 'John Smith', lastVisit: '2 days ago', nextAppointment: 'Tomorrow 9:00 AM', avatar: '/avatars/john.jpg' },
              { name: 'Mike Johnson', lastVisit: '1 week ago', nextAppointment: 'Friday 2:00 PM', avatar: '/avatars/mike.jpg' },
              { name: 'David Wilson', lastVisit: '2 weeks ago', nextAppointment: null, avatar: '/avatars/david.jpg' },
            ].map((client, index) => (
              <div key={index} className="flex items-center space-x-4">
                <Avatar>
                  <AvatarImage src={client.avatar} alt={client.name} />
                  <AvatarFallback>{client.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900">{client.name}</p>
                  <p className="text-sm text-gray-500">Last visit: {client.lastVisit}</p>
                  {client.nextAppointment && (
                    <p className="text-xs text-blue-600">Next: {client.nextAppointment}</p>
                  )}
                </div>
                <Button variant="outline" size="sm" asChild>
                  <Link href={`/stylist/clients/${client.name.toLowerCase().replace(' ', '-')}`}>
                    View Profile
                  </Link>
                </Button>
              </div>
            ))}
          </div>
          <Button variant="outline" className="w-full mt-4" asChild>
            <Link href="/stylist/clients">View All Clients</Link>
          </Button>
        </CardContent>
      </Card>

      {/* Performance Summary */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium flex items-center">
              <DollarSign className="h-4 w-4 mr-2" />
              Today's Earnings
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$285.00</div>
            <p className="text-xs text-muted-foreground">+12% from yesterday</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium flex items-center">
              <CheckCircle className="h-4 w-4 mr-2" />
              Completed Services
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">8</div>
            <p className="text-xs text-muted-foreground">Out of 10 scheduled</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium flex items-center">
              <Star className="h-4 w-4 mr-2" />
              Average Rating
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">4.8</div>
            <p className="text-xs text-muted-foreground">Based on 15 reviews</p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default function StylistDashboard() {
  return (
    <StaffOnly fallbackPath="/auth/signin">
      <div className="container mx-auto px-4 py-8">
        <StylistDashboardContent />
      </div>
    </StaffOnly>
  )
}
