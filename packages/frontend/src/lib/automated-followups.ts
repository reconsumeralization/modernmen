export interface FollowUpTrigger {
  id: string
  type: 'appointment_reminder' | 'post_service' | 'reengagement' | 'birthday' | 'loyalty_milestone' | 'feedback_request' | 'special_offer'
  conditions: {
    daysAfter?: number
    hoursAfter?: number
    appointmentStatus?: string[]
    serviceType?: string[]
    customerSegment?: string[]
    lastInteractionDays?: number
  }
  priority: 'low' | 'medium' | 'high' | 'urgent'
  channels: ('email' | 'sms' | 'push' | 'chat')[]
  maxAttempts: number
  cooldownPeriod: number // hours
}

export interface FollowUpMessage {
  id: string
  triggerId: string
  customerId: string
  appointmentId?: string
  channel: 'email' | 'sms' | 'push' | 'chat'
  status: 'pending' | 'sent' | 'delivered' | 'opened' | 'clicked' | 'failed'
  subject?: string
  content: string
  personalizedFields: Record<string, any>
  scheduledFor: Date
  sentAt?: Date
  deliveredAt?: Date
  openedAt?: Date
  clickedAt?: Date
  failedAt?: Date
  failureReason?: string
  attemptCount: number
  nextRetryAt?: Date
}

export interface FollowUpTemplate {
  id: string
  triggerType: FollowUpTrigger['type']
  name: string
  subject?: string
  content: string
  variables: string[]
  personalizationRules?: {
    segmentBased: boolean
    timeBased: boolean
    behaviorBased: boolean
  }
  channelSpecific: {
    email?: {
      htmlTemplate: string
      textTemplate: string
    }
    sms?: {
      template: string
      maxLength: number
    }
    push?: {
      title: string
      body: string
      icon?: string
      actions?: Array<{
        action: string
        title: string
        icon?: string
      }>
    }
    chat?: {
      quickReplies?: string[]
      suggestedActions?: string[]
    }
  }
}

export interface FollowUpCampaign {
  id: string
  name: string
  description: string
  trigger: FollowUpTrigger
  template: FollowUpTemplate
  isActive: boolean
  targetSegment?: string
  schedule: {
    startDate: Date
    endDate?: Date
    timezone: string
    businessHoursOnly: boolean
  }
  performance: {
    totalTriggered: number
    totalSent: number
    totalDelivered: number
    totalOpened: number
    totalClicked: number
    totalConversions: number
    averageResponseTime: number
  }
  createdAt: Date
  updatedAt: Date
}

export interface CustomerFollowUpHistory {
  customerId: string
  followUps: FollowUpMessage[]
  preferences: {
    emailOptIn: boolean
    smsOptIn: boolean
    pushOptIn: boolean
    chatOptIn: boolean
    preferredChannel: 'email' | 'sms' | 'push' | 'chat'
    quietHours: {
      start: string // HH:MM format
      end: string // HH:MM format
    }
    frequencyLimit: {
      perDay: number
      perWeek: number
    }
  }
  lastInteraction: Date
  engagementScore: number
}

export class AutomatedFollowUps {
  private readonly API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || '/api'
  private activeCampaigns: Map<string, FollowUpCampaign> = new Map()
  private followUpQueue: FollowUpMessage[] = []
  private processingInterval: NodeJS.Timeout | null = null

  constructor() {
    this.initializeDefaultCampaigns()
    this.startProcessingQueue()
  }

