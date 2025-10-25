/**
 * Rate Limiting Test Script
 * Tests the rate limiting functionality for login and API endpoints
 */

import 'dotenv/config';

const API_BASE_URL = process.env.API_URL || 'http://localhost:3000';

/**
 * Test login rate limiting (5 requests per 15 minutes)
 */
async function testLoginRateLimit() {
  console.log('\n🧪 Testing Login Rate Limiting (5 requests per 15 minutes)...\n');
  
  const loginData = {
    email: 'test@giip.info',
    password: 'wrongpassword'
  };
  
  for (let i = 1; i <= 7; i++) {
    try {
      const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(loginData)
      });
      
      const data = await response.json();
      const rateLimitRemaining = response.headers.get('RateLimit-Remaining');
      const rateLimitLimit = response.headers.get('RateLimit-Limit');
      
      console.log(`Request ${i}:`);
      console.log(`  Status: ${response.status}`);
      console.log(`  Rate Limit: ${rateLimitRemaining}/${rateLimitLimit} remaining`);
      
      if (response.status === 429) {
        console.log(`  ✅ Rate limit enforced: ${data.error.message}`);
      } else {
        console.log(`  Message: ${data.message || data.error?.message}`);
      }
      console.log('');
      
      // Small delay between requests
      await new Promise(resolve => setTimeout(resolve, 100));
      
    } catch (error) {
      console.error(`  ❌ Error on request ${i}:`, error.message);
    }
  }
}

/**
 * Test API rate limiting (100 requests per 15 minutes)
 */
async function testApiRateLimit() {
  console.log('\n🧪 Testing API Rate Limiting (100 requests per 15 minutes)...\n');
  console.log('Making 105 requests to /api/health endpoint...\n');
  
  let successCount = 0;
  let rateLimitedCount = 0;
  
  for (let i = 1; i <= 105; i++) {
    try {
      const response = await fetch(`${API_BASE_URL}/api/health`);
      
      if (response.status === 429) {
        rateLimitedCount++;
        if (rateLimitedCount === 1) {
          const data = await response.json();
          console.log(`Request ${i}: ✅ Rate limit enforced at request ${i}`);
          console.log(`  Message: ${data.error.message}\n`);
        }
      } else {
        successCount++;
      }
      
      // Show progress every 20 requests
      if (i % 20 === 0) {
        const rateLimitRemaining = response.headers.get('RateLimit-Remaining');
        const rateLimitLimit = response.headers.get('RateLimit-Limit');
        console.log(`Progress: ${i}/105 requests - ${rateLimitRemaining}/${rateLimitLimit} remaining`);
      }
      
    } catch (error) {
      console.error(`  ❌ Error on request ${i}:`, error.message);
    }
  }
  
  console.log(`\n📊 Results:`);
  console.log(`  Successful requests: ${successCount}`);
  console.log(`  Rate limited requests: ${rateLimitedCount}`);
  console.log(`  Expected: ~100 successful, ~5 rate limited`);
  
  if (rateLimitedCount > 0) {
    console.log(`\n✅ API rate limiting is working correctly!`);
  } else {
    console.log(`\n⚠️  No rate limiting detected - check configuration`);
  }
}

/**
 * Main test runner
 */
async function runTests() {
  console.log('═══════════════════════════════════════════════════════');
  console.log('  Rate Limiting Test Suite');
  console.log('═══════════════════════════════════════════════════════');
  console.log(`  API Base URL: ${API_BASE_URL}`);
  console.log('═══════════════════════════════════════════════════════');
  
  try {
    // Test 1: Login rate limiting
    await testLoginRateLimit();
    
    // Wait a bit between tests
    console.log('\n⏳ Waiting 2 seconds before next test...\n');
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Test 2: API rate limiting
    await testApiRateLimit();
    
    console.log('\n═══════════════════════════════════════════════════════');
    console.log('  All tests completed!');
    console.log('═══════════════════════════════════════════════════════\n');
    
  } catch (error) {
    console.error('\n❌ Test suite failed:', error.message);
    process.exit(1);
  }
}

// Run tests
runTests();
