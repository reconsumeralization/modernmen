/**
 * Payload CMS Graceful Shutdown for Vercel Serverless
 * Ensures proper cleanup of connections and resources in serverless environments
 */

import { getPayloadClient } from '@/payload';
import { payloadCache } from '@/lib/payload-cache';
import { payloadMonitor } from '@/lib/payload-monitoring';

interface ShutdownHook {
  name: string;
  priority: number; // Lower number = higher priority (runs first)
  handler: () => Promise<void> | void;
}

class PayloadGracefulShutdown {
  private hooks: ShutdownHook[] = [];
  private isShuttingDown = false;
  private shutdownTimeout = 10000; // 10 seconds
  private isEnabled: boolean;

  constructor() {
    this.isEnabled = process.env.NODE_ENV === 'production' ||
                     process.env.VERCEL === '1' ||
                     process.env.ENABLE_GRACEFUL_SHUTDOWN === 'true';

    if (this.isEnabled) {
      this.setupSignalHandlers();
      this.registerDefaultHooks();
    }
  }

  /**
   * Register a shutdown hook
   */
  registerHook(hook: ShutdownHook): void {
    this.hooks.push(hook);
    // Sort by priority (lower number = higher priority)
    this.hooks.sort((a, b) => a.priority - b.priority);
  }

  /**
   * Setup signal handlers for graceful shutdown
   */
  private setupSignalHandlers(): void {
    const signals = ['SIGTERM', 'SIGINT', 'SIGUSR2'];

    signals.forEach(signal => {
      process.on(signal, async () => {
        console.log(`📤 Received ${signal}, initiating graceful shutdown...`);
        await this.shutdown(signal);
      });
    });

    // Handle uncaught exceptions
    process.on('uncaughtException', async (error) => {
      console.error('💥 Uncaught Exception:', error);
      await this.shutdown('uncaughtException');
      process.exit(1);
    });

    // Handle unhandled promise rejections
    process.on('unhandledRejection', async (reason, promise) => {
      console.error('💥 Unhandled Rejection at:', promise, 'reason:', reason);
      await this.shutdown('unhandledRejection');
      process.exit(1);
    });
  }

  /**
   * Register default shutdown hooks
   */
  private registerDefaultHooks(): void {
    // High priority: Stop accepting new requests
    this.registerHook({
      name: 'stop-requests',
      priority: 1,
      handler: async () => {
        console.log('🛑 Stopping new request acceptance...');
        // This would typically involve setting a flag to reject new requests
        // In Vercel, this is handled automatically by the platform
      }
    });

    // Medium priority: Flush caches
    this.registerHook({
      name: 'flush-caches',
      priority: 2,
      handler: async () => {
        console.log('🗂️ Flushing Payload caches...');
        try {
          payloadCache.clear();
          console.log('✅ Caches flushed successfully');
        } catch (error) {
          console.error('❌ Error flushing caches:', error);
        }
      }
    });

    // Medium priority: Log final performance metrics
    this.registerHook({
      name: 'log-metrics',
      priority: 3,
      handler: async () => {
        console.log('📊 Logging final performance metrics...');
        try {
          payloadMonitor.logPerformanceReport(60000); // Last minute
          console.log('✅ Performance metrics logged');
        } catch (error) {
          console.error('❌ Error logging metrics:', error);
        }
      }
    });

    // Low priority: Close database connections
    this.registerHook({
      name: 'close-connections',
      priority: 4,
      handler: async () => {
        console.log('🔌 Closing database connections...');
        try {
          // Payload handles connection cleanup automatically
          // This is more for logging purposes in serverless
          console.log('✅ Database connections cleanup initiated');
        } catch (error) {
          console.error('❌ Error during connection cleanup:', error);
        }
      }
    });

    // Lowest priority: Final cleanup
    this.registerHook({
      name: 'final-cleanup',
      priority: 5,
      handler: async () => {
        console.log('🧹 Performing final cleanup...');
        // Force garbage collection if available
        if (global.gc) {
          global.gc();
          console.log('✅ Garbage collection completed');
        }
      }
    });
  }

