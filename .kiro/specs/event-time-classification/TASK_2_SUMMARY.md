# Task 2 Implementation Summary: 后端 API 扩展 - Events

## Completed Changes

### 1. Event Validator (`backend/src/validators/eventValidator.js`)

#### Added Fields to createEventSchema:
- `start_date`: Optional ISO 8601 timestamp field with validation
- `end_date`: Optional ISO 8601 timestamp field with validation
- Added refinement to validate `end_date >= start_date`

#### Added Fields to updateEventSchema:
- `start_date`: Optional ISO 8601 timestamp field with validation
- `end_date`: Optional ISO 8601 timestamp field with validation
- Added refinement to validate `end_date >= start_date`

#### New Query Schema:
- Created `eventQuerySchema` with the following parameters:
  - `page`: Page number (default: 1)
  - `limit`: Items per page (default: 10, max: 100)
  - `status`: Filter by 'active', 'past', or 'all' (default: 'all')
  - `sortBy`: Sort by 'start_date', 'end_date', 'created_at', or 'date' (default: 'start_date')
  - `sortOrder`: Sort order 'asc' or 'desc' (default: 'desc')

### 2. Event Repository (`backend/src/repositories/eventRepository.js`)

#### Updated `getAllEvents()`:
- Changed signature to accept options object instead of individual parameters
- Added status filtering logic:
  - `active`: Returns events where `end_date IS NULL OR end_date >= CURRENT_TIMESTAMP`
  - `past`: Returns events where `end_date < CURRENT_TIMESTAMP`
  - `all`: Returns all events (no filter)
- Added dynamic sorting support for `start_date`, `end_date`, `created_at`, and `date`
- Added computed `status` field in SELECT query using CASE statement
- Returns `start_date` and `end_date` fields in response

#### Updated `getEventById()`:
- Added `start_date` and `end_date` to SELECT query
- Added computed `status` field using CASE statement

#### Updated `createEvent()`:
- Added `start_date` and `end_date` parameters to INSERT query
- Computes and adds `status` field to returned event object
- Maintains backward compatibility with `date` field

#### Updated `updateEvent()`:
- Added handling for `start_date` and `end_date` fields
- Fixed SQL parameter placeholders (using `$` prefix)
- Returns `start_date` and `end_date` in RETURNING clause
- Computes and adds `status` field to returned event object

### 3. Event Controller (`backend/src/controllers/eventController.js`)

#### Updated `getEvents()`:
- Extracts `status`, `sortBy`, and `sortOrder` from query parameters
- Passes all parameters as options object to `getAllEvents()`

### 4. Event Routes (`backend/src/routes/eventRoutes.js`)

#### Updated GET /api/events:
- Changed validator from `paginationSchema` to `eventQuerySchema`
- Updated API documentation to include new query parameters
- Updated response example to show `start_date`, `end_date`, and `status` fields

#### Updated POST /api/events:
- Updated API documentation to include `start_date` and `end_date` fields
- Noted that `date` field is deprecated but kept for backward compatibility
- Updated response example to show new fields

#### Updated PUT /api/events/:id:
- Updated API documentation to include `start_date` and `end_date` fields
- Updated response example to show new fields

## Status Computation Logic

The `status` field is computed in the database using a CASE statement:
```sql
CASE 
  WHEN e.end_date IS NULL OR e.end_date >= CURRENT_TIMESTAMP THEN 'active'
  ELSE 'past'
END as status
```

This ensures:
- Events without an `end_date` are considered 'active'
- Events with `end_date` in the future are 'active'
- Events with `end_date` in the past are 'past'

## Backward Compatibility

- The `date` field is maintained in all queries for backward compatibility
- Old events without `start_date` or `end_date` will still work
- Events without `end_date` are treated as 'active'

## API Examples

### Get Active Events:
```
GET /api/events?status=active&sortBy=start_date&sortOrder=asc
```

### Get Past Events:
```
GET /api/events?status=past&sortBy=end_date&sortOrder=desc
```

### Create Event with Time Range:
```json
POST /api/events
{
  "title": "Innovation Workshop",
  "description": "A workshop on innovation",
  "start_date": "2025-11-15T09:00:00Z",
  "end_date": "2025-11-15T17:00:00Z",
  "location": "Conference Hall A",
  "capacity": 100
}
```

## Validation

All modified files passed diagnostics with no errors:
- ✅ `backend/src/validators/eventValidator.js`
- ✅ `backend/src/repositories/eventRepository.js`
- ✅ `backend/src/controllers/eventController.js`
- ✅ `backend/src/routes/eventRoutes.js`

## Requirements Satisfied

This implementation satisfies the following requirements from the design document:

- ✅ **1.1**: Events page shows only active events (end_date >= current time)
- ✅ **1.2**: Events sorted by start_date
- ✅ **1.3**: Events automatically removed from active list when end_date passes
- ✅ **3.1**: Backend API provides status filtering (active/past/all)
- ✅ **3.2**: Backend returns events based on end_date comparison
- ✅ **3.3**: Backend returns events based on end_date comparison for past events
- ✅ **6.2**: Backend uses server UTC time for comparisons (CURRENT_TIMESTAMP)
- ✅ **6.4**: Time comparison logic consistent in backend

## Next Steps

The backend API is now ready to support time-based event classification. The next task should be:
- Task 3: 后端 API 扩展 - Conferences (similar changes for conferences)
