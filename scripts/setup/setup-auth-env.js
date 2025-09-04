#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

console.log('🔐 Authentication Environment Setup');
console.log('=====================================');

const envLocalPath = path.join(__dirname, '.env.local');

// Generate a secure NEXTAUTH_SECRET
const nextauthSecret = crypto.randomBytes(32).toString('base64');

const envContent = `# Environment Variables for Authentication
# Generated automatically - please update with your actual values

# NextAuth Configuration
NEXTAUTH_SECRET=${nextauthSecret}
NEXTAUTH_URL=http://localhost:3000

# Supabase Configuration (UPDATE THESE VALUES)
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your-supabase-service-role-key

# OAuth Providers (Optional - UPDATE THESE VALUES)
# GOOGLE_CLIENT_ID=your-google-client-id
# GOOGLE_CLIENT_SECRET=your-google-client-secret
# GITHUB_CLIENT_ID=your-github-client-id
# GITHUB_CLIENT_SECRET=your-github-client-secret

# Email Configuration (Optional)
# EMAIL_SERVER=smtp://username:password@smtp.example.com:587
# EMAIL_FROM=noreply@yourdomain.com

# Application Configuration
NODE_ENV=development
DEBUG=true

# Security Configuration
SESSION_MAX_AGE=30 * 24 * 60 * 60  # 30 days
JWT_MAX_AGE=7 * 24 * 60 * 60      # 7 days
`;

try {
  if (fs.existsSync(envLocalPath)) {
    console.log('⚠️  .env.local already exists. Backing up...');
    const backupPath = `${envLocalPath}.backup.${Date.now()}`;
    fs.copyFileSync(envLocalPath, backupPath);
    console.log(`📁 Backup created: ${backupPath}`);
  }

  fs.writeFileSync(envLocalPath, envContent);
  console.log('✅ .env.local created successfully!');
  console.log('\n📝 Next Steps:');
  console.log('1. Update the Supabase values with your actual project details');
  console.log('2. Uncomment and configure OAuth providers if needed');
  console.log('3. Set up your Supabase project and run migrations');
  console.log('4. Restart your development server');

  console.log('\n🔑 Generated NEXTAUTH_SECRET:', nextauthSecret);

} catch (error) {
  console.error('❌ Error creating .env.local:', error.message);
  process.exit(1);
}
