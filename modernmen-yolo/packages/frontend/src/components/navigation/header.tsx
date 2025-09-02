"use client"

import * as React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "../../lib/utils"
import { Button } from "../ui/button"
import { Badge } from "../ui/badge"
import { Logo } from "../ui/logo"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu"
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "../ui/sheet"
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar"
import { mainNavigation } from "../../lib/navigation"
import {
  Menu,
  Phone,
  MapPin,
  Clock,
  User,
  LogOut,
  Settings,
  Calendar,
  ChevronDown,
  Search,
} from "lucide-react"
import { AdminIcon } from "../ui/admin-icon"

// ModernMen branded icon mapping
const iconMap = {
  Home: () => <div className="w-4 h-4 bg-red-600 rounded-full flex items-center justify-center"><span className="text-white text-xs font-bold">M</span></div>,
  Scissors: () => <div className="w-4 h-4 bg-red-600 rounded-full flex items-center justify-center"><span className="text-white text-xs font-bold">M</span></div>,
  Users: () => <div className="w-4 h-4 bg-red-600 rounded-full flex items-center justify-center"><span className="text-white text-xs font-bold">M</span></div>,
  Image: () => <div className="w-4 h-4 bg-red-600 rounded-full flex items-center justify-center"><span className="text-white text-xs font-bold">M</span></div>,
  Phone: () => <div className="w-4 h-4 bg-red-600 rounded-full flex items-center justify-center"><span className="text-white text-xs font-bold">M</span></div>,
  Calendar: () => <div className="w-4 h-4 bg-red-600 rounded-full flex items-center justify-center"><span className="text-white text-xs font-bold">M</span></div>,
  Search: () => <div className="w-4 h-4 bg-red-600 rounded-full flex items-center justify-center"><span className="text-white text-xs font-bold">M</span></div>,
}

interface HeaderProps {
  user?: {
    name: string
    email: string
    avatar?: string
    role: "admin" | "staff" | "customer" | null
  }
  onAuthAction?: (action: "login" | "register" | "logout") => void
  className?: string
}

