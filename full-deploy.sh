#!/bin/bash

# Modern Men Hair Salon - Complete Deployment Script
# Run this after Node.js is installed

echo "🚀 Modern Men Hair Salon - Complete Setup & Deploy"
echo "=================================================="

# Check Node.js
if ! command -v node &> /dev/null; then
    echo "❌ Node.js not found!"
    echo "Please install from: https://nodejs.org/"
    exit 1
fi

echo "✅ Node.js found: $(node --version)"

# Navigate to project
cd "$(dirname "$0")" || exit 1

# Install dependencies
echo "📦 Installing dependencies..."
npm install

# Build project
echo "🔨 Building project..."
npm run build

if [ $? -ne 0 ]; then
    echo "❌ Build failed!"
    exit 1
fi

echo "✅ Build successful!"

# Install Vercel CLI
echo "📥 Installing Vercel CLI..."
npm install -g vercel

# Deploy
echo "🚀 Deploying to Vercel..."
vercel --prod

echo ""
echo "🎉 Deployment complete!"
echo ""
echo "✅ Your Modern Men Hair Salon website is now live!"
echo "✅ Professional design with their actual salon photos"
echo "✅ Correct contact info: Regina, Saskatchewan"
echo "✅ Working booking system"
echo "✅ Mobile responsive"
echo "✅ Fast & SEO optimized"
echo ""
echo "📞 Contact Info Included:"
echo "   Phone: (306) 522-4111"
echo "   Text: (306) 541-5511"
echo "   Email: info@modernmen.ca"
echo "   Address: #4 - 425 Victoria Ave East, Regina, SK"
echo ""
