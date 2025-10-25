-- Performance Optimization Indexes Migration
-- Additional indexes for query optimization

-- Composite indexes for common query patterns

-- News: Filter by date and creator
CREATE INDEX IF NOT EXISTS idx_news_published_date_created_by ON news(published_date DESC, created_by);

-- Events: Filter by date and location (common search pattern)
CREATE INDEX IF NOT EXISTS idx_events_date_location ON events(date, location);

-- Conferences: Filter by creation date for recent conferences
CREATE INDEX IF NOT EXISTS idx_conferences_location ON conferences(location);

-- Users: Composite index for authentication queries
CREATE INDEX IF NOT EXISTS idx_users_email_role ON users(email, role_id);

-- Partial indexes for active/recent content (PostgreSQL specific)

-- Recent news (last 90 days) - frequently accessed
CREATE INDEX IF NOT EXISTS idx_news_recent ON news(published_date DESC) 
WHERE published_date > CURRENT_DATE - INTERVAL '90 days';

-- Upcoming events (future events only)
CREATE INDEX IF NOT EXISTS idx_events_upcoming ON events(date) 
WHERE date >= CURRENT_DATE;

-- Add ANALYZE to update statistics for query planner
ANALYZE users;
ANALYZE roles;
ANALYZE permissions;
ANALYZE role_permissions;
ANALYZE news;
ANALYZE events;
ANALYZE conferences;
