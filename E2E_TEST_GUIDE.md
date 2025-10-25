# End-to-End Testing Guide

## Overview

This guide covers the complete end-to-end (E2E) testing process for the GIIP full-stack application. E2E tests verify that all system components work together correctly, including Docker containers, database, backend API, and frontend integration.

## What E2E Tests Cover

### 1. System Integration
- ✅ Docker Compose orchestration
- ✅ Service health checks (API, Database, Frontend)
- ✅ Network connectivity between services
- ✅ CORS configuration for frontend-backend communication

### 2. User Workflows
- ✅ Complete registration flow with validation
- ✅ Login and JWT authentication
- ✅ Content browsing (news, events, conferences)
- ✅ Content creation and management
- ✅ User role management

### 3. RBAC Permission System
- ✅ User role permissions (read-only access)
- ✅ Editor role permissions (create and edit content)
- ✅ Admin role permissions (full access)
- ✅ Permission denial scenarios
- ✅ Cross-role permission validation

### 4. Security Measures
- ✅ Password hashing verification
- ✅ JWT token validation
- ✅ SQL injection prevention
- ✅ XSS attack prevention
- ✅ Authentication requirement enforcement

### 5. Error Handling
- ✅ Invalid input validation
- ✅ Missing authentication errors
- ✅ Permission denied errors
- ✅ Resource not found errors
- ✅ Duplicate data conflicts

### 6. Data Integrity
- ✅ Database foreign key relationships
- ✅ Role-permission mappings
- ✅ Content ownership tracking
- ✅ Data consistency across operations

## Prerequisites

### Required Software
- Docker Desktop (Windows/Mac) or Docker Engine (Linux)
- Docker Compose v2.0+
- Node.js v18+ (for running tests)
- npm v9+

### System Requirements
- Available ports: 80 (frontend), 3000 (API), 5432 (database)
- Minimum 4GB RAM
- 10GB free disk space

## Quick Start

### Windows

```cmd
# 1. Start the system
docker-compose up -d

# 2. Run E2E tests
run-e2e-tests.bat
```

### Linux/Mac

```bash
# 1. Start the system
docker-compose up -d

# 2. Make script executable
chmod +x run-e2e-tests.sh

# 3. Run E2E tests
./run-e2e-tests.sh
```

### Manual Execution

```bash
# 1. Start Docker services
docker-compose up -d

# 2. Wait for services to be ready
sleep 30

# 3. Verify services are running
docker-compose ps

# 4. Run tests
cd backend
npm run test:e2e
```

## Test Structure

### Test Suites

```
backend/__tests__/e2e/
├── system.e2e.test.js          # Main E2E test suite
└── README.md                    # E2E test documentation
```

### Test Organization

1. **System Health and Connectivity** (3 tests)
   - API health endpoint
   - Database connection
   - CORS configuration

2. **User Registration Flow** (5 tests)
   - Valid registration
   - Duplicate email handling
   - Invalid email format
   - Weak password rejection
   - Default role assignment

3. **User Login Flow** (4 tests)
   - Successful login
   - Wrong password
   - Non-existent user
   - JWT validation

4. **Content Browsing** (3 tests)
   - Public news access
   - Public events access
   - Public conferences access

5. **RBAC - User Role** (3 tests)
   - Content creation denial
   - Event creation denial
   - Admin access denial

6. **RBAC - Editor Role** (7 tests)
   - News creation
   - Event creation
   - Conference creation
   - Own content editing
   - Delete denial
   - Admin access denial

7. **RBAC - Admin Role** (5 tests)
   - Full content access
   - Content deletion
   - User management
   - Role modification
   - Role creation

8. **Error Scenarios** (9 tests)
   - Missing token
   - Invalid token
   - 404 errors
   - Invalid data format
   - Missing fields
   - SQL injection attempts
   - XSS attempts

9. **Complete User Journey** (8 tests)
   - End-to-end workflow validation

