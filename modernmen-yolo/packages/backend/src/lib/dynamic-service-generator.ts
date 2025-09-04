import { z } from 'zod'
import { supabase } from '@/lib/supabase/client'
import { FlexibleQueryBuilder, QueryBuilderFactory, QueryOptions, QueryFilter, QuerySort } from './flexible-query-builder'

// =============================================================================
// DYNAMIC SERVICE GENERATOR
// =============================================================================
// Automatically generates CRUD services for any collection with full TypeScript support,
// validation, caching, and real-time capabilities.

export interface ServiceConfig {
  tableName: string
  primaryKey?: string
  searchableFields?: string[]
  filterableFields?: string[]
  sortableFields?: string[]
  relationships?: ServiceRelationship[]
  validation?: {
    create?: z.ZodSchema
    update?: z.ZodSchema
    filter?: z.ZodSchema
  }
  hooks?: {
    beforeCreate?: (data: any) => Promise<any> | any
    afterCreate?: (data: any) => Promise<void> | void
    beforeUpdate?: (data: any) => Promise<any> | any
    afterUpdate?: (data: any) => Promise<void> | void
    beforeDelete?: (id: string) => Promise<void> | void
    afterDelete?: (id: string) => Promise<void> | void
  }
  cache?: {
    enabled: boolean
    ttl?: number
    key?: string
  }
  realtime?: {
    enabled: boolean
    events?: ('INSERT' | 'UPDATE' | 'DELETE')[]
  }
}

export interface ServiceRelationship {
  name: string
  type: 'belongsTo' | 'hasMany' | 'hasOne'
  foreignKey: string
  localKey?: string
  relatedTable: string
  select?: string
}

export interface QueryParams {
  filters?: QueryFilter[]
  sorting?: QuerySort[]
  pagination?: {
    page?: number
    limit?: number
    offset?: number
  }
  search?: string
  include?: string[]
  select?: string
}

export interface PaginatedResult<T> {
  data: T[]
  total: number
  page: number
  limit: number
  totalPages: number
  hasNext: boolean
  hasPrev: boolean
}

export class DynamicService<T = any> {
  protected config: ServiceConfig
  protected cache = new Map<string, { data: any, timestamp: number }>()

  constructor(config: ServiceConfig) {
    this.config = {
      primaryKey: 'id',
      searchableFields: ['name', 'title', 'email'],
      filterableFields: ['status', 'type', 'category'],
      sortableFields: ['createdAt', 'updatedAt', 'name'],
      ...config
    }
  }

  // =============================================================================
  // CRUD OPERATIONS
  // =============================================================================

  async findMany(params: QueryParams = {}): Promise<PaginatedResult<T>> {
    const cacheKey = this.getCacheKey('findMany', params)

    if (this.config.cache?.enabled) {
      const cached = this.getCached(cacheKey)
      if (cached) return cached
    }

    const query = this.buildQuery(params)
    const result = await query.execute()

    const paginatedResult = this.formatPaginatedResult(result, params.pagination)

    if (this.config.cache?.enabled) {
      this.setCached(cacheKey, paginatedResult)
    }

    return paginatedResult
  }

  async findById(id: string, include?: string[]): Promise<T | null> {
    const cacheKey = this.getCacheKey('findById', { id, include })

    if (this.config.cache?.enabled) {
      const cached = this.getCached(cacheKey)
      if (cached) return cached?.data?.[0] || null
    }

    const query = QueryBuilderFactory.create<T>(this.config.tableName)
      .where({ field: this.config.primaryKey!, operator: 'eq', value: id })

    if (include && include.length > 0) {
      query.withMultiple(
        include.map(rel => ({ name: rel, select: '*' }))
      )
    }

    const result = await query.execute()

    const data = result.data?.[0] || null

    if (this.config.cache?.enabled && data) {
      this.setCached(cacheKey, { data: [data], total: 1 })
    }

    return data
  }

