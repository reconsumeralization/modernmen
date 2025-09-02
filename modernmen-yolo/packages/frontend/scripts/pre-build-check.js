#!/usr/bin/env node

/**
 * Pre-Build Validation Script for Vercel Deployment
 * Ensures all deployment requirements are met before build
 */

const fs = require('fs')
const path = require('path')

console.log('🔍 Running Pre-Build Validation Checks...\n')

let hasErrors = false
const errors = []
const warnings = []

// Check 1: Environment Variables
function checkEnvironmentVariables() {
  console.log('📋 Checking Environment Variables...')

  const requiredVars = [
    'NEXT_PUBLIC_SUPABASE_URL',
    'NEXT_PUBLIC_SUPABASE_ANON_KEY',
    'STRIPE_PUBLIC_KEY',
    'SENDGRID_API_KEY',
    'TWILIO_ACCOUNT_SID',
    'TWILIO_AUTH_TOKEN',
    'TWILIO_PHONE_NUMBER',
  ]

  const missingVars = requiredVars.filter(varName => !process.env[varName])

  if (missingVars.length > 0) {
    hasErrors = true
    errors.push(`Missing required environment variables: ${missingVars.join(', ')}`)
  } else {
    console.log('✅ All required environment variables are present')
  }

  // Validate URL formats
  if (process.env.NEXT_PUBLIC_SUPABASE_URL) {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    if (!supabaseUrl.startsWith('https://') || !supabaseUrl.includes('.supabase.co')) {
      hasErrors = true
      errors.push('NEXT_PUBLIC_SUPABASE_URL must be a valid Supabase URL')
    }
  }

  // Validate Stripe key format
  if (process.env.STRIPE_PUBLIC_KEY && !process.env.STRIPE_PUBLIC_KEY.startsWith('pk_')) {
    hasErrors = true
    errors.push('STRIPE_PUBLIC_KEY must be a valid Stripe publishable key')
  }
}

// Check 2: Required Files
function checkRequiredFiles() {
  console.log('📁 Checking Required Files...')

  const requiredFiles = [
    'src/app/layout.tsx',
    'src/app/page.tsx',
    'src/app/globals.css',
    'next.config.js',
    'tailwind.config.js',
    'package.json',
    'public/manifest.json',
  ]

  const missingFiles = requiredFiles.filter(file => {
    return !fs.existsSync(path.join(process.cwd(), file))
  })

  if (missingFiles.length > 0) {
    hasErrors = true
    errors.push(`Missing required files: ${missingFiles.join(', ')}`)
  } else {
    console.log('✅ All required files are present')
  }
}

// Check 3: Dependencies
function checkDependencies() {
  console.log('📦 Checking Dependencies...')

  try {
    const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'))

    const criticalDeps = [
      'next',
      'react',
      'react-dom',
      '@supabase/supabase-js',
      'tailwindcss',
    ]

    const missingDeps = criticalDeps.filter(dep => {
      return !packageJson.dependencies?.[dep] && !packageJson.devDependencies?.[dep]
    })

    if (missingDeps.length > 0) {
      hasErrors = true
      errors.push(`Missing critical dependencies: ${missingDeps.join(', ')}`)
    } else {
      console.log('✅ All critical dependencies are present')
    }
  } catch (error) {
    hasErrors = true
    errors.push('Failed to parse package.json')
  }
}

// Check 4: Configuration Files
function checkConfigurationFiles() {
  console.log('⚙️ Checking Configuration Files...')

  // Check Next.js config
  try {
    const nextConfig = require('../next.config.js')
    if (!nextConfig) {
      hasErrors = true
      errors.push('next.config.js is invalid or missing')
    } else {
      console.log('✅ Next.js configuration is valid')
    }
  } catch (error) {
    hasErrors = true
    errors.push('Failed to load next.config.js')
  }

  // Check Tailwind config
  try {
    const tailwindConfig = require('../tailwind.config.js')
    if (!tailwindConfig) {
      hasErrors = true
      errors.push('tailwind.config.js is invalid or missing')
    } else {
      console.log('✅ Tailwind configuration is valid')
    }
  } catch (error) {
    hasErrors = true
    errors.push('Failed to load tailwind.config.js')
  }
}

// Check 5: Build Output Directory
function checkBuildOutput() {
  console.log('🏗️ Checking Build Output Directory...')

  const buildDirs = ['dist', '.next', 'out']

  const existingDirs = buildDirs.filter(dir => {
    return fs.existsSync(path.join(process.cwd(), dir))
  })

  if (existingDirs.length > 0) {
    warnings.push(`Build output directories found: ${existingDirs.join(', ')}. Consider cleaning before deployment.`)
  }
}

// Check 6: PWA Configuration
function checkPWAConfiguration() {
  console.log('📱 Checking PWA Configuration...')

  const manifestPath = 'public/manifest.json'
  if (fs.existsSync(manifestPath)) {
    try {
      const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'))

      const requiredFields = ['name', 'short_name', 'start_url', 'display', 'icons']
      const missingFields = requiredFields.filter(field => !manifest[field])

      if (missingFields.length > 0) {
        warnings.push(`PWA manifest missing fields: ${missingFields.join(', ')}`)
      } else {
        console.log('✅ PWA manifest is properly configured')
      }
    } catch (error) {
      warnings.push('Failed to parse PWA manifest.json')
    }
  } else {
    warnings.push('PWA manifest.json not found')
  }
}

// Check 7: Vercel Configuration
function checkVercelConfiguration() {
  console.log('▲ Checking Vercel Configuration...')

  const vercelConfigPath = '../../vercel.json'
  if (fs.existsSync(vercelConfigPath)) {
    try {
      const vercelConfig = JSON.parse(fs.readFileSync(vercelConfigPath, 'utf8'))
      console.log('✅ Vercel configuration found')
    } catch (error) {
      warnings.push('Failed to parse vercel.json')
    }
  } else {
    warnings.push('vercel.json not found in project root')
  }
}

// Run all checks
function runChecks() {
  checkEnvironmentVariables()
  checkRequiredFiles()
  checkDependencies()
  checkConfigurationFiles()
  checkBuildOutput()
  checkPWAConfiguration()
  checkVercelConfiguration()

  // Summary
  console.log('\n📊 Pre-Build Validation Summary:')
  console.log('=================================')

  if (errors.length > 0) {
    console.log('❌ Errors found:')
    errors.forEach(error => console.log(`  - ${error}`))
  }

  if (warnings.length > 0) {
    console.log('⚠️ Warnings:')
    warnings.forEach(warning => console.log(`  - ${warning}`))
  }

  if (errors.length === 0 && warnings.length === 0) {
    console.log('✅ All checks passed! Ready for deployment.')
    process.exit(0)
  } else if (errors.length > 0) {
    console.log('❌ Build validation failed. Please fix the errors before deploying.')
    process.exit(1)
  } else {
    console.log('⚠️ Build validation completed with warnings. Deployment may proceed but consider addressing warnings.')
    process.exit(0)
  }
}

// Execute checks
runChecks()