10. **Data Integrity** (4 tests)
    - Database content verification
    - Password hashing
    - Foreign key integrity
    - Role-permission mappings

## Running Specific Test Suites

### Run Only E2E Tests

```bash
cd backend
npm run test:e2e
```

### Run with Verbose Output

```bash
cd backend
npm test -- __tests__/e2e/system.e2e.test.js --verbose
```

### Run Specific Test Suite

```bash
cd backend
npm test -- __tests__/e2e/system.e2e.test.js -t "User Registration Flow"
```

### Run with Coverage

```bash
cd backend
npm run test:coverage -- __tests__/e2e/
```

## Interpreting Results

### Successful Test Run

```
PASS  __tests__/e2e/system.e2e.test.js (45.123 s)
  E2E: Complete System Integration
    1. System Health and Connectivity
      ✓ API health endpoint should be accessible (234 ms)
      ✓ Database should be connected and accessible (123 ms)
      ✓ Frontend should be able to reach API (CORS) (156 ms)
    ...

Test Suites: 1 passed, 1 total
Tests:       50 passed, 50 total
Snapshots:   0 total
Time:        45.123 s
```

### Failed Test Example

```
FAIL  __tests__/e2e/system.e2e.test.js
  ● E2E: Complete System Integration › User Login Flow › User should be able to login

    expect(received).toBe(expected)

    Expected: 200
    Received: 401

      at Object.<anonymous> (__tests__/e2e/system.e2e.test.js:123:28)
```

## Troubleshooting

### Issue: "API not ready" Error

**Symptoms**: Tests fail with connection errors

**Solutions**:
1. Check if services are running:
   ```bash
   docker-compose ps
   ```

2. View API logs:
   ```bash
   docker-compose logs api
   ```

3. Restart services:
   ```bash
   docker-compose restart api
   ```

### Issue: Database Connection Errors

**Symptoms**: Tests fail with "ECONNREFUSED" or database errors

**Solutions**:
1. Check database status:
   ```bash
   docker-compose logs db
   ```

2. Verify database is accepting connections:
   ```bash
   docker exec giip-db pg_isready -U giip_user
   ```

3. Reset database:
   ```bash
   docker-compose down -v
   docker-compose up -d
   ```

### Issue: Permission Test Failures

**Symptoms**: RBAC tests fail unexpectedly

**Solutions**:
1. Verify seed data was loaded:
   ```bash
   docker exec -it giip-db psql -U giip_user -d giip_db -c "SELECT * FROM roles;"
   docker exec -it giip-db psql -U giip_user -d giip_db -c "SELECT * FROM role_permissions;"
   ```

2. Re-run database initialization:
   ```bash
   docker-compose down -v
   docker-compose up -d
   ```

### Issue: Port Conflicts

**Symptoms**: Services fail to start with "port already in use"

**Solutions**:
1. Check what's using the ports:
   ```bash
   # Windows
   netstat -ano | findstr :3000
   netstat -ano | findstr :5432
   
   # Linux/Mac
   lsof -i :3000
   lsof -i :5432
   ```

2. Stop conflicting services or modify `docker-compose.yml` to use different ports

### Issue: Tests Timeout

**Symptoms**: Tests hang or timeout

**Solutions**:
1. Increase Jest timeout in test file
2. Check for long-running queries in database
3. Verify network connectivity between containers

## Best Practices

### Before Running Tests

1. ✅ Ensure Docker services are running
2. ✅ Verify all services are healthy
3. ✅ Check database is seeded with initial data
4. ✅ Confirm ports are available

### During Test Development

1. ✅ Write tests that are independent and idempotent
2. ✅ Clean up test data after execution
3. ✅ Use meaningful test descriptions
4. ✅ Test both success and failure scenarios
5. ✅ Verify security measures are working

### After Tests Complete

1. ✅ Review test coverage reports
2. ✅ Check for flaky tests
3. ✅ Document any known issues
4. ✅ Update test documentation

