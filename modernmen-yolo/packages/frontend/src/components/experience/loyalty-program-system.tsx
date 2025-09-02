// =============================================================================
// LOYALTY PROGRAM SYSTEM - Personalized rewards and exclusive experiences
// =============================================================================

"use client"

import React, { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  Crown,
  Star,
  Gift,
  Award,
  Zap,
  Heart,
  Trophy,
  Calendar,

  Coffee,
  Sparkles,
  Target,
  TrendingUp,
  Users,
  Clock,
  CheckCircle,
  Lock,
  Unlock,
  ChevronRight,
  GiftIcon
} from "lucide-react"
import { cn } from "@/lib/utils"

// Enhanced loyalty program types
interface LoyaltyTier {
  id: string
  name: 'Bronze' | 'Silver' | 'Gold' | 'Platinum' | 'Diamond'
  color: string
  icon: React.ComponentType<any>
  minPoints: number
  maxPoints: number
  perks: {
    id: string
    title: string
    description: string
    icon: React.ComponentType<any>
    unlocked: boolean
    redeemed?: boolean
    redemptionDate?: Date
  }[]
  exclusiveOffers: {
    id: string
    title: string
    description: string
    discount: number
    validUntil: Date
    redeemed: boolean
  }[]
}

interface CustomerLoyalty {
  customerId: string
  currentTier: LoyaltyTier
  totalPoints: number
  availablePoints: number
  pointsToNextTier: number
  lifetimeValue: number
  memberSince: Date
  streak: {
    current: number // consecutive months with visits
    longest: number
    lastVisit: Date
  }
  achievements: {
    id: string
    title: string
    description: string
    icon: React.ComponentType<any>
    unlockedAt: Date
    rarity: 'common' | 'rare' | 'epic' | 'legendary'
  }[]
  recentActivity: {
    id: string
    type: 'earn' | 'redeem' | 'achievement' | 'tier_upgrade'
    description: string
    points: number
    timestamp: Date
    icon: React.ComponentType<any>
  }[]
  personalizedRewards: {
    id: string
    title: string
    description: string
    pointsCost: number
    category: 'service' | 'product' | 'experience' | 'exclusive'
    available: boolean
    redeemed: boolean
    validUntil?: Date
  }[]
}

interface LoyaltyProgramProps {
  loyalty: CustomerLoyalty
  onRedeemReward: (rewardId: string) => void
  onViewHistory: () => void
  className?: string
}

