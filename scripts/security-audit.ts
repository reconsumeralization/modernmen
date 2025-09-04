#!/usr/bin/env tsx

/**
 * Security Audit Script for Modern Men Hair BarberShop
 * Performs comprehensive security checks on the application
 */

import { readFileSync, readdirSync, statSync } from 'fs'
import { join, extname } from 'path'
import { execSync } from 'child_process'

interface SecurityCheck {
  name: string
  description: string
  severity: 'Critical' | 'High' | 'Medium' | 'Low'
  check: () => Promise<SecurityResult>
}

interface SecurityResult {
  passed: boolean
  message: string
  details?: string[]
  recommendations?: string[]
}

class SecurityAuditor {
  private results: SecurityResult[] = []
  private checks: SecurityCheck[] = []

  constructor() {
    this.initializeChecks()
  }

  private initializeChecks() {
    this.checks = [
      {
        name: 'Package Security',
        description: 'Check for vulnerable dependencies',
        severity: 'High',
        check: this.checkPackageSecurity.bind(this)
      },
      {
        name: 'Middleware Security',
        description: 'Verify middleware security implementations',
        severity: 'Critical',
        check: this.checkMiddlewareSecurity.bind(this)
      },
      {
        name: 'Environment Variables',
        description: 'Check for sensitive data in environment files',
        severity: 'High',
        check: this.checkEnvironmentSecurity.bind(this)
      },
      {
        name: 'Authentication Security',
        description: 'Verify authentication and authorization',
        severity: 'Critical',
        check: this.checkAuthenticationSecurity.bind(this)
      },
      {
        name: 'API Security',
        description: 'Check API endpoint security',
        severity: 'High',
        check: this.checkAPISecurity.bind(this)
      },
      {
        name: 'File Upload Security',
        description: 'Verify file upload security measures',
        severity: 'Medium',
        check: this.checkFileUploadSecurity.bind(this)
      },
      {
        name: 'Database Security',
        description: 'Check database configuration security',
        severity: 'High',
        check: this.checkDatabaseSecurity.bind(this)
      },
      {
        name: 'Development Security',
        description: 'Verify development environment security',
        severity: 'Low',
        check: this.checkDevelopmentSecurity.bind(this)
      }
    ]
  }

  async runAudit(): Promise<void> {
    console.log('🔒 Starting Security Audit for Modern Men Hair BarberShop')
    console.log('=' .repeat(60))

    for (const check of this.checks) {
      console.log(`\n🔍 Running: ${check.name}`)
      console.log(`   ${check.description}`)

      try {
        const result = await check.check()
        this.results.push(result)

        const status = result.passed ? '✅ PASSED' : '❌ FAILED'
        console.log(`   ${status}: ${result.message}`)

        if (result.details && result.details.length > 0) {
          result.details.forEach(detail => console.log(`     • ${detail}`))
        }

        if (!result.passed && result.recommendations && result.recommendations.length > 0) {
          console.log('   📋 Recommendations:')
          result.recommendations.forEach(rec => console.log(`     • ${rec}`))
        }

      } catch (error) {
        console.error(`   ❌ ERROR: ${error.message}`)
        this.results.push({
          passed: false,
          message: `Check failed with error: ${error.message}`,
          recommendations: ['Review error logs and fix the issue']
        })
      }
    }

    this.printSummary()
  }

  private async checkPackageSecurity(): Promise<SecurityResult> {
    try {
      // Run npm audit
      const auditOutput = execSync('npm audit --json', { encoding: 'utf8' })
      const auditData = JSON.parse(auditOutput)

      const vulnerabilities = auditData.metadata?.vulnerabilities || {}
      const totalVulns = Object.values(vulnerabilities).reduce((sum: number, count: any) => sum + count, 0)

      if (totalVulns > 0) {
        const details = Object.entries(vulnerabilities)
          .filter(([_, count]) => (count as number) > 0)
          .map(([level, count]) => `${count} ${level} severity vulnerabilities`)

        return {
          passed: false,
          message: `Found ${totalVulns} security vulnerabilities in dependencies`,
          details,
          recommendations: [
            'Run npm audit fix to fix automatically resolvable vulnerabilities',
            'Update dependencies to latest secure versions',
            'Review and fix remaining vulnerabilities manually',
            'Consider using npm audit --audit-level=high to focus on high-severity issues'
          ]
        }
      }

      return {
        passed: true,
        message: 'No security vulnerabilities found in dependencies'
      }

    } catch (error) {
      return {
        passed: false,
        message: 'Failed to run package security audit',
        recommendations: ['Ensure npm is installed and accessible', 'Run npm audit manually']
      }
    }
  }

