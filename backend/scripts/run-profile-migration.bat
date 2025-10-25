@echo off
REM Profile Migration Script for Windows
REM This script runs the profile fields migration on the database

echo Starting profile migration...

REM Check if Docker is running
docker info >nul 2>&1
if errorlevel 1 (
    echo Docker is not running. Please start Docker first.
    exit /b 1
)

REM Check if database container is running
docker-compose ps | findstr /C:"giip-db" | findstr /C:"Up" >nul
if errorlevel 1 (
    echo Database container is not running. Please start it with: docker-compose up -d db
    exit /b 1
)

echo Copying migration file to database container...
docker cp backend\migrations\002_add_user_profile.sql giip-db:/tmp/

echo Running migration...
docker-compose exec -T db psql -U giip_user -d giip_db -f /tmp/002_add_user_profile.sql

if errorlevel 1 (
    echo Migration failed. Please check the error messages above.
    exit /b 1
)

echo Migration completed successfully!
echo Restarting API service...
docker-compose restart api

echo Done! Profile management is now available.
echo Access the profile page at: http://localhost/profile.html
