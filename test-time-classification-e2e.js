/**
 * End-to-End Integration Test for Time Classification Feature
 * Tests the complete flow from creation to display
 */

const API_BASE_URL = 'http://localhost:3000/api';

// Test configuration
const TEST_CONFIG = {
  adminEmail: 'admin@giip.info',
  adminPassword: 'Admin123!',
  testTimeout: 30000
};

// Color codes for console output
const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m'
};

// Test results tracking
const results = {
  passed: 0,
  failed: 0,
  tests: []
};

/**
 * Log test result
 */
function logTest(name, passed, message = '') {
  const status = passed ? `${colors.green}✓ PASS${colors.reset}` : `${colors.red}✗ FAIL${colors.reset}`;
  console.log(`  ${status} ${name}`);
  if (message) {
    console.log(`    ${colors.yellow}${message}${colors.reset}`);
  }
  
  results.tests.push({ name, passed, message });
  if (passed) {
    results.passed++;
  } else {
    results.failed++;
  }
}

/**
 * Make API request
 */
async function apiRequest(endpoint, options = {}) {
  const url = `${API_BASE_URL}${endpoint}`;
  const response = await fetch(url, {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers
    },
    ...options
  });
  
  const data = await response.json();
  return { response, data };
}

/**
 * Login and get auth token
 */
async function login() {
  console.log(`\n${colors.cyan}Authenticating...${colors.reset}`);
  
  const { response, data } = await apiRequest('/auth/login', {
    method: 'POST',
    body: JSON.stringify({
      email: TEST_CONFIG.adminEmail,
      password: TEST_CONFIG.adminPassword
    })
  });
  
  if (!response.ok || !data.success) {
    throw new Error('Authentication failed: ' + (data.error?.message || 'Unknown error'));
  }
  
  console.log(`${colors.green}✓ Authenticated successfully${colors.reset}`);
  return data.token;
}

/**
 * Test 1: Create active event
 */
async function testCreateActiveEvent(token) {
  console.log(`\n${colors.blue}Test 1: Create Active Event${colors.reset}`);
  
  const futureDate = new Date();
  futureDate.setDate(futureDate.getDate() + 7);
  
  const eventData = {
    title: 'E2E Test Active Event',
    description: 'This is a test active event for E2E testing',
    start_date: new Date().toISOString(),
    end_date: futureDate.toISOString(),
    location: 'Test Location',
    capacity: 100
  };
  
  const { response, data } = await apiRequest('/events', {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}` },
    body: JSON.stringify(eventData)
  });
  
  const passed = response.ok && data.success && data.data.id;
  logTest('Should create active event', passed, passed ? `Event ID: ${data.data.id}` : data.error?.message);
  
  if (passed) {
    logTest('Should have status "active"', data.data.status === 'active');
    logTest('Should have start_date', !!data.data.start_date);
    logTest('Should have end_date', !!data.data.end_date);
    return data.data.id;
  }
  
  return null;
}

/**
 * Test 2: Create past event
 */
async function testCreatePastEvent(token) {
  console.log(`\n${colors.blue}Test 2: Create Past Event${colors.reset}`);
  
  const pastDate = new Date();
  pastDate.setDate(pastDate.getDate() - 7);
  
  const eventData = {
    title: 'E2E Test Past Event',
    description: 'This is a test past event for E2E testing',
    start_date: pastDate.toISOString(),
    end_date: pastDate.toISOString(),
    location: 'Test Location',
    capacity: 100
  };
  
  const { response, data } = await apiRequest('/events', {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}` },
    body: JSON.stringify(eventData)
  });
  
  const passed = response.ok && data.success && data.data.id;
  logTest('Should create past event', passed, passed ? `Event ID: ${data.data.id}` : data.error?.message);
  
  if (passed) {
    logTest('Should have status "past"', data.data.status === 'past');
    return data.data.id;
  }
  
  return null;
}

/**
 * Test 3: Filter active events
 */
