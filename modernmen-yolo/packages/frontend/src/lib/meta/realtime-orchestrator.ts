// Real-Time Communication Orchestrator
// Comprehensive real-time communication, live updates, and event-driven interactions

export interface RealtimeChannel {
  id: string
  name: string
  type: 'user' | 'group' | 'system' | 'location' | 'service'
  participants: string[]
  permissions: {
    read: string[]
    write: string[]
    admin: string[]
  }
  settings: {
    maxParticipants: number
    messageRetention: number // hours
    typingIndicators: boolean
    readReceipts: boolean
    notifications: boolean
  }
  metadata: {
    createdAt: Date
    createdBy: string
    lastActivity: Date
    messageCount: number
  }
}

export interface RealtimeMessage {
  id: string
  channelId: string
  senderId: string
  type: 'text' | 'image' | 'file' | 'system' | 'notification' | 'typing' | 'presence'
  content: {
    text?: string
    media?: {
      url: string
      type: string
      size: number
      thumbnail?: string
    }
    metadata?: Record<string, any>
  }
  timestamp: Date
  edited: boolean
  editedAt?: Date
  reactions: Array<{
    emoji: string
    userId: string
    timestamp: Date
  }>
  replies: string[]
  threadId?: string
  mentions: string[]
  delivery: {
    status: 'sending' | 'sent' | 'delivered' | 'read' | 'failed'
    deliveredAt?: Date
    readBy: string[]
  }
}

export interface LiveNotification {
  id: string
  userId: string
  type: 'booking' | 'reminder' | 'promotion' | 'system' | 'social' | 'achievement'
  priority: 'low' | 'medium' | 'high' | 'urgent'
  title: string
  message: string
  action?: {
    label: string
    url: string
    type: 'navigate' | 'action' | 'dismiss'
  }
  data?: Record<string, any>
  channels: ('push' | 'email' | 'sms' | 'in_app')[]
  schedule?: {
    sendAt: Date
    expireAt?: Date
    recurrence?: 'once' | 'daily' | 'weekly' | 'monthly'
  }
  analytics: {
    sent: boolean
    delivered: boolean
    opened: boolean
    clicked: boolean
    converted: boolean
    sentAt?: Date
    deliveredAt?: Date
    openedAt?: Date
    clickedAt?: Date
    convertedAt?: Date
  }
}

export interface PresenceState {
  userId: string
  status: 'online' | 'away' | 'busy' | 'offline'
  lastSeen: Date
  currentActivity: {
    type: 'page_view' | 'booking' | 'chat' | 'idle'
    details: Record<string, any>
    startedAt: Date
  }
  device: {
    type: 'desktop' | 'mobile' | 'tablet'
    platform: string
    version: string
  }
  location?: {
    salonId?: string
    serviceId?: string
  }
}

export interface LiveUpdate {
  id: string
  type: 'booking' | 'service' | 'staff' | 'inventory' | 'system' | 'user'
  scope: 'global' | 'location' | 'user' | 'group'
  priority: 'low' | 'medium' | 'high' | 'critical'
  title: string
  message: string
  data: Record<string, any>
  recipients: string[]
  conditions?: {
    userSegments?: string[]
    locations?: string[]
    roles?: string[]
    customFilters?: Record<string, any>
  }
  actions: Array<{
    label: string
    action: string
    data?: Record<string, any>
  }>
  timestamp: Date
  expiresAt?: Date
  analytics: {
    impressions: number
    interactions: number
    conversions: number
  }
}

class RealtimeOrchestrator {
  private channels: Map<string, RealtimeChannel>
  private connections: Map<string, WebSocket>
  private presence: Map<string, PresenceState>
  private subscriptions: Map<string, Set<(message: any) => void>>
  private notificationQueue: LiveNotification[]
  private updateBuffer: LiveUpdate[]

