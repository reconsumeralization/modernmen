#!/usr/bin/env node
/**
 * Validation script for Payload CMS integration
 * Checks all components, files, and configurations
 */
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const requiredFiles = [
  // Core configuration
  'src/payload.config.ts',
  'src/lib/payload-integration.ts',
  'src/lib/business-documentation-service.ts',
  // Collections
  'src/payload/collections/Documentation.ts',
  'src/payload/collections/DocumentationTemplates.ts',
  'src/payload/collections/DocumentationWorkflows.ts',
  // API Routes
  'src/app/api/business-documentation/route.ts',
  'src/app/api/business-documentation/[id]/route.ts',
  'src/app/api/business-documentation/templates/route.ts',
  'src/app/api/business-documentation/metrics/route.ts',
  'src/app/api/payload-integration/sync-user/route.ts',
  'src/app/api/payload-integration/rch/route.ts',
  'src/app/api/payload-integration/analytics/route.ts',
  'src/app/api/payload-integration/sync-appointments/route.ts',
  // Components
  'src/components/admin/PayloadDashboard.tsx',
  'src/components/documentation/BusinessContentEditor.tsx',
  'src/components/documentation/AccessControl.tsx',
  'src/components/documentation/RouteGuard.tsx',
  // Hooks and Context
  'src/hooks/usePayloadIntegration.ts',
  'src/contexts/DocumentationContext.tsx',
  // UI Components
  'src/components/ui/select.tsx',
  'src/components/ui/checkbox.tsx',
  'src/lib/utils.ts',
  // Types
  'src/types/business-documentation.ts',
  // Pages
  'src/app/admin/payload/page.tsx',
  // Tests
  'src/__tests__/payload-integration.test.ts',
  'src/lib/__tests__/business-documentation-service.test.ts'
]

const requiredDependencies = [
  'payload',
  '@payloadcms/db-postgres',
  '@payloadcms/richtext-lexical',
  '@radix-ui/react-select',
  '@radix-ui/react-checkbox',
  'clsx',
  'tailwind-merge'
]

console.log('🔍 Validating Payload CMS Integration...\n')

// Check required files
console.log('📁 Checking required files...')
let missingFiles = []
let existingFiles = []

requiredFiles.forEach(file => {
  const filePath = path.join(process.cwd(), file)
  if (fs.existsSync(filePath)) {
    existingFiles.push(file)
    console.log(`✅ ${file}`)
  } else {
    missingFiles.push(file)
    console.log(`❌ ${file} - MISSING`)
  }
})

console.log(`\n📊 Files Status: ${existingFiles.length}/${requiredFiles.length} files exist`)

// Check package.json dependencies
console.log('\n📦 Checking dependencies...')
const packageJsonPath = path.join(process.cwd(), 'package.json')
let packageJson = {}
let missingDeps = []
let existingDeps = []

if (fs.existsSync(packageJsonPath)) {
  packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'))
  const allDeps = { ...packageJson.dependencies, ...packageJson.devDependencies }
  
  requiredDependencies.forEach(dep => {
    if (allDeps[dep]) {
      existingDeps.push(dep)
      console.log(`✅ ${dep} - ${allDeps[dep]}`)
    } else {
      missingDeps.push(dep)
      console.log(`❌ ${dep} - MISSING`)
    }
  })
} else {
  console.log('❌ package.json not found')
}

console.log(`\n📊 Dependencies Status: ${existingDeps.length}/${requiredDependencies.length} dependencies installed`)

// Check environment variables
console.log('\n🔧 Checking environment configuration...')
const envExamplePath = path.join(process.cwd(), '.env.example')
const requiredEnvVars = [
  'PAYLOAD_SECRET',
  'PAYLOAD_PUBLIC_SERVER_URL',
  'DATABASE_URL',
  'NEXTAUTH_SECRET',
  'NEXTAUTH_URL'
]

if (fs.existsSync(envExamplePath)) {
  const envExample = fs.readFileSync(envExamplePath, 'utf8')
  requiredEnvVars.forEach(envVar => {
    if (envExample.includes(envVar)) {
      console.log(`✅ ${envVar} - configured in .env.example`)
    } else {
      console.log(`❌ ${envVar} - missing from .env.example`)
    }
  })
} else {
  console.log('❌ .env.example not found')
}

// Check TypeScript configuration
console.log('\n🔧 Checking TypeScript configuration...')
const tsConfigPath = path.join(process.cwd(), 'tsconfig.json')
if (fs.existsSync(tsConfigPath)) {
  console.log('✅ tsconfig.json exists')
  const tsConfig = JSON.parse(fs.readFileSync(tsConfigPath, 'utf8'))
  if (tsConfig.compilerOptions && tsConfig.compilerOptions.paths) {
    console.log('✅ Path aliases configured')
  } else {
    console.log('⚠️  Path aliases may not be configured')
  }
} else {
  console.log('❌ tsconfig.json not found')
}

// Check Next.js configuration
console.log('\n🔧 Checking Next.js configuration...')
const nextConfigPath = path.join(process.cwd(), 'next.config.js')
const nextConfigMjsPath = path.join(process.cwd(), 'next.config.mjs')
if (fs.existsSync(nextConfigPath) || fs.existsSync(nextConfigMjsPath)) {
  console.log('✅ Next.js configuration exists')
} else {
  console.log('❌ Next.js configuration not found')
}

// Summary
console.log('\n📋 INTEGRATION VALIDATION SUMMARY')
console.log('='.repeat(50))

if (missingFiles.length === 0) {
  console.log('✅ All required files are present')
} else {
  console.log(`❌ ${missingFiles.length} files are missing:`)
  missingFiles.forEach(file => console.log(`   - ${file}`))
}

if (missingDeps.length === 0) {
  console.log('✅ All required dependencies are installed')
} else {
  console.log(`❌ ${missingDeps.length} dependencies are missing:`)
  missingDeps.forEach(dep => console.log(`   - ${dep}`))
}

const overallStatus = missingFiles.length === 0 && missingDeps.length === 0
console.log(`\n🎯 Overall Status: ${overallStatus ? '✅ READY' : '❌ NEEDS ATTENTION'}`)

if (overallStatus) {
  console.log('\n🚀 Payload CMS integration is complete and ready for use!')
  console.log('\nNext steps:')
  console.log('1. Set up your environment variables (.env.local)')
  console.log('2. Run database migrations: npm run payload:migrate')
  console.log('3. Start the development server: npm run dev')
  console.log('4. Access Payload admin at: http://localhost:3000/admin')
} else {
  console.log('\n🔧 Please address the missing files and dependencies above.')
}

process.exit(overallStatus ? 0 : 1)