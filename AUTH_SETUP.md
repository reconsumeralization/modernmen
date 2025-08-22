# Authentication Setup Guide

This guide will help you configure authentication for your Next.js application.

## Environment Variables

Create a `.env.local` file in your project root with the following variables:

```bash
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key

# NextAuth Configuration
NEXTAUTH_SECRET=your_nextauth_secret_here
NEXTAUTH_URL=http://localhost:3000

# OAuth Providers (Optional - remove if not using)
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
GITHUB_CLIENT_ID=your_github_client_id
GITHUB_CLIENT_SECRET=your_github_client_secret
```

## Generating NEXTAUTH_SECRET

Run this command in your terminal to generate a secure secret:

```bash
openssl rand -base64 32
```

## Supabase Setup

1. Create a new project at [supabase.com](https://supabase.com)
2. Go to Settings > API to find your project URL and service role key
3. Run the database migration to create auth tables:

```bash
npx supabase db reset
```

## OAuth Provider Setup

### Google OAuth
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing one
3. Enable Google+ API
4. Create OAuth 2.0 credentials
5. Add authorized redirect URI: `http://localhost:3000/api/auth/callback/google`

### GitHub OAuth
1. Go to GitHub Settings > Developer settings > OAuth Apps
2. Create a new OAuth App
3. Set Authorization callback URL to: `http://localhost:3000/api/auth/callback/github`

## Testing Authentication

1. Start your development server:
```bash
npm run dev
```

2. Visit `/auth/signin` to test the authentication flow

3. Available authentication methods:
   - Credentials (username/password)
   - Google OAuth (if configured)
   - GitHub OAuth (if configured)

## Database Tables

The auth system uses these tables:
- `users` - User profiles and credentials
- `accounts` - OAuth provider accounts
- `sessions` - User sessions
- `verification_tokens` - Email verification tokens

All tables are automatically created when you run the migration.
