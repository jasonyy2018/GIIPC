/**
 * Events Page Module
 * Handles the events page with waterfall layout, filtering, and sorting
 */

import { EventsAPI } from './api-client.js';
import { EventCard, handleEventCardClick } from './components/event-card.js';
import { authManager } from './auth.js';
import { ErrorHandler } from './utils/error-handler.js';

/**
 * EventsPage Class
 * Manages the events page functionality
 */
class EventsPage {
    constructor() {
        this.container = document.getElementById('events-waterfall');
        this.loadingState = document.getElementById('loading-state');
        this.emptyState = document.getElementById('empty-state');
        this.errorState = document.getElementById('error-state');
        this.sortSelect = document.getElementById('sort-select');
        this.eventCount = document.getElementById('event-count');
        this.events = [];
        this.filteredEvents = [];
    }

    /**
     * Initialize the events page
     */
    async init() {
        this.attachEventListeners();
        await this.loadAllEvents();
    }

    /**
     * Attach event listeners
     */
    attachEventListeners() {
        if (this.sortSelect) {
            this.sortSelect.addEventListener('change', () => {
                this.sortEvents();
                this.renderEvents();
            });
        }
    }

    /**
     * Load all upcoming events from API
     */
    async loadAllEvents() {
        try {
            this.showLoading();
            
            const response = await EventsAPI.getActive({
                limit: 100
            });

            if (response.success && response.data) {
                // Filter to only future events
                const now = new Date();
                this.events = response.data.filter(event => 
                    new Date(event.start_date) > now
                );
                
                this.filteredEvents = [...this.events];
                this.sortEvents();
                this.renderEvents();
            } else {
                throw new Error(response.error?.message || 'Failed to load events');
            }
        } catch (error) {
            console.error('Failed to load events:', error);
            this.showError(error);
        }
    }

    /**
     * Sort events based on selected option
     */
    sortEvents() {
        const sortValue = this.sortSelect ? this.sortSelect.value : 'date-asc';

        switch (sortValue) {
            case 'date-asc':
                this.filteredEvents.sort((a, b) => 
                    new Date(a.start_date) - new Date(b.start_date)
                );
                break;
            case 'date-desc':
                this.filteredEvents.sort((a, b) => 
                    new Date(b.start_date) - new Date(a.start_date)
                );
                break;
            case 'title-asc':
                this.filteredEvents.sort((a, b) => 
                    a.title.localeCompare(b.title)
                );
                break;
            default:
                // Default to date ascending
                this.filteredEvents.sort((a, b) => 
                    new Date(a.start_date) - new Date(b.start_date)
                );
        }
    }

    /**
     * Render events in waterfall layout
     */
    renderEvents() {
        this.hideLoading();
        this.hideError();

        if (this.filteredEvents.length === 0) {
            this.showEmpty();
            return;
        }

        this.hideEmpty();

        // Update event count
        if (this.eventCount) {
            this.eventCount.textContent = this.filteredEvents.length;
        }

        // Render event cards
        this.container.innerHTML = this.filteredEvents
            .map(event => new EventCard(event).render())
            .join('');

        // Attach event listeners
        this.attachCardListeners();

        // Calculate masonry spans after rendering
        // Use requestAnimationFrame to ensure DOM is updated
        requestAnimationFrame(() => {
            this.calculateMasonrySpans();
        });
    }

    /**
     * Attach click listeners to event cards
     */
    attachCardListeners() {
        const cardElements = this.container.querySelectorAll('.event-card');
        cardElements.forEach((cardElement, index) => {
            const eventCard = new EventCard(this.filteredEvents[index]);
            eventCard.attachEventListeners(cardElement, (eventId) => {
                this.handleEventClick(eventId);
            });
        });
    }

    /**
     * Handle event card click with authentication check
     * @param {number} eventId - Event ID
     */
    handleEventClick(eventId) {
        // Use the authentication-aware click handler
        handleEventCardClick(eventId, authManager);
    }

    /**
     * Calculate grid row spans for masonry layout
     * This creates the waterfall effect by calculating how many grid rows each card should span
     */
    calculateMasonrySpans() {
        const cards = this.container.querySelectorAll('.event-card');
        
        cards.forEach(card => {
            // Get the actual height of the card
            const height = card.offsetHeight;
            
            // Calculate how many 20px rows this card needs
            // Add 1 to account for gap
            const rowSpan = Math.ceil(height / 20) + 1;
            
            // Set the CSS custom property
            card.style.setProperty('--row-span', rowSpan);
        });
    }

    /**
     * Show loading state
     */
    showLoading() {
        if (this.loadingState) {
            this.loadingState.classList.remove('hidden');
        }
        if (this.container) {
            this.container.classList.add('hidden');
        }
        if (this.emptyState) {
            this.emptyState.classList.add('hidden');
        }
        if (this.errorState) {
            this.errorState.classList.add('hidden');
        }
    }

    /**
     * Hide loading state
     */
    hideLoading() {
        if (this.loadingState) {
            this.loadingState.classList.add('hidden');
        }
        if (this.container) {
            this.container.classList.remove('hidden');
        }
    }

    /**
     * Show empty state
     */
    showEmpty() {
        if (this.emptyState) {
            this.emptyState.classList.remove('hidden');
        }
        if (this.container) {
            this.container.classList.add('hidden');
        }
        if (this.eventCount) {
            this.eventCount.textContent = '0';
        }
    }

    /**
     * Hide empty state
     */
    hideEmpty() {
        if (this.emptyState) {
            this.emptyState.classList.add('hidden');
        }
    }

    /**
     * Show error state
     * @param {Error} error - Error object
     */
    showError(error) {
        this.hideLoading();
        
        if (this.errorState) {
            ErrorHandler.showError(this.errorState, error, {
                context: 'loading events',
                showRetry: true,
                onRetry: () => this.loadAllEvents()
            });
            
            this.errorState.classList.remove('hidden');
        }
        
        if (this.container) {
            this.container.classList.add('hidden');
        }
        if (this.emptyState) {
            this.emptyState.classList.add('hidden');
        }
    }

    /**
     * Hide error state
     */
    hideError() {
        if (this.errorState) {
            this.errorState.classList.add('hidden');
        }
    }
}

/**
 * Initialize events page on DOM load
 */
document.addEventListener('DOMContentLoaded', () => {
    const eventsPage = new EventsPage();
    eventsPage.init();
});

// Export for testing or external use
export { EventsPage };
