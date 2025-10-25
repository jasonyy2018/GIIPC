/**
 * API Response Caching Middleware
 * Implements in-memory caching for GET requests to improve performance
 */

// Simple in-memory cache store
const cache = new Map();

// Cache configuration
const CACHE_CONFIG = {
  // Default TTL (Time To Live) in seconds
  defaultTTL: 300, // 5 minutes
  
  // Maximum cache size (number of entries)
  maxSize: 100,
  
  // Cache TTL by route pattern
  routeTTL: {
    '/api/news': 300,        // 5 minutes
    '/api/events': 300,      // 5 minutes
    '/api/conferences': 300, // 5 minutes
    '/api/health': 60,       // 1 minute
  }
};

/**
 * Get TTL for a specific route
 * @param {string} path - Request path
 * @returns {number} TTL in seconds
 */
function getTTL(path) {
  // Check for exact match
  if (CACHE_CONFIG.routeTTL[path]) {
    return CACHE_CONFIG.routeTTL[path];
  }
  
  // Check for pattern match
  for (const [pattern, ttl] of Object.entries(CACHE_CONFIG.routeTTL)) {
    if (path.startsWith(pattern)) {
      return ttl;
    }
  }
  
  return CACHE_CONFIG.defaultTTL;
}

/**
 * Generate cache key from request
 * @param {Object} req - Express request object
 * @returns {string} Cache key
 */
function generateCacheKey(req) {
  const { path, query, user } = req;
  
  // Include user ID in cache key for user-specific data
  const userId = user?.id || 'anonymous';
  
  // Include query parameters in cache key
  const queryString = new URLSearchParams(query).toString();
  
  return `${path}:${userId}:${queryString}`;
}

/**
 * Clean expired cache entries
 */
function cleanExpiredCache() {
  const now = Date.now();
  let cleaned = 0;
  
  for (const [key, value] of cache.entries()) {
    if (value.expiresAt < now) {
      cache.delete(key);
      cleaned++;
    }
  }
  
  if (cleaned > 0) {
    console.log(`Cache cleanup: Removed ${cleaned} expired entries`);
  }
}

/**
 * Enforce cache size limit (LRU eviction)
 */
function enforceCacheLimit() {
  if (cache.size > CACHE_CONFIG.maxSize) {
    // Remove oldest entries (first entries in Map)
    const entriesToRemove = cache.size - CACHE_CONFIG.maxSize;
    const keys = Array.from(cache.keys()).slice(0, entriesToRemove);
    
    keys.forEach(key => cache.delete(key));
    console.log(`Cache limit enforced: Removed ${entriesToRemove} entries`);
  }
}

/**
 * Cache middleware factory
 * @param {Object} options - Cache options
 * @param {number} options.ttl - Time to live in seconds
 * @param {boolean} options.private - Whether cache is user-specific
 * @returns {Function} Express middleware
 */
export function cacheMiddleware(options = {}) {
  return (req, res, next) => {
    // Only cache GET requests
    if (req.method !== 'GET') {
      return next();
    }
    
    // Generate cache key
    const cacheKey = generateCacheKey(req);
    
    // Check if cached response exists
    const cachedResponse = cache.get(cacheKey);
    
    if (cachedResponse && cachedResponse.expiresAt > Date.now()) {
      // Cache hit
      res.set('X-Cache', 'HIT');
      res.set('X-Cache-Key', cacheKey);
      res.set('Cache-Control', `max-age=${Math.floor((cachedResponse.expiresAt - Date.now()) / 1000)}`);
      
      return res.status(cachedResponse.status).json(cachedResponse.data);
    }
    
    // Cache miss - intercept response
    res.set('X-Cache', 'MISS');
    
    // Store original json method
    const originalJson = res.json.bind(res);
    
    // Override json method to cache response
    res.json = function(data) {
      // Only cache successful responses
      if (res.statusCode >= 200 && res.statusCode < 300) {
        const ttl = options.ttl || getTTL(req.path);
        const expiresAt = Date.now() + (ttl * 1000);
        
        // Store in cache
        cache.set(cacheKey, {
          status: res.statusCode,
          data,
          expiresAt,
          cachedAt: Date.now()
        });
        
        // Enforce cache limits
        enforceCacheLimit();
        
        // Set cache headers
        res.set('Cache-Control', `max-age=${ttl}`);
      }
      
      // Call original json method
      return originalJson(data);
    };
    
    next();
  };
}

/**
 * Clear cache for specific pattern
 * @param {string} pattern - Pattern to match (e.g., '/api/news')
 */
export function clearCache(pattern) {
  let cleared = 0;
  
  for (const key of cache.keys()) {
    if (key.startsWith(pattern)) {
      cache.delete(key);
      cleared++;
    }
  }
  
  console.log(`Cache cleared: ${cleared} entries matching pattern "${pattern}"`);
  return cleared;
}

/**
 * Clear all cache
 */
export function clearAllCache() {
  const size = cache.size;
  cache.clear();
  console.log(`Cache cleared: All ${size} entries removed`);
  return size;
}

/**
 * Get cache statistics
 * @returns {Object} Cache stats
 */
export function getCacheStats() {
  const now = Date.now();
  let expired = 0;
  
  for (const value of cache.values()) {
    if (value.expiresAt < now) {
      expired++;
    }
  }
  
  return {
    size: cache.size,
    maxSize: CACHE_CONFIG.maxSize,
    expired,
    active: cache.size - expired,
    utilizationPercent: Math.round((cache.size / CACHE_CONFIG.maxSize) * 100)
  };
}

// Run cache cleanup every 5 minutes
setInterval(cleanExpiredCache, 5 * 60 * 1000);

// Export cache instance for testing
export { cache };
