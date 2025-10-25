/**
 * Data Renderer Module
 * Handles fetching and rendering data from API
 */

import { NewsAPI, EventsAPI, ConferencesAPI } from './api-client.js';
import {
    formatDate,
    formatDateTime,
    formatDateRange,
    formatEventBadge,
    utcToLocal,
    computeStatus
} from './timezone-utils.js';

/**
 * Show loading state
 * @param {HTMLElement} container - Container element
 * @param {string} message - Optional loading message
 */
function showLoading(container, message = 'Loading...') {
    container.innerHTML = `
        <div class="flex flex-col justify-center items-center py-20">
            <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-accent mb-4"></div>
            <p class="text-gray-600 text-sm">${message}</p>
        </div>
    `;
}

/**
 * Show error message with retry option
 * @param {HTMLElement} container - Container element
 * @param {string} message - Error message
 * @param {Function} retryCallback - Optional callback for retry button
 */
function showError(container, message, retryCallback = null) {
    const retryButton = retryCallback
        ? `<button onclick="this.disabled=true; this.textContent='Retrying...'; (${retryCallback.toString()})();" 
                   class="mt-3 px-4 py-2 bg-accent text-white rounded-lg hover:bg-opacity-90 transition-all">
               <i class="fas fa-redo mr-2"></i>Retry
           </button>`
        : '';

    container.innerHTML = `
        <div class="bg-red-50 border border-red-200 text-red-700 px-6 py-4 rounded-lg text-center max-w-md mx-auto">
            <i class="fas fa-exclamation-circle text-2xl mb-2"></i>
            <p class="font-medium mb-1">Error Loading Data</p>
            <p class="text-sm">${message}</p>
            ${retryButton}
        </div>
    `;
}

/**
 * Show empty state message
 * @param {HTMLElement} container - Container element
 * @param {string} icon - FontAwesome icon class
 * @param {string} message - Empty state message
 */
function showEmptyState(container, icon, message) {
    container.innerHTML = `
        <div class="text-center py-10 text-gray-500">
            <i class="${icon} text-4xl mb-3"></i>
            <p>${message}</p>
        </div>
    `;
}

/**
 * News Renderer
 */
