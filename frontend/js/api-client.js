/**
 * API Client Module
 * Handles all API requests with JWT token management, retry logic, and error handling
 */

const API_BASE_URL = window.location.hostname === 'localhost' 
    ? 'http://localhost:3000/api' 
    : '/api';

const TOKEN_KEY = 'authToken';

// Configuration for retry logic
const RETRY_CONFIG = {
    maxRetries: 2,
    retryDelay: 1000, // 1 second
    retryableStatuses: [408, 429, 500, 502, 503, 504], // Request Timeout, Too Many Requests, Server Errors
    retryableErrors: ['NetworkError', 'TimeoutError']
};

/**
 * Token Management
 */
const TokenManager = {
    /**
     * Get JWT token from localStorage
     * @returns {string|null} JWT token or null
     */
    getToken() {
        return localStorage.getItem(TOKEN_KEY);
    },

    /**
     * Save JWT token to localStorage
     * @param {string} token - JWT token
     */
    setToken(token) {
        localStorage.setItem(TOKEN_KEY, token);
    },

    /**
     * Remove JWT token from localStorage
     */
    removeToken() {
        localStorage.removeItem(TOKEN_KEY);
    },

    /**
     * Check if user is authenticated
     * @returns {boolean}
     */
    isAuthenticated() {
        return !!this.getToken();
    }
};

/**
 * API Client
 */
const ApiClient = {
    /**
     * Sleep utility for retry delays
     * @param {number} ms - Milliseconds to sleep
     * @returns {Promise<void>}
     */
    sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    },

    /**
     * Check if error is retryable
     * @param {Object} error - Error object
     * @returns {boolean}
     */
    isRetryableError(error) {
        if (!error.status) {
            // Network errors are retryable
            return true;
        }
        return RETRY_CONFIG.retryableStatuses.includes(error.status);
    },

    /**
     * Make HTTP request with automatic token injection and retry logic
     * @param {string} endpoint - API endpoint (e.g., '/news')
     * @param {Object} options - Fetch options
     * @param {number} retryCount - Current retry attempt (internal use)
     * @returns {Promise<Object>} Response data
     */
    async request(endpoint, options = {}, retryCount = 0) {
        const url = `${API_BASE_URL}${endpoint}`;
        
        // Default headers
        const headers = {
            'Content-Type': 'application/json',
            ...options.headers
        };

        // Add Authorization header if token exists
        const token = TokenManager.getToken();
        if (token) {
            headers['Authorization'] = `Bearer ${token}`;
        }

        // Merge options
        const config = {
            ...options,
            headers
        };

        try {
            const response = await fetch(url, config);
            
            // Parse JSON response
            let data;
            try {
                data = await response.json();
            } catch (parseError) {
                // If JSON parsing fails, create a generic error response
                data = {
                    success: false,
                    error: {
                        code: 'PARSE_ERROR',
                        message: 'Failed to parse server response'
                    }
                };
            }

            // Handle HTTP errors
            if (!response.ok) {
                const error = {
                    status: response.status,
                    message: data.error?.message || data.message || 'Request failed',
                    code: data.error?.code || 'REQUEST_FAILED',
                    details: data.error?.details || null,
                    data: data
                };

                // Check if we should retry
                if (this.isRetryableError(error) && retryCount < RETRY_CONFIG.maxRetries) {
                    console.warn(`Request failed (attempt ${retryCount + 1}/${RETRY_CONFIG.maxRetries + 1}), retrying...`);
                    await this.sleep(RETRY_CONFIG.retryDelay * (retryCount + 1)); // Exponential backoff
                    return this.request(endpoint, options, retryCount + 1);
                }

                throw error;
            }

            return data;
        } catch (error) {
            // Handle network errors
            if (error.status) {
                throw error;
            }
            
            // Network error - retry if possible
            if (retryCount < RETRY_CONFIG.maxRetries) {
                console.warn(`Network error (attempt ${retryCount + 1}/${RETRY_CONFIG.maxRetries + 1}), retrying...`);
                await this.sleep(RETRY_CONFIG.retryDelay * (retryCount + 1));
                return this.request(endpoint, options, retryCount + 1);
            }

            throw {
                status: 0,
                message: 'Network error. Please check your connection and try again.',
                code: 'NETWORK_ERROR',
                details: null,
                data: null
            };
        }
    },

    /**
     * GET request
     * @param {string} endpoint - API endpoint
     * @param {Object} options - Additional fetch options
     * @returns {Promise<Object>}
     */
    async get(endpoint, options = {}) {
        return this.request(endpoint, {
            method: 'GET',
            ...options
        });
    },

    /**
     * POST request
     * @param {string} endpoint - API endpoint
     * @param {Object} data - Request body
     * @param {Object} options - Additional fetch options
     * @returns {Promise<Object>}
     */
    async post(endpoint, data, options = {}) {
        return this.request(endpoint, {
            method: 'POST',
            body: JSON.stringify(data),
            ...options
        });
    },

    /**
     * PUT request
     * @param {string} endpoint - API endpoint
     * @param {Object} data - Request body
     * @param {Object} options - Additional fetch options
     * @returns {Promise<Object>}
     */
    async put(endpoint, data, options = {}) {
        return this.request(endpoint, {
            method: 'PUT',
            body: JSON.stringify(data),
            ...options
        });
    },

    /**
     * DELETE request
     * @param {string} endpoint - API endpoint
     * @param {Object} options - Additional fetch options
     * @returns {Promise<Object>}
     */
    async delete(endpoint, options = {}) {
        return this.request(endpoint, {
            method: 'DELETE',
            ...options
        });
    }
};

