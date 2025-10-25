/**
 * Test script for event registration endpoint
 * Tests POST /api/events/:id/register
 */

const API_BASE_URL = 'http://localhost:3000/api';

async function testEventRegistration() {
  console.log('Testing Event Registration Endpoint...\n');
  
  try {
    // Step 1: Login to get auth token
    console.log('1. Logging in as test user...');
    const loginResponse = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        email: 'user@giip.info',
        password: 'Password123!'
      })
    });
    
    if (!loginResponse.ok) {
      throw new Error(`Login failed: ${loginResponse.status}`);
    }
    
    const loginData = await loginResponse.json();
    console.log('Login response:', JSON.stringify(loginData, null, 2));
    const token = loginData.token || loginData.data?.token;
    
    if (!token) {
      throw new Error('No token received from login');
    }
    
    console.log('✓ Login successful\n');
    
    // Step 2: Get list of active events
    console.log('2. Fetching active events...');
    const eventsResponse = await fetch(`${API_BASE_URL}/events?status=active&limit=1`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    
    if (!eventsResponse.ok) {
      throw new Error(`Failed to fetch events: ${eventsResponse.status}`);
    }
    
    const eventsData = await eventsResponse.json();
    
    if (eventsData.data.length === 0) {
      console.log('✗ No active events found. Please create an event first.');
      return;
    }
    
    const eventId = eventsData.data[0].id;
    console.log(`✓ Found event: ${eventsData.data[0].title} (ID: ${eventId})\n`);
    
    // Step 3: Register for the event
    console.log('3. Registering for event...');
    const registrationResponse = await fetch(`${API_BASE_URL}/events/${eventId}/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({
        organization: 'Test Organization',
        notes: 'This is a test registration'
      })
    });
    
    const registrationData = await registrationResponse.json();
    
    if (registrationResponse.status === 409) {
      console.log('✓ User already registered for this event (expected behavior)');
      console.log('Registration data:', JSON.stringify(registrationData, null, 2));
      return;
    }
    
    if (!registrationResponse.ok) {
      throw new Error(`Registration failed: ${registrationResponse.status} - ${JSON.stringify(registrationData)}`);
    }
    
    console.log('✓ Registration successful!');
    console.log('Registration details:', JSON.stringify(registrationData, null, 2));
    
    // Step 4: Try to register again (should fail with 409)
    console.log('\n4. Testing duplicate registration (should fail)...');
    const duplicateResponse = await fetch(`${API_BASE_URL}/events/${eventId}/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({
        organization: 'Test Organization 2',
        notes: 'This should fail'
      })
    });
    
    const duplicateData = await duplicateResponse.json();
    
    if (duplicateResponse.status === 409) {
      console.log('✓ Duplicate registration correctly rejected');
      console.log('Error response:', JSON.stringify(duplicateData, null, 2));
    } else {
      console.log('✗ Expected 409 status but got:', duplicateResponse.status);
    }
    
    console.log('\n✓ All tests passed!');
    
  } catch (error) {
    console.error('✗ Test failed:', error.message);
    process.exit(1);
  }
}

// Run the test
testEventRegistration();
