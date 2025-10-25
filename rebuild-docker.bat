@echo off
echo ========================================
echo GIIP - Rebuild Docker Containers
echo ========================================
echo.
echo This will rebuild all containers with the latest changes.
echo.
set /p confirm="Continue? (Y/N): "
if /i not "%confirm%"=="Y" (
    echo Cancelled.
    pause
    exit /b 0
)
echo.

echo [1/5] Stopping containers...
docker-compose down
if %errorlevel% neq 0 (
    echo ERROR: Failed to stop containers
    pause
    exit /b 1
)
echo ✓ Containers stopped
echo.

echo [2/5] Removing old images (optional)...
set /p remove_images="Remove old images? (Y/N): "
if /i "%remove_images%"=="Y" (
    docker rmi giip-frontend giip-backend 2>nul
    echo ✓ Old images removed
)
echo.

echo [3/5] Building new images (this may take a few minutes)...
docker-compose build --no-cache
if %errorlevel% neq 0 (
    echo ERROR: Failed to build images
    pause
    exit /b 1
)
echo ✓ Images built successfully
echo.

echo [4/5] Starting containers...
docker-compose up -d
if %errorlevel% neq 0 (
    echo ERROR: Failed to start containers
    pause
    exit /b 1
)
echo ✓ Containers started
echo.

echo [5/5] Waiting for services to be ready...
timeout /t 10 /nobreak >nul
echo.

echo ========================================
echo Checking container status...
echo ========================================
docker ps --filter "name=giip" --format "table {{.Names}}\t{{.Status}}\t{{.Ports}}"
echo.

echo ========================================
echo Testing endpoints...
echo ========================================
echo.

echo Testing Frontend (http://localhost)...
curl -s -o nul -w "Status: %%{http_code}\n" http://localhost
echo.

echo Testing Backend API (http://localhost:3000/api/health)...
curl -s http://localhost:3000/api/health
echo.
echo.

echo ========================================
echo Rebuild Complete!
echo ========================================
echo.
echo Access your application:
echo   Frontend: http://localhost
echo   Backend API: http://localhost:3000/api/health
echo   Admin Panel: http://localhost/admin.html
echo.
echo View logs:
echo   docker-compose logs -f web
echo   docker-compose logs -f api
echo.
echo Stop containers:
echo   docker-compose down
echo.

pause
