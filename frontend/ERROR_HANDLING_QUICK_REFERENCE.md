# Error Handling Quick Reference

## Import Statement

```javascript
import { ErrorHandler, LoadingState, EmptyState, Toast } from './utils/error-handler.js';
```

## Common Patterns

### 1. Show Error with Retry
```javascript
ErrorHandler.showError(container, error, {
    context: 'loading events',
    showRetry: true,
    onRetry: () => loadData()
});
```

### 2. Show Loading
```javascript
LoadingState.show(container, {
    message: 'Loading...',
    size: 'medium' // 'small', 'medium', 'large'
});
```

### 3. Show Empty State
```javascript
EmptyState.show(container, {
    icon: 'fas fa-inbox',
    title: 'No Items',
    message: 'No items to display'
});
```

### 4. Show Success Toast
```javascript
Toast.show('Success!', { type: 'success' });
```

### 5. Show Error Toast
```javascript
Toast.show('Error occurred', { type: 'error' });
```

### 6. Button Loading
```javascript
LoadingState.showButtonLoading(button, 'Processing...');
// Later...
LoadingState.hideButtonLoading(button);
```

### 7. Inline Form Error
```javascript
ErrorHandler.showInlineError(container, 'Invalid input');
```

## Error Types

- `NETWORK` - Connection issues
- `API` - Server errors
- `AUTH` - Authentication required
- `NOT_FOUND` - Resource not found
- `VALIDATION` - Invalid input
- `UNKNOWN` - Other errors

## Toast Types

- `success` - Green, checkmark icon
- `error` - Red, exclamation icon
- `warning` - Yellow, warning icon
- `info` - Blue, info icon

## Test Page

Open `test-error-handling.html` to test all scenarios interactively.
