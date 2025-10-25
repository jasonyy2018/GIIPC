# SQL Injection Prevention Guide

## Overview

This document outlines the SQL injection prevention measures implemented in the GIIP Backend API.

## Primary Defense: Parameterized Queries

All database queries use parameterized queries (also known as prepared statements) with the PostgreSQL `pg` library. This is the **primary and most effective** defense against SQL injection.

### Correct Usage

```javascript
// ✅ CORRECT: Using parameterized query with $1, $2, etc.
const result = await query(
  'SELECT * FROM users WHERE email = $1 AND role_id = $2',
  [email, roleId]
);
```

### Incorrect Usage

```javascript
// ❌ WRONG: String interpolation - vulnerable to SQL injection
const result = await query(
  `SELECT * FROM users WHERE email = '${email}' AND role_id = ${roleId}`
);

// ❌ WRONG: Template literals in parameter placeholders
const result = await query(
  `SELECT * FROM users WHERE email = ${1}`,
  [email]
);
```

## Dynamic Query Building

When building dynamic UPDATE queries, ensure parameter placeholders use the `$` prefix:

### Correct Dynamic Query

```javascript
// ✅ CORRECT: Proper parameter placeholders
const fields = [];
const values = [];
let paramCount = 1;

if (updateData.title !== undefined) {
  fields.push(`title = $${paramCount}`);  // Note the $ prefix
  values.push(updateData.title);
  paramCount++;
}

if (updateData.content !== undefined) {
  fields.push(`content = $${paramCount}`);  // Note the $ prefix
  values.push(updateData.content);
  paramCount++;
}

values.push(id);

const result = await query(
  `UPDATE news SET ${fields.join(', ')} WHERE id = $${paramCount}`,
  values
);
```

### Incorrect Dynamic Query

```javascript
// ❌ WRONG: Missing $ prefix in parameter placeholders
const fields = [];
const values = [];
let paramCount = 1;

if (updateData.title !== undefined) {
  fields.push(`title = ${paramCount}`);  // Missing $ prefix!
  values.push(updateData.title);
  paramCount++;
}

// This creates: UPDATE news SET title = 1 WHERE id = 2
// Instead of:    UPDATE news SET title = $1 WHERE id = $2
```

## Input Validation

### Zod Schema Validation

All user inputs are validated using Zod schemas before reaching the database layer:

```javascript
import { z } from 'zod';

export const createNewsSchema = z.object({
  title: z.string().min(1).max(255).trim(),
  content: z.string().min(1).trim(),
  image_url: z.string().url().max(500).optional().nullable(),
  published_date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/)
});
```

### Input Sanitization

Additional sanitization is applied to prevent XSS attacks:

```javascript
import { sanitizeObject } from '../utils/inputSanitization.js';

// Sanitize request body
app.use((req, res, next) => {
  if (req.body) {
    req.body = sanitizeObject(req.body);
  }
  next();
});
```

## Defense in Depth

Multiple layers of protection:

1. **Parameterized Queries** (Primary defense)
   - All queries use `$1`, `$2`, etc. placeholders
   - Values are passed as separate array parameter

2. **Input Validation** (Zod schemas)
   - Type checking
   - Format validation
   - Length limits
   - Pattern matching

3. **Input Sanitization**
   - HTML escaping for content fields
   - URL validation
   - Email normalization

4. **SQL Injection Detection** (Monitoring)
   - Pattern detection for suspicious inputs
   - Logging of potential attacks
   - Optional blocking

## Repository Pattern

All database operations are encapsulated in repository modules:

- `userRepository.js`
- `newsRepository.js`
- `eventRepository.js`
- `conferenceRepository.js`
- `roleRepository.js`

This ensures:
- Consistent use of parameterized queries
- Centralized database access
- Easier security auditing

## Security Checklist

When writing new database queries:

- [ ] Use parameterized queries with `$1`, `$2`, etc.
- [ ] Never use string interpolation for SQL values
- [ ] Validate inputs with Zod schemas
- [ ] Use repository pattern for database access
- [ ] Test with malicious inputs
- [ ] Review dynamic query building carefully

## Common Vulnerabilities Fixed

### Issue: Missing $ in Dynamic Queries

**Location**: `newsRepository.js`, `eventRepository.js`, `conferenceRepository.js`

**Problem**: The `updateNews()`, `updateEvent()`, and `updateConference()` functions were building dynamic queries with parameter placeholders like `title = ${paramCount}` instead of `title = $${paramCount}`.

**Impact**: While the values array was still being used (preventing direct SQL injection), the query would fail or behave incorrectly because PostgreSQL expects `$1`, `$2`, etc. as placeholders.

**Fix**: Add the `$` prefix to all parameter placeholders in dynamic queries.

## Testing

Test queries with malicious inputs:

```javascript
// Test cases
const maliciousInputs = [
  "'; DROP TABLE users; --",
  "1' OR '1'='1",
  "admin'--",
  "1; DELETE FROM news WHERE 1=1",
  "<script>alert('xss')</script>"
];

// All should be safely handled by parameterized queries
```

## References

- [OWASP SQL Injection Prevention Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/SQL_Injection_Prevention_Cheat_Sheet.html)
- [PostgreSQL pg library documentation](https://node-postgres.com/features/queries)
- [Zod validation library](https://zod.dev/)
