import { supabase } from '@/lib/supabase/client'
import { User } from '@supabase/supabase-js'

// =============================================================================
// UNIFIED AUTHENTICATION & ROLE MANAGEMENT SYSTEM
// =============================================================================
// Integrates Supabase Auth with Payload CMS user management and role-based access

export interface UserProfile {
  id: string
  email: string
  name: string
  role: UserRole
  userType: UserType
  status: UserStatus
  permissions: UserPermissions
  avatar?: string
  phone?: string
  dateOfBirth?: Date
  gender?: string
  isActive: boolean
  lastLogin?: Date
  loyaltyPoints?: number
  membershipTier?: MembershipTier
  preferredStylist?: string
  companyName?: string
  companySize?: string
  industry?: string
  employeeId?: string
  hireDate?: Date
  hourlyRate?: number
  commissionRate?: number
  specialties?: Specialty[]
  certifications?: Certification[]
  availability?: Availability[]
  emergencyContact?: EmergencyContact
  taxId?: string
  paymentTerms?: PaymentTerms
  preferences: UserPreferences
  tags?: string[]
  notes?: string
  createdAt: Date
  updatedAt: Date
}

export type UserRole =
  | 'owner'
  | 'manager'
  | 'admin'
  | 'senior_barber'
  | 'barber'
  | 'apprentice'
  | 'nail_technician'
  | 'esthetician'
  | 'massage_therapist'
  | 'receptionist'
  | 'cleaner'
  | 'inventory_manager'
  | 'vip_customer'
  | 'customer'
  | 'corporate'
  | 'supplier'
  | 'marketing_partner'

export type UserType =
  | 'individual'
  | 'business'
  | 'franchise'
  | 'supplier'

export type UserStatus =
  | 'active'
  | 'inactive'
  | 'suspended'
  | 'banned'
  | 'pending'

export type MembershipTier =
  | 'standard'
  | 'silver'
  | 'gold'
  | 'platinum'
  | 'vip'

export type PaymentTerms =
  | 'net_15'
  | 'net_30'
  | 'net_60'
  | 'due_on_receipt'

export interface Specialty {
  specialty: string
  certification?: string
  experience?: number
}

export interface Certification {
  name: string
  issuingAuthority?: string
  issueDate?: Date
  expiryDate?: Date
}

export interface Availability {
  day: 'monday' | 'tuesday' | 'wednesday' | 'thursday' | 'friday' | 'saturday' | 'sunday'
  startTime: string
  endTime: string
  isAvailable: boolean
}

export interface EmergencyContact {
  name: string
  relationship: string
  phone: string
}

export interface UserPermissions {
  canBookAppointments: boolean
  canManageCustomers: boolean
  canManageStaff: boolean
  canViewReports: boolean
  canManageInventory: boolean
  canManageServices: boolean
  canManageSettings: boolean
  canViewFinancials: boolean
}

export interface UserPreferences {
  theme: 'light' | 'dark' | 'system'
  notifications: boolean
  language: string
}

// =============================================================================
// AUTHENTICATION SERVICE
// =============================================================================

export class AuthenticationService {
  private static instance: AuthenticationService
  private currentUser: UserProfile | null = null
  private userCache = new Map<string, UserProfile>()

  static getInstance(): AuthenticationService {
    if (!AuthenticationService.instance) {
      AuthenticationService.instance = new AuthenticationService()
    }
    return AuthenticationService.instance
  }

  // =============================================================================
  // AUTHENTICATION METHODS
  // =============================================================================

