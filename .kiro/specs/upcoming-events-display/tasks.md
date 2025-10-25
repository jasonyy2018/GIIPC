# Implementation Plan

- [x] 1. Create Event Card Component





  - Create `frontend/js/components/event-card.js` with EventCard class
  - Implement date formatting logic to extract year and month/day from ISO date
  - Implement render() method that returns HTML string with date badge, title, description, and action button
  - Add CSS styles for event card, date badge, and hover effects matching reference design
  - _Requirements: 1.2, 1.3, 1.4_

- [x] 2. Implement Homepage Upcoming Events Section




- [x] 2.1 Add HTML structure to index.html


  - Insert upcoming events section HTML after Past Conferences section
  - Include section title matching Past Conferences style
  - Add empty grid container for event cards
  - Add "Learn More" link pointing to events.html
  - _Requirements: 1.1, 1.3, 1.4_

- [x] 2.2 Create upcoming events JavaScript module


  - Create `frontend/js/upcoming-events.js` with UpcomingEventsSection class
  - Implement API call to fetch events with status='active', sortBy='start_date', sortOrder='asc', limit=4
  - Filter events to only show future events (start_date > current date)
  - Render exactly 4 upcoming events using EventCard component
  - Handle empty state when no upcoming events exist
  - _Requirements: 1.1, 1.5, 5.1, 5.2, 5.3, 5.4, 5.5_

- [x] 2.3 Integrate with index.html


  - Import upcoming-events.js module in index.html
  - Initialize UpcomingEventsSection on page load
  - Add error handling for API failures
  - _Requirements: 1.5, 5.1_

- [x] 3. Create Events Page with Waterfall Layout





- [x] 3.1 Create events.html page structure


  - Create new `frontend/events.html` file
  - Copy header, navigation, and footer from index.html
  - Add page title and description section
  - Add filter/sort controls (sort by date, title)
  - Add empty waterfall grid container
  - Add loading state and empty state elements
  - _Requirements: 2.1, 2.4_

- [x] 3.2 Implement waterfall layout CSS


  - Add CSS Grid-based masonry layout styles
  - Implement responsive breakpoints: mobile (1 column), tablet (2 columns), desktop (3-4 columns)
  - Add CSS custom property for dynamic row span calculation
  - Ensure consistent card styling with homepage
  - _Requirements: 2.2, 2.5, 6.2, 6.3, 6.4_

- [x] 3.3 Create events page JavaScript module


  - Create `frontend/js/events-page.js` with EventsPage class
  - Implement API call to fetch all upcoming events (limit=100)
  - Filter to only future events
  - Implement sort functionality (date ascending/descending, title)
  - Calculate grid row spans for each card based on content height
  - Handle loading, empty, and error states
  - _Requirements: 2.1, 2.3, 5.1, 5.2, 5.3_

- [x] 4. Create Event Detail Page





- [x] 4.1 Create event-detail.html page structure


  - Create new `frontend/event-detail.html` file
  - Copy header, navigation, and footer from index.html
  - Add hero section with large date badge and event title
  - Add main content area with event description
  - Add sidebar with event details (date, time, location, capacity)
  - Add related events section in sidebar
  - _Requirements: 3.2_


- [x] 4.2 Implement registration form section

  - Add registration form HTML with fields: name (readonly), email (readonly), organization, notes
  - Add submit button
  - Create auth-required message section (hidden by default)
  - Add login and register buttons in auth-required section
  - _Requirements: 3.2, 3.3_

- [x] 4.3 Create event detail JavaScript module


  - Create `frontend/js/event-detail.js` with EventDetailPage class
  - Extract event ID from URL query parameter
  - Implement API call to fetch single event details
  - Render event information in hero and content sections
  - Check authentication status and show/hide registration form accordingly
  - Pre-populate form fields with user data from session
  - Implement form submission handler
  - _Requirements: 3.2, 3.4, 5.1_

- [x] 5. Implement Authentication Gate











- [x] 5.1 Add authentication check to event card clicks

  - Modify EventCard component to check auth status on click
  - If authenticated, navigate to event-detail.html?id={eventId}
  - If not authenticated, show login modal with message
  - Store intended destination in sessionStorage
  - _Requirements: 4.1, 4.2, 4.5_


- [x] 5.2 Implement post-login redirect

  - Modify auth.js to check for stored destination after successful login
  - Redirect to stored event detail page after login/registration
  - Clear stored destination from sessionStorage
  - _Requirements: 4.3, 4.4_

- [x] 5.3 Add auth-required UI to event detail page


  - Show auth-required message when user is not logged in
  - Hide registration form when user is not logged in
  - Attach click handlers to login/register buttons to show respective modals
  - _Requirements: 4.1, 4.2, 4.5_
 

- [x] 6. Implement Event Registration Backend Endpoint













  - Add POST /api/events/:id/register endpoint in eventRoutes.js
  - Create registerForEvent controller function
  - Validate user authentication and event existence
  - Store registration in database (create event_registrations table if needed)
  - Return success response with registration details
  - _Requirements: 3.5_
- [x] 7. Implement Registration Form Submission









- [ ] 7. Implement Registration Form Submission

  - Add form submit handler in event-detail.js
  - Collect form data (organization, notes)
  - Send POST request to /api/events/:id/register
  - Display success message on successful registration
  - Handle errors (already registered, event full, etc.)
  - _Requirements: 3.5_
-
- [x] 8. Add Responsive Design and Mobile Optimization

- [x] 8. Add Responsive Design and Mobile Optimization



- [x] 8.1 Implement mobile styles for event cards


  - Add mobile breakpoint styles for event cards (stack vertically, full width)
  - Adjust date badge size for mobile screens
  - Ensure touch-friendly button sizes (min 44x44px)
  - Test on mobile devices (320px-767px)
  - _Requirements: 6.1, 6.2, 6.5_

- [x] 8.2 Implement tablet and desktop responsive styles


  - Add tablet breakpoint styles (2-column grid)
  - Add desktop breakpoint styles (3-4 column grid)
  - Ensure proper spacing and alignment across breakpoints
  - Test on various screen sizes
  - _Requirements: 6.1, 6.3, 6.4_


- [x] 8.3 Optimize event detail page for mobile

  - Stack sidebar below main content on mobile
  - Adjust hero section layout for mobile
  - Ensure form is usable on mobile devices
  - Test registration flow on mobile
  - _Requirements: 6.1, 6.2_

- [x] 9. Add Error Handling and Loading States




  - Implement error display component for API failures
  - Add loading spinners during API calls
  - Add retry functionality for failed requests
  - Display user-friendly error messages
  - Handle edge cases (no events, invalid event ID, network errors)
  - _Requirements: 5.5_

- [x] 10. Integrate with Existing Codebase





  - Ensure event card styles don't conflict with existing CSS
  - Use existing API client (api-client.js) for all API calls
  - Use existing AuthManager for authentication checks
  - Follow existing code style and patterns
  - Update navigation menu to include link to events.html if needed
  - _Requirements: 1.5, 4.5_


- [x] 11. Testing and Quality Assurance




  - Test event display on homepage (4 events, correct sorting)
  - Test events page waterfall layout on different screen sizes
  - Test authentication gate (logged in vs. logged out)
  - Test registration form submission and validation
  - Test error states and edge cases
  - Verify accessibility (keyboard navigation, screen readers)
  - Cross-browser testing (Chrome, Firefox, Safari, Edge)
  - _Requirements: All_
