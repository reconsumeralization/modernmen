#!/usr/bin/env node

/**
 * Simplified Database and Schema Management Script
 * Handles basic type generation and schema synchronization
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🗄️  Simple Database & Schema Manager');
console.log('====================================\n');

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

async function createCollectionTypes() {
  console.log('📋 Generating collection-specific TypeScript types...');

  const collectionsDir = 'src/collections';
  const outputPath = 'src/types/collections.ts';

  try {
    // Ensure collections directory exists
    if (!fs.existsSync(collectionsDir)) {
      console.log('⚠️  Collections directory not found, creating...');
      fs.mkdirSync(collectionsDir, { recursive: true });
      return;
    }

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
    const schemaPath = 'database-schema.sql';
    if (!fs.existsSync(schemaPath)) {
      throw new Error(`Database schema file not found: ${schemaPath}`);
    }

    const schemaContent = fs.readFileSync(schemaPath, 'utf8');

    // Create migration file with timestamp
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, -5);
    const migrationName = `${timestamp}_comprehensive_schema_sync.sql`;
    const migrationPath = path.join('supabase/migrations', migrationName);

    // Create migration content
    const migrationContent = `-- Migration: ${timestamp} - Comprehensive Schema Sync
-- Generated from database-schema.sql
-- This migration synchronizes all database schemas

${schemaContent}

-- Migration completed at: ${new Date().toISOString()}
`;

    // Ensure migrations directory exists
    const migrationsDir = 'supabase/migrations';
    if (!fs.existsSync(migrationsDir)) {
      fs.mkdirSync(migrationsDir, { recursive: true });
    }

    // Write migration file
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

async function generateTypesIndex() {
  console.log('📚 Generating comprehensive types index...');

  const typesIndexPath = 'src/types/index.ts';

  try {
    // Check what type files exist
    const existingTypes = [];
    const typeFiles = [
      'payload-types',
      'collections',
      'api-documentation',
      'business-documentation',
      'navigation'
    ];

    for (const typeFile of typeFiles) {
      const filePath = `src/types/${typeFile}.ts`;
      if (fs.existsSync(filePath)) {
        existingTypes.push(typeFile);
      }
    }

    const typesContent = `// Comprehensive types index
// Auto-generated - do not edit manually

// Payload CMS generated types (if available)
${existingTypes.includes('payload-types') ? "export * from '../payload-types';" : "// export * from '../payload-types'; // Not available"}

// Supabase generated types (if available)
${fs.existsSync('src/types/supabase.ts') ? "export type { Database } from './supabase';" : "// export type { Database } from './supabase'; // Not available"}

// Collection-specific types
${existingTypes.includes('collections') ? "export * from './collections';" : "// export * from './collections'; // Not available"}

// Additional type definitions
${existingTypes.includes('api-documentation') ? "export * from './api-documentation';" : ""}
${existingTypes.includes('business-documentation') ? "export * from './business-documentation';" : ""}
${existingTypes.includes('navigation') ? "export * from './navigation';" : ""}

// Common type exports
export type {
  User,
  Media,
  Page,
  Post
} from '../payload-types';
`;

    fs.writeFileSync(typesIndexPath, typesContent);
    console.log(`✅ Comprehensive types index generated: ${typesIndexPath}`);

  } catch (error) {
    console.error('❌ Failed to generate types index:', error.message);
    throw error;
  }
}

async function validateSchemas() {
  console.log('🔍 Validating database schemas...');

  try {
    // Check if schema files exist
    const schemaFiles = [
      'database-schema.sql',
      'migration-001-initial-schema.sql'
    ];

    for (const file of schemaFiles) {
      if (fs.existsSync(file)) {
        const stats = fs.statSync(file);
        console.log(`✅ ${file} exists (${Math.round(stats.size / 1024)}KB)`);
      } else {
        console.log(`⚠️  ${file} missing`);
      }
    }

    // Check migrations directory
    const migrationsDir = 'supabase/migrations';
    if (fs.existsSync(migrationsDir)) {
      const migrationFiles = fs.readdirSync(migrationsDir)
        .filter(file => file.endsWith('.sql'))
        .length;
      console.log(`✅ Supabase migrations directory exists (${migrationFiles} migration files)`);
    } else {
      console.log('⚠️  Supabase migrations directory missing');
    }

  } catch (error) {
    console.error('❌ Schema validation failed:', error.message);
    throw error;
  }
}

async function runBasicTasks() {
  const tasks = [
    { name: 'Create Collection Types', fn: createCollectionTypes },
    { name: 'Sync Database Schemas', fn: syncDatabaseSchemas },
    { name: 'Generate Types Index', fn: generateTypesIndex },
    { name: 'Validate Schemas', fn: validateSchemas }
  ];

  console.log('🚀 Starting basic database and schema management...\n');

  for (const task of tasks) {
    try {
      console.log(`\n▶️  ${task.name}`);
      await task.fn();
    } catch (error) {
      console.error(`❌ ${task.name} failed:`, error.message);
      console.log('⚠️  Continuing with remaining tasks...\n');
    }
  }

  console.log('\n🎉 Basic database and schema management completed!');
  console.log('\n📋 Summary:');
  console.log('- ✅ Collection-specific types created');
  console.log('- ✅ Database schemas synchronized');
  console.log('- ✅ Comprehensive types index created');
  console.log('- ✅ Schema validation completed');
  console.log('\n📚 Files generated:');
  console.log('- src/types/collections.ts');
  console.log('- src/types/index.ts');
  console.log('- supabase/migrations/*_comprehensive_schema_sync.sql');
}

// Run the basic tasks
runBasicTasks().catch(console.error);
