import {
  getAllEvents,
  getEventById,
  createEvent,
  updateEvent,
  deleteEvent,
  isEventCreator,
  registerUserForEvent,
  isUserRegisteredForEvent,
  getEventRegistrationCount
} from '../repositories/eventRepository.js';
import { checkPermission } from '../services/roleService.js';
import { clearCache } from '../middleware/cacheMiddleware.js';

/**
 * Get all events with pagination, filtering, and sorting
 * GET /api/events
 * Public access with read:events permission
 */
export async function getEvents(req, res, next) {
  try {
    const { page, limit, status, sortBy, sortOrder } = req.query;
    
    const result = await getAllEvents({
      page,
      limit,
      status,
      sortBy,
      sortOrder
    });
    
    res.status(200).json({
      success: true,
      data: result.data,
      pagination: result.pagination
    });
  } catch (error) {
    next(error);
  }
}

/**
 * Get a single event by ID
 * GET /api/events/:id
 * Public access with read:events permission
 */
export async function getEventItem(req, res, next) {
  try {
    const eventId = parseInt(req.params.id, 10);
    
    if (isNaN(eventId)) {
      return res.status(400).json({
        success: false,
        error: {
          code: 'INVALID_ID',
          message: 'Invalid event ID'
        }
      });
    }
    
    const event = await getEventById(eventId);
    
    if (!event) {
      return res.status(404).json({
        success: false,
        error: {
          code: 'NOT_FOUND',
          message: 'Event not found'
        }
      });
    }
    
    res.status(200).json({
      success: true,
      data: event
    });
  } catch (error) {
    next(error);
  }
}

/**
 * Create a new event
 * POST /api/events
 * Requires write:events permission
 */
export async function createEventItem(req, res, next) {
  try {
    const eventData = req.body;
    const createdBy = req.user.userId;
    
    const event = await createEvent(eventData, createdBy);
    
    // Invalidate events cache
    clearCache('/api/events');
    
    res.status(201).json({
      success: true,
      message: 'Event created successfully',
      data: event
    });
  } catch (error) {
    next(error);
  }
}

/**
 * Update an event
 * PUT /api/events/:id
 * Requires ownership or edit:events permission
 */
export async function updateEventItem(req, res, next) {
  try {
    const eventId = parseInt(req.params.id, 10);
    const updateData = req.body;
    const userId = req.user.userId;
    const roleId = req.user.roleId;
    
    if (isNaN(eventId)) {
      return res.status(400).json({
        success: false,
        error: {
          code: 'INVALID_ID',
          message: 'Invalid event ID'
        }
      });
    }
    
    // Check if event exists
    const existingEvent = await getEventById(eventId);
    
    if (!existingEvent) {
      return res.status(404).json({
        success: false,
        error: {
          code: 'NOT_FOUND',
          message: 'Event not found'
        }
      });
    }
    
    // Check if user is the creator or has edit:events permission
    const isCreator = await isEventCreator(eventId, userId);
    const hasEditPermission = await checkPermission(roleId, 'edit:events');
    
    if (!isCreator && !hasEditPermission) {
      return res.status(403).json({
        success: false,
        error: {
          code: 'FORBIDDEN',
          message: 'You do not have permission to edit this event'
        }
      });
    }
    
    const updatedEvent = await updateEvent(eventId, updateData);
    
    // Invalidate events cache
    clearCache('/api/events');
    
    res.status(200).json({
      success: true,
      message: 'Event updated successfully',
      data: updatedEvent
    });
  } catch (error) {
    next(error);
  }
}

/**
 * Delete an event
 * DELETE /api/events/:id
 * Requires delete:events permission
 */
export async function deleteEventItem(req, res, next) {
  try {
    const eventId = parseInt(req.params.id, 10);
    
    if (isNaN(eventId)) {
      return res.status(400).json({
        success: false,
        error: {
          code: 'INVALID_ID',
          message: 'Invalid event ID'
        }
      });
    }
    
    // Check if event exists
    const existingEvent = await getEventById(eventId);
    
    if (!existingEvent) {
      return res.status(404).json({
        success: false,
        error: {
          code: 'NOT_FOUND',
          message: 'Event not found'
        }
      });
    }
    
    const deleted = await deleteEvent(eventId);
    
    if (!deleted) {
      return res.status(500).json({
        success: false,
        error: {
          code: 'DELETE_FAILED',
          message: 'Failed to delete event'
        }
      });
    }
    
    // Invalidate events cache
    clearCache('/api/events');
    
    res.status(200).json({
      success: true,
      message: 'Event deleted successfully'
    });
  } catch (error) {
    next(error);
  }
}

/**
 * Register for an event
 * POST /api/events/:id/register
 * Requires authentication
 */
export async function registerForEvent(req, res, next) {
  try {
    const eventId = parseInt(req.params.id, 10);
    const userId = req.user.userId;
    const registrationData = req.body;
    
    if (isNaN(eventId)) {
      return res.status(400).json({
        success: false,
        error: {
          code: 'INVALID_ID',
          message: 'Invalid event ID'
        }
      });
    }
    
    // Check if event exists
    const event = await getEventById(eventId);
    
    if (!event) {
      return res.status(404).json({
        success: false,
        error: {
          code: 'NOT_FOUND',
          message: 'Event not found'
        }
      });
    }
    
    // Check if event is still active (not past)
    if (event.status === 'past') {
      return res.status(400).json({
        success: false,
        error: {
          code: 'EVENT_PAST',
          message: 'Cannot register for past events'
        }
      });
    }
    
    // Check if user is already registered
    const alreadyRegistered = await isUserRegisteredForEvent(eventId, userId);
    
    if (alreadyRegistered) {
      return res.status(409).json({
        success: false,
        error: {
          code: 'ALREADY_REGISTERED',
          message: 'You are already registered for this event'
        }
      });
    }
    
    // Check if event is at capacity
    if (event.capacity) {
      const registrationCount = await getEventRegistrationCount(eventId);
      
      if (registrationCount >= event.capacity) {
        return res.status(400).json({
          success: false,
          error: {
            code: 'EVENT_FULL',
            message: 'Event has reached maximum capacity'
          }
        });
      }
    }
    
    // Register user for event
    const registration = await registerUserForEvent(eventId, userId, registrationData);
    
    res.status(201).json({
      success: true,
      message: 'Successfully registered for event',
      data: {
        id: registration.id,
        event_id: registration.event_id,
        user_id: registration.user_id,
        organization: registration.organization,
        notes: registration.notes,
        registered_at: registration.registered_at
      }
    });
  } catch (error) {
    // Handle unique constraint violation (duplicate registration)
    if (error.code === '23505') {
      return res.status(409).json({
        success: false,
        error: {
          code: 'ALREADY_REGISTERED',
          message: 'You are already registered for this event'
        }
      });
    }
    
    next(error);
  }
}
