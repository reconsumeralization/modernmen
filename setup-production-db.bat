@echo off
echo ===========================================
echo  VERCEL DATABASE SETUP SCRIPT
echo ===========================================
echo.

echo 1. Create Vercel Postgres Database:
echo    - Go to: https://vercel.com/dashboard
echo    - Select your modernmen project
echo    - Go to Storage tab
echo    - Click "Create Database"
echo    - Select "Postgres"
echo    - Note down the DATABASE_URL
echo.

echo 2. Set Environment Variables in Vercel:
echo    Run these commands one by one:
echo.
echo    vercel env add DATABASE_URL
echo    vercel env add JWT_SECRET
echo    vercel env add STRIPE_SECRET_KEY
echo    vercel env add STRIPE_PUBLISHABLE_KEY
echo    vercel env add NEXT_PUBLIC_SITE_URL
echo.

echo 3. Push Database Schema:
echo    After setting DATABASE_URL, run:
echo    npx prisma db push
echo.

echo 4. Redeploy:
echo    vercel --prod
echo.

pause