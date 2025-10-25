# Global Error Handling System

## Overview

The GIIP Backend API implements a comprehensive global error handling system that provides:

- **Unified error response format** across all endpoints
- **Custom error classes** for different error types
- **Automatic error logging** with request context
- **Proper HTTP status codes** for each error type
- **Security-conscious error messages** (no sensitive data exposure in production)

## Error Response Format

All errors follow this standardized JSON format:

```json
{
  "success": false,
  "error": {
    "code": "ERROR_CODE",
    "message": "Human-readable error message",
    "details": {
      // Optional: Additional error details (validation errors, etc.)
    }
  }
}
```

## Custom Error Classes

Located in `src/utils/errors.js`:

### ApiError (Base Class)
Base class for all API errors. All custom errors extend this class.

```javascript
import { ApiError } from '../utils/errors.js';

throw new ApiError('Something went wrong', 500, 'CUSTOM_ERROR', { detail: 'value' });
```

### ValidationError (400)
Used for input validation failures.

```javascript
import { ValidationError } from '../utils/errors.js';

throw new ValidationError('Invalid input', [
  { field: 'email', message: 'Must be a valid email' }
]);
```

### AuthenticationError (401)
Used when authentication fails (invalid credentials).

```javascript
import { AuthenticationError } from '../utils/errors.js';

throw new AuthenticationError('Invalid email or password');
```

### UnauthorizedError (401)
Used when token is missing or invalid.

```javascript
import { UnauthorizedError } from '../utils/errors.js';

throw new UnauthorizedError('No authorization token provided');
```

### ForbiddenError (403)
Used when user lacks required permissions.

```javascript
import { ForbiddenError } from '../utils/errors.js';

throw new ForbiddenError('Insufficient permissions');
```

### NotFoundError (404)
Used when requested resource doesn't exist.

```javascript
import { NotFoundError } from '../utils/errors.js';

throw new NotFoundError('News article not found');
```

### ConflictError (409)
Used for resource conflicts (e.g., duplicate email).

```javascript
import { ConflictError } from '../utils/errors.js';

throw new ConflictError('Email already registered');
```

### DatabaseError (500)
Used for database operation failures.

```javascript
import { DatabaseError } from '../utils/errors.js';

throw new DatabaseError('Failed to query database');
```

### InternalServerError (500)
Used for unexpected server errors.

```javascript
import { InternalServerError } from '../utils/errors.js';

throw new InternalServerError('Unexpected error occurred');
```

## Error Handling Middleware

Located in `src/middleware/errorHandler.js`:

### Global Error Handler

The global error handler catches all errors and returns standardized responses:

```javascript
app.use(errorHandler);
```

**Features:**
- Handles custom ApiError instances
- Handles Zod validation errors
- Handles JWT errors (TokenExpiredError, JsonWebTokenError)
- Handles PostgreSQL errors (unique constraint, foreign key, etc.)
- Logs all errors with request context
- Hides sensitive error details in production

### 404 Not Found Handler

Handles requests to non-existent routes:

```javascript
app.use(notFoundHandler);
```

### Async Handler Wrapper

Utility to wrap async route handlers and catch errors:

```javascript
import { asyncHandler } from '../middleware/errorHandler.js';

router.get('/news', asyncHandler(async (req, res) => {
  const news = await getNews();
  res.json({ success: true, data: news });
}));
```

## Error Logging

Located in `src/utils/logger.js`:

### Log Functions

```javascript
import { logError, logWarning, logInfo, logDebug } from '../utils/logger.js';

// Log error with request context
logError(error, req);

// Log warning
logWarning('Something unusual happened', { userId: 123 });

// Log info
logInfo('User registered', { email: 'user@example.com' });

// Log debug (only in development)
logDebug('Debug information', { data: someData });
```

### Log Format

All logs are structured JSON with timestamp:

```json
{
  "timestamp": "2025-10-18T10:30:00.000Z",
  "level": "ERROR",
  "message": "Invalid email or password",
  "name": "AuthenticationError",
  "code": "AUTHENTICATION_ERROR",
  "statusCode": 401,
  "stack": "...",
  "request": {
    "method": "POST",
    "url": "/api/auth/login",
    "ip": "127.0.0.1",
    "userAgent": "Mozilla/5.0...",
    "userId": 123
  }
}
```

## Usage Examples

### In Controllers

Controllers should catch errors and pass them to the global error handler:

```javascript
export async function createNews(req, res, next) {
  try {
    const news = await newsService.create(req.body, req.user.userId);
    res.status(201).json({ success: true, data: news });
  } catch (error) {
    next(error); // Pass to global error handler
  }
}
```

### In Services

Services should throw custom errors:

```javascript
import { NotFoundError, ForbiddenError } from '../utils/errors.js';

export async function updateNews(id, data, userId) {
  const news = await newsRepository.findById(id);
  
  if (!news) {
    throw new NotFoundError('News article not found');
  }
  
  if (news.created_by !== userId) {
    throw new ForbiddenError('You can only edit your own articles');
  }
  
  return await newsRepository.update(id, data);
}
```

### In Middleware

