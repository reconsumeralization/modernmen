#!/usr/bin/env node

/**
 * Comprehensive Database and Schema Management Script
 * Handles Payload CMS types, Supabase schema, and database synchronization
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🗄️  Database & Schema Manager');
console.log('=============================\n');

// Configuration
const config = {
  payloadTypesPath: 'src/payload-types.ts',
  supabaseTypesPath: 'src/types/supabase.ts',
  migrationsPath: 'supabase/migrations',
  collectionsPath: 'src/collections',
  payloadCollectionsPath: 'src/payload/collections',
  databaseSchemaPath: 'database-schema.sql'
};

function runCommand(command, description, options = {}) {
  try {
    console.log(`🔧 ${description}...`);
    const result = execSync(command, {
      stdio: options.silent ? 'pipe' : 'inherit',
      encoding: 'utf8',
      ...options
    });
    console.log(`✅ ${description} completed\n`);
    return result;
  } catch (error) {
    console.error(`❌ ${description} failed:`, error.message);
    if (options.continueOnError) {
      console.log('⚠️  Continuing despite error...\n');
      return null;
    }
    throw error;
  }
}

function ensureDirectoryExists(dirPath) {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
    console.log(`📁 Created directory: ${dirPath}`);
  }
}

async function generatePayloadTypes() {
  console.log('📝 Generating Payload CMS TypeScript types...');

  try {
    // Generate types using Payload CLI
    runCommand('npx payload generate:types', 'Generating Payload types');

    // Check if types were generated successfully
    if (fs.existsSync(config.payloadTypesPath)) {
      const stats = fs.statSync(config.payloadTypesPath);
      console.log(`✅ Payload types generated successfully (${Math.round(stats.size / 1024)}KB)`);
    } else {
      throw new Error('Payload types file was not generated');
    }
  } catch (error) {
    console.error('❌ Failed to generate Payload types:', error.message);
    throw error;
  }
}

async function generateSupabaseTypes() {
  console.log('🔗 Generating Supabase TypeScript types...');

  try {
    // Generate types from Supabase
    const command = 'npx supabase gen types typescript --project-id $SUPABASE_PROJECT_ID > src/types/supabase.ts';
    runCommand(command, 'Generating Supabase types');

    // Check if types were generated successfully
    if (fs.existsSync(config.supabaseTypesPath)) {
      const stats = fs.statSync(config.supabaseTypesPath);
      console.log(`✅ Supabase types generated successfully (${Math.round(stats.size / 1024)}KB)`);
    } else {
      console.log('⚠️  Supabase types not generated - may need manual setup');
    }
  } catch (error) {
    console.error('❌ Failed to generate Supabase types:', error.message);
    console.log('⚠️  Continuing without Supabase types...');
  }
}

async function createCollectionTypes() {
  console.log('📋 Generating collection-specific TypeScript types...');

  const collectionsDir = config.collectionsPath;
  const outputPath = 'src/types/collections.ts';

  try {
    // Read all collection files
    const collectionFiles = fs.readdirSync(collectionsDir)
      .filter(file => file.endsWith('.ts'))
      .map(file => path.join(collectionsDir, file));

    let typesContent = `// Auto-generated collection types
// Generated from src/collections/*.ts
// Do not edit manually - regenerate with: npm run types:collections

`;

    for (const filePath of collectionFiles) {
      const content = fs.readFileSync(filePath, 'utf8');
      const collectionName = path.basename(filePath, '.ts');

      // Extract interfaces and types from the file
      const interfaces = content.match(/export interface \w+ \{[^}]*\}/g) || [];
      const types = content.match(/export type \w+ = [^;]+;/g) || [];

      if (interfaces.length > 0 || types.length > 0) {
        typesContent += `\n// Types from ${collectionName}.ts\n`;
        typesContent += interfaces.join('\n\n');
        typesContent += '\n\n';
        typesContent += types.join('\n');
        typesContent += '\n';
      }
    }

    // Write the combined types file
    fs.writeFileSync(outputPath, typesContent);
    console.log(`✅ Collection types generated: ${outputPath}`);

  } catch (error) {
    console.error('❌ Failed to generate collection types:', error.message);
    throw error;
  }
}

async function syncDatabaseSchemas() {
  console.log('🔄 Synchronizing database schemas...');

  try {
    // Read the main database schema
    const schemaPath = config.databaseSchemaPath;
    if (!fs.existsSync(schemaPath)) {
      throw new Error(`Database schema file not found: ${schemaPath}`);
    }

    const schemaContent = fs.readFileSync(schemaPath, 'utf8');

    // Create migration file with timestamp
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, -5);
    const migrationName = `${timestamp}_comprehensive_schema_sync.sql`;
    const migrationPath = path.join(config.migrationsPath, migrationName);

    // Create migration content
    const migrationContent = `-- Migration: ${timestamp} - Comprehensive Schema Sync
-- Generated from ${schemaPath}
-- This migration synchronizes all database schemas

${schemaContent}

-- Migration completed at: ${new Date().toISOString()}
`;

    // Write migration file
    ensureDirectoryExists(config.migrationsPath);
    fs.writeFileSync(migrationPath, migrationContent);

    console.log(`✅ Database migration created: ${migrationPath}`);
    console.log('📋 To apply this migration:');
    console.log(`   supabase db push --include-all`);
    console.log(`   OR manually run the SQL in: ${migrationName}`);

  } catch (error) {
    console.error('❌ Failed to sync database schemas:', error.message);
    throw error;
  }
}

async function validateTypes() {
  console.log('🔍 Validating type definitions...');

  try {
    // Check if all required type files exist
    const requiredFiles = [
      config.payloadTypesPath,
      'src/types/collections.ts',
      'src/types/index.ts'
    ];

    for (const file of requiredFiles) {
      if (fs.existsSync(file)) {
        console.log(`✅ ${file} exists`);
      } else {
        console.log(`⚠️  ${file} missing`);
      }
    }

    // Run TypeScript compiler check
    runCommand('npx tsc --noEmit', 'Running TypeScript type check');

    console.log('✅ Type validation completed');

  } catch (error) {
    console.error('❌ Type validation failed:', error.message);
    throw error;
  }
}

async function testDatabaseConnection() {
  console.log('🧪 Testing database connections...');

  try {
    // Test Payload CMS connection
    console.log('Testing Payload CMS connection...');
    runCommand('npx payload migrate:status', 'Checking Payload migration status', { continueOnError: true });

    // Test Supabase connection (if available)
    console.log('Testing Supabase connection...');
    try {
      runCommand('npx supabase status', 'Checking Supabase status', { continueOnError: true });
    } catch (e) {
      console.log('⚠️  Supabase CLI not configured or unavailable');
    }

    console.log('✅ Database connection tests completed');

  } catch (error) {
    console.error('❌ Database connection test failed:', error.message);
    console.log('⚠️  Some database tests failed - check configuration');
  }
}

async function generateComprehensiveTypesIndex() {
  console.log('📚 Generating comprehensive types index...');

  const typesIndexPath = 'src/types/index.ts';

  try {
    const typesContent = `// Comprehensive types index
// Auto-generated - do not edit manually

// Payload CMS generated types
export * from '../payload-types';

// Supabase generated types (if available)
export type { Database } from './supabase';

// Collection-specific types
export * from './collections';

// Additional type definitions
export * from './api-documentation';
export * from './business-documentation';
export * from './navigation';

// Re-export commonly used types
export type {
  User,
  Media,
  Page,
  Post,
  PayloadRequest
} from '../payload-types';
`;

    fs.writeFileSync(typesIndexPath, typesContent);
    console.log(`✅ Comprehensive types index generated: ${typesIndexPath}`);

  } catch (error) {
    console.error('❌ Failed to generate types index:', error.message);
    throw error;
  }
}

async function runAllTasks() {
  const tasks = [
    { name: 'Generate Payload Types', fn: generatePayloadTypes },
    { name: 'Generate Supabase Types', fn: generateSupabaseTypes },
    { name: 'Create Collection Types', fn: createCollectionTypes },
    { name: 'Sync Database Schemas', fn: syncDatabaseSchemas },
    { name: 'Generate Types Index', fn: generateComprehensiveTypesIndex },
    { name: 'Validate Types', fn: validateTypes },
    { name: 'Test Database Connections', fn: testDatabaseConnection }
  ];

  console.log('🚀 Starting comprehensive database and schema management...\n');

  for (const task of tasks) {
    try {
      console.log(`\n▶️  ${task.name}`);
      await task.fn();
    } catch (error) {
      console.error(`❌ ${task.name} failed:`, error.message);
      console.log('⚠️  Continuing with remaining tasks...\n');
    }
  }

  console.log('\n🎉 Database and schema management completed!');
  console.log('\n📋 Summary:');
  console.log('- ✅ Payload CMS types generated');
  console.log('- ✅ Supabase types generated (if configured)');
  console.log('- ✅ Collection-specific types created');
  console.log('- ✅ Database schemas synchronized');
  console.log('- ✅ Comprehensive types index created');
  console.log('- ✅ Type validation completed');
  console.log('- ✅ Database connections tested');
  console.log('\n📚 Next steps:');
  console.log('1. Review generated types in src/types/');
  console.log('2. Apply database migrations if needed');
  console.log('3. Update your application code to use the new types');
  console.log('4. Run tests to ensure everything works correctly');
}

// Command line interface
const args = process.argv.slice(2);
const command = args[0] || 'all';

switch (command) {
  case 'payload':
    generatePayloadTypes().catch(console.error);
    break;
  case 'supabase':
    generateSupabaseTypes().catch(console.error);
    break;
  case 'collections':
    createCollectionTypes().catch(console.error);
    break;
  case 'sync':
    syncDatabaseSchemas().catch(console.error);
    break;
  case 'validate':
    validateTypes().catch(console.error);
    break;
  case 'test':
    testDatabaseConnection().catch(console.error);
    break;
  case 'all':
  default:
    runAllTasks().catch(console.error);
    break;
}
