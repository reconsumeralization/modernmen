import { CollectionConfig } from 'payload/types'
import { Field } from 'payload/types'

// =============================================================================
// DATABASE QUERY & POLICY GENERATOR
// =============================================================================
// Generates SQL queries, RLS policies, and database functions from TypeScript types
// Supports multiple contexts: CRUD, Analytics, Email, Ads, Workflows

export interface QueryGenerationConfig {
  tableName: string
  schema?: string
  fields: Field[]
  relationships?: RelationshipConfig[]
  context?: QueryContext
  policies?: PolicyConfig[]
  indexes?: IndexConfig[]
  triggers?: TriggerConfig[]
}

export interface RelationshipConfig {
  name: string
  type: 'belongsTo' | 'hasMany' | 'hasOne' | 'manyToMany'
  foreignTable: string
  foreignKey: string
  localKey?: string
  junctionTable?: string
}

export type QueryContext =
  | 'crud'           // Basic CRUD operations
  | 'analytics'      // Analytics and reporting
  | 'email'          // Email campaign management
  | 'ads'           // Advertising campaign management
  | 'workflow'      // Business process workflows
  | 'api'           // API management
  | 'content'       // Content management
  | 'ecommerce'     // E-commerce operations

export interface PolicyConfig {
  name: string
  action: 'SELECT' | 'INSERT' | 'UPDATE' | 'DELETE'
  roles: string[]
  condition: string
  description?: string
}

export interface IndexConfig {
  name: string
  columns: string[]
  unique?: boolean
  type?: 'btree' | 'hash' | 'gist' | 'gin'
  condition?: string
}

export interface TriggerConfig {
  name: string
  timing: 'BEFORE' | 'AFTER' | 'INSTEAD OF'
  events: ('INSERT' | 'UPDATE' | 'DELETE')[]
  function: string
  description?: string
}

export class DatabaseQueryGenerator {
  private config: QueryGenerationConfig

  constructor(config: QueryGenerationConfig) {
    this.config = config
  }

  // =============================================================================
  // SQL QUERY GENERATION
  // =============================================================================

  generateCreateTableSQL(): string {
    const { tableName, schema, fields, relationships } = this.config
    const schemaPrefix = schema ? `${schema}.` : ''

    const columns = this.generateColumnDefinitions()
    const constraints = this.generateTableConstraints()

    return `
CREATE TABLE IF NOT EXISTS ${schemaPrefix}${tableName} (
  ${columns.join(',\n  ')}${constraints.length > 0 ? ',' : ''}
  ${constraints.join(',\n  ')}
);

-- Enable Row Level Security
ALTER TABLE ${schemaPrefix}${tableName} ENABLE ROW LEVEL SECURITY;

-- Create updated_at trigger
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_${tableName}_updated_at
  BEFORE UPDATE ON ${schemaPrefix}${tableName}
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
    `.trim()
  }

  generateSelectQueries(): Record<string, string> {
    const { tableName, schema, fields, context } = this.config
    const schemaPrefix = schema ? `${schema}.` : ''

    const queries: Record<string, string> = {
      findAll: this.generateFindAllQuery(),
      findById: this.generateFindByIdQuery(),
      findMany: this.generateFindManyQuery(),
      count: this.generateCountQuery()
    }

    // Context-specific queries
    switch (context) {
      case 'analytics':
        Object.assign(queries, this.generateAnalyticsQueries())
        break
      case 'email':
        Object.assign(queries, this.generateEmailQueries())
        break
      case 'ads':
        Object.assign(queries, this.generateAdsQueries())
        break
      case 'workflow':
        Object.assign(queries, this.generateWorkflowQueries())
        break
    }

    return queries
  }

  generateInsertQueries(): Record<string, string> {
    const { tableName, schema } = this.config
    const schemaPrefix = schema ? `${schema}.` : ''

    return {
      insert: this.generateInsertQuery(),
      insertMany: this.generateInsertManyQuery(),
      upsert: this.generateUpsertQuery()
    }
  }

  generateUpdateQueries(): Record<string, string> {
    const { tableName, schema } = this.config
    const schemaPrefix = schema ? `${schema}.` : ''

    return {
      update: this.generateUpdateQuery(),
      updateMany: this.generateUpdateManyQuery(),
      increment: this.generateIncrementQuery()
    }
  }

