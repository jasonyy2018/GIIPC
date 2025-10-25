@echo off
echo ========================================
echo Final Flicker Fix - Simplified Approach
echo ========================================
echo.
echo Changes:
echo - Removed ALL CSS transitions/animations on images
echo - Removed onerror handlers (prevent re-render)
echo - Added loading="eager" to images
echo - Updated image URLs in database
echo.
pause

echo Step 1: Stopping containers...
docker-compose down
echo.

echo Step 2: Cleaning up...
docker rmi giipc-web giipc-api 2>nul
echo.

echo Step 3: Building (no cache)...
docker-compose build --no-cache
if errorlevel 1 (
    echo ERROR: Build failed!
    pause
    exit /b 1
)
echo.

echo Step 4: Starting services...
docker-compose up -d
if errorlevel 1 (
    echo ERROR: Start failed!
    pause
    exit /b 1
)
echo.

echo Step 5: Waiting 15 seconds...
timeout /t 15 /nobreak >nul
echo.

echo Step 6: Verifying database images...
docker exec giip-database psql -U giip_user -d giip_db -c "SELECT id, LEFT(title, 40) as title, LEFT(image_url, 60) as image FROM conferences;"
echo.

echo ========================================
echo Deployment Complete!
echo ========================================
echo.
echo CRITICAL: You MUST clear browser cache!
echo.
echo Method 1: Hard Refresh
echo   Press Ctrl+F5 or Ctrl+Shift+R
echo.
echo Method 2: Clear Cache
echo   Press Ctrl+Shift+Delete
echo   Select "Cached images and files"
echo   Click "Clear data"
echo.
echo Method 3: Incognito Mode (Recommended)
echo   Press Ctrl+Shift+N
echo   Then visit http://localhost
echo.
echo The flicker should be COMPLETELY GONE now!
echo.
pause
