@echo off
echo ========================================
echo GIIP Docker Setup Verification
echo ========================================
echo.

echo [1/5] Checking if files exist...
echo.

set ERROR=0

if exist "frontend\index.html" (
    echo [OK] frontend\index.html
) else (
    echo [ERROR] frontend\index.html NOT FOUND
    set ERROR=1
)

if exist "frontend\about.html" (
    echo [OK] frontend\about.html
) else (
    echo [ERROR] frontend\about.html NOT FOUND
    set ERROR=1
)

if exist "frontend\contact.html" (
    echo [OK] frontend\contact.html
) else (
    echo [ERROR] frontend\contact.html NOT FOUND
    set ERROR=1
)

if exist "frontend\images\giip-logo.png" (
    echo [OK] frontend\images\giip-logo.png
) else (
    echo [ERROR] frontend\images\giip-logo.png NOT FOUND
    set ERROR=1
)

if exist "frontend\nginx.conf" (
    echo [OK] frontend\nginx.conf
) else (
    echo [ERROR] frontend\nginx.conf NOT FOUND
    set ERROR=1
)

if exist "frontend\Dockerfile" (
    echo [OK] frontend\Dockerfile
) else (
    echo [ERROR] frontend\Dockerfile NOT FOUND
    set ERROR=1
)

if exist "docker-compose.yml" (
    echo [OK] docker-compose.yml
) else (
    echo [ERROR] docker-compose.yml NOT FOUND
    set ERROR=1
)

if exist ".env" (
    echo [OK] .env
) else (
    echo [WARNING] .env NOT FOUND - will use .env.example
)

echo.
echo [2/5] Checking Dockerfile content...
echo.

findstr /C:"COPY about.html" frontend\Dockerfile >nul
if %ERRORLEVEL% EQU 0 (
    echo [OK] Dockerfile copies about.html
) else (
    echo [ERROR] Dockerfile does NOT copy about.html
    set ERROR=1
)

findstr /C:"COPY contact.html" frontend\Dockerfile >nul
if %ERRORLEVEL% EQU 0 (
    echo [OK] Dockerfile copies contact.html
) else (
    echo [ERROR] Dockerfile does NOT copy contact.html
    set ERROR=1
)

findstr /C:"COPY images/" frontend\Dockerfile >nul
if %ERRORLEVEL% EQU 0 (
    echo [OK] Dockerfile copies images directory
) else (
    echo [ERROR] Dockerfile does NOT copy images directory
    set ERROR=1
)

echo.
echo [3/5] Checking nginx.conf...
echo.

findstr /C:"index index.html" frontend\nginx.conf >nul
if %ERRORLEVEL% EQU 0 (
    echo [OK] nginx.conf sets index.html as default
) else (
    echo [ERROR] nginx.conf does NOT set index.html as default
    set ERROR=1
)

findstr /C:"try_files" frontend\nginx.conf >nul
if %ERRORLEVEL% EQU 0 (
    echo [OK] nginx.conf has try_files directive
) else (
    echo [ERROR] nginx.conf missing try_files directive
    set ERROR=1
)

echo.
echo [4/5] Checking Docker...
echo.

docker --version >nul 2>&1
if %ERRORLEVEL% EQU 0 (
    echo [OK] Docker is installed
    docker --version
) else (
    echo [ERROR] Docker is NOT installed
    set ERROR=1
)

docker-compose --version >nul 2>&1
if %ERRORLEVEL% EQU 0 (
    echo [OK] Docker Compose is installed
    docker-compose --version
) else (
    echo [ERROR] Docker Compose is NOT installed
    set ERROR=1
)

echo.
echo [5/5] Summary
echo.

if %ERROR% EQU 0 (
    echo [SUCCESS] All checks passed!
    echo.
    echo You can now start the application:
    echo   docker-compose up --build
    echo.
    echo Then access:
    echo   Frontend: http://localhost
    echo   Backend:  http://localhost:3000
    echo   Test:     http://localhost/test-paths.html
) else (
    echo [FAILED] Some checks failed. Please fix the errors above.
    echo.
    echo Common fixes:
    echo   1. Make sure all files exist in frontend directory
    echo   2. Update Dockerfile to copy all necessary files
    echo   3. Install Docker and Docker Compose
)

echo.
echo ========================================
pause