  private initializeDefaultCampaigns(): void {
    // Appointment reminder campaign
    const appointmentReminder: FollowUpCampaign = {
      id: 'appointment_reminder_24h',
      name: 'Appointment Reminder (24h)',
      description: 'Send reminder 24 hours before appointment',
      trigger: {
        id: 'reminder_24h',
        type: 'appointment_reminder',
        conditions: {
          hoursAfter: -24, // 24 hours before
          appointmentStatus: ['confirmed']
        },
        priority: 'high',
        channels: ['email', 'sms', 'push'],
        maxAttempts: 3,
        cooldownPeriod: 1
      },
      template: {
        id: 'reminder_template',
        triggerType: 'appointment_reminder',
        name: 'Appointment Reminder',
        subject: 'Your appointment at Modern Men Salon tomorrow',
        content: 'Hi {customerName}, this is a friendly reminder of your appointment tomorrow at {appointmentTime} for {serviceName}. We look forward to seeing you!',
        variables: ['customerName', 'appointmentTime', 'serviceName', 'stylistName'],
        channelSpecific: {
          email: {
            htmlTemplate: `
              <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                <h2>Appointment Reminder</h2>
                <p>Hi {customerName},</p>
                <p>This is a friendly reminder of your upcoming appointment:</p>
                <div style="background: #f0f0f0; padding: 20px; border-radius: 8px; margin: 20px 0;">
                  <p><strong>Service:</strong> {serviceName}</p>
                  <p><strong>Date & Time:</strong> {appointmentDate} at {appointmentTime}</p>
                  <p><strong>Stylist:</strong> {stylistName}</p>
                  <p><strong>Location:</strong> {salonAddress}</p>
                </div>
                <p>If you need to reschedule or cancel, please contact us at least 2 hours in advance.</p>
                <p>We look forward to seeing you!</p>
                <p>Modern Men Salon Team</p>
              </div>
            `,
            textTemplate: 'Hi {customerName}, reminder: {serviceName} tomorrow at {appointmentTime} with {stylistName}. Contact us to reschedule.'
          },
          sms: {
            template: 'Hi {customerName}! Reminder: Your {serviceName} is tomorrow at {appointmentTime}. Call {phoneNumber} to reschedule.',
            maxLength: 160
          },
          push: {
            title: 'Appointment Tomorrow',
            body: '{serviceName} at {appointmentTime} with {stylistName}',
            actions: [
              { action: 'view', title: 'View Details' },
              { action: 'reschedule', title: 'Reschedule' }
            ]
          }
        }
      },
      isActive: true,
      schedule: {
        startDate: new Date(),
        timezone: 'America/New_York',
        businessHoursOnly: true
      },
      performance: {
        totalTriggered: 0,
        totalSent: 0,
        totalDelivered: 0,
        totalOpened: 0,
        totalClicked: 0,
        totalConversions: 0,
        averageResponseTime: 0
      },
      createdAt: new Date(),
      updatedAt: new Date()
    }

    // Post-service feedback campaign
    const feedbackCampaign: FollowUpCampaign = {
      id: 'post_service_feedback',
      name: 'Post-Service Feedback',
      description: 'Request feedback after service completion',
      trigger: {
        id: 'feedback_request',
        type: 'post_service',
        conditions: {
          hoursAfter: 2, // 2 hours after appointment
          appointmentStatus: ['completed']
        },
        priority: 'medium',
        channels: ['email', 'chat'],
        maxAttempts: 2,
        cooldownPeriod: 24
      },
      template: {
        id: 'feedback_template',
        triggerType: 'feedback_request',
        name: 'Service Feedback Request',
        subject: 'How was your experience at Modern Men Salon?',
        content: 'Hi {customerName}, thank you for choosing Modern Men Salon! We\'d love to hear about your experience. How would you rate your recent {serviceName} service?',
        variables: ['customerName', 'serviceName', 'appointmentDate'],
        channelSpecific: {
          email: {
            htmlTemplate: `
              <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                <h2>How was your experience?</h2>
                <p>Hi {customerName},</p>
                <p>Thank you for choosing Modern Men Salon for your {serviceName} on {appointmentDate}!</p>
                <p>Your feedback helps us serve you better. How would you rate your experience?</p>
                <div style="text-align: center; margin: 30px 0;">
                  <a href="{feedbackUrl}?rating=5" style="background: #10b981; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; margin: 0 5px;">⭐⭐⭐⭐⭐ Excellent</a>
                  <a href="{feedbackUrl}?rating=4" style="background: #059669; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; margin: 0 5px;">⭐⭐⭐⭐ Good</a>
                  <a href="{feedbackUrl}?rating=3" style="background: #d97706; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; margin: 0 5px;">⭐⭐⭐ Average</a>
                  <a href="{feedbackUrl}?rating=2" style="background: #dc2626; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; margin: 0 5px;">⭐⭐ Poor</a>
                  <a href="{feedbackUrl}?rating=1" style="background: #991b1b; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; margin: 0 5px;">⭐ Very Poor</a>
                </div>
                <p>Or <a href="{feedbackUrl}">leave detailed feedback</a></p>
                <p>Thank you for your time!</p>
                <p>Modern Men Salon Team</p>
              </div>
            `,
            textTemplate: 'Hi {customerName}, thanks for your {serviceName}! Rate your experience: {feedbackUrl}'
          },
          chat: {
            quickReplies: ['⭐⭐⭐⭐⭐ Excellent', '⭐⭐⭐⭐ Good', '⭐⭐⭐⭐ Average', '⭐⭐⭐ Poor', '⭐ Very Poor'],
            suggestedActions: ['Leave detailed feedback']
          }
        }
      },
      isActive: true,
      schedule: {
        startDate: new Date(),
        timezone: 'America/New_York',
        businessHoursOnly: false
      },
      performance: {
        totalTriggered: 0,
        totalSent: 0,
        totalDelivered: 0,
        totalOpened: 0,
        totalClicked: 0,
        totalConversions: 0,
        averageResponseTime: 0
      },
      createdAt: new Date(),
      updatedAt: new Date()
    }

    this.activeCampaigns.set(appointmentReminder.id, appointmentReminder)
    this.activeCampaigns.set(feedbackCampaign.id, feedbackCampaign)
  }

