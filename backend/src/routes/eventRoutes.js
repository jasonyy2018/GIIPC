import express from 'express';
import {
  getEvents,
  getEventItem,
  createEventItem,
  updateEventItem,
  deleteEventItem,
  registerForEvent
} from '../controllers/eventController.js';
import { authGuard } from '../middleware/authMiddleware.js';
import { permissionGuard } from '../middleware/permissionMiddleware.js';
import {
  validateRequest,
  validateQuery,
  createEventSchema,
  updateEventSchema,
  paginationSchema,
  eventQuerySchema,
  eventRegistrationSchema
} from '../validators/eventValidator.js';

const router = express.Router();

/**
 * GET /api/events
 * Get all events with pagination, filtering, and sorting
 * Public access with read:events permission
 * 
 * Query parameters:
 * - page: Page number (default: 1)
 * - limit: Items per page (default: 10, max: 100)
 * - status: Filter by status - 'active', 'past', or 'all' (default: 'all')
 * - sortBy: Sort field - 'start_date', 'end_date', 'created_at', or 'date' (default: 'start_date')
 * - sortOrder: Sort order - 'asc' or 'desc' (default: 'desc')
 * 
 * Response (200):
 * {
 *   "success": true,
 *   "data": [
 *     {
 *       "id": 1,
 *       "title": "Innovation Workshop",
 *       "description": "...",
 *       "date": "2025-11-15",
 *       "start_date": "2025-11-15T09:00:00Z",
 *       "end_date": "2025-11-15T17:00:00Z",
 *       "location": "Conference Hall A",
 *       "capacity": 100,
 *       "status": "active",
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
  validateQuery(eventQuerySchema),
  getEvents
);

/**
 * POST /api/events/:id/register
 * Register for an event
 * Requires authentication
 * 
 * Request body (optional):
 * {
 *   "organization": "Company Name",
 *   "notes": "Additional information..."
 * }
 * 
 * Response (201):
 * {
 *   "success": true,
 *   "message": "Successfully registered for event",
 *   "data": {
 *     "id": 1,
 *     "event_id": 5,
 *     "user_id": 3,
 *     "organization": "Company Name",
 *     "notes": "Additional information...",
 *     "registered_at": "2025-10-21T10:00:00Z"
 *   }
 * }
 * 
 * Error Responses:
 * - 400: Invalid event ID, event is past, or event is full
 * - 404: Event not found
 * - 409: User already registered for this event
 */
router.post(
  '/:id/register',
  authGuard,
  validateRequest(eventRegistrationSchema),
  registerForEvent
);

/**
 * GET /api/events/:id
 * Get a single event by ID
 * Public access with read:events permission
 * 
 * Response (200):
 * {
 *   "success": true,
 *   "data": {
 *     "id": 1,
 *     "title": "Innovation Workshop",
 *     "description": "...",
 *     "date": "2025-11-15",
 *     "location": "Conference Hall A",
 *     "capacity": 100,
 *     "created_by": 1,
 *     "creator_email": "user@example.com",
 *     "created_at": "2025-10-15T10:00:00Z",
 *     "updated_at": "2025-10-15T10:00:00Z"
 *   }
 * }
 */
router.get(
  '/:id',
  getEventItem
);

/**
 * POST /api/events
 * Create a new event
 * Requires write:events permission
 * 
 * Request body:
 * {
 *   "title": "New Event",
 *   "description": "Event description...",
 *   "date": "2025-11-20",  // Optional, deprecated - kept for backward compatibility
 *   "start_date": "2025-11-20T09:00:00Z",  // Optional, ISO 8601 format
 *   "end_date": "2025-11-20T17:00:00Z",    // Optional, ISO 8601 format, must be >= start_date
 *   "location": "Main Hall",
 *   "capacity": 150
 * }
 * 
 * Response (201):
 * {
 *   "success": true,
 *   "message": "Event created successfully",
 *   "data": {
 *     "id": 2,
 *     "title": "New Event",
 *     "description": "Event description...",
 *     "date": "2025-11-20",
 *     "start_date": "2025-11-20T09:00:00Z",
 *     "end_date": "2025-11-20T17:00:00Z",
 *     "location": "Main Hall",
 *     "capacity": 150,
 *     "status": "active",
 *     "created_by": 1,
 *     "created_at": "2025-10-17T10:00:00Z",
 *     "updated_at": "2025-10-17T10:00:00Z"
 *   }
 * }
 */
router.post(
  '/',
  authGuard,
  permissionGuard('write:events'),
  validateRequest(createEventSchema),
  createEventItem
);

/**
 * PUT /api/events/:id
 * Update an event
 * Requires ownership or edit:events permission
 * 
 * Request body (all fields optional):
 * {
 *   "title": "Updated Title",
 *   "description": "Updated description...",
 *   "date": "2025-11-21",  // Optional, deprecated
 *   "start_date": "2025-11-21T09:00:00Z",  // Optional, ISO 8601 format
 *   "end_date": "2025-11-21T17:00:00Z",    // Optional, ISO 8601 format, must be >= start_date
 *   "location": "New Location",
 *   "capacity": 200
 * }
 * 
 * Response (200):
 * {
 *   "success": true,
 *   "message": "Event updated successfully",
 *   "data": {
 *     "id": 2,
 *     "title": "Updated Title",
 *     "start_date": "2025-11-21T09:00:00Z",
 *     "end_date": "2025-11-21T17:00:00Z",
 *     "status": "active",
 *     ...
 *   }
 * }
 */
router.put(
  '/:id',
  authGuard,
  validateRequest(updateEventSchema),
  updateEventItem
);

/**
 * DELETE /api/events/:id
 * Delete an event
 * Requires delete:events permission
 * 
 * Response (200):
 * {
 *   "success": true,
 *   "message": "Event deleted successfully"
 * }
 */
router.delete(
  '/:id',
  authGuard,
  permissionGuard('delete:events'),
  deleteEventItem
);

export default router;
