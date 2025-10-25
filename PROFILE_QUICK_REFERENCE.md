# Profile Management - Quick Reference

## 🚀 Setup (Choose One)

### Option 1: Automated Script

**Windows:**
```cmd
cd backend\scripts
run-profile-migration.bat
```

**Linux/Mac:**
```bash
chmod +x backend/scripts/run-profile-migration.sh
./backend/scripts/run-profile-migration.sh
```

### Option 2: Manual

```bash
docker cp backend/migrations/002_add_user_profile.sql giip-db:/tmp/
docker-compose exec db psql -U giip_user -d giip_db -f /tmp/002_add_user_profile.sql
docker-compose restart api
```

## 📱 Access

**Profile Page:** http://localhost/profile.html

## 🔌 API Endpoints

### Get Profile
```bash
GET /api/profile
Authorization: Bearer {token}
```

### Update Profile
```bash
PUT /api/profile
Authorization: Bearer {token}
Content-Type: application/json

{
  "full_name": "John Doe",
  "phone": "+1234567890",
  "organization": "ACME Corp",
  "position": "Developer",
  "country": "USA",
  "city": "New York",
  "bio": "Software developer",
  "avatar_url": "https://example.com/avatar.jpg"
}
```

## 🧪 Quick Test

```bash
# 1. Login
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@giip.com","password":"password"}'

# Copy the token from response

# 2. Get profile
curl http://localhost:3000/api/profile \
  -H "Authorization: Bearer YOUR_TOKEN"

# 3. Update profile
curl -X PUT http://localhost:3000/api/profile \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"full_name":"Admin User","organization":"GIIP"}'
```

## 📋 Profile Fields

✅ full_name - Full name  
✅ phone - Phone number  
✅ organization - Company/organization  
✅ position - Job title  
✅ bio - Biography  
✅ avatar_url - Profile picture URL  
✅ country - Country  
✅ city - City  

**All fields are optional**

## 🔒 Security

- JWT authentication required
- Users can only edit their own profile
- Email cannot be changed
- Input validation on all fields

## 📚 Full Documentation

- **Setup Guide:** [PROFILE_SETUP.md](PROFILE_SETUP.md)
- **API Docs:** [backend/docs/PROFILE_API.md](backend/docs/PROFILE_API.md)
- **Feature Summary:** [PROFILE_FEATURE_SUMMARY.md](PROFILE_FEATURE_SUMMARY.md)
