export interface OfflineMessage {
  id: string
  content: string
  timestamp: Date
  sender: 'user' | 'assistant'
  type: 'text' | 'voice' | 'image'
  metadata?: any
  synced: boolean
  retryCount: number
}

export interface OfflineAppointment {
  id: string
  serviceId: string
  date: string
  time: string
  customerInfo: {
    name: string
    email: string
    phone: string
  }
  preferences?: any
  createdAt: Date
  synced: boolean
  retryCount: number
}

export interface OfflineQueue {
  messages: OfflineMessage[]
  appointments: OfflineAppointment[]
  maxRetries: number
  retryDelay: number
}

export interface ConnectionStatus {
  isOnline: boolean
  connectionType: 'wifi' | 'cellular' | 'ethernet' | 'unknown' | 'none'
  downlink?: number
  effectiveType?: 'slow-2g' | '2g' | '3g' | '4g'
  lastOnline?: Date
  lastOffline?: Date
}

export class OfflineService {
  private dbName = 'ModernMenChatbotDB'
  private dbVersion = 1
  private db: IDBDatabase | null = null
  private connectionStatus: ConnectionStatus = {
    isOnline: navigator.onLine,
    connectionType: 'unknown'
  }
  private syncInProgress = false
  private messageCallbacks: ((message: OfflineMessage) => void)[] = []
  private connectionCallbacks: ((status: ConnectionStatus) => void)[] = []

  constructor() {
    this.initializeIndexedDB()
    this.setupNetworkListeners()
    this.registerServiceWorker()
    this.detectConnectionType()
  }

