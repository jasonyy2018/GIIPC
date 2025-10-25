-- Verification Script for Event Time Classification Migration
-- This script verifies that the migration was successful

\echo '========================================='
\echo 'Event Time Classification Migration Verification'
\echo '========================================='
\echo ''

-- Check events table structure
\echo '1. Checking events table structure...'
\d events

\echo ''
\echo '2. Checking conferences table structure...'
\d conferences

\echo ''
\echo '3. Verifying events data migration...'
SELECT 
    COUNT(*) as total_events,
    COUNT(start_date) as events_with_start_date,
    COUNT(end_date) as events_with_end_date,
    COUNT(*) FILTER (WHERE start_date IS NOT NULL) as valid_start_dates,
    COUNT(*) FILTER (WHERE end_date IS NULL OR end_date >= start_date) as valid_date_ranges
FROM events;

\echo ''
\echo '4. Verifying conferences data migration...'
SELECT 
    COUNT(*) as total_conferences,
    COUNT(start_date) as conferences_with_start_date,
    COUNT(end_date) as conferences_with_end_date,
    COUNT(*) FILTER (WHERE start_date IS NOT NULL) as valid_start_dates,
    COUNT(*) FILTER (WHERE end_date IS NULL OR end_date >= start_date) as valid_date_ranges
FROM conferences;

\echo ''
\echo '5. Checking indexes on events table...'
SELECT 
    indexname, 
    indexdef 
FROM pg_indexes 
WHERE tablename = 'events' 
    AND (indexname LIKE '%start_date%' OR indexname LIKE '%end_date%')
ORDER BY indexname;

\echo ''
\echo '6. Checking indexes on conferences table...'
SELECT 
    indexname, 
    indexdef 
FROM pg_indexes 
WHERE tablename = 'conferences' 
    AND (indexname LIKE '%start_date%' OR indexname LIKE '%end_date%')
ORDER BY indexname;

\echo ''
\echo '7. Checking constraints on events table...'
SELECT 
    conname as constraint_name,
    pg_get_constraintdef(oid) as constraint_definition
FROM pg_constraint
WHERE conrelid = 'events'::regclass
    AND conname LIKE '%date%';

\echo ''
\echo '8. Checking constraints on conferences table...'
SELECT 
    conname as constraint_name,
    pg_get_constraintdef(oid) as constraint_definition
FROM pg_constraint
WHERE conrelid = 'conferences'::regclass
    AND conname LIKE '%date%';

\echo ''
\echo '9. Sample events data (showing time fields)...'
SELECT 
    id,
    title,
    date as old_date_field,
    start_date,
    end_date,
    CASE 
        WHEN end_date IS NULL THEN 'active (no end date)'
        WHEN end_date >= NOW() THEN 'active'
        ELSE 'past'
    END as computed_status
FROM events
ORDER BY start_date DESC
LIMIT 5;

\echo ''
\echo '========================================='
\echo 'Verification Complete!'
\echo '========================================='

