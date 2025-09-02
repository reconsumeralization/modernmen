@echo off
REM ===========================================
REM MODERN MEN HAIR SALON - DEVELOPMENT SETUP
REM ===========================================
REM This script sets up the development environment

echo 🚀 Setting up Modern Men Hair Salon Development Environment
echo ==========================================================

REM Check prerequisites
echo 📋 Checking prerequisites...

REM Check Node.js
node --version >nul 2>&1
if errorlevel 1 (
    echo ❌ Node.js is not installed. Please install Node.js 18+ first.
    pause
    exit /b 1
)

for /f "tokens=1,2,3 delims=." %%a in ('node --version') do (
    set NODE_MAJOR=%%a
    set NODE_MINOR=%%b
)

REM Remove 'v' prefix
set NODE_MAJOR=%NODE_MAJOR:~1%

if %NODE_MAJOR% lss 18 (
    echo ❌ Node.js version 18+ required. Current version: !NODE_VERSION!
    pause
    exit /b 1
)

echo ✅ Node.js detected

REM Check npm
npm --version >nul 2>&1
if errorlevel 1 (
    echo ❌ npm is not installed.
    pause
    exit /b 1
)

echo ✅ npm detected

REM Check Git
git --version >nul 2>&1
if errorlevel 1 (
    echo ❌ Git is not installed.
    pause
    exit /b 1
)

echo ✅ Git detected

echo.
echo 📦 Installing dependencies...

REM Install root dependencies
echo Installing root dependencies...
call npm install

REM Install frontend dependencies
echo Installing frontend dependencies...
cd packages\frontend
call npm install

REM Return to root
cd ..\..

echo.
echo 🔧 Setting up environment...

REM Check if .env.local exists
if not exist "packages\frontend\.env.local" (
    echo ⚠️  Environment file not found.
    echo Creating template instructions...
    echo.
    echo Please create packages\frontend\.env.local with the following variables:
    echo.
    echo # Application
    echo NEXT_PUBLIC_APP_URL=http://localhost:3000
    echo.
    echo # Supabase (get from https://supabase.com/dashboard)
    echo NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
    echo NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
    echo SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
    echo.
    echo # Stripe (get from https://dashboard.stripe.com)
    echo NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_your-key
    echo STRIPE_SECRET_KEY=sk_test_your-secret
    echo.
    echo # SendGrid (get from https://app.sendgrid.com)
    echo SENDGRID_API_KEY=SG.your-api-key
    echo SENDGRID_FROM_EMAIL=noreply@modernmen.com
    echo.
    echo # Twilio (get from https://console.twilio.com)
    echo TWILIO_ACCOUNT_SID=ACxxxxxxxxxxxxxxxx
    echo TWILIO_AUTH_TOKEN=your-auth-token
    echo TWILIO_PHONE_NUMBER=+1234567890
    echo.
    echo Press any key when you've created the .env.local file...
    pause >nul
) else (
    echo ✅ Environment file found
)

echo.
echo 🗄️  Setting up database...

REM Check if Supabase CLI is installed
supabase --version >nul 2>&1
if errorlevel 1 (
    echo ⚠️  Supabase CLI not found. Installing...
    call npm install -g supabase
)

echo Starting Supabase...
call npx supabase start

echo.
echo 📊 Setting up database schema...

REM Push database schema
call npm run db:push

REM Generate types
call npm run db:generate

echo.
echo 🎉 Setup complete!
echo.
echo 🚀 To start development:
echo   npm run dev
echo.
echo 📱 Access points:
echo   Frontend:    http://localhost:3000
echo   API:         http://localhost:54321
echo   Supabase:    http://localhost:54323
echo   Email Test:  http://localhost:54324
echo.
echo 📖 For more information, see DEVELOPER-GUIDE.md
echo.
echo Happy coding! 🎯
pause