  constructor() {
    this.channels = new Map()
    this.connections = new Map()
    this.presence = new Map()
    this.subscriptions = new Map()
    this.notificationQueue = []
    this.updateBuffer = []

    this.initializeSystemChannels()
    this.startConnectionManager()
    this.startNotificationProcessor()
    this.startUpdateBroadcaster()
  }

  // Channel Management
  createChannel(channelData: Omit<RealtimeChannel, 'id' | 'metadata'>): string {
    const channelId = this.generateId()

    const channel: RealtimeChannel = {
      ...channelData,
      id: channelId,
      metadata: {
        createdAt: new Date(),
        createdBy: 'system',
        lastActivity: new Date(),
        messageCount: 0
      }
    }

    this.channels.set(channelId, channel)

    // Emit channel creation event
    this.broadcastToChannel(channelId, {
      type: 'system',
      action: 'channel_created',
      data: channel
    })

    return channelId
  }

  joinChannel(channelId: string, userId: string): boolean {
    const channel = this.channels.get(channelId)
    if (!channel) return false

    if (!channel.participants.includes(userId)) {
      channel.participants.push(userId)

      // Update presence
      this.updatePresence(userId, {
        status: 'online',
        currentActivity: {
          type: 'chat',
          details: { channelId },
          startedAt: new Date()
        }
      })

      // Notify other participants
      this.broadcastToChannel(channelId, {
        type: 'system',
        action: 'user_joined',
        data: { userId, channelId }
      }, [userId]) // Exclude the joining user

      return true
    }

    return false
  }

  leaveChannel(channelId: string, userId: string): boolean {
    const channel = this.channels.get(channelId)
    if (!channel) return false

    const index = channel.participants.indexOf(userId)
    if (index > -1) {
      channel.participants.splice(index, 1)

      // Notify other participants
      this.broadcastToChannel(channelId, {
        type: 'system',
        action: 'user_left',
        data: { userId, channelId }
      })

      return true
    }

    return false
  }

  // Message Handling
  sendMessage(message: Omit<RealtimeMessage, 'id' | 'timestamp' | 'delivery'>): void {
    const realtimeMessage: RealtimeMessage = {
      ...message,
      id: this.generateId(),
      timestamp: new Date(),
      edited: false,
      reactions: [],
      replies: [],
      mentions: this.extractMentions(message.content.text || ''),
      delivery: {
        status: 'sent',
        readBy: []
      }
    }

    const channel = this.channels.get(message.channelId)
    if (channel) {
      channel.metadata.lastActivity = new Date()
      channel.metadata.messageCount++
    }

    // Broadcast to channel
    this.broadcastToChannel(message.channelId, {
      type: 'message',
      action: 'new',
      data: realtimeMessage
    })

    // Process mentions
    if (realtimeMessage.mentions.length > 0) {
      this.processMentions(realtimeMessage)
    }

    // Update delivery status
    setTimeout(() => {
      realtimeMessage.delivery.status = 'delivered'
      realtimeMessage.delivery.deliveredAt = new Date()
    }, 100)
  }

  private extractMentions(text: string): string[] {
    const mentionRegex = /@(\w+)/g
    const mentions: string[] = []
    let match

    while ((match = mentionRegex.exec(text)) !== null) {
      mentions.push(match[1])
    }

    return mentions
  }

  private processMentions(message: RealtimeMessage): void {
    message.mentions.forEach(userId => {
      this.sendNotification({
        userId,
        type: 'system',
        priority: 'low',
        title: 'You were mentioned',
        message: `You were mentioned in ${message.channelId}`,
        channels: ['in_app'],
        data: { messageId: message.id, channelId: message.channelId }
      })
    })
  }

