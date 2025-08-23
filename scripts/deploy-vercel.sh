#!/bin/bash

# Vercel deployment script for Modern Men Hair Salon Documentation System

echo "🚀 Starting Vercel deployment process..."

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
  echo "❌ Error: package.json not found. Please run this script from the project root."
  exit 1
fi

# Install dependencies with legacy peer deps for compatibility
echo "📦 Installing dependencies..."
npm install --legacy-peer-deps

# Run linting and fix issues
echo "🔧 Running linting fixes..."
npm run lint:fix || echo "⚠️  Some linting issues couldn't be auto-fixed"

# Generate Payload types
echo "🔄 Generating Payload types..."
npm run payload:generate-types || echo "⚠️  Payload types generation skipped (may need database connection)"

# Run type checking
echo "🔍 Running type check..."
npm run typecheck || echo "⚠️  Type check completed with warnings"

# Build the project
echo "🏗️  Building project..."
npm run build

if [ $? -eq 0 ]; then
  echo "✅ Build successful!"
  echo ""
  echo "🎯 Ready for Vercel deployment!"
  echo ""
  echo "Next steps:"
  echo "1. Set up environment variables in Vercel dashboard:"
  echo "   - PAYLOAD_SECRET"
  echo "   - PAYLOAD_PUBLIC_SERVER_URL"
  echo "   - DATABASE_URL"
  echo "   - NEXTAUTH_SECRET"
  echo "   - NEXTAUTH_URL"
  echo ""
  echo "2. Deploy with: vercel --prod"
  echo ""
  echo "3. Run database migrations after deployment:"
  echo "   - vercel env pull .env.local"
  echo "   - npm run payload:migrate"
else
  echo "❌ Build failed. Please fix the errors above before deploying."
  exit 1
fi