-- ========================================
-- Update All Images with Unsplash URLs
-- ========================================

-- News Images (3 items)
-- ========================================

-- News 1: Conference announcement - business meeting
UPDATE news 
SET image_url = 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&h=600&fit=crop'
WHERE id = 8;

-- News 2: Welcome/Platform - modern office/technology
UPDATE news 
SET image_url = 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=800&h=600&fit=crop'
WHERE id = 9;

-- News 3: Research/Patent - innovation/technology
UPDATE news 
SET image_url = 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=800&h=600&fit=crop'
WHERE id = 10;

-- Conferences Images (3 items)
-- ========================================

-- Conference 1: Business conference room
UPDATE conferences 
SET image_url = 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&h=600&fit=crop'
WHERE id = 4;

-- Conference 2: International summit
UPDATE conferences 
SET image_url = 'https://images.unsplash.com/photo-1505373877841-8d25f7d46678?w=800&h=600&fit=crop'
WHERE id = 5;

-- Conference 3: Innovation forum
UPDATE conferences 
SET image_url = 'https://images.unsplash.com/photo-1475721027785-f74eccf877e2?w=800&h=600&fit=crop'
WHERE id = 6;

-- Events Images (if needed)
-- ========================================

-- Update all events with default conference image
UPDATE events 
SET image_url = 'https://images.unsplash.com/photo-1505373877841-8d25f7d46678?w=800&h=600&fit=crop'
WHERE image_url IS NULL OR image_url = '';

-- ========================================
-- Verification
-- ========================================

\echo '\n=== NEWS IMAGES ==='
SELECT id, LEFT(title, 40) as title, LEFT(image_url, 60) as image_url FROM news ORDER BY id;

\echo '\n=== CONFERENCES IMAGES ==='
SELECT id, LEFT(title, 40) as title, LEFT(image_url, 60) as image_url FROM conferences ORDER BY id;

\echo '\n=== EVENTS IMAGES ==='
SELECT id, LEFT(title, 40) as title, LEFT(image_url, 60) as image_url FROM events ORDER BY id LIMIT 5;

\echo '\n=== SUMMARY ==='
SELECT 
    'News' as table_name, 
    COUNT(*) as total, 
    COUNT(image_url) as with_images,
    COUNT(*) - COUNT(image_url) as missing_images
FROM news
UNION ALL
SELECT 
    'Conferences' as table_name, 
    COUNT(*) as total, 
    COUNT(image_url) as with_images,
    COUNT(*) - COUNT(image_url) as missing_images
FROM conferences
UNION ALL
SELECT 
    'Events' as table_name, 
    COUNT(*) as total, 
    COUNT(image_url) as with_images,
    COUNT(*) - COUNT(image_url) as missing_images
FROM events;