  private async initializeIndexedDB(): Promise<void> {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(this.dbName, this.dbVersion)

      request.onerror = () => {
        console.error('IndexedDB initialization failed')
        reject(request.error)
      }

      request.onsuccess = () => {
        this.db = request.result
        console.log('IndexedDB initialized successfully')
        resolve()
      }

      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result

        // Messages store
        if (!db.objectStoreNames.contains('messages')) {
          const messagesStore = db.createObjectStore('messages', { keyPath: 'id' })
          messagesStore.createIndex('synced', 'synced', { unique: false })
          messagesStore.createIndex('timestamp', 'timestamp', { unique: false })
        }

        // Appointments store
        if (!db.objectStoreNames.contains('appointments')) {
          const appointmentsStore = db.createObjectStore('appointments', { keyPath: 'id' })
          appointmentsStore.createIndex('synced', 'synced', { unique: false })
          appointmentsStore.createIndex('createdAt', 'createdAt', { unique: false })
        }

        // Conversation cache store
        if (!db.objectStoreNames.contains('conversations')) {
          const conversationsStore = db.createObjectStore('conversations', { keyPath: 'sessionId' })
          conversationsStore.createIndex('lastActivity', 'lastActivity', { unique: false })
        }
      }
    })
  }

  private setupNetworkListeners(): void {
    window.addEventListener('online', () => {
      console.log('Connection restored')
      this.updateConnectionStatus({ isOnline: true, lastOnline: new Date() })
      this.triggerSync()
    })

    window.addEventListener('offline', () => {
      console.log('Connection lost')
      this.updateConnectionStatus({ isOnline: false, lastOffline: new Date() })
    })

    // Listen for connection changes
    if ('connection' in navigator) {
      const connection = (navigator as any).connection
      connection.addEventListener('change', () => {
        this.detectConnectionType()
      })
    }
  }

  private async registerServiceWorker(): Promise<void> {
    if ('serviceWorker' in navigator) {
      try {
        const registration = await navigator.serviceWorker.register('/sw.js')
        console.log('Service Worker registered:', registration.scope)

        // Listen for messages from service worker
        navigator.serviceWorker.addEventListener('message', (event) => {
          this.handleServiceWorkerMessage(event)
        })

      } catch (error) {
        console.error('Service Worker registration failed:', error)
      }
    }
  }

  private detectConnectionType(): void {
    const connection = (navigator as any).connection

    if (connection) {
      this.updateConnectionStatus({
        connectionType: connection.type || 'unknown',
        downlink: connection.downlink,
        effectiveType: connection.effectiveType
      })
    }
  }

  private updateConnectionStatus(updates: Partial<ConnectionStatus>): void {
    this.connectionStatus = { ...this.connectionStatus, ...updates }
    this.connectionCallbacks.forEach(callback => callback(this.connectionStatus))
  }

  private handleServiceWorkerMessage(event: MessageEvent): void {
    const { type, ...data } = event.data

    switch (type) {
      case 'SYNC_COMPLETE':
        console.log(`Synced ${data.messageCount} messages`)
        break
      case 'APPOINTMENT_SYNC_COMPLETE':
        console.log(`Synced ${data.appointmentCount} appointments`)
        break
      default:
        console.log('Unknown service worker message:', type, data)
    }
  }

  // Public API methods
  async storeOfflineMessage(message: Omit<OfflineMessage, 'id' | 'timestamp' | 'synced' | 'retryCount'>): Promise<void> {
    if (!this.db) throw new Error('Database not initialized')

    const offlineMessage: OfflineMessage = {
      ...message,
      id: this.generateId(),
      timestamp: new Date(),
      synced: false,
      retryCount: 0
    }

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(['messages'], 'readwrite')
      const store = transaction.objectStore('messages')
      const request = store.add(offlineMessage)

      request.onsuccess = () => {
        console.log('Message stored offline:', offlineMessage.id)
        resolve()
      }

      request.onerror = () => reject(request.error)
    })
  }

  async storeOfflineAppointment(appointment: Omit<OfflineAppointment, 'id' | 'createdAt' | 'synced' | 'retryCount'>): Promise<void> {
    if (!this.db) throw new Error('Database not initialized')

    const offlineAppointment: OfflineAppointment = {
      ...appointment,
      id: this.generateId(),
      createdAt: new Date(),
      synced: false,
      retryCount: 0
    }

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(['appointments'], 'readwrite')
      const store = transaction.objectStore('appointments')
      const request = store.add(offlineAppointment)

      request.onsuccess = () => {
        console.log('Appointment stored offline:', offlineAppointment.id)
        resolve()
      }

      request.onerror = () => reject(request.error)
    })
  }

  async getOfflineMessages(): Promise<OfflineMessage[]> {
    if (!this.db) throw new Error('Database not initialized')

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(['messages'], 'readonly')
      const store = transaction.objectStore('messages')
      const index = store.index('synced')
      const request = index.getAll(false) // Get unsynced messages

      request.onsuccess = () => resolve(request.result)
      request.onerror = () => reject(request.error)
    })
  }

  async getOfflineAppointments(): Promise<OfflineAppointment[]> {
    if (!this.db) throw new Error('Database not initialized')

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(['appointments'], 'readonly')
      const store = transaction.objectStore('appointments')
      const index = store.index('synced')
      const request = index.getAll(false) // Get unsynced appointments

      request.onsuccess = () => resolve(request.result)
      request.onerror = () => reject(request.error)
    })
  }

  async syncOfflineData(): Promise<void> {
    if (this.syncInProgress || !this.connectionStatus.isOnline) {
      return
    }

    this.syncInProgress = true

    try {
      await this.syncMessages()
      await this.syncAppointments()
      console.log('Offline data sync completed')
    } catch (error) {
      console.error('Sync failed:', error)
    } finally {
      this.syncInProgress = false
    }
  }

  private async syncMessages(): Promise<void> {
    const offlineMessages = await this.getOfflineMessages()

    for (const message of offlineMessages) {
      try {
        const response = await fetch('/api/chat/sync', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(message)
        })

        if (response.ok) {
          await this.markMessageSynced(message.id)
          this.messageCallbacks.forEach(callback => callback(message))
        } else {
          await this.incrementMessageRetry(message.id)
        }
      } catch (error) {
        console.error('Failed to sync message:', message.id, error)
        await this.incrementMessageRetry(message.id)
      }
    }
  }

  private async syncAppointments(): Promise<void> {
    const offlineAppointments = await this.getOfflineAppointments()

    for (const appointment of offlineAppointments) {
      try {
        const response = await fetch('/api/appointments/sync', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(appointment)
        })

        if (response.ok) {
          await this.markAppointmentSynced(appointment.id)
        } else {
          await this.incrementAppointmentRetry(appointment.id)
        }
      } catch (error) {
        console.error('Failed to sync appointment:', appointment.id, error)
        await this.incrementAppointmentRetry(appointment.id)
      }
    }
  }

  private async markMessageSynced(messageId: string): Promise<void> {
    if (!this.db) return

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(['messages'], 'readwrite')
      const store = transaction.objectStore('messages')
      const request = store.get(messageId)

      request.onsuccess = () => {
        const message = request.result
        if (message) {
          message.synced = true
          const updateRequest = store.put(message)
          updateRequest.onsuccess = () => resolve()
          updateRequest.onerror = () => reject(updateRequest.error)
        } else {
          resolve()
        }
      }

      request.onerror = () => reject(request.error)
    })
  }

  private async markAppointmentSynced(appointmentId: string): Promise<void> {
    if (!this.db) return

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(['appointments'], 'readwrite')
      const store = transaction.objectStore('appointments')
      const request = store.get(appointmentId)

      request.onsuccess = () => {
        const appointment = request.result
        if (appointment) {
          appointment.synced = true
          const updateRequest = store.put(appointment)
          updateRequest.onsuccess = () => resolve()
          updateRequest.onerror = () => reject(updateRequest.error)
        } else {
          resolve()
        }
      }

      request.onerror = () => reject(request.error)
    })
  }

  private async incrementMessageRetry(messageId: string): Promise<void> {
    if (!this.db) return

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(['messages'], 'readwrite')
      const store = transaction.objectStore('messages')
      const request = store.get(messageId)

      request.onsuccess = () => {
        const message = request.result
        if (message) {
          message.retryCount++
          const updateRequest = store.put(message)
          updateRequest.onsuccess = () => resolve()
          updateRequest.onerror = () => reject(updateRequest.error)
        } else {
          resolve()
        }
      }

      request.onerror = () => reject(request.error)
    })
  }

  private async incrementAppointmentRetry(appointmentId: string): Promise<void> {
    if (!this.db) return

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(['appointments'], 'readwrite')
      const store = transaction.objectStore('appointments')
      const request = store.get(appointmentId)

      request.onsuccess = () => {
        const appointment = request.result
        if (appointment) {
          appointment.retryCount++
          const updateRequest = store.put(appointment)
          updateRequest.onsuccess = () => resolve()
          updateRequest.onerror = () => reject(updateRequest.error)
        } else {
          resolve()
        }
      }

      request.onerror = () => reject(request.error)
    })
  }

  private triggerSync(): void {
    // Trigger background sync
    if ('serviceWorker' in navigator && navigator.serviceWorker.controller) {
      navigator.serviceWorker.controller.postMessage({
        type: 'TRIGGER_SYNC'
      })
    }

    // Also trigger immediate sync
    setTimeout(() => {
      this.syncOfflineData()
    }, 1000)
  }

  // Event listeners
  onMessageSynced(callback: (message: OfflineMessage) => void): () => void {
    this.messageCallbacks.push(callback)
    return () => {
      const index = this.messageCallbacks.indexOf(callback)
      if (index > -1) {
        this.messageCallbacks.splice(index, 1)
      }
    }
  }

  onConnectionChange(callback: (status: ConnectionStatus) => void): () => void {
    this.connectionCallbacks.push(callback)
    return () => {
      const index = this.connectionCallbacks.indexOf(callback)
      if (index > -1) {
        this.connectionCallbacks.splice(index, 1)
      }
    }
  }

  // Utility methods
  getConnectionStatus(): ConnectionStatus {
    return { ...this.connectionStatus }
  }

  isOnline(): boolean {
    return this.connectionStatus.isOnline
  }

  isSyncing(): boolean {
    return this.syncInProgress
  }

  async clearOfflineData(): Promise<void> {
    if (!this.db) return

    const transaction = this.db.transaction(['messages', 'appointments'], 'readwrite')

    const messagesStore = transaction.objectStore('messages')
    const appointmentsStore = transaction.objectStore('appointments')

    messagesStore.clear()
    appointmentsStore.clear()

    return new Promise((resolve, reject) => {
      transaction.oncomplete = () => resolve()
      transaction.onerror = () => reject(transaction.error)
    })
  }

  async getStorageStats(): Promise<{
    messages: number
    appointments: number
    totalSize: number
  }> {
    if (!this.db) return { messages: 0, appointments: 0, totalSize: 0 }

    const messages = await this.getOfflineMessages()
    const appointments = await this.getOfflineAppointments()

    // Estimate size (rough calculation)
    const messagesSize = messages.length * 500 // ~500 bytes per message
    const appointmentsSize = appointments.length * 1000 // ~1KB per appointment

    return {
      messages: messages.length,
      appointments: appointments.length,
      totalSize: messagesSize + appointmentsSize
    }
  }

  private generateId(): string {
    return `offline_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
  }

  // Cache conversation data for offline use
  async cacheConversation(sessionId: string, conversationData: any): Promise<void> {
    if (!this.db) return

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(['conversations'], 'readwrite')
      const store = transaction.objectStore('conversations')

      const data = {
        sessionId,
        data: conversationData,
        lastActivity: new Date(),
        cachedAt: new Date()
      }

      const request = store.put(data)

      request.onsuccess = () => resolve()
      request.onerror = () => reject(request.error)
    })
  }

  async getCachedConversation(sessionId: string): Promise<any | null> {
    if (!this.db) return null

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(['conversations'], 'readonly')
      const store = transaction.objectStore('conversations')
      const request = store.get(sessionId)

      request.onsuccess = () => {
        const result = request.result
        resolve(result ? result.data : null)
      }

      request.onerror = () => reject(request.error)
    })
  }
}

// Global offline service instance
export const offlineService = new OfflineService()
