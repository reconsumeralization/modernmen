// =============================================================================
// DATABASE TYPES - Generated types for Supabase database schema
// =============================================================================

// This file contains TypeScript types that correspond to the database schema
// Run `supabase gen types typescript --local > src/types/database.ts` to regenerate

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
      appointments: {
        Row: {
          id: string
          customer_id: string | null
          service_id: string | null
          staff_id: string | null
          customer_name: string
          customer_email: string
          customer_phone: string | null
          appointment_date: string
          start_time: string
          duration: number
          price: number
          status: string
          payment_status: string
          payment_method: string | null
          notes: string | null
          customer_notes: string | null
          reminder_sent: boolean
          created_by: string | null
          updated_by: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          customer_id?: string | null
          service_id?: string | null
          staff_id?: string | null
          customer_name: string
          customer_email: string
          customer_phone?: string | null
          appointment_date: string
          start_time: string
          duration?: number
          price: number
          status?: string
          payment_status?: string
          payment_method?: string | null
          notes?: string | null
          customer_notes?: string | null
          reminder_sent?: boolean
          created_by?: string | null
          updated_by?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          customer_id?: string | null
          service_id?: string | null
          staff_id?: string | null
          customer_name?: string
          customer_email?: string
          customer_phone?: string | null
          appointment_date?: string
          start_time?: string
          duration?: number
          price?: number
          status?: string
          payment_status?: string
          payment_method?: string | null
          notes?: string | null
          customer_notes?: string | null
          reminder_sent?: boolean
          created_by?: string | null
          updated_by?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      customers: {
        Row: {
          id: string
          user_id: string | null
          name: string
          email: string
          phone: string
          date_of_birth: string | null
          gender: string | null
          avatar: string | null
          street_address: string | null
          city: string | null
          state_province: string | null
          postal_code: string | null
          country: string
          loyalty_tier: string
          loyalty_points: number
          total_spent: number
          visit_count: number
          last_visit: string | null
          member_since: string
          email_marketing: boolean
          sms_marketing: boolean
          appointment_reminders: boolean
          birthday_messages: boolean
          referral_code: string | null
          referred_by: string | null
          referral_bonus_earned: number
          is_active: boolean
          notes: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id?: string | null
          name: string
          email: string
          phone: string
          date_of_birth?: string | null
          gender?: string | null
          avatar?: string | null
          street_address?: string | null
          city?: string | null
          state_province?: string | null
          postal_code?: string | null
          country?: string
          loyalty_tier?: string
          loyalty_points?: number
          total_spent?: number
          visit_count?: number
          last_visit?: string | null
          member_since?: string
          email_marketing?: boolean
          sms_marketing?: boolean
          appointment_reminders?: boolean
          birthday_messages?: boolean
          referral_code?: string | null
          referred_by?: string | null
          referral_bonus_earned?: number
          is_active?: boolean
          notes?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string | null
          name?: string
          email?: string
          phone?: string
          date_of_birth?: string | null
          gender?: string | null
          avatar?: string | null
          street_address?: string | null
          city?: string | null
          state_province?: string | null
          postal_code?: string | null
          country?: string
          loyalty_tier?: string
          loyalty_points?: number
          total_spent?: number
          visit_count?: number
          last_visit?: string | null
          member_since?: string
          email_marketing?: boolean
          sms_marketing?: boolean
          appointment_reminders?: boolean
          birthday_messages?: boolean
          referral_code?: string | null
          referred_by?: string | null
          referral_bonus_earned?: number
          is_active?: boolean
          notes?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      notifications: {
        Row: {
          id: string
          title: string
          message: string
          type: string
          priority: string
          recipient_id: string | null
          recipient_email: string | null
          recipient_phone: string | null
          channels: Json
          status: string
          scheduled_for: string | null
          sent_at: string | null
          template_id: string | null
          metadata: Json
          related_appointment_id: string | null
          related_service_id: string | null
          sent_by: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          title: string
          message: string
          type: string
          priority?: string
          recipient_id?: string | null
          recipient_email?: string | null
          recipient_phone?: string | null
          channels?: Json
          status?: string
          scheduled_for?: string | null
          sent_at?: string | null
          template_id?: string | null
          metadata?: Json
          related_appointment_id?: string | null
          related_service_id?: string | null
          sent_by?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          title?: string
          message?: string
          type?: string
          priority?: string
          recipient_id?: string | null
          recipient_email?: string | null
          recipient_phone?: string | null
          channels?: Json
          status?: string
          scheduled_for?: string | null
          sent_at?: string | null
          template_id?: string | null
          metadata?: Json
          related_appointment_id?: string | null
          related_service_id?: string | null
          sent_by?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      services: {
        Row: {
          id: string
          name: string
          description: string | null
          short_description: string | null
          category: string
          price: number
          duration: number
          is_active: boolean
          featured: boolean
          images: string[] | null
          benefits: string[] | null
          preparation_instructions: string | null
          aftercare_instructions: string | null
          advance_booking_days: number
          cancellation_hours: number
          requires_deposit: boolean
          deposit_percentage: number
          total_bookings: number
          average_rating: number | null
          popularity_score: number | null
          meta_title: string | null
          meta_description: string | null
          keywords: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          description?: string | null
          short_description?: string | null
          category: string
          price: number
          duration?: number
          is_active?: boolean
          featured?: boolean
          images?: string[] | null
          benefits?: string[] | null
          preparation_instructions?: string | null
          aftercare_instructions?: string | null
          advance_booking_days?: number
          cancellation_hours?: number
          requires_deposit?: boolean
          deposit_percentage?: number
          total_bookings?: number
          average_rating?: number | null
          popularity_score?: number | null
          meta_title?: string | null
          meta_description?: string | null
          keywords?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          description?: string | null
          short_description?: string | null
          category?: string
          price?: number
          duration?: number
          is_active?: boolean
          featured?: boolean
          images?: string[] | null
          benefits?: string[] | null
          preparation_instructions?: string | null
          aftercare_instructions?: string | null
          advance_booking_days?: number
          cancellation_hours?: number
          requires_deposit?: boolean
          deposit_percentage?: number
          total_bookings?: number
          average_rating?: number | null
          popularity_score?: number | null
          meta_title?: string | null
          meta_description?: string | null
          keywords?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      settings: {
        Row: {
          id: string
          key: string
          value: Json
          category: string
          description: string | null
          is_public: boolean
          requires_restart: boolean
          updated_by: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          key: string
          value: Json
          category: string
          description?: string | null
          is_public?: boolean
          requires_restart?: boolean
          updated_by?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          key?: string
          value?: Json
          category?: string
          description?: string | null
          is_public?: boolean
          requires_restart?: boolean
          updated_by?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      staff: {
        Row: {
          id: string
          user_id: string | null
          name: string
          email: string
          phone: string
          role: string
          specialties: string[] | null
          bio: string | null
          avatar: string | null
          hire_date: string
          is_active: boolean
          hourly_rate: number | null
          commission_rate: number | null
          working_hours: Json
          rating: number | null
          total_appointments: number
          average_rating: number | null
          revenue_generated: number
          emergency_contact_name: string | null
          emergency_contact_relationship: string | null
          emergency_contact_phone: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id?: string | null
          name: string
          email: string
          phone: string
          role?: string
          specialties?: string[] | null
          bio?: string | null
          avatar?: string | null
          hire_date: string
          is_active?: boolean
          hourly_rate?: number | null
          commission_rate?: number | null
          working_hours?: Json
          rating?: number | null
          total_appointments?: number
          average_rating?: number | null
          revenue_generated?: number
          emergency_contact_name?: string | null
          emergency_contact_relationship?: string | null
          emergency_contact_phone?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string | null
          name?: string
          email?: string
          phone?: string
          role?: string
          specialties?: string[] | null
          bio?: string | null
          avatar?: string | null
          hire_date?: string
          is_active?: boolean
          hourly_rate?: number | null
          commission_rate?: number | null
          working_hours?: Json
          rating?: number | null
          total_appointments?: number
          average_rating?: number | null
          revenue_generated?: number
          emergency_contact_name?: string | null
          emergency_contact_relationship?: string | null
          emergency_contact_phone?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      staff_time_off: {
        Row: {
          id: string
          staff_id: string
          start_date: string
          end_date: string
          reason: string
          approved: boolean
          approved_by: string | null
          approved_at: string | null
          notes: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          staff_id: string
          start_date: string
          end_date: string
          reason: string
          approved?: boolean
          approved_by?: string | null
          approved_at?: string | null
          notes?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          staff_id?: string
          start_date?: string
          end_date?: string
          reason?: string
          approved?: boolean
          approved_by?: string | null
          approved_at?: string | null
          notes?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      user_preferences: {
        Row: {
          id: string
          user_id: string
          theme: string
          notifications: boolean
          language: string
          timezone: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          theme?: string
          notifications?: boolean
          language?: string
          timezone?: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          theme?: string
          notifications?: boolean
          language?: string
          timezone?: string
          created_at?: string
          updated_at?: string
        }
      }
      users: {
        Row: {
          id: string
          name: string
          email: string
          phone: string | null
          avatar: string | null
          role: string
          is_active: boolean
          last_login: string | null
          email_verified: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          email: string
          phone?: string | null
          avatar?: string | null
          role?: string
          is_active?: boolean
          last_login?: string | null
          email_verified?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          email?: string
          phone?: string | null
          avatar?: string | null
          role?: string
          is_active?: boolean
          last_login?: string | null
          email_verified?: boolean
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
