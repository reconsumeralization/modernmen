// =============================================================================
// BARBER EXPERIENCE ORCHESTRATOR - Complete visit experience management
// =============================================================================

// Utility function to map service names to categories
function getServiceCategory(serviceName: string): string {
  const categoryMap: Record<string, string> = {
    'Classic Haircut': 'haircuts',
    'Beard Trim': 'beard-grooming',
    'Haircut & Beard Combo': 'packages',
    'Hair Color': 'hair-color',
    'Facial Treatment': 'facial-treatments'
  }

  return categoryMap[serviceName] || 'haircuts' // Default fallback
}

"use client"

import React, { useState, useEffect, createContext, useContext } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  CheckCircle,
  Clock,
  User,

  Coffee,
  Wifi,
  Music,
  MessageSquare,
  Star,
  Zap,
  Heart,
  Camera,
  Phone,
  MapPin,
  Bell,
  Gift,
  Trophy,
  Sparkles,
  Crown,
  Timer,
  Users,
  Award,
  ChevronRight,
  Play,
  Pause,
  SkipForward
} from "lucide-react"
import { cn } from "@/lib/utils"
import { PreparationChecklist } from "./preparation-checklist"

// =============================================================================
// TYPES & INTERFACES
// =============================================================================

interface VisitStage {
  id: string
  name: string
  description: string
  estimatedDuration: number
  icon: React.ComponentType<any>
  color: string
  actions: VisitAction[]
}

interface VisitAction {
  id: string
  type: 'notification' | 'input' | 'confirmation' | 'rating' | 'media'
  title: string
  description: string
  required: boolean
  completed: boolean
  data?: any
}

interface BarberExperience {
  customerId: string
  customerName: string
  customerAvatar?: string
  barberId: string
  barberName: string
  barberAvatar?: string
  serviceId: string
  serviceName: string
  appointmentId: string

  // Visit Progress
  currentStage: VisitStage
  visitStartTime: Date
  estimatedCompletionTime: Date
  progressPercentage: number

  // Customer Preferences
  preferences: {
    ambiance: string
    beverages: string[]
    entertainment: string[]
    specialRequests: string[]
  }

  // Real-time Status
  status: 'waiting' | 'checked_in' | 'in_service' | 'completed' | 'cancelled'
  statusMessage: string
  lastUpdate: Date

  // Communication
  messages: {
    id: string
    from: 'customer' | 'barber' | 'system'
    message: string
    timestamp: Date
    read: boolean
  }[]

  // Media & Documentation
  photos: {
    id: string
    type: 'before' | 'during' | 'after'
    url: string
    timestamp: Date
    description?: string
  }[]

  // Service Details
  serviceNotes: string
  productRecommendations: string[]
  nextAppointmentSuggestion?: Date

  // Ratings & Feedback
  customerRating?: number
  barberNotes: string
  customerFeedback?: string
}

// =============================================================================
// VISIT STAGES CONFIGURATION
// =============================================================================