async function testFilterActiveEvents(token, activeEventId) {
  console.log(`\n${colors.blue}Test 3: Filter Active Events${colors.reset}`);
  
  const { response, data } = await apiRequest('/events?status=active', {
    headers: { Authorization: `Bearer ${token}` }
  });
  
  const passed = response.ok && data.success;
  logTest('Should fetch active events', passed);
  
  if (passed) {
    const allActive = data.data.every(event => event.status === 'active');
    logTest('All events should have status "active"', allActive);
    
    const includesTestEvent = data.data.some(event => event.id === activeEventId);
    logTest('Should include created active event', includesTestEvent);
    
    logTest('Active events count', true, `Found ${data.data.length} active events`);
  }
}

/**
 * Test 4: Filter past events
 */
async function testFilterPastEvents(token, pastEventId) {
  console.log(`\n${colors.blue}Test 4: Filter Past Events${colors.reset}`);
  
  const { response, data } = await apiRequest('/events?status=past', {
    headers: { Authorization: `Bearer ${token}` }
  });
  
  const passed = response.ok && data.success;
  logTest('Should fetch past events', passed);
  
  if (passed) {
    const allPast = data.data.every(event => event.status === 'past');
    logTest('All events should have status "past"', allPast);
    
    const includesTestEvent = data.data.some(event => event.id === pastEventId);
    logTest('Should include created past event', includesTestEvent);
    
    logTest('Past events count', true, `Found ${data.data.length} past events`);
  }
}

/**
 * Test 5: Sort events by start_date
 */
async function testSortEvents(token) {
  console.log(`\n${colors.blue}Test 5: Sort Events${colors.reset}`);
  
  const { response, data } = await apiRequest('/events?sortBy=start_date&sortOrder=desc', {
    headers: { Authorization: `Bearer ${token}` }
  });
  
  const passed = response.ok && data.success;
  logTest('Should fetch sorted events', passed);
  
  if (passed && data.data.length > 1) {
    let isSorted = true;
    for (let i = 0; i < data.data.length - 1; i++) {
      const current = new Date(data.data[i].start_date);
      const next = new Date(data.data[i + 1].start_date);
      if (current < next) {
        isSorted = false;
        break;
      }
    }
    logTest('Events should be sorted by start_date descending', isSorted);
  }
}

/**
 * Test 6: Validate date range
 */
async function testDateRangeValidation(token) {
  console.log(`\n${colors.blue}Test 6: Date Range Validation${colors.reset}`);
  
  const invalidEventData = {
    title: 'Invalid Event',
    description: 'Event with invalid date range',
    start_date: '2025-11-20T10:00:00Z',
    end_date: '2025-11-19T10:00:00Z', // End before start
    location: 'Test Location',
    capacity: 100
  };
  
  const { response, data } = await apiRequest('/events', {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}` },
    body: JSON.stringify(invalidEventData)
  });
  
  const passed = !response.ok && !data.success;
  logTest('Should reject invalid date range', passed, data.error?.message || 'Validation passed incorrectly');
}

/**
 * Test 7: Test conferences time classification
 */
async function testConferencesTimeClassification(token) {
  console.log(`\n${colors.blue}Test 7: Conferences Time Classification${colors.reset}`);
  
  // Create active conference
  const futureDate = new Date();
  futureDate.setDate(futureDate.getDate() + 14);
  
  const activeConferenceData = {
    title: 'E2E Test Active Conference',
    description: 'Test active conference',
    start_date: new Date().toISOString(),
    end_date: futureDate.toISOString(),
    location: 'Conference Center',
    summary: 'Test summary'
  };
  
  const { response: createResponse, data: createData } = await apiRequest('/conferences', {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}` },
    body: JSON.stringify(activeConferenceData)
  });
  
  logTest('Should create active conference', createResponse.ok && createData.success);
  
  // Fetch active conferences
  const { response: activeResponse, data: activeData } = await apiRequest('/conferences?status=active', {
    headers: { Authorization: `Bearer ${token}` }
  });
  
  const passed = activeResponse.ok && activeData.success;
  logTest('Should fetch active conferences', passed);
  
  if (passed) {
    const allActive = activeData.data.every(conf => conf.status === 'active');
    logTest('All conferences should have status "active"', allActive);
  }
}

