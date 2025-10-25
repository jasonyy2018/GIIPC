# GIIP Backend API

Backend API for the Global Innovation and Intellectual Property platform.

## Features

- PostgreSQL database with connection pooling
- Database health checks with retry logic
- JWT-based authentication
- Role-Based Access Control (RBAC)
- RESTful API endpoints
- Docker support

## Prerequisites

- Node.js v18+
- PostgreSQL v16+
- npm or yarn

## Installation

1. Install dependencies:
```bash
npm install
```

2. Configure environment variables:
```bash
cp .env.example .env
# Edit .env with your database credentials
```

3. Set up the database:
```bash
# Create database and run migrations
psql -U postgres -f schema.sql
psql -U postgres -d giip_db -f seeds/seed.sql
```

## Database Configuration

The database connection is configured in `src/config/db.js` with the following features:

### Connection Pooling
- Maximum 20 concurrent connections
- 30-second idle timeout
- 10-second connection timeout

### Health Check
The `/api/health` endpoint provides database status:
```json
{
  "status": "ok",
  "timestamp": "2025-10-17T10:00:00.000Z",
  "service": "GIIP Backend API",
  "database": {
    "status": "healthy",
    "message": "Database connection successful",
    "responseTime": "15ms",
    "version": "PostgreSQL 16.0"
  }
}
```

### Retry Logic
The application automatically retries database connections with:
- Maximum 5 retry attempts
- Exponential backoff (1s, 2s, 4s, 8s, 16s)
- Detailed logging of connection attempts

### Error Handling
- Automatic reconnection on connection loss
- Query error logging with details
- Slow query detection (> 1 second)
- Graceful shutdown on SIGTERM/SIGINT

## Running the Application

### Development Mode
```bash
npm run dev
```

### Production Mode
```bash
npm start
```

### With Docker
```bash
docker-compose up
```

## API Endpoints

### Health Check
```
GET /api/health
```

Returns the health status of the API and database connection.

## Environment Variables

Required environment variables (see `.env.example`):

- `DB_HOST` - Database host (default: localhost)
- `DB_PORT` - Database port (default: 5432)
- `DB_NAME` - Database name
- `DB_USER` - Database user
- `DB_PASSWORD` - Database password
- `JWT_SECRET` - Secret key for JWT signing
- `JWT_EXPIRES_IN` - JWT expiration time (default: 1h)
- `PORT` - Server port (default: 3000)
- `NODE_ENV` - Environment (development/production)
- `FRONTEND_URL` - Frontend URL for CORS

## Database Functions

### `connectWithRetry(maxRetries, initialDelay)`
Connects to the database with automatic retry logic.

### `checkDatabaseHealth()`
Performs a health check and returns connection status.

### `query(text, params)`
Executes a parameterized query with error handling.

### `getClient()`
Gets a client from the pool for transactions.

### `closePool()`
Closes all database connections (for graceful shutdown).

## Security

- Helmet.js for security headers
- CORS configuration
- Parameterized queries to prevent SQL injection
- Environment-based configuration
- Password hashing with bcrypt
- JWT token authentication

## License

ISC
