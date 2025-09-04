'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { useSession, signOut } from 'next-auth/react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Separator } from '@/components/ui/separator'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
} from '@/components/ui/dropdown-menu'
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet'
import { X as XIcon } from 'lucide-react'
import {
  Menu,
  Bell,
  Settings,
  User,
  Phone,
  Calendar,
  Search,
  Scissors,
  LogOut,
  ChevronDown,
  Home,
  Users,
  Camera,
  HelpCircle,
  BarChart3,
  Package,
  Megaphone,
  Database,
  Book,
  FileText,
  Archive,
  Clock,
  Star,
} from '@/lib/icon-mapping'
import { motion, AnimatePresence } from 'framer-motion'
import {
  getNavigationForRole,
  filterNavigationByRole,
  quickActions
} from '@/config/navigation'
import { useAuth } from '@/hooks/useAuth'
import type { NavigationItem, UserNavigation } from '@/types/navigation'
import type { UserRole } from '@/lib/auth-constants'

// Icon mapping for navigation items
const iconMap = {
  home: Home,
  scissors: Scissors,
  users: Users,
  camera: Camera,
  phone: Phone,
  calendar: Calendar,
  search: Search,
  user: User,
  settings: Settings,
  help: HelpCircle,
  dashboard: BarChart3,
  package: Package,
  megaphone: Megaphone,
  database: Database,
  book: Book,
  'file-text': FileText,
  archive: Archive,
  clock: Clock,
  star: Star,
  analytics: BarChart3,
  chart: BarChart3,
}

interface RoleBasedNavbarProps {
  className?: string
}

