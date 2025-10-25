@echo off
echo ========================================
echo Complete Flicker Fix Deployment
echo ========================================
echo.
echo This script will:
echo 1. Add image_url columns to database (already done)
echo 2. Rebuild Docker containers with fixes
echo 3. Clear browser cache instructions
echo.
pause

echo Step 1: Stopping containers...
docker-compose down
echo.

echo Step 2: Removing old images...
docker rmi giipc-web giipc-api 2>nul
echo.

echo Step 3: Building with --no-cache...
docker-compose build --no-cache
if errorlevel 1 (
    echo ERROR: Build failed!
    pause
    exit /b 1
)
echo.

echo Step 4: Starting containers...
docker-compose up -d
if errorlevel 1 (
    echo ERROR: Start failed!
    pause
    exit /b 1
)
echo.

echo Step 5: Waiting for services...
timeout /t 15 /nobreak >nul
echo.

echo Step 6: Checking status...
docker-compose ps
echo.

echo ========================================
echo Deployment Complete!
echo ========================================
echo.
echo IMPORTANT: Clear your browser cache!
echo.
echo Chrome/Edge:
echo   Press Ctrl+Shift+Delete
echo   Select "Cached images and files"
echo   Click "Clear data"
echo.
echo Or use Incognito/Private mode:
echo   Press Ctrl+Shift+N (Chrome/Edge)
echo   Press Ctrl+Shift+P (Firefox)
echo.
echo Then visit: http://localhost
echo.
echo The flicker should be completely gone!
echo.
pause