  async create(data: Partial<T>): Promise<T> {
    // Validate input
    if (this.config.validation?.create) {
      const validation = this.config.validation.create.safeParse(data)
      if (!validation.success) {
        throw new Error(`Validation failed: ${validation.error.message}`)
      }
      data = validation.data
    }

    // Run before hook
    if (this.config.hooks?.beforeCreate) {
      data = await this.config.hooks.beforeCreate(data)
    }

    const query = supabase
      .from(this.config.tableName)
      .insert(data)
      .select()
      .single()

    const { data: result, error } = await query

    if (error) throw error

    // Run after hook
    if (this.config.hooks?.afterCreate) {
      await this.config.hooks.afterCreate(result)
    }

    // Clear cache
    this.clearCache()

    return result
  }

  async update(id: string, data: Partial<T>): Promise<T> {
    // Validate input
    if (this.config.validation?.update) {
      const validation = this.config.validation.update.safeParse(data)
      if (!validation.success) {
        throw new Error(`Validation failed: ${validation.error.message}`)
      }
      data = validation.data
    }

    // Run before hook
    if (this.config.hooks?.beforeUpdate) {
      data = await this.config.hooks.beforeUpdate(data)
    }

    const query = supabase
      .from(this.config.tableName)
      .update({
        ...data,
        updatedAt: new Date().toISOString()
      })
      .eq(this.config.primaryKey!, id)
      .select()
      .single()

    const { data: result, error } = await query

    if (error) throw error

    // Run after hook
    if (this.config.hooks?.afterUpdate) {
      await this.config.hooks.afterUpdate(result)
    }

    // Clear cache
    this.clearCache()

    return result
  }

  async delete(id: string): Promise<boolean> {
    // Run before hook
    if (this.config.hooks?.beforeDelete) {
      await this.config.hooks.beforeDelete(id)
    }

    const { error } = await supabase
      .from(this.config.tableName)
      .delete()
      .eq(this.config.primaryKey!, id)

    if (error) throw error

    // Run after hook
    if (this.config.hooks?.afterDelete) {
      await this.config.hooks.afterDelete(id)
    }

    // Clear cache
    this.clearCache()

    return true
  }

  async count(filters?: QueryFilter[]): Promise<number> {
    const query = QueryBuilderFactory.create(this.config.tableName)

    if (filters) {
      filters.forEach(filter => query.where(filter))
    }

    query.count()
    const result = await query.execute()

    return result.total
  }

  async exists(id: string): Promise<boolean> {
    const result = await this.findById(id)
    return result !== null
  }

  // =============================================================================
  // ADVANCED QUERY METHODS
  // =============================================================================

  async findFirst(params: QueryParams = {}): Promise<T | null> {
    const result = await this.findMany({
      ...params,
      pagination: { page: 1, limit: 1 }
    })
    return result.data?.[0] || null
  }

  async findUnique(field: string, value: any, include?: string[]): Promise<T | null> {
    const query = QueryBuilderFactory.create<T>(this.config.tableName)
      .where({ field, operator: 'eq', value: value })

    if (include && include.length > 0) {
      query.withMultiple(
        include.map(rel => ({ name: rel, select: '*' }))
      )
    }

    const result = await query.execute()
    return result.data?.[0] || null
  }

  async search(query: string, fields?: string[], params: QueryParams = {}): Promise<PaginatedResult<T>> {
    const searchFields = fields || this.config.searchableFields || []

    const searchQuery = QueryBuilderFactory.create<T>(this.config.tableName)
      .search(query, searchFields)

    // Apply additional filters
    if (params.filters) {
      params.filters.forEach(filter => searchQuery.where(filter))
    }

    // Apply sorting
    if (params.sorting) {
      searchQuery.orderByMultiple(params.sorting)
    }

    // Apply pagination
    if (params.pagination) {
      searchQuery.paginate(params.pagination.page, params.pagination.limit)
    }

    const result = await searchQuery.execute()
    return this.formatPaginatedResult(result, params.pagination)
  }

