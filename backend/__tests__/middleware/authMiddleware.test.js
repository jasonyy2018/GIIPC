/**
 * Unit Tests for Authentication Middleware
 * Tests JWT token validation and user authentication
 */

import jwt from 'jsonwebtoken';
import { authGuard } from '../../src/middleware/authMiddleware.js';
import { UnauthorizedError } from '../../src/utils/errors.js';

// Mock JWT_SECRET
process.env.JWT_SECRET = 'test-secret-key-for-unit-tests';

describe('authGuard Middleware', () => {
  let req, res, next;

  beforeEach(() => {
    req = {
      headers: {}
    };
    res = {};
    next = jest.fn();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test('should attach user info to request when valid token is provided', () => {
    const payload = {
      userId: 1,
      email: 'test@giip.info',
      roleId: 2,
      role: 'user'
    };

    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' });
    req.headers.authorization = `Bearer ${token}`;

    authGuard(req, res, next);

    expect(req.user).toBeDefined();
    expect(req.user.userId).toBe(1);
    expect(req.user.email).toBe('test@giip.info');
    expect(req.user.roleId).toBe(2);
    expect(req.user.role).toBe('user');
    expect(next).toHaveBeenCalledWith();
  });

  test('should call next with error when no authorization header is provided', () => {
    authGuard(req, res, next);

    expect(next).toHaveBeenCalledWith(expect.any(UnauthorizedError));
    expect(next.mock.calls[0][0].message).toBe('No authorization token provided');
  });

  test('should call next with error when authorization header is malformed', () => {
    req.headers.authorization = 'InvalidFormat';

    authGuard(req, res, next);

    expect(next).toHaveBeenCalledWith(expect.any(UnauthorizedError));
    expect(next.mock.calls[0][0].message).toContain('Bearer');
  });

  test('should call next with error when token is missing after Bearer', () => {
    req.headers.authorization = 'Bearer ';

    authGuard(req, res, next);

    expect(next).toHaveBeenCalled();
    const error = next.mock.calls[0][0];
    expect(error).toBeDefined();
  });

  test('should call next with error when token is invalid', () => {
    req.headers.authorization = 'Bearer invalid-token';

    authGuard(req, res, next);

    expect(next).toHaveBeenCalled();
    const error = next.mock.calls[0][0];
    expect(error).toBeDefined();
    expect(error.name).toBe('JsonWebTokenError');
  });

  test('should call next with error when token is expired', () => {
    const payload = {
      userId: 1,
      email: 'test@giip.info',
      roleId: 2,
      role: 'user'
    };

    const expiredToken = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '-1h' });
    req.headers.authorization = `Bearer ${expiredToken}`;

    authGuard(req, res, next);

    expect(next).toHaveBeenCalled();
    const error = next.mock.calls[0][0];
    expect(error).toBeDefined();
    expect(error.name).toBe('TokenExpiredError');
  });

  test('should handle token with different secret', () => {
    const payload = {
      userId: 1,
      email: 'test@giip.info',
      roleId: 2,
      role: 'user'
    };

    const token = jwt.sign(payload, 'different-secret', { expiresIn: '1h' });
    req.headers.authorization = `Bearer ${token}`;

    authGuard(req, res, next);

    expect(next).toHaveBeenCalled();
    const error = next.mock.calls[0][0];
    expect(error).toBeDefined();
    expect(error.name).toBe('JsonWebTokenError');
  });
});
