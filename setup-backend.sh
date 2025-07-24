#!/bin/bash

echo "🚀 Setting up Modern Men Hair Salon Backend..."

# Install dependencies
echo "📦 Installing dependencies..."
npm install

# Generate Prisma client
echo "🗃️ Generating Prisma client..."
npm run db:generate

# Push database schema
echo "📋 Setting up database schema..."
npm run db:push

# Seed database with initial data
echo "🌱 Seeding database..."
npm run db:seed

echo "✅ Setup complete! Your salon management system is ready."
echo "🔗 Start development server with: npm run dev"
echo "📊 Visit admin panel at: http://localhost:3000/admin"
echo "📖 API docs at: http://localhost:3000/api/docs"
