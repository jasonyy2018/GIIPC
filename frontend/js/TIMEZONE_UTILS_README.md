# Timezone Utilities Documentation

## Overview

The `timezone-utils.js` module provides centralized timezone handling and date formatting functions for the GIIP application. All dates are stored in UTC format in the database and converted to the user's local timezone for display.

## Key Principles

1. **Storage**: All dates are stored in UTC (ISO 8601 format) in the database
2. **Display**: All dates are converted to the user's local timezone for display
3. **Consistency**: All date formatting uses the centralized utilities
4. **Validation**: Date range validation ensures data integrity

## Core Functions

### UTC/Local Conversion

#### `utcToLocal(utcDateString)`
Converts a UTC date string to a local Date object.

```javascript
import { utcToLocal } from './timezone-utils.js';

const utcDate = '2025-11-15T14:30:00Z';
const localDate = utcToLocal(utcDate);
// Returns: Date object in user's local timezone
```

#### `localToUtc(localDate)`
Converts a local Date object to UTC ISO string.

```javascript
import { localToUtc } from './timezone-utils.js';

const localDate = new Date('2025-11-15T14:30:00');
const utcString = localToUtc(localDate);
// Returns: '2025-11-15T14:30:00.000Z'
```

### Display Formatting

#### `formatDate(dateString, locale = 'en-US')`
Formats a date for display (e.g., "November 15, 2025").

```javascript
import { formatDate } from './timezone-utils.js';

const formatted = formatDate('2025-11-15T14:30:00Z');
// Returns: "November 15, 2025"
```

#### `formatDateTime(dateString, locale = 'en-US')`
Formats date and time for display (e.g., "Nov 15, 2025 at 2:30 PM").

```javascript
import { formatDateTime } from './timezone-utils.js';

const formatted = formatDateTime('2025-11-15T14:30:00Z');
// Returns: "Nov 15, 2025 at 2:30 PM" (in user's local timezone)
```

#### `formatDateRange(startDateString, endDateString, locale = 'en-US')`
Intelligently formats a date range based on the relationship between dates.

```javascript
import { formatDateRange } from './timezone-utils.js';

// Same day
formatDateRange('2025-11-15T09:00:00Z', '2025-11-15T17:00:00Z');
// Returns: "Nov 15, 2025"

// Same month
formatDateRange('2025-11-15T09:00:00Z', '2025-11-17T17:00:00Z');
// Returns: "Nov 15-17, 2025"

// Same year
formatDateRange('2025-11-15T09:00:00Z', '2025-12-17T17:00:00Z');
// Returns: "Nov 15 - Dec 17, 2025"

// Different years
formatDateRange('2025-11-15T09:00:00Z', '2026-01-17T17:00:00Z');
// Returns: "Nov 15, 2025 - Jan 17, 2026"
```

#### `formatDateTimeRange(startDateString, endDateString, locale = 'en-US')`
Formats a date and time range with times included.

```javascript
import { formatDateTimeRange } from './timezone-utils.js';

// Same day
formatDateTimeRange('2025-11-15T09:00:00Z', '2025-11-15T17:00:00Z');
// Returns: "Nov 15, 2025, 9:00 AM - 5:00 PM"

// Different days
formatDateTimeRange('2025-11-15T09:00:00Z', '2025-11-17T17:00:00Z');
// Returns: "Nov 15, 2025 at 9:00 AM - Nov 17, 2025 at 5:00 PM"
```

#### `formatDateTimeLocal(dateString)`
Formats date for datetime-local input (YYYY-MM-DDTHH:mm).

```javascript
import { formatDateTimeLocal } from './timezone-utils.js';

const formatted = formatDateTimeLocal('2025-11-15T14:30:00Z');
// Returns: "2025-11-15T14:30" (in user's local timezone)
// Used for <input type="datetime-local"> values
```

#### `formatEventBadge(dateString)`
Formats date for event badge display.

```javascript
import { formatEventBadge } from './timezone-utils.js';

const badge = formatEventBadge('2025-11-15T14:30:00Z');
// Returns: { day: 15, month: 'Nov', year: 2025 }
```

### Status and Validation

#### `computeStatus(endDateString)`
Computes event status based on end date.

```javascript
import { computeStatus } from './timezone-utils.js';

const status = computeStatus('2025-11-15T17:00:00Z');
// Returns: 'active' or 'past'
```

#### `isActive(startDateString, endDateString)`
Checks if an event is currently active.

```javascript
import { isActive } from './timezone-utils.js';

const active = isActive('2025-11-15T09:00:00Z', '2025-11-15T17:00:00Z');
// Returns: true if current time is between start and end
```

#### `isPast(dateString)`
Checks if a date is in the past.

```javascript
import { isPast } from './timezone-utils.js';

const past = isPast('2025-11-15T17:00:00Z');
// Returns: true if date is before current time
```

