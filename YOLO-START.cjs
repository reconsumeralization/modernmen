#!/usr/bin/env node
// 🚀 YOLO MODE: GET PAYLOAD RUNNING NO MATTER WHAT!

console.log('🔥 YOLO MODE: Starting Payload CMS with ZERO compromise!\n');

// Set environment variables directly
process.env.NODE_ENV = 'development';
process.env.PAYLOAD_SECRET = '7123e2f9f8d024b9b4d19a6a39d435df094467136305c2d54aa81246fbd3360f';
process.env.NEXTAUTH_SECRET = 'c261aa298fcd4dc1c3ca79d53bc609a8d236c1e55d858943f2061065af809de7';
process.env.DATABASE_URL = 'postgresql://postgres:password@localhost:5432/modernmen';
process.env.PAYLOAD_PUBLIC_SERVER_URL = 'http://localhost:3000';

console.log('✅ Environment variables set');
console.log('✅ Secrets configured');
console.log('✅ Database URL set');

// Use the most direct approach possible
const { spawn } = require('child_process');

console.log('🚀 Launching Next.js with Payload CMS...\n');

// Start with the most permissive approach
const nextProcess = spawn('node', ['./node_modules/next/dist/bin/next', 'dev'], {
  stdio: 'inherit',
  env: { ...process.env },
  cwd: process.cwd()
});

nextProcess.on('error', (error) => {
  console.error('❌ Primary start failed, trying alternative...');
  
  // Fallback to npx
  const fallback = spawn('npx', ['next', 'dev'], {
    stdio: 'inherit',
    shell: true,
    env: { ...process.env }
  });
  
  fallback.on('error', (err) => {
    console.error('❌ All startup methods failed:', err.message);
    console.log('🔧 Try running: npm run dev manually');
  });
});

console.log('📱 Starting on: http://localhost:3000');
console.log('🔧 Admin panel: http://localhost:3000/admin');
console.log('💾 Database: PostgreSQL (configure in .env.local)');
console.log('\n💪 YOLO MODE ACTIVATED - This WILL work!\n');

// Graceful shutdown
process.on('SIGINT', () => {
  console.log('\n🛑 Shutting down YOLO mode...');
  nextProcess.kill();
  process.exit(0);
});