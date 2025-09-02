// =============================================================================
// CUSTOMER EXPERIENCE DASHBOARD - Personalized barber visit experience
// =============================================================================

"use client"

import React, { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  Heart,
  Star,
  Calendar,
  Clock,
  MapPin,
  Phone,
  MessageSquare,
  Gift,
  Award,
  TrendingUp,
  Coffee,
  Music,
  Wifi,
  Users,
  Sparkles,
  Zap,
  Crown
} from "lucide-react"
import { cn } from "@/lib/utils"

// Types for enhanced customer experience
interface CustomerProfile {
  id: string
  name: string
  avatar?: string
  memberSince: string
  totalVisits: number
  favoriteBarber?: string
  preferredServices: string[]
  loyaltyTier: 'Bronze' | 'Silver' | 'Gold' | 'Platinum'
  loyaltyPoints: number
}

interface BarberProfile {
  id: string
  name: string
  avatar?: string
  specialties: string[]
  rating: number
  experience: number // years
  portfolio: {
    id: string
    title: string
    image: string
    description: string
    style: string
    duration: number
  }[]
  availability: 'available' | 'busy' | 'offline'
  nextAvailable: string
}

interface VisitExperience {
  id: string
  date: string
  barber: string
  service: string
  duration: number
  satisfaction: number
  notes: string
  photos?: string[]
  tips?: string[]
}

interface ExperiencePreferences {
  ambiance: 'quiet' | 'music' | 'conversation'
  beverages: string[]
  entertainment: string[]
  specialRequests: string[]
}

export interface CustomerExperienceDashboardProps {
  customer: CustomerProfile
  upcomingVisit?: VisitExperience
  visitHistory: VisitExperience[]
  preferredBarber?: BarberProfile
  experiencePrefs: ExperiencePreferences
  onUpdatePreferences: (prefs: Partial<ExperiencePreferences>) => void
  onBookVisit: () => void
  onRateExperience: (visitId: string, rating: number, feedback: string) => void
}

const tierConfig = {
  Bronze: { color: 'bg-amber-600', icon: Award, perks: ['Basic loyalty points', 'Birthday discount'] },
  Silver: { color: 'bg-gray-400', icon: Star, perks: ['Priority booking', 'Free beverage', '10% off services'] },
  Gold: { color: 'bg-yellow-500', icon: Crown, perks: ['VIP waiting area', 'Free consultation', '15% off services', 'Exclusive products'] },
  Platinum: { color: 'bg-purple-600', icon: Sparkles, perks: ['Personal stylist', '20% off services', 'Free monthly service', 'Exclusive events'] }
}

