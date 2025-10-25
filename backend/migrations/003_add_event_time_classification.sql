-- Event Time Classification Migration
-- Add start_date and end_date fields to events and conferences tables
-- This enables automatic classification of events as active or past

-- ============================================
-- PHASE 1: Add new columns (nullable initially)
-- ============================================

-- Add time fields to events table
ALTER TABLE events 
ADD COLUMN start_date TIMESTAMP,
ADD COLUMN end_date TIMESTAMP;

-- Add time fields to conferences table
ALTER TABLE conferences 
ADD COLUMN start_date TIMESTAMP,
ADD COLUMN end_date TIMESTAMP;

-- ============================================
-- PHASE 2: Migrate existing data
-- ============================================

-- Migrate events: Copy date field to start_date, set end_date to end of day
UPDATE events 
SET 
    start_date = date::timestamp,
    end_date = (date + INTERVAL '1 day')::timestamp
WHERE start_date IS NULL;

-- Migrate conferences: Parse date_range or set default values
-- For conferences without parseable dates, set to current date
UPDATE conferences 
SET 
    start_date = CURRENT_TIMESTAMP,
    end_date = CURRENT_TIMESTAMP + INTERVAL '3 days'
WHERE start_date IS NULL;

-- ============================================
-- PHASE 3: Add constraints
-- ============================================

-- Make start_date required for events
ALTER TABLE events 
ALTER COLUMN start_date SET NOT NULL;

-- Make start_date required for conferences
ALTER TABLE conferences 
ALTER COLUMN start_date SET NOT NULL;

-- Add check constraint: end_date must be >= start_date (if end_date is provided)
ALTER TABLE events 
ADD CONSTRAINT check_events_dates CHECK (end_date IS NULL OR end_date >= start_date);

ALTER TABLE conferences 
ADD CONSTRAINT check_conferences_dates CHECK (end_date IS NULL OR end_date >= start_date);

-- ============================================
-- PHASE 4: Create indexes for performance
-- ============================================

-- Events table indexes
CREATE INDEX idx_events_start_date ON events(start_date DESC);
CREATE INDEX idx_events_end_date ON events(end_date DESC);

-- Composite index for time-based filtering and sorting
CREATE INDEX idx_events_end_date_start_date ON events(end_date DESC, start_date DESC);

-- Index for null end_date (ongoing events)
CREATE INDEX idx_events_null_end_date ON events(start_date DESC) 
WHERE end_date IS NULL;

-- Conferences table indexes
CREATE INDEX idx_conferences_start_date ON conferences(start_date DESC);
CREATE INDEX idx_conferences_end_date ON conferences(end_date DESC);

-- Composite index for time-based filtering and sorting
CREATE INDEX idx_conferences_end_date_start_date ON conferences(end_date DESC, start_date DESC);

-- Index for null end_date (ongoing conferences)
CREATE INDEX idx_conferences_null_end_date ON conferences(start_date DESC) 
WHERE end_date IS NULL;

-- ============================================
-- PHASE 5: Add documentation
-- ============================================

-- Add comments for documentation
COMMENT ON COLUMN events.start_date IS 'Event start date and time (UTC)';
COMMENT ON COLUMN events.end_date IS 'Event end date and time (UTC)';
COMMENT ON COLUMN conferences.start_date IS 'Conference start date and time (UTC)';
COMMENT ON COLUMN conferences.end_date IS 'Conference end date and time (UTC)';

-- Update table statistics for query planner
ANALYZE events;
ANALYZE conferences;

