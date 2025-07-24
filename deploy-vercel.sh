#!/bin/bash

echo "🚀 Deploying Modern Men Hair Salon to Vercel..."

# Install Vercel CLI if not already installed
if ! command -v vercel &> /dev/null; then
    echo "📦 Installing Vercel CLI..."
    npm install -g vercel
fi

# Build and deploy
echo "🔨 Building project..."
npm run build

echo "🌐 Deploying to Vercel..."
vercel --prod

echo "✅ Deployment complete!"
echo "🔗 Your site is now live on Vercel"
echo "📊 Don't forget to set up your DATABASE_URL in Vercel dashboard"
echo "🔐 Add ADMIN_API_KEY environment variable for admin access"
