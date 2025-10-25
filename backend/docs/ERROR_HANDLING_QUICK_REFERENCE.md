# Error Handling Quick Reference

## Import Error Classes

```javascript
import {
  ValidationError,      // 400 - Invalid input
  AuthenticationError,  // 401 - Invalid credentials
  UnauthorizedError,    // 401 - Missing/invalid token
  ForbiddenError,       // 403 - Insufficient permissions
  NotFoundError,        // 404 - Resource not found
  ConflictError,        // 409 - Resource conflict
  DatabaseError,        // 500 - Database error
  InternalServerError   // 500 - Unexpected error
} from '../utils/errors.js';
```

## Common Error Patterns

### Validation Error (400)
```javascript
// Invalid input
throw new ValidationError('Invalid email format');

// With details
throw new ValidationError('Validation failed', [
  { field: 'email', message: 'Must be valid email' },
  { field: 'password', message: 'Must be at least 8 characters' }
]);
```

### Authentication Error (401)
```javascript
// Invalid credentials
throw new AuthenticationError('Invalid email or password');
```

### Unauthorized Error (401)
```javascript
// Missing token
throw new UnauthorizedError('No authorization token provided');

// Invalid token format
throw new UnauthorizedError('Invalid token format');
```

### Forbidden Error (403)
```javascript
// Insufficient permissions
throw new ForbiddenError('Insufficient permissions');

// Specific permission required
throw new ForbiddenError('Required permission: write:news');

// Ownership check
throw new ForbiddenError('You can only edit your own articles');
```

### Not Found Error (404)
```javascript
// Resource not found
throw new NotFoundError('News article not found');

// With ID
throw new NotFoundError(`User with ID ${id} not found`);
```

### Conflict Error (409)
```javascript
// Duplicate resource
throw new ConflictError('Email already registered');

// Resource conflict
throw new ConflictError('Username already taken');
```

### Database Error (500)
```javascript
// Database operation failed
throw new DatabaseError('Failed to query database');
```

### Internal Server Error (500)
```javascript
// Unexpected error
throw new InternalServerError('Unexpected error occurred');
```

## Controller Pattern

```javascript
export async function controllerFunction(req, res, next) {
  try {
    // Your logic here
    const result = await someService.doSomething();
    
    res.status(200).json({
      success: true,
      data: result
    });
  } catch (error) {
    next(error); // Pass to global error handler
  }
}
```

## Service Pattern

```javascript
import { NotFoundError, ForbiddenError } from '../utils/errors.js';

export async function updateResource(id, data, userId) {
  // Check if resource exists
  const resource = await repository.findById(id);
  if (!resource) {
    throw new NotFoundError('Resource not found');
  }
  
  // Check ownership
  if (resource.created_by !== userId) {
    throw new ForbiddenError('You can only edit your own resources');
  }
  
  // Update resource
  return await repository.update(id, data);
}
```

## Middleware Pattern

```javascript
import { UnauthorizedError } from '../utils/errors.js';

export function someMiddleware(req, res, next) {
  try {
    // Your logic here
    if (!someCondition) {
      throw new UnauthorizedError('Condition not met');
    }
    
    next();
  } catch (error) {
    next(error);
  }
}
```

## Async Handler Wrapper

```javascript
import { asyncHandler } from '../middleware/errorHandler.js';

// Automatically catches errors in async functions
router.get('/news', asyncHandler(async (req, res) => {
  const news = await getNews();
  res.json({ success: true, data: news });
}));
```

## Error Response Format

All errors return this format:

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

## HTTP Status Codes

| Code | Error Type | When to Use |
|------|------------|-------------|
| 400 | ValidationError | Invalid input, malformed data |
| 401 | AuthenticationError | Invalid credentials |
| 401 | UnauthorizedError | Missing/invalid token |
| 403 | ForbiddenError | Insufficient permissions |
| 404 | NotFoundError | Resource doesn't exist |
| 409 | ConflictError | Duplicate resource |
| 500 | DatabaseError | Database operation failed |
| 500 | InternalServerError | Unexpected error |

## Logging

```javascript
import { logError, logWarning, logInfo } from '../utils/logger.js';

// Log error (automatically done by error handler)
logError(error, req);

// Log warning
logWarning('Something unusual', { userId: 123 });

// Log info
logInfo('User action', { action: 'login', userId: 123 });
```

## Testing Errors

```bash
# Run error handling tests
node test-error-handling.js
```

## Best Practices

✅ **DO:**
- Use specific error classes
- Provide helpful error messages
- Pass errors to `next(error)`
- Log errors with context

❌ **DON'T:**
- Return error objects
- Use generic Error class
- Expose sensitive data
- Handle errors in multiple places

## Common Mistakes

### ❌ Wrong: Returning error object
```javascript
if (!user) {
  return { error: 'User not found' };
}
```

### ✅ Right: Throwing error
```javascript
if (!user) {
  throw new NotFoundError('User not found');
}
```

### ❌ Wrong: Manual error response
```javascript
catch (error) {
  res.status(500).json({ error: error.message });
}
```

### ✅ Right: Pass to error handler
```javascript
catch (error) {
  next(error);
}
```

### ❌ Wrong: Generic error
```javascript
throw new Error('Something went wrong');
```

### ✅ Right: Specific error
```javascript
throw new NotFoundError('News article not found');
```

## Need Help?

See full documentation: `docs/ERROR_HANDLING.md`
