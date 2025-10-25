# Rate Limiting Implementation

## Overview

Rate limiting has been implemented to protect the GIIP Backend API from abuse, brute force attacks, and DoS attempts. The implementation uses the `express-rate-limit` package to enforce request limits on different endpoints.

## Implementation Details

### 1. Login Endpoint Rate Limiting

**Configuration:** `loginRateLimiter` in `src/config/security.js`

```javascript
export const loginRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // Limit each IP to 5 requests per windowMs
  message: {
    success: false,
    error: {
      code: 'RATE_LIMIT_EXCEEDED',
      message: 'Too many login attempts. Please try again after 15 minutes.'
    }
  },
  standardHeaders: true,
  legacyHeaders: false,
  skipSuccessfulRequests: false,
  skipFailedRequests: false
});
```

**Applied to:**
- `POST /api/auth/login`

**Purpose:**
- Prevents brute force password attacks
- Limits each IP address to 5 login attempts per 15 minutes
- Both successful and failed login attempts count toward the limit

**Response when limit exceeded:**
```json
HTTP 429 Too Many Requests

{
  "success": false,
  "error": {
    "code": "RATE_LIMIT_EXCEEDED",
    "message": "Too many login attempts. Please try again after 15 minutes."
  }
}
```

**Headers included:**
- `RateLimit-Limit`: Maximum number of requests allowed (5)
- `RateLimit-Remaining`: Number of requests remaining in current window
- `RateLimit-Reset`: Time when the rate limit window resets (Unix timestamp)

### 2. API Endpoint Rate Limiting

**Configuration:** `apiRateLimiter` in `src/config/security.js`

```javascript
export const apiRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  message: {
    success: false,
    error: {
      code: 'RATE_LIMIT_EXCEEDED',
      message: 'Too many requests. Please try again later.'
    }
  },
  standardHeaders: true,
  legacyHeaders: false,
  skip: (req) => {
    // Skip rate limiting for health check endpoint
    return req.path === '/api/health';
  }
});
```

**Applied to:**
- All `/api/*` endpoints (globally applied in `src/server.js`)
- Excludes `/api/health` endpoint for monitoring purposes

**Purpose:**
- Prevents API abuse and DoS attacks
- Limits each IP address to 100 requests per 15 minutes across all API endpoints
- Protects backend resources from excessive usage

**Response when limit exceeded:**
```json
HTTP 429 Too Many Requests

{
  "success": false,
  "error": {
    "code": "RATE_LIMIT_EXCEEDED",
    "message": "Too many requests. Please try again later."
  }
}
```

**Headers included:**
- `RateLimit-Limit`: Maximum number of requests allowed (100)
- `RateLimit-Remaining`: Number of requests remaining in current window
- `RateLimit-Reset`: Time when the rate limit window resets (Unix timestamp)

### 3. Registration Endpoint Rate Limiting

**Configuration:** `registerRateLimiter` in `src/config/security.js`

```javascript
export const registerRateLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 3, // Limit each IP to 3 registrations per hour
  message: {
    success: false,
    error: {
      code: 'RATE_LIMIT_EXCEEDED',
      message: 'Too many registration attempts. Please try again after 1 hour.'
    }
  },
  standardHeaders: true,
  legacyHeaders: false
});
```

**Applied to:**
- `POST /api/auth/register`

**Purpose:**
- Prevents spam account creation
- Limits each IP address to 3 registration attempts per hour

## Application Flow

### Server-Level Application

In `src/server.js`:

```javascript
import { apiRateLimiter } from './config/security.js';

// Apply rate limiting to all API routes
app.use('/api', apiRateLimiter);
```

This applies the general API rate limiter to all endpoints under `/api/*`.

### Route-Level Application

In `src/routes/authRoutes.js`:

