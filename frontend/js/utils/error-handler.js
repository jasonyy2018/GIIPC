/**
 * Error Handler Utility Module
 * Provides centralized error handling, display, and retry functionality
 */

/**
 * Error types for categorization
 */
export const ErrorType = {
    NETWORK: 'NETWORK',
    API: 'API',
    VALIDATION: 'VALIDATION',
    AUTH: 'AUTH',
    NOT_FOUND: 'NOT_FOUND',
    UNKNOWN: 'UNKNOWN'
};

/**
 * Categorize error based on error object
 * @param {Error} error - Error object
 * @returns {string} Error type
 */
export function categorizeError(error) {
    if (!error) return ErrorType.UNKNOWN;
    
    // Network errors
    if (error.message?.includes('fetch') || 
        error.message?.includes('network') ||
        error.message?.includes('Failed to fetch')) {
        return ErrorType.NETWORK;
    }
    
    // Authentication errors
    if (error.status === 401 || error.status === 403) {
        return ErrorType.AUTH;
    }
    
    // Not found errors
    if (error.status === 404 || error.message?.includes('not found')) {
        return ErrorType.NOT_FOUND;
    }
    
    // API errors
    if (error.status >= 400 && error.status < 600) {
        return ErrorType.API;
    }
    
    // Validation errors
    if (error.message?.includes('validation') || 
        error.message?.includes('invalid')) {
        return ErrorType.VALIDATION;
    }
    
    return ErrorType.UNKNOWN;
}

/**
 * Get user-friendly error message based on error type
 * @param {Error} error - Error object
 * @param {string} context - Context where error occurred (e.g., 'loading events')
 * @returns {string} User-friendly error message
 */
export function getUserFriendlyMessage(error, context = 'performing this action') {
    const errorType = categorizeError(error);
    
    switch (errorType) {
        case ErrorType.NETWORK:
            return `Unable to connect to the server. Please check your internet connection and try again.`;
        
        case ErrorType.AUTH:
            return `You need to be logged in to ${context}. Please log in and try again.`;
        
        case ErrorType.NOT_FOUND:
            return `The requested resource was not found. It may have been removed or is no longer available.`;
        
        case ErrorType.API:
            return error.message || `An error occurred while ${context}. Please try again later.`;
        
        case ErrorType.VALIDATION:
            return error.message || `The information provided is invalid. Please check your input and try again.`;
        
        case ErrorType.UNKNOWN:
        default:
            return `An unexpected error occurred while ${context}. Please try again later.`;
    }
}

/**
 * ErrorHandler Class
 * Provides methods for displaying errors with retry functionality
 */
export class ErrorHandler {
    /**
     * Display error in a container with optional retry button
     * @param {HTMLElement} container - Container element to display error
     * @param {Error} error - Error object
     * @param {Object} options - Display options
     * @param {string} options.title - Error title (default: based on error type)
     * @param {string} options.context - Context for error message
     * @param {boolean} options.showRetry - Show retry button (default: true)
     * @param {Function} options.onRetry - Retry callback function
     * @param {string} options.icon - Font Awesome icon class (default: based on error type)
     */
    static showError(container, error, options = {}) {
        if (!container) {
            console.error('Error container not provided');
            return;
        }
        
        const errorType = categorizeError(error);
        const message = getUserFriendlyMessage(error, options.context);
        
        // Default options
        const defaults = {
            title: this.getDefaultTitle(errorType),
            showRetry: true,
            icon: this.getDefaultIcon(errorType)
        };
        
        const config = { ...defaults, ...options };
        
        const errorHTML = `
            <div class="error-message bg-red-50 border border-red-200 rounded-lg p-6 text-center max-w-2xl mx-auto">
                <i class="${config.icon} text-4xl text-red-500 mb-3"></i>
                <h3 class="text-lg font-semibold text-red-800 mb-2">
                    ${this.escapeHtml(config.title)}
                </h3>
                <p class="text-red-700 mb-4">${this.escapeHtml(message)}</p>
                ${config.showRetry && config.onRetry ? `
                    <button class="error-retry-btn bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded transition-colors">
                        <i class="fas fa-redo mr-2"></i>Try Again
                    </button>
                ` : ''}
            </div>
        `;
        
        container.innerHTML = errorHTML;
        
        // Attach retry handler if provided
        if (config.showRetry && config.onRetry) {
            const retryBtn = container.querySelector('.error-retry-btn');
            if (retryBtn) {
                retryBtn.addEventListener('click', () => {
                    config.onRetry();
                });
            }
        }
    }
    
