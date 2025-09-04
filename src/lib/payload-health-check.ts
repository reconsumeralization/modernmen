/**
 * Payload CMS Deployment Health Checks
 * Comprehensive health validation for production deployments
 */

import { getPayloadClient } from '@/payload';
import { validatePayloadEnvironment } from '@/lib/env-validation';
import { payloadCache } from '@/lib/payload-cache';
import { payloadMonitor } from '@/lib/payload-monitoring';
import { payloadShutdown } from '@/lib/payload-graceful-shutdown';

interface HealthCheckResult {
  service: string;
  status: 'healthy' | 'degraded' | 'unhealthy';
  responseTime: number;
  details: Record<string, any>;
  timestamp: number;
}

interface SystemHealth {
  overall: 'healthy' | 'degraded' | 'unhealthy';
  checks: HealthCheckResult[];
  summary: {
    total: number;
    healthy: number;
    degraded: number;
    unhealthy: number;
  };
  timestamp: number;
  uptime: number;
}

class PayloadHealthChecker {
  private checkTimeout = 10000; // 10 seconds
  private isEnabled: boolean;

  constructor() {
    this.isEnabled = process.env.NODE_ENV === 'production' ||
                     process.env.VERCEL === '1' ||
                     process.env.ENABLE_HEALTH_CHECKS === 'true';
  }

  /**
   * Run all health checks
   */
  async runFullHealthCheck(): Promise<SystemHealth> {
    const startTime = Date.now();
    const checks: HealthCheckResult[] = [];

    console.log('🔍 Running Payload Health Checks...');

    // Environment validation
    checks.push(await this.checkEnvironment());

    // Database connectivity
    checks.push(await this.checkDatabase());

    // Payload CMS functionality
    checks.push(await this.checkPayloadCore());

    // Collections accessibility
    checks.push(await this.checkCollections());

    // Cache performance
    checks.push(await this.checkCacheHealth());

    // Memory and performance
    checks.push(await this.checkSystemPerformance());

    // Shutdown system health
    checks.push(await this.checkShutdownSystem());

    const endTime = Date.now();
    const totalTime = endTime - startTime;

    // Calculate summary
    const healthy = checks.filter(c => c.status === 'healthy').length;
    const degraded = checks.filter(c => c.status === 'degraded').length;
    const unhealthy = checks.filter(c => c.status === 'unhealthy').length;

    let overall: 'healthy' | 'degraded' | 'unhealthy' = 'healthy';
    if (unhealthy > 0) {
      overall = 'unhealthy';
    } else if (degraded > 0) {
      overall = 'degraded';
    }

    const result: SystemHealth = {
      overall,
      checks,
      summary: {
        total: checks.length,
        healthy,
        degraded,
        unhealthy
      },
      timestamp: endTime,
      uptime: process.uptime()
    };

    this.logHealthReport(result);
    return result;
  }

  /**
   * Check environment variables
   */
  private async checkEnvironment(): Promise<HealthCheckResult> {
    const startTime = Date.now();

    try {
      const envResult = validatePayloadEnvironment();

      const endTime = Date.now();
      const responseTime = endTime - startTime;

      if (!envResult.isValid) {
        return {
          service: 'environment',
          status: 'unhealthy',
          responseTime,
          details: {
            missing: envResult.missing,
            invalid: envResult.invalid,
            message: 'Environment validation failed'
          },
          timestamp: endTime
        };
      }

      if (envResult.warnings.length > 0) {
        return {
          service: 'environment',
          status: 'degraded',
          responseTime,
          details: {
            warnings: envResult.warnings,
            message: 'Environment has warnings'
          },
          timestamp: endTime
        };
      }

      return {
        service: 'environment',
        status: 'healthy',
        responseTime,
        details: { message: 'All environment variables valid' },
        timestamp: endTime
      };
    } catch (error) {
      const endTime = Date.now();
      return {
        service: 'environment',
        status: 'unhealthy',
        responseTime: endTime - startTime,
        details: { error: error.message, message: 'Environment check failed' },
        timestamp: endTime
      };
    }
  }

  /**
   * Check database connectivity
   */
  private async checkDatabase(): Promise<HealthCheckResult> {
    const startTime = Date.now();

    try {
      const payload = await getPayloadClient();

      // Try a simple query to test connectivity
      const testQuery = await Promise.race([
        payload.find({ collection: 'users', limit: 1 }),
        new Promise((_, reject) =>
          setTimeout(() => reject(new Error('Database timeout')), this.checkTimeout)
        )
      ]);

      const endTime = Date.now();
      const responseTime = endTime - startTime;

      // Check response time
      if (responseTime > 5000) { // > 5 seconds
        return {
          service: 'database',
          status: 'degraded',
          responseTime,
          details: {
            message: 'Database response time is slow',
            responseTime: `${responseTime}ms`
          },
          timestamp: endTime
        };
      }

      return {
        service: 'database',
        status: 'healthy',
        responseTime,
        details: { message: 'Database connection healthy' },
        timestamp: endTime
      };
    } catch (error) {
      const endTime = Date.now();
      return {
        service: 'database',
        status: 'unhealthy',
        responseTime: endTime - startTime,
        details: { error: error.message, message: 'Database connection failed' },
        timestamp: endTime
      };
    }
  }

