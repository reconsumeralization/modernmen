/**
 * ModernMen Barbershop - Unified Authentication System
 * Comprehensive auth with roles, permissions, and session management
 */

import { createClient } from '@supabase/supabase-js'
import { toast } from 'sonner'

// Auth types
export interface User {
  id: string
  email: string
  name: string
  phone?: string
  role: UserRole
  avatar?: string
  isActive: boolean
  lastLoginAt?: Date
  createdAt: Date
  updatedAt: Date
  metadata?: Record<string, any>
}

export interface Session {
  user: User
  accessToken: string
  refreshToken: string
  expiresAt: Date
}

export enum UserRole {
  CUSTOMER = 'customer',
  BARBER = 'barber',
  MANAGER = 'manager', 
  ADMIN = 'admin',
  SUPER_ADMIN = 'super_admin'
}

export interface AuthResponse {
  success: boolean
  user?: User
  session?: Session
  error?: string
}

export interface RolePermissions {
  role: UserRole
  permissions: string[]
}

// Role permissions configuration
const ROLE_PERMISSIONS: RolePermissions[] = [
  {
    role: UserRole.CUSTOMER,
    permissions: [
      'book_appointments',
      'view_own_appointments',
      'cancel_own_appointments',
      'update_own_profile',
      'view_services',
      'leave_reviews'
    ]
  },
  {
    role: UserRole.BARBER,
    permissions: [
      'view_assigned_appointments',
      'update_appointment_status',
      'view_customer_details',
      'manage_availability',
      'view_services',
      'update_own_profile'
    ]
  },
  {
    role: UserRole.MANAGER,
    permissions: [
      'view_all_appointments',
      'manage_appointments',
      'manage_barbers',
      'view_reports',
      'manage_services',
      'view_customers',
      'manage_schedules'
    ]
  },
  {
    role: UserRole.ADMIN,
    permissions: [
      'manage_users',
      'manage_appointments',
      'manage_services',
      'manage_barbers',
      'view_analytics',
      'manage_settings',
      'manage_content',
      'access_admin_panel'
    ]
  },
  {
    role: UserRole.SUPER_ADMIN,
    permissions: [
      'full_access',
      'manage_admins',
      'system_configuration',
      'manage_backups',
      'audit_logs'
    ]
  }
]

class AuthSystem {
  private supabase: any
  private currentUser: User | null = null
  private currentSession: Session | null = null
  private initialized = false

  constructor() {
    this.initialize()
  }

  private async initialize() {
    if (this.initialized) return

    // Initialize Supabase client
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

    if (!supabaseUrl || !supabaseKey) {
      console.error('Supabase configuration missing')
      return
    }

    this.supabase = createClient(supabaseUrl, supabaseKey)
    
    // Check for existing session
    await this.restoreSession()
    
    // Listen for auth state changes
    this.supabase.auth.onAuthStateChange(async (event: string, session: any) => {
      if (event === 'SIGNED_IN' && session) {
        await this.handleSignIn(session)
      } else if (event === 'SIGNED_OUT') {
        await this.handleSignOut()
      }
    })

    this.initialized = true
  }

