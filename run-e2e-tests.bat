@echo off
REM End-to-End Test Runner Script for Windows
REM This script ensures the Docker environment is ready before running E2E tests

echo ==========================================
echo GIIP E2E Test Runner
echo ==========================================
echo.

REM Check if docker-compose is installed
where docker-compose >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo Error: docker-compose is not installed
    exit /b 1
)

REM Check if services are running
echo Checking Docker services...
docker-compose ps | findstr "Up" >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo Docker services are not running. Starting them now...
    docker-compose up -d
    echo Waiting for services to be ready (30 seconds)...
    timeout /t 30 /nobreak >nul
) else (
    echo Docker services are running
)

REM Check API health
echo.
echo Checking API health...
set MAX_RETRIES=10
set RETRY_COUNT=0

:check_api
curl -s http://localhost:3000/api/health >nul 2>nul
if %ERRORLEVEL% EQU 0 (
    echo API is healthy
    goto api_ready
)

set /a RETRY_COUNT+=1
if %RETRY_COUNT% GEQ %MAX_RETRIES% (
    echo API is not responding after %MAX_RETRIES% attempts
    echo Check logs with: docker-compose logs api
    exit /b 1
)

echo Waiting for API... (attempt %RETRY_COUNT%/%MAX_RETRIES%)
timeout /t 3 /nobreak >nul
goto check_api

:api_ready

REM Check database
echo.
echo Checking database connection...
docker exec giip-db pg_isready -U giip_user >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo Database is not ready
    exit /b 1
)
echo Database is ready

REM Run E2E tests
echo.
echo ==========================================
echo Running E2E Tests
echo ==========================================
echo.

cd backend
call npm run test:e2e

if %ERRORLEVEL% EQU 0 (
    echo.
    echo ==========================================
    echo All E2E tests passed!
    echo ==========================================
) else (
    echo.
    echo ==========================================
    echo Some E2E tests failed
    echo ==========================================
    exit /b 1
)
