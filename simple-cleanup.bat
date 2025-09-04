@echo off
echo 🔍 Modern Men Project Disk Space Cleanup
echo ========================================

echo.
echo 📊 Checking for cache directories...

if exist .next (
    echo 📁 Found .next cache directory
    for /f %%i in ('dir /s /b .next ^| find /c ".next"') do echo   Files: %%i
    echo 🗑️  Removing .next cache...
    rmdir /s /q .next 2>nul
    if not exist .next echo   ✅ Removed successfully
)

if exist .cache (
    echo 📁 Found .cache directory
    echo 🗑️  Removing .cache...
    rmdir /s /q .cache 2>nul
    if not exist .cache echo   ✅ Removed successfully
)

if exist .turbo (
    echo 📁 Found .turbo cache directory
    echo 🗑️  Removing .turbo cache...
    rmdir /s /q .turbo 2>nul
    if not exist .turbo echo   ✅ Removed successfully
)

if exist node_modules\.cache (
    echo 📁 Found npm cache in node_modules
    echo 🗑️  Clearing npm cache...
    rmdir /s /q node_modules\.cache 2>nul
    if not exist node_modules\.cache echo   ✅ Removed successfully
)

if exist temp (
    echo 📁 Found temp directory
    echo 🗑️  Removing temp...
    rmdir /s /q temp 2>nul
    if not exist temp echo   ✅ Removed successfully
)

if exist tmp (
    echo 📁 Found tmp directory
    echo 🗑️  Removing tmp...
    rmdir /s /q tmp 2>nul
    if not exist tmp echo   ✅ Removed successfully
)

echo.
echo 🔍 Checking for multiple lockfiles...
set lockcount=0
if exist package-lock.json (
    echo 🔒 Found package-lock.json
    set /a lockcount+=1
)
if exist yarn.lock (
    echo 🔒 Found yarn.lock
    set /a lockcount+=1
)
if exist pnpm-lock.yaml (
    echo 🔒 Found pnpm-lock.yaml
    set /a lockcount+=1
)

if %lockcount% gtr 1 (
    echo ⚠️  Multiple lockfiles detected! Consider keeping only one.
    echo    Recommendation: Keep package-lock.json for npm
)

echo.
echo ✅ Cleanup completed!
echo.
echo 🎯 Next steps:
echo 1. Run 'npm install' to restore dependencies
echo 2. Run 'npm run dev' to test the application
echo 3. Monitor disk space usage
echo.
echo Press any key to continue...
pause >nul