const visitStages: VisitStage[] = [
  {
    id: 'arrival',
    name: 'Welcome & Check-in',
    description: 'Customer arrives and gets settled',
    estimatedDuration: 10,
    icon: User,
    color: 'bg-blue-500',
    actions: [
      {
        id: 'check_in',
        type: 'confirmation',
        title: 'Confirm Check-in',
        description: 'Verify customer identity and service details',
        required: true,
        completed: false
      },
      {
        id: 'preferences',
        type: 'input',
        title: 'Review Preferences',
        description: 'Confirm ambiance and special requests',
        required: false,
        completed: false
      }
    ]
  },
  {
    id: 'preparation',
    name: 'Preparation & Consultation',
    description: 'Discuss service details, prepare workspace, and follow preparation procedures',
    estimatedDuration: 15,
    icon: MessageSquare,
    color: 'bg-purple-500',
    actions: [
      {
        id: 'consultation',
        type: 'input',
        title: 'Style Consultation',
        description: 'Discuss desired style and preferences with customer',
        required: true,
        completed: false
      },
      {
        id: 'preparation_checklist',
        type: 'confirmation',
        title: 'Preparation Checklist',
        description: 'Complete all required preparation procedures for this service',
        required: true,
        completed: false
      },
      {
        id: 'workspace_setup',
        type: 'confirmation',
        title: 'Workspace Setup',
        description: 'Prepare tools and supplies needed for the service',
        required: true,
        completed: false
      },
      {
        id: 'before_photo',
        type: 'media',
        title: 'Before Photo',
        description: 'Take photo of current style for reference',
        required: false,
        completed: false
      },
      {
        id: 'customer_preparation',
        type: 'confirmation',
        title: 'Customer Preparation',
        description: 'Ensure customer is ready and comfortable',
        required: true,
        completed: false
      }
    ]
  },
  {
    id: 'service',
    name: 'Service in Progress',
    description: 'Main service delivery',
    estimatedDuration: 45,
    icon: () => (
      <div className="w-5 h-5 bg-red-600 rounded-full flex items-center justify-center">
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
        completed: false
      },
      {
        id: 'progress_updates',
        type: 'notification',
        title: 'Progress Updates',
        description: 'Send periodic updates to customer',
        required: false,
        completed: false
      },
      {
        id: 'during_photos',
        type: 'media',
        title: 'During Photos',
        description: 'Document service progress',
        required: false,
        completed: false
      }
    ]
  },
  {
    id: 'finishing',
    name: 'Finishing Touches',
    description: 'Final styling and cleanup',
    estimatedDuration: 10,
    icon: Sparkles,
    color: 'bg-green-500',
    actions: [
      {
        id: 'styling_complete',
        type: 'confirmation',
        title: 'Styling Complete',
        description: 'Confirm service completion',
        required: true,
        completed: false
      },
      {
        id: 'after_photo',
        type: 'media',
        title: 'After Photo',
        description: 'Take completion photo',
        required: false,
        completed: false
      }
    ]
  },
  {
    id: 'checkout',
    name: 'Checkout & Feedback',
    description: 'Final review and payment',
    estimatedDuration: 15,
    icon: CheckCircle,
    color: 'bg-emerald-500',
    actions: [
      {
        id: 'service_review',
        type: 'rating',
        title: 'Service Rating',
        description: 'Customer rates the service',
        required: true,
        completed: false
      },
      {
        id: 'payment',
        type: 'confirmation',
        title: 'Payment Processing',
        description: 'Process payment and finalize visit',
        required: true,
        completed: false
      },
      {
        id: 'next_appointment',
        type: 'input',
        title: 'Schedule Next Visit',
        description: 'Book next appointment if desired',
        required: false,
        completed: false
      }
    ]
  }
]

// =============================================================================
// BARBER DASHBOARD COMPONENT
// =============================================================================

interface BarberDashboardProps {
  barberId: string
  barberName: string
  barberAvatar?: string
  currentVisits: BarberExperience[]
  todaysSchedule: BarberExperience[]
  onUpdateVisitStatus: (visitId: string, updates: Partial<BarberExperience>) => void
  onSendMessage: (visitId: string, message: string) => void
  onCompleteStage: (visitId: string, stageId: string, actionId: string) => void
}

