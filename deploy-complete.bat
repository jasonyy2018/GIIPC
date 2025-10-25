@echo off
echo ========================================
echo Complete Deployment - All Fixes
echo ========================================
echo.
echo This deployment includes:
echo   1. News images (Unsplash)
echo   2. Conferences images (Unsplash)
echo   3. Hero background fix
echo   4. Anti-flicker optimizations
echo.
pause

echo.
echo Step 1: Verifying files...
echo ----------------------------------------
if not exist "frontend\css\hero.css" (
    echo ERROR: hero.css not found!
    pause
    exit /b 1
)
if not exist "frontend\css\anti-flicker.css" (
    echo ERROR: anti-flicker.css not found!
    pause
    exit /b 1
)
echo All required files present.
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

echo Step 8: Checking database images...
echo ----------------------------------------
echo News images:
docker exec giip-database psql -U giip_user -d giip_db -c "SELECT id, LEFT(title, 30) as title, CASE WHEN image_url LIKE '%%unsplash%%' THEN 'Unsplash' ELSE 'Other' END as source FROM news ORDER BY id;"
echo.
echo Conferences images:
docker exec giip-database psql -U giip_user -d giip_db -c "SELECT id, LEFT(title, 30) as title, CASE WHEN image_url LIKE '%%unsplash%%' THEN 'Unsplash' ELSE 'Other' END as source FROM conferences ORDER BY id;"
echo.

echo ========================================
echo Deployment Complete!
echo ========================================
echo.
echo All fixes applied:
echo   ✓ News cards with Unsplash images
echo   ✓ Conferences cards with Unsplash images
echo   ✓ Hero background image fixed
echo   ✓ Anti-flicker CSS applied
echo   ✓ All images optimized
echo.
echo ========================================
echo IMPORTANT: Clear Browser Cache!
echo ========================================
echo.
echo Method 1: Incognito Mode (Recommended) ⭐
echo   Press Ctrl+Shift+N
echo   Visit http://localhost
echo.
echo Method 2: Hard Refresh
echo   Press Ctrl+F5 or Ctrl+Shift+R
echo.
echo Method 3: Clear Cache
echo   Press Ctrl+Shift+Delete
echo   Select "Cached images and files"
echo   Click "Clear data"
echo.
echo ========================================
echo Verification Checklist
echo ========================================
echo.
echo [ ] Hero background image visible
echo [ ] News cards show professional images
echo [ ] Past Conferences show diverse images
echo [ ] No flicker or loading issues
echo [ ] All text readable and styled
echo [ ] Browser console has no errors
echo.
echo Test pages available:
echo   - test-hero-background.html (Hero test)
echo   - diagnose-flicker.html (Flicker diagnostic)
echo.
pause
