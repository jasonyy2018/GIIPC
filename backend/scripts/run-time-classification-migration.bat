@echo off
REM Event Time Classification Migration Script
REM This script runs the time classification migration on the database

echo 🚀 Starting event time classification migration...

REM Check if Docker is running
docker info >nul 2>&1
if errorlevel 1 (
    echo ❌ Docker is not running. Please start Docker first.
    exit /b 1
)

REM Check if database container is running
docker-compose ps | findstr /C:"giip-db" | findstr /C:"Up" >nul
if errorlevel 1 (
    echo ❌ Database container is not running. Please start it with: docker-compose up -d db
    exit /b 1
)

echo 📋 Copying migration file to database container...
docker cp backend\migrations\003_add_event_time_classification.sql giip-db:/tmp/

echo 🔄 Running migration...
docker-compose exec -T db psql -U giip_user -d giip_db -f /tmp/003_add_event_time_classification.sql

if errorlevel 1 (
    echo ❌ Migration failed. Please check the error messages above.
    exit /b 1
)

echo ✅ Migration completed successfully!
echo 📊 Migration summary:
echo    - Added start_date and end_date columns to events table
echo    - Added start_date and end_date columns to conferences table
echo    - Migrated existing data from date/date_range fields
echo    - Added date range validation constraints
echo    - Created performance indexes for time-based queries
echo.
echo 🔄 Restarting API service...
docker-compose restart api
echo ✅ Done! Event time classification is now available.

