-- Add 3rd Conference on Global Innovation and Intellectual Property (May 17-18, 2025)
-- School of Management, Fudan University, Shanghai, China

-- Add as a news article
INSERT INTO news (title, content, image_url, published_date, created_by) VALUES
(
    'Call for Participation: 3rd Conference on Global Innovation and Intellectual Property',
    'We are excited to announce the 3rd Conference on Global Innovation and Intellectual Property: Firm Strategies and Policy Challenges in a Rapidly Changing World, to be held on May 17-18, 2025, at the School of Management, Fudan University in Shanghai, China.

Conference Theme:
Global competition is increasingly characterized by competition for technological leadership. Given the increasingly prominent roles of intellectual properties (IPs), technology standards, and business platforms, the boundary between firm competitiveness and institutional infrastructure is blurring. As manifested in recent developments around healthcare, AI, and electric vehicles, states have come to the forefront of market competition in a wide range of industries. The coordination and competition among public and private entities across nations will shape the future trajectories of global markets.

Key Discussion Topics:
• Finding Facts: Identifying realities on the ground and important trends that shed light on the future, moving beyond entrenched opinions and stereotypical views
• Understanding Complexities: Examining whether strong IP protection is always beneficial, whether knowledge outflow is always detrimental, and how our understanding of IP in domestic settings applies to global competition
• Developing Toolboxes: Exploring tools beyond patent filing for businesses to navigate risky R&D processes, and policy tools beyond IP courts to motivate innovation while reducing systematic risk

Conference Highlights:
• Cross-disciplinary discussions on innovation and IP strategies under de-coupling
• Sessions on secret patenting and competitive advantages in a connected world
• Exploration of AI''s effect on labor, competition, and intellectual property rights
• Panel discussions featuring voices from policymakers, business leaders, and legal professionals
• Poster sessions covering patents as probable rights, IP strategy, trade friction impacts, and new tools in IP research

Co-Sponsors:
• McDonnell International Scholars Academy, Washington University in St. Louis
• School of Management, Fudan University
• Guanghua School of Management, Peking University
• Olin Business School, Washington University in St. Louis

Co-Organizers:
• Prof. Changqi Wu, Peking University
• Prof. Minyuan Zhao, Washington University in St. Louis

Organization Committee:
• Prof. Xuhong Li, Fudan University
• Prof. Tian Wei, Fudan University

Registration is now open. For more information, please contact: GIIP2025@fdsm.fudan.edu.cn',
    'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800',
    CURRENT_DATE,
    (SELECT id FROM users WHERE email = 'admin@giip.info')
);

-- Add as a conference entry
INSERT INTO conferences (title, description, date_range, location, summary, start_date, end_date, created_by) VALUES
(
    '3rd Conference on Global Innovation and Intellectual Property 2025',
    'The 3rd Conference on Global Innovation and Intellectual Property: Firm Strategies and Policy Challenges in a Rapidly Changing World brings together leading scholars, policymakers, business leaders, and legal professionals to address critical challenges in the evolving landscape of global innovation and intellectual property.

Conference Context:
Global competition is increasingly characterized by competition for technological leadership. The boundary between firm competitiveness and institutional infrastructure is blurring as intellectual properties, technology standards, and business platforms play increasingly prominent roles. Recent developments in healthcare, AI, and electric vehicles demonstrate how states have come to the forefront of market competition across industries. The coordination and competition among public and private entities across nations will shape future trajectories of global markets.

Key Themes:

1. Finding Facts
What are the realities on the ground and important trends that may shed light on the future? Moving beyond entrenched opinions and stereotypical views to identify facts and establish robust explanations.

2. Understanding Complexities
• Is strong IP protection always good?
• Is knowledge outflow always bad?
• To what extent does our understanding of IP, derived mostly from domestic settings, still hold in the context of global competition?
• What is the right level of indigenous innovation in light of interdependence and associated vulnerabilities in the global economy?

3. Developing Toolboxes
• Beyond filing for patents, what tools can businesses use to navigate risky R&D processes within and across countries?
• Besides strengthening IP courts, what tools can policymakers use to motivate innovation while reducing systematic risk?
• Will big data and AI help firms see the competitive landscape more clearly?

Conference Program:

Day 1 (May 17):
• Session 1: Innovation and IP Strategies under De-Coupling
• Session 2: Secret Patenting and Patenting with Trade Secret
• Session 3: Innovation in the Rapidly Changing World - The Role of Academics
• Session 4: Competitive Advantages in a Connected World
• Session 5: The Effect of AI on Labor, Competition and Intellectual Property Rights
• Session 6: Innovation and Governance with Informal Institutions
• Poster Session Groups:
  - Patents as probable rights
  - IP strategy and firm incentives
  - The impact of trade friction on innovation strategies
  - New tools in IP research

Day 2 (May 18):
• Session 7: Institutions for Innovation - IP and Industrial Policies
• Session 8: Voices from Policymakers
• Session 9: Voices from Business Leaders
• Session 10: Voices from Legal Professionals

Co-Sponsors:
• McDonnell International Scholars Academy, Washington University in St. Louis
• School of Management, Fudan University
• Guanghua School of Management, Peking University
• Olin Business School, Washington University in St. Louis

Co-Organizers:
• Prof. Changqi Wu, Peking University
• Prof. Minyuan Zhao, Washington University in St. Louis

Organization Committee:
• Prof. Xuhong Li, Fudan University
• Prof. Tian Wei, Fudan University

For more information and registration: GIIP2025@fdsm.fudan.edu.cn',
    'May 17-18, 2025',
    'School of Management, Fudan University, Shanghai, China',
    'The 3rd Conference on Global Innovation and Intellectual Property addresses firm strategies and policy challenges in a rapidly changing world. The conference features cross-disciplinary discussions on innovation and IP strategies under de-coupling, secret patenting, competitive advantages in connected markets, and the impact of AI on labor and IP rights. Special sessions bring together voices from policymakers, business leaders, and legal professionals to discuss institutions for innovation, IP and industrial policies, and practical tools for navigating the complex global innovation landscape. The event includes poster sessions covering emerging research on patents, IP strategy, trade friction impacts, and new research tools.',
    '2025-05-17 08:00:00',
    '2025-05-18 12:45:00',
    (SELECT id FROM users WHERE email = 'admin@giip.info')
);

