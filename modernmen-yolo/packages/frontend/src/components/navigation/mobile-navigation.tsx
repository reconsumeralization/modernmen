"use client"

import * as React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import {
  Menu,
  X,
  Home,

  Users,
  Image,
  Phone,
  Calendar,
  User,
  Settings,
  LogOut,
  ChevronRight,
  Search,
  Heart,
  Star,
  CreditCard,
  HelpCircle,
  MessageSquare,
  MapPin,
  Clock
} from "lucide-react"
import { Logo } from "../ui/logo"

interface MobileNavItem {
  name: string
  href: string
  icon?: React.ComponentType<{ className?: string }>
  badge?: string
  children?: MobileNavItem[]
  external?: boolean
}

interface MobileNavigationProps {
  items: MobileNavItem[]
  user?: {
    name: string
    email: string
    avatar?: string
    role: "admin" | "staff" | "customer" | null
  }
  onAuthAction?: (action: "login" | "register" | "logout") => void
  className?: string
}

export function MobileNavigation({
  items,
  user,
  onAuthAction,
  className
}: MobileNavigationProps) {
  const [open, setOpen] = React.useState(false)
  const [expandedItems, setExpandedItems] = React.useState<Set<string>>(new Set())

  const toggleExpanded = (itemName: string) => {
    const newExpanded = new Set(expandedItems)
    if (newExpanded.has(itemName)) {
      newExpanded.delete(itemName)
    } else {
      newExpanded.add(itemName)
    }
    setExpandedItems(newExpanded)
  }

  const handleLinkClick = () => {
    setOpen(false)
  }

  const handleAuthAction = (action: "login" | "register" | "logout") => {
    onAuthAction?.(action)
    setOpen(false)
  }

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className={cn("lg:hidden", className)}>
          <Menu className="h-5 w-5" />
          <span className="sr-only">Toggle navigation menu</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="w-80 p-0">
        <MobileNavContent
          items={items}
          user={user}
          expandedItems={expandedItems}
          onToggleExpanded={toggleExpanded}
          onLinkClick={handleLinkClick}
          onAuthAction={handleAuthAction}
        />
      </SheetContent>
    </Sheet>
  )
}

interface MobileNavContentProps {
  items: MobileNavItem[]
  user?: {
    name: string
    email: string
    avatar?: string
    role: "admin" | "staff" | "customer" | null
  }
  expandedItems: Set<string>
  onToggleExpanded: (itemName: string) => void
  onLinkClick: () => void
  onAuthAction: (action: "login" | "register" | "logout") => void
}