  /**
   * Check Payload core functionality
   */
  private async checkPayloadCore(): Promise<HealthCheckResult> {
    const startTime = Date.now();

    try {
      const payload = await getPayloadClient();

      // Test Payload client initialization
      if (!payload) {
        throw new Error('Payload client not initialized');
      }

      const endTime = Date.now();
      const responseTime = endTime - startTime;

      return {
        service: 'payload-core',
        status: 'healthy',
        responseTime,
        details: { message: 'Payload CMS core functionality healthy' },
        timestamp: endTime
      };
    } catch (error) {
      const endTime = Date.now();
      return {
        service: 'payload-core',
        status: 'unhealthy',
        responseTime: endTime - startTime,
        details: { error: error.message, message: 'Payload core initialization failed' },
        timestamp: endTime
      };
    }
  }

  /**
   * Check collections accessibility
   */
  private async checkCollections(): Promise<HealthCheckResult> {
    const startTime = Date.now();

    try {
      const payload = await getPayloadClient();
      const collections = ['users', 'customers', 'services', 'stylists', 'appointments'];
      const results = [];

      for (const collection of collections) {
        try {
          const start = Date.now();
          await payload.find({ collection, limit: 1 });
          const duration = Date.now() - start;
          results.push({ collection, status: 'healthy', duration });
        } catch (error) {
          results.push({ collection, status: 'error', error: error.message });
        }
      }

      const endTime = Date.now();
      const responseTime = endTime - startTime;

      const failedCollections = results.filter(r => r.status === 'error');

      if (failedCollections.length > 0) {
        return {
          service: 'collections',
          status: failedCollections.length === collections.length ? 'unhealthy' : 'degraded',
          responseTime,
          details: {
            message: `${failedCollections.length} collections failed`,
            results,
            failed: failedCollections
          },
          timestamp: endTime
        };
      }

      return {
        service: 'collections',
        status: 'healthy',
        responseTime,
        details: {
          message: 'All collections accessible',
          results
        },
        timestamp: endTime
      };
    } catch (error) {
      const endTime = Date.now();
      return {
        service: 'collections',
        status: 'unhealthy',
        responseTime: endTime - startTime,
        details: { error: error.message, message: 'Collections check failed' },
        timestamp: endTime
      };
    }
  }

  /**
   * Check cache health
   */
  private async checkCacheHealth(): Promise<HealthCheckResult> {
    const startTime = Date.now();

    try {
      const cacheStats = payloadCache.getStats();
      const monitorStats = payloadMonitor.getStats(60000); // Last minute

      const endTime = Date.now();
      const responseTime = endTime - startTime;

      // Evaluate cache health
      let status: 'healthy' | 'degraded' | 'unhealthy' = 'healthy';
      const issues = [];

      if (monitorStats.cache.hitRate < 50) {
        status = 'degraded';
        issues.push('Low cache hit rate');
      }

      if (cacheStats.size > cacheStats.maxSize * 0.9) {
        status = 'degraded';
        issues.push('Cache near capacity');
      }

      return {
        service: 'cache',
        status,
        responseTime,
        details: {
          message: status === 'healthy' ? 'Cache performance healthy' : `Cache issues: ${issues.join(', ')}`,
          stats: cacheStats,
          monitorStats: monitorStats.cache,
          issues
        },
        timestamp: endTime
      };
    } catch (error) {
      const endTime = Date.now();
      return {
        service: 'cache',
        status: 'unhealthy',
        responseTime: endTime - startTime,
        details: { error: error.message, message: 'Cache health check failed' },
        timestamp: endTime
      };
    }
  }

