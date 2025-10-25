/**
 * Input Sanitization Utilities
 * Provides functions to sanitize and validate user input to prevent XSS and other attacks
 */

/**
 * Sanitize HTML content to prevent XSS attacks
 * Escapes HTML special characters
 * @param {string} input - User input string
 * @returns {string} Sanitized string
 */
export function sanitizeHTML(input) {
  if (typeof input !== 'string') {
    return input;
  }
  
  return input
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .replace(/\//g, '&#x2F;');
}

/**
 * Sanitize text content (less aggressive than HTML sanitization)
 * Removes control characters and normalizes whitespace
 * @param {string} input - User input string
 * @returns {string} Sanitized string
 */
export function sanitizeText(input) {
  if (typeof input !== 'string') {
    return input;
  }
  
  return input
    .replace(/[\x00-\x1F\x7F]/g, '') // Remove control characters
    .trim();
}

/**
 * Sanitize URL to prevent javascript: and data: URL attacks
 * @param {string} url - URL string
 * @returns {string|null} Sanitized URL or null if invalid
 */
export function sanitizeURL(url) {
  if (typeof url !== 'string') {
    return null;
  }
  
  const trimmedUrl = url.trim().toLowerCase();
  
  // Block dangerous protocols
  const dangerousProtocols = ['javascript:', 'data:', 'vbscript:', 'file:'];
  for (const protocol of dangerousProtocols) {
    if (trimmedUrl.startsWith(protocol)) {
      return null;
    }
  }
  
  // Only allow http, https, and relative URLs
  if (!trimmedUrl.startsWith('http://') && 
      !trimmedUrl.startsWith('https://') && 
      !trimmedUrl.startsWith('/')) {
    return null;
  }
  
  return url.trim();
}

/**
 * Validate and sanitize email address
 * @param {string} email - Email address
 * @returns {string} Sanitized email
 */
export function sanitizeEmail(email) {
  if (typeof email !== 'string') {
    return '';
  }
  
  return email.toLowerCase().trim();
}

/**
 * Sanitize object recursively
 * Applies appropriate sanitization based on field names
 * @param {Object} obj - Object to sanitize
 * @param {Object} options - Sanitization options
 * @returns {Object} Sanitized object
 */
export function sanitizeObject(obj, options = {}) {
  if (!obj || typeof obj !== 'object') {
    return obj;
  }
  
  const sanitized = {};
  
  for (const [key, value] of Object.entries(obj)) {
    if (value === null || value === undefined) {
      sanitized[key] = value;
      continue;
    }
    
    if (typeof value === 'string') {
      // Sanitize based on field name
      if (key.includes('email')) {
        sanitized[key] = sanitizeEmail(value);
      } else if (key.includes('url') || key.includes('link')) {
        sanitized[key] = sanitizeURL(value);
      } else if (key.includes('content') || key.includes('description') || key.includes('summary')) {
        // For content fields, we might want to allow some HTML
        // For now, we'll sanitize it
        sanitized[key] = sanitizeHTML(value);
      } else {
        sanitized[key] = sanitizeText(value);
      }
    } else if (typeof value === 'object' && !Array.isArray(value)) {
      sanitized[key] = sanitizeObject(value, options);
    } else {
      sanitized[key] = value;
    }
  }
  
  return sanitized;
}

/**
 * Middleware to sanitize request body
 * @param {Object} options - Sanitization options
 * @returns {Function} Express middleware
 */
export function sanitizeRequestBody(options = {}) {
  return (req, res, next) => {
    if (req.body && typeof req.body === 'object') {
      req.body = sanitizeObject(req.body, options);
    }
    next();
  };
}

/**
 * Validate that a string doesn't contain SQL injection patterns
 * This is a defense-in-depth measure; parameterized queries are the primary defense
 * @param {string} input - Input to check
 * @returns {boolean} True if input appears safe
 */
export function detectSQLInjection(input) {
  if (typeof input !== 'string') {
    return false;
  }
  
  // Common SQL injection patterns
  const sqlPatterns = [
    /(\b(SELECT|INSERT|UPDATE|DELETE|DROP|CREATE|ALTER|EXEC|EXECUTE)\b)/i,
    /(--|\;|\/\*|\*\/)/,
    /(\bOR\b.*=.*)/i,
    /(\bAND\b.*=.*)/i,
    /(UNION.*SELECT)/i,
    /(\'|\").*(\bOR\b|\bAND\b).*(\=|LIKE)/i
  ];
  
  for (const pattern of sqlPatterns) {
    if (pattern.test(input)) {
      return true; // Potential SQL injection detected
    }
  }
  
  return false;
}

/**
 * Middleware to detect potential SQL injection attempts
 * Logs suspicious requests and optionally blocks them
 * @param {Object} options - Options { block: boolean }
 * @returns {Function} Express middleware
 */
export function sqlInjectionDetector(options = { block: false }) {
  return (req, res, next) => {
    const checkObject = (obj, path = '') => {
      for (const [key, value] of Object.entries(obj)) {
        if (typeof value === 'string') {
          if (detectSQLInjection(value)) {
            console.warn(`⚠️  Potential SQL injection detected in ${path}${key}: ${value.substring(0, 100)}`);
            
            if (options.block) {
              return res.status(400).json({
                success: false,
                error: {
                  code: 'INVALID_INPUT',
                  message: 'Invalid input detected'
                }
              });
            }
          }
        } else if (typeof value === 'object' && value !== null) {
          const result = checkObject(value, `${path}${key}.`);
          if (result) return result;
        }
      }
    };
    
    // Check body, query, and params
    if (req.body) checkObject(req.body, 'body.');
    if (req.query) checkObject(req.query, 'query.');
    if (req.params) checkObject(req.params, 'params.');
    
    next();
  };
}
