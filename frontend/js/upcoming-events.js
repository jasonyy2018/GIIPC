/**
 * Upcoming Events Section Module
 * Handles fetching and displaying upcoming events on the homepage
 */

import { EventsAPI } from './api-client.js';
import { EventCard, handleEventCardClick } from './components/event-card.js';
import { authManager } from './auth.js';
import { ErrorHandler, LoadingState, EmptyState } from './utils/error-handler.js';

/**
 * UpcomingEventsSection Class
 * Manages the upcoming events section on the homepage
 */
export class UpcomingEventsSection {
    /**
     * @param {string} containerId - ID of the container element
     * @param {number} maxEvents - Maximum number of events to display (default: 4)
     */
    constructor(containerId = 'upcoming-events-grid', maxEvents = 4) {
        this.container = document.getElementById(containerId);
        this.maxEvents = maxEvents;
        this.events = [];
    }

    /**
     * Initialize the section
     */
    async init() {
        if (!this.container) {
            console.error('Upcoming events container not found');
            return;
        }

        await this.loadEvents();
    }

    /**
     * Load upcoming events from API
     */
    async loadEvents() {
        try {
            this.showLoading();

            // Fetch events with status='active', sorted by start_date ascending, limit to maxEvents
            const response = await EventsAPI.getActive({
                limit: this.maxEvents
            });

            if (response.success && response.data) {
                // Filter to only show future events (start_date > current date)
                const now = new Date();
                const upcomingEvents = response.data.filter(event => {
                    const eventDate = new Date(event.start_date);
                    return eventDate > now;
                });

                // Limit to exactly maxEvents
                this.events = upcomingEvents.slice(0, this.maxEvents);
                this.renderEvents();
            } else {
                throw new Error(response.error?.message || 'Failed to load events');
            }
        } catch (error) {
            console.error('Failed to load upcoming events:', error);
            this.showError(error);
        }
    }

    /**
     * Render events in the container
     */
    renderEvents() {
        if (!this.container) return;

        // Handle empty state
        if (this.events.length === 0) {
            this.showNoEvents();
            return;
        }

        // Render event cards
        this.container.innerHTML = this.events
            .map(event => new EventCard(event).render())
            .join('');

        // Attach event listeners to all cards
        this.attachEventListeners();
    }

    /**
     * Attach event listeners to event cards
     */
    attachEventListeners() {
        const cardElements = this.container.querySelectorAll('.event-card');
        
        cardElements.forEach((cardElement, index) => {
            const event = this.events[index];
            const eventCard = new EventCard(event);
            
            // Attach click handler
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
     * Show loading state
     */
    showLoading() {
        if (!this.container) return;

        // Create a wrapper div for col-span-full
        const wrapper = document.createElement('div');
        wrapper.className = 'col-span-full';
        this.container.innerHTML = '';
        this.container.appendChild(wrapper);
        
        LoadingState.show(wrapper, {
            message: 'Loading upcoming events...',
            size: 'medium'
        });
    }

    /**
     * Show empty state when no upcoming events exist
     */
    showNoEvents() {
        if (!this.container) return;

        // Create a wrapper div for col-span-full
        const wrapper = document.createElement('div');
        wrapper.className = 'col-span-full';
        this.container.innerHTML = '';
        this.container.appendChild(wrapper);
        
        EmptyState.show(wrapper, {
            icon: 'fas fa-calendar-times',
            title: 'No Upcoming Events',
            message: 'Check back soon for new events and opportunities'
        });
    }

    /**
     * Show error state
     * @param {Error} error - Error object
     */
    showError(error) {
        if (!this.container) return;

        // Create a wrapper div for col-span-full
        const wrapper = document.createElement('div');
        wrapper.className = 'col-span-full';
        this.container.innerHTML = '';
        this.container.appendChild(wrapper);
        
        ErrorHandler.showError(wrapper, error, {
            context: 'loading upcoming events',
            showRetry: true,
            onRetry: () => this.loadEvents()
        });
    }
}

/**
 * Initialize upcoming events section on page load
 */
export function initUpcomingEvents() {
    const upcomingEventsSection = new UpcomingEventsSection();
    upcomingEventsSection.init();
}