const NewsRenderer = {
    /**
     * Render news card HTML
     * @param {Object} news - News object
     * @returns {string} HTML string
     */
    renderCard(news) {
        const formattedDate = formatDate(news.published_date);
        const imageUrl = news.image_url || 'https://images.unsplash.com/photo-1553877522-43269d4ea984?w=800&h=600&fit=crop';

        return `
            <article class="news-card bg-white rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 group"
                role="listitem">
                <div class="news-img h-[220px] overflow-hidden relative cursor-pointer" onclick="window.location.href='#news-detail-${news.id}'">
                    <img src="${imageUrl}" alt="${news.title}" loading="eager"
                        class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110">
                </div>
                <div class="news-content p-6">
                    <span class="news-date text-gray-500 text-sm font-medium mb-3 block">
                        ${formattedDate}
                    </span>
                    <h3 class="text-lg font-bold text-gray-900 mb-4 leading-tight line-clamp-2 cursor-pointer" onclick="window.location.href='#news-detail-${news.id}'">
                        ${news.title}
                    </h3>
                    <a href="#news-detail-${news.id}" class="inline-flex items-center text-gray-600 hover:text-[#1B4D89] font-medium text-sm transition-colors" onclick="event.stopPropagation();">
                        Learn More <i class="fas fa-arrow-right ml-2"></i>
                    </a>
                    <div class="mt-4 pt-4 border-t-2 border-gradient-to-r from-[#FF8C42] to-[#1B4D89]"></div>
                </div>
            </article>
        `;
    },

    /**
     * Fetch and render all news
     */
    async render() {
        const slider = document.querySelector('.news-slider');
        if (!slider) return;

        try {
            // Show loading state
            showLoading(slider, 'Loading news...');

            // Fetch news data
            const response = await NewsAPI.getAll();
            const newsData = response.data || [];

            // Check if we have data
            if (!newsData || newsData.length === 0) {
                showEmptyState(slider, 'fas fa-newspaper', 'No news available at the moment.');
                return;
            }

            // Pre-compute all formatted dates to avoid flicker
            const newsWithDates = newsData.map(news => ({
                ...news,
                formattedDate: formatDate(news.published_date)
            }));

            // Render news cards using DocumentFragment for no flicker
            const fragment = document.createDocumentFragment();
            const tempDiv = document.createElement('div');
            tempDiv.innerHTML = newsWithDates.map(news => this.renderCardWithPrecomputedDate(news)).join('');

            // Move all children to fragment
            while (tempDiv.firstChild) {
                fragment.appendChild(tempDiv.firstChild);
            }

            // Single DOM update
            slider.innerHTML = '';
            slider.appendChild(fragment);

            // Reinitialize slider if function exists
            if (typeof initSlider === 'function') {
                // Wait for DOM update
                setTimeout(() => {
                    initSlider('.news-slider', '.news-indicators');
                }, 100);
            }

        } catch (error) {
            console.error('Error loading news:', error);
            const errorMessage = error.code === 'NETWORK_ERROR'
                ? 'Unable to connect to the server. Please check your internet connection.'
                : (error.message || 'Failed to load news. Please try again later.');
            showError(slider, errorMessage, () => NewsRenderer.render());
        }
    },

    /**
     * Render news card HTML with pre-computed date (prevents flicker)
     * @param {Object} news - News object with formattedDate already computed
     * @returns {string} HTML string
     */
    renderCardWithPrecomputedDate(news) {
        const formattedDate = news.formattedDate || 'TBD';
        const imageUrl = news.image_url || 'https://images.unsplash.com/photo-1553877522-43269d4ea984?w=800&h=600&fit=crop';

        return `
            <article class="news-card bg-white rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 group"
                role="listitem">
                <div class="news-img h-[220px] overflow-hidden relative cursor-pointer" onclick="window.location.href='#news-detail-${news.id}'">
                    <img src="${imageUrl}" alt="${news.title}" loading="eager"
                        class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110">
                </div>
                <div class="news-content p-6">
                    <span class="news-date text-gray-500 text-sm font-medium mb-3 block">
                        ${formattedDate}
                    </span>
                    <h3 class="text-lg font-bold text-gray-900 mb-4 leading-tight line-clamp-2 cursor-pointer" onclick="window.location.href='#news-detail-${news.id}'">
                        ${news.title}
                    </h3>
                    <a href="#news-detail-${news.id}" class="inline-flex items-center text-gray-600 hover:text-[#1B4D89] font-medium text-sm transition-colors" onclick="event.stopPropagation();">
                        Learn More <i class="fas fa-arrow-right ml-2"></i>
                    </a>
                    <div class="mt-4 pt-4 border-t-2 border-gradient-to-r from-[#FF8C42] to-[#1B4D89]"></div>
                </div>
            </article>
        `;
    }
};

/**
 * Events Renderer
 */