  /**
   * Sign up new user
   */
  async signUp(email: string, password: string, userData: {
    name: string
    phone?: string
    role?: UserRole
  }): Promise<AuthResponse> {
    try {
      await this.initialize()

      // Sign up with Supabase Auth
      const { data, error } = await this.supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            name: userData.name,
            phone: userData.phone,
            role: userData.role || UserRole.CUSTOMER
          }
        }
      })

      if (error) throw error

      if (data.user) {
        // Create user profile in database
        const userProfile = await this.createUserProfile({
          id: data.user.id,
          email,
          name: userData.name,
          phone: userData.phone,
          role: userData.role || UserRole.CUSTOMER,
          isActive: true,
          createdAt: new Date(),
          updatedAt: new Date()
        })

        toast.success('Account created successfully! Please check your email to verify your account.')

        return {
          success: true,
          user: userProfile
        }
      }

      throw new Error('Failed to create user')

    } catch (error) {
      console.error('Sign up error:', error)
      const errorMessage = error instanceof Error ? error.message : 'Failed to create account'
      toast.error(errorMessage)
      
      return {
        success: false,
        error: errorMessage
      }
    }
  }

  /**
   * Sign in user
   */
  async signIn(email: string, password: string): Promise<AuthResponse> {
    try {
      await this.initialize()

      const { data, error } = await this.supabase.auth.signInWithPassword({
        email,
        password
      })

      if (error) throw error

      if (data.session) {
        const user = await this.getUserProfile(data.user.id)
        
        if (!user) {
          throw new Error('User profile not found')
        }

        if (!user.isActive) {
          throw new Error('Account is deactivated. Please contact support.')
        }

        // Update last login
        await this.updateLastLogin(user.id)

        this.currentUser = user
        this.currentSession = {
          user,
          accessToken: data.session.access_token,
          refreshToken: data.session.refresh_token,
          expiresAt: new Date(data.session.expires_at! * 1000)
        }

        toast.success(`Welcome back, ${user.name}!`)

        return {
          success: true,
          user,
          session: this.currentSession
        }
      }

      throw new Error('Failed to sign in')

    } catch (error) {
      console.error('Sign in error:', error)
      const errorMessage = error instanceof Error ? error.message : 'Failed to sign in'
      toast.error(errorMessage)
      
      return {
        success: false,
        error: errorMessage
      }
    }
  }

  /**
   * Sign out user
   */
  async signOut(): Promise<void> {
    try {
      await this.supabase.auth.signOut()
      await this.handleSignOut()
      toast.success('Signed out successfully')
    } catch (error) {
      console.error('Sign out error:', error)
      toast.error('Failed to sign out')
    }
  }

  /**
   * Get current user
   */
  getCurrentUser(): User | null {
    return this.currentUser
  }

  /**
   * Get current session
   */
  getCurrentSession(): Session | null {
    return this.currentSession
  }

  /**
   * Check if user has permission
   */
  hasPermission(permission: string): boolean {
    if (!this.currentUser) return false

    const rolePermissions = ROLE_PERMISSIONS.find(rp => rp.role === this.currentUser!.role)
    
    if (!rolePermissions) return false

    // Super admin and full access
    if (rolePermissions.permissions.includes('full_access')) return true

    return rolePermissions.permissions.includes(permission)
  }

  /**
   * Check if user has role
   */
  hasRole(role: UserRole): boolean {
    return this.currentUser?.role === role
  }

  /**
   * Check if user has any of the roles
   */
  hasAnyRole(roles: UserRole[]): boolean {
    return this.currentUser ? roles.includes(this.currentUser.role) : false
  }

  /**
   * Reset password
   */
  async resetPassword(email: string): Promise<{ success: boolean; error?: string }> {
    try {
      const { error } = await this.supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`
      })

      if (error) throw error

      toast.success('Password reset email sent!')
      
      return { success: true }

    } catch (error) {
      console.error('Reset password error:', error)
      const errorMessage = error instanceof Error ? error.message : 'Failed to reset password'
      toast.error(errorMessage)
      
      return { success: false, error: errorMessage }
    }
  }

  /**
   * Update user profile
   */
  async updateProfile(updates: Partial<User>): Promise<{ success: boolean; user?: User; error?: string }> {
    try {
      if (!this.currentUser) throw new Error('No user signed in')

      // Update in database
      const { data, error } = await this.supabase
        .from('user_profiles')
        .update({
          ...updates,
          updated_at: new Date().toISOString()
        })
        .eq('id', this.currentUser.id)
        .select()
        .single()

      if (error) throw error

      const updatedUser = this.transformUserData(data)
      this.currentUser = updatedUser

      toast.success('Profile updated successfully!')

      return { success: true, user: updatedUser }

    } catch (error) {
      console.error('Update profile error:', error)
      const errorMessage = error instanceof Error ? error.message : 'Failed to update profile'
      toast.error(errorMessage)
      
      return { success: false, error: errorMessage }
    }
  }

  /**
   * Get user by ID (admin function)
   */
  async getUserById(userId: string): Promise<User | null> {
    if (!this.hasPermission('manage_users')) {
      throw new Error('Insufficient permissions')
    }

    return await this.getUserProfile(userId)
  }

  /**
   * List users with filtering (admin function)
   */
  async listUsers(filters?: {
    role?: UserRole
    isActive?: boolean
    search?: string
  }): Promise<{ users: User[]; total: number }> {
    if (!this.hasPermission('manage_users')) {
      throw new Error('Insufficient permissions')
    }

    try {
      let query = this.supabase.from('user_profiles').select('*', { count: 'exact' })

      if (filters?.role) {
        query = query.eq('role', filters.role)
      }

      if (filters?.isActive !== undefined) {
        query = query.eq('is_active', filters.isActive)
      }

      if (filters?.search) {
        query = query.or(`name.ilike.%${filters.search}%,email.ilike.%${filters.search}%`)
      }

      const { data, error, count } = await query

      if (error) throw error

      const users = data?.map(this.transformUserData) || []

      return { users, total: count || 0 }

    } catch (error) {
      console.error('List users error:', error)
      throw error
    }
  }

  /**
   * Update user role (admin function)
   */
  async updateUserRole(userId: string, newRole: UserRole): Promise<void> {
    if (!this.hasPermission('manage_users')) {
      throw new Error('Insufficient permissions')
    }

    try {
      const { error } = await this.supabase
        .from('user_profiles')
        .update({ 
          role: newRole,
          updated_at: new Date().toISOString()
        })
        .eq('id', userId)

      if (error) throw error

      toast.success('User role updated successfully!')

    } catch (error) {
      console.error('Update user role error:', error)
      throw error
    }
  }

  /**
   * Private helper methods
   */
  private async restoreSession(): Promise<void> {
    try {
      const { data: { session } } = await this.supabase.auth.getSession()
      
      if (session?.user) {
        const user = await this.getUserProfile(session.user.id)
        if (user && user.isActive) {
          this.currentUser = user
          this.currentSession = {
            user,
            accessToken: session.access_token,
            refreshToken: session.refresh_token,
            expiresAt: new Date(session.expires_at! * 1000)
          }
        }
      }
    } catch (error) {
      console.error('Restore session error:', error)
    }
  }

  private async handleSignIn(session: any): Promise<void> {
    const user = await this.getUserProfile(session.user.id)
    if (user && user.isActive) {
      this.currentUser = user
      this.currentSession = {
        user,
        accessToken: session.access_token,
        refreshToken: session.refresh_token,
        expiresAt: new Date(session.expires_at * 1000)
      }
    }
  }

  private async handleSignOut(): Promise<void> {
    this.currentUser = null
    this.currentSession = null
  }

  private async createUserProfile(userData: User): Promise<User> {
    const { data, error } = await this.supabase
      .from('user_profiles')
      .insert({
        id: userData.id,
        email: userData.email,
        name: userData.name,
        phone: userData.phone,
        role: userData.role,
        is_active: userData.isActive,
        created_at: userData.createdAt.toISOString(),
        updated_at: userData.updatedAt.toISOString()
      })
      .select()
      .single()

    if (error) throw error

    return this.transformUserData(data)
  }

  private async getUserProfile(userId: string): Promise<User | null> {
    try {
      const { data, error } = await this.supabase
        .from('user_profiles')
        .select('*')
        .eq('id', userId)
        .single()

      if (error) return null

      return this.transformUserData(data)
    } catch (error) {
      return null
    }
  }

  private async updateLastLogin(userId: string): Promise<void> {
    await this.supabase
      .from('user_profiles')
      .update({ last_login_at: new Date().toISOString() })
      .eq('id', userId)
  }

  private transformUserData(data: any): User {
    return {
      id: data.id,
      email: data.email,
      name: data.name,
      phone: data.phone,
      role: data.role as UserRole,
      avatar: data.avatar,
      isActive: data.is_active,
      lastLoginAt: data.last_login_at ? new Date(data.last_login_at) : undefined,
      createdAt: new Date(data.created_at),
      updatedAt: new Date(data.updated_at),
      metadata: data.metadata
    }
  }
}

// Export singleton instance
export const authSystem = new AuthSystem()

// Export convenience functions
export const signUp = (email: string, password: string, userData: any) => authSystem.signUp(email, password, userData)
export const signIn = (email: string, password: string) => authSystem.signIn(email, password)
export const signOut = () => authSystem.signOut()
export const getCurrentUser = () => authSystem.getCurrentUser()
export const hasPermission = (permission: string) => authSystem.hasPermission(permission)
export const hasRole = (role: UserRole) => authSystem.hasRole(role)
export const hasAnyRole = (roles: UserRole[]) => authSystem.hasAnyRole(roles)