## CI/CD Integration

### GitHub Actions Example

```yaml
name: E2E Tests

on: [push, pull_request]

jobs:
  e2e-tests:
    runs-on: ubuntu-latest
    
    steps:
      - uses: actions/checkout@v3
      
      - name: Set up Docker Buildx
        uses: docker/setup-buildx-action@v2
      
      - name: Start Docker Compose
        run: docker-compose up -d
      
      - name: Wait for services
        run: sleep 30
      
      - name: Run E2E Tests
        run: |
          cd backend
          npm install
          npm run test:e2e
      
      - name: Cleanup
        if: always()
        run: docker-compose down -v
```

### GitLab CI Example

```yaml
e2e-tests:
  stage: test
  services:
    - docker:dind
  script:
    - docker-compose up -d
    - sleep 30
    - cd backend
    - npm install
    - npm run test:e2e
  after_script:
    - docker-compose down -v
```

## Test Data Management

### Seed Data

The system uses seed data from `backend/seeds/seed.sql`:
- 3 default roles (admin, editor, user)
- Default permissions mapped to roles
- Sample admin user (admin@giip.com)
- Sample content (news, events, conferences)

### Test Data Cleanup

E2E tests create temporary data. To clean up:

```bash
# Full reset (WARNING: deletes all data)
docker-compose down -v
docker-compose up -d

# Selective cleanup
docker exec -it giip-db psql -U giip_user -d giip_db -c "
  DELETE FROM users WHERE email LIKE 'test-%@giip.info';
  DELETE FROM users WHERE email LIKE 'journey-%@giip.info';
  DELETE FROM users WHERE email LIKE 'editor-%@giip.info';
"
```

## Performance Considerations

### Test Execution Time

- Expected duration: 30-60 seconds
- Factors affecting speed:
  - Docker container startup time
  - Database query performance
  - Network latency
  - Number of tests

### Optimization Tips

1. Use `--runInBand` flag to run tests sequentially
2. Reuse authentication tokens across tests
3. Minimize database queries
4. Use connection pooling
5. Cache frequently accessed data

## Security Testing

### What's Tested

1. **Authentication**
   - JWT token validation
   - Password hashing (bcrypt)
   - Token expiration

2. **Authorization**
   - Role-based access control
   - Permission validation
   - Ownership verification

3. **Input Validation**
   - SQL injection prevention
   - XSS attack prevention
   - Data sanitization

4. **Security Headers**
   - CORS configuration
   - Helmet.js headers
   - Content Security Policy

## Maintenance

### Regular Tasks

1. **Weekly**
   - Run full E2E test suite
   - Review test failures
   - Update test data if needed

2. **Monthly**
   - Review test coverage
   - Update test documentation
   - Optimize slow tests

3. **Per Release**
   - Run E2E tests before deployment
   - Verify all tests pass
   - Document any known issues

### Updating Tests

When adding new features:
1. Add corresponding E2E tests
2. Update test documentation
3. Verify tests pass in CI/CD
4. Update coverage requirements

## Support

### Getting Help

- Check `backend/__tests__/e2e/README.md` for detailed test documentation
- Review `DOCKER_GUIDE.md` for Docker-specific issues
- See `API_DOCUMENTATION.md` for API endpoint details
- Consult `DEPLOYMENT.md` for deployment troubleshooting

### Reporting Issues

When reporting test failures, include:
1. Test output and error messages
2. Docker service status (`docker-compose ps`)
3. Service logs (`docker-compose logs`)
4. Environment details (OS, Docker version)
5. Steps to reproduce

## Summary

E2E tests provide confidence that the entire GIIP system works correctly as an integrated whole. They verify:
- ✅ All services communicate properly
- ✅ User workflows function end-to-end
- ✅ Security measures are effective
- ✅ Data integrity is maintained
- ✅ Error handling works correctly

Run E2E tests regularly to catch integration issues early and ensure system reliability.