  generateDeleteQueries(): Record<string, string> {
    const { tableName, schema } = this.config
    const schemaPrefix = schema ? `${schema}.` : ''

    return {
      delete: this.generateDeleteQuery(),
      deleteMany: this.generateDeleteManyQuery(),
      softDelete: this.generateSoftDeleteQuery()
    }
  }

  // =============================================================================
  // CONTEXT-SPECIFIC QUERY GENERATION
  // =============================================================================

  private generateAnalyticsQueries(): Record<string, string> {
    const { tableName, schema } = this.config
    const schemaPrefix = schema ? `${schema}.` : ''

    return {
      // Time-based analytics
      analyticsByDateRange: `
SELECT
  DATE(created_at) as date,
  COUNT(*) as count,
  COUNT(DISTINCT user_id) as unique_users
FROM ${schemaPrefix}${tableName}
WHERE created_at >= $1 AND created_at <= $2
GROUP BY DATE(created_at)
ORDER BY date DESC;
      `,
      // Trend analysis
      analyticsTrends: `
SELECT
  DATE_TRUNC('week', created_at) as week,
  COUNT(*) as total,
  AVG(EXTRACT(epoch FROM (updated_at - created_at))) as avg_duration
FROM ${schemaPrefix}${tableName}
WHERE created_at >= NOW() - INTERVAL '30 days'
GROUP BY week
ORDER BY week DESC;
      `,
      // Performance metrics
      analyticsPerformance: `
SELECT
  status,
  COUNT(*) as count,
  AVG(EXTRACT(epoch FROM (updated_at - created_at))) as avg_processing_time,
  MIN(created_at) as earliest,
  MAX(created_at) as latest
FROM ${schemaPrefix}${tableName}
GROUP BY status;
      `
    }
  }

  private generateEmailQueries(): Record<string, string> {
    const { tableName, schema } = this.config
    const schemaPrefix = schema ? `${schema}.` : ''

    return {
      // Campaign performance
      emailCampaignStats: `
SELECT
  campaign_id,
  COUNT(*) as total_sent,
  COUNT(CASE WHEN opened_at IS NOT NULL THEN 1 END) as opened,
  COUNT(CASE WHEN clicked_at IS NOT NULL THEN 1 END) as clicked,
  ROUND(
    COUNT(CASE WHEN clicked_at IS NOT NULL THEN 1 END)::decimal /
    NULLIF(COUNT(CASE WHEN opened_at IS NOT NULL THEN 1 END), 0) * 100, 2
  ) as click_rate
FROM ${schemaPrefix}${tableName}
WHERE campaign_id = $1
GROUP BY campaign_id;
      `,
      // Subscriber engagement
      emailSubscriberEngagement: `
SELECT
  subscriber_id,
  COUNT(*) as emails_received,
  COUNT(CASE WHEN opened_at IS NOT NULL THEN 1 END) as emails_opened,
  COUNT(CASE WHEN clicked_at IS NOT NULL THEN 1 END) as emails_clicked,
  MAX(sent_at) as last_email_date
FROM ${schemaPrefix}${tableName}
WHERE subscriber_id = $1
  AND sent_at >= NOW() - INTERVAL '90 days'
GROUP BY subscriber_id;
      `,
      // A/B testing results
      emailABTestResults: `
SELECT
  variant,
  COUNT(*) as sent,
  COUNT(CASE WHEN opened_at IS NOT NULL THEN 1 END) as opened,
  ROUND(
    COUNT(CASE WHEN opened_at IS NOT NULL THEN 1 END)::decimal / COUNT(*) * 100, 2
  ) as open_rate
FROM ${schemaPrefix}${tableName}
WHERE campaign_id = $1
GROUP BY variant
ORDER BY open_rate DESC;
      `
    }
  }

