export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      customers: {
        Row: {
          id: string
          first_name: string | null
          last_name: string | null
          email: string
          phone: string | null
          loyalty_tier: string | null
          loyalty_points: number | null
          total_spent: number | null
          visit_count: number | null
          last_visit: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          first_name?: string | null
          last_name?: string | null
          email: string
          phone?: string | null
          loyalty_tier?: string | null
          loyalty_points?: number | null
          total_spent?: number | null
          visit_count?: number | null
          last_visit?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          first_name?: string | null
          last_name?: string | null
          email?: string
          phone?: string | null
          loyalty_tier?: string | null
          loyalty_points?: number | null
          total_spent?: number | null
          visit_count?: number | null
          last_visit?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      appointments: {
        Row: {
          id: string
          customer_id: string
          service_id: string
          stylist_id: string
          date: string
          start_time: string
          end_time: string | null
          duration: number
          status: string
          price: number
          discount_amount: number | null
          tax_amount: number | null
          total_amount: number | null
          payment_status: string
          booking_source: string
          special_requests: string | null
          internal_notes: string | null
          reminder_sent: boolean | null
          follow_up_required: boolean | null
          follow_up_notes: string | null
          cancellation_reason: string | null
          cancellation_notes: string | null
          created_by: string | null
          updated_by: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          customer_id: string
          service_id: string
          stylist_id: string
          date: string
          start_time: string
          end_time?: string | null
          duration: number
          status?: string
          price: number
          discount_amount?: number | null
          tax_amount?: number | null
          total_amount?: number | null
          payment_status?: string
          booking_source?: string
          special_requests?: string | null
          internal_notes?: string | null
          reminder_sent?: boolean | null
          follow_up_required?: boolean | null
          follow_up_notes?: string | null
          cancellation_reason?: string | null
          cancellation_notes?: string | null
          created_by?: string | null
          updated_by?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          customer_id?: string
          service_id?: string
          stylist_id?: string
          date?: string
          start_time?: string
          end_time?: string | null
          duration?: number
          status?: string
          price?: number
          discount_amount?: number | null
          tax_amount?: number | null
          total_amount?: number | null
          payment_status?: string
          booking_source?: string
          special_requests?: string | null
          internal_notes?: string | null
          reminder_sent?: boolean | null
          follow_up_required?: boolean | null
          follow_up_notes?: string | null
          cancellation_reason?: string | null
          cancellation_notes?: string | null
          created_by?: string | null
          updated_by?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      services: {
        Row: {
          id: string
          name: string
          description: string | null
          price: number
          duration: number
          category: string | null
          image_url: string | null
          is_active: boolean | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          description?: string | null
          price: number
          duration: number
          category?: string | null
          image_url?: string | null
          is_active?: boolean | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          description?: string | null
          price?: number
          duration?: number
          category?: string | null
          image_url?: string | null
          is_active?: boolean | null
          created_at?: string
          updated_at?: string
        }
      }
      stylists: {
        Row: {
          id: string
          first_name: string
          last_name: string
          email: string
          phone: string | null
          bio: string | null
          specialties: string[] | null
          image_url: string | null
          is_active: boolean | null
          hire_date: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          first_name: string
          last_name: string
          email: string
          phone?: string | null
          bio?: string | null
          specialties?: string[] | null
          image_url?: string | null
          is_active?: boolean | null
          hire_date?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          first_name?: string
          last_name?: string
          email?: string
          phone?: string | null
          bio?: string | null
          specialties?: string[] | null
          image_url?: string | null
          is_active?: boolean | null
          hire_date?: string | null
          created_at?: string
          updated_at?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}
