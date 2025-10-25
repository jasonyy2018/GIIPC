import { query } from '../config/db.js';

/**
 * Event Repository
 * Handles all database operations related to events
 */

/**
 * Get all events with pagination, filtering, and sorting
 * @param {Object} options - Query options
 * @param {number} options.page - Page number (1-indexed)
 * @param {number} options.limit - Number of items per page
 * @param {string} options.status - Filter by status: 'active', 'past', or 'all'
 * @param {string} options.sortBy - Sort field: 'start_date', 'end_date', 'created_at', or 'date'
 * @param {string} options.sortOrder - Sort order: 'asc' or 'desc'
 * @returns {Promise<Object>} Object containing events array and pagination info
 */
export async function getAllEvents(options = {}) {
  const {
    page = 1,
    limit = 10,
    status = 'all',
    sortBy = 'start_date',
    sortOrder = 'desc'
  } = options;
  
  const offset = (page - 1) * limit;
  
  // Build WHERE clause based on status filter
  let whereClause = '';
  const queryParams = [];
  
  if (status === 'active') {
    whereClause = 'WHERE (e.end_date IS NULL OR e.end_date >= CURRENT_TIMESTAMP)';
  } else if (status === 'past') {
    whereClause = 'WHERE e.end_date < CURRENT_TIMESTAMP';
  }
  
  // Get total count with filter
  const countQuery = `SELECT COUNT(*) FROM events e ${whereClause}`;
  const countResult = await query(countQuery);
  const totalCount = parseInt(countResult.rows[0].count, 10);
  
  // Build ORDER BY clause
  const validSortFields = {
    'start_date': 'e.start_date',
    'end_date': 'e.end_date',
    'created_at': 'e.created_at',
    'date': 'e.date'
  };
  
  const sortField = validSortFields[sortBy] || 'e.start_date';
  const order = sortOrder.toUpperCase() === 'ASC' ? 'ASC' : 'DESC';

  // Get paginated events with computed status
  const dataQuery = `
    SELECT e.id, e.title, e.description, e.date, e.start_date, e.end_date, 
           e.location, e.capacity,
           e.created_by, e.created_at, e.updated_at,
           u.email as creator_email,
           CASE 
             WHEN e.end_date IS NULL OR e.end_date >= CURRENT_TIMESTAMP THEN 'active'
             ELSE 'past'
           END as status
    FROM events e
    LEFT JOIN users u ON e.created_by = u.id
    ${whereClause}
    ORDER BY ${sortField} ${order}, e.created_at DESC
    LIMIT $1 OFFSET $2
  `;
  
  queryParams.push(limit, offset);
  const result = await query(dataQuery, queryParams);
  
  return {
    data: result.rows,
    pagination: {
      page,
      limit,
      totalCount,
      totalPages: Math.ceil(totalCount / limit),
      hasNextPage: page < Math.ceil(totalCount / limit),
      hasPreviousPage: page > 1
    }
  };
}

/**
 * Get a single event by ID
 * @param {number} eventId - Event ID
 * @returns {Promise<Object|null>} Event object or null if not found
 */
export async function getEventById(eventId) {
  const result = await query(
    `SELECT e.id, e.title, e.description, e.date, e.start_date, e.end_date,
            e.location, e.capacity,
            e.created_by, e.created_at, e.updated_at,
            u.email as creator_email,
            CASE 
              WHEN e.end_date IS NULL OR e.end_date >= CURRENT_TIMESTAMP THEN 'active'
              ELSE 'past'
            END as status
     FROM events e
     LEFT JOIN users u ON e.created_by = u.id
     WHERE e.id = $1`,
    [eventId]
  );
  
  return result.rows[0] || null;
}

/**
 * Create a new event
 * @param {Object} eventData - Event data
 * @param {string} eventData.title - Event title
 * @param {string} eventData.description - Event description
 * @param {string} eventData.date - Event date (YYYY-MM-DD) - deprecated, kept for backward compatibility
 * @param {string} eventData.start_date - Event start date and time (ISO 8601)
 * @param {string} eventData.end_date - Event end date and time (ISO 8601)
 * @param {string} eventData.location - Event location
 * @param {number} eventData.capacity - Event capacity (optional)
 * @param {number} createdBy - User ID of the creator
 * @returns {Promise<Object>} Created event object
 */
export async function createEvent(eventData, createdBy) {
  const { title, description, date, start_date, end_date, location, capacity } = eventData;
  
  const result = await query(
    `INSERT INTO events (title, description, date, start_date, end_date, location, capacity, created_by)
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
     RETURNING id, title, description, date, start_date, end_date, location, capacity, 
               created_by, created_at, updated_at`,
    [title, description, date || null, start_date || null, end_date || null, location, capacity || null, createdBy]
  );
  
  // Add computed status to the returned object
  const event = result.rows[0];
  event.status = (event.end_date === null || new Date(event.end_date) >= new Date()) ? 'active' : 'past';
  
  return event;
}

