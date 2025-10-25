# Integration Tests

This directory contains integration tests for the GIIP Backend API. These tests verify the complete functionality of API endpoints including authentication, authorization, and database operations.

## Test Structure

- `setup.integration.js` - Test database setup and helper functions
- `auth.integration.test.js` - Authentication endpoint tests
- `news.integration.test.js` - News API endpoint tests
- `events.integration.test.js` - Events API endpoint tests
- `conferences.integration.test.js` - Conferences API endpoint tests
- `admin.integration.test.js` - Admin API endpoint tests

## Test Database

Integration tests use a separate test database to avoid affecting production or development data. The test database is configured via environment variables:

```env
TEST_DB_NAME=giip_test_db
DB_USER=giip_user
DB_PASSWORD=giip_secure_password_2025
DB_HOST=localhost
DB_PORT=5432
```

## Running Tests

### Run all integration tests:
```bash
npm run test:integration
```

### Run specific test file:
```bash
npm test -- __tests__/integration/auth.integration.test.js
```

### Run with coverage:
```bash
npm run test:coverage
```

## Test Coverage

The integration tests cover:

### Authentication (auth.integration.test.js)
- User registration with validation
- User login with JWT generation
- Invalid credentials handling
- Duplicate email prevention

### News API (news.integration.test.js)
- GET all news (with read:news permission)
- GET single news by ID
- POST create news (with write:news permission)
- PUT update news (owner or edit:news permission)
- DELETE news (with delete:news permission)
- Permission validation for all operations

### Events API (events.integration.test.js)
- GET all events (with read:events permission)
- GET single event by ID
- POST create event (with write:events permission)
- PUT update event (owner or edit:events permission)
- DELETE event (with delete:events permission)
- Permission validation for all operations

### Conferences API (conferences.integration.test.js)
- GET all conferences (with read:conferences permission)
- GET single conference by ID
- POST create conference (with write:conferences permission)
- PUT update conference (owner or edit:conferences permission)
- DELETE conference (with delete:conferences permission)
- Permission validation for all operations

### Admin API (admin.integration.test.js)
- GET all users (admin only)
- PUT update user role (admin only)
- POST create new role (admin only)
- POST assign permission to role (admin only)
- Non-admin access rejection

## Test Users

Each test creates the following test users:

- **Admin User**: Full permissions (admin role)
- **Editor User**: Content management permissions (editor role)
- **Regular User**: Read-only permissions (user role)

## Database Lifecycle

1. **beforeAll**: Initialize test database schema and seed roles/permissions
2. **beforeEach**: Create test users and test data
3. **afterEach**: Clean all data from tables
4. **afterAll**: Close database connection

## Error Handling Tests

All integration tests verify:
- Proper HTTP status codes (200, 201, 400, 401, 403, 404, 409, 500)
- Error response format consistency
- Validation error messages
- Authentication failures
- Authorization failures

## Best Practices

1. Each test is independent and doesn't rely on other tests
2. Test data is cleaned up after each test
3. Tests use real database operations (no mocks)
4. Tests verify both success and failure scenarios
5. Tests check response structure and data integrity