  private generateAdsQueries(): Record<string, string> {
    const { tableName, schema } = this.config
    const schemaPrefix = schema ? `${schema}.` : ''

    return {
      // Campaign performance
      adCampaignPerformance: `
SELECT
  campaign_id,
  SUM(impressions) as total_impressions,
  SUM(clicks) as total_clicks,
  SUM(spend) as total_spend,
  ROUND(SUM(clicks)::decimal / NULLIF(SUM(impressions), 0) * 100, 2) as ctr,
  ROUND(SUM(spend) / NULLIF(SUM(clicks), 0), 2) as cpc
FROM ${schemaPrefix}${tableName}
WHERE campaign_id = $1
  AND date >= $2 AND date <= $3
GROUP BY campaign_id;
      `,
      // Ad targeting analysis
      adTargetingAnalysis: `
SELECT
  targeting_criteria,
  SUM(impressions) as impressions,
  SUM(clicks) as clicks,
  ROUND(SUM(clicks)::decimal / NULLIF(SUM(impressions), 0) * 100, 2) as ctr,
  ROUND(AVG(cost_per_click), 2) as avg_cpc
FROM ${schemaPrefix}${tableName}
WHERE campaign_id = $1
GROUP BY targeting_criteria
ORDER BY ctr DESC;
      `,
      // Budget optimization
      adBudgetOptimization: `
SELECT
  ad_id,
  budget_allocated,
  budget_spent,
  SUM(impressions) as impressions,
  SUM(clicks) as clicks,
  ROUND(SUM(clicks)::decimal / NULLIF(SUM(impressions), 0) * 100, 2) as ctr,
  CASE
    WHEN budget_spent > 0 THEN ROUND((budget_allocated - budget_spent) / budget_spent * 100, 2)
    ELSE 0
  END as budget_efficiency
FROM ${schemaPrefix}${tableName}
WHERE campaign_id = $1
  AND date >= CURRENT_DATE - INTERVAL '30 days'
GROUP BY ad_id, budget_allocated, budget_spent
ORDER BY budget_efficiency DESC;
      `
    }
  }

  private generateWorkflowQueries(): Record<string, string> {
    const { tableName, schema } = this.config
    const schemaPrefix = schema ? `${schema}.` : ''

    return {
      // Workflow status overview
      workflowStatusOverview: `
SELECT
  status,
  COUNT(*) as count,
  AVG(EXTRACT(epoch FROM (updated_at - created_at))) as avg_duration,
  MIN(created_at) as oldest,
  MAX(created_at) as newest
FROM ${schemaPrefix}${tableName}
WHERE created_at >= $1
GROUP BY status
ORDER BY count DESC;
      `,
      // Step transition analysis
      workflowStepTransitions: `
SELECT
  current_step,
  next_step,
  COUNT(*) as transitions,
  AVG(EXTRACT(epoch FROM (step_completed_at - step_started_at))) as avg_step_duration
FROM ${schemaPrefix}${tableName}_steps
WHERE workflow_id = $1
GROUP BY current_step, next_step
ORDER BY transitions DESC;
      `,
      // Bottleneck identification
      workflowBottlenecks: `
SELECT
  step_name,
  COUNT(*) as total_instances,
  COUNT(CASE WHEN completed_at IS NULL THEN 1 END) as pending,
  AVG(EXTRACT(epoch FROM (completed_at - started_at))) as avg_duration,
  PERCENTILE_CONT(0.95) WITHIN GROUP (ORDER BY EXTRACT(epoch FROM (completed_at - started_at))) as p95_duration
FROM ${schemaPrefix}${tableName}_steps
WHERE started_at >= $1
GROUP BY step_name
ORDER BY avg_duration DESC;
      `
    }
  }

  // =============================================================================
  // RLS POLICY GENERATION
  // =============================================================================

  generateRLSPolicies(): string {
    const { tableName, schema, policies } = this.config
    const schemaPrefix = schema ? `${schema}.` : ''

    if (!policies || policies.length === 0) {
      return this.generateDefaultPolicies()
    }

    return policies.map(policy => `
-- Policy: ${policy.name}
${policy.description ? `-- ${policy.description}` : ''}
CREATE POLICY "${policy.name}" ON ${schemaPrefix}${tableName}
  FOR ${policy.action}
  TO ${policy.roles.join(', ')}
  USING (${policy.condition});
    `.trim()).join('\n\n')
  }