  /**
   * Check system performance
   */
  private async checkSystemPerformance(): Promise<HealthCheckResult> {
    const startTime = Date.now();

    try {
      const memUsage = process.memoryUsage();
      const uptime = process.uptime();

      const endTime = Date.now();
      const responseTime = endTime - startTime;

      const memoryMB = memUsage.heapUsed / 1024 / 1024;
      const memoryLimit = 500; // 500MB limit

      let status: 'healthy' | 'degraded' | 'unhealthy' = 'healthy';
      const issues = [];

      if (memoryMB > memoryLimit * 0.8) {
        status = 'degraded';
        issues.push('High memory usage');
      }

      if (memoryMB > memoryLimit) {
        status = 'unhealthy';
        issues.push('Memory usage exceeds limit');
      }

      return {
        service: 'system-performance',
        status,
        responseTime,
        details: {
          message: status === 'healthy' ? 'System performance healthy' : `Performance issues: ${issues.join(', ')}`,
          memory: {
            used: `${memoryMB.toFixed(2)}MB`,
            limit: `${memoryLimit}MB`,
            percentage: `${((memoryMB / memoryLimit) * 100).toFixed(1)}%`
          },
          uptime: `${Math.round(uptime / 60)} minutes`,
          issues
        },
        timestamp: endTime
      };
    } catch (error) {
      const endTime = Date.now();
      return {
        service: 'system-performance',
        status: 'unhealthy',
        responseTime: endTime - startTime,
        details: { error: error.message, message: 'System performance check failed' },
        timestamp: endTime
      };
    }
  }

  /**
   * Check shutdown system health
   */
  private async checkShutdownSystem(): Promise<HealthCheckResult> {
    const startTime = Date.now();

    try {
      const isHealthy = payloadShutdown.healthCheck();
      const isShuttingDown = payloadShutdown.isSystemShuttingDown();

      const endTime = Date.now();
      const responseTime = endTime - startTime;

      if (isShuttingDown) {
        return {
          service: 'shutdown-system',
          status: 'degraded',
          responseTime,
          details: { message: 'System is currently shutting down' },
          timestamp: endTime
        };
      }

      if (!isHealthy) {
        return {
          service: 'shutdown-system',
          status: 'unhealthy',
          responseTime,
          details: { message: 'Shutdown system health check failed' },
          timestamp: endTime
        };
      }

      return {
        service: 'shutdown-system',
        status: 'healthy',
        responseTime,
        details: { message: 'Shutdown system healthy' },
        timestamp: endTime
      };
    } catch (error) {
      const endTime = Date.now();
      return {
        service: 'shutdown-system',
        status: 'unhealthy',
        responseTime: endTime - startTime,
        details: { error: error.message, message: 'Shutdown system check failed' },
        timestamp: endTime
      };
    }
  }

  /**
   * Log health report
   */
  private logHealthReport(result: SystemHealth): void {
    console.log('\n🏥 Payload Health Check Report');
    console.log('===============================');
    console.log(`Overall Status: ${result.overall.toUpperCase()}`);
    console.log(`Timestamp: ${new Date(result.timestamp).toISOString()}`);
    console.log(`Uptime: ${Math.round(result.uptime / 60)} minutes`);
    console.log(`Total Checks: ${result.summary.total}`);
    console.log(`Healthy: ${result.summary.healthy}`);
    console.log(`Degraded: ${result.summary.degraded}`);
    console.log(`Unhealthy: ${result.summary.unhealthy}`);
    console.log('');

    result.checks.forEach(check => {
      const status = check.status.toUpperCase();
      const time = `${check.responseTime}ms`;
      console.log(`${status === 'HEALTHY' ? '✅' : STATUS === 'DEGRADED' ? '⚠️' : '❌'} ${check.service} (${time}): ${check.details.message || 'OK'}`);
    });

    if (result.overall !== 'healthy') {
      console.log('\n💡 Recommendations:');
      result.checks
        .filter(c => c.status !== 'healthy')
        .forEach(check => {
          console.log(`  - ${check.service}: ${JSON.stringify(check.details, null, 2)}`);
        });
    }
    console.log('');
  }

  /**
   * Quick health check for API endpoints
   */
  async quickHealthCheck(): Promise<boolean> {
    try {
      const payload = await getPayloadClient();
      await payload.find({ collection: 'users', limit: 1 });
      return true;
    } catch {
      return false;
    }
  }
}

// Global health checker instance
export const payloadHealthChecker = new PayloadHealthChecker();

// Export for API route usage
export const createHealthCheckEndpoint = () => {
  return async () => {
    try {
      const health = await payloadHealthChecker.runFullHealthCheck();

      const statusCode = health.overall === 'healthy' ? 200 :
                        health.overall === 'degraded' ? 206 : 503;

      return new Response(JSON.stringify(health), {
        status: statusCode,
        headers: { 'Content-Type': 'application/json' }
      });
    } catch (error) {
      return new Response(JSON.stringify({
        overall: 'unhealthy',
        error: error.message,
        timestamp: Date.now()
      }), {
        status: 503,
        headers: { 'Content-Type': 'application/json' }
      });
    }
  };
};
