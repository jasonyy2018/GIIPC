import express from 'express';
import {
  getConferences,
  getConferenceItem,
  createConferenceItem,
  updateConferenceItem,
  deleteConferenceItem
} from '../controllers/conferenceController.js';
import { authGuard } from '../middleware/authMiddleware.js';
import { permissionGuard } from '../middleware/permissionMiddleware.js';
import {
  validateRequest,
  validateQuery,
  createConferenceSchema,
  updateConferenceSchema,
  paginationSchema,
  conferenceQuerySchema
} from '../validators/conferenceValidator.js';

const router = express.Router();

/**
 * GET /api/conferences
 * Get all conferences with pagination, filtering, and sorting
 * Public access with read:conferences permission
 * 
 * Query parameters:
 * - page: Page number (default: 1)
 * - limit: Items per page (default: 10, max: 100)
 * - status: Filter by status - 'active', 'past', or 'all' (default: 'all')
 * - sortBy: Sort field - 'start_date', 'end_date', or 'created_at' (default: 'start_date')
 * - sortOrder: Sort order - 'asc' or 'desc' (default: 'desc')
 * 
 * Response (200):
 * {
 *   "success": true,
 *   "data": [
 *     {
 *       "id": 1,
 *       "title": "Global Innovation Summit 2025",
 *       "description": "...",
 *       "date_range": "Oct 15-17, 2025",
 *       "start_date": "2025-10-15T08:00:00Z",
 *       "end_date": "2025-10-17T18:00:00Z",
 *       "location": "San Francisco, CA",
 *       "summary": "...",
 *       "status": "active",
 *       "created_by": 1,
 *       "creator_email": "user@example.com",
 *       "created_at": "2025-10-01T10:00:00Z",
 *       "updated_at": "2025-10-01T10:00:00Z"
 *     }
 *   ],
 *   "pagination": {
 *     "page": 1,
 *     "limit": 10,
 *     "totalCount": 5,
 *     "totalPages": 1,
 *     "hasNextPage": false,
 *     "hasPreviousPage": false
 *   }
 * }
 */
router.get(
  '/',
  validateQuery(conferenceQuerySchema),
  getConferences
);

/**
 * GET /api/conferences/:id
 * Get a single conference by ID
 * Public access with read:conferences permission
 * 
 * Response (200):
 * {
 *   "success": true,
 *   "data": {
 *     "id": 1,
 *     "title": "Global Innovation Summit 2025",
 *     "description": "...",
 *     "date_range": "Oct 15-17, 2025",
 *     "location": "San Francisco, CA",
 *     "summary": "...",
 *     "created_by": 1,
 *     "creator_email": "user@example.com",
 *     "created_at": "2025-10-01T10:00:00Z",
 *     "updated_at": "2025-10-01T10:00:00Z"
 *   }
 * }
 */
router.get(
  '/:id',
  getConferenceItem
);

/**
 * POST /api/conferences
 * Create a new conference
 * Requires write:conferences permission
 * 
 * Request body:
 * {
 *   "title": "Global Innovation Summit 2025",
 *   "description": "A premier conference...",
 *   "date_range": "Oct 15-17, 2025",
 *   "location": "San Francisco, CA",
 *   "summary": "Key topics include..."
 * }
 * 
 * Response (201):
 * {
 *   "success": true,
 *   "message": "Conference created successfully",
 *   "data": {
 *     "id": 2,
 *     "title": "Global Innovation Summit 2025",
 *     "description": "A premier conference...",
 *     "date_range": "Oct 15-17, 2025",
 *     "location": "San Francisco, CA",
 *     "summary": "Key topics include...",
 *     "created_by": 1,
 *     "created_at": "2025-10-17T10:00:00Z",
 *     "updated_at": "2025-10-17T10:00:00Z"
 *   }
 * }
 */
router.post(
  '/',
  authGuard,
  permissionGuard('write:conferences'),
  validateRequest(createConferenceSchema),
  createConferenceItem
);

/**
 * PUT /api/conferences/:id
 * Update a conference
 * Requires ownership or edit:conferences permission
 * 
 * Request body (all fields optional):
 * {
 *   "title": "Updated Title",
 *   "description": "Updated description...",
 *   "date_range": "Oct 20-22, 2025",
 *   "location": "New York, NY",
 *   "summary": "Updated summary..."
 * }
 * 
 * Response (200):
 * {
 *   "success": true,
 *   "message": "Conference updated successfully",
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
  validateRequest(updateConferenceSchema),
  updateConferenceItem
);

/**
 * DELETE /api/conferences/:id
 * Delete a conference
 * Requires delete:conferences permission
 * 
 * Response (200):
 * {
 *   "success": true,
 *   "message": "Conference deleted successfully"
 * }
 */
router.delete(
  '/:id',
  authGuard,
  permissionGuard('delete:conferences'),
  deleteConferenceItem
);

export default router;
