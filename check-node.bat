@echo off
echo.
echo 🚀 Modern Men Hair Salon - Node.js Installation Check
echo =====================================================
echo.

REM Check if Node.js is installed
echo ⏳ Checking for Node.js...
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo.
    echo ❌ Node.js is NOT installed
    echo.
    echo 📥 Please install Node.js first:
    echo   1. Go to: https://nodejs.org/
    echo   2. Download the LTS version
    echo   3. Run the installer
    echo   4. Restart this terminal
    echo   5. Run this script again
    echo.
    echo 💡 After installing Node.js, run: setup.bat
    echo.
    pause
    exit /b 1
)

echo ✅ Node.js found!
node --version

echo.
echo 📦 Installing project dependencies...
npm install

if %errorlevel% neq 0 (
    echo.
    echo ❌ Failed to install dependencies
    echo 💡 Try running: npm install --force
    pause
    exit /b 1
)

echo.
echo 🔨 Building project...
npm run build

if %errorlevel% neq 0 (
    echo.
    echo ❌ Build failed - please check for errors above
    pause
    exit /b 1
)

echo.
echo ✅ Setup complete!
echo.
echo 🎉 Your Modern Men website is ready!
echo.
echo 🔥 To start development:
echo   npm run dev
echo   Then visit: http://localhost:3000
echo.
echo 🚀 To deploy to Vercel:
echo   npm install -g vercel
echo   vercel --prod
echo.
echo 📖 See SETUP.md for detailed instructions
echo.
pause
