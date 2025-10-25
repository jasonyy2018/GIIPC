-- Migration: Create event_registrations table
-- Description: Stores user registrations for events

-- Create event_registrations table
CREATE TABLE IF NOT EXISTS event_registrations (
    id SERIAL PRIMARY KEY,
    event_id INTEGER NOT NULL REFERENCES events(id) ON DELETE CASCADE,
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    organization VARCHAR(255),
    notes TEXT,
    registered_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(event_id, user_id)
);

-- Create indexes for performance
CREATE INDEX idx_event_registrations_event_id ON event_registrations(event_id);
CREATE INDEX idx_event_registrations_user_id ON event_registrations(user_id);
CREATE INDEX idx_event_registrations_registered_at ON event_registrations(registered_at DESC);

-- Add comments for documentation
COMMENT ON TABLE event_registrations IS 'User registrations for events';
COMMENT ON COLUMN event_registrations.organization IS 'User organization at time of registration';
COMMENT ON COLUMN event_registrations.notes IS 'Additional notes or comments from user';
COMMENT ON COLUMN event_registrations.registered_at IS 'Timestamp when user registered for the event';
