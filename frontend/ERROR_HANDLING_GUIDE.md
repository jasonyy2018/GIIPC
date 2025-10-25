# Error Handling and Loading States Guide

## Overview

This guide documents the comprehensive error handling and loading state system implemented for the GIIP upcoming events display feature. The system provides consistent, user-friendly error messages, loading indicators, and retry functionality across all components.

## Components

### 1. Error Handler Utility (`js/utils/error-handler.js`)

A centralized utility module that provides error categorization, user-friendly messaging, and display components.

#### Error Types

```javascript
export const ErrorType = {
    NETWORK: 'NETWORK',        // Connection issues
    API: 'API',                // Server errors
    VALIDATION: 'VALIDATION',  // Input validation errors
    AUTH: 'AUTH',              // Authentication required
    NOT_FOUND: 'NOT_FOUND',    // Resource not found
    UNKNOWN: 'UNKNOWN'         // Uncategorized errors
};
```

#### Key Functions

##### `categorizeError(error)`
Automatically categorizes errors based on error properties and messages.

```javascript
import { categorizeError, ErrorType } from './utils/error-handler.js';

const error = new Error('Failed to fetch');
const type = categorizeError(error); // Returns ErrorType.NETWORK
```

##### `getUserFriendlyMessage(error, context)`
Converts technical errors into user-friendly messages.

```javascript
import { getUserFriendlyMessage } from './utils/error-handler.js';

const error = new Error('Failed to fetch');
const message = getUserFriendlyMessage(error, 'loading events');
// Returns: "Unable to connect to the server. Please check your internet connection and try again."
```

### 2. ErrorHandler Class

Provides methods for displaying errors with retry functionality.

#### `ErrorHandler.showError(container, error, options)`

Display a full error message with optional retry button.

**Parameters:**
- `container` (HTMLElement): Container element to display error
- `error` (Error): Error object
- `options` (Object):
  - `title` (string): Error title (default: based on error type)
  - `context` (string): Context for error message
  - `showRetry` (boolean): Show retry button (default: true)
  - `onRetry` (Function): Retry callback function
  - `icon` (string): Font Awesome icon class

**Example:**
```javascript
import { ErrorHandler } from './utils/error-handler.js';

const container = document.getElementById('events-container');
const error = new Error('Failed to load events');

ErrorHandler.showError(container, error, {
    context: 'loading events',
    showRetry: true,
    onRetry: () => {
        // Retry logic here
        loadEvents();
    }
});
```

#### `ErrorHandler.showInlineError(container, message)`

Display inline error message (useful for forms).

**Example:**
```javascript
const errorContainer = document.getElementById('form-error');
ErrorHandler.showInlineError(errorContainer, 'Please enter a valid email address');
```

#### `ErrorHandler.showSuccess(container, message, options)`

Display success message.

**Example:**
```javascript
ErrorHandler.showSuccess(container, 'Registration submitted successfully!', {
    title: 'Success',
    icon: 'fas fa-check-circle'
});
```

### 3. LoadingState Class

Provides methods for displaying loading states.

#### `LoadingState.show(container, options)`

Display loading spinner in container.

**Parameters:**
- `container` (HTMLElement): Container element
- `options` (Object):
  - `message` (string): Loading message (default: 'Loading...')
  - `size` (string): Spinner size - 'small', 'medium', 'large' (default: 'medium')

**Example:**
```javascript
import { LoadingState } from './utils/error-handler.js';

const container = document.getElementById('events-container');
LoadingState.show(container, {
    message: 'Loading events...',
    size: 'large'
});
```

#### `LoadingState.showButtonLoading(button, originalText)`

Show loading state on a button.

**Example:**
```javascript
const submitBtn = document.getElementById('submit-btn');
LoadingState.showButtonLoading(submitBtn, 'Submitting...');

// Later, hide loading state
LoadingState.hideButtonLoading(submitBtn);
```

### 4. EmptyState Class

Provides methods for displaying empty states.

#### `EmptyState.show(container, options)`

Display empty state with optional action button.

