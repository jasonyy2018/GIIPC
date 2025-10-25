-- GIIP Database Seed Data
-- Initial roles, permissions, and sample data

-- Insert roles
INSERT INTO roles (name, description) VALUES
('admin', 'Administrator with full system access'),
('editor', 'Content editor with write and edit permissions'),
('user', 'Regular user with read-only access');

-- Insert permissions
INSERT INTO permissions (name, description) VALUES
-- News permissions
('read:news', 'Read news articles'),
('write:news', 'Create new news articles'),
('edit:news', 'Edit existing news articles'),
('delete:news', 'Delete news articles'),

-- Events permissions
('read:events', 'Read events'),
('write:events', 'Create new events'),
('edit:events', 'Edit existing events'),
('delete:events', 'Delete events'),

-- Conferences permissions
('read:conferences', 'Read conferences'),
('write:conferences', 'Create new conferences'),
('edit:conferences', 'Edit existing conferences'),
('delete:conferences', 'Delete conferences'),

-- Admin permissions
('manage:users', 'Manage user accounts'),
('manage:roles', 'Manage roles and permissions');

-- Assign permissions to admin role (all permissions)
INSERT INTO role_permissions (role_id, permission_id)
SELECT 
    (SELECT id FROM roles WHERE name = 'admin'),
    id
FROM permissions;

-- Assign permissions to editor role
INSERT INTO role_permissions (role_id, permission_id)
SELECT 
    (SELECT id FROM roles WHERE name = 'editor'),
    id
FROM permissions
WHERE name IN (
    'read:news', 'write:news', 'edit:news',
    'read:events', 'write:events', 'edit:events',
    'read:conferences', 'write:conferences', 'edit:conferences'
);

-- Assign permissions to user role (read-only)
INSERT INTO role_permissions (role_id, permission_id)
SELECT 
    (SELECT id FROM roles WHERE name = 'user'),
    id
FROM permissions
WHERE name IN ('read:news', 'read:events', 'read:conferences');

-- Insert sample users
-- Password for all users: "Password123!" (bcrypt hashed with 10 rounds)
-- Hash generated using: bcrypt.hash('Password123!', 10)
INSERT INTO users (email, password, role_id) VALUES
('admin@giip.info', '$2b$10$iTnu9S/dNIPTN6N/yJi.PuiGo09H6IoWmJakwY.MpbwzjkK2TvuDW', (SELECT id FROM roles WHERE name = 'admin')),
('editor@giip.info', '$2b$10$iTnu9S/dNIPTN6N/yJi.PuiGo09H6IoWmJakwY.MpbwzjkK2TvuDW', (SELECT id FROM roles WHERE name = 'editor')),
('user@giip.info', '$2b$10$iTnu9S/dNIPTN6N/yJi.PuiGo09H6IoWmJakwY.MpbwzjkK2TvuDW', (SELECT id FROM roles WHERE name = 'user'));

-- Insert sample news articles
INSERT INTO news (title, content, image_url, published_date, created_by) VALUES
(
    'Global Innovation Summit 2025 Announced',
    'We are excited to announce the Global Innovation Summit 2025, bringing together thought leaders, innovators, and industry experts from around the world. The summit will focus on emerging technologies, sustainable innovation, and intellectual property protection in the digital age.',
    'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800',
    '2025-10-15',
    (SELECT id FROM users WHERE email = 'admin@giip.info')
),
(
    'New Patent Filing Guidelines Released',
    'The GIIP organization has released updated guidelines for international patent filing procedures. These new guidelines aim to streamline the application process and provide clearer guidance on intellectual property protection across multiple jurisdictions.',
    'https://images.unsplash.com/photo-1450101499163-c8848c66ca85?w=800',
    '2025-10-10',
    (SELECT id FROM users WHERE email = 'editor@giip.info')
),
(
    'Innovation Awards 2025: Call for Nominations',
    'The annual GIIP Innovation Awards are now accepting nominations. This prestigious award recognizes outstanding contributions to innovation and intellectual property development. Nominations are open until December 31, 2025.',
    'https://images.unsplash.com/photo-1531482615713-2afd69097998?w=800',
    '2025-10-05',
    (SELECT id FROM users WHERE email = 'editor@giip.info')
),
(
    'Blockchain Technology and IP Rights: A New Frontier',
    'Explore how blockchain technology is revolutionizing intellectual property management. Our latest research paper examines the intersection of distributed ledger technology and IP rights protection, offering insights into future trends and opportunities.',
    'https://images.unsplash.com/photo-1639762681485-074b7f938ba0?w=800',
    '2025-09-28',
    (SELECT id FROM users WHERE email = 'admin@giip.info')
);

