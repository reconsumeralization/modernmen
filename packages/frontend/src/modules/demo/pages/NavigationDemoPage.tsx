import { Metadata } from 'next'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Users, Shield, Settings, Calendar, Scissors, BarChart3, FileText, Database } from 'lucide-react'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Navigation System - Modern Men Hair Salon',
  description: 'Demonstration of the role-based navigation system for different user types',
}

const userTypes = [
  {
    role: 'Customer',
    icon: Users,
    color: 'bg-blue-500',
    description: 'Regular customers who book appointments',
    features: ['Book appointments', 'View profile', 'Manage loyalty points', 'View appointment history'],
    navigation: ['Home', 'Services', 'Team', 'Gallery', 'Contact', 'Book Appointment', 'My Profile', 'My Appointments', 'Loyalty Rewards']
  },
  {
    role: 'Stylist',
    icon: Scissors,
    color: 'bg-green-500',
    description: 'Hair stylists and barbers',
    features: ['View schedule', 'Manage clients', 'Update services', 'Request time off'],
    navigation: ['Dashboard', 'Schedule', 'Appointments', 'Services', 'Profile', 'Clients', 'Time Off']
  },
  {
    role: 'Staff',
    icon: Settings,
    color: 'bg-purple-500',
    description: 'Salon staff and assistants',
    features: ['Manage appointments', 'Handle clients', 'Update inventory', 'View reports'],
    navigation: ['Dashboard', 'Appointments', 'Clients', 'Services', 'Schedule', 'Reports', 'Inventory']
  },
  {
    role: 'Manager',
    icon: BarChart3,
    color: 'bg-amber-500',
    description: 'Salon managers with oversight',
    features: ['Staff management', 'Business analytics', 'Financial reports', 'Marketing tools'],
    navigation: ['Dashboard', 'Appointments', 'Staff', 'Clients', 'Services', 'Reports', 'Analytics', 'Inventory', 'Marketing']
  },
  {
    role: 'Admin',
    icon: Shield,
    color: 'bg-red-500',
    description: 'System administrators with full access',
    features: ['User management', 'System configuration', 'Data backup', 'Audit logs'],
    navigation: ['Dashboard', 'Users', 'Appointments', 'Services', 'Content', 'Analytics', 'Reports', 'Settings', 'Logs', 'Backup', 'Payload CMS']
  }
]

const navigationFeatures = [
  {
    title: 'Role-Based Access Control',
    description: 'Different navigation menus based on user permissions and roles',
    icon: Shield
  },
  {
    title: 'Responsive Design',
    description: 'Mobile-friendly navigation that adapts to different screen sizes',
    icon: Settings
  },
  {
    title: 'Breadcrumb Navigation',
    description: 'Clear navigation path with breadcrumb trails',
    icon: FileText
  },
  {
    title: 'Protected Routes',
    description: 'Automatic redirection and access control for sensitive pages',
    icon: Database
  }
]

export default function NavigationDemoPage() {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold tracking-tight">Navigation System</h1>
        <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
          Comprehensive role-based navigation system for the Modern Men Hair Salon management platform.
          Each user type gets a tailored experience with appropriate access controls and features.
        </p>
      </div>

      {/* User Types Overview */}
      <div className="space-y-6">
        <h2 className="text-2xl font-semibold">User Types & Navigation</h2>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {userTypes.map((userType) => (
            <Card key={userType.role} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-center space-x-3">
                  <div className={`p-2 rounded-lg ${userType.color}`}>
                    <userType.icon className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <CardTitle className="text-lg">{userType.role}</CardTitle>
                    <CardDescription>{userType.description}</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h4 className="font-medium mb-2">Key Features:</h4>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    {userType.features.map((feature, index) => (
                      <li key={index} className="flex items-center">
                        <div className="w-1.5 h-1.5 bg-current rounded-full mr-2"></div>
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h4 className="font-medium mb-2">Navigation Items:</h4>
                  <div className="flex flex-wrap gap-1">
                    {userType.navigation.map((item, index) => (
                      <Badge key={index} variant="secondary" className="text-xs">
                        {item}
                      </Badge>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Navigation Features */}
      <div className="space-y-6">
        <h2 className="text-2xl font-semibold">Navigation Features</h2>
        <div className="grid gap-4 md:grid-cols-2">
          {navigationFeatures.map((feature) => (
            <Card key={feature.title}>
              <CardHeader>
                <div className="flex items-center space-x-3">
                  <feature.icon className="h-6 w-6 text-blue-600" />
                  <CardTitle className="text-lg">{feature.title}</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <CardDescription>{feature.description}</CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Live Demo Links */}
      <div className="space-y-6">
        <h2 className="text-2xl font-semibold">Live Navigation Demo</h2>
        <Card>
          <CardHeader>
            <CardTitle>Test Different User Experiences</CardTitle>
            <CardDescription>
              Explore how the navigation adapts based on user roles and permissions
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              <Button asChild className="justify-start">
                <Link href="/profile">
                  <Users className="h-4 w-4 mr-2" />
                  Customer Dashboard
                </Link>
              </Button>

              <Button asChild variant="outline" className="justify-start">
                <Link href="/stylist/dashboard">
                  <Scissors className="h-4 w-4 mr-2" />
                  Stylist Dashboard
                </Link>
              </Button>

              <Button asChild variant="outline" className="justify-start">
                <Link href="/staff/dashboard">
                  <Settings className="h-4 w-4 mr-2" />
                  Staff Dashboard
                </Link>
              </Button>

              <Button asChild variant="outline" className="justify-start">
                <Link href="/manager/dashboard">
                  <BarChart3 className="h-4 w-4 mr-2" />
                  Manager Dashboard
                </Link>
              </Button>

              <Button asChild variant="outline" className="justify-start">
                <Link href="/admin/dashboard">
                  <Shield className="h-4 w-4 mr-2" />
                  Admin Dashboard
                </Link>
              </Button>

              <Button asChild variant="outline" className="justify-start">
                <Link href="/auth/signin">
                  <Users className="h-4 w-4 mr-2" />
                  Authentication
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Technical Implementation */}
      <div className="space-y-6">
        <h2 className="text-2xl font-semibold">Technical Implementation</h2>
        <div className="grid gap-4 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Components Created</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm">
                <li>• <code>RoleBasedNavbar</code> - Main navigation component</li>
                <li>• <code>ProtectedRoute</code> - Route protection wrapper</li>
                <li>• <code>BreadcrumbNavigation</code> - Navigation breadcrumbs</li>
                <li>• <code>NavigationProvider</code> - Context provider</li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Features Implemented</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm">
                <li>• Role-based menu filtering</li>
                <li>• Mobile responsive design</li>
                <li>• Access control enforcement</li>
                <li>• Dynamic breadcrumb generation</li>
                <li>• TypeScript type safety</li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Footer */}
      <div className="text-center py-8 border-t">
        <p className="text-muted-foreground">
          This navigation system ensures each user type has access to relevant features
          while maintaining security and providing an optimal user experience.
        </p>
      </div>
    </div>
  )
}
