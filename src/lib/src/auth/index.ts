/**
 * Authentication Module
 * Centralized exports for all authentication-related functionality
 */

// Core authentication
export * from '../../auth-ratelimit'
export * from '../../permissions'
export * from '../../documentation-auth'

// Re-export commonly used items
export { default as rateLimit } from '../../ratelimit'
