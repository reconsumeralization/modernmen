@echo off
:: Modern Men Vercel Deployment Script for Windows
:: This script handles the complete deployment process for your Next.js app

echo.
echo 🚀 Modern Men Vercel Deployment Script
echo ======================================
echo.

:: Check if we're in the right directory
if not exist "package.json" (
    echo [ERROR] package.json not found. Please run this script from the project root.
    pause
    exit /b 1
)

echo [INFO] Checking project structure...

:: Verify this is a Next.js project
findstr /c:"next" package.json >nul
if errorlevel 1 (
    echo [ERROR] This doesn't appear to be a Next.js project.
    pause
    exit /b 1
)

echo [SUCCESS] Next.js project detected!
echo.

:: Step 1: Check Node.js installation
echo [INFO] Checking Node.js installation...
node --version >nul 2>&1
if errorlevel 1 (
    echo [WARNING] Node.js not found. Please install Node.js first:
    echo 1. Download from: https://nodejs.org/
    echo 2. Or use winget: winget install OpenJS.NodeJS
    pause
    exit /b 1
)

for /f %%i in ('node --version') do set NODE_VERSION=%%i
echo [SUCCESS] Node.js %NODE_VERSION% detected
echo.

:: Step 2: Install dependencies
echo [INFO] Installing project dependencies...
call npm install
if errorlevel 1 (
    echo [ERROR] Failed to install dependencies
    pause
    exit /b 1
)
echo [SUCCESS] Dependencies installed successfully
echo.:: Step 3: Install Vercel CLI
echo [INFO] Installing Vercel CLI...
vercel --version >nul 2>&1
if errorlevel 1 (
    call npm install -g vercel
    if errorlevel 1 (
        echo [ERROR] Failed to install Vercel CLI
        pause
        exit /b 1
    )
    echo [SUCCESS] Vercel CLI installed successfully
) else (
    echo [SUCCESS] Vercel CLI already installed
)
echo.

:: Step 4: Test build locally
echo [INFO] Testing local build...
call npm run build
if errorlevel 1 (
    echo [ERROR] Build failed. Please fix build errors before deploying.
    echo [WARNING] Common build issues:
    echo   - Check for TypeScript errors
    echo   - Verify environment variables  
    echo   - Check for missing dependencies
    pause
    exit /b 1
)
echo [SUCCESS] Build completed successfully
echo.

:: Step 5: Create deployment documentation
echo [INFO] Creating deployment documentation...
echo # Modern Men - Vercel Deployment Complete > DEPLOYMENT_COMPLETE.md
echo. >> DEPLOYMENT_COMPLETE.md
echo ## Your Next.js app is ready for Vercel deployment! >> DEPLOYMENT_COMPLETE.md
echo. >> DEPLOYMENT_COMPLETE.md
echo ### Manual Deployment Steps: >> DEPLOYMENT_COMPLETE.md
echo 1. Visit https://vercel.com and sign in >> DEPLOYMENT_COMPLETE.md
echo 2. Click "Add New..." then "Project" >> DEPLOYMENT_COMPLETE.md
echo 3. Import your Git repository or upload your project folder >> DEPLOYMENT_COMPLETE.md
echo 4. Configure your environment variables in Vercel dashboard >> DEPLOYMENT_COMPLETE.md
echo 5. Deploy! >> DEPLOYMENT_COMPLETE.md
echo. >> DEPLOYMENT_COMPLETE.mdecho ### Environment Variables Needed: >> DEPLOYMENT_COMPLETE.md
echo ```env >> DEPLOYMENT_COMPLETE.md
echo NEXT_PUBLIC_SUPABASE_URL=your_production_supabase_url >> DEPLOYMENT_COMPLETE.md
echo SUPABASE_SERVICE_ROLE_KEY=your_production_service_role_key >> DEPLOYMENT_COMPLETE.md
echo NEXTAUTH_SECRET=your_production_nextauth_secret >> DEPLOYMENT_COMPLETE.md
echo NEXTAUTH_URL=https://your-app.vercel.app >> DEPLOYMENT_COMPLETE.md
echo OPENAI_API_KEY=your_openai_api_key >> DEPLOYMENT_COMPLETE.md
echo ANTHROPIC_API_KEY=your_anthropic_api_key >> DEPLOYMENT_COMPLETE.md
echo ``` >> DEPLOYMENT_COMPLETE.md
echo. >> DEPLOYMENT_COMPLETE.md

echo [SUCCESS] Deployment documentation created
echo.

:: Step 6: Attempt automatic deployment
echo [INFO] Attempting automatic deployment to Vercel...
echo [WARNING] You may need to login to Vercel when prompted
echo.

:: Try to deploy
call vercel --prod
if errorlevel 1 (
    echo.
    echo [INFO] Automatic deployment failed. No problem!
    echo [INFO] Manual deployment option available.
    echo.
    goto manual_deployment
) else (
    echo.
    echo 🎉 DEPLOYMENT SUCCESSFUL!
    echo ======================
    echo.
    echo [SUCCESS] Your Modern Men app is now live on Vercel!
    echo [INFO] Check your Vercel dashboard for the live URL
    echo.
    goto deployment_complete
)

:manual_deployment
echo 📋 MANUAL DEPLOYMENT INSTRUCTIONS
echo =================================
echo.
echo Since automatic deployment wasn't possible, here's how to deploy manually:
echo.
echo 1. Visit: https://vercel.com
echo 2. Sign in or create an account
echo 3. Click "Add New..." then "Project"
echo 4. Choose "Upload Folder" and select this project folder:
echo    %CD%
echo 5. Configure environment variables using the list in DEPLOYMENT_COMPLETE.md
echo 6. Click "Deploy"
echo.

:deployment_complete
echo.
echo 📖 NEXT STEPS:
echo ==============
echo 1. Set up production environment variables in Vercel dashboard
echo 2. Configure your custom domain (optional)
echo 3. Test all functionality in production
echo 4. Set up monitoring and analytics
echo.
echo 📄 Read DEPLOYMENT_COMPLETE.md for detailed information
echo.
echo Press any key to exit...
pause >nul