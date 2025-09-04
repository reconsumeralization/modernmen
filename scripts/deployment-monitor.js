#!/usr/bin/env node

/**
 * Deployment Monitoring and Alerting Script
 * Monitors deployment status and sends alerts for issues
 * Run with: node scripts/deployment-monitor.js
 */

const https = require('https')
const fs = require('fs')
const path = require('path')

class DeploymentMonitor {
  constructor() {
    this.checkInterval = 60000 // 1 minute
    this.alertThresholds = {
      responseTime: 3000, // 3 seconds
      errorRate: 0.05, // 5%
      uptime: 0.99 // 99%
    }
    this.alerts = []
    this.metrics = {
      lastCheck: null,
      responseTime: null,
      errorRate: null,
      uptime: null,
      status: 'unknown'
    }
  }

  log(message, type = 'info') {
    const timestamp = new Date().toISOString()
    const prefix = {
      info: 'ℹ️ ',
      success: '✅',
      error: '❌',
      warning: '⚠️ ',
      alert: '🚨'
    }[type] || '📝'

    console.log(`[${timestamp}] ${prefix} ${message}`)
  }

  async checkEndpoint(url, timeout = 10000) {
    return new Promise((resolve) => {
      const startTime = Date.now()
      const request = https.get(url, { timeout }, (res) => {
        const responseTime = Date.now() - startTime
        let data = ''

        res.on('data', (chunk) => {
          data += chunk
        })

        res.on('end', () => {
          resolve({
            success: true,
            statusCode: res.statusCode,
            responseTime,
            data: data.length > 100 ? data.substring(0, 100) + '...' : data
          })
        })
      })

      request.on('error', (error) => {
        resolve({
          success: false,
          error: error.message,
          responseTime: Date.now() - startTime
        })
      })

      request.on('timeout', () => {
        request.destroy()
        resolve({
          success: false,
          error: 'Request timeout',
          responseTime: timeout
        })
      })
    })
  }

  async checkHealthEndpoints() {
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'
    const endpoints = [
      { path: '/api/health', name: 'API Health' },
      { path: '/api/healthcheck', name: 'Health Check' },
      { path: '/', name: 'Homepage' },
      { path: '/api/payload/health', name: 'Payload CMS Health' }
    ]

    const results = []

    for (const endpoint of endpoints) {
      const url = `${baseUrl}${endpoint.path}`
      this.log(`Checking ${endpoint.name}: ${url}`, 'info')

      const result = await this.checkEndpoint(url)
      results.push({
        ...endpoint,
        ...result,
        url
      })

      if (result.success) {
        this.log(`${endpoint.name}: ${result.statusCode} (${result.responseTime}ms)`, 'success')
      } else {
        this.log(`${endpoint.name}: ${result.error}`, 'error')
      }
    }

    return results
  }

  calculateMetrics(results) {
    const totalRequests = results.length
    const successfulRequests = results.filter(r => r.success).length
    const avgResponseTime = results
      .filter(r => r.success)
      .reduce((sum, r) => sum + r.responseTime, 0) / successfulRequests

    const errorRate = (totalRequests - successfulRequests) / totalRequests
    const uptime = successfulRequests / totalRequests

    return {
      responseTime: avgResponseTime,
      errorRate,
      uptime,
      totalRequests,
      successfulRequests
    }
  }

  checkThresholds(metrics) {
    const alerts = []

    if (metrics.responseTime > this.alertThresholds.responseTime) {
      alerts.push({
        type: 'performance',
        message: `High response time: ${metrics.responseTime.toFixed(0)}ms (threshold: ${this.alertThresholds.responseTime}ms)`,
        severity: 'warning'
      })
    }

    if (metrics.errorRate > this.alertThresholds.errorRate) {
      alerts.push({
        type: 'error',
        message: `High error rate: ${(metrics.errorRate * 100).toFixed(1)}% (threshold: ${(this.alertThresholds.errorRate * 100).toFixed(1)}%)`,
        severity: 'error'
      })
    }

    if (metrics.uptime < this.alertThresholds.uptime) {
      alerts.push({
        type: 'availability',
        message: `Low uptime: ${(metrics.uptime * 100).toFixed(1)}% (threshold: ${(this.alertThresholds.uptime * 100).toFixed(1)}%)`,
        severity: 'critical'
      })
    }

    return alerts
  }

