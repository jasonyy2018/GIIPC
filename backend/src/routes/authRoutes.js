import express from 'express';
import { register, login } from '../controllers/authController.js';
import { validateRequest, registerSchema, loginSchema } from '../validators/authValidator.js';
import { loginRateLimiter, registerRateLimiter } from '../config/security.js';

const router = express.Router();

/**
 * POST /api/auth/register
 * Register a new user
 * 
 * Request body:
 * {
 *   "email": "user@example.com",
 *   "password": "SecurePass123!"
 * }
 * 
 * Response (201):
 * {
 *   "success": true,
 *   "message": "User registered successfully",
 *   "data": {
 *     "userId": 1,
 *     "email": "user@example.com",
 *     "role": "user"
 *   }
 * }
 */
router.post('/register', registerRateLimiter, validateRequest(registerSchema), register);

/**
 * POST /api/auth/login
 * Authenticate user and get JWT token
 * 
 * Request body:
 * {
 *   "email": "user@example.com",
 *   "password": "SecurePass123!"
 * }
 * 
 * Response (200):
 * {
 *   "success": true,
 *   "message": "Login successful",
 *   "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
 *   "user": {
 *     "id": 1,
 *     "email": "user@example.com",
 *     "role": "user"
 *   }
 * }
 */
router.post('/login', loginRateLimiter, validateRequest(loginSchema), login);

export default router;