function MobileNavContent({
  items,
  user,
  expandedItems,
  onToggleExpanded,
  onLinkClick,
  onAuthAction
}: MobileNavContentProps) {
  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b">
        <div className="flex items-center space-x-2">
          <Logo size="sm" className="h-8" />
        </div>
        <Button variant="ghost" size="icon" onClick={onLinkClick}>
          <X className="h-4 w-4" />
        </Button>
      </div>

      <ScrollArea className="flex-1 px-2">
        <nav className="space-y-1 py-4">
          {items.map((item) => (
            <MobileNavItemComponent
              key={item.name}
              item={item}
              expanded={expandedItems.has(item.name)}
              onToggle={() => onToggleExpanded(item.name)}
              onClick={onLinkClick}
              level={0}
            />
          ))}
        </nav>

        {/* Quick Actions */}
        <div className="px-2 pb-4">
          <Separator className="mb-4" />
          <div className="space-y-2">
            <h3 className="text-sm font-medium text-muted-foreground px-3">
              Quick Actions
            </h3>
            <Link href="/book" onClick={onLinkClick}>
              <Button variant="ghost" className="w-full justify-start">
                <Calendar className="w-4 h-4 mr-3" />
                Book Appointment
              </Button>
            </Link>
            <Link href="/contact" onClick={onLinkClick}>
              <Button variant="ghost" className="w-full justify-start">
                <Phone className="w-4 h-4 mr-3" />
                Contact Us
              </Button>
            </Link>
            <Link href="/services" onClick={onLinkClick}>
              <Button variant="ghost" className="w-full justify-start">
                <div className="w-4 h-4 bg-red-600 rounded-full flex items-center justify-center mr-3">
                  <span className="text-white text-xs font-bold">M</span>
                </div>
                Our Services
              </Button>
            </Link>
          </div>
        </div>

        {/* Contact Info */}
        <div className="px-2 pb-4">
          <Separator className="mb-4" />
          <div className="space-y-2">
            <h3 className="text-sm font-medium text-muted-foreground px-3">
              Contact Info
            </h3>
            <div className="space-y-3 px-3">
              <div className="flex items-center space-x-3 text-sm">
                <Phone className="w-4 h-4 text-red-500 flex-shrink-0" />
                <span>(555) 123-4567</span>
              </div>
              <div className="flex items-center space-x-3 text-sm">
                <MapPin className="w-4 h-4 text-red-500 flex-shrink-0" />
                <span className="text-xs">123 Main St, City, ST 12345</span>
              </div>
              <div className="flex items-center space-x-3 text-sm">
                <Clock className="w-4 h-4 text-red-500 flex-shrink-0" />
                <span className="text-xs">Mon-Sat: 9AM-7PM</span>
              </div>
            </div>
          </div>
        </div>
      </ScrollArea>

      {/* User Section */}
      <div className="border-t p-4">
        {user ? (
          <div className="space-y-3">
            <div className="flex items-center space-x-3 px-3">
              <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                {user.avatar ? (
                  <img src={user.avatar} alt={user.name} className="w-10 h-10 rounded-full" />
                ) : (
                  <User className="w-5 h-5" />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">{user.name}</p>
                <p className="text-xs text-muted-foreground capitalize">{user.role}</p>
              </div>
            </div>
            <div className="space-y-1">
              <Button variant="ghost" size="sm" className="w-full justify-start" onClick={onLinkClick}>
                <User className="w-4 h-4 mr-2" />
                Profile
              </Button>
              <Button variant="ghost" size="sm" className="w-full justify-start" onClick={onLinkClick}>
                <Settings className="w-4 h-4 mr-2" />
                Settings
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50"
                onClick={() => onAuthAction("logout")}
              >
                <LogOut className="w-4 h-4 mr-2" />
                Log out
              </Button>
            </div>
          </div>
        ) : (
          <div className="space-y-2">
            <Button className="w-full" onClick={() => onAuthAction("login")}>
              Sign In
            </Button>
            <Button variant="outline" className="w-full" onClick={() => onAuthAction("register")}>
              Sign Up
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}

interface MobileNavItemComponentProps {
  item: MobileNavItem
  expanded: boolean
  onToggle: () => void
  onClick: () => void
  level: number
}

function MobileNavItemComponent({
  item,
  expanded,
  onToggle,
  onClick,
  level
}: MobileNavItemComponentProps) {
  const pathname = usePathname()
  const Icon = item.icon || Home
  const isActive = pathname === item.href || pathname.startsWith(item.href + "/")
  const hasChildren = item.children && item.children.length > 0

  return (
    <div>
      <div
        className={cn(
          "flex items-center justify-between px-3 py-2 rounded-md text-sm transition-colors",
          isActive
            ? "bg-primary text-primary-foreground"
            : "hover:bg-accent hover:text-accent-foreground",
          level > 0 && "ml-4"
        )}
        onClick={hasChildren ? onToggle : undefined}
      >
        {hasChildren ? (
          <div className="flex items-center flex-1">
            <Icon className="w-4 h-4 mr-3" />
            <span className="flex-1">{item.name}</span>
            <ChevronRight
              className={cn(
                "w-4 h-4 transition-transform",
                expanded && "rotate-90"
              )}
            />
          </div>
        ) : (
          <Link
            href={item.href}
            className="flex items-center flex-1"
            onClick={onClick}
          >
            <Icon className="w-4 h-4 mr-3" />
            <span className="flex-1">{item.name}</span>
            {item.badge && (
              <span className="bg-primary text-primary-foreground text-xs px-2 py-1 rounded-full ml-2">
                {item.badge}
              </span>
            )}
          </Link>
        )}
      </div>

      {/* Children */}
      {hasChildren && expanded && (
        <div className="mt-1 space-y-1">
          {item.children!.map((child) => (
            <MobileNavItemComponent
              key={child.name}
              item={child}
              expanded={false}
              onToggle={() => {}} // Children don't expand further
              onClick={onClick}
              level={level + 1}
            />
          ))}
        </div>
      )}
    </div>
  )
}

// Mobile bottom navigation for key actions
interface MobileBottomNavProps {
  items: Array<{
    name: string
    href: string
    icon: React.ComponentType<{ className?: string }>
    badge?: string
  }>
  className?: string
}

export function MobileBottomNav({ items, className }: MobileBottomNavProps) {
  const pathname = usePathname()

  return (
    <div className={cn(
      "fixed bottom-0 left-0 right-0 bg-white border-t lg:hidden z-40",
      className
    )}>
      <div className="grid grid-cols-5 h-16">
        {items.map((item) => {
          const Icon = item.icon
          const isActive = pathname === item.href || pathname.startsWith(item.href + "/")

          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "flex flex-col items-center justify-center space-y-1 transition-colors",
                isActive
                  ? "text-primary"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              <div className="relative">
                <Icon className="w-5 h-5" />
                {item.badge && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">
                    {item.badge}
                  </span>
                )}
              </div>
              <span className="text-xs">{item.name}</span>
            </Link>
          )
        })}
      </div>
    </div>
  )
}

// Mobile floating action button
interface MobileFABProps {
  icon: React.ComponentType<{ className?: string }>
  onClick: () => void
  label?: string
  className?: string
}

export function MobileFAB({ icon: Icon, onClick, label, className }: MobileFABProps) {
  return (
    <div className="fixed bottom-20 right-4 lg:hidden z-50">
      <Button
        size="lg"
        className={cn(
          "rounded-full shadow-lg hover:shadow-xl transition-shadow",
          className
        )}
        onClick={onClick}
      >
        <Icon className="w-5 h-5" />
        {label && <span className="sr-only">{label}</span>}
      </Button>
    </div>
  )
}
