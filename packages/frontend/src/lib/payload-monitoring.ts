/**
 * Payload CMS Performance Monitoring for Vercel Production
 * Monitors query performance, cache hit rates, and system health
 */

interface QueryMetrics {
  collection: string;
  operation: 'find' | 'findByID' | 'create' | 'update' | 'delete';
  duration: number;
  timestamp: number;
  success: boolean;
  error?: string;
  recordCount?: number;
  querySize?: number;
}

interface CacheMetrics {
  collection: string;
  operation: 'hit' | 'miss' | 'invalidate';
  timestamp: number;
  key?: string;
}

interface HealthMetrics {
  timestamp: number;
  memoryUsage: NodeJS.MemoryUsage;
  activeConnections: number;
  cacheSize: number;
  uptime: number;
}

class PayloadPerformanceMonitor {
  private queryMetrics: QueryMetrics[] = [];
  private cacheMetrics: CacheMetrics[] = [];
  private healthMetrics: HealthMetrics[] = [];
  private readonly maxMetrics = 1000;
  private isEnabled: boolean;

  constructor() {
    this.isEnabled = process.env.NODE_ENV === 'production' ||
                     process.env.VERCEL === '1' ||
                     process.env.ENABLE_PAYLOAD_MONITORING === 'true';
  }

  /**
   * Record query performance metrics
   */
  recordQuery(query: Omit<QueryMetrics, 'timestamp'>): void {
    if (!this.isEnabled) return;

    const metric: QueryMetrics = {
      ...query,
      timestamp: Date.now(),
    };

    this.queryMetrics.push(metric);

    // Maintain max metrics limit
    if (this.queryMetrics.length > this.maxMetrics) {
      this.queryMetrics = this.queryMetrics.slice(-this.maxMetrics);
    }

    // Log slow queries
    if (metric.duration > 1000) { // > 1 second
      console.warn(`🐌 Slow Payload Query: ${metric.collection}.${metric.operation} took ${metric.duration}ms`);
    }

    // Log failed queries
    if (!metric.success) {
      console.error(`❌ Failed Payload Query: ${metric.collection}.${metric.operation}`, metric.error);
    }
  }

  /**
   * Record cache performance metrics
   */
  recordCacheHit(collection: string, key?: string): void {
    if (!this.isEnabled) return;

    this.cacheMetrics.push({
      collection,
      operation: 'hit',
      timestamp: Date.now(),
      key,
    });

    this.maintainCacheMetricsLimit();
  }

  recordCacheMiss(collection: string, key?: string): void {
    if (!this.isEnabled) return;

    this.cacheMetrics.push({
      collection,
      operation: 'miss',
      timestamp: Date.now(),
      key,
    });

    this.maintainCacheMetricsLimit();
  }

  recordCacheInvalidation(collection: string, key?: string): void {
    if (!this.isEnabled) return;

    this.cacheMetrics.push({
      collection,
      operation: 'invalidate',
      timestamp: Date.now(),
      key,
    });

    this.maintainCacheMetricsLimit();
  }

  private maintainCacheMetricsLimit(): void {
    if (this.cacheMetrics.length > this.maxMetrics) {
      this.cacheMetrics = this.cacheMetrics.slice(-this.maxMetrics);
    }
  }

  /**
   * Record health metrics
   */
  recordHealthMetrics(activeConnections: number, cacheSize: number): void {
    if (!this.isEnabled) return;

    const metric: HealthMetrics = {
      timestamp: Date.now(),
      memoryUsage: process.memoryUsage(),
      activeConnections,
      cacheSize,
      uptime: process.uptime(),
    };

    this.healthMetrics.push(metric);

    // Maintain max metrics limit
    if (this.healthMetrics.length > this.maxMetrics) {
      this.healthMetrics = this.healthMetrics.slice(-this.maxMetrics);
    }

    // Log memory warnings
    const memoryUsageMB = metric.memoryUsage.heapUsed / 1024 / 1024;
    if (memoryUsageMB > 400) { // > 400MB
      console.warn(`⚠️ High Memory Usage: ${memoryUsageMB.toFixed(2)}MB`);
    }
  }