export function BarberDashboard({
  barberId,
  barberName,
  barberAvatar,
  currentVisits,
  todaysSchedule,
  onUpdateVisitStatus,
  onSendMessage,
  onCompleteStage
}: BarberDashboardProps) {
  const [activeTab, setActiveTab] = useState<'current' | 'schedule' | 'completed'>('current')
  const [selectedVisit, setSelectedVisit] = useState<string | null>(null)

  const activeVisits = currentVisits.filter(v => v.status !== 'completed')
  const completedVisits = currentVisits.filter(v => v.status === 'completed')

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
      {/* Header */}
      <div className="bg-white dark:bg-slate-800 border-b">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Avatar className="h-16 w-16 ring-4 ring-primary/20">
                <AvatarImage src={barberAvatar} />
                <AvatarFallback className="text-lg font-semibold">
                  {barberName.split(' ').map(n => n[0]).join('')}
                </AvatarFallback>
              </Avatar>
              <div>
                <h1 className="text-2xl font-bold">Welcome back, {barberName}!</h1>
                <p className="text-muted-foreground">
                  {activeVisits.length} active clients • {completedVisits.length} completed today
                </p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <Badge variant="secondary" className="px-3 py-1">
                <Clock className="h-4 w-4 mr-1" />
                {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </Badge>
              <Badge variant="outline" className="px-3 py-1">
                <Users className="h-4 w-4 mr-1" />
                {activeVisits.length} Active
              </Badge>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-6">
        <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as any)}>
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="current" className="flex items-center gap-2">
              <Zap className="h-4 w-4" />
              Current Clients ({activeVisits.length})
            </TabsTrigger>
            <TabsTrigger value="schedule" className="flex items-center gap-2">
              <Clock className="h-4 w-4" />
              Today's Schedule ({todaysSchedule.length})
            </TabsTrigger>
            <TabsTrigger value="completed" className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4" />
              Completed ({completedVisits.length})
            </TabsTrigger>
          </TabsList>

          {/* Current Clients Tab */}
          <TabsContent value="current" className="space-y-6">
            {activeVisits.length === 0 ? (
              <Card>
                <CardContent className="p-8 text-center">
                  <Users className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
                  <h3 className="text-lg font-semibold mb-2">No Active Clients</h3>
                  <p className="text-muted-foreground">
                    Your next client will appear here when they check in.
                  </p>
                </CardContent>
              </Card>
            ) : (
              <div className="grid gap-6">
                {activeVisits.map((visit) => (
                  <VisitCard
                    key={visit.appointmentId}
                    visit={visit}
                    onUpdateStatus={onUpdateVisitStatus}
                    onSendMessage={onSendMessage}
                    onCompleteStage={onCompleteStage}
                    isExpanded={selectedVisit === visit.appointmentId}
                    onToggle={() => setSelectedVisit(
                      selectedVisit === visit.appointmentId ? null : visit.appointmentId
                    )}
                  />
                ))}
              </div>
            )}
          </TabsContent>

          {/* Schedule Tab */}
          <TabsContent value="schedule" className="space-y-6">
            <div className="grid gap-4">
              {todaysSchedule.map((visit) => (
                <Card key={visit.appointmentId} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Avatar className="h-10 w-10">
                          <AvatarImage src={visit.customerAvatar} />
                          <AvatarFallback>
                            {visit.customerName.split(' ').map(n => n[0]).join('')}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-semibold">{visit.customerName}</p>
                          <p className="text-sm text-muted-foreground">{visit.serviceName}</p>
                        </div>
                      </div>

                      <div className="text-right">
                        <p className="font-semibold">
                          {new Date(visit.visitStartTime).toLocaleTimeString([], {
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </p>
                        <Badge
                          variant={visit.status === 'confirmed' ? 'default' : 'secondary'}
                          className="text-xs"
                        >
                          {visit.status}
                        </Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Completed Tab */}
          <TabsContent value="completed" className="space-y-6">
            <div className="grid gap-4">
              {completedVisits.map((visit) => (
                <Card key={visit.appointmentId} className="bg-green-50/50 border-green-200">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Avatar className="h-10 w-10">
                          <AvatarImage src={visit.customerAvatar} />
                          <AvatarFallback>
                            {visit.customerName.split(' ').map(n => n[0]).join('')}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-semibold">{visit.customerName}</p>
                          <p className="text-sm text-muted-foreground">{visit.serviceName}</p>
                        </div>
                      </div>

                      <div className="text-right">
                        <div className="flex items-center gap-2">
                          {visit.customerRating && (
                            <div className="flex items-center gap-1">
                              <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                              <span className="text-sm font-medium">{visit.customerRating}</span>
                            </div>
                          )}
                          <Badge variant="secondary" className="bg-green-100 text-green-800">
                            Completed
                          </Badge>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}

// =============================================================================
// VISIT CARD COMPONENT
// =============================================================================

interface VisitCardProps {
  visit: BarberExperience
  onUpdateStatus: (visitId: string, updates: Partial<BarberExperience>) => void
  onSendMessage: (visitId: string, message: string) => void
  onCompleteStage: (visitId: string, stageId: string, actionId: string) => void
  isExpanded: boolean
  onToggle: () => void
}

function VisitCard({
  visit,
  onUpdateStatus,
  onSendMessage,
  onCompleteStage,
  isExpanded,
  onToggle
}: VisitCardProps) {
  const [message, setMessage] = useState('')

  const currentStageIndex = visitStages.findIndex(s => s.id === visit.currentStage.id)
  const progressPercentage = ((currentStageIndex + 1) / visitStages.length) * 100

  const handleSendMessage = () => {
    if (message.trim()) {
      onSendMessage(visit.appointmentId, message)
      setMessage('')
    }
  }

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
    >
      <Card className="overflow-hidden">
        {/* Header */}
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Avatar className="h-12 w-12 ring-2 ring-primary/20">
                <AvatarImage src={visit.customerAvatar} />
                <AvatarFallback>
                  {visit.customerName.split(' ').map(n => n[0]).join('')}
                </AvatarFallback>
              </Avatar>
              <div>
                <h3 className="font-semibold text-lg">{visit.customerName}</h3>
                <p className="text-sm text-muted-foreground">{visit.serviceName}</p>
              </div>
            </div>

            <div className="text-right">
              <Badge className={visit.currentStage.color}>
                {visit.currentStage.name}
              </Badge>
              <p className="text-sm text-muted-foreground mt-1">
                Est. completion: {visit.estimatedCompletionTime.toLocaleTimeString([], {
                  hour: '2-digit',
                  minute: '2-digit'
                })}
              </p>
            </div>
          </div>
        </CardHeader>

        {/* Progress */}
        <CardContent className="pb-3">
          <div className="space-y-2 mb-4">
            <div className="flex justify-between text-sm">
              <span>Visit Progress</span>
              <span>{Math.round(progressPercentage)}%</span>
            </div>
            <Progress value={progressPercentage} className="h-2" />
          </div>

          {/* Current Stage Actions */}
          <div className="space-y-3">
            <h4 className="font-medium text-sm">Current Stage: {visit.currentStage.name}</h4>
            <div className="grid gap-2">
              {visit.currentStage.actions.map((action) => (
                <div
                  key={action.id}
                  className={cn(
                    "flex items-center justify-between p-3 rounded-lg border",
                    action.completed
                      ? "bg-green-50 border-green-200"
                      : "bg-muted/50 border-border"
                  )}
                >
                  <div>
                    <p className="font-medium text-sm">{action.title}</p>
                    <p className="text-xs text-muted-foreground">{action.description}</p>
                  </div>

                  {action.completed ? (
                    <CheckCircle className="h-5 w-5 text-green-600" />
                  ) : (
                    <Button
                      size="sm"
                      onClick={() => onCompleteStage(visit.appointmentId, visit.currentStage.id, action.id)}
                    >
                      Complete
                    </Button>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Quick Actions */}
          <div className="flex gap-2 mt-4">
            <Button
              variant="outline"
              size="sm"
              onClick={onToggle}
              className="flex-1"
            >
              {isExpanded ? 'Collapse' : 'View Details'}
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => onSendMessage(visit.appointmentId, 'How is everything going?')}
            >
              <MessageSquare className="h-4 w-4" />
            </Button>
          </div>
        </CardContent>

        {/* Expanded Details */}
        <AnimatePresence>
          {isExpanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="border-t"
            >
              <CardContent className="pt-4">
                <Tabs
                  defaultValue={visit.currentStage.id === 'preparation' ? 'preparation' : 'communication'}
                  className="w-full"
                >
                  <TabsList className={cn(
                    "grid w-full",
                    visit.currentStage.id === 'preparation' ? "grid-cols-4" : "grid-cols-3"
                  )}>
                    {visit.currentStage.id === 'preparation' && (
                      <TabsTrigger value="preparation">Preparation</TabsTrigger>
                    )}
                    <TabsTrigger value="communication">Communication</TabsTrigger>
                    <TabsTrigger value="preferences">Preferences</TabsTrigger>
                    <TabsTrigger value="media">Media</TabsTrigger>
                  </TabsList>

                  {/* Communication Tab */}
                  <TabsContent value="communication" className="space-y-4">
                    <ScrollArea className="h-48">
                      <div className="space-y-3">
                        {visit.messages.map((msg) => (
                          <div
                            key={msg.id}
                            className={cn(
                              "flex gap-3 p-3 rounded-lg",
                              msg.from === 'barber'
                                ? "bg-blue-50 ml-8"
                                : msg.from === 'customer'
                                ? "bg-green-50 mr-8"
                                : "bg-gray-50"
                            )}
                          >
                            <Avatar className="h-8 w-8">
                              <AvatarFallback className="text-xs">
                                {msg.from === 'barber' ? 'B' : msg.from === 'customer' ? 'C' : 'S'}
                              </AvatarFallback>
                            </Avatar>
                            <div className="flex-1">
                              <p className="text-sm">{msg.message}</p>
                              <p className="text-xs text-muted-foreground">
                                {new Date(msg.timestamp).toLocaleTimeString()}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </ScrollArea>

                    <div className="flex gap-2">
                      <input
                        type="text"
                        placeholder="Type a message..."
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                        className="flex-1 px-3 py-2 border rounded-lg text-sm"
                      />
                      <Button onClick={handleSendMessage} size="sm">
                        Send
                      </Button>
                    </div>
                  </TabsContent>

                  {/* Preferences Tab */}
                  <TabsContent value="preferences" className="space-y-4">
                    <div className="space-y-3">
                      <div>
                        <h4 className="font-medium text-sm mb-2">Ambiance Preference</h4>
                        <p className="text-sm text-muted-foreground capitalize">
                          {visit.preferences.ambiance}
                        </p>
                      </div>

                      {visit.preferences.beverages.length > 0 && (
                        <div>
                          <h4 className="font-medium text-sm mb-2">Beverage Preferences</h4>
                          <div className="flex flex-wrap gap-1">
                            {visit.preferences.beverages.map((beverage) => (
                              <Badge key={beverage} variant="secondary" className="text-xs">
                                {beverage}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      )}

                      {visit.preferences.specialRequests.length > 0 && (
                        <div>
                          <h4 className="font-medium text-sm mb-2">Special Requests</h4>
                          <ul className="text-sm text-muted-foreground space-y-1">
                            {visit.preferences.specialRequests.map((request, index) => (
                              <li key={index} className="flex items-center gap-2">
                                <span className="w-1 h-1 bg-primary rounded-full" />
                                {request}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  </TabsContent>

                  {/* Preparation Tab */}
                  {visit.currentStage.id === 'preparation' && (
                    <TabsContent value="preparation" className="space-y-4">
                      <PreparationChecklist
                        serviceCategory={getServiceCategory(visit.serviceName)}
                        serviceName={visit.serviceName}
                        customerName={visit.customerName}
                        onChecklistComplete={(completedItems) => {
                          // Update the preparation checklist completion status
                          console.log('Completed preparation items:', completedItems)
                        }}
                        onPhotoCapture={() => {
                          // Handle photo capture for before photo
                          console.log('Capture before photo')
                        }}
                      />
                    </TabsContent>
                  )}

                  {/* Media Tab */}
                  <TabsContent value="media" className="space-y-4">
                    <div className="grid grid-cols-3 gap-4">
                      {visit.photos.map((photo) => (
                        <div key={photo.id} className="space-y-2">
                          <img
                            src={photo.url}
                            alt={photo.description || `${photo.type} photo`}
                            className="w-full h-24 object-cover rounded-lg"
                          />
                          <p className="text-xs text-muted-foreground capitalize">
                            {photo.type}
                          </p>
                        </div>
                      ))}
                    </div>

                    {visit.photos.length === 0 && (
                      <div className="text-center py-8 text-muted-foreground">
                        <Camera className="h-12 w-12 mx-auto mb-4 opacity-50" />
                        <p>No photos yet</p>
                      </div>
                    )}
                  </TabsContent>
                </Tabs>
              </CardContent>
            </motion.div>
          )}
        </AnimatePresence>
      </Card>
    </motion.div>
  )
}

// =============================================================================
// CUSTOMER VISIT EXPERIENCE COMPONENT
// =============================================================================

interface CustomerVisitExperienceProps {
  visit: BarberExperience
  onSendMessage: (message: string) => void
  onRateService: (rating: number, feedback: string) => void
  onRequestBreak: () => void
}

export function CustomerVisitExperience({
  visit,
  onSendMessage,
  onRateService,
  onRequestBreak
}: CustomerVisitExperienceProps) {
  const [message, setMessage] = useState('')
  const [showRating, setShowRating] = useState(false)

  const currentStageIndex = visitStages.findIndex(s => s.id === visit.currentStage.id)
  const progressPercentage = ((currentStageIndex + 1) / visitStages.length) * 100

  const handleSendMessage = () => {
    if (message.trim()) {
      onSendMessage(message)
      setMessage('')
    }
  }

  return (
    <div className="max-w-md mx-auto bg-white rounded-lg shadow-lg overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-primary to-secondary p-6 text-white">
        <div className="flex items-center gap-3 mb-4">
          <Avatar className="h-12 w-12 ring-2 ring-white/20">
            <AvatarImage src={visit.barberAvatar} />
            <AvatarFallback>
              {visit.barberName.split(' ').map(n => n[0]).join('')}
            </AvatarFallback>
          </Avatar>
          <div>
            <h2 className="font-semibold text-lg">Your Visit</h2>
            <p className="text-white/80">with {visit.barberName}</p>
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>Progress</span>
            <span>{Math.round(progressPercentage)}%</span>
          </div>
          <Progress value={progressPercentage} className="h-2 bg-white/20" />
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        {/* Current Stage */}
        <div className="mb-6">
          <div className="flex items-center gap-3 mb-3">
            <div className={cn("p-2 rounded-full", visit.currentStage.color)}>
              <visit.currentStage.icon className="h-5 w-5 text-white" />
            </div>
            <div>
              <h3 className="font-semibold">{visit.currentStage.name}</h3>
              <p className="text-sm text-muted-foreground">{visit.statusMessage}</p>
            </div>
          </div>

          {visit.estimatedCompletionTime && (
            <p className="text-sm text-muted-foreground">
              Estimated completion: {visit.estimatedCompletionTime.toLocaleTimeString([], {
                hour: '2-digit',
                minute: '2-digit'
              })}
            </p>
          )}
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-2 gap-3 mb-6">
          <Button
            variant="outline"
            onClick={onRequestBreak}
            disabled={visit.status !== 'in_progress'}
          >
            <Coffee className="h-4 w-4 mr-2" />
            Request Break
          </Button>
          <Button
            variant="outline"
            onClick={() => setShowRating(!showRating)}
            disabled={visit.status !== 'completed'}
          >
            <Star className="h-4 w-4 mr-2" />
            Rate Service
          </Button>
        </div>

        {/* Rating Section */}
        <AnimatePresence>
          {showRating && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="mb-6 p-4 border rounded-lg"
            >
              <h4 className="font-medium mb-3">Rate Your Experience</h4>
              <div className="space-y-3">
                <div className="flex gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      onClick={() => onRateService(star, '')}
                      className="text-2xl hover:scale-110 transition-transform"
                    >
                      ⭐
                    </button>
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Communication */}
        <div className="space-y-3">
          <h4 className="font-medium">Communication</h4>

          <ScrollArea className="h-32">
            <div className="space-y-2">
              {visit.messages.slice(-5).map((msg) => (
                <div
                  key={msg.id}
                  className={cn(
                    "p-3 rounded-lg text-sm",
                    msg.from === 'barber'
                      ? "bg-blue-50 text-blue-800"
                      : msg.from === 'system'
                      ? "bg-gray-50 text-gray-800"
                      : "bg-green-50 text-green-800 ml-8"
                  )}
                >
                  <p>{msg.message}</p>
                  <p className="text-xs opacity-70 mt-1">
                    {new Date(msg.timestamp).toLocaleTimeString([], {
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </p>
                </div>
              ))}
            </div>
          </ScrollArea>

          <div className="flex gap-2">
            <input
              type="text"
              placeholder="Send a message..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
              className="flex-1 px-3 py-2 border rounded-lg text-sm"
            />
            <Button onClick={handleSendMessage} size="sm">
              <MessageSquare className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

// Export types and components
export type { BarberExperience, VisitStage, VisitAction, BarberDashboardProps, CustomerVisitExperienceProps }
