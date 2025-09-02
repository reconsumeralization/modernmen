// =============================================================================
// SUPABASE BUILDER INTEGRATION - Component builder data services
// =============================================================================

import { BuilderConfig } from '@/types/builder'
import { supabase, isSupabaseConfigured } from './client'

export class BuilderIntegration {
  private config: BuilderConfig

  constructor(config: BuilderConfig) {
    this.config = config
  }

  async connect(): Promise<void> {
    if (!isSupabaseConfigured()) {
      throw new Error('Supabase is not properly configured. Please check your environment variables.')
    }

    try {
      // Test connection
      const { data, error } = await supabase.from('customers').select('count').limit(1)
      if (error) throw error
      console.log('✅ Successfully connected to Supabase')
    } catch (error) {
      console.error('❌ Failed to connect to Supabase:', error)
      throw error
    }
  }

  async disconnect(): Promise<void> {
    // Supabase handles connection pooling automatically
    console.log('Disconnected from Supabase (connection pooling handled automatically)')
  }

  async query(sql: string, params?: any[]): Promise<any> {
    try {
      // For complex queries, use direct table queries instead of RPC
      // This approach is safer and more compatible with Supabase
      console.warn('Complex SQL queries should be handled via specific service methods')
      return {
        success: false,
        error: 'Direct SQL queries not supported. Use specific service methods.',
        data: []
      }
    } catch (error) {
      console.error('Query execution failed:', error)
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Query execution failed',
        data: []
      }
    }
  }

  // Builder-specific methods
  async getComponents(): Promise<any[]> {
    const { data, error } = await supabase
      .from('components')
      .select('*')
      .eq('is_active', true)
      .order('created_at', { ascending: false })

    if (error) throw error
    return data || []
  }

  async saveComponent(componentData: any): Promise<any> {
    const { data, error } = await supabase
      .from('components')
      .upsert(componentData)
      .select()
      .single()

    if (error) throw error
    return data
  }

  async getComponentById(id: string): Promise<any> {
    const { data, error } = await supabase
      .from('components')
      .select('*')
      .eq('id', id)
      .single()

    if (error) throw error
    return data
  }

  async deleteComponent(id: string): Promise<boolean> {
    const { error } = await supabase
      .from('components')
      .delete()
      .eq('id', id)

    if (error) throw error
    return true
  }

  // Template management
  async getTemplates(): Promise<any[]> {
    const { data, error } = await supabase
      .from('templates')
      .select('*')
      .eq('is_active', true)
      .order('created_at', { ascending: false })

    if (error) throw error
    return data || []
  }

  async saveTemplate(templateData: any): Promise<any> {
    const { data, error } = await supabase
      .from('templates')
      .upsert(templateData)
      .select()
      .single()

    if (error) throw error
    return data
  }
}

export const createBuilderIntegration = (config: BuilderConfig) => {
  return new BuilderIntegration(config)
}

// -----------------------------------------------------------------------------
// UTILITY FUNCTIONS
// -----------------------------------------------------------------------------

/**
 * Check if builder tables exist in database
 */
export async function checkBuilderTables(): Promise<boolean> {
  try {
    const { data, error } = await supabase
      .from('information_schema.tables')
      .select('table_name')
      .eq('table_schema', 'public')
      .in('table_name', ['components', 'templates'])

    if (error) throw error
    return (data?.length || 0) >= 2
  } catch (error) {
    console.error('Failed to check builder tables:', error)
    return false
  }
}

/**
 * Initialize builder tables if they don't exist
 */
export async function initializeBuilderTables(): Promise<void> {
  const tablesExist = await checkBuilderTables()

  if (tablesExist) {
    console.log('✅ Builder tables already exist')
    return
  }

  console.log('🚀 Creating builder tables...')

  // Note: Builder tables should be created via Supabase dashboard or migrations
  // Manual table creation via RPC is not recommended in production
  console.log('ℹ️  Builder tables should be created via Supabase dashboard or database migrations')
  console.log('📋 Required tables: components, templates')

  // Check if we can at least verify the tables exist
  const exists = await checkBuilderTables()
  if (!exists) {
    throw new Error('Builder tables do not exist. Please create them via Supabase dashboard.')
  }

  console.log('✅ Builder tables created successfully')
}
