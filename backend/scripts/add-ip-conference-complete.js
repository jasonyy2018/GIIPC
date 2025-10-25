/**
 * Complete script to add both the event and news article for the
 * 2019 Innovation and Intellectual Property Conference
 */

const fetch = require('node-fetch');

// Configuration
const API_BASE_URL = 'http://localhost:3000/api';
const ADMIN_EMAIL = 'admin@giip.info';
const ADMIN_PASSWORD = 'Admin@2025';

// Conference event data
const conferenceEvent = {
  title: 'Innovation and Intellectual Property: Firm Strategies and Policy Challenges in a Rapidly Changing World',
  description: `Global competition is increasingly characterized by competition for technological leadership. Meanwhile, given the increasingly prominent roles of intellectual properties (IPs), technology standards, and business platforms, the boundary between firm competitiveness and institutional infrastructure is blurring.

As manifested in the recent trade dispute between the U.S. and China, states have come to the forefront of market competition. Because the development of global markets requires coordinated efforts by public and private entities across countries, any shift from coordination to conflict can quickly escalate to systematic risks to the global economy.

This conference engaged in in-depth, cross-disciplinary discussion on:
• Finding facts: What are the realities on the ground and what are the important trends
• Understanding complexities: IP protection, knowledge spillover, and global competition dynamics
• Developing toolboxes: Tools for policy makers and businesses to navigate R&D processes

The conference featured intensive academic discussions, keynote speeches, and round-table discussions with scholars, business executives, IP lawyers, and policy makers.

Co-organized by Changqi Wu & Minyuan Zhao
Co-sponsored by the China Research and Engagement Fund of the University of Pennsylvania, the Wharton School, the Guanghua School of Management at Peking University, the College of Business at Shanghai University of Finance and Economics, and SHU-UTS SILC Business School of Shanghai University.`,
  start_date: '2019-06-28T12:00:00Z',
  end_date: '2019-06-29T17:40:00Z',
  location: 'Penn Wharton China Center, Beijing, China',
  capacity: null
};

// News article data
const newsArticle = {
  title: 'GIIP Hosts Major Conference on Innovation and Intellectual Property in Beijing',
  content: `The Global Institute for Innovation and Intellectual Property (GIIP) successfully hosted a landmark conference on "Innovation and Intellectual Property: Firm Strategies and Policy Challenges in a Rapidly Changing World" at the Penn Wharton China Center in Beijing, China, on June 28-29, 2019.

The two-day conference brought together leading scholars, business executives, IP lawyers, and policy makers to engage in cross-disciplinary discussions on the evolving landscape of intellectual property and innovation in the context of global competition.

**Conference Highlights**

The conference addressed three key themes:

**Finding Facts:** Participants worked to identify ground realities and important trends that shed light on the future of IP and innovation, moving beyond entrenched opinions and stereotypical views to establish robust, fact-based explanations.

**Understanding Complexities:** Discussions explored nuanced questions such as whether strong IP protection is always beneficial, the role of knowledge spillover in global competition, and the appropriate level of indigenous R&D given the interdependence and vulnerabilities in the global economy.

**Developing Toolboxes:** The conference examined practical tools for policy makers to motivate innovation while reducing systematic risk, and for businesses to navigate risky R&D processes both within and across countries.

**Conference Structure**

Day 1 (June 28) featured intensive academic discussions with nine research presentations organized into three sessions:
- Innovation and IP with Chinese Characteristics
- Creating & Appropriating Value from Innovation
- Coopetition, Frenemies, and Retaliation

Day 2 (June 29) opened the floor to a broader audience with keynote speeches, panel discussions, and additional academic presentations covering:
- The Role of Firm Boundaries
- MNE Patenting in China
- IP in Practice
- Secrecy and Trade Secrets
- Technology and the Changing Society
- Knowledge Flow within and across Firms

**Distinguished Speakers**

The conference featured keynote addresses from:
- **Christopher Yoo** (University of Pennsylvania): "Climbing up the Value Chain: the Experience of Asian Countries"
- **Jietang Tian** (Development Research Center of the State Council): "Understanding 3 Perspectives of China's Innovation Policy Trends"

Panel discussions included contributions from Brad Farnsworth (Center for Internationalization and Global Engagement), Bernard Yeung (National University of Singapore Business School), and Xiucheng Han (Intellectual Property Development & Research Center, China National Intellectual Property Administration).

**Industry Perspectives**

The conference also featured presentations from industry leaders including:
- Junwei Fan (Alibaba) on "IP Protection and Innovation in the Digital Age"
- Linda Jing (Bayer Crop Science) on "IP Impact on Agriculture Innovation: a Global Perspective"
- Lu Wei (Shanghai Academy of Development & Reform) on "Motivating R&D and IP Protection: the Case of Shanghai Technology Innovation Center"

**Academic Contributions**

Researchers from leading institutions worldwide presented cutting-edge research, including scholars from University of Pennsylvania, University of Michigan, University of Southern California, Peking University, National University of Singapore, Cornell University, Tsinghua University, and many other prestigious institutions.

**Conference Sponsors**

The conference was co-sponsored by the China Research and Engagement Fund of the University of Pennsylvania, the Wharton School, Guanghua School of Management at Peking University, College of Business at Shanghai University of Finance and Economics, and SHU-UTS SILC Business School of Shanghai University.

**Impact and Significance**

This conference took place during a critical period of heightened attention to IP issues in global trade relations, particularly between the U.S. and China. The discussions provided valuable insights into how firms and policymakers can navigate the complex landscape of innovation and IP protection in an increasingly interconnected yet competitive global economy.`,
  image_url: null,
  published_date: '2019-06-30'
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
  console.log(`  Event ID: ${data.data.id}`);
  
  return data.data;
}

async function createNews(token) {
  console.log('\nCreating news article...');
  const response = await fetch(`${API_BASE_URL}/news`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify(newsArticle)
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(`News creation failed: ${JSON.stringify(error, null, 2)}`);
  }

  const data = await response.json();
  console.log('✓ News article created successfully');
  console.log(`  News ID: ${data.data.id}`);
  
  return data.data;
}

async function main() {
  try {
    console.log('='.repeat(80));
    console.log('Adding 2019 IP Conference - Event and News Article');
    console.log('='.repeat(80));
    console.log();
    
    // Login
    const token = await login();
    
    // Create event
    const event = await createEvent(token);
    
    // Create news article
    const news = await createNews(token);
    
    console.log('\n' + '='.repeat(80));
    console.log('✓ Successfully added conference event and news article!');
    console.log('='.repeat(80));
    console.log('\nSummary:');
    console.log(`  Event ID: ${event.id}`);
    console.log(`  Event URL: http://localhost:8080/event-detail.html?id=${event.id}`);
    console.log(`  News ID: ${news.id}`);
    console.log(`  Title: ${event.title.substring(0, 60)}...`);
    console.log(`  Location: ${event.location}`);
    console.log(`  Dates: June 28-29, 2019`);
    console.log();
    
  } catch (error) {
    console.error('\n' + '='.repeat(80));
    console.error('✗ Error:', error.message);
    console.error('='.repeat(80));
    console.error('\nTroubleshooting:');
    console.error('  1. Make sure the backend server is running (npm start in backend folder)');
    console.error('  2. Verify the database is running and accessible');
    console.error('  3. Check that the admin user exists with correct credentials');
    console.error('  4. Ensure the API endpoint is correct (http://localhost:3000/api)');
    console.error();
    process.exit(1);
  }
}

// Run the script
main();
