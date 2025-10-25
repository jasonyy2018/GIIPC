#!/bin/bash

# GIIP Full-Stack Application - Docker Quick Start Script
# This script helps you quickly set up and start the application

set -e

echo "=========================================="
echo "GIIP Full-Stack Application Setup"
echo "=========================================="
echo ""

# Check if Docker is installed
if ! command -v docker &> /dev/null; then
    echo "❌ Error: Docker is not installed"
    echo "Please install Docker from https://docs.docker.com/get-docker/"
    exit 1
fi

# Check if Docker Compose is installed
if ! command -v docker-compose &> /dev/null; then
    echo "❌ Error: Docker Compose is not installed"
    echo "Please install Docker Compose from https://docs.docker.com/compose/install/"
    exit 1
fi

echo "✅ Docker and Docker Compose are installed"
echo ""

# Check if .env file exists
if [ ! -f .env ]; then
    echo "⚠️  .env file not found. Creating from .env.example..."
    cp .env.example .env
    echo "✅ .env file created"
    echo ""
    echo "⚠️  IMPORTANT: Please edit .env file and update:"
    echo "   - JWT_SECRET (use: openssl rand -base64 32)"
    echo "   - DB_PASSWORD (use a strong password)"
    echo ""
    read -p "Press Enter to continue after updating .env file..."
else
    echo "✅ .env file found"
fi

echo ""
echo "=========================================="
echo "Starting Docker services..."
echo "=========================================="
echo ""

# Build and start services
docker-compose up -d --build

echo ""
echo "=========================================="
echo "Waiting for services to be healthy..."
echo "=========================================="
echo ""

# Wait for services to be healthy
sleep 5

# Check service status
docker-compose ps

echo ""
echo "=========================================="
echo "Service Health Checks"
echo "=========================================="
echo ""

# Check backend health
echo "Checking backend API..."
if curl -f http://localhost:3000/api/health > /dev/null 2>&1; then
    echo "✅ Backend API is healthy"
else
    echo "⚠️  Backend API is not responding yet (may still be starting)"
fi

# Check frontend health
echo "Checking frontend..."
if curl -f http://localhost/health > /dev/null 2>&1; then
    echo "✅ Frontend is healthy"
else
    echo "⚠️  Frontend is not responding yet (may still be starting)"
fi

echo ""
echo "=========================================="
echo "🚀 Application Started Successfully!"
echo "=========================================="
echo ""
echo "Access the application:"
echo "  Frontend: http://localhost"
echo "  Backend API: http://localhost:3000"
echo "  API Health: http://localhost:3000/api/health"
echo ""
echo "Useful commands:"
echo "  View logs: docker-compose logs -f"
echo "  Stop services: docker-compose down"
echo "  Restart services: docker-compose restart"
echo ""
echo "For more information, see DOCKER_GUIDE.md"
echo ""
