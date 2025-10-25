# Profile Management Architecture

## System Flow

```
┌─────────────────────────────────────────────────────────────────┐
│                         USER INTERFACE                          │
│                     (frontend/profile.html)                     │
│                                                                 │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐        │
│  │  Load Profile│  │ Update Form  │  │ Save Changes │        │
│  └──────┬───────┘  └──────┬───────┘  └──────┬───────┘        │
└─────────┼──────────────────┼──────────────────┼───────────────┘
          │                  │                  │
          │ GET /api/profile │                  │ PUT /api/profile
          │                  │                  │
┌─────────▼──────────────────▼──────────────────▼───────────────┐
│                      API ROUTES LAYER                          │
│                 (src/routes/profileRoutes.js)                  │
│                                                                 │
│  ┌──────────────────────────────────────────────────────────┐ │
│  │  authGuard Middleware - Verify JWT Token                 │ │
│  └──────────────────────────────────────────────────────────┘ │
│  ┌──────────────────────────────────────────────────────────┐ │
│  │  validateRequest - Validate Input (Zod)                  │ │
│  └──────────────────────────────────────────────────────────┘ │
└─────────┬──────────────────────────────────────────────────────┘
          │
          │
┌─────────▼──────────────────────────────────────────────────────┐
│                    CONTROLLER LAYER                             │
│               (src/controllers/profileController.js)            │
│                                                                 │
│  ┌──────────────────┐         ┌──────────────────┐            │
│  │ getUserProfile() │         │ updateUserProfile│            │
│  └────────┬─────────┘         └────────┬─────────┘            │
└───────────┼──────────────────────────────┼─────────────────────┘
            │                              │
            │                              │
┌───────────▼──────────────────────────────▼─────────────────────┐
│                   REPOSITORY LAYER                              │
│              (src/repositories/userRepository.js)               │
│                                                                 │
│  ┌──────────────────┐         ┌──────────────────┐            │
│  │   getProfile()   │         │  updateProfile() │            │
│  │                  │         │                  │            │
│  │  SELECT fields   │         │  UPDATE fields   │            │
│  │  FROM users      │         │  SET ...         │            │
│  │  WHERE id = $1   │         │  WHERE id = $1   │            │
│  └────────┬─────────┘         └────────┬─────────┘            │
└───────────┼──────────────────────────────┼─────────────────────┘
            │                              │
            │                              │
┌───────────▼──────────────────────────────▼─────────────────────┐
│                      DATABASE LAYER                             │
│                    PostgreSQL Database                          │
│                                                                 │
│  ┌──────────────────────────────────────────────────────────┐ │
│  │                      users TABLE                          │ │
│  ├──────────────────────────────────────────────────────────┤ │
│  │ id (PK)          │ email (UNIQUE)    │ password          │ │
│  │ role_id (FK)     │ full_name         │ phone             │ │
│  │ organization     │ position          │ bio               │ │
│  │ avatar_url       │ country           │ city              │ │
│  │ created_at       │ updated_at                            │ │
│  └──────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────────┘
```

## Component Responsibilities

### Frontend (profile.html)
- Display profile form
- Load existing profile data
- Handle form submission
- Show success/error messages
- Manage JWT token
- Redirect if not authenticated

### Routes (profileRoutes.js)
- Define API endpoints
- Apply authentication middleware
- Apply validation middleware
- Route to appropriate controller

### Middleware
- **authGuard**: Verify JWT token, extract user info
- **validateRequest**: Validate input using Zod schema

### Controller (profileController.js)
- Handle HTTP requests/responses
- Call repository methods
- Format response data
- Handle errors

### Repository (userRepository.js)
- Execute database queries
- Build dynamic SQL queries
- Return formatted data
- Handle database errors

### Database (PostgreSQL)
- Store user profile data
- Enforce constraints
- Maintain indexes
- Track timestamps

## Data Flow Examples

### Get Profile Flow
```
1. User opens profile.html
2. JavaScript sends GET /api/profile with JWT token
3. authGuard verifies token, extracts userId
4. profileController.getUserProfile() called
5. userRepository.getProfile(userId) queries database
6. Database returns user record
7. Data flows back through layers
8. Frontend displays profile data in form
```

### Update Profile Flow
```
1. User fills form and clicks "Save Changes"
2. JavaScript sends PUT /api/profile with data + JWT token
3. authGuard verifies token
4. validateRequest checks data format
5. profileController.updateUserProfile() called
6. userRepository.updateProfile(userId, data) updates database
7. Database returns updated record
8. Success message shown to user
```

## Security Layers

```
┌─────────────────────────────────────────┐
│  1. HTTPS (Transport Layer Security)   │
├─────────────────────────────────────────┤
│  2. CORS (Cross-Origin Protection)      │
├─────────────────────────────────────────┤
│  3. Rate Limiting (DDoS Protection)     │
├─────────────────────────────────────────┤
│  4. JWT Authentication (Identity)       │
├─────────────────────────────────────────┤
│  5. Input Validation (Zod Schema)       │
├─────────────────────────────────────────┤
│  6. SQL Injection Prevention ($1, $2)   │
├─────────────────────────────────────────┤
│  7. XSS Protection (Helmet.js)          │
└─────────────────────────────────────────┘
```

## File Structure

```
GIIPC/
├── backend/
│   ├── migrations/
│   │   └── 002_add_user_profile.sql          # Database migration
│   ├── src/
│   │   ├── controllers/
│   │   │   └── profileController.js          # Request handlers
│   │   ├── repositories/
│   │   │   └── userRepository.js             # Database queries
│   │   ├── routes/
│   │   │   └── profileRoutes.js              # API endpoints
│   │   ├── validators/
│   │   │   └── profileValidator.js           # Input validation
│   │   └── server.js                         # Route registration
│   ├── docs/
│   │   └── PROFILE_API.md                    # API documentation
│   ├── scripts/
│   │   ├── run-profile-migration.sh          # Linux/Mac script
│   │   └── run-profile-migration.bat         # Windows script
│   └── __tests__/
│       └── integration/
│           └── profile.integration.test.js   # Tests
├── frontend/
│   └── profile.html                          # User interface
├── PROFILE_SETUP.md                          # Setup guide
├── PROFILE_QUICK_REFERENCE.md                # Quick reference
├── PROFILE_FEATURE_SUMMARY.md                # Feature summary
└── PROFILE_ARCHITECTURE.md                   # This file
```

## Technology Stack

| Layer | Technology | Purpose |
|-------|-----------|---------|
| Frontend | HTML5, Tailwind CSS, Vanilla JS | User interface |
| API | Express.js | HTTP server & routing |
| Validation | Zod | Input validation |
| Authentication | JWT | Token-based auth |
| Database | PostgreSQL 16 | Data persistence |
| ORM | Native pg driver | Database queries |
| Testing | Jest, Supertest | Integration tests |
| Deployment | Docker, Docker Compose | Containerization |

## API Contract

### GET /api/profile

**Request:**
```http
GET /api/profile HTTP/1.1
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "email": "user@example.com",
    "full_name": "John Doe",
    "phone": "+1234567890",
    "organization": "ACME Corp",
    "position": "Developer",
    "bio": "Software developer",
    "avatar_url": "https://example.com/avatar.jpg",
    "country": "USA",
    "city": "New York",
    "created_at": "2024-01-01T00:00:00.000Z",
    "updated_at": "2024-01-15T10:30:00.000Z"
  }
}
```

### PUT /api/profile

**Request:**
```http
PUT /api/profile HTTP/1.1
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
Content-Type: application/json

{
  "full_name": "John Doe",
  "organization": "ACME Corp"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Profile updated successfully",
  "data": {
    "id": 1,
    "email": "user@example.com",
    "full_name": "John Doe",
    "organization": "ACME Corp",
    ...
  }
}
```

## Database Schema

```sql
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    role_id INTEGER NOT NULL REFERENCES roles(id),
    
    -- Profile fields (NEW)
    full_name VARCHAR(255),
    phone VARCHAR(50),
    organization VARCHAR(255),
    position VARCHAR(255),
    bio TEXT,
    avatar_url VARCHAR(500),
    country VARCHAR(100),
    city VARCHAR(100),
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Indexes
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_role_id ON users(role_id);
CREATE INDEX idx_users_full_name ON users(full_name);
```

## Error Handling

```
┌─────────────────────────────────────────┐
│         Error Occurs in Layer           │
└───────────────┬─────────────────────────┘
                │
                ▼
┌─────────────────────────────────────────┐
│    Try-Catch in Controller/Repository   │
└───────────────┬─────────────────────────┘
                │
                ▼
┌─────────────────────────────────────────┐
│      next(error) to Error Handler       │
└───────────────┬─────────────────────────┘
                │
                ▼
┌─────────────────────────────────────────┐
│   Global Error Handler (errorHandler)   │
│   - Logs error                          │
│   - Formats response                    │
│   - Returns appropriate status code     │
└───────────────┬─────────────────────────┘
                │
                ▼
┌─────────────────────────────────────────┐
│      JSON Error Response to Client      │
│   { success: false, message: "..." }    │
└─────────────────────────────────────────┘
```
