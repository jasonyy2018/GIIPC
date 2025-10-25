import pg from 'pg';
const { Pool } = pg;

// Database configuration from environment variables
const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '5432', 10),
  database: process.env.DB_NAME || 'giip_db',
  user: process.env.DB_USER || 'giip_user',
  password: process.env.DB_PASSWORD,
  // Connection pool settings
  max: 20, // Maximum number of clients in the pool
  idleTimeoutMillis: 30000, // Close idle clients after 30 seconds
  connectionTimeoutMillis: 10000, // Return an error after 10 seconds if connection cannot be established
};

// Create PostgreSQL connection pool
const pool = new Pool(dbConfig);

// Connection error handler
pool.on('error', (err, client) => {
  console.error('Unexpected error on idle client', err);
  process.exit(-1);
});

/**
 * Database health check function
 * Tests the database connection and returns status
 * @returns {Promise<Object>} Health check result with status and details
 */
export async function checkDatabaseHealth() {
  const startTime = Date.now();
  
  try {
    const client = await pool.connect();
    try {
      // Simple query to test connection
      const result = await client.query('SELECT NOW() as current_time, version() as pg_version');
      const responseTime = Date.now() - startTime;
      
      return {
        status: 'healthy',
        message: 'Database connection successful',
        responseTime: `${responseTime}ms`,
        timestamp: result.rows[0].current_time,
        version: result.rows[0].pg_version.split(' ')[0] + ' ' + result.rows[0].pg_version.split(' ')[1],
      };
    } finally {
      client.release();
    }
  } catch (error) {
    const responseTime = Date.now() - startTime;
    return {
      status: 'unhealthy',
      message: 'Database connection failed',
      error: error.message,
      responseTime: `${responseTime}ms`,
    };
  }
}

/**
 * Connect to database with retry logic
 * Attempts to connect multiple times with exponential backoff
 * @param {number} maxRetries - Maximum number of retry attempts
 * @param {number} initialDelay - Initial delay in milliseconds
 * @returns {Promise<void>}
 */
export async function connectWithRetry(maxRetries = 5, initialDelay = 1000) {
  let retries = 0;
  let delay = initialDelay;

  while (retries < maxRetries) {
    try {
      console.log(`Attempting to connect to database... (Attempt ${retries + 1}/${maxRetries})`);
      
      const client = await pool.connect();
      client.release();
      
      console.log('✓ Database connection established successfully');
      
      // Verify database health
      const health = await checkDatabaseHealth();
      console.log(`✓ Database health check: ${health.status}`);
      console.log(`  PostgreSQL version: ${health.version}`);
      
      return;
    } catch (error) {
      retries++;
      
      if (retries >= maxRetries) {
        console.error('✗ Failed to connect to database after maximum retries');
        console.error(`  Error: ${error.message}`);
        throw new Error(`Database connection failed after ${maxRetries} attempts: ${error.message}`);
      }
      
      console.warn(`✗ Connection attempt ${retries} failed: ${error.message}`);
      console.log(`  Retrying in ${delay}ms...`);
      
      // Wait before retrying with exponential backoff
      await new Promise(resolve => setTimeout(resolve, delay));
      delay *= 2; // Exponential backoff
    }
  }
}

/**
 * Execute a query with error handling
 * @param {string} text - SQL query text
 * @param {Array} params - Query parameters
 * @returns {Promise<Object>} Query result
 */
export async function query(text, params) {
  const start = Date.now();
  
  try {
    const result = await pool.query(text, params);
    const duration = Date.now() - start;
    
    // Log slow queries (> 1 second)
    if (duration > 1000) {
      console.warn(`Slow query detected (${duration}ms):`, text);
    }
    
    return result;
  } catch (error) {
    console.error('Database query error:', error.message);
    console.error('Query:', text);
    console.error('Params:', params);
    throw error;
  }
}

/**
 * Get a client from the pool for transactions
 * @returns {Promise<Object>} Database client
 */
export async function getClient() {
  try {
    const client = await pool.connect();
    return client;
  } catch (error) {
    console.error('Failed to get database client:', error.message);
    throw error;
  }
}

/**
 * Close all database connections
 * Should be called when shutting down the application
 * @returns {Promise<void>}
 */
export async function closePool() {
  try {
    await pool.end();
    console.log('Database connection pool closed');
  } catch (error) {
    console.error('Error closing database pool:', error.message);
    throw error;
  }
}

// Export the pool for direct access if needed
export default pool;
