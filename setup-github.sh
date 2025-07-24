#!/bin/bash

echo "🚀 Setting up GitHub repository for Modern Men Hair Salon..."

# Initialize git repository if not already done
if [ ! -d ".git" ]; then
    echo "📝 Initializing Git repository..."
    git init
fi

# Add all files
echo "📂 Adding files to Git..."
git add .

# Create initial commit
echo "💾 Creating initial commit..."
git commit -m "🎉 Initial commit: Complete Modern Men Hair Salon Management System

✨ Features:
- Complete backend API with 15+ endpoints
- Admin CMS dashboard with analytics
- Client management with loyalty points
- Online booking system with conflict detection
- Staff performance tracking
- Service catalog management
- Real-time business analytics
- Mobile-responsive design
- PostgreSQL database with Prisma ORM
- Production-ready deployment configuration

🚀 Ready for deployment to Vercel
📊 Enterprise-grade salon management system
🎯 Built with Next.js 14, TypeScript, Tailwind CSS"

echo "✅ Git repository initialized!"
echo ""
echo "📋 Next steps:"
echo "1. Create a new repository on GitHub"
echo "2. Copy the remote URL"
echo "3. Run: git remote add origin https://github.com/username/repo.git"
echo "4. Run: git branch -M main"
echo "5. Run: git push -u origin main"
echo ""
echo "🔗 Or use GitHub CLI:"
echo "   gh repo create modernmen-salon --public"
echo "   git remote add origin https://github.com/username/modernmen-salon.git"
echo "   git push -u origin main"
