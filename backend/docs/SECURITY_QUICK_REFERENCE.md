# Security Quick Reference Guide

## For Developers

This is a quick reference for security best practices in the GIIP Backend API.

## Input Validation

### Always use Zod schemas

```javascript
import { z } from 'zod';

const mySchema = z.object({
  email: z.string().email().toLowerCase().trim(),
  title: z.string().min(1).max(255).trim(),
  url: z.string().url().optional()
});

// In route
router.post('/endpoint', validateRequest(mySchema), controller);
```

### Validation Checklist
- ✅ Email: `.email().toLowerCase().trim()`
- ✅ Strings: `.min(1).max(255).trim()`
- ✅ URLs: `.url()`
- ✅ Dates: `.regex(/^\d{4}-\d{2}-\d{2}$/)`
- ✅ Numbers: `.number().int().positive()`

## SQL Injection Prevention

### ✅ CORRECT: Parameterized Queries

```javascript
// Single parameter
const result = await query(
  'SELECT * FROM users WHERE email = $1',
  [email]
);

// Multiple parameters
const result = await query(
  'INSERT INTO news (title, content) VALUES ($1, $2)',
  [title, content]
);

// Dynamic UPDATE
const fields = [];
const values = [];
let paramCount = 1;

if (data.title) {
  fields.push(`title = $${paramCount}`);  // Note: $${paramCount}
  values.push(data.title);
  paramCount++;
}

values.push(id);
const result = await query(
  `UPDATE news SET ${fields.join(', ')} WHERE id = $${paramCount}`,
  values
);
```

### ❌ WRONG: String Interpolation

```javascript
// NEVER DO THIS
const result = await query(
  `SELECT * FROM users WHERE email = '${email}'`
);

// NEVER DO THIS
const result = await query(
  `UPDATE news SET title = ${paramCount}`  // Missing $
);
```

## XSS Prevention

### Use sanitization for user content

```javascript
import { sanitizeHTML, sanitizeURL } from '../utils/inputSanitization.js';

// Sanitize HTML content
const safeContent = sanitizeHTML(userInput);

// Validate URLs
const safeURL = sanitizeURL(userURL);
if (!safeURL) {
  throw new Error('Invalid URL');
}
```

### Content Security Policy

Already configured in `security.js`. Scripts only from:
- Self
- Trusted CDNs

## Rate Limiting

### Use appropriate rate limiters

```javascript
import { loginRateLimiter, registerRateLimiter } from '../config/security.js';

// For authentication endpoints
router.post('/login', loginRateLimiter, validateRequest(schema), controller);
router.post('/register', registerRateLimiter, validateRequest(schema), controller);

// API rate limiting is applied globally to /api routes
```

### Rate Limits
- Login: 5 requests / 15 minutes
- Register: 3 requests / 1 hour
- API: 100 requests / 15 minutes

## CORS

### Allowed Origins

Configure in `.env`:
```env
FRONTEND_URL=http://localhost
```

Default allowed origins:
- `process.env.FRONTEND_URL`
- `http://localhost:80`
- `http://localhost:3000`
- `http://localhost:8080`

## Security Headers

Already configured via Helmet.js:
- ✅ Content-Security-Policy
- ✅ X-Frame-Options: DENY
- ✅ X-Content-Type-Options: nosniff
- ✅ Strict-Transport-Security
- ✅ X-XSS-Protection

## Common Patterns

### Creating a new endpoint

```javascript
// 1. Create Zod schema
const createItemSchema = z.object({
  title: z.string().min(1).max(255).trim(),
  content: z.string().min(1).trim()
});

// 2. Create repository function with parameterized query
export async function createItem(data, userId) {
  const result = await query(
    'INSERT INTO items (title, content, user_id) VALUES ($1, $2, $3) RETURNING *',
    [data.title, data.content, userId]
  );
  return result.rows[0];
}

// 3. Create controller
export async function create(req, res, next) {
  try {
    const item = await createItem(req.body, req.user.id);
    res.status(201).json({ success: true, data: item });
  } catch (error) {
    next(error);
  }
}

// 4. Create route with validation and auth
router.post('/items',
  authGuard,
  permissionGuard('write:items'),
  validateRequest(createItemSchema),
  create
);
```

### Updating with dynamic fields

```javascript
export async function updateItem(id, updateData) {
  const fields = [];
  const values = [];
  let paramCount = 1;
  
  // Add each field that's being updated
  if (updateData.title !== undefined) {
    fields.push(`title = $${paramCount}`);
    values.push(updateData.title);
    paramCount++;
  }
  
  if (updateData.content !== undefined) {
    fields.push(`content = $${paramCount}`);
    values.push(updateData.content);
    paramCount++;
  }
  
  // Always update timestamp
  fields.push('updated_at = CURRENT_TIMESTAMP');
  
  // Add ID as last parameter
  values.push(id);
  
  const result = await query(
    `UPDATE items SET ${fields.join(', ')} WHERE id = $${paramCount} RETURNING *`,
    values
  );
  
  return result.rows[0] || null;
}
```

## Testing Security

### Run security tests

```bash
node backend/test-security.js
```

### Test with malicious inputs

```javascript
// SQL Injection attempts
const sqlTests = [
  "'; DROP TABLE users; --",
  "1' OR '1'='1",
  "admin'--"
];

// XSS attempts
const xssTests = [
  "<script>alert('xss')</script>",
  "<img src=x onerror=alert('xss')>",
  "javascript:alert('xss')"
];

// All should be safely handled
```

## Security Checklist for New Code

Before committing:

- [ ] All database queries use parameterized queries (`$1`, `$2`, etc.)
- [ ] All inputs validated with Zod schemas
- [ ] No string interpolation in SQL queries
- [ ] URLs validated with `sanitizeURL()`
- [ ] Content sanitized with `sanitizeHTML()` if needed
- [ ] Rate limiting applied to sensitive endpoints
- [ ] Authentication required where needed
- [ ] Permissions checked for protected resources
- [ ] Error messages don't leak sensitive information
- [ ] No sensitive data in logs

## Quick Imports

```javascript
// Security middleware
import { 
  loginRateLimiter, 
  registerRateLimiter,
  apiRateLimiter 
} from '../config/security.js';

// Sanitization
import { 
  sanitizeHTML, 
  sanitizeURL, 
  sanitizeEmail,
  sanitizeObject 
} from '../utils/inputSanitization.js';

// Validation
import { z } from 'zod';
import { validateRequest } from '../validators/yourValidator.js';

// Auth & Permissions
import { authGuard } from '../middleware/authMiddleware.js';
import { permissionGuard } from '../middleware/permissionMiddleware.js';
```

## Need Help?

- 📖 Full documentation: `backend/docs/SECURITY_IMPLEMENTATION.md`
- 🛡️ SQL injection guide: `backend/docs/SQL_INJECTION_PREVENTION.md`
- ✅ Run tests: `node backend/test-security.js`

## Remember

**Defense in Depth**: Multiple layers of security are better than one.

1. Input Validation (Zod)
2. Input Sanitization (XSS prevention)
3. Parameterized Queries (SQL injection prevention)
4. Rate Limiting (Brute force prevention)
5. Authentication (JWT)
6. Authorization (RBAC)
7. Security Headers (Helmet.js)
8. CORS (Origin validation)

**When in doubt, ask!** Security is everyone's responsibility.
