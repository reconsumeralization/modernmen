// =============================================================================
// APPOINTMENTS SERVICE - Handles appointment-related data operations with Supabase
// =============================================================================

import { Appointment } from '@/types/dashboard'
import { ApiResponse, PaginatedResponse } from '@/types/common'
import { supabase, isSupabaseConfigured } from '@/lib/supabase/client'
import { APPOINTMENT_STATUSES } from '@/constants'

export class AppointmentsService {
  private baseUrl: string

  constructor(baseUrl: string = '/api/appointments') {
    this.baseUrl = baseUrl
  }

  // Shared method to transform appointment data (eliminates A2A duplication)
  private transformAppointmentData(item: any): Appointment {
    return {
      id: item.id,
      customerName: item.customers?.name || 'Unknown Customer',
      service: item.services?.name || 'Unknown Service',
      barber: item.staff?.name || 'Unassigned',
      time: `${item.appointment_date} ${item.start_time}`,
      duration: item.duration,
      status: item.status as 'confirmed' | 'pending' | 'cancelled' | 'completed'
    }
  }

  // Shared method for Supabase query building (eliminates query duplication)
  private buildAppointmentQuery(includeCount: boolean = false) {
    const query = supabase
      .from('appointments')
      .select(`
        *,
        customers:customer_id (
          id,
          name,
          email,
          phone
        ),
        services:service_id (
          id,
          name,
          duration
        ),
        staff:staff_id (
          id,
          name,
          email
        )
      `)

    return includeCount ? query.select('*', { count: 'exact', head: false }) : query
  }

  // Shared method for Supabase configuration check (eliminates instance checks)
  private validateSupabaseConnection(): void {
    if (!isSupabaseConfigured()) {
      throw new Error('Supabase is not properly configured')
    }
  }

