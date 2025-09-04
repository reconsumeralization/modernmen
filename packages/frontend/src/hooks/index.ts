// 🎯 Modern Men Hair BarberShop - Hook Library
// Hooks for the 11 actual collections in your payload config

// Authentication & User Management
export { useAuth } from './useAuth';
export type { User, AuthState } from './useAuth';

// Core Collections (Your Actual Payload Config)
export { useUsers } from './useUsers';
export type { User as AdminUser, CreateUserData } from './useUsers';

export { useTenants } from './useTenants';
export type { Tenant, CreateTenantData } from './useTenants';

export { useMedia } from './useMedia';
export type { Media, UploadMediaData } from './useMedia';

export { useSettings } from './useSettings';
export type { Setting, CreateSettingData } from './useSettings';

// Simple versions (for basic operations)
export { useCustomers as useCustomersSimple } from './useCustomersSimple';
export type { Customer as SimpleCustomer, CreateCustomerData } from './useCustomersSimple';

export { useServices as useServicesSimple } from './useServicesSimple';
export type { Service, CreateServiceData } from './useServicesSimple';

export { useStaff } from './useStaff';
export type { Staff, CreateStaffData } from './useStaff';

export { useAppointments } from './useAppointments';
export type { Appointment, CreateAppointmentData } from './useAppointments';

export { useProducts } from './useProducts';
export type { Product, CreateProductData } from './useProducts';

export { useLocations } from './useLocations';
export type { Location, CreateLocationData } from './useLocations';

export { usePages } from './usePages';
export type { Page, CreatePageData } from './usePages';

// Essential Utility Hooks
export { useRealtime } from './useRealtime';
export type { RealtimeEvent, Notification } from './useRealtime';

export { useForm } from './useForm';
export type { FormState, FormActions, UseFormOptions } from './useForm';
export { validators } from './useForm';

export { useApi } from './useApi';
export type { ApiState, ApiActions, UseApiOptions } from './useApi';

export { useTheme, useAdvancedTheme } from './useTheme';
export type { Theme, ThemeState } from './useTheme';

export { useLocalStorage, usePersistedState } from './useLocalStorage';

// Additional Business Logic Hooks
export { useBlogPosts } from './useBlogPosts'
export { useCommissions } from './useCommissions'
export { useContent } from './useContent'
export { useCoupons } from './useCoupons'
export { useCustomers } from './useCustomers' // Full version
export { useDocumentation } from './useDocumentation'
export { useDocumentationTemplates } from './useDocumentationTemplates'
export { useDocumentationWorkflows } from './useDocumentationWorkflows'
export { useFAQ } from './useFAQ'
export { useGallery } from './useGallery'
export { useInventory } from './useInventory'
export { useLoyaltyPrograms } from './useLoyaltyPrograms'
export { useNotifications } from './useNotifications'
export { useOrders } from './useOrders'
export { useSales } from './useSales'
export { useServicePackages } from './useServicePackages'
export { useServices } from './useServices' // Full version
export { useStylists } from './useStylists'
export { useTestimonials } from './useTestimonials'
export { useWaitList } from './useWaitList'

// Legacy hooks (for compatibility)
export { usePayloadIntegration } from './usePayloadIntegration'
export { useMonitoring } from './useMonitoring'
// useLocalStorageOriginal removed - use useLocalStorage instead
export { useDebounce } from './use-debounce'
export { useMediaQuery } from './use-media-query'
