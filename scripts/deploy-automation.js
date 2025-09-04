#!/usr/bin/env node

/**
 * Deployment Automation Script
 * Handles end-to-end deployment process with monitoring and rollback
 * Run with: node scripts/deploy-automation.js
 */

const { execSync, spawn } = require('child_process')
const fs = require('fs')
const path = require('path')

class DeploymentAutomation {
  constructor() {
    this.startTime = new Date()
    this.steps = []
    this.environment = process.env.NODE_ENV || 'development'
    this.isProduction = this.environment === 'production'
  }

  log(message, type = 'info') {
    const timestamp = new Date().toISOString()
    const prefix = {
      info: 'ℹ️ ',
      success: '✅',
      error: '❌',
      warning: '⚠️ ',
      step: '🚀'
    }[type] || '📝'

    console.log(`[${timestamp}] ${prefix} ${message}`)
    this.steps.push({ timestamp, type, message })
  }

  executeCommand(command, description, options = {}) {
    try {
      this.log(`Starting: ${description}`, 'step')

      const result = execSync(command, {
        stdio: options.silent ? 'pipe' : 'inherit',
        timeout: options.timeout || 300000, // 5 minutes default
        encoding: 'utf8',
        ...options
      })

      this.log(`Completed: ${description}`, 'success')
      return { success: true, output: result }
    } catch (error) {
      this.log(`Failed: ${description} - ${error.message}`, 'error')
      return { success: false, error }
    }
  }

  async runHealthChecks() {
    this.log('Running pre-deployment health checks', 'step')

    const checks = [
      {
        name: 'Environment Variables',
        command: 'node scripts/validate-env-vars.js',
        critical: true
      },
      {
        name: 'TypeScript Compilation',
        command: 'npm run type-check',
        critical: true
      },
      {
        name: 'Database Connection',
        command: 'node scripts/test-db-connection.js',
        critical: true
      },
      {
        name: 'Build Process',
        command: 'npm run build:dev',
        critical: true
      }
    ]

    for (const check of checks) {
      const result = this.executeCommand(
        check.command,
        `${check.name} health check`,
        { silent: true }
      )

      if (!result.success && check.critical) {
        this.log(`Critical health check failed: ${check.name}`, 'error')
        return false
      }
    }

    this.log('All health checks passed', 'success')
    return true
  }

  async runBuildProcess() {
    this.log('Starting build process', 'step')

    const buildSteps = [
      'npm run clean',
      'npm run type-check',
      'npm run lint',
      'npm run build',
      'npm run test:ci'
    ]

    for (const step of buildSteps) {
      const result = this.executeCommand(step, `Build step: ${step}`)
      if (!result.success) {
        this.log(`Build failed at step: ${step}`, 'error')
        return false
      }
    }

    this.log('Build process completed successfully', 'success')
    return true
  }

  async runDeployment() {
    this.log('Starting deployment process', 'step')

    if (this.isProduction) {
      // Production deployment to Vercel
      const deployCommand = 'vercel --prod --yes'
      const result = this.executeCommand(deployCommand, 'Vercel production deployment')

      if (!result.success) {
        this.log('Production deployment failed', 'error')
        return false
      }

      this.log('Production deployment completed successfully', 'success')
    } else {
      // Development deployment
      const deployCommand = 'vercel --yes'
      const result = this.executeCommand(deployCommand, 'Vercel development deployment')

      if (!result.success) {
        this.log('Development deployment failed', 'error')
        return false
      }

      this.log('Development deployment completed successfully', 'success')
    }

    return true
  }

  async runPostDeploymentTests() {
    this.log('Running post-deployment tests', 'step')

    const testSteps = [
      {
        name: 'Smoke Tests',
        command: 'npm run smoke:test',
        critical: false
      },
      {
        name: 'API Health Check',
        command: 'curl -f https://your-app-url.vercel.app/api/health || exit 1',
        critical: true
      },
      {
        name: 'Database Migration Check',
        command: 'npm run db:health',
        critical: true
      }
    ]

    let allPassed = true

    for (const test of testSteps) {
      const result = this.executeCommand(
        test.command,
        `Post-deployment test: ${test.name}`,
        { silent: true }
      )

      if (!result.success && test.critical) {
        this.log(`Critical post-deployment test failed: ${test.name}`, 'error')
        allPassed = false
      }
    }

    if (allPassed) {
      this.log('All post-deployment tests passed', 'success')
    }

    return allPassed
  }

  async createDeploymentSnapshot() {
    const deploymentId = `deploy_${Date.now()}`
    const snapshotPath = path.join(process.cwd(), 'deployments', deploymentId)

    // Create deployments directory if it doesn't exist
    if (!fs.existsSync(path.join(process.cwd(), 'deployments'))) {
      fs.mkdirSync(path.join(process.cwd(), 'deployments'))
    }

    // Create snapshot directory
    fs.mkdirSync(snapshotPath)

    // Save deployment metadata
    const metadata = {
      deploymentId,
      timestamp: this.startTime.toISOString(),
      environment: this.environment,
      duration: Date.now() - this.startTime.getTime(),
      steps: this.steps,
      success: this.steps.every(step => step.type !== 'error'),
      version: process.env.npm_package_version || 'unknown'
    }

    fs.writeFileSync(
      path.join(snapshotPath, 'metadata.json'),
      JSON.stringify(metadata, null, 2)
    )

    this.log(`Deployment snapshot created: ${deploymentId}`, 'success')
    return deploymentId
  }

