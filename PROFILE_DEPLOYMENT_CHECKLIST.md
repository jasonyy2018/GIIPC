# Profile Management - Deployment Checklist

## Pre-Deployment Checklist

### ✅ Code Review
- [ ] All new files created successfully
- [ ] No syntax errors in code
- [ ] Validation logic is correct
- [ ] Security measures in place
- [ ] Error handling implemented

### ✅ Database
- [ ] Migration file exists: `backend/migrations/002_add_user_profile.sql`
- [ ] Schema updated: `backend/schema.sql`
- [ ] Indexes created for performance
- [ ] Field constraints are appropriate

### ✅ Backend
- [ ] Profile routes registered in `server.js`
- [ ] Controller methods implemented
- [ ] Repository methods added
- [ ] Validator created with Zod
- [ ] Authentication middleware applied

### ✅ Frontend
- [ ] Profile page created: `frontend/profile.html`
- [ ] Form fields match backend
- [ ] JWT token handling works
- [ ] Error messages display correctly
- [ ] Responsive design implemented

### ✅ Documentation
- [ ] API documentation complete
- [ ] Setup guide written
- [ ] Quick reference created
- [ ] Architecture documented
- [ ] Tests documented

## Deployment Steps

### Step 1: Backup Database
```bash
# Create backup before migration
docker-compose exec db pg_dump -U giip_user giip_db > backup_before_profile.sql
```

### Step 2: Run Migration

**Option A: Using Script (Recommended)**
```bash
# Windows
backend\scripts\run-profile-migration.bat

# Linux/Mac
chmod +x backend/scripts/run-profile-migration.sh
./backend/scripts/run-profile-migration.sh
```

**Option B: Manual**
```bash
docker cp backend/migrations/002_add_user_profile.sql giip-db:/tmp/
docker-compose exec db psql -U giip_user -d giip_db -f /tmp/002_add_user_profile.sql
```

### Step 3: Restart Services
```bash
docker-compose restart api
# or
docker-compose restart
```

### Step 4: Verify Deployment
```bash
# Check API health
curl http://localhost:3000/api/health

# Check profile endpoint
curl http://localhost:3000/api/profile \
  -H "Authorization: Bearer YOUR_TOKEN"
```

## Post-Deployment Testing

### ✅ Functional Tests

#### Test 1: Access Profile Page
- [ ] Navigate to `http://localhost/profile.html`
- [ ] Page loads without errors
- [ ] Form displays correctly
- [ ] All fields are visible

#### Test 2: Load Profile Data
- [ ] Login with test account
- [ ] Profile data loads automatically
- [ ] Email field is read-only
- [ ] No console errors

#### Test 3: Update Profile
- [ ] Fill in profile fields
- [ ] Click "Save Changes"
- [ ] Success message appears
- [ ] Data persists after refresh

#### Test 4: Validation
- [ ] Try invalid avatar URL
- [ ] Validation error appears
- [ ] Form doesn't submit
- [ ] Error message is clear

#### Test 5: Authentication
- [ ] Logout and try to access profile page
- [ ] Redirects to login
- [ ] After login, can access profile
- [ ] Token expiry handled correctly

### ✅ API Tests

```bash
# Test 1: Get profile (should work)
curl http://localhost:3000/api/profile \
  -H "Authorization: Bearer VALID_TOKEN"

# Test 2: Get profile without auth (should fail)
curl http://localhost:3000/api/profile

# Test 3: Update profile
curl -X PUT http://localhost:3000/api/profile \
  -H "Authorization: Bearer VALID_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"full_name":"Test User"}'

# Test 4: Invalid data (should fail)
curl -X PUT http://localhost:3000/api/profile \
  -H "Authorization: Bearer VALID_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"avatar_url":"not-a-url"}'
```

### ✅ Integration Tests

```bash
cd backend
npm test -- profile.integration.test.js
```

Expected output:
```
PASS  __tests__/integration/profile.integration.test.js
  Profile API Integration Tests
    GET /api/profile
      ✓ should get user profile with authentication
      ✓ should fail without authentication
    PUT /api/profile
      ✓ should update profile successfully
      ✓ should update partial profile
      ✓ should fail with invalid avatar URL
      ✓ should fail without authentication

Test Suites: 1 passed, 1 total
Tests:       6 passed, 6 total
```

### ✅ Database Verification

```bash
# Connect to database
docker-compose exec db psql -U giip_user -d giip_db

# Check if columns exist
\d users

# Should show new columns:
# - full_name
# - phone
# - organization
# - position
# - bio
# - avatar_url
# - country
# - city

# Check indexes
\di

# Should include:
# - idx_users_full_name

# Exit
\q
```

### ✅ Performance Tests

```bash
# Test response time
time curl http://localhost:3000/api/profile \
  -H "Authorization: Bearer YOUR_TOKEN"

# Should respond in < 100ms
```

### ✅ Security Tests

- [ ] Cannot access profile without authentication
- [ ] Cannot access other users' profiles
- [ ] SQL injection attempts fail
- [ ] XSS attempts are sanitized
- [ ] Rate limiting works
- [ ] CORS headers present

## Rollback Plan

If something goes wrong:

### Step 1: Restore Database
```bash
docker-compose exec -T db psql -U giip_user -d giip_db < backup_before_profile.sql
```

### Step 2: Revert Code Changes
```bash
git revert HEAD
# or
git reset --hard PREVIOUS_COMMIT
```

### Step 3: Restart Services
```bash
docker-compose restart
```

## Monitoring

### Check Logs
```bash
# API logs
docker-compose logs -f api

# Database logs
docker-compose logs -f db

# All logs
docker-compose logs -f
```

### Monitor Errors
Watch for:
- Database connection errors
- Authentication failures
- Validation errors
- 500 Internal Server Errors

## Success Criteria

✅ All tests pass  
✅ No errors in logs  
✅ Profile page loads correctly  
✅ Users can update their profiles  
✅ Data persists correctly  
✅ Authentication works  
✅ Validation works  
✅ Performance is acceptable  

## Troubleshooting

### Issue: Migration fails with "column already exists"
**Solution:** Columns already added, skip migration or modify script to check existence first

### Issue: Profile page shows 404
**Solution:** Ensure `frontend/profile.html` is in correct location and web server is serving it

### Issue: API returns 401 Unauthorized
**Solution:** Check JWT token is valid and not expired, verify Authorization header format

### Issue: Cannot update profile
**Solution:** Check validation errors, verify all required fields, check database connection

### Issue: Profile data doesn't persist
**Solution:** Check database logs, verify UPDATE query is executing, check transaction handling

## Post-Deployment Tasks

- [ ] Update main README.md with profile feature
- [ ] Notify team about new feature
- [ ] Update user documentation
- [ ] Add profile link to navigation menu
- [ ] Monitor usage and errors
- [ ] Gather user feedback

## Documentation Links

- [Setup Guide](PROFILE_SETUP.md)
- [Quick Reference](PROFILE_QUICK_REFERENCE.md)
- [API Documentation](backend/docs/PROFILE_API.md)
- [Architecture](PROFILE_ARCHITECTURE.md)
- [Feature Summary](PROFILE_FEATURE_SUMMARY.md)

---

**Deployment Date:** _____________  
**Deployed By:** _____________  
**Status:** ⬜ Pending | ⬜ In Progress | ⬜ Complete | ⬜ Rolled Back
