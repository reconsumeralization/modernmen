#!/usr/bin/env node

// =============================================================================
// CODE GENERATION CLI TOOL
// =============================================================================
// Command-line tool for generating types, services, routes, and validation
// from Payload CMS collection definitions.

const fs = require('fs')
const path = require('path')
const { CodeGenerator } = require('../packages/backend/src/lib/code-generator')

const args = process.argv.slice(2)
const command = args[0]

if (!command) {
  showHelp()
  process.exit(1)
}

switch (command) {
  case 'generate':
    generateCode()
    break
  case 'list':
    listCollections()
    break
  case 'help':
  default:
    showHelp()
    break
}

function generateCode() {
  const options = parseGenerateOptions(args.slice(1))

  console.log('🚀 Starting code generation...')
  console.log('Options:', options)

  try {
    // Import collections dynamically
    const collectionsPath = path.join(process.cwd(), options.collectionsPath)
    const collections = loadCollections(collectionsPath, options.collections)

    if (collections.length === 0) {
      console.error('❌ No collections found')
      process.exit(1)
    }

    console.log(`📋 Found ${collections.length} collections:`)
    collections.forEach(collection => {
      console.log(`  - ${collection.slug}`)
    })

    const generator = new CodeGenerator({
      outputDir: options.output,
      collections,
      generateTypes: options.types,
      generateServices: options.services,
      generateRoutes: options.routes,
      generateValidation: options.validation,
      generateTests: options.tests,
      overwriteExisting: options.force
    })

    generator.generate().then(result => {
      console.log('✅ Code generation completed!')
      console.log('')
      console.log('📊 Generated files:')
      console.log(`  Types: ${result.types.size}`)
      console.log(`  Services: ${result.services.size}`)
      console.log(`  Routes: ${result.routes.size}`)
      console.log(`  Validation: ${result.validation.size}`)
      console.log(`  Tests: ${result.tests.size}`)
      console.log('')
      console.log(`📁 Output directory: ${options.output}`)
    }).catch(error => {
      console.error('❌ Code generation failed:', error)
      process.exit(1)
    })

  } catch (error) {
    console.error('❌ Error:', error.message)
    process.exit(1)
  }
}

function listCollections() {
  const options = parseListOptions(args.slice(1))

  try {
    const collectionsPath = path.join(process.cwd(), options.collectionsPath)
    const collections = loadCollections(collectionsPath)

    console.log('📋 Available collections:')
    console.log('')

    collections.forEach(collection => {
      console.log(`📁 ${collection.slug}`)
      console.log(`   Title: ${collection.admin?.useAsTitle || 'N/A'}`)
      console.log(`   Group: ${collection.admin?.group || 'N/A'}`)
      console.log(`   Fields: ${collection.fields?.length || 0}`)
      console.log('')
    })

  } catch (error) {
    console.error('❌ Error:', error.message)
    process.exit(1)
  }
}

function loadCollections(collectionsPath, specificCollections = []) {
  const collections = []

  try {
    // Try to load from the specified path
    if (fs.existsSync(collectionsPath)) {
      const files = fs.readdirSync(collectionsPath)
        .filter(file => file.endsWith('.ts') && !file.endsWith('.d.ts'))

      for (const file of files) {
        const filePath = path.join(collectionsPath, file)
        const collectionName = path.basename(file, '.ts')

        // Skip if specific collections are requested and this isn't one of them
        if (specificCollections.length > 0 && !specificCollections.includes(collectionName)) {
          continue
        }

        try {
          // Dynamic import of the collection
          delete require.cache[require.resolve(filePath)]
          const collectionModule = require(filePath)

          // Find the default export or named export
          const collection = collectionModule.default || collectionModule[collectionName]

          if (collection && collection.slug) {
            collections.push(collection)
          }
        } catch (error) {
          console.warn(`⚠️  Failed to load collection ${collectionName}:`, error.message)
        }
      }
    } else {
      console.error(`❌ Collections path not found: ${collectionsPath}`)
      console.log('Make sure you\'re running this from the project root and the path is correct.')
      process.exit(1)
    }
  } catch (error) {
    console.error('❌ Error loading collections:', error.message)
    process.exit(1)
  }

  return collections
}

