# Task 11: Global Error Handling Implementation

## Overview

Implemented a comprehensive global error handling system for the GIIP Backend API that provides unified error responses, proper HTTP status codes, error logging, and security-conscious error messages.

## Implementation Date

October 18, 2025

## Files Created

### 1. `src/utils/errors.js`
Custom error classes for different error types:
- `ApiError` - Base error class
- `ValidationError` (400) - Input validation failures
- `AuthenticationError` (401) - Invalid credentials
- `UnauthorizedError` (401) - Missing/invalid token
- `ForbiddenError` (403) - Insufficient permissions
- `NotFoundError` (404) - Resource not found
- `ConflictError` (409) - Resource conflicts
- `DatabaseError` (500) - Database operation failures
- `InternalServerError` (500) - Unexpected errors

### 2. `src/utils/logger.js`
Structured logging utility with functions:
- `logError(error, req)` - Log errors with request context
- `logWarning(message, meta)` - Log warnings
- `logInfo(message, meta)` - Log information
- `logDebug(message, meta)` - Log debug info (dev only)

All logs are formatted as JSON with timestamps and metadata.

### 3. `src/middleware/errorHandler.js`
Global error handling middleware:
- `errorHandler` - Main error handler that processes all errors
- `notFoundHandler` - Handles 404 errors for non-existent routes
- `asyncHandler` - Utility wrapper for async route handlers

**Features:**
- Handles custom ApiError instances
- Automatically converts Zod validation errors
- Handles JWT errors (TokenExpiredError, JsonWebTokenError)
- Handles PostgreSQL errors (unique constraint, foreign key, not null)
- Logs all errors with request context
- Hides sensitive details in production mode

### 4. `docs/ERROR_HANDLING.md`
Comprehensive documentation covering:
- Error response format
- Custom error classes usage
- Error handling middleware
- Error logging
- Usage examples
- Automatic error handling
- HTTP status codes
- Security considerations
- Testing examples
- Best practices
- Migration guide

### 5. `docs/ERROR_HANDLING_QUICK_REFERENCE.md`
Quick reference guide for developers:
- Import statements
- Common error patterns
- Controller/Service/Middleware patterns
- Error response format
- HTTP status codes table
- Best practices
- Common mistakes

### 6. `test-error-handling.js`
Test script to verify error handling:
- Tests 404 Not Found errors
- Tests validation errors
- Tests authentication errors
- Tests unauthorized errors
- Tests invalid token errors
- Tests forbidden errors
- Tests conflict errors

## Files Modified

### 1. `src/server.js`
- Imported error handling middleware
- Replaced basic error handlers with new system
- Added `notFoundHandler` before error handler
- Added `errorHandler` as last middleware

### 2. `src/middleware/authMiddleware.js`
- Imported `UnauthorizedError`
- Simplified error handling using custom errors
- Removed manual error responses
- Let JWT errors propagate to global handler

### 3. `src/middleware/permissionMiddleware.js`
- Imported `UnauthorizedError` and `ForbiddenError`
- Updated all permission guard functions
- Simplified error handling
- Removed manual error responses

### 4. `src/services/authService.js`
- Imported `ConflictError` and `AuthenticationError`
- Replaced manual error creation with custom error classes
- Cleaner error throwing

## Key Features

### 1. Unified Error Response Format
All errors return consistent JSON structure:
```json
{
  "success": false,
  "error": {
    "code": "ERROR_CODE",
    "message": "Human-readable message",
    "details": { /* optional */ }
  }
}
```

### 2. Automatic Error Handling
The system automatically handles:
- **Zod validation errors** → 400 with field details
- **JWT errors** → 401 with appropriate message
- **PostgreSQL errors** → Proper status codes based on constraint type
- **Custom errors** → Correct status codes and messages

### 3. Comprehensive Error Logging
All errors are logged with:
- Timestamp
- Error name and code
- Status code
- Stack trace
- Request context (method, URL, IP, user agent, user ID)

