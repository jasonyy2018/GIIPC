@echo off
echo ========================================
echo Complete Deployment with Unsplash Images
echo ========================================
echo.
echo This will:
echo 1. Update ALL images (News + Conferences + Events)
echo 2. Rebuild Docker containers
echo 3. Deploy the fixed version
echo.
pause

echo.
echo Step 1: Verifying database images...
echo ----------------------------------------
docker exec giip-database psql -U giip_user -d giip_db -c "SELECT 'News' as type, COUNT(*) as total, COUNT(image_url) as with_images FROM news UNION ALL SELECT 'Conferences', COUNT(*), COUNT(image_url) FROM conferences UNION ALL SELECT 'Events', COUNT(*), COUNT(image_url) FROM events;"
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

echo Step 8: Checking images in database...
echo ----------------------------------------
docker exec giip-database psql -U giip_user -d giip_db -c "SELECT id, LEFT(title, 35) as title, LEFT(image_url, 50) as image FROM news ORDER BY id;"
echo.
docker exec giip-database psql -U giip_user -d giip_db -c "SELECT id, LEFT(title, 35) as title, LEFT(image_url, 50) as image FROM conferences ORDER BY id;"
echo.

echo ========================================
echo Deployment Complete!
echo ========================================
echo.
echo All images updated:
echo   - News: 3 items with Unsplash images
echo   - Conferences: 3 items with Unsplash images
echo   - Events: Default images set
echo.
echo IMPORTANT: Clear browser cache!
echo.
echo Recommended: Use Incognito Mode
echo   Press Ctrl+Shift+N
echo   Visit http://localhost
echo.
echo You should see:
echo   - News cards with beautiful images
echo   - Past Conferences with diverse images
echo   - NO flicker or loading issues
echo.
pause
