@echo off
REM Script to add the 2019 IP Conference to the database

echo ========================================
echo Adding 2019 IP Conference to Database
echo ========================================
echo.

echo Prerequisites:
echo 1. Backend server must be running (npm start in backend folder)
echo 2. Database must be set up and running
echo 3. Admin user must exist in the database
echo.

set /p confirm="Continue? (y/n): "

if /i not "%confirm%"=="y" (
    echo Operation cancelled.
    exit /b 0
)

echo.
echo Running script...
echo.

node add-ip-conference-2019.js

echo.
echo Press any key to exit...
pause >nul
