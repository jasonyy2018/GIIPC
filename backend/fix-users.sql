-- Fix user passwords with correct bcrypt hash
-- Password for all users: "Password123!"

INSERT INTO users (email, password, role_id) VALUES
('admin@giip.info', '$2b$10$iTnu9S/dNIPTN6N/yJi.PuiGo09H6IoWmJakwY.MpbwzjkK2TvuDW', (SELECT id FROM roles WHERE name = 'admin')),
('editor@giip.info', '$2b$10$iTnu9S/dNIPTN6N/yJi.PuiGo09H6IoWmJakwY.MpbwzjkK2TvuDW', (SELECT id FROM roles WHERE name = 'editor')),
('user@giip.info', '$2b$10$iTnu9S/dNIPTN6N/yJi.PuiGo09H6IoWmJakwY.MpbwzjkK2TvuDW', (SELECT id FROM roles WHERE name = 'user'));

SELECT 'Users created successfully' as status;
SELECT id, email, role_id FROM users WHERE email LIKE '%@giip.info';
