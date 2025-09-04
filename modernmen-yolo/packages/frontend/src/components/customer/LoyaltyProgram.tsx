'use client'

import React, { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  Gift,
  Star,
  Trophy,
  Crown,
  Zap,
  ShoppingBag,
  Calendar,
  Target,
  Award,
  Coins,
  TrendingUp,
  CheckCircle
} from 'lucide-react'

// Mock loyalty data
const mockLoyaltyData = {
  currentPoints: 250,
  lifetimePoints: 1250,
  tier: 'Gold',
  nextTierPoints: 300,
  pointsToNextTier: 50,
  tierProgress: 83, // percentage
  recentTransactions: [
    { id: 1, type: 'earned', points: 35, description: 'Haircut service', date: '2024-01-15' },
    { id: 2, type: 'earned', points: 25, description: 'Beard grooming', date: '2024-01-12' },
    { id: 3, type: 'redeemed', points: -100, description: 'Free haircut', date: '2024-01-10' },
    { id: 4, type: 'earned', points: 55, description: 'Hair & beard combo', date: '2024-01-08' },
  ]
}

const availableRewards = [
  {
    id: 1,
    name: 'Free Haircut',
    points: 100,
    description: 'Complimentary haircut service',
    category: 'Service',
    icon: 'Scissors',
    available: true
  },
  {
    id: 2,
    name: 'Free Beard Grooming',
    points: 80,
    description: 'Complimentary beard grooming',
    category: 'Service',
    icon: 'Scissors',
    available: true
  },
  {
    id: 3,
    name: '$25 Gift Card',
    points: 250,
    description: 'Store credit for future services',
    category: 'Gift Card',
    icon: 'Gift',
    available: true
  },
  {
    id: 4,
    name: 'VIP Priority Booking',
    points: 150,
    description: 'Skip the line for appointment booking',
    category: 'Premium',
    icon: 'Crown',
    available: true
  },
  {
    id: 5,
    name: 'Complimentary Consultation',
    points: 50,
    description: 'Free styling consultation',
    category: 'Service',
    icon: 'Star',
    available: true
  }
]

const tierBenefits = {
  Bronze: [
    'Earn 1 point per $1 spent',
    'Birthday free service',
    'Email appointment reminders'
  ],
  Silver: [
    'Earn 1.25 points per $1 spent',
    'Priority booking',
    'SMS appointment reminders',
    '10% off retail products'
  ],
  Gold: [
    'Earn 1.5 points per $1 spent',
    'VIP priority booking',
    'Free monthly consultation',
    '15% off retail products',
    'Exclusive member events'
  ],
  Platinum: [
    'Earn 2 points per $1 spent',
    'Dedicated stylist assignment',
    'Free quarterly service',
    '20% off retail products',
    'Private client lounge access'
  ]
}

