# Event Card Component

## Overview

The Event Card component is a reusable UI component for displaying event information with a visually appealing circular date badge, event details, and an action button.

## Files

- `event-card.js` - Main component JavaScript module
- `../css/event-card.css` - Component styles

## Usage

### Basic Usage

```javascript
import { EventCard } from './js/components/event-card.js';

// Create event data
const eventData = {
    id: 1,
    title: "Innovation Workshop",
    description: "Learn about the latest innovation methodologies",
    start_date: "2025-06-13T09:00:00Z",
    location: "Conference Hall A"
};

// Create event card instance
const card = new EventCard(eventData);

// Render the card
const container = document.getElementById('event-container');
container.innerHTML = card.render();

// Attach event listeners
const cardElement = container.querySelector('.event-card');
card.attachEventListeners(cardElement, (eventId) => {
    console.log(`Event ${eventId} clicked`);
    // Navigate to event detail page
    window.location.href = `/event-detail.html?id=${eventId}`;
});
```

### Rendering Multiple Cards

```javascript
import { renderEventCards } from './js/components/event-card.js';

const events = [
    { id: 1, title: "Event 1", description: "...", start_date: "2025-06-13T09:00:00Z" },
    { id: 2, title: "Event 2", description: "...", start_date: "2025-07-20T10:00:00Z" }
];

const container = document.getElementById('events-grid');

renderEventCards(events, container, (eventId) => {
    // Handle click
    window.location.href = `/event-detail.html?id=${eventId}`;
});
```

## Features

- **Circular Date Badge**: Displays year and month/day in a visually distinctive circular badge
- **Responsive Design**: Adapts to mobile, tablet, and desktop screen sizes
- **Hover Effects**: Smooth animations on hover for better user experience
- **Accessibility**: Full keyboard navigation support with ARIA labels
- **XSS Protection**: Automatic HTML escaping for user-generated content
- **Empty State**: Built-in empty state handling when no events are available

## CSS Classes

- `.event-card` - Main card container
- `.event-date-badge` - Circular date badge
- `.badge-year` - Year text in badge
- `.badge-date` - Month/day text in badge
- `.event-content` - Content area with title and description
- `.event-title` - Event title
- `.event-description` - Event description (truncated to 2 lines)
- `.event-action-btn` - Action button (arrow)

## Responsive Breakpoints

- **Mobile** (< 768px): Single column, stacked layout
- **Tablet** (768px - 1023px): Optimized spacing and sizing
- **Desktop** (1024px+): Full-size cards with enhanced spacing
- **Large Desktop** (1280px+): Maximum size with generous spacing

## Accessibility Features

- Keyboard navigation (Tab, Enter, Space)
- ARIA labels for screen readers
- Focus indicators
- High contrast mode support
- Reduced motion support for users with motion sensitivity

## Testing

A test file is available at `frontend/test-event-card.html` to verify the component functionality.

To test:
1. Open `frontend/test-event-card.html` in a browser
2. Verify the date badges display correctly
3. Test hover effects
4. Test click handlers
5. Test responsive behavior by resizing the browser

## Integration

To use this component in your HTML pages:

1. Include the CSS file:
```html
<link rel="stylesheet" href="css/event-card.css">
```

2. Import the component as an ES6 module:
```html
<script type="module">
    import { EventCard, renderEventCards } from './js/components/event-card.js';
    // Your code here
</script>
```

## API Reference

### EventCard Class

#### Constructor
```javascript
new EventCard(eventData)
```

**Parameters:**
- `eventData` (Object): Event data object
  - `id` (number): Event ID
  - `title` (string): Event title
  - `description` (string): Event description
  - `start_date` (string): ISO 8601 date string
  - `location` (string): Event location

#### Methods

##### `formatDate()`
Returns formatted date object with year and month/day.

**Returns:** `{ year: string, monthDay: string }`

##### `render()`
Generates HTML string for the event card.

**Returns:** `string` - HTML markup

##### `attachEventListeners(cardElement, onClick)`
Attaches click and keyboard event listeners to the card.

**Parameters:**
- `cardElement` (HTMLElement): The card DOM element
- `onClick` (Function): Callback function called with event ID

### Helper Functions

#### `renderEventCards(events, container, onClick)`
Renders multiple event cards into a container.

**Parameters:**
- `events` (Array): Array of event data objects
- `container` (HTMLElement): Container element
- `onClick` (Function): Click handler for all cards

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

Requires ES6 module support.