/**
 * Test 8: Update event time and verify status change
 */
async function testUpdateEventTime(token, eventId) {
  console.log(`\n${colors.blue}Test 8: Update Event Time${colors.reset}`);
  
  if (!eventId) {
    logTest('Skip - no event ID available', false, 'Previous test failed');
    return;
  }
  
  // Update to past date
  const pastDate = new Date();
  pastDate.setDate(pastDate.getDate() - 1);
  
  const updateData = {
    end_date: pastDate.toISOString()
  };
  
  const { response, data } = await apiRequest(`/events/${eventId}`, {
    method: 'PUT',
    headers: { Authorization: `Bearer ${token}` },
    body: JSON.stringify(updateData)
  });
  
  const passed = response.ok && data.success;
  logTest('Should update event time', passed);
  
  if (passed) {
    logTest('Status should change to "past"', data.data.status === 'past');
  }
}

/**
 * Cleanup test data
 */
async function cleanup(token, eventIds) {
  console.log(`\n${colors.cyan}Cleaning up test data...${colors.reset}`);
  
  for (const id of eventIds) {
    if (id) {
      try {
        await apiRequest(`/events/${id}`, {
          method: 'DELETE',
          headers: { Authorization: `Bearer ${token}` }
        });
      } catch (error) {
        console.log(`${colors.yellow}Warning: Failed to delete event ${id}${colors.reset}`);
      }
    }
  }
  
  console.log(`${colors.green}✓ Cleanup complete${colors.reset}`);
}

/**
 * Print test summary
 */
function printSummary() {
  console.log(`\n${'='.repeat(60)}`);
  console.log(`${colors.cyan}Test Summary${colors.reset}`);
  console.log(`${'='.repeat(60)}`);
  console.log(`Total Tests: ${results.passed + results.failed}`);
  console.log(`${colors.green}Passed: ${results.passed}${colors.reset}`);
  console.log(`${colors.red}Failed: ${results.failed}${colors.reset}`);
  console.log(`${'='.repeat(60)}\n`);
  
  if (results.failed > 0) {
    console.log(`${colors.red}Failed Tests:${colors.reset}`);
    results.tests
      .filter(t => !t.passed)
      .forEach(t => console.log(`  - ${t.name}: ${t.message}`));
    console.log();
  }
}

/**
 * Main test runner
 */
async function runTests() {
  console.log(`\n${'='.repeat(60)}`);
  console.log(`${colors.cyan}Time Classification E2E Integration Tests${colors.reset}`);
  console.log(`${'='.repeat(60)}`);
  
  let token;
  let activeEventId;
  let pastEventId;
  
  try {
    // Login
    token = await login();
    
    // Run tests
    activeEventId = await testCreateActiveEvent(token);
    pastEventId = await testCreatePastEvent(token);
    await testFilterActiveEvents(token, activeEventId);
    await testFilterPastEvents(token, pastEventId);
    await testSortEvents(token);
    await testDateRangeValidation(token);
    await testConferencesTimeClassification(token);
    await testUpdateEventTime(token, activeEventId);
    
    // Cleanup
    await cleanup(token, [activeEventId, pastEventId]);
    
  } catch (error) {
    console.error(`\n${colors.red}Error running tests:${colors.reset}`, error.message);
    results.failed++;
  }
  
  // Print summary
  printSummary();
  
  // Exit with appropriate code
  process.exit(results.failed > 0 ? 1 : 0);
}

// Run tests
runTests().catch(error => {
  console.error(`\n${colors.red}Fatal error:${colors.reset}`, error);
  process.exit(1);
});
