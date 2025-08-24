#!/usr/bin/env node

/**
 * Payload CMS Setup Script for Modern Men Hair Salon
 * 
 * This script initializes the Payload CMS database and creates initial admin user
 */

import { spawn } from 'child_process';
import { createRequire } from 'module';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const require = createRequire(import.meta.url);

// Colors for console output
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m',
};

function log(message, color = colors.blue) {
  console.log(`${color}${message}${colors.reset}`);
}

function logSuccess(message) {
  console.log(`${colors.green}✅ ${message}${colors.reset}`);
}

function logError(message) {
  console.log(`${colors.red}❌ ${message}${colors.reset}`);
}

function logWarning(message) {
  console.log(`${colors.yellow}⚠️  ${message}${colors.reset}`);
}

async function checkEnvironmentVariables() {
  log('📋 Checking environment variables...', colors.cyan);
  
  const envPath = path.resolve(__dirname, '../.env.local');
  
  if (!fs.existsSync(envPath)) {
    logError('.env.local file not found! Please copy .env.example to .env.local');
    return false;
  }
  
  const envContent = fs.readFileSync(envPath, 'utf8');
  
  const requiredVars = [
    'DATABASE_URL',
    'PAYLOAD_SECRET',
    'NEXTAUTH_SECRET'
  ];
  
  const missingVars = [];
  
  for (const varName of requiredVars) {
    if (!envContent.includes(`${varName}=`) || 
        envContent.includes(`${varName}=your_`) ||
        envContent.includes(`${varName}=postgresql://username:password`)) {
      missingVars.push(varName);
    }
  }
  
  if (missingVars.length > 0) {
    logError(`Missing or placeholder values for: ${missingVars.join(', ')}`);
    log('Please update your .env.local file with actual values.');
    return false;
  }
  
  logSuccess('Environment variables configured');
  return true;
}

async function generateSecrets() {
  log('🔑 Generating secrets...', colors.cyan);
  
  const crypto = await import('crypto');
  
  const payloadSecret = crypto.randomBytes(32).toString('hex');
  const nextAuthSecret = crypto.randomBytes(32).toString('hex');
  
  const envPath = path.resolve(__dirname, '../.env.local');
  let envContent = fs.readFileSync(envPath, 'utf8');
  
  // Update placeholder secrets
  envContent = envContent.replace(/PAYLOAD_SECRET=.*/, `PAYLOAD_SECRET=${payloadSecret}`);
  envContent = envContent.replace(/NEXTAUTH_SECRET=.*/, `NEXTAUTH_SECRET=${nextAuthSecret}`);
  
  fs.writeFileSync(envPath, envContent);
  
  logSuccess('Generated new secrets for PAYLOAD_SECRET and NEXTAUTH_SECRET');
}

async function runCommand(command, args = [], description = '') {
  return new Promise((resolve, reject) => {
    log(`🔄 ${description || `Running: ${command} ${args.join(' ')}`}`, colors.yellow);
    
    const process = spawn(command, args, {
      stdio: 'pipe',
      shell: true,
      cwd: path.resolve(__dirname, '..')
    });
    
    let stdout = '';
    let stderr = '';
    
    process.stdout?.on('data', (data) => {
      stdout += data.toString();
    });
    
    process.stderr?.on('data', (data) => {
      stderr += data.toString();
    });
    
    process.on('close', (code) => {
      if (code === 0) {
        logSuccess(`${description || command} completed successfully`);
        resolve({ stdout, stderr, code });
      } else {
        logError(`${description || command} failed with code ${code}`);
        if (stderr) console.error(stderr);
        reject(new Error(`Command failed: ${command}`));
      }
    });
    
    process.on('error', (error) => {
      logError(`Failed to start command: ${error.message}`);
      reject(error);
    });
  });
}

async function installDependencies() {
  log('📦 Installing/updating dependencies...', colors.cyan);
  
  try {
    await runCommand('npm', ['install'], 'Installing Node.js dependencies');
  } catch (error) {
    logError('Failed to install dependencies');
    throw error;
  }
}

