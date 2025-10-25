# End-to-End (E2E) System Integration Tests

## Overview

These tests verify the complete GIIP system integration, including:
- Docker Compose system startup and health
- Frontend-Backend API connectivity
- Complete user workflows (registration, login, content management)
- RBAC permission validation across all roles
- Error handling and edge cases
- Data integrity and security measures

## Prerequisites

1. **Docker and Docker Compose** must be installed
2. **System must be running** via `docker-compose up`
3. **Database must be seeded** with initial data

## Running E2E Tests

### Step 1: Start the Complete System

```bash
# From project root
docker-compose up -d

# Wait for all services to be healthy (about 30 seconds)
docker-compose ps
```

### Step 2: Run E2E Tests

```bash
# From backend directory
cd backend

# Run E2E tests
npm run test:e2e

# Or run with verbose output
npm test -- __tests__/e2e/system.e2e.test.js --verbose
```

### Step 3: View Results

The tests will output detailed results for each test suite:
- ✓ Passed tests in green
- ✗ Failed tests in red
- Summary statistics at the end

## Test Coverage

### 1. System Health and Connectivity (3 tests)
- API health endpoint accessibility
- Database connection verification
- CORS configuration for frontend

### 2. User Registration Flow (5 tests)
- Successful registration with valid credentials
- Duplicate email rejection
- Invalid email format rejection
- Weak password rejection
- Default role assignment verification

### 3. User Login Flow (4 tests)
- Successful login with correct credentials
- Incorrect password rejection
- Non-existent email rejection
- JWT token validation

### 4. Content Browsing (3 tests)
- Public access to news without authentication
- Public access to events without authentication
- Public access to conferences without authentication

### 5. RBAC - User Role (3 tests)
- Permission denial for content creation
- Permission denial for event creation
- Permission denial for admin endpoints

### 6. RBAC - Editor Role (7 tests)
- News creation permission
- Event creation permission
- Conference creation permission
- Own content editing permission
- Content deletion denial
- Admin endpoint access denial

### 7. RBAC - Admin Role (5 tests)
- Full content creation permission
- Content deletion permission
- User list access
- User role modification
- New role creation

### 8. Error Scenarios (9 tests)
- Missing authentication token
- Invalid authentication token
- Non-existent resource (404)
- Invalid date format
- Missing required fields
- SQL injection prevention
- XSS attack prevention

### 9. Complete User Journey (8 tests)
- End-to-end workflow from registration to content consumption
- Multi-step user interaction validation

### 10. Data Integrity (4 tests)
- Database content verification
- Password hashing validation
- Foreign key relationship integrity
- Role-permission mapping verification

## Environment Variables

The tests use the following environment variables (with defaults):

```env
API_URL=http://localhost:3000
DB_HOST=localhost
DB_PORT=5432
DB_NAME=giip_db
DB_USER=giip_user
DB_PASSWORD=giip_password
```

## Troubleshooting

### Tests Fail with "API not ready"

**Solution**: Ensure docker-compose services are fully started:
```bash
docker-compose ps
docker-compose logs api
```

### Database Connection Errors

**Solution**: Check database service health:
```bash
docker-compose logs db
docker exec -it giip-db psql -U giip_user -d giip_db -c "SELECT 1;"
```

### Permission Test Failures

**Solution**: Verify seed data was loaded:
```bash
docker exec -it giip-db psql -U giip_user -d giip_db -c "SELECT * FROM roles;"
docker exec -it giip-db psql -U giip_user -d giip_db -c "SELECT * FROM permissions;"
```

### Port Conflicts

**Solution**: Ensure ports 80, 3000, and 5432 are available:
```bash
# Windows
netstat -ano | findstr :3000
netstat -ano | findstr :5432

# Stop conflicting services or change ports in docker-compose.yml
```

## CI/CD Integration

To run these tests in a CI/CD pipeline:

```yaml
# Example GitHub Actions workflow
- name: Start Docker Compose
  run: docker-compose up -d

- name: Wait for services
  run: sleep 30

- name: Run E2E Tests
  run: |
    cd backend
    npm run test:e2e

- name: Cleanup
  run: docker-compose down -v
```

## Test Data Cleanup

E2E tests create test data during execution. To clean up:

```bash
# Reset database (WARNING: deletes all data)
docker-compose down -v
docker-compose up -d

# Or manually delete test users
docker exec -it giip-db psql -U giip_user -d giip_db -c "DELETE FROM users WHERE email LIKE 'test-%@giip.info';"
```

## Expected Results

All tests should pass when the system is properly configured:

```
Test Suites: 1 passed, 1 total
Tests:       50+ passed, 50+ total
Time:        ~30-60 seconds
```

## Notes

- Tests are designed to be idempotent where possible
- Some tests create data that persists in the database
- Tests run sequentially to maintain state consistency
- Admin credentials from seed data are used for privileged operations
