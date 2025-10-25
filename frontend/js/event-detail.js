/**
 * Event Detail Page Module
 * Handles event detail page functionality including loading event data,
 * authentication checks, and registration form submission
 */

import { EventsAPI, ApiClient } from './api-client.js';
import { authManager } from './auth.js';
import { ErrorHandler, LoadingState, Toast } from './utils/error-handler.js';

class EventDetailPage {
    constructor() {
        this.eventId = this.getEventIdFromURL();
        this.event = null;
        this.relatedEvents = [];
    }

    /**
     * Initialize the event detail page
     */
    async init() {
        if (!this.eventId) {
            this.showError(new Error('Invalid event ID. Please check the URL and try again.'));
            return;
        }

        await this.loadEventDetails();
        this.checkAuthAndShowForm();
        this.attachEventListeners();
    }

    /**
     * Get event ID from URL query parameter
     * @returns {string|null} Event ID or null
     */
    getEventIdFromURL() {
        const params = new URLSearchParams(window.location.search);
        return params.get('id');
    }

    /**
     * Load event details from API
     */
    async loadEventDetails() {
        try {
            // Show loading state
            this.showLoadingState();
            
            const response = await EventsAPI.getById(this.eventId);
            
            if (response.success && response.data) {
                this.event = response.data;
                this.renderEventDetails();
                await this.loadRelatedEvents();
            } else {
                throw new Error(response.error?.message || 'Event not found');
            }
        } catch (error) {
            console.error('Failed to load event:', error);
            this.showError(error);
        }
    }

    /**
     * Render event details on the page
     */
    renderEventDetails() {
        if (!this.event) return;

        // Format dates
        const startDate = new Date(this.event.start_date);
        const endDate = new Date(this.event.end_date);
        
        const { year, monthDay } = this.formatDateBadge(startDate);
        const formattedDate = this.formatFullDate(startDate);
        const formattedTime = this.formatTimeRange(startDate, endDate);

        // Update page title
        document.title = `${this.event.title} - GIIP`;
        document.getElementById('page-title').textContent = `${this.event.title} - GIIP`;

        // Update hero section
        document.getElementById('hero-year').textContent = year;
        document.getElementById('hero-date').textContent = monthDay;
        document.getElementById('event-title').textContent = this.event.title;
        document.getElementById('event-time').innerHTML = `<i class="far fa-clock mr-2"></i>${formattedTime}`;
        document.getElementById('event-location').innerHTML = `<i class="fas fa-map-marker-alt mr-2"></i>${this.event.location || 'TBA'}`;

        // Update main content
        document.getElementById('event-description').innerHTML = this.formatDescription(this.event.description);

        // Update sidebar
        document.getElementById('sidebar-date').textContent = formattedDate;
        document.getElementById('sidebar-time').textContent = formattedTime;
        document.getElementById('sidebar-location').textContent = this.event.location || 'To be announced';
        document.getElementById('sidebar-capacity').textContent = this.event.capacity ? `${this.event.capacity} attendees` : 'Unlimited';
    }

    /**
     * Format date for badge display
     * @param {Date} date - Date object
     * @returns {Object} { year, monthDay }
     */
    formatDateBadge(date) {
        const year = date.getFullYear();
        const month = date.toLocaleDateString('en-US', { month: 'short' });
        const day = date.getDate();
        
        return {
            year: year.toString(),
            monthDay: `${month}.${day}`
        };
    }