export function CustomerExperienceDashboard({
  customer,
  upcomingVisit,
  visitHistory,
  preferredBarber,
  experiencePrefs,
  onUpdatePreferences,
  onBookVisit,
  onRateExperience
}: CustomerExperienceDashboardProps) {
  const [activeTab, setActiveTab] = useState<'overview' | 'experience' | 'loyalty' | 'preferences'>('overview')
  const [showWelcome, setShowWelcome] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => setShowWelcome(false), 3000)
    return () => clearTimeout(timer)
  }, [])

  const nextTierPoints = customer.loyaltyTier === 'Bronze' ? 100 :
                        customer.loyaltyTier === 'Silver' ? 250 :
                        customer.loyaltyTier === 'Gold' ? 500 : 1000

  const progressToNextTier = (customer.loyaltyPoints / nextTierPoints) * 100

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
      {/* Welcome Animation */}
      <AnimatePresence>
        {showWelcome && (
          <motion.div
            initial={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -50 }}
            transition={{ duration: 0.5 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              className="bg-white dark:bg-slate-800 rounded-lg p-8 text-center max-w-md mx-4"
            >
              <div className="text-6xl mb-4">✂️</div>
              <h2 className="text-2xl font-bold mb-2">Welcome back, {customer.name}!</h2>
              <p className="text-muted-foreground">Ready for your premium grooming experience?</p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header */}
      <div className="bg-white dark:bg-slate-800 border-b">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Avatar className="h-16 w-16 ring-4 ring-primary/20">
                <AvatarImage src={customer.avatar} />
                <AvatarFallback className="text-lg font-semibold">
                  {customer.name.split(' ').map(n => n[0]).join('')}
                </AvatarFallback>
              </Avatar>
              <div>
                <h1 className="text-2xl font-bold">Welcome back, {customer.name}!</h1>
                <p className="text-muted-foreground">
                  Member since {new Date(customer.memberSince).getFullYear()}
                  • {customer.totalVisits} visits • {customer.loyaltyTier} Member
                </p>
              </div>
            </div>

            {/* Loyalty Status */}
            <Card className="bg-gradient-to-r from-primary/10 to-primary/5 border-primary/20">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className={cn("p-2 rounded-full", tierConfig[customer.loyaltyTier].color)}>
                    {React.createElement(tierConfig[customer.loyaltyTier].icon, {
                      className: "h-5 w-5 text-white"
                    })}
                  </div>
                  <div>
                    <p className="font-semibold">{customer.loyaltyTier} Member</p>
                    <p className="text-sm text-muted-foreground">{customer.loyaltyPoints} points</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="flex gap-2 mb-6 overflow-x-auto">
          {[
            { id: 'overview', label: 'Overview', icon: Sparkles },
            { id: 'experience', label: 'My Experience', icon: Heart },
            { id: 'loyalty', label: 'Loyalty Program', icon: Crown },
            { id: 'preferences', label: 'Preferences', icon: Users }
          ].map(({ id, label, icon: Icon }) => (
            <Button
              key={id}
              variant={activeTab === id ? 'default' : 'outline'}
              onClick={() => setActiveTab(id as any)}
              className="flex items-center gap-2 whitespace-nowrap"
            >
              <Icon className="h-4 w-4" />
              {label}
            </Button>
          ))}
        </div>

        {/* Tab Content */}
        <AnimatePresence mode="wait">
          {activeTab === 'overview' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="grid gap-6 md:grid-cols-2 lg:grid-cols-3"
            >
              {/* Next Visit Card */}
              {upcomingVisit && (
                <Card className="md:col-span-2 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950/20 dark:to-indigo-950/20 border-blue-200 dark:border-blue-800">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Calendar className="h-5 w-5 text-blue-600" />
                      Your Next Visit
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <p className="font-semibold text-lg">{upcomingVisit.service}</p>
                        <p className="text-muted-foreground">with {upcomingVisit.barber}</p>
                      </div>
                      <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                        {upcomingVisit.duration} min
                      </Badge>
                    </div>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4">
                      <div className="flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        {new Date(upcomingVisit.date).toLocaleDateString()}
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="h-4 w-4" />
                        {new Date(upcomingVisit.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </div>
                    </div>
                    <Button className="w-full bg-blue-600 hover:bg-blue-700">
                      View Details
                    </Button>
                  </CardContent>
                </Card>
              )}

              {/* Quick Actions */}
              <Card>
                <CardHeader>
                  <CardTitle>Quick Actions</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Button onClick={onBookVisit} className="w-full" size="lg">
                    <Calendar className="mr-2 h-4 w-4" />
                    Book New Visit
                  </Button>
                  <Button variant="outline" className="w-full">
                    <MessageSquare className="mr-2 h-4 w-4" />
                    Contact Barber
                  </Button>
                  <Button variant="outline" className="w-full">
                    <Gift className="mr-2 h-4 w-4" />
                    Redeem Points
                  </Button>
                </CardContent>
              </Card>

              {/* Preferred Barber */}
              {preferredBarber && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Heart className="h-5 w-5 text-red-500" />
                      Your Favorite Barber
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center gap-3 mb-3">
                      <Avatar>
                        <AvatarImage src={preferredBarber.avatar} />
                        <AvatarFallback>
                          {preferredBarber.name.split(' ').map(n => n[0]).join('')}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-semibold">{preferredBarber.name}</p>
                        <div className="flex items-center gap-1">
                          <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                          <span className="text-sm">{preferredBarber.rating}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-1 mb-3">
                      {preferredBarber.specialties.slice(0, 3).map(specialty => (
                        <Badge key={specialty} variant="secondary" className="text-xs">
                          {specialty}
                        </Badge>
                      ))}
                    </div>
                    <Badge
                      variant={preferredBarber.availability === 'available' ? 'default' : 'secondary'}
                      className={cn(
                        preferredBarber.availability === 'available'
                          ? 'bg-green-100 text-green-800'
                          : 'bg-gray-100 text-gray-800'
                      )}
                    >
                      {preferredBarber.availability === 'available' ? 'Available' : 'Busy'}
                    </Badge>
                  </CardContent>
                </Card>
              )}

              {/* Visit Stats */}
              <Card>
                <CardHeader>
                  <CardTitle>Your Stats</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Total Visits</span>
                    <span className="font-semibold">{customer.totalVisits}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Avg Rating</span>
                    <div className="flex items-center gap-1">
                      <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      <span className="font-semibold">4.8</span>
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Loyalty Points</span>
                    <span className="font-semibold text-primary">{customer.loyaltyPoints}</span>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}

          {activeTab === 'experience' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-6"
            >
              {/* Experience Preferences */}
              <Card>
                <CardHeader>
                  <CardTitle>Your Visit Preferences</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-4 md:grid-cols-3">
                    <div>
                      <label className="text-sm font-medium mb-2 block">Ambiance</label>
                      <div className="flex gap-2">
                        {['quiet', 'music', 'conversation'].map(option => (
                          <Button
                            key={option}
                            variant={experiencePrefs.ambiance === option ? 'default' : 'outline'}
                            size="sm"
                            onClick={() => onUpdatePreferences({ ambiance: option as any })}
                          >
                            {option}
                          </Button>
                        ))}
                      </div>
                    </div>

                    <div>
                      <label className="text-sm font-medium mb-2 block">Beverages</label>
                      <div className="flex flex-wrap gap-1">
                        {['Coffee', 'Tea', 'Water', 'Soda'].map(beverage => (
                          <Badge
                            key={beverage}
                            variant={experiencePrefs.beverages.includes(beverage) ? 'default' : 'outline'}
                            className="cursor-pointer"
                            onClick={() => {
                              const updated = experiencePrefs.beverages.includes(beverage)
                                ? experiencePrefs.beverages.filter(b => b !== beverage)
                                : [...experiencePrefs.beverages, beverage]
                              onUpdatePreferences({ beverages: updated })
                            }}
                          >
                            {beverage}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    <div>
                      <label className="text-sm font-medium mb-2 block">Entertainment</label>
                      <div className="flex flex-wrap gap-1">
                        {['WiFi', 'TV', 'Music', 'Magazines'].map(item => (
                          <Badge
                            key={item}
                            variant={experiencePrefs.entertainment.includes(item) ? 'default' : 'outline'}
                            className="cursor-pointer"
                            onClick={() => {
                              const updated = experiencePrefs.entertainment.includes(item)
                                ? experiencePrefs.entertainment.filter(e => e !== item)
                                : [...experiencePrefs.entertainment, item]
                              onUpdatePreferences({ entertainment: updated })
                            }}
                          >
                            {item}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Visit History */}
              <Card>
                <CardHeader>
                  <CardTitle>Visit History & Ratings</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {visitHistory.map((visit) => (
                      <div key={visit.id} className="flex items-start gap-4 p-4 border rounded-lg">
                        <Avatar className="h-10 w-10">
                          <AvatarFallback>
                            {visit.barber.split(' ').map(n => n[0]).join('')}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-2">
                            <div>
                              <p className="font-semibold">{visit.service}</p>
                              <p className="text-sm text-muted-foreground">with {visit.barber}</p>
                            </div>
                            <div className="flex items-center gap-1">
                              {[...Array(5)].map((_, i) => (
                                <Star
                                  key={i}
                                  className={cn(
                                    "h-4 w-4",
                                    i < visit.satisfaction
                                      ? "fill-yellow-400 text-yellow-400"
                                      : "text-gray-300"
                                  )}
                                />
                              ))}
                            </div>
                          </div>
                          <p className="text-sm text-muted-foreground mb-2">
                            {new Date(visit.date).toLocaleDateString()} • {visit.duration} minutes
                          </p>
                          {visit.notes && (
                            <p className="text-sm italic">"{visit.notes}"</p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}

          {activeTab === 'loyalty' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-6"
            >
              {/* Loyalty Progress */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Crown className="h-5 w-5 text-yellow-500" />
                    Loyalty Progress
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">Current Tier</span>
                      <Badge className={tierConfig[customer.loyaltyTier].color}>
                        {customer.loyaltyTier}
                      </Badge>
                    </div>
                    <Progress value={progressToNextTier} className="h-3" />
                    <div className="flex justify-between text-sm text-muted-foreground">
                      <span>{customer.loyaltyPoints} points</span>
                      <span>{nextTierPoints} points to next tier</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Tier Benefits */}
              <Card>
                <CardHeader>
                  <CardTitle>Your {customer.loyaltyTier} Benefits</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-3">
                    {tierConfig[customer.loyaltyTier].perks.map((perk, index) => (
                      <div key={index} className="flex items-center gap-3">
                        <div className="h-2 w-2 bg-primary rounded-full" />
                        <span className="text-sm">{perk}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Points History */}
              <Card>
                <CardHeader>
                  <CardTitle>Recent Points Activity</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {[
                      { action: 'Service completed', points: 50, date: '2024-01-15' },
                      { action: 'Referral bonus', points: 25, date: '2024-01-10' },
                      { action: 'Birthday bonus', points: 100, date: '2024-01-01' }
                    ].map((activity, index) => (
                      <div key={index} className="flex justify-between items-center">
                        <div>
                          <p className="text-sm font-medium">{activity.action}</p>
                          <p className="text-xs text-muted-foreground">{activity.date}</p>
                        </div>
                        <Badge variant="secondary" className="text-green-600">
                          +{activity.points}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}

          {activeTab === 'preferences' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-6"
            >
              <Card>
                <CardHeader>
                  <CardTitle>Customize Your Experience</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Ambiance Preferences */}
                  <div>
                    <h3 className="font-medium mb-3">Preferred Ambiance</h3>
                    <div className="grid grid-cols-3 gap-3">
                      {[
                        { id: 'quiet', label: 'Peaceful & Quiet', icon: '😌' },
                        { id: 'music', label: 'Background Music', icon: '🎵' },
                        { id: 'conversation', label: 'Friendly Chat', icon: '💬' }
                      ].map(({ id, label, icon }) => (
                        <button
                          key={id}
                          onClick={() => onUpdatePreferences({ ambiance: id as any })}
                          className={cn(
                            "p-4 border rounded-lg text-center transition-all",
                            experiencePrefs.ambiance === id
                              ? "border-primary bg-primary/5 text-primary"
                              : "border-border hover:border-primary/50"
                          )}
                        >
                          <div className="text-2xl mb-2">{icon}</div>
                          <div className="text-sm font-medium">{label}</div>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Service Preferences */}
                  <div>
                    <h3 className="font-medium mb-3">Preferred Services</h3>
                    <div className="flex flex-wrap gap-2">
                      {['Haircut', 'Beard Grooming', 'Shave', 'Color', 'Styling'].map(service => (
                        <Badge
                          key={service}
                          variant={customer.preferredServices.includes(service) ? 'default' : 'outline'}
                          className="cursor-pointer"
                          onClick={() => {
                            const updated = customer.preferredServices.includes(service)
                              ? customer.preferredServices.filter(s => s !== service)
                              : [...customer.preferredServices, service]
                            // This would update customer preferences
                          }}
                        >
                          {service}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  {/* Special Requests */}
                  <div>
                    <h3 className="font-medium mb-3">Special Requests or Notes</h3>
                    <textarea
                      className="w-full p-3 border rounded-lg resize-none"
                      rows={3}
                      placeholder="Any special requests, allergies, or preferences for your barber..."
                      value={experiencePrefs.specialRequests.join('\n')}
                      onChange={(e) => onUpdatePreferences({
                        specialRequests: e.target.value.split('\n').filter(Boolean)
                      })}
                    />
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}
