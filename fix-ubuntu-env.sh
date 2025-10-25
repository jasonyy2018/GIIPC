#!/bin/bash

echo "========================================"
echo "Ubuntu 24 Environment Fix"
echo "========================================"
echo ""

# Export environment variables explicitly
echo "Step 1: Exporting environment variables..."
export $(cat .env | grep -v '^#' | xargs)

echo "✅ Environment variables exported"
echo ""

# Verify variables
echo "Step 2: Verifying variables..."
echo "DB_NAME=$DB_NAME"
echo "DB_USER=$DB_USER"
echo "DB_PASSWORD=***hidden***"
echo "JWT_SECRET=***hidden***"
echo ""

# Stop existing containers
echo "Step 3: Stopping existing containers..."
docker-compose down -v
echo ""

# Remove old containers and volumes
echo "Step 4: Cleaning up..."
docker rm -f giip-frontend giip-backend giip-database 2>/dev/null || true
docker volume rm giipc_postgres-data 2>/dev/null || true
echo ""

# Build with explicit env file
echo "Step 5: Building images..."
docker-compose --env-file .env build --no-cache
if [ $? -ne 0 ]; then
    echo "❌ Build failed!"
    exit 1
fi
echo ""

# Start services with explicit env file
echo "Step 6: Starting services..."
docker-compose --env-file .env up -d
if [ $? -ne 0 ]; then
    echo "❌ Start failed!"
    exit 1
fi
echo ""

# Wait for services
echo "Step 7: Waiting for services (30 seconds)..."
sleep 30
echo ""

# Check status
echo "Step 8: Checking container status..."
docker-compose ps
echo ""

# Check database logs
echo "Step 9: Checking database logs..."
docker logs giip-database --tail 20
echo ""

echo "========================================"
echo "Fix Complete!"
echo "========================================"
echo ""
echo "If database is still unhealthy, check logs:"
echo "  docker logs giip-database"
echo ""
echo "Test connection:"
echo "  docker exec giip-database psql -U giip_user -d giip_db -c 'SELECT 1;'"
echo ""