```javascript
import { loginRateLimiter, registerRateLimiter } from '../config/security.js';

// Apply specific rate limiters to auth endpoints
router.post('/register', registerRateLimiter, validateRequest(registerSchema), register);
router.post('/login', loginRateLimiter, validateRequest(loginSchema), login);
```

This applies more restrictive rate limiters to authentication endpoints.

## Rate Limit Hierarchy

When multiple rate limiters apply to the same endpoint, they work together:

1. **Login endpoint** (`POST /api/auth/login`):
   - First checked against `loginRateLimiter` (5 requests per 15 minutes)
   - Also counted against `apiRateLimiter` (100 requests per 15 minutes)
   - The more restrictive limit (login) will trigger first

2. **Other API endpoints**:
   - Only checked against `apiRateLimiter` (100 requests per 15 minutes)

## Testing Rate Limiting

### Manual Testing with curl

**Test login rate limiting:**

```bash
# Make 6 login attempts quickly
for i in {1..6}; do
  curl -X POST http://localhost:3000/api/auth/login \
    -H "Content-Type: application/json" \
    -d '{"email":"test@example.com","password":"test"}' \
    -i
  echo "\n---\n"
done
```

Expected: First 5 requests return 401 (invalid credentials), 6th request returns 429 (rate limited).

**Test API rate limiting:**

```bash
# Make 105 requests to any API endpoint
for i in {1..105}; do
  curl -X GET http://localhost:3000/api/news -i | grep -E "HTTP|RateLimit"
done
```

Expected: First 100 requests succeed, remaining 5 return 429.

### Automated Testing

Run the provided test script:

```bash
cd backend
node test-rate-limit.js
```

This script will:
1. Test login rate limiting by making 7 login attempts
2. Test API rate limiting by making 105 requests to the health endpoint
3. Display rate limit headers and responses

## Monitoring Rate Limits

### Client-Side Monitoring

Clients can monitor their rate limit status using the response headers:

```javascript
const response = await fetch('/api/auth/login', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ email, password })
});

const limit = response.headers.get('RateLimit-Limit');
const remaining = response.headers.get('RateLimit-Remaining');
const reset = response.headers.get('RateLimit-Reset');

console.log(`Rate limit: ${remaining}/${limit} remaining`);
console.log(`Resets at: ${new Date(reset * 1000).toISOString()}`);
```

### Server-Side Monitoring

Rate limit events are logged in the server console. Monitor for patterns of rate limiting to identify:
- Potential attacks or abuse
- Legitimate users hitting limits (may need adjustment)
- API usage patterns

## Configuration

Rate limiting settings can be adjusted in `src/config/security.js`:

- **windowMs**: Time window in milliseconds
- **max**: Maximum number of requests per window
- **message**: Custom error message returned when limit exceeded
- **skip**: Function to skip rate limiting for specific requests

## Security Considerations

1. **IP-based limiting**: Rate limits are applied per IP address. Consider using authenticated user IDs for more accurate limiting in production.

2. **Proxy considerations**: If behind a proxy (nginx, load balancer), ensure the real client IP is forwarded:
   ```javascript
   app.set('trust proxy', 1);
   ```

3. **Distributed systems**: For multi-server deployments, consider using a shared store (Redis) for rate limiting:
   ```javascript
   import RedisStore from 'rate-limit-redis';
   
   const limiter = rateLimit({
     store: new RedisStore({
       client: redisClient
     }),
     // ... other options
   });
   ```

## Compliance

This implementation satisfies:
- **Requirement 9.4**: Input validation and protection against attacks
- **Task 10.3**: Rate limiting implementation
  - Login endpoint: 5 requests per 15 minutes ✓
  - API endpoints: 100 requests per 15 minutes ✓

## References

- [express-rate-limit documentation](https://github.com/express-rate-limit/express-rate-limit)
- [OWASP Rate Limiting Guide](https://cheatsheetseries.owasp.org/cheatsheets/Denial_of_Service_Cheat_Sheet.html)