  private async checkMiddlewareSecurity(): Promise<SecurityResult> {
    const middlewarePath = 'src/middleware.ts'

    try {
      const middlewareContent = readFileSync(middlewarePath, 'utf8')
      const issues: string[] = []
      const recommendations: string[] = []

      // Check for critical security features
      if (!middlewareContent.includes('X-XSS-Protection')) {
        issues.push('Missing XSS protection header')
      }
      if (!middlewareContent.includes('X-Frame-Options')) {
        issues.push('Missing clickjacking protection')
      }
      if (!middlewareContent.includes('X-Content-Type-Options')) {
        issues.push('Missing MIME sniffing protection')
      }
      if (!middlewareContent.includes('getToken')) {
        issues.push('Missing JWT token validation')
      }
      if (!middlewareContent.includes('CSRF') && !middlewareContent.includes('Origin')) {
        issues.push('Missing CSRF protection')
      }

      // Check for security best practices
      if (!middlewareContent.includes('rateLimit') && !middlewareContent.includes('RateLimit')) {
        issues.push('Missing rate limiting implementation')
      }
      if (!middlewareContent.includes('suspicious') || !middlewareContent.includes('pattern')) {
        issues.push('Missing suspicious pattern detection')
      }

      if (issues.length > 0) {
        recommendations.push('Implement comprehensive security headers')
        recommendations.push('Add JWT token validation for protected routes')
        recommendations.push('Implement CSRF protection')
        recommendations.push('Add rate limiting for API endpoints')
        recommendations.push('Implement suspicious request pattern detection')
      }

      return {
        passed: issues.length === 0,
        message: issues.length === 0 ? 'Middleware security implementation is comprehensive' : `Found ${issues.length} middleware security issues`,
        details: issues,
        recommendations
      }

    } catch (error) {
      return {
        passed: false,
        message: 'Could not read middleware file',
        recommendations: ['Ensure middleware.ts exists in src/ directory']
      }
    }
  }

  private async checkEnvironmentSecurity(): Promise<SecurityResult> {
    const issues: string[] = []
    const recommendations: string[] = []

    // Check for environment files
    const envFiles = ['.env', '.env.local', '.env.production', '.env.example']
    const existingEnvFiles: string[] = []

    for (const file of envFiles) {
      try {
        statSync(file)
        existingEnvFiles.push(file)
      } catch {
        // File doesn't exist
      }
    }

    for (const file of existingEnvFiles) {
      try {
        const content = readFileSync(file, 'utf8')

        // Check for sensitive data patterns
        if (content.includes('password') && !content.includes('PASSWORD=') && !file.includes('.example')) {
          issues.push(`Potential sensitive data in ${file} (password-related)`)
        }
        if (content.includes('secret') && !content.includes('SECRET=') && !file.includes('.example')) {
          issues.push(`Potential sensitive data in ${file} (secret-related)`)
        }
        if (content.includes('key') && !content.includes('KEY=') && !file.includes('.example')) {
          issues.push(`Potential sensitive data in ${file} (key-related)`)
        }

      } catch (error) {
        issues.push(`Could not read ${file}`)
      }
    }

    if (existingEnvFiles.length === 0) {
      issues.push('No environment files found')
      recommendations.push('Create .env.local file with required environment variables')
    }

    if (issues.length > 0) {
      recommendations.push('Use proper environment variable naming (e.g., NEXTAUTH_SECRET)')
      recommendations.push('Never commit sensitive environment files to version control')
      recommendations.push('Use .env.example for documentation of required variables')
    }

    return {
      passed: issues.length === 0,
      message: issues.length === 0 ? 'Environment configuration is secure' : `Found ${issues.length} environment security issues`,
      details: issues,
      recommendations
    }
  }

