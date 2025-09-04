#!/usr/bin/env node

/**
 * Environment Variables Validation Script
 * Validates required environment variables for deployment readiness
 * Run with: node scripts/validate-env-vars.js
 */

const fs = require('fs')
const path = require('path')

// Required environment variables by environment
const REQUIRED_VARS = {
  development: [
    'NODE_ENV',
    'NEXT_PUBLIC_APP_URL',
    'NEXTAUTH_URL',
    'NEXTAUTH_SECRET',
    'DATABASE_URL',
    'PAYLOAD_SECRET',
    'PAYLOAD_PUBLIC_SERVER_URL'
  ],
  production: [
    'NODE_ENV',
    'NEXT_PUBLIC_APP_URL',
    'NEXTAUTH_URL',
    'NEXTAUTH_SECRET',
    'DATABASE_URL',
    'PAYLOAD_SECRET',
    'PAYLOAD_PUBLIC_SERVER_URL',
    'SUPABASE_URL',
    'SUPABASE_ANON_KEY'
  ],
  test: [
    'NODE_ENV',
    'DATABASE_URL',
    'PAYLOAD_SECRET'
  ]
}

// Optional but recommended variables
const RECOMMENDED_VARS = [
  'SMTP_HOST',
  'SMTP_PORT',
  'SMTP_USER',
  'SMTP_PASS',
  'STRIPE_PUBLISHABLE_KEY',
  'STRIPE_SECRET_KEY',
  'REDIS_URL',
  'SENTRY_DSN',
  'VERCEL_ANALYTICS_ID'
]

// Environment-specific validations
const VALIDATIONS = {
  NEXTAUTH_SECRET: (value) => value.length >= 32 || 'NEXTAUTH_SECRET must be at least 32 characters',
  PAYLOAD_SECRET: (value) => value.length >= 32 || 'PAYLOAD_SECRET must be at least 32 characters',
  DATABASE_URL: (value) => value.startsWith('postgresql://') || 'DATABASE_URL must be a valid PostgreSQL connection string',
  NEXT_PUBLIC_APP_URL: (value) => {
    try {
      new URL(value)
      return true
    } catch {
      return 'NEXT_PUBLIC_APP_URL must be a valid URL'
    }
  },
  NEXTAUTH_URL: (value) => {
    try {
      new URL(value)
      return true
    } catch {
      return 'NEXTAUTH_URL must be a valid URL'
    }
  }
}

function loadEnvFile() {
  const envPath = path.join(process.cwd(), '.env.local')
  const envExamplePath = path.join(process.cwd(), '.env.local.template')

  if (fs.existsSync(envPath)) {
    return require('dotenv').config({ path: envPath })
  } else if (fs.existsSync(envExamplePath)) {
    console.warn('⚠️  Using .env.local.template - copy to .env.local for production')
    return require('dotenv').config({ path: envExamplePath })
  } else {
    console.error('❌ No environment file found (.env.local or .env.local.template)')
    return { error: true }
  }
}

function validateEnvironment() {
  console.log('🔍 Validating Environment Variables...\n')

  // Load environment variables
  const result = loadEnvFile()
  if (result.error) {
    process.exit(1)
  }

  const env = process.env.NODE_ENV || 'development'
  const requiredVars = REQUIRED_VARS[env] || REQUIRED_VARS.development

  let errors = []
  let warnings = []

  // Check required variables
  console.log(`📋 Checking required variables for ${env} environment:`)
  requiredVars.forEach(varName => {
    const value = process.env[varName]

    if (!value || value.trim() === '') {
      errors.push(`❌ ${varName} is required but not set`)
    } else {
      console.log(`✅ ${varName}`)

      // Run specific validations
      if (VALIDATIONS[varName]) {
        const validation = VALIDATIONS[varName](value)
        if (validation !== true) {
          errors.push(`❌ ${validation}`)
        }
      }
    }
  })

  console.log('\n📋 Checking recommended variables:')
  RECOMMENDED_VARS.forEach(varName => {
    const value = process.env[varName]

    if (!value || value.trim() === '') {
      warnings.push(`⚠️  ${varName} is recommended but not set`)
    } else {
      console.log(`✅ ${varName}`)
    }
  })

  // Check for security issues
  console.log('\n🔒 Checking for security issues:')

  // Check if secrets contain placeholder values
  const secretVars = ['NEXTAUTH_SECRET', 'PAYLOAD_SECRET', 'STRIPE_SECRET_KEY', 'SUPABASE_SERVICE_ROLE_KEY']
  secretVars.forEach(varName => {
    const value = process.env[varName]
    if (value && (value.includes('your-') || value.includes('here') || value.length < 32)) {
      errors.push(`❌ ${varName} appears to contain placeholder or insecure value`)
    }
  })

  // Summary
  console.log('\n' + '='.repeat(50))
  console.log('📊 VALIDATION SUMMARY')
  console.log('='.repeat(50))

  if (errors.length > 0) {
    console.log(`❌ ${errors.length} ERRORS FOUND:`)
    errors.forEach(error => console.log(`   ${error}`))
    console.log('\n🚫 Environment validation FAILED')
    process.exit(1)
  } else {
    console.log('✅ All required variables are properly configured')
  }

  if (warnings.length > 0) {
    console.log(`\n⚠️  ${warnings.length} WARNINGS:`)
    warnings.forEach(warning => console.log(`   ${warning}`))
    console.log('\n⚠️  Consider setting the recommended variables for full functionality')
  }

  console.log('\n🎉 Environment validation PASSED')
  return true
}

// Run validation if called directly
if (require.main === module) {
  validateEnvironment()
}

module.exports = { validateEnvironment }
