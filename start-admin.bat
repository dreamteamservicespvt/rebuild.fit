@echo off
echo.
echo ========================================
echo    REBUILD.FIT - CORS ISSUE RESOLVER
echo ========================================
echo.

echo 🔍 Checking setup...
echo.

REM Check if admin user exists
echo 1️⃣ Testing Firebase connection...
call npm run test:setup
echo.

echo 2️⃣ Starting development server...
echo.
echo 📱 Admin Dashboard will be available at:
echo    http://localhost:8080/admin/login
echo.
echo 🔑 Default Admin Credentials:
echo    Email: admin@rebuild.com
echo    Password: RebuildAdmin2025!
echo.
echo ⚠️  If you see CORS errors, run: setup-firebase-cors.bat
echo.

start http://localhost:8080/admin/login
call npm run dev

pause
