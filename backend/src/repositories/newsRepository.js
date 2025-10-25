import { query } from '../config/db.js';

/**
 * News Repository
 * Handles all database operations related to news
 */

/**
 * Get all news with pagination
 * @param {number} page - Page number (1-indexed)
 * @param {number} limit - Number of items per page
 * @returns {Promise<Object>} Object containing news array and pagination info
 */
export async function getAllNews(page = 1, limit = 10) {
  const offset = (page - 1) * limit;
  
  // Get total count
  const countResult = await query('SELECT COUNT(*) FROM news');
  const totalCount = parseInt(countResult.rows[0].count, 10);
  
  // Get paginated news
  const result = await query(
    `SELECT n.id, n.title, n.content, n.image_url, n.published_date, 
            n.created_by, n.created_at, n.updated_at,
            u.email as creator_email
     FROM news n
     LEFT JOIN users u ON n.created_by = u.id
     ORDER BY n.published_date DESC, n.created_at DESC
     LIMIT $1 OFFSET $2`,
    [limit, offset]
  );
  
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
 * Get a single news item by ID
 * @param {number} newsId - News ID
 * @returns {Promise<Object|null>} News object or null if not found
 */
export async function getNewsById(newsId) {
  const result = await query(
    `SELECT n.id, n.title, n.content, n.image_url, n.published_date,
            n.created_by, n.created_at, n.updated_at,
            u.email as creator_email
     FROM news n
     LEFT JOIN users u ON n.created_by = u.id
     WHERE n.id = $1`,
    [newsId]
  );
  
  return result.rows[0] || null;
}

/**
 * Create a new news item
 * @param {Object} newsData - News data
 * @param {string} newsData.title - News title
 * @param {string} newsData.content - News content
 * @param {string} newsData.image_url - Image URL (optional)
 * @param {string} newsData.published_date - Published date (YYYY-MM-DD)
 * @param {number} createdBy - User ID of the creator
 * @returns {Promise<Object>} Created news object
 */
export async function createNews(newsData, createdBy) {
  const { title, content, image_url, published_date } = newsData;
  
  const result = await query(
    `INSERT INTO news (title, content, image_url, published_date, created_by)
     VALUES ($1, $2, $3, $4, $5)
     RETURNING id, title, content, image_url, published_date, created_by, created_at, updated_at`,
    [title, content, image_url || null, published_date, createdBy]
  );
  
  return result.rows[0];
}

/**
 * Update a news item
 * @param {number} newsId - News ID
 * @param {Object} updateData - Fields to update
 * @returns {Promise<Object|null>} Updated news object or null if not found
 */
export async function updateNews(newsId, updateData) {
  // Build dynamic UPDATE query based on provided fields
  const fields = [];
  const values = [];
  let paramCount = 1;
  
  if (updateData.title !== undefined) {
    fields.push(`title = $${paramCount}`);
    values.push(updateData.title);
    paramCount++;
  }
  
  if (updateData.content !== undefined) {
    fields.push(`content = $${paramCount}`);
    values.push(updateData.content);
    paramCount++;
  }
  
  if (updateData.image_url !== undefined) {
    fields.push(`image_url = $${paramCount}`);
    values.push(updateData.image_url);
    paramCount++;
  }
  
  if (updateData.published_date !== undefined) {
    fields.push(`published_date = $${paramCount}`);
    values.push(updateData.published_date);
    paramCount++;
  }
  
  // Always update the updated_at timestamp
  fields.push(`updated_at = CURRENT_TIMESTAMP`);
  
  // Add newsId as the last parameter
  values.push(newsId);
  
  const result = await query(
    `UPDATE news
     SET ${fields.join(', ')}
     WHERE id = $${paramCount}
     RETURNING id, title, content, image_url, published_date, created_by, created_at, updated_at`,
    values
  );
  
  return result.rows[0] || null;
}

/**
 * Delete a news item
 * @param {number} newsId - News ID
 * @returns {Promise<boolean>} True if deleted, false if not found
 */
export async function deleteNews(newsId) {
  const result = await query(
    'DELETE FROM news WHERE id = $1 RETURNING id',
    [newsId]
  );
  
  return result.rows.length > 0;
}

/**
 * Check if a news item exists
 * @param {number} newsId - News ID
 * @returns {Promise<boolean>} True if exists, false otherwise
 */
export async function newsExists(newsId) {
  const result = await query(
    'SELECT 1 FROM news WHERE id = $1',
    [newsId]
  );
  
  return result.rows.length > 0;
}

/**
 * Check if a user is the creator of a news item
 * @param {number} newsId - News ID
 * @param {number} userId - User ID
 * @returns {Promise<boolean>} True if user is the creator, false otherwise
 */
export async function isNewsCreator(newsId, userId) {
  const result = await query(
    'SELECT 1 FROM news WHERE id = $1 AND created_by = $2',
    [newsId, userId]
  );
  
  return result.rows.length > 0;
}
