import { io, Socket } from 'socket.io-client'

export interface WebSocketMessage {
  id: string
  type: 'text' | 'voice' | 'image' | 'booking' | 'notification'
  content: string
  sender: 'user' | 'assistant'
  timestamp: Date
  metadata?: {
    voiceTranscript?: string
    imageUrl?: string
    bookingData?: any
    intent?: string
    confidence?: number
  }
}

export interface ConversationSession {
  sessionId: string
  userId?: string
  context: {
    intent: string
    entities: Record<string, any>
    history: WebSocketMessage[]
    userProfile?: {
      name?: string
      preferences?: string[]
      loyaltyTier?: string
      lastVisit?: Date
    }
  }
  isActive: boolean
  createdAt: Date
  updatedAt: Date
}

export class WebSocketService {
  private socket: Socket | null = null
  private reconnectAttempts = 0
  private maxReconnectAttempts = 5
  private reconnectDelay = 1000
  private messageCallbacks: ((message: WebSocketMessage) => void)[] = []
  private connectionCallbacks: ((connected: boolean) => void)[] = []

  constructor(private serverUrl: string = process.env.NEXT_PUBLIC_WS_URL || 'ws://localhost:3001') {}

  connect(userId?: string): Promise<void> {
    return new Promise((resolve, reject) => {
      if (this.socket?.connected) {
        resolve()
        return
      }

      this.socket = io(this.serverUrl, {
        auth: { userId },
        transports: ['websocket', 'polling'],
        timeout: 5000,
        reconnection: true,
        reconnectionAttempts: this.maxReconnectAttempts,
        reconnectionDelay: this.reconnectDelay
      })

      this.socket.on('connect', () => {
        console.log('WebSocket connected')
        this.reconnectAttempts = 0
        this.connectionCallbacks.forEach(callback => callback(true))
        resolve()
      })

      this.socket.on('disconnect', (reason) => {
        console.log('WebSocket disconnected:', reason)
        this.connectionCallbacks.forEach(callback => callback(false))
      })

      this.socket.on('message', (message: WebSocketMessage) => {
        this.messageCallbacks.forEach(callback => callback(message))
      })

      this.socket.on('connect_error', (error) => {
        console.error('WebSocket connection error:', error)
        if (this.reconnectAttempts >= this.maxReconnectAttempts) {
          reject(error)
        }
      })

      this.socket.on('reconnect_attempt', (attempt) => {
        this.reconnectAttempts = attempt
      })
    })
  }

  disconnect(): void {
    if (this.socket) {
      this.socket.disconnect()
      this.socket = null
    }
  }

  sendMessage(message: Omit<WebSocketMessage, 'id' | 'timestamp'>): void {
    if (!this.socket?.connected) {
      throw new Error('WebSocket not connected')
    }

    const fullMessage: WebSocketMessage = {
      ...message,
      id: this.generateMessageId(),
      timestamp: new Date()
    }

    this.socket.emit('message', fullMessage)
  }

  onMessage(callback: (message: WebSocketMessage) => void): () => void {
    this.messageCallbacks.push(callback)
    return () => {
      const index = this.messageCallbacks.indexOf(callback)
      if (index > -1) {
        this.messageCallbacks.splice(index, 1)
      }
    }
  }

  onConnectionChange(callback: (connected: boolean) => void): () => void {
    this.connectionCallbacks.push(callback)
    return () => {
      const index = this.connectionCallbacks.indexOf(callback)
      if (index > -1) {
        this.connectionCallbacks.splice(index, 1)
      }
    }
  }

  joinSession(sessionId: string): void {
    if (this.socket?.connected) {
      this.socket.emit('join_session', { sessionId })
    }
  }

  leaveSession(sessionId: string): void {
    if (this.socket?.connected) {
      this.socket.emit('leave_session', { sessionId })
    }
  }

  updateContext(sessionId: string, context: Partial<ConversationSession['context']>): void {
    if (this.socket?.connected) {
      this.socket.emit('update_context', { sessionId, context })
    }
  }

  private generateMessageId(): string {
    return `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
  }

  isConnected(): boolean {
    return this.socket?.connected || false
  }

  getConnectionStatus(): 'connecting' | 'connected' | 'disconnected' | 'error' {
    if (!this.socket) return 'disconnected'
    if (this.socket.connected) return 'connected'
    if (this.socket.connecting) return 'connecting'
    return 'error'
  }
}

// Singleton instance
export const webSocketService = new WebSocketService()