  async aggregate(aggregation: {
    type: 'count' | 'sum' | 'avg' | 'min' | 'max'
    field?: string
    groupBy?: string[]
    filters?: QueryFilter[]
  }): Promise<any> {
    // This is a simplified implementation
    // In practice, you'd need to build complex aggregation queries
    const query = QueryBuilderFactory.create(this.config.tableName)

    if (aggregation.filters) {
      aggregation.filters.forEach(filter => query.where(filter))
    }

    if (aggregation.type === 'count') {
      return this.count(aggregation.filters)
    }

    // For other aggregations, you'd need to implement custom logic
    // based on your database schema and requirements

    return null
  }

  // =============================================================================
  // RELATIONSHIP METHODS
  // =============================================================================

  async loadRelationships(data: T | T[], relationships: string[]): Promise<T | T[]> {
    if (!relationships.length) return data

    const isArray = Array.isArray(data)
    const items = isArray ? data : [data]

    for (const relationship of relationships) {
      const relConfig = this.config.relationships?.find(r => r.name === relationship)
      if (!relConfig) continue

      // Load related data based on relationship type
      for (const item of items as any[]) {
        const foreignKeyValue = item[relConfig.foreignKey]

        if (relConfig.type === 'belongsTo') {
          item[relationship] = await this.loadBelongsTo(foreignKeyValue, relConfig)
        } else if (relConfig.type === 'hasMany') {
          item[relationship] = await this.loadHasMany(item[this.config.primaryKey!], relConfig)
        } else if (relConfig.type === 'hasOne') {
          item[relationship] = await this.loadHasOne(item[this.config.primaryKey!], relConfig)
        }
      }
    }

    return isArray ? items : items[0]
  }

  private async loadBelongsTo(foreignKeyValue: any, relConfig: ServiceRelationship): Promise<any> {
    if (!foreignKeyValue) return null

    const { data } = await supabase
      .from(relConfig.relatedTable)
      .select(relConfig.select || '*')
      .eq(relConfig.localKey || 'id', foreignKeyValue)
      .single()

    return data
  }

  private async loadHasMany(localKeyValue: any, relConfig: ServiceRelationship): Promise<any[]> {
    if (!localKeyValue) return []

    const { data } = await supabase
      .from(relConfig.relatedTable)
      .select(relConfig.select || '*')
      .eq(relConfig.foreignKey, localKeyValue)

    return data || []
  }

  private async loadHasOne(localKeyValue: any, relConfig: ServiceRelationship): Promise<any> {
    if (!localKeyValue) return null

    const { data } = await supabase
      .from(relConfig.relatedTable)
      .select(relConfig.select || '*')
      .eq(relConfig.foreignKey, localKeyValue)
      .single()

    return data
  }

  // =============================================================================
  // REAL-TIME METHODS
  // =============================================================================

  subscribeToChanges(callback: (payload: any) => void): { unsubscribe: () => void } {
    if (!this.config.realtime?.enabled) {
      return { unsubscribe: () => {} }
    }

    const events = this.config.realtime.events || ['INSERT', 'UPDATE', 'DELETE']

    const channel = supabase
      .channel(`${this.config.tableName}_changes`)
      .on('postgres_changes',
        {
          event: events.join(',') as any,
          schema: 'public',
          table: this.config.tableName
        },
        (payload) => {
          // Clear cache on changes
          this.clearCache()

          // Call user callback
          callback(payload)
        }
      )
      .subscribe()

    return {
      unsubscribe: () => {
        supabase.removeChannel(channel)
      }
    }
  }

  // =============================================================================
  // UTILITY METHODS
  // =============================================================================

  private buildQuery(params: QueryParams): FlexibleQueryBuilder<T> {
    const query = QueryBuilderFactory.create<T>(this.config.tableName)

    // Apply custom select
    if (params.select) {
      query.select(params.select)
    }

    // Apply relationships
    if (params.include && params.include.length > 0) {
      query.withMultiple(
        params.include.map(rel => ({ name: rel, select: '*' }))
      )
    }

    // Apply filters
    if (params.filters) {
      params.filters.forEach(filter => query.where(filter))
    }

    // Apply search
    if (params.search && this.config.searchableFields) {
      query.search(params.search, this.config.searchableFields)
    }

    // Apply sorting
    if (params.sorting && params.sorting.length > 0) {
      query.orderByMultiple(params.sorting)
    } else {
      // Default sorting
      query.orderBy('createdAt', 'desc')
    }

    // Apply pagination
    if (params.pagination) {
      query.paginate(params.pagination.page || 1, params.pagination.limit || 10)
    }

    return query
  }

