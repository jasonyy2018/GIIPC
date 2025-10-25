#!/bin/bash

echo "========================================"
echo "Adding GIIP1 Conference 2019 to Database"
echo "========================================"
echo ""

# Load environment variables from .env file
if [ -f .env ]; then
    export $(cat .env | grep -v '^#' | xargs)
fi

# Set default values if not in .env
DB_HOST=${DB_HOST:-localhost}
DB_PORT=${DB_PORT:-5432}
DB_NAME=${DB_NAME:-giip}
DB_USER=${DB_USER:-giip_user}
DB_PASSWORD=${DB_PASSWORD:-giip_password}

echo "Connecting to database: $DB_NAME at $DB_HOST:$DB_PORT"
echo ""

# Execute the SQL file
export PGPASSWORD=$DB_PASSWORD
psql -h $DB_HOST -p $DB_PORT -U $DB_USER -d $DB_NAME -f add-giip1-conference-2019.sql

if [ $? -eq 0 ]; then
    echo ""
    echo "========================================"
    echo "GIIP1 Conference 2019 data added successfully!"
    echo "========================================"
    echo ""
    echo "You can now view:"
    echo "- News article about the conference"
    echo "- Conference entry in the conferences table"
    echo "- Event entry in the events table"
    echo ""
else
    echo ""
    echo "========================================"
    echo "Error adding conference data"
    echo "========================================"
    echo "Please check your database connection and try again."
    echo ""
fi
