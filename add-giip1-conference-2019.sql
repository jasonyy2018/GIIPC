-- Add Innovation and Intellectual Property Conference (June 28-29, 2019)
-- Penn Wharton China Center, Beijing, China

-- Add as a news article
INSERT INTO news (title, content, image_url, published_date, created_by) VALUES
(
    'Innovation and Intellectual Property Conference 2019 - Beijing',
    'The inaugural Innovation and Intellectual Property: Firm Strategies and Policy Challenges in a Rapidly Changing World conference was successfully held on June 28-29, 2019, at the Penn Wharton China Center in Beijing, China.

Conference Context:
This landmark conference addressed the evolving landscape of global competition, increasingly characterized by competition for technological leadership. With the growing prominence of intellectual properties (IPs), technology standards, and business platforms, the boundary between firm competitiveness and institutional infrastructure has been blurring. The conference took place against the backdrop of the U.S.-China trade dispute, highlighting how states have come to the forefront of market competition.

Key Discussion Areas:
• Finding Facts: Identifying realities on the ground and important trends, moving beyond entrenched opinions and stereotypical views to establish robust explanations
• Understanding Complexities: Examining whether strong IP protection is always beneficial, whether knowledge spillover is always detrimental, and determining the right level of indigenous R&D given global interdependence
• Developing Toolboxes: Exploring policy tools beyond IP courts and business tools beyond patent filing to navigate risky R&D processes

Conference Highlights:
The two-day conference featured intensive academic discussions on Day 1 (June 28), with scholars presenting cutting-edge research on innovation and IP with Chinese characteristics, value creation and appropriation, coopetition and retaliation, firm boundaries, and MNE patenting in China. Day 2 (June 29) opened the floor to a broader audience, featuring keynote speeches from Prof. Christopher Yoo (University of Pennsylvania) on "Climbing up the Value Chain: the Experience of Asian Countries" and Jietang Tian (Development Research Center of the State Council) on "Understanding 3 Perspectives of China''s Innovation Policy Trends."

The conference included panel discussions with practitioners from business, government, and legal sectors, providing reality checks on academic research and offering insights into practical challenges. Sessions covered topics ranging from patent trolls and trade secrets to automation''s impact on worker welfare and knowledge flow across firms.

Co-Sponsors:
• China Research and Engagement Fund, University of Pennsylvania
• The Wharton School
• Guanghua School of Management, Peking University
• College of Business, Shanghai University of Finance and Economics
• SHU-UTS SILC Business School, Shanghai University

Co-Organizers:
• Prof. Changqi Wu, Peking University
• Prof. Minyuan Zhao, University of Pennsylvania

The conference successfully bridged academic research and practical application, providing a platform for cross-disciplinary dialogue on the most pressing issues in global innovation and intellectual property.',
    'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800',
    '2019-06-29',
    (SELECT id FROM users WHERE email = 'admin@giip.info')
);

