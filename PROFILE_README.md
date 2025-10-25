# 👤 Profile Management Feature

Complete personal information management system for GIIP platform users.

## 🎯 Overview

This feature allows authenticated users to view and update their personal information through a dedicated profile management interface. Users can add details like their full name, contact information, organization, position, biography, and location.

## ✨ Features

- ✅ **View Profile** - Display current user information
- ✅ **Update Profile** - Edit personal details
- ✅ **Secure Access** - JWT authentication required
- ✅ **Input Validation** - Zod schema validation
- ✅ **Responsive Design** - Works on all devices
- ✅ **Real-time Feedback** - Success/error messages
- ✅ **Partial Updates** - Update only specific fields

## 📋 Profile Fields

| Field | Description | Required |
|-------|-------------|----------|
| Email | User email address | ✅ (read-only) |
| Full Name | Complete name | ❌ |
| Phone | Contact number | ❌ |
| Organization | Company/institution | ❌ |
| Position | Job title | ❌ |
| Bio | Personal description | ❌ |
| Avatar URL | Profile picture link | ❌ |
| Country | Country of residence | ❌ |
| City | City of residence | ❌ |

## 🚀 Quick Start

### 1. Run Migration

**Windows:**
```cmd
backend\scripts\run-profile-migration.bat
```

**Linux/Mac:**
```bash
chmod +x backend/scripts/run-profile-migration.sh
./backend/scripts/run-profile-migration.sh
```

### 2. Access Profile Page

Navigate to: **http://localhost/profile.html**

### 3. Test API

```bash
# Login
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@giip.com","password":"password"}'

# Get profile
curl http://localhost:3000/api/profile \
  -H "Authorization: Bearer YOUR_TOKEN"

# Update profile
curl -X PUT http://localhost:3000/api/profile \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"full_name":"John Doe","organization":"GIIP"}'
```

## 📚 Documentation

| Document | Description |
|----------|-------------|
| [Quick Reference](PROFILE_QUICK_REFERENCE.md) | Fast lookup guide |
| [Setup Guide](PROFILE_SETUP.md) | Detailed installation |
| [API Documentation](backend/docs/PROFILE_API.md) | Complete API reference |
| [Architecture](PROFILE_ARCHITECTURE.md) | System design & flow |
| [Feature Summary](PROFILE_FEATURE_SUMMARY.md) | Implementation details |
| [Deployment Checklist](PROFILE_DEPLOYMENT_CHECKLIST.md) | Deployment guide |

## 🔌 API Endpoints

### GET /api/profile
Get current user's profile information.

**Authentication:** Required  
**Response:** User profile object

### PUT /api/profile
Update current user's profile information.

**Authentication:** Required  
**Body:** Profile fields to update (all optional)  
**Response:** Updated profile object

## 🏗️ Architecture

```
Frontend (profile.html)
    ↓
API Routes (profileRoutes.js)
    ↓
Middleware (authGuard, validateRequest)
    ↓
Controller (profileController.js)
    ↓
Repository (userRepository.js)
    ↓
Database (PostgreSQL)
```

## 🔒 Security

- ✅ JWT authentication required
- ✅ Users can only access their own profile
- ✅ Input validation with Zod
- ✅ SQL injection prevention
- ✅ XSS protection
- ✅ Rate limiting
- ✅ CORS enabled

## 📁 Files Created

### Backend (7 files)
```
backend/
├── migrations/002_add_user_profile.sql
├── src/
│   ├── controllers/profileController.js
│   ├── routes/profileRoutes.js
│   └── validators/profileValidator.js
├── docs/PROFILE_API.md
├── scripts/
│   ├── run-profile-migration.sh
│   └── run-profile-migration.bat
└── __tests__/integration/profile.integration.test.js
```

### Frontend (1 file)
```
frontend/profile.html
```

### Documentation (6 files)
```
PROFILE_README.md (this file)
PROFILE_QUICK_REFERENCE.md
PROFILE_SETUP.md
PROFILE_FEATURE_SUMMARY.md
PROFILE_ARCHITECTURE.md
PROFILE_DEPLOYMENT_CHECKLIST.md
```

### Modified (3 files)
```
backend/src/repositories/userRepository.js
backend/src/server.js
backend/schema.sql
```

## 🧪 Testing

### Run Integration Tests
```bash
cd backend
npm test -- profile.integration.test.js
```

### Manual Testing
1. Login to application
2. Navigate to profile page
3. Fill in profile information
4. Save changes
5. Refresh page to verify persistence

## 💡 Usage Examples

### Frontend Usage
```javascript
// Load profile
const response = await fetch('/api/profile', {
  headers: { 'Authorization': `Bearer ${token}` }
});
const profile = await response.json();

// Update profile
await fetch('/api/profile', {
  method: 'PUT',
  headers: {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    full_name: 'John Doe',
    organization: 'ACME Corp'
  })
});
```

### Backend Usage
```javascript
// In your controller
import { getProfile, updateProfile } from '../repositories/userRepository.js';

// Get profile
const profile = await getProfile(userId);

// Update profile
const updated = await updateProfile(userId, {
  full_name: 'John Doe',
  phone: '+1234567890'
});
```

## 🎨 UI Preview

The profile page includes:
- Clean, modern design with Tailwind CSS
- Responsive layout (mobile-friendly)
- Form validation feedback
- Success/error alerts
- Logout button
- Auto-populated fields

## 🔧 Configuration

No additional configuration needed. The feature uses existing:
- Database connection settings
- JWT secret
- CORS configuration
- Rate limiting settings

## 📊 Database Schema

```sql
ALTER TABLE users ADD COLUMN
  full_name VARCHAR(255),
  phone VARCHAR(50),
  organization VARCHAR(255),
  position VARCHAR(255),
  bio TEXT,
  avatar_url VARCHAR(500),
  country VARCHAR(100),
  city VARCHAR(100);
```

## 🐛 Troubleshooting

### Profile page redirects to login
- Check JWT token in localStorage
- Verify token hasn't expired

### Cannot update profile
- Verify authentication token
- Check validation errors
- Review backend logs

### Migration fails
- Ensure database is running
- Check if columns already exist
- Verify database permissions

## 🚦 Status

✅ **Complete and Ready for Production**

- All code implemented
- Tests passing
- Documentation complete
- Security measures in place
- Performance optimized

## 📞 Support

For issues or questions:
1. Check [Troubleshooting](#-troubleshooting) section
2. Review [Documentation](#-documentation)
3. Check backend logs: `docker-compose logs api`
4. Review database logs: `docker-compose logs db`

## 🎯 Next Steps

Optional enhancements to consider:
- Password change functionality
- Profile picture upload
- Email verification
- Two-factor authentication
- Public profile view
- Activity history

## 📝 License

Same as main project (MIT)

---

**Version:** 1.0.0  
**Last Updated:** 2024  
**Status:** ✅ Production Ready
