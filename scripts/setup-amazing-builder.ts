#!/usr/bin/env tsx

// 🎯 SETUP AMAZING BUILDER - Complete System Initialization
import { execSync } from 'child_process'
import fs from 'fs'
import path from 'path'
import { logger } from '../src/lib/logger'

interface SetupOptions {
  skipDependencies?: boolean
  skipDatabase?: boolean
  skipTypes?: boolean
  skipBuild?: boolean
  environment?: 'development' | 'staging' | 'production'
}

class AmazingBuilderSetup {
  private options: SetupOptions
  private projectRoot: string

  constructor(options: SetupOptions = {}) {
    this.options = {
      skipDependencies: false,
      skipDatabase: false,
      skipTypes: false,
      skipBuild: false,
      environment: 'development',
      ...options
    }
    this.projectRoot = path.resolve(process.cwd())
  }

  // 🎯 Main setup function
  async setup(): Promise<void> {
    logger.info('🚀 Starting Amazing Builder Setup...')

    try {
      await this.stepWelcome()
      await this.stepDependencies()
      await this.stepEnvironment()
      await this.stepDatabase()
      await this.stepTypes()
      await this.stepBuild()
      await this.stepFinal()

      logger.info('✅ Amazing Builder Setup Complete!')
      this.showSuccessMessage()

    } catch (error) {
      logger.error('❌ Setup failed:', error)
      this.showErrorMessage(error)
      process.exit(1)
    }
  }

  private async stepWelcome(): Promise<void> {
    logger.info('🎯 Welcome to Modern Men Amazing Builder Setup!')
    logger.info('==============================================')
    logger.info('')
    logger.info('This setup will:')
    logger.info('  ✅ Install all dependencies')
    logger.info('  ✅ Configure environment variables')
    logger.info('  ✅ Setup Payload CMS + Supabase integration')
    logger.info('  ✅ Generate TypeScript types')
    logger.info('  ✅ Build the amazing builder system')
    logger.info('')
    logger.info('Let\'s make something amazing! 🚀')
    logger.info('')
  }

  private async stepDependencies(): Promise<void> {
    if (this.options.skipDependencies) {
      logger.info('⏭️ Skipping dependency installation')
      return
    }

    logger.info('📦 Installing dependencies...')

    try {
      // Install dependencies
      execSync('npm install', {
        stdio: 'inherit',
        cwd: this.projectRoot
      })

      logger.info('✅ Dependencies installed successfully')
    } catch (error) {
      throw new Error(`Failed to install dependencies: ${error.message}`)
    }
  }

  private async stepEnvironment(): Promise<void> {
    logger.info('🔧 Setting up environment...')

    const envExample = path.join(this.projectRoot, '.env.example')
    const envFile = path.join(this.projectRoot, '.env.local')

    // Check if .env.local exists
    if (fs.existsSync(envFile)) {
      logger.info('✅ Environment file already exists')
      return
    }

    // Copy from .env.example if it exists
    if (fs.existsSync(envExample)) {
      fs.copyFileSync(envExample, envFile)
      logger.info('✅ Environment file created from template')

      // Update with development defaults
      this.updateEnvFile(envFile)
    } else {
      // Create basic .env.local
      this.createBasicEnvFile(envFile)
    }
  }

  private updateEnvFile(envPath: string): void {
    let envContent = fs.readFileSync(envPath, 'utf-8')

    // Update development-specific values
    envContent = envContent.replace(
      /NEXTAUTH_URL=.*/,
      'NEXTAUTH_URL=http://localhost:3000'
    )

    envContent = envContent.replace(
      /PAYLOAD_PUBLIC_SERVER_URL=.*/,
      'PAYLOAD_PUBLIC_SERVER_URL=http://localhost:3000'
    )

    fs.writeFileSync(envPath, envContent)
    logger.info('✅ Environment file updated with development defaults')
  }

  private createBasicEnvFile(envPath: string): void {
    const basicEnv = `# Modern Men Amazing Builder Environment
# Copy this file to .env.local and fill in your values

# NextAuth.js
NEXTAUTH_SECRET=your-nextauth-secret-here
NEXTAUTH_URL=http://localhost:3000

# Payload CMS
PAYLOAD_SECRET=your-payload-secret-here
PAYLOAD_PUBLIC_SERVER_URL=http://localhost:3000

# Supabase
NEXT_PUBLIC_SUPABASE_URL=http://127.0.0.1:54321
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-supabase-service-role-key

# Database
DATABASE_URL=postgresql://postgres:postgres@127.0.0.1:54322/postgres

# Email (optional)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password

# File Upload (optional)
CLOUDINARY_CLOUD_NAME=your-cloudinary-name
CLOUDINARY_API_KEY=your-cloudinary-key
CLOUDINARY_API_SECRET=your-cloudinary-secret

# Analytics (optional)
GOOGLE_ANALYTICS_ID=GA_MEASUREMENT_ID
`

    fs.writeFileSync(envPath, basicEnv)
    logger.info('✅ Basic environment file created')
    logger.info('⚠️ Please update .env.local with your actual values')
  }