-- Add as a conference entry
INSERT INTO conferences (title, description, date_range, location, summary, start_date, end_date, created_by) VALUES
(
    'Innovation and Intellectual Property Conference 2019',
    'The inaugural conference on Innovation and Intellectual Property: Firm Strategies and Policy Challenges in a Rapidly Changing World brought together leading scholars, business executives, IP lawyers, and policymakers to address critical challenges in the evolving landscape of global innovation and intellectual property.

Conference Context:
Global competition is increasingly characterized by competition for technological leadership. The boundary between firm competitiveness and institutional infrastructure is blurring as intellectual properties, technology standards, and business platforms play increasingly prominent roles. As manifested in the U.S.-China trade dispute, states have come to the forefront of market competition. The development of global markets requires coordinated efforts by public and private entities across countries, and any shift from coordination to conflict can quickly escalate to systematic risks to the global economy.

Key Themes:

1. Finding Facts
What are the realities on the ground and important trends that may shed light on the future? Moving beyond entrenched opinions and stereotypical views to identify facts and establish robust explanations.

2. Understanding Complexities
• Is strong IP protection always good?
• Is knowledge spillover always bad?
• To what extent does our understanding of IP, derived mostly from domestic settings, still hold in the highly dynamic context of global competition?
• What is the right level of indigenous R&D given all the interdependence and vulnerability in the global economy?

3. Developing Toolboxes
• Besides strengthening IP courts, what tools can policymakers use to motivate innovation while reducing systematic risk?
• Besides filing for patents, what tools can businesses use to navigate risky R&D processes within and across countries?
• Will big data help firms see their competitive position more clearly?

Conference Structure:
Day 1 (June 28) featured intensive academic discussions, taking stock of current knowledge and brainstorming future research directions. Day 2 (June 29) opened to a broader audience with keynote speeches, round-table discussions, and academic presentations, providing opportunities for practitioners to learn about new research and for researchers to receive reality checks on their work.

Academic Sessions:

Session 1: Innovation and IP with Chinese Characteristics
• The Limits of Commanding Innovation: Evidence from Chinese Patents
• China''s Patent Subsidy Policy and its Impacts on Invention and Patent Quality
• Antecedents of Chinese New-to-the-world Innovations
• Managing "Forced" Technology Transfer in Emerging Markets

Session 2: Creating & Appropriating Value from Innovation
• Appropriability of Knowledge Assets in Firm Innovation
• Market Orientation and Return to R&D Investment
• Innovation Value Creation without IPR
• Patent Trolls and Litigating Patent Monetization

Session 3: Coopetition, Frenemies, and Retaliation
• Dynamics in Collaboration for Appropriating Value
• Learning from Successful MNCs in China
• Retaliation in International Trade

Session 4: The Role of Firm Boundaries
• Innovation and Equity Holding Network
• Competition Law Responsibilities of Dominant SEP Owners

Session 5: MNE Patenting in China
• Local IPR Protection and Foreign Firms'' Patenting
• Solving Patent Premium Dilemma in Weak IPR Markets

Session 6: IP in Practice
• IP Protection and Innovation in the Digital Age (Alibaba)
• IP Impact on Agriculture Innovation (Bayer Crop Science)
• Motivating R&D and IP Protection (Shanghai Technology Innovation Center)

Session 7: Secrecy
• Misappropriation Hazards and Firm Secrecy Defense
• Protecting Trade Secret through Litigation

Session 8: Technology and the Changing Society
• Automation and Worker Welfare
• Voices from the Young Generation

Session 9: Knowledge Flow within and across Firms
• R&D Offshoring and Knowledge Diffusion
• Cultural Intelligence Effects on Innovation
• Technology Acquisitions and Spillover Effects
• University Technology Licensing in China

Keynote Speeches:
• Prof. Christopher Yoo (University of Pennsylvania): "Climbing up the Value Chain: the Experience of Asian Countries"
• Jietang Tian (Development Research Center of the State Council): "Understanding 3 Perspectives of China''s Innovation Policy Trends"

Panel Discussion: "From Inside Out, From Outside In"
Featuring perspectives from international business, academia, and government officials including representatives from the Center for Internationalization and Global Engagement, National University of Singapore, and China National Intellectual Property Administration.

Co-Sponsors:
• China Research and Engagement Fund, University of Pennsylvania
• The Wharton School
• Guanghua School of Management, Peking University
• College of Business, Shanghai University of Finance and Economics
• SHU-UTS SILC Business School, Shanghai University

Co-Organizers:
• Prof. Changqi Wu, Peking University
• Prof. Minyuan Zhao, University of Pennsylvania',
    'June 28-29, 2019',
    'Penn Wharton China Center, Beijing, China',
    'The inaugural Innovation and Intellectual Property conference brought together leading scholars and practitioners to address firm strategies and policy challenges in a rapidly changing world. The conference featured intensive academic discussions on innovation with Chinese characteristics, value creation and appropriation, coopetition, firm boundaries, and MNE patenting strategies. Keynote speeches addressed climbing the value chain and China''s innovation policy trends. Panel discussions and practitioner sessions provided insights from business leaders at Alibaba and Bayer, government officials, and IP lawyers. The event successfully bridged academic research and practical application, establishing a foundation for ongoing dialogue on global innovation and intellectual property challenges.',
    '2019-06-28 12:00:00',
    '2019-06-29 17:40:00',
    (SELECT id FROM users WHERE email = 'admin@giip.info')
);