  async triggerFollowUp(
    customerId: string,
    triggerType: FollowUpTrigger['type'],
    context: {
      appointmentId?: string
      serviceType?: string
      additionalData?: Record<string, any>
    } = {}
  ): Promise<FollowUpMessage[]> {
    const matchingCampaigns = Array.from(this.activeCampaigns.values())
      .filter(campaign => campaign.trigger.type === triggerType)

    const followUps: FollowUpMessage[] = []

    for (const campaign of matchingCampaigns) {
      if (await this.shouldTriggerCampaign(campaign, customerId, context)) {
        const followUp = await this.createFollowUpMessage(campaign, customerId, context)
        if (followUp) {
          followUps.push(...followUp)
        }
      }
    }

    // Add to queue for processing
    this.followUpQueue.push(...followUps)

    return followUps
  }

  private async shouldTriggerCampaign(
    campaign: FollowUpCampaign,
    customerId: string,
    context: any
  ): Promise<boolean> {
    // Check customer preferences
    const customerPrefs = await this.getCustomerPreferences(customerId)
    if (!customerPrefs) return false

    // Check if customer has opted out of relevant channels
    const hasOptedChannels = campaign.trigger.channels.some(channel => {
      switch (channel) {
        case 'email': return customerPrefs.emailOptIn
        case 'sms': return customerPrefs.smsOptIn
        case 'push': return customerPrefs.pushOptIn
        case 'chat': return customerPrefs.chatOptIn
        default: return false
      }
    })

    if (!hasOptedChannels) return false

    // Check frequency limits
    const recentFollowUps = await this.getRecentFollowUps(customerId, 24) // Last 24 hours
    if (recentFollowUps.length >= customerPrefs.frequencyLimit.perDay) {
      return false
    }

    // Check business hours if required
    if (campaign.schedule.businessHoursOnly) {
      const now = new Date()
      const hour = now.getHours()
      if (hour < 9 || hour > 18) return false // Outside 9 AM - 6 PM
    }

    // Check cooldown period
    const lastFollowUp = await this.getLastFollowUp(customerId, campaign.trigger.type)
    if (lastFollowUp) {
      const hoursSinceLast = (Date.now() - lastFollowUp.sentAt!.getTime()) / (1000 * 60 * 60)
      if (hoursSinceLast < campaign.trigger.cooldownPeriod) {
        return false
      }
    }

    return true
  }

