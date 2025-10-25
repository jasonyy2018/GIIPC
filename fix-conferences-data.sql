-- Add sample conferences to the conferences table
-- These are distinct from events

-- Get admin user ID
DO $$
DECLARE
    admin_id INTEGER;
BEGIN
    SELECT id INTO admin_id FROM users WHERE email = 'admin@giip.info' LIMIT 1;
    
    -- Insert conferences
    INSERT INTO conferences (title, description, date_range, location, summary, start_date, end_date, created_by) VALUES
    (
        '3rd Conference on Global Innovation and Intellectual Property 2025',
        'The 3rd Conference on Global Innovation and Intellectual Property: Firm Strategies and Policy Challenges in a Rapidly Changing World brings together leading scholars, policymakers, business leaders, and legal professionals.',
        'May 17-18, 2025',
        'School of Management, Fudan University, Shanghai, China',
        'Global competition is increasingly characterized by competition for technological leadership. This conference explores the intersection of firm competitiveness and institutional infrastructure in the context of intellectual property.',
        '2025-05-17 09:00:00',
        '2025-05-18 17:00:00',
        admin_id
    ),
    (
        'International IP Summit 2024',
        'A comprehensive summit bringing together IP professionals from around the world to discuss emerging trends and challenges in intellectual property management.',
        'November 10-12, 2024',
        'Beijing International Convention Center, Beijing, China',
        'Three days of intensive discussions on patent strategies, trademark protection, and trade secrets in the digital age.',
        '2024-11-10 09:00:00',
        '2024-11-12 17:00:00',
        admin_id
    ),
    (
        'Asia-Pacific Innovation Forum 2024',
        'Regional forum focusing on innovation ecosystems and IP frameworks across Asia-Pacific countries.',
        'September 5-6, 2024',
        'Singapore Expo, Singapore',
        'Exploring how different countries in the Asia-Pacific region are building their innovation ecosystems and IP protection frameworks.',
        '2024-09-05 09:00:00',
        '2024-09-06 17:00:00',
        admin_id
    );
    
    RAISE NOTICE 'Successfully added % conferences', 3;
END $$;
