#!/bin/bash

echo "========================================"
echo "Rebuilding Docker with Flicker Fix"
echo "========================================"
echo ""

echo "Step 1: Stopping existing containers..."
docker-compose down
echo ""

echo "Step 2: Removing old images to force rebuild..."
docker rmi conference-platform-frontend conference-platform-backend 2>/dev/null || true
echo ""

echo "Step 3: Building new images with --no-cache..."
docker-compose build --no-cache
if [ $? -ne 0 ]; then
    echo "ERROR: Docker build failed!"
    exit 1
fi
echo ""

echo "Step 4: Starting containers..."
docker-compose up -d
if [ $? -ne 0 ]; then
    echo "ERROR: Docker start failed!"
    exit 1
fi
echo ""

echo "Step 5: Waiting for services to be ready..."
sleep 10
echo ""

echo "Step 6: Checking container status..."
docker-compose ps
echo ""

echo "========================================"
echo "Deployment Complete!"
echo "========================================"
echo ""
echo "Frontend: http://localhost"
echo "Backend API: http://localhost/api"
echo ""
echo "Test the flicker fix:"
echo "1. Open http://localhost in your browser"
echo "2. Scroll to 'Past Conferences' section"
echo "3. Watch for smooth rendering without text flicker"
echo "4. Reload the page multiple times to verify"
echo ""
echo "Or open the test page:"
echo "file://$(pwd)/test-flicker-final-fix.html"
echo ""
