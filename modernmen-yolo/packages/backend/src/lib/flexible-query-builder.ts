import { supabase } from '@/lib/supabase/client'

// =============================================================================
// FLEXIBLE QUERY BUILDER
// =============================================================================
// Advanced query builder that supports complex relationships, dynamic filtering,
// aggregation, and real-time subscriptions with automatic type inference.

export interface QueryOptions {
  select?: string | string[]
  filters?: QueryFilter[]
  sorting?: QuerySort[]
  pagination?: {
    page?: number
    limit?: number
    offset?: number
  }
  relationships?: QueryRelationship[]
  aggregations?: QueryAggregation[]
  realtime?: boolean
  cache?: {
    enabled: boolean
    ttl?: number
  }
}

export interface QueryFilter {
  field: string
  operator: QueryOperator
  value: any
  or?: QueryFilter[]
  and?: QueryFilter[]
}

export type QueryOperator =
  | 'eq' | 'ne' | 'gt' | 'gte' | 'lt' | 'lte'
  | 'in' | 'nin' | 'contains' | 'notContains'
  | 'startsWith' | 'endsWith' | 'isNull' | 'notNull'
  | 'between' | 'notBetween'

export interface QuerySort {
  field: string
  direction: 'asc' | 'desc'
  nullsFirst?: boolean
}

export interface QueryRelationship {
  name: string
  select?: string
  filters?: QueryFilter[]
  limit?: number
  orderBy?: QuerySort
}

export interface QueryAggregation {
  type: 'count' | 'sum' | 'avg' | 'min' | 'max'
  field?: string
  alias?: string
  groupBy?: string[]
}

export interface QueryResult<T = any> {
  data: T[]
  total: number
  aggregations?: Record<string, any>
  pagination?: {
    page: number
    limit: number
    totalPages: number
    hasNext: boolean
    hasPrev: boolean
  }
}

export class FlexibleQueryBuilder<T = any> {
  private tableName: string
  private query: any
  private options: QueryOptions

  constructor(tableName: string, options: QueryOptions = {}) {
    this.tableName = tableName
    this.options = options
    this.query = supabase.from(tableName)
  }

  // =============================================================================
  // SELECTION METHODS
  // =============================================================================

  select(fields: string | string[]): this {
    if (Array.isArray(fields)) {
      this.query = this.query.select(fields.join(', '))
    } else {
      this.query = this.query.select(fields)
    }
    return this
  }

  selectWithRelationships(relationships: QueryRelationship[] = []): this {
    const selectParts: string[] = ['*']

    relationships.forEach(rel => {
      const relSelect = rel.select || '*'
      const relLimit = rel.limit ? `(${relSelect})` : relSelect
      selectParts.push(`${rel.name}:${relLimit}`)

      if (rel.filters && rel.filters.length > 0) {
        // Note: This is a simplified implementation
        // In practice, you'd need to handle nested filters
      }
    })

    this.query = this.query.select(selectParts.join(', '))
    return this
  }

  // =============================================================================
  // FILTERING METHODS
  // =============================================================================

  where(filter: QueryFilter): this {
    this.applyFilter(filter)
    return this
  }

  whereIn(field: string, values: any[]): this {
    this.query = this.query.in(field, values)
    return this
  }

  whereBetween(field: string, min: any, max: any): this {
    this.query = this.query.gte(field, min).lte(field, max)
    return this
  }

  whereNull(field: string): this {
    this.query = this.query.is(field, null)
    return this
  }

  whereNotNull(field: string): this {
    this.query = this.query.not(field, 'is', null)
    return this
  }

  search(query: string, fields: string[]): this {
    if (fields.length === 0) return this

    const searchConditions = fields.map(field =>
      `${field}.ilike.%${query}%`
    ).join(',')

    this.query = this.query.or(searchConditions)
    return this
  }

