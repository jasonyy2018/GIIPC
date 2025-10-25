import { z } from 'zod';

/**
 * Validation schema for creating events
 */
export const createEventSchema = z.object({
  title: z
    .string()
    .min(1, 'Title is required')
    .max(255, 'Title must not exceed 255 characters')
    .trim(),
  description: z
    .string()
    .min(1, 'Description is required')
    .trim(),
  date: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, 'Date must be in YYYY-MM-DD format')
    .refine((date) => {
      const parsed = new Date(date);
      return !isNaN(parsed.getTime());
    }, 'Invalid date')
    .optional(),
  start_date: z
    .string()
    .refine((date) => {
      const parsed = new Date(date);
      return !isNaN(parsed.getTime());
    }, 'Invalid start date')
    .optional(),
  end_date: z
    .string()
    .refine((date) => {
      const parsed = new Date(date);
      return !isNaN(parsed.getTime());
    }, 'Invalid end date')
    .optional(),
  location: z
    .string()
    .min(1, 'Location is required')
    .max(255, 'Location must not exceed 255 characters')
    .trim(),
  capacity: z
    .number()
    .int('Capacity must be an integer')
    .positive('Capacity must be greater than 0')
    .optional()
    .nullable()
}).refine((data) => {
  // Validate that end_date is after start_date if both are provided
  if (data.start_date && data.end_date) {
    const startDate = new Date(data.start_date);
    const endDate = new Date(data.end_date);
    if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
      return false;
    }
    return endDate >= startDate;
  }
  return true;
}, {
  message: 'End date must be after or equal to start date. Please check that both dates are valid.',
  path: ['end_date']
}).refine((data) => {
  // Ensure at least one date field is provided (either old 'date' or new 'start_date')
  // This ensures backward compatibility with old data
  if (!data.date && !data.start_date) {
    return false;
  }
  return true;
}, {
  message: 'Either date or start_date must be provided for backward compatibility',
  path: ['start_date']
});

/**
 * Validation schema for updating events
 * All fields are optional for partial updates
 */
export const updateEventSchema = z.object({
  title: z
    .string()
    .min(1, 'Title cannot be empty')
    .max(255, 'Title must not exceed 255 characters')
    .trim()
    .optional(),
  description: z
    .string()
    .min(1, 'Description cannot be empty')
    .trim()
    .optional(),
  date: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, 'Date must be in YYYY-MM-DD format')
    .refine((date) => {
      const parsed = new Date(date);
      return !isNaN(parsed.getTime());
    }, 'Invalid date')
    .optional(),
  start_date: z
    .string()
    .refine((date) => {
      const parsed = new Date(date);
      return !isNaN(parsed.getTime());
    }, 'Invalid start date')
    .optional(),
  end_date: z
    .string()
    .refine((date) => {
      const parsed = new Date(date);
      return !isNaN(parsed.getTime());
    }, 'Invalid end date')
    .optional(),
  location: z
    .string()
    .min(1, 'Location cannot be empty')
    .max(255, 'Location must not exceed 255 characters')
    .trim()
    .optional(),
  capacity: z
    .number()
    .int('Capacity must be an integer')
    .positive('Capacity must be greater than 0')
    .optional()
    .nullable()
}).refine((data) => Object.keys(data).length > 0, {
  message: 'At least one field must be provided for update'
}).refine((data) => {
  // Validate that end_date is after start_date if both are provided
  if (data.start_date && data.end_date) {
    const startDate = new Date(data.start_date);
    const endDate = new Date(data.end_date);
    if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
      return false;
    }
    return endDate >= startDate;
  }
  return true;
}, {
  message: 'End date must be after or equal to start date. Please check that both dates are valid.',
  path: ['end_date']
});

/**
 * Validation schema for pagination query parameters
 */
export const paginationSchema = z.object({
  page: z
    .string()
    .optional()
    .default('1')
    .transform((val) => parseInt(val, 10))
    .refine((val) => val > 0, 'Page must be greater than 0'),
  limit: z
    .string()
    .optional()
    .default('10')
    .transform((val) => parseInt(val, 10))
    .refine((val) => val > 0 && val <= 100, 'Limit must be between 1 and 100')
});

/**
 * Validation schema for event query parameters including filtering and sorting
 */
export const eventQuerySchema = z.object({
  page: z
    .string()
    .optional()
    .default('1')
    .transform((val) => parseInt(val, 10))
    .refine((val) => val > 0, 'Page must be greater than 0'),
  limit: z
    .string()
    .optional()
    .default('10')
    .transform((val) => parseInt(val, 10))
    .refine((val) => val > 0 && val <= 100, 'Limit must be between 1 and 100'),
  status: z
    .enum(['active', 'past', 'all'])
    .optional()
    .default('all'),
  sortBy: z
    .enum(['start_date', 'end_date', 'created_at', 'date'])
    .optional()
    .default('start_date'),
  sortOrder: z
    .enum(['asc', 'desc'])
    .optional()
    .default('desc')
});

/**
 * Validation schema for event registration
 */
export const eventRegistrationSchema = z.object({
  organization: z
    .string()
    .max(255, 'Organization must not exceed 255 characters')
    .trim()
    .optional(),
  notes: z
    .string()
    .trim()
    .optional()
});

/**
 * Middleware to validate request body against a Zod schema
 * @param {z.ZodSchema} schema - Zod validation schema
 * @returns {Function} Express middleware function
 */
export function validateRequest(schema) {
  return (req, res, next) => {
    try {
      const validated = schema.parse(req.body);
      req.body = validated;
      next();
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({
          success: false,
          error: {
            code: 'VALIDATION_ERROR',
            message: 'Invalid input data',
            details: error.errors.map(err => ({
              field: err.path.join('.'),
              message: err.message
            }))
          }
        });
      }
      next(error);
    }
  };
}

/**
 * Middleware to validate query parameters against a Zod schema
 * @param {z.ZodSchema} schema - Zod validation schema
 * @returns {Function} Express middleware function
 */
export function validateQuery(schema) {
  return (req, res, next) => {
    try {
      const validated = schema.parse(req.query);
      req.query = validated;
      next();
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({
          success: false,
          error: {
            code: 'VALIDATION_ERROR',
            message: 'Invalid query parameters',
            details: error.errors.map(err => ({
              field: err.path.join('.'),
              message: err.message
            }))
          }
        });
      }
      next(error);
    }
  };
}