/**
 * Update an event
 * @param {number} eventId - Event ID
 * @param {Object} updateData - Fields to update
 * @returns {Promise<Object|null>} Updated event object or null if not found
 */
export async function updateEvent(eventId, updateData) {
  // Build dynamic UPDATE query based on provided fields
  const fields = [];
  const values = [];
  let paramCount = 1;
  
  if (updateData.title !== undefined) {
    fields.push('title = $' + paramCount);
    values.push(updateData.title);
    paramCount++;
  }
  
  if (updateData.description !== undefined) {
    fields.push('description = $' + paramCount);
    values.push(updateData.description);
    paramCount++;
  }
  
  if (updateData.date !== undefined) {
    fields.push('date = $' + paramCount);
    values.push(updateData.date);
    paramCount++;
  }
  
  if (updateData.start_date !== undefined) {
    fields.push('start_date = $' + paramCount);
    values.push(updateData.start_date);
    paramCount++;
  }
  
  if (updateData.end_date !== undefined) {
    fields.push('end_date = $' + paramCount);
    values.push(updateData.end_date);
    paramCount++;
  }
  
  if (updateData.location !== undefined) {
    fields.push('location = $' + paramCount);
    values.push(updateData.location);
    paramCount++;
  }
  
  if (updateData.capacity !== undefined) {
    fields.push('capacity = $' + paramCount);
    values.push(updateData.capacity);
    paramCount++;
  }
  
  // Always update the updated_at timestamp
  fields.push('updated_at = CURRENT_TIMESTAMP');
  
  // Add eventId as the last parameter
  values.push(eventId);
  
  const result = await query(
    'UPDATE events SET ' + fields.join(', ') + ' WHERE id = $' + paramCount + 
    ' RETURNING id, title, description, date, start_date, end_date, location, capacity, created_by, created_at, updated_at',
    values
  );
  
  // Add computed status to the returned object
  if (result.rows[0]) {
    const event = result.rows[0];
    event.status = (event.end_date === null || new Date(event.end_date) >= new Date()) ? 'active' : 'past';
    return event;
  }
  
  return null;
}

/**
 * Delete an event
 * @param {number} eventId - Event ID
 * @returns {Promise<boolean>} True if deleted, false if not found
 */
export async function deleteEvent(eventId) {
  const result = await query(
    'DELETE FROM events WHERE id = $1 RETURNING id',
    [eventId]
  );
  
  return result.rows.length > 0;
}

/**
 * Check if an event exists
 * @param {number} eventId - Event ID
 * @returns {Promise<boolean>} True if exists, false otherwise
 */
export async function eventExists(eventId) {
  const result = await query(
    'SELECT 1 FROM events WHERE id = $1',
    [eventId]
  );
  
  return result.rows.length > 0;
}

/**
 * Check if a user is the creator of an event
 * @param {number} eventId - Event ID
 * @param {number} userId - User ID
 * @returns {Promise<boolean>} True if user is the creator, false otherwise
 */
export async function isEventCreator(eventId, userId) {
  const result = await query(
    'SELECT 1 FROM events WHERE id = $1 AND created_by = $2',
    [eventId, userId]
  );
  
  return result.rows.length > 0;
}

/**
 * Register a user for an event
 * @param {number} eventId - Event ID
 * @param {number} userId - User ID
 * @param {Object} registrationData - Registration data
 * @param {string} registrationData.organization - User organization (optional)
 * @param {string} registrationData.notes - Additional notes (optional)
 * @returns {Promise<Object>} Created registration object
 */
export async function registerUserForEvent(eventId, userId, registrationData = {}) {
  const { organization, notes } = registrationData;
  
  const result = await query(
    `INSERT INTO event_registrations (event_id, user_id, organization, notes)
     VALUES ($1, $2, $3, $4)
     RETURNING id, event_id, user_id, organization, notes, registered_at`,
    [eventId, userId, organization || null, notes || null]
  );
  
  return result.rows[0];
}

/**
 * Check if a user is already registered for an event
 * @param {number} eventId - Event ID
 * @param {number} userId - User ID
 * @returns {Promise<boolean>} True if user is registered, false otherwise
 */
export async function isUserRegisteredForEvent(eventId, userId) {
  const result = await query(
    'SELECT 1 FROM event_registrations WHERE event_id = $1 AND user_id = $2',
    [eventId, userId]
  );
  
  return result.rows.length > 0;
}

/**
 * Get registration count for an event
 * @param {number} eventId - Event ID
 * @returns {Promise<number>} Number of registrations
 */
export async function getEventRegistrationCount(eventId) {
  const result = await query(
    'SELECT COUNT(*) FROM event_registrations WHERE event_id = $1',
    [eventId]
  );
  
  return parseInt(result.rows[0].count, 10);
}
