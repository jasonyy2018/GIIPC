#!/bin/bash

# Profile Migration Script
# This script runs the profile fields migration on the database

echo "🚀 Starting profile migration..."

# Check if Docker is running
if ! docker info > /dev/null 2>&1; then
    echo "❌ Docker is not running. Please start Docker first."
    exit 1
fi

# Check if database container is running
if ! docker-compose ps | grep -q "giip-db.*Up"; then
    echo "❌ Database container is not running. Please start it with: docker-compose up -d db"
    exit 1
fi

echo "📋 Copying migration file to database container..."
docker cp backend/migrations/002_add_user_profile.sql giip-db:/tmp/

echo "🔄 Running migration..."
docker-compose exec -T db psql -U giip_user -d giip_db -f /tmp/002_add_user_profile.sql

if [ $? -eq 0 ]; then
    echo "✅ Migration completed successfully!"
    echo "🔄 Restarting API service..."
    docker-compose restart api
    echo "✅ Done! Profile management is now available."
    echo "📱 Access the profile page at: http://localhost/profile.html"
else
    echo "❌ Migration failed. Please check the error messages above."
    exit 1
fi