const tierConfig: Record<string, LoyaltyTier> = {
  Bronze: {
    id: 'bronze',
    name: 'Bronze',
    color: 'bg-amber-600',
    icon: Award,
    minPoints: 0,
    maxPoints: 499,
    perks: [
      {
        id: 'birthday-discount',
        title: 'Birthday Discount',
        description: '20% off on your birthday month',
        icon: Gift,
        unlocked: true
      },
      {
        id: 'loyalty-points',
        title: 'Loyalty Points',
        description: 'Earn 1 point per $1 spent',
        icon: Star,
        unlocked: true
      }
    ],
    exclusiveOffers: []
  },
  Silver: {
    id: 'silver',
    name: 'Silver',
    color: 'bg-gray-400',
    icon: Star,
    minPoints: 500,
    maxPoints: 1499,
    perks: [
      {
        id: 'priority-booking',
        title: 'Priority Booking',
        description: 'Book appointments 24 hours in advance',
        icon: Calendar,
        unlocked: true
      },
      {
        id: 'free-beverage',
        title: 'Complimentary Beverage',
        description: 'Free coffee, tea, or soda with service',
        icon: Coffee,
        unlocked: true
      },
      {
        id: 'birthday-treatment',
        title: 'Birthday Treatment',
        description: 'Free beard trim on your birthday',
        icon: () => (
          <div className="w-5 h-5 bg-red-600 rounded-full flex items-center justify-center">
            <span className="text-white text-xs font-bold">M</span>
          </div>
        ),
        unlocked: true
      }
    ],
    exclusiveOffers: [
      {
        id: 'silver-discount',
        title: 'Silver Member Discount',
        description: '10% off all services',
        discount: 10,
        validUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
        redeemed: false
      }
    ]
  },
  Gold: {
    id: 'gold',
    name: 'Gold',
    color: 'bg-yellow-500',
    icon: Crown,
    minPoints: 1500,
    maxPoints: 2999,
    perks: [
      {
        id: 'vip-area',
        title: 'VIP Waiting Area',
        description: 'Exclusive seating with refreshments',
        icon: Users,
        unlocked: true
      },
      {
        id: 'express-service',
        title: 'Express Service',
        description: 'Reduced wait times and priority service',
        icon: Zap,
        unlocked: true
      },
      {
        id: 'personal-stylist',
        title: 'Dedicated Stylist',
        description: 'Request your preferred barber',
        icon: Heart,
        unlocked: true
      }
    ],
    exclusiveOffers: [
      {
        id: 'gold-discount',
        title: 'Gold Member Discount',
        description: '15% off all services',
        discount: 15,
        validUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        redeemed: false
      },
      {
        id: 'free-consultation',
        title: 'Free Style Consultation',
        description: 'Complimentary styling consultation',
        discount: 100,
        validUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        redeemed: false
      }
    ]
  },
  Platinum: {
    id: 'platinum',
    name: 'Platinum',
    color: 'bg-purple-600',
    icon: Sparkles,
    minPoints: 3000,
    maxPoints: 4999,
    perks: [
      {
        id: 'concierge-service',
        title: 'Concierge Service',
        description: 'Personal concierge for appointments',
        icon: Trophy,
        unlocked: true
      },
      {
        id: 'exclusive-products',
        title: 'Exclusive Products',
        description: 'Access to premium product line',
        icon: GiftIcon,
        unlocked: true
      },
      {
        id: 'monthly-service',
        title: 'Free Monthly Service',
        description: 'One free service per month',
        icon: Calendar,
        unlocked: true
      }
    ],
    exclusiveOffers: [
      {
        id: 'platinum-discount',
        title: 'Platinum Elite Discount',
        description: '20% off all services and products',
        discount: 20,
        validUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        redeemed: false
      }
    ]
  },
  Diamond: {
    id: 'diamond',
    name: 'Diamond',
    color: 'bg-blue-600',
    icon: Target,
    minPoints: 5000,
    maxPoints: Infinity,
    perks: [
      {
        id: 'lifetime-membership',
        title: 'Lifetime Membership',
        description: 'Never pay full price again',
        icon: Crown,
        unlocked: true
      },
      {
        id: 'personal-barber',
        title: 'Personal Barber',
        description: 'Dedicated barber for all services',
        icon: Users,
        unlocked: true
      },
      {
        id: 'vip-events',
        title: 'VIP Events Access',
        description: 'Exclusive member events and parties',
        icon: Sparkles,
        unlocked: true
      }
    ],
    exclusiveOffers: [
      {
        id: 'diamond-lifetime',
        title: 'Diamond Lifetime Value',
        description: '50% off for life + exclusive perks',
        discount: 50,
        validUntil: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000), // 1 year
        redeemed: false
      }
    ]
  }
}