/**
 * Authentication API
 */
const AuthAPI = {
    /**
     * Register new user
     * @param {Object} credentials - { email, password }
     * @returns {Promise<Object>}
     */
    async register(credentials) {
        const response = await ApiClient.post('/auth/register', credentials);
        return response;
    },

    /**
     * Login user
     * @param {Object} credentials - { email, password }
     * @returns {Promise<Object>}
     */
    async login(credentials) {
        const response = await ApiClient.post('/auth/login', credentials);
        
        // Save token if login successful
        if (response.success && response.token) {
            TokenManager.setToken(response.token);
        }
        
        return response;
    },

    /**
     * Logout user
     */
    logout() {
        TokenManager.removeToken();
    }
};

/**
 * News API
 */
const NewsAPI = {
    /**
     * Get all news
     * @returns {Promise<Object>}
     */
    async getAll() {
        const response = await ApiClient.get('/news');
        return response;
    },

    /**
     * Get single news by ID
     * @param {number} id - News ID
     * @returns {Promise<Object>}
     */
    async getById(id) {
        const response = await ApiClient.get(`/news/${id}`);
        return response;
    },

    /**
     * Create new news (requires authentication)
     * @param {Object} newsData - News data
     * @returns {Promise<Object>}
     */
    async create(newsData) {
        const response = await ApiClient.post('/news', newsData);
        return response;
    },

    /**
     * Update news (requires authentication)
     * @param {number} id - News ID
     * @param {Object} newsData - Updated news data
     * @returns {Promise<Object>}
     */
    async update(id, newsData) {
        const response = await ApiClient.put(`/news/${id}`, newsData);
        return response;
    },

    /**
     * Delete news (requires authentication)
     * @param {number} id - News ID
     * @returns {Promise<Object>}
     */
    async delete(id) {
        const response = await ApiClient.delete(`/news/${id}`);
        return response;
    }
};

/**
 * Events API
 */
