"use client"

import * as React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Calendar,
  Users,

  BarChart3,
  Settings,
  Menu,
  LogOut,
  User,
  Home,
  Clock,
  DollarSign,
  Package,
  Bell,
} from "lucide-react"
import { Logo } from "../ui/logo"
import { AdminIcon } from "../ui/admin-icon"

interface DashboardLayoutProps {
  children: React.ReactNode
  user?: {
    name: string
    email: string
    avatar?: string
    role: "admin" | "staff" | "customer"
  }
}

// ModernMen branded navigation icons
const ModernMenIcon = () => (
  <div className="w-4 h-4 bg-red-600 rounded-full flex items-center justify-center">
    <span className="text-white text-xs font-bold">M</span>
  </div>
)

const navigationItems = {
  admin: [
    { name: "Dashboard", href: "/admin", icon: Home },
    { name: "Appointments", href: "/admin/appointments", icon: Calendar },
    { name: "Customers", href: "/admin/customers", icon: Users },
    { name: "Staff", href: "/admin/staff", icon: User },
    { name: "Services", href: "/admin/services", icon: ModernMenIcon },
    { name: "Analytics", href: "/admin/analytics", icon: BarChart3 },
    { name: "Inventory", href: "/admin/inventory", icon: Package },
    { name: "Settings", href: "/admin/settings", icon: Settings },
  ],
  staff: [
    { name: "Dashboard", href: "/staff", icon: Home },
    { name: "My Schedule", href: "/staff/schedule", icon: Clock },
    { name: "Appointments", href: "/staff/appointments", icon: Calendar },
    { name: "Customers", href: "/staff/customers", icon: Users },
    { name: "Services", href: "/staff/services", icon: ModernMenIcon },
    { name: "Time Tracking", href: "/staff/time-tracking", icon: Clock },
  ],
  customer: [
    { name: "Dashboard", href: "/customer", icon: Home },
    { name: "Book Appointment", href: "/book", icon: Calendar },
    { name: "My Appointments", href: "/customer/appointments", icon: Clock },
    { name: "Services", href: "/services", icon: ModernMenIcon },
    { name: "Profile", href: "/customer/profile", icon: User },
    { name: "Loyalty", href: "/customer/loyalty", icon: DollarSign },
  ],
}

function Sidebar({ role = "customer", className }: { role?: "admin" | "staff" | "customer", className?: string }) {
  const pathname = usePathname()
  const items = navigationItems[role]

  return (
    <div className={cn("flex h-full flex-col", className)}>
      {/* Logo */}
      <div className="flex h-14 items-center border-b px-4">
        <Link href="/" className="flex items-center gap-2 font-semibold">
          <AdminIcon size={32} className="mr-2" />
          <span className="text-sm font-bold">ModernMen Admin</span>
        </Link>
      </div>

      {/* Navigation */}
      <ScrollArea className="flex-1 px-3">
        <div className="space-y-1 p-2">
          {items.map((item) => {
            const Icon = item.icon
            const isActive = pathname === item.href

            return (
              <Link key={item.name} href={item.href}>
                <Button
                  variant={isActive ? "secondary" : "ghost"}
                  className={cn(
                    "w-full justify-start gap-3",
                    isActive && "bg-secondary"
                  )}
                >
                  <Icon className="h-4 w-4" />
                  {item.name}
                </Button>
              </Link>
            )
          })}
        </div>
      </ScrollArea>

      {/* User Menu */}
      <div className="border-t p-4">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="w-full justify-start gap-3">
              <Avatar className="h-8 w-8">
                <AvatarImage src="/placeholder-user.jpg" alt="User" />
                <AvatarFallback>U</AvatarFallback>
              </Avatar>
              <div className="flex flex-col items-start text-sm">
                <span className="font-medium">John Doe</span>
                <span className="text-xs text-muted-foreground capitalize">{role}</span>
              </div>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" className="w-56">
            <DropdownMenuLabel>My Account</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <User className="mr-2 h-4 w-4" />
              Profile
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Settings className="mr-2 h-4 w-4" />
              Settings
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="text-red-600">
              <LogOut className="mr-2 h-4 w-4" />
              Log out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  )
}

export function DashboardLayout({ children, user }: DashboardLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = React.useState(false)
  const role = user?.role || "customer"

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Desktop Sidebar */}
      <div className="hidden lg:flex lg:w-64 lg:flex-col">
        <div className="flex grow flex-col overflow-y-auto border-r bg-white">
          <Sidebar role={role} />
        </div>
      </div>

      {/* Mobile Sidebar */}
      <Sheet open={sidebarOpen} onOpenChange={setSidebarOpen}>
        <SheetContent side="left" className="w-64 p-0">
          <Sidebar role={role} />
        </SheetContent>
      </Sheet>

      {/* Main Content */}
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Top Bar */}
        <header className="flex h-14 items-center gap-4 border-b bg-white px-4 lg:px-6">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="lg:hidden">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle sidebar</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-64 p-0">
              <Sidebar role={role} />
            </SheetContent>
          </Sheet>

          <div className="flex-1" />

          {/* Notifications */}
          <Button variant="ghost" size="icon" className="relative">
            <Bell className="h-5 w-5" />
            <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-red-500 text-xs text-white flex items-center justify-center">
              3
            </span>
          </Button>

          {/* User Menu */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                <Avatar className="h-8 w-8">
                  <AvatarImage src={user?.avatar} alt={user?.name} />
                  <AvatarFallback>
                    {user?.name?.charAt(0) || "U"}
                  </AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="end" forceMount>
              <DropdownMenuLabel className="font-normal">
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium leading-none">{user?.name}</p>
                  <p className="text-xs leading-none text-muted-foreground">
                    {user?.email}
                  </p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <User className="mr-2 h-4 w-4" />
                Profile
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Settings className="mr-2 h-4 w-4" />
                Settings
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="text-red-600">
                <LogOut className="mr-2 h-4 w-4" />
                Log out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto p-4 lg:p-6">
          {children}
        </main>
      </div>
    </div>
  )
}
