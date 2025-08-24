#!/usr/bin/env node

const { spawn } = require('child_process');
const path = require('path');

console.log('🚀 Starting Modern Men Hair Salon with Payload CMS...\n');

// Start Next.js with better error handling
const nextProcess = spawn('npx', ['next', 'dev'], {
  stdio: 'inherit',
  shell: true,
  cwd: process.cwd()
});

nextProcess.on('close', (code) => {
  if (code !== 0) {
    console.error(`❌ Next.js process exited with code ${code}`);
  }
});

nextProcess.on('error', (error) => {
  console.error('❌ Failed to start Next.js:', error.message);
});

// Handle graceful shutdown
process.on('SIGINT', () => {
  console.log('\n🛑 Shutting down...');
  nextProcess.kill();
  process.exit();
});

console.log('📱 Open your browser to: http://localhost:3000');
console.log('🔧 Admin panel will be at: http://localhost:3000/admin');
console.log('\nPress Ctrl+C to stop\n');