Middleware should throw errors or pass them to next():

```javascript
import { UnauthorizedError } from '../utils/errors.js';

export function authGuard(req, res, next) {
  try {
    const token = extractToken(req);
    
    if (!token) {
      throw new UnauthorizedError('No token provided');
    }
    
    req.user = verifyToken(token);
    next();
  } catch (error) {
    next(error);
  }
}
```

## Automatic Error Handling

The system automatically handles:

### Zod Validation Errors

```javascript
// Zod validation error is automatically converted to:
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Input validation failed",
    "details": [
      {
        "field": "email",
        "message": "Invalid email",
        "code": "invalid_string"
      }
    ]
  }
}
```

### JWT Errors

```javascript
// TokenExpiredError is automatically converted to:
{
  "success": false,
  "error": {
    "code": "TOKEN_EXPIRED",
    "message": "Authentication token has expired"
  }
}

// JsonWebTokenError is automatically converted to:
{
  "success": false,
  "error": {
    "code": "INVALID_TOKEN",
    "message": "Invalid authentication token"
  }
}
```

### PostgreSQL Errors

```javascript
// Unique constraint violation (23505) is automatically converted to:
{
  "success": false,
  "error": {
    "code": "CONFLICT",
    "message": "email already exists"
  }
}

// Foreign key violation (23503) is automatically converted to:
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Referenced resource does not exist"
  }
}

// Not null violation (23502) is automatically converted to:
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "field_name is required"
  }
}
```

## HTTP Status Codes

| Status Code | Error Type | Usage |
|-------------|------------|-------|
| 400 | Bad Request | Validation errors, malformed requests |
| 401 | Unauthorized | Missing/invalid token, authentication failed |
| 403 | Forbidden | Insufficient permissions |
| 404 | Not Found | Resource doesn't exist |
| 409 | Conflict | Resource conflict (duplicate email, etc.) |
| 500 | Internal Server Error | Unexpected server errors |

## Security Considerations

### Production Mode

In production (`NODE_ENV=production`):
- Internal error details are hidden
- Stack traces are not exposed
- Generic error messages for 500 errors

### Development Mode

In development:
- Full error details are shown
- Stack traces are included
- Detailed error messages

### Sensitive Data

Never include sensitive data in error messages:
- ❌ "Password 'abc123' is too short"
- ✅ "Password must be at least 8 characters"

- ❌ "User with email 'admin@example.com' not found"
- ✅ "Invalid email or password"

## Testing Error Handling

### Test Invalid Token

```bash
curl -X GET http://localhost:3000/api/news \
  -H "Authorization: Bearer invalid_token"
```

Expected response:
```json
{
  "success": false,
  "error": {
    "code": "INVALID_TOKEN",
    "message": "Invalid authentication token"
  }
}
```

### Test Missing Permission

```bash
# Login as regular user
TOKEN=$(curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"user@example.com","password":"password123"}' \
  | jq -r '.token')

# Try to create news (requires write:news permission)
curl -X POST http://localhost:3000/api/news \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"title":"Test","content":"Test"}'
```

Expected response:
```json
{
  "success": false,
  "error": {
    "code": "FORBIDDEN",
    "message": "Access denied. Required permission: write:news"
  }
}
```

### Test Validation Error

```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"invalid-email","password":"123"}'
```

Expected response:
```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Input validation failed",
    "details": [
      {
        "field": "email",
        "message": "Invalid email",
        "code": "invalid_string"
      },
      {
        "field": "password",
        "message": "String must contain at least 8 character(s)",
        "code": "too_small"
      }
    ]
  }
}
```

## Best Practices

1. **Always use custom error classes** instead of generic Error
2. **Pass errors to next()** in controllers and middleware
3. **Throw errors in services** - don't return error objects
4. **Use appropriate error types** - don't use 500 for validation errors
5. **Provide helpful error messages** - but don't expose sensitive data
6. **Log all errors** - use the logger utility
7. **Test error scenarios** - ensure proper error responses

## Migration Guide

### Old Pattern (Before Global Error Handler)

```javascript
// ❌ Old way
export async function createNews(req, res) {
  try {
    const news = await newsService.create(req.body);
    res.status(201).json({ success: true, data: news });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      error: { message: 'Failed to create news' }
    });
  }
}
```

### New Pattern (With Global Error Handler)

```javascript
// ✅ New way
import { NotFoundError } from '../utils/errors.js';

export async function createNews(req, res, next) {
  try {
    const news = await newsService.create(req.body);
    res.status(201).json({ success: true, data: news });
  } catch (error) {
    next(error); // Let global handler deal with it
  }
}

// In service
export async function create(data) {
  if (!data.title) {
    throw new ValidationError('Title is required');
  }
  // ... rest of logic
}
```

## Summary

The global error handling system provides:

✅ Consistent error responses across all endpoints
✅ Proper HTTP status codes
✅ Detailed error logging
✅ Security-conscious error messages
✅ Automatic handling of common error types
✅ Easy-to-use custom error classes
✅ Production-ready error handling

All errors are now handled centrally, making the codebase cleaner and more maintainable.
