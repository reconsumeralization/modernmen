@echo off
echo ===========================================
echo  MODERNMEN DEPLOYMENT STATUS CHECK
echo ===========================================
echo.

echo Checking current configuration...
echo.

echo 📁 Project Structure:
if exist "package.json" (echo ✅ package.json found) else (echo ❌ package.json missing)
if exist "prisma\schema.prisma" (echo ✅ Prisma schema found) else (echo ❌ Prisma schema missing)
if exist ".vercel\project.json" (echo ✅ Vercel project configured) else (echo ❌ Vercel not configured)
if exist ".env.local" (echo ✅ Environment file found) else (echo ❌ .env.local missing)
echo.

echo 📦 Dependencies:
npm list --depth=0 2>nul | findstr "@prisma/client" >nul && echo ✅ Prisma Client installed || echo ❌ Prisma Client missing
npm list --depth=0 2>nul | findstr "stripe" >nul && echo ✅ Stripe installed || echo ❌ Stripe missing
npm list --depth=0 2>nul | findstr "next" >nul && echo ✅ Next.js installed || echo ❌ Next.js missing
echo.

echo 🔧 Environment Variables Needed:
echo ❓ DATABASE_URL (set this in Vercel dashboard)
echo ❓ JWT_SECRET (set this in Vercel dashboard)  
echo ❓ STRIPE_SECRET_KEY (set this in Vercel dashboard)
echo ❓ STRIPE_PUBLISHABLE_KEY (set this in Vercel dashboard)
echo ❓ NEXT_PUBLIC_SITE_URL (set this in Vercel dashboard)
echo.

echo 🚀 Next Steps:
echo 1. Create database (Vercel Postgres recommended)
echo 2. Set environment variables in Vercel dashboard
echo 3. Run: npx prisma db push (after DATABASE_URL is set)
echo 4. Deploy: vercel --prod
echo.

pause