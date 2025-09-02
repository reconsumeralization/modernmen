// =============================================================================
// BARBER EXPERIENCE HUB - Unified experience management system
// =============================================================================

"use client"

import React, { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import {
  Crown,
  Users,
  Star,
  Heart,
  Zap,
  Trophy,
  MessageSquare,
  Calendar,
  Clock,
  CheckCircle,
  TrendingUp,
  Award,
  Sparkles,
  Target,
  Gift,
  Coffee,
  Camera,
  Bell,
  Phone,
  MapPin
} from "lucide-react"
import { cn } from "@/lib/utils"

// Import all experience components
import {
  CustomerExperienceDashboard,
  BarberProfileCard,
  AppointmentStatusTracker,
  CustomerFeedbackForm,
  LoyaltyProgram,
  BarberDashboard,
  CustomerVisitExperience
} from "./index"

// =============================================================================
// MAIN EXPERIENCE HUB COMPONENT
// =============================================================================

interface BarberExperienceHubProps {
  userType: 'customer' | 'barber' | 'admin'
  userData: any
  onNavigate?: (destination: string) => void
}

export function BarberExperienceHub({
  userType,
  userData,
  onNavigate
}: BarberExperienceHubProps) {
  const [activeView, setActiveView] = useState<'dashboard' | 'appointments' | 'barbers' | 'loyalty' | 'feedback'>('dashboard')
  const [showQuickActions, setShowQuickActions] = useState(true)

  // Mock data for demonstration
  const mockCustomerData = {
    id: "customer_123",
    name: "John Smith",
    avatar: "/placeholder-user.jpg",
    memberSince: "2023-01-15",
    totalVisits: 24,
    favoriteBarber: "Mike Johnson",
    preferredServices: ["Haircut", "Beard Grooming"],
    loyaltyTier: "Gold" as const,
    loyaltyPoints: 1250,
    dateOfBirth: "1990-05-15"
  }

  // Barber data for BarberProfileCard (detailed portfolio)
  const mockBarberDataDetailed = {
    id: "barber_456",
    name: "Mike Johnson",
    avatar: "/placeholder-user.jpg",
    bio: "Experienced barber with 8 years in the industry, specializing in modern cuts and traditional techniques.",
    specialties: ["Haircuts", "Fades", "Beard Grooming", "Traditional Cuts"],
    experience: 8,
    rating: 4.9,
    reviewCount: 156,
    certifications: ["Master Barber License", "Color Specialist"],
    languages: ["English", "Spanish"],
    portfolio: [
      {
        id: "1",
        title: "Modern Fade",
        image: "/placeholder-portfolio-1.jpg",
        description: "Clean modern fade with textured top",
        style: "Modern",
        duration: 45
      }
    ],
    availability: {
      status: "available" as const,
      nextAvailable: "2:30 PM",
      workingHours: [
        { day: "Monday", start: "9:00", end: "18:00", available: true },
        { day: "Tuesday", start: "9:00", end: "18:00", available: true },
        { day: "Wednesday", start: "9:00", end: "18:00", available: true },
        { day: "Thursday", start: "9:00", end: "18:00", available: true },
        { day: "Friday", start: "9:00", end: "18:00", available: true },
        { day: "Saturday", start: "8:00", end: "16:00", available: true },
        { day: "Sunday", start: "Closed", end: "Closed", available: false }
      ]
    },
    stats: {
      totalClients: 1250,
      yearsExperience: 8,
      averageRating: 4.9,
      specialtiesCount: 4
    },
    reviews: [
      {
        id: "1",
        customerName: "John Smith",
        customerAvatar: "/placeholder-user.jpg",
        rating: 5,
        comment: "Mike is fantastic! Always gets the perfect cut.",
        date: "2024-01-15",
        service: "Haircut",
        verified: true
      }
    ],
    nextAvailable: "2024-01-22T14:00:00Z"
  }

  // Barber data for CustomerExperienceDashboard (simple portfolio)
  const mockBarberDataSimple = {
    id: "barber_456",
    name: "Mike Johnson",
    avatar: "/placeholder-user.jpg",
    specialties: ["Haircuts", "Fades", "Beard Grooming", "Traditional Cuts"],
    rating: 4.9,
    experience: 8,
    portfolio: [
      {
        id: "portfolio_1",
        title: "Classic Haircut",
        image: "/placeholder-portfolio-1.jpg",
        description: "Professional haircut service",
        style: "Classic",
        duration: 45
      }
    ],
    availability: "available" as const,
    nextAvailable: "2024-01-22T14:00:00Z"
  }

  const mockAppointment = {
    id: "apt_789",
    customerName: "John Smith",
    service: "Classic Haircut",
    barber: "Mike Johnson",
    date: "2024-01-20",
    time: "14:00",
    duration: 45,
    status: "confirmed" as const,
    currentStatus: {
      id: "status_1",
      appointmentId: "apt_789",
      status: "confirmed" as const,
      timestamp: new Date(),
      message: "Appointment confirmed and ready",
      estimatedDuration: 45
    },
    statusHistory: [
      {
        id: "status_1",
        appointmentId: "apt_789",
        status: "scheduled" as const,
        timestamp: new Date(Date.now() - 3600000),
        message: "Appointment scheduled"
      },
      {
        id: "status_2",
        appointmentId: "apt_789",
        status: "confirmed" as const,
        timestamp: new Date(),
        message: "Appointment confirmed and ready"
      }
    ],
    estimatedWaitTime: 5,
    notifications: [
      {
        id: "notif_1",
        type: "info" as const,
        title: "Appointment Reminder",
        message: "Your appointment is in 2 hours",
        timestamp: new Date(Date.now() - 7200000),
        read: false
      }
    ]
  }

  const mockLoyaltyData = {
    customerId: "customer_123",
    currentTier: {
      id: 'gold',
      name: 'Gold' as const,
      color: 'bg-yellow-500',
      icon: Crown,
      minPoints: 1500,
      maxPoints: 2999,
      perks: [],
      exclusiveOffers: []
    },
    totalPoints: 1850,
    availablePoints: 1650,
    pointsToNextTier: 150,
    lifetimeValue: 2450,
    memberSince: new Date("2023-01-15"),
    streak: {
      current: 3,
      longest: 8,
      lastVisit: new Date("2024-01-18")
    },
    achievements: [
      {
        id: "ach_1",
        title: "First Visit",
        description: "Completed your first appointment",
        icon: Star,
        unlockedAt: new Date("2023-01-15"),
        rarity: "common" as const
      }
    ],
    recentActivity: [
      {
        id: "act_1",
        type: "earn" as const,
        description: "Service completed - Classic Haircut",
        points: 50,
        timestamp: new Date("2024-01-18"),
        icon: () => (
          <div className="w-5 h-5 bg-red-600 rounded-full flex items-center justify-center">
            <span className="text-white text-xs font-bold">M</span>
          </div>
        )
      }
    ],
    personalizedRewards: [
      {
        id: "reward_1",
        title: "Free Beard Trim",
        description: "Complimentary beard grooming service",
        pointsCost: 100,
        category: "service" as const,
        available: true,
        redeemed: false,
        validUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
      }
    ]
  }

  // Render based on user type
  if (userType === 'customer') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
        {/* Header */}
        <div className="bg-white dark:bg-slate-800 border-b">
          <div className="max-w-7xl mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Avatar className="h-10 w-10">
                  <AvatarImage src={mockCustomerData.avatar} />
                  <AvatarFallback>
                    {mockCustomerData.name.split(' ').map(n => n[0]).join('')}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h1 className="text-xl font-bold">Welcome back, {mockCustomerData.name}!</h1>
                  <p className="text-sm text-muted-foreground">
                    {mockCustomerData.loyaltyTier} Member • {mockCustomerData.loyaltyPoints} points
                  </p>
                </div>
              </div>

              {/* Navigation */}
              <div className="flex gap-2">
                {[
                  { id: 'dashboard', label: 'Dashboard', icon: Crown },
                  { id: 'appointments', label: 'Appointments', icon: Calendar },
                  { id: 'barbers', label: 'Barbers', icon: Users },
                  { id: 'loyalty', label: 'Loyalty', icon: Trophy }
                ].map(({ id, label, icon: Icon }) => (
                  <Button
                    key={id}
                    variant={activeView === id ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setActiveView(id as any)}
                    className="flex items-center gap-2"
                  >
                    <Icon className="h-4 w-4" />
                    <span className="hidden sm:inline">{label}</span>
                  </Button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="max-w-7xl mx-auto px-4 py-6">
          <AnimatePresence mode="wait">
            {activeView === 'dashboard' && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
              >
                <CustomerExperienceDashboard
                  customer={mockCustomerData}
                  upcomingVisit={{
                    id: "visit_1",
                    date: "2024-01-20",
                    barber: "Mike Johnson",
                    service: "Classic Haircut",
                    duration: 45,
                    satisfaction: 5,
                    notes: "Looking forward to my regular cut"
                  }}
                  visitHistory={[
                    {
                      id: "visit_2",
                      date: "2024-01-13",
                      barber: "Mike Johnson",
                      service: "Haircut & Beard",
                      duration: 60,
                      satisfaction: 5,
                      notes: "Great service as always"
                    }
                  ]}
                  preferredBarber={mockBarberDataSimple}
                  experiencePrefs={{
                    ambiance: 'music',
                    beverages: ['Coffee'],
                    entertainment: ['WiFi'],
                    specialRequests: ['Extra attention to sideburns']
                  }}
                  onUpdatePreferences={(prefs) => console.log('Update preferences:', prefs)}
                  onBookVisit={() => console.log('Book visit')}
                  onRateExperience={(visitId, rating, feedback) =>
                    console.log('Rate experience:', visitId, rating, feedback)
                  }
                />
              </motion.div>
            )}

            {activeView === 'appointments' && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
              >
                <AppointmentStatusTracker
                  appointment={mockAppointment}
                  onStatusUpdate={(id, status) => console.log('Update status:', id, status)}
                  onContactBarber={() => console.log('Contact barber')}
                  onReschedule={() => console.log('Reschedule')}
                  onCancel={() => console.log('Cancel')}
                />
              </motion.div>
            )}

            {activeView === 'barbers' && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="grid md:grid-cols-2 lg:grid-cols-3 gap-6"
              >
                <BarberProfileCard
                  barber={mockBarberDataDetailed}
                  isFavorite={true}
                  onFavoriteToggle={(id) => console.log('Toggle favorite:', id)}
                  onBookAppointment={(id) => console.log('Book with barber:', id)}
                  onViewProfile={(id) => console.log('View profile:', id)}
                />
              </motion.div>
            )}

            {activeView === 'loyalty' && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
              >
                <LoyaltyProgram
                  loyalty={mockLoyaltyData}
                  onRedeemReward={(id) => console.log('Redeem reward:', id)}
                  onViewHistory={() => console.log('View history')}
                />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    )
  }

  if (userType === 'barber') {
    return (
      <BarberDashboard
        barberId={mockBarberDataDetailed.id}
        barberName={mockBarberDataDetailed.name}
        barberAvatar={mockBarberDataDetailed.avatar}
        currentVisits={[
          {
            customerId: "customer_123",
            customerName: "John Smith",
            customerAvatar: "/placeholder-user.jpg",
            barberId: mockBarberDataDetailed.id,
            barberName: mockBarberDataDetailed.name,
            barberAvatar: mockBarberDataDetailed.avatar,
            serviceId: "service_1",
            serviceName: "Classic Haircut",
            appointmentId: "apt_789",
            visitStartTime: new Date(),
            estimatedCompletionTime: new Date(Date.now() + 45 * 60 * 1000),
            progressPercentage: 60,
            currentStage: {
              id: 'service',
              name: 'Service in Progress',
              description: 'Main service delivery',
              estimatedDuration: 45,
              icon: () => (
  <div className="w-6 h-6 bg-red-600 rounded-full flex items-center justify-center">
    <span className="text-white text-xs font-bold">M</span>
  </div>
),
              color: 'bg-orange-500',
              actions: [
                {
                  id: 'service_start',
                  type: 'notification',
                  title: 'Service Started',
                  description: 'Begin the main service',
                  required: true,
                  completed: true
                }
              ]
            },
            preferences: {
              ambiance: 'music',
              beverages: ['Coffee'],
              entertainment: ['WiFi'],
              specialRequests: ['Extra attention to sideburns']
            },
            status: 'in_service',
            statusMessage: 'Service in progress - applying finishing touches',
            lastUpdate: new Date(),
            messages: [
              {
                id: "msg_1",
                from: 'system',
                message: 'Service started at 2:15 PM',
                timestamp: new Date(Date.now() - 15 * 60 * 1000),
                read: true
              },
              {
                id: "msg_2",
                from: 'barber',
                message: 'How does this look so far?',
                timestamp: new Date(Date.now() - 5 * 60 * 1000),
                read: true
              }
            ],
            photos: [
              {
                id: "photo_1",
                type: 'before',
                url: '/placeholder-before.jpg',
                timestamp: new Date(Date.now() - 20 * 60 * 1000),
                description: 'Before photo'
              }
            ],
            serviceNotes: 'Customer requested extra attention to sideburns',
            productRecommendations: ['Premium Hair Wax', 'Beard Oil'],
            barberNotes: 'Great conversation, very friendly customer'
          }
        ]}
        todaysSchedule={[
          {
            customerId: "customer_123",
            customerName: "John Smith",
            customerAvatar: "/placeholder-user.jpg",
            barberId: mockBarberDataDetailed.id,
            barberName: mockBarberDataDetailed.name,
            barberAvatar: mockBarberDataDetailed.avatar,
            serviceId: "service_1",
            serviceName: "Classic Haircut",
            appointmentId: "apt_789",
            visitStartTime: new Date(),
            estimatedCompletionTime: new Date(Date.now() + 45 * 60 * 1000),
            progressPercentage: 60,
            currentStage: {
              id: 'service',
              name: 'Service in Progress',
              description: 'Main service delivery',
              estimatedDuration: 45,
              icon: () => (
  <div className="w-6 h-6 bg-red-600 rounded-full flex items-center justify-center">
    <span className="text-white text-xs font-bold">M</span>
  </div>
),
              color: 'bg-orange-500',
              actions: []
            },
            preferences: {
              ambiance: 'music',
              beverages: ['Coffee'],
              entertainment: ['WiFi'],
              specialRequests: ['Extra attention to sideburns']
            },
            status: 'in_service',
            statusMessage: 'Service in progress',
            lastUpdate: new Date(),
            messages: [],
            photos: [],
            serviceNotes: '',
            productRecommendations: [],
            barberNotes: ''
          }
        ]}
        onUpdateVisitStatus={(id, updates) => console.log('Update visit:', id, updates)}
        onSendMessage={(id, message) => console.log('Send message:', id, message)}
        onCompleteStage={(visitId, stageId, actionId) =>
          console.log('Complete stage:', visitId, stageId, actionId)
        }
      />
    )
  }

  // Admin view or default
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold mb-4">Barber Experience Hub</h1>
          <p className="text-muted-foreground mb-8">
            Comprehensive experience management for customers and barbers
          </p>

          <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            <Card className="hover:shadow-lg transition-shadow cursor-pointer"
                  onClick={() => onNavigate?.('/customer/dashboard')}>
              <CardContent className="p-6 text-center">
                <Users className="h-12 w-12 mx-auto mb-4 text-primary" />
                <h3 className="text-xl font-semibold mb-2">Customer Experience</h3>
                <p className="text-muted-foreground mb-4">
                  Personalized dashboard, appointment tracking, loyalty program
                </p>
                <Button>View Customer Hub</Button>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow cursor-pointer"
                  onClick={() => onNavigate?.('/barber/dashboard')}>
              <CardContent className="p-6 text-center">
                <div className="w-12 h-12 bg-red-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-white text-lg font-bold">M</span>
                </div>
                <h3 className="text-xl font-semibold mb-2">Barber Experience</h3>
                <p className="text-muted-foreground mb-4">
                  Client management, service tracking, communication tools
                </p>
                <Button>View Barber Hub</Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}