    /**
     * Display inline error message (for forms)
     * @param {HTMLElement} container - Container element
     * @param {string} message - Error message
     */
    static showInlineError(container, message) {
        if (!container) return;
        
        const errorHTML = `
            <div class="inline-error bg-red-50 border-l-4 border-red-500 p-4 mb-4">
                <div class="flex items-center">
                    <i class="fas fa-exclamation-circle text-red-500 mr-3"></i>
                    <p class="text-sm text-red-700">${this.escapeHtml(message)}</p>
                </div>
            </div>
        `;
        
        container.innerHTML = errorHTML;
    }
    
    /**
     * Display success message
     * @param {HTMLElement} container - Container element
     * @param {string} message - Success message
     * @param {Object} options - Display options
     */
    static showSuccess(container, message, options = {}) {
        if (!container) return;
        
        const config = {
            title: 'Success',
            icon: 'fas fa-check-circle',
            ...options
        };
        
        const successHTML = `
            <div class="success-message bg-green-50 border border-green-200 rounded-lg p-6 text-center max-w-2xl mx-auto">
                <i class="${config.icon} text-4xl text-green-500 mb-3"></i>
                <h3 class="text-lg font-semibold text-green-800 mb-2">
                    ${this.escapeHtml(config.title)}
                </h3>
                <p class="text-green-700">${this.escapeHtml(message)}</p>
            </div>
        `;
        
        container.innerHTML = successHTML;
    }
    
    /**
     * Get default title based on error type
     * @param {string} errorType - Error type
     * @returns {string} Default title
     */
    static getDefaultTitle(errorType) {
        switch (errorType) {
            case ErrorType.NETWORK:
                return 'Connection Error';
            case ErrorType.AUTH:
                return 'Authentication Required';
            case ErrorType.NOT_FOUND:
                return 'Not Found';
            case ErrorType.API:
                return 'Server Error';
            case ErrorType.VALIDATION:
                return 'Invalid Input';
            default:
                return 'Error';
        }
    }
    
    /**
     * Get default icon based on error type
     * @param {string} errorType - Error type
     * @returns {string} Font Awesome icon class
     */
    static getDefaultIcon(errorType) {
        switch (errorType) {
            case ErrorType.NETWORK:
                return 'fas fa-wifi-slash';
            case ErrorType.AUTH:
                return 'fas fa-lock';
            case ErrorType.NOT_FOUND:
                return 'fas fa-search';
            case ErrorType.API:
                return 'fas fa-server';
            case ErrorType.VALIDATION:
                return 'fas fa-exclamation-triangle';
            default:
                return 'fas fa-exclamation-circle';
        }
    }
    
    /**
     * Escape HTML to prevent XSS attacks
     * @param {string} text - Text to escape
     * @returns {string} Escaped text
     */
    static escapeHtml(text) {
        if (!text) return '';
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }
}

/**
 * LoadingState Class
 * Provides methods for displaying loading states
 */
export class LoadingState {
    /**
     * Show loading spinner in container
     * @param {HTMLElement} container - Container element
     * @param {Object} options - Display options
     * @param {string} options.message - Loading message
     * @param {string} options.size - Spinner size (small, medium, large)
     */
    static show(container, options = {}) {
        if (!container) return;
        
        const config = {
            message: 'Loading...',
            size: 'medium',
            ...options
        };
        
        const sizeClasses = {
            small: 'text-2xl',
            medium: 'text-4xl',
            large: 'text-6xl'
        };
        
        const loadingHTML = `
            <div class="loading-state text-center py-12">
                <i class="fas fa-spinner fa-spin ${sizeClasses[config.size]} text-primary mb-4"></i>
                <p class="text-text">${ErrorHandler.escapeHtml(config.message)}</p>
            </div>
        `;
        
        container.innerHTML = loadingHTML;
    }
    
    /**
     * Show inline loading spinner (for buttons)
     * @param {HTMLElement} button - Button element
     * @param {string} originalText - Original button text
     */
    static showButtonLoading(button, originalText = 'Loading...') {
        if (!button) return;
        
        button.disabled = true;
        button.dataset.originalText = button.innerHTML;
        button.innerHTML = `<i class="fas fa-spinner fa-spin mr-2"></i>${originalText}`;
    }
    
