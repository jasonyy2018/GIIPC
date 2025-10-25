# Profile Management Setup Guide

## Overview

This guide will help you set up the personal information management feature for your GIIP application.

## Features

✅ View personal profile information  
✅ Update profile fields (name, phone, organization, position, bio, location, avatar)  
✅ Secure authentication required  
✅ Responsive design  
✅ Input validation  

## Setup Instructions

### For New Installations

If you're setting up the application from scratch, the profile fields are already included in `schema.sql`. Just run:

```bash
docker-compose up -d
```

### For Existing Installations

If you already have a running database, you need to run the migration:

#### Option 1: Using Docker

```bash
# Copy migration file to container
docker cp backend/migrations/002_add_user_profile.sql giip-db:/tmp/

# Run migration
docker-compose exec db psql -U giip_user -d giip_db -f /tmp/002_add_user_profile.sql
```

#### Option 2: Direct PostgreSQL

```bash
psql -U giip_user -d giip_db -f backend/migrations/002_add_user_profile.sql
```

### Restart Backend

After running the migration, restart the backend service:

```bash
docker-compose restart api
```

## Usage

### Access Profile Page

1. Login to the application at `http://localhost`
2. Navigate to `http://localhost/profile.html`
3. Fill in your personal information
4. Click "Save Changes"

### API Endpoints

**Get Profile:**
```bash
GET /api/profile
Authorization: Bearer YOUR_TOKEN
```

**Update Profile:**
```bash
PUT /api/profile
Authorization: Bearer YOUR_TOKEN
Content-Type: application/json

{
  "full_name": "John Doe",
  "phone": "+1234567890",
  "organization": "ACME Corp",
  "position": "Developer",
  "country": "USA",
  "city": "New York",
  "bio": "Software developer"
}
```

## Profile Fields

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| email | string | Yes (read-only) | User email address |
| full_name | string | No | Full name |
| phone | string | No | Phone number |
| organization | string | No | Company/organization |
| position | string | No | Job title |
| bio | text | No | Biography |
| avatar_url | string | No | Profile picture URL |
| country | string | No | Country |
| city | string | No | City |

## Testing

### Test with cURL

```bash
# 1. Login
TOKEN=$(curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@giip.com","password":"password"}' \
  | jq -r '.token')

# 2. Get profile
curl http://localhost:3000/api/profile \
  -H "Authorization: Bearer $TOKEN"

# 3. Update profile
curl -X PUT http://localhost:3000/api/profile \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "full_name": "Admin User",
    "organization": "GIIP",
    "position": "Administrator"
  }'
```

## Integration with Existing Pages

To add a profile link to your navigation menu, add this to your HTML:

```html
<a href="profile.html" class="nav-link">
  <i class="fas fa-user"></i> My Profile
</a>
```

## Security Notes

- All profile endpoints require authentication
- Users can only view and edit their own profile
- Email cannot be changed through profile API
- Input validation prevents malicious data
- Avatar URLs must be valid URLs

## Troubleshooting

### Migration fails
- Ensure database is running: `docker-compose ps`
- Check database logs: `docker-compose logs db`

### Profile page redirects to login
- Check if JWT token is stored in localStorage
- Verify token is not expired (1 hour validity)

### Cannot update profile
- Verify authentication token is valid
- Check backend logs: `docker-compose logs api`
- Ensure all field values meet validation requirements

## Documentation

- **API Documentation:** [backend/docs/PROFILE_API.md](backend/docs/PROFILE_API.md)
- **Main README:** [README.md](README.md)

## Next Steps

Consider adding:
- Password change functionality
- Profile picture upload
- Email verification
- Two-factor authentication
- Activity log
