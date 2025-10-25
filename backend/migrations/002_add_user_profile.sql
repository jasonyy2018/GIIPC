-- Add personal information fields to users table
ALTER TABLE users 
ADD COLUMN full_name VARCHAR(255),
ADD COLUMN phone VARCHAR(50),
ADD COLUMN organization VARCHAR(255),
ADD COLUMN position VARCHAR(255),
ADD COLUMN bio TEXT,
ADD COLUMN avatar_url VARCHAR(500),
ADD COLUMN country VARCHAR(100),
ADD COLUMN city VARCHAR(100);

-- Add index for searching by name
CREATE INDEX idx_users_full_name ON users(full_name);

-- Add comments
COMMENT ON COLUMN users.full_name IS 'User full name';
COMMENT ON COLUMN users.phone IS 'Contact phone number';
COMMENT ON COLUMN users.organization IS 'Organization or company name';
COMMENT ON COLUMN users.position IS 'Job position or title';
COMMENT ON COLUMN users.bio IS 'User biography or description';
COMMENT ON COLUMN users.avatar_url IS 'Profile avatar image URL';
COMMENT ON COLUMN users.country IS 'Country of residence';
COMMENT ON COLUMN users.city IS 'City of residence';
