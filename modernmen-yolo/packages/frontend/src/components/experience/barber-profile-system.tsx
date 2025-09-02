// =============================================================================
// BARBER PROFILE SYSTEM - Showcasing barbers and their expertise
// =============================================================================

"use client"

import React, { useState } from "react"
import Image from "next/image"
import { motion, AnimatePresence } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  Star,
  Calendar,
  Clock,
  MapPin,
  Award,
  Users,
  Heart,
  MessageSquare,
  Camera,

  Trophy,
  Zap,
  Crown,
  Sparkles
} from "lucide-react"
import { cn } from "@/lib/utils"

// Enhanced barber profile types
interface BarberProfile {
  id: string
  name: string
  avatar?: string
  bio: string
  specialties: string[]
  experience: number // years
  rating: number
  reviewCount: number
  certifications: string[]
  languages: string[]
  portfolio: {
    id: string
    title: string
    image: string
    description: string
    style: string
    duration: number
  }[]
  availability: {
    status: 'available' | 'busy' | 'offline'
    nextAvailable: string
    workingHours: {
      day: string
      start: string
      end: string
      available: boolean
    }[]
  }
  stats: {
    totalClients: number
    yearsExperience: number
    averageRating: number
    specialtiesCount: number
  }
  reviews: {
    id: string
    customerName: string
    customerAvatar?: string
    rating: number
    comment: string
    date: string
    service: string
    verified: boolean
  }[]
}

interface BarberProfileCardProps {
  barber: BarberProfile
  isFavorite?: boolean
  onFavoriteToggle?: (barberId: string) => void
  onBookAppointment?: (barberId: string) => void
  onViewProfile?: (barberId: string) => void
  compact?: boolean
}

interface BarberProfileModalProps {
  barber: BarberProfile
  isOpen: boolean
  onClose: () => void
  onBookAppointment: (barberId: string) => void
  isFavorite: boolean
  onFavoriteToggle: (barberId: string) => void
}

