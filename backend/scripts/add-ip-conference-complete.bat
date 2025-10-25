@echo off
REM Complete script to add the 2019 IP Conference (event + news) to the database

echo ================================================================================
echo Adding 2019 IP Conference to Database
echo Event + News Article
echo ================================================================================
echo.

echo This script will add:
echo   1. Conference event (June 28-29, 2019)
echo   2. News article about the conference
echo.

echo Prerequisites:
echo   [x] Backend server must be running (npm start in backend folder)
echo   [x] Database must be set up and running
echo   [x] Admin user must exist (admin@giip.info / Admin@2025)
echo.

set /p confirm="Ready to proceed? (y/n): "

if /i not "%confirm%"=="y" (
    echo.
    echo Operation cancelled.
    echo.
    pause
    exit /b 0
)

echo.
echo ================================================================================
echo Running script...
echo ================================================================================
echo.

node add-ip-conference-complete.js

if %ERRORLEVEL% EQU 0 (
    echo.
    echo ================================================================================
    echo Success! Conference data has been added to the database.
    echo ================================================================================
    echo.
    echo Next steps:
    echo   1. Visit http://localhost:8080 to see the homepage
    echo   2. Navigate to the Events page to see all events
    echo   3. Check the News section for the conference article
    echo.
) else (
    echo.
    echo ================================================================================
    echo Error occurred. Please check the error message above.
    echo ================================================================================
    echo.
)

echo Press any key to exit...
pause >nul