**Parameters:**
- `container` (HTMLElement): Container element
- `options` (Object):
  - `icon` (string): Font Awesome icon class (default: 'fas fa-inbox')
  - `title` (string): Empty state title
  - `message` (string): Empty state message
  - `actionText` (string): Action button text (optional)
  - `onAction` (Function): Action button callback (optional)

**Example:**
```javascript
import { EmptyState } from './utils/error-handler.js';

EmptyState.show(container, {
    icon: 'fas fa-calendar-times',
    title: 'No Upcoming Events',
    message: 'Check back soon for new events and opportunities',
    actionText: 'Refresh',
    onAction: () => {
        loadEvents();
    }
});
```

### 5. Toast Class

Provides toast notification functionality.

#### `Toast.show(message, options)`

Display toast notification.

**Parameters:**
- `message` (string): Toast message
- `options` (Object):
  - `type` (string): Toast type - 'success', 'error', 'warning', 'info' (default: 'info')
  - `duration` (number): Duration in milliseconds (default: 3000)

**Example:**
```javascript
import { Toast } from './utils/error-handler.js';

// Success toast
Toast.show('Registration submitted successfully!', { 
    type: 'success', 
    duration: 3000 
});

// Error toast
Toast.show('Failed to submit registration', { 
    type: 'error', 
    duration: 4000 
});

// Warning toast
Toast.show('Please review your input', { 
    type: 'warning' 
});

// Info toast
Toast.show('Loading data...', { 
    type: 'info' 
});
```

## Implementation Examples

### Example 1: Upcoming Events Section

```javascript
import { ErrorHandler, LoadingState, EmptyState } from './utils/error-handler.js';

class UpcomingEventsSection {
    async loadEvents() {
        try {
            this.showLoading();
            
            const response = await EventsAPI.getActive({ limit: 4 });
            
            if (response.success && response.data) {
                this.events = response.data;
                this.renderEvents();
            } else {
                throw new Error(response.error?.message || 'Failed to load events');
            }
        } catch (error) {
            this.showError(error);
        }
    }
    
    showLoading() {
        LoadingState.show(this.container, {
            message: 'Loading upcoming events...',
            size: 'medium'
        });
    }
    
    showError(error) {
        ErrorHandler.showError(this.container, error, {
            context: 'loading upcoming events',
            showRetry: true,
            onRetry: () => this.loadEvents()
        });
    }
    
    showNoEvents() {
        EmptyState.show(this.container, {
            icon: 'fas fa-calendar-times',
            title: 'No Upcoming Events',
            message: 'Check back soon for new events and opportunities'
        });
    }
}
```

### Example 2: Form Submission with Loading and Error Handling

```javascript
import { ErrorHandler, LoadingState, Toast } from './utils/error-handler.js';

async function handleFormSubmit(e) {
    e.preventDefault();
    
    const submitBtn = e.target.querySelector('button[type="submit"]');
    const errorContainer = document.getElementById('form-error');
    
    // Show button loading state
    LoadingState.showButtonLoading(submitBtn, 'Submitting...');
    
    try {
        const response = await ApiClient.post('/api/register', formData);
        
        if (response.success) {
            // Show success toast
            Toast.show('Registration submitted successfully!', { type: 'success' });
            
            // Reset form
            e.target.reset();
        } else {
            throw new Error(response.error?.message || 'Registration failed');
        }
    } catch (error) {
        // Show inline error
        ErrorHandler.showInlineError(errorContainer, error.message);
        
        // Show error toast
        Toast.show(error.message, { type: 'error' });
    } finally {
        // Hide button loading state
        LoadingState.hideButtonLoading(submitBtn);
    }
}
```

### Example 3: Event Detail Page with Loading State