-- Add as an event entry
INSERT INTO events (title, description, date, location, capacity, start_date, end_date, created_by) VALUES
(
    'Innovation and Intellectual Property: Firm Strategies and Policy Challenges',
    'The inaugural conference on Innovation and Intellectual Property: Firm Strategies and Policy Challenges in a Rapidly Changing World brought together scholars, business executives, IP lawyers, and policymakers to address critical challenges in global innovation and intellectual property.

Conference Focus:
In an era where global competition is increasingly characterized by competition for technological leadership, this conference explored how intellectual properties, technology standards, and business platforms are reshaping the boundary between firm competitiveness and institutional infrastructure. Against the backdrop of the U.S.-China trade dispute, the conference examined how coordination and competition among public and private entities across nations shape the future of global markets.

Conference Structure:
• Day 1 (June 28): Intensive academic discussions with scholars presenting cutting-edge research
• Day 2 (June 29): Broader audience engagement with keynote speeches, panel discussions, and practitioner insights

Detailed Agenda:

Friday, June 28:
• 12:00-1:20pm: Lunch and Registration
• 1:20-1:30pm: Welcome
• 1:30-2:50pm: Session 1 - Innovation and IP with Chinese Characteristics
  Chair: Minyuan Zhao (UPenn) | Discussant: Tony Tong (U of Colorado Boulder)
  - The Limits of Commanding Innovation: Evidence from Chinese Patents
  - China''s Patent Subsidy Policy and its Impacts on Invention and Patent Quality
  - Antecedents of Chinese New-to-the-world Innovations
  - Managing "Forced" Technology Transfer in Emerging Markets
• 2:50-3:10pm: Tea Break
• 3:10-4:30pm: Session 2 - Creating & Appropriating Value from Innovation
  Chair: Changqi Wu (Peking U) | Discussant: Suting Hong (ShanghaiTech U)
  - Short-Sighted? Double-Edged Sword of Appropriability of Knowledge Assets
  - Market Orientation and Return to R&D Investment
  - Can Innovation Create Value without IPR?
  - Patent Trolls and Litigating Patent Monetization
• 4:30-5:30pm: Session 3 - Coopetition, Frenemies, and Retaliation
  Chair: Shengce Ren (Tongji U) | Discussant: Lihong Qian (Portland State U)
  - Dynamics in Collaboration for Appropriating Value
  - Learning from Successful MNCs in China
  - Is Retaliation a Good Thing?
• 6:00-8:30pm: Reception & Dinner at Madam Zhu''s Kitchen

Saturday, June 29:
• 8:30-9:50am: Session 4 - The Role of Firm Boundaries
  - Innovation and Equity Holding Network
  - KFTC''s Qualcomm Decisions: Competition Law Responsibilities
• 8:30-9:50am: Session 5 - MNE Patenting in China
  - How Local IPR Protection Affects Foreign Firms'' Patenting
  - Solving Patent Premium Dilemma in Weak IPR Markets
• 9:50-10:10am: Tea Break
• 10:10am-12:00pm: Session 6 - IP in Practice
  - IP Protection and Innovation in the Digital Age (Junwei Fan, Alibaba)
  - IP Impact on Agriculture Innovation (Linda Jing, Bayer Crop Science)
  - Motivating R&D and IP Protection (Lu Wei, Shanghai Academy)
• 12:00-1:30pm: Lunch
  Keynote Speech: "Climbing up the Value Chain: the Experience of Asian Countries"
  Christopher Yoo (University of Pennsylvania)
  Keynote Speech: "Understanding 3 Perspectives of China''s Innovation Policy Trends"
  Jietang Tian (Development Research Center of the State Council)
• 1:30-2:30pm: Panel Discussion - "From Inside Out, From Outside In"
  - Brad Farnsworth (Center for Internationalization and Global Engagement)
  - Bernard Yeung (National University of Singapore)
  - Xiucheng Han (China National Intellectual Property Administration)
• 2:30-3:30pm: Session 7 - Secrecy
  - Misappropriation Hazards and Firm Secrecy Defense
  - Protecting Trade Secret through Litigation (Hao Chen, Beijing DHH Law Firm)
• 3:30-3:50pm: Tea Break
• 3:50-4:30pm: Session 8 - Technology and the Changing Society
  - Automation and Worker Welfare: Field Evidence from Supermarkets
  - Voices from the Young Generation
• 4:30-5:30pm: Session 9 - Knowledge Flow within and across Firms
  - The Role of R&D Offshoring in Knowledge Diffusion
  - Cultural Intelligence Effects on Intercultural Teams
  - Incentive Spillover Effects of Technology Acquisitions
  - Halo Effect as a Double-Edged Sword: University Technology Licensing
• 5:30-5:40pm: Closing Remarks

Key Topics:
• Innovation and IP with Chinese characteristics
• Value creation and appropriation from innovation
• Coopetition, frenemies, and retaliation strategies
• The role of firm boundaries in innovation
• MNE patenting strategies in China
• IP protection in practice (digital age, agriculture, technology centers)
• Trade secrets and secrecy defense
• Technology''s impact on society and worker welfare
• Knowledge flow and diffusion across firms

Co-Sponsors:
• China Research and Engagement Fund, University of Pennsylvania
• The Wharton School
• Guanghua School of Management, Peking University
• College of Business, Shanghai University of Finance and Economics
• SHU-UTS SILC Business School, Shanghai University

Co-Organizers:
• Prof. Changqi Wu, Peking University
• Prof. Minyuan Zhao, University of Pennsylvania

This conference provided a unique platform for cross-disciplinary dialogue, bridging academic research and practical application in the field of global innovation and intellectual property.',
    '2019-06-28',
    'Penn Wharton China Center, Beijing, China',
    150,
    '2019-06-28 12:00:00',
    '2019-06-29 17:40:00',
    (SELECT id FROM users WHERE email = 'admin@giip.info')
);

-- Verify the insertions
SELECT 'GIIP1 Conference 2019 data added successfully!' as status;
SELECT 'News article:' as type, title, published_date FROM news WHERE title LIKE '%Innovation and Intellectual Property Conference 2019%' ORDER BY published_date DESC LIMIT 1
UNION ALL
SELECT 'Conference:', title, start_date::date FROM conferences WHERE title LIKE '%Innovation and Intellectual Property Conference 2019%' ORDER BY start_date DESC LIMIT 1
UNION ALL
SELECT 'Event:', title, date FROM events WHERE title LIKE '%Innovation and Intellectual Property: Firm Strategies%' ORDER BY date DESC LIMIT 1;
