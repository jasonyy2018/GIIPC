/**
 * Unit Tests for Authentication Service
 * Tests user registration, login, and token verification
 */

import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { registerUser, loginUser, verifyToken } from '../../src/services/authService.js';
import * as userRepository from '../../src/repositories/userRepository.js';
import { ConflictError, AuthenticationError } from '../../src/utils/errors.js';

// Mock dependencies
jest.mock('../../src/repositories/userRepository.js');
jest.mock('bcrypt');
jest.mock('jsonwebtoken');

// Set environment variables
process.env.JWT_SECRET = 'test-secret-key';
process.env.JWT_EXPIRES_IN = '1h';

describe('AuthService', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('registerUser', () => {
    test('should successfully register a new user', async () => {
      const email = 'newuser@giip.info';
      const password = 'SecurePass123!';
      const hashedPassword = 'hashed_password';

      userRepository.userExists.mockResolvedValue(false);
      bcrypt.hash.mockResolvedValue(hashedPassword);
      userRepository.createUser.mockResolvedValue({
        id: 1,
        email,
        role_id: 3,
        created_at: new Date()
      });
      userRepository.findUserByEmail.mockResolvedValue({
        id: 1,
        email,
        role_id: 3,
        role_name: 'user',
        created_at: new Date()
      });

      const result = await registerUser(email, password);

      expect(userRepository.userExists).toHaveBeenCalledWith(email);
      expect(bcrypt.hash).toHaveBeenCalledWith(password, 10);
      expect(userRepository.createUser).toHaveBeenCalledWith(email, hashedPassword);
      expect(result).toHaveProperty('id', 1);
      expect(result).toHaveProperty('email', email);
      expect(result).toHaveProperty('role', 'user');
      expect(result).not.toHaveProperty('password');
    });

    test('should throw ConflictError when email already exists', async () => {
      const email = 'existing@giip.info';
      const password = 'SecurePass123!';

      userRepository.userExists.mockResolvedValue(true);

      await expect(registerUser(email, password)).rejects.toThrow(ConflictError);
      await expect(registerUser(email, password)).rejects.toThrow('Email already registered');

      expect(userRepository.userExists).toHaveBeenCalledWith(email);
      expect(bcrypt.hash).not.toHaveBeenCalled();
      expect(userRepository.createUser).not.toHaveBeenCalled();
    });

    test('should hash password with correct salt rounds', async () => {
      const email = 'test@giip.info';
      const password = 'TestPass123!';

      userRepository.userExists.mockResolvedValue(false);
      bcrypt.hash.mockResolvedValue('hashed');
      userRepository.createUser.mockResolvedValue({ id: 1, email, role_id: 3, created_at: new Date() });
      userRepository.findUserByEmail.mockResolvedValue({ id: 1, email, role_name: 'user' });

      await registerUser(email, password);

      expect(bcrypt.hash).toHaveBeenCalledWith(password, 10);
    });
  });

  describe('loginUser', () => {
    test('should successfully login with valid credentials', async () => {
      const email = 'user@giip.info';
      const password = 'CorrectPassword123!';
      const hashedPassword = 'hashed_password';
      const token = 'jwt_token';

      const mockUser = {
        id: 1,
        email,
        password: hashedPassword,
        role_id: 2,
        role_name: 'editor'
      };

      userRepository.findUserByEmail.mockResolvedValue(mockUser);
      bcrypt.compare.mockResolvedValue(true);
      jwt.sign.mockReturnValue(token);

      const result = await loginUser(email, password);

      expect(userRepository.findUserByEmail).toHaveBeenCalledWith(email);
      expect(bcrypt.compare).toHaveBeenCalledWith(password, hashedPassword);
      expect(jwt.sign).toHaveBeenCalledWith(
        {
          userId: 1,
          email,
          roleId: 2,
          role: 'editor'
        },
        'test-secret-key',
        { expiresIn: '1h' }
      );
      expect(result).toHaveProperty('token', token);
      expect(result).toHaveProperty('user');
      expect(result.user).toHaveProperty('id', 1);
      expect(result.user).toHaveProperty('email', email);
      expect(result.user).toHaveProperty('role', 'editor');
      expect(result.user).not.toHaveProperty('password');
    });

    test('should throw AuthenticationError when user does not exist', async () => {
      const email = 'nonexistent@giip.info';
      const password = 'SomePassword123!';

      userRepository.findUserByEmail.mockResolvedValue(null);

      await expect(loginUser(email, password)).rejects.toThrow(AuthenticationError);
      await expect(loginUser(email, password)).rejects.toThrow('Invalid email or password');

      expect(userRepository.findUserByEmail).toHaveBeenCalledWith(email);
      expect(bcrypt.compare).not.toHaveBeenCalled();
      expect(jwt.sign).not.toHaveBeenCalled();
    });

    test('should throw AuthenticationError when password is incorrect', async () => {
      const email = 'user@giip.info';
      const password = 'WrongPassword123!';

      const mockUser = {
        id: 1,
        email,
        password: 'hashed_password',
        role_id: 2,
        role_name: 'user'
      };

      userRepository.findUserByEmail.mockResolvedValue(mockUser);
      bcrypt.compare.mockResolvedValue(false);

      await expect(loginUser(email, password)).rejects.toThrow(AuthenticationError);
      await expect(loginUser(email, password)).rejects.toThrow('Invalid email or password');

      expect(bcrypt.compare).toHaveBeenCalledWith(password, 'hashed_password');
      expect(jwt.sign).not.toHaveBeenCalled();
    });

    test('should generate JWT with correct payload and options', async () => {
      const email = 'admin@giip.info';
      const password = 'AdminPass123!';

      const mockUser = {
        id: 5,
        email,
        password: 'hashed',
        role_id: 1,
        role_name: 'admin'
      };

      userRepository.findUserByEmail.mockResolvedValue(mockUser);
      bcrypt.compare.mockResolvedValue(true);
      jwt.sign.mockReturnValue('token');

      await loginUser(email, password);

      expect(jwt.sign).toHaveBeenCalledWith(
        expect.objectContaining({
          userId: 5,
          email,
          roleId: 1,
          role: 'admin'
        }),
        'test-secret-key',
        { expiresIn: '1h' }
      );
    });
  });

  describe('verifyToken', () => {
    test('should successfully verify valid token', async () => {
      const token = 'valid_token';
      const decoded = {
        userId: 1,
        email: 'user@giip.info',
        roleId: 2,
        role: 'user'
      };

      jwt.verify.mockReturnValue(decoded);

      const result = await verifyToken(token);

      expect(jwt.verify).toHaveBeenCalledWith(token, 'test-secret-key');
      expect(result).toEqual(decoded);
    });

    test('should throw error with TOKEN_EXPIRED code when token is expired', async () => {
      const token = 'expired_token';
      const expiredError = new Error('jwt expired');
      expiredError.name = 'TokenExpiredError';

      jwt.verify.mockImplementation(() => {
        throw expiredError;
      });

      await expect(verifyToken(token)).rejects.toThrow('Token has expired');
      await expect(verifyToken(token)).rejects.toMatchObject({
        code: 'TOKEN_EXPIRED',
        status: 401
      });
    });

    test('should throw error with INVALID_TOKEN code when token is invalid', async () => {
      const token = 'invalid_token';
      const invalidError = new Error('invalid token');
      invalidError.name = 'JsonWebTokenError';

      jwt.verify.mockImplementation(() => {
        throw invalidError;
      });

      await expect(verifyToken(token)).rejects.toThrow('Invalid token');
      await expect(verifyToken(token)).rejects.toMatchObject({
        code: 'INVALID_TOKEN',
        status: 401
      });
    });

    test('should rethrow other errors', async () => {
      const token = 'token';
      const otherError = new Error('Some other error');

      jwt.verify.mockImplementation(() => {
        throw otherError;
      });

      await expect(verifyToken(token)).rejects.toThrow('Some other error');
    });
  });
});