  private async checkAuthenticationSecurity(): Promise<SecurityResult> {
    const issues: string[] = []
    const recommendations: string[] = []

    // Check for authentication configuration
    try {
      const authConfig = readFileSync('src/lib/auth.ts', 'utf8')

      if (!authConfig.includes('NextAuth')) {
        issues.push('NextAuth configuration not found')
      }
      if (!authConfig.includes('secret')) {
        issues.push('Missing authentication secret')
      }
      if (!authConfig.includes('session')) {
        issues.push('Session configuration not found')
      }

    } catch {
      issues.push('Authentication configuration file not found')
    }

    // Check middleware for auth protection
    try {
      const middleware = readFileSync('src/middleware.ts', 'utf8')

      if (!middleware.includes('protectedPaths')) {
        issues.push('No protected paths defined in middleware')
      }
      if (!middleware.includes('getToken')) {
        issues.push('JWT token validation not implemented')
      }

    } catch {
      issues.push('Middleware file not found')
    }

    if (issues.length > 0) {
      recommendations.push('Implement NextAuth.js with proper configuration')
      recommendations.push('Define protected routes in middleware')
      recommendations.push('Implement JWT token validation')
      recommendations.push('Use secure session configuration')
    }

    return {
      passed: issues.length === 0,
      message: issues.length === 0 ? 'Authentication security is properly implemented' : `Found ${issues.length} authentication security issues`,
      details: issues,
      recommendations
    }
  }

  private async checkAPISecurity(): Promise<SecurityResult> {
    const issues: string[] = []
    const recommendations: string[] = []

    try {
      const apiDir = 'src/app/api'
      const apiFiles = this.getAllFiles(apiDir)

      if (apiFiles.length === 0) {
        return {
          passed: false,
          message: 'No API routes found',
          recommendations: ['Create API routes in src/app/api/ directory']
        }
      }

      for (const file of apiFiles) {
        if (file.endsWith('route.ts') || file.endsWith('route.js')) {
          const content = readFileSync(file, 'utf8')

          // Check for basic security measures
          if (!content.includes('try') || !content.includes('catch')) {
            issues.push(`${file}: Missing error handling`)
          }
          if (!content.includes('auth') && !content.includes('token') && !file.includes('/auth/')) {
            issues.push(`${file}: Missing authentication check`)
          }
        }
      }

    } catch (error) {
      issues.push('Could not scan API directory')
    }

    if (issues.length > 0) {
      recommendations.push('Add proper error handling to all API routes')
      recommendations.push('Implement authentication checks for protected endpoints')
      recommendations.push('Validate input data in API routes')
      recommendations.push('Implement rate limiting for API endpoints')
    }

    return {
      passed: issues.length === 0,
      message: issues.length === 0 ? 'API security is properly implemented' : `Found ${issues.length} API security issues`,
      details: issues,
      recommendations
    }
  }

  private async checkFileUploadSecurity(): Promise<SecurityResult> {
    const issues: string[] = []
    const recommendations: string[] = []

    // Check for file upload handling
    const uploadFiles = this.findFilesWithPattern('upload', ['.ts', '.tsx', '.js', '.jsx'])

    if (uploadFiles.length === 0) {
      return {
        passed: true,
        message: 'No file upload functionality detected - no security issues'
      }
    }

    for (const file of uploadFiles) {
      const content = readFileSync(file, 'utf8')

      if (!content.includes('size') || !content.includes('limit')) {
        issues.push(`${file}: Missing file size validation`)
      }
      if (!content.includes('type') || !content.includes('mimetype')) {
        issues.push(`${file}: Missing file type validation`)
      }
      if (!content.includes('virus') && !content.includes('scan')) {
        issues.push(`${file}: No virus scanning detected`)
      }
    }

    if (issues.length > 0) {
      recommendations.push('Implement file size limits')
      recommendations.push('Validate file types and MIME types')
      recommendations.push('Consider implementing virus scanning')
      recommendations.push('Use secure file storage with proper access controls')
    }

    return {
      passed: issues.length === 0,
      message: issues.length === 0 ? 'File upload security is properly implemented' : `Found ${issues.length} file upload security issues`,
      details: issues,
      recommendations
    }
  }

  private async checkDatabaseSecurity(): Promise<SecurityResult> {
    const issues: string[] = []
    const recommendations: string[] = []

    // Check for database configuration
    const configFiles = ['src/payload/payload.config.ts', 'src/lib/db.ts', 'src/lib/database.ts']

    let configFound = false
    for (const file of configFiles) {
      try {
        const content = readFileSync(file, 'utf8')
        configFound = true

        // Check for security issues
        if (content.includes('password') && content.includes('123456')) {
          issues.push(`${file}: Weak or default password detected`)
        }
        if (content.includes('localhost') && !content.includes('production')) {
          issues.push(`${file}: Database configured for localhost in production code`)
        }

        break
      } catch {
        // File doesn't exist
      }
    }

    if (!configFound) {
      issues.push('No database configuration found')
      recommendations.push('Create proper database configuration file')
    }

    if (issues.length > 0) {
      recommendations.push('Use strong, unique passwords for database connections')
      recommendations.push('Use environment variables for database credentials')
      recommendations.push('Implement connection pooling for better performance')
      recommendations.push('Enable database query logging for debugging')
    }

    return {
      passed: issues.length === 0,
      message: issues.length === 0 ? 'Database security is properly configured' : `Found ${issues.length} database security issues`,
      details: issues,
      recommendations
    }
  }

