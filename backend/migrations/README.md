# Database Migrations

This directory contains database migration scripts for the GIIP application.

## Migration Files

### 001_performance_indexes.sql
- Adds performance optimization indexes
- Creates composite indexes for common query patterns
- Adds partial indexes for active/recent content

### 002_add_user_profile.sql
- Adds personal information fields to users table
- Includes: full_name, phone, organization, position, bio, avatar_url, country, city

### 003_add_event_time_classification.sql
- **Purpose**: Enable automatic classification of events and conferences as "active" or "past"
- **Changes**:
  - Adds `start_date` and `end_date` TIMESTAMP columns to `events` table
  - Adds `start_date` and `end_date` TIMESTAMP columns to `conferences` table
  - Migrates existing data from `date` and `date_range` fields
  - Adds CHECK constraints to ensure `end_date >= start_date`
  - Creates performance indexes for time-based queries
  - Adds partial indexes for active/past event filtering

## Running Migrations

### Using the Migration Scripts

For migration 003 (Event Time Classification):

**Linux/Mac:**
```bash
bash backend/scripts/run-time-classification-migration.sh
```

**Windows:**
```cmd
backend\scripts\run-time-classification-migration.bat
```

### Manual Migration

If you prefer to run migrations manually:

```bash
# Copy migration file to database container
docker cp backend/migrations/003_add_event_time_classification.sql giip-database:/tmp/

# Execute migration
docker-compose exec -T db psql -U giip_user -d giip_db -f /tmp/003_add_event_time_classification.sql

# Restart API service
docker-compose restart api
```

## Verifying Migrations

To verify that a migration was successful:

```bash
# Copy verification script
docker cp backend/scripts/verify-time-classification-migration.sql giip-database:/tmp/

# Run verification
docker-compose exec -T db psql -U giip_user -d giip_db -f /tmp/verify-time-classification-migration.sql
```

## Migration Details: Event Time Classification

### Database Schema Changes

**Events Table:**
- `start_date` TIMESTAMP NOT NULL - Event start date and time (UTC)
- `end_date` TIMESTAMP - Event end date and time (UTC), nullable for ongoing events
- Constraint: `end_date >= start_date` (when end_date is provided)

**Conferences Table:**
- `start_date` TIMESTAMP NOT NULL - Conference start date and time (UTC)
- `end_date` TIMESTAMP - Conference end date and time (UTC), nullable for ongoing conferences
- Constraint: `end_date >= start_date` (when end_date is provided)

### Indexes Created

**Events:**
- `idx_events_start_date` - For sorting by start date
- `idx_events_end_date` - For sorting by end date
- `idx_events_end_date_start_date` - Composite index for filtering and sorting
- `idx_events_null_end_date` - Partial index for ongoing events

**Conferences:**
- `idx_conferences_start_date` - For sorting by start date
- `idx_conferences_end_date` - For sorting by end date
- `idx_conferences_end_date_start_date` - Composite index for filtering and sorting
- `idx_conferences_null_end_date` - Partial index for ongoing conferences

### Data Migration Strategy

1. **Phase 1**: Add new columns (nullable)
2. **Phase 2**: Migrate existing data
   - Events: Copy `date` field to `start_date`, set `end_date` to next day
   - Conferences: Set default timestamps (to be updated manually)
3. **Phase 3**: Add NOT NULL constraint to `start_date`
4. **Phase 4**: Add CHECK constraints for date validation
5. **Phase 5**: Create performance indexes

### Backward Compatibility

- Old `date` field (events) and `date_range` field (conferences) are preserved
- Existing queries will continue to work
- New queries can use `start_date` and `end_date` for time-based filtering

## Best Practices

1. **Always backup** your database before running migrations
2. **Test migrations** in a development environment first
3. **Run migrations** during low-traffic periods
4. **Verify** the migration completed successfully before deploying code changes
5. **Update** the main `schema.sql` file to reflect migration changes

## Rollback

If you need to rollback migration 003:

```sql
-- Remove indexes
DROP INDEX IF EXISTS idx_events_start_date;
DROP INDEX IF EXISTS idx_events_end_date;
DROP INDEX IF EXISTS idx_events_end_date_start_date;
DROP INDEX IF EXISTS idx_events_null_end_date;
DROP INDEX IF EXISTS idx_conferences_start_date;
DROP INDEX IF EXISTS idx_conferences_end_date;
DROP INDEX IF EXISTS idx_conferences_end_date_start_date;
DROP INDEX IF EXISTS idx_conferences_null_end_date;

-- Remove constraints
ALTER TABLE events DROP CONSTRAINT IF EXISTS check_events_dates;
ALTER TABLE conferences DROP CONSTRAINT IF EXISTS check_conferences_dates;

-- Remove columns
ALTER TABLE events DROP COLUMN IF EXISTS start_date;
ALTER TABLE events DROP COLUMN IF EXISTS end_date;
ALTER TABLE conferences DROP COLUMN IF EXISTS start_date;
ALTER TABLE conferences DROP COLUMN IF EXISTS end_date;
```

**Note**: Rollback will result in data loss for the new time fields. Only rollback if absolutely necessary.

