@echo off
REM Upcoming Events Feature - Complete Test Suite Runner
REM This script helps run all tests for the Upcoming Events feature

echo ========================================
echo Upcoming Events Feature - Test Suite
echo ========================================
echo.

echo This script will help you run comprehensive tests for the Upcoming Events feature.
echo.

echo Available Tests:
echo 1. Automated QA Test Suite (Browser-based)
echo 2. Event Card Component Test
echo 3. Event Detail Page Test
echo 4. Authentication Gate Test
echo 5. Error Handling Test
echo 6. Run All Browser Tests
echo.

set /p choice="Enter your choice (1-6): "

if "%choice%"=="1" (
    echo.
    echo Opening Automated QA Test Suite...
    start "" "http://localhost:8080/test-upcoming-events-qa.html"
    echo.
    echo Instructions:
    echo 1. Click "Run All Tests" to execute all automated tests
    echo 2. Review the test results
    echo 3. Check for any failures or warnings
    echo 4. Document results in UPCOMING_EVENTS_QA_REPORT.md
    echo.
)

if "%choice%"=="2" (
    echo.
    echo Opening Event Card Component Test...
    start "" "http://localhost:8080/test-event-card.html"
    echo.
    echo Instructions:
    echo 1. Verify event cards render correctly
    echo 2. Test click interactions
    echo 3. Check date badge formatting
    echo 4. Verify responsive behavior
    echo.
)

if "%choice%"=="3" (
    echo.
    echo Opening Event Detail Page Test...
    start "" "http://localhost:8080/test-event-detail.html"
    echo.
    echo Instructions:
    echo 1. Run all automated checks
    echo 2. Click "Open Event Detail Page" button
    echo 3. Verify event details load correctly
    echo 4. Test registration form (if logged in)
    echo 5. Test auth-required message (if logged out)
    echo.
)

if "%choice%"=="4" (
    echo.
    echo Opening Authentication Gate Test...
    start "" "http://localhost:8080/test-auth-gate.html"
    echo.
    echo Instructions:
    echo 1. Check current authentication status
    echo 2. Test event card clicks (logged in vs logged out)
    echo 3. Verify login modal appears for non-authenticated users
    echo 4. Test post-login redirect
    echo 5. Check sessionStorage for intended destination
    echo.
)

if "%choice%"=="5" (
    echo.
    echo Opening Error Handling Test...
    start "" "http://localhost:8080/test-error-handling.html"
    echo.
    echo Instructions:
    echo 1. Click each error type button
    echo 2. Verify error messages display correctly
    echo 3. Test retry functionality
    echo 4. Check loading states
    echo 5. Verify empty states
    echo.
)

if "%choice%"=="6" (
    echo.
    echo Opening All Browser Tests...
    start "" "http://localhost:8080/test-upcoming-events-qa.html"
    start "" "http://localhost:8080/test-event-card.html"
    start "" "http://localhost:8080/test-event-detail.html"
    start "" "http://localhost:8080/test-auth-gate.html"
    start "" "http://localhost:8080/test-error-handling.html"
    echo.
    echo All test pages opened in browser.
    echo Please test each page systematically.
    echo.
)

echo.
echo Additional Testing Resources:
echo - QA Report: frontend\UPCOMING_EVENTS_QA_REPORT.md
echo - Accessibility Checklist: frontend\ACCESSIBILITY_QA_CHECKLIST.md
echo - Cross-Browser Guide: frontend\CROSS_BROWSER_TESTING_GUIDE.md
echo.

echo Manual Testing Checklist:
echo [ ] Test on Chrome browser
echo [ ] Test on Firefox browser
echo [ ] Test on Safari browser (if available)
echo [ ] Test on Edge browser
echo [ ] Test on mobile device (320px-767px)
echo [ ] Test on tablet device (768px-1023px)
echo [ ] Test keyboard navigation
echo [ ] Test with screen reader
echo [ ] Test responsive design at various breakpoints
echo [ ] Test error states and edge cases
echo [ ] Test authentication flows
echo [ ] Test registration form submission
echo.

echo Press any key to exit...
pause >nul
