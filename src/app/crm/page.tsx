'use client'

import React, { useState } from 'react'
import { motion } from 'framer-motion'
import {
  Users,
  Calendar,
  MessageSquare,
  BarChart3,
  Settings,
  ChevronRight,
  Menu,
  X
} from '@/lib/icon-mapping'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet'
import {
  CRMDashboard,
  CustomerList,
  AppointmentCalendar,
  CustomerCommunication
} from '@/components/crm'

const crmModules = [
  {
    id: 'dashboard',
    name: 'Dashboard',
    description: 'Overview of business metrics and KPIs',
    icon: BarChart3,
    component: CRMDashboard
  },
  {
    id: 'customers',
    name: 'Customers',
    description: 'Manage customer database and profiles',
    icon: Users,
    component: CustomerList
  },
  {
    id: 'appointments',
    name: 'Appointments',
    description: 'Calendar view and appointment management',
    icon: Calendar,
    component: AppointmentCalendar
  },
  {
    id: 'communication',
    name: 'Communication',
    description: 'Send emails, SMS, and notifications',
    icon: MessageSquare,
    component: CustomerCommunication
  }
]

export default function CRMPage() {
  const [activeModule, setActiveModule] = useState('dashboard')
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const ActiveComponent = crmModules.find(module => module.id === activeModule)?.component || CRMDashboard

  const SidebarContent = () => (
    <div className="space-y-2">
      <div className="p-4 border-b">
        <h2 className="text-lg font-semibold">CRM System</h2>
        <p className="text-sm text-gray-600">Manage your business operations</p>
      </div>

      <nav className="space-y-1 px-2">
        {crmModules.map((module) => {
          const Icon = module.icon
          const isActive = activeModule === module.id

          return (
            <motion.button
              key={module.id}
              onClick={() => {
                setActiveModule(module.id)
                setSidebarOpen(false)
              }}
              className={`
                w-full flex items-center gap-3 px-3 py-2 text-left rounded-lg transition-colors
                ${isActive
                  ? 'bg-blue-50 text-blue-700 border-blue-200'
                  : 'text-gray-700 hover:bg-gray-50'
                }
              `}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Icon className="h-5 w-5" />
              <div className="flex-1">
                <div className="font-medium">{module.name}</div>
                <div className="text-xs text-gray-500">{module.description}</div>
              </div>
              {isActive && <ChevronRight className="h-4 w-4" />}
            </motion.button>
          )
        })}
      </nav>

      <div className="p-4 border-t mt-4">
        <Button variant="outline" className="w-full" size="sm">
          <Settings className="h-4 w-4 mr-2" />
          CRM Settings
        </Button>
      </div>
    </div>
  )

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Desktop Sidebar */}
      <div className="hidden lg:flex lg:w-80 lg:flex-col lg:border-r lg:border-gray-200 lg:bg-white">
        <SidebarContent />
      </div>

      {/* Mobile Sidebar */}
      <Sheet open={sidebarOpen} onOpenChange={setSidebarOpen}>
        <SheetContent side="left" className="w-80 p-0">
          <SidebarContent />
        </SheetContent>
      </Sheet>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Mobile Header */}
        <div className="lg:hidden flex items-center justify-between p-4 border-b border-gray-200 bg-white">
          <div className="flex items-center gap-3">
            <Sheet open={sidebarOpen} onOpenChange={setSidebarOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="sm">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
            </Sheet>
            <h1 className="text-lg font-semibold">
              {crmModules.find(m => m.id === activeModule)?.name || 'CRM'}
            </h1>
          </div>
        </div>

        {/* Content Area */}
        <main className="flex-1 overflow-auto">
          <motion.div
            key={activeModule}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="p-6"
          >
            <ActiveComponent />
          </motion.div>
        </main>
      </div>
    </div>
  )
}
