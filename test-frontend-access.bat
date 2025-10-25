@echo off
echo ========================================
echo GIIP Frontend Access Test
echo ========================================
echo.

echo Checking if files exist...
echo.

if exist "frontend\index.html" (
    echo [OK] frontend\index.html exists
) else (
    echo [ERROR] frontend\index.html NOT FOUND
)

if exist "frontend\about.html" (
    echo [OK] frontend\about.html exists
) else (
    echo [ERROR] frontend\about.html NOT FOUND
)

if exist "frontend\contact.html" (
    echo [OK] frontend\contact.html exists
) else (
    echo [ERROR] frontend\contact.html NOT FOUND
)

if exist "frontend\images\giip-logo.png" (
    echo [OK] frontend\images\giip-logo.png exists
) else (
    echo [ERROR] frontend\images\giip-logo.png NOT FOUND
)

echo.
echo ========================================
echo Starting local web server...
echo ========================================
echo.
echo Server will start on: http://localhost:8000
echo.
echo Open your browser and go to:
echo   http://localhost:8000/index.html
echo.
echo Press Ctrl+C to stop the server
echo.

cd frontend
python -m http.server 8000
