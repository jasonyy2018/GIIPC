@echo off
echo ========================================
echo Environment Variables Check
echo ========================================
echo.

REM Check if .env file exists
if not exist .env (
    echo ERROR: .env file not found!
    echo.
    if exist .env.example (
        echo Creating .env from .env.example...
        copy .env.example .env
        echo .env file created. Please edit it with your values.
    ) else (
        echo .env.example not found either!
    )
    pause
    exit /b 1
)

echo .env file found
echo.

REM Check required variables
echo Checking required variables:
findstr /B "DB_NAME=" .env >nul
if errorlevel 1 (
    echo [X] DB_NAME is not set
) else (
    for /f "tokens=2 delims==" %%a in ('findstr /B "DB_NAME=" .env') do echo [OK] DB_NAME = %%a
)

findstr /B "DB_USER=" .env >nul
if errorlevel 1 (
    echo [X] DB_USER is not set
) else (
    for /f "tokens=2 delims==" %%a in ('findstr /B "DB_USER=" .env') do echo [OK] DB_USER = %%a
)

findstr /B "DB_PASSWORD=" .env >nul
if errorlevel 1 (
    echo [X] DB_PASSWORD is not set
) else (
    echo [OK] DB_PASSWORD is set (value hidden)
)

findstr /B "JWT_SECRET=" .env >nul
if errorlevel 1 (
    echo [X] JWT_SECRET is not set
) else (
    echo [OK] JWT_SECRET is set (value hidden)
)

echo.
echo Optional variables:
findstr /B "DB_HOST=" .env >nul
if errorlevel 1 (
    echo [!] DB_HOST is not set (will use default)
) else (
    for /f "tokens=2 delims==" %%a in ('findstr /B "DB_HOST=" .env') do echo [OK] DB_HOST = %%a
)

findstr /B "FRONTEND_URL=" .env >nul
if errorlevel 1 (
    echo [!] FRONTEND_URL is not set (will use default)
) else (
    for /f "tokens=2 delims==" %%a in ('findstr /B "FRONTEND_URL=" .env') do echo [OK] FRONTEND_URL = %%a
)

echo.
echo ========================================
echo.
echo If all required variables are set, you can run:
echo   docker-compose up -d
echo.
pause
