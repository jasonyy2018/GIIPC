import { registerUser, loginUser } from '../services/authService.js';

/**
 * Handle user registration
 * POST /api/auth/register
 */
export async function register(req, res, next) {
  try {
    const { email, password } = req.body;
    
    const user = await registerUser(email, password);
    
    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      data: {
        userId: user.id,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    next(error);
  }
}

/**
 * Handle user login
 * POST /api/auth/login
 */
export async function login(req, res, next) {
  try {
    const { email, password } = req.body;
    
    const result = await loginUser(email, password);
    
    res.status(200).json({
      success: true,
      message: 'Login successful',
      token: result.token,
      user: result.user
    });
  } catch (error) {
    next(error);
  }
}
