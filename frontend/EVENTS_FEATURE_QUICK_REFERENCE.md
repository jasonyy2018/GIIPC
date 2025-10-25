# Upcoming Events Feature - Quick Reference Guide

## For Developers

### Adding New Event-Related Features

#### Using the API Client
```javascript
import { EventsAPI } from './api-client.js';

// Get active events
const response = await EventsAPI.getActive({ limit: 10 });

// Get single event
const event = await EventsAPI.getById(eventId);

// Get past events
const pastEvents = await EventsAPI.getPast({ limit: 20 });
```

#### Using Authentication
```javascript
import { authManager } from './auth.js';

// Check if user is authenticated
if (authManager.isAuthenticated()) {
    // User is logged in
    const user = authManager.getUser();
}

// Show login modal
authManager.showLoginModal();

// Show register modal
authManager.showRegisterModal();
```

#### Using Event Cards
```javascript
import { EventCard, handleEventCardClick } from './components/event-card.js';
import { authManager } from './auth.js';

// Create event card
const eventCard = new EventCard(eventData);
const html = eventCard.render();

// Handle click with authentication
handleEventCardClick(eventId, authManager);
```

#### Using Error Handler
```javascript
import { ErrorHandler, LoadingState, Toast } from './utils/error-handler.js';

// Show error
ErrorHandler.showError(container, error, {
    context: 'loading events',
    showRetry: true,
    onRetry: () => loadEvents()
});

// Show loading
LoadingState.show(container, {
    message: 'Loading...',
    size: 'medium'
});

// Show toast notification
Toast.show('Success!', { type: 'success' });
```

### File Locations

#### HTML Pages
- `frontend/index.html` - Homepage with upcoming events section
- `frontend/events.html` - All events page
- `frontend/event-detail.html` - Event detail page

#### JavaScript Modules
- `frontend/js/upcoming-events.js` - Homepage events logic
- `frontend/js/events-page.js` - Events page logic
- `frontend/js/event-detail.js` - Event detail logic
- `frontend/js/components/event-card.js` - Reusable event card

#### CSS Files
- `frontend/css/event-card.css` - Event card styles
- `frontend/css/waterfall-layout.css` - Masonry layout
- `frontend/css/event-detail.css` - Event detail styles

### Common Tasks

#### Modifying Event Card Appearance
Edit `frontend/css/event-card.css`

#### Changing Number of Homepage Events
```javascript
// In frontend/js/upcoming-events.js
const upcomingEventsSection = new UpcomingEventsSection('upcoming-events-grid', 6); // Change from 4 to 6
```

#### Adding Event Filters
Edit `frontend/js/events-page.js` and add filter logic in `sortEvents()` method

#### Customizing Registration Form
Edit `frontend/event-detail.html` and `frontend/js/event-detail.js`

### Responsive Breakpoints
- Mobile: 320px - 767px (1 column)
- Tablet: 768px - 1023px (2 columns)
- Desktop: 1024px - 1279px (3 columns)
- Large Desktop: 1280px+ (4 columns)

### Color Scheme
- Primary Dark: `#0B4D3E`
- Primary: `#1B5E20`
- Accent: `#E63946`
- Orange Gradient: `#FF8C42` to `#FF6B35`
- Blue: `#1B4D89`

### API Endpoints Used
- `GET /api/events` - Get all events
- `GET /api/events/:id` - Get single event
- `POST /api/events/:id/register` - Register for event

### Authentication Flow
1. User clicks event card
2. Check `authManager.isAuthenticated()`
3. If not authenticated:
   - Store destination in `sessionStorage.setItem('intendedDestination', url)`
   - Show login modal
4. After login:
   - Check for `sessionStorage.getItem('intendedDestination')`
   - Redirect to stored destination
   - Clear stored destination

### Troubleshooting

#### Events Not Displaying
1. Check browser console for errors
2. Verify API endpoint is accessible
3. Check network tab for failed requests
4. Verify event data format matches expected structure

#### Authentication Not Working
1. Check if `authManager` is initialized
2. Verify JWT token in localStorage
3. Check API authentication headers
4. Test login/logout flow

#### Styling Issues
1. Check if CSS files are loaded
2. Verify no CSS conflicts with existing styles
3. Check responsive breakpoints
4. Test on different browsers

#### Performance Issues
1. Check number of events being loaded
2. Verify masonry calculations are efficient
3. Check for memory leaks in event listeners
4. Optimize images if used

### Best Practices

#### Code Style
- Use ES6 modules (import/export)
- Use async/await for API calls
- Add JSDoc comments
- Follow existing naming conventions
- Use semantic HTML

#### Error Handling
- Always wrap API calls in try-catch
- Show user-friendly error messages
- Provide retry options
- Log errors to console

#### Accessibility
- Add ARIA labels
- Ensure keyboard navigation
- Maintain focus management
- Use semantic HTML elements
- Test with screen readers

#### Performance
- Batch DOM updates
- Use requestAnimationFrame for calculations
- Debounce scroll/resize handlers
- Lazy load images
- Minimize API calls

### Testing Checklist
- [ ] Test on Chrome, Firefox, Safari, Edge
- [ ] Test on mobile devices
- [ ] Test authentication flow
- [ ] Test error states
- [ ] Test loading states
- [ ] Test empty states
- [ ] Test responsive design
- [ ] Test keyboard navigation
- [ ] Test with screen reader
- [ ] Test form validation

---

**Need Help?** Check the full integration summary at `UPCOMING_EVENTS_INTEGRATION_SUMMARY.md`
