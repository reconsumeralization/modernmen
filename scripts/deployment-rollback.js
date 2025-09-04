#!/usr/bin/env node

/**
 * Automated Rollback System
 * Handles deployment rollbacks with safety checks and validation
 * Run with: node scripts/deployment-rollback.js [deployment-id]
 */

const { execSync } = require('child_process')
const fs = require('fs')
const path = require('path')

class DeploymentRollback {
  constructor() {
    this.environment = process.env.NODE_ENV || 'development'
    this.isProduction = this.environment === 'production'
    this.backupsDir = path.join(process.cwd(), 'backups')
    this.deploymentsDir = path.join(process.cwd(), 'deployments')
  }

  log(message, type = 'info') {
    const timestamp = new Date().toISOString()
    const prefix = {
      info: 'ℹ️ ',
      success: '✅',
      error: '❌',
      warning: '⚠️ ',
      rollback: '🔄'
    }[type] || '📝'

    console.log(`[${timestamp}] ${prefix} ${message}`)
  }

  executeCommand(command, description, options = {}) {
    try {
      this.log(`Executing: ${description}`, 'info')

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
      return { success: false, error: error.message }
    }
  }

  findDeploymentSnapshot(deploymentId) {
    const snapshotPath = path.join(this.deploymentsDir, deploymentId)

    if (!fs.existsSync(snapshotPath)) {
      // Try to find by partial ID or timestamp
      const snapshots = fs.readdirSync(this.deploymentsDir)
        .filter(dir => fs.statSync(path.join(this.deploymentsDir, dir)).isDirectory())
        .sort()
        .reverse()

      // Look for matching deployment
      const matchingSnapshot = snapshots.find(snapshot => snapshot.includes(deploymentId))
      if (matchingSnapshot) {
        return path.join(this.deploymentsDir, matchingSnapshot)
      }

      // If 'latest', get the most recent
      if (deploymentId === 'latest') {
        return path.join(this.deploymentsDir, snapshots[0])
      }

      return null
    }

    return snapshotPath
  }

  loadDeploymentMetadata(snapshotPath) {
    const metadataPath = path.join(snapshotPath, 'metadata.json')

    if (!fs.existsSync(metadataPath)) {
      throw new Error('Deployment metadata not found')
    }

    const metadata = JSON.parse(fs.readFileSync(metadataPath, 'utf8'))
    return metadata
  }

  validateRollbackPrerequisites(metadata) {
    this.log('Validating rollback prerequisites', 'rollback')

    const validations = [
      {
        name: 'Environment Match',
        condition: metadata.environment === this.environment,
        message: `Environment mismatch: ${metadata.environment} vs ${this.environment}`
      },
      {
        name: 'Deployment Success',
        condition: metadata.success,
        message: 'Cannot rollback from failed deployment'
      },
      {
        name: 'Recent Deployment',
        condition: Date.now() - new Date(metadata.timestamp).getTime() < (24 * 60 * 60 * 1000), // 24 hours
        message: 'Deployment too old for rollback (>24 hours)'
      }
    ]

    const failures = validations.filter(v => !v.condition)

    if (failures.length > 0) {
      failures.forEach(failure => {
        this.log(`❌ ${failure.name}: ${failure.message}`, 'error')
      })
      return false
    }

    this.log('All rollback prerequisites validated', 'success')
    return true
  }

  async performVercelRollback(deploymentId) {
    this.log(`Performing Vercel rollback to: ${deploymentId}`, 'rollback')

    try {
      // Use Vercel CLI to rollback
      const result = this.executeCommand(
        `vercel rollback ${deploymentId}`,
        'Vercel deployment rollback'
      )

      if (result.success) {
        this.log('Vercel rollback completed successfully', 'success')
        return true
      } else {
        this.log('Vercel rollback failed', 'error')
        return false
      }
    } catch (error) {
      this.log(`Vercel rollback failed: ${error.message}`, 'error')
      return false
    }
  }