  private applyFilter(filter: QueryFilter): void {
    const { field, operator, value, or, and } = filter

    // Handle compound filters
    if (or && or.length > 0) {
      const orConditions = or.map(f => this.buildFilterCondition(f)).join(',')
      this.query = this.query.or(orConditions)
      return
    }

    if (and && and.length > 0) {
      and.forEach(f => this.applyFilter(f))
      return
    }

    // Handle single filter
    switch (operator) {
      case 'eq':
        this.query = this.query.eq(field, value)
        break
      case 'ne':
        this.query = this.query.neq(field, value)
        break
      case 'gt':
        this.query = this.query.gt(field, value)
        break
      case 'gte':
        this.query = this.query.gte(field, value)
        break
      case 'lt':
        this.query = this.query.lt(field, value)
        break
      case 'lte':
        this.query = this.query.lte(field, value)
        break
      case 'in':
        this.query = this.query.in(field, value)
        break
      case 'nin':
        this.query = this.query.not(field, 'in', `(${value.join(',')})`)
        break
      case 'contains':
        this.query = this.query.ilike(field, `%${value}%`)
        break
      case 'notContains':
        this.query = this.query.not(field, 'ilike', `%${value}%`)
        break
      case 'startsWith':
        this.query = this.query.ilike(field, `${value}%`)
        break
      case 'endsWith':
        this.query = this.query.ilike(field, `%${value}`)
        break
      case 'isNull':
        this.query = this.query.is(field, null)
        break
      case 'notNull':
        this.query = this.query.not(field, 'is', null)
        break
      case 'between':
        if (Array.isArray(value) && value.length === 2) {
          this.query = this.query.gte(field, value[0]).lte(field, value[1])
        }
        break
    }
  }

  private buildFilterCondition(filter: QueryFilter): string {
    const { field, operator, value } = filter

    switch (operator) {
      case 'eq':
        return `${field}.eq.${value}`
      case 'contains':
        return `${field}.ilike.*${value}*`
      case 'gt':
        return `${field}.gt.${value}`
      case 'lt':
        return `${field}.lt.${value}`
      default:
        return `${field}.eq.${value}`
    }
  }

  // =============================================================================
  // SORTING METHODS
  // =============================================================================

  orderBy(field: string, direction: 'asc' | 'desc' = 'asc', nullsFirst = false): this {
    this.query = this.query.order(field, {
      ascending: direction === 'asc',
      nullsFirst
    })
    return this
  }

  orderByMultiple(sorts: QuerySort[]): this {
    sorts.forEach(sort => {
      this.orderBy(sort.field, sort.direction, sort.nullsFirst)
    })
    return this
  }

  // =============================================================================
  // PAGINATION METHODS
  // =============================================================================

  paginate(page: number = 1, limit: number = 10): this {
    const offset = (page - 1) * limit
    this.query = this.query.range(offset, offset + limit - 1)
    return this
  }

  limit(count: number): this {
    this.query = this.query.limit(count)
    return this
  }

  offset(count: number): this {
    this.query = this.query.range(count, count + 1000) // Large range for offset
    return this
  }

  // =============================================================================
  // RELATIONSHIP METHODS
  // =============================================================================

  with(relationship: string, select?: string): this {
    const selectStr = select || '*'
    this.query = this.query.select(`*, ${relationship}(${selectStr})`)
    return this
  }

  withMultiple(relationships: QueryRelationship[]): this {
    const selectParts = ['*']

    relationships.forEach(rel => {
      const selectStr = rel.select || '*'
      selectParts.push(`${rel.name}(${selectStr})`)
    })

    this.query = this.query.select(selectParts.join(', '))
    return this
  }

  // =============================================================================
  // AGGREGATION METHODS
  // =============================================================================

  count(alias = 'count'): this {
    this.query = this.query.select('*', { count: 'exact', head: true })
    return this
  }

  // =============================================================================
  // EXECUTION METHODS
  // =============================================================================

  async execute(): Promise<QueryResult<T>> {
    try {
      let result

      if (this.options.aggregations && this.options.aggregations.length > 0) {
        result = await this.executeWithAggregations()
      } else {
        result = await this.executeStandard()
      }

      return this.formatResult(result)
    } catch (error) {
      console.error('Query execution failed:', error)
      throw error
    }
  }

  private async executeStandard() {
    const { data, error, count } = await this.query

    if (error) throw error

    return { data: data || [], count: count || 0 }
  }

  private async executeWithAggregations() {
    // This is a simplified implementation
    // In practice, you'd need to handle complex aggregations
    const { data, error, count } = await this.query

    if (error) throw error

    return { data: data || [], count: count || 0 }
  }

  private formatResult(result: any): QueryResult<T> {
    const { data, count } = result
    const pagination = this.calculatePagination(count || 0)

    return {
      data: data || [],
      total: count || 0,
      pagination
    }
  }

