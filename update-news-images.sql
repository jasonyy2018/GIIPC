-- Update news with high-quality Unsplash images related to conferences, innovation, and IP

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

-- Verify updates
SELECT id, LEFT(title, 50) as title, LEFT(image_url, 70) as image_url FROM news ORDER BY id;
