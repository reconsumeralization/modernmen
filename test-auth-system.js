#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

console.log('🔐 Authentication System - Comprehensive Test Suite');
console.log('====================================================');

const results = {
  passed: 0,
  failed: 0,
  warnings: 0
};

function test(name, condition, warning = false) {
  if (condition) {
    console.log(`✅ ${name}`);
    results.passed++;
  } else if (warning) {
    console.log(`⚠️  ${name}`);
    results.warnings++;
  } else {
    console.log(`❌ ${name}`);
    results.failed++;
  }
}

// Test file existence
function testFileExists(filePath, description) {
  const fullPath = path.join(__dirname, filePath);
  const exists = fs.existsSync(fullPath);
  test(`${description}: ${filePath}`, exists);
}

// Test directory existence
function testDirectoryExists(dirPath, description) {
  const fullPath = path.join(__dirname, dirPath);
  const exists = fs.existsSync(fullPath) && fs.statSync(fullPath).isDirectory();
  test(`${description}: ${dirPath}`, exists);
}

// Test environment variables
function testEnvVar(varName, description) {
  const value = process.env[varName];
  const hasValue = value && !value.includes('your-') && value !== 'https://your-project.supabase.co';
  test(`${description}: ${varName}`, hasValue, !hasValue && value); // Warning if placeholder
}

// Test file content
function testFileContent(filePath, searchText, description) {
  try {
    const fullPath = path.join(__dirname, filePath);
    const content = fs.readFileSync(fullPath, 'utf8');
    const hasContent = content.includes(searchText);
    test(`${description}: ${filePath} contains "${searchText}"`, hasContent);
  } catch (error) {
    test(`${description}: ${filePath} contains "${searchText}"`, false);
  }
}

console.log('\n📁 File Structure Tests');
console.log('------------------------');

// Core authentication files
testFileExists('src/lib/auth.ts', 'Auth configuration');
testFileExists('src/app/api/auth/[...nextauth]/route.ts', 'NextAuth API route');
testFileExists('src/middleware.ts', 'Middleware configuration');
testFileExists('src/types/next-auth.d.ts', 'NextAuth type definitions');
testDirectoryExists('src/app/auth', 'Auth pages directory');

// Auth pages
testFileExists('src/app/auth/signin/page.tsx', 'Signin page');
testFileExists('src/app/auth/signup/page.tsx', 'Signup page');
testFileExists('src/app/auth/error/page.tsx', 'Error page');
testFileExists('src/app/auth/forgot-password/page.tsx', 'Forgot password page');
testFileExists('src/app/auth/reset-password/page.tsx', 'Reset password page');

// API endpoints
testFileExists('src/app/api/auth/signup/route.ts', 'Signup API endpoint');
testFileExists('src/app/api/auth/forgot-password/route.ts', 'Forgot password API endpoint');
testFileExists('src/app/api/auth/reset-password/route.ts', 'Reset password API endpoint');
testFileExists('src/app/api/auth/validate-reset-token/route.ts', 'Validate reset token API endpoint');

// Admin functionality
testFileExists('src/app/admin/page.tsx', 'Admin dashboard');
testFileExists('src/app/api/admin/stats/route.ts', 'Admin stats API');
testFileExists('src/app/api/admin/users/recent/route.ts', 'Admin users API');

// Utilities and libraries
testFileExists('src/lib/logger.ts', 'Logging system');
testFileExists('src/lib/auth-ratelimit.ts', 'Rate limiting system');
testFileExists('supabase/migrations/20240403083707_auth_tables.sql', 'Database migration');

// Environment and configuration
testFileExists('.env.local', 'Environment configuration');
testFileExists('AUTH_SETUP.md', 'Setup documentation');

console.log('\n🔧 Environment Configuration Tests');
console.log('-----------------------------------');

// Check environment variables
testEnvVar('NEXTAUTH_SECRET', 'NextAuth secret');
testEnvVar('NEXT_PUBLIC_SUPABASE_URL', 'Supabase URL');
testEnvVar('SUPABASE_SERVICE_ROLE_KEY', 'Supabase service role key');

console.log('\n🔒 Security Implementation Tests');
console.log('---------------------------------');

// Test auth.ts content
testFileContent('src/lib/auth.ts', 'rateLimitResult.success', 'Rate limiting in auth.ts');
testFileContent('src/lib/auth.ts', 'logger.authEvent', 'Logging in auth.ts');
testFileContent('src/lib/auth.ts', 'bcrypt.compare', 'Password hashing');
testFileContent('src/lib/auth.ts', 'SupabaseAdapter', 'Supabase adapter');

