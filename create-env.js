const fs = require('fs');
const crypto = require('crypto');

// Generate secure NEXTAUTH_SECRET
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
  fs.writeFileSync('.env.local', envContent);
  console.log('✅ .env.local created successfully!');
  console.log('🔑 Generated NEXTAUTH_SECRET:', nextauthSecret);
  console.log('');
  console.log('📝 Next Steps:');
  console.log('1. Update the Supabase values with your actual project details');
  console.log('2. Uncomment and configure OAuth providers if needed');
  console.log('3. Set up your Supabase project and run migrations');
  console.log('4. Restart your development server');
} catch (error) {
  console.error('❌ Error creating .env.local:', error.message);
}
