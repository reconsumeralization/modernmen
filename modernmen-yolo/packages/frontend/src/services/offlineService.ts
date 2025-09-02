interface OfflineAppointment {
  id: string
  customerName: string
  customerEmail: string
  serviceName: string
  barberName: string
  date: string
  time: string
  duration: number
  price: number
  status: string
  notes?: string
  createdAt: string
  synced: boolean
}

interface OfflineReview {
  id: string
  appointmentId: string
  customerName: string
  rating: number
  comment: string
  createdAt: string
  synced: boolean
}

interface OfflineAction {
  id: string
  type: 'appointment' | 'review' | 'profile-update'
  data: any
  createdAt: string
  synced: boolean
  retryCount: number
}

class OfflineService {
  private dbName = 'ModernMenDB'
  private dbVersion = 1
  private db: IDBDatabase | null = null

  /**
   * Initialize IndexedDB
   */
  async init(): Promise<void> {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(this.dbName, this.dbVersion)

      request.onerror = () => {
        console.error('Failed to open IndexedDB')
        reject(new Error('Failed to initialize offline storage'))
      }

      request.onsuccess = (event) => {
        this.db = (event.target as IDBOpenDBRequest).result
        console.log('Offline storage initialized successfully')
        resolve()
      }

      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result
        this.createObjectStores(db)
      }
    })
  }

  /**
   * Create object stores for offline data
   */
  private createObjectStores(db: IDBDatabase): void {
    // Store for offline appointments
    if (!db.objectStoreNames.contains('appointments')) {
      const appointmentsStore = db.createObjectStore('appointments', { keyPath: 'id' })
      appointmentsStore.createIndex('synced', 'synced', { unique: false })
      appointmentsStore.createIndex('createdAt', 'createdAt', { unique: false })
    }

    // Store for offline reviews
    if (!db.objectStoreNames.contains('reviews')) {
      const reviewsStore = db.createObjectStore('reviews', { keyPath: 'id' })
      reviewsStore.createIndex('synced', 'synced', { unique: false })
      reviewsStore.createIndex('createdAt', 'createdAt', { unique: false })
    }

    // Store for pending actions to sync
    if (!db.objectStoreNames.contains('pendingActions')) {
      const actionsStore = db.createObjectStore('pendingActions', { keyPath: 'id' })
      actionsStore.createIndex('type', 'type', { unique: false })
      actionsStore.createIndex('synced', 'synced', { unique: false })
      actionsStore.createIndex('createdAt', 'createdAt', { unique: false })
    }

    // Store for cached API responses
    if (!db.objectStoreNames.contains('cache')) {
      const cacheStore = db.createObjectStore('cache', { keyPath: 'url' })
      cacheStore.createIndex('timestamp', 'timestamp', { unique: false })
    }

    // Store for user preferences
    if (!db.objectStoreNames.contains('preferences')) {
      db.createObjectStore('preferences', { keyPath: 'key' })
    }
  }

  /**
   * Check if we're currently offline
   */
  isOffline(): boolean {
    return !navigator.onLine
  }

  /**
   * Listen for online/offline events
   */
  setupNetworkListeners(): void {
    window.addEventListener('online', () => {
      console.log('Back online - syncing data...')
      this.syncPendingData()
    })

    window.addEventListener('offline', () => {
      console.log('Gone offline - switching to offline mode')
      this.showOfflineIndicator()
    })
  }

  /**
   * Show offline indicator
   */
  private showOfflineIndicator(): void {
    // Create and show offline notification
    if (typeof window !== 'undefined') {
      const notification = document.createElement('div')
      notification.id = 'offline-indicator'
      notification.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        background: #ff6b6b;
        color: white;
        text-align: center;
        padding: 10px;
        z-index: 1000;
        font-family: Arial, sans-serif;
      `
      notification.textContent = '⚠️ You are currently offline. Some features may be limited.'

      document.body.appendChild(notification)

      // Auto-hide after 3 seconds if back online
      setTimeout(() => {
        if (navigator.onLine && notification.parentNode) {
          notification.parentNode.removeChild(notification)
        }
      }, 3000)
    }
  }

  /**
   * Save appointment for offline use
   */
  async saveAppointmentOffline(appointment: OfflineAppointment): Promise<void> {
    if (!this.db) await this.init()

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(['appointments'], 'readwrite')
      const store = transaction.objectStore('appointments')

      const request = store.put({
        ...appointment,
        synced: false,
        createdAt: new Date().toISOString(),
      })

      request.onsuccess = () => resolve()
      request.onerror = () => reject(new Error('Failed to save appointment offline'))
    })
  }

  /**
   * Save review for offline use
   */
  async saveReviewOffline(review: OfflineReview): Promise<void> {
    if (!this.db) await this.init()

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(['reviews'], 'readwrite')
      const store = transaction.objectStore('reviews')

      const request = store.put({
        ...review,
        synced: false,
        createdAt: new Date().toISOString(),
      })

      request.onsuccess = () => resolve()
      request.onerror = () => reject(new Error('Failed to save review offline'))
    })
  }

  /**
   * Queue action for later synchronization
   */
  async queueActionForSync(action: OfflineAction): Promise<void> {
    if (!this.db) await this.init()

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(['pendingActions'], 'readwrite')
      const store = transaction.objectStore('pendingActions')

      const request = store.put({
        ...action,
        synced: false,
        retryCount: 0,
        createdAt: new Date().toISOString(),
      })

      request.onsuccess = () => resolve()
      request.onerror = () => reject(new Error('Failed to queue action for sync'))
    })
  }

  /**
   * Get offline appointments
   */
  async getOfflineAppointments(): Promise<OfflineAppointment[]> {
    if (!this.db) await this.init()

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(['appointments'], 'readonly')
      const store = transaction.objectStore('appointments')
      const request = store.getAll()

      request.onsuccess = () => resolve(request.result)
      request.onerror = () => reject(new Error('Failed to get offline appointments'))
    })
  }

  /**
   * Get offline reviews
   */
  async getOfflineReviews(): Promise<OfflineReview[]> {
    if (!this.db) await this.init()

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(['reviews'], 'readonly')
      const store = transaction.objectStore('reviews')
      const request = store.getAll()

      request.onsuccess = () => resolve(request.result)
      request.onerror = () => reject(new Error('Failed to get offline reviews'))
    })
  }

  /**
   * Cache API response
   */
  async cacheResponse(url: string, data: any, ttl: number = 3600000): Promise<void> {
    if (!this.db) await this.init()

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(['cache'], 'readwrite')
      const store = transaction.objectStore('cache')

      const cacheEntry = {
        url,
        data,
        timestamp: Date.now(),
        ttl,
      }

      const request = store.put(cacheEntry)
      request.onsuccess = () => resolve()
      request.onerror = () => reject(new Error('Failed to cache response'))
    })
  }

  /**
   * Get cached response
   */
  async getCachedResponse(url: string): Promise<any | null> {
    if (!this.db) await this.init()

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(['cache'], 'readonly')
      const store = transaction.objectStore('cache')
      const request = store.get(url)

      request.onsuccess = () => {
        const cacheEntry = request.result
        if (!cacheEntry) {
          resolve(null)
          return
        }

        // Check if cache is expired
        if (Date.now() - cacheEntry.timestamp > cacheEntry.ttl) {
          // Remove expired cache
          const deleteTransaction = this.db!.transaction(['cache'], 'readwrite')
          const deleteStore = deleteTransaction.objectStore('cache')
          deleteStore.delete(url)
          resolve(null)
          return
        }

        resolve(cacheEntry.data)
      }
      request.onerror = () => reject(new Error('Failed to get cached response'))
    })
  }

  /**
   * Sync pending data when back online
   */
  async syncPendingData(): Promise<void> {
    if (!this.db) await this.init()

    try {
      console.log('Starting data synchronization...')

      // Get pending actions
      const pendingActions = await this.getPendingActions()

      for (const action of pendingActions) {
        try {
          await this.syncAction(action)
          await this.markActionAsSynced(action.id)
        } catch (error) {
          console.error(`Failed to sync action ${action.id}:`, error)
          await this.incrementRetryCount(action.id)
        }
      }

      // Sync offline appointments
      const offlineAppointments = await this.getOfflineAppointments()
      const unsyncedAppointments = offlineAppointments.filter(apt => !apt.synced)

      for (const appointment of unsyncedAppointments) {
        try {
          await this.syncAppointment(appointment)
          await this.markAppointmentAsSynced(appointment.id)
        } catch (error) {
          console.error(`Failed to sync appointment ${appointment.id}:`, error)
        }
      }

      // Sync offline reviews
      const offlineReviews = await this.getOfflineReviews()
      const unsyncedReviews = offlineReviews.filter(review => !review.synced)

      for (const review of unsyncedReviews) {
        try {
          await this.syncReview(review)
          await this.markReviewAsSynced(review.id)
        } catch (error) {
          console.error(`Failed to sync review ${review.id}:`, error)
        }
      }

      console.log('Data synchronization completed')
    } catch (error) {
      console.error('Data synchronization failed:', error)
    }
  }

  /**
   * Get pending actions
   */
  private async getPendingActions(): Promise<OfflineAction[]> {
    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(['pendingActions'], 'readonly')
      const store = transaction.objectStore('pendingActions')
      const index = store.index('synced')
      const request = index.getAll(IDBKeyRange.only(false)) // Get unsynced actions

      request.onsuccess = () => resolve(request.result)
      request.onerror = () => reject(new Error('Failed to get pending actions'))
    })
  }

  /**
   * Sync individual action
   */
  private async syncAction(action: OfflineAction): Promise<void> {
    // Implementation would depend on the action type
    // This is a placeholder for the actual sync logic
    console.log('Syncing action:', action.type, action.id)
  }

  /**
   * Sync appointment with server
   */
  private async syncAppointment(appointment: OfflineAppointment): Promise<void> {
    // Implementation would make API call to sync appointment
    console.log('Syncing appointment:', appointment.id)
  }

  /**
   * Sync review with server
   */
  private async syncReview(review: OfflineReview): Promise<void> {
    // Implementation would make API call to sync review
    console.log('Syncing review:', review.id)
  }

  /**
   * Mark action as synced
   */
  private async markActionAsSynced(actionId: string): Promise<void> {
    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(['pendingActions'], 'readwrite')
      const store = transaction.objectStore('pendingActions')
      const request = store.get(actionId)

      request.onsuccess = () => {
        const action = request.result
        if (action) {
          action.synced = true
          const updateRequest = store.put(action)
          updateRequest.onsuccess = () => resolve()
          updateRequest.onerror = () => reject(new Error('Failed to mark action as synced'))
        } else {
          resolve()
        }
      }
      request.onerror = () => reject(new Error('Failed to get action for sync update'))
    })
  }

  /**
   * Mark appointment as synced
   */
  private async markAppointmentAsSynced(appointmentId: string): Promise<void> {
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
          updateRequest.onerror = () => reject(new Error('Failed to mark appointment as synced'))
        } else {
          resolve()
        }
      }
      request.onerror = () => reject(new Error('Failed to get appointment for sync update'))
    })
  }

  /**
   * Mark review as synced
   */
  private async markReviewAsSynced(reviewId: string): Promise<void> {
    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(['reviews'], 'readwrite')
      const store = transaction.objectStore('reviews')
      const request = store.get(reviewId)

      request.onsuccess = () => {
        const review = request.result
        if (review) {
          review.synced = true
          const updateRequest = store.put(review)
          updateRequest.onsuccess = () => resolve()
          updateRequest.onerror = () => reject(new Error('Failed to mark review as synced'))
        } else {
          resolve()
        }
      }
      request.onerror = () => reject(new Error('Failed to get review for sync update'))
    })
  }

  /**
   * Increment retry count for failed action
   */
  private async incrementRetryCount(actionId: string): Promise<void> {
    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(['pendingActions'], 'readwrite')
      const store = transaction.objectStore('pendingActions')
      const request = store.get(actionId)

      request.onsuccess = () => {
        const action = request.result
        if (action) {
          action.retryCount += 1
          const updateRequest = store.put(action)
          updateRequest.onsuccess = () => resolve()
          updateRequest.onerror = () => reject(new Error('Failed to increment retry count'))
        } else {
          resolve()
        }
      }
      request.onerror = () => reject(new Error('Failed to get action for retry update'))
    })
  }

  /**
   * Clear old cached data
   */
  async clearOldCache(): Promise<void> {
    if (!this.db) await this.init()

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(['cache'], 'readwrite')
      const store = transaction.objectStore('cache')
      const index = store.index('timestamp')

      const request = index.openCursor()
      const cutoffTime = Date.now() - (24 * 60 * 60 * 1000) // 24 hours ago

      request.onsuccess = (event) => {
        const cursor = (event.target as IDBRequest).result
        if (cursor) {
          if (cursor.value.timestamp < cutoffTime) {
            cursor.delete()
          }
          cursor.continue()
        } else {
          resolve()
        }
      }

      request.onerror = () => reject(new Error('Failed to clear old cache'))
    })
  }

  /**
   * Get storage usage information
   */
  async getStorageInfo(): Promise<{
    used: number
    available: number
    percentage: number
  }> {
    if ('storage' in navigator && 'estimate' in navigator.storage) {
      const estimate = await navigator.storage.estimate()
      const used = estimate.usage || 0
      const available = estimate.quota || 0
      const percentage = available > 0 ? (used / available) * 100 : 0

      return { used, available, percentage }
    }

    return { used: 0, available: 0, percentage: 0 }
  }

  /**
   * Clear all offline data
   */
  async clearAllData(): Promise<void> {
    if (!this.db) await this.init()

    const stores = ['appointments', 'reviews', 'pendingActions', 'cache', 'preferences']

    const promises = stores.map(storeName => {
      return new Promise<void>((resolve, reject) => {
        const transaction = this.db!.transaction([storeName], 'readwrite')
        const store = transaction.objectStore(storeName)
        const request = store.clear()

        request.onsuccess = () => resolve()
        request.onerror = () => reject(new Error(`Failed to clear ${storeName}`))
      })
    })

    await Promise.all(promises)
    console.log('All offline data cleared')
  }
}

export const offlineService = new OfflineService()
export default offlineService
