// =============================================================================
// CUSTOMER FEEDBACK SYSTEM - Comprehensive feedback collection and ratings
// =============================================================================

"use client"

import React, { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Textarea } from "@/components/ui/textarea"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  Star,
  ThumbsUp,
  ThumbsDown,
  MessageSquare,
  Send,
  Heart,
  Zap,
  Clock,
  CheckCircle,
  AlertCircle,
  Award,
  Gift,
  TrendingUp,
  Users,
  Calendar,

  Coffee
} from "lucide-react"
import { cn } from "@/lib/utils"

// Enhanced feedback types
interface FeedbackRating {
  overall: number // 1-5 stars
  barber: number // 1-5 stars
  ambiance: number // 1-5 stars
  value: number // 1-5 stars
  waitTime: number // 1-5 stars
}

interface FeedbackResponse {
  appointmentId: string
  customerId: string
  customerName: string
  customerAvatar?: string
  ratings: FeedbackRating
  comments: {
    overall: string
    positive: string
    improvements: string
    barber: string
  }
  recommendations: {
    wouldRecommend: boolean
    wouldReturn: boolean
    favoriteAspects: string[]
    improvementAreas: string[]
  }
  metadata: {
    timestamp: Date
    platform: 'web' | 'mobile' | 'kiosk'
    completionTime: number // seconds
    isVerified: boolean
  }
  followUp: {
    contactForFollowUp: boolean
    preferredContactMethod: 'email' | 'sms' | 'none'
    additionalComments: string
  }
}

interface CustomerFeedbackFormProps {
  appointmentId: string
  customerId: string
  customerName: string
  customerAvatar?: string
  barberName: string
  serviceName: string
  onSubmit: (feedback: FeedbackResponse) => void
  onSkip?: () => void
  className?: string
}

const ratingLabels = {
  1: 'Poor',
  2: 'Fair',
  3: 'Good',
  4: 'Very Good',
  5: 'Excellent'
}

const aspectIcons = {
  overall: Star,
  barber: Users,
  ambiance: Heart,
  value: Award,
  waitTime: Clock
}

const aspectLabels = {
  overall: 'Overall Experience',
  barber: 'Barber Performance',
  ambiance: 'Salon Ambiance',
  value: 'Value for Money',
  waitTime: 'Wait Time'
}

const favoriteAspects = [
  'Barber skill & technique',
  'Friendly & professional staff',
  'Clean & comfortable environment',
  'Relaxing atmosphere',
  'Quality products used',
  'Attention to detail',
  'Time management',
  'Personalized service',
  'Modern equipment',
  'Convenient location'
]

const improvementAreas = [
  'Longer wait times',
  'Limited parking',
  'Product selection',
  'Appointment scheduling',
  'Price transparency',
  'WiFi connectivity',
  'Beverage options',
  'Entertainment options',
  'Staff availability',
  'Service duration'
]

