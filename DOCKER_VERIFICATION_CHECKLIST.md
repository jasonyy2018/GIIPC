# Docker Configuration Verification Checklist

Use this checklist to verify that the Docker configuration is working correctly.

## Pre-Deployment Checklist

### Configuration Files
- [x] `docker-compose.yml` exists and is valid
- [x] `frontend/Dockerfile` exists
- [x] `backend/Dockerfile` exists
- [x] `.env.example` exists with all required variables
- [x] `frontend/nginx.conf` exists
- [x] `frontend/.dockerignore` exists
- [x] `backend/.dockerignore` exists

### Environment Setup
- [ ] `.env` file created from `.env.example`
- [ ] `JWT_SECRET` updated with strong random value
- [ ] `DB_PASSWORD` updated with secure password
- [ ] `FRONTEND_URL` set correctly for your environment

## Validation Tests

### 1. Configuration Validation
```bash
docker-compose config
```
Expected: No errors, valid YAML output

### 2. Build Images
```bash
docker-compose build
```
Expected: All three services build successfully
- [ ] web (frontend) builds
- [ ] api (backend) builds
- [ ] db (database) pulls successfully

### 3. Start Services
```bash
docker-compose up -d
```
Expected: All services start
- [ ] web container starts
- [ ] api container starts
- [ ] db container starts

### 4. Check Service Status
```bash
docker-compose ps
```
Expected: All services show "healthy" or "running"
- [ ] web: healthy
- [ ] api: healthy
- [ ] db: healthy

### 5. Health Checks

#### Frontend Health
```bash
curl http://localhost/health
```
Expected: `healthy` response

#### Backend Health
```bash
curl http://localhost:3000/api/health
```
Expected: JSON response with status "ok"
```json
{
  "status": "ok",
  "timestamp": "...",
  "service": "GIIP Backend API",
  "database": {
    "status": "healthy",
    "message": "Database connection is healthy"
  }
}
```

#### Database Health
```bash
docker-compose exec db pg_isready -U giip_user -d giip_db
```
Expected: `giip_db accepting connections`

### 6. Service Connectivity

#### Frontend to Backend
```bash
# Access frontend
curl http://localhost
```
Expected: HTML content returned

#### Backend to Database
```bash
# Check API endpoint that requires database
curl http://localhost:3000/api/news
```
Expected: JSON response with news data

### 7. Database Initialization

#### Check Tables Created
```bash
docker-compose exec db psql -U giip_user -d giip_db -c "\dt"
```
Expected: List of tables including:
- users
- roles
- permissions
- role_permissions
- news
- events
- conferences

#### Check Seed Data
```bash
# Check roles
docker-compose exec db psql -U giip_user -d giip_db -c "SELECT * FROM roles;"

# Check permissions
docker-compose exec db psql -U giip_user -d giip_db -c "SELECT * FROM permissions;"

# Check sample news
docker-compose exec db psql -U giip_user -d giip_db -c "SELECT COUNT(*) FROM news;"
```
Expected: 
- 3 roles (admin, editor, user)
- Multiple permissions
- Sample data in news, events, conferences

### 8. Logs Verification

#### Check for Errors
```bash
# All services
docker-compose logs

# Backend logs
docker-compose logs api

# Database logs
docker-compose logs db

# Frontend logs
docker-compose logs web
```
Expected: No critical errors

### 9. Network Connectivity

#### Check Network
```bash
docker network ls | grep giip
```
Expected: giip-network exists

#### Inspect Network
```bash
docker network inspect giipc_giip-network
```
Expected: All three containers connected

### 10. Volume Persistence

#### Check Volume
```bash
docker volume ls | grep postgres
```
Expected: postgres-data volume exists

#### Test Data Persistence
```bash
# Create test data
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@giip.info","password":"Test123!"}'

# Restart services
docker-compose restart

# Verify data persists
docker-compose exec db psql -U giip_user -d giip_db -c "SELECT email FROM users WHERE email='test@giip.info';"
```
Expected: User still exists after restart

## Performance Tests

### 11. Resource Usage
```bash
docker stats --no-stream
```
Expected: Reasonable CPU and memory usage
- web: < 50MB RAM
- api: < 200MB RAM
- db: < 100MB RAM

### 12. Response Times

#### Frontend
```bash
time curl -s http://localhost > /dev/null
```
Expected: < 1 second

#### Backend API
```bash
time curl -s http://localhost:3000/api/health > /dev/null
```
Expected: < 500ms

## Security Tests

### 13. Non-Root Users

#### Check Frontend User
```bash
docker-compose exec web whoami
```
Expected: `nginx` (not root)

#### Check Backend User
```bash
docker-compose exec api whoami
```
Expected: `nodejs` (not root)

### 14. Security Headers

#### Check Nginx Headers
```bash
curl -I http://localhost
```
Expected headers:
- X-Frame-Options
- X-Content-Type-Options
- X-XSS-Protection

#### Check API Headers
```bash
curl -I http://localhost:3000/api/health
```
Expected: Security headers from Helmet.js

### 15. CORS Configuration
```bash
curl -H "Origin: http://unauthorized-domain.com" \
     -H "Access-Control-Request-Method: POST" \
     -X OPTIONS http://localhost:3000/api/auth/login -v
```
Expected: CORS headers only allow configured origins

## Cleanup Tests

### 16. Graceful Shutdown
```bash
docker-compose down
```
Expected: All services stop gracefully without errors

### 17. Data Persistence After Shutdown
```bash
# Stop services
docker-compose down

# Start again
docker-compose up -d

# Check data still exists
docker-compose exec db psql -U giip_user -d giip_db -c "SELECT COUNT(*) FROM users;"
```
Expected: Data persists

### 18. Complete Cleanup
```bash
# Remove everything including volumes
docker-compose down -v

# Verify volumes removed
docker volume ls | grep postgres
```
Expected: No postgres volumes remain

## Production Readiness

### 19. Environment Variables
- [ ] All sensitive values changed from defaults
- [ ] JWT_SECRET is strong and unique
- [ ] DB_PASSWORD is strong and unique
- [ ] NODE_ENV set to production
- [ ] FRONTEND_URL set to production domain

### 20. Documentation
- [ ] README.md updated with Docker instructions
- [ ] DOCKER_GUIDE.md available
- [ ] .env.example documented
- [ ] API documentation available

### 21. Monitoring
- [ ] Health check endpoints working
- [ ] Logs accessible via docker-compose logs
- [ ] Resource usage monitored

### 22. Backup Strategy
- [ ] Database backup procedure documented
- [ ] Volume backup tested
- [ ] Restore procedure tested

## Troubleshooting

If any checks fail, refer to:
1. `docker-compose logs [service-name]` for error messages
2. `DOCKER_GUIDE.md` for troubleshooting tips
3. Service-specific documentation in backend/docs/

## Sign-Off

- [ ] All configuration files verified
- [ ] All services start successfully
- [ ] All health checks pass
- [ ] Database initialized correctly
- [ ] Network connectivity verified
- [ ] Security measures in place
- [ ] Documentation complete
- [ ] Ready for deployment

**Verified by:** _______________
**Date:** _______________
**Environment:** [ ] Development [ ] Staging [ ] Production
