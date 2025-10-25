#!/bin/bash

# Event Time Classification Migration Script
# This script runs the time classification migration on the database

echo "🚀 Starting event time classification migration..."

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
docker cp backend/migrations/003_add_event_time_classification.sql giip-db:/tmp/

echo "🔄 Running migration..."
docker-compose exec -T db psql -U giip_user -d giip_db -f /tmp/003_add_event_time_classification.sql

if [ $? -eq 0 ]; then
    echo "✅ Migration completed successfully!"
    echo "📊 Migration summary:"
    echo "   - Added start_date and end_date columns to events table"
    echo "   - Added start_date and end_date columns to conferences table"
    echo "   - Migrated existing data from date/date_range fields"
    echo "   - Added date range validation constraints"
    echo "   - Created performance indexes for time-based queries"
    echo ""
    echo "🔄 Restarting API service..."
    docker-compose restart api
    echo "✅ Done! Event time classification is now available."
else
    echo "❌ Migration failed. Please check the error messages above."
    exit 1
fi

