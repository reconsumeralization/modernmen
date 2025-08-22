'use client'

import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { LoadingSpinner } from '@/components/ui/loading'
import { Icons } from '@/components/ui/icons'

interface UserStats {
  totalUsers: number
  activeUsers: number
  newUsersToday: number
  adminUsers: number
}

interface RecentUser {
  id: string
  name: string
  email: string
  role: string
  created_at: string
  lastLogin?: string
}

export default function AdminDashboard() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [stats, setStats] = useState<UserStats | null>(null)
  const [recentUsers, setRecentUsers] = useState<RecentUser[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (status === 'loading') return

    if (!session || session.user?.role !== 'admin') {
      router.push('/auth/signin')
      return
    }

    fetchDashboardData()
  }, [session, status, router])

  const fetchDashboardData = async () => {
    try {
      const [statsResponse, usersResponse] = await Promise.all([
        fetch('/api/admin/stats'),
        fetch('/api/admin/users/recent')
      ])

      if (statsResponse.ok) {
        const statsData = await statsResponse.json()
        setStats(statsData)
      }

      if (usersResponse.ok) {
        const usersData = await usersResponse.json()
        setRecentUsers(usersData.users || [])
      }
    } catch (error) {
      console.error('Error fetching dashboard data:', error)
    } finally {
      setLoading(false)
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  if (status === 'loading' || loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <LoadingSpinner />
      </div>
    )
  }

  if (!session || session.user?.role !== 'admin') {
    return null // Will redirect in useEffect
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          Admin Dashboard
        </h1>
        <p className="text-gray-600 dark:text-gray-300 mt-2">
          Welcome back, {session.user?.name}! Here's what's happening with your system.
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
            <Icons.user className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.totalUsers || 0}</div>
            <p className="text-xs text-muted-foreground">All registered users</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Users</CardTitle>
            <Icons.activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.activeUsers || 0}</div>
            <p className="text-xs text-muted-foreground">Users with recent activity</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">New Today</CardTitle>
            <Icons.trendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.newUsersToday || 0}</div>
            <p className="text-xs text-muted-foreground">Registrations today</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Admin Users</CardTitle>
            <Icons.shield className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.adminUsers || 0}</div>
            <p className="text-xs text-muted-foreground">Users with admin role</p>
          </CardContent>
        </Card>
      </div>

      {/* Recent Users */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Users</CardTitle>
          <CardDescription>Latest user registrations and activity</CardDescription>
        </CardHeader>
        <CardContent>
          {recentUsers.length === 0 ? (
            <p className="text-center text-gray-500 py-4">No users found</p>
          ) : (
            <div className="space-y-4">
              {recentUsers.map((user) => (
                <div key={user.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center space-x-4">
                    <div className="w-10 h-10 bg-gray-200 dark:bg-gray-700 rounded-full flex items-center justify-center">
                      {user.name ? user.name.charAt(0).toUpperCase() : user.email.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <h3 className="font-medium">{user.name || 'Unnamed User'}</h3>
                      <p className="text-sm text-gray-500">{user.email}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Badge variant={user.role === 'admin' ? 'destructive' : 'secondary'}>
                      {user.role}
                    </Badge>
                    <span className="text-sm text-gray-500">
                      {formatDate(user.created_at)}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
          <CardDescription>Common administrative tasks</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Button variant="outline" className="justify-start">
              <Icons.users className="mr-2 h-4 w-4" />
              Manage Users
            </Button>
            <Button variant="outline" className="justify-start">
              <Icons.settings className="mr-2 h-4 w-4" />
              System Settings
            </Button>
            <Button variant="outline" className="justify-start">
              <Icons.barChart3 className="mr-2 h-4 w-4" />
              View Analytics
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
