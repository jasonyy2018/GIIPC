#!/bin/bash

# End-to-End Test Runner Script
# This script ensures the Docker environment is ready before running E2E tests

set -e

echo "=========================================="
echo "GIIP E2E Test Runner"
echo "=========================================="
echo ""

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check if docker-compose is installed
if ! command -v docker-compose &> /dev/null; then
    echo -e "${RED}Error: docker-compose is not installed${NC}"
    exit 1
fi

# Check if services are running
echo "Checking Docker services..."
if ! docker-compose ps | grep -q "Up"; then
    echo -e "${YELLOW}Docker services are not running. Starting them now...${NC}"
    docker-compose up -d
    echo "Waiting for services to be ready (30 seconds)..."
    sleep 30
else
    echo -e "${GREEN}Docker services are running${NC}"
fi

# Check API health
echo ""
echo "Checking API health..."
MAX_RETRIES=10
RETRY_COUNT=0

while [ $RETRY_COUNT -lt $MAX_RETRIES ]; do
    if curl -s http://localhost:3000/api/health > /dev/null 2>&1; then
        echo -e "${GREEN}API is healthy${NC}"
        break
    else
        RETRY_COUNT=$((RETRY_COUNT + 1))
        if [ $RETRY_COUNT -eq $MAX_RETRIES ]; then
            echo -e "${RED}API is not responding after $MAX_RETRIES attempts${NC}"
            echo "Check logs with: docker-compose logs api"
            exit 1
        fi
        echo "Waiting for API... (attempt $RETRY_COUNT/$MAX_RETRIES)"
        sleep 3
    fi
done

# Check database
echo ""
echo "Checking database connection..."
if docker exec giip-db pg_isready -U giip_user > /dev/null 2>&1; then
    echo -e "${GREEN}Database is ready${NC}"
else
    echo -e "${RED}Database is not ready${NC}"
    exit 1
fi

# Run E2E tests
echo ""
echo "=========================================="
echo "Running E2E Tests"
echo "=========================================="
echo ""

cd backend
npm run test:e2e

# Check test result
if [ $? -eq 0 ]; then
    echo ""
    echo -e "${GREEN}=========================================="
    echo "All E2E tests passed!"
    echo -e "==========================================${NC}"
else
    echo ""
    echo -e "${RED}=========================================="
    echo "Some E2E tests failed"
    echo -e "==========================================${NC}"
    exit 1
fi
