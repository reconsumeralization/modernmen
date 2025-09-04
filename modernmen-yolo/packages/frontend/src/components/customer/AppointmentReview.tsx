'use client'

import React, { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import {
  Star,
  MessageSquare,
  ThumbsUp,
  ThumbsDown,
  User,
  Calendar,
  Clock,
  Scissors,
  Send
} from 'lucide-react'

// Mock completed appointments that need reviews
const mockAppointmentsNeedingReview = [
  {
    id: '1',
    service: 'Classic Haircut',
    barber: 'Mike Johnson',
    barberAvatar: '/placeholder-user.jpg',
    date: '2024-01-15',
    time: '14:00',
    price: 35,
    duration: 30,
    location: 'Main Salon'
  },
  {
    id: '2',
    service: 'Beard Grooming',
    barber: 'Sarah Davis',
    barberAvatar: '/placeholder-user.jpg',
    date: '2024-01-12',
    time: '10:30',
    price: 25,
    duration: 25,
    location: 'Main Salon'
  }
]

// Mock existing reviews
const mockExistingReviews = [
  {
    id: '1',
    appointmentId: '3',
    service: 'Hair & Beard Combo',
    barber: 'Mike Johnson',
    rating: 5,
    comment: 'Excellent service! Mike is very professional and skilled. Highly recommend!',
    date: '2024-01-08',
    helpful: 12,
    verified: true
  },
  {
    id: '2',
    appointmentId: '4',
    service: 'Classic Haircut',
    barber: 'Sarah Davis',
    rating: 4,
    comment: 'Great haircut, very satisfied with the results. Will definitely return.',
    date: '2024-01-01',
    helpful: 8,
    verified: true
  }
]

interface StarRatingProps {
  rating: number
  onRatingChange: (rating: number) => void
  readonly?: boolean
  size?: 'sm' | 'md' | 'lg'
}

function StarRating({ rating, onRatingChange, readonly = false, size = 'md' }: StarRatingProps) {
  const sizeClasses = {
    sm: 'h-4 w-4',
    md: 'h-5 w-5',
    lg: 'h-6 w-6'
  }

  return (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          onClick={() => !readonly && onRatingChange(star)}
          className={`${readonly ? 'cursor-default' : 'cursor-pointer hover:scale-110'} transition-transform`}
          disabled={readonly}
        >
          <Star
            className={`${sizeClasses[size]} ${
              star <= rating
                ? 'fill-yellow-400 text-yellow-400'
                : 'text-gray-300 hover:text-yellow-400'
            }`}
          />
        </button>
      ))}
    </div>
  )
}