  private generateDefaultPolicies(): string {
    const { tableName, schema, context } = this.config
    const schemaPrefix = schema ? `${schema}.` : ''

    const policies = [
      `-- Default policies for ${tableName}`,
      `CREATE POLICY "${tableName}_select" ON ${schemaPrefix}${tableName}`,
      `  FOR SELECT USING (auth.uid() IS NOT NULL);`,
      ``,
      `CREATE POLICY "${tableName}_insert" ON ${schemaPrefix}${tableName}`,
      `  FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);`,
      ``,
      `CREATE POLICY "${tableName}_update" ON ${schemaPrefix}${tableName}`,
      `  FOR UPDATE USING (auth.uid() = user_id);`,
      ``,
      `CREATE POLICY "${tableName}_delete" ON ${schemaPrefix}${tableName}`,
      `  FOR DELETE USING (auth.uid() = user_id);`
    ]

    // Context-specific policies
    switch (context) {
      case 'analytics':
        policies.push(
          ``,
          `-- Analytics-specific policies`,
          `CREATE POLICY "${tableName}_analytics_read" ON ${schemaPrefix}${tableName}`,
          `  FOR SELECT TO analyst, admin USING (true);`
        )
        break

      case 'email':
        policies.push(
          ``,
          `-- Email campaign policies`,
          `CREATE POLICY "${tableName}_campaign_owner" ON ${schemaPrefix}${tableName}`,
          `  FOR ALL USING (auth.uid() = campaign_owner_id);`
        )
        break

      case 'ads':
        policies.push(
          ``,
          `-- Advertising policies`,
          `CREATE POLICY "${tableName}_advertiser" ON ${schemaPrefix}${tableName}`,
          `  FOR ALL USING (auth.uid() = advertiser_id);`,
          ``,
          `CREATE POLICY "${tableName}_ad_network" ON ${schemaPrefix}${tableName}`,
          `  FOR SELECT TO ad_network USING (status = 'approved');`
        )
        break
    }

    return policies.join('\n')
  }

  // =============================================================================
  // INDEX GENERATION
  // =============================================================================

  generateIndexes(): string {
    const { tableName, schema, indexes, fields } = this.config
    const schemaPrefix = schema ? `${schema}.` : ''

    const indexStatements: string[] = []

    // Auto-generate indexes for common patterns
    if (!indexes) {
      // Index on ID (usually auto-created by PRIMARY KEY)
      indexStatements.push(`-- Primary key index already exists`)

      // Index on timestamps
      if (fields.some(f => f.name === 'created_at')) {
        indexStatements.push(
          `CREATE INDEX IF NOT EXISTS idx_${tableName}_created_at ON ${schemaPrefix}${tableName}(created_at);`
        )
      }

      if (fields.some(f => f.name === 'updated_at')) {
        indexStatements.push(
          `CREATE INDEX IF NOT EXISTS idx_${tableName}_updated_at ON ${schemaPrefix}${tableName}(updated_at);`
        )
      }

      // Index on status fields
      const statusField = fields.find(f => f.name === 'status')
      if (statusField) {
        indexStatements.push(
          `CREATE INDEX IF NOT EXISTS idx_${tableName}_status ON ${schemaPrefix}${tableName}(status);`
        )
      }

      // Index on user_id for RLS
      if (fields.some(f => f.name === 'user_id')) {
        indexStatements.push(
          `CREATE INDEX IF NOT EXISTS idx_${tableName}_user_id ON ${schemaPrefix}${tableName}(user_id);`
        )
      }
    }

    // Custom indexes
    if (indexes) {
      indexes.forEach(index => {
        let indexSQL = `CREATE `
        if (index.unique) indexSQL += 'UNIQUE '
        indexSQL += `INDEX IF NOT EXISTS ${index.name} ON ${schemaPrefix}${tableName}`

        if (index.type && index.type !== 'btree') {
          indexSQL += ` USING ${index.type}`
        }

        indexSQL += ` (${index.columns.join(', ')})`

        if (index.condition) {
          indexSQL += ` WHERE ${index.condition}`
        }

        indexSQL += ';'
        indexStatements.push(indexSQL)
      })
    }

    return indexStatements.join('\n')
  }

  // =============================================================================
  // HELPER METHODS
  // =============================================================================

  private generateColumnDefinitions(): string[] {
    const { fields } = this.config

    const columns: string[] = [
      'id UUID DEFAULT uuid_generate_v4() PRIMARY KEY',
      'created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()',
      'updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()'
    ]

    fields.forEach(field => {
      const columnDef = this.generateColumnDefinition(field)
      if (columnDef) columns.push(columnDef)
    })

    return columns
  }