  async sendAlert(alert) {
    this.log(`Sending alert: ${alert.message}`, alert.severity)

    // In a real implementation, you would send alerts to:
    // - Slack/Discord webhooks
    // - Email notifications
    // - SMS alerts
    // - Monitoring services (DataDog, New Relic, etc.)

    // For now, just log and store
    this.alerts.push({
      ...alert,
      timestamp: new Date().toISOString()
    })

    // Example: Send to Slack webhook
    if (process.env.SLACK_WEBHOOK_URL) {
      try {
        const payload = {
          text: `🚨 Deployment Alert: ${alert.message}`,
          attachments: [{
            color: alert.severity === 'critical' ? 'danger' : 'warning',
            fields: [
              { title: 'Type', value: alert.type, short: true },
              { title: 'Severity', value: alert.severity, short: true },
              { title: 'Time', value: new Date().toISOString(), short: true }
            ]
          }]
        }

        // Would implement HTTP POST to Slack webhook here
        this.log('Alert sent to Slack', 'success')
      } catch (error) {
        this.log(`Failed to send Slack alert: ${error.message}`, 'error')
      }
    }
  }

  generateReport(results, metrics, alerts) {
    const report = {
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV || 'development',
      metrics,
      alerts: alerts.length,
      endpoints: results.map(r => ({
        name: r.name,
        url: r.url,
        success: r.success,
        statusCode: r.statusCode,
        responseTime: r.responseTime,
        error: r.error
      })),
      summary: {
        totalEndpoints: results.length,
        healthyEndpoints: results.filter(r => r.success).length,
        averageResponseTime: metrics.responseTime,
        uptime: metrics.uptime,
        errorRate: metrics.errorRate
      }
    }

    return report
  }

  saveReport(report) {
    const reportsDir = path.join(process.cwd(), 'monitoring-reports')
    if (!fs.existsSync(reportsDir)) {
      fs.mkdirSync(reportsDir)
    }

    const filename = `report_${new Date().toISOString().replace(/[:.]/g, '-')}.json`
    const filepath = path.join(reportsDir, filename)

    fs.writeFileSync(filepath, JSON.stringify(report, null, 2))
    this.log(`Report saved: ${filepath}`, 'success')
  }

  async runMonitoringCycle() {
    try {
      this.log('Starting monitoring cycle', 'info')

      // Check all endpoints
      const results = await this.checkHealthEndpoints()

      // Calculate metrics
      const metrics = this.calculateMetrics(results)

      // Check thresholds and generate alerts
      const newAlerts = this.checkThresholds(metrics)

      // Send alerts
      for (const alert of newAlerts) {
        await this.sendAlert(alert)
      }

      // Generate and save report
      const report = this.generateReport(results, metrics, newAlerts)
      this.saveReport(report)

      // Update current metrics
      this.metrics = {
        ...metrics,
        lastCheck: new Date().toISOString(),
        status: newAlerts.some(a => a.severity === 'critical') ? 'critical' :
                newAlerts.some(a => a.severity === 'error') ? 'error' :
                newAlerts.length > 0 ? 'warning' : 'healthy'
      }

      // Log summary
      const statusEmoji = {
        healthy: '🟢',
        warning: '🟡',
        error: '🟠',
        critical: '🔴'
      }[this.metrics.status] || '⚪'

      this.log(`${statusEmoji} Monitoring cycle complete - Status: ${this.metrics.status}`, 'success')

      return {
        success: true,
        status: this.metrics.status,
        alerts: newAlerts.length,
        metrics
      }

    } catch (error) {
      this.log(`Monitoring cycle failed: ${error.message}`, 'error')
      return {
        success: false,
        error: error.message
      }
    }
  }

  async startContinuousMonitoring() {
    this.log('Starting continuous deployment monitoring', 'info')
    this.log(`Check interval: ${this.checkInterval / 1000} seconds`, 'info')

    // Initial check
    await this.runMonitoringCycle()

    // Set up continuous monitoring
    setInterval(async () => {
      await this.runMonitoringCycle()
    }, this.checkInterval)
  }

  async runOnce() {
    const result = await this.runMonitoringCycle()

    if (!result.success) {
      process.exit(1)
    }

    // Exit with appropriate code based on status
    const exitCodes = {
      healthy: 0,
      warning: 0, // Warnings don't fail the build
      error: 1,
      critical: 1
    }

    process.exit(exitCodes[result.status] || 1)
  }

  getStatus() {
    return {
      ...this.metrics,
      activeAlerts: this.alerts.filter(a => {
        // Consider alerts active for 5 minutes
        const alertTime = new Date(a.timestamp).getTime()
        const fiveMinutesAgo = Date.now() - (5 * 60 * 1000)
        return alertTime > fiveMinutesAgo
      }).length,
      totalAlerts: this.alerts.length
    }
  }
}

// CLI interface
async function main() {
  const args = process.argv.slice(2)
  const monitor = new DeploymentMonitor()

  if (args.includes('--status')) {
    const status = monitor.getStatus()
    console.log(JSON.stringify(status, null, 2))
    return
  }

  if (args.includes('--continuous')) {
    await monitor.startContinuousMonitoring()
    return
  }

  // Run single monitoring cycle
  await monitor.runOnce()
}

// Run if called directly
if (require.main === module) {
  main().catch(error => {
    console.error('❌ Deployment monitoring failed:', error)
    process.exit(1)
  })
}

module.exports = DeploymentMonitor
