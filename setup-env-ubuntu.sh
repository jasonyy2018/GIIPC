#!/bin/bash

# Setup .env file for Ubuntu deployment
echo "Setting up .env file..."

# Generate a random JWT secret
JWT_SECRET=$(openssl rand -base64 32)

# Create .env file
cat > .env << EOF
# Database Configuration
DB_NAME=giip_db
DB_USER=giip_user
DB_PASSWORD=$(openssl rand -base64 24)
DB_HOST=db
DB_PORT=5432

# JWT Configuration
JWT_SECRET=${JWT_SECRET}
JWT_EXPIRES_IN=1h

# Frontend Configuration
FRONTEND_URL=http://localhost

# Node Environment
NODE_ENV=production
PORT=3000

# Rate Limiting (optional)
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
LOGIN_RATE_LIMIT_MAX=5
EOF

echo "✓ .env file created successfully!"
echo ""
echo "Generated credentials:"
echo "  DB_USER: giip_user"
echo "  DB_PASSWORD: (check .env file)"
echo "  JWT_SECRET: (check .env file)"
echo ""
echo "You can now run: docker-compose up -d"