  private async checkDevelopmentSecurity(): Promise<SecurityResult> {
    const issues: string[] = []
    const recommendations: string[] = []

    // Check for development-specific security issues
    try {
      const nextConfig = readFileSync('next.config.js', 'utf8')

      if (!nextConfig.includes('NODE_ENV') && !nextConfig.includes('development')) {
        issues.push('Development-specific configuration not detected')
      }

    } catch {
      issues.push('Next.js configuration file not found')
    }

    // Check for debug logging in production
    const sourceFiles = this.getAllFiles('src')
    for (const file of sourceFiles) {
      if (file.endsWith('.ts') || file.endsWith('.tsx')) {
        const content = readFileSync(file, 'utf8')

        if (content.includes('console.log') && content.includes('password')) {
          issues.push(`${file}: Debug logging with sensitive data detected`)
        }
        if (content.includes('console.log') && content.includes('token')) {
          issues.push(`${file}: Debug logging with token data detected`)
        }
      }
    }

    if (issues.length > 0) {
      recommendations.push('Remove debug logging with sensitive information')
      recommendations.push('Use proper logging levels (error, warn, info)')
      recommendations.push('Implement development-specific error handling')
      recommendations.push('Use environment-specific configuration')
    }

    return {
      passed: issues.length === 0,
      message: issues.length === 0 ? 'Development security practices are followed' : `Found ${issues.length} development security issues`,
      details: issues,
      recommendations
    }
  }

  private getAllFiles(dirPath: string): string[] {
    const files: string[] = []

    try {
      const items = readdirSync(dirPath)

      for (const item of items) {
        const fullPath = join(dirPath, item)
        const stat = statSync(fullPath)

        if (stat.isDirectory()) {
          files.push(...this.getAllFiles(fullPath))
        } else {
          files.push(fullPath)
        }
      }
    } catch {
      // Directory doesn't exist
    }

    return files
  }

  private findFilesWithPattern(pattern: string, extensions: string[]): string[] {
    const files = this.getAllFiles('src')
    return files.filter(file =>
      extensions.includes(extname(file)) &&
      file.toLowerCase().includes(pattern.toLowerCase())
    )
  }

  private printSummary() {
    console.log('\n' + '=' .repeat(60))
    console.log('📊 SECURITY AUDIT SUMMARY')
    console.log('=' .repeat(60))

    const passed = this.results.filter(r => r.passed).length
    const failed = this.results.filter(r => !r.passed).length
    const total = this.results.length

    console.log(`\n✅ Passed: ${passed}`)
    console.log(`❌ Failed: ${failed}`)
    console.log(`📋 Total Checks: ${total}`)

    const criticalFailures = this.results.filter(r =>
      !r.passed &&
      this.checks.find(c => c.name === r.message.split(':')[0]?.trim())?.severity === 'Critical'
    ).length

    const highFailures = this.results.filter(r =>
      !r.passed &&
      this.checks.find(c => c.name === r.message.split(':')[0]?.trim())?.severity === 'High'
    ).length

    if (criticalFailures > 0 || highFailures > 0) {
      console.log(`\n🚨 CRITICAL ISSUES: ${criticalFailures}`)
      console.log(`⚠️  HIGH PRIORITY: ${highFailures}`)

      console.log('\n🔧 IMMEDIATE ACTION REQUIRED:')
      this.results
        .filter(r => !r.passed)
        .forEach((result, index) => {
          const check = this.checks[index]
          console.log(`   ${check.severity}: ${check.name}`)
        })
    }

    const successRate = ((passed / total) * 100).toFixed(1)
    console.log(`\n📈 Success Rate: ${successRate}%`)

    if (parseFloat(successRate) >= 80) {
      console.log('🎉 Security posture is good!')
    } else if (parseFloat(successRate) >= 60) {
      console.log('⚠️  Security posture needs improvement')
    } else {
      console.log('🚨 Critical security issues require immediate attention')
    }
  }
}

// Run the audit if this script is executed directly
if (require.main === module) {
  const auditor = new SecurityAuditor()
  auditor.runAudit().catch(console.error)
}

export default SecurityAuditor
