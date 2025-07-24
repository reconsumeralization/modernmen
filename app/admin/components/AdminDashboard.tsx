'use client'

import { useState } from 'react'
import { 
  CalendarDaysIcon, 
  UserGroupIcon, 
  ShoppingBagIcon, 
  ChartBarIcon,
  CogIcon,
  UserIcon,
  ClipboardDocumentListIcon,
  CurrencyDollarIcon
} from '@heroicons/react/24/outline'

import BookingManager from './BookingManager'
import ClientManager from './ClientManager'
import ProductManager from './ProductManager'
import Analytics from './Analytics'
import StaffManager from './StaffManager'
import ScheduleManager from './ScheduleManager'
import OrderManager from './OrderManager'
import Settings from './Settings'

type TabType = 'dashboard' | 'bookings' | 'clients' | 'products' | 'orders' | 'staff' | 'schedule' | 'analytics' | 'settings'

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState<TabType>('dashboard')

  const tabs = [
    { id: 'dashboard', name: 'Dashboard', icon: ChartBarIcon },
    { id: 'bookings', name: 'Bookings', icon: CalendarDaysIcon },
    { id: 'clients', name: 'Clients', icon: UserGroupIcon },
    { id: 'products', name: 'Products', icon: ShoppingBagIcon },
    { id: 'orders', name: 'Orders', icon: ClipboardDocumentListIcon },
    { id: 'staff', name: 'Staff', icon: UserIcon },
    { id: 'schedule', name: 'Schedule', icon: CalendarDaysIcon },
    { id: 'analytics', name: 'Analytics', icon: ChartBarIcon },
    { id: 'settings', name: 'Settings', icon: CogIcon },
  ]

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <DashboardOverview />
      case 'bookings':
        return <BookingManager />
      case 'clients':
        return <ClientManager />
      case 'products':
        return <ProductManager />
      case 'orders':
        return <OrderManager />
      case 'staff':
        return <StaffManager />
      case 'schedule':
        return <ScheduleManager />
      case 'analytics':
        return <Analytics />
      case 'settings':
        return <Settings />
      default:
        return <DashboardOverview />
    }
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-salon-dark text-white shadow-lg">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold">Modern Men - Admin Dashboard</h1>
            <div className="flex items-center space-x-4">
              <span className="text-salon-gold">Welcome, Admin</span>
              <button className="bg-salon-gold text-salon-dark px-4 py-2 rounded-md text-sm font-medium">
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar */}
        <aside className="w-64 bg-white shadow-lg min-h-screen">
          <nav className="mt-8">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as TabType)}
                className={`w-full flex items-center px-6 py-3 text-left hover:bg-gray-50 transition-colors ${
                  activeTab === tab.id 
                    ? 'bg-salon-gold bg-opacity-10 text-salon-dark border-r-4 border-salon-gold' 
                    : 'text-gray-600'
                }`}
              >
                <tab.icon className="h-5 w-5 mr-3" />
                {tab.name}
              </button>
            ))}
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-8">
          <div className="p-6 bg-white rounded-lg shadow">
            <h2 className="text-2xl font-bold text-gray-900">Admin Dashboard - Under Construction</h2>
            <p className="mt-2 text-gray-600">We are working on bringing you a full-featured dashboard.</p>
          </div>
        </main>
      </div>
    </div>
  )
}

function DashboardOverview() {
  return (
    <div className="space-y-8">
      <h2 className="text-3xl font-bold text-gray-900">Dashboard Overview</h2>
      
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Today's Bookings"
          value="12"
          change="+2 from yesterday"
          icon={CalendarDaysIcon}
          color="bg-blue-500"
        />
        <StatCard
          title="Total Clients"
          value="1,234"
          change="+15 this week"
          icon={UserGroupIcon}
          color="bg-green-500"
        />
        <StatCard
          title="Today's Revenue"
          value="$2,845"
          change="+12% from yesterday"
          icon={CurrencyDollarIcon}
          color="bg-salon-gold"
        />
        <StatCard
          title="Products Sold"
          value="28"
          change="+5 from yesterday"
          icon={ShoppingBagIcon}
          color="bg-purple-500"
        />
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-xl font-semibold mb-4">Quick Actions</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <button className="p-4 text-center bg-salon-gold bg-opacity-10 rounded-lg hover:bg-opacity-20 transition-colors">
            <CalendarDaysIcon className="h-8 w-8 mx-auto mb-2 text-salon-dark" />
            <span className="text-sm font-medium">New Booking</span>
          </button>
          <button className="p-4 text-center bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors">
            <UserGroupIcon className="h-8 w-8 mx-auto mb-2 text-blue-600" />
            <span className="text-sm font-medium">Add Client</span>
          </button>
          <button className="p-4 text-center bg-green-50 rounded-lg hover:bg-green-100 transition-colors">
            <ShoppingBagIcon className="h-8 w-8 mx-auto mb-2 text-green-600" />
            <span className="text-sm font-medium">Add Product</span>
          </button>
          <button className="p-4 text-center bg-purple-50 rounded-lg hover:bg-purple-100 transition-colors">
            <ChartBarIcon className="h-8 w-8 mx-auto mb-2 text-purple-600" />
            <span className="text-sm font-medium">View Reports</span>
          </button>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-xl font-semibold mb-4">Recent Activity</h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between py-2 border-b">
            <div>
              <p className="font-medium">New booking: John Smith</p>
              <p className="text-sm text-gray-500">Haircut with Hicham - Tomorrow 2:00 PM</p>
            </div>
            <span className="text-sm text-gray-400">5 min ago</span>
          </div>
          <div className="flex items-center justify-between py-2 border-b">
            <div>
              <p className="font-medium">Product sale: Reuzel Pomade</p>
              <p className="text-sm text-gray-500">Sold to Sarah Johnson - $24.99</p>
            </div>
            <span className="text-sm text-gray-400">15 min ago</span>
          </div>
          <div className="flex items-center justify-between py-2">
            <div>
              <p className="font-medium">New client registered: Mike Wilson</p>
              <p className="text-sm text-gray-500">Added via website booking form</p>
            </div>
            <span className="text-sm text-gray-400">1 hour ago</span>
          </div>
        </div>
      </div>
    </div>
  )
}

function StatCard({ 
  title, 
  value, 
  change, 
  icon: Icon, 
  color 
}: { 
  title: string
  value: string
  change: string
  icon: any
  color: string 
}) {
  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-3xl font-bold text-gray-900">{value}</p>
        </div>
        <div className={`p-3 rounded-full ${color}`}>
          <Icon className="h-6 w-6 text-white" />
        </div>
      </div>
      <p className="text-sm text-gray-500 mt-2">{change}</p>
    </div>
  )
}

