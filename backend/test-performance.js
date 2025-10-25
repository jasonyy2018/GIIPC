/**
 * Performance Testing Script
 * Tests API performance under concurrent load
 */

import http from 'http';

const API_BASE_URL = process.env.API_URL || 'http://localhost:3000';
const CONCURRENT_REQUESTS = parseInt(process.env.CONCURRENT_REQUESTS || '50', 10);
const TEST_DURATION_MS = parseInt(process.env.TEST_DURATION_MS || '10000', 10);

// Test endpoints
// Note: For authenticated endpoints, you need to provide a valid JWT token
// Set the JWT_TOKEN environment variable to test authenticated endpoints
const JWT_TOKEN = process.env.JWT_TOKEN || '';

const ENDPOINTS = [
  { method: 'GET', path: '/api/health', name: 'Health Check', public: true },
  { method: 'GET', path: '/', name: 'API Root', public: true },
  { method: 'GET', path: '/api/news', name: 'Get News', public: false },
  { method: 'GET', path: '/api/events', name: 'Get Events', public: false },
  { method: 'GET', path: '/api/conferences', name: 'Get Conferences', public: false },
];

// Performance metrics
const metrics = {
  totalRequests: 0,
  successfulRequests: 0,
  failedRequests: 0,
  totalResponseTime: 0,
  minResponseTime: Infinity,
  maxResponseTime: 0,
  responseTimes: [],
  statusCodes: {},
  cacheHits: 0,
  cacheMisses: 0,
  errors: []
};

/**
 * Make HTTP request and measure performance
 */
function makeRequest(endpoint) {
  return new Promise((resolve) => {
    const startTime = Date.now();
    const url = new URL(endpoint.path, API_BASE_URL);
    
    const headers = {
      'Accept': 'application/json'
    };
    
    // Add JWT token for authenticated endpoints
    if (!endpoint.public && JWT_TOKEN) {
      headers['Authorization'] = `Bearer ${JWT_TOKEN}`;
    }
    
    const options = {
      hostname: url.hostname,
      port: url.port || 80,
      path: url.pathname + url.search,
      method: endpoint.method,
      headers
    };
    
    const req = http.request(options, (res) => {
      let data = '';
      
      res.on('data', (chunk) => {
        data += chunk;
      });
      
      res.on('end', () => {
        const responseTime = Date.now() - startTime;
        
        // Track cache hits/misses
        const cacheHeader = res.headers['x-cache'];
        if (cacheHeader === 'HIT') {
          metrics.cacheHits++;
        } else if (cacheHeader === 'MISS') {
          metrics.cacheMisses++;
        }
        
        resolve({
          success: res.statusCode >= 200 && res.statusCode < 300,
          statusCode: res.statusCode,
          responseTime,
          endpoint: endpoint.name,
          cacheStatus: cacheHeader
        });
      });
    });
    
    req.on('error', (error) => {
      const responseTime = Date.now() - startTime;
      resolve({
        success: false,
        statusCode: 0,
        responseTime,
        endpoint: endpoint.name,
        error: error.message
      });
    });
    
    req.setTimeout(5000, () => {
      req.destroy();
      resolve({
        success: false,
        statusCode: 0,
        responseTime: 5000,
        endpoint: endpoint.name,
        error: 'Request timeout'
      });
    });
    
    req.end();
  });
}

/**
 * Update metrics with result
 */
function updateMetrics(result) {
  metrics.totalRequests++;
  
  if (result.success) {
    metrics.successfulRequests++;
  } else {
    metrics.failedRequests++;
    metrics.errors.push({
      endpoint: result.endpoint,
      error: result.error || `Status ${result.statusCode}`
    });
  }
  
  metrics.totalResponseTime += result.responseTime;
  metrics.responseTimes.push(result.responseTime);
  metrics.minResponseTime = Math.min(metrics.minResponseTime, result.responseTime);
  metrics.maxResponseTime = Math.max(metrics.maxResponseTime, result.responseTime);
  
  // Track status codes
  const statusCode = result.statusCode || 0;
  metrics.statusCodes[statusCode] = (metrics.statusCodes[statusCode] || 0) + 1;
}

/**
 * Calculate percentile
 */
function calculatePercentile(arr, percentile) {
  const sorted = arr.slice().sort((a, b) => a - b);
  const index = Math.ceil((percentile / 100) * sorted.length) - 1;
  return sorted[index] || 0;
}

/**
 * Print performance report
 */