export function RoleBasedNavbar({ className }: RoleBasedNavbarProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const [notifications] = useState(2) // Mock notification count

  const pathname = usePathname()
  const router = useRouter()
  const { data: session } = useSession()
  const { user, isAuthenticated } = useAuth()

  // Determine user role
  const userRole: UserRole = user?.role || 'guest'
  const navigation = getNavigationForRole(userRole)
  const filteredNavigation = filterNavigationByRole(navigation, userRole)

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Close mobile menu when clicking outside or on link
  useEffect(() => {
    const handleClickOutside = () => {
      if (isMobileMenuOpen) setIsMobileMenuOpen(false)
    }
    document.addEventListener('click', handleClickOutside)
    return () => document.removeEventListener('click', handleClickOutside)
  }, [isMobileMenuOpen])

  // Check if path is active
  const isActivePath = (href: string) => {
    if (href === '/') return pathname === '/'
    return pathname?.startsWith(href) || (href.startsWith('#') && pathname === '/')
  }

  // Get icon component
  const getIcon = (iconName: string) => {
    const IconComponent = iconMap[iconName as keyof typeof iconMap]
    return IconComponent || Scissors
  }

  // Handle sign out
  const handleSignOut = async () => {
    await signOut({ callbackUrl: '/' })
    router.push('/')
  }

  // Render navigation item
  const renderNavigationItem = (item: NavigationItem, mobile = false) => {
    const IconComponent = getIcon(item.icon || 'scissors')
    const isActive = isActivePath(item.href)
    const hasChildren = item.children && item.children.length > 0

    if (hasChildren) {
      return (
        <DropdownMenu key={item.name}>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size={mobile ? "lg" : "sm"}
              className={`justify-start ${mobile ? 'w-full' : ''} ${
                isActive
                  ? 'text-amber-600 bg-amber-50'
                  : 'text-slate-700 hover:text-amber-600 hover:bg-amber-50/50'
              }`}
            >
              <IconComponent className="h-4 w-4 mr-2" />
              {item.name}
              {item.badge && (
                <Badge variant="secondary" className="ml-2 h-5">
                  {item.badge}
                </Badge>
              )}
              <ChevronDown className="h-3 w-3 ml-1" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            {item.children?.map((child) => (
              <DropdownMenuItem key={child.name} asChild>
                <Link href={child.href} className="flex items-center">
                  {child.icon && React.createElement(getIcon(child.icon), { className: "h-4 w-4 mr-2" })}
                  {child.name}
                  {child.badge && (
                    <Badge variant="secondary" className="ml-2 h-4">
                      {child.badge}
                    </Badge>
                  )}
                </Link>
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      )
    }

    return (
      <Link
        key={item.name}
        href={item.href}
        className={`relative group px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
          mobile
            ? `flex items-center space-x-3 px-4 py-3 rounded-lg text-base ${
                isActive
                  ? 'text-amber-600 bg-amber-50 border-l-4 border-amber-500'
                  : 'text-slate-700 hover:text-amber-600 hover:bg-amber-50/50'
              }`
            : isActive
            ? 'text-amber-600 bg-amber-50'
            : 'text-slate-700 hover:text-amber-600 hover:bg-amber-50/50'
        }`}
        title={item.description}
        onClick={() => mobile && setIsMobileMenuOpen(false)}
      >
        {mobile && (
          <div className="flex items-center justify-center w-8 h-8 rounded-md bg-gradient-to-br from-amber-100 to-amber-200">
            <IconComponent className="h-4 w-4 text-amber-600" />
          </div>
        )}
        {!mobile && <IconComponent className="h-4 w-4 mr-2" />}
        <span className="relative z-10">{item.name}</span>
        {item.badge && (
          <Badge variant="secondary" className="ml-2 h-5">
            {item.badge}
          </Badge>
        )}
        {isActive && !mobile && (
          <motion.div
            className="absolute bottom-0 left-1/2 w-1 h-1 bg-amber-500 rounded-full"
            layoutId="navbar-indicator"
            style={{ x: '-50%' }}
          />
        )}
      </Link>
    )
  }

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      isScrolled
        ? 'bg-white/98 backdrop-blur-md shadow-lg border-b border-gray-100'
        : 'bg-white/95 backdrop-blur-sm shadow-sm'
    } ${className}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Enhanced Logo */}
          <motion.div
            className="flex-shrink-0"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Link href="/" className="flex items-center space-x-2 group">
              <div className="flex items-center justify-center w-10 h-10 bg-gradient-to-br from-amber-500 to-amber-600 rounded-lg shadow-md group-hover:shadow-lg transition-shadow">
                <Scissors className="h-5 w-5 text-white" />
              </div>
              <div className="flex flex-col">
                <span className="text-xl font-bold text-slate-900 group-hover:text-amber-600 transition-colors">
                  Modern Men
                </span>
                <span className="text-xs text-slate-500 -mt-1">Premium Salon</span>
              </div>
            </Link>
          </motion.div>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-1">
            {filteredNavigation.main.map((item) => (
              <motion.div
                key={item.name}
                whileHover={{ y: -1 }}
                whileTap={{ scale: 0.95 }}
              >
                {renderNavigationItem(item)}
              </motion.div>
            ))}
          </div>

          {/* Desktop Actions */}
          <div className="hidden md:flex items-center space-x-3">
            {/* Quick Actions */}
            {quickActions
              .filter(action => !action.roles || action.roles.includes(userRole))
              .map((action) => {
                const IconComponent = getIcon(action.icon || 'scissors')
                return (
                  <Button
                    key={action.name}
                    variant="ghost"
                    size="sm"
                    asChild
                    className="hover:bg-amber-50"
                  >
                    <Link href={action.href} title={action.description}>
                      <IconComponent className="h-4 w-4" />
                    </Link>
                  </Button>
                )
              })}

            {/* Notifications for authenticated users */}
            {isAuthenticated && (
              <Button
                variant="ghost"
                size="sm"
                className="relative hover:bg-amber-50"
                title="Notifications"
              >
                <Bell className="h-4 w-4" />
                {notifications > 0 && (
                  <Badge
                    variant="destructive"
                    className="absolute -top-1 -right-1 h-5 w-5 p-0 text-xs flex items-center justify-center"
                  >
                    {notifications}
                  </Badge>
                )}
              </Button>
            )}

            {/* User Menu */}
            {isAuthenticated ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm" className="hover:bg-amber-50">
                    <Avatar className="h-8 w-8 mr-2">
                      <AvatarImage src={user?.avatar} alt={user?.name} />
                      <AvatarFallback>
                        {user?.name?.split(' ').map(n => n[0]).join('') || 'U'}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col items-start">
                      <span className="text-sm font-medium">
                        {user?.name?.split(' ')[0] || 'User'}
                      </span>
                      <span className="text-xs text-muted-foreground capitalize">
                        {userRole}
                      </span>
                    </div>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-64">
                  <DropdownMenuLabel>
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium">{user?.name}</p>
                      <p className="text-xs text-muted-foreground">{user?.email}</p>
                      <Badge variant="outline" className="w-fit capitalize">
                        {userRole}
                      </Badge>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />

                  {/* User Navigation Items */}
                  {filteredNavigation.user?.map((item) => (
                    <DropdownMenuItem key={item.name} asChild>
                      <Link href={item.href} className="flex items-center">
                        {item.icon && React.createElement(getIcon(item.icon), { className: "mr-2 h-4 w-4" })}
                        {item.name}
                      </Link>
                    </DropdownMenuItem>
                  ))}

                  {/* Secondary Navigation for authenticated users */}
                  {filteredNavigation.secondary && filteredNavigation.secondary.length > 0 && (
                    <>
                      <DropdownMenuSeparator />
                      {filteredNavigation.secondary.map((item) => (
                        <DropdownMenuItem key={item.name} asChild>
                          <Link href={item.href} className="flex items-center">
                            {item.icon && React.createElement(getIcon(item.icon), { className: "mr-2 h-4 w-4" })}
                            {item.name}
                          </Link>
                        </DropdownMenuItem>
                      ))}
                    </>
                  )}

                  {/* Admin Navigation for admin users */}
                  {filteredNavigation.admin && filteredNavigation.admin.length > 0 && (
                    <>
                      <DropdownMenuSeparator />
                      <DropdownMenuLabel className="text-xs text-muted-foreground">
                        Administration
                      </DropdownMenuLabel>
                      {filteredNavigation.admin.map((item) => (
                        <DropdownMenuItem key={item.name} asChild>
                          <Link href={item.href} className="flex items-center">
                            {item.icon && React.createElement(getIcon(item.icon), { className: "mr-2 h-4 w-4" })}
                            {item.name}
                          </Link>
                        </DropdownMenuItem>
                      ))}
                    </>
                  )}

                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleSignOut} className="text-red-600">
                    <LogOut className="mr-2 h-4 w-4" />
                    Sign out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Button variant="outline" size="sm" asChild>
                <Link href="/auth/signin">
                  <User className="h-4 w-4 mr-2" />
                  Sign In
                </Link>
              </Button>
            )}

            {/* Phone Button */}
            <Button
              variant="outline"
              size="sm"
              asChild
              className="border-amber-200 hover:border-amber-300 hover:bg-amber-50 text-amber-700"
            >
              <Link href="tel:(306)522-4111">
                <Phone className="h-4 w-4 mr-2" />
                (306) 522-4111
              </Link>
            </Button>

            {/* Book Now - Primary CTA */}
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button
                className="bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 shadow-md hover:shadow-lg transition-all duration-200"
                asChild
              >
                <Link href="/booking">
                  <Calendar className="h-4 w-4 mr-2" />
                  Book Now
                </Link>
              </Button>
            </motion.div>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex items-center space-x-2 md:hidden">
            {/* Mobile Search */}
            <Button variant="ghost" size="sm" asChild>
              <Link href="/search">
                <Search className="h-5 w-5" />
              </Link>
            </Button>

            {/* Mobile Menu Toggle */}
            <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
              <SheetTrigger asChild>
                <motion.button
                  className="inline-flex items-center justify-center p-2 rounded-lg text-slate-700 hover:text-amber-600 hover:bg-amber-50 focus:outline-none focus:ring-2 focus:ring-amber-500 transition-colors"
                  whileTap={{ scale: 0.95 }}
                  aria-label={isMobileMenuOpen ? 'Close menu' : 'Open menu'}
                >
                  <AnimatePresence mode="wait">
                    {isMobileMenuOpen ? (
                      <motion.div
                        key="close"
                        initial={{ rotate: -90, opacity: 0 }}
                        animate={{ rotate: 0, opacity: 1 }}
                        exit={{ rotate: 90, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                      >
                        <XIcon className="block h-6 w-6" />
                      </motion.div>
                    ) : (
                      <motion.div
                        key="menu"
                        initial={{ rotate: 90, opacity: 0 }}
                        animate={{ rotate: 0, opacity: 1 }}
                        exit={{ rotate: -90, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                      >
                        <Menu className="block h-6 w-6" />
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.button>
              </SheetTrigger>

              <SheetContent side="right" className="w-80">
                <div className="flex flex-col h-full">
                  {/* Mobile User Section */}
                  {isAuthenticated && user && (
                    <div className="flex items-center space-x-3 p-4 bg-gradient-to-r from-amber-50 to-orange-50 rounded-lg mb-4">
                      <Avatar className="h-12 w-12">
                        <AvatarImage src={user.avatar} alt={user.name} />
                        <AvatarFallback>
                          {user.name?.split(' ').map(n => n[0]).join('') || 'U'}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <p className="text-sm font-medium text-slate-900">{user.name}</p>
                        <p className="text-xs text-slate-500">{user.email}</p>
                        <Badge variant="outline" className="mt-1 capitalize">
                          {userRole}
                        </Badge>
                      </div>
                    </div>
                  )}

                  {/* Mobile Navigation */}
                  <div className="flex-1 space-y-4">
                    {/* Main Navigation */}
                    <div>
                      <h3 className="text-sm font-medium text-slate-500 mb-2">Navigation</h3>
                      <div className="space-y-2">
                        {filteredNavigation.main.map((item, index) => (
                          <motion.div
                            key={item.name}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.1, duration: 0.3 }}
                          >
                            {renderNavigationItem(item, true)}
                          </motion.div>
                        ))}
                      </div>
                    </div>

                    {/* Secondary Navigation */}
                    {filteredNavigation.secondary && filteredNavigation.secondary.length > 0 && (
                      <div>
                        <h3 className="text-sm font-medium text-slate-500 mb-2">Quick Access</h3>
                        <div className="space-y-2">
                          {filteredNavigation.secondary.map((item, index) => (
                            <motion.div
                              key={item.name}
                              initial={{ opacity: 0, x: -20 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: (index + filteredNavigation.main.length) * 0.1, duration: 0.3 }}
                            >
                              <Link
                                href={item.href}
                                className="flex items-center space-x-3 px-4 py-3 rounded-lg text-base font-medium text-slate-700 hover:text-amber-600 hover:bg-amber-50/50 transition-all duration-200"
                                onClick={() => setIsMobileMenuOpen(false)}
                              >
                                <div className="flex items-center justify-center w-8 h-8 rounded-md bg-gradient-to-br from-amber-100 to-amber-200">
                                  {item.icon && React.createElement(getIcon(item.icon), { className: "h-4 w-4 text-amber-600" })}
                                </div>
                                <span>{item.name}</span>
                              </Link>
                            </motion.div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Admin Navigation */}
                    {filteredNavigation.admin && filteredNavigation.admin.length > 0 && (
                      <div>
                        <h3 className="text-sm font-medium text-slate-500 mb-2">Administration</h3>
                        <div className="space-y-2">
                          {filteredNavigation.admin.map((item, index) => (
                            <motion.div
                              key={item.name}
                              initial={{ opacity: 0, x: -20 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: (index + (filteredNavigation.main.length + (filteredNavigation.secondary?.length || 0))) * 0.1, duration: 0.3 }}
                            >
                              <Link
                                href={item.href}
                                className="flex items-center space-x-3 px-4 py-3 rounded-lg text-base font-medium text-slate-700 hover:text-amber-600 hover:bg-amber-50/50 transition-all duration-200"
                                onClick={() => setIsMobileMenuOpen(false)}
                              >
                                <div className="flex items-center justify-center w-8 h-8 rounded-md bg-gradient-to-br from-red-100 to-red-200">
                                  {item.icon && React.createElement(getIcon(item.icon), { className: "h-4 w-4 text-red-600" })}
                                </div>
                                <span>{item.name}</span>
                              </Link>
                            </motion.div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Mobile Footer Actions */}
                  <div className="border-t border-gray-100 pt-4 space-y-3">
                    {!isAuthenticated && (
                      <Button variant="outline" size="lg" className="w-full justify-start" asChild>
                        <Link href="/auth/signin" onClick={() => setIsMobileMenuOpen(false)}>
                          <User className="h-5 w-5 mr-3" />
                          Sign In to Your Account
                        </Link>
                      </Button>
                    )}

                    <Button
                      variant="outline"
                      size="lg"
                      className="w-full justify-start border-amber-200 hover:border-amber-300 hover:bg-amber-50 text-amber-700"
                      asChild
                    >
                      <Link href="tel:(306)522-4111" onClick={() => setIsMobileMenuOpen(false)}>
                        <Phone className="h-5 w-5 mr-3" />
                        Call (306) 522-4111
                      </Link>
                    </Button>

                    <Button
                      size="lg"
                      className="w-full justify-start bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 shadow-md"
                      asChild
                    >
                      <Link href="/booking" onClick={() => setIsMobileMenuOpen(false)}>
                        <Calendar className="h-5 w-5 mr-3" />
                        Book Your Appointment
                      </Link>
                    </Button>

                    {isAuthenticated && (
                      <Button
                        variant="outline"
                        size="lg"
                        className="w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50"
                        onClick={() => {
                          handleSignOut()
                          setIsMobileMenuOpen(false)
                        }}
                      >
                        <LogOut className="h-5 w-5 mr-3" />
                        Sign Out
                      </Button>
                    )}
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </nav>
  )
}