  private generateColumnDefinition(field: Field): string | null {
    let sqlType: string
    let constraints: string[] = []

    switch (field.type) {
      case 'text':
      case 'textarea':
      case 'email':
        sqlType = 'TEXT'
        break
      case 'number':
        sqlType = 'INTEGER'
        break
      case 'date':
        sqlType = 'TIMESTAMP WITH TIME ZONE'
        break
      case 'checkbox':
        sqlType = 'BOOLEAN DEFAULT false'
        break
      case 'select':
        sqlType = 'TEXT'
        break
      case 'relationship':
        sqlType = field.hasMany ? 'UUID[]' : 'UUID'
        break
      case 'array':
        sqlType = 'JSONB DEFAULT \'[]\'::jsonb'
        break
      case 'upload':
        sqlType = 'TEXT'
        break
      default:
        return null // Skip unknown field types
    }

    if (field.required && field.type !== 'checkbox') {
      constraints.push('NOT NULL')
    }

    if (field.unique && field.type !== 'relationship') {
      constraints.push('UNIQUE')
    }

    if (field.defaultValue !== undefined) {
      if (typeof field.defaultValue === 'string') {
        constraints.push(`DEFAULT '${field.defaultValue}'`)
      } else {
        constraints.push(`DEFAULT ${field.defaultValue}`)
      }
    }

    return `${field.name} ${sqlType} ${constraints.join(' ')}`.trim()
  }

  private generateTableConstraints(): string[] {
    const { relationships } = this.config
    const constraints: string[] = []

    if (relationships) {
      relationships.forEach(rel => {
        if (rel.type === 'belongsTo') {
          constraints.push(
            `FOREIGN KEY (${rel.foreignKey}) REFERENCES ${rel.foreignTable}(id) ON DELETE CASCADE`
          )
        }
      })
    }

    return constraints
  }

  private generateFindAllQuery(): string {
    const { tableName, schema } = this.config
    const schemaPrefix = schema ? `${schema}.` : ''

    return `
SELECT * FROM ${schemaPrefix}${tableName}
ORDER BY created_at DESC;
    `.trim()
  }

  private generateFindByIdQuery(): string {
    const { tableName, schema } = this.config
    const schemaPrefix = schema ? `${schema}.` : ''

    return `
SELECT * FROM ${schemaPrefix}${tableName}
WHERE id = $1;
    `.trim()
  }

  private generateFindManyQuery(): string {
    const { tableName, schema } = this.config
    const schemaPrefix = schema ? `${schema}.` : ''

    return `
SELECT * FROM ${schemaPrefix}${tableName}
WHERE ($1::jsonb IS NULL OR data @> $1)
ORDER BY created_at DESC
LIMIT $2 OFFSET $3;
    `.trim()
  }

  private generateCountQuery(): string {
    const { tableName, schema } = this.config
    const schemaPrefix = schema ? `${schema}.` : ''

    return `
SELECT COUNT(*) as total FROM ${schemaPrefix}${tableName}
WHERE ($1::jsonb IS NULL OR data @> $1);
    `.trim()
  }

  private generateInsertQuery(): string {
    const { tableName, schema, fields } = this.config
    const schemaPrefix = schema ? `${schema}.` : ''

    const insertFields = fields.map(f => f.name)
    const placeholders = fields.map((_, i) => `$${i + 1}`)

    return `
INSERT INTO ${schemaPrefix}${tableName} (${insertFields.join(', ')})
VALUES (${placeholders.join(', ')})
RETURNING *;
    `.trim()
  }

  private generateInsertManyQuery(): string {
    const { tableName, schema, fields } = this.config
    const schemaPrefix = schema ? `${schema}.` : ''

    const insertFields = fields.map(f => f.name)

    return `
INSERT INTO ${schemaPrefix}${tableName} (${insertFields.join(', ')})
SELECT ${insertFields.map((_, i) => `t.${i + 1}`).join(', ')}
FROM unnest($1) AS t(${insertFields.map((f, i) => `${f} ${this.getPostgresType(f.type)}`).join(', ')})
RETURNING *;
    `.trim()
  }