  private async createFollowUpMessage(
    campaign: FollowUpCampaign,
    customerId: string,
    context: any
  ): Promise<FollowUpMessage[] | null> {
    const customer = await this.getCustomerData(customerId)
    if (!customer) return null

    const personalizedFields = await this.generatePersonalizedFields(customer, context)

    const followUps: FollowUpMessage[] = []

    for (const channel of campaign.trigger.channels) {
      // Check if customer has opted in for this channel
      const customerPrefs = await this.getCustomerPreferences(customerId)
      const channelOptIn = this.getChannelOptIn(customerPrefs, channel)
      if (!channelOptIn) continue

      // Check quiet hours
      if (this.isInQuietHours(customerPrefs)) continue

      const content = this.generateChannelContent(campaign.template, channel, personalizedFields)

      const followUp: FollowUpMessage = {
        id: this.generateFollowUpId(),
        triggerId: campaign.trigger.id,
        customerId,
        appointmentId: context.appointmentId,
        channel,
        status: 'pending',
        subject: campaign.template.subject,
        content,
        personalizedFields,
        scheduledFor: this.calculateSendTime(campaign, customerPrefs),
        attemptCount: 0
      }

      followUps.push(followUp)
    }

    return followUps.length > 0 ? followUps : null
  }

  private generateChannelContent(
    template: FollowUpTemplate,
    channel: string,
    personalizedFields: Record<string, any>
  ): string {
    let content = ''

    switch (channel) {
      case 'email':
        content = template.channelSpecific.email?.htmlTemplate || template.content
        break
      case 'sms':
        content = template.channelSpecific.sms?.template || template.content
        break
      case 'push':
        content = template.channelSpecific.push?.body || template.content
        break
      case 'chat':
        content = template.content
        break
      default:
        content = template.content
    }

    // Replace variables
    Object.entries(personalizedFields).forEach(([key, value]) => {
      const placeholder = new RegExp(`{${key}}`, 'g')
      content = content.replace(placeholder, String(value))
    })

    return content
  }

  private async generatePersonalizedFields(customer: any, context: any): Promise<Record<string, any>> {
    const fields: Record<string, any> = {
      customerName: customer.name || customer.firstName + ' ' + customer.lastName,
      customerFirstName: customer.firstName,
      customerLastName: customer.lastName,
      customerEmail: customer.email,
      customerPhone: customer.phone,
      salonName: 'Modern Men Salon',
      salonAddress: '123 Style Street, Downtown, NY 10001',
      salonPhone: '(555) 123-4567',
      salonWebsite: 'https://modernmensalon.com'
    }

    if (context.appointmentId) {
      const appointment = await this.getAppointmentData(context.appointmentId)
      if (appointment) {
        fields.appointmentDate = new Date(appointment.date).toLocaleDateString()
        fields.appointmentTime = appointment.time
        fields.serviceName = appointment.serviceName
        fields.stylistName = appointment.stylistName
        fields.appointmentPrice = appointment.price
      }
    }

    // Add dynamic fields based on customer history
    const history = await this.getCustomerHistory(customer.id)
    if (history) {
      fields.lastVisitDate = history.lastVisit ? new Date(history.lastVisit).toLocaleDateString() : 'N/A'
      fields.totalVisits = history.totalVisits || 0
      fields.loyaltyTier = history.loyaltyTier || 'Bronze'
      fields.nextServiceRecommendation = history.nextRecommendedService || ''
    }

    return fields
  }

  private calculateSendTime(campaign: FollowUpCampaign, customerPrefs: any): Date {
    let sendTime = new Date()

    // Apply trigger timing
    if (campaign.trigger.conditions.hoursAfter) {
      sendTime.setHours(sendTime.getHours() + campaign.trigger.conditions.hoursAfter)
    } else if (campaign.trigger.conditions.daysAfter) {
      sendTime.setDate(sendTime.getDate() + campaign.trigger.conditions.daysAfter)
    }

    // Respect quiet hours
    if (customerPrefs?.quietHours) {
      const quietStart = this.parseTime(customerPrefs.quietHours.start)
      const quietEnd = this.parseTime(customerPrefs.quietHours.end)
      const sendHour = sendTime.getHours()

      if (sendHour >= quietStart && sendHour < quietEnd) {
        // Move to end of quiet hours
        sendTime.setHours(quietEnd, 0, 0, 0)
      }
    }

    // Respect business hours if required
    if (campaign.schedule.businessHoursOnly) {
      const hour = sendTime.getHours()
      if (hour < 9) {
        sendTime.setHours(9, 0, 0, 0)
      } else if (hour >= 18) {
        sendTime.setDate(sendTime.getDate() + 1)
        sendTime.setHours(9, 0, 0, 0)
      }
    }

    return sendTime
  }

