@echo off
echo ========================================
echo Final Layout Fix - Hero and Styles
echo ========================================
echo.
echo This will fix:
echo   1. Hero background image display
echo   2. Hero full-width layout
echo   3. Overall page layout
echo   4. Prevent horizontal scrolling
echo.
pause

echo.
echo Step 1: Verifying CSS files...
echo ----------------------------------------
if not exist "frontend\css\main.css" (
    echo ERROR: main.css not found!
    pause
    exit /b 1
)
if not exist "frontend\css\hero.css" (
    echo ERROR: hero.css not found!
    pause
    exit /b 1
)
echo All CSS files present.
echo.

echo Step 2: Stopping containers...
echo ----------------------------------------
docker-compose down
echo.

echo Step 3: Cleaning old images...
echo ----------------------------------------
docker rmi giipc-web giipc-api 2>nul
echo.

echo Step 4: Building (no cache)...
echo ----------------------------------------
docker-compose build --no-cache
if errorlevel 1 (
    echo ERROR: Build failed!
    pause
    exit /b 1
)
echo.

echo Step 5: Starting services...
echo ----------------------------------------
docker-compose up -d
if errorlevel 1 (
    echo ERROR: Start failed!
    pause
    exit /b 1
)
echo.

echo Step 6: Waiting for services (15 seconds)...
echo ----------------------------------------
timeout /t 15 /nobreak >nul
echo.

echo Step 7: Verifying deployment...
echo ----------------------------------------
docker-compose ps
echo.

echo ========================================
echo Deployment Complete!
echo ========================================
echo.
echo CRITICAL STEPS:
echo.
echo 1. CLEAR BROWSER CACHE (REQUIRED!)
echo    Method 1: Incognito Mode ⭐
echo      Ctrl+Shift+N → http://localhost
echo.
echo    Method 2: Hard Refresh
echo      Ctrl+F5 (press 5 times)
echo.
echo    Method 3: Clear All Cache
echo      Ctrl+Shift+Delete
echo      → Select "All time"
echo      → Check "Cached images and files"
echo      → Clear data
echo.
echo 2. VERIFY LAYOUT:
echo    [ ] Hero background image visible
echo    [ ] Hero occupies full width
echo    [ ] No horizontal scrolling
echo    [ ] All sections properly aligned
echo    [ ] Navigation bar works
echo    [ ] Cards display correctly
echo.
echo 3. TEST DIFFERENT RESOLUTIONS:
echo    [ ] 1920x1080 (Full HD)
echo    [ ] 1366x768 (Laptop)
echo    [ ] Mobile (< 768px)
echo.
echo If layout still broken:
echo   1. Check browser console for errors
echo   2. Verify CSS files load (Network tab)
echo   3. Try different browser
echo   4. Check Docker logs: docker logs giip-frontend
echo.
pause
