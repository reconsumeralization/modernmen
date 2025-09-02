// =============================================================================
// SUPABASE CLIENT - Database and authentication client
// =============================================================================

import { createClient } from '@supabase/supabase-js';
import type { Database } from '@/types/database';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

// Helper function to check if Supabase is configured
export const isSupabaseConfigured = (): boolean => {
  return !!(supabaseUrl && supabaseAnonKey);
};

// Create Supabase client with TypeScript support
export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey, {
    auth: {
      autoRefreshToken: true,
      persistSession: true,
    detectSessionInUrl: true,
    },
    realtime: {
      params: {
      eventsPerSecond: 10,
    },
  },
});

// Database types (will be generated from Supabase)
export type { Database } from '@/types/database';

// Helper functions for common database operations
export const dbHelpers = {
  // Users
  async getUserById(id: string) {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', id)
      .single();

    return { data, error };
  },

  // Appointments
  async getAppointments(filters?: {
    customerId?: string;
    staffId?: string;
    date?: string;
    status?: string;
  }) {
    let query = supabase
      .from('appointments')
      .select(`
        *,
        customer:customers(*),
        service:services(*),
        staff:staff(*)
      `)
      .order('appointment_date', { ascending: true })
      .order('start_time', { ascending: true });

    if (filters?.customerId) {
      query = query.eq('customer_id', filters.customerId);
    }

    if (filters?.staffId) {
      query = query.eq('staff_id', filters.staffId);
    }

    if (filters?.date) {
      query = query.eq('appointment_date', filters.date);
    }

    if (filters?.status) {
      query = query.eq('status', filters.status);
    }

    const { data, error } = await query;
    return { data, error };
  },

  // Services
  async getServices(filters?: {
    category?: string;
    isActive?: boolean;
    featured?: boolean;
  }) {
    let query = supabase
      .from('services')
      .select('*')
      .order('name', { ascending: true });

    if (filters?.category) {
      query = query.eq('category', filters.category);
    }

    if (filters?.isActive !== undefined) {
      query = query.eq('is_active', filters.isActive);
    }

    if (filters?.featured !== undefined) {
      query = query.eq('featured', filters.featured);
    }

    const { data, error } = await query;
    return { data, error };
  },

  // Staff
  async getStaff(filters?: {
    role?: string;
    isActive?: boolean;
    specialty?: string;
  }) {
    let query = supabase
      .from('staff')
      .select('*')
      .order('name', { ascending: true });

    if (filters?.role) {
      query = query.eq('role', filters.role);
    }

    if (filters?.isActive !== undefined) {
      query = query.eq('is_active', filters.isActive);
    }

    if (filters?.specialty) {
      query = query.contains('specialties', [filters.specialty]);
    }

    const { data, error } = await query;
    return { data, error };
  },

  // Customers
  async getCustomers(filters?: {
    loyaltyTier?: string;
    lastVisitAfter?: string;
    search?: string;
  }) {
    let query = supabase
      .from('customers')
      .select('*')
      .order('name', { ascending: true });

    if (filters?.loyaltyTier) {
      query = query.eq('loyalty_tier', filters.loyaltyTier);
    }

    if (filters?.lastVisitAfter) {
      query = query.gte('last_visit', filters.lastVisitAfter);
    }

    if (filters?.search) {
      query = query.or(`name.ilike.%${filters.search}%,email.ilike.%${filters.search}%`);
    }

    const { data, error } = await query;
    return { data, error };
  },

  // Notifications
  async getNotifications(filters?: {
    recipientId?: string;
    type?: string;
    status?: string;
  }) {
    let query = supabase
      .from('notifications')
      .select(`
        *,
        recipient:users(name,email),
        sent_by:users(name)
      `)
      .order('created_at', { ascending: false });

    if (filters?.recipientId) {
      query = query.eq('recipient_id', filters.recipientId);
    }

    if (filters?.type) {
      query = query.eq('type', filters.type);
    }

    if (filters?.status) {
      query = query.eq('status', filters.status);
    }

    const { data, error } = await query;
    return { data, error };
  },

  // Analytics
  async getAnalyticsData(period: 'day' | 'week' | 'month', days: number = 30) {
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    const { data: appointments, error: appointmentsError } = await supabase
      .from('appointments')
      .select('appointment_date, price, status, created_at')
      .gte('appointment_date', startDate.toISOString().split('T')[0]);

    const { data: customers, error: customersError } = await supabase
      .from('customers')
      .select('created_at, total_spent, visit_count')
      .gte('created_at', startDate.toISOString());

    return {
      appointments: appointments || [],
      customers: customers || [],
      error: appointmentsError || customersError,
    };
  },

  // Settings
  async getSettings(category?: string) {
    let query = supabase
      .from('settings')
      .select('*')
      .order('category', { ascending: true })
      .order('key', { ascending: true });

    if (category) {
      query = query.eq('category', category);
    }

    const { data, error } = await query;
    return { data, error };
  },

  async updateSetting(key: string, value: any) {
    const { data, error } = await supabase
      .from('settings')
      .update({ value: value as Json })
      .eq('key', key)
      .select()
      .single();

    return { data, error };
  },
};