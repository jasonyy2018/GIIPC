import express from 'express';
import {
  getNews,
  getNewsItem,
  createNewsItem,
  updateNewsItem,
  deleteNewsItem
} from '../controllers/newsController.js';
import { authGuard } from '../middleware/authMiddleware.js';
import { permissionGuard } from '../middleware/permissionMiddleware.js';
import {
  validateRequest,
  validateQuery,
  createNewsSchema,
  updateNewsSchema,
  paginationSchema
} from '../validators/newsValidator.js';

const router = express.Router();

/**
 * GET /api/news
 * Get all news with pagination
 * Public access with read:news permission
 * 
 * Query parameters:
 * - page: Page number (default: 1)
 * - limit: Items per page (default: 10, max: 100)
 * 
 * Response (200):
 * {
 *   "success": true,
 *   "data": [
 *     {
 *       "id": 1,
 *       "title": "Latest Innovation News",
 *       "content": "...",
 *       "image_url": "https://...",
 *       "published_date": "2025-10-15",
 *       "created_by": 1,
 *       "creator_email": "user@example.com",
 *       "created_at": "2025-10-15T10:00:00Z",
 *       "updated_at": "2025-10-15T10:00:00Z"
 *     }
 *   ],
 *   "pagination": {
 *     "page": 1,
 *     "limit": 10,
 *     "totalCount": 25,
 *     "totalPages": 3,
 *     "hasNextPage": true,
 *     "hasPreviousPage": false
 *   }
 * }
 */
router.get(
  '/',
  validateQuery(paginationSchema),
  getNews
);

/**
 * GET /api/news/:id
 * Get a single news item by ID
 * Public access with read:news permission
 * 
 * Response (200):
 * {
 *   "success": true,
 *   "data": {
 *     "id": 1,
 *     "title": "Latest Innovation News",
 *     "content": "...",
 *     "image_url": "https://...",
 *     "published_date": "2025-10-15",
 *     "created_by": 1,
 *     "creator_email": "user@example.com",
 *     "created_at": "2025-10-15T10:00:00Z",
 *     "updated_at": "2025-10-15T10:00:00Z"
 *   }
 * }
 */
router.get(
  '/:id',
  getNewsItem
);

/**
 * POST /api/news
 * Create a new news item
 * Requires write:news permission
 * 
 * Request body:
 * {
 *   "title": "New Article",
 *   "content": "Article content...",
 *   "image_url": "https://...",
 *   "published_date": "2025-10-17"
 * }
 * 
 * Response (201):
 * {
 *   "success": true,
 *   "message": "News created successfully",
 *   "data": {
 *     "id": 2,
 *     "title": "New Article",
 *     "content": "Article content...",
 *     "image_url": "https://...",
 *     "published_date": "2025-10-17",
 *     "created_by": 1,
 *     "created_at": "2025-10-17T10:00:00Z",
 *     "updated_at": "2025-10-17T10:00:00Z"
 *   }
 * }
 */
router.post(
  '/',
  authGuard,
  permissionGuard('write:news'),
  validateRequest(createNewsSchema),
  createNewsItem
);

/**
 * PUT /api/news/:id
 * Update a news item
 * Requires ownership or edit:news permission
 * 
 * Request body (all fields optional):
 * {
 *   "title": "Updated Title",
 *   "content": "Updated content...",
 *   "image_url": "https://...",
 *   "published_date": "2025-10-18"
 * }
 * 
 * Response (200):
 * {
 *   "success": true,
 *   "message": "News updated successfully",
 *   "data": {
 *     "id": 2,
 *     "title": "Updated Title",
 *     ...
 *   }
 * }
 */
router.put(
  '/:id',
  authGuard,
  validateRequest(updateNewsSchema),
  updateNewsItem
);

/**
 * DELETE /api/news/:id
 * Delete a news item
 * Requires delete:news permission
 * 
 * Response (200):
 * {
 *   "success": true,
 *   "message": "News deleted successfully"
 * }
 */
router.delete(
  '/:id',
  authGuard,
  permissionGuard('delete:news'),
  deleteNewsItem
);

export default router;
