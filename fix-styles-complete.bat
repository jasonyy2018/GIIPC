@echo off
echo ========================================
echo Complete Style Fix Deployment
echo ========================================
echo.
echo This will fix:
echo   1. Missing main.css file
echo   2. Hero section layout
echo   3. All component styles
echo   4. Responsive design
echo.
pause

echo.
echo Step 1: Verifying files...
echo ----------------------------------------
if not exist "frontend\css\main.css" (
    echo ERROR: main.css not found!
    echo Please ensure all files are created.
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
echo CRITICAL: Clear Browser Cache!
echo.
echo Method 1: Incognito Mode (REQUIRED) ⭐
echo   Press Ctrl+Shift+N
echo   Visit http://localhost
echo.
echo Method 2: Hard Refresh
echo   Press Ctrl+F5 (multiple times)
echo.
echo Method 3: Clear Cache
echo   Press Ctrl+Shift+Delete
echo   Select ALL TIME
echo   Check "Cached images and files"
echo   Click "Clear data"
echo.
echo ========================================
echo Verification Checklist
echo ========================================
echo.
echo Desktop (1920x1080):
echo [ ] Hero section fills full width
echo [ ] Background image visible
echo [ ] Navigation bar styled correctly
echo [ ] All sections properly spaced
echo [ ] Cards display in grid layout
echo [ ] Buttons styled correctly
echo.
echo Mobile (< 768px):
echo [ ] Mobile menu works
echo [ ] Hero section responsive
echo [ ] Cards stack vertically
echo [ ] Text readable
echo.
echo If styles still missing:
echo 1. Check browser console for 404 errors
echo 2. Verify main.css loads in Network tab
echo 3. Try different browser
echo 4. Check Docker logs: docker logs giip-frontend
echo.
pause
