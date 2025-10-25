/**
 * Logger Utility for GIIP Backend API
 * Provides structured logging for errors and application events
 */

/**
 * Log levels
 */
const LogLevel = {
  ERROR: 'ERROR',
  WARN: 'WARN',
  INFO: 'INFO',
  DEBUG: 'DEBUG'
};

/**
 * Format log message with timestamp and level
 */
function formatLogMessage(level, message, meta = {}) {
  const timestamp = new Date().toISOString();
  const logEntry = {
    timestamp,
    level,
    message,
    ...meta
  };
  
  return JSON.stringify(logEntry, null, 2);
}

/**
 * Log error with stack trace
 */
export function logError(error, req = null) {
  const meta = {
    name: error.name,
    code: error.code || 'UNKNOWN',
    statusCode: error.statusCode || 500,
    stack: error.stack
  };
  
  // Add request context if available
  if (req) {
    meta.request = {
      method: req.method,
      url: req.originalUrl || req.url,
      ip: req.ip || req.connection?.remoteAddress,
      userAgent: req.get('user-agent'),
      userId: req.user?.id
    };
  }
  
  console.error(formatLogMessage(LogLevel.ERROR, error.message, meta));
}

/**
 * Log warning
 */
export function logWarning(message, meta = {}) {
  console.warn(formatLogMessage(LogLevel.WARN, message, meta));
}

/**
 * Log info
 */
export function logInfo(message, meta = {}) {
  console.log(formatLogMessage(LogLevel.INFO, message, meta));
}

/**
 * Log debug (only in development)
 */
export function logDebug(message, meta = {}) {
  if (process.env.NODE_ENV !== 'production') {
    console.log(formatLogMessage(LogLevel.DEBUG, message, meta));
  }
}

export default {
  error: logError,
  warn: logWarning,
  info: logInfo,
  debug: logDebug
};
