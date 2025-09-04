// 🔄 Complete Synchronization Manager for Payload CMS + Supabase
import { getPayload } from 'payload'
import { supabase } from './supabase'
import { logger } from './logger'

export interface SyncConfig {
  enabledCollections: string[]
  syncDirection: 'payload-to-supabase' | 'supabase-to-payload' | 'bidirectional'
  conflictResolution: 'payload-wins' | 'supabase-wins' | 'last-write-wins' | 'manual'
  batchSize: number
  syncInterval: number
  retryAttempts: number
  enableRealTime: boolean
}

export class SyncManager {
  private static instance: SyncManager
  private config: SyncConfig
  private isSyncing = false
  private syncQueue: SyncJob[] = []
  private realtimeSubscriptions: Map<string, any> = new Map()

  private constructor(config: Partial<SyncConfig> = {}) {
    this.config = {
      enabledCollections: [
        'users', 'tenants', 'customers', 'services', 'stylists',
        'appointments', 'products', 'locations', 'pages',
        'commissions', 'inventory', 'service-packages', 'wait-list',
        'documentation', 'notifications'
      ],
      syncDirection: 'bidirectional',
      conflictResolution: 'last-write-wins',
      batchSize: 100,
      syncInterval: 5 * 60 * 1000, // 5 minutes
      retryAttempts: 3,
      enableRealTime: true,
      ...config
    }
  }

  static getInstance(config?: Partial<SyncConfig>): SyncManager {
    if (!SyncManager.instance) {
      SyncManager.instance = new SyncManager(config)
    }
    return SyncManager.instance
  }

  // 🎯 Initialize synchronization system
  async initialize() {
    logger.info('🔄 Initializing Sync Manager...')

    // Setup real-time subscriptions if enabled
    if (this.config.enableRealTime) {
      await this.setupRealtimeSync()
    }

    // Start periodic sync if configured
    if (this.config.syncInterval > 0) {
      setInterval(() => this.performFullSync(), this.config.syncInterval)
    }

    // Initial full sync
    await this.performFullSync()

    logger.info('✅ Sync Manager initialized successfully')
  }

  // 🔄 Perform full synchronization
  async performFullSync() {
    if (this.isSyncing) {
      logger.info('⏳ Sync already in progress, skipping...')
      return
    }

    this.isSyncing = true
    logger.info('🔄 Starting full synchronization...')

    try {
      const results = await Promise.allSettled(
        this.config.enabledCollections.map(collection =>
          this.syncCollection(collection)
        )
      )

      const successful = results.filter(r => r.status === 'fulfilled').length
      const failed = results.filter(r => r.status === 'rejected').length

      logger.info(`✅ Sync completed: ${successful} successful, ${failed} failed`)

      if (failed > 0) {
        logger.warn('❌ Some collections failed to sync:', results
          .filter(r => r.status === 'rejected')
          .map((r: any) => r.reason.message)
        )
      }

    } catch (error) {
      logger.error('❌ Full sync failed:', error)
    } finally {
      this.isSyncing = false
    }
  }

  // 🔄 Sync individual collection
  async syncCollection(collection: string): Promise<void> {
    logger.info(`🔄 Syncing collection: ${collection}`)

    try {
      const payload = await getPayload()

      // Get last sync timestamp for incremental sync
      const lastSync = await this.getLastSyncTimestamp(collection)

      // Get data from Payload
      const payloadData = await payload.find({
        collection,
        where: lastSync ? {
          updatedAt: { greater_than: lastSync }
        } : undefined,
        limit: this.config.batchSize,
        sort: '-updatedAt'
      })

      if (payloadData.docs.length === 0) {
        logger.info(`📭 No new data for ${collection}`)
        return
      }

      // Transform and sync to Supabase
      const transformedData = payloadData.docs.map(doc =>
        this.transformPayloadToSupabase(collection, doc)
      )

      // Batch insert/update in Supabase
      const { error } = await supabase
        .from(collection)
        .upsert(transformedData, {
          onConflict: 'id',
          ignoreDuplicates: false
        })

      if (error) {
        throw new Error(`Supabase sync failed: ${error.message}`)
      }

      // Update sync timestamp
      await this.updateLastSyncTimestamp(collection, new Date().toISOString())

      logger.info(`✅ Synced ${payloadData.docs.length} records for ${collection}`)

    } catch (error) {
      logger.error(`❌ Failed to sync ${collection}:`, error)
      throw error
    }
  }

  // 🔄 Setup real-time synchronization
  async setupRealtimeSync() {
    logger.info('🔄 Setting up real-time synchronization...')

    for (const collection of this.config.enabledCollections) {
      try {
        const subscription = supabase
          .channel(`${collection}_changes`)
          .on('postgres_changes', {
            event: '*',
            schema: 'public',
            table: collection
          }, async (payload) => {
            await this.handleRealtimeChange(collection, payload)
          })
          .subscribe()

        this.realtimeSubscriptions.set(collection, subscription)
        logger.info(`✅ Real-time sync enabled for ${collection}`)

      } catch (error) {
        logger.error(`❌ Failed to setup real-time sync for ${collection}:`, error)
      }
    }
  }

