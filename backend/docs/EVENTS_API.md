# Events API Documentation

## Overview

The Events API provides endpoints for managing events in the GIIP system. All endpoints require authentication via JWT token and appropriate permissions based on the RBAC system.

## Base URL

```
/api/events
```

## Authentication

All endpoints require a valid JWT token in the Authorization header:

```
Authorization: Bearer <your_jwt_token>
```

## Endpoints

### 1. Get All Events

Retrieve a paginated list of all events.

**Endpoint:** `GET /api/events`

**Permission Required:** `read:events`

**Query Parameters:**
- `page` (optional): Page number (default: 1)
- `limit` (optional): Items per page (default: 10, max: 100)

**Success Response (200 OK):**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "title": "IP Workshop: Patent Basics",
      "description": "Join us for an introductory workshop...",
      "date": "2025-11-15",
      "location": "GIIP Headquarters, Geneva",
      "capacity": 50,
      "created_by": 2,
      "creator_email": "editor@giip.info",
      "created_at": "2025-10-15T10:00:00Z",
      "updated_at": "2025-10-15T10:00:00Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "totalCount": 4,
    "totalPages": 1,
    "hasNextPage": false,
    "hasPreviousPage": false
  }
}
```

**Error Responses:**
- `401 Unauthorized`: Missing or invalid JWT token
- `403 Forbidden`: User lacks `read:events` permission

---

### 2. Get Event by ID

Retrieve a single event by its ID.

**Endpoint:** `GET /api/events/:id`

**Permission Required:** `read:events`

**URL Parameters:**
- `id`: Event ID (integer)

**Success Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "title": "IP Workshop: Patent Basics",
    "description": "Join us for an introductory workshop...",
    "date": "2025-11-15",
    "location": "GIIP Headquarters, Geneva",
    "capacity": 50,
    "created_by": 2,
    "creator_email": "editor@giip.info",
    "created_at": "2025-10-15T10:00:00Z",
    "updated_at": "2025-10-15T10:00:00Z"
  }
}
```

**Error Responses:**
- `400 Bad Request`: Invalid event ID format
- `401 Unauthorized`: Missing or invalid JWT token
- `403 Forbidden`: User lacks `read:events` permission
- `404 Not Found`: Event does not exist

---

### 3. Create Event

Create a new event.

**Endpoint:** `POST /api/events`

**Permission Required:** `write:events`

**Request Body:**
```json
{
  "title": "Innovation Networking Event",
  "description": "Connect with fellow innovators, investors, and IP professionals...",
  "date": "2025-11-22",
  "location": "Innovation Hub, Singapore",
  "capacity": 100
}
```

**Field Validation:**
- `title` (required): String, 1-255 characters
- `description` (required): String, minimum 1 character
- `date` (required): String in YYYY-MM-DD format, must be a valid date
- `location` (required): String, 1-255 characters
- `capacity` (optional): Positive integer, or null

**Success Response (201 Created):**
```json
{
  "success": true,
  "message": "Event created successfully",
  "data": {
    "id": 5,
    "title": "Innovation Networking Event",
    "description": "Connect with fellow innovators...",
    "date": "2025-11-22",
    "location": "Innovation Hub, Singapore",
    "capacity": 100,
    "created_by": 1,
    "created_at": "2025-10-17T10:00:00Z",
    "updated_at": "2025-10-17T10:00:00Z"
  }
}
```

**Error Responses:**
- `400 Bad Request`: Validation error (invalid input data)
- `401 Unauthorized`: Missing or invalid JWT token
- `403 Forbidden`: User lacks `write:events` permission

---

### 4. Update Event

Update an existing event. User must be the event creator or have `edit:events` permission.

**Endpoint:** `PUT /api/events/:id`

**Permission Required:** Ownership OR `edit:events`

**URL Parameters:**
- `id`: Event ID (integer)

**Request Body (all fields optional):**
```json
{
  "title": "Updated Event Title",
  "description": "Updated description...",
  "date": "2025-11-23",
  "location": "New Location",
  "capacity": 150
}
```

**Field Validation:**
- `title` (optional): String, 1-255 characters
- `description` (optional): String, minimum 1 character
- `date` (optional): String in YYYY-MM-DD format, must be a valid date
- `location` (optional): String, 1-255 characters
- `capacity` (optional): Positive integer, or null
- At least one field must be provided

**Success Response (200 OK):**
```json
{
  "success": true,
  "message": "Event updated successfully",
  "data": {
    "id": 5,
    "title": "Updated Event Title",
    "description": "Updated description...",
    "date": "2025-11-23",
    "location": "New Location",
    "capacity": 150,
    "created_by": 1,
    "created_at": "2025-10-17T10:00:00Z",
    "updated_at": "2025-10-17T11:00:00Z"
  }
}
```

**Error Responses:**
- `400 Bad Request`: Invalid event ID or validation error
- `401 Unauthorized`: Missing or invalid JWT token
- `403 Forbidden`: User is not the creator and lacks `edit:events` permission
- `404 Not Found`: Event does not exist

---

### 5. Delete Event

Delete an event.

**Endpoint:** `DELETE /api/events/:id`

**Permission Required:** `delete:events`

**URL Parameters:**
- `id`: Event ID (integer)

**Success Response (200 OK):**
```json
{
  "success": true,
  "message": "Event deleted successfully"
}
```

**Error Responses:**
- `400 Bad Request`: Invalid event ID format
- `401 Unauthorized`: Missing or invalid JWT token
- `403 Forbidden`: User lacks `delete:events` permission
- `404 Not Found`: Event does not exist

---

## Permission Matrix

| Role   | read:events | write:events | edit:events | delete:events |
|--------|-------------|--------------|-------------|---------------|
| admin  | ✓           | ✓            | ✓           | ✓             |
| editor | ✓           | ✓            | ✓           | ✗             |
| user   | ✓           | ✗            | ✗           | ✗             |

**Note:** Event creators can always update their own events, regardless of the `edit:events` permission.

---

## Example Usage

### Using cURL

**Get all events:**
```bash
curl -X GET http://localhost:3000/api/events \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

**Create an event:**
```bash
curl -X POST http://localhost:3000/api/events \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "New Workshop",
    "description": "Workshop description",
    "date": "2025-12-15",
    "location": "Main Hall",
    "capacity": 75
  }'
```

**Update an event:**
```bash
curl -X PUT http://localhost:3000/api/events/1 \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Updated Workshop Title",
    "capacity": 100
  }'
```

**Delete an event:**
```bash
curl -X DELETE http://localhost:3000/api/events/1 \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

---

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
        "field": "fieldName",
        "message": "Field-specific error message"
      }
    ]
  }
}
```

Common error codes:
- `VALIDATION_ERROR`: Input validation failed
- `INVALID_ID`: Invalid ID format
- `NOT_FOUND`: Resource not found
- `FORBIDDEN`: Insufficient permissions
- `UNAUTHORIZED`: Authentication required or failed
- `INTERNAL_ERROR`: Server error

---

## Related Documentation

- [RBAC Guide](./RBAC_GUIDE.md) - Understanding the permission system
- [Authentication](./README.md) - How to obtain JWT tokens
- [News API](./NEWS_API.md) - Similar API for news management