export function AppointmentReview() {
  const [selectedAppointment, setSelectedAppointment] = useState<any>(null)
  const [showReviewDialog, setShowReviewDialog] = useState(false)
  const [reviewRating, setReviewRating] = useState(0)
  const [reviewComment, setReviewComment] = useState('')
  const [helpfulReviews, setHelpfulReviews] = useState<Set<string>>(new Set())

  const handleSubmitReview = () => {
    if (!selectedAppointment || reviewRating === 0) return

    // In real app, this would submit to API
    console.log('Submitting review:', {
      appointmentId: selectedAppointment.id,
      rating: reviewRating,
      comment: reviewComment
    })

    // Reset form
    setReviewRating(0)
    setReviewComment('')
    setShowReviewDialog(false)
    setSelectedAppointment(null)
  }

  const markHelpful = (reviewId: string) => {
    setHelpfulReviews(prev => {
      const newSet = new Set(prev)
      if (newSet.has(reviewId)) {
        newSet.delete(reviewId)
      } else {
        newSet.add(reviewId)
      }
      return newSet
    })
  }

  return (
    <div className="space-y-6">
      {/* Appointments Needing Reviews */}
      {mockAppointmentsNeedingReview.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MessageSquare className="h-5 w-5" />
              Share Your Experience
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-4">
              Help others by reviewing your recent appointments. Your feedback matters!
            </p>
            <div className="space-y-3">
              {mockAppointmentsNeedingReview.map((appointment) => (
                <div key={appointment.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center gap-4">
                    <Avatar>
                      <AvatarImage src={appointment.barberAvatar} />
                      <AvatarFallback>
                        {appointment.barber.split(' ').map(n => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <h4 className="font-semibold">{appointment.service}</h4>
                      <p className="text-sm text-muted-foreground">
                        with {appointment.barber} • {appointment.date} at {appointment.time}
                      </p>
                      <div className="flex items-center gap-4 mt-1">
                        <div className="flex items-center gap-1 text-sm">
                          <Calendar className="h-3 w-3" />
                          {appointment.duration} min
                        </div>
                        <div className="flex items-center gap-1 text-sm">
                          <Scissors className="h-3 w-3" />
                          ${appointment.price}
                        </div>
                      </div>
                    </div>
                  </div>
                  <Dialog open={showReviewDialog && selectedAppointment?.id === appointment.id} onOpenChange={setShowReviewDialog}>
                    <DialogTrigger asChild>
                      <Button
                        variant="outline"
                        onClick={() => setSelectedAppointment(appointment)}
                      >
                        Write Review
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-md">
                      <DialogHeader>
                        <DialogTitle>Review Your Experience</DialogTitle>
                      </DialogHeader>
                      <div className="space-y-4">
                        <div className="text-center">
                          <Avatar className="mx-auto mb-2">
                            <AvatarImage src={appointment.barberAvatar} />
                            <AvatarFallback>
                              {appointment.barber.split(' ').map(n => n[0]).join('')}
                            </AvatarFallback>
                          </Avatar>
                          <h3 className="font-semibold">{appointment.service}</h3>
                          <p className="text-sm text-muted-foreground">
                            with {appointment.barber}
                          </p>
                        </div>

                        <div className="space-y-2">
                          <label className="text-sm font-medium">Rate your experience</label>
                          <div className="flex justify-center">
                            <StarRating
                              rating={reviewRating}
                              onRatingChange={setReviewRating}
                              size="lg"
                            />
                          </div>
                        </div>

                        <div className="space-y-2">
                          <label className="text-sm font-medium">Share your thoughts</label>
                          <Textarea
                            placeholder="Tell others about your experience..."
                            value={reviewComment}
                            onChange={(e) => setReviewComment(e.target.value)}
                            rows={4}
                          />
                        </div>

                        <div className="flex gap-3">
                          <Button
                            variant="outline"
                            className="flex-1"
                            onClick={() => setShowReviewDialog(false)}
                          >
                            Cancel
                          </Button>
                          <Button
                            className="flex-1"
                            onClick={handleSubmitReview}
                            disabled={reviewRating === 0}
                          >
                            <Send className="h-4 w-4 mr-2" />
                            Submit Review
                          </Button>
                        </div>
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Recent Reviews */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Star className="h-5 w-5" />
            Your Reviews
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {mockExistingReviews.map((review) => (
              <div key={review.id} className="border rounded-lg p-4">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <Avatar>
                      <AvatarImage src="/placeholder-user.jpg" />
                      <AvatarFallback>JD</AvatarFallback>
                    </Avatar>
                    <div>
                      <h4 className="font-semibold">{review.service}</h4>
                      <p className="text-sm text-muted-foreground">
                        with {review.barber} • {review.date}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <StarRating rating={review.rating} onRatingChange={() => {}} readonly />
                    {review.verified && (
                      <Badge variant="secondary" className="text-xs">
                        Verified
                      </Badge>
                    )}
                  </div>
                </div>

                <p className="text-sm mb-3">{review.comment}</p>

                <div className="flex items-center justify-between">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => markHelpful(review.id)}
                    className="flex items-center gap-2"
                  >
                    <ThumbsUp className={`h-4 w-4 ${
                      helpfulReviews.has(review.id) ? 'text-green-600' : ''
                    }`} />
                    Helpful ({helpfulReviews.has(review.id) ? review.helpful + 1 : review.helpful})
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