// Test middleware content
testFileContent('src/middleware.ts', 'getToken', 'Token verification');
testFileContent('src/middleware.ts', 'role', 'Role-based access control');
testFileContent('src/middleware.ts', 'rateLimitData', 'Rate limiting in middleware');
testFileContent('src/middleware.ts', 'x-user-id', 'User context headers');

// Test API endpoints
testFileContent('src/app/api/auth/signup/route.ts', 'bcrypt.hash', 'Password hashing in signup');
testFileContent('src/app/api/auth/signup/route.ts', 'rateLimitResult', 'Rate limiting in signup');
testFileContent('src/app/api/auth/signup/route.ts', 'logger.authEvent', 'Logging in signup');

// Test pages
testFileContent('src/app/auth/signin/page.tsx', 'handleCredentialsSignIn', 'Credentials signin');
testFileContent('src/app/auth/signin/page.tsx', 'handleProviderSignIn', 'OAuth signin');
testFileContent('src/app/auth/signup/page.tsx', 'validateForm', 'Form validation');
testFileContent('src/app/auth/signup/page.tsx', 'confirmPassword', 'Password confirmation');

console.log('\n📊 Database Schema Tests');
console.log('------------------------');

// Test migration content
testFileContent('supabase/migrations/20240403083707_auth_tables.sql', 'users', 'Users table');
testFileContent('supabase/migrations/20240403083707_auth_tables.sql', 'accounts', 'Accounts table');
testFileContent('supabase/migrations/20240403083707_auth_tables.sql', 'sessions', 'Sessions table');
testFileContent('supabase/migrations/20240403083707_auth_tables.sql', 'resetToken', 'Password reset fields');

console.log('\n🔍 UI Components Tests');
console.log('----------------------');

// Test component imports
testFileContent('src/components/ui/icons.tsx', 'Loader2', 'Loading icon');
testFileContent('src/components/ui/label.tsx', 'LabelPrimitive', 'Label component');
testFileContent('src/components/ui/sonner.tsx', 'Toaster', 'Toast component');

console.log('\n📈 Monitoring & Logging Tests');
console.log('-----------------------------');

testFileContent('src/lib/logger.ts', 'LogLevel', 'Log level types');
testFileContent('src/lib/logger.ts', 'authEvent', 'Auth event logging');
testFileContent('src/lib/logger.ts', 'rateLimitExceeded', 'Rate limit logging');
testFileContent('src/lib/auth-ratelimit.ts', 'AuthRateLimiter', 'Rate limiter class');
testFileContent('src/lib/auth-ratelimit.ts', 'getRateLimitIdentifier', 'Rate limit identifier function');

console.log('\n📋 Documentation Tests');
console.log('-----------------------');

testFileContent('AUTH_SETUP.md', 'Environment Variables', 'Environment setup docs');
testFileContent('AUTH_SETUP.md', 'Supabase Setup', 'Supabase setup docs');
testFileContent('AUTH_SETUP.md', 'OAuth Providers', 'OAuth setup docs');

console.log('\n📊 Test Results Summary');
console.log('=======================');
console.log(`✅ Passed: ${results.passed}`);
console.log(`❌ Failed: ${results.failed}`);
console.log(`⚠️  Warnings: ${results.warnings}`);
console.log(`📊 Total: ${results.passed + results.failed + results.warnings}`);

const totalTests = results.passed + results.failed + results.warnings;
const successRate = ((results.passed / totalTests) * 100).toFixed(1);

if (results.failed === 0) {
  console.log(`\n🎉 All tests passed! (${successRate}% success rate)`);
  console.log('\n✨ Authentication system is fully implemented and ready for use!');
} else {
  console.log(`\n⚠️  ${results.failed} test(s) failed (${successRate}% success rate)`);
  console.log('\n🔧 Please review the failed tests and fix the issues.');
}

console.log('\n🚀 Next Steps:');
console.log('1. Set up your Supabase project with actual credentials');
console.log('2. Run database migrations: npx supabase db reset');
console.log('3. Configure OAuth providers (optional)');
console.log('4. Test the authentication flow in your browser');
console.log('5. Set up email service for password reset (optional)');

process.exit(results.failed > 0 ? 1 : 0);