    /**
     * Hide button loading state
     * @param {HTMLElement} button - Button element
     */
    static hideButtonLoading(button) {
        if (!button) return;
        
        button.disabled = false;
        if (button.dataset.originalText) {
            button.innerHTML = button.dataset.originalText;
            delete button.dataset.originalText;
        }
    }
}

/**
 * EmptyState Class
 * Provides methods for displaying empty states
 */
export class EmptyState {
    /**
     * Show empty state in container
     * @param {HTMLElement} container - Container element
     * @param {Object} options - Display options
     * @param {string} options.icon - Font Awesome icon class
     * @param {string} options.title - Empty state title
     * @param {string} options.message - Empty state message
     * @param {string} options.actionText - Action button text (optional)
     * @param {Function} options.onAction - Action button callback (optional)
     */
    static show(container, options = {}) {
        if (!container) return;
        
        const config = {
            icon: 'fas fa-inbox',
            title: 'No Items Found',
            message: 'There are no items to display at this time.',
            ...options
        };
        
        const emptyHTML = `
            <div class="empty-state text-center py-12">
                <i class="${config.icon} text-6xl text-gray-400 mb-4"></i>
                <h3 class="text-xl font-semibold text-gray-700 mb-2">
                    ${ErrorHandler.escapeHtml(config.title)}
                </h3>
                <p class="text-gray-600 mb-4">${ErrorHandler.escapeHtml(config.message)}</p>
                ${config.actionText && config.onAction ? `
                    <button class="empty-action-btn bg-primary hover:bg-primary-dark text-white px-6 py-2 rounded transition-colors">
                        ${ErrorHandler.escapeHtml(config.actionText)}
                    </button>
                ` : ''}
            </div>
        `;
        
        container.innerHTML = emptyHTML;
        
        // Attach action handler if provided
        if (config.actionText && config.onAction) {
            const actionBtn = container.querySelector('.empty-action-btn');
            if (actionBtn) {
                actionBtn.addEventListener('click', () => {
                    config.onAction();
                });
            }
        }
    }
}

/**
 * Toast notification utility
 */
export class Toast {
    /**
     * Show toast notification
     * @param {string} message - Toast message
     * @param {Object} options - Toast options
     * @param {string} options.type - Toast type (success, error, warning, info)
     * @param {number} options.duration - Duration in milliseconds (default: 3000)
     */
    static show(message, options = {}) {
        const config = {
            type: 'info',
            duration: 3000,
            ...options
        };
        
        const typeStyles = {
            success: 'bg-green-500',
            error: 'bg-red-500',
            warning: 'bg-yellow-500',
            info: 'bg-blue-500'
        };
        
        const typeIcons = {
            success: 'fa-check-circle',
            error: 'fa-exclamation-circle',
            warning: 'fa-exclamation-triangle',
            info: 'fa-info-circle'
        };
        
        // Create toast element
        const toast = document.createElement('div');
        toast.className = `fixed bottom-8 right-8 ${typeStyles[config.type]} text-white px-6 py-4 rounded-lg shadow-lg flex items-center gap-3 z-[9999] animate-slide-up`;
        toast.innerHTML = `
            <i class="fas ${typeIcons[config.type]}"></i>
            <span>${ErrorHandler.escapeHtml(message)}</span>
        `;
        
        // Add animation styles
        const style = document.createElement('style');
        style.textContent = `
            @keyframes slide-up {
                from {
                    transform: translateY(100%);
                    opacity: 0;
                }
                to {
                    transform: translateY(0);
                    opacity: 1;
                }
            }
            .animate-slide-up {
                animation: slide-up 0.3s ease-out;
            }
        `;
        document.head.appendChild(style);
        
        // Add to DOM
        document.body.appendChild(toast);
        
        // Remove after duration
        setTimeout(() => {
            toast.style.opacity = '0';
            toast.style.transform = 'translateY(100%)';
            toast.style.transition = 'all 0.3s ease-out';
            
            setTimeout(() => {
                document.body.removeChild(toast);
                document.head.removeChild(style);
            }, 300);
        }, config.duration);
    }
}
