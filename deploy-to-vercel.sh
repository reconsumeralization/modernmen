#!/bin/bash

# Modern Men Vercel Deployment Script
# This script handles the complete deployment process for your Next.js app

echo "🚀 Modern Men Vercel Deployment Script"
echo "======================================"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    print_error "package.json not found. Please run this script from the project root."
    exit 1
fi

print_status "Checking project structure..."

# Verify this is a Next.js project
if ! grep -q "next" package.json; then
    print_error "This doesn't appear to be a Next.js project."
    exit 1
fi

print_success "Next.js project detected!"

# Step 1: Install Node.js and npm if not present
print_status "Checking Node.js installation..."
if ! command -v node &> /dev/null; then
    print_warning "Node.js not found. Please install Node.js first:"
    echo "1. Download from: https://nodejs.org/"
    echo "2. Or use package manager:"
    echo "   - Windows: winget install OpenJS.NodeJS"
    echo "   - macOS: brew install node"
    echo "   - Linux: apt install nodejs npm"
    exit 1
fi

NODE_VERSION=$(node --version)
print_success "Node.js $NODE_VERSION detected"

# Step 2: Install dependencies
print_status "Installing project dependencies..."
if ! npm install; then
    print_error "Failed to install dependencies"
    exit 1
fi
print_success "Dependencies installed successfully"
# Step 3: Install Vercel CLI
print_status "Installing Vercel CLI..."
if ! command -v vercel &> /dev/null; then
    if ! npm install -g vercel; then
        print_error "Failed to install Vercel CLI"
        exit 1
    fi
    print_success "Vercel CLI installed successfully"
else
    print_success "Vercel CLI already installed"
fi

# Step 4: Test build locally
print_status "Testing local build..."
if ! npm run build; then
    print_error "Build failed. Please fix build errors before deploying."
    print_warning "Common build issues:"
    echo "  - Check for TypeScript errors"
    echo "  - Verify environment variables"
    echo "  - Check for missing dependencies"
    exit 1
fi
print_success "Build completed successfully"

# Step 5: Initialize Git if not already initialized
print_status "Setting up Git repository..."
if [ ! -d ".git" ]; then
    git init
    git add .
    git commit -m "Initial commit for Vercel deployment"
    print_success "Git repository initialized"
else
    print_success "Git repository already exists"
fi

# Step 6: Create .gitignore additions for Vercel
print_status "Updating .gitignore for Vercel..."
cat >> .gitignore << 'EOF'

# Vercel
.vercel

# Environment variables (production)
.env.production
.env.production.local

EOF
print_success ".gitignore updated"

# Step 7: Create environment setup guide
print_status "Creating environment setup guide..."cat > VERCEL_DEPLOYMENT.md << 'EOF'
# Vercel Deployment Guide for Modern Men

## Environment Variables Required

### Production Environment Variables (Set in Vercel Dashboard)
```
# Database (Production Supabase)
NEXT_PUBLIC_SUPABASE_URL=your_production_supabase_url
SUPABASE_SERVICE_ROLE_KEY=your_production_supabase_service_key

# Authentication
NEXTAUTH_SECRET=your_production_nextauth_secret
NEXTAUTH_URL=https://your-app.vercel.app

# OAuth Providers
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
GITHUB_CLIENT_ID=your_github_client_id
GITHUB_CLIENT_SECRET=your_github_client_secret

# Redis (Production)
UPSTASH_REDIS_REST_URL=your_production_redis_url
UPSTASH_REDIS_REST_TOKEN=your_production_redis_token

# API Keys
OPENAI_API_KEY=your_openai_api_key
ANTHROPIC_API_KEY=your_anthropic_api_key
```

## Deployment Steps

1. Push code to GitHub/GitLab
2. Connect repository to Vercel
3. Set environment variables in Vercel dashboard
4. Deploy!

## Post-Deployment Checklist

- [ ] Verify environment variables are set
- [ ] Test authentication flows
- [ ] Check database connectivity
- [ ] Verify API routes work
- [ ] Test production build
- [ ] Set up custom domain (optional)
- [ ] Configure monitoring and analytics

EOF
print_success "Environment setup guide created"

# Step 8: Deploy to Vercel
print_status "Starting Vercel deployment..."
print_warning "You'll need to:"
echo "1. Login to Vercel when prompted"
echo "2. Configure project settings"
echo "3. Set up environment variables in the Vercel dashboard"

# Login to Vercel
vercel login
# Deploy the project
print_status "Deploying to Vercel..."
if vercel --prod; then
    print_success "Deployment successful!"
    print_success "Your app is now live on Vercel!"
    
    echo ""
    echo "🎉 DEPLOYMENT COMPLETE!"
    echo "======================"
    echo ""
    print_success "Next steps:"
    echo "1. Set up production environment variables in Vercel dashboard"
    echo "2. Configure your custom domain (if desired)"
    echo "3. Set up monitoring and analytics"
    echo "4. Test all functionality in production"
    echo ""
    echo "📖 Read VERCEL_DEPLOYMENT.md for detailed setup instructions"
    echo ""
else
    print_error "Deployment failed. Please check the error messages above."
    echo ""
    print_warning "Common deployment issues:"
    echo "  - Missing environment variables"
    echo "  - Build errors"
    echo "  - Authentication problems"
    echo "  - Network connectivity issues"
    echo ""
    echo "📖 Check VERCEL_DEPLOYMENT.md for troubleshooting tips"
fi