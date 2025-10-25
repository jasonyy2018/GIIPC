/**
 * Timezone Utilities Module
 * Centralized timezone handling and date formatting functions
 * All dates are stored in UTC and converted to local timezone for display
 */

/**
 * Convert UTC date string to local Date object
 * @param {string} utcDateString - UTC date string (ISO 8601)
 * @returns {Date|null} Local Date object or null if invalid
 */
export function utcToLocal(utcDateString) {
    if (!utcDateString) return null;
    
    try {
        const date = new Date(utcDateString);
        // Check if date is valid
        if (isNaN(date.getTime())) return null;
        return date;
    } catch (error) {
        console.error('Error converting UTC to local:', error);
        return null;
    }
}

/**
 * Convert local Date object to UTC ISO string
 * @param {Date} localDate - Local Date object
 * @returns {string|null} UTC ISO string or null if invalid
 */
export function localToUtc(localDate) {
    if (!localDate || !(localDate instanceof Date)) return null;
    
    try {
        return localDate.toISOString();
    } catch (error) {
        console.error('Error converting local to UTC:', error);
        return null;
    }
}

/**
 * Format date for display (e.g., "November 15, 2025")
 * @param {string} dateString - UTC date string (ISO 8601)
 * @param {string} locale - Locale string (default: 'en-US')
 * @returns {string} Formatted date string
 */
export function formatDate(dateString, locale = 'en-US') {
    const date = utcToLocal(dateString);
    if (!date) return 'TBD';
    
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return date.toLocaleDateString(locale, options);
}

/**
 * Format date and time for display (e.g., "Nov 15, 2025 at 2:30 PM")
 * @param {string} dateString - UTC date string (ISO 8601)
 * @param {string} locale - Locale string (default: 'en-US')
 * @returns {string} Formatted date and time string
 */
export function formatDateTime(dateString, locale = 'en-US') {
    const date = utcToLocal(dateString);
    if (!date) return 'TBD';
    
    const dateOptions = { year: 'numeric', month: 'short', day: 'numeric' };
    const timeOptions = { hour: '2-digit', minute: '2-digit' };
    
    const dateStr = date.toLocaleDateString(locale, dateOptions);
    const timeStr = date.toLocaleTimeString(locale, timeOptions);
    
    return `${dateStr} at ${timeStr}`;
}

/**
 * Get month abbreviation
 * @param {number} monthIndex - Month index (0-11)
 * @returns {string} Month abbreviation
 */
function getMonthAbbr(monthIndex) {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    return months[monthIndex] || 'Jan';
}

/**
 * Format date range for display
 * Handles same day, same month, same year, and different years intelligently
 * @param {string} startDateString - Start date UTC string (ISO 8601)
 * @param {string} endDateString - End date UTC string (ISO 8601)
 * @param {string} locale - Locale string (default: 'en-US')
 * @returns {string} Formatted date range string
 */
export function formatDateRange(startDateString, endDateString, locale = 'en-US') {
    const startDate = utcToLocal(startDateString);
    if (!startDate) return 'TBD';
    
    const endDate = utcToLocal(endDateString);
    
    // Use consistent month abbreviation function instead of toLocaleDateString
    const startMonth = getMonthAbbr(startDate.getMonth());
    const startDay = startDate.getDate();
    const startYear = startDate.getFullYear();
    
    // If no end date, just show start date
    if (!endDate) {
        return `${startMonth} ${startDay}, ${startYear}`;
    }
    
    const endMonth = getMonthAbbr(endDate.getMonth());
    const endDay = endDate.getDate();
    const endYear = endDate.getFullYear();
    
    // Same day
    if (startDate.toDateString() === endDate.toDateString()) {
        return `${startMonth} ${startDay}, ${startYear}`;
    }
    
    // Same month and year
    if (startMonth === endMonth && startYear === endYear) {
        return `${startMonth} ${startDay}-${endDay}, ${startYear}`;
    }
    
    // Same year, different months
    if (startYear === endYear) {
        return `${startMonth} ${startDay} - ${endMonth} ${endDay}, ${startYear}`;
    }
    
    // Different years
    return `${startMonth} ${startDay}, ${startYear} - ${endMonth} ${endDay}, ${endYear}`;
}

/**
 * Format date and time range for display with times
 * @param {string} startDateString - Start date UTC string (ISO 8601)
 * @param {string} endDateString - End date UTC string (ISO 8601)
 * @param {string} locale - Locale string (default: 'en-US')
 * @returns {string} Formatted date and time range string
 */
export function formatDateTimeRange(startDateString, endDateString, locale = 'en-US') {
    const startDate = utcToLocal(startDateString);
    if (!startDate) return 'TBD';
    
    const endDate = utcToLocal(endDateString);
    if (!endDate) return formatDateTime(startDateString, locale);
    
    const dateOptions = { year: 'numeric', month: 'short', day: 'numeric' };
    const timeOptions = { hour: '2-digit', minute: '2-digit' };
    
    // Same day - show date once with time range
    if (startDate.toDateString() === endDate.toDateString()) {
        const dateStr = startDate.toLocaleDateString(locale, dateOptions);
        const startTime = startDate.toLocaleTimeString(locale, timeOptions);
        const endTime = endDate.toLocaleTimeString(locale, timeOptions);
        return `${dateStr}, ${startTime} - ${endTime}`;
    }
    
    // Different days - show full date and time for both
    const startStr = formatDateTime(startDateString, locale);
    const endStr = formatDateTime(endDateString, locale);
    return `${startStr} - ${endStr}`;
}