// =============================================================================
// EXPERIENCE SYSTEM SUMMARY COMPONENT
// =============================================================================

export function ExperienceSystemOverview() {
  const features = [
    {
      title: "Customer Experience Dashboard",
      description: "Personalized welcome, visit tracking, and preference management",
      icon: Crown,
      color: "bg-blue-500",
      benefits: ["Personalized greetings", "Real-time updates", "Preference tracking", "Loyalty integration"]
    },
    {
      title: "Barber Profile System",
      description: "Comprehensive barber profiles with portfolios and specialties",
      icon: Users,
      color: "bg-green-500",
      benefits: ["Portfolio showcase", "Specialty highlighting", "Review system", "Availability management"]
    },
    {
      title: "Appointment Status Tracker",
      description: "Live appointment progress with real-time notifications",
      icon: Clock,
      color: "bg-orange-500",
      benefits: ["Live updates", "Progress tracking", "Communication", "Status history"]
    },
    {
      title: "Customer Feedback System",
      description: "Comprehensive feedback collection and analysis",
      icon: Star,
      color: "bg-yellow-500",
      benefits: ["Multi-step feedback", "Detailed ratings", "Follow-up", "Analytics"]
    },
    {
      title: "Loyalty Program",
      description: "Tier-based rewards with personalized perks",
      icon: Trophy,
      color: "bg-purple-500",
      benefits: ["Tier progression", "Points system", "Exclusive offers", "Achievement tracking"]
    },
    {
      title: "Barber Experience Orchestrator",
      description: "Complete visit workflow management for barbers",
      icon: Zap,
      color: "bg-red-500",
      benefits: ["Visit stages", "Communication", "Media tracking", "Service completion"]
    }
  ]

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4">Barber Experience System</h1>
        <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
          A comprehensive platform that enhances both customer and barber experiences
          through personalized interactions, real-time communication, and intelligent automation.
        </p>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
        {features.map((feature, index) => (
          <motion.div
            key={feature.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card className="h-full hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-center gap-3 mb-2">
                  <div className={cn("p-3 rounded-lg", feature.color)}>
                    <feature.icon className="h-6 w-6 text-white" />
                  </div>
                  <CardTitle className="text-lg">{feature.title}</CardTitle>
                </div>
                <p className="text-muted-foreground">{feature.description}</p>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {feature.benefits.map((benefit, idx) => (
                    <li key={idx} className="flex items-center gap-2 text-sm">
                      <CheckCircle className="h-4 w-4 text-green-500 flex-shrink-0" />
                      {benefit}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      <div className="text-center">
        <Card className="bg-gradient-to-r from-primary/10 to-secondary/10 border-primary/20">
          <CardContent className="p-8">
            <Sparkles className="h-12 w-12 mx-auto mb-4 text-primary" />
            <h2 className="text-2xl font-bold mb-4">Experience the Difference</h2>
            <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
              Our comprehensive barber experience system creates exceptional interactions
              that delight customers and empower barbers with tools that enhance every visit.
            </p>
            <div className="flex gap-4 justify-center">
              <Button size="lg" className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                Customer Portal
              </Button>
              <Button size="lg" variant="outline" className="flex items-center gap-2">
                <div className="w-5 h-5 bg-red-600 rounded-full flex items-center justify-center">
                  <span className="text-white text-xs font-bold">M</span>
                </div>
                Barber Portal
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

// Export main component and overview
export default BarberExperienceHub