async function buildPayloadTypes() {
  log('🔧 Generating Payload types...', colors.cyan);
  
  try {
    await runCommand('npm', ['run', 'payload:generate-types'], 'Generating Payload TypeScript types');
  } catch (error) {
    logWarning('Failed to generate types. This might be due to database connection issues.');
    // Continue anyway as this can be done later
  }
}

async function runPayloadMigrations() {
  log('🗄️  Running database migrations...', colors.cyan);
  
  try {
    // Check if payload binary exists
    const payloadBin = path.resolve(__dirname, '../node_modules/.bin/payload');
    
    if (fs.existsSync(payloadBin)) {
      await runCommand('npx', ['payload', 'migrate'], 'Running Payload database migrations');
    } else {
      logWarning('Payload CLI not found. Skipping migrations.');
    }
  } catch (error) {
    logWarning('Migration failed. Database might not be accessible or might need manual setup.');
    log('You can run migrations later with: npm run payload migrate');
  }
}

async function createInitialData() {
  log('🌱 Creating initial salon data...', colors.cyan);
  
  // This would typically be done through the API or by running a seed script
  // For now, we'll create a seed data file
  
  const seedData = {
    services: [
      {
        name: "Men's Haircut",
        category: "haircut",
        description: "Professional men's haircut with wash and style",
        price: 3500, // $35.00
        duration: 45,
        isActive: true,
        featured: true
      },
      {
        name: "Beard Trim",
        category: "beard",
        description: "Precision beard trimming and shaping",
        price: 2000, // $20.00
        duration: 30,
        isActive: true
      },
      {
        name: "Hot Towel Shave",
        category: "beard",
        description: "Traditional hot towel straight razor shave",
        price: 4000, // $40.00
        duration: 60,
        isActive: true,
        featured: true
      }
    ],
    users: [
      {
        name: "Admin User",
        email: "admin@modernmen.ca",
        role: "admin",
        password: "admin123" // Should be changed immediately
      }
    ]
  };
  
  const seedPath = path.resolve(__dirname, '../src/seed-data.json');
  fs.writeFileSync(seedPath, JSON.stringify(seedData, null, 2));
  
  logSuccess('Created seed data file at src/seed-data.json');
  log('You can use this data to populate your CMS once it\'s running.', colors.yellow);
}

async function displayNextSteps() {
  log('\n🎉 Payload CMS Setup Complete!', colors.green);
  console.log('\n' + '='.repeat(60));
  log('Next Steps:', colors.bright);
  console.log('');
  log('1. Update your .env.local file with actual database credentials');
  log('2. Start the development server:');
  log('   npm run dev:cms');
  console.log('');
  log('3. Access the admin panel at:');
  log('   http://localhost:3000/admin', colors.cyan);
  console.log('');
  log('4. Create your first admin user when prompted');
  console.log('');
  log('5. Import seed data using the Payload admin interface');
  console.log('');
  log('🔧 Additional Commands:', colors.bright);
  log('   npm run payload:generate-types  - Regenerate TypeScript types');
  log('   npm run dev:full                - Start all services');
  log('   npm run dev:status              - Check service status');
  console.log('');
  console.log('='.repeat(60));
}

async function main() {
  try {
    log('🚀 Setting up Payload CMS for Modern Men Hair Salon', colors.bright);
    console.log('');
    
    // Check if environment is properly configured
    const envOk = await checkEnvironmentVariables();
    if (!envOk) {
      await generateSecrets();
      logWarning('Please update .env.local with your database credentials and run this script again.');
      return;
    }
    
    // Install dependencies
    await installDependencies();
    
    // Generate types
    await buildPayloadTypes();
    
    // Run migrations
    await runPayloadMigrations();
    
    // Create seed data
    await createInitialData();
    
    // Show next steps
    await displayNextSteps();
    
  } catch (error) {
    logError(`Setup failed: ${error.message}`);
    process.exit(1);
  }
}

// Run setup if called directly
if (process.argv[1] === fileURLToPath(import.meta.url)) {
  main();
}

export { main as setupPayload };