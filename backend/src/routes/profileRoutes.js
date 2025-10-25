import express from 'express';
import { getUserProfile, updateUserProfile } from '../controllers/profileController.js';
import { authGuard } from '../middleware/authMiddleware.js';
import { validateRequest, updateProfileSchema } from '../validators/profileValidator.js';

const router = express.Router();

/**
 * GET /api/profile
 * Get current user's profile
 * Requires authentication
 */
router.get('/', authGuard, getUserProfile);

/**
 * PUT /api/profile
 * Update current user's profile
 * Requires authentication
 */
router.put('/', authGuard, validateRequest(updateProfileSchema), updateUserProfile);

export default router;