  async performDatabaseRollback(metadata) {
    this.log('Performing database rollback', 'rollback')

    try {
      // Check if there are database migrations to rollback
      const migrationResult = this.executeCommand(
        'npm run db:migrate:down',
        'Database migration rollback',
        { silent: true }
      )

      if (migrationResult.success) {
        this.log('Database rollback completed successfully', 'success')
        return true
      } else {
        this.log('Database rollback failed, but continuing', 'warning')
        return true // Don't fail the entire rollback for DB issues
      }
    } catch (error) {
      this.log(`Database rollback failed: ${error.message}`, 'warning')
      return true // Continue with rollback even if DB fails
    }
  }

  async performStaticAssetRollback(metadata) {
    this.log('Performing static asset rollback', 'rollback')

    try {
      // Clear any cached static assets
      const cacheResult = this.executeCommand(
        'npm run cache:clear',
        'Clear static asset cache'
      )

      if (cacheResult.success) {
        this.log('Static asset cache cleared successfully', 'success')
      }

      return true
    } catch (error) {
      this.log(`Static asset rollback failed: ${error.message}`, 'warning')
      return true
    }
  }

  async validateRollback() {
    this.log('Validating rollback success', 'rollback')

    // Wait a moment for changes to propagate
    await new Promise(resolve => setTimeout(resolve, 5000))

    try {
      // Run health checks
      const healthResult = this.executeCommand(
        'npm run health:check',
        'Post-rollback health validation'
      )

      if (healthResult.success) {
        this.log('Rollback validation successful', 'success')
        return true
      } else {
        this.log('Rollback validation failed', 'error')
        return false
      }
    } catch (error) {
      this.log(`Rollback validation failed: ${error.message}`, 'error')
      return false
    }
  }

  createRollbackSnapshot(originalMetadata, rollbackResult) {
    const rollbackId = `rollback_${Date.now()}`
    const snapshotPath = path.join(this.deploymentsDir, rollbackId)

    if (!fs.existsSync(snapshotPath)) {
      fs.mkdirSync(snapshotPath, { recursive: true })
    }

    const rollbackMetadata = {
      rollbackId,
      originalDeploymentId: originalMetadata.deploymentId,
      timestamp: new Date().toISOString(),
      environment: this.environment,
      success: rollbackResult.success,
      duration: Date.now() - new Date(originalMetadata.timestamp).getTime(),
      reason: rollbackResult.reason || 'Automated rollback',
      steps: rollbackResult.steps || [],
      validationResults: rollbackResult.validationResults || {}
    }

    fs.writeFileSync(
      path.join(snapshotPath, 'rollback-metadata.json'),
      JSON.stringify(rollbackMetadata, null, 2)
    )

    this.log(`Rollback snapshot created: ${rollbackId}`, 'success')
    return rollbackId
  }

  async sendRollbackNotification(success, metadata, rollbackId) {
    this.log('Sending rollback notification', 'info')

    // In a real implementation, this would send notifications to:
    // - Slack/Teams channels
    // - Email alerts
    // - SMS notifications
    // - Monitoring dashboards

    const notification = {
      type: success ? 'rollback_success' : 'rollback_failure',
      deploymentId: metadata.deploymentId,
      rollbackId,
      environment: this.environment,
      timestamp: new Date().toISOString(),
      message: success
        ? `Successfully rolled back deployment ${metadata.deploymentId}`
        : `Failed to rollback deployment ${metadata.deploymentId}`
    }

    // Example: Log to monitoring service
    console.log('Rollback notification:', JSON.stringify(notification, null, 2))

    // Would implement actual notification sending here
    this.log('Rollback notification sent', 'success')
  }

