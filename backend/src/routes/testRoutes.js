import express from 'express';
import { authGuard, permissionGuard, roleGuard } from '../middleware/index.js';

const router = express.Router();

/**
 * Test route - Protected by authentication only
 * Any authenticated user can access this
 */
router.get('/protected', authGuard, (req, res) => {
  res.json({
    success: true,
    message: 'You have accessed a protected route',
    user: {
      id: req.user.userId,
      email: req.user.email,
      role: req.user.role
    }
  });
});

/**
 * Test route - Protected by specific permission
 * Only users with 'read:news' permission can access
 */
router.get('/news-reader', authGuard, permissionGuard('read:news'), (req, res) => {
  res.json({
    success: true,
    message: 'You have read:news permission',
    user: {
      email: req.user.email,
      role: req.user.role
    }
  });
});

/**
 * Test route - Protected by admin role
 * Only admin users can access
 */
router.get('/admin-only', authGuard, roleGuard('admin'), (req, res) => {
  res.json({
    success: true,
    message: 'You are an admin',
    user: {
      email: req.user.email,
      role: req.user.role
    }
  });
});

export default router;