  async generateReport(success) {
    const duration = Date.now() - this.startTime.getTime()
    const report = {
      summary: {
        success,
        duration: `${Math.round(duration / 1000)}s`,
        environment: this.environment,
        timestamp: this.startTime.toISOString(),
        totalSteps: this.steps.length,
        successfulSteps: this.steps.filter(s => s.type === 'success').length,
        failedSteps: this.steps.filter(s => s.type === 'error').length
      },
      steps: this.steps,
      recommendations: []
    }

    // Generate recommendations based on results
    if (!success) {
      report.recommendations.push('Review error logs and fix critical issues')
      report.recommendations.push('Consider rolling back to previous stable deployment')
    }

    if (duration > 300000) { // 5 minutes
      report.recommendations.push('Optimize build process to reduce deployment time')
    }

    // Save report
    const reportPath = path.join(process.cwd(), 'deployment-report.json')
    fs.writeFileSync(reportPath, JSON.stringify(report, null, 2))

    this.log(`Deployment report generated: ${reportPath}`, 'success')

    // Print summary
    console.log('\n' + '='.repeat(60))
    console.log('📊 DEPLOYMENT SUMMARY')
    console.log('='.repeat(60))
    console.log(`Status: ${success ? '✅ SUCCESS' : '❌ FAILED'}`)
    console.log(`Duration: ${Math.round(duration / 1000)}s`)
    console.log(`Environment: ${this.environment}`)
    console.log(`Steps: ${report.summary.successfulSteps}/${report.summary.totalSteps} successful`)

    if (report.recommendations.length > 0) {
      console.log('\n💡 RECOMMENDATIONS:')
      report.recommendations.forEach(rec => console.log(`   • ${rec}`))
    }

    return report
  }

  async rollback(deploymentId) {
    this.log(`Starting rollback to deployment: ${deploymentId}`, 'warning')

    try {
      // Implement rollback logic here
      const result = this.executeCommand(
        `vercel rollback ${deploymentId}`,
        `Rolling back to deployment ${deploymentId}`
      )

      if (result.success) {
        this.log('Rollback completed successfully', 'success')
        return true
      } else {
        this.log('Rollback failed', 'error')
        return false
      }
    } catch (error) {
      this.log(`Rollback failed: ${error.message}`, 'error')
      return false
    }
  }

  async run(options = {}) {
    const { skipHealthChecks = false, skipPostTests = false, autoRollback = true } = options

    this.log('🚀 Starting Automated Deployment Process', 'step')

    try {
      // Step 1: Pre-deployment health checks
      if (!skipHealthChecks) {
        const healthCheckPassed = await this.runHealthChecks()
        if (!healthCheckPassed) {
          throw new Error('Pre-deployment health checks failed')
        }
      }

      // Step 2: Build process
      const buildPassed = await this.runBuildProcess()
      if (!buildPassed) {
        throw new Error('Build process failed')
      }

      // Step 3: Deployment
      const deployPassed = await this.runDeployment()
      if (!deployPassed) {
        throw new Error('Deployment failed')
      }

      // Step 4: Post-deployment tests
      if (!skipPostTests) {
        const postTestsPassed = await this.runPostDeploymentTests()
        if (!postTestsPassed) {
          this.log('Post-deployment tests failed, but deployment completed', 'warning')
        }
      }

      // Step 5: Create deployment snapshot
      await this.createDeploymentSnapshot()

      // Generate success report
      await this.generateReport(true)

      this.log('🎉 Deployment completed successfully!', 'success')
      return true

    } catch (error) {
      this.log(`Deployment failed: ${error.message}`, 'error')

      // Auto-rollback if enabled
      if (autoRollback && this.isProduction) {
        this.log('Attempting automatic rollback...', 'warning')
        await this.rollback('latest')
      }

      // Generate failure report
      await this.generateReport(false)

      return false
    }
  }
}

// CLI interface
async function main() {
  const args = process.argv.slice(2)
  const options = {
    skipHealthChecks: args.includes('--skip-health-checks'),
    skipPostTests: args.includes('--skip-post-tests'),
    autoRollback: !args.includes('--no-rollback')
  }

  const deployment = new DeploymentAutomation()

  if (args.includes('--rollback')) {
    const deploymentId = args[args.indexOf('--rollback') + 1]
    if (!deploymentId) {
      console.error('❌ Deployment ID required for rollback')
      process.exit(1)
    }
    const success = await deployment.rollback(deploymentId)
    process.exit(success ? 0 : 1)
  }

  const success = await deployment.run(options)
  process.exit(success ? 0 : 1)
}

// Run if called directly
if (require.main === module) {
  main().catch(error => {
    console.error('❌ Deployment automation failed:', error)
    process.exit(1)
  })
}

module.exports = DeploymentAutomation
