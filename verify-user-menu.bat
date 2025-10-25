@echo off
echo ========================================
echo GIIP - Verify User Menu Implementation
echo ========================================
echo.

echo [1/3] Checking if Docker containers are running...
docker ps | findstr giip-frontend
if %ERRORLEVEL% NEQ 0 (
    echo ERROR: Frontend container is not running!
    echo Please run: docker-compose up -d
    pause
    exit /b 1
)
echo ✓ Frontend container is running

echo.
echo [2/3] Checking if new HTML exists in container...
docker exec giip-frontend cat /usr/share/nginx/html/index.html | findstr "auth-logged-out" >nul
if %ERRORLEVEL% NEQ 0 (
    echo ERROR: New HTML not found in container!
    echo The container needs to be rebuilt.
    echo.
    set /p rebuild="Rebuild now? (Y/N): "
    if /i "%rebuild%"=="Y" (
        echo Rebuilding...
        docker-compose down
        docker rmi giip-frontend
        docker-compose up --build -d
        echo ✓ Rebuild complete
    ) else (
        echo Please run: rebuild-docker.bat
        pause
        exit /b 1
    )
) else (
    echo ✓ New HTML found in container
)

echo.
echo [3/3] Checking if new JavaScript exists...
docker exec giip-frontend cat /usr/share/nginx/html/js/auth.js | findstr "setupUserMenuDropdown" >nul
if %ERRORLEVEL% NEQ 0 (
    echo ERROR: New JavaScript not found!
    echo Please rebuild the container.
    pause
    exit /b 1
)
echo ✓ New JavaScript found

echo.
echo ========================================
echo ✓ All checks passed!
echo ========================================
echo.
echo Next steps:
echo 1. Open http://localhost:8080 in your browser
echo 2. Press Ctrl + Shift + R to force refresh
echo 3. You should see Login/Register buttons in the top right
echo 4. After logging in, you should see user avatar and dropdown menu
echo.
echo If you still don't see changes:
echo - Clear browser cache completely
echo - Try a different browser
echo - Check browser console for errors (F12)
echo.
pause
