#!/bin/bash

echo "==================================================="
echo "  MODERNMEN VERCEL DATABASE SETUP SCRIPT"
echo "==================================================="
echo

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    echo "❌ Error: Run this script from the modernmen project root"
    exit 1
fi

echo "📋 STEP 1: Verify Project Setup"
echo "Project: $(grep -o '"name": "[^"]*' package.json | cut -d'"' -f4)"
echo

echo "📋 STEP 2: Database Options"
echo "Choose your database provider:"
echo "1. Vercel Postgres (Recommended - $5/month)"
echo "2. Supabase (Free tier available)"
echo "3. PlanetScale (MySQL - Free tier)" 
echo "4. Railway Postgres (Free tier)"
echo

read -p "Enter your choice (1-4): " choice

case $choice in
    1)
        echo
        echo "🔗 VERCEL POSTGRES SETUP:"
        echo "1. Go to: https://vercel.com/dashboard"
        echo "2. Select your 'modernmen' project"
        echo "3. Go to 'Storage' tab"
        echo "4. Click 'Create Database' → 'Postgres'"
        echo "5. Copy the DATABASE_URL from the .env.local tab"
        echo
        ;;
    2)
        echo
        echo "🔗 SUPABASE SETUP:"
        echo "1. Go to: https://supabase.com/dashboard"
        echo "2. Create new project"
        echo "3. Go to Settings → Database"
        echo "4. Copy the connection string"
        echo "5. Replace [YOUR-PASSWORD] with your database password"
        echo
        ;;
    3)
        echo
        echo "🔗 PLANETSCALE SETUP:"
        echo "1. Go to: https://planetscale.com/dashboard"
        echo "2. Create new database"
        echo "3. Create a branch (main)"
        echo "4. Go to Connect → Prisma"
        echo "5. Copy the DATABASE_URL"
        echo
        ;;
    4)
        echo
        echo "🔗 RAILWAY SETUP:"
        echo "1. Go to: https://railway.app/dashboard"
        echo "2. New Project → Provision PostgreSQL"
        echo "3. Go to PostgreSQL → Variables"
        echo "4. Copy the DATABASE_URL"
        echo
        ;;
esac

echo "📋 STEP 3: Set Environment Variables in Vercel"
echo "Run these commands after getting your DATABASE_URL:"
echo
echo "vercel env add DATABASE_URL"
echo "vercel env add JWT_SECRET"
echo "vercel env add STRIPE_SECRET_KEY"
echo "vercel env add STRIPE_PUBLISHABLE_KEY"
echo "vercel env add NEXT_PUBLIC_SITE_URL"
echo

echo "📋 STEP 4: Test Database Connection Locally"
echo "After setting up your database:"
echo
echo "1. Update your .env.local with the real DATABASE_URL"
echo "2. Run: npx prisma db push"
echo "3. Run: npx prisma db seed (optional)"
echo

echo "📋 STEP 5: Deploy to Production"
echo "vercel --prod"
echo

echo "🔧 TROUBLESHOOTING:"
echo "If you get connection errors:"
echo "- Ensure DATABASE_URL includes ?sslmode=require for PostgreSQL"
echo "- Check firewall/IP restrictions on your database"
echo "- Verify the connection string format"
echo

echo "✅ Setup complete! Follow the steps above to configure your database."