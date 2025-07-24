@echo off
echo 🚀 Deploying Modern Men Hair Salon to Vercel...

echo 📦 Installing Vercel CLI...
npm install -g vercel

echo 🔨 Building project...
npm run build

echo 🌐 Deploying to Vercel...
vercel --prod

echo ✅ Deployment complete!
echo 🔗 Your site is now live on Vercel
echo 📊 Don't forget to set up your DATABASE_URL in Vercel dashboard
echo 🔐 Add ADMIN_API_KEY environment variable for admin access

pause
