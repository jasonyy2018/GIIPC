#!/bin/bash

echo "========================================"
echo "GIIP Deployment for Ubuntu 24"
echo "========================================"
echo ""
echo "This script will:"
echo "  1. Stop existing containers"
echo "  2. Clean old images"
echo "  3. Build new images"
echo "  4. Start services"
echo ""
read -p "Press Enter to continue..."

echo ""
echo "Step 1: Stopping containers..."
echo "----------------------------------------"
docker-compose down

echo ""
echo "Step 2: Cleaning old images..."
echo "----------------------------------------"
docker rmi giipc-web giipc-api 2>/dev/null || true

echo ""
echo "Step 3: Building images (no cache)..."
echo "----------------------------------------"
docker-compose build --no-cache
if [ $? -ne 0 ]; then
    echo "ERROR: Build failed!"
    exit 1
fi

echo ""
echo "Step 4: Starting services..."
echo "----------------------------------------"
docker-compose up -d
if [ $? -ne 0 ]; then
    echo "ERROR: Start failed!"
    exit 1
fi

echo ""
echo "Step 5: Waiting for services (15 seconds)..."
echo "----------------------------------------"
sleep 15

echo ""
echo "Step 6: Checking container status..."
echo "----------------------------------------"
docker-compose ps

echo ""
echo "========================================"
echo "Deployment Complete!"
echo "========================================"
echo ""
echo "Services:"
echo "  Frontend: http://localhost"
echo "  Backend API: http://localhost:3000"
echo "  Database: localhost:5432"
echo ""
echo "IMPORTANT: Clear browser cache!"
echo "  Method 1: Incognito Mode (Ctrl+Shift+N)"
echo "  Method 2: Hard Refresh (Ctrl+F5)"
echo "  Method 3: Clear Cache (Ctrl+Shift+Delete)"
echo ""
echo "Check logs:"
echo "  docker logs giip-frontend"
echo "  docker logs giip-backend"
echo "  docker logs giip-database"
echo ""
