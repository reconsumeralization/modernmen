const fs = require('fs');
const crypto = require('crypto');

const nextauthSecret = crypto.randomBytes(32).toString('base64');
const timestamp = new Date().toISOString();

const envContent = `# Environment Variables for Development
# Generated: ${timestamp}

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

# Vercel Configuration (for deployment)
# VERCEL_ENV=development
# VERCEL_URL=http://localhost:3000
`;

try {
  fs.writeFileSync('.env.local', envContent);
  console.log('✅ .env.local created successfully!');
  console.log('🔑 Generated NEXTAUTH_SECRET:', nextauthSecret);
  console.log('');
  console.log('📝 IMPORTANT: Update the Supabase values with your actual project credentials');
  console.log('📝 Location: .env.local (lines 8-9)');
  console.log('');
  console.log('🔗 Next steps:');
  console.log('1. Set up Supabase project (see SUPABASE_SETUP_GUIDE.md)');
  console.log('2. Update NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY');
  console.log('3. Run: npx supabase db reset (to create auth tables)');
  console.log('4. Restart development server');
} catch (error) {
  console.error('❌ Error creating .env.local:', error.message);
}