  /**
   * Get performance statistics
   */
  getStats(timeRangeMs: number = 300000): { // Default 5 minutes
    queries: {
      total: number;
      successRate: number;
      averageDuration: number;
      slowQueries: number;
      failedQueries: number;
      byCollection: Record<string, {
        count: number;
        avgDuration: number;
        successRate: number;
      }>;
    };
    cache: {
      hitRate: number;
      totalRequests: number;
      hits: number;
      misses: number;
      invalidations: number;
    };
    health: {
      averageMemoryUsage: number;
      peakMemoryUsage: number;
      averageActiveConnections: number;
      uptime: number;
    };
  } {
    const now = Date.now();
    const cutoff = now - timeRangeMs;

    // Filter metrics by time range
    const recentQueries = this.queryMetrics.filter(m => m.timestamp >= cutoff);
    const recentCache = this.cacheMetrics.filter(m => m.timestamp >= cutoff);
    const recentHealth = this.healthMetrics.filter(m => m.timestamp >= cutoff);

    // Calculate query statistics
    const totalQueries = recentQueries.length;
    const successfulQueries = recentQueries.filter(q => q.success).length;
    const failedQueries = totalQueries - successfulQueries;
    const slowQueries = recentQueries.filter(q => q.duration > 1000).length;
    const totalDuration = recentQueries.reduce((sum, q) => sum + q.duration, 0);
    const averageDuration = totalQueries > 0 ? totalDuration / totalQueries : 0;

    // Group queries by collection
    const byCollection: Record<string, { count: number; totalDuration: number; successful: number }> = {};
    recentQueries.forEach(query => {
      if (!byCollection[query.collection]) {
        byCollection[query.collection] = { count: 0, totalDuration: 0, successful: 0 };
      }
      byCollection[query.collection].count++;
      byCollection[query.collection].totalDuration += query.duration;
      if (query.success) {
        byCollection[query.collection].successful++;
      }
    });

    const collectionStats = Object.entries(byCollection).reduce((acc, [collection, stats]) => {
      acc[collection] = {
        count: stats.count,
        avgDuration: stats.count > 0 ? stats.totalDuration / stats.count : 0,
        successRate: stats.count > 0 ? (stats.successful / stats.count) * 100 : 0,
      };
      return acc;
    }, {} as Record<string, { count: number; avgDuration: number; successRate: number }>);

    // Calculate cache statistics
    const totalCacheRequests = recentCache.length;
    const cacheHits = recentCache.filter(c => c.operation === 'hit').length;
    const cacheMisses = recentCache.filter(c => c.operation === 'miss').length;
    const cacheInvalidations = recentCache.filter(c => c.operation === 'invalidate').length;
    const cacheHitRate = totalCacheRequests > 0 ? (cacheHits / totalCacheRequests) * 100 : 0;

    // Calculate health statistics
    const totalMemoryUsage = recentHealth.reduce((sum, h) => sum + h.memoryUsage.heapUsed, 0);
    const averageMemoryUsage = recentHealth.length > 0 ? totalMemoryUsage / recentHealth.length : 0;
    const peakMemoryUsage = Math.max(...recentHealth.map(h => h.memoryUsage.heapUsed), 0);
    const averageActiveConnections = recentHealth.length > 0
      ? recentHealth.reduce((sum, h) => sum + h.activeConnections, 0) / recentHealth.length
      : 0;

    return {
      queries: {
        total: totalQueries,
        successRate: totalQueries > 0 ? (successfulQueries / totalQueries) * 100 : 0,
        averageDuration,
        slowQueries,
        failedQueries,
        byCollection: collectionStats,
      },
      cache: {
        hitRate: cacheHitRate,
        totalRequests: totalCacheRequests,
        hits: cacheHits,
        misses: cacheMisses,
        invalidations: cacheInvalidations,
      },
      health: {
        averageMemoryUsage,
        peakMemoryUsage,
        averageActiveConnections,
        uptime: process.uptime(),
      },
    };
  }

  /**
   * Log performance report
   */
  logPerformanceReport(timeRangeMs: number = 300000): void {
    if (!this.isEnabled) return;

    const stats = this.getStats(timeRangeMs);

    console.log('📊 Payload Performance Report');
    console.log('==============================');
    console.log(`Period: Last ${Math.round(timeRangeMs / 60000)} minutes`);
    console.log('');

    console.log('🔍 Query Performance:');
    console.log(`  Total Queries: ${stats.queries.total}`);
    console.log(`  Success Rate: ${stats.queries.successRate.toFixed(1)}%`);
    console.log(`  Average Duration: ${stats.queries.averageDuration.toFixed(2)}ms`);
    console.log(`  Slow Queries (>1s): ${stats.queries.slowQueries}`);
    console.log(`  Failed Queries: ${stats.queries.failedQueries}`);
    console.log('');

    if (Object.keys(stats.queries.byCollection).length > 0) {
      console.log('📋 By Collection:');
      Object.entries(stats.queries.byCollection).forEach(([collection, stats]) => {
        console.log(`  ${collection}: ${stats.count} queries, ${stats.avgDuration.toFixed(2)}ms avg, ${stats.successRate.toFixed(1)}% success`);
      });
      console.log('');
    }

    console.log('💾 Cache Performance:');
    console.log(`  Hit Rate: ${stats.cache.hitRate.toFixed(1)}%`);
    console.log(`  Total Requests: ${stats.cache.totalRequests}`);
    console.log(`  Hits: ${stats.cache.hits}`);
    console.log(`  Misses: ${stats.cache.misses}`);
    console.log(`  Invalidations: ${stats.cache.invalidations}`);
    console.log('');

    console.log('🏥 System Health:');
    console.log(`  Average Memory: ${(stats.health.averageMemoryUsage / 1024 / 1024).toFixed(2)}MB`);
    console.log(`  Peak Memory: ${(stats.health.peakMemoryUsage / 1024 / 1024).toFixed(2)}MB`);
    console.log(`  Average Connections: ${stats.health.averageActiveConnections.toFixed(1)}`);
    console.log(`  Uptime: ${Math.round(stats.health.uptime / 60)} minutes`);
    console.log('');

    // Performance recommendations
    const recommendations: string[] = [];

    if (stats.queries.successRate < 95) {
      recommendations.push('⚠️ Low query success rate - check database connectivity');
    }

    if (stats.queries.averageDuration > 500) {
      recommendations.push('⚠️ High average query duration - consider database optimization');
    }

    if (stats.cache.hitRate < 70) {
      recommendations.push('⚠️ Low cache hit rate - review caching strategy');
    }

    if (stats.health.averageMemoryUsage > 300 * 1024 * 1024) { // 300MB
      recommendations.push('⚠️ High memory usage - monitor for memory leaks');
    }

    if (recommendations.length > 0) {
      console.log('💡 Recommendations:');
      recommendations.forEach(rec => console.log(`  ${rec}`));
      console.log('');
    }
  }
}

// Global monitor instance
export const payloadMonitor = new PayloadPerformanceMonitor();

// Export types for use in other modules
export type { QueryMetrics, CacheMetrics, HealthMetrics };