  // 🔄 Handle real-time changes
  async handleRealtimeChange(collection: string, payload: any) {
    try {
      const payloadInstance = await getPayload()

      switch (payload.eventType) {
        case 'INSERT':
          await this.syncRecordToPayload(collection, payload.new, 'create')
          break
        case 'UPDATE':
          await this.syncRecordToPayload(collection, payload.new, 'update')
          break
        case 'DELETE':
          await payloadInstance.delete({
            collection,
            id: payload.old.id
          })
          break
      }

      logger.info(`🔄 Real-time sync: ${payload.eventType} on ${collection}`)
    } catch (error) {
      logger.error(`❌ Real-time sync failed for ${collection}:`, error)
    }
  }

  // 🔄 Sync record to Payload
  async syncRecordToPayload(collection: string, data: any, operation: 'create' | 'update') {
    const payload = await getPayload()
    const transformedData = this.transformSupabaseToPayload(collection, data)

    if (operation === 'create') {
      await payload.create({
        collection,
        data: transformedData
      })
    } else {
      await payload.update({
        collection,
        id: data.id,
        data: transformedData
      })
    }
  }

  // 🔄 Transform Payload data to Supabase format
  transformPayloadToSupabase(collection: string, data: any): any {
    const transformed = { ...data }

    // Remove Payload-specific fields
    delete transformed._id
    delete transformed.__v

    // Transform field names and types
    if (transformed.createdAt) {
      transformed.created_at = transformed.createdAt
      delete transformed.createdAt
    }

    if (transformed.updatedAt) {
      transformed.updated_at = transformed.updatedAt
      delete transformed.updatedAt
    }

    // Handle relationships - convert to simple IDs
    Object.keys(transformed).forEach(key => {
      if (transformed[key] && typeof transformed[key] === 'object' && transformed[key].id) {
        transformed[key] = transformed[key].id
      }
    })

    return transformed
  }

  // 🔄 Transform Supabase data to Payload format
  transformSupabaseToPayload(collection: string, data: any): any {
    const transformed = { ...data }

    // Transform field names
    if (transformed.created_at) {
      transformed.createdAt = transformed.created_at
      delete transformed.created_at
    }

    if (transformed.updated_at) {
      transformed.updatedAt = transformed.updated_at
      delete transformed.updated_at
    }

    // Handle any Supabase-specific transformations
    return transformed
  }

  // 🔄 Get last sync timestamp
  async getLastSyncTimestamp(collection: string): Promise<string | null> {
    try {
      const { data } = await supabase
        .from('sync_metadata')
        .select('last_sync')
        .eq('collection', collection)
        .single()

      return data?.last_sync || null
    } catch {
      return null
    }
  }

  // 🔄 Update last sync timestamp
  async updateLastSyncTimestamp(collection: string, timestamp: string) {
    try {
      await supabase
        .from('sync_metadata')
        .upsert({
          collection,
          last_sync: timestamp,
          updated_at: new Date().toISOString()
        }, {
          onConflict: 'collection'
        })
    } catch (error) {
      logger.error(`Failed to update sync timestamp for ${collection}:`, error)
    }
  }

  // 🔄 Queue sync job
  queueSync(collection: string, priority: 'high' | 'normal' | 'low' = 'normal') {
    this.syncQueue.push({
      collection,
      priority,
      timestamp: Date.now(),
      attempts: 0
    })

    // Sort by priority
    this.syncQueue.sort((a, b) => {
      const priorityOrder = { high: 0, normal: 1, low: 2 }
      return priorityOrder[a.priority] - priorityOrder[b.priority]
    })
  }

  // 🔄 Process sync queue
  async processSyncQueue() {
    while (this.syncQueue.length > 0) {
      const job = this.syncQueue.shift()
      if (!job) continue

      try {
        await this.syncCollection(job.collection)
        logger.info(`✅ Queued sync completed for ${job.collection}`)
      } catch (error) {
        job.attempts++
        if (job.attempts < this.config.retryAttempts) {
          // Retry with exponential backoff
          setTimeout(() => {
            this.syncQueue.unshift(job)
          }, Math.pow(2, job.attempts) * 1000)
        } else {
          logger.error(`❌ Queued sync failed permanently for ${job.collection}:`, error)
        }
      }
    }
  }

  // 🔄 Get sync status
  getSyncStatus() {
    return {
      isSyncing: this.isSyncing,
      queueLength: this.syncQueue.length,
      enabledCollections: this.config.enabledCollections,
      realtimeEnabled: this.config.enableRealTime,
      lastSync: new Date().toISOString()
    }
  }

  // 🔄 Cleanup
  cleanup() {
    // Unsubscribe from real-time channels
    for (const [collection, subscription] of this.realtimeSubscriptions) {
      subscription.unsubscribe()
      logger.info(`🧹 Cleaned up real-time subscription for ${collection}`)
    }
    this.realtimeSubscriptions.clear()
  }
}

interface SyncJob {
  collection: string
  priority: 'high' | 'normal' | 'low'
  timestamp: number
  attempts: number
}

// 🎯 Export singleton instance
export const syncManager = SyncManager.getInstance()

// 🎯 Utility functions for easy access
export const syncCollection = (collection: string) => syncManager.syncCollection(collection)
export const performFullSync = () => syncManager.performFullSync()
export const getSyncStatus = () => syncManager.getSyncStatus()
export const queueSync = (collection: string, priority?: 'high' | 'normal' | 'low') =>
  syncManager.queueSync(collection, priority)
