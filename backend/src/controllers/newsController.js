import {
  getAllNews,
  getNewsById,
  createNews,
  updateNews,
  deleteNews,
  isNewsCreator
} from '../repositories/newsRepository.js';
import { checkPermission } from '../services/roleService.js';
import { clearCache } from '../middleware/cacheMiddleware.js';

/**
 * Get all news with pagination
 * GET /api/news
 * Public access with read:news permission
 */
export async function getNews(req, res, next) {
  try {
    const { page, limit } = req.query;
    
    const result = await getAllNews(page, limit);
    
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
 * Get a single news item by ID
 * GET /api/news/:id
 * Public access with read:news permission
 */
export async function getNewsItem(req, res, next) {
  try {
    const newsId = parseInt(req.params.id, 10);
    
    if (isNaN(newsId)) {
      return res.status(400).json({
        success: false,
        error: {
          code: 'INVALID_ID',
          message: 'Invalid news ID'
        }
      });
    }
    
    const news = await getNewsById(newsId);
    
    if (!news) {
      return res.status(404).json({
        success: false,
        error: {
          code: 'NOT_FOUND',
          message: 'News item not found'
        }
      });
    }
    
    res.status(200).json({
      success: true,
      data: news
    });
  } catch (error) {
    next(error);
  }
}

/**
 * Create a new news item
 * POST /api/news
 * Requires write:news permission
 */
export async function createNewsItem(req, res, next) {
  try {
    const newsData = req.body;
    const createdBy = req.user.userId;
    
    const news = await createNews(newsData, createdBy);
    
    // Invalidate news cache
    clearCache('/api/news');
    
    res.status(201).json({
      success: true,
      message: 'News created successfully',
      data: news
    });
  } catch (error) {
    next(error);
  }
}

/**
 * Update a news item
 * PUT /api/news/:id
 * Requires ownership or edit:news permission
 */
export async function updateNewsItem(req, res, next) {
  try {
    const newsId = parseInt(req.params.id, 10);
    const updateData = req.body;
    const userId = req.user.userId;
    const roleId = req.user.roleId;
    
    if (isNaN(newsId)) {
      return res.status(400).json({
        success: false,
        error: {
          code: 'INVALID_ID',
          message: 'Invalid news ID'
        }
      });
    }
    
    // Check if news exists
    const existingNews = await getNewsById(newsId);
    
    if (!existingNews) {
      return res.status(404).json({
        success: false,
        error: {
          code: 'NOT_FOUND',
          message: 'News item not found'
        }
      });
    }
    
    // Check if user is the creator or has edit:news permission
    const isCreator = await isNewsCreator(newsId, userId);
    const hasEditPermission = await checkPermission(roleId, 'edit:news');
    
    if (!isCreator && !hasEditPermission) {
      return res.status(403).json({
        success: false,
        error: {
          code: 'FORBIDDEN',
          message: 'You do not have permission to edit this news item'
        }
      });
    }
    
    const updatedNews = await updateNews(newsId, updateData);
    
    // Invalidate news cache
    clearCache('/api/news');
    
    res.status(200).json({
      success: true,
      message: 'News updated successfully',
      data: updatedNews
    });
  } catch (error) {
    next(error);
  }
}

/**
 * Delete a news item
 * DELETE /api/news/:id
 * Requires delete:news permission
 */
export async function deleteNewsItem(req, res, next) {
  try {
    const newsId = parseInt(req.params.id, 10);
    
    if (isNaN(newsId)) {
      return res.status(400).json({
        success: false,
        error: {
          code: 'INVALID_ID',
          message: 'Invalid news ID'
        }
      });
    }
    
    // Check if news exists
    const existingNews = await getNewsById(newsId);
    
    if (!existingNews) {
      return res.status(404).json({
        success: false,
        error: {
          code: 'NOT_FOUND',
          message: 'News item not found'
        }
      });
    }
    
    const deleted = await deleteNews(newsId);
    
    if (!deleted) {
      return res.status(500).json({
        success: false,
        error: {
          code: 'DELETE_FAILED',
          message: 'Failed to delete news item'
        }
      });
    }
    
    // Invalidate news cache
    clearCache('/api/news');
    
    res.status(200).json({
      success: true,
      message: 'News deleted successfully'
    });
  } catch (error) {
    next(error);
  }
}