-- Insert sample events
INSERT INTO events (title, description, date, location, capacity, created_by) VALUES
(
    'IP Workshop: Patent Basics',
    'Join us for an introductory workshop on patent fundamentals. Learn about the patent application process, requirements, and best practices for protecting your innovations. Suitable for entrepreneurs and inventors.',
    '2025-11-15',
    'GIIP Headquarters, Geneva',
    50,
    (SELECT id FROM users WHERE email = 'editor@giip.info')
),
(
    'Innovation Networking Event',
    'Connect with fellow innovators, investors, and IP professionals at our monthly networking event. Share ideas, explore collaborations, and expand your professional network in the innovation ecosystem.',
    '2025-11-22',
    'Innovation Hub, Singapore',
    100,
    (SELECT id FROM users WHERE email = 'admin@giip.info')
),
(
    'Webinar: Copyright in the Digital Age',
    'A comprehensive online seminar covering copyright protection for digital content creators. Topics include fair use, licensing, and enforcement strategies in the modern digital landscape.',
    '2025-12-01',
    'Online (Zoom)',
    500,
    (SELECT id FROM users WHERE email = 'editor@giip.info')
),
(
    'Startup IP Strategy Bootcamp',
    'Intensive two-day bootcamp designed for startup founders. Learn how to develop a comprehensive IP strategy, protect your innovations, and leverage intellectual property for business growth.',
    '2025-12-10',
    'Tech Park, San Francisco',
    30,
    (SELECT id FROM users WHERE email = 'admin@giip.info')
);

-- Insert sample conferences
INSERT INTO conferences (title, description, date_range, location, summary, created_by) VALUES
(
    'International IP Conference 2024',
    'The 2024 International Intellectual Property Conference brought together over 500 participants from 60 countries. Key topics included AI and IP rights, global patent harmonization, and sustainable innovation strategies.',
    'March 15-17, 2024',
    'Geneva, Switzerland',
    'A landmark event featuring keynote speeches from leading IP experts, panel discussions on emerging trends, and networking opportunities. The conference resulted in the Geneva Declaration on AI and Intellectual Property.',
    (SELECT id FROM users WHERE email = 'admin@giip.info')
),
(
    'Asia-Pacific Innovation Forum 2023',
    'The Asia-Pacific Innovation Forum 2023 focused on regional innovation ecosystems and cross-border IP collaboration. The forum attracted 300+ delegates and featured case studies from successful Asian innovators.',
    'November 8-10, 2023',
    'Singapore',
    'Highlights included workshops on patent prosecution in APAC countries, discussions on traditional knowledge protection, and the launch of the APAC Innovation Network initiative.',
    (SELECT id FROM users WHERE email = 'editor@giip.info')
),
(
    'Global Innovation Summit 2023',
    'The inaugural Global Innovation Summit explored the future of innovation and intellectual property in a rapidly changing world. Topics ranged from biotechnology patents to digital rights management.',
    'June 5-7, 2023',
    'San Francisco, USA',
    'Over 400 participants engaged in thought-provoking sessions on innovation policy, technology transfer, and IP commercialization. The summit concluded with the San Francisco Innovation Accord.',
    (SELECT id FROM users WHERE email = 'admin@giip.info')
);

-- Verify data insertion
SELECT 'Roles inserted:' as info, COUNT(*) as count FROM roles
UNION ALL
SELECT 'Permissions inserted:', COUNT(*) FROM permissions
UNION ALL
SELECT 'Role-Permission mappings:', COUNT(*) FROM role_permissions
UNION ALL
SELECT 'Users inserted:', COUNT(*) FROM users
UNION ALL
SELECT 'News articles inserted:', COUNT(*) FROM news
UNION ALL
SELECT 'Events inserted:', COUNT(*) FROM events
UNION ALL
SELECT 'Conferences inserted:', COUNT(*) FROM conferences;