const EventsRenderer = {
    /**
     * Render event item HTML
     * @param {Object} event - Event object
     * @returns {string} HTML string
     */
    renderItem(event) {
        // Use new start_date and end_date fields, fallback to old date field for compatibility
        const startDateString = event.start_date || event.date;
        const endDateString = event.end_date;

        if (!startDateString) {
            return ''; // Skip items without dates
        }

        // Use timezone utilities for consistent date handling
        const startDate = utcToLocal(startDateString);
        if (!startDate) return '';

        const badge = formatEventBadge(startDateString);
        const dateStr = `${badge.month}.${badge.day < 10 ? '0' + badge.day : badge.day}`;

        // Format date range for display (automatically converts UTC to local)
        const dateRangeDisplay = formatDateRange(startDateString, endDateString);

        // Determine if event is active using timezone utility
        const status = computeStatus(endDateString);
        const isActive = status === 'active';
        const statusBadge = isActive
            ? '<span class="inline-block px-2 py-1 text-xs font-semibold text-green-700 bg-green-100 rounded-full">Active</span>'
            : '<span class="inline-block px-2 py-1 text-xs font-semibold text-gray-700 bg-gray-100 rounded-full">Past</span>';

        return `
            <article class="event-item bg-white rounded-lg shadow-md hover:shadow-xl transition-all duration-300 flex items-center justify-between p-6 border-l-4 border-[#FF8C42]"
                role="listitem">
                <div class="flex items-center gap-6 flex-1">
                    <div class="event-date-badge flex-shrink-0">
                        <div class="w-16 h-16 rounded-full bg-[#FF8C42] flex items-center justify-center">
                            <div class="text-center">
                                <div class="text-white font-bold text-sm">${dateStr}</div>
                                <div class="text-white text-xs">${badge.year}</div>
                            </div>
                        </div>
                    </div>
                    <div class="flex-1">
                        <div class="flex items-center gap-2 mb-2">
                            <h3 class="text-lg font-semibold text-gray-900">
                                ${event.title}
                            </h3>
                            ${statusBadge}
                        </div>
                        <p class="text-gray-500 text-sm mb-2">
                            <i class="far fa-calendar mr-1"></i>
                            ${dateRangeDisplay}
                        </p>
                        <p class="text-gray-600 text-sm">
                            ${event.description.substring(0, 100)}${event.description.length > 100 ? '...' : ''}
                        </p>
                    </div>
                </div>
                <a href="#event-${event.id}" class="ml-4 w-12 h-12 bg-[#1B4D89] text-white rounded-lg flex items-center justify-center hover:bg-[#FF8C42] transition-all flex-shrink-0"
                    aria-label="View event details">
                    <i class="fas fa-arrow-right"></i>
                </a>
            </article>
        `;
    },

    /**
     * Fetch and render active events and conferences
     */
    async render() {
        const container = document.querySelector('.events-list');
        if (!container) return;

        try {
            // Show loading state
            showLoading(container, 'Loading upcoming events...');

            // Fetch both active events and conferences in parallel
            const [eventsResponse, conferencesResponse] = await Promise.all([
                EventsAPI.getActive(),
                ConferencesAPI.getActive()
            ]);

            const eventsData = eventsResponse.data || [];
            const conferencesData = conferencesResponse.data || [];

            // Merge both arrays, filtering out items without valid dates
            const allActiveItems = [...eventsData, ...conferencesData].filter(item => {
                // Ensure item has at least a start_date or date field
                return item.start_date || item.date;
            });

            // Sort by start_date ascending (earliest first)
            allActiveItems.sort((a, b) => {
                const dateA = new Date(a.start_date || a.date);
                const dateB = new Date(b.start_date || b.date);
                return dateA - dateB;
            });

            // Check if we have data
            if (allActiveItems.length === 0) {
                showEmptyState(container, 'fas fa-calendar-alt', 'No upcoming events at the moment.');
                return;
            }

            // Pre-compute all date strings and badges to avoid flicker
            const itemsWithPrecomputedData = allActiveItems.map(item => {
                const startDateString = item.start_date || item.date;
                const endDateString = item.end_date;

                if (!startDateString) return null;

                const startDate = utcToLocal(startDateString);
                if (!startDate) return null;

                const badge = formatEventBadge(startDateString);
                const dateRangeDisplay = formatDateRange(startDateString, endDateString);
                const status = computeStatus(endDateString);

                return {
                    ...item,
                    badge,
                    dateRangeDisplay,
                    status
                };
            }).filter(item => item !== null);

            // Render event items using DocumentFragment for no flicker
            const fragment = document.createDocumentFragment();
            const tempDiv = document.createElement('div');
            tempDiv.innerHTML = itemsWithPrecomputedData.map(item => this.renderItemWithPrecomputedData(item)).join('');

            // Move all children to fragment
            while (tempDiv.firstChild) {
                fragment.appendChild(tempDiv.firstChild);
            }

            // Single DOM update
            container.innerHTML = '';
            container.appendChild(fragment);

        } catch (error) {
            console.error('Error loading events:', error);
            const errorMessage = error.code === 'NETWORK_ERROR'
                ? 'Unable to connect to the server. Please check your internet connection.'
                : (error.message || 'Failed to load events. Please try again later.');
            showError(container, errorMessage, () => EventsRenderer.render());
        }
    },

    /**
     * Render event item HTML with pre-computed data (prevents flicker)
     * @param {Object} event - Event object with badge, dateRangeDisplay, and status already computed
     * @returns {string} HTML string
     */
    renderItemWithPrecomputedData(event) {
        const dateStr = `${event.badge.month}.${event.badge.day < 10 ? '0' + event.badge.day : event.badge.day}`;
        const isActive = event.status === 'active';
        const statusBadge = isActive
            ? '<span class="inline-block px-2 py-1 text-xs font-semibold text-green-700 bg-green-100 rounded-full">Active</span>'
            : '<span class="inline-block px-2 py-1 text-xs font-semibold text-gray-700 bg-gray-100 rounded-full">Past</span>';

        return `
            <article class="event-item bg-white rounded-lg shadow-md hover:shadow-xl transition-all duration-300 flex items-center justify-between p-6 border-l-4 border-[#FF8C42]"
                role="listitem">
                <div class="flex items-center gap-6 flex-1">
                    <div class="event-date-badge flex-shrink-0">
                        <div class="w-16 h-16 rounded-full bg-[#FF8C42] flex items-center justify-center">
                            <div class="text-center">
                                <div class="text-white font-bold text-sm">${dateStr}</div>
                                <div class="text-white text-xs">${event.badge.year}</div>
                            </div>
                        </div>
                    </div>
                    <div class="flex-1">
                        <div class="flex items-center gap-2 mb-2">
                            <h3 class="text-lg font-semibold text-gray-900">
                                ${event.title}
                            </h3>
                            ${statusBadge}
                        </div>
                        <p class="text-gray-500 text-sm mb-2">
                            <i class="far fa-calendar mr-1"></i>
                            ${event.dateRangeDisplay}
                        </p>
                        <p class="text-gray-600 text-sm">
                            ${event.description.substring(0, 100)}${event.description.length > 100 ? '...' : ''}
                        </p>
                    </div>
                </div>
                <a href="#event-${event.id}" class="ml-4 w-12 h-12 bg-[#1B4D89] text-white rounded-lg flex items-center justify-center hover:bg-[#FF8C42] transition-all flex-shrink-0"
                    aria-label="View event details">
                    <i class="fas fa-arrow-right"></i>
                </a>
            </article>
        `;
    }
};

