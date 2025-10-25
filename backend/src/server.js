import 'dotenv/config';
import express from 'express';
import { connectWithRetry, checkDatabaseHealth, closePool } from './config/db.js';
import { 
  helmetConfig, 
  corsConfig, 
  apiRateLimiter,
  additionalSecurityHeaders 
} from './config/security.js';
import { errorHandler, notFoundHandler } from './middleware/errorHandler.js';
import { cacheMiddleware, getCacheStats, clearCache } from './middleware/cacheMiddleware.js';
import authRoutes from './routes/authRoutes.js';

const app = express();
const PORT = process.env.PORT || 3000;

// Security middleware - Helmet.js with CSP
app.use(helmetConfig);

// Additional security headers
app.use(additionalSecurityHeaders);

// CORS configuration - restrict to frontend domains
app.use(corsConfig);

// Body parsing middleware with size limits to prevent DoS
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Apply rate limiting to all API routes
app.use('/api', apiRateLimiter);

// Health check endpoint (with caching)
app.get('/api/health', cacheMiddleware({ ttl: 60 }), async (req, res) => {
  try {
    const dbHealth = await checkDatabaseHealth();
    const cacheStats = getCacheStats();
    
    const healthStatus = {
      status: dbHealth.status === 'healthy' ? 'ok' : 'error',
      timestamp: new Date().toISOString(),
      service: 'GIIP Backend API',
      database: dbHealth,
      cache: cacheStats
    };
    
    const statusCode = dbHealth.status === 'healthy' ? 200 : 503;
    res.status(statusCode).json(healthStatus);
  } catch (error) {
    res.status(503).json({
      status: 'error',
      timestamp: new Date().toISOString(),
      service: 'GIIP Backend API',
      error: error.message
    });
  }
});

// API Routes
app.use('/api/auth', authRoutes);

// Profile routes
import profileRoutes from './routes/profileRoutes.js';
app.use('/api/profile', profileRoutes);

// News routes (with caching for GET requests)
import newsRoutes from './routes/newsRoutes.js';
app.use('/api/news', cacheMiddleware({ ttl: 300 }), newsRoutes);

// Event routes (with caching for GET requests)
import eventRoutes from './routes/eventRoutes.js';
app.use('/api/events', cacheMiddleware({ ttl: 300 }), eventRoutes);

// Conference routes (with caching for GET requests)
import conferenceRoutes from './routes/conferenceRoutes.js';
app.use('/api/conferences', cacheMiddleware({ ttl: 300 }), conferenceRoutes);

// Test routes (for RBAC demonstration)
import testRoutes from './routes/testRoutes.js';
app.use('/api/test', testRoutes);

// Admin routes
import adminRoutes from './routes/adminRoutes.js';
app.use('/api/admin', adminRoutes);

// Basic route
app.get('/', (req, res) => {
  res.json({
    message: 'GIIP Backend API',
    version: '1.0.0',
    endpoints: {
      health: '/api/health',
      auth: {
        register: 'POST /api/auth/register',
        login: 'POST /api/auth/login'
      },
      profile: {
        get: 'GET /api/profile (requires auth)',
        update: 'PUT /api/profile (requires auth)'
      },
      news: {
        getAll: 'GET /api/news (requires read:news permission)',
        getOne: 'GET /api/news/:id (requires read:news permission)',
        create: 'POST /api/news (requires write:news permission)',
        update: 'PUT /api/news/:id (requires ownership or edit:news permission)',
        delete: 'DELETE /api/news/:id (requires delete:news permission)'
      },
      events: {
        getAll: 'GET /api/events (requires read:events permission)',
        getOne: 'GET /api/events/:id (requires read:events permission)',
        create: 'POST /api/events (requires write:events permission)',
        update: 'PUT /api/events/:id (requires ownership or edit:events permission)',
        delete: 'DELETE /api/events/:id (requires delete:events permission)'
      },
      conferences: {
        getAll: 'GET /api/conferences (requires read:conferences permission)',
        getOne: 'GET /api/conferences/:id (requires read:conferences permission)',
        create: 'POST /api/conferences (requires write:conferences permission)',
        update: 'PUT /api/conferences/:id (requires ownership or edit:conferences permission)',
        delete: 'DELETE /api/conferences/:id (requires delete:conferences permission)'
      },
      test: {
        protected: 'GET /api/test/protected (requires auth)',
        newsReader: 'GET /api/test/news-reader (requires read:news permission)',
        adminOnly: 'GET /api/test/admin-only (requires admin role)'
      },
      admin: {
        getUsers: 'GET /api/admin/users (requires admin role)',
        updateUserRole: 'PUT /api/admin/users/:id/role (requires admin role)'
      }
    }
  });
});

// 404 Not Found handler - must be after all routes
app.use(notFoundHandler);

// Global error handler - must be last
app.use(errorHandler);

// Graceful shutdown handler
const gracefulShutdown = async (signal) => {
  console.log(`\n${signal} received. Starting graceful shutdown...`);
  
  // Close server
  server.close(async () => {
    console.log('HTTP server closed');
    
    // Close database connections
    try {
      await closePool();
      console.log('Database connections closed');
      process.exit(0);
    } catch (error) {
      console.error('Error during shutdown:', error);
      process.exit(1);
    }
  });
  
  // Force shutdown after 10 seconds
  setTimeout(() => {
    console.error('Forced shutdown after timeout');
    process.exit(1);
  }, 10000);
};

// Start server with database connection
let server;

async function startServer() {
  try {
    // Connect to database with retry logic
    await connectWithRetry();
    
    // Start Express server
    server = app.listen(PORT, () => {
      console.log(`\n🚀 Server is running on port ${PORT}`);
      console.log(`   Environment: ${process.env.NODE_ENV || 'development'}`);
      console.log(`   Health check: http://localhost:${PORT}/api/health\n`);
    });
    
    // Register shutdown handlers
    process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
    process.on('SIGINT', () => gracefulShutdown('SIGINT'));
    
  } catch (error) {
    console.error('Failed to start server:', error.message);
    process.exit(1);
  }
}

// Start the server only if not in test environment
if (process.env.NODE_ENV !== 'test') {
  startServer();
}

export default app;