export function CustomerFeedbackForm({
  appointmentId,
  customerId,
  customerName,
  customerAvatar,
  barberName,
  serviceName,
  onSubmit,
  onSkip,
  className
}: CustomerFeedbackFormProps) {
  const [currentStep, setCurrentStep] = useState(1)
  const [startTime] = useState(Date.now())

  const [ratings, setRatings] = useState<FeedbackRating>({
    overall: 0,
    barber: 0,
    ambiance: 0,
    value: 0,
    waitTime: 0
  })

  const [comments, setComments] = useState({
    overall: '',
    positive: '',
    improvements: '',
    barber: ''
  })

  const [recommendations, setRecommendations] = useState({
    wouldRecommend: null as boolean | null,
    wouldReturn: null as boolean | null,
    favoriteAspects: [] as string[],
    improvementAreas: [] as string[]
  })

  const [followUp, setFollowUp] = useState({
    contactForFollowUp: false,
    preferredContactMethod: 'email' as 'email' | 'sms' | 'none',
    additionalComments: ''
  })

  const handleRatingChange = (aspect: keyof FeedbackRating, rating: number) => {
    setRatings(prev => ({ ...prev, [aspect]: rating }))
  }

  const handleCommentChange = (field: keyof typeof comments, value: string) => {
    setComments(prev => ({ ...prev, [field]: value }))
  }

  const handleRecommendationToggle = (type: 'favoriteAspects' | 'improvementAreas', item: string) => {
    setRecommendations(prev => ({
      ...prev,
      [type]: prev[type].includes(item)
        ? prev[type].filter(i => i !== item)
        : [...prev[type], item]
    }))
  }

  const nextStep = () => {
    if (currentStep < 4) {
      setCurrentStep(currentStep + 1)
    }
  }

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    }
  }

  const handleSubmit = () => {
    const feedback: FeedbackResponse = {
      appointmentId,
      customerId,
      customerName,
      customerAvatar,
      ratings,
      comments,
      recommendations: {
        ...recommendations,
        wouldRecommend: recommendations.wouldRecommend!,
        wouldReturn: recommendations.wouldReturn!
      },
      metadata: {
        timestamp: new Date(),
        platform: 'web',
        completionTime: Math.floor((Date.now() - startTime) / 1000),
        isVerified: true
      },
      followUp
    }

    onSubmit(feedback)
  }

  const isStepValid = () => {
    switch (currentStep) {
      case 1:
        return ratings.overall > 0 && ratings.barber > 0
      case 2:
        return comments.overall.length > 0 || comments.positive.length > 0
      case 3:
        return recommendations.wouldRecommend !== null && recommendations.wouldReturn !== null
      case 4:
        return true
      default:
        return false
    }
  }

  const renderStarRating = (aspect: keyof FeedbackRating, currentRating: number) => {
    const Icon = aspectIcons[aspect]

    return (
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <Icon className="h-5 w-5 text-primary" />
          <span className="font-medium">{aspectLabels[aspect]}</span>
        </div>

        <div className="flex items-center gap-2">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              onClick={() => handleRatingChange(aspect, star)}
              className="transition-all hover:scale-110"
            >
              <Star
                className={cn(
                  "h-8 w-8 transition-colors",
                  star <= currentRating
                    ? "fill-yellow-400 text-yellow-400"
                    : "text-gray-300 hover:text-yellow-400"
                )}
              />
            </button>
          ))}
          {currentRating > 0 && (
            <span className="ml-2 text-sm font-medium text-muted-foreground">
              {ratingLabels[currentRating as keyof typeof ratingLabels]}
            </span>
          )}
        </div>
      </div>
    )
  }

  const steps = [
    {
      title: "Rate Your Experience",
      subtitle: "How would you rate different aspects of your visit?",
      content: (
        <div className="space-y-6">
          {renderStarRating('overall', ratings.overall)}
          {renderStarRating('barber', ratings.barber)}
          {renderStarRating('ambiance', ratings.ambiance)}
          {renderStarRating('value', ratings.value)}
          {renderStarRating('waitTime', ratings.waitTime)}

          <div className="mt-6 p-4 bg-muted/50 rounded-lg">
            <p className="text-sm text-muted-foreground">
              💡 <strong>Tip:</strong> Your feedback helps us improve and ensures the best experience for future customers!
            </p>
          </div>
        </div>
      )
    },
    {
      title: "Tell Us More",
      subtitle: "Share your thoughts about the service and experience",
      content: (
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium mb-2">
              Overall Comments
            </label>
            <Textarea
              placeholder="How was your overall experience? Any highlights or memorable moments?"
              value={comments.overall}
              onChange={(e) => handleCommentChange('overall', e.target.value)}
              rows={3}
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">
              What Did You Like Most? 🤩
            </label>
            <Textarea
              placeholder="What aspects of your visit stood out positively?"
              value={comments.positive}
              onChange={(e) => handleCommentChange('positive', e.target.value)}
              rows={3}
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">
              Areas for Improvement 💭
            </label>
            <Textarea
              placeholder="Is there anything we could do better? (Optional)"
              value={comments.improvements}
              onChange={(e) => handleCommentChange('improvements', e.target.value)}
              rows={3}
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">
              Barber-Specific Feedback ✂️
            </label>
            <Textarea
              placeholder={`Tell us about your experience with ${barberName}...`}
              value={comments.barber}
              onChange={(e) => handleCommentChange('barber', e.target.value)}
              rows={3}
            />
          </div>
        </div>
      )
    },
    {
      title: "Your Recommendations",
      subtitle: "Help us understand what matters most to you",
      content: (
        <div className="space-y-6">
          <div>
            <h3 className="font-medium mb-3">Would you recommend us to a friend?</h3>
            <div className="flex gap-3">
              <Button
                variant={recommendations.wouldRecommend === true ? 'default' : 'outline'}
                onClick={() => setRecommendations(prev => ({ ...prev, wouldRecommend: true }))}
                className="flex items-center gap-2"
              >
                <ThumbsUp className="h-4 w-4" />
                Yes, definitely!
              </Button>
              <Button
                variant={recommendations.wouldRecommend === false ? 'destructive' : 'outline'}
                onClick={() => setRecommendations(prev => ({ ...prev, wouldRecommend: false }))}
                className="flex items-center gap-2"
              >
                <ThumbsDown className="h-4 w-4" />
                Not sure
              </Button>
            </div>
          </div>

          <div>
            <h3 className="font-medium mb-3">Would you return for another visit?</h3>
            <div className="flex gap-3">
              <Button
                variant={recommendations.wouldReturn === true ? 'default' : 'outline'}
                onClick={() => setRecommendations(prev => ({ ...prev, wouldReturn: true }))}
                className="flex items-center gap-2"
              >
                <Heart className="h-4 w-4" />
                Yes, absolutely!
              </Button>
              <Button
                variant={recommendations.wouldReturn === false ? 'outline' : 'outline'}
                onClick={() => setRecommendations(prev => ({ ...prev, wouldReturn: false }))}
                className="flex items-center gap-2"
              >
                <Clock className="h-4 w-4" />
                Maybe later
              </Button>
            </div>
          </div>

          <div>
            <h3 className="font-medium mb-3">What did you like most?</h3>
            <div className="grid grid-cols-2 gap-2">
              {favoriteAspects.map((aspect) => (
                <button
                  key={aspect}
                  onClick={() => handleRecommendationToggle('favoriteAspects', aspect)}
                  className={cn(
                    "p-2 text-left text-sm rounded border transition-colors",
                    recommendations.favoriteAspects.includes(aspect)
                      ? "bg-primary text-primary-foreground border-primary"
                      : "bg-background hover:bg-muted border-border"
                  )}
                >
                  {aspect}
                </button>
              ))}
            </div>
          </div>

          <div>
            <h3 className="font-medium mb-3">Areas for improvement (Optional)</h3>
            <div className="grid grid-cols-2 gap-2">
              {improvementAreas.map((area) => (
                <button
                  key={area}
                  onClick={() => handleRecommendationToggle('improvementAreas', area)}
                  className={cn(
                    "p-2 text-left text-sm rounded border transition-colors",
                    recommendations.improvementAreas.includes(area)
                      ? "bg-orange-100 text-orange-800 border-orange-300"
                      : "bg-background hover:bg-muted border-border"
                  )}
                >
                  {area}
                </button>
              ))}
            </div>
          </div>
        </div>
      )
    },
    {
      title: "Final Thoughts",
      subtitle: "Any additional comments or follow-up preferences?",
      content: (
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium mb-2">
              Additional Comments
            </label>
            <Textarea
              placeholder="Any final thoughts, suggestions, or additional feedback?"
              value={followUp.additionalComments}
              onChange={(e) => setFollowUp(prev => ({ ...prev, additionalComments: e.target.value }))}
              rows={3}
            />
          </div>

          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="followUp"
                checked={followUp.contactForFollowUp}
                onChange={(e) => setFollowUp(prev => ({ ...prev, contactForFollowUp: e.target.checked }))}
                className="rounded"
              />
              <label htmlFor="followUp" className="text-sm">
                I'd like to be contacted for follow-up questions
              </label>
            </div>

            {followUp.contactForFollowUp && (
              <div className="ml-6">
                <label className="block text-sm font-medium mb-2">
                  Preferred contact method
                </label>
                <div className="flex gap-2">
                  <Button
                    variant={followUp.preferredContactMethod === 'email' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setFollowUp(prev => ({ ...prev, preferredContactMethod: 'email' }))}
                  >
                    Email
                  </Button>
                  <Button
                    variant={followUp.preferredContactMethod === 'sms' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setFollowUp(prev => ({ ...prev, preferredContactMethod: 'sms' }))}
                  >
                    SMS
                  </Button>
                </div>
              </div>
            )}
          </div>

          <div className="p-4 bg-gradient-to-r from-primary/10 to-secondary/10 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <Award className="h-5 w-5 text-primary" />
              <span className="font-medium">Thank You for Your Feedback!</span>
            </div>
            <p className="text-sm text-muted-foreground">
              Your detailed feedback helps us provide the best possible experience for all our customers.
              We truly appreciate you taking the time to share your thoughts!
            </p>
          </div>
        </div>
      )
    }
  ]

  return (
    <Card className={cn("max-w-2xl mx-auto", className)}>
      <CardHeader>
        <div className="flex items-center gap-3 mb-4">
          <Avatar className="h-12 w-12">
            <AvatarImage src={customerAvatar} />
            <AvatarFallback>
              {customerName.split(' ').map(n => n[0]).join('')}
            </AvatarFallback>
          </Avatar>
          <div>
            <CardTitle className="text-xl">Share Your Experience</CardTitle>
            <p className="text-sm text-muted-foreground">
              {serviceName} with {barberName}
            </p>
          </div>
        </div>

        {/* Progress Indicator */}
        <div className="flex items-center gap-2">
          {[1, 2, 3, 4].map((step) => (
            <div key={step} className="flex items-center gap-2">
              <div
                className={cn(
                  "w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-colors",
                  step <= currentStep
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted text-muted-foreground"
                )}
              >
                {step}
              </div>
              {step < 4 && (
                <div
                  className={cn(
                    "w-12 h-1 rounded transition-colors",
                    step < currentStep ? "bg-primary" : "bg-muted"
                  )}
                />
              )}
            </div>
          ))}
        </div>

        <div className="mt-2">
          <h3 className="font-medium">{steps[currentStep - 1].title}</h3>
          <p className="text-sm text-muted-foreground">{steps[currentStep - 1].subtitle}</p>
        </div>
      </CardHeader>

      <CardContent>
        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
          >
            {steps[currentStep - 1].content}
          </motion.div>
        </AnimatePresence>

        {/* Navigation Buttons */}
        <div className="flex justify-between mt-8 pt-6 border-t">
          <div>
            {currentStep > 1 && (
              <Button variant="outline" onClick={prevStep}>
                Previous
              </Button>
            )}
          </div>

          <div className="flex gap-3">
            {onSkip && currentStep === 1 && (
              <Button variant="ghost" onClick={onSkip}>
                Skip for now
              </Button>
            )}

            {currentStep < 4 ? (
              <Button
                onClick={nextStep}
                disabled={!isStepValid()}
                className="flex items-center gap-2"
              >
                Next
                <motion.div
                  animate={{ x: [0, 5, 0] }}
                  transition={{ duration: 1, repeat: Infinity }}
                >
                  →
                </motion.div>
              </Button>
            ) : (
              <Button
                onClick={handleSubmit}
                disabled={!isStepValid()}
                className="flex items-center gap-2 bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90"
              >
                <Send className="h-4 w-4" />
                Submit Feedback
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

// Feedback Results Display Component
interface FeedbackResultsProps {
  feedbacks: FeedbackResponse[]
  className?: string
}

export function FeedbackResults({ feedbacks, className }: FeedbackResultsProps) {
  const averageRatings = feedbacks.reduce(
    (acc, feedback) => {
      acc.overall += feedback.ratings.overall
      acc.barber += feedback.ratings.barber
      acc.ambiance += feedback.ratings.ambiance
      acc.value += feedback.ratings.value
      acc.waitTime += feedback.ratings.waitTime
      return acc
    },
    { overall: 0, barber: 0, ambiance: 0, value: 0, waitTime: 0 }
  )

  const aspectCount = feedbacks.length
  Object.keys(averageRatings).forEach(key => {
    averageRatings[key as keyof typeof averageRatings] /= aspectCount
  })

  const recommendationRate = (feedbacks.filter(f => f.recommendations.wouldRecommend).length / aspectCount) * 100
  const returnRate = (feedbacks.filter(f => f.recommendations.wouldReturn).length / aspectCount) * 100

  return (
    <div className={cn("space-y-6", className)}>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-green-600" />
            Feedback Summary
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-primary">
                {averageRatings.overall.toFixed(1)}
              </div>
              <div className="text-sm text-muted-foreground">Overall Rating</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">
                {recommendationRate.toFixed(0)}%
              </div>
              <div className="text-sm text-muted-foreground">Would Recommend</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">
                {returnRate.toFixed(0)}%
              </div>
              <div className="text-sm text-muted-foreground">Would Return</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">
                {aspectCount}
              </div>
              <div className="text-sm text-muted-foreground">Total Reviews</div>
            </div>
          </div>

          <div className="space-y-3">
            {Object.entries(aspectLabels).map(([key, label]) => {
              const rating = averageRatings[key as keyof typeof averageRatings]
              return (
                <div key={key} className="flex items-center justify-between">
                  <span className="text-sm">{label}</span>
                  <div className="flex items-center gap-2">
                    <div className="flex">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star
                          key={star}
                          className={cn(
                            "h-4 w-4",
                            star <= Math.round(rating)
                              ? "fill-yellow-400 text-yellow-400"
                              : "text-gray-300"
                          )}
                        />
                      ))}
                    </div>
                    <span className="text-sm font-medium">{rating.toFixed(1)}</span>
                  </div>
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>

      {/* Recent Feedback */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Feedback</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {feedbacks.slice(0, 5).map((feedback) => (
              <div key={feedback.appointmentId} className="border-b pb-4 last:border-b-0 last:pb-0">
                <div className="flex items-center gap-3 mb-2">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={feedback.customerAvatar} />
                    <AvatarFallback>
                      {feedback.customerName.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="font-medium">{feedback.customerName}</span>
                      <div className="flex">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <Star
                            key={star}
                            className={cn(
                              "h-3 w-3",
                              star <= feedback.ratings.overall
                                ? "fill-yellow-400 text-yellow-400"
                                : "text-gray-300"
                            )}
                          />
                        ))}
                      </div>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {new Date(feedback.metadata.timestamp).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                {feedback.comments.overall && (
                  <p className="text-sm italic">"{feedback.comments.overall}"</p>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

// Export types
export type { FeedbackRating, FeedbackResponse, CustomerFeedbackFormProps, FeedbackResultsProps }
