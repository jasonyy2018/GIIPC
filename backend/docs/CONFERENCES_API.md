# Conferences API Documentation

## Overview

The Conferences API provides endpoints for managing conference information in the GIIP system. All endpoints require authentication and appropriate permissions based on the RBAC system.

## Base URL

```
/api/conferences
```

## Authentication

All endpoints require a valid JWT token in the Authorization header:

```
Authorization: Bearer <your_jwt_token>
```

## Endpoints

### 1. Get All Conferences

Retrieve a paginated list of all conferences.

**Endpoint:** `GET /api/conferences`

**Permission Required:** `read:conferences`

**Query Parameters:**

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| page | integer | 1 | Page number (must be > 0) |
| limit | integer | 10 | Items per page (1-100) |

**Success Response (200 OK):**

```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "title": "Global Innovation Summit 2025",
      "description": "A premier conference bringing together innovators...",
      "date_range": "Oct 15-17, 2025",
      "location": "San Francisco, CA",
      "summary": "Key topics include AI, blockchain, and sustainability",
      "created_by": 2,
      "creator_email": "editor@example.com",
      "created_at": "2025-10-01T10:00:00.000Z",
      "updated_at": "2025-10-01T10:00:00.000Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "totalCount": 5,
    "totalPages": 1,
    "hasNextPage": false,
    "hasPreviousPage": false
  }
}
```

**Error Responses:**

- `401 Unauthorized`: Missing or invalid JWT token
- `403 Forbidden`: User lacks `read:conferences` permission
- `400 Bad Request`: Invalid query parameters

---

### 2. Get Conference by ID

Retrieve a single conference by its ID.

**Endpoint:** `GET /api/conferences/:id`

**Permission Required:** `read:conferences`

**URL Parameters:**

| Parameter | Type | Description |
|-----------|------|-------------|
| id | integer | Conference ID |

**Success Response (200 OK):**

```json
{
  "success": true,
  "data": {
    "id": 1,
    "title": "Global Innovation Summit 2025",
    "description": "A premier conference bringing together innovators...",
    "date_range": "Oct 15-17, 2025",
    "location": "San Francisco, CA",
    "summary": "Key topics include AI, blockchain, and sustainability",
    "created_by": 2,
    "creator_email": "editor@example.com",
    "created_at": "2025-10-01T10:00:00.000Z",
    "updated_at": "2025-10-01T10:00:00.000Z"
  }
}
```

**Error Responses:**

- `400 Bad Request`: Invalid conference ID format
- `401 Unauthorized`: Missing or invalid JWT token
- `403 Forbidden`: User lacks `read:conferences` permission
- `404 Not Found`: Conference does not exist

---

### 3. Create Conference

Create a new conference.

**Endpoint:** `POST /api/conferences`

**Permission Required:** `write:conferences`

**Request Body:**

```json
{
  "title": "Global Innovation Summit 2025",
  "description": "A premier conference bringing together innovators from around the world",
  "date_range": "Oct 15-17, 2025",
  "location": "San Francisco, CA",
  "summary": "Key topics include AI, blockchain, and sustainability"
}
```

**Field Validation:**

| Field | Type | Required | Constraints |
|-------|------|----------|-------------|
| title | string | Yes | 1-255 characters |
| description | string | Yes | Min 1 character |
| date_range | string | Yes | 1-100 characters |
| location | string | Yes | 1-255 characters |
| summary | string | No | Any length |

**Success Response (201 Created):**

```json
{
  "success": true,
  "message": "Conference created successfully",
  "data": {
    "id": 2,
    "title": "Global Innovation Summit 2025",
    "description": "A premier conference bringing together innovators from around the world",
    "date_range": "Oct 15-17, 2025",
    "location": "San Francisco, CA",
    "summary": "Key topics include AI, blockchain, and sustainability",
    "created_by": 2,
    "created_at": "2025-10-17T10:00:00.000Z",
    "updated_at": "2025-10-17T10:00:00.000Z"
  }
}
```

**Error Responses:**

- `400 Bad Request`: Validation errors in request body
- `401 Unauthorized`: Missing or invalid JWT token
- `403 Forbidden`: User lacks `write:conferences` permission

---

### 4. Update Conference

Update an existing conference. User must be the creator or have `edit:conferences` permission.

**Endpoint:** `PUT /api/conferences/:id`