  // Presence Management
  updatePresence(userId: string, updates: Partial<PresenceState>): void {
    const currentPresence = this.presence.get(userId) || {
      userId,
      status: 'offline',
      lastSeen: new Date(),
      currentActivity: {
        type: 'idle',
        details: {},
        startedAt: new Date()
      },
      device: {
        type: 'desktop',
        platform: 'unknown',
        version: 'unknown'
      }
    }

    const updatedPresence: PresenceState = {
      ...currentPresence,
      ...updates,
      lastSeen: new Date()
    }

    this.presence.set(userId, updatedPresence)

    // Broadcast presence update to relevant channels
    this.broadcastPresenceUpdate(updatedPresence)
  }

  private broadcastPresenceUpdate(presence: PresenceState): void {
    // Broadcast to user's channels
    this.channels.forEach(channel => {
      if (channel.participants.includes(presence.userId)) {
        this.broadcastToChannel(channel.id, {
          type: 'presence',
          action: 'update',
          data: presence
        })
      }
    })
  }

  // Notification System
  sendNotification(notification: Omit<LiveNotification, 'id' | 'analytics'>): void {
    const liveNotification: LiveNotification = {
      ...notification,
      id: this.generateId(),
      analytics: {
        sent: false,
        delivered: false,
        opened: false,
        clicked: false,
        converted: false
      }
    }

    // Add to queue for processing
    this.notificationQueue.push(liveNotification)

    // Immediate delivery for high priority
    if (notification.priority === 'urgent' || notification.priority === 'high') {
      this.processNotification(liveNotification)
    }
  }

  private async processNotification(notification: LiveNotification): Promise<void> {
    try {
      notification.analytics.sent = true
      notification.analytics.sentAt = new Date()

      // Send through specified channels
      for (const channel of notification.channels) {
        await this.sendThroughChannel(notification, channel)
      }

      notification.analytics.delivered = true
      notification.analytics.deliveredAt = new Date()

      // Remove from queue
      const index = this.notificationQueue.indexOf(notification)
      if (index > -1) {
        this.notificationQueue.splice(index, 1)
      }
    } catch (error) {
      console.error('Failed to process notification:', error)
      notification.analytics.sent = false
    }
  }

  private async sendThroughChannel(notification: LiveNotification, channel: string): Promise<void> {
    switch (channel) {
      case 'push':
        await this.sendPushNotification(notification)
        break
      case 'email':
        await this.sendEmailNotification(notification)
        break
      case 'sms':
        await this.sendSMSNotification(notification)
        break
      case 'in_app':
        await this.sendInAppNotification(notification)
        break
    }
  }

  private async sendPushNotification(notification: LiveNotification): Promise<void> {
    // Implementation for push notifications
    // Push notification queued
  }

  private async sendEmailNotification(notification: LiveNotification): Promise<void> {
    // Implementation for email notifications
    // Email notification queued
  }

  private async sendSMSNotification(notification: LiveNotification): Promise<void> {
    // Implementation for SMS notifications
    // SMS notification queued
  }

  private async sendInAppNotification(notification: LiveNotification): Promise<void> {
    // Send to user's active connections
    const userConnection = this.connections.get(notification.userId)
    if (userConnection && userConnection.readyState === WebSocket.OPEN) {
      userConnection.send(JSON.stringify({
        type: 'notification',
        data: notification
      }))
    }
  }

  // Live Updates System
  broadcastUpdate(update: Omit<LiveUpdate, 'id' | 'timestamp' | 'analytics'>): void {
    const liveUpdate: LiveUpdate = {
      ...update,
      id: this.generateId(),
      timestamp: new Date(),
      analytics: {
        impressions: 0,
        interactions: 0,
        conversions: 0
      }
    }

    // Add to buffer for processing
    this.updateBuffer.push(liveUpdate)

    // Immediate broadcast for critical updates
    if (update.priority === 'critical') {
      this.processUpdate(liveUpdate)
    }
  }