  private formatPaginatedResult(result: any, pagination?: QueryParams['pagination']): PaginatedResult<T> {
    const page = pagination?.page || 1
    const limit = pagination?.limit || 10
    const totalPages = Math.ceil(result.total / limit)

    return {
      data: result.data || [],
      total: result.total || 0,
      page,
      limit,
      totalPages,
      hasNext: page < totalPages,
      hasPrev: page > 1
    }
  }

  private getCacheKey(operation: string, params: any): string {
    const cacheKey = this.config.cache?.key || this.config.tableName
    return `${cacheKey}_${operation}_${JSON.stringify(params)}`
  }

  private getCached(key: string): any {
    const cached = this.cache.get(key)
    if (!cached) return null

    const ttl = this.config.cache?.ttl || 300000 // 5 minutes default
    if (Date.now() - cached.timestamp > ttl) {
      this.cache.delete(key)
      return null
    }

    return cached.data
  }

  private setCached(key: string, data: any): void {
    this.cache.set(key, {
      data,
      timestamp: Date.now()
    })
  }

  private clearCache(): void {
    // Clear all cache entries for this service
    for (const key of this.cache.keys()) {
      if (key.startsWith(this.config.tableName)) {
        this.cache.delete(key)
      }
    }
  }
}

// =============================================================================
// SERVICE FACTORY
// =============================================================================

export class ServiceFactory {
  private static services = new Map<string, DynamicService>()

  static create<T = any>(config: ServiceConfig): DynamicService<T> {
    const service = new DynamicService<T>(config)
    this.services.set(config.tableName, service)
    return service
  }

  static get<T = any>(tableName: string): DynamicService<T> | undefined {
    return this.services.get(tableName) as DynamicService<T>
  }

  static createFromCollection<T = any>(collectionSlug: string, customConfig?: Partial<ServiceConfig>): DynamicService<T> {
    const baseConfig: ServiceConfig = {
      tableName: collectionSlug,
      primaryKey: 'id',
      searchableFields: ['name', 'title', 'email', 'description'],
      filterableFields: ['status', 'type', 'category', 'isActive'],
      sortableFields: ['createdAt', 'updatedAt', 'name', 'title'],
      cache: {
        enabled: true,
        ttl: 300000 // 5 minutes
      },
      realtime: {
        enabled: true,
        events: ['INSERT', 'UPDATE', 'DELETE']
      },
      ...customConfig
    }

    return this.create<T>(baseConfig)
  }
}

// =============================================================================
// USAGE EXAMPLES
// =============================================================================

/*
// Basic usage:
const appointmentService = ServiceFactory.createFromCollection('appointments', {
  relationships: [
    { name: 'customer', type: 'belongsTo', foreignKey: 'customer_id', relatedTable: 'customers' },
    { name: 'service', type: 'belongsTo', foreignKey: 'service_id', relatedTable: 'services' },
    { name: 'staff', type: 'belongsTo', foreignKey: 'staff_id', relatedTable: 'staff' }
  ]
})

// Find appointments with relationships
const appointments = await appointmentService.findMany({
  include: ['customer', 'service', 'staff'],
  filters: [
    { field: 'status', operator: 'eq', value: 'confirmed' },
    { field: 'appointment_date', operator: 'gte', value: new Date() }
  ],
  sorting: [{ field: 'appointment_date', direction: 'asc' }],
  pagination: { page: 1, limit: 10 }
})

// Search appointments
const searchResults = await appointmentService.search('john', ['customer_name', 'service_name'])

// Real-time subscription
const subscription = appointmentService.subscribeToChanges((payload) => {
  console.log('Appointment changed:', payload)
})

// Later: subscription.unsubscribe()
*/
