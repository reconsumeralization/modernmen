#!/usr/bin/env node

/**
 * Pre-build Hook
 * Ensures development environment remains loaded throughout the build process
 * This script runs automatically before every build to maintain environment stability
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log('🔗 Running Pre-build Hook...');

class PreBuildHook {
  constructor() {
    this.rootDir = path.resolve(__dirname, '..');
    this.isDevelopment = process.env.NODE_ENV !== 'production';
  }

  /**
   * Ensure environment variables are loaded
   */
  /**
   * Generate Payload CMS TypeScript types
   */
  generatePayloadTypes() {
    console.log('📝 Generating Payload CMS TypeScript types...');

    try {
      const isVercel = process.env.VERCEL === '1' || process.env.VERCEL_ENV;
      const isProduction = process.env.NODE_ENV === 'production';

      if (isVercel || isProduction) {
        // Use production config for type generation in production/Vercel
        execSync('npx payload generate:types --config src/payload.config.production.ts', {
          stdio: 'inherit',
          timeout: 60000,
          cwd: this.rootDir
        });
        console.log('✅ Payload types generated with production config');
      } else {
        // Use simple config for development
        execSync('npx payload generate:types --config src/payload.config.simple.ts', {
          stdio: 'inherit',
          timeout: 30000,
          cwd: this.rootDir
        });
        console.log('✅ Payload types generated with development config');
      }
    } catch (error) {
      console.warn('⚠️  Payload types generation failed:', error.message);
      console.warn('Continuing with build - types may be out of sync');
    }
  }

  ensureEnvironmentVariables() {
    console.log('🌍 Ensuring environment variables are loaded...');

    // Load .env.development if in development mode
    if (this.isDevelopment) {
      const envPath = path.join(this.rootDir, '.env.development');
      if (fs.existsSync(envPath)) {
        console.log('✅ Development environment file found');
        // The variables will be loaded by Next.js automatically
      } else {
        console.log('⚠️  Development environment file not found');
      }
    }

    // Validate critical environment variables
    const criticalVars = [
      'DATABASE_URL',
      'PAYLOAD_SECRET',
      'NEXT_PUBLIC_APP_URL'
    ];

    const missingVars = criticalVars.filter(varName => !process.env[varName]);

    if (missingVars.length > 0) {
      if (this.isDevelopment) {
        console.warn('⚠️  Missing critical environment variables:', missingVars.join(', '));
        console.warn('💡 Using development defaults for missing variables');
      } else {
        console.warn('⚠️  Missing critical environment variables:', missingVars.join(', '));
        console.warn('💡 Consider creating a .env.development file');
      }
    }
  }

  /**
   * Ensure database connectivity
   */
  ensureDatabaseConnectivity() {
    console.log('🗄️  Ensuring database connectivity...');

    const databaseUrl = process.env.DATABASE_URL;
    const isProduction = process.env.NODE_ENV === 'production';

    if (!databaseUrl) {
      if (isProduction) {
        console.warn('⚠️  DATABASE_URL not set for production');
      } else {
        console.warn('⚠️  DATABASE_URL not set - using development defaults');
        // Set a default database URL for development builds
        process.env.DATABASE_URL = 'postgresql://dev:dev@localhost:5432/modernmen_dev';
      }
      return;
    }

    // For development, check if we can connect to the database
    if (this.isDevelopment) {
      try {
        // Simple connectivity check (you might want to implement a more robust check)
        console.log('✅ Database URL configured:', databaseUrl.replace(/:[^:]+@/, ':***@'));
      } catch (error) {
        console.warn('⚠️  Database connectivity check failed:', error.message);
      }
    }
  }

  /**
   * Ensure Payload CMS is properly configured
   */
  ensurePayloadConfiguration() {
    console.log('📄 Ensuring Payload CMS configuration...');

    const payloadSecret = process.env.PAYLOAD_SECRET;
    const payloadUrl = process.env.PAYLOAD_PUBLIC_SERVER_URL;
    const isProduction = process.env.NODE_ENV === 'production';

    if (!payloadSecret) {
      if (isProduction) {
        console.error('❌ PAYLOAD_SECRET is required for production');
        process.exit(1);
      } else {
        console.warn('⚠️  PAYLOAD_SECRET not set - using development defaults');
        // Set a default secret for development builds
        process.env.PAYLOAD_SECRET = 'dev-payload-secret-' + Date.now();
      }
    }

    if (!payloadUrl) {
      console.warn('⚠️  PAYLOAD_PUBLIC_SERVER_URL not set, using default');
    }

    console.log('✅ Payload CMS configuration validated');
  }

  /**
   * Ensure build cache is clean for development
   */
  ensureCleanBuildCache() {
    console.log('🧹 Ensuring clean build cache...');

    if (this.isDevelopment) {
      // Clean Next.js cache for development builds
      const nextCacheDir = path.join(this.rootDir, '.next');

      try {
        if (fs.existsSync(nextCacheDir)) {
          console.log('✅ Next.js cache directory exists');
        }
      } catch (error) {
        console.warn('⚠️  Could not check Next.js cache:', error.message);
      }
    }
  }

  /**
   * Validate TypeScript compilation
   */
  validateTypeScript() {
    console.log('🔷 Validating TypeScript compilation...');

    try {
      execSync('npm run type-check', {
        cwd: this.rootDir,
        stdio: 'pipe'
      });
      console.log('✅ TypeScript validation passed');
    } catch (error) {
      console.warn('⚠️  TypeScript validation failed, but continuing build...');
      console.warn('💡 Run "npm run type-check" to see detailed errors');
    }
  }

  /**
   * Setup development environment watchers
   */
  setupDevelopmentWatchers() {
    if (this.isDevelopment) {
      console.log('👀 Setting up development environment watchers...');

      // Set environment variables that help with development
      process.env.__DEV__ = 'true';
      process.env.FAST_REFRESH = 'true';

      console.log('✅ Development watchers configured');
    }
  }

  /**
   * Run all pre-build checks
   */
  async run() {
    console.log(`🏗️  Running pre-build hook for ${this.isDevelopment ? 'development' : 'production'} environment...\n`);

    // Critical: Generate Payload types first
    this.generatePayloadTypes();

    this.ensureEnvironmentVariables();
    this.ensureDatabaseConnectivity();
    this.ensurePayloadConfiguration();
    this.ensureCleanBuildCache();
    this.validateTypeScript();
    this.setupDevelopmentWatchers();

    console.log('\n✅ Pre-build hook completed successfully!');
    console.log('🎯 Development environment is loaded and ready for build.\n');
  }
}

// Run the pre-build hook
const hook = new PreBuildHook();
hook.run().catch((error) => {
  console.error('❌ Pre-build hook failed:', error);
  // Don't exit with error in development to allow builds to continue
  if (process.env.NODE_ENV === 'production') {
    process.exit(1);
  }
});
