-- GIIP Database Schema
-- PostgreSQL 16+

-- Drop tables if they exist (for clean setup)
DROP TABLE IF EXISTS role_permissions CASCADE;
DROP TABLE IF EXISTS news CASCADE;
DROP TABLE IF EXISTS events CASCADE;
DROP TABLE IF EXISTS conferences CASCADE;
DROP TABLE IF EXISTS users CASCADE;
DROP TABLE IF EXISTS permissions CASCADE;
DROP TABLE IF EXISTS roles CASCADE;

-- Create roles table
CREATE TABLE roles (
    id SERIAL PRIMARY KEY,
    name VARCHAR(50) UNIQUE NOT NULL,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create permissions table
CREATE TABLE permissions (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) UNIQUE NOT NULL,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create role_permissions junction table
CREATE TABLE role_permissions (
    role_id INTEGER NOT NULL REFERENCES roles(id) ON DELETE CASCADE,
    permission_id INTEGER NOT NULL REFERENCES permissions(id) ON DELETE CASCADE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (role_id, permission_id)
);

-- Create users table
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    role_id INTEGER NOT NULL REFERENCES roles(id) ON DELETE RESTRICT,
    full_name VARCHAR(255),
    phone VARCHAR(50),
    organization VARCHAR(255),
    position VARCHAR(255),
    bio TEXT,
    avatar_url VARCHAR(500),
    country VARCHAR(100),
    city VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create news table
CREATE TABLE news (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    content TEXT NOT NULL,
    image_url VARCHAR(500),
    published_date DATE NOT NULL,
    created_by INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create events table
CREATE TABLE events (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    date DATE NOT NULL,
    location VARCHAR(255) NOT NULL,
    capacity INTEGER CHECK (capacity > 0),
    start_date TIMESTAMP NOT NULL,
    end_date TIMESTAMP,
    created_by INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT check_events_dates CHECK (end_date IS NULL OR end_date >= start_date)
);

-- Create conferences table
CREATE TABLE conferences (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    date_range VARCHAR(100) NOT NULL,
    location VARCHAR(255) NOT NULL,
    summary TEXT,
    start_date TIMESTAMP NOT NULL,
    end_date TIMESTAMP,
    created_by INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT check_conferences_dates CHECK (end_date IS NULL OR end_date >= start_date)
);

-- Create indexes for performance optimization

-- Users table indexes
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_role_id ON users(role_id);
CREATE INDEX idx_users_full_name ON users(full_name);

-- News table indexes
CREATE INDEX idx_news_published_date ON news(published_date DESC);
CREATE INDEX idx_news_created_by ON news(created_by);
CREATE INDEX idx_news_created_at ON news(created_at DESC);

-- Events table indexes
CREATE INDEX idx_events_date ON events(date);
CREATE INDEX idx_events_created_by ON events(created_by);
CREATE INDEX idx_events_location ON events(location);
CREATE INDEX idx_events_start_date ON events(start_date DESC);
CREATE INDEX idx_events_end_date ON events(end_date DESC);
CREATE INDEX idx_events_end_date_start_date ON events(end_date DESC, start_date DESC);
CREATE INDEX idx_events_null_end_date ON events(start_date DESC) WHERE end_date IS NULL;

-- Conferences table indexes
CREATE INDEX idx_conferences_created_by ON conferences(created_by);
CREATE INDEX idx_conferences_created_at ON conferences(created_at DESC);
CREATE INDEX idx_conferences_start_date ON conferences(start_date DESC);
CREATE INDEX idx_conferences_end_date ON conferences(end_date DESC);
CREATE INDEX idx_conferences_end_date_start_date ON conferences(end_date DESC, start_date DESC);
CREATE INDEX idx_conferences_null_end_date ON conferences(start_date DESC) WHERE end_date IS NULL;

-- Role permissions indexes
CREATE INDEX idx_role_permissions_role_id ON role_permissions(role_id);
CREATE INDEX idx_role_permissions_permission_id ON role_permissions(permission_id);

-- Permissions index
CREATE INDEX idx_permissions_name ON permissions(name);

-- Roles index
CREATE INDEX idx_roles_name ON roles(name);

-- Composite indexes for common query patterns
CREATE INDEX idx_news_published_date_created_by ON news(published_date DESC, created_by);
CREATE INDEX idx_events_date_location ON events(date, location);
CREATE INDEX idx_conferences_location ON conferences(location);
CREATE INDEX idx_users_email_role ON users(email, role_id);

-- Partial indexes for frequently accessed data (PostgreSQL specific)
CREATE INDEX idx_news_recent ON news(published_date DESC) 
WHERE published_date > CURRENT_DATE - INTERVAL '90 days';

CREATE INDEX idx_events_upcoming ON events(date) 
WHERE date >= CURRENT_DATE;

-- Add comments for documentation
COMMENT ON TABLE users IS 'System users with authentication credentials';
COMMENT ON TABLE roles IS 'User roles for RBAC system';
COMMENT ON TABLE permissions IS 'System permissions for access control';
COMMENT ON TABLE role_permissions IS 'Many-to-many relationship between roles and permissions';
COMMENT ON TABLE news IS 'News articles and announcements';
COMMENT ON TABLE events IS 'Events and activities';
COMMENT ON TABLE conferences IS 'Conference information';

COMMENT ON COLUMN users.password IS 'Bcrypt hashed password';
COMMENT ON COLUMN users.full_name IS 'User full name';
COMMENT ON COLUMN users.phone IS 'Contact phone number';
COMMENT ON COLUMN users.organization IS 'Organization or company name';
COMMENT ON COLUMN users.position IS 'Job position or title';
COMMENT ON COLUMN users.bio IS 'User biography or description';
COMMENT ON COLUMN users.avatar_url IS 'Profile avatar image URL';
COMMENT ON COLUMN users.country IS 'Country of residence';
COMMENT ON COLUMN users.city IS 'City of residence';
COMMENT ON COLUMN events.capacity IS 'Maximum number of participants';
COMMENT ON COLUMN events.start_date IS 'Event start date and time (UTC)';
COMMENT ON COLUMN events.end_date IS 'Event end date and time (UTC)';
COMMENT ON COLUMN conferences.start_date IS 'Conference start date and time (UTC)';
COMMENT ON COLUMN conferences.end_date IS 'Conference end date and time (UTC)';
