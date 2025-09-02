// =============================================================================
// AUTHENTICATION SERVICE - Admin authentication and session management
// =============================================================================

import { supabase } from '@/lib/supabase/client';
import { User, AuthState } from '@/types/auth';

class AuthService {
  private currentUser: User | null = null;
  private listeners: ((user: User | null) => void)[] = [];

  constructor() {
    this.initializeAuth();
  }

  // Initialize authentication state
  private async initializeAuth() {
    try {
      const { data: { session } } = await supabase.auth.getSession();

      if (session?.user) {
        await this.loadUserProfile(session.user.id);
      }

      // Listen for auth state changes
      supabase.auth.onAuthStateChange(async (event, session) => {
        if (event === 'SIGNED_IN' && session?.user) {
          await this.loadUserProfile(session.user.id);
        } else if (event === 'SIGNED_OUT') {
          this.currentUser = null;
          this.notifyListeners(null);
        }
      });
    } catch (error) {
      console.error('Error initializing auth:', error);
    }
  }

  // Load user profile from database
  private async loadUserProfile(userId: string) {
    try {
      const { data: profile, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) {
        console.error('Error loading user profile:', error);
        return;
      }

      if (profile) {
        this.currentUser = {
          id: profile.id,
          email: profile.email,
          name: profile.name,
          role: profile.role,
          avatar: profile.avatar,
          isActive: profile.is_active,
          lastLogin: profile.last_login,
          preferences: profile.preferences || {},
        };

        // Update last login
        await supabase
          .from('users')
          .update({ last_login: new Date().toISOString() })
          .eq('id', userId);

        this.notifyListeners(this.currentUser);
      }
    } catch (error) {
      console.error('Error loading user profile:', error);
    }
  }

  // Authentication methods
  async signIn(email: string, password: string): Promise<{ user: User | null; error: string | null }> {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        return { user: null, error: error.message };
      }

      if (data.user) {
        await this.loadUserProfile(data.user.id);
        return { user: this.currentUser, error: null };
      }

      return { user: null, error: 'Sign in failed' };
    } catch (error) {
      console.error('Sign in error:', error);
      return { user: null, error: 'An unexpected error occurred' };
    }
  }

  async signUp(email: string, password: string, userData: Partial<User>): Promise<{ user: User | null; error: string | null }> {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            name: userData.name,
            role: userData.role || 'customer',
          },
        },
      });

      if (error) {
        return { user: null, error: error.message };
      }

      if (data.user) {
        // Create user profile in database
        const { error: profileError } = await supabase
          .from('users')
          .insert({
            id: data.user.id,
            email: data.user.email!,
            name: userData.name || '',
            role: userData.role || 'customer',
          });

        if (profileError) {
          console.error('Error creating user profile:', profileError);
          return { user: null, error: 'Failed to create user profile' };
        }

        await this.loadUserProfile(data.user.id);
        return { user: this.currentUser, error: null };
      }

      return { user: null, error: 'Sign up failed' };
    } catch (error) {
      console.error('Sign up error:', error);
      return { user: null, error: 'An unexpected error occurred' };
    }
  }

  async signOut(): Promise<{ error: string | null }> {
    try {
      const { error } = await supabase.auth.signOut();

      if (error) {
        return { error: error.message };
      }

      this.currentUser = null;
      this.notifyListeners(null);
      return { error: null };
    } catch (error) {
      console.error('Sign out error:', error);
      return { error: 'An unexpected error occurred' };
    }
  }

  async resetPassword(email: string): Promise<{ error: string | null }> {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });

      if (error) {
        return { error: error.message };
      }

      return { error: null };
    } catch (error) {
      console.error('Reset password error:', error);
      return { error: 'An unexpected error occurred' };
    }
  }

  async updatePassword(newPassword: string): Promise<{ error: string | null }> {
    try {
      const { error } = await supabase.auth.updateUser({
        password: newPassword,
      });

      if (error) {
        return { error: error.message };
      }

      return { error: null };
    } catch (error) {
      console.error('Update password error:', error);
      return { error: 'An unexpected error occurred' };
    }
  }

  // User management methods
  async updateProfile(updates: Partial<User>): Promise<{ user: User | null; error: string | null }> {
    if (!this.currentUser) {
      return { user: null, error: 'No authenticated user' };
    }

    try {
      const { error } = await supabase
        .from('users')
        .update({
          name: updates.name,
          phone: updates.phone,
          avatar: updates.avatar,
          preferences: updates.preferences,
        })
        .eq('id', this.currentUser.id);

      if (error) {
        return { user: null, error: error.message };
      }

      // Reload user profile
      await this.loadUserProfile(this.currentUser.id);
      return { user: this.currentUser, error: null };
    } catch (error) {
      console.error('Update profile error:', error);
      return { user: null, error: 'An unexpected error occurred' };
    }
  }

  // Role-based access control
  hasRole(role: string): boolean {
    return this.currentUser?.role === role;
  }

  hasAnyRole(roles: string[]): boolean {
    return this.currentUser ? roles.includes(this.currentUser.role) : false;
  }

  canAccessAdmin(): boolean {
    return this.hasAnyRole(['admin', 'staff']);
  }

  canAccessCustomerPortal(): boolean {
    return this.hasAnyRole(['admin', 'staff', 'customer']);
  }

  // Session management
  getCurrentUser(): User | null {
    return this.currentUser;
  }

  isAuthenticated(): boolean {
    return this.currentUser !== null;
  }

  // Event listeners
  onAuthStateChange(callback: (user: User | null) => void): () => void {
    this.listeners.push(callback);

    // Return unsubscribe function
    return () => {
      const index = this.listeners.indexOf(callback);
      if (index > -1) {
        this.listeners.splice(index, 1);
      }
    };
  }

  private notifyListeners(user: User | null) {
    this.listeners.forEach(callback => {
      try {
        callback(user);
      } catch (error) {
        console.error('Error in auth state change listener:', error);
      }
    });
  }

  // Admin methods
  async getUsers(filters?: { role?: string; isActive?: boolean }): Promise<{ users: User[]; error: string | null }> {
    if (!this.canAccessAdmin()) {
      return { users: [], error: 'Unauthorized' };
    }

    try {
      let query = supabase
        .from('users')
        .select('*')
        .order('created_at', { ascending: false });

      if (filters?.role) {
        query = query.eq('role', filters.role);
      }

      if (filters?.isActive !== undefined) {
        query = query.eq('is_active', filters.isActive);
      }

      const { data, error } = await query;

      if (error) {
        return { users: [], error: error.message };
      }

      const users: User[] = data.map(user => ({
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        avatar: user.avatar,
        isActive: user.is_active,
        lastLogin: user.last_login,
        preferences: user.preferences || {},
      }));

      return { users, error: null };
    } catch (error) {
      console.error('Get users error:', error);
      return { users: [], error: 'An unexpected error occurred' };
    }
  }

  async updateUserRole(userId: string, role: string): Promise<{ error: string | null }> {
    if (!this.hasRole('admin')) {
      return { error: 'Unauthorized' };
    }

    try {
      const { error } = await supabase
        .from('users')
        .update({ role })
        .eq('id', userId);

      if (error) {
        return { error: error.message };
      }

      return { error: null };
    } catch (error) {
      console.error('Update user role error:', error);
      return { error: 'An unexpected error occurred' };
    }
  }
}

// Create singleton instance
export const authService = new AuthService();

// Export types
export type { User, AuthState };
