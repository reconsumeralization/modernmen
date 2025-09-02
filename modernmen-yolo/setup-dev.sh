#!/bin/bash

# ===========================================
# MODERN MEN HAIR SALON - DEVELOPMENT SETUP
# ===========================================
# This script sets up the development environment

set -e

echo "🚀 Setting up Modern Men Hair Salon Development Environment"
echo "========================================================="

# Check prerequisites
echo "📋 Checking prerequisites..."

# Check Node.js
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js 18+ first."
    exit 1
fi

NODE_VERSION=$(node -v | cut -d'.' -f1 | cut -d'v' -f2)
if [ "$NODE_VERSION" -lt 18 ]; then
    echo "❌ Node.js version 18+ required. Current version: $(node -v)"
    exit 1
fi

echo "✅ Node.js $(node -v) detected"

# Check npm
if ! command -v npm &> /dev/null; then
    echo "❌ npm is not installed."
    exit 1
fi

echo "✅ npm $(npm -v) detected"

# Check Git
if ! command -v git &> /dev/null; then
    echo "❌ Git is not installed."
    exit 1
fi

echo "✅ Git $(git --version | cut -d' ' -f3) detected"

echo ""
echo "📦 Installing dependencies..."

# Install root dependencies
echo "Installing root dependencies..."
npm install

# Install frontend dependencies
echo "Installing frontend dependencies..."
cd packages/frontend
npm install

# Return to root
cd ../..

echo ""
echo "🔧 Setting up environment..."

# Check if .env.local exists
if [ ! -f "packages/frontend/.env.local" ]; then
    echo "⚠️  Environment file not found."
    echo "Creating template from example..."
    echo ""
    echo "Please create packages/frontend/.env.local with the following variables:"
    echo ""
    cat << 'EOF'
# Application
NEXT_PUBLIC_APP_URL=http://localhost:3000

# Supabase (get from https://supabase.com/dashboard)
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# Stripe (get from https://dashboard.stripe.com)
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_your-key
STRIPE_SECRET_KEY=sk_test_your-secret

# SendGrid (get from https://app.sendgrid.com)
SENDGRID_API_KEY=SG.your-api-key
SENDGRID_FROM_EMAIL=noreply@modernmen.com

# Twilio (get from https://console.twilio.com)
TWILIO_ACCOUNT_SID=ACxxxxxxxxxxxxxxxx
TWILIO_AUTH_TOKEN=your-auth-token
TWILIO_PHONE_NUMBER=+1234567890
EOF
    echo ""
    echo "Press Enter when you've created the .env.local file..."
    read -r
else
    echo "✅ Environment file found"
fi

echo ""
echo "🗄️  Setting up database..."

# Check if Supabase CLI is installed
if ! command -v supabase &> /dev/null; then
    echo "⚠️  Supabase CLI not found. Installing..."
    npm install -g supabase
fi

echo "Starting Supabase..."
npx supabase start

echo ""
echo "📊 Setting up database schema..."

# Push database schema
npm run db:push

# Generate types
npm run db:generate

echo ""
echo "🎉 Setup complete!"
echo ""
echo "🚀 To start development:"
echo "  npm run dev"
echo ""
echo "📱 Access points:"
echo "  Frontend:    http://localhost:3000"
echo "  API:         http://localhost:54321"
echo "  Supabase:    http://localhost:54323"
echo "  Email Test:  http://localhost:54324"
echo ""
echo "📖 For more information, see DEVELOPER-GUIDE.md"
echo ""
echo "Happy coding! 🎯"
