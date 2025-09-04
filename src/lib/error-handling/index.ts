/**
 * Comprehensive Error Handling System for Modern Men Hair Salon
 *
 * This module provides a complete error handling solution including:
 * - Error boundaries with retry functionality
 * - Safe array and object access utilities
 * - Enhanced API error handling
 * - Error monitoring and logging
 * - Form validation utilities
 *
 * Usage:
 * ```typescript
 * import { ErrorBoundary, safeGet, APIErrorFactory, errorMonitor } from '@/lib/error-handling'
 * ```
 */

// Export error boundary components
export { ErrorBoundary, ErrorBoundary as default } from '../components/error/ErrorBoundary'
export type { AppError, ErrorInfo } from '../components/error/ErrorBoundary'

// Export safe access utilities
export {
  safeArrayAccess,
  safeObjectAccess,
  safeGet,
  safeProp,
  safeForEach,
  safeMap,
  safeFilter,
  safeFind,
  safeSlice,
  isValidIndex,
  safeLength,
  safeIsEmpty,
  SafeArray,
  SafeObject,
  safeUtils,
  type SafeAccessResult,
  type SafeArrayResult
} from '../safe-access'

// Export enhanced API error handling
export {
  EnhancedAPIError,
  ErrorCode,
  APIErrorFactory,
  EnhancedErrorHandler,
  withEnhancedErrorHandler,
  createEnhancedSuccessResponse,
  ValidationHelpers,
  type APIErrorDetails,
  type APIError
} from '../enhanced-api-errors'

// Export error monitoring system
export {
  errorMonitor,
  useErrorMonitoring,
  setupGlobalErrorHandling,
  ErrorUtils,
  ErrorSeverity,
  ErrorCategory,
  type MonitoredError,
  type ErrorContext,
  type ErrorBreadcrumb,
  type ErrorPattern
} from '../error-monitoring'

// Export form validation utilities
export {
  ValidationSchemas,
  validateWithMonitoring,
  SafeFormHandler,
  ArrayValidators,
  ObjectValidators,
  Sanitizers,
  ValidationPatterns,
  type ValidationResult,
  type ValidationError
} from '../form-validation'

// Common error handling hooks and utilities
export { useErrorBoundary } from '../components/error/ErrorBoundary'

// Quick setup function for applications
export function setupErrorHandling() {
  // Setup global error monitoring
  setupGlobalErrorHandling()

  // Log setup completion
  console.log('🚨 Error handling system initialized')
  console.log('✅ Error boundary: Active')
  console.log('✅ Safe access utilities: Ready')
  console.log('✅ Enhanced API errors: Enabled')
  console.log('✅ Error monitoring: Active')
  console.log('✅ Form validation: Ready')
}

// Error handling presets for common use cases
export const ErrorHandlingPresets = {
  // API route error handling
  apiRoute: {
    withErrorHandler: withEnhancedErrorHandler,
    createSuccess: createEnhancedSuccessResponse,
    createError: APIErrorFactory
  },

  // Component error boundary
  component: {
    ErrorBoundary,
    useErrorBoundary
  },

  // Data access safety
  dataAccess: {
    safeGet,
    safeProp,
    safeMap,
    safeFilter,
    SafeArray,
    SafeObject
  },

  // Form handling
  forms: {
    validate: validateWithMonitoring,
    SafeFormHandler,
    ValidationSchemas
  },

  // Error monitoring
  monitoring: {
    monitor: errorMonitor,
    useMonitor: useErrorMonitoring
  }
}

export default {
  setupErrorHandling,
  ErrorHandlingPresets,
  ErrorBoundary,
  safeGet,
  safeProp,
  errorMonitor,
  APIErrorFactory,
  ValidationSchemas
}