export function LoyaltyProgram({
  loyalty,
  onRedeemReward,
  onViewHistory,
  className
}: LoyaltyProgramProps) {
  const [activeTab, setActiveTab] = useState<'overview' | 'rewards' | 'achievements' | 'activity'>('overview')
  const [selectedReward, setSelectedReward] = useState<string | null>(null)

  const currentTier = tierConfig[loyalty.currentTier.name]
  const progressPercentage = currentTier.maxPoints === Infinity
    ? 100
    : ((loyalty.totalPoints - currentTier.minPoints) / (currentTier.maxPoints - currentTier.minPoints)) * 100

  const nextTier = currentTier.maxPoints === Infinity
    ? null
    : Object.values(tierConfig).find(tier => tier.minPoints === currentTier.maxPoints + 1)

  return (
    <div className={cn("max-w-4xl mx-auto space-y-6", className)}>
      {/* Header */}
      <Card className="bg-gradient-to-r from-primary/10 via-secondary/10 to-accent/10 border-primary/20">
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-4">
              <div className={cn(
                "p-4 rounded-full",
                currentTier.color
              )}>
                <currentTier.icon className="h-8 w-8 text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-bold">{currentTier.name} Member</h2>
                <p className="text-muted-foreground">
                  {loyalty.availablePoints} available points • {loyalty.totalPoints} total earned
                </p>
              </div>
            </div>

            <div className="text-right">
              <div className="text-3xl font-bold text-primary">
                {loyalty.availablePoints.toLocaleString()}
              </div>
              <div className="text-sm text-muted-foreground">Available Points</div>
            </div>
          </div>

          {/* Progress to Next Tier */}
          {nextTier && (
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Progress to {nextTier.name}</span>
                <span>{loyalty.pointsToNextTier} points needed</span>
              </div>
              <Progress value={progressPercentage} className="h-3" />
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>{currentTier.minPoints} pts</span>
                <span>{currentTier.maxPoints} pts</span>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Navigation Tabs */}
      <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as any)}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="rewards">Rewards</TabsTrigger>
          <TabsTrigger value="achievements">Achievements</TabsTrigger>
          <TabsTrigger value="activity">Activity</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            {/* Current Tier Benefits */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Crown className="h-5 w-5 text-yellow-500" />
                  {currentTier.name} Benefits
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {currentTier.perks.map((perk) => (
                    <div key={perk.id} className="flex items-start gap-3">
                      <div className="p-2 bg-primary/10 rounded-lg">
                        <perk.icon className="h-4 w-4 text-primary" />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-medium">{perk.title}</h4>
                        <p className="text-sm text-muted-foreground">{perk.description}</p>
                      </div>
                      {perk.unlocked && (
                        <CheckCircle className="h-5 w-5 text-green-500" />
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Exclusive Offers */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Gift className="h-5 w-5 text-purple-500" />
                  Exclusive Offers
                </CardTitle>
              </CardHeader>
              <CardContent>
                {currentTier.exclusiveOffers.length > 0 ? (
                  <div className="space-y-3">
                    {currentTier.exclusiveOffers.map((offer) => (
                      <div key={offer.id} className="p-3 border rounded-lg">
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="font-medium">{offer.title}</h4>
                          <Badge variant="secondary">{offer.discount}% OFF</Badge>
                        </div>
                        <p className="text-sm text-muted-foreground mb-2">{offer.description}</p>
                        <p className="text-xs text-muted-foreground">
                          Valid until: {offer.validUntil.toLocaleDateString()}
                        </p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    <Gift className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>No exclusive offers available yet</p>
                    <p className="text-sm">Keep earning points to unlock more!</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Card>
              <CardContent className="p-4 text-center">
                <Trophy className="h-8 w-8 mx-auto mb-2 text-yellow-500" />
                <div className="text-2xl font-bold">{loyalty.streak.current}</div>
                <div className="text-sm text-muted-foreground">Visit Streak</div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4 text-center">
                <Calendar className="h-8 w-8 mx-auto mb-2 text-blue-500" />
                <div className="text-2xl font-bold">{loyalty.streak.longest}</div>
                <div className="text-sm text-muted-foreground">Best Streak</div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4 text-center">
                <TrendingUp className="h-8 w-8 mx-auto mb-2 text-green-500" />
                <div className="text-2xl font-bold">${loyalty.lifetimeValue}</div>
                <div className="text-sm text-muted-foreground">Lifetime Value</div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4 text-center">
                <Award className="h-8 w-8 mx-auto mb-2 text-purple-500" />
                <div className="text-2xl font-bold">{loyalty.achievements.length}</div>
                <div className="text-sm text-muted-foreground">Achievements</div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Rewards Tab */}
        <TabsContent value="rewards" className="space-y-6">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {loyalty.personalizedRewards.map((reward) => (
              <motion.div
                key={reward.id}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Card className={cn(
                  "cursor-pointer transition-all hover:shadow-lg",
                  !reward.available && "opacity-50",
                  reward.redeemed && "bg-muted"
                )}>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div className={cn(
                        "p-3 rounded-full",
                        reward.category === 'service' && "bg-blue-100 text-blue-600",
                        reward.category === 'product' && "bg-green-100 text-green-600",
                        reward.category === 'experience' && "bg-purple-100 text-purple-600",
                        reward.category === 'exclusive' && "bg-yellow-100 text-yellow-600"
                      )}>
                        {reward.category === 'service' && (
                          <div className="w-6 h-6 bg-red-600 rounded-full flex items-center justify-center">
                            <span className="text-white text-sm font-bold">M</span>
                          </div>
                        )}
                        {reward.category === 'product' && <Gift className="h-6 w-6" />}
                        {reward.category === 'experience' && <Sparkles className="h-6 w-6" />}
                        {reward.category === 'exclusive' && <Crown className="h-6 w-6" />}
                      </div>
                      <div className="text-right">
                        <div className="text-lg font-bold">{reward.pointsCost}</div>
                        <div className="text-xs text-muted-foreground">points</div>
                      </div>
                    </div>

                    <h3 className="font-semibold mb-2">{reward.title}</h3>
                    <p className="text-sm text-muted-foreground mb-4">{reward.description}</p>

                    {reward.validUntil && (
                      <p className="text-xs text-muted-foreground mb-4">
                        Valid until: {reward.validUntil.toLocaleDateString()}
                      </p>
                    )}

                    <Button
                      onClick={() => onRedeemReward(reward.id)}
                      disabled={!reward.available || reward.redeemed || loyalty.availablePoints < reward.pointsCost}
                      className="w-full"
                      variant={reward.redeemed ? "secondary" : "default"}
                    >
                      {reward.redeemed ? (
                        <>
                          <CheckCircle className="h-4 w-4 mr-2" />
                          Redeemed
                        </>
                      ) : reward.available && loyalty.availablePoints >= reward.pointsCost ? (
                        <>
                          <Unlock className="h-4 w-4 mr-2" />
                          Redeem
                        </>
                      ) : (
                        <>
                          <Lock className="h-4 w-4 mr-2" />
                          {loyalty.availablePoints < reward.pointsCost ? 'Not Enough Points' : 'Unavailable'}
                        </>
                      )}
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>

          {loyalty.personalizedRewards.length === 0 && (
            <Card>
              <CardContent className="p-8 text-center">
                <Gift className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
                <h3 className="text-lg font-semibold mb-2">No Rewards Available</h3>
                <p className="text-muted-foreground mb-4">
                  Keep earning points to unlock exclusive rewards and experiences!
                </p>
                <Button onClick={() => setActiveTab('overview')}>
                  View My Progress
                </Button>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        {/* Achievements Tab */}
        <TabsContent value="achievements" className="space-y-6">
          <div className="grid md:grid-cols-2 gap-4">
            {loyalty.achievements.map((achievement) => (
              <Card key={achievement.id} className="bg-gradient-to-br from-yellow-50 to-orange-50 border-yellow-200">
                <CardContent className="p-6">
                  <div className="flex items-center gap-4 mb-4">
                    <div className={cn(
                      "p-3 rounded-full",
                      achievement.rarity === 'common' && "bg-gray-100 text-gray-600",
                      achievement.rarity === 'rare' && "bg-blue-100 text-blue-600",
                      achievement.rarity === 'epic' && "bg-purple-100 text-purple-600",
                      achievement.rarity === 'legendary' && "bg-yellow-100 text-yellow-600"
                    )}>
                      <achievement.icon className="h-6 w-6" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold">{achievement.title}</h3>
                      <p className="text-sm text-muted-foreground">{achievement.description}</p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-sm">
                    <Badge variant="secondary" className="capitalize">
                      {achievement.rarity}
                    </Badge>
                    <span className="text-muted-foreground">
                      Unlocked {new Date(achievement.unlockedAt).toLocaleDateString()}
                    </span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {loyalty.achievements.length === 0 && (
            <Card>
              <CardContent className="p-8 text-center">
                <Trophy className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
                <h3 className="text-lg font-semibold mb-2">No Achievements Yet</h3>
                <p className="text-muted-foreground mb-4">
                  Complete visits and reach milestones to unlock achievements!
                </p>
                <Button onClick={() => setActiveTab('overview')}>
                  Start Earning
                </Button>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        {/* Activity Tab */}
        <TabsContent value="activity" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-96">
                <div className="space-y-4">
                  {loyalty.recentActivity.map((activity) => (
                    <div key={activity.id} className="flex items-start gap-4 p-3 rounded-lg bg-muted/50">
                      <div className={cn(
                        "p-2 rounded-full",
                        activity.type === 'earn' && "bg-green-100 text-green-600",
                        activity.type === 'redeem' && "bg-blue-100 text-blue-600",
                        activity.type === 'achievement' && "bg-yellow-100 text-yellow-600",
                        activity.type === 'tier_upgrade' && "bg-purple-100 text-purple-600"
                      )}>
                        <activity.icon className="h-4 w-4" />
                      </div>

                      <div className="flex-1">
                        <p className="font-medium">{activity.description}</p>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-sm text-muted-foreground">
                            {new Date(activity.timestamp).toLocaleString()}
                          </span>
                          {activity.points !== 0 && (
                            <Badge variant={activity.points > 0 ? "default" : "secondary"}>
                              {activity.points > 0 ? '+' : ''}{activity.points} pts
                            </Badge>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>

          <div className="flex justify-center">
            <Button variant="outline" onClick={onViewHistory}>
              View Full History
            </Button>
          </div>
        </TabsContent>
      </Tabs>

      {/* Reward Redemption Modal */}
      <Dialog open={!!selectedReward} onOpenChange={() => setSelectedReward(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Redeem Reward</DialogTitle>
          </DialogHeader>
          {selectedReward && (
            <div className="space-y-4">
              <p>Are you sure you want to redeem this reward?</p>
              <div className="flex gap-3">
                <Button onClick={() => {
                  onRedeemReward(selectedReward)
                  setSelectedReward(null)
                }}>
                  Confirm
                </Button>
                <Button variant="outline" onClick={() => setSelectedReward(null)}>
                  Cancel
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}

// Tier Progress Component
interface TierProgressProps {
  currentTier: LoyaltyTier
  totalPoints: number
  nextTier?: LoyaltyTier
  className?: string
}

export function TierProgress({ currentTier, totalPoints, nextTier, className }: TierProgressProps) {
  const progress = nextTier
    ? ((totalPoints - currentTier.minPoints) / (nextTier.minPoints - currentTier.minPoints)) * 100
    : 100

  return (
    <Card className={cn("", className)}>
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className={cn("p-3 rounded-full", currentTier.color)}>
              <currentTier.icon className="h-6 w-6 text-white" />
            </div>
            <div>
              <h3 className="font-semibold">{currentTier.name} Member</h3>
              <p className="text-sm text-muted-foreground">
                {totalPoints.toLocaleString()} points earned
              </p>
            </div>
          </div>

          {nextTier && (
            <div className="text-right">
              <div className="text-sm font-medium">{nextTier.name}</div>
              <div className="text-xs text-muted-foreground">
                {(nextTier.minPoints - totalPoints).toLocaleString()} points to go
              </div>
            </div>
          )}
        </div>

        {nextTier && (
          <div className="space-y-2">
            <Progress value={Math.min(progress, 100)} className="h-3" />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>{currentTier.minPoints.toLocaleString()}</span>
              <span>{nextTier.minPoints.toLocaleString()}</span>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

// Export types
export type { LoyaltyTier, CustomerLoyalty, LoyaltyProgramProps, TierProgressProps }
