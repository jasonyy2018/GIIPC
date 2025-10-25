# News Management API Documentation

## Overview

The News Management API provides full CRUD (Create, Read, Update, Delete) operations for news articles with role-based access control (RBAC).

## Endpoints

### 1. Get All News (with Pagination)

**Endpoint:** `GET /api/news`

**Authentication:** Required (JWT token)

**Permission:** `read:news`

**Query Parameters:**
- `page` (optional): Page number, default: 1
- `limit` (optional): Items per page, default: 10, max: 100

**Response (200):**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "title": "Latest Innovation News",
      "content": "Article content...",
      "image_url": "https://example.com/image.jpg",
      "published_date": "2025-10-15",
      "created_by": 1,
      "creator_email": "admin@giip.info",
      "created_at": "2025-10-15T10:00:00Z",
      "updated_at": "2025-10-15T10:00:00Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "totalCount": 25,
    "totalPages": 3,
    "hasNextPage": true,
    "hasPreviousPage": false
  }
}
```

### 2. Get Single News Item

**Endpoint:** `GET /api/news/:id`

**Authentication:** Required (JWT token)

**Permission:** `read:news`

**Response (200):**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "title": "Latest Innovation News",
    "content": "Article content...",
    "image_url": "https://example.com/image.jpg",
    "published_date": "2025-10-15",
    "created_by": 1,
    "creator_email": "admin@giip.info",
    "created_at": "2025-10-15T10:00:00Z",
    "updated_at": "2025-10-15T10:00:00Z"
  }
}
```

**Response (404):**
```json
{
  "success": false,
  "error": {
    "code": "NOT_FOUND",
    "message": "News item not found"
  }
}
```

### 3. Create News

**Endpoint:** `POST /api/news`

**Authentication:** Required (JWT token)

**Permission:** `write:news`

**Request Body:**
```json
{
  "title": "New Article Title",
  "content": "Article content goes here...",
  "image_url": "https://example.com/image.jpg",
  "published_date": "2025-10-17"
}
```

**Validation Rules:**
- `title`: Required, max 255 characters
- `content`: Required
- `image_url`: Optional, must be valid URL, max 500 characters
- `published_date`: Required, format: YYYY-MM-DD

**Response (201):**
```json
{
  "success": true,
  "message": "News created successfully",
  "data": {
    "id": 5,
    "title": "New Article Title",
    "content": "Article content goes here...",
    "image_url": "https://example.com/image.jpg",
    "published_date": "2025-10-17",
    "created_by": 2,
    "created_at": "2025-10-17T10:00:00Z",
    "updated_at": "2025-10-17T10:00:00Z"
  }
}
```

### 4. Update News

**Endpoint:** `PUT /api/news/:id`

**Authentication:** Required (JWT token)

**Permission:** Must be the creator OR have `edit:news` permission

**Request Body (all fields optional):**
```json
{
  "title": "Updated Title",
  "content": "Updated content...",
  "image_url": "https://example.com/new-image.jpg",
  "published_date": "2025-10-18"
}
```

**Response (200):**
```json
{
  "success": true,
  "message": "News updated successfully",
  "data": {
    "id": 5,
    "title": "Updated Title",
    "content": "Updated content...",
    "image_url": "https://example.com/new-image.jpg",
    "published_date": "2025-10-18",
    "created_by": 2,
    "created_at": "2025-10-17T10:00:00Z",
    "updated_at": "2025-10-17T11:30:00Z"
  }
}
```

**Response (403) - Not authorized:**
```json
{
  "success": false,
  "error": {
    "code": "FORBIDDEN",
    "message": "You do not have permission to edit this news item"
  }
}
```

### 5. Delete News

**Endpoint:** `DELETE /api/news/:id`

**Authentication:** Required (JWT token)

**Permission:** `delete:news`

**Response (200):**
```json
{
  "success": true,
  "message": "News deleted successfully"
}
```

**Response (404):**
```json
{
  "success": false,
  "error": {
    "code": "NOT_FOUND",
    "message": "News item not found"
  }
}
```

## Permission Matrix

| Role   | read:news | write:news | edit:news | delete:news |
|--------|-----------|------------|-----------|-------------|
| admin  | ✓         | ✓          | ✓         | ✓           |
| editor | ✓         | ✓          | ✓         | ✗           |
| user   | ✓         | ✗          | ✗         | ✗           |

**Special Rules:**
- Any user who creates a news article can edit their own article (even without `edit:news` permission)
- Only users with `delete:news` permission can delete articles (typically admin only)

## Error Responses

### 400 Bad Request - Validation Error
```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Invalid input data",
    "details": [
      {
        "field": "title",
        "message": "Title is required"
      }
    ]
  }
}
```

### 401 Unauthorized - Missing/Invalid Token
```json
{
  "success": false,
  "error": {
    "code": "NO_TOKEN",
    "message": "No authorization token provided"
  }
}
```

### 403 Forbidden - Insufficient Permissions
```json
{
  "success": false,
  "error": {
    "code": "FORBIDDEN",
    "message": "Access denied. Required permission: write:news",
    "details": {
      "userRole": "user",
      "requiredPermission": "write:news"
    }
  }
}
```

## Example Usage

### Using cURL

**Login to get token:**
```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"editor@giip.info","password":"Password123!"}'
```

**Get all news:**
```bash
curl -X GET "http://localhost:3000/api/news?page=1&limit=10" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

**Create news:**
```bash
curl -X POST http://localhost:3000/api/news \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Breaking News",
    "content": "This is the content of the news article.",
    "image_url": "https://example.com/image.jpg",
    "published_date": "2025-10-17"
  }'
```

**Update news:**
```bash
curl -X PUT http://localhost:3000/api/news/5 \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Updated Breaking News"
  }'
```

**Delete news:**
```bash
curl -X DELETE http://localhost:3000/api/news/5 \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

## Implementation Details

### Files Created

1. **Validator:** `backend/src/validators/newsValidator.js`
   - Zod schemas for input validation
   - Pagination validation
   - Request/query validation middleware

2. **Repository:** `backend/src/repositories/newsRepository.js`
   - Database operations (CRUD)
   - Pagination logic
   - Creator verification

3. **Controller:** `backend/src/controllers/newsController.js`
   - Request handling
   - Business logic
   - Permission checks for updates

4. **Routes:** `backend/src/routes/newsRoutes.js`
   - Endpoint definitions
   - Middleware chain setup
   - API documentation

### Database Schema

The `news` table structure:
```sql
CREATE TABLE news (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    content TEXT NOT NULL,
    image_url VARCHAR(500),
    published_date DATE NOT NULL,
    created_by INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### Indexes for Performance
- `idx_news_published_date` - For sorting by date
- `idx_news_created_by` - For creator lookups
- `idx_news_created_at` - For sorting by creation time

## Testing

Sample test users (password: `Password123!`):
- `admin@giip.info` - Full access
- `editor@giip.info` - Can read, write, and edit
- `user@giip.info` - Read-only access

The seed data includes 4 sample news articles for testing.
