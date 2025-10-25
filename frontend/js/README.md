# Frontend API Integration

This directory contains the JavaScript modules for API integration and data rendering.

## Files

### api-client.js
The API client module handles all HTTP requests to the backend API with automatic JWT token management.

**Features:**
- Automatic JWT token injection in request headers
- Token management (save, retrieve, remove from localStorage)
- RESTful API methods (GET, POST, PUT, DELETE)
- Error handling for network and HTTP errors
- Dedicated API modules for Auth, News, Events, and Conferences

**Usage Example:**
```javascript
// Fetch all news
const news = await NewsAPI.getAll();

// Login user
const response = await AuthAPI.login({ email: 'user@giip.info', password: 'password' });

// Create new event (requires authentication)
const event = await EventsAPI.create({
    title: 'New Event',
    description: 'Event description',
    date: '2025-12-01',
    location: 'New York',
    capacity: 100
});
```

### data-renderer.js
The data renderer module fetches data from the API and dynamically renders it on the page.

**Features:**
- Automatic data fetching on page load
- Loading states with spinner animation
- Error handling with user-friendly messages
- Dynamic HTML generation for news, events, and conferences
- Automatic slider reinitialization after data load

**Rendered Sections:**
- News cards (slider)
- Events list
- Conferences cards (slider)

## API Configuration

The API base URL is automatically determined:
- **Development (localhost):** `http://localhost:3000/api`
- **Production:** `/api` (relative path)

## Token Management

JWT tokens are stored in localStorage with the key `giip_auth_token`.

**Token Functions:**
- `TokenManager.getToken()` - Get current token
- `TokenManager.setToken(token)` - Save token
- `TokenManager.removeToken()` - Remove token
- `TokenManager.isAuthenticated()` - Check if user is authenticated

## Error Handling

All API requests include comprehensive error handling:

1. **Network Errors:** Displayed as "Network error. Please check your connection."
2. **HTTP Errors:** Displayed with the error message from the API response
3. **Empty Data:** Displayed with appropriate "No data available" messages

## Integration with index.html

The modules are included in the HTML file before the main application script:

```html
<script src="frontend/js/api-client.js"></script>
<script src="frontend/js/data-renderer.js"></script>
```

The data rendering is automatically initialized when the DOM is ready.

## Requirements Met

This implementation satisfies the following requirements:

- **Requirement 12.1:** Fetch news data from `/api/news`
- **Requirement 12.2:** Fetch events data from `/api/events`
- **Requirement 12.3:** Fetch conferences data from `/api/conferences`
- **Requirement 12.4:** Display friendly error messages on API failures
- **Requirement 12.5:** Include JWT in request headers for protected resources

## Future Enhancements

Potential improvements for future iterations:
- Pagination support for large datasets
- Search and filter functionality
- Real-time updates with WebSocket
- Caching strategy for better performance
- Retry logic for failed requests
