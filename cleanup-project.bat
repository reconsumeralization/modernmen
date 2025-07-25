@echo off
echo Cleaning up Modern Men project files...
echo.

REM Remove unrelated directories
echo Removing unrelated directories...
if exist "supabase" (
    rmdir /s /q supabase
    echo - Removed supabase directory
)

REM Clean up old documentation files that are no longer needed
echo.
echo Cleaning up old documentation files...
set "files_to_keep=README.md FEATURE-ENHANCEMENT-SUMMARY.md TESTING-GUIDE.md LICENSE"

for %%f in (*.md) do (
    echo %%f | findstr /i /v "%files_to_keep%" >nul && (
        del "%%f"
        echo - Removed %%f
    )
)

REM Clean up old setup scripts
echo.
echo Cleaning up old setup scripts...
del /q setup-github.bat 2>nul
del /q setup-github.sh 2>nul
del /q check-node.bat 2>nul
del /q full-deploy.sh 2>nul
echo - Removed old setup scripts

REM Clean up .env files (keep only .env.local and .env.example)
echo.
echo Cleaning up environment files...
if exist ".env" del /q .env
if exist ".env.production" del /q .env.production
echo - Kept only .env.local and .env.example

echo.
echo Cleanup complete!
echo.
echo Remaining important files:
echo - README.md (main documentation)
echo - FEATURE-ENHANCEMENT-SUMMARY.md (new features)
echo - TESTING-GUIDE.md (testing instructions)
echo - .env.local (your environment variables)
echo - .env.example (environment template)
echo.
pause