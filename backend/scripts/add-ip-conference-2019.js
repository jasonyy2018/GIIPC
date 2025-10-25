/**
 * Script to add the 2019 Innovation and Intellectual Property Conference
 * to the events database as a historical event
 */

const fetch = require('node-fetch');

// Configuration
const API_BASE_URL = 'http://localhost:3000/api';
const ADMIN_EMAIL = 'admin@giip.info';
const ADMIN_PASSWORD = 'Admin@2025';

// Conference data
const conferenceEvent = {
  title: 'Innovation and Intellectual Property: Firm Strategies and Policy Challenges in a Rapidly Changing World',
  description: `Global competition is increasingly characterized by competition for technological leadership. Meanwhile, given the increasingly prominent roles of intellectual properties (IPs), technology standards, and business platforms, the boundary between firm competitiveness and institutional infrastructure is blurring.

As manifested in the recent trade dispute between the U.S. and China, states have come to the forefront of market competition. Because the development of global markets requires coordinated efforts by public and private entities across countries, any shift from coordination to conflict can quickly escalate to systematic risks to the global economy.

This conference engaged in in-depth, cross-disciplinary discussion on:
• Finding facts: What are the realities on the ground and what are the important trends
• Understanding complexities: IP protection, knowledge spillover, and global competition dynamics
• Developing toolboxes: Tools for policy makers and businesses to navigate R&D processes

The conference featured intensive academic discussions, keynote speeches, and round-table discussions with scholars, business executives, IP lawyers, and policy makers.

Co-sponsored by the China Research and Engagement Fund of the University of Pennsylvania, the Wharton School, the Guanghua School of Management at Peking University, the College of Business at Shanghai University of Finance and Economics, and SHU-UTS SILC Business School of Shanghai University.`,
  start_date: '2019-06-28T12:00:00Z',
  end_date: '2019-06-29T17:40:00Z',
  location: 'Penn Wharton China Center, Beijing, China',
  capacity: null
};

async function login() {
  console.log('Logging in as admin...');
  const response = await fetch(`${API_BASE_URL}/auth/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      email: ADMIN_EMAIL,
      password: ADMIN_PASSWORD
    })
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(`Login failed: ${JSON.stringify(error)}`);
  }

  const data = await response.json();
  console.log('✓ Login successful');
  return data.data.token;
}

async function createEvent(token) {
  console.log('\nCreating conference event...');
  const response = await fetch(`${API_BASE_URL}/events`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify(conferenceEvent)
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(`Event creation failed: ${JSON.stringify(error, null, 2)}`);
  }

  const data = await response.json();
  console.log('✓ Event created successfully');
  console.log('\nEvent Details:');
  console.log(`  ID: ${data.data.id}`);
  console.log(`  Title: ${data.data.title}`);
  console.log(`  Location: ${data.data.location}`);
  console.log(`  Start Date: ${data.data.start_date}`);
  console.log(`  End Date: ${data.data.end_date}`);
  
  return data.data;
}

async function main() {
  try {
    console.log('='.repeat(80));
    console.log('Adding 2019 IP Conference to Database');
    console.log('='.repeat(80));
    
    // Login
    const token = await login();
    
    // Create event
    const event = await createEvent(token);
    
    console.log('\n' + '='.repeat(80));
    console.log('✓ Conference successfully added to database!');
    console.log('='.repeat(80));
    console.log(`\nYou can view this event at: http://localhost:8080/event-detail.html?id=${event.id}`);
    
  } catch (error) {
    console.error('\n' + '='.repeat(80));
    console.error('✗ Error:', error.message);
    console.error('='.repeat(80));
    process.exit(1);
  }
}

// Run the script
main();