/**
 * Conferences Renderer
 */
const ConferencesRenderer = {
    /**
     * Render conference card HTML (News-style grid layout)
     * @param {Object} conference - Conference object
     * @returns {string} HTML string
     */
    renderCard(conference) {
        const imageUrl = conference.image_url || 'https://images.unsplash.com/photo-1517245386807-6c03e2ca1dba?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80';

        // Use new start_date and end_date fields with timezone utilities, fallback to old date_range field for compatibility
        const dateRangeDisplay = (conference.start_date && conference.end_date)
            ? formatDateRange(conference.start_date, conference.end_date)
            : (conference.date_range || 'Date TBD');

        // Truncate title if too long
        const truncatedTitle = conference.title.length > 60
            ? conference.title.substring(0, 60) + '...'
            : conference.title;

        return `
            <article class="conference-card bg-white rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 group"
                role="listitem">
                <div class="conference-img h-[220px] overflow-hidden relative cursor-pointer" onclick="window.location.href='#conference-detail-${conference.id}'">
                    <img src="${imageUrl}" alt="${conference.title}" 
                        class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" 
                        onerror="this.src='https://images.unsplash.com/photo-1517245386807-6c03e2ca1dba?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80'">
                </div>
                <div class="conference-content p-6">
                    <span class="conference-date text-gray-500 text-sm font-medium mb-3 block">
                        ${dateRangeDisplay}
                    </span>
                    <h3 class="text-lg font-bold text-gray-900 mb-4 leading-tight line-clamp-2 cursor-pointer" onclick="window.location.href='#conference-detail-${conference.id}'">
                        ${truncatedTitle}
                    </h3>
                    <a href="#conference-detail-${conference.id}" class="inline-flex items-center text-gray-600 hover:text-[#1B4D89] font-medium text-sm transition-colors" onclick="event.stopPropagation();">
                        Learn More <i class="fas fa-arrow-right ml-2"></i>
                    </a>
                    <div class="mt-4 pt-4 border-t-2 border-gradient-to-r from-[#FF8C42] to-[#1B4D89]"></div>
                </div>
            </article>
        `;
    },

    /**
     * Fetch and render past events and conferences
     */
    async render() {
        const container = document.querySelector('.conferences-slider');
        if (!container) return;

        try {
            // Don't show loading if container already has content (prevents flicker on re-render)
            const hasContent = container.children.length > 0 && !container.querySelector('.animate-spin');
            if (!hasContent) {
                showLoading(container, 'Loading past conferences...');
            }

            // Fetch both past events and conferences in parallel
            const [eventsResponse, conferencesResponse] = await Promise.all([
                EventsAPI.getPast(),
                ConferencesAPI.getPast()
            ]);

            const eventsData = eventsResponse.data || [];
            const conferencesData = conferencesResponse.data || [];

            // Merge both arrays, filtering out items without valid dates
            const allPastItems = [...eventsData, ...conferencesData].filter(item => {
                // Ensure item has at least an end_date or date field
                return item.end_date || item.date || item.start_date;
            });

            // Sort by end_date descending (most recent first)
            allPastItems.sort((a, b) => {
                const dateA = new Date(a.end_date || a.date);
                const dateB = new Date(b.end_date || b.date);
                return dateB - dateA;
            });

            // Check if we have data
            if (allPastItems.length === 0) {
                showEmptyState(container, 'fas fa-users', 'No past conferences available.');
                return;
            }

            // Pre-compute all date strings to avoid flicker during rendering
            const cardsData = allPastItems.map(item => {
                const dateRangeDisplay = (item.start_date && item.end_date)
                    ? formatDateRange(item.start_date, item.end_date)
                    : (item.date_range || 'Date TBD');

                return {
                    ...item,
                    dateRangeDisplay
                };
            });

            // Render conference cards using pre-computed data
            // Use DocumentFragment for better performance and no flicker
            const fragment = document.createDocumentFragment();
            const tempDiv = document.createElement('div');
            tempDiv.innerHTML = cardsData.map(item => this.renderCardWithPrecomputedDate(item)).join('');

            // Move all children to fragment
            while (tempDiv.firstChild) {
                fragment.appendChild(tempDiv.firstChild);
            }

            // Single DOM update - replace all content at once
            container.innerHTML = '';
            container.appendChild(fragment);

        } catch (error) {
            console.error('Error loading conferences:', error);
            const errorMessage = error.code === 'NETWORK_ERROR'
                ? 'Unable to connect to the server. Please check your internet connection.'
                : (error.message || 'Failed to load conferences. Please try again later.');
            showError(container, errorMessage, () => ConferencesRenderer.render());
        }
    },

    /**
     * Render conference card HTML with pre-computed date (prevents flicker)
     * @param {Object} conference - Conference object with dateRangeDisplay already computed
     * @returns {string} HTML string
     */
    renderCardWithPrecomputedDate(conference) {
        // Use conference image_url directly, with simple fallback
        const imageUrl = conference.image_url || 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&h=600&fit=crop';

        // Use pre-computed date range display
        const dateRangeDisplay = conference.dateRangeDisplay || 'Date TBD';

        // Truncate title if too long
        const truncatedTitle = conference.title.length > 60
            ? conference.title.substring(0, 60) + '...'
            : conference.title;

        return `
            <article class="conference-card bg-white rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 group"
                role="listitem">
                <div class="conference-img h-[220px] overflow-hidden relative cursor-pointer" onclick="window.location.href='#conference-detail-${conference.id}'">
                    <img src="${imageUrl}" alt="${conference.title}" loading="eager"
                        class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110">
                </div>
                <div class="conference-content p-6">
                    <span class="conference-date text-gray-500 text-sm font-medium mb-3 block">
                        ${dateRangeDisplay}
                    </span>
                    <h3 class="text-lg font-bold text-gray-900 mb-4 leading-tight line-clamp-2 cursor-pointer" onclick="window.location.href='#conference-detail-${conference.id}'">
                        ${truncatedTitle}
                    </h3>
                    <a href="#conference-detail-${conference.id}" class="inline-flex items-center text-gray-600 hover:text-[#1B4D89] font-medium text-sm transition-colors" onclick="event.stopPropagation();">
                        Learn More <i class="fas fa-arrow-right ml-2"></i>
                    </a>
                    <div class="mt-4 pt-4 border-t-2 border-gradient-to-r from-[#FF8C42] to-[#1B4D89]"></div>
                </div>
            </article>
        `;
    }
};

/**
 * Initialize all data rendering
 */
async function initDataRendering() {
    try {
        // Render all sections in parallel
        await Promise.all([
            NewsRenderer.render(),
            EventsRenderer.render(),
            ConferencesRenderer.render()
        ]);
    } catch (error) {
        console.error('Error initializing data rendering:', error);
    }
}

// Auto-initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initDataRendering);
} else {
    initDataRendering();
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        NewsRenderer,
        EventsRenderer,
        ConferencesRenderer,
        initDataRendering
    };
}
