@echo off
echo.
echo 🚀 Modern Men Hair Salon - Setup Script
echo ==========================================
echo.

REM Check if Node.js is installed
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Error: Node.js is not installed or not in PATH
    echo Please install Node.js from https://nodejs.org/
    echo Then restart this script.
    pause
    exit /b 1
)

echo ✅ Node.js found
node --version

REM Install dependencies
echo.
echo 📦 Installing dependencies...
npm install

REM Check if installation was successful
if %errorlevel% neq 0 (
    echo ❌ Error: Failed to install dependencies
    pause
    exit /b 1
)

echo.
echo ✅ Dependencies installed successfully!
echo.
echo 🔨 Building project to verify setup...
npm run build

if %errorlevel% neq 0 (
    echo ❌ Error: Build failed
    pause
    exit /b 1
)

echo.
echo ✅ Build successful!
echo.
echo 🎉 Setup complete! 
echo.
echo To start the development server, run:
echo   npm run dev
echo.
echo To deploy to Vercel, run:
echo   npm install -g vercel
echo   vercel --prod
echo.
pause