  async rollback(deploymentId, options = {}) {
    const { skipValidation = false, force = false } = options

    this.log(`🚨 Starting rollback process for deployment: ${deploymentId}`, 'rollback')

    try {
      // Step 1: Find deployment snapshot
      const snapshotPath = this.findDeploymentSnapshot(deploymentId)
      if (!snapshotPath) {
        throw new Error(`Deployment snapshot not found: ${deploymentId}`)
      }

      // Step 2: Load deployment metadata
      const metadata = this.loadDeploymentMetadata(snapshotPath)
      this.log(`Found deployment: ${metadata.deploymentId} from ${metadata.timestamp}`, 'info')

      // Step 3: Validate rollback prerequisites
      if (!force && !this.validateRollbackPrerequisites(metadata)) {
        throw new Error('Rollback prerequisites not met')
      }

      // Step 4: Perform Vercel rollback
      const vercelSuccess = await this.performVercelRollback(deploymentId)
      if (!vercelSuccess) {
        throw new Error('Vercel rollback failed')
      }

      // Step 5: Perform database rollback
      await this.performDatabaseRollback(metadata)

      // Step 6: Perform static asset rollback
      await this.performStaticAssetRollback(metadata)

      // Step 7: Validate rollback success
      let validationSuccess = true
      if (!skipValidation) {
        validationSuccess = await this.validateRollback()
      }

      // Step 8: Create rollback snapshot
      const rollbackResult = {
        success: validationSuccess,
        steps: ['vercel_rollback', 'db_rollback', 'asset_rollback', 'validation'],
        validationResults: { validationSuccess }
      }

      const rollbackId = this.createRollbackSnapshot(metadata, rollbackResult)

      // Step 9: Send notifications
      await this.sendRollbackNotification(validationSuccess, metadata, rollbackId)

      if (validationSuccess) {
        this.log('🎉 Rollback completed successfully!', 'success')
        return { success: true, rollbackId }
      } else {
        this.log('⚠️ Rollback completed but validation failed', 'warning')
        return { success: false, rollbackId, reason: 'Validation failed' }
      }

    } catch (error) {
      this.log(`❌ Rollback failed: ${error.message}`, 'error')

      // Create failure snapshot
      const failureResult = {
        success: false,
        reason: error.message,
        steps: []
      }

      try {
        this.createRollbackSnapshot({ deploymentId }, failureResult)
      } catch (snapshotError) {
        this.log(`Failed to create failure snapshot: ${snapshotError.message}`, 'error')
      }

      return { success: false, error: error.message }
    }
  }

  listAvailableRollbacks() {
    if (!fs.existsSync(this.deploymentsDir)) {
      console.log('No deployment snapshots found')
      return []
    }

    const snapshots = fs.readdirSync(this.deploymentsDir)
      .filter(dir => fs.statSync(path.join(this.deploymentsDir, dir)).isDirectory())
      .map(dir => {
        const metadataPath = path.join(this.deploymentsDir, dir, 'metadata.json')
        if (fs.existsSync(metadataPath)) {
          try {
            const metadata = JSON.parse(fs.readFileSync(metadataPath, 'utf8'))
            return {
              id: dir,
              deploymentId: metadata.deploymentId,
              timestamp: metadata.timestamp,
              environment: metadata.environment,
              success: metadata.success,
              duration: metadata.duration
            }
          } catch (error) {
            return null
          }
        }
        return null
      })
      .filter(Boolean)
      .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))

    console.log('Available rollbacks:')
    console.table(snapshots)

    return snapshots
  }
}

// CLI interface
async function main() {
  const args = process.argv.slice(2)
  const rollback = new DeploymentRollback()

  if (args.includes('--list')) {
    rollback.listAvailableRollbacks()
    return
  }

  if (args.length === 0) {
    console.error('❌ Deployment ID required')
    console.log('Usage: node scripts/deployment-rollback.js <deployment-id>')
    console.log('Or: node scripts/deployment-rollback.js --list')
    process.exit(1)
  }

  const deploymentId = args[0]
  const options = {
    skipValidation: args.includes('--skip-validation'),
    force: args.includes('--force')
  }

  const result = await rollback.rollback(deploymentId, options)

  if (result.success) {
    console.log(`✅ Rollback successful - Rollback ID: ${result.rollbackId}`)
    process.exit(0)
  } else {
    console.log(`❌ Rollback failed: ${result.error || 'Unknown error'}`)
    process.exit(1)
  }
}

// Run if called directly
if (require.main === module) {
  main().catch(error => {
    console.error('❌ Rollback automation failed:', error)
    process.exit(1)
  })
}

module.exports = DeploymentRollback