**Permission Required:** Ownership OR `edit:conferences`

**URL Parameters:**

| Parameter | Type | Description |
|-----------|------|-------------|
| id | integer | Conference ID |

**Request Body (all fields optional):**

```json
{
  "title": "Updated Conference Title",
  "description": "Updated description",
  "date_range": "Oct 20-22, 2025",
  "location": "New York, NY",
  "summary": "Updated summary"
}
```

**Field Validation:**

| Field | Type | Required | Constraints |
|-------|------|----------|-------------|
| title | string | No | 1-255 characters |
| description | string | No | Min 1 character |
| date_range | string | No | 1-100 characters |
| location | string | No | 1-255 characters |
| summary | string | No | Any length |

**Note:** At least one field must be provided for update.

**Success Response (200 OK):**

```json
{
  "success": true,
  "message": "Conference updated successfully",
  "data": {
    "id": 2,
    "title": "Updated Conference Title",
    "description": "Updated description",
    "date_range": "Oct 20-22, 2025",
    "location": "New York, NY",
    "summary": "Updated summary",
    "created_by": 2,
    "created_at": "2025-10-17T10:00:00.000Z",
    "updated_at": "2025-10-17T12:00:00.000Z"
  }
}
```

**Error Responses:**

- `400 Bad Request`: Invalid conference ID or validation errors
- `401 Unauthorized`: Missing or invalid JWT token
- `403 Forbidden`: User is not the creator and lacks `edit:conferences` permission
- `404 Not Found`: Conference does not exist

---

### 5. Delete Conference

Delete a conference.

**Endpoint:** `DELETE /api/conferences/:id`

**Permission Required:** `delete:conferences`

**URL Parameters:**

| Parameter | Type | Description |
|-----------|------|-------------|
| id | integer | Conference ID |

**Success Response (200 OK):**

```json
{
  "success": true,
  "message": "Conference deleted successfully"
}
```

**Error Responses:**

- `400 Bad Request`: Invalid conference ID format
- `401 Unauthorized`: Missing or invalid JWT token
- `403 Forbidden`: User lacks `delete:conferences` permission
- `404 Not Found`: Conference does not exist

---

## Permission Matrix

| Action | Endpoint | Required Permission | Notes |
|--------|----------|-------------------|-------|
| List conferences | GET /api/conferences | read:conferences | All authenticated users with permission |
| View conference | GET /api/conferences/:id | read:conferences | All authenticated users with permission |
| Create conference | POST /api/conferences | write:conferences | Editors and Admins |
| Update conference | PUT /api/conferences/:id | Ownership OR edit:conferences | Creator or Editors/Admins |
| Delete conference | DELETE /api/conferences/:id | delete:conferences | Admins only |

## Role Permissions

By default, the following roles have these permissions:

- **User**: `read:conferences`
- **Editor**: `read:conferences`, `write:conferences`, `edit:conferences`
- **Admin**: All conference permissions including `delete:conferences`

## Example Usage

### Create a Conference (Editor/Admin)

```bash
curl -X POST http://localhost:3000/api/conferences \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "title": "Tech Innovation Forum 2025",
    "description": "Annual forum discussing latest tech trends",
    "date_range": "Nov 10-12, 2025",
    "location": "Boston, MA",
    "summary": "Focus on emerging technologies and innovation"
  }'
```

### Get All Conferences

```bash
curl -X GET "http://localhost:3000/api/conferences?page=1&limit=10" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

### Update a Conference (Creator or Editor/Admin)

```bash
curl -X PUT http://localhost:3000/api/conferences/1 \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "location": "Virtual Event"
  }'
```

### Delete a Conference (Admin only)

```bash
curl -X DELETE http://localhost:3000/api/conferences/1 \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

## Error Response Format

All error responses follow this format:

```json
{
  "success": false,
  "error": {
    "code": "ERROR_CODE",
    "message": "Human-readable error message",
    "details": [
      {
        "field": "field_name",
        "message": "Field-specific error message"
      }
    ]
  }
}
```

## Notes

- All timestamps are in ISO 8601 format (UTC)
- The `created_by` field is automatically set to the authenticated user's ID
- The `updated_at` timestamp is automatically updated on every modification
- Pagination is recommended for listing conferences to improve performance
- The `summary` field is optional and can be null
