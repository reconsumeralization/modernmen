#!/usr/bin/env node

/**
 * Vercel Deployment Fix Script
 * Handles pnpm installation issues and network problems during deployment
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🚀 Vercel Deployment Fix Script');
console.log('================================\n');

// Check current environment
console.log('📋 Environment Check:');
console.log('- Node Version:', process.version);
console.log('- Platform:', process.platform);
console.log('- Architecture:', process.arch);
console.log('');

function runCommand(command, description) {
  try {
    console.log(`🔧 ${description}...`);
    const result = execSync(command, {
      stdio: 'inherit',
      timeout: 300000, // 5 minutes timeout
      env: {
        ...process.env,
        // Force stable npm registry
        npm_config_registry: 'https://registry.npmjs.org/',
        // Disable strict SSL for problematic networks
        npm_config_strict_ssl: 'false',
        // Increase timeout
        npm_config_fetch_timeout: '60000',
        npm_config_fetch_retry_mintimeout: '10000',
        npm_config_fetch_retry_maxtimeout: '120000',
        // pnpm specific
        PNPM_REGISTRY: 'https://registry.npmjs.org/',
        PNPM_FETCH_TIMEOUT: '60000'
      }
    });
    console.log(`✅ ${description} completed successfully\n`);
    return result;
  } catch (error) {
    console.error(`❌ ${description} failed:`, error.message);
    throw error;
  }
}

async function fixDeployment() {
  try {
    // Step 1: Clean up any existing issues
    console.log('🧹 Step 1: Cleaning up...');
    try {
      runCommand('rm -rf node_modules .next .pnpm-store', 'Removing old dependencies');
    } catch (e) {
      console.log('⚠️  Cleanup failed, continuing...');
    }

    // Step 2: Verify pnpm installation
    console.log('🔍 Step 2: Checking pnpm installation...');
    try {
      execSync('pnpm --version', { stdio: 'pipe' });
      console.log('✅ pnpm is available\n');
    } catch (e) {
      console.log('⚠️  pnpm not found, installing...');
      runCommand('npm install -g pnpm@latest', 'Installing pnpm globally');
    }

    // Step 3: Configure pnpm for better reliability
    console.log('⚙️  Step 3: Configuring pnpm...');
    const pnpmrcPath = path.join(process.cwd(), '.pnpmrc');
    const pnpmrcContent = `# pnpm configuration for Vercel deployment
registry=https://registry.npmjs.org/
network-concurrency=4
fetch-retries=5
fetch-retry-factor=2
fetch-retry-mintimeout=10000
fetch-retry-maxtimeout=120000
strict-peer-dependencies=false
auto-install-peers=true
resolution-mode=highest
save-workspace-protocol=false
`;

    fs.writeFileSync(pnpmrcPath, pnpmrcContent);
    console.log('✅ pnpm configured\n');

    // Step 4: Install dependencies with retry logic
    console.log('📦 Step 4: Installing dependencies...');
    const installAttempts = 3;
    let installSuccess = false;

    for (let attempt = 1; attempt <= installAttempts; attempt++) {
      try {
        console.log(`🔄 Attempt ${attempt}/${installAttempts}...`);

        // Try different installation methods
        const installCommands = [
          'pnpm install --frozen-lockfile --ignore-scripts',
          'pnpm install --frozen-lockfile',
          'pnpm install --no-frozen-lockfile'
        ];

        for (const cmd of installCommands) {
          try {
            runCommand(cmd, `Installing with: ${cmd}`);
            installSuccess = true;
            break;
          } catch (e) {
            console.log(`⚠️  ${cmd} failed, trying next method...`);
          }
        }

        if (installSuccess) break;

      } catch (error) {
        if (attempt === installAttempts) {
          throw new Error(`All installation attempts failed: ${error.message}`);
        }
        console.log(`⚠️  Attempt ${attempt} failed, retrying in 10 seconds...`);
        await new Promise(resolve => setTimeout(resolve, 10000));
      }
    }

    if (!installSuccess) {
      throw new Error('Failed to install dependencies after all attempts');
    }

    // Step 5: Verify installation
    console.log('🔍 Step 5: Verifying installation...');
    runCommand('pnpm list --depth=0', 'Checking installed packages');

    // Step 6: Build the project
    console.log('🏗️  Step 6: Building project...');
    runCommand('pnpm run build', 'Building Next.js application');

    console.log('🎉 Deployment preparation completed successfully!');
    console.log('\n📝 Next steps:');
    console.log('1. Push your changes to trigger Vercel deployment');
    console.log('2. Monitor the build logs for any remaining issues');
    console.log('3. If issues persist, check Vercel dashboard for detailed error logs');

  } catch (error) {
    console.error('\n💥 Deployment fix failed:', error.message);
    console.error('\n🔧 Troubleshooting tips:');
    console.error('1. Check your internet connection');
    console.error('2. Try clearing Vercel cache in dashboard');
    console.error('3. Verify all environment variables are set');
    console.error('4. Check if any dependencies have been deprecated');
    console.error('5. Consider using npm instead of pnpm temporarily');

    process.exit(1);
  }
}

// Run the fix
fixDeployment().catch(console.error);