export function LoyaltyProgram() {
  const [selectedReward, setSelectedReward] = useState<any>(null)
  const [showRedeemDialog, setShowRedeemDialog] = useState(false)

  const handleRedeemReward = (reward: any) => {
    setSelectedReward(reward)
    setShowRedeemDialog(true)
  }

  const confirmRedemption = () => {
    // In real app, this would make an API call
    console.log('Redeeming reward:', selectedReward)
    setShowRedeemDialog(false)
    setSelectedReward(null)
    // Update points balance
  }

  const getTierIcon = (tier: string) => {
    switch (tier) {
      case 'Bronze': return <Trophy className="h-5 w-5 text-orange-500" />
      case 'Silver': return <Star className="h-5 w-5 text-gray-400" />
      case 'Gold': return <Award className="h-5 w-5 text-yellow-500" />
      case 'Platinum': return <Crown className="h-5 w-5 text-purple-500" />
      default: return <Star className="h-5 w-5" />
    }
  }

  return (
    <div className="space-y-6">
      {/* Current Status */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Gift className="h-5 w-5" />
            Loyalty Program Status
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-primary">
                {mockLoyaltyData.currentPoints}
              </div>
              <div className="text-sm text-muted-foreground">Available Points</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold">
                {mockLoyaltyData.lifetimePoints}
              </div>
              <div className="text-sm text-muted-foreground">Lifetime Points</div>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center gap-2">
                {getTierIcon(mockLoyaltyData.tier)}
                <span className="text-2xl font-bold">{mockLoyaltyData.tier}</span>
              </div>
              <div className="text-sm text-muted-foreground">Current Tier</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">
                {mockLoyaltyData.pointsToNextTier}
              </div>
              <div className="text-sm text-muted-foreground">Points to Next Tier</div>
            </div>
          </div>

          {/* Progress to Next Tier */}
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Progress to Platinum</span>
              <span>{mockLoyaltyData.currentPoints} / {mockLoyaltyData.nextTierPoints} points</span>
            </div>
            <Progress value={mockLoyaltyData.tierProgress} className="h-3" />
            <div className="text-xs text-muted-foreground">
              {mockLoyaltyData.pointsToNextTier} points until next reward upgrade
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Program Details */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="h-5 w-5" />
            Program Details
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="benefits" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="benefits">Tier Benefits</TabsTrigger>
              <TabsTrigger value="rewards">Available Rewards</TabsTrigger>
              <TabsTrigger value="history">Points History</TabsTrigger>
            </TabsList>

            <TabsContent value="benefits" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {Object.entries(tierBenefits).map(([tier, benefits]) => (
                  <Card key={tier} className={tier === mockLoyaltyData.tier ? 'border-primary' : ''}>
                    <CardHeader className="pb-3">
                      <CardTitle className="flex items-center gap-2 text-lg">
                        {getTierIcon(tier)}
                        {tier} Tier
                        {tier === mockLoyaltyData.tier && (
                          <Badge variant="secondary">Current</Badge>
                        )}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-2">
                        {benefits.map((benefit, index) => (
                          <li key={index} className="flex items-center gap-2 text-sm">
                            <CheckCircle className="h-4 w-4 text-green-500 flex-shrink-0" />
                            {benefit}
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="rewards" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {availableRewards.map((reward) => (
                  <Card key={reward.id} className="relative">
                    <CardHeader className="pb-3">
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-lg">{reward.name}</CardTitle>
                        <Badge variant="outline" className="flex items-center gap-1">
                          <Coins className="h-3 w-3" />
                          {reward.points}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground mb-4">
                        {reward.description}
                      </p>
                      <div className="flex items-center justify-between">
                        <Badge variant="secondary">{reward.category}</Badge>
                        <Button
                          size="sm"
                          onClick={() => handleRedeemReward(reward)}
                          disabled={mockLoyaltyData.currentPoints < reward.points}
                        >
                          {mockLoyaltyData.currentPoints >= reward.points ? 'Redeem' : 'Need Points'}
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="history" className="space-y-4">
              <div className="space-y-3">
                {mockLoyaltyData.recentTransactions.map((transaction) => (
                  <div key={transaction.id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-full ${
                        transaction.type === 'earned'
                          ? 'bg-green-100 text-green-600'
                          : 'bg-blue-100 text-blue-600'
                      }`}>
                        {transaction.type === 'earned' ? (
                          <TrendingUp className="h-4 w-4" />
                        ) : (
                          <ShoppingBag className="h-4 w-4" />
                        )}
                      </div>
                      <div>
                        <p className="font-medium">{transaction.description}</p>
                        <p className="text-sm text-muted-foreground">
                          {new Date(transaction.date).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <div className={`font-semibold ${
                      transaction.type === 'earned' ? 'text-green-600' : 'text-blue-600'
                    }`}>
                      {transaction.points > 0 ? '+' : ''}{transaction.points} pts
                    </div>
                  </div>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* Redemption Confirmation Dialog */}
      <Dialog open={showRedeemDialog} onOpenChange={setShowRedeemDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Reward Redemption</DialogTitle>
          </DialogHeader>
          {selectedReward && (
            <div className="space-y-4">
              <div className="text-center">
                <div className="text-3xl font-bold text-primary mb-2">
                  {selectedReward.points} Points
                </div>
                <h3 className="text-xl font-semibold">{selectedReward.name}</h3>
                <p className="text-muted-foreground">{selectedReward.description}</p>
              </div>

              <div className="bg-muted p-4 rounded-lg">
                <div className="flex justify-between items-center mb-2">
                  <span>Current Balance:</span>
                  <span className="font-semibold">{mockLoyaltyData.currentPoints} pts</span>
                </div>
                <div className="flex justify-between items-center mb-2">
                  <span>Reward Cost:</span>
                  <span className="font-semibold text-red-600">-{selectedReward.points} pts</span>
                </div>
                <hr className="my-2" />
                <div className="flex justify-between items-center">
                  <span>New Balance:</span>
                  <span className="font-semibold text-green-600">
                    {mockLoyaltyData.currentPoints - selectedReward.points} pts
                  </span>
                </div>
              </div>

              <div className="flex gap-3">
                <Button
                  variant="outline"
                  className="flex-1"
                  onClick={() => setShowRedeemDialog(false)}
                >
                  Cancel
                </Button>
                <Button
                  className="flex-1"
                  onClick={confirmRedemption}
                >
                  Confirm Redemption
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