  // Get all appointments with optional filtering
  async getAppointments(
    filters?: {
      status?: typeof APPOINTMENT_STATUSES[keyof typeof APPOINTMENT_STATUSES]
      barber?: string
      date?: string
    },
    pagination?: { page: number; limit: number }
  ): Promise<PaginatedResponse<Appointment>> {
    try {
      this.validateSupabaseConnection()

      let query = this.buildAppointmentQuery(true)

      // Apply filters
      if (filters?.status) {
        query = query.eq('status', filters.status)
      }

      if (filters?.barber) {
        query = query.ilike('staff.name', `%${filters.barber}%`)
      }

      if (filters?.date) {
        query = query.eq('appointment_date', filters.date)
      }

      // Apply ordering
      query = query.order('appointment_date', { ascending: false })
        .order('start_time', { ascending: false })

      // Apply pagination
      const page = pagination?.page || 1
      const limit = pagination?.limit || 20
      const from = (page - 1) * limit
      const to = from + limit - 1

      query = query.range(from, to)

      const { data, error, count } = await query

      if (error) throw error

      // Transform the data to match our Appointment interface
      const transformedData: Appointment[] = (data || []).map(item => this.transformAppointmentData(item))

      return {
        success: true,
        data: transformedData,
        pagination: {
          page,
          limit,
          total: count || 0,
          totalPages: Math.ceil((count || 0) / limit)
        }
      }
    } catch (error) {
      console.error('Error fetching appointments:', error)
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to fetch appointments',
        data: [],
        pagination: {
          page: 1,
          limit: 10,
          total: 0,
          totalPages: 0
        }
      }
    }
  }

  // Get a single appointment by ID
  async getAppointmentById(id: string): Promise<ApiResponse<Appointment>> {
    try {
      this.validateSupabaseConnection()

      const { data, error } = await this.buildAppointmentQuery()
        .eq('id', id)
        .single()

      if (error) {
        if (error.code === 'PGRST116') { // No rows found
          return {
            success: false,
            error: 'Appointment not found'
          }
        }
        throw error
      }

      if (!data) {
        return {
          success: false,
          error: 'Appointment not found'
        }
      }

      // Transform the data to match our Appointment interface
      const appointment: Appointment = this.transformAppointmentData(data)

      return {
        success: true,
        data: appointment
      }
    } catch (error) {
      console.error('Error fetching appointment:', error)
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to fetch appointment'
      }
    }
  }

  // Create a new appointment
  async createAppointment(appointmentData: {
    customer_id: string
    service_id: string
    staff_id: string
    appointment_date: string
    start_time: string
    duration: number
    price: number
    notes?: string
    customer_notes?: string
  }): Promise<ApiResponse<Appointment>> {
    try {
      if (!isSupabaseConfigured()) {
        throw new Error('Supabase is not properly configured')
      }

      const { data, error } = await supabase
        .from('appointments')
        .insert({
          ...appointmentData,
          status: 'confirmed'
        })
        .select(`
          *,
          customers:customer_id (
            id,
            name,
            email,
            phone
          ),
          services:service_id (
            id,
            name,
            duration
          ),
          staff:staff_id (
            id,
            name,
            email
          )
        `)
        .single()

      if (error) throw error

      // Transform the data to match our Appointment interface
      const appointment: Appointment = {
        id: data.id,
        customerName: data.customers?.name || 'Unknown Customer',
        service: data.services?.name || 'Unknown Service',
        barber: data.staff?.name || 'Unassigned',
        time: `${data.appointment_date} ${data.start_time}`,
        duration: data.duration,
        status: data.status as 'confirmed' | 'pending' | 'cancelled' | 'completed'
      }

      return {
        success: true,
        data: appointment
      }
    } catch (error) {
      console.error('Error creating appointment:', error)
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to create appointment'
      }
    }
  }

  // Update an existing appointment
  async updateAppointment(id: string, updates: Partial<{
    status: string
    notes: string
    customer_notes: string
    payment_status: string
  }>): Promise<ApiResponse<Appointment>> {
    try {
      if (!isSupabaseConfigured()) {
        throw new Error('Supabase is not properly configured')
      }

      const { data, error } = await supabase
        .from('appointments')
        .update({
          ...updates,
          updated_at: new Date().toISOString()
        })
        .eq('id', id)
        .select(`
          *,
          customers:customer_id (
            id,
            name,
            email,
            phone
          ),
          services:service_id (
            id,
            name,
            duration
          ),
          staff:staff_id (
            id,
            name,
            email
          )
        `)
        .single()

      if (error) {
        if (error.code === 'PGRST116') {
          return {
            success: false,
            error: 'Appointment not found'
          }
        }
        throw error
      }

      // Transform the data to match our Appointment interface
      const appointment: Appointment = {
        id: data.id,
        customerName: data.customers?.name || 'Unknown Customer',
        service: data.services?.name || 'Unknown Service',
        barber: data.staff?.name || 'Unassigned',
        time: `${data.appointment_date} ${data.start_time}`,
        duration: data.duration,
        status: data.status as 'confirmed' | 'pending' | 'cancelled' | 'completed'
      }

      return {
        success: true,
        data: appointment
      }
    } catch (error) {
      console.error('Error updating appointment:', error)
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to update appointment'
      }
    }
  }

  // Delete an appointment
  async deleteAppointment(id: string): Promise<ApiResponse<boolean>> {
    try {
      if (!isSupabaseConfigured()) {
        throw new Error('Supabase is not properly configured')
      }

      const { error } = await supabase
        .from('appointments')
        .delete()
        .eq('id', id)

      if (error) throw error

      return {
        success: true,
        data: true
      }
    } catch (error) {
      console.error('Error deleting appointment:', error)
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to delete appointment'
      }
    }
  }

  // Get appointments by date range
  async getAppointmentsByDateRange(startDate: Date, endDate: Date): Promise<ApiResponse<Appointment[]>> {
    try {
      if (!isSupabaseConfigured()) {
        throw new Error('Supabase is not properly configured')
      }

      const { data, error } = await supabase
        .from('appointments')
        .select(`
          *,
          customers:customer_id (
            id,
            name,
            email,
            phone
          ),
          services:service_id (
            id,
            name,
            duration
          ),
          staff:staff_id (
            id,
            name,
            email
          )
        `)
        .gte('appointment_date', startDate.toISOString().split('T')[0])
        .lte('appointment_date', endDate.toISOString().split('T')[0])
        .order('appointment_date', { ascending: false })
        .order('start_time', { ascending: false })

      if (error) throw error

      // Transform the data to match our Appointment interface
      const transformedData: Appointment[] = (data || []).map(item => ({
        id: item.id,
        customerName: item.customers?.name || 'Unknown Customer',
        customerEmail: item.customers?.email,
        service: item.services?.name || 'Unknown Service',
        barber: item.staff?.name || 'Unassigned',
        time: `${item.appointment_date} ${item.start_time}`,
        status: item.status,
        price: item.price,
        duration: item.duration,
        notes: item.notes,
        date: item.appointment_date,
        createdAt: item.created_at,
        updatedAt: item.updated_at
      }))

      return {
        success: true,
        data: transformedData
      }
    } catch (error) {
      console.error('Error fetching appointments by date range:', error)
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to fetch appointments by date range'
      }
    }
  }
}

// Export a singleton instance
export const appointmentsService = new AppointmentsService()

// Export factory function for custom configuration
export const createAppointmentsService = (baseUrl?: string) => {
  return new AppointmentsService(baseUrl)
}
