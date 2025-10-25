-- Update conferences with diverse, high-quality conference images from Unsplash

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

-- Verify updates
SELECT id, title, image_url FROM conferences ORDER BY id;
