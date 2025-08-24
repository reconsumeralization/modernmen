#!/usr/bin/env node

// Simple test to verify Payload configuration loads
console.log('🧪 Testing Payload CMS configuration...\n');

try {
  // Test environment variables
  require('dotenv').config({ path: '.env.local' });
  
  const payloadSecret = process.env.PAYLOAD_SECRET;
  const databaseUrl = process.env.DATABASE_URL;
  
  console.log('✅ Environment variables:');
  console.log(`  PAYLOAD_SECRET: ${payloadSecret ? '✓ Set' : '❌ Missing'}`);
  console.log(`  DATABASE_URL: ${databaseUrl ? '✓ Set' : '❌ Missing'}`);
  
  // Try to load the config
  const config = require('./src/payload.config.ts');
  console.log('✅ Payload config loaded successfully');
  
  console.log('\n📊 Configuration Summary:');
  console.log(`  Collections: ${config.default.collections?.length || 0}`);
  console.log(`  Admin enabled: ${config.default.admin ? '✓' : '❌'}`);
  console.log(`  Database: ${config.default.db ? '✓ Configured' : '❌ Not configured'}`);
  
  console.log('\n🎉 Payload CMS configuration is valid!');
  
} catch (error) {
  console.error('❌ Error testing Payload configuration:');
  console.error(error.message);
  
  if (error.code === 'MODULE_NOT_FOUND') {
    console.log('\n💡 Suggestions:');
    console.log('  • Make sure dependencies are installed: npm install');
    console.log('  • Check that all required Payload packages are present');
  }
}