```javascript
import { ErrorHandler, LoadingState } from './utils/error-handler.js';

class EventDetailPage {
    async loadEventDetails() {
        try {
            this.showLoadingState();
            
            const response = await EventsAPI.getById(this.eventId);
            
            if (response.success && response.data) {
                this.event = response.data;
                this.renderEventDetails();
            } else {
                throw new Error(response.error?.message || 'Event not found');
            }
        } catch (error) {
            this.showError(error);
        }
    }
    
    showLoadingState() {
        const mainContent = document.getElementById('main-content');
        mainContent.innerHTML = `
            <section class="py-20 bg-gray-50">
                <div class="container mx-auto px-6">
                    <div id="loading-container"></div>
                </div>
            </section>
        `;
        
        const loadingContainer = document.getElementById('loading-container');
        LoadingState.show(loadingContainer, {
            message: 'Loading event details...',
            size: 'large'
        });
    }
    
    showError(error) {
        const mainContent = document.getElementById('main-content');
        mainContent.innerHTML = `
            <section class="py-20 bg-gray-50">
                <div class="container mx-auto px-6">
                    <div id="error-container"></div>
                </div>
            </section>
        `;
        
        const errorContainer = document.getElementById('error-container');
        ErrorHandler.showError(errorContainer, error, {
            context: 'loading event details',
            showRetry: true,
            onRetry: () => this.loadEventDetails()
        });
    }
}
```

## Edge Cases Handled

### 1. Network Errors
- **Scenario**: User loses internet connection
- **Handling**: Display network error with retry button
- **Message**: "Unable to connect to the server. Please check your internet connection and try again."

### 2. Invalid Event ID
- **Scenario**: User navigates to event detail page with invalid ID
- **Handling**: Display not found error with link to events page
- **Message**: "The requested resource was not found. It may have been removed or is no longer available."

### 3. No Upcoming Events
- **Scenario**: No future events exist in database
- **Handling**: Display empty state with friendly message
- **Message**: "No Upcoming Events - Check back soon for new events and opportunities"

### 4. API Server Down
- **Scenario**: Backend API is unavailable
- **Handling**: Display API error with retry button
- **Message**: "An error occurred while [context]. Please try again later."

### 5. Authentication Required
- **Scenario**: User tries to access protected resource without login
- **Handling**: Display auth error with login prompt
- **Message**: "You need to be logged in to [context]. Please log in and try again."

### 6. Form Validation Errors
- **Scenario**: User submits invalid form data
- **Handling**: Display inline error below form field
- **Message**: Specific validation error message

## CSS Styling

All error handling components use the `error-handling.css` stylesheet which includes:

- Fade-in animations for smooth appearance
- Responsive design for mobile devices
- Accessibility features (focus states, high contrast support)
- Reduced motion support for users with motion sensitivity
- Print styles to hide error messages when printing

## Testing

A comprehensive test page is available at `test-error-handling.html` which allows testing all error types, loading states, and edge cases.

### Test Scenarios:
1. Network Error
2. Authentication Error
3. Not Found Error
4. API Error
5. Loading State
6. Empty State
7. Success Message
8. Inline Error
9. Toast Notifications (Success, Error, Warning, Info)
10. Button Loading State

## Best Practices

1. **Always provide context**: Use the `context` parameter to make error messages specific to the action being performed.

2. **Enable retry for transient errors**: Network and API errors should include retry functionality.

3. **Use appropriate error types**: Let the system categorize errors automatically for consistent messaging.

4. **Show loading states**: Always display loading indicators during async operations.

5. **Handle empty states gracefully**: Provide helpful messages and optional actions when no data is available.

6. **Use toasts for non-critical feedback**: Toast notifications are great for success confirmations and minor errors.

7. **Escape user input**: The system automatically escapes HTML to prevent XSS attacks.

8. **Test all error scenarios**: Use the test page to verify error handling works correctly.

## Accessibility

The error handling system includes:

- ARIA labels and roles
- Keyboard navigation support
- Screen reader announcements
- High contrast mode support
- Reduced motion support
- Focus management

## Browser Support

- Modern browsers (Chrome, Firefox, Safari, Edge)
- ES6+ JavaScript features
- CSS Grid and Flexbox
- CSS animations (with fallbacks)

## Future Enhancements

Potential improvements for future iterations:

1. Error logging to backend for monitoring
2. Offline mode detection and handling
3. Progressive retry with exponential backoff
4. Error analytics and tracking
5. Customizable error templates
6. Multi-language error messages
7. Error recovery suggestions based on error type
