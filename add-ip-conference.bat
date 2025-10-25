@echo off
echo ========================================
echo Adding IP Conference 2024 to Database
echo ========================================
echo.

REM Load environment variables
if exist .env (
    for /f "usebackq tokens=1,* delims==" %%a in (".env") do (
        set "%%a=%%b"
    )
)

REM Set default values if not in .env
if not defined DB_HOST set DB_HOST=localhost
if not defined DB_PORT set DB_PORT=5432
if not defined DB_NAME set DB_NAME=giip
if not defined DB_USER set DB_USER=giip_user
if not defined DB_PASSWORD set DB_PASSWORD=giip_password

echo Connecting to database: %DB_NAME% at %DB_HOST%:%DB_PORT%
echo.

REM Execute the SQL file
set PGPASSWORD=%DB_PASSWORD%
psql -h %DB_HOST% -p %DB_PORT% -U %DB_USER% -d %DB_NAME% -f add-ip-conference-2024.sql

if %ERRORLEVEL% EQU 0 (
    echo.
    echo ========================================
    echo Conference data added successfully!
    echo ========================================
    echo.
    echo You can now view:
    echo - News article about the conference
    echo - Conference entry in the conferences table
    echo - Event entry in the events table
    echo.
) else (
    echo.
    echo ========================================
    echo Error adding conference data
    echo ========================================
    echo Please check your database connection and try again.
    echo.
)

pause
