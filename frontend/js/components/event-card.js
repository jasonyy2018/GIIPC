/**
 * Event Card Component
 * Reusable component for displaying event information with date badge
 */

/**
 * EventCard Class
 * Creates a visually appealing event card with circular date badge
 */
export class EventCard {
    /**
     * @param {Object} eventData - Event data object
     * @param {number} eventData.id - Event ID
     * @param {string} eventData.title - Event title
     * @param {string} eventData.description - Event description
     * @param {string} eventData.start_date - Event start date (ISO 8601 format)
     * @param {string} eventData.location - Event location
     */
    constructor(eventData) {
        this.id = eventData.id;
        this.title = eventData.title;
        this.description = eventData.description;
        this.startDate = new Date(eventData.start_date);
        this.location = eventData.location;
    }

    /**
     * Format date to extract year and month/day
     * @returns {Object} { year: string, monthDay: string }
     */
    formatDate() {
        const year = this.startDate.getFullYear();
        
        // Get month abbreviation
        const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 
                           'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        const month = monthNames[this.startDate.getMonth()];
        
        // Get day with leading zero if needed
        const day = this.startDate.getDate();
        
        return {
            year: year.toString(),
            monthDay: `${month}.${day}`
        };
    }

    /**
     * Truncate description to specified length
     * @param {number} maxLength - Maximum length of description
     * @returns {string} Truncated description
     */
    truncateDescription(maxLength = 120) {
        if (!this.description) return '';
        if (this.description.length <= maxLength) return this.description;
        return this.description.substring(0, maxLength).trim() + '...';
    }

    /**
     * Render the event card HTML
     * @returns {string} HTML string for the event card
     */
    render() {
        const { year, monthDay } = this.formatDate();
        const truncatedDescription = this.truncateDescription();

        return `
            <div class="event-card" data-event-id="${this.id}">
                <div class="event-date-badge">
                    <span class="badge-year">${year}</span>
                    <span class="badge-date">${monthDay}</span>
                </div>
                <div class="event-content">
                    <h3 class="event-title">${this.escapeHtml(this.title)}</h3>
                    <p class="event-description">${this.escapeHtml(truncatedDescription)}</p>
                </div>
                <button class="event-action-btn" aria-label="View ${this.escapeHtml(this.title)} details">
                    <span>→</span>
                </button>
            </div>
        `;
    }

    /**
     * Escape HTML to prevent XSS attacks
     * @param {string} text - Text to escape
     * @returns {string} Escaped text
     */
    escapeHtml(text) {
        if (!text) return '';
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    /**
     * Attach event listeners to the card
     * @param {HTMLElement} cardElement - The card DOM element
     * @param {Function} onClick - Click handler function
     */
    attachEventListeners(cardElement, onClick) {
        if (!cardElement) return;

        const button = cardElement.querySelector('.event-action-btn');
        if (button && onClick) {
            button.addEventListener('click', (e) => {
                e.preventDefault();
                onClick(this.id);
            });
        }

        // Make entire card clickable
        cardElement.style.cursor = 'pointer';
        cardElement.addEventListener('click', (e) => {
            // Don't trigger if clicking the button directly (it has its own handler)
            if (!e.target.closest('.event-action-btn') && onClick) {
                onClick(this.id);
            }
        });

        // Add keyboard accessibility
        cardElement.setAttribute('tabindex', '0');
        cardElement.setAttribute('role', 'article');
        cardElement.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                if (onClick) onClick(this.id);
            }
        });
    }
}

/**
 * Helper function to create and render multiple event cards
 * @param {Array} events - Array of event data objects
 * @param {HTMLElement} container - Container element to render cards into
 * @param {Function} onClick - Click handler function
 */
export function renderEventCards(events, container, onClick) {
    if (!container) {
        console.error('Container element not found');
        return;
    }

    if (!events || events.length === 0) {
        container.innerHTML = `
            <div class="col-span-full text-center py-12">
                <i class="fas fa-calendar-times text-6xl text-gray-400 mb-4"></i>
                <h3 class="text-xl font-semibold text-gray-700 mb-2">No Upcoming Events</h3>
                <p class="text-gray-600">Check back soon for new events and opportunities</p>
            </div>
        `;
        return;
    }

    // Render all event cards
    container.innerHTML = events
        .map(event => new EventCard(event).render())
        .join('');

    // Attach event listeners to all cards
    const cardElements = container.querySelectorAll('.event-card');
    cardElements.forEach((cardElement, index) => {
        const eventCard = new EventCard(events[index]);
        eventCard.attachEventListeners(cardElement, onClick);
    });
}

/**
 * Handle event card click with authentication check
 * @param {number} eventId - Event ID
 * @param {Object} authManager - Authentication manager instance
 */
export function handleEventCardClick(eventId, authManager) {
    // Check if user is authenticated
    if (authManager && authManager.isAuthenticated()) {
        // User is authenticated, navigate to event detail page
        window.location.href = `event-detail.html?id=${eventId}`;
    } else {
        // User is not authenticated, store intended destination and show login modal
        sessionStorage.setItem('intendedDestination', `event-detail.html?id=${eventId}`);
        
        if (authManager) {
            authManager.showLoginModal();
        } else {
            // Fallback if authManager is not available
            console.error('AuthManager not available');
            window.location.href = `event-detail.html?id=${eventId}`;
        }
    }
}
