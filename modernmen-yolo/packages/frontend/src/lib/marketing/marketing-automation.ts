// Advanced Marketing Automation & Personalization System
// AI-driven marketing campaigns, customer segmentation, and automated engagement

export interface MarketingCampaign {
  id: string
  name: string
  type: 'email' | 'sms' | 'push' | 'social' | 'display' | 'multichannel'
  status: 'draft' | 'scheduled' | 'running' | 'paused' | 'completed' | 'cancelled'
  targetAudience: {
    segmentIds: string[]
    customFilters: Record<string, any>
    size: number
  }
  content: {
    subject?: string
    message: string
    media: Array<{
      type: 'image' | 'video' | 'link'
      url: string
      alt: string
    }>
    callToAction: {
      text: string
      url: string
      type: 'primary' | 'secondary'
    }
  }
  schedule: {
    startDate: Date
    endDate?: Date
    sendTime: string
    frequency: 'once' | 'daily' | 'weekly' | 'monthly'
    timezone: string
  }
  performance: {
    sent: number
    delivered: number
    opened: number
    clicked: number
    converted: number
    revenue: number
    unsubscribe: number
  }
  automation: {
    triggers: Array<{
      event: string
      conditions: Record<string, any>
      delay: number // minutes
      action: string
    }>
    aBTest: {
      enabled: boolean
      variable: string
      variations: string[]
      winner: string
    }
    personalization: {
      enabled: boolean
      variables: string[]
      dynamicContent: boolean
    }
  }
}

export interface CustomerJourneyAutomation {
  id: string
  name: string
  trigger: {
    event: 'new_customer' | 'appointment_booked' | 'service_completed' | 'birthday' | 'inactive_customer'
    conditions: Record<string, any>
  }
  steps: Array<{
    id: string
    order: number
    delay: number // minutes after trigger
    channel: 'email' | 'sms' | 'push'
    content: {
      template: string
      personalization: Record<string, string>
    }
    conditions: Array<{
      field: string
      operator: string
      value: any
      action: 'continue' | 'skip' | 'exit'
    }>
  }>
  analytics: {
    enrolled: number
    completed: number
    conversionRate: number
    revenue: number
  }
}

export interface MarketingIntelligence {
  audience: {
    segments: Array<{
      id: string
      name: string
      size: number
      characteristics: Record<string, any>
      engagement: {
        openRate: number
        clickRate: number
        conversionRate: number
      }
    }>
    personas: Array<{
      id: string
      name: string
      description: string
      size: number
      preferences: Record<string, any>
      behavior: Record<string, any>
    }>
  }
  channels: {
    performance: {
      channel: string
      reach: number
      engagement: number
      conversion: number
      costPerAcquisition: number
      roi: number
    }[]
    recommendations: Array<{
      channel: string
      action: 'increase' | 'decrease' | 'test' | 'optimize'
      reason: string
      expectedImpact: number
    }>
  }
  content: {
    topPerforming: Array<{
      contentId: string
      type: string
      title: string
      performance: {
        views: number
        engagement: number
        conversions: number
        revenue: number
      }
    }>
    recommendations: Array<{
      topic: string
      format: string
      targetAudience: string
      expectedPerformance: number
    }>
  }
}

export interface PersonalizationEngine {
  customerId: string
  preferences: {
    services: string[]
    communication: {
      preferredChannel: string
      frequency: string
      timeOfDay: string
      contentTopics: string[]
    }
    pricing: {
      sensitivity: 'low' | 'medium' | 'high'
      preferredDiscounts: string[]
    }
  }
  behavior: {
    purchaseHistory: Array<{
      service: string
      date: Date
      satisfaction: number
    }>
    engagementHistory: Array<{
      channel: string
      action: string
      date: Date
      value: number
    }>
  }
  recommendations: {
    nextBestService: {
      serviceId: string
      confidence: number
      reasoning: string
    }
    optimalTiming: {
      day: string
      time: string
      confidence: number
    }
    personalizedOffer: {
      type: string
      value: number
      conditions: string
    }
  }
}

class MarketingAutomation {
  private readonly API_BASE = '/api/marketing'

