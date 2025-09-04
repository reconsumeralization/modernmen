#!/usr/bin/env node

/**
 * Vercel Deployment Verification Script
 * Comprehensive deployment readiness checker for Modern Men Hair Salon
 */

const fs = require('fs')
const path = require('path')
const { execSync } = require('child_process')

class VercelDeploymentVerifier {
  constructor() {
    this.errors = []
    this.warnings = []
    this.successes = []
  }

  log(message, type = 'info') {
    const timestamp = new Date().toISOString()
    const prefix = type === 'error' ? '❌' :
                  type === 'warning' ? '⚠️' :
                  type === 'success' ? '✅' : 'ℹ️'

    console.log(`[${timestamp}] ${prefix} ${message}`)

    if (type === 'error') this.errors.push(message)
    if (type === 'warning') this.warnings.push(message)
    if (type === 'success') this.successes.push(message)
  }

  async checkFileExists(filePath, description) {
    try {
      if (fs.existsSync(filePath)) {
        this.log(`${description} found`, 'success')
        return true
      } else {
        this.log(`${description} missing: ${filePath}`, 'error')
        return false
      }
    } catch (error) {
      this.log(`Error checking ${description}: ${error.message}`, 'error')
      return false
    }
  }

  async checkEnvironmentVariables() {
    this.log('Checking environment variables...')

    const requiredEnvVars = [
      'PAYLOAD_SECRET',
      'DATABASE_URL',
      'NEXTAUTH_SECRET',
      'NEXTAUTH_URL'
    ]

    const envPath = path.join(process.cwd(), '.env.local')
    let envContent = ''

    try {
      envContent = fs.readFileSync(envPath, 'utf8')
    } catch (error) {
      this.log(`Cannot read .env.local file: ${error.message}`, 'warning')
      return
    }

    requiredEnvVars.forEach(envVar => {
      if (envContent.includes(`${envVar}=`)) {
        this.log(`Environment variable ${envVar} configured`, 'success')
      } else {
        this.log(`Environment variable ${envVar} not found`, 'error')
      }
    })
  }

  async checkDependencies() {
    this.log('Checking package dependencies...')

    try {
      const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'))

      const criticalDeps = [
        'next',
        '@payloadcms/db-postgres',
        'next-auth',
        '@supabase/supabase-js'
      ]

      criticalDeps.forEach(dep => {
        if (packageJson.dependencies && packageJson.dependencies[dep]) {
          this.log(`Critical dependency ${dep} found: ${packageJson.dependencies[dep]}`, 'success')
        } else {
          this.log(`Critical dependency ${dep} missing`, 'error')
        }
      })

    } catch (error) {
      this.log(`Error reading package.json: ${error.message}`, 'error')
    }
  }

  async checkBuildConfiguration() {
    this.log('Checking build configuration...')

    // Check Next.js config
    await this.checkFileExists('next.config.js', 'Next.js configuration')

    // Check Vercel config
    await this.checkFileExists('vercel.json', 'Vercel configuration')

    // Check Tailwind config
    await this.checkFileExists('tailwind.config.js', 'Tailwind CSS configuration')

    // Check TypeScript config
    await this.checkFileExists('tsconfig.json', 'TypeScript configuration')
  }

  async checkProjectStructure() {
    this.log('Checking project structure...')

    const requiredDirs = [
      'src/app',
      'src/components',
      'src/lib',
      'src/collections',
      'src/payload'
    ]

    const requiredFiles = [
      'src/app/layout.tsx',
      'src/app/page.tsx',
      'src/app/globals.css',
      'src/middleware.ts'
    ]

    requiredDirs.forEach(dir => {
      this.checkFileExists(dir, `Directory ${dir}`)
    })

    requiredFiles.forEach(file => {
      this.checkFileExists(file, `File ${file}`)
    })
  }

