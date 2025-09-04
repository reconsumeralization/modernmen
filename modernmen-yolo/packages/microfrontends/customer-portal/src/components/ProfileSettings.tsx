import React, { useState, useEffect, useCallback, useRef } from 'react';
// @ts-ignore - react-router-dom is provided by host application in microfrontend setup
import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, User, Mail, Phone, MapPin, Save, Camera, RotateCcw, AlertTriangle } from 'lucide-react';

// Local validation functions (simplified for microfrontend compatibility)
const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

const validatePhone = (phone: string): boolean => {
  const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
  return phoneRegex.test(phone.replace(/[\s\-\(\)]/g, ''));
};

const validateZipCode = (zipCode: string): boolean => {
  const zipRegex = /^\d{5}(-\d{4})?$/;
  return zipRegex.test(zipCode);
};

// Local error handling
class ValidationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'ValidationError';
  }
}

class NetworkError extends Error {
  constructor(message: string = 'Network request failed') {
    super(message);
    this.name = 'NetworkError';
  }
}

const useErrorHandler = () => {
  const [error, setErrorState] = useState<{ success: false; error: string; code?: string } | null>(null);

  const setError = useCallback((error: unknown) => {
    if (error instanceof Error) {
      setErrorState({
        success: false,
        error: error.message,
        code: error.name
      });
    } else {
      setErrorState({
        success: false,
        error: 'An unexpected error occurred'
      });
    }
  }, []);

  const clearError = useCallback(() => {
    setErrorState(null);
  }, []);

  const handleAsync = useCallback(async <T,>(fn: () => Promise<T>, errorMessage?: string): Promise<T | null> => {
    try {
      clearError();
      return await fn();
    } catch (error: any) {
      setError(error);
      return null;
    }
  }, [setError, clearError]);

  return {
    error,
    isError: error !== null,
    setError,
    clearError,
    handleAsync
  };
};

interface UserProfile {
  id?: string;
  name: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  dateOfBirth?: string;
  gender?: 'male' | 'female' | 'other';
  address: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
  preferences: {
    emailNotifications: boolean;
    smsNotifications: boolean;
    marketingEmails: boolean;
    preferredContactMethod: 'email' | 'phone';
    preferredServices: string[];
    preferredTimes: string[];
    preferredBarbers: string[];
    allergies: string[];
    specialRequests: string[];
  };
  isActive: boolean;
  avatar?: string;
  createdAt?: string;
  updatedAt?: string;
}

// API service interface
interface CustomerApiResponse {
  id: string;
  name: string;
  email: string;
  phone: string;
  date_of_birth?: string;
  gender?: string;
  street_address?: string;
  city?: string;
  state_province?: string;
  postal_code?: string;
  country?: string;
  email_marketing?: boolean;
  sms_marketing?: boolean;
  appointment_reminders?: boolean;
  birthday_messages?: boolean;
  preferred_services?: string[];
  preferred_times?: string[];
  preferred_barbers?: string[];
  allergies?: string[];
  special_requests?: string[];
  is_active: boolean;
  avatar_url?: string;
  created_at: string;
  updated_at: string;
}

// Error Boundary wrapper for ProfileSettings
const ProfileSettingsErrorBoundary: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [hasError, setHasError] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const handleError = (event: ErrorEvent) => {
      console.error('ProfileSettings error:', event.error);
      setError(event.error);
      setHasError(true);
    };

    const handleUnhandledRejection = (event: PromiseRejectionEvent) => {
      console.error('ProfileSettings unhandled promise rejection:', event.reason);
      setError(new Error(event.reason?.message || 'Unknown error'));
      setHasError(true);
    };

    window.addEventListener('error', handleError);
    window.addEventListener('unhandledrejection', handleUnhandledRejection);

    return () => {
      window.removeEventListener('error', handleError);
      window.removeEventListener('unhandledrejection', handleUnhandledRejection);
    };
  }, []);

  if (hasError) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-6">
          <div className="flex items-center mb-4">
            <AlertTriangle className="h-8 w-8 text-red-600 mr-3" />
            <h2 className="text-xl font-semibold text-gray-900">Profile Settings Error</h2>
          </div>

          <p className="text-gray-600 mb-6">
            We encountered an error while loading your profile settings. This might be due to a network issue or temporary service problem.
          </p>

          {error && (
            <details className="mb-6">
              <summary className="cursor-pointer text-sm text-gray-500 hover:text-gray-700">
                Error Details (Development)
              </summary>
              <pre className="mt-2 text-xs bg-gray-100 p-2 rounded overflow-auto max-h-32">
                {error.toString()}
              </pre>
            </details>
          )}

          <button
            onClick={() => window.location.reload()}
            className="w-full flex items-center justify-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            <RotateCcw className="h-4 w-4 mr-2" />
            Reload Page
          </button>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};