### 4. Security Features
- Hides internal error details in production
- No stack traces exposed in production
- Generic messages for 500 errors in production
- No sensitive data in error messages

### 5. Developer-Friendly
- Easy-to-use custom error classes
- Clear error messages
- Comprehensive documentation
- Quick reference guide
- Test script for verification

## HTTP Status Codes

| Code | Error Type | Usage |
|------|------------|-------|
| 400 | ValidationError | Invalid input, malformed data |
| 401 | AuthenticationError | Invalid credentials |
| 401 | UnauthorizedError | Missing/invalid token |
| 403 | ForbiddenError | Insufficient permissions |
| 404 | NotFoundError | Resource doesn't exist |
| 409 | ConflictError | Duplicate resource |
| 500 | DatabaseError | Database operation failed |
| 500 | InternalServerError | Unexpected error |

## Usage Examples

### In Controllers
```javascript
export async function createNews(req, res, next) {
  try {
    const news = await newsService.create(req.body);
    res.status(201).json({ success: true, data: news });
  } catch (error) {
    next(error); // Pass to global error handler
  }
}
```

### In Services
```javascript
import { NotFoundError, ForbiddenError } from '../utils/errors.js';

export async function updateNews(id, data, userId) {
  const news = await repository.findById(id);
  
  if (!news) {
    throw new NotFoundError('News article not found');
  }
  
  if (news.created_by !== userId) {
    throw new ForbiddenError('You can only edit your own articles');
  }
  
  return await repository.update(id, data);
}
```

### In Middleware
```javascript
import { UnauthorizedError } from '../utils/errors.js';

export function authGuard(req, res, next) {
  try {
    if (!req.headers.authorization) {
      throw new UnauthorizedError('No token provided');
    }
    next();
  } catch (error) {
    next(error);
  }
}
```

## Testing

Run the error handling test suite:
```bash
# Start the server first
npm start

# In another terminal, run tests
node test-error-handling.js
```

The test script verifies:
- ✓ 404 Not Found errors
- ✓ Validation errors
- ✓ Authentication errors
- ✓ Unauthorized errors
- ✓ Invalid token errors
- ✓ Forbidden errors
- ✓ Conflict errors

## Benefits

1. **Consistency** - All errors follow the same format
2. **Maintainability** - Centralized error handling
3. **Security** - Production-safe error messages
4. **Debugging** - Comprehensive error logging
5. **Developer Experience** - Easy to use and understand
6. **Type Safety** - Specific error classes for different scenarios
7. **Automatic Handling** - Common errors handled automatically

## Migration Notes

Existing code that uses `next(error)` pattern will work automatically with the new system. Code that manually creates error responses should be updated to use custom error classes.

### Before
```javascript
if (!user) {
  return res.status(404).json({
    success: false,
    error: { message: 'User not found' }
  });
}
```

### After
```javascript
if (!user) {
  throw new NotFoundError('User not found');
}
```

## Requirements Satisfied

✅ **创建统一错误响应格式** - All errors use consistent JSON format
✅ **实现全局错误处理中间件** - Global error handler in place
✅ **处理验证错误、认证错误、权限错误** - All error types handled
✅ **记录错误日志** - Comprehensive error logging with context
✅ **返回适当的 HTTP 状态码** - Proper status codes for each error type

## Next Steps

The error handling system is now complete and ready for use. All new code should:
1. Use custom error classes instead of generic Error
2. Pass errors to `next(error)` in controllers
3. Throw errors in services (don't return error objects)
4. Use appropriate error types for different scenarios

## Documentation

- Full documentation: `docs/ERROR_HANDLING.md`
- Quick reference: `docs/ERROR_HANDLING_QUICK_REFERENCE.md`
- Test script: `test-error-handling.js`

## Summary

The global error handling system provides a robust, secure, and developer-friendly way to handle all errors in the GIIP Backend API. It ensures consistent error responses, proper logging, and appropriate HTTP status codes while maintaining security in production environments.
