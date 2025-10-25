@echo off
echo ========================================
echo Rebuilding Docker with Flicker Fix
echo ========================================
echo.

echo Step 1: Stopping existing containers...
docker-compose down
echo.

echo Step 2: Removing old images to force rebuild...
docker rmi conference-platform-frontend conference-platform-backend 2>nul
echo.

echo Step 3: Building new images with --no-cache...
docker-compose build --no-cache
if errorlevel 1 (
    echo ERROR: Docker build failed!
    pause
    exit /b 1
)
echo.

echo Step 4: Starting containers...
docker-compose up -d
if errorlevel 1 (
    echo ERROR: Docker start failed!
    pause
    exit /b 1
)
echo.

echo Step 5: Waiting for services to be ready...
timeout /t 10 /nobreak >nul
echo.

echo Step 6: Checking container status...
docker-compose ps
echo.

echo ========================================
echo Deployment Complete!
echo ========================================
echo.
echo Frontend: http://localhost
echo Backend API: http://localhost/api
echo.
echo Test the flicker fix:
echo 1. Open http://localhost in your browser
echo 2. Scroll to "Past Conferences" section
echo 3. Watch for smooth rendering without text flicker
echo 4. Reload the page multiple times to verify
echo.
echo Or open the test page:
echo file:///%CD%\test-flicker-final-fix.html
echo.
pause