  async checkSectionStructure() {
    this.log('Checking section-specific structure...')

    // Public website
    await this.checkFileExists('src/app/page.tsx', 'Public homepage')
    await this.checkFileExists('src/components/sections/hero-section.tsx', 'Hero section component')

    // Customer portal
    await this.checkFileExists('src/app/portal/page.tsx', 'Customer portal dashboard')
    await this.checkFileExists('src/app/portal/login/page.tsx', 'Portal login page')

    // Admin dashboard
    await this.checkFileExists('src/app/admin/page.tsx', 'Admin dashboard')
    await this.checkFileExists('src/app/auth/signin/page.tsx', 'Authentication pages')

    // API routes
    await this.checkFileExists('src/app/api/healthcheck/route.ts', 'Health check API')
    await this.checkFileExists('src/app/api/auth/[...nextauth]/route.ts', 'NextAuth API')
  }

  async checkTypeScriptCompilation() {
    this.log('Checking TypeScript compilation...')

    try {
      execSync('npx tsc --noEmit', { stdio: 'pipe' })
      this.log('TypeScript compilation successful', 'success')
    } catch (error) {
      this.log(`TypeScript compilation failed: ${error.stdout.toString()}`, 'error')
    }
  }

  async checkBuildProcess() {
    this.log('Checking build process...')

    try {
      // Run build command
      execSync('npm run build', {
        stdio: 'pipe',
        timeout: 300000 // 5 minute timeout
      })
      this.log('Build process completed successfully', 'success')
    } catch (error) {
      this.log(`Build process failed: ${error.stdout.toString()}`, 'error')
    }
  }

  async checkSecurityConfiguration() {
    this.log('Checking security configuration...')

    // Check middleware
    await this.checkFileExists('src/middleware.ts', 'Next.js middleware')

    // Check for security-related files
    await this.checkFileExists('src/lib/auth.ts', 'Authentication utilities')
    await this.checkFileExists('src/lib/ratelimit.ts', 'Rate limiting utilities')
  }

  async checkDatabaseConfiguration() {
    this.log('Checking database configuration...')

    await this.checkFileExists('src/lib/supabase.ts', 'Supabase configuration')
    await this.checkFileExists('src/collections/Customers.ts', 'Customer collection schema')
    await this.checkFileExists('src/collections/Appointments.ts', 'Appointment collection schema')
  }

  async runVerification() {
    this.log('🚀 Starting Vercel Deployment Verification for Modern Men Hair Salon')
    this.log('=' .repeat(70))

    // Core configuration checks
    await this.checkBuildConfiguration()
    await this.checkProjectStructure()
    await this.checkEnvironmentVariables()
    await this.checkDependencies()

    // Section-specific checks
    await this.checkSectionStructure()
    await this.checkSecurityConfiguration()
    await this.checkDatabaseConfiguration()

    // Build and compilation checks
    await this.checkTypeScriptCompilation()
    await this.checkBuildProcess()

    // Summary
    this.log('=' .repeat(70))
    this.log(`VERIFICATION COMPLETE`)
    this.log(`✅ Successes: ${this.successes.length}`)
    this.log(`⚠️ Warnings: ${this.warnings.length}`)
    this.log(`❌ Errors: ${this.errors.length}`)

    if (this.errors.length > 0) {
      this.log('')
      this.log('❌ DEPLOYMENT BLOCKERS:')
      this.errors.forEach(error => console.log(`   - ${error}`))
    }

    if (this.warnings.length > 0) {
      this.log('')
      this.log('⚠️ DEPLOYMENT WARNINGS:')
      this.warnings.forEach(warning => console.log(`   - ${warning}`))
    }

    if (this.errors.length === 0) {
      this.log('')
      this.log('🎉 READY FOR VERCEL DEPLOYMENT!')
      this.log('All critical checks passed. You can safely deploy to Vercel.')
    }

    return {
      success: this.errors.length === 0,
      errors: this.errors,
      warnings: this.warnings,
      successes: this.successes
    }
  }
}

// Run verification if called directly
if (require.main === module) {
  const verifier = new VercelDeploymentVerifier()
  verifier.runVerification()
    .then(result => {
      process.exit(result.success ? 0 : 1)
    })
    .catch(error => {
      console.error('Verification failed:', error)
      process.exit(1)
    })
}

module.exports = VercelDeploymentVerifier