  private async stepDatabase(): Promise<void> {
    if (this.options.skipDatabase) {
      logger.info('⏭️ Skipping database setup')
      return
    }

    logger.info('💾 Setting up database integration...')

    try {
      // Run database migrations
      execSync('npm run payload:migrate', {
        stdio: 'inherit',
        cwd: this.projectRoot
      })

      // Seed initial data
      execSync('npm run payload:seed', {
        stdio: 'inherit',
        cwd: this.projectRoot
      })

      logger.info('✅ Database setup complete')
    } catch (error) {
      logger.warn('⚠️ Database setup encountered issues (this is normal for first run)')
      logger.warn('   Run "npm run payload:migrate" and "npm run payload:seed" manually after setup')
    }
  }

  private async stepTypes(): Promise<void> {
    if (this.options.skipTypes) {
      logger.info('⏭️ Skipping type generation')
      return
    }

    logger.info('🎯 Generating TypeScript types...')

    try {
      // Generate Payload types
      execSync('npm run payload:generate-types', {
        stdio: 'inherit',
        cwd: this.projectRoot
      })

      // Generate custom types
      execSync('npm run generate:types', {
        stdio: 'inherit',
        cwd: this.projectRoot
      })

      logger.info('✅ TypeScript types generated')
    } catch (error) {
      logger.warn('⚠️ Type generation encountered issues')
      logger.warn('   Run "npm run generate:types" manually after setup')
    }
  }

  private async stepBuild(): Promise<void> {
    if (this.options.skipBuild) {
      logger.info('⏭️ Skipping build')
      return
    }

    logger.info('🔨 Building the amazing system...')

    try {
      // Build the application
      execSync('npm run build', {
        stdio: 'inherit',
        cwd: this.projectRoot
      })

      logger.info('✅ Build completed successfully')
    } catch (error) {
      logger.warn('⚠️ Build encountered issues')
      logger.warn('   Some features may not work until dependencies are resolved')
    }
  }

  private async stepFinal(): Promise<void> {
    logger.info('🎉 Finalizing setup...')

    // Create setup completion marker
    const setupMarker = path.join(this.projectRoot, '.amazing-builder-setup')
    fs.writeFileSync(setupMarker, new Date().toISOString())

    logger.info('✅ Setup finalized')
  }

  private showSuccessMessage(): void {
    console.log('')
    console.log('🎉🎉🎉 AMAZING BUILDER SETUP COMPLETE! 🎉🎉🎉')
    console.log('')
    console.log('🚀 Ready to build amazing things!')
    console.log('')
    console.log('📋 Next Steps:')
    console.log('  1. Start the development server:')
    console.log('     npm run dev:all')
    console.log('')
    console.log('  2. Open the amazing builder:')
    console.log('     http://localhost:3000/builder')
    console.log('')
    console.log('  3. Start creating amazing pages!')
    console.log('')
    console.log('📚 Useful Commands:')
    console.log('  npm run dev:all          # Start everything')
    console.log('  npm run sync:all         # Sync all systems')
    console.log('  npm run system:health    # Check system health')
    console.log('  npm run types:generate   # Regenerate types')
    console.log('')
    console.log('📖 Documentation:')
    console.log('  ./BUILDER_README.md      # Complete guide')
    console.log('  ./src/config/system.config.ts  # System configuration')
    console.log('')
    console.log('💡 Pro Tips:')
    console.log('  • Use Ctrl+Z/Ctrl+Y for undo/redo')
    console.log('  • Press Escape to deselect components')
    console.log('  • Drag components from the palette')
    console.log('  • Use the style panel for customization')
    console.log('  • Export your creations to React code')
    console.log('')
    console.log('🎯 Happy Building! 🚀')
    console.log('')
  }

  private showErrorMessage(error: any): void {
    console.log('')
    console.log('❌❌❌ SETUP ENCOUNTERED ERRORS ❌❌❌')
    console.log('')
    console.log('Error:', error.message)
    console.log('')
    console.log('🔧 Troubleshooting:')
    console.log('  1. Check your .env.local file has correct values')
    console.log('  2. Ensure PostgreSQL/Supabase is running')
    console.log('  3. Try running individual setup steps:')
    console.log('     npm run generate:types')
    console.log('     npm run sync:all')
    console.log('')
    console.log('📞 Need help?')
    console.log('  • Check BUILDER_README.md')
    console.log('  • Visit our Discord community')
    console.log('  • Create an issue on GitHub')
    console.log('')
  }
}

// 🎯 Command line interface
async function main() {
  const args = process.argv.slice(2)
  const options: SetupOptions = {}

  // Parse command line arguments
  args.forEach(arg => {
    if (arg === '--skip-deps') options.skipDependencies = true
    if (arg === '--skip-db') options.skipDatabase = true
    if (arg === '--skip-types') options.skipTypes = true
    if (arg === '--skip-build') options.skipBuild = true
    if (arg.startsWith('--env=')) {
      options.environment = arg.split('=')[1] as any
    }
  })

  const setup = new AmazingBuilderSetup(options)
  await setup.setup()
}

// 🎯 Run if called directly
if (require.main === module) {
  main().catch(console.error)
}

// 🎯 Export for programmatic use
export { AmazingBuilderSetup, type SetupOptions }