  // Campaign Management
  async createCampaign(campaign: Omit<MarketingCampaign, 'id' | 'status' | 'performance'>): Promise<MarketingCampaign> {
    try {
      const response = await fetch(`${this.API_BASE}/campaigns`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(campaign)
      })

      if (!response.ok) throw new Error('Failed to create campaign')
      const createdCampaign = await response.json()

      return {
        ...createdCampaign,
        schedule: {
          ...createdCampaign.schedule,
          startDate: new Date(createdCampaign.schedule.startDate),
          endDate: createdCampaign.schedule.endDate ? new Date(createdCampaign.schedule.endDate) : undefined
        }
      }
    } catch (error) {
      console.error('Failed to create campaign:', error)
      throw error
    }
  }

  async getCampaigns(status?: string): Promise<MarketingCampaign[]> {
    try {
      const params = new URLSearchParams(status ? { status } : {})
      const response = await fetch(`${this.API_BASE}/campaigns?${params}`)

      if (!response.ok) throw new Error('Failed to get campaigns')
      const campaigns = await response.json()

      return campaigns.map((campaign: any) => ({
        ...campaign,
        schedule: {
          ...campaign.schedule,
          startDate: new Date(campaign.schedule.startDate),
          endDate: campaign.schedule.endDate ? new Date(campaign.schedule.endDate) : undefined
        }
      }))
    } catch (error) {
      console.error('Failed to get campaigns:', error)
      throw error
    }
  }

  async updateCampaignStatus(
    campaignId: string,
    status: MarketingCampaign['status']
  ): Promise<MarketingCampaign> {
    try {
      const response = await fetch(`${this.API_BASE}/campaigns/${campaignId}/status`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status })
      })

      if (!response.ok) throw new Error('Failed to update campaign status')
      const campaign = await response.json()

      return {
        ...campaign,
        schedule: {
          ...campaign.schedule,
          startDate: new Date(campaign.schedule.startDate),
          endDate: campaign.schedule.endDate ? new Date(campaign.schedule.endDate) : undefined
        }
      }
    } catch (error) {
      console.error('Failed to update campaign status:', error)
      throw error
    }
  }

  // Customer Journey Automation
  async createJourneyAutomation(
    automation: Omit<CustomerJourneyAutomation, 'id' | 'analytics'>
  ): Promise<CustomerJourneyAutomation> {
    try {
      const response = await fetch(`${this.API_BASE}/journey-automation`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(automation)
      })

      if (!response.ok) throw new Error('Failed to create journey automation')
      return await response.json()
    } catch (error) {
      console.error('Failed to create journey automation:', error)
      throw error
    }
  }

  async getJourneyAutomations(): Promise<CustomerJourneyAutomation[]> {
    try {
      const response = await fetch(`${this.API_BASE}/journey-automation`)
      if (!response.ok) throw new Error('Failed to get journey automations')

      return await response.json()
    } catch (error) {
      console.error('Failed to get journey automations:', error)
      throw error
    }
  }

  // Marketing Intelligence
  async getMarketingIntelligence(): Promise<MarketingIntelligence> {
    try {
      const response = await fetch(`${this.API_BASE}/intelligence`)
      if (!response.ok) throw new Error('Failed to get marketing intelligence')

      return await response.json()
    } catch (error) {
      console.error('Failed to get marketing intelligence:', error)
      throw error
    }
  }

  // Personalization Engine
  async getPersonalizationProfile(customerId: string): Promise<PersonalizationEngine> {
    try {
      const response = await fetch(`${this.API_BASE}/personalization/${customerId}`)
      if (!response.ok) throw new Error('Failed to get personalization profile')

      const profile = await response.json()
      return {
        ...profile,
        behavior: {
          ...profile.behavior,
          purchaseHistory: profile.behavior.purchaseHistory.map((purchase: any) => ({
            ...purchase,
            date: new Date(purchase.date)
          })),
          engagementHistory: profile.behavior.engagementHistory.map((engagement: any) => ({
            ...engagement,
            date: new Date(engagement.date)
          }))
        }
      }
    } catch (error) {
      console.error('Failed to get personalization profile:', error)
      throw error
    }
  }

  // A/B Testing
  async createABTest(
    campaignId: string,
    test: {
      name: string
      variable: 'subject' | 'content' | 'design' | 'timing'
      variations: Array<{
        name: string
        value: string
        weight: number
      }>
      duration: number // days
      targetSampleSize: number
    }
  ): Promise<{
    testId: string
    status: 'running' | 'completed' | 'cancelled'
    results: {
      winner: string
      confidence: number
      improvement: number
      recommendations: string[]
    }
  }> {
    try {
      const response = await fetch(`${this.API_BASE}/campaigns/${campaignId}/ab-test`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(test)
      })

      if (!response.ok) throw new Error('Failed to create A/B test')
      return await response.json()
    } catch (error) {
      console.error('Failed to create A/B test:', error)
      throw error
    }
  }

  // Dynamic Content Generation
  async generateDynamicContent(
    audience: string[],
    context: {
      occasion?: string
      recentActivity?: string
      preferences?: string[]
      location?: string
    }
  ): Promise<{
    subject: string
    content: string
    personalization: Record<string, string>
    predictedPerformance: {
      openRate: number
      clickRate: number
      conversionRate: number
    }
  }> {
    try {
      const response = await fetch(`${this.API_BASE}/dynamic-content`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          audience,
          context
        })
      })

      if (!response.ok) throw new Error('Failed to generate dynamic content')
      return await response.json()
    } catch (error) {
      console.error('Failed to generate dynamic content:', error)
      throw error
    }
  }

  // Campaign Optimization
  async optimizeCampaign(
    campaignId: string,
    optimization: {
      goals: string[]
      constraints: Record<string, any>
      timeHorizon: number // hours
    }
  ): Promise<{
    optimizedSchedule: {
      sendTime: string
      frequency: string
      segmentation: string[]
    }
    contentOptimization: {
      subject: string
      content: string
      callToAction: string
    }
    audienceOptimization: {
      segments: string[]
      size: number
      expectedPerformance: {
        openRate: number
        clickRate: number
        conversionRate: number
      }
    }
    budgetOptimization: {
      recommendedBudget: number
      expectedROI: number
      costPerAcquisition: number
    }
  }> {
    try {
      const response = await fetch(`${this.API_BASE}/campaigns/${campaignId}/optimize`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(optimization)
      })

      if (!response.ok) throw new Error('Failed to optimize campaign')
      return await response.json()
    } catch (error) {
      console.error('Failed to optimize campaign:', error)
      throw error
    }
  }

  // Predictive Analytics for Marketing
  async predictMarketingPerformance(
    campaign: Omit<MarketingCampaign, 'id' | 'status' | 'performance'>
  ): Promise<{
    predictedPerformance: {
      openRate: number
      clickRate: number
      conversionRate: number
      revenue: number
    }
    confidence: number
    factors: Array<{
      factor: string
      impact: number
      reasoning: string
    }>
    recommendations: Array<{
      type: 'content' | 'timing' | 'audience' | 'budget'
      suggestion: string
      expectedImprovement: number
    }>
  }> {
    try {
      const response = await fetch(`${this.API_BASE}/predict-performance`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(campaign)
      })

      if (!response.ok) throw new Error('Failed to predict marketing performance')
      return await response.json()
    } catch (error) {
      console.error('Failed to predict marketing performance:', error)
      throw error
    }
  }

  // Multi-channel Campaign Orchestration
  async orchestrateMultiChannelCampaign(
    campaign: {
      name: string
      audience: string[]
      channels: Array<{
        type: 'email' | 'sms' | 'push' | 'social'
        content: string
        timing: {
          delay: number // minutes after trigger
          optimalTime: string
        }
      }>
      triggers: Array<{
        event: string
        conditions: Record<string, any>
      }>
      goals: string[]
    }
  ): Promise<{
    campaignId: string
    orchestrationPlan: {
      sequence: Array<{
        channel: string
        timing: string
        content: string
        targetSegment: string
      }>
      dependencies: Array<{
        from: string
        to: string
        condition: string
      }>
    }
    predictedPerformance: {
      reach: number
      engagement: number
      conversions: number
      revenue: number
    }
    optimization: {
      bestSequence: string[]
      recommendedAdjustments: string[]
      expectedImprovement: number
    }
  }> {
    try {
      const response = await fetch(`${this.API_BASE}/orchestrate-multichannel`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(campaign)
      })

      if (!response.ok) throw new Error('Failed to orchestrate multi-channel campaign')
      return await response.json()
    } catch (error) {
      console.error('Failed to orchestrate multi-channel campaign:', error)
      throw error
    }
  }
}