  private generateUpsertQuery(): string {
    const { tableName, schema, fields } = this.config
    const schemaPrefix = schema ? `${schema}.` : ''

    const insertFields = fields.map(f => f.name)
    const updateFields = fields.filter(f => f.name !== 'id').map(f => `${f.name} = EXCLUDED.${f.name}`)

    return `
INSERT INTO ${schemaPrefix}${tableName} (${insertFields.join(', ')})
VALUES (${insertFields.map((_, i) => `$${i + 1}`).join(', ')})
ON CONFLICT (id) DO UPDATE SET
  ${updateFields.join(',\n  ')}
RETURNING *;
    `.trim()
  }

  private generateUpdateQuery(): string {
    const { tableName, schema, fields } = this.config
    const schemaPrefix = schema ? `${schema}.` : ''

    const updateFields = fields.filter(f => f.name !== 'id').map((f, i) => `${f.name} = $${i + 2}`)

    return `
UPDATE ${schemaPrefix}${tableName}
SET ${updateFields.join(', ')}
WHERE id = $1
RETURNING *;
    `.trim()
  }

  private generateUpdateManyQuery(): string {
    const { tableName, schema } = this.config
    const schemaPrefix = schema ? `${schema}.` : ''

    return `
UPDATE ${schemaPrefix}${tableName}
SET data = data || $2
WHERE id = ANY($1)
RETURNING *;
    `.trim()
  }

  private generateIncrementQuery(): string {
    const { tableName, schema } = this.config
    const schemaPrefix = schema ? `${schema}.` : ''

    return `
UPDATE ${schemaPrefix}${tableName}
SET data = jsonb_set(data, $2, (COALESCE(data->$2, '0')::int + $3)::text::jsonb)
WHERE id = $1
RETURNING *;
    `.trim()
  }

  private generateDeleteQuery(): string {
    const { tableName, schema } = this.config
    const schemaPrefix = schema ? `${schema}.` : ''

    return `
DELETE FROM ${schemaPrefix}${tableName}
WHERE id = $1
RETURNING *;
    `.trim()
  }

  private generateDeleteManyQuery(): string {
    const { tableName, schema } = this.config
    const schemaPrefix = schema ? `${schema}.` : ''

    return `
DELETE FROM ${schemaPrefix}${tableName}
WHERE id = ANY($1)
RETURNING *;
    `.trim()
  }

  private generateSoftDeleteQuery(): string {
    const { tableName, schema } = this.config
    const schemaPrefix = schema ? `${schema}.` : ''

    return `
UPDATE ${schemaPrefix}${tableName}
SET deleted_at = NOW()
WHERE id = $1
RETURNING *;
    `.trim()
  }

  private getPostgresType(fieldType: string): string {
    switch (fieldType) {
      case 'text':
      case 'textarea':
      case 'email':
        return 'TEXT'
      case 'number':
        return 'INTEGER'
      case 'date':
        return 'TIMESTAMP WITH TIME ZONE'
      case 'checkbox':
        return 'BOOLEAN'
      case 'array':
        return 'JSONB'
      default:
        return 'TEXT'
    }
  }
}

// =============================================================================
// SUPABASE TYPES TO COLLECTIONS CONVERTER
// =============================================================================

export class SupabaseTypesConverter {
  static convertToCollections(supabaseTypes: string): CollectionConfig[] {
    // Parse Supabase generated types and convert to collections
    const collections: CollectionConfig[] = []

    // This would parse the TypeScript interface definitions
    // from Supabase and convert them to Payload collections

    return collections
  }

  static convertToQueries(supabaseTypes: string): Record<string, string> {
    // Generate queries from Supabase types
    const queries: Record<string, string> = {}

    // Parse types and generate appropriate queries

    return queries
  }

  static convertToPolicies(supabaseTypes: string): string[] {
    // Generate RLS policies from Supabase types
    const policies: string[] = []

    // Analyze types and generate security policies

    return policies
  }
}

// =============================================================================
// CONTEXT-AWARE FIELD TYPES
// =============================================================================

