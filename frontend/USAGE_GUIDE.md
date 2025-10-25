# Frontend API Integration - Usage Guide

## Quick Start

The frontend API integration is automatically initialized when the page loads. No manual setup is required for basic usage.

## Basic Usage

### Fetching Data

The data is automatically fetched and rendered when the page loads. The following sections are populated:

1. **News Section** - Latest news articles
2. **Events Section** - Upcoming events
3. **Conferences Section** - Past conferences

### Manual Data Fetching

If you need to manually fetch data (e.g., for refresh functionality), you can use the API modules:

```javascript
// Fetch news
const news = await NewsAPI.getAll();

// Fetch events
const events = await EventsAPI.getAll();

// Fetch conferences
const conferences = await ConferencesAPI.getAll();
```

## Authentication

### Login

```javascript
try {
    const response = await AuthAPI.login({
        email: 'user@giip.info',
        password: 'password123'
    });
    
    console.log('Login successful:', response.user);
    // Token is automatically saved to localStorage
} catch (error) {
    console.error('Login failed:', error.message);
}
```

### Register

```javascript
try {
    const response = await AuthAPI.register({
        email: 'newuser@giip.info',
        password: 'securepassword123'
    });
    
    console.log('Registration successful:', response);
} catch (error) {
    console.error('Registration failed:', error.message);
}
```

### Logout

```javascript
AuthAPI.logout();
// Token is removed from localStorage
```

### Check Authentication Status

```javascript
if (TokenManager.isAuthenticated()) {
    console.log('User is logged in');
} else {
    console.log('User is not logged in');
}
```

## Creating Content (Requires Authentication)

### Create News

```javascript
try {
    const news = await NewsAPI.create({
        title: 'Breaking News',
        content: 'This is the news content...',
        image_url: 'https://example.com/image.jpg',
        published_date: '2025-10-18'
    });
    
    console.log('News created:', news);
} catch (error) {
    console.error('Failed to create news:', error.message);
}
```

### Create Event

```javascript
try {
    const event = await EventsAPI.create({
        title: 'Tech Conference 2025',
        description: 'Annual technology conference...',
        date: '2025-12-15',
        location: 'San Francisco, CA',
        capacity: 500
    });
    
    console.log('Event created:', event);
} catch (error) {
    console.error('Failed to create event:', error.message);
}
```

### Create Conference

```javascript
try {
    const conference = await ConferencesAPI.create({
        title: 'Global IP Summit',
        description: 'International intellectual property conference...',
        date_range: 'March 10-12, 2025',
        location: 'Geneva, Switzerland',
        summary: 'Three days of keynotes and workshops...'
    });
    
    console.log('Conference created:', conference);
} catch (error) {
    console.error('Failed to create conference:', error.message);
}
```

## Updating Content (Requires Authentication)

### Update News

```javascript
try {
    const updatedNews = await NewsAPI.update(1, {
        title: 'Updated Title',
        content: 'Updated content...'
    });
    
    console.log('News updated:', updatedNews);
} catch (error) {
    console.error('Failed to update news:', error.message);
}
```

### Update Event

```javascript
try {
    const updatedEvent = await EventsAPI.update(1, {
        capacity: 600
    });
    
    console.log('Event updated:', updatedEvent);
} catch (error) {
    console.error('Failed to update event:', error.message);
}
```

## Deleting Content (Requires Authentication)

### Delete News

```javascript
try {
    await NewsAPI.delete(1);
    console.log('News deleted successfully');
} catch (error) {
    console.error('Failed to delete news:', error.message);
}
```

### Delete Event

```javascript
try {
    await EventsAPI.delete(1);
    console.log('Event deleted successfully');
} catch (error) {
    console.error('Failed to delete event:', error.message);
}
```

## Error Handling

All API calls return promises and should be wrapped in try-catch blocks:

