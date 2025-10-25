import { getProfile, updateProfile } from '../repositories/userRepository.js';
import { NotFoundError } from '../utils/errors.js';

export async function getUserProfile(req, res, next) {
  try {
    const userId = req.user.userId;
    const profile = await getProfile(userId);
    
    if (!profile) {
      throw new NotFoundError('User profile not found');
    }
    
    res.json({
      success: true,
      data: profile
    });
  } catch (error) {
    next(error);
  }
}

export async function updateUserProfile(req, res, next) {
  try {
    const userId = req.user.userId;
    const profileData = req.body;
    
    const updatedProfile = await updateProfile(userId, profileData);
    
    if (!updatedProfile) {
      throw new NotFoundError('User not found');
    }
    
    res.json({
      success: true,
      message: 'Profile updated successfully',
      data: updatedProfile
    });
  } catch (error) {
    next(error);
  }
}
