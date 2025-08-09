@echo off
echo ========================================
echo Modern Men - GitHub Deployment
echo ========================================
echo.
echo Repository: https://github.com/reconsumeralization/modernmen
echo.

REM Check if Git is installed
where git >nul 2>nul
if %errorlevel% neq 0 (
    echo ERROR: Git is not installed or not in PATH
    echo Please install Git from https://git-scm.com/
    echo.
    pause
    exit /b 1
)

echo Current Git Status:
echo -------------------
git status --short
echo.

REM Clean up files before commit
echo Cleaning up unnecessary files...
if exist "supabase" (
    echo Removing supabase directory...
    rmdir /s /q supabase
)

REM Remove old documentation files
del /q BACKEND-COMPLETE.md 2>nul
del /q COMPLETE-SYSTEM-REVIEW.md 2>nul
del /q COMPLETE-WEBSITE-SUMMARY.md 2>nul
del /q DEPLOYMENT-*.md 2>nul
del /q FINAL-*.md 2>nul
del /q GITHUB-*.md 2>nul
del /q README-COMPLETE.md 2>nul
del /q setup-github.* 2>nul
del /q check-node.bat 2>nul
del /q full-deploy.sh 2>nul
del /q deploy*.* 2>nul
del /q setup-backend.* 2>nul
del /q setup.bat 2>nul
del /q SETUP.md 2>nul

echo.
echo Files cleaned up successfully!
echo.

REM Create a clean .env.example if it doesn't exist
if not exist ".env.example" (
    echo Creating .env.example...
    echo # Database Configuration > .env.example
    echo DATABASE_URL="postgresql://user:password@localhost:5432/modernmen" >> .env.example
    echo. >> .env.example
    echo # Authentication >> .env.example
    echo JWT_SECRET="your-secure-jwt-secret" >> .env.example
    echo ADMIN_EMAIL="admin@modernmen.ca" >> .env.example
    echo ADMIN_PASSWORD_HASH="your-bcrypt-hash" >> .env.example
    echo. >> .env.example
    echo # Optional: Email Service >> .env.example
    echo SENDGRID_API_KEY="" >> .env.example
    echo. >> .env.example
    echo # Optional: SMS Service >> .env.example
    echo TWILIO_ACCOUNT_SID="" >> .env.example
    echo TWILIO_AUTH_TOKEN="" >> .env.example
    echo TWILIO_PHONE_NUMBER="" >> .env.example
)

echo.
echo Adding files to Git...
git add -A

echo.
echo Creating commit...
set /p commit_message="Enter commit message (or press Enter for default): "
if "%commit_message%"=="" set commit_message=Update Modern Men salon management system with admin panel and customer portal

git commit -m "%commit_message%"

echo.
echo Pushing to GitHub...
git push origin master

if %errorlevel% equ 0 (
    echo.
    echo ========================================
    echo Successfully pushed to GitHub!
    echo ========================================
    echo.
    echo View your repository at:
    echo https://github.com/reconsumeralization/modernmen
    echo.
    echo Next steps:
    echo 1. Set up environment variables in your deployment platform
    echo 2. Configure PostgreSQL database
    echo 3. Deploy to Vercel or your preferred hosting
    echo.
) else (
    echo.
    echo ERROR: Failed to push to GitHub
    echo Please check your Git configuration and try again
    echo.
    echo Common fixes:
    echo - Ensure you have push access to the repository
    echo - Check your Git credentials
    echo - Try: git pull origin master --rebase
    echo.
)

pause