/**
 * Format date for datetime-local input (YYYY-MM-DDTHH:mm)
 * Converts UTC to local time for form inputs
 * @param {string} dateString - UTC date string (ISO 8601)
 * @returns {string} Formatted string for datetime-local input
 */
export function formatDateTimeLocal(dateString) {
    const date = utcToLocal(dateString);
    if (!date) return '';
    
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    
    return `${year}-${month}-${day}T${hours}:${minutes}`;
}

/**
 * Format date for event badge display
 * @param {string} dateString - UTC date string (ISO 8601)
 * @returns {Object} { day, month, year }
 */
export function formatEventBadge(dateString) {
    const date = utcToLocal(dateString);
    if (!date) return { day: '?', month: '?', year: '?' };
    
    const day = date.getDate();
    const month = getMonthAbbr(date.getMonth());
    const year = date.getFullYear();
    
    return { day, month, year };
}

/**
 * Get relative time string (e.g., "2 days ago", "in 3 hours")
 * @param {string} dateString - UTC date string (ISO 8601)
 * @returns {string} Relative time string
 */
export function getRelativeTime(dateString) {
    const date = utcToLocal(dateString);
    if (!date) return 'Unknown';
    
    const now = new Date();
    const diffMs = date - now;
    const diffSec = Math.floor(Math.abs(diffMs) / 1000);
    const diffMin = Math.floor(diffSec / 60);
    const diffHour = Math.floor(diffMin / 60);
    const diffDay = Math.floor(diffHour / 24);
    const diffWeek = Math.floor(diffDay / 7);
    const diffMonth = Math.floor(diffDay / 30);
    const diffYear = Math.floor(diffDay / 365);
    
    const isPast = diffMs < 0;
    const suffix = isPast ? 'ago' : 'from now';
    
    if (diffYear > 0) return `${diffYear} year${diffYear > 1 ? 's' : ''} ${suffix}`;
    if (diffMonth > 0) return `${diffMonth} month${diffMonth > 1 ? 's' : ''} ${suffix}`;
    if (diffWeek > 0) return `${diffWeek} week${diffWeek > 1 ? 's' : ''} ${suffix}`;
    if (diffDay > 0) return `${diffDay} day${diffDay > 1 ? 's' : ''} ${suffix}`;
    if (diffHour > 0) return `${diffHour} hour${diffHour > 1 ? 's' : ''} ${suffix}`;
    if (diffMin > 0) return `${diffMin} minute${diffMin > 1 ? 's' : ''} ${suffix}`;
    
    return 'Just now';
}

/**
 * Check if a date is in the past
 * @param {string} dateString - UTC date string (ISO 8601)
 * @returns {boolean} True if date is in the past
 */
export function isPast(dateString) {
    const date = utcToLocal(dateString);
    if (!date) return false;
    
    return date < new Date();
}

/**
 * Check if a date is in the future
 * @param {string} dateString - UTC date string (ISO 8601)
 * @returns {boolean} True if date is in the future
 */
export function isFuture(dateString) {
    const date = utcToLocal(dateString);
    if (!date) return false;
    
    return date > new Date();
}

/**
 * Check if an event is currently active (between start and end dates)
 * @param {string} startDateString - Start date UTC string (ISO 8601)
 * @param {string} endDateString - End date UTC string (ISO 8601)
 * @returns {boolean} True if event is currently active
 */
export function isActive(startDateString, endDateString) {
    const startDate = utcToLocal(startDateString);
    const endDate = utcToLocal(endDateString);
    const now = new Date();
    
    if (!startDate) return false;
    if (!endDate) return true; // No end date means always active
    
    return now >= startDate && now <= endDate;
}

/**
 * Compute event status based on end date
 * @param {string} endDateString - End date UTC string (ISO 8601)
 * @returns {string} 'active' or 'past'
 */
export function computeStatus(endDateString) {
    if (!endDateString) return 'active'; // No end date means active
    
    const endDate = utcToLocal(endDateString);
    if (!endDate) return 'active';
    
    const now = new Date();
    return endDate >= now ? 'active' : 'past';
}

/**
 * Get current UTC timestamp as ISO string
 * @returns {string} Current UTC timestamp
 */
export function getCurrentUtc() {
    return new Date().toISOString();
}

/**
 * Validate that end date is after start date
 * @param {string} startDateString - Start date string
 * @param {string} endDateString - End date string
 * @returns {boolean} True if valid
 */
export function validateDateRange(startDateString, endDateString) {
    const startDate = new Date(startDateString);
    const endDate = new Date(endDateString);
    
    if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
        return false;
    }
    
    return endDate > startDate;
}
