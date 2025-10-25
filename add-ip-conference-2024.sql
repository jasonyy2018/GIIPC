-- Add International Conference on Intellectual Property and Innovation (May 25-26, 2024)
-- Hangzhou, China

-- Add as a news article
INSERT INTO news (title, content, image_url, published_date, created_by) VALUES
(
    'International Conference on Intellectual Property and Innovation - May 2024',
    'The International Conference on Intellectual Property and Innovation was successfully held on May 25-26, 2024, at Zhejiang University''s Zijingang Campus in Hangzhou, China. The conference brought together leading scholars and practitioners from around the world to discuss cutting-edge research in intellectual property, innovation management, and technology strategy.

Key Highlights:
• Plenary speeches by distinguished scholars including Prof. Xiaobo Wu (Zhejiang University), Prof. Shaker Zahra (University of Minnesota), Prof. Michael Leiblein (Ohio State University), and Prof. Tony Tong (University of Colorado Boulder)
• Multiple research sessions covering topics such as patenting strategies, patent litigation, technology transfer, and innovation in emerging markets
• Panel discussions on China''s IP legal system, IP management in multinational enterprises, and IP management in the automobile industry
• Poster session featuring emerging research from doctoral students and early-career scholars
• Inaugural ceremony of the Zhejiang Provincial Data Intellectual Property Research Center

The conference featured over 20 research presentations examining critical issues in intellectual property and innovation, including the impact of U.S.-China technological decoupling, patent litigation strategies, technology appropriation, and the role of IP in startup financing. International participants from institutions including National University of Singapore, Hong Kong University, McGill University, Tsinghua University, Peking University, and many others contributed to rich academic discussions.

Special thanks to the organizing committee led by Prof. Can Huang from Zhejiang University and all participants who made this event a tremendous success.',
    'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800',
    '2024-05-26',
    (SELECT id FROM users WHERE email = 'admin@giip.info')
);

-- Add as a conference entry
INSERT INTO conferences (title, description, date_range, location, summary, start_date, end_date, created_by) VALUES
(
    'International Conference on Intellectual Property and Innovation 2024',
    'A premier academic conference bringing together leading scholars and practitioners to discuss the latest research and developments in intellectual property law, innovation management, and technology strategy. The conference featured plenary speeches, research presentations, panel discussions, and networking opportunities.

Conference Themes:
• Patenting Strategies and Patent Systems
• Data-Driven Innovation Research
• Patent Litigation and Innovation Direction
• Foreignness and Emergingness in IP
• Value Appropriation and Technology Transfer
• IP Legal Systems and Policy
• IP Management in Multinational Enterprises
• Industry-Specific IP Management

Distinguished Speakers:
• Prof. Xiaobo Wu (Zhejiang University)
• Prof. Shaker Zahra (University of Minnesota)
• Prof. Michael Leiblein (Ohio State University)
• Prof. Tony Tong (University of Colorado Boulder)
• Prof. Jiatao Li (Hong Kong University of Science and Technology)
• Prof. Catherine Magelssen (London Business School)
• Ruud Peters (Peters IP Consultancy)

The conference included research presentations from scholars at top institutions including Tsinghua University, Peking University, Renmin University, McGill University, CEIBS, and many others. Panel discussions featured experts from China''s National IP Administration, leading law firms, and multinational corporations.

Registration took place on May 24, with the main conference sessions held on May 25-26 at the Hai Na Yuan Conference Room, Zijingang Campus, Zhejiang University.',
    'May 25-26, 2024',
    'Zhejiang University, Hangzhou, China',
    'The International Conference on Intellectual Property and Innovation 2024 was held at Zhejiang University in Hangzhou, China, bringing together over 100 scholars and practitioners from leading institutions worldwide. The conference featured 5 plenary speeches, 6 research sessions with 15+ paper presentations, 3 expert panels, and a poster session with 8 emerging research projects. Key topics included patent strategies, litigation, technology transfer, and IP management in the context of global technological competition and emerging markets. The event concluded with the inaugural ceremony of the Zhejiang Provincial Data Intellectual Property Research Center, marking a significant milestone in IP research collaboration.',
    '2024-05-25 08:30:00',
    '2024-05-26 15:30:00',
    (SELECT id FROM users WHERE email = 'admin@giip.info')
);

-- Add as an event entry (for the event listing)
INSERT INTO events (title, description, date, location, capacity, start_date, end_date, created_by) VALUES
(
    'International Conference on Intellectual Property and Innovation',
    'Join us for a two-day academic conference exploring the frontiers of intellectual property and innovation research. This conference brings together leading scholars from around the world to present cutting-edge research on patenting strategies, patent litigation, technology transfer, and innovation management.

Conference Program:
Day 1 (May 25):
• Welcome and Opening Ceremony
• Plenary Session: IPR Enforcement and Firm Performance
• Session 1: Patenting Strategies
• Session 2: What Can We Learn from Data?
• Session 3: Litigation and the Direction of Innovation
• Session 4: Foreignness and Emergingness
• Plenary Session: Disruption and Open Innovation
• Session 5: Value Appropriation
• Poster Session
• Conference Dinner

Day 2 (May 26):
• Inaugural Ceremony: Zhejiang Provincial Data Intellectual Property Research Center
• Plenary Session: Frontiers of IP and Innovation Management
• Panel 1: China''s IP Legal System
• Panel 2: IP Management and Innovation of Multinational Enterprises
• Panel 3: IP Management in Automobile Industry
• Closing Ceremony

Registration: May 24, 14:00-21:00 at Ou Ya Mei International Hotel
Venue: Hai Na Yuan Conference Room, Zijingang Campus, Zhejiang University

This conference is ideal for academic researchers, IP professionals, policymakers, and industry practitioners interested in the latest developments in intellectual property and innovation.',
    '2024-05-25',
    'Zhejiang University, Hangzhou, China',
    150,
    '2024-05-25 08:30:00',
    '2024-05-26 15:30:00',
    (SELECT id FROM users WHERE email = 'admin@giip.info')
);

-- Verify the insertions
SELECT 'Conference data added successfully!' as status;
SELECT 'News article:' as type, title, published_date FROM news WHERE title LIKE '%International Conference on Intellectual Property and Innovation%' ORDER BY published_date DESC LIMIT 1
UNION ALL
SELECT 'Conference:', title, start_date::date FROM conferences WHERE title LIKE '%International Conference on Intellectual Property and Innovation%' ORDER BY start_date DESC LIMIT 1
UNION ALL
SELECT 'Event:', title, date FROM events WHERE title LIKE '%International Conference on Intellectual Property and Innovation%' ORDER BY date DESC LIMIT 1;