export const marketingAutomation = new MarketingAutomation()

// React Hook for Marketing Automation
export function useMarketingAutomation() {
  return {
    createCampaign: marketingAutomation.createCampaign.bind(marketingAutomation),
    getCampaigns: marketingAutomation.getCampaigns.bind(marketingAutomation),
    updateCampaignStatus: marketingAutomation.updateCampaignStatus.bind(marketingAutomation),
    createJourneyAutomation: marketingAutomation.createJourneyAutomation.bind(marketingAutomation),
    getJourneyAutomations: marketingAutomation.getJourneyAutomations.bind(marketingAutomation),
    getMarketingIntelligence: marketingAutomation.getMarketingIntelligence.bind(marketingAutomation),
    getPersonalizationProfile: marketingAutomation.getPersonalizationProfile.bind(marketingAutomation),
    createABTest: marketingAutomation.createABTest.bind(marketingAutomation),
    generateDynamicContent: marketingAutomation.generateDynamicContent.bind(marketingAutomation),
    optimizeCampaign: marketingAutomation.optimizeCampaign.bind(marketingAutomation),
    predictMarketingPerformance: marketingAutomation.predictMarketingPerformance.bind(marketingAutomation),
    orchestrateMultiChannelCampaign: marketingAutomation.orchestrateMultiChannelCampaign.bind(marketingAutomation)
  }
}