function printReport() {
  console.log('\n' + '='.repeat(60));
  console.log('PERFORMANCE TEST REPORT');
  console.log('='.repeat(60));
  
  console.log('\nTest Configuration:');
  console.log(`  API Base URL: ${API_BASE_URL}`);
  console.log(`  Concurrent Requests: ${CONCURRENT_REQUESTS}`);
  console.log(`  Test Duration: ${TEST_DURATION_MS}ms`);
  
  console.log('\nRequest Statistics:');
  console.log(`  Total Requests: ${metrics.totalRequests}`);
  console.log(`  Successful: ${metrics.successfulRequests} (${((metrics.successfulRequests / metrics.totalRequests) * 100).toFixed(2)}%)`);
  console.log(`  Failed: ${metrics.failedRequests} (${((metrics.failedRequests / metrics.totalRequests) * 100).toFixed(2)}%)`);
  console.log(`  Requests/sec: ${(metrics.totalRequests / (TEST_DURATION_MS / 1000)).toFixed(2)}`);
  
  console.log('\nResponse Time (ms):');
  console.log(`  Average: ${(metrics.totalResponseTime / metrics.totalRequests).toFixed(2)}`);
  console.log(`  Min: ${metrics.minResponseTime}`);
  console.log(`  Max: ${metrics.maxResponseTime}`);
  console.log(`  P50 (Median): ${calculatePercentile(metrics.responseTimes, 50)}`);
  console.log(`  P95: ${calculatePercentile(metrics.responseTimes, 95)}`);
  console.log(`  P99: ${calculatePercentile(metrics.responseTimes, 99)}`);
  
  console.log('\nCache Performance:');
  console.log(`  Cache Hits: ${metrics.cacheHits}`);
  console.log(`  Cache Misses: ${metrics.cacheMisses}`);
  if (metrics.cacheHits + metrics.cacheMisses > 0) {
    const hitRate = (metrics.cacheHits / (metrics.cacheHits + metrics.cacheMisses)) * 100;
    console.log(`  Hit Rate: ${hitRate.toFixed(2)}%`);
  }
  
  console.log('\nStatus Code Distribution:');
  Object.entries(metrics.statusCodes)
    .sort(([a], [b]) => parseInt(a) - parseInt(b))
    .forEach(([code, count]) => {
      console.log(`  ${code}: ${count} (${((count / metrics.totalRequests) * 100).toFixed(2)}%)`);
    });
  
  if (metrics.errors.length > 0) {
    console.log('\nErrors (first 10):');
    metrics.errors.slice(0, 10).forEach((error, index) => {
      console.log(`  ${index + 1}. ${error.endpoint}: ${error.error}`);
    });
  }
  
  console.log('\n' + '='.repeat(60));
  
  // Performance assessment
  const avgResponseTime = metrics.totalResponseTime / metrics.totalRequests;
  const successRate = (metrics.successfulRequests / metrics.totalRequests) * 100;
  
  console.log('\nPerformance Assessment:');
  if (avgResponseTime < 100 && successRate > 99) {
    console.log('  ✓ EXCELLENT - System performing optimally');
  } else if (avgResponseTime < 500 && successRate > 95) {
    console.log('  ✓ GOOD - System performing well');
  } else if (avgResponseTime < 1000 && successRate > 90) {
    console.log('  ⚠ FAIR - System performance acceptable but could be improved');
  } else {
    console.log('  ✗ POOR - System performance needs optimization');
  }
  
  console.log('='.repeat(60) + '\n');
}

/**
 * Run concurrent load test
 */
async function runLoadTest() {
  console.log('Starting performance test...');
  console.log(`Testing ${API_BASE_URL} with ${CONCURRENT_REQUESTS} concurrent requests for ${TEST_DURATION_MS}ms`);
  
  if (!JWT_TOKEN) {
    console.log('Note: No JWT_TOKEN provided. Testing public endpoints only.');
    console.log('To test authenticated endpoints, set JWT_TOKEN environment variable.\n');
  } else {
    console.log('JWT token provided. Testing all endpoints.\n');
  }
  
  const startTime = Date.now();
  const activeRequests = new Set();
  
  // Function to make a request and schedule the next one
  async function makeRequestLoop() {
    while (Date.now() - startTime < TEST_DURATION_MS) {
      // Pick a random endpoint (only public ones if no JWT token)
      const availableEndpoints = JWT_TOKEN ? ENDPOINTS : ENDPOINTS.filter(e => e.public);
      const endpoint = availableEndpoints[Math.floor(Math.random() * availableEndpoints.length)];
      
      // Make request
      const result = await makeRequest(endpoint);
      updateMetrics(result);
      
      // Small delay to prevent overwhelming the server
      await new Promise(resolve => setTimeout(resolve, 10));
    }
  }
  
  // Start concurrent request loops
  for (let i = 0; i < CONCURRENT_REQUESTS; i++) {
    activeRequests.add(makeRequestLoop());
  }
  
  // Wait for all requests to complete
  await Promise.all(Array.from(activeRequests));
  
  // Print report
  printReport();
}

// Run the test
runLoadTest().catch(error => {
  console.error('Test failed:', error);
  process.exit(1);
});
