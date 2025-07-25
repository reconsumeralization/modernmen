@echo off
echo ===========================================
echo  DATABASE SETUP AND MIGRATION
echo ===========================================
echo.

echo Checking environment...
if not exist ".env.local" (
    echo ❌ .env.local not found!
    echo Please create .env.local with your DATABASE_URL
    pause
    exit /b 1
)

echo 🔍 Testing database connection...
npx prisma db push --accept-data-loss
if %errorlevel% neq 0 (
    echo.
    echo ❌ Database connection failed!
    echo.
    echo Common issues:
    echo - DATABASE_URL not set correctly
    echo - Database server not accessible
    echo - Wrong connection string format
    echo.
    echo For PostgreSQL, ensure your URL includes: ?sslmode=require
    echo Example: postgresql://user:pass@host:port/db?sslmode=require
    pause
    exit /b 1
)

echo.
echo ✅ Database schema deployed successfully!
echo.

echo 🌱 Do you want to seed the database with sample data? (y/n)
set /p seed="Enter choice: "
if /i "%seed%"=="y" (
    echo.
    echo Seeding database...
    npx prisma db seed
    if %errorlevel% neq 0 (
        echo ⚠️  Seeding failed, but that's okay for production
    ) else (
        echo ✅ Database seeded successfully!
    )
)

echo.
echo 🚀 Database is ready! You can now:
echo 1. Test locally: npm run dev
echo 2. Deploy to production: vercel --prod
echo.
pause