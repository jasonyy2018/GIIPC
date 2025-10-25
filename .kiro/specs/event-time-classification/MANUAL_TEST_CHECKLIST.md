# Manual Testing Checklist - Time Classification Feature

## Overview
This document provides a comprehensive manual testing checklist for the time-based event and conference classification feature.

## Prerequisites
- [ ] Docker containers are running (backend and frontend)
- [ ] Database has been migrated with start_date and end_date columns
- [ ] Admin account is available for testing
- [ ] Browser developer tools are open for debugging

## Test Environment
- **Backend URL**: http://localhost:3000
- **Frontend URL**: http://localhost:8080
- **Test Browser**: Chrome/Firefox/Safari
- **Test Date**: _____________

---

## 1. Events Page - Active Events Display

### Test 1.1: Display Only Active Events
- [ ] Navigate to the Events page (index.html)
- [ ] Verify that only events with future end dates are displayed
- [ ] Verify that each event shows:
  - [ ] Event title
  - [ ] Start and end date range
  - [ ] Location
  - [ ] "Active" status badge (green)
- [ ] Verify no past events are shown

### Test 1.2: Date Display Format
- [ ] Check that dates are displayed in local timezone
- [ ] Verify date format is user-friendly (e.g., "Nov 15-17, 2025")
- [ ] For same-day events, verify only one date is shown
- [ ] For multi-day events, verify date range is shown correctly

### Test 1.3: Sorting
- [ ] Verify events are sorted by start date (earliest first)
- [ ] Create multiple active events with different start dates
- [ ] Verify they appear in correct chronological order

### Test 1.4: Empty State
- [ ] Delete all active events from admin panel
- [ ] Verify appropriate "No upcoming events" message is displayed
- [ ] Verify no errors in browser console

---

## 2. Past Conferences Page - Past Events Display

### Test 2.1: Display Only Past Events
- [ ] Navigate to the Past Conferences page
- [ ] Verify that only events with past end dates are displayed
- [ ] Verify that each event shows:
  - [ ] Event/Conference title
  - [ ] Start and end date range
  - [ ] Location
  - [ ] Summary (for conferences)
- [ ] Verify no active events are shown

### Test 2.2: Date Display Format
- [ ] Check that dates are displayed in local timezone
- [ ] Verify date format matches Events page format
- [ ] Verify date ranges are displayed correctly

### Test 2.3: Sorting
- [ ] Verify past events are sorted by end date (most recent first)
- [ ] Create multiple past events with different end dates
- [ ] Verify they appear in correct reverse chronological order

### Test 2.4: Empty State
- [ ] Delete all past events from admin panel
- [ ] Verify appropriate "No past conferences" message is displayed
- [ ] Verify no errors in browser console

---

## 3. Admin Panel - Event Creation

### Test 3.1: Create Active Event
- [ ] Login to admin panel
- [ ] Navigate to Events section
- [ ] Click "Create New Event"
- [ ] Fill in all required fields:
  - [ ] Title: "Test Active Event"
  - [ ] Description: "This is a test event"
  - [ ] Start Date: Today's date at 9:00 AM
  - [ ] End Date: Tomorrow's date at 5:00 PM
  - [ ] Location: "Test Location"
  - [ ] Capacity: 100
- [ ] Click "Save"
- [ ] Verify success message is displayed
- [ ] Verify event appears in Events list with "Active" status

### Test 3.2: Create Past Event
- [ ] Click "Create New Event"
- [ ] Fill in all required fields:
  - [ ] Title: "Test Past Event"
  - [ ] Description: "This is a past event"
  - [ ] Start Date: 7 days ago at 9:00 AM
  - [ ] End Date: 7 days ago at 5:00 PM
  - [ ] Location: "Test Location"
  - [ ] Capacity: 50
- [ ] Click "Save"
- [ ] Verify success message is displayed
- [ ] Verify event appears in Events list with "Past" status

### Test 3.3: Date Range Validation
- [ ] Click "Create New Event"
- [ ] Fill in title and description
- [ ] Set Start Date: Tomorrow at 9:00 AM
- [ ] Set End Date: Today at 5:00 PM (before start date)
- [ ] Click "Save"
- [ ] Verify error message: "End date must be after or equal to start date"
- [ ] Verify event is NOT created

### Test 3.4: Time Picker Functionality
- [ ] Click "Create New Event"
- [ ] Click on Start Date field
- [ ] Verify datetime picker appears
- [ ] Select a date and time
- [ ] Verify selected value is displayed correctly
- [ ] Repeat for End Date field

---

## 4. Admin Panel - Event Editing

### Test 4.1: Edit Event Dates
- [ ] Select an existing active event
- [ ] Click "Edit"
- [ ] Verify current start_date and end_date are pre-filled
- [ ] Change end_date to a past date
- [ ] Click "Save"
- [ ] Verify event status changes to "Past"
- [ ] Verify event no longer appears on Events page
- [ ] Verify event now appears on Past Conferences page

### Test 4.2: Edit Event to Active
- [ ] Select an existing past event
- [ ] Click "Edit"
- [ ] Change end_date to a future date
- [ ] Click "Save"
- [ ] Verify event status changes to "Active"
- [ ] Verify event now appears on Events page
- [ ] Verify event no longer appears on Past Conferences page

### Test 4.3: Partial Update
- [ ] Select an event
- [ ] Click "Edit"
- [ ] Change only the title (don't touch dates)
- [ ] Click "Save"
- [ ] Verify title is updated
- [ ] Verify dates remain unchanged
- [ ] Verify status remains unchanged

---

## 5. Admin Panel - Conference Management

### Test 5.1: Create Active Conference
- [ ] Navigate to Conferences section
- [ ] Click "Create New Conference"
- [ ] Fill in all required fields with future dates
- [ ] Click "Save"
- [ ] Verify conference appears with "Active" status

### Test 5.2: Create Past Conference
- [ ] Click "Create New Conference"
- [ ] Fill in all required fields with past dates
- [ ] Click "Save"
- [ ] Verify conference appears with "Past" status

### Test 5.3: Date Range Validation
- [ ] Try to create conference with end_date before start_date
- [ ] Verify validation error is displayed
- [ ] Verify conference is NOT created

---

## 6. Admin Panel - List View

### Test 6.1: Status Display
- [ ] Navigate to Events list
- [ ] Verify each event shows its status (Active/Past)
- [ ] Verify status badges are color-coded:
  - [ ] Green for Active
  - [ ] Gray for Past

### Test 6.2: Date Display
- [ ] Verify start_date and end_date are displayed for each event
- [ ] Verify dates are in readable format
- [ ] Verify dates are in local timezone

### Test 6.3: Filter by Status
- [ ] Look for status filter dropdown (if implemented)
- [ ] Filter by "Active" status
- [ ] Verify only active events are shown
- [ ] Filter by "Past" status
- [ ] Verify only past events are shown
- [ ] Filter by "All"
- [ ] Verify all events are shown

---

## 7. Timezone Handling

### Test 7.1: UTC Storage
- [ ] Create an event via admin panel
- [ ] Open browser developer tools
- [ ] Check Network tab for the POST request
- [ ] Verify dates are sent in UTC format (ISO 8601)
- [ ] Check database directly
- [ ] Verify dates are stored in UTC

### Test 7.2: Local Display
- [ ] Create an event with specific time (e.g., 2:00 PM local time)
- [ ] View event on Events page
- [ ] Verify time is displayed in local timezone
- [ ] Change browser timezone (if possible)
- [ ] Refresh page
- [ ] Verify time adjusts to new timezone

### Test 7.3: Consistency
- [ ] Create event in admin panel
- [ ] Note the displayed time
- [ ] View same event on Events page
- [ ] Verify time matches admin panel display
- [ ] Edit event in admin panel
- [ ] Verify time is still consistent

---

## 8. Backward Compatibility

### Test 8.1: Old Data Without start_date/end_date
- [ ] If old events exist without start_date/end_date:
  - [ ] Verify they are displayed without errors
  - [ ] Verify they show "TBD" or appropriate placeholder
  - [ ] Verify they are treated as active events
- [ ] If no old data exists, skip this test

### Test 8.2: Migration Verification
- [ ] Check that old 'date' field still exists (if applicable)
- [ ] Verify new start_date and end_date fields are populated
- [ ] Verify no data loss occurred during migration

---

## 9. Error Handling

### Test 9.1: Network Errors
- [ ] Stop backend server
- [ ] Try to load Events page
- [ ] Verify friendly error message is displayed
- [ ] Verify "Retry" button is available
- [ ] Restart backend server
- [ ] Click "Retry"
- [ ] Verify events load successfully

### Test 9.2: Invalid Data
- [ ] Try to create event with invalid date format via API
- [ ] Verify appropriate error message is returned
- [ ] Verify event is NOT created

### Test 9.3: Missing Fields
- [ ] Try to create event without required fields
- [ ] Verify validation errors are displayed
- [ ] Verify which fields are missing
- [ ] Verify event is NOT created

---

## 10. Mobile Responsiveness

### Test 10.1: Events Page on Mobile
- [ ] Open Events page on mobile device or resize browser to mobile width
- [ ] Verify layout adapts to mobile screen
- [ ] Verify date badges are readable
- [ ] Verify event cards stack vertically
- [ ] Verify all information is accessible

### Test 10.2: Admin Panel on Mobile
- [ ] Open admin panel on mobile device
- [ ] Verify forms are usable on mobile
- [ ] Verify datetime pickers work on mobile
- [ ] Verify list view is readable on mobile

### Test 10.3: Touch Interactions
- [ ] Test all buttons and links with touch
- [ ] Verify datetime picker works with touch input
- [ ] Verify no UI elements are too small to tap

---

## 11. Performance

### Test 11.1: Large Dataset
- [ ] Create 50+ events (mix of active and past)
- [ ] Load Events page
- [ ] Verify page loads within 2 seconds
- [ ] Verify no lag when scrolling
- [ ] Check browser console for performance warnings

### Test 11.2: Pagination
- [ ] If pagination is implemented:
  - [ ] Verify page navigation works
  - [ ] Verify correct number of items per page
  - [ ] Verify total count is accurate

---

## 12. News Page - Unaffected

### Test 12.1: News Functionality
- [ ] Navigate to News page
- [ ] Verify news items are displayed correctly
- [ ] Verify news is NOT filtered by time
- [ ] Verify all news items are shown
- [ ] Verify no errors in console

### Test 12.2: News Creation
- [ ] Create a new news item in admin panel
- [ ] Verify it appears on News page immediately
- [ ] Verify it's not affected by time classification logic

---

## Test Results Summary

### Overall Status
- [ ] All critical tests passed
- [ ] All high-priority tests passed
- [ ] All medium-priority tests passed
- [ ] All low-priority tests passed

### Issues Found
| Issue # | Description | Severity | Status |
|---------|-------------|----------|--------|
| 1       |             |          |        |
| 2       |             |          |        |
| 3       |             |          |        |

### Browser Compatibility
- [ ] Chrome - Version: _____ - Status: _____
- [ ] Firefox - Version: _____ - Status: _____
- [ ] Safari - Version: _____ - Status: _____
- [ ] Edge - Version: _____ - Status: _____

### Notes
_Add any additional observations or comments here_

---

## Sign-off

**Tester Name**: _________________  
**Date**: _________________  
**Signature**: _________________  

**Approved By**: _________________  
**Date**: _________________  
**Signature**: _________________
