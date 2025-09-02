/**
 * Environment Variables Validation for Vercel Deployment
 * Ensures all required environment variables are present and valid
 */

interface EnvConfig {
  // Database
  NEXT_PUBLIC_SUPABASE_URL: string
  NEXT_PUBLIC_SUPABASE_ANON_KEY: string
  NEXT_PUBLIC_ModernMen_URL?: string

  // Payment
  STRIPE_PUBLIC_KEY: string

  // Email
  SENDGRID_API_KEY: string

  // SMS
  TWILIO_ACCOUNT_SID: string
  TWILIO_AUTH_TOKEN: string
  TWILIO_PHONE_NUMBER: string

  // App Configuration
  NEXT_PUBLIC_APP_URL: string
  NEXT_PUBLIC_NODE_ENV: string
}

function validateEnv(): EnvConfig {
  const requiredEnvVars = [
    'NEXT_PUBLIC_SUPABASE_URL',
    'NEXT_PUBLIC_SUPABASE_ANON_KEY',
    'STRIPE_PUBLIC_KEY',
    'SENDGRID_API_KEY',
    'TWILIO_ACCOUNT_SID',
    'TWILIO_AUTH_TOKEN',
    'TWILIO_PHONE_NUMBER',
  ]

  const missingVars = requiredEnvVars.filter(varName => !process.env[varName])

  if (missingVars.length > 0) {
    throw new Error(
      `Missing required environment variables: ${missingVars.join(', ')}\n` +
      'Please check your Vercel project settings or .env.local file.'
    )
  }

  // Validate URL formats
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
  if (!supabaseUrl.startsWith('https://') || !supabaseUrl.includes('.supabase.co')) {
    throw new Error('NEXT_PUBLIC_SUPABASE_URL must be a valid Supabase URL')
  }

  // Validate Stripe key format
  const stripeKey = process.env.STRIPE_PUBLIC_KEY!
  if (!stripeKey.startsWith('pk_')) {
    throw new Error('STRIPE_PUBLIC_KEY must be a valid Stripe publishable key')
  }

  return {
    NEXT_PUBLIC_SUPABASE_URL: supabaseUrl,
    NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    NEXT_PUBLIC_ModernMen_URL: process.env.NEXT_PUBLIC_ModernMen_URL,
    STRIPE_PUBLIC_KEY: stripeKey,
    SENDGRID_API_KEY: process.env.SENDGRID_API_KEY!,
    TWILIO_ACCOUNT_SID: process.env.TWILIO_ACCOUNT_SID!,
    TWILIO_AUTH_TOKEN: process.env.TWILIO_AUTH_TOKEN!,
    TWILIO_PHONE_NUMBER: process.env.TWILIO_PHONE_NUMBER!,
    NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL || 'https://modernmen.com',
    NEXT_PUBLIC_NODE_ENV: process.env.NODE_ENV || 'production',
  }
}

// Export validated environment configuration
export const env = validateEnv()

// Export for build-time validation
export function validateEnvironmentForBuild() {
  try {
    validateEnv()
    console.log('✅ Environment variables validation passed')
    return true
  } catch (error) {
    console.error('❌ Environment variables validation failed:', error)
    // In production build, throw error to prevent deployment
    if (process.env.NODE_ENV === 'production') {
      throw error
    }
    return false
  }
}

// Development helper to check environment
export function logEnvironmentStatus() {
  const config = validateEnv()

  console.log('\n🔧 Environment Configuration Status:')
  console.log('=====================================')
  console.log(`✅ Supabase URL: ${config.NEXT_PUBLIC_SUPABASE_URL}`)
  console.log(`✅ Supabase Key: ${config.NEXT_PUBLIC_SUPABASE_ANON_KEY.substring(0, 10)}...`)
  console.log(`✅ Stripe Key: ${config.STRIPE_PUBLIC_KEY.substring(0, 10)}...`)
  console.log(`✅ SendGrid: Configured`)
  console.log(`✅ Twilio: Configured`)
  console.log(`✅ App URL: ${config.NEXT_PUBLIC_APP_URL}`)
  console.log(`✅ Environment: ${config.NEXT_PUBLIC_NODE_ENV}`)
  console.log('=====================================\n')
}