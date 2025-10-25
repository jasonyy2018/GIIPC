# Profile Management API

## Overview

The Profile Management API allows authenticated users to view and update their personal information.

## Endpoints

### Get User Profile

**GET** `/api/profile`

Get the current authenticated user's profile information.

**Authentication:** Required (JWT token)

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "email": "user@example.com",
    "full_name": "John Doe",
    "phone": "+1234567890",
    "organization": "ACME Corp",
    "position": "Software Engineer",
    "bio": "Passionate about technology and innovation",
    "avatar_url": "https://example.com/avatar.jpg",
    "country": "United States",
    "city": "New York",
    "created_at": "2024-01-01T00:00:00.000Z",
    "updated_at": "2024-01-15T10:30:00.000Z"
  }
}
```

### Update User Profile

**PUT** `/api/profile`

Update the current authenticated user's profile information.

**Authentication:** Required (JWT token)

**Request Body:**
```json
{
  "full_name": "John Doe",
  "phone": "+1234567890",
  "organization": "ACME Corp",
  "position": "Software Engineer",
  "bio": "Passionate about technology and innovation",
  "avatar_url": "https://example.com/avatar.jpg",
  "country": "United States",
  "city": "New York"
}
```

**All fields are optional.** Only include fields you want to update.

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Profile updated successfully",
  "data": {
    "id": 1,
    "email": "user@example.com",
    "full_name": "John Doe",
    "phone": "+1234567890",
    "organization": "ACME Corp",
    "position": "Software Engineer",
    "bio": "Passionate about technology and innovation",
    "avatar_url": "https://example.com/avatar.jpg",
    "country": "United States",
    "city": "New York",
    "created_at": "2024-01-01T00:00:00.000Z",
    "updated_at": "2024-01-15T10:30:00.000Z"
  }
}
```

## Field Validation

| Field | Type | Max Length | Required | Validation |
|-------|------|------------|----------|------------|
| full_name | string | 255 | No | Min 1 character |
| phone | string | 50 | No | - |
| organization | string | 255 | No | - |
| position | string | 255 | No | - |
| bio | text | - | No | - |
| avatar_url | string | 500 | No | Must be valid URL |
| country | string | 100 | No | - |
| city | string | 100 | No | - |

## Usage Examples

### Get Profile

```bash
curl -X GET http://localhost:3000/api/profile \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

### Update Profile

```bash
curl -X PUT http://localhost:3000/api/profile \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "full_name": "John Doe",
    "phone": "+1234567890",
    "organization": "ACME Corp",
    "position": "Senior Developer",
    "country": "United States",
    "city": "San Francisco"
  }'
```

### Partial Update

```bash
curl -X PUT http://localhost:3000/api/profile \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "full_name": "Jane Smith",
    "bio": "Updated bio"
  }'
```

## Error Responses

### 401 Unauthorized
```json
{
  "success": false,
  "message": "No authorization token provided"
}
```

### 400 Bad Request
```json
{
  "success": false,
  "message": "Validation failed",
  "errors": [
    {
      "path": ["body", "avatar_url"],
      "message": "Invalid url"
    }
  ]
}
```

### 404 Not Found
```json
{
  "success": false,
  "message": "User profile not found"
}
```

## Frontend Integration

Access the profile management page at: `http://localhost/profile.html`

Users must be logged in to access this page. The page will automatically redirect to the login page if no valid JWT token is found.

## Database Migration

To add profile fields to existing database, run:

```bash
psql -U your_user -d your_database -f backend/migrations/002_add_user_profile.sql
```

Or if using Docker:

```bash
docker-compose exec db psql -U giip_user -d giip_db -f /docker-entrypoint-initdb.d/002_add_user_profile.sql
```
