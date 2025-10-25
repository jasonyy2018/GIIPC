import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import {
  findUserByEmail,
  createUser,
  userExists
} from '../repositories/userRepository.js';
import { ConflictError, AuthenticationError } from '../utils/errors.js';

const SALT_ROUNDS = 10;
const JWT_SECRET = process.env.JWT_SECRET;
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '1h';

/**
 * Register a new user
 * @param {string} email - User email
 * @param {string} password - Plain text password
 * @returns {Promise<Object>} Created user object (without password)
 * @throws {ConflictError} If email already exists
 */
export async function registerUser(email, password) {
  // Check if user already exists
  const exists = await userExists(email);
  
  if (exists) {
    throw new ConflictError('Email already registered');
  }
  
  // Hash password with bcrypt (10 salt rounds)
  const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);
  
  // Create user with default 'user' role
  const user = await createUser(email, hashedPassword);
  
  // Get role name for response
  const userWithRole = await findUserByEmail(email);
  
  return {
    id: user.id,
    email: user.email,
    role: userWithRole.role_name,
    created_at: user.created_at
  };
}

/**
 * Authenticate user and generate JWT token
 * @param {string} email - User email
 * @param {string} password - Plain text password
 * @returns {Promise<Object>} Object containing token and user info
 * @throws {AuthenticationError} If credentials are invalid
 */
export async function loginUser(email, password) {
  // Find user by email
  const user = await findUserByEmail(email);
  
  if (!user) {
    throw new AuthenticationError('Invalid email or password');
  }
  
  // Verify password using bcrypt
  const isPasswordValid = await bcrypt.compare(password, user.password);
  
  if (!isPasswordValid) {
    throw new AuthenticationError('Invalid email or password');
  }
  
  // Generate JWT token
  const token = jwt.sign(
    {
      userId: user.id,
      email: user.email,
      roleId: user.role_id,
      role: user.role_name
    },
    JWT_SECRET,
    {
      expiresIn: JWT_EXPIRES_IN
    }
  );
  
  // Return token and user info (without password)
  return {
    token,
    user: {
      id: user.id,
      email: user.email,
      role: user.role_name
    }
  };
}

/**
 * Verify JWT token
 * @param {string} token - JWT token
 * @returns {Promise<Object>} Decoded token payload
 * @throws {Error} If token is invalid or expired
 */
export async function verifyToken(token) {
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    return decoded;
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      const err = new Error('Token has expired');
      err.code = 'TOKEN_EXPIRED';
      err.status = 401;
      throw err;
    }
    
    if (error.name === 'JsonWebTokenError') {
      const err = new Error('Invalid token');
      err.code = 'INVALID_TOKEN';
      err.status = 401;
      throw err;
    }
    
    throw error;
  }
}