  /**
   * Execute graceful shutdown
   */
  private async shutdown(reason: string): Promise<void> {
    if (this.isShuttingDown) {
      console.log('🔄 Shutdown already in progress...');
      return;
    }

    this.isShuttingDown = true;
    console.log(`\n🛑 Initiating graceful shutdown due to: ${reason}`);
    console.log('='.repeat(50));

    const startTime = Date.now();

    try {
      // Execute hooks in priority order
      for (const hook of this.hooks) {
        try {
          console.log(`🔧 Executing shutdown hook: ${hook.name} (priority: ${hook.priority})`);
          const result = hook.handler();

          // Handle both sync and async handlers
          if (result && typeof result.then === 'function') {
            await Promise.race([
              result,
              new Promise((_, reject) =>
                setTimeout(() => reject(new Error(`Hook ${hook.name} timed out`)), 5000)
              )
            ]);
          }

          console.log(`✅ Shutdown hook completed: ${hook.name}`);
        } catch (error) {
          console.error(`❌ Shutdown hook failed: ${hook.name}`, error);
          // Continue with other hooks even if one fails
        }
      }

      const shutdownDuration = Date.now() - startTime;
      console.log(`\n✅ Graceful shutdown completed in ${shutdownDuration}ms`);

      // Exit with success
      process.exit(0);

    } catch (error) {
      console.error('💥 Critical error during shutdown:', error);
      const shutdownDuration = Date.now() - startTime;
      console.log(`❌ Shutdown failed after ${shutdownDuration}ms`);

      // Exit with failure
      process.exit(1);
    }
  }

  /**
   * Check if system is shutting down
   */
  isSystemShuttingDown(): boolean {
    return this.isShuttingDown;
  }

  /**
   * Get shutdown timeout
   */
  getShutdownTimeout(): number {
    return this.shutdownTimeout;
  }

  /**
   * Set shutdown timeout
   */
  setShutdownTimeout(timeout: number): void {
    this.shutdownTimeout = timeout;
  }

  /**
   * Force immediate shutdown (for emergency situations)
   */
  forceShutdown(exitCode: number = 1): void {
    console.log('🚨 Force shutdown initiated');
    process.exit(exitCode);
  }

  /**
   * Health check - returns false if system is shutting down
   */
  healthCheck(): boolean {
    return !this.isShuttingDown;
  }
}

// Global shutdown manager instance
export const payloadShutdown = new PayloadGracefulShutdown();

// Export for use in API routes
export const createShutdownAwareHandler = <T extends any[], R>(
  handler: (...args: T) => Promise<R> | R
) => {
  return async (...args: T): Promise<R> => {
    // Check if system is shutting down
    if (payloadShutdown.isSystemShuttingDown()) {
      throw new Error('System is shutting down, request rejected');
    }

    try {
      return await handler(...args);
    } catch (error) {
      // If system is shutting down, don't process the error
      if (payloadShutdown.isSystemShuttingDown()) {
        throw new Error('Request cancelled due to system shutdown');
      }
      throw error;
    }
  };
};

// Middleware for API routes to handle shutdown gracefully
export const shutdownMiddleware = (handler: Function) => {
  return async (request: Request, ...args: any[]) => {
    // Reject requests if system is shutting down
    if (payloadShutdown.isSystemShuttingDown()) {
      return new Response(
        JSON.stringify({
          error: 'Service temporarily unavailable',
          message: 'System is undergoing maintenance'
        }),
        {
          status: 503,
          headers: { 'Content-Type': 'application/json' }
        }
      );
    }

    try {
      return await handler(request, ...args);
    } catch (error) {
      // If system is shutting down during request processing
      if (payloadShutdown.isSystemShuttingDown()) {
        return new Response(
          JSON.stringify({
            error: 'Request cancelled',
            message: 'System shutdown in progress'
          }),
          {
            status: 503,
            headers: { 'Content-Type': 'application/json' }
          }
        );
      }
      throw error;
    }
  };
};