```javascript
try {
    const data = await NewsAPI.getAll();
    // Handle success
} catch (error) {
    // Error object contains:
    // - status: HTTP status code (or 0 for network errors)
    // - message: Error message
    // - data: Additional error data from API
    
    if (error.status === 401) {
        console.log('Unauthorized - please login');
    } else if (error.status === 403) {
        console.log('Forbidden - insufficient permissions');
    } else if (error.status === 0) {
        console.log('Network error - check connection');
    } else {
        console.log('Error:', error.message);
    }
}
```

## Manual Rendering

If you need to manually trigger rendering (e.g., after creating new content):

```javascript
// Render all sections
await initDataRendering();

// Or render individual sections
await NewsRenderer.render();
await EventsRenderer.render();
await ConferencesRenderer.render();
```

## Token Management

### Get Current Token

```javascript
const token = TokenManager.getToken();
console.log('Current token:', token);
```

### Set Token Manually

```javascript
TokenManager.setToken('your_jwt_token_here');
```

### Remove Token

```javascript
TokenManager.removeToken();
```

## Testing

Open `frontend/test-api.html` in your browser to test the API integration:

1. Start the backend server: `cd backend && npm start`
2. Open `frontend/test-api.html` in a browser
3. Click the test buttons to verify each API endpoint

## Troubleshooting

### Data Not Loading

1. **Check Backend Status**
   - Ensure backend is running on `http://localhost:3000`
   - Check browser console for errors

2. **Check CORS Configuration**
   - Backend should allow requests from your frontend domain
   - Check `FRONTEND_URL` in backend `.env` file

3. **Check Network Tab**
   - Open browser DevTools → Network tab
   - Look for failed API requests
   - Check request/response details

### Authentication Issues

1. **Token Not Saved**
   - Check browser console for errors
   - Verify localStorage is enabled in browser
   - Check if login response contains token

2. **401 Unauthorized**
   - Token may be expired (1 hour expiration)
   - Login again to get new token

3. **403 Forbidden**
   - User doesn't have required permissions
   - Check user role and permissions in database

### Rendering Issues

1. **Empty Sections**
   - Check if API returns data
   - Look for errors in browser console
   - Verify database has seed data

2. **Slider Not Working**
   - Ensure `initSlider` function is defined
   - Check if slider reinitialization is called
   - Verify DOM elements exist

## Best Practices

1. **Always Handle Errors**
   ```javascript
   try {
       const data = await NewsAPI.getAll();
   } catch (error) {
       // Handle error appropriately
   }
   ```

2. **Check Authentication Before Protected Operations**
   ```javascript
   if (TokenManager.isAuthenticated()) {
       await NewsAPI.create(newsData);
   } else {
       alert('Please login first');
   }
   ```

3. **Validate Data Before Sending**
   ```javascript
   if (!title || !content) {
       alert('Title and content are required');
       return;
   }
   await NewsAPI.create({ title, content, ... });
   ```

4. **Provide User Feedback**
   ```javascript
   try {
       showLoading();
       const data = await NewsAPI.getAll();
       renderData(data);
   } catch (error) {
       showError(error.message);
   }
   ```

## API Endpoints Reference

### Public Endpoints (No Authentication Required)

- `GET /api/news` - Get all news
- `GET /api/events` - Get all events
- `GET /api/conferences` - Get all conferences

### Authentication Endpoints

- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user

### Protected Endpoints (Authentication Required)

- `POST /api/news` - Create news (requires `write:news` permission)
- `PUT /api/news/:id` - Update news (requires ownership or `edit:news` permission)
- `DELETE /api/news/:id` - Delete news (requires `delete:news` permission)
- `POST /api/events` - Create event (requires appropriate permission)
- `PUT /api/events/:id` - Update event (requires appropriate permission)
- `DELETE /api/events/:id` - Delete event (requires appropriate permission)
- `POST /api/conferences` - Create conference (requires appropriate permission)
- `PUT /api/conferences/:id` - Update conference (requires appropriate permission)
- `DELETE /api/conferences/:id` - Delete conference (requires appropriate permission)

## Support

For issues or questions:
1. Check browser console for errors
2. Review backend logs
3. Verify database connection
4. Check API endpoint documentation in `backend/docs/`
