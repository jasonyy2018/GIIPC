#!/bin/bash

echo "========================================"
echo "Environment Variables Check"
echo "========================================"
echo ""

# Check if .env file exists
if [ ! -f .env ]; then
    echo "❌ ERROR: .env file not found!"
    echo ""
    echo "Creating .env from .env.example..."
    if [ -f .env.example ]; then
        cp .env.example .env
        echo "✅ .env file created. Please edit it with your values."
    else
        echo "❌ .env.example not found either!"
    fi
    exit 1
fi

echo "✅ .env file found"
echo ""

# Required variables
REQUIRED_VARS=(
    "DB_NAME"
    "DB_USER"
    "DB_PASSWORD"
    "JWT_SECRET"
)

# Check each required variable
MISSING_VARS=()
for var in "${REQUIRED_VARS[@]}"; do
    value=$(grep "^${var}=" .env | cut -d '=' -f2-)
    if [ -z "$value" ]; then
        echo "❌ $var is not set or empty"
        MISSING_VARS+=("$var")
    else
        # Mask sensitive values
        if [[ "$var" == *"PASSWORD"* ]] || [[ "$var" == *"SECRET"* ]]; then
            echo "✅ $var is set (value hidden)"
        else
            echo "✅ $var = $value"
        fi
    fi
done

echo ""

# Check optional variables
OPTIONAL_VARS=(
    "DB_HOST"
    "DB_PORT"
    "JWT_EXPIRES_IN"
    "FRONTEND_URL"
    "NODE_ENV"
    "PORT"
)

echo "Optional variables:"
for var in "${OPTIONAL_VARS[@]}"; do
    value=$(grep "^${var}=" .env | cut -d '=' -f2-)
    if [ -z "$value" ]; then
        echo "⚠️  $var is not set (will use default)"
    else
        echo "✅ $var = $value"
    fi
done

echo ""
echo "========================================"

# Summary
if [ ${#MISSING_VARS[@]} -eq 0 ]; then
    echo "✅ All required variables are set!"
    echo ""
    echo "You can now run:"
    echo "  docker-compose up -d"
    exit 0
else
    echo "❌ Missing required variables:"
    for var in "${MISSING_VARS[@]}"; do
        echo "  - $var"
    done
    echo ""
    echo "Please edit .env file and set these variables."
    exit 1
fi