  private async processUpdate(update: LiveUpdate): Promise<void> {
    // Determine recipients based on scope and conditions
    const recipients = await this.determineRecipients(update)

    // Broadcast to recipients
    recipients.forEach(userId => {
      const userConnection = this.connections.get(userId)
      if (userConnection && userConnection.readyState === WebSocket.OPEN) {
        userConnection.send(JSON.stringify({
          type: 'update',
          data: update
        }))
      }
    })

    // Track analytics
    update.analytics.impressions = recipients.length

    // Remove from buffer
    const index = this.updateBuffer.indexOf(update)
    if (index > -1) {
      this.updateBuffer.splice(index, 1)
    }
  }

  private async determineRecipients(update: LiveUpdate): Promise<string[]> {
    let recipients: string[] = []

    switch (update.scope) {
      case 'global':
        // All connected users
        recipients = Array.from(this.connections.keys())
        break

      case 'location':
        if (update.conditions?.locations) {
          // Users at specific locations
          recipients = this.getUsersAtLocations(update.conditions.locations)
        }
        break

      case 'user':
        if (update.recipients) {
          recipients = update.recipients
        }
        break

      case 'group':
        if (update.conditions?.userSegments) {
          recipients = await this.getUsersInSegments(update.conditions.userSegments)
        }
        break
    }

    return recipients
  }

  private getUsersAtLocations(locationIds: string[]): string[] {
    const users: string[] = []

    this.presence.forEach((presence, userId) => {
      if (presence.location?.salonId && locationIds.includes(presence.location.salonId)) {
        users.push(userId)
      }
    })

    return users
  }

  private async getUsersInSegments(segmentIds: string[]): Promise<string[]> {
    // Implementation would query user segments
    return []
  }

  // WebSocket Connection Management
  handleWebSocketConnection(userId: string, ws: WebSocket): void {
    this.connections.set(userId, ws)

    // Update presence
    this.updatePresence(userId, {
      status: 'online',
      device: this.detectDevice(ws)
    })

    // Handle incoming messages
    ws.onmessage = (event) => {
      try {
        const message = JSON.parse(event.data)
        this.handleWebSocketMessage(userId, message)
      } catch (error) {
        console.error('Invalid WebSocket message:', error)
      }
    }

    // Handle disconnection
    ws.onclose = () => {
      this.connections.delete(userId)
      this.updatePresence(userId, { status: 'offline' })
    }

    // Handle errors
    ws.onerror = (error) => {
      console.error('WebSocket error for user', userId, ':', error)
      this.connections.delete(userId)
    }
  }

  private handleWebSocketMessage(userId: string, message: any): void {
    switch (message.type) {
      case 'join_channel':
        this.joinChannel(message.channelId, userId)
        break

      case 'leave_channel':
        this.leaveChannel(message.channelId, userId)
        break

      case 'send_message':
        this.sendMessage({
          channelId: message.channelId,
          senderId: userId,
          type: message.messageType || 'text',
          content: message.content,
          edited: false,
          reactions: [],
          replies: [],
          mentions: []
        })
        break

      case 'typing':
        this.broadcastTyping(userId, message.channelId, message.isTyping)
        break

      case 'presence_update':
        this.updatePresence(userId, message.presence)
        break

      case 'notification_action':
        this.handleNotificationAction(userId, message)
        break
    }
  }

  private broadcastTyping(userId: string, channelId: string, isTyping: boolean): void {
    this.broadcastToChannel(channelId, {
      type: 'typing',
      action: isTyping ? 'start' : 'stop',
      data: { userId, channelId }
    }, [userId])
  }

  private handleNotificationAction(userId: string, message: any): void {
    // Handle notification interactions (click, dismiss, etc.)
    const notification = this.notificationQueue.find(n => n.id === message.notificationId)
    if (notification) {
      switch (message.action) {
        case 'click':
          notification.analytics.clicked = true
          notification.analytics.clickedAt = new Date()
          break
        case 'open':
          notification.analytics.opened = true
          notification.analytics.openedAt = new Date()
          break
        case 'convert':
          notification.analytics.converted = true
          notification.analytics.convertedAt = new Date()
          break
      }
    }
  }

