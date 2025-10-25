/**
 * Global Error Handling Middleware for GIIP Backend API
 * Handles all errors and returns standardized error responses
 */

import { ApiError } from '../utils/errors.js';
import { logError } from '../utils/logger.js';
import { ZodError } from 'zod';

/**
 * Handle Zod validation errors
 */
function handleZodError(error) {
  const details = error.errors.map(err => ({
    field: err.path.join('.'),
    message: err.message,
    code: err.code
  }));
  
  return {
    statusCode: 400,
    code: 'VALIDATION_ERROR',
    message: 'Input validation failed',
    details
  };
}

/**
 * Handle PostgreSQL errors
 */
function handleDatabaseError(error) {
  // Unique constraint violation
  if (error.code === '23505') {
    const field = error.detail?.match(/Key \((\w+)\)/)?.[1] || 'field';
    return {
      statusCode: 409,
      code: 'CONFLICT',
      message: `${field} already exists`,
      details: null
    };
  }
  
  // Foreign key constraint violation
  if (error.code === '23503') {
    return {
      statusCode: 400,
      code: 'VALIDATION_ERROR',
      message: 'Referenced resource does not exist',
      details: null
    };
  }
  
  // Not null constraint violation
  if (error.code === '23502') {
    const field = error.column || 'field';
    return {
      statusCode: 400,
      code: 'VALIDATION_ERROR',
      message: `${field} is required`,
      details: null
    };
  }
  
  // Generic database error
  return {
    statusCode: 500,
    code: 'DATABASE_ERROR',
    message: 'Database operation failed',
    details: null
  };
}

/**
 * Handle JWT errors
 */
function handleJWTError(error) {
  if (error.name === 'TokenExpiredError') {
    return {
      statusCode: 401,
      code: 'TOKEN_EXPIRED',
      message: 'Authentication token has expired',
      details: null
    };
  }
  
  if (error.name === 'JsonWebTokenError') {
    return {
      statusCode: 401,
      code: 'INVALID_TOKEN',
      message: 'Invalid authentication token',
      details: null
    };
  }
  
  return {
    statusCode: 401,
    code: 'AUTHENTICATION_ERROR',
    message: 'Authentication failed',
    details: null
  };
}

/**
 * Global error handler middleware
 * Must be placed after all routes
 */
export function errorHandler(err, req, res, next) {
  // Log the error
  logError(err, req);
  
  let statusCode = 500;
  let code = 'INTERNAL_ERROR';
  let message = 'An unexpected error occurred';
  let details = null;
  
  // Handle ApiError instances (our custom errors)
  if (err instanceof ApiError) {
    statusCode = err.statusCode;
    code = err.code;
    message = err.message;
    details = err.details;
  }
  // Handle Zod validation errors
  else if (err instanceof ZodError) {
    const zodError = handleZodError(err);
    statusCode = zodError.statusCode;
    code = zodError.code;
    message = zodError.message;
    details = zodError.details;
  }
  // Handle JWT errors
  else if (err.name === 'TokenExpiredError' || err.name === 'JsonWebTokenError') {
    const jwtError = handleJWTError(err);
    statusCode = jwtError.statusCode;
    code = jwtError.code;
    message = jwtError.message;
  }
  // Handle PostgreSQL errors
  else if (err.code && err.code.startsWith('23')) {
    const dbError = handleDatabaseError(err);
    statusCode = dbError.statusCode;
    code = dbError.code;
    message = dbError.message;
    details = dbError.details;
  }
  // Handle other known errors
  else if (err.statusCode) {
    statusCode = err.statusCode;
    code = err.code || 'ERROR';
    message = err.message;
  }
  // Handle programming errors (don't expose details in production)
  else {
    if (process.env.NODE_ENV === 'production') {
      message = 'An unexpected error occurred';
    } else {
      message = err.message || 'An unexpected error occurred';
      details = {
        stack: err.stack
      };
    }
  }
  
  // Send error response
  const response = {
    success: false,
    error: {
      code,
      message
    }
  };
  
  // Include details if available
  if (details) {
    response.error.details = details;
  }
  
  res.status(statusCode).json(response);
}

/**
 * 404 Not Found handler
 * Must be placed before error handler but after all routes
 */
export function notFoundHandler(req, res, next) {
  res.status(404).json({
    success: false,
    error: {
      code: 'NOT_FOUND',
      message: `Cannot ${req.method} ${req.originalUrl || req.url}`
    }
  });
}

/**
 * Async handler wrapper to catch errors in async route handlers
 * Usage: router.get('/path', asyncHandler(async (req, res) => { ... }))
 */
export function asyncHandler(fn) {
  return (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
}