export function BarberProfileCard({
  barber,
  isFavorite = false,
  onFavoriteToggle,
  onBookAppointment,
  onViewProfile,
  compact = false
}: BarberProfileCardProps) {
  const [imageLoaded, setImageLoaded] = useState(false)

  if (compact) {
    return (
      <Card className="hover:shadow-lg transition-shadow cursor-pointer">
        <CardContent className="p-4">
          <div className="flex items-center gap-3">
            <Avatar className="h-12 w-12 ring-2 ring-primary/20">
              <AvatarImage src={barber.avatar} />
              <AvatarFallback>
                {barber.name.split(' ').map(n => n[0]).join('')}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <h3 className="font-semibold text-sm">{barber.name}</h3>
                {isFavorite && <Heart className="h-4 w-4 text-red-500 fill-red-500" />}
              </div>
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                <span>{barber.rating}</span>
                <span>•</span>
                <span>{barber.experience}y exp</span>
              </div>
            </div>
            <Badge
              variant={barber.availability.status === 'available' ? 'default' : 'secondary'}
              className={cn(
                "text-xs",
                barber.availability.status === 'available'
                  ? 'bg-green-100 text-green-800'
                  : barber.availability.status === 'busy'
                  ? 'bg-yellow-100 text-yellow-800'
                  : 'bg-gray-100 text-gray-800'
              )}
            >
              {barber.availability.status}
            </Badge>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -5 }}
      transition={{ duration: 0.2 }}
    >
      <Card className="overflow-hidden hover:shadow-xl transition-all duration-300 group">
        <div className="relative">
          {/* Hero Image */}
          <div className="h-48 bg-gradient-to-br from-primary/20 to-secondary/20 relative overflow-hidden">
            {barber.portfolio[0] && (
              <>
                <Image
                  src={barber.portfolio[0].image}
                  alt={`${barber.name} portfolio`}
                  width={400}
                  height={200}
                  className={cn(
                    "w-full h-full object-cover transition-all duration-500",
                    imageLoaded ? "opacity-100 scale-100" : "opacity-0 scale-105"
                  )}
                  onLoad={() => setImageLoaded(true)}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
              </>
            )}

            {/* Status Badge */}
            <div className="absolute top-3 right-3">
              <Badge
                variant={barber.availability.status === 'available' ? 'default' : 'secondary'}
                className={cn(
                  barber.availability.status === 'available'
                    ? 'bg-green-500 hover:bg-green-600'
                    : barber.availability.status === 'busy'
                    ? 'bg-yellow-500 hover:bg-yellow-600'
                    : 'bg-gray-500 hover:bg-gray-600'
                )}
              >
                <div className="flex items-center gap-1">
                  <div className={cn(
                    "w-2 h-2 rounded-full",
                    barber.availability.status === 'available'
                      ? 'bg-green-200'
                      : barber.availability.status === 'busy'
                      ? 'bg-yellow-200'
                      : 'bg-gray-200'
                  )} />
                  {barber.availability.status}
                </div>
              </Badge>
            </div>

            {/* Favorite Button */}
            <button
              onClick={() => onFavoriteToggle?.(barber.id)}
              className="absolute top-3 left-3 p-2 bg-white/20 backdrop-blur-sm rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <Heart className={cn(
                "h-4 w-4",
                isFavorite ? "text-red-500 fill-red-500" : "text-white"
              )} />
            </button>
          </div>

          {/* Profile Section */}
          <CardContent className="p-6">
            <div className="flex items-start gap-4 mb-4">
              <Avatar className="h-16 w-16 ring-4 ring-primary/10">
                <AvatarImage src={barber.avatar} />
                <AvatarFallback className="text-lg font-semibold">
                  {barber.name.split(' ').map(n => n[0]).join('')}
                </AvatarFallback>
              </Avatar>

              <div className="flex-1">
                <h3 className="text-xl font-bold mb-1">{barber.name}</h3>
                <p className="text-muted-foreground text-sm mb-2 line-clamp-2">
                  {barber.bio}
                </p>

                <div className="flex items-center gap-4 text-sm">
                  <div className="flex items-center gap-1">
                    <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    <span className="font-semibold">{barber.rating}</span>
                    <span className="text-muted-foreground">({barber.reviewCount})</span>
                  </div>

                  <div className="flex items-center gap-1">
                    <Award className="h-4 w-4 text-primary" />
                    <span>{barber.experience} years</span>
                  </div>

                  <div className="flex items-center gap-1">
                    <Users className="h-4 w-4 text-primary" />
                    <span>{barber.stats.totalClients}+ clients</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Specialties */}
            <div className="mb-4">
              <h4 className="font-semibold text-sm mb-2">Specialties</h4>
              <div className="flex flex-wrap gap-2">
                {barber.specialties.slice(0, 4).map(specialty => (
                  <Badge key={specialty} variant="secondary" className="text-xs">
                    {specialty}
                  </Badge>
                ))}
                {barber.specialties.length > 4 && (
                  <Badge variant="outline" className="text-xs">
                    +{barber.specialties.length - 4} more
                  </Badge>
                )}
              </div>
            </div>

            {/* Certifications */}
            {barber.certifications.length > 0 && (
              <div className="mb-4">
                <h4 className="font-semibold text-sm mb-2">Certifications</h4>
                <div className="flex flex-wrap gap-2">
                  {barber.certifications.slice(0, 3).map(cert => (
                    <Badge key={cert} variant="outline" className="text-xs bg-primary/5">
                      <Crown className="h-3 w-3 mr-1" />
                      {cert}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex gap-2">
              <Button
                onClick={() => onBookAppointment?.(barber.id)}
                className="flex-1"
                disabled={barber.availability.status !== 'available'}
              >
                <Calendar className="mr-2 h-4 w-4" />
                Book Now
              </Button>
              <Button
                variant="outline"
                onClick={() => onViewProfile?.(barber.id)}
              >
                <Users className="mr-2 h-4 w-4" />
                View Profile
              </Button>
            </div>
          </CardContent>
        </div>
      </Card>
    </motion.div>
  )
}

export function BarberProfileModal({
  barber,
  isOpen,
  onClose,
  onBookAppointment,
  isFavorite,
  onFavoriteToggle
}: BarberProfileModalProps) {
  const [activeTab, setActiveTab] = useState('overview')

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3">
            <Avatar className="h-12 w-12">
              <AvatarImage src={barber.avatar} />
              <AvatarFallback>
                {barber.name.split(' ').map(n => n[0]).join('')}
              </AvatarFallback>
            </Avatar>
            <div>
              <div className="flex items-center gap-2">
                <span>{barber.name}</span>
                <button
                  onClick={() => onFavoriteToggle(barber.id)}
                  className="text-red-500 hover:text-red-600"
                >
                  <Heart className={cn(
                    "h-5 w-5",
                    isFavorite ? "fill-current" : ""
                  )} />
                </button>
              </div>
              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <div className="flex items-center gap-1">
                  <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                  <span>{barber.rating} ({barber.reviewCount} reviews)</span>
                </div>
                <span>•</span>
                <span>{barber.experience} years experience</span>
              </div>
            </div>
          </DialogTitle>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="portfolio">Portfolio</TabsTrigger>
            <TabsTrigger value="reviews">Reviews</TabsTrigger>
            <TabsTrigger value="schedule">Schedule</TabsTrigger>
          </TabsList>

          <ScrollArea className="flex-1 mt-4">
            <TabsContent value="overview" className="space-y-6">
              {/* Bio and Specialties */}
              <div className="grid md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>About {barber.name.split(' ')[0]}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground mb-4">{barber.bio}</p>

                    <div className="space-y-3">
                      <div>
                        <h4 className="font-semibold text-sm mb-2">Specialties</h4>
                        <div className="flex flex-wrap gap-2">
                          {barber.specialties.map(specialty => (
                            <Badge key={specialty} variant="secondary">
                              <div className="w-3 h-3 bg-red-600 rounded-full flex items-center justify-center mr-1">
                                <span className="text-white text-xs font-bold">M</span>
                              </div>
                              {specialty}
                            </Badge>
                          ))}
                        </div>
                      </div>

                      {barber.languages.length > 0 && (
                        <div>
                          <h4 className="font-semibold text-sm mb-2">Languages</h4>
                          <div className="flex flex-wrap gap-2">
                            {barber.languages.map(language => (
                              <Badge key={language} variant="outline">
                                {language}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Stats & Achievements</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="text-center p-4 bg-primary/5 rounded-lg">
                        <Users className="h-8 w-8 mx-auto mb-2 text-primary" />
                        <div className="text-2xl font-bold">{barber.stats.totalClients}</div>
                        <div className="text-sm text-muted-foreground">Happy Clients</div>
                      </div>

                      <div className="text-center p-4 bg-secondary/5 rounded-lg">
                        <Award className="h-8 w-8 mx-auto mb-2 text-secondary" />
                        <div className="text-2xl font-bold">{barber.experience}</div>
                        <div className="text-sm text-muted-foreground">Years Experience</div>
                      </div>

                      <div className="text-center p-4 bg-green-50 rounded-lg">
                        <Star className="h-8 w-8 mx-auto mb-2 text-green-600" />
                        <div className="text-2xl font-bold">{barber.rating}</div>
                        <div className="text-sm text-muted-foreground">Average Rating</div>
                      </div>

                      <div className="text-center p-4 bg-purple-50 rounded-lg">
                        <Trophy className="h-8 w-8 mx-auto mb-2 text-purple-600" />
                        <div className="text-2xl font-bold">{barber.certifications.length}</div>
                        <div className="text-sm text-muted-foreground">Certifications</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Certifications */}
              {barber.certifications.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle>Certifications & Awards</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {barber.certifications.map((cert, index) => (
                        <div key={index} className="flex items-center gap-3 p-3 border rounded-lg">
                          <Crown className="h-8 w-8 text-yellow-500" />
                          <div>
                            <div className="font-semibold">{cert}</div>
                            <div className="text-sm text-muted-foreground">Certified Professional</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}
            </TabsContent>

            <TabsContent value="portfolio" className="space-y-6">
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {barber.portfolio.map((item) => (
                  <Card key={item.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                    <div className="aspect-square overflow-hidden">
                      <Image
                        src={item.image}
                        alt={item.title}
                        width={300}
                        height={300}
                        className="w-full h-full object-cover hover:scale-105 transition-transform"
                      />
                    </div>
                    <CardContent className="p-4">
                      <h3 className="font-semibold mb-1">{item.title}</h3>
                      <p className="text-sm text-muted-foreground mb-2">{item.description}</p>
                      <div className="flex justify-between items-center text-xs text-muted-foreground">
                        <span>{item.style}</span>
                        <span>{item.duration} min</span>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="reviews" className="space-y-6">
              <div className="space-y-4">
                {barber.reviews.map((review) => (
                  <Card key={review.id}>
                    <CardContent className="p-4">
                      <div className="flex items-start gap-3 mb-3">
                        <Avatar className="h-10 w-10">
                          <AvatarImage src={review.customerAvatar} />
                          <AvatarFallback>
                            {review.customerName.split(' ').map(n => n[0]).join('')}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-1">
                            <div className="flex items-center gap-2">
                              <span className="font-semibold">{review.customerName}</span>
                              {review.verified && (
                                <Badge variant="secondary" className="text-xs">
                                  Verified
                                </Badge>
                              )}
                            </div>
                            <div className="flex items-center gap-1">
                              {[...Array(5)].map((_, i) => (
                                <Star
                                  key={i}
                                  className={cn(
                                    "h-4 w-4",
                                    i < review.rating
                                      ? "fill-yellow-400 text-yellow-400"
                                      : "text-gray-300"
                                  )}
                                />
                              ))}
                            </div>
                          </div>
                          <p className="text-sm text-muted-foreground mb-2">
                            {review.service} • {new Date(review.date).toLocaleDateString()}
                          </p>
                          <p className="text-sm">{review.comment}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="schedule" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Working Hours</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {barber.availability.workingHours.map((schedule) => (
                      <div key={schedule.day} className="flex justify-between items-center">
                        <span className="font-medium">{schedule.day}</span>
                        <div className="flex items-center gap-2">
                          {schedule.available ? (
                            <>
                              <Clock className="h-4 w-4 text-green-600" />
                              <span className="text-sm">
                                {schedule.start} - {schedule.end}
                              </span>
                            </>
                          ) : (
                            <Badge variant="secondary">Unavailable</Badge>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Availability Status</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-3 mb-4">
                    <div className={cn(
                      "w-3 h-3 rounded-full",
                      barber.availability.status === 'available'
                        ? 'bg-green-500'
                        : barber.availability.status === 'busy'
                        ? 'bg-yellow-500'
                        : 'bg-gray-500'
                    )} />
                    <span className="capitalize font-medium">
                      {barber.availability.status}
                    </span>
                  </div>

                  {barber.availability.nextAvailable && (
                    <p className="text-sm text-muted-foreground">
                      Next available: {barber.availability.nextAvailable}
                    </p>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </ScrollArea>

          {/* Action Buttons */}
          <div className="flex gap-3 mt-6 pt-4 border-t">
            <Button
              onClick={() => onBookAppointment(barber.id)}
              className="flex-1"
              disabled={barber.availability.status !== 'available'}
            >
              <Calendar className="mr-2 h-4 w-4" />
              Book Appointment
            </Button>
            <Button variant="outline" onClick={onClose}>
              Close
            </Button>
          </div>
        </Tabs>
      </DialogContent>
    </Dialog>
  )
}

// Export types for use in other components
export type { BarberProfile, BarberProfileCardProps, BarberProfileModalProps }