  // Utility Methods
  private broadcastToChannel(channelId: string, message: any, excludeUsers: string[] = []): void {
    const channel = this.channels.get(channelId)
    if (!channel) return

    channel.participants.forEach(userId => {
      if (!excludeUsers.includes(userId)) {
        const connection = this.connections.get(userId)
        if (connection && connection.readyState === WebSocket.OPEN) {
          connection.send(JSON.stringify(message))
        }
      }
    })
  }

  private detectDevice(ws: WebSocket): PresenceState['device'] {
    // Implementation would detect device from WebSocket connection
    return {
      type: 'desktop',
      platform: 'web',
      version: 'unknown'
    }
  }

  private generateId(): string {
    return Date.now().toString(36) + Math.random().toString(36).substr(2)
  }

  // Initialization
  private initializeSystemChannels(): void {
    // Create default system channels
    const systemChannels = [
      {
        name: 'global_announcements',
        type: 'system' as const,
        participants: [],
        permissions: {
          read: ['*'],
          write: ['admin'],
          admin: ['admin']
        },
        settings: {
          maxParticipants: 10000,
          messageRetention: 168, // 1 week
          typingIndicators: false,
          readReceipts: false,
          notifications: true
        }
      },
      {
        name: 'staff_communication',
        type: 'group' as const,
        participants: [],
        permissions: {
          read: ['staff', 'manager', 'admin'],
          write: ['staff', 'manager', 'admin'],
          admin: ['manager', 'admin']
        },
        settings: {
          maxParticipants: 1000,
          messageRetention: 720, // 30 days
          typingIndicators: true,
          readReceipts: true,
          notifications: true
        }
      }
    ]

    systemChannels.forEach(channel => {
      this.createChannel(channel)
    })
  }

  private startConnectionManager(): void {
    // Clean up dead connections periodically
    setInterval(() => {
      this.connections.forEach((ws, userId) => {
        if (ws.readyState === WebSocket.CLOSED || ws.readyState === WebSocket.CLOSING) {
          this.connections.delete(userId)
          this.updatePresence(userId, { status: 'offline' })
        }
      })
    }, 30000) // Every 30 seconds
  }

  private startNotificationProcessor(): void {
    // Process notification queue
    setInterval(() => {
      const pendingNotifications = this.notificationQueue.filter(n => !n.analytics.sent)
      pendingNotifications.slice(0, 10).forEach(notification => {
        this.processNotification(notification)
      })
    }, 5000) // Every 5 seconds
  }

  private startUpdateBroadcaster(): void {
    // Process update buffer
    setInterval(() => {
      const pendingUpdates = this.updateBuffer.filter(u => u.priority !== 'critical')
      pendingUpdates.slice(0, 5).forEach(update => {
        this.processUpdate(update)
      })
    }, 10000) // Every 10 seconds
  }
}

export const realtimeOrchestrator = new RealtimeOrchestrator()

// React Hook for Real-Time Orchestration
export function useRealtime() {
  return {
    createChannel: realtimeOrchestrator.createChannel.bind(realtimeOrchestrator),
    joinChannel: realtimeOrchestrator.joinChannel.bind(realtimeOrchestrator),
    leaveChannel: realtimeOrchestrator.leaveChannel.bind(realtimeOrchestrator),
    sendMessage: realtimeOrchestrator.sendMessage.bind(realtimeOrchestrator),
    sendNotification: realtimeOrchestrator.sendNotification.bind(realtimeOrchestrator),
    broadcastUpdate: realtimeOrchestrator.broadcastUpdate.bind(realtimeOrchestrator),
    updatePresence: realtimeOrchestrator.updatePresence.bind(realtimeOrchestrator),
    handleWebSocketConnection: realtimeOrchestrator.handleWebSocketConnection.bind(realtimeOrchestrator)
  }
}