  async signUp(email: string, password: string, userData: Partial<UserProfile>): Promise<{
    user: UserProfile | null
    error: string | null
  }> {
    try {
      // Sign up with Supabase
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            name: userData.name,
            role: userData.role || 'customer',
            userType: userData.userType || 'individual',
            status: 'pending'
          }
        }
      })

      if (error) {
        return { user: null, error: error.message }
      }

      if (data.user) {
        // Create user profile in Payload CMS
        const profile = await this.createUserProfile(data.user.id, {
          ...userData,
          email,
          id: data.user.id,
          role: userData.role || 'customer',
          userType: userData.userType || 'individual',
          status: 'pending'
        })

        // Send verification email
        await this.sendVerificationEmail(email)

        return { user: profile, error: null }
      }

      return { user: null, error: 'Signup failed' }
    } catch (error) {
      return { user: null, error: error instanceof Error ? error.message : 'Signup failed' }
    }
  }

  async signIn(email: string, password: string): Promise<{
    user: UserProfile | null
    error: string | null
  }> {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      })

      if (error) {
        return { user: null, error: error.message }
      }

      if (data.user) {
        // Get user profile from Payload CMS
        const profile = await this.getUserProfile(data.user.id)

        if (profile) {
          // Update last login
          await this.updateLastLogin(profile.id)

          // Check if user is active
          if (profile.status !== 'active') {
            await supabase.auth.signOut()
            return { user: null, error: 'Account is not active. Please contact support.' }
          }

          this.currentUser = profile
          return { user: profile, error: null }
        } else {
          // User exists in auth but not in profile - create profile
          const newProfile = await this.createUserProfile(data.user.id, {
            email,
            name: data.user.user_metadata?.name || '',
            role: 'customer',
            userType: 'individual',
            status: 'active'
          })

          this.currentUser = newProfile
          return { user: newProfile, error: null }
        }
      }

      return { user: null, error: 'Signin failed' }
    } catch (error) {
      return { user: null, error: error instanceof Error ? error.message : 'Signin failed' }
    }
  }

  async signOut(): Promise<void> {
    await supabase.auth.signOut()
    this.currentUser = null
    this.userCache.clear()
  }

  async resetPassword(email: string): Promise<{ error: string | null }> {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`
      })
      return { error: error?.message || null }
    } catch (error) {
      return { error: error instanceof Error ? error.message : 'Password reset failed' }
    }
  }

  async updatePassword(newPassword: string): Promise<{ error: string | null }> {
    try {
      const { error } = await supabase.auth.updateUser({
        password: newPassword
      })
      return { error: error?.message || null }
    } catch (error) {
      return { error: error instanceof Error ? error.message : 'Password update failed' }
    }
  }

  // =============================================================================
  // USER PROFILE METHODS
  // =============================================================================

  async getUserProfile(userId: string): Promise<UserProfile | null> {
    // Check cache first
    if (this.userCache.has(userId)) {
      return this.userCache.get(userId)!
    }

    try {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', userId)
        .single()

      if (error || !data) {
        return null
      }

      const profile = this.transformPayloadUser(data)
      this.userCache.set(userId, profile)
      return profile
    } catch (error) {
      console.error('Error fetching user profile:', error)
      return null
    }
  }

  async updateUserProfile(userId: string, updates: Partial<UserProfile>): Promise<{
    user: UserProfile | null
    error: string | null
  }> {
    try {
      const { data, error } = await supabase
        .from('users')
        .update(this.transformUpdatesForPayload(updates))
        .eq('id', userId)
        .select()
        .single()

      if (error) {
        return { user: null, error: error.message }
      }

      const profile = this.transformPayloadUser(data)
      this.userCache.set(userId, profile)
      return { user: profile, error: null }
    } catch (error) {
      return { user: null, error: error instanceof Error ? error.message : 'Update failed' }
    }
  }

  async createUserProfile(userId: string, profileData: Partial<UserProfile>): Promise<UserProfile> {
    try {
      const payloadData = this.transformProfileForPayload(profileData)

      const { data, error } = await supabase
        .from('users')
        .insert({
          ...payloadData,
          id: userId,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        })
        .select()
        .single()

      if (error) {
        throw error
      }

      const profile = this.transformPayloadUser(data)
      this.userCache.set(userId, profile)
      return profile
    } catch (error) {
      console.error('Error creating user profile:', error)
      throw error
    }
  }

  // =============================================================================
  // ROLE & PERMISSIONS
  // =============================================================================

  hasPermission(user: UserProfile, permission: keyof UserPermissions): boolean {
    return user.permissions[permission] || false
  }

  hasRole(user: UserProfile, role: UserRole): boolean {
    return user.role === role
  }

  hasAnyRole(user: UserProfile, roles: UserRole[]): boolean {
    return roles.includes(user.role)
  }

  isStaff(user: UserProfile): boolean {
    const staffRoles: UserRole[] = [
      'owner', 'manager', 'admin', 'senior_barber', 'barber', 'apprentice',
      'nail_technician', 'esthetician', 'massage_therapist', 'receptionist',
      'cleaner', 'inventory_manager'
    ]
    return staffRoles.includes(user.role)
  }

  isServiceProvider(user: UserProfile): boolean {
    const serviceRoles: UserRole[] = [
      'senior_barber', 'barber', 'apprentice', 'nail_technician',
      'esthetician', 'massage_therapist'
    ]
    return serviceRoles.includes(user.role)
  }

  isCustomer(user: UserProfile): boolean {
    const customerRoles: UserRole[] = ['customer', 'vip_customer', 'corporate']
    return customerRoles.includes(user.role)
  }

  isBusiness(user: UserProfile): boolean {
    const businessRoles: UserRole[] = ['corporate', 'supplier', 'marketing_partner']
    return businessRoles.includes(user.role)
  }

  // =============================================================================
  // UTILITY METHODS
  // =============================================================================

  private transformPayloadUser(data: any): UserProfile {
    return {
      id: data.id,
      email: data.email,
      name: data.name,
      role: data.role,
      userType: data.userType,
      status: data.status,
      permissions: data.permissions || this.getDefaultPermissions(data.role),
      avatar: data.avatar,
      phone: data.phone,
      dateOfBirth: data.dateOfBirth ? new Date(data.dateOfBirth) : undefined,
      gender: data.gender,
      isActive: data.isActive !== false,
      lastLogin: data.lastLogin ? new Date(data.lastLogin) : undefined,
      loyaltyPoints: data.loyaltyPoints || 0,
      membershipTier: data.membershipTier || 'standard',
      preferredStylist: data.preferredStylist,
      companyName: data.companyName,
      companySize: data.companySize,
      industry: data.industry,
      employeeId: data.employeeId,
      hireDate: data.hireDate ? new Date(data.hireDate) : undefined,
      hourlyRate: data.hourlyRate,
      commissionRate: data.commissionRate,
      specialties: data.specialties || [],
      certifications: data.certifications || [],
      availability: data.availability || [],
      emergencyContact: data.emergencyContact,
      taxId: data.taxId,
      paymentTerms: data.paymentTerms,
      preferences: data.preferences || { theme: 'light', notifications: true, language: 'en' },
      tags: data.tags || [],
      notes: data.notes,
      createdAt: new Date(data.createdAt || data.created_at),
      updatedAt: new Date(data.updatedAt || data.updated_at)
    }
  }

  private transformProfileForPayload(profile: Partial<UserProfile>): any {
    const payload: any = {
      email: profile.email,
      name: profile.name,
      role: profile.role,
      userType: profile.userType,
      status: profile.status,
      permissions: profile.permissions,
      avatar: profile.avatar,
      phone: profile.phone,
      dateOfBirth: profile.dateOfBirth?.toISOString(),
      gender: profile.gender,
      isActive: profile.isActive,
      lastLogin: profile.lastLogin?.toISOString(),
      loyaltyPoints: profile.loyaltyPoints,
      membershipTier: profile.membershipTier,
      preferredStylist: profile.preferredStylist,
      companyName: profile.companyName,
      companySize: profile.companySize,
      industry: profile.industry,
      employeeId: profile.employeeId,
      hireDate: profile.hireDate?.toISOString(),
      hourlyRate: profile.hourlyRate,
      commissionRate: profile.commissionRate,
      specialties: profile.specialties,
      certifications: profile.certifications,
      availability: profile.availability,
      emergencyContact: profile.emergencyContact,
      taxId: profile.taxId,
      paymentTerms: profile.paymentTerms,
      preferences: profile.preferences,
      tags: profile.tags,
      notes: profile.notes
    }

    // Remove undefined values
    Object.keys(payload).forEach(key => {
      if (payload[key] === undefined) {
        delete payload[key]
      }
    })

    return payload
  }

  private transformUpdatesForPayload(updates: Partial<UserProfile>): any {
    const payload = this.transformProfileForPayload(updates)
    payload.updatedAt = new Date().toISOString()
    return payload
  }

  private getDefaultPermissions(role: UserRole): UserPermissions {
    const basePermissions: UserPermissions = {
      canBookAppointments: true,
      canManageCustomers: false,
      canManageStaff: false,
      canViewReports: false,
      canManageInventory: false,
      canManageServices: false,
      canManageSettings: false,
      canViewFinancials: false
    }

    switch (role) {
      case 'owner':
        return {
          ...basePermissions,
          canManageCustomers: true,
          canManageStaff: true,
          canViewReports: true,
          canManageInventory: true,
          canManageServices: true,
          canManageSettings: true,
          canViewFinancials: true
        }

      case 'manager':
        return {
          ...basePermissions,
          canManageCustomers: true,
          canManageStaff: true,
          canViewReports: true,
          canManageInventory: true,
          canManageServices: true,
          canViewFinancials: true
        }

      case 'admin':
        return {
          ...basePermissions,
          canManageCustomers: true,
          canManageStaff: true,
          canViewReports: true,
          canManageInventory: true,
          canManageServices: true,
          canManageSettings: true,
          canViewFinancials: true
        }

      case 'senior_barber':
        return {
          ...basePermissions,
          canManageCustomers: true,
          canViewReports: true
        }

      case 'receptionist':
        return {
          ...basePermissions,
          canManageCustomers: true,
          canManageInventory: true
        }

      case 'inventory_manager':
        return {
          ...basePermissions,
          canManageInventory: true,
          canViewReports: true
        }

      default:
        return basePermissions
    }
  }

  private async updateLastLogin(userId: string): Promise<void> {
    try {
      await supabase
        .from('users')
        .update({ lastLogin: new Date().toISOString() })
        .eq('id', userId)
    } catch (error) {
      console.error('Error updating last login:', error)
    }
  }

  private async sendVerificationEmail(email: string): Promise<void> {
    // This would integrate with your email service
    console.log(`Verification email sent to: ${email}`)
  }

  // =============================================================================
  // SESSION MANAGEMENT
  // =============================================================================

  getCurrentUser(): UserProfile | null {
    return this.currentUser
  }

  isAuthenticated(): boolean {
    return this.currentUser !== null
  }

  clearCache(): void {
    this.userCache.clear()
  }

  // =============================================================================
  // AUTH STATE LISTENERS
  // =============================================================================

  onAuthStateChange(callback: (user: UserProfile | null) => void): () => void {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (event === 'SIGNED_IN' && session?.user) {
          const profile = await this.getUserProfile(session.user.id)
          this.currentUser = profile
          callback(profile)
        } else if (event === 'SIGNED_OUT') {
          this.currentUser = null
          this.clearCache()
          callback(null)
        }
      }
    )

    return () => subscription.unsubscribe()
  }
}

// =============================================================================
// REACT HOOKS FOR AUTHENTICATION
// =============================================================================

export function useAuthentication() {
  const authService = AuthenticationService.getInstance()

  return {
    // Auth methods
    signUp: authService.signUp.bind(authService),
    signIn: authService.signIn.bind(authService),
    signOut: authService.signOut.bind(authService),
    resetPassword: authService.resetPassword.bind(authService),
    updatePassword: authService.updatePassword.bind(authService),

    // User methods
    getUserProfile: authService.getUserProfile.bind(authService),
    updateUserProfile: authService.updateUserProfile.bind(authService),

    // Permission methods
    hasPermission: authService.hasPermission.bind(authService),
    hasRole: authService.hasRole.bind(authService),
    hasAnyRole: authService.hasAnyRole.bind(authService),
    isStaff: authService.isStaff.bind(authService),
    isServiceProvider: authService.isServiceProvider.bind(authService),
    isCustomer: authService.isCustomer.bind(authService),
    isBusiness: authService.isBusiness.bind(authService),

    // State methods
    getCurrentUser: authService.getCurrentUser.bind(authService),
    isAuthenticated: authService.isAuthenticated.bind(authService),
    onAuthStateChange: authService.onAuthStateChange.bind(authService)
  }
}

// =============================================================================
// ROLE-BASED ACCESS CONTROL (RBAC)
// =============================================================================

export class RBACService {
  static canAccess(user: UserProfile, resource: string, action: string): boolean {
    const permissions = this.getPermissionsForResource(user.role, resource)
    return permissions.includes(action)
  }

  static getPermissionsForResource(role: UserRole, resource: string): string[] {
    const rolePermissions: Record<UserRole, Record<string, string[]>> = {
      owner: {
        users: ['create', 'read', 'update', 'delete'],
        appointments: ['create', 'read', 'update', 'delete'],
        services: ['create', 'read', 'update', 'delete'],
        customers: ['create', 'read', 'update', 'delete'],
        staff: ['create', 'read', 'update', 'delete'],
        reports: ['read'],
        settings: ['create', 'read', 'update', 'delete'],
        financials: ['read']
      },
      manager: {
        users: ['read', 'update'],
        appointments: ['create', 'read', 'update', 'delete'],
        services: ['create', 'read', 'update', 'delete'],
        customers: ['create', 'read', 'update', 'delete'],
        staff: ['create', 'read', 'update', 'delete'],
        reports: ['read'],
        settings: ['read', 'update'],
        financials: ['read']
      },
      admin: {
        users: ['create', 'read', 'update', 'delete'],
        appointments: ['create', 'read', 'update', 'delete'],
        services: ['create', 'read', 'update', 'delete'],
        customers: ['create', 'read', 'update', 'delete'],
        staff: ['create', 'read', 'update', 'delete'],
        reports: ['read'],
        settings: ['create', 'read', 'update', 'delete'],
        financials: ['read']
      },
      senior_barber: {
        users: ['read'],
        appointments: ['create', 'read', 'update'],
        services: ['read'],
        customers: ['create', 'read', 'update'],
        reports: ['read']
      },
      receptionist: {
        users: ['read'],
        appointments: ['create', 'read', 'update'],
        customers: ['create', 'read', 'update'],
        services: ['read']
      },
      customer: {
        appointments: ['create', 'read', 'update'],
        profile: ['read', 'update']
      },
      vip_customer: {
        appointments: ['create', 'read', 'update'],
        profile: ['read', 'update'],
        services: ['read']
      },
      corporate: {
        appointments: ['create', 'read', 'update'],
        profile: ['read', 'update'],
        services: ['read'],
        reports: ['read']
      },
      supplier: {
        profile: ['read', 'update'],
        inventory: ['read', 'update']
      },
      marketing_partner: {
        profile: ['read', 'update'],
        campaigns: ['read']
      },
      barber: {
        appointments: ['create', 'read', 'update', 'delete'],
        services: ['read', 'update'],
        customers: ['create', 'read', 'update', 'delete'],
        profile: ['read', 'update']
      },
      apprentice: {
        appointments: ['create', 'read', 'update'],
        services: ['read'],
        customers: ['create', 'read', 'update'],
        profile: ['read', 'update']
      },
      nail_technician: {
        appointments: ['create', 'read', 'update', 'delete'],
        services: ['read', 'update'],
        customers: ['create', 'read', 'update', 'delete'],
        profile: ['read', 'update']
      },
      esthetician: {
        appointments: ['create', 'read', 'update', 'delete'],
        services: ['read', 'update'],
        customers: ['create', 'read', 'update', 'delete'],
        profile: ['read', 'update']
      },
      massage_therapist: {
        appointments: ['create', 'read', 'update', 'delete'],
        services: ['read', 'update'],
        customers: ['create', 'read', 'update', 'delete'],
        profile: ['read', 'update']
      },
      cleaner: {
        profile: ['read', 'update'],
        inventory: ['read']
      },
      inventory_manager: {
        inventory: ['create', 'read', 'update', 'delete'],
        services: ['read'],
        profile: ['read', 'update'],
        reports: ['read']
      }
    }

    return rolePermissions[role]?.[resource] || []
  }

  static getAccessibleResources(user: UserProfile): string[] {
    const rolePermissions = this.getPermissionsForResource(user.role, '')
    return Object.keys(rolePermissions)
  }

  static canPerformBulkAction(user: UserProfile, resource: string, action: string): boolean {
    // Only certain roles can perform bulk actions
    const bulkAllowedRoles: UserRole[] = ['owner', 'manager', 'admin', 'inventory_manager']
    return bulkAllowedRoles.includes(user.role) && this.canAccess(user, resource, action)
  }
}

// Export singleton instance
export const authService = AuthenticationService.getInstance()
export const rbacService = RBACService