  private parseTime(timeString: string): number {
    const [hours, minutes] = timeString.split(':').map(Number)
    return hours
  }

  private getChannelOptIn(customerPrefs: any, channel: string): boolean {
    switch (channel) {
      case 'email': return customerPrefs?.emailOptIn ?? true
      case 'sms': return customerPrefs?.smsOptIn ?? false
      case 'push': return customerPrefs?.pushOptIn ?? false
      case 'chat': return customerPrefs?.chatOptIn ?? true
      default: return false
    }
  }

  private isInQuietHours(customerPrefs: any): boolean {
    if (!customerPrefs?.quietHours) return false

    const now = new Date()
    const currentTime = now.getHours() * 60 + now.getMinutes()
    const quietStart = this.parseTime(customerPrefs.quietHours.start) * 60
    const quietEnd = this.parseTime(customerPrefs.quietHours.end) * 60

    if (quietStart < quietEnd) {
      return currentTime >= quietStart && currentTime < quietEnd
    } else {
      // Quiet hours span midnight
      return currentTime >= quietStart || currentTime < quietEnd
    }
  }

  private startProcessingQueue(): void {
    this.processingInterval = setInterval(async () => {
      await this.processFollowUpQueue()
    }, 60000) // Process every minute
  }

  private async processFollowUpQueue(): Promise<void> {
    const now = new Date()
    const pendingFollowUps = this.followUpQueue.filter(
      followUp => followUp.status === 'pending' && followUp.scheduledFor <= now
    )

    for (const followUp of pendingFollowUps) {
      try {
        await this.sendFollowUp(followUp)
        followUp.status = 'sent'
        followUp.sentAt = new Date()
        followUp.attemptCount++
      } catch (error) {
        console.error('Failed to send follow-up:', error)
        followUp.attemptCount++
        followUp.status = 'failed'
        followUp.failureReason = error.message
        followUp.failedAt = new Date()

        // Schedule retry if under max attempts
        if (followUp.attemptCount < (this.activeCampaigns.get(followUp.triggerId)?.trigger.maxAttempts || 3)) {
          followUp.nextRetryAt = new Date(Date.now() + (followUp.attemptCount * 60 * 60 * 1000)) // Exponential backoff
          followUp.status = 'pending'
        }
      }
    }

    // Remove completed/failed follow-ups from queue
    this.followUpQueue = this.followUpQueue.filter(
      followUp => followUp.status === 'pending'
    )
  }

  private async sendFollowUp(followUp: FollowUpMessage): Promise<void> {
    const payload = {
      to: followUp.customerId,
      channel: followUp.channel,
      subject: followUp.subject,
      content: followUp.content,
      metadata: followUp.personalizedFields
    }

    const response = await fetch(`${this.API_BASE_URL}/followups/send`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    })

    if (!response.ok) {
      throw new Error(`Failed to send ${followUp.channel} follow-up`)
    }
  }

  // Utility methods for data retrieval
  private async getCustomerData(customerId: string): Promise<any> {
    try {
      const response = await fetch(`${this.API_BASE_URL}/customers/${customerId}`)
      if (!response.ok) throw new Error('Customer not found')
      return await response.json()
    } catch (error) {
      console.error('Failed to get customer data:', error)
      return null
    }
  }

  private async getAppointmentData(appointmentId: string): Promise<any> {
    try {
      const response = await fetch(`${this.API_BASE_URL}/appointments/${appointmentId}`)
      if (!response.ok) throw new Error('Appointment not found')
      return await response.json()
    } catch (error) {
      console.error('Failed to get appointment data:', error)
      return null
    }
  }

  private async getCustomerPreferences(customerId: string): Promise<any> {
    try {
      const response = await fetch(`${this.API_BASE_URL}/customers/${customerId}/preferences`)
      if (!response.ok) throw new Error('Preferences not found')
      return await response.json()
    } catch (error) {
      // Return default preferences
      return {
        emailOptIn: true,
        smsOptIn: false,
        pushOptIn: false,
        chatOptIn: true,
        preferredChannel: 'email',
        quietHours: { start: '22:00', end: '08:00' },
        frequencyLimit: { perDay: 3, perWeek: 10 }
      }
    }
  }

  private async getCustomerHistory(customerId: string): Promise<any> {
    try {
      const response = await fetch(`${this.API_BASE_URL}/customers/${customerId}/history`)
      if (!response.ok) throw new Error('History not found')
      return await response.json()
    } catch (error) {
      console.error('Failed to get customer history:', error)
      return null
    }
  }

  private async getRecentFollowUps(customerId: string, hours: number): Promise<FollowUpMessage[]> {
    const cutoff = new Date(Date.now() - (hours * 60 * 60 * 1000))
    return this.followUpQueue.filter(
      followUp => followUp.customerId === customerId && followUp.sentAt && followUp.sentAt >= cutoff
    )
  }

  private async getLastFollowUp(customerId: string, triggerType: string): Promise<FollowUpMessage | null> {
    const relevantFollowUps = this.followUpQueue
      .filter(followUp => followUp.customerId === customerId)
      .sort((a, b) => (b.sentAt?.getTime() || 0) - (a.sentAt?.getTime() || 0))

    return relevantFollowUps[0] || null
  }

  private generateFollowUpId(): string {
    return `followup_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
  }

  // Campaign management
  async createCampaign(campaign: Omit<FollowUpCampaign, 'id' | 'createdAt' | 'updatedAt' | 'performance'>): Promise<string> {
    const id = `campaign_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    const newCampaign: FollowUpCampaign = {
      ...campaign,
      id,
      createdAt: new Date(),
      updatedAt: new Date(),
      performance: {
        totalTriggered: 0,
        totalSent: 0,
        totalDelivered: 0,
        totalOpened: 0,
        totalClicked: 0,
        totalConversions: 0,
        averageResponseTime: 0
      }
    }

    this.activeCampaigns.set(id, newCampaign)
    return id
  }

  async updateCampaign(id: string, updates: Partial<FollowUpCampaign>): Promise<boolean> {
    const campaign = this.activeCampaigns.get(id)
    if (!campaign) return false

    this.activeCampaigns.set(id, { ...campaign, ...updates, updatedAt: new Date() })
    return true
  }

  async deleteCampaign(id: string): Promise<boolean> {
    return this.activeCampaigns.delete(id)
  }

  getCampaign(id: string): FollowUpCampaign | undefined {
    return this.activeCampaigns.get(id)
  }

  getAllCampaigns(): FollowUpCampaign[] {
    return Array.from(this.activeCampaigns.values())
  }

  // Analytics
  getFollowUpAnalytics(): {
    totalQueued: number
    totalSent: number
    totalDelivered: number
    totalFailed: number
    averageResponseRate: number
    topPerformingCampaigns: Array<{ campaignId: string; sent: number; responseRate: number }>
  } {
    const allFollowUps = this.followUpQueue
    const sent = allFollowUps.filter(f => f.status === 'sent')
    const delivered = allFollowUps.filter(f => f.status === 'delivered')
    const failed = allFollowUps.filter(f => f.status === 'failed')

    const campaignStats = new Map<string, { sent: number; responses: number }>()

    sent.forEach(followUp => {
      const stats = campaignStats.get(followUp.triggerId) || { sent: 0, responses: 0 }
      stats.sent++
      // Mock response tracking - in reality, this would track actual responses
      if (Math.random() > 0.7) stats.responses++ // Simulate 30% response rate
      campaignStats.set(followUp.triggerId, stats)
    })

    const topPerformingCampaigns = Array.from(campaignStats.entries())
      .map(([campaignId, stats]) => ({
        campaignId,
        sent: stats.sent,
        responseRate: stats.sent > 0 ? stats.responses / stats.sent : 0
      }))
      .sort((a, b) => b.responseRate - a.responseRate)
      .slice(0, 5)

    return {
      totalQueued: allFollowUps.length,
      totalSent: sent.length,
      totalDelivered: delivered.length,
      totalFailed: failed.length,
      averageResponseRate: sent.length > 0 ? delivered.length / sent.length : 0,
      topPerformingCampaigns
    }
  }

  // Cleanup
  destroy(): void {
    if (this.processingInterval) {
      clearInterval(this.processingInterval)
      this.processingInterval = null
    }
  }
}

// Global automated follow-ups instance
export const automatedFollowUps = new AutomatedFollowUps()
