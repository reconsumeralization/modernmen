@echo off
echo 🚀 Modern Men Hair Salon - Starting Everything...
echo ================================================

echo.
echo 📋 Stopping existing processes...
taskkill /f /im node.exe >nul 2>&1
timeout /t 2 /nobreak >nul

echo.
echo 🔧 Installing Payload CMS dependencies...
npm install @payloadcms/next @payloadcms/db-postgres @payloadcms/bundler-webpack --legacy-peer-deps

echo.
echo 🎨 Installing Lucide React icons...
npm install lucide-react@latest --legacy-peer-deps

echo.
echo 🚀 Starting development server...
start "Modern Men Hair Salon" npm run dev

echo.
echo ⏳ Waiting for server to start...
timeout /t 10 /nobreak >nul

echo.
echo 🔍 Checking server status...
powershell -Command "try { $response = Invoke-WebRequest -Uri 'http://localhost:3000' -UseBasicParsing -TimeoutSec 5; if ($response.StatusCode -eq 200) { Write-Host '✅ Server is running successfully!' -ForegroundColor Green } } catch { Write-Host '❌ Server not responding' -ForegroundColor Red }"

echo.
echo 🎉 Setup Complete!
echo ================================================
echo ✅ Development server: http://localhost:3000
echo ✅ Payload CMS admin: http://localhost:3000/admin
echo ✅ Authentication: http://localhost:3000/auth/signin
echo.
echo 📋 Next Steps:
echo 1. Visit http://localhost:3000 to test your application
echo 2. Visit http://localhost:3000/admin to set up Payload CMS
echo 3. Configure email service in .env.local
echo 4. Set up monitoring services (Sentry, LogRocket)
echo.
echo 🔧 To stop the server, run: taskkill /f /im node.exe
echo.
echo 🎯 Your Modern Men Hair Salon application is ready!
pause
