@echo off
REM ===========================================
REM MODERN MEN HAIR SALON - MONGODB SETUP
REM ===========================================

echo 🚀 Setting up MongoDB for Modern Men Hair Salon CMS
echo ====================================================

REM Check if running as administrator
net session >nul 2>&1
if %errorLevel% == 0 (
    echo ✅ Running as administrator
) else (
    echo ❌ Please run this script as administrator
    pause
    exit /b 1
)

REM Check if MongoDB is already installed
where mongod >nul 2>&1
if %errorLevel% == 0 (
    echo ✅ MongoDB is already installed
    goto :check_service
)

echo 📦 Installing MongoDB Community Edition...

REM Create download directory
if not exist "%TEMP%\mongodb-setup" mkdir "%TEMP%\mongodb-setup"
cd "%TEMP%\mongodb-setup"

REM Download MongoDB installer
echo Downloading MongoDB installer...
powershell -Command "Invoke-WebRequest -Uri 'https://fastdl.mongodb.org/windows/mongodb-windows-x86_64-7.0.5-signed.msi' -OutFile 'mongodb-installer.msi'"

if not exist "mongodb-installer.msi" (
    echo ❌ Failed to download MongoDB installer
    echo Please download manually from: https://www.mongodb.com/try/download/community
    pause
    exit /b 1
)

echo Installing MongoDB...
msiexec.exe /i mongodb-installer.msi /quiet /norestart ADDLOCAL="all"

echo Waiting for installation to complete...
timeout /t 10 /nobreak >nul

:check_service
echo 🗄️ Setting up MongoDB service...

REM Create data directory
if not exist "C:\data" mkdir "C:\data"
if not exist "C:\data\db" mkdir "C:\data\db"
if not exist "C:\data\log" mkdir "C:\data\log"

REM Check if MongoDB service exists and try to start it
sc query MongoDB >nul 2>&1
if %errorLevel% == 0 (
    net start MongoDB >nul 2>&1
    if %errorLevel% == 0 (
        echo ✅ MongoDB service started successfully
    ) else (
        echo ⚠️ Failed to start MongoDB service, trying manual start...
        goto :manual_start
    )
) else (
    echo ℹ️ MongoDB service not installed as Windows service, starting manually...
    goto :manual_start
)

goto :test_connection

:manual_start
echo Starting MongoDB manually...
start /B mongod --dbpath "C:\data\db" --logpath "C:\data\log\mongod.log"
if %errorLevel% == 0 (
    echo ✅ MongoDB started manually
) else (
    echo ❌ Failed to start MongoDB manually
    echo Please check MongoDB installation
    pause
    exit /b 1
)
timeout /t 3 /nobreak >nul

REM Test MongoDB connection
echo Testing MongoDB connection...
mongosh --eval "db.runCommand('ping')" >nul 2>&1
if %errorLevel% == 0 (
    echo ✅ MongoDB is running and responding
) else (
    echo ⚠️ MongoDB may not be fully started yet
    echo It might take a few moments to initialize
)

echo.
echo 🎉 MongoDB setup complete!
echo.
echo 📊 MongoDB Details:
echo   - Service: MongoDB
echo   - Data Path: C:\data\db
echo   - Port: 27017 (default)
echo   - Connection: mongodb://localhost:27017
echo.
echo 🧪 Test connection:
echo   mongosh --eval "db.runCommand('ping')"
echo.
echo 📝 Next steps:
echo   1. Start CMS: cd cms && npm install && npm run dev
echo   2. Access CMS: http://localhost:3001
echo.

pause