-- Add as an event entry
INSERT INTO events (title, description, date, location, capacity, start_date, end_date, created_by) VALUES
(
    '3rd Conference on Global Innovation and Intellectual Property',
    'Join us for the 3rd Conference on Global Innovation and Intellectual Property: Firm Strategies and Policy Challenges in a Rapidly Changing World. This premier conference brings together leading scholars, policymakers, business leaders, and legal professionals to address critical challenges in global innovation and intellectual property.

Conference Focus:
In an era where global competition is increasingly characterized by competition for technological leadership, this conference explores how intellectual properties, technology standards, and business platforms are reshaping the boundary between firm competitiveness and institutional infrastructure. We examine how coordination and competition among public and private entities across nations will shape the future of global markets.

Key Discussion Areas:
• Innovation and IP strategies under de-coupling
• Secret patenting and trade secrets
• The role of academics in a rapidly changing world
• Competitive advantages in connected markets
• AI''s impact on labor, competition, and IP rights
• Innovation and governance with informal institutions
• IP and industrial policies
• Perspectives from policymakers, business leaders, and legal professionals

Detailed Agenda:

Saturday, May 17:
• 8:00-8:30am: Registration
• 8:30-8:50am: Opening Remarks
• 8:50-10:00am: Session 1 - Innovation and IP Strategies under De-Coupling
• 10:00-10:20am: Tea Break
• 10:20-11:10am: Session 2 - Secret Patenting and Patenting with Trade Secret
• 11:10am-12:00pm: Session 3 - Innovation in the Rapidly Changing World: The Role of Academics
• 12:00-1:30pm: Lunch
• 1:30-2:40pm: Session 4 - Competitive Advantages in a Connected World
• 2:40-3:30pm: Session 5 - The Effect of AI on Labor, Competition and Intellectual Property Rights
• 3:30-3:50pm: Tea Break
• 3:50-5:00pm: Session 6 - Innovation and Governance with Informal Institutions
• 5:00-6:15pm: Drink and Poster Session
  - Group 1: Patents as probable rights
  - Group 2: IP strategy and firm incentives
  - Group 3: The impact of trade friction on innovation strategies
  - Group 4: New tools in IP research
• 6:00pm: Dinner for all registered participants

Sunday, May 18:
• 8:30-9:20am: Session 7 - Institutions for Innovation: IP and Industrial Policies
• 9:20-9:40am: Session 8 - Voices from Policymakers
• 9:40-10:00am: Tea Break
• 10:00-11:30am: Session 9 - Voices from Business Leaders
• 11:30am-12:40pm: Session 10 - Voices from Legal Professionals
• 12:40-12:45pm: Closing Remarks
• 12:45pm: Lunch, Social, and Farewell

Co-Sponsors:
• McDonnell International Scholars Academy, Washington University in St. Louis
• School of Management, Fudan University
• Guanghua School of Management, Peking University
• Olin Business School, Washington University in St. Louis

Co-Organizers:
• Prof. Changqi Wu, Peking University
• Prof. Minyuan Zhao, Washington University in St. Louis

Organization Committee:
• Prof. Xuhong Li, Fudan University
• Prof. Tian Wei, Fudan University

Registration Information:
Registration is now open. For questions or to request more information, please contact:
Email: GIIP2025@fdsm.fudan.edu.cn

Venue: School of Management, Fudan University, Shanghai, China

This conference provides a unique opportunity for cross-disciplinary dialogue on the most pressing issues in global innovation and intellectual property. We look forward to your participation!',
    '2025-05-17',
    'School of Management, Fudan University, Shanghai, China',
    200,
    '2025-05-17 08:00:00',
    '2025-05-18 12:45:00',
    (SELECT id FROM users WHERE email = 'admin@giip.info')
);

-- Verify the insertions
SELECT 'GIIP3 Conference data added successfully!' as status;
SELECT 'News article:' as type, title, published_date FROM news WHERE title LIKE '%3rd Conference on Global Innovation%' ORDER BY published_date DESC LIMIT 1
UNION ALL
SELECT 'Conference:', title, start_date::date FROM conferences WHERE title LIKE '%3rd Conference on Global Innovation%' ORDER BY start_date DESC LIMIT 1
UNION ALL
SELECT 'Event:', title, date FROM events WHERE title LIKE '%3rd Conference on Global Innovation%' ORDER BY date DESC LIMIT 1;