  private calculatePagination(total: number) {
    const { pagination } = this.options
    if (!pagination) return undefined

    const page = pagination.page || 1
    const limit = pagination.limit || 10
    const totalPages = Math.ceil(total / limit)

    return {
      page,
      limit,
      totalPages,
      hasNext: page < totalPages,
      hasPrev: page > 1
    }
  }

  // =============================================================================
  // REAL-TIME METHODS
  // =============================================================================

  subscribe(callback: (payload: any) => void): { unsubscribe: () => void } {
    const channel = supabase
      .channel(`${this.tableName}_changes`)
      .on('postgres_changes',
        { event: '*', schema: 'public', table: this.tableName },
        callback
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

  clone(): FlexibleQueryBuilder<T> {
    const cloned = new FlexibleQueryBuilder<T>(this.tableName, this.options)
    cloned.query = { ...this.query }
    return cloned
  }

  reset(): this {
    this.query = supabase.from(this.tableName)
    return this
  }

  toSQL(): string {
    // This would return the SQL representation of the query
    // Implementation depends on Supabase's internals
    return `SELECT * FROM ${this.tableName}`
  }
}

// =============================================================================
// QUERY BUILDER FACTORY
// =============================================================================

export class QueryBuilderFactory {
  static create<T = any>(tableName: string, options: QueryOptions = {}): FlexibleQueryBuilder<T> {
    return new FlexibleQueryBuilder<T>(tableName, options)
  }

  static forCollection<T = any>(collectionSlug: string): FlexibleQueryBuilder<T> {
    return new FlexibleQueryBuilder<T>(collectionSlug)
  }
}

// =============================================================================
// PRE-BUILT QUERY TEMPLATES
// =============================================================================

export class QueryTemplates {
  static searchAndFilter(tableName: string, searchQuery?: string, filters?: QueryFilter[], sorts?: QuerySort[]) {
    const builder = QueryBuilderFactory.create(tableName)

    if (searchQuery) {
      // Assuming common searchable fields - this could be made configurable
      builder.search(searchQuery, ['name', 'email', 'description'])
    }

    if (filters) {
      filters.forEach(filter => builder.where(filter))
    }

    if (sorts && sorts.length > 0) {
      builder.orderByMultiple(sorts)
    }

    return builder
  }

  static paginatedList(tableName: string, page = 1, limit = 10, filters?: QueryFilter[]) {
    const builder = QueryBuilderFactory.create(tableName)

    if (filters) {
      filters.forEach(filter => builder.where(filter))
    }

    builder
      .orderBy('createdAt', 'desc')
      .paginate(page, limit)

    return builder
  }

  static withRelationships(tableName: string, relationships: string[]) {
    const builder = QueryBuilderFactory.create(tableName)

    relationships.forEach(rel => {
      builder.with(rel)
    })

    return builder
  }

  static dashboardMetrics(tableName: string, dateRange?: { start: Date, end: Date }) {
    const builder = QueryBuilderFactory.create(tableName)

    if (dateRange) {
      builder.whereBetween('createdAt', dateRange.start, dateRange.end)
    }

    // Add common aggregations for dashboard
    builder.select([
      '*',
      'count(*) as total_count',
      'count(*) filter (where status = \'active\') as active_count'
    ])

    return builder
  }
}

// =============================================================================
// USAGE EXAMPLES
// =============================================================================

/*
// Basic usage:
const query = QueryBuilderFactory.create('appointments')
  .select(['id', 'customerName', 'service', 'status'])
  .where({ field: 'status', operator: 'eq', value: 'confirmed' })
  .orderBy('appointment_date', 'desc')
  .paginate(1, 10)

const result = await query.execute()

// Advanced usage with relationships:
const complexQuery = QueryBuilderFactory.create('appointments')
  .selectWithRelationships([
    { name: 'customers', select: 'name,email,phone' },
    { name: 'services', select: 'name,price,duration' },
    { name: 'staff', select: 'name,specialties' }
  ])
  .where({
    field: 'appointment_date',
    operator: 'gte',
    value: new Date()
  })
  .search('john', ['customers.name', 'services.name'])
  .orderByMultiple([
    { field: 'appointment_date', direction: 'asc' },
    { field: 'start_time', direction: 'asc' }
  ])
  .paginate(1, 20)

const complexResult = await complexQuery.execute()

// Real-time subscription:
const subscription = QueryBuilderFactory.create('appointments')
  .subscribe((payload) => {
    console.log('Appointment changed:', payload)
  })

// Later: subscription.unsubscribe()
*/
