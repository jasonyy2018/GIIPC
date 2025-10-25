/**
 * Script to add a news article about the 2019 Innovation and Intellectual Property Conference
 */

const fetch = require('node-fetch');

// Configuration
const API_BASE_URL = 'http://localhost:3000/api';
const ADMIN_EMAIL = 'admin@giip.info';
const ADMIN_PASSWORD = 'Admin@2025';

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

Researchers from leading institutions worldwide presented cutting-edge research, including scholars from:
- University of Pennsylvania
- University of Michigan
- University of Southern California
- Peking University
- National University of Singapore
- Cornell University
- Tsinghua University
- And many other prestigious institutions

**Conference Sponsors**

The conference was co-sponsored by:
- China Research and Engagement Fund of the University of Pennsylvania
- The Wharton School
- Guanghua School of Management at Peking University
- College of Business at Shanghai University of Finance and Economics
- SHU-UTS SILC Business School of Shanghai University

**Organizers**

The conference was co-organized by Professors Changqi Wu and Minyuan Zhao, who brought together this diverse group of stakeholders to address critical challenges at the intersection of innovation, intellectual property, and global competition.

**Impact and Significance**

This conference took place during a critical period of heightened attention to IP issues in global trade relations, particularly between the U.S. and China. The discussions provided valuable insights into how firms and policymakers can navigate the complex landscape of innovation and IP protection in an increasingly interconnected yet competitive global economy.

The conference demonstrated GIIP's commitment to fostering evidence-based dialogue and developing practical solutions to the challenges facing innovators, businesses, and policymakers in the rapidly evolving field of intellectual property.`,
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
  console.log('\nNews Article Details:');
  console.log(`  ID: ${data.data.id}`);
  console.log(`  Title: ${data.data.title}`);
  console.log(`  Published Date: ${data.data.published_date}`);
  
  return data.data;
}

async function main() {
  try {
    console.log('='.repeat(80));
    console.log('Adding IP Conference News Article to Database');
    console.log('='.repeat(80));
    
    // Login
    const token = await login();
    
    // Create news article
    const news = await createNews(token);
    
    console.log('\n' + '='.repeat(80));
    console.log('✓ News article successfully added to database!');
    console.log('='.repeat(80));
    console.log(`\nYou can view this article in the news section of the website.`);
    
  } catch (error) {
    console.error('\n' + '='.repeat(80));
    console.error('✗ Error:', error.message);
    console.error('='.repeat(80));
    process.exit(1);
  }
}

// Run the script
main();
