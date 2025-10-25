-- 添加测试 News 数据
INSERT INTO news (title, content, published_date, image_url, created_by, created_at, updated_at)
VALUES 
(
  'The 3rd Conference on Global Innovation and Intellectual Property Announced',
  'School of Management, Fudan University is pleased to announce the 3rd Conference on Global Innovation and Intellectual Property: Firm Strategies and Policy Challenges in a Rapidly Changing World, to be held on May 17-18, 2025 in Shanghai, China.

Global competition is increasingly characterized by competition for technological leadership. Meanwhile, given the increasingly prominent roles of intellectual properties (IPs), technology standards, and business platforms, the boundary between firm competitiveness and institutional infrastructure is blurring.

The conference is hosted by School of Management, Fudan University, and co-sponsored by the McDonnell International Scholars Academy, Washington University in St. Louis, and Guanghua School of Management, Peking University.

For more information and registration, please contact: GIIP2025@fdsm.fudan.edu.cn',
  '2024-11-01',
  'https://via.placeholder.com/800x400/0B4D3E/FFFFFF?text=GIIP+Conference+2025',
  5,
  NOW(),
  NOW()
),
(
  'Welcome to GIIP Platform',
  'Welcome to the Global Innovation and Intellectual Property platform. This platform serves as a hub for researchers, policymakers, and business leaders to share insights and collaborate on innovation and IP strategies.',
  '2024-10-15',
  'https://via.placeholder.com/800x400/1B5E20/FFFFFF?text=Welcome+to+GIIP',
  5,
  NOW(),
  NOW()
),
(
  'New Research on Patent Strategies',
  'Recent research highlights the importance of strategic patent filing in the context of global competition. Our latest study examines how firms navigate IP protection across different jurisdictions.',
  '2024-10-20',
  'https://via.placeholder.com/800x400/2E7D32/FFFFFF?text=Patent+Research',
  5,
  NOW(),
  NOW()
);

-- 添加测试 Events 数据
INSERT INTO events (title, description, date, location, capacity, created_by, created_at, updated_at)
VALUES 
(
  'The 3rd Conference on Global Innovation and Intellectual Property',
  'Firm Strategies and Policy Challenges in a Rapidly Changing World. This conference brings together scholars, policymakers, business leaders, and legal professionals to discuss the future of innovation and intellectual property in the context of global competition and technological leadership.

Conference Schedule:
- Day 1: Innovation and IP Strategies, Secret Patenting, AI and Labor
- Day 2: Institutions for Innovation, Voices from Policymakers and Business Leaders

Contact: GIIP2025@fdsm.fudan.edu.cn',
  '2025-05-17',
  'School of Management, Fudan University, Shanghai, China',
  200,
  5,
  NOW(),
  NOW()
),
(
  'Workshop on IP Strategy',
  'A hands-on workshop exploring practical IP strategies for startups and SMEs. Learn from industry experts about patent filing, trademark protection, and trade secret management.',
  '2025-03-15',
  'Innovation Hub, Shanghai',
  50,
  5,
  NOW(),
  NOW()
),
(
  'Seminar: AI and Intellectual Property',
  'Join us for an in-depth discussion on the intersection of artificial intelligence and intellectual property rights. Topics include AI-generated content, patent eligibility, and regulatory challenges.',
  '2025-04-10',
  'Online (Zoom)',
  100,
  5,
  NOW(),
  NOW()
);

-- 验证数据
SELECT 'News Count:' as info, COUNT(*) as count FROM news
UNION ALL
SELECT 'Events Count:' as info, COUNT(*) as count FROM events;