export function Header({ user, onAuthAction, className }: HeaderProps) {
  const pathname = usePathname()
  const [isScrolled, setIsScrolled] = React.useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false)

  React.useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10)
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const handleAuthAction = (action: "login" | "register" | "logout") => {
    onAuthAction?.(action)
    setMobileMenuOpen(false)
  }

  return (
    <header
      className={cn(
        "fixed top-0 w-full z-50 transition-all duration-300",
        isScrolled
          ? "bg-white/95 backdrop-blur-sm shadow-lg border-b"
          : "bg-transparent",
        className
      )}
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 lg:h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-3">
            <Logo size="lg" className="h-10 lg:h-12" />
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-6">
            {mainNavigation.map((item) => {
              const Icon = iconMap[item.icon as keyof typeof iconMap]
              const isActive = pathname === item.href || pathname.startsWith(item.href + "/")

              if (item.children) {
                return (
                  <DropdownMenu key={item.name}>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className={cn(
                        "text-sm font-medium transition-colors hover:text-red-600",
                        isActive && "text-red-600"
                      )}>
                        <Icon className="w-4 h-4 mr-2" />
                        {item.name}
                        <ChevronDown className="w-4 h-4 ml-1" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="start" className="w-64">
                      {item.children.map((child) => (
                        <DropdownMenuItem key={child.name} asChild>
                          <Link href={child.href} className="flex flex-col items-start">
                            <span className="font-medium">{child.name}</span>
                            {child.description && (
                              <span className="text-xs text-muted-foreground">{child.description}</span>
                            )}
                          </Link>
                        </DropdownMenuItem>
                      ))}
                    </DropdownMenuContent>
                  </DropdownMenu>
                )
              }

              return (
                <Link key={item.name} href={item.href}>
                  <Button variant="ghost" className={cn(
                    "text-sm font-medium transition-colors hover:text-red-600",
                    isActive && "text-red-600"
                  )}>
                    <Icon className="w-4 h-4 mr-2" />
                    {item.name}
                    {item.badge && (
                      <Badge variant="secondary" className="ml-2 text-xs">
                        {item.badge}
                      </Badge>
                    )}
                  </Button>
                </Link>
              )
            })}
          </nav>

          {/* Contact Info - Desktop */}
          <div className="hidden md:flex items-center space-x-6 text-sm">
            <div className="flex items-center space-x-2">
              <Phone className="w-4 h-4 text-red-600" />
              <span>(555) 123-4567</span>
            </div>
            <div className="flex items-center space-x-2">
              <MapPin className="w-4 h-4 text-red-600" />
              <span>123 Main St, City, ST</span>
            </div>
            <div className="flex items-center space-x-2">
              <Clock className="w-4 h-4 text-red-600" />
              <span>Mon-Sat: 9AM-7PM</span>
            </div>
          </div>

          {/* Auth Section */}
          <div className="flex items-center space-x-4">
            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={user.avatar} alt={user.name} />
                      <AvatarFallback>
                        {user.name.charAt(0).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end" forceMount>
                  <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium leading-none">{user.name}</p>
                      <p className="text-xs leading-none text-muted-foreground">
                        {user.email}
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
                  <DropdownMenuItem onClick={() => handleAuthAction("logout")}>
                    <LogOut className="mr-2 h-4 w-4" />
                    Log out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <div className="hidden md:flex items-center space-x-2">
                <Button variant="ghost" onClick={() => handleAuthAction("login")}>
                  Sign In
                </Button>
                <Button onClick={() => handleAuthAction("register")}>
                  Sign Up
                </Button>
              </div>
            )}

            {/* Mobile Menu */}
            <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="lg:hidden">
                  <Menu className="h-5 w-5" />
                  <span className="sr-only">Toggle menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[300px] sm:w-[400px]">
                <div className="flex flex-col h-full">
                  <div className="flex items-center justify-between p-4 border-b">
                    <div className="flex items-center space-x-2">
                      <Logo size="sm" className="w-8 h-8" />
                      <div>
                        <div className="font-semibold text-sm">Modern Men</div>
                        <div className="text-xs text-muted-foreground">Hair Salon</div>
                      </div>
                    </div>
                    <Button variant="ghost" size="icon" onClick={() => setMobileMenuOpen(false)}>
                      <Menu className="h-4 w-4" />
                    </Button>
                  </div>

                  <div className="flex-1 py-4">
                    {/* Mobile Navigation Links */}
                    <nav className="space-y-2">
                      {mainNavigation.map((item) => {
                        const Icon = iconMap[item.icon as keyof typeof iconMap]
                        const isActive = pathname === item.href || pathname.startsWith(item.href + "/")

                        if (item.children) {
                          return (
                            <DropdownMenu key={item.name}>
                              <DropdownMenuTrigger asChild>
                                <Button
                                  variant="ghost"
                                  className="w-full justify-start text-sm font-medium"
                                >
                                  <Icon className="w-4 h-4 mr-3" />
                                  <span>{item.name}</span>
                                  <ChevronDown className="w-4 h-4 ml-auto" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent side="right" className="w-56">
                                {item.children.map((child) => (
                                  <DropdownMenuItem key={child.name} asChild>
                                    <Link
                                      href={child.href}
                                      onClick={() => setMobileMenuOpen(false)}
                                    >
                                      {child.name}
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
                            className={cn(
                              "flex items-center space-x-3 px-3 py-2 rounded-md text-sm font-medium transition-colors hover:bg-accent",
                              isActive && "bg-accent text-accent-foreground"
                            )}
                            onClick={() => setMobileMenuOpen(false)}
                          >
                            <Icon className="w-4 h-4" />
                            <span>{item.name}</span>
                            {item.badge && (
                              <Badge variant="secondary" className="ml-auto text-xs">
                                {item.badge}
                              </Badge>
                            )}
                          </Link>
                        )
                      })}
                    </nav>

                  {/* Contact Info - Mobile */}
                  <div className="border-t pt-4 space-y-3">
                    <div className="flex items-center space-x-3 text-sm">
                      <Phone className="w-4 h-4 text-red-600" />
                      <span>(555) 123-4567</span>
                    </div>
                    <div className="flex items-center space-x-3 text-sm">
                      <MapPin className="w-4 h-4 text-red-600" />
                      <span>123 Main St, City, ST</span>
                    </div>
                    <div className="flex items-center space-x-3 text-sm">
                      <Clock className="w-4 h-4 text-red-600" />
                      <span>Mon-Sat: 9AM-7PM</span>
                    </div>
                  </div>

                  {/* Auth - Mobile */}
                  {!user ? (
                    <div className="border-t pt-4 space-y-2 px-4">
                      <Button
                        className="w-full"
                        onClick={() => handleAuthAction("login")}
                      >
                        Sign In
                      </Button>
                      <Button
                        variant="outline"
                        className="w-full"
                        onClick={() => handleAuthAction("register")}
                      >
                        Sign Up
                      </Button>
                    </div>
                  ) : (
                    <div className="border-t pt-4 px-4">
                      <div className="flex items-center space-x-3 py-3">
                        <Avatar className="h-10 w-10">
                          <AvatarImage src={user.avatar} alt={user.name} />
                          <AvatarFallback>
                            {user.name.charAt(0).toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="text-sm font-medium">{user.name}</p>
                          <p className="text-xs text-muted-foreground capitalize">{user.role}</p>
                        </div>
                      </div>
                      <div className="space-y-1">
                        <Button variant="ghost" size="sm" className="w-full justify-start">
                          <User className="w-4 h-4 mr-2" />
                          Profile
                        </Button>
                        <Button variant="ghost" size="sm" className="w-full justify-start">
                          <Settings className="w-4 h-4 mr-2" />
                          Settings
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50"
                          onClick={() => handleAuthAction("logout")}
                        >
                          <LogOut className="w-4 h-4 mr-2" />
                          Log out
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  )
}