export const CONTEXT_FIELD_TYPES = {
  crud: [
    { type: 'text', label: 'Text', icon: 'Type' },
    { type: 'textarea', label: 'Textarea', icon: 'FileText' },
    { type: 'number', label: 'Number', icon: 'Hash' },
    { type: 'email', label: 'Email', icon: 'Mail' },
    { type: 'date', label: 'Date', icon: 'Calendar' },
    { type: 'checkbox', label: 'Checkbox', icon: 'CheckSquare' },
    { type: 'select', label: 'Select', icon: 'List' },
    { type: 'relationship', label: 'Relationship', icon: 'Link' }
  ],

  analytics: [
    { type: 'metric', label: 'Metric', icon: 'BarChart' },
    { type: 'dimension', label: 'Dimension', icon: 'Grid' },
    { type: 'date_range', label: 'Date Range', icon: 'Calendar' },
    { type: 'filter', label: 'Filter', icon: 'Filter' },
    { type: 'aggregation', label: 'Aggregation', icon: 'Calculator' }
  ],

  email: [
    { type: 'email_subject', label: 'Subject Line', icon: 'Mail' },
    { type: 'email_content', label: 'Email Content', icon: 'FileText' },
    { type: 'recipient_list', label: 'Recipients', icon: 'Users' },
    { type: 'send_schedule', label: 'Send Schedule', icon: 'Clock' },
    { type: 'email_template', label: 'Template', icon: 'Layout' },
    { type: 'campaign_status', label: 'Status', icon: 'Play' }
  ],

  ads: [
    { type: 'ad_creative', label: 'Creative', icon: 'Image' },
    { type: 'targeting', label: 'Targeting', icon: 'Target' },
    { type: 'budget', label: 'Budget', icon: 'DollarSign' },
    { type: 'ad_schedule', label: 'Schedule', icon: 'Clock' },
    { type: 'ad_platform', label: 'Platform', icon: 'Monitor' },
    { type: 'performance_metric', label: 'Metrics', icon: 'TrendingUp' }
  ],

  workflow: [
    { type: 'workflow_step', label: 'Step', icon: 'GitBranch' },
    { type: 'condition', label: 'Condition', icon: 'GitMerge' },
    { type: 'action', label: 'Action', icon: 'Zap' },
    { type: 'approval', label: 'Approval', icon: 'CheckCircle' },
    { type: 'notification', label: 'Notification', icon: 'Bell' },
    { type: 'timer', label: 'Timer', icon: 'Timer' }
  ],

  api: [
    { type: 'endpoint', label: 'Endpoint', icon: 'Globe' },
    { type: 'method', label: 'HTTP Method', icon: 'Code' },
    { type: 'parameter', label: 'Parameter', icon: 'Settings' },
    { type: 'response', label: 'Response', icon: 'ArrowRight' },
    { type: 'authentication', label: 'Auth', icon: 'Shield' },
    { type: 'rate_limit', label: 'Rate Limit', icon: 'Gauge' }
  ]
}

// =============================================================================
// USAGE EXAMPLES
// =============================================================================

/*
// Basic CRUD Context
const userGenerator = new DatabaseQueryGenerator({
  tableName: 'users',
  fields: [
    { name: 'email', type: 'email', required: true, unique: true },
    { name: 'name', type: 'text', required: true },
    { name: 'role', type: 'select', options: ['user', 'admin'] }
  ],
  context: 'crud'
})

const createTableSQL = userGenerator.generateCreateTableSQL()
const queries = userGenerator.generateSelectQueries()
const policies = userGenerator.generateRLSPolicies()

// Analytics Context
const analyticsGenerator = new DatabaseQueryGenerator({
  tableName: 'page_views',
  fields: [
    { name: 'page', type: 'text', required: true },
    { name: 'user_id', type: 'relationship', relationTo: 'users' },
    { name: 'duration', type: 'number' }
  ],
  context: 'analytics'
})

const analyticsQueries = analyticsGenerator.generateSelectQueries()
// Includes: analyticsByDateRange, analyticsTrends, analyticsPerformance

// Email Campaign Context
const emailGenerator = new DatabaseQueryGenerator({
  tableName: 'email_campaigns',
  fields: [
    { name: 'subject', type: 'text', required: true },
    { name: 'content', type: 'richText', required: true },
    { name: 'recipients', type: 'relationship', relationTo: 'subscribers', hasMany: true },
    { name: 'send_date', type: 'date' }
  ],
  context: 'email'
})

const emailQueries = emailGenerator.generateSelectQueries()
// Includes: emailCampaignStats, emailSubscriberEngagement, emailABTestResults
*/