// Offline detection hook
const useOnlineStatus = () => {
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  return isOnline;
};

const ProfileSettings: React.FC = () => {
  const navigate = useNavigate();
  const { error: apiError, isError, setError, clearError, handleAsync } = useErrorHandler();
  const fileReaderRef = useRef<FileReader | null>(null);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const isOnline = useOnlineStatus();

  // Loading and data states
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  // Data states
  const [originalProfile, setOriginalProfile] = useState<UserProfile | null>(null);
  const [profile, setProfile] = useState<UserProfile>({
    name: '',
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    dateOfBirth: '',
    gender: undefined,
    address: {
      street: '',
      city: '',
      state: '',
      zipCode: '',
      country: 'USA'
    },
    preferences: {
      emailNotifications: true,
      smsNotifications: true,
      marketingEmails: false,
      preferredContactMethod: 'email',
      preferredServices: [],
      preferredTimes: [],
      preferredBarbers: [],
      allergies: [],
      specialRequests: []
    },
    isActive: true
  });

  const [profilePicture, setProfilePicture] = useState<string | null>(null);
  const [errors, setErrors] = useState<Partial<Record<string, string>>>({});

  // API Service Functions
  const fetchCustomerProfile = useCallback(async (): Promise<UserProfile | null> => {
    try {
      // In a real app, this would get the customer ID from auth context
      const customerId = 'current-user-id'; // Placeholder

      const response = await fetch(`/api/customers/${customerId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        if (response.status === 404) {
          throw new Error('Customer profile not found');
        }
        throw new NetworkError('Failed to fetch customer profile');
      }

      const data: CustomerApiResponse = await response.json();
      return transformApiResponseToProfile(data);
    } catch (error) {
      console.error('Error fetching customer profile:', error);
      throw error;
    }
  }, []);

  const updateCustomerProfile = useCallback(async (profileData: UserProfile): Promise<UserProfile> => {
    try {
      const customerId = profileData.id || 'current-user-id';

      const apiData = transformProfileToApiRequest(profileData);

      const response = await fetch(`/api/customers/${customerId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(apiData),
      });

      if (!response.ok) {
        throw new NetworkError('Failed to update customer profile');
      }

      const data: CustomerApiResponse = await response.json();
      return transformApiResponseToProfile(data);
    } catch (error) {
      console.error('Error updating customer profile:', error);
      throw error;
    }
  }, []);

  // Data transformation functions
  const transformApiResponseToProfile = (apiData: CustomerApiResponse): UserProfile => {
    const nameParts = apiData.name.split(' ');
    const firstName = nameParts[0] || '';
    const lastName = nameParts.slice(1).join(' ') || '';

    return {
      id: apiData.id,
      name: apiData.name,
      firstName,
      lastName,
      email: apiData.email,
      phone: apiData.phone,
      dateOfBirth: apiData.date_of_birth,
      gender: apiData.gender as 'male' | 'female' | 'other',
      address: {
        street: apiData.street_address || '',
        city: apiData.city || '',
        state: apiData.state_province || '',
        zipCode: apiData.postal_code || '',
        country: apiData.country || 'USA'
      },
      preferences: {
        emailNotifications: apiData.appointment_reminders ?? true,
        smsNotifications: apiData.sms_marketing ?? true,
        marketingEmails: apiData.email_marketing ?? false,
        preferredContactMethod: 'email', // Default, could be enhanced
        preferredServices: apiData.preferred_services || [],
        preferredTimes: apiData.preferred_times || [],
        preferredBarbers: apiData.preferred_barbers || [],
        allergies: apiData.allergies || [],
        specialRequests: apiData.special_requests || []
      },
      isActive: apiData.is_active,
      avatar: apiData.avatar_url,
      createdAt: apiData.created_at,
      updatedAt: apiData.updated_at
    };
  };

  const transformProfileToApiRequest = (profile: UserProfile) => {
    return {
      name: `${profile.firstName} ${profile.lastName}`.trim(),
      email: profile.email,
      phone: profile.phone,
      date_of_birth: profile.dateOfBirth || null,
      gender: profile.gender,
      street_address: profile.address.street,
      city: profile.address.city,
      state_province: profile.address.state,
      postal_code: profile.address.zipCode,
      country: profile.address.country,
      email_marketing: profile.preferences.marketingEmails,
      sms_marketing: profile.preferences.smsNotifications,
      appointment_reminders: profile.preferences.emailNotifications,
      birthday_messages: true, // Could be added to preferences
      preferred_services: profile.preferences.preferredServices,
      preferred_times: profile.preferences.preferredTimes,
      preferred_barbers: profile.preferences.preferredBarbers,
      allergies: profile.preferences.allergies,
      special_requests: profile.preferences.specialRequests
    };
  };

  // Lifecycle: Load data on mount
  useEffect(() => {
    const loadProfile = async () => {
      const result = await handleAsync(async () => {
        const data = await fetchCustomerProfile();
        if (data) {
          setProfile(data);
          setOriginalProfile(data);
          if (data.avatar) {
            setProfilePicture(data.avatar);
          }
        }
        return data;
      });

      setIsLoading(false);
    };

    loadProfile();
  }, [fetchCustomerProfile, handleAsync]);

  // Track unsaved changes
  useEffect(() => {
    if (originalProfile && JSON.stringify(profile) !== JSON.stringify(originalProfile)) {
      setHasUnsavedChanges(true);
    } else {
      setHasUnsavedChanges(false);
    }
  }, [profile, originalProfile]);

  // Warn about unsaved changes on navigation
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (hasUnsavedChanges) {
        e.preventDefault();
        e.returnValue = 'You have unsaved changes. Are you sure you want to leave?';
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [hasUnsavedChanges]);

  // Placeholder functions for useEffect dependencies - will be replaced with actual functions
  const placeholderHandleSave = useCallback(() => {}, []);
  const placeholderHandleReset = useCallback(() => {}, []);

  // Keyboard shortcuts and accessibility
  useEffect(() => {
    const handleKeyboardShortcuts = (e: KeyboardEvent) => {
      // Ctrl/Cmd + S to save
      if ((e.ctrlKey || e.metaKey) && e.key === 's') {
        e.preventDefault();
        if (!isSaving && hasUnsavedChanges) {
          placeholderHandleSave();
        }
      }
      // Ctrl/Cmd + R to reset (with confirmation)
      if ((e.ctrlKey || e.metaKey) && e.key === 'r') {
        e.preventDefault();
        if (hasUnsavedChanges) {
          const confirmed = window.confirm('Reset all changes?');
          if (confirmed) {
            placeholderHandleReset();
          }
        }
      }
    };

    document.addEventListener('keydown', handleKeyboardShortcuts);
    return () => document.removeEventListener('keydown', handleKeyboardShortcuts);
  }, [isSaving, hasUnsavedChanges, placeholderHandleSave, placeholderHandleReset]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (fileReaderRef.current) {
        fileReaderRef.current.abort();
      }
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  const validateForm = (): boolean => {
    const newErrors: Partial<Record<string, string>> = {};

    // Required field validation
    if (!profile.firstName.trim()) newErrors.firstName = 'First name is required';
    if (!profile.lastName.trim()) newErrors.lastName = 'Last name is required';
    if (!profile.email.trim()) newErrors.email = 'Email is required';
    else if (!validateEmail(profile.email)) newErrors.email = 'Invalid email format';
    if (!profile.phone.trim()) newErrors.phone = 'Phone number is required';
    else if (!validatePhone(profile.phone)) newErrors.phone = 'Please enter a valid phone number';
    if (!profile.dateOfBirth) newErrors.dateOfBirth = 'Date of birth is required';

    // Address validation
    if (!profile.address.street.trim()) newErrors['address.street'] = 'Street address is required';
    if (!profile.address.city.trim()) newErrors['address.city'] = 'City is required';
    if (!profile.address.state.trim()) newErrors['address.state'] = 'State is required';
    if (!profile.address.zipCode.trim()) newErrors['address.zipCode'] = 'ZIP code is required';
    else if (!validateZipCode(profile.address.zipCode)) newErrors['address.zipCode'] = 'Invalid ZIP code format';

    // Age validation
    if (profile.dateOfBirth) {
      const birthDate = new Date(profile.dateOfBirth);
      const today = new Date();
      const age = today.getFullYear() - birthDate.getFullYear();

      if (age < 13) {
        newErrors.dateOfBirth = 'You must be at least 13 years old';
      } else if (age > 120) {
        newErrors.dateOfBirth = 'Please enter a valid date of birth';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (field: string, value: any) => {
    // Clear error for this field when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }

    // Update profile state
    if (field.includes('.')) {
      const [parent, child] = field.split('.');
      setProfile(prev => ({
        ...prev,
        [parent]: {
          ...(prev[parent as keyof UserProfile] as any),
          [child]: value
        },
        // Update full name when first/last name changes
        ...(parent === 'firstName' || parent === 'lastName' ? {
          name: parent === 'firstName'
            ? `${value} ${prev.lastName}`.trim()
            : `${prev.firstName} ${value}`.trim()
        } : {})
      }));
    } else {
      setProfile(prev => ({
        ...prev,
        [field]: value
      }));
    }
  };

  const handleReset = useCallback(() => {
    if (originalProfile) {
      setProfile(originalProfile);
      setProfilePicture(originalProfile.avatar || null);
      setErrors({});
      setSaveSuccess(false);
      clearError();
    }
  }, [originalProfile, clearError]);

  const handleNavigationWarning = useCallback(() => {
    if (hasUnsavedChanges) {
      const confirmed = window.confirm(
        'You have unsaved changes. Are you sure you want to leave this page?'
      );
      if (!confirmed) {
        return false;
      }
    }
    return true;
  }, [hasUnsavedChanges]);

  const compressImage = useCallback(async (file: File, maxWidth: number = 800, quality: number = 0.8): Promise<string> => {
    return new Promise((resolve, reject) => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      const img = new Image();

      img.onload = () => {
        // Calculate new dimensions
        const aspectRatio = img.width / img.height;
        let { width, height } = img;

        if (width > height) {
          if (width > maxWidth) {
            width = maxWidth;
            height = width / aspectRatio;
          }
        } else {
          if (height > maxWidth) {
            height = maxWidth;
            width = height * aspectRatio;
          }
        }

        canvas.width = width;
        canvas.height = height;

        // Draw and compress
        ctx?.drawImage(img, 0, 0, width, height);
        canvas.toBlob(
          (blob) => {
            if (blob) {
              const reader = new FileReader();
              reader.onload = () => resolve(reader.result as string);
              reader.onerror = reject;
              reader.readAsDataURL(blob);
            } else {
              reject(new Error('Failed to compress image'));
            }
          },
          'image/jpeg',
          quality
        );
      };

      img.onerror = () => reject(new Error('Failed to load image'));
      img.src = URL.createObjectURL(file);
    });
  }, []);

  const handleProfilePictureChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      // Validate file type and size
      const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
      const maxSize = 5 * 1024 * 1024; // 5MB (before compression)

      if (!validTypes.includes(file.type)) {
        setErrors({ profilePicture: 'Please select a valid image file (JPG, PNG, or WebP)' });
        return;
      }

      if (file.size > maxSize) {
        setErrors({ profilePicture: 'File size must be less than 5MB' });
        return;
      }

      // Clear any previous errors
      setErrors(prev => ({ ...prev, profilePicture: undefined }));

      // Compress and create preview
      const compressedImage = await compressImage(file);
      setProfilePicture(compressedImage);

      // Update profile with new avatar (would upload to server in real implementation)
      setProfile(prev => ({
        ...prev,
        avatar: compressedImage
      }));

    } catch (error) {
      console.error('Error processing profile picture:', error);
      setErrors({ profilePicture: 'Failed to process image. Please try again.' });
    }

    // Reset file input
    event.target.value = '';
  };

  const handleSave = async () => {
    // Check if online
    if (!isOnline) {
      setErrors({ general: 'Cannot save while offline. Please check your internet connection.' });
      return;
    }

    // Validate form before saving
    if (!validateForm()) {
      return;
    }

    setIsSaving(true);
    setSaveSuccess(false);
    clearError();

    const result = await handleAsync(async () => {
      const updatedProfile = await updateCustomerProfile(profile);

      // Update local state with server response
      setProfile(updatedProfile);
      setOriginalProfile(updatedProfile);

      // Reset unsaved changes flag
      setHasUnsavedChanges(false);

      // Clear any field-specific errors
      setErrors({});

      setSaveSuccess(true);

      // Hide success message after 3 seconds
      timeoutRef.current = setTimeout(() => {
        setSaveSuccess(false);
      }, 3000);

      return updatedProfile;
    });

    setIsSaving(false);

    if (!result) {
      // handleAsync already set the error state
      return;
    }
  };

  // Show loading state while fetching initial data
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="flex flex-col items-center space-y-4">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <p className="text-gray-600">Loading your profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <Link
          to="/"
          className="flex items-center text-gray-600 hover:text-gray-900 mb-4"
          onClick={(e: React.MouseEvent) => {
            if (!handleNavigationWarning()) {
              e.preventDefault();
            }
          }}
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Dashboard
          {hasUnsavedChanges && (
            <span className="ml-2 text-orange-600 text-sm font-medium">
              (Unsaved changes)
            </span>
          )}
        </Link>

        <div>
          <h1 className="text-3xl font-bold text-gray-900">Profile Settings</h1>
          <p className="text-gray-600 mt-2">Manage your personal information and preferences</p>
          {hasUnsavedChanges && (
            <div className="mt-3 p-3 bg-orange-50 border border-orange-200 rounded-md">
              <div className="flex items-center">
                <AlertTriangle className="h-4 w-4 text-orange-600 mr-2" />
                <p className="text-sm text-orange-800">
                  You have unsaved changes. Remember to save before leaving this page.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="space-y-8">
        {/* Offline Indicator */}
        {!isOnline && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-md p-4">
            <div className="flex items-center">
              <AlertTriangle className="h-4 w-4 text-yellow-600 mr-2" />
              <p className="text-sm text-yellow-800">
                You're currently offline. Changes will be saved when connection is restored.
              </p>
            </div>
          </div>
        )}

        {/* General Error Display */}
        {errors.general && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-md">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-red-800">{errors.general}</p>
              </div>
            </div>
          </div>
        )}

        {/* Profile Picture Section */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Profile Picture</h2>
          <div className="flex items-center space-x-6">
            <div className="w-24 h-24 bg-gray-200 rounded-full flex items-center justify-center overflow-hidden">
              {profilePicture ? (
                <img src={profilePicture} alt="Profile" className="w-full h-full object-cover" />
              ) : (
                <User className="h-12 w-12 text-gray-400" />
              )}
            </div>
            <div>
              <label className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 cursor-pointer">
                <Camera className="h-4 w-4 mr-2" />
                Change Picture
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleProfilePictureChange}
                  className="hidden"
                />
              </label>
              <p className="text-sm text-gray-600 mt-2">JPG, PNG or GIF. Max size 2MB.</p>
              {errors.profilePicture && (
                <p className="mt-1 text-sm text-red-600">{errors.profilePicture}</p>
              )}
            </div>
          </div>
        </div>

        {/* Personal Information */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Personal Information</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label
                htmlFor="firstName"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                First Name <span className="text-red-500" aria-label="required">*</span>
              </label>
              <input
                id="firstName"
                type="text"
                value={profile.firstName}
                onChange={(e) => handleInputChange('firstName', e.target.value)}
                className={`w-full px-3 py-2 border rounded-md focus:ring-blue-500 focus:border-blue-500 ${
                  errors.firstName ? 'border-red-300 focus:ring-red-500 focus:border-red-500' : 'border-gray-300'
                }`}
                aria-invalid={!!errors.firstName}
                aria-describedby={errors.firstName ? 'firstName-error' : undefined}
                required
                autoComplete="given-name"
              />
              {errors.firstName && (
                <p id="firstName-error" className="mt-1 text-sm text-red-600" role="alert">
                  {errors.firstName}
                </p>
              )}
            </div>

            <div>
              <label
                htmlFor="lastName"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Last Name <span className="text-red-500" aria-label="required">*</span>
              </label>
              <input
                id="lastName"
                type="text"
                value={profile.lastName}
                onChange={(e) => handleInputChange('lastName', e.target.value)}
                className={`w-full px-3 py-2 border rounded-md focus:ring-blue-500 focus:border-blue-500 ${
                  errors.lastName ? 'border-red-300 focus:ring-red-500 focus:border-red-500' : 'border-gray-300'
                }`}
                aria-invalid={!!errors.lastName}
                aria-describedby={errors.lastName ? 'lastName-error' : undefined}
                required
                autoComplete="family-name"
              />
              {errors.lastName && (
                <p id="lastName-error" className="mt-1 text-sm text-red-600" role="alert">
                  {errors.lastName}
                </p>
              )}
            </div>

            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Email Address <span className="text-red-500" aria-label="required">*</span>
              </label>
              <div className="relative">
                <input
                  id="email"
                  type="email"
                  value={profile.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  className={`w-full pl-10 pr-3 py-2 border rounded-md focus:ring-blue-500 focus:border-blue-500 ${
                    errors.email ? 'border-red-300 focus:ring-red-500 focus:border-red-500' : 'border-gray-300'
                  }`}
                  aria-invalid={!!errors.email}
                  aria-describedby={errors.email ? 'email-error' : 'email-description'}
                  required
                  autoComplete="email"
                />
                <Mail className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" aria-hidden="true" />
              </div>
              <p id="email-description" className="mt-1 text-xs text-gray-500">
                We'll use this email for important notifications and account recovery
              </p>
              {errors.email && (
                <p id="email-error" className="mt-1 text-sm text-red-600" role="alert">
                  {errors.email}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Phone Number
              </label>
              <div className="relative">
                <input
                  type="tel"
                  value={profile.phone}
                  onChange={(e) => handleInputChange('phone', e.target.value)}
                  className={`w-full pl-10 pr-3 py-2 border rounded-md focus:ring-blue-500 focus:border-blue-500 ${
                    errors.phone ? 'border-red-300 focus:ring-red-500 focus:border-red-500' : 'border-gray-300'
                  }`}
                />
                <Phone className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
              </div>
              {errors.phone && (
                <p className="mt-1 text-sm text-red-600">{errors.phone}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Date of Birth
              </label>
              <input
                type="date"
                value={profile.dateOfBirth}
                onChange={(e) => handleInputChange('dateOfBirth', e.target.value)}
                className={`w-full px-3 py-2 border rounded-md focus:ring-blue-500 focus:border-blue-500 ${
                  errors.dateOfBirth ? 'border-red-300 focus:ring-red-500 focus:border-red-500' : 'border-gray-300'
                }`}
              />
              {errors.dateOfBirth && (
                <p className="mt-1 text-sm text-red-600">{errors.dateOfBirth}</p>
              )}
            </div>
          </div>
        </div>

        {/* Address Information */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Address</h2>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Street Address
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={profile.address.street}
                  onChange={(e) => handleInputChange('address.street', e.target.value)}
                  className={`w-full pl-10 pr-3 py-2 border rounded-md focus:ring-blue-500 focus:border-blue-500 ${
                    errors['address.street'] ? 'border-red-300 focus:ring-red-500 focus:border-red-500' : 'border-gray-300'
                  }`}
                />
                <MapPin className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
              </div>
              {errors['address.street'] && (
                <p className="mt-1 text-sm text-red-600">{errors['address.street']}</p>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  City
                </label>
                <input
                  type="text"
                  value={profile.address.city}
                  onChange={(e) => handleInputChange('address.city', e.target.value)}
                  className={`w-full px-3 py-2 border rounded-md focus:ring-blue-500 focus:border-blue-500 ${
                    errors['address.city'] ? 'border-red-300 focus:ring-red-500 focus:border-red-500' : 'border-gray-300'
                  }`}
                />
                {errors['address.city'] && (
                  <p className="mt-1 text-sm text-red-600">{errors['address.city']}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  State
                </label>
                <input
                  type="text"
                  value={profile.address.state}
                  onChange={(e) => handleInputChange('address.state', e.target.value)}
                  className={`w-full px-3 py-2 border rounded-md focus:ring-blue-500 focus:border-blue-500 ${
                    errors['address.state'] ? 'border-red-300 focus:ring-red-500 focus:border-red-500' : 'border-gray-300'
                  }`}
                />
                {errors['address.state'] && (
                  <p className="mt-1 text-sm text-red-600">{errors['address.state']}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  ZIP Code
                </label>
                <input
                  type="text"
                  value={profile.address.zipCode}
                  onChange={(e) => handleInputChange('address.zipCode', e.target.value)}
                  className={`w-full px-3 py-2 border rounded-md focus:ring-blue-500 focus:border-blue-500 ${
                    errors['address.zipCode'] ? 'border-red-300 focus:ring-red-500 focus:border-red-500' : 'border-gray-300'
                  }`}
                />
                {errors['address.zipCode'] && (
                  <p className="mt-1 text-sm text-red-600">{errors['address.zipCode']}</p>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Notification Preferences */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Notification Preferences</h2>

          <div className="space-y-4">
            <div className="flex items-center">
              <input
                id="email-notifications"
                type="checkbox"
                checked={profile.preferences.emailNotifications}
                onChange={(e) => handleInputChange('preferences.emailNotifications', e.target.checked)}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label htmlFor="email-notifications" className="ml-2 text-sm text-gray-700">
                Email notifications for appointment reminders
              </label>
            </div>

            <div className="flex items-center">
              <input
                id="sms-notifications"
                type="checkbox"
                checked={profile.preferences.smsNotifications}
                onChange={(e) => handleInputChange('preferences.smsNotifications', e.target.checked)}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label htmlFor="sms-notifications" className="ml-2 text-sm text-gray-700">
                SMS notifications for appointment updates
              </label>
            </div>

            <div className="flex items-center">
              <input
                id="marketing-emails"
                type="checkbox"
                checked={profile.preferences.marketingEmails}
                onChange={(e) => handleInputChange('preferences.marketingEmails', e.target.checked)}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label htmlFor="marketing-emails" className="ml-2 text-sm text-gray-700">
                Marketing emails and promotions
              </label>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Preferred Contact Method
              </label>
              <select
                value={profile.preferences.preferredContactMethod}
                onChange={(e) => handleInputChange('preferences.preferredContactMethod', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="email">Email</option>
                <option value="phone">Phone</option>
              </select>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-between items-center">
          <button
            onClick={handleReset}
            disabled={isSaving || !hasUnsavedChanges}
            className="flex items-center px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-gray-600"
            aria-label="Reset changes to last saved state"
          >
            <RotateCcw className="h-4 w-4 mr-2" />
            Reset Changes
          </button>

          <div className="flex space-x-3">
            <button
              onClick={handleSave}
              disabled={isSaving || !hasUnsavedChanges || !isOnline}
              className="flex items-center px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-blue-600"
              aria-label="Save profile changes"
            >
              <Save className="h-4 w-4 mr-2" />
              {isSaving ? 'Saving...' : !isOnline ? 'Offline' : 'Save Changes'}
            </button>
          </div>
        </div>

        {/* Success Message */}
        {saveSuccess && (
          <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-md">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-green-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-green-800">
                  Profile updated successfully!
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

// Wrapped component with error boundary
const ProfileSettingsWithErrorBoundary: React.FC = () => {
  return (
    <ProfileSettingsErrorBoundary>
      <ProfileSettings />
    </ProfileSettingsErrorBoundary>
  );
};

export default ProfileSettingsWithErrorBoundary;
