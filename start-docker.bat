@echo off
REM GIIP Full-Stack Application - Docker Quick Start Script (Windows)
REM This script helps you quickly set up and start the application

echo ==========================================
echo GIIP Full-Stack Application Setup
echo ==========================================
echo.

REM Check if Docker is installed
docker --version >nul 2>&1
if errorlevel 1 (
    echo Error: Docker is not installed
    echo Please install Docker from https://docs.docker.com/get-docker/
    exit /b 1
)

REM Check if Docker Compose is installed
docker-compose --version >nul 2>&1
if errorlevel 1 (
    echo Error: Docker Compose is not installed
    echo Please install Docker Compose from https://docs.docker.com/compose/install/
    exit /b 1
)

echo Docker and Docker Compose are installed
echo.

REM Check if .env file exists
if not exist .env (
    echo .env file not found. Creating from .env.example...
    copy .env.example .env
    echo .env file created
    echo.
    echo IMPORTANT: Please edit .env file and update:
    echo    - JWT_SECRET ^(use a strong random string^)
    echo    - DB_PASSWORD ^(use a strong password^)
    echo.
    pause
) else (
    echo .env file found
)

echo.
echo ==========================================
echo Starting Docker services...
echo ==========================================
echo.

REM Build and start services
docker-compose up -d --build

echo.
echo ==========================================
echo Waiting for services to be healthy...
echo ==========================================
echo.

REM Wait for services to be healthy
timeout /t 5 /nobreak >nul

REM Check service status
docker-compose ps

echo.
echo ==========================================
echo Service Health Checks
echo ==========================================
echo.

REM Check backend health
echo Checking backend API...
curl -f http://localhost:3000/api/health >nul 2>&1
if errorlevel 1 (
    echo Backend API is not responding yet ^(may still be starting^)
) else (
    echo Backend API is healthy
)

REM Check frontend health
echo Checking frontend...
curl -f http://localhost/health >nul 2>&1
if errorlevel 1 (
    echo Frontend is not responding yet ^(may still be starting^)
) else (
    echo Frontend is healthy
)

echo.
echo ==========================================
echo Application Started Successfully!
echo ==========================================
echo.
echo Access the application:
echo   Frontend: http://localhost
echo   Backend API: http://localhost:3000
echo   API Health: http://localhost:3000/api/health
echo.
echo Useful commands:
echo   View logs: docker-compose logs -f
echo   Stop services: docker-compose down
echo   Restart services: docker-compose restart
echo.
echo For more information, see DOCKER_GUIDE.md
echo.
pause
