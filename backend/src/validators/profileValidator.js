import { z } from 'zod';

export const updateProfileSchema = z.object({
  body: z.object({
    full_name: z.string().min(1).max(255).optional(),
    phone: z.string().max(50).optional(),
    organization: z.string().max(255).optional(),
    position: z.string().max(255).optional(),
    bio: z.string().optional(),
    avatar_url: z.string().url().max(500).optional().or(z.literal('')),
    country: z.string().max(100).optional(),
    city: z.string().max(100).optional()
  })
});

export function validateRequest(schema) {
  return (req, res, next) => {
    try {
      schema.parse({
        body: req.body,
        query: req.query,
        params: req.params
      });
      next();
    } catch (error) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: error.errors
      });
    }
  };
}
