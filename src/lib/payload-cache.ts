/**
 * Payload CMS Caching Strategy for Vercel Edge Functions
 * Implements intelligent caching to reduce database load and improve performance
 */

import { getPayloadClient } from '@/payload';
import { payloadMonitor } from '@/lib/payload-monitoring';

interface CacheEntry<T> {
  data: T;
  timestamp: number;
  ttl: number;
}

interface CacheConfig {
  defaultTTL: number;
  maxSize: number;
  enableCompression?: boolean;
}

class PayloadCache {
  private cache = new Map<string, CacheEntry<any>>();
  private config: CacheConfig;

  constructor(config: Partial<CacheConfig> = {}) {
    this.config = {
      defaultTTL: 300000, // 5 minutes
      maxSize: 1000,
      enableCompression: false,
      ...config,
    };
  }

  /**
   * Generate cache key from collection and query parameters
   */
  private generateKey(collection: string, params: any = {}): string {
    const sortedParams = Object.keys(params)
      .sort()
      .reduce((result, key) => {
        result[key] = params[key];
        return result;
      }, {} as any);

    return `${collection}:${JSON.stringify(sortedParams)}`;
  }

  /**
   * Check if cache entry is valid
   */
  private isValid(entry: CacheEntry<any>): boolean {
    return Date.now() - entry.timestamp < entry.ttl;
  }

  /**
   * Clean expired entries
   */
  private cleanExpired(): void {
    for (const [key, entry] of this.cache.entries()) {
      if (!this.isValid(entry)) {
        this.cache.delete(key);
      }
    }
  }

  /**
   * Enforce cache size limits
   */
  private enforceSizeLimit(): void {
    if (this.cache.size > this.config.maxSize) {
      // Remove oldest entries (simple LRU approximation)
      const entries = Array.from(this.cache.entries());
      entries.sort((a, b) => a[1].timestamp - b[1].timestamp);

      const toRemove = entries.slice(0, this.cache.size - this.config.maxSize);
      toRemove.forEach(([key]) => this.cache.delete(key));
    }
  }

  /**
   * Get cached data or fetch from Payload
   */
  async get<T = any>(
    collection: string,
    query: any = {},
    options: {
      ttl?: number;
      bypass?: boolean;
      populate?: string[];
    } = {}
  ): Promise<T> {
    const key = this.generateKey(collection, { ...query, populate: options.populate });
    const { ttl = this.config.defaultTTL, bypass = false } = options;

    // Check cache first
    if (!bypass) {
      const cached = this.cache.get(key);
      if (cached && this.isValid(cached)) {
        payloadMonitor.recordCacheHit(collection, key);
        return cached.data;
      } else if (cached) {
        payloadMonitor.recordCacheMiss(collection, key);
      }
    }

    // Fetch from Payload
    const payload = await getPayloadClient();
    const result = await payload.find({
      collection,
      where: query.where || {},
      page: query.page || 1,
      limit: Math.min(query.limit || 10, 100),
      sort: query.sort || '-createdAt',
      ...(options.populate && { populate: options.populate }),
    });

    // Cache the result
    this.cache.set(key, {
      data: result,
      timestamp: Date.now(),
      ttl,
    });

    // Maintenance
    this.cleanExpired();
    this.enforceSizeLimit();

    return result;
  }

  /**
   * Invalidate cache entries for a collection
   */
  invalidate(collection: string, specificQuery?: any): void {
    if (specificQuery) {
      const key = this.generateKey(collection, specificQuery);
      payloadMonitor.recordCacheInvalidation(collection, key);
      this.cache.delete(key);
    } else {
      // Invalidate all entries for this collection
      let invalidationCount = 0;
      for (const [key] of this.cache.entries()) {
        if (key.startsWith(`${collection}:`)) {
          payloadMonitor.recordCacheInvalidation(collection, key);
          this.cache.delete(key);
          invalidationCount++;
        }
      }
      console.log(`🗑️ Invalidated ${invalidationCount} cache entries for ${collection}`);
    }
  }

  /**
   * Clear entire cache
   */
  clear(): void {
    this.cache.clear();
  }

  /**
   * Get cache statistics
   */
  getStats(): {
    size: number;
    maxSize: number;
    hitRate?: number;
  } {
    return {
      size: this.cache.size,
      maxSize: this.config.maxSize,
    };
  }
}

// Global cache instance
const payloadCache = new PayloadCache({
  defaultTTL: process.env.NODE_ENV === 'production' ? 600000 : 300000, // 10 min prod, 5 min dev
  maxSize: 500,
});

/**
 * Cached Payload operations for common use cases
 */
export const cachedPayload = {
  /**
   * Get services with caching
   */
  async getServices(options: { limit?: number; category?: string } = {}) {
    const { limit = 20, category } = options;
    const query: any = { limit };

    if (category && category !== 'all') {
      query.where = { category: { equals: category } };
    }

    return payloadCache.get('services', query, { ttl: 600000 }); // 10 minutes
  },

  /**
   * Get stylists with caching
   */
  async getStylists(options: { limit?: number; active?: boolean } = {}) {
    const { limit = 20, active } = options;
    const query: any = { limit };

    if (active !== undefined) {
      query.where = { isActive: { equals: active } };
    }

    return payloadCache.get('stylists', query, {
      ttl: 300000, // 5 minutes
      populate: ['profileImage']
    });
  },

  /**
   * Get customers with caching
   */
  async getCustomers(options: { limit?: number; page?: number } = {}) {
    const { limit = 20, page = 1 } = options;
    const query = { limit, page };

    return payloadCache.get('customers', query, { ttl: 600000 }); // 10 minutes
  },

  /**
   * Get appointments with caching
   */
  async getAppointments(options: {
    limit?: number;
    status?: string;
    customer?: string;
    stylist?: string;
  } = {}) {
    const { limit = 20, status, customer, stylist } = options;
    const query: any = { limit };

    const where: any = {};
    if (status && status !== 'all') {
      where.status = { equals: status };
    }
    if (customer) {
      where.customer = { equals: customer };
    }
    if (stylist) {
      where.stylist = { equals: stylist };
    }

    if (Object.keys(where).length > 0) {
      query.where = where;
    }

    return payloadCache.get('appointments', query, {
      ttl: 60000, // 1 minute (frequently changing data)
      populate: ['customer', 'service', 'stylist']
    });
  },

  /**
   * Invalidate cache for specific operations
   */
  invalidate: payloadCache.invalidate.bind(payloadCache),

  /**
   * Clear entire cache
   */
  clear: payloadCache.clear.bind(payloadCache),

  /**
   * Get cache statistics
   */
  getStats: payloadCache.getStats.bind(payloadCache),
};

export default payloadCache;
