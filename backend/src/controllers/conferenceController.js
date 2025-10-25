import {
  getAllConferences,
  getConferenceById,
  createConference,
  updateConference,
  deleteConference,
  isConferenceCreator
} from '../repositories/conferenceRepository.js';
import { checkPermission } from '../services/roleService.js';
import { clearCache } from '../middleware/cacheMiddleware.js';

/**
 * Get all conferences with pagination, filtering, and sorting
 * GET /api/conferences
 * Public access with read:conferences permission
 */
export async function getConferences(req, res, next) {
  try {
    const { page, limit, status, sortBy, sortOrder } = req.query;
    
    const result = await getAllConferences({
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
 * Get a single conference by ID
 * GET /api/conferences/:id
 * Public access with read:conferences permission
 */
export async function getConferenceItem(req, res, next) {
  try {
    const conferenceId = parseInt(req.params.id, 10);
    
    if (isNaN(conferenceId)) {
      return res.status(400).json({
        success: false,
        error: {
          code: 'INVALID_ID',
          message: 'Invalid conference ID'
        }
      });
    }
    
    const conference = await getConferenceById(conferenceId);
    
    if (!conference) {
      return res.status(404).json({
        success: false,
        error: {
          code: 'NOT_FOUND',
          message: 'Conference not found'
        }
      });
    }
    
    res.status(200).json({
      success: true,
      data: conference
    });
  } catch (error) {
    next(error);
  }
}

/**
 * Create a new conference
 * POST /api/conferences
 * Requires write:conferences permission
 */
export async function createConferenceItem(req, res, next) {
  try {
    const conferenceData = req.body;
    const createdBy = req.user.userId;
    
    const conference = await createConference(conferenceData, createdBy);
    
    // Invalidate conferences cache
    clearCache('/api/conferences');
    
    res.status(201).json({
      success: true,
      message: 'Conference created successfully',
      data: conference
    });
  } catch (error) {
    next(error);
  }
}

/**
 * Update a conference
 * PUT /api/conferences/:id
 * Requires ownership or edit:conferences permission
 */
export async function updateConferenceItem(req, res, next) {
  try {
    const conferenceId = parseInt(req.params.id, 10);
    const updateData = req.body;
    const userId = req.user.userId;
    const roleId = req.user.roleId;
    
    if (isNaN(conferenceId)) {
      return res.status(400).json({
        success: false,
        error: {
          code: 'INVALID_ID',
          message: 'Invalid conference ID'
        }
      });
    }
    
    // Check if conference exists
    const existingConference = await getConferenceById(conferenceId);
    
    if (!existingConference) {
      return res.status(404).json({
        success: false,
        error: {
          code: 'NOT_FOUND',
          message: 'Conference not found'
        }
      });
    }
    
    // Check if user is the creator or has edit:conferences permission
    const isCreator = await isConferenceCreator(conferenceId, userId);
    const hasEditPermission = await checkPermission(roleId, 'edit:conferences');
    
    if (!isCreator && !hasEditPermission) {
      return res.status(403).json({
        success: false,
        error: {
          code: 'FORBIDDEN',
          message: 'You do not have permission to edit this conference'
        }
      });
    }
    
    const updatedConference = await updateConference(conferenceId, updateData);
    
    // Invalidate conferences cache
    clearCache('/api/conferences');
    
    res.status(200).json({
      success: true,
      message: 'Conference updated successfully',
      data: updatedConference
    });
  } catch (error) {
    next(error);
  }
}

/**
 * Delete a conference
 * DELETE /api/conferences/:id
 * Requires delete:conferences permission
 */
export async function deleteConferenceItem(req, res, next) {
  try {
    const conferenceId = parseInt(req.params.id, 10);
    
    if (isNaN(conferenceId)) {
      return res.status(400).json({
        success: false,
        error: {
          code: 'INVALID_ID',
          message: 'Invalid conference ID'
        }
      });
    }
    
    // Check if conference exists
    const existingConference = await getConferenceById(conferenceId);
    
    if (!existingConference) {
      return res.status(404).json({
        success: false,
        error: {
          code: 'NOT_FOUND',
          message: 'Conference not found'
        }
      });
    }
    
    const deleted = await deleteConference(conferenceId);
    
    if (!deleted) {
      return res.status(500).json({
        success: false,
        error: {
          code: 'DELETE_FAILED',
          message: 'Failed to delete conference'
        }
      });
    }
    
    // Invalidate conferences cache
    clearCache('/api/conferences');
    
    res.status(200).json({
      success: true,
      message: 'Conference deleted successfully'
    });
  } catch (error) {
    next(error);
  }
}
