// =============================================================================
// AUTHENTICATION TYPES - User authentication and session management
// =============================================================================

export interface User {
  id: string;
  email: string;
  name: string;
  role: 'admin' | 'staff' | 'customer';
  avatar?: string;
  phone?: string;
  isActive: boolean;
  lastLogin?: string;
  preferences?: UserPreferences;
  createdAt?: string;
  updatedAt?: string;
}

export interface UserPreferences {
  theme: 'light' | 'dark' | 'system';
  notifications: boolean;
  language: string;
  timezone: string;
}

export interface AuthState {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  error: string | null;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface SignUpData extends LoginCredentials {
  name: string;
  role?: 'admin' | 'staff' | 'customer';
  phone?: string;
}

export interface PasswordResetData {
  email: string;
}

export interface UpdatePasswordData {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

export interface UpdateProfileData {
  name?: string;
  phone?: string;
  avatar?: string;
  preferences?: Partial<UserPreferences>;
}

// Role-based permissions
export interface Permissions {
  canViewUsers: boolean;
  canEditUsers: boolean;
  canDeleteUsers: boolean;
  canViewAppointments: boolean;
  canEditAppointments: boolean;
  canDeleteAppointments: boolean;
  canViewServices: boolean;
  canEditServices: boolean;
  canDeleteServices: boolean;
  canViewCustomers: boolean;
  canEditCustomers: boolean;
  canDeleteCustomers: boolean;
  canViewStaff: boolean;
  canEditStaff: boolean;
  canDeleteStaff: boolean;
  canViewReports: boolean;
  canEditSettings: boolean;
  canSendNotifications: boolean;
}

// Permission helpers
export const getPermissions = (role: User['role']): Permissions => {
  const isAdmin = role === 'admin';
  const isStaff = role === 'staff' || isAdmin;
  const isCustomer = role === 'customer';

  return {
    // User management
    canViewUsers: isStaff,
    canEditUsers: isAdmin,
    canDeleteUsers: isAdmin,

    // Appointments
    canViewAppointments: isStaff,
    canEditAppointments: isStaff,
    canDeleteAppointments: isAdmin,

    // Services
    canViewServices: true,
    canEditServices: isStaff,
    canDeleteServices: isAdmin,

    // Customers
    canViewCustomers: isStaff,
    canEditCustomers: isStaff,
    canDeleteCustomers: isAdmin,

    // Staff
    canViewStaff: isStaff,
    canEditStaff: isAdmin,
    canDeleteStaff: isAdmin,

    // Reports
    canViewReports: isStaff,

    // Settings
    canEditSettings: isAdmin,

    // Notifications
    canSendNotifications: isStaff,
  };
};

// Session types
export interface Session {
  accessToken: string;
  refreshToken: string;
  expiresAt: number;
  user: User;
}

export interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  error: string | null;
  permissions: Permissions;
  signIn: (credentials: LoginCredentials) => Promise<void>;
  signUp: (data: SignUpData) => Promise<void>;
  signOut: () => Promise<void>;
  resetPassword: (data: PasswordResetData) => Promise<void>;
  updatePassword: (data: UpdatePasswordData) => Promise<void>;
  updateProfile: (data: UpdateProfileData) => Promise<void>;
}

// API response types
export interface AuthResponse {
  user: User | null;
  session: Session | null;
  error: string | null;
}

export interface ApiError {
  message: string;
  code: string;
  statusCode: number;
}

// OAuth provider types
export type OAuthProvider = 'google' | 'github' | 'facebook' | 'twitter';

export interface OAuthConfig {
  provider: OAuthProvider;
  clientId: string;
  clientSecret: string;
  redirectUrl: string;
  scopes: string[];
}

// Security types
export interface SecuritySettings {
  requirePasswordChange: boolean;
  passwordMinLength: number;
  requireSpecialCharacters: boolean;
  requireNumbers: boolean;
  requireUppercase: boolean;
  sessionTimeout: number; // minutes
  maxLoginAttempts: number;
  lockoutDuration: number; // minutes
  enableTwoFactor: boolean;
  enableAuditLog: boolean;
}

export interface AuditLogEntry {
  id: string;
  userId: string;
  action: string;
  resource: string;
  resourceId?: string;
  timestamp: string;
  ipAddress?: string;
  userAgent?: string;
  details?: Record<string, any>;
}

// Password validation
export interface PasswordValidation {
  isValid: boolean;
  errors: string[];
  strength: 'weak' | 'medium' | 'strong';
  score: number; // 0-100
}

export const validatePassword = (password: string): PasswordValidation => {
  const errors: string[] = [];
  let score = 0;

  // Length check
  if (password.length < 8) {
    errors.push('Password must be at least 8 characters long');
  } else if (password.length >= 8) {
    score += 25;
    if (password.length >= 12) {
      score += 10;
    }
  }

  // Character variety checks
  if (!/[a-z]/.test(password)) {
    errors.push('Password must contain at least one lowercase letter');
  } else {
    score += 15;
  }

  if (!/[A-Z]/.test(password)) {
    errors.push('Password must contain at least one uppercase letter');
  } else {
    score += 15;
  }

  if (!/\d/.test(password)) {
    errors.push('Password must contain at least one number');
  } else {
    score += 15;
  }

  if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) {
    errors.push('Password must contain at least one special character');
  } else {
    score += 15;
  }

  // Common password check (simplified)
  const commonPasswords = ['password', '123456', 'admin', 'user'];
  if (commonPasswords.includes(password.toLowerCase())) {
    errors.push('Password is too common');
    score = Math.max(0, score - 20);
  }

  const isValid = errors.length === 0;

  let strength: 'weak' | 'medium' | 'strong';
  if (score < 40) {
    strength = 'weak';
  } else if (score < 70) {
    strength = 'medium';
  } else {
    strength = 'strong';
  }

  return {
    isValid,
    errors,
    strength,
    score,
  };
};
