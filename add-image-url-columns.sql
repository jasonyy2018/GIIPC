-- Add image_url column to conferences table
ALTER TABLE conferences 
ADD COLUMN IF NOT EXISTS image_url VARCHAR(500);

-- Add image_url column to events table
ALTER TABLE events 
ADD COLUMN IF NOT EXISTS image_url VARCHAR(500);

-- Add some default images for existing conferences
UPDATE conferences 
SET image_url = 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80'
WHERE image_url IS NULL;

-- Add some default images for existing events
UPDATE events 
SET image_url = 'https://images.unsplash.com/photo-1505373877841-8d25f7d46678?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80'
WHERE image_url IS NULL;

-- Verify the changes
SELECT 'Conferences with image_url:' as info, COUNT(*) as count FROM conferences WHERE image_url IS NOT NULL
UNION ALL
SELECT 'Events with image_url:' as info, COUNT(*) as count FROM events WHERE image_url IS NOT NULL;