#### `isFuture(dateString)`
Checks if a date is in the future.

```javascript
import { isFuture } from './timezone-utils.js';

const future = isFuture('2025-11-15T17:00:00Z');
// Returns: true if date is after current time
```

#### `validateDateRange(startDateString, endDateString)`
Validates that end date is after start date.

```javascript
import { validateDateRange } from './timezone-utils.js';

const valid = validateDateRange('2025-11-15T09:00:00Z', '2025-11-15T17:00:00Z');
// Returns: true if end date is after start date
```

### Utility Functions

#### `getRelativeTime(dateString)`
Gets relative time string (e.g., "2 days ago", "in 3 hours").

```javascript
import { getRelativeTime } from './timezone-utils.js';

const relative = getRelativeTime('2025-11-15T14:30:00Z');
// Returns: "2 days ago" or "in 3 hours" etc.
```

#### `getCurrentUtc()`
Gets current UTC timestamp as ISO string.

```javascript
import { getCurrentUtc } from './timezone-utils.js';

const now = getCurrentUtc();
// Returns: "2025-10-21T10:30:00.000Z"
```

## Usage Examples

### In Data Renderer (data-renderer.js)

```javascript
import { formatDateRange, formatEventBadge, computeStatus } from './timezone-utils.js';

// Format date range for display
const dateRangeDisplay = formatDateRange(event.start_date, event.end_date);

// Get event badge data
const badge = formatEventBadge(event.start_date);

// Compute event status
const status = computeStatus(event.end_date);
```

### In Admin Panel (admin.js)

```javascript
import { 
    formatDateTime, 
    formatDateTimeLocal, 
    computeStatus,
    validateDateRange 
} from './timezone-utils.js';

// Display date and time in table
const displayDate = formatDateTime(event.start_date);

// Convert UTC to local for form input
const localDate = formatDateTimeLocal(event.start_date);

// Validate date range
const isValid = validateDateRange(startDate, endDate);

// Compute status for filtering
const status = computeStatus(event.end_date);
```

### In Forms

```javascript
import { formatDateTimeLocal, localToUtc, validateDateRange } from './timezone-utils.js';

// Load data into form (UTC to local)
document.getElementById('startDate').value = formatDateTimeLocal(event.start_date);

// Submit form data (local to UTC)
const startDateUTC = localToUtc(new Date(startDateInput.value));

// Validate before submit
if (!validateDateRange(startDateInput.value, endDateInput.value)) {
    alert('End date must be after start date');
}
```

## Migration Guide

### Before (Old Code)

```javascript
// Old way - inconsistent timezone handling
const date = new Date(dateString);
const formatted = date.toLocaleDateString('en-US', options);
```

### After (New Code)

```javascript
// New way - centralized timezone utilities
import { formatDate } from './timezone-utils.js';
const formatted = formatDate(dateString);
```

## Best Practices

1. **Always use UTC for storage**: Store all dates in UTC format in the database
2. **Convert for display**: Use timezone utilities to convert UTC to local for display
3. **Use appropriate formatters**: Choose the right formatter for your use case
4. **Validate date ranges**: Always validate that end dates are after start dates
5. **Handle null dates**: All functions handle null/undefined gracefully
6. **Consistent locale**: Use the same locale throughout the application

## Timezone Handling Flow

```
Database (UTC) → utcToLocal() → Display (Local Timezone)
                                    ↓
                              formatDate()
                              formatDateTime()
                              formatDateRange()
                                    ↓
                              User sees local time

User Input (Local) → localToUtc() → Database (UTC)
```

## Error Handling

All functions handle errors gracefully:
- Invalid dates return `null` or `'TBD'`
- Missing dates are handled with fallbacks
- Console errors are logged for debugging

## Testing

To test timezone utilities:

```javascript
// Test UTC to local conversion
const utc = '2025-11-15T14:30:00Z';
const local = utcToLocal(utc);
console.log('Local:', local);

// Test formatting
console.log('Date:', formatDate(utc));
console.log('DateTime:', formatDateTime(utc));
console.log('Range:', formatDateRange(utc, '2025-11-17T17:00:00Z'));

// Test status
console.log('Status:', computeStatus(utc));
console.log('Is Past:', isPast(utc));
console.log('Is Future:', isFuture(utc));
```

## Browser Compatibility

The timezone utilities use standard JavaScript Date APIs and are compatible with all modern browsers:
- Chrome/Edge 90+
- Firefox 88+
- Safari 14+

## Performance Considerations

- Date conversions are lightweight operations
- Formatting functions are optimized for repeated calls
- No external dependencies required
- Minimal memory footprint

## Future Enhancements

Potential future improvements:
- Support for custom timezone selection
- More locale options
- Date range picker integration
- Timezone abbreviation display (e.g., "PST", "EST")
- Calendar integration utilities