function parseGenerateOptions(args) {
  const options = {
    output: './generated',
    collectionsPath: './cms/src/collections',
    collections: [],
    types: true,
    services: true,
    routes: true,
    validation: true,
    tests: false,
    force: false
  }

  for (let i = 0; i < args.length; i++) {
    const arg = args[i]

    switch (arg) {
      case '--output':
      case '-o':
        options.output = args[++i]
        break
      case '--collections-path':
        options.collectionsPath = args[++i]
        break
      case '--collections':
      case '-c':
        options.collections = args[++i].split(',')
        break
      case '--only-types':
        options.types = true
        options.services = false
        options.routes = false
        options.validation = false
        options.tests = false
        break
      case '--only-services':
        options.types = false
        options.services = true
        options.routes = false
        options.validation = false
        options.tests = false
        break
      case '--only-routes':
        options.types = false
        options.services = false
        options.routes = true
        options.validation = false
        options.tests = false
        break
      case '--no-types':
        options.types = false
        break
      case '--no-services':
        options.services = false
        break
      case '--no-routes':
        options.routes = false
        break
      case '--no-validation':
        options.validation = false
        break
      case '--with-tests':
        options.tests = true
        break
      case '--force':
      case '-f':
        options.force = true
        break
      case '--help':
      case '-h':
        showGenerateHelp()
        process.exit(0)
        break
    }
  }

  return options
}

function parseListOptions(args) {
  const options = {
    collectionsPath: './cms/src/collections'
  }

  for (let i = 0; i < args.length; i++) {
    const arg = args[i]

    switch (arg) {
      case '--collections-path':
        options.collectionsPath = args[++i]
        break
      case '--help':
      case '-h':
        showListHelp()
        process.exit(0)
        break
    }
  }

  return options
}

function showHelp() {
  console.log(`
🔧 Modern Men Code Generator

USAGE:
  node scripts/generate-code.js <command> [options]

COMMANDS:
  generate    Generate types, services, routes, and validation from collections
  list        List all available collections
  help        Show this help message

EXAMPLES:
  # Generate everything for all collections
  node scripts/generate-code.js generate

  # Generate only types for specific collections
  node scripts/generate-code.js generate --only-types --collections appointments,services

  # Generate with custom output directory
  node scripts/generate-code.js generate --output ./src/generated

  # List all collections
  node scripts/generate-code.js list

For more details, use: node scripts/generate-code.js <command> --help
`)
}

function showGenerateHelp() {
  console.log(`
🔧 Generate Command Help

USAGE:
  node scripts/generate-code.js generate [options]

OPTIONS:
  -o, --output <dir>           Output directory (default: ./generated)
  --collections-path <path>    Path to collections directory (default: ./cms/src/collections)
  -c, --collections <list>     Comma-separated list of collection names to generate
  --only-types                 Generate only TypeScript types
  --only-services              Generate only service classes
  --only-routes                Generate only API routes
  --no-types                   Skip TypeScript types generation
  --no-services                Skip service generation
  --no-routes                  Skip route generation
  --no-validation              Skip validation schemas
  --with-tests                 Generate test files
  -f, --force                  Overwrite existing files
  -h, --help                   Show this help

EXAMPLES:
  # Generate everything for appointments collection
  node scripts/generate-code.js generate --collections appointments

  # Generate types and services only
  node scripts/generate-code.js generate --no-routes --no-validation

  # Generate with force overwrite
  node scripts/generate-code.js generate --force
`)
}

function showListHelp() {
  console.log(`
📋 List Command Help

USAGE:
  node scripts/generate-code.js list [options]

OPTIONS:
  --collections-path <path>    Path to collections directory (default: ./cms/src/collections)
  -h, --help                   Show this help

EXAMPLES:
  # List all collections
  node scripts/generate-code.js list

  # List collections from custom path
  node scripts/generate-code.js list --collections-path ./src/collections
`)
}

// Handle unhandled promise rejections
process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason)
  process.exit(1)
})

// Handle uncaught exceptions
process.on('uncaughtException', (error) => {
  console.error('Uncaught Exception:', error)
  process.exit(1)
})
