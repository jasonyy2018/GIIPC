import { query } from '../config/db.js';

/**
 * Conference Repository
 * Handles all database operations related to conferences
 */

/**
 * Get all conferences with pagination, filtering, and sorting
 * @param {Object} options - Query options
 * @param {number} options.page - Page number (1-indexed)
 * @param {number} options.limit - Number of items per page
 * @param {string} options.status - Filter by status: 'active', 'past', or 'all'
 * @param {string} options.sortBy - Sort field: 'start_date', 'end_date', or 'created_at'
 * @param {string} options.sortOrder - Sort order: 'asc' or 'desc'
 * @returns {Promise<Object>} Object containing conferences array and pagination info
 */
export async function getAllConferences(options = {}) {
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
    whereClause = 'WHERE (c.end_date IS NULL OR c.end_date >= CURRENT_TIMESTAMP)';
  } else if (status === 'past') {
    whereClause = 'WHERE c.end_date < CURRENT_TIMESTAMP';
  }
  
  // Get total count with filter
  const countQuery = `SELECT COUNT(*) FROM conferences c ${whereClause}`;
  const countResult = await query(countQuery);
  const totalCount = parseInt(countResult.rows[0].count, 10);
  
  // Build ORDER BY clause
  const validSortFields = {
    'start_date': 'c.start_date',
    'end_date': 'c.end_date',
    'created_at': 'c.created_at'
  };
  
  const sortField = validSortFields[sortBy] || 'c.start_date';
  const order = sortOrder.toUpperCase() === 'ASC' ? 'ASC' : 'DESC';

  // Get paginated conferences with computed status
  const dataQuery = `
    SELECT c.id, c.title, c.description, c.date_range, c.start_date, c.end_date,
           c.location, c.summary,
           c.created_by, c.created_at, c.updated_at,
           u.email as creator_email,
           CASE 
             WHEN c.end_date IS NULL OR c.end_date >= CURRENT_TIMESTAMP THEN 'active'
             ELSE 'past'
           END as status
    FROM conferences c
    LEFT JOIN users u ON c.created_by = u.id
    ${whereClause}
    ORDER BY ${sortField} ${order}, c.created_at DESC
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
 * Get a single conference by ID
 * @param {number} conferenceId - Conference ID
 * @returns {Promise<Object|null>} Conference object or null if not found
 */
export async function getConferenceById(conferenceId) {
  const result = await query(
    `SELECT c.id, c.title, c.description, c.date_range, c.start_date, c.end_date,
            c.location, c.summary,
            c.created_by, c.created_at, c.updated_at,
            u.email as creator_email,
            CASE 
              WHEN c.end_date IS NULL OR c.end_date >= CURRENT_TIMESTAMP THEN 'active'
              ELSE 'past'
            END as status
     FROM conferences c
     LEFT JOIN users u ON c.created_by = u.id
     WHERE c.id = $1`,
    [conferenceId]
  );
  
  return result.rows[0] || null;
}

/**
 * Create a new conference
 * @param {Object} conferenceData - Conference data
 * @param {string} conferenceData.title - Conference title
 * @param {string} conferenceData.description - Conference description
 * @param {string} conferenceData.date_range - Date range (e.g., "Oct 15-17, 2025") - deprecated, kept for backward compatibility
 * @param {string} conferenceData.start_date - Conference start date and time (ISO 8601)
 * @param {string} conferenceData.end_date - Conference end date and time (ISO 8601)
 * @param {string} conferenceData.location - Conference location
 * @param {string} conferenceData.summary - Conference summary (optional)
 * @param {number} createdBy - User ID of the creator
 * @returns {Promise<Object>} Created conference object
 */
export async function createConference(conferenceData, createdBy) {
  const { title, description, date_range, start_date, end_date, location, summary } = conferenceData;
  
  const result = await query(
    `INSERT INTO conferences (title, description, date_range, start_date, end_date, location, summary, created_by)
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
     RETURNING id, title, description, date_range, start_date, end_date, location, summary, 
               created_by, created_at, updated_at`,
    [title, description, date_range || null, start_date || null, end_date || null, location, summary || null, createdBy]
  );
  
  // Add computed status to the returned object
  const conference = result.rows[0];
  conference.status = (conference.end_date === null || new Date(conference.end_date) >= new Date()) ? 'active' : 'past';
  
  return conference;
}

/**
 * Update a conference
 * @param {number} conferenceId - Conference ID
 * @param {Object} updateData - Fields to update
 * @returns {Promise<Object|null>} Updated conference object or null if not found
 */
export async function updateConference(conferenceId, updateData) {
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
  
  if (updateData.date_range !== undefined) {
    fields.push('date_range = $' + paramCount);
    values.push(updateData.date_range);
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
  
  if (updateData.summary !== undefined) {
    fields.push('summary = $' + paramCount);
    values.push(updateData.summary);
    paramCount++;
  }
  
  // Always update the updated_at timestamp
  fields.push('updated_at = CURRENT_TIMESTAMP');
  
  // Add conferenceId as the last parameter
  values.push(conferenceId);
  
  const result = await query(
    'UPDATE conferences SET ' + fields.join(', ') + ' WHERE id = $' + paramCount + 
    ' RETURNING id, title, description, date_range, start_date, end_date, location, summary, created_by, created_at, updated_at',
    values
  );
  
  // Add computed status to the returned object
  if (result.rows[0]) {
    const conference = result.rows[0];
    conference.status = (conference.end_date === null || new Date(conference.end_date) >= new Date()) ? 'active' : 'past';
    return conference;
  }
  
  return null;
}

/**
 * Delete a conference
 * @param {number} conferenceId - Conference ID
 * @returns {Promise<boolean>} True if deleted, false if not found
 */
export async function deleteConference(conferenceId) {
  const result = await query(
    'DELETE FROM conferences WHERE id = $1 RETURNING id',
    [conferenceId]
  );
  
  return result.rows.length > 0;
}

/**
 * Check if a conference exists
 * @param {number} conferenceId - Conference ID
 * @returns {Promise<boolean>} True if exists, false otherwise
 */
export async function conferenceExists(conferenceId) {
  const result = await query(
    'SELECT 1 FROM conferences WHERE id = $1',
    [conferenceId]
  );
  
  return result.rows.length > 0;
}

/**
 * Check if a user is the creator of a conference
 * @param {number} conferenceId - Conference ID
 * @param {number} userId - User ID
 * @returns {Promise<boolean>} True if user is the creator, false otherwise
 */
export async function isConferenceCreator(conferenceId, userId) {
  const result = await query(
    'SELECT 1 FROM conferences WHERE id = $1 AND created_by = $2',
    [conferenceId, userId]
  );
  
  return result.rows.length > 0;
}
