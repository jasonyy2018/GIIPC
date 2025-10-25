@echo off
echo ========================================
echo GIIP - Nginx and Docker Verification
echo ========================================
echo.

echo [1/6] Checking Docker status...
docker --version
if %errorlevel% neq 0 (
    echo ERROR: Docker is not installed or not running
    pause
    exit /b 1
)
echo ✓ Docker is available
echo.

echo [2/6] Checking Docker Compose status...
docker-compose --version
if %errorlevel% neq 0 (
    echo ERROR: Docker Compose is not installed
    pause
    exit /b 1
)
echo ✓ Docker Compose is available
echo.

echo [3/6] Checking if containers are running...
docker ps --filter "name=giip" --format "table {{.Names}}\t{{.Status}}\t{{.Ports}}"
echo.

echo [4/6] Checking Nginx configuration...
if exist "frontend\nginx.conf" (
    echo ✓ Nginx configuration file exists
    echo.
    echo Nginx configuration preview:
    type frontend\nginx.conf | findstr /C:"listen" /C:"server_name" /C:"root" /C:"gzip"
) else (
    echo ERROR: Nginx configuration file not found
)
echo.

echo [5/6] Checking frontend files...
if exist "frontend\index.html" (
    echo ✓ index.html exists
) else (
    echo ERROR: index.html not found
)

if exist "frontend\css\typography.css" (
    echo ✓ typography.css exists
) else (
    echo ERROR: typography.css not found
)

if exist "frontend\css\auth.css" (
    echo ✓ auth.css exists
) else (
    echo ERROR: auth.css not found
)

if exist "frontend\js\common.js" (
    echo ✓ common.js exists
) else (
    echo ERROR: common.js not found
)
echo.

echo [6/6] Testing mobile menu typography in index.html...
findstr /C:"font-size: 20px" frontend\index.html >nul
if %errorlevel% equ 0 (
    echo ✓ Mobile menu button size updated (20px)
) else (
    echo WARNING: Mobile menu button size not found
)

findstr /C:"font-size: 16px" frontend\index.html >nul
if %errorlevel% equ 0 (
    echo ✓ Mobile menu text size updated (16px)
) else (
    echo WARNING: Mobile menu text size not found
)

findstr /C:"line-height: 1.6" frontend\index.html >nul
if %errorlevel% equ 0 (
    echo ✓ Mobile menu line height updated (1.6)
) else (
    echo WARNING: Mobile menu line height not found
)
echo.

echo ========================================
echo Verification Summary
echo ========================================
echo.
echo To rebuild and restart containers with latest changes:
echo   docker-compose down
echo   docker-compose build --no-cache
echo   docker-compose up -d
echo.
echo To view container logs:
echo   docker-compose logs -f web
echo   docker-compose logs -f api
echo.
echo To test the application:
echo   Frontend: http://localhost
echo   Backend API: http://localhost:3000/api/health
echo   Admin Panel: http://localhost/admin.html
echo.

pause