    /**
     * Format full date string
     * @param {Date} date - Date object
     * @returns {string} Formatted date
     */
    formatFullDate(date) {
        return date.toLocaleDateString('en-US', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    }

    /**
     * Format time range
     * @param {Date} startDate - Start date
     * @param {Date} endDate - End date
     * @returns {string} Formatted time range
     */
    formatTimeRange(startDate, endDate) {
        const startTime = startDate.toLocaleTimeString('en-US', {
            hour: 'numeric',
            minute: '2-digit',
            hour12: true
        });
        
        const endTime = endDate.toLocaleTimeString('en-US', {
            hour: 'numeric',
            minute: '2-digit',
            hour12: true
        });
        
        return `${startTime} - ${endTime}`;
    }

    /**
     * Format description with paragraphs
     * @param {string} description - Event description
     * @returns {string} Formatted HTML
     */
    formatDescription(description) {
        if (!description) return '<p>No description available.</p>';
        
        // Split by newlines and wrap in paragraphs
        const paragraphs = description.split('\n').filter(p => p.trim());
        return paragraphs.map(p => `<p class="mb-4">${p}</p>`).join('');
    }

    /**
     * Check authentication status and show appropriate form
     */
    checkAuthAndShowForm() {
        const registrationSection = document.getElementById('registration-section');
        const authRequired = document.getElementById('auth-required');

        if (authManager.isAuthenticated()) {
            registrationSection.classList.remove('hidden');
            authRequired.classList.add('hidden');
            this.prefillUserData();
        } else {
            registrationSection.classList.add('hidden');
            authRequired.classList.remove('hidden');
        }
    }

    /**
     * Pre-fill registration form with user data
     */
    prefillUserData() {
        const user = authManager.getUser();
        if (!user) return;

        const nameInput = document.getElementById('reg-name');
        const emailInput = document.getElementById('reg-email');

        if (nameInput) nameInput.value = user.full_name || user.email;
        if (emailInput) emailInput.value = user.email;
    }

    /**
     * Attach event listeners
     */
    attachEventListeners() {
        // Registration form submission
        const registrationForm = document.getElementById('registration-form');
        if (registrationForm) {
            registrationForm.addEventListener('submit', (e) => this.handleRegistration(e));
        }

        // Auth required buttons - show login/register modals
        const showLoginBtn = document.getElementById('show-login');
        const showRegisterBtn = document.getElementById('show-register');

        if (showLoginBtn) {
            showLoginBtn.addEventListener('click', () => {
                // Store intended destination for post-login redirect
                sessionStorage.setItem('intendedDestination', window.location.href);
                authManager.showLoginModal();
            });
        }

        if (showRegisterBtn) {
            showRegisterBtn.addEventListener('click', () => {
                // Store intended destination for post-registration/login redirect
                sessionStorage.setItem('intendedDestination', window.location.href);
                authManager.showRegisterModal();
            });
        }
    }

    /**
     * Handle registration form submission
     * @param {Event} e - Form submit event
     */
    async handleRegistration(e) {
        e.preventDefault();

        const form = e.target;
        const submitBtn = form.querySelector('button[type="submit"]');
        const successDiv = document.getElementById('registration-success');
        const errorDiv = document.getElementById('registration-error');

        // Hide previous messages
        if (successDiv) successDiv.classList.add('hidden');
        if (errorDiv) errorDiv.classList.add('hidden');

        // Get form data
        const organization = document.getElementById('reg-organization').value.trim();
        const notes = document.getElementById('reg-notes').value.trim();

        // Show button loading state
        LoadingState.showButtonLoading(submitBtn, 'Submitting...');

        try {
            // Submit registration
            const response = await ApiClient.post(`/events/${this.eventId}/register`, {
                organization,
                notes
            });

            if (response.success) {
                // Show success message
                if (successDiv) {
                    successDiv.classList.remove('hidden');
                    successDiv.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
                }
                
                // Show success toast
                Toast.show('Registration submitted successfully!', { type: 'success' });
                
                // Reset form and re-fill readonly fields
                form.reset();
                this.prefillUserData();
            } else {
                throw new Error(response.error?.message || 'Registration failed');
            }
        } catch (error) {
            console.error('Registration error:', error);
            
            // Show error message
            if (errorDiv) {
                const errorMessage = document.getElementById('registration-error-message');
                if (errorMessage) {
                    ErrorHandler.showInlineError(errorDiv, error.message || 'Failed to submit registration. Please try again.');
                }
                errorDiv.classList.remove('hidden');
                errorDiv.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
            }
            
            // Show error toast
            Toast.show(error.message || 'Registration failed', { type: 'error' });
        } finally {
            // Hide button loading state
            LoadingState.hideButtonLoading(submitBtn);
        }
    }

    /**
     * Load related events
     */
    async loadRelatedEvents() {
        try {
            const response = await EventsAPI.getActive({ limit: 3 });
            
            if (response.success && response.data) {
                // Filter out current event and get only future events
                this.relatedEvents = response.data
                    .filter(event => {
                        const eventDate = new Date(event.start_date);
                        const now = new Date();
                        return event.id !== parseInt(this.eventId) && eventDate > now;
                    })
                    .slice(0, 3);
                
                this.renderRelatedEvents();
            }
        } catch (error) {
            console.error('Failed to load related events:', error);
            // Don't show error for related events, just hide the section
            document.querySelector('#related-events').parentElement.style.display = 'none';
        }
    }

    /**
     * Render related events in sidebar
     */
    renderRelatedEvents() {
        const container = document.getElementById('related-events');
        if (!container) return;

        if (this.relatedEvents.length === 0) {
            container.innerHTML = '<p class="text-gray-500 text-sm">No related events available</p>';
            return;
        }

        container.innerHTML = this.relatedEvents.map(event => {
            const startDate = new Date(event.start_date);
            const { year, monthDay } = this.formatDateBadge(startDate);
            
            return `
                <a href="event-detail.html?id=${event.id}" class="block p-4 border border-gray-200 rounded-lg hover:border-primary hover:shadow-md transition-all">
                    <div class="flex items-start gap-3">
                        <div class="flex-shrink-0 w-12 h-12 rounded-full bg-gradient-to-br from-orange-400 to-orange-600 flex flex-col items-center justify-center text-white text-xs font-semibold">
                            <span class="text-[10px]">${year}</span>
                            <span class="text-sm">${monthDay}</span>
                        </div>
                        <div class="flex-1 min-w-0">
                            <h4 class="text-sm font-semibold text-dark-gray mb-1 line-clamp-2">${event.title}</h4>
                            <p class="text-xs text-gray-500">
                                <i class="fas fa-map-marker-alt mr-1"></i>${event.location || 'TBA'}
                            </p>
                        </div>
                    </div>
                </a>
            `;
        }).join('');
    }

    /**
     * Show loading state while event details are being fetched
     */
    showLoadingState() {
        const mainContent = document.getElementById('main-content');
        if (!mainContent) return;

        mainContent.innerHTML = `
            <section class="py-20 bg-gray-50">
                <div class="container mx-auto px-6 max-w-[1200px]">
                    <div id="loading-container"></div>
                </div>
            </section>
        `;
        
        const loadingContainer = document.getElementById('loading-container');
        if (loadingContainer) {
            LoadingState.show(loadingContainer, {
                message: 'Loading event details...',
                size: 'large'
            });
        }
    }

    /**
     * Show error message
     * @param {Error} error - Error object
     */
    showError(error) {
        const mainContent = document.getElementById('main-content');
        if (!mainContent) return;

        mainContent.innerHTML = `
            <section class="py-20 bg-gray-50">
                <div class="container mx-auto px-6 max-w-[1200px]">
                    <div class="bg-white rounded-lg shadow-md p-12">
                        <div id="error-container"></div>
                        <div class="text-center mt-6">
                            <a href="events.html" class="inline-block bg-primary hover:bg-primary-dark text-white px-6 py-3 rounded transition">
                                View All Events
                            </a>
                        </div>
                    </div>
                </div>
            </section>
        `;
        
        const errorContainer = document.getElementById('error-container');
        if (errorContainer) {
            ErrorHandler.showError(errorContainer, error, {
                context: 'loading event details',
                showRetry: true,
                onRetry: () => {
                    this.loadEventDetails();
                }
            });
        }
    }
}

// Initialize event detail page when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    const eventDetailPage = new EventDetailPage();
    eventDetailPage.init();
});

// Export for use in other modules
export { EventDetailPage };
