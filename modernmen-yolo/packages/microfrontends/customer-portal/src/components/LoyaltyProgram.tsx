import React from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { ArrowLeft, Star, Gift, Trophy, Award, Target } from 'lucide-react';

interface LoyaltyTier {
  name: string;
  minPoints: number;
  maxPoints: number;
  color: string;
  benefits: string[];
}

interface LoyaltyStats {
  currentPoints: number;
  currentTier: string;
  pointsToNextTier: number;
  totalVisits: number;
  totalSpent: number;
  memberSince: string;
}

const LoyaltyProgram: React.FC = () => {
  const tiers: LoyaltyTier[] = [
    {
      name: 'Bronze',
      minPoints: 0,
      maxPoints: 99,
      color: 'bg-orange-500',
      benefits: [
        '10% off services',
        'Birthday month special',
        'Priority booking'
      ]
    },
    {
      name: 'Silver',
      minPoints: 100,
      maxPoints: 249,
      color: 'bg-gray-400',
      benefits: [
        '15% off services',
        'Free coffee/tea',
        'Extended booking window',
        'Loyalty rewards faster'
      ]
    },
    {
      name: 'Gold',
      minPoints: 250,
      maxPoints: 499,
      color: 'bg-yellow-500',
      benefits: [
        '20% off services',
        'Free beverage upgrade',
        'VIP waiting area',
        'Exclusive styling tips',
        'Monthly free service'
      ]
    },
    {
      name: 'Platinum',
      minPoints: 500,
      maxPoints: 999,
      color: 'bg-purple-500',
      benefits: [
        '25% off all services',
        'Complimentary consultations',
        'Dedicated stylist',
        'Emergency same-day booking',
        'Exclusive product discounts'
      ]
    },
    {
      name: 'Diamond',
      minPoints: 1000,
      maxPoints: Infinity,
      color: 'bg-blue-500',
      benefits: [
        '30% off all services',
        'All premium benefits',
        'Annual styling package',
        '24/7 concierge service',
        'Exclusive member events'
      ]
    }
  ];

  const { data: stats, isLoading } = useQuery({
    queryKey: ['loyalty-stats'],
    queryFn: async (): Promise<LoyaltyStats> => {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      return {
        currentPoints: 245,
        currentTier: 'Gold',
        pointsToNextTier: 5,
        totalVisits: 23,
        totalSpent: 825,
        memberSince: '2023-06-15'
      };
    }
  });

  const currentTier = tiers.find(tier => tier.name === stats?.currentTier);
  const currentTierIndex = tiers.findIndex(tier => tier.name === stats?.currentTier);
  const nextTier = tiers[currentTierIndex + 1];

  const progressPercentage = stats && nextTier
    ? ((stats.currentPoints - (currentTier?.minPoints || 0)) /
       ((nextTier?.minPoints || 0) - (currentTier?.minPoints || 0))) * 100
    : 100;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <Link
          to="/"
          className="flex items-center text-gray-600 hover:text-gray-900 mb-4"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Dashboard
        </Link>

        <div>
          <h1 className="text-3xl font-bold text-gray-900">Loyalty Program</h1>
          <p className="text-gray-600 mt-2">Earn points and unlock exclusive benefits</p>
        </div>
      </div>

      {/* Current Status Card */}
      <div className="bg-white rounded-lg shadow mb-8 p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Current Tier: {stats?.currentTier}</h2>
            <p className="text-gray-600">Member since {stats?.memberSince}</p>
          </div>
          <div className={`w-16 h-16 rounded-full ${currentTier?.color} flex items-center justify-center`}>
            <Trophy className="h-8 w-8 text-white" />
          </div>
        </div>

        {/* Progress to Next Tier */}
        {nextTier && (
          <div className="mb-6">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium text-gray-700">
                Progress to {nextTier.name}
              </span>
              <span className="text-sm text-gray-600">
                {stats?.currentPoints} / {nextTier.minPoints} points
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3">
              <div
                className={`h-3 rounded-full ${nextTier.color} transition-all duration-500`}
                style={{ width: `${Math.min(progressPercentage, 100)}%` }}
              ></div>
            </div>
            <p className="text-xs text-gray-500 mt-1">
              {stats?.pointsToNextTier} points to next tier
            </p>
          </div>
        )}

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">{stats?.currentPoints}</div>
            <div className="text-sm text-gray-600">Current Points</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">{stats?.totalVisits}</div>
            <div className="text-sm text-gray-600">Total Visits</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-purple-600">${stats?.totalSpent}</div>
            <div className="text-sm text-gray-600">Total Spent</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-orange-600">{stats?.currentTier}</div>
            <div className="text-sm text-gray-600">Current Tier</div>
          </div>
        </div>
      </div>

      {/* Current Tier Benefits */}
      <div className="bg-white rounded-lg shadow mb-8">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-medium text-gray-900">Your Current Benefits</h2>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {currentTier?.benefits.map((benefit, index) => (
              <div key={index} className="flex items-center space-x-3">
                <div className="flex-shrink-0">
                  <div className={`w-8 h-8 rounded-full ${currentTier.color} flex items-center justify-center`}>
                    <Star className="h-4 w-4 text-white" />
                  </div>
                </div>
                <span className="text-sm text-gray-700">{benefit}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* All Tiers Overview */}
      <div className="bg-white rounded-lg shadow mb-8">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-medium text-gray-900">Loyalty Tiers</h2>
        </div>
        <div className="p-6">
          <div className="space-y-4">
            {tiers.map((tier, index) => {
              const isCurrentTier = tier.name === stats?.currentTier;
              const isCompletedTier = index < currentTierIndex;

              return (
                <div
                  key={tier.name}
                  className={`border rounded-lg p-4 ${
                    isCurrentTier ? 'border-blue-500 bg-blue-50' : 'border-gray-200'
                  }`}
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center space-x-3">
                      <div className={`w-10 h-10 rounded-full ${tier.color} flex items-center justify-center`}>
                        {isCompletedTier ? (
                          <Award className="h-5 w-5 text-white" />
                        ) : isCurrentTier ? (
                          <Target className="h-5 w-5 text-white" />
                        ) : (
                          <Star className="h-5 w-5 text-white" />
                        )}
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900">{tier.name}</h3>
                        <p className="text-sm text-gray-600">
                          {tier.minPoints === 0 ? '0' : tier.minPoints}+ points
                        </p>
                      </div>
                    </div>

                    {isCurrentTier && (
                      <span className="px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-full">
                        Current Tier
                      </span>
                    )}

                    {isCompletedTier && (
                      <span className="px-2 py-1 text-xs font-medium bg-green-100 text-green-800 rounded-full">
                        Completed
                      </span>
                    )}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    {tier.benefits.map((benefit, benefitIndex) => (
                      <div key={benefitIndex} className="flex items-center space-x-2">
                        <Gift className="h-3 w-3 text-gray-400" />
                        <span className="text-xs text-gray-600">{benefit}</span>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* How to Earn Points */}
      <div className="bg-white rounded-lg shadow">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-medium text-gray-900">How to Earn Points</h2>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-medium text-gray-900 mb-3">Earning Points</h3>
              <ul className="space-y-2 text-sm text-gray-600">
                <li>• 10 points per $1 spent on services</li>
                <li>• 5 bonus points for leaving a review</li>
                <li>• 20 points for referring a new customer</li>
                <li>• Double points on your birthday month</li>
                <li>• 15 points for booking online</li>
              </ul>
            </div>

            <div>
              <h3 className="font-medium text-gray-900 mb-3">Point Values</h3>
              <ul className="space-y-2 text-sm text-gray-600">
                <li>• Haircut: 10-50 points</li>
                <li>• Beard Service: 5-25 points</li>
                <li>• Shave: 5-20 points</li>
                <li>• Combo Services: 15-75 points</li>
                <li>• Products: 1 point per $2 spent</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoyaltyProgram;
