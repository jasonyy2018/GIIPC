import jwt from 'jsonwebtoken';
import { UnauthorizedError } from '../utils/errors.js';

const JWT_SECRET = process.env.JWT_SECRET;

/**
 * Authentication middleware - Validates JWT token
 * Extracts token from Authorization header, decodes it, and attaches user info to req.user
 * 
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 * @returns {void}
 */
export function authGuard(req, res, next) {
  try {
    // Extract token from Authorization header
    const authHeader = req.headers.authorization;
    
    if (!authHeader) {
      throw new UnauthorizedError('No authorization token provided');
    }
    
    // Check if header follows "Bearer <token>" format
    const parts = authHeader.split(' ');
    
    if (parts.length !== 2 || parts[0] !== 'Bearer') {
      throw new UnauthorizedError('Authorization header must be in format: Bearer <token>');
    }
    
    const token = parts[1];
    
    // Verify and decode JWT token
    // JWT errors (TokenExpiredError, JsonWebTokenError) will be caught by global error handler
    const decoded = jwt.verify(token, JWT_SECRET);
    
    // Attach user information to request object
    req.user = {
      userId: decoded.userId,
      email: decoded.email,
      roleId: decoded.roleId,
      role: decoded.role
    };
    
    // Continue to next middleware
    next();
    
  } catch (error) {
    // Pass error to global error handler
    next(error);
  }
}
