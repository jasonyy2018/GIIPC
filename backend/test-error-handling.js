/**
 * Test script for Global Error Handling
 * Tests various error scenarios to verify the error handling system works correctly
 */

const BASE_URL = 'http://localhost:3000';

// ANSI color codes for terminal output
const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m'
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function logTest(testName) {
  console.log(`\n${colors.cyan}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${colors.reset}`);
  log(`Testing: ${testName}`, 'blue');
  console.log(`${colors.cyan}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${colors.reset}`);
}

function logSuccess(message) {
  log(`✓ ${message}`, 'green');
}

function logError(message) {
  log(`✗ ${message}`, 'red');
}

function logResponse(response) {
  console.log(JSON.stringify(response, null, 2));
}

async function makeRequest(method, path, body = null, token = null) {
  const options = {
    method,
    headers: {
      'Content-Type': 'application/json'
    }
  };

  if (token) {
    options.headers['Authorization'] = `Bearer ${token}`;
  }

  if (body) {
    options.body = JSON.stringify(body);
  }

  try {
    const response = await fetch(`${BASE_URL}${path}`, options);
    const data = await response.json();
    return { status: response.status, data };
  } catch (error) {
    return { error: error.message };
  }
}

async function test404NotFound() {
  logTest('404 Not Found Error');
  
  const result = await makeRequest('GET', '/api/nonexistent');
  
  if (result.status === 404 && result.data.error?.code === 'NOT_FOUND') {
    logSuccess('404 error handled correctly');
    logResponse(result.data);
    return true;
  } else {
    logError('404 error not handled correctly');
    logResponse(result);
    return false;
  }
}

async function testValidationError() {
  logTest('Validation Error (Invalid Input)');
  
  const result = await makeRequest('POST', '/api/auth/register', {
    email: 'invalid-email',
    password: '123'
  });
  
  if (result.status === 400 && result.data.error?.code === 'VALIDATION_ERROR') {
    logSuccess('Validation error handled correctly');
    logResponse(result.data);
    return true;
  } else {
    logError('Validation error not handled correctly');
    logResponse(result);
    return false;
  }
}

async function testAuthenticationError() {
  logTest('Authentication Error (Invalid Credentials)');
  
  const result = await makeRequest('POST', '/api/auth/login', {
    email: 'nonexistent@giip.info',
    password: 'wrongpassword'
  });
  
  if (result.status === 401 && result.data.error?.code === 'AUTHENTICATION_ERROR') {
    logSuccess('Authentication error handled correctly');
    logResponse(result.data);
    return true;
  } else {
    logError('Authentication error not handled correctly');
    logResponse(result);
    return false;
  }
}

async function testUnauthorizedError() {
  logTest('Unauthorized Error (Missing Token)');
  
  const result = await makeRequest('GET', '/api/news');
  
  if (result.status === 401 && result.data.error?.code === 'UNAUTHORIZED') {
    logSuccess('Unauthorized error handled correctly');
    logResponse(result.data);
    return true;
  } else {
    logError('Unauthorized error not handled correctly');
    logResponse(result);
    return false;
  }
}

async function testInvalidTokenError() {
  logTest('Invalid Token Error');
  
  const result = await makeRequest('GET', '/api/news', null, 'invalid_token_here');
  
  if (result.status === 401 && result.data.error?.code === 'INVALID_TOKEN') {
    logSuccess('Invalid token error handled correctly');
    logResponse(result.data);
    return true;
  } else {
    logError('Invalid token error not handled correctly');
    logResponse(result);
    return false;
  }
}

async function testForbiddenError() {
  logTest('Forbidden Error (Insufficient Permissions)');
  
  // First, register and login as a regular user
  const email = `testuser_${Date.now()}@giip.info`;
  const password = 'TestPassword123!';
  
  await makeRequest('POST', '/api/auth/register', { email, password });
  const loginResult = await makeRequest('POST', '/api/auth/login', { email, password });
  
  if (!loginResult.data.token) {
    logError('Failed to get token for testing');
    return false;
  }
  
  const token = loginResult.data.token;
  
  // Try to create news (requires write:news permission)
  const result = await makeRequest('POST', '/api/news', {
    title: 'Test News',
    content: 'Test content',
    published_date: '2025-10-18'
  }, token);
  
  if (result.status === 403 && result.data.error?.code === 'FORBIDDEN') {
    logSuccess('Forbidden error handled correctly');
    logResponse(result.data);
    return true;
  } else {
    logError('Forbidden error not handled correctly');
    logResponse(result);
    return false;
  }
}

async function testConflictError() {
  logTest('Conflict Error (Duplicate Email)');
  
  const email = `duplicate_${Date.now()}@giip.info`;
  const password = 'TestPassword123!';
  
  // Register first time
  await makeRequest('POST', '/api/auth/register', { email, password });
  
  // Try to register again with same email
  const result = await makeRequest('POST', '/api/auth/register', { email, password });
  
  if (result.status === 409 && result.data.error?.code === 'CONFLICT') {
    logSuccess('Conflict error handled correctly');
    logResponse(result.data);
    return true;
  } else {
    logError('Conflict error not handled correctly');
    logResponse(result);
    return false;
  }
}

async function runAllTests() {
  log('\n╔════════════════════════════════════════════════════════════╗', 'cyan');
  log('║         Global Error Handling Test Suite                  ║', 'cyan');
  log('╚════════════════════════════════════════════════════════════╝', 'cyan');
  
  const tests = [
    { name: '404 Not Found', fn: test404NotFound },
    { name: 'Validation Error', fn: testValidationError },
    { name: 'Authentication Error', fn: testAuthenticationError },
    { name: 'Unauthorized Error', fn: testUnauthorizedError },
    { name: 'Invalid Token Error', fn: testInvalidTokenError },
    { name: 'Forbidden Error', fn: testForbiddenError },
    { name: 'Conflict Error', fn: testConflictError }
  ];
  
  const results = [];
  
  for (const test of tests) {
    try {
      const passed = await test.fn();
      results.push({ name: test.name, passed });
    } catch (error) {
      logError(`Test "${test.name}" threw an error: ${error.message}`);
      results.push({ name: test.name, passed: false });
    }
  }
  
  // Summary
  console.log(`\n${colors.cyan}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${colors.reset}`);
  log('Test Summary', 'blue');
  console.log(`${colors.cyan}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${colors.reset}\n`);
  
  const passed = results.filter(r => r.passed).length;
  const failed = results.filter(r => !r.passed).length;
  
  results.forEach(result => {
    if (result.passed) {
      logSuccess(`${result.name}`);
    } else {
      logError(`${result.name}`);
    }
  });
  
  console.log(`\n${colors.cyan}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${colors.reset}`);
  log(`Total: ${results.length} | Passed: ${passed} | Failed: ${failed}`, passed === results.length ? 'green' : 'yellow');
  console.log(`${colors.cyan}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${colors.reset}\n`);
  
  if (passed === results.length) {
    log('✓ All tests passed!', 'green');
  } else {
    log(`✗ ${failed} test(s) failed`, 'red');
  }
}

// Check if server is running
async function checkServer() {
  try {
    const response = await fetch(`${BASE_URL}/api/health`);
    if (response.ok) {
      log('✓ Server is running', 'green');
      return true;
    }
  } catch (error) {
    logError('Server is not running. Please start the server first:');
    log('  npm start', 'yellow');
    return false;
  }
}

// Main execution
(async () => {
  const serverRunning = await checkServer();
  if (serverRunning) {
    await runAllTests();
  }
})();