const EventsAPI = {
    /**
     * Get all events
     * @param {Object} options - Query options
     * @returns {Promise<Object>}
     */
    async getAll(options = {}) {
        const params = new URLSearchParams(options);
        const queryString = params.toString();
        const endpoint = queryString ? `/events?${queryString}` : '/events';
        const response = await ApiClient.get(endpoint);
        return response;
    },

    /**
     * Get active events (for Events page)
     * @param {Object} options - Query options
     * @returns {Promise<Object>}
     */
    async getActive(options = {}) {
        const params = new URLSearchParams({
            status: 'active',
            sortBy: 'start_date',
            sortOrder: 'asc',
            ...options
        });
        const response = await ApiClient.get(`/events?${params.toString()}`);
        return response;
    },

    /**
     * Get past events (for Past Conferences page)
     * @param {Object} options - Query options
     * @returns {Promise<Object>}
     */
    async getPast(options = {}) {
        const params = new URLSearchParams({
            status: 'past',
            sortBy: 'end_date',
            sortOrder: 'desc',
            ...options
        });
        const response = await ApiClient.get(`/events?${params.toString()}`);
        return response;
    },

    /**
     * Get single event by ID
     * @param {number} id - Event ID
     * @returns {Promise<Object>}
     */
    async getById(id) {
        const response = await ApiClient.get(`/events/${id}`);
        return response;
    },

    /**
     * Create new event (requires authentication)
     * @param {Object} eventData - Event data
     * @returns {Promise<Object>}
     */
    async create(eventData) {
        const response = await ApiClient.post('/events', eventData);
        return response;
    },

    /**
     * Update event (requires authentication)
     * @param {number} id - Event ID
     * @param {Object} eventData - Updated event data
     * @returns {Promise<Object>}
     */
    async update(id, eventData) {
        const response = await ApiClient.put(`/events/${id}`, eventData);
        return response;
    },

    /**
     * Delete event (requires authentication)
     * @param {number} id - Event ID
     * @returns {Promise<Object>}
     */
    async delete(id) {
        const response = await ApiClient.delete(`/events/${id}`);
        return response;
    }
};

/**
 * Conferences API
 */
const ConferencesAPI = {
    /**
     * Get all conferences
     * @param {Object} options - Query options
     * @returns {Promise<Object>}
     */
    async getAll(options = {}) {
        const params = new URLSearchParams(options);
        const queryString = params.toString();
        const endpoint = queryString ? `/conferences?${queryString}` : '/conferences';
        const response = await ApiClient.get(endpoint);
        return response;
    },

    /**
     * Get active conferences (for Events page)
     * @param {Object} options - Query options
     * @returns {Promise<Object>}
     */
    async getActive(options = {}) {
        const params = new URLSearchParams({
            status: 'active',
            sortBy: 'start_date',
            sortOrder: 'asc',
            ...options
        });
        const response = await ApiClient.get(`/conferences?${params.toString()}`);
        return response;
    },

    /**
     * Get past conferences (for Past Conferences page)
     * @param {Object} options - Query options
     * @returns {Promise<Object>}
     */
    async getPast(options = {}) {
        const params = new URLSearchParams({
            status: 'past',
            sortBy: 'end_date',
            sortOrder: 'desc',
            ...options
        });
        const response = await ApiClient.get(`/conferences?${params.toString()}`);
        return response;
    },

    /**
     * Get single conference by ID
     * @param {number} id - Conference ID
     * @returns {Promise<Object>}
     */
    async getById(id) {
        const response = await ApiClient.get(`/conferences/${id}`);
        return response;
    },

    /**
     * Create new conference (requires authentication)
     * @param {Object} conferenceData - Conference data
     * @returns {Promise<Object>}
     */
    async create(conferenceData) {
        const response = await ApiClient.post('/conferences', conferenceData);
        return response;
    },

    /**
     * Update conference (requires authentication)
     * @param {number} id - Conference ID
     * @param {Object} conferenceData - Updated conference data
     * @returns {Promise<Object>}
     */
    async update(id, conferenceData) {
        const response = await ApiClient.put(`/conferences/${id}`, conferenceData);
        return response;
    },

    /**
     * Delete conference (requires authentication)
     * @param {number} id - Conference ID
     * @returns {Promise<Object>}
     */
    async delete(id) {
        const response = await ApiClient.delete(`/conferences/${id}`);
        return response;
    }
};

/**
 * Admin API
 */
const AdminAPI = {
    /**
     * Get all users (admin only)
     * @returns {Promise<Array>}
     */
    async getUsers() {
        const response = await ApiClient.get('/admin/users');
        return response;
    },

    /**
     * Update user role (admin only)
     * @param {number} userId - User ID
     * @param {string} role - New role (admin/editor/user)
     * @returns {Promise<Object>}
     */
    async updateUserRole(userId, role) {
        const response = await ApiClient.put(`/admin/users/${userId}/role`, { role });
        return response;
    }
};

// Export for use in other modules (ES6 modules for browser)
export {
    ApiClient,
    TokenManager,
    AuthAPI,
    NewsAPI,
    EventsAPI,
    ConferencesAPI,
    AdminAPI
};
