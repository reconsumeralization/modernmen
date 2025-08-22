@echo off
REM Modern Men - Vercel CLI Setup and Deployment Script
REM This script sets up Node.js path, installs Vercel CLI, builds locally, and deploys

echo ========================================
echo Modern Men - Vercel CLI Deployment
echo ========================================
echo.

REM Set Node.js path
set "PATH=%PATH%;C:\Program Files\nodejs"

echo [INFO] Testing Node.js installation...
"C:\Program Files\nodejs\node.exe" --version
if errorlevel 1 (
    echo [ERROR] Node.js not found. Please install Node.js first.
    pause
    exit /b 1
)

echo [SUCCESS] Node.js found
echo.

REM Get Node.js version
for /f %%i in ('"C:\Program Files\nodejs\node.exe" --version') do set NODE_VERSION=%%i
echo [INFO] Node.js version: %NODE_VERSION%

REM Check npm
"C:\Program Files\nodejs\npm.cmd" --version
if errorlevel 1 (
    echo [ERROR] npm not found
    pause
    exit /b 1
)

echo [SUCCESS] npm found
echo.

REM Install Vercel CLI globally
echo [INFO] Installing Vercel CLI...
"C:\Program Files\nodejs\npm.cmd" install -g vercel
if errorlevel 1 (
    echo [ERROR] Failed to install Vercel CLI
    pause
    exit /b 1
)

echo [SUCCESS] Vercel CLI installed
echo.

REM Verify Vercel CLI installation
echo [INFO] Verifying Vercel CLI...
vercel --version
if errorlevel 1 (
    echo [WARNING] Vercel CLI not in PATH, trying direct approach...
    "%APPDATA%\npm\vercel.cmd" --version
    if errorlevel 1 (
        echo [ERROR] Vercel CLI installation failed
        pause
        exit /b 1
    )
    set "VERCEL_CMD=%APPDATA%\npm\vercel.cmd"
) else (
    set "VERCEL_CMD=vercel"
)

echo [SUCCESS] Vercel CLI verified
echo.

REM Install project dependencies
echo [INFO] Installing project dependencies...
"C:\Program Files\nodejs\npm.cmd" install
if errorlevel 1 (
    echo [ERROR] Failed to install dependencies
    pause
    exit /b 1
)

echo [SUCCESS] Dependencies installed
echo.REM Test local build
echo [INFO] Testing local build...
"C:\Program Files\nodejs\npm.cmd" run build
if errorlevel 1 (
    echo [ERROR] Build failed. Please fix build errors before deploying.
    echo [INFO] Common issues:
    echo   - Check for TypeScript errors
    echo   - Verify environment variables
    echo   - Check for missing dependencies
    pause
    exit /b 1
)

echo [SUCCESS] Local build completed successfully
echo.

REM Login to Vercel using existing token
echo [INFO] Setting up Vercel authentication...
set VERCEL_TOKEN=MIuGyY3KPWF5CncXKPWBzGEr
echo [SUCCESS] Vercel token configured

REM Create .vercel directory with project configuration
echo [INFO] Setting up Vercel project configuration...
if not exist ".vercel" mkdir .vercel

echo {"orgId":"AgGp9HAfSstTvFmzEfWhhiA8","projectId":"prj_1IhdfoiSasVHwuB5Y4nMONafTO1N"} > .vercel\project.json

echo [SUCCESS] Vercel project linked
echo.

REM Deploy to preview first
echo [INFO] Deploying to preview environment...
%VERCEL_CMD% --token %VERCEL_TOKEN%
if errorlevel 1 (
    echo [ERROR] Preview deployment failed
    pause
    exit /b 1
)

echo [SUCCESS] Preview deployment completed
echo.

REM Ask for production deployment
echo.
echo Preview deployment successful!
echo.
set /p DEPLOY_PROD="Deploy to production? (y/N): "
if /i "%DEPLOY_PROD%"=="y" goto :deploy_production
if /i "%DEPLOY_PROD%"=="yes" goto :deploy_production
goto :end

:deploy_production
echo [INFO] Deploying to production...
%VERCEL_CMD% --prod --token %VERCEL_TOKEN%
if errorlevel 1 (
    echo [ERROR] Production deployment failed
    pause
    exit /b 1
)

echo [SUCCESS] Production deployment completed
echo.
echo ==============================================
echo   DEPLOYMENT SUCCESSFUL!
echo ==============================================
echo.
echo Your Modern Men app is now live!
echo.
echo Preview URL: Check output above
echo Production URL: https://modernmen-app.vercel.app
echo.
echo Next steps:
echo 1. Set up production environment variables in Vercel dashboard
echo 2. Test all functionality
echo 3. Configure custom domain (optional)
echo.
goto :end

:end
echo.
echo Deployment process completed.
echo Press any key to exit...
pause >nul