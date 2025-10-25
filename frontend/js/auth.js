/**
 * Authentication Module
 * Handles user login, registration, and authentication state
 */

import { AuthAPI } from './api-client.js';

class AuthManager {
    constructor() {
        this.token = localStorage.getItem('authToken');
        this.user = JSON.parse(localStorage.getItem('user') || 'null');
        this.init();
    }

    init() {
        // Initialize auth UI
        this.updateAuthUI();
        // Setup event listeners only once
        if (!window._authListenersSetup) {
            this.setupEventListeners();
            window._authListenersSetup = true;
        }
    }

    setupEventListeners() {
        // Use event delegation to avoid duplicate listeners
        const handleClick = (e) => {
            const loginLink = e.target.closest('a[href="#login"]');
            const registerLink = e.target.closest('a[href="#register"]');
            const logoutBtn = e.target.closest('.logout-btn');

            if (loginLink) {
                e.preventDefault();
                this.showLoginModal();
            } else if (registerLink) {
                e.preventDefault();
                this.showRegisterModal();
            } else if (logoutBtn) {
                e.preventDefault();
                this.logout();
            }
        };
        
        document.addEventListener('click', handleClick);
    }

    showLoginModal() {
        const modal = this.createLoginModal();
        document.body.appendChild(modal);
        
        // Show modal with animation
        setTimeout(() => {
            modal.classList.add('active');
        }, 10);

        // Setup form submission
        const form = modal.querySelector('#loginForm');
        form.addEventListener('submit', (e) => this.handleLogin(e, modal));

        // Setup close button
        modal.querySelector('.modal-close').addEventListener('click', () => {
            this.closeModal(modal);
        });

        // Close on overlay click
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                this.closeModal(modal);
            }
        });

        // Switch to register
        modal.querySelector('.switch-to-register').addEventListener('click', (e) => {
            e.preventDefault();
            this.closeModal(modal);
            setTimeout(() => this.showRegisterModal(), 300);
        });
    }

    showRegisterModal() {
        const modal = this.createRegisterModal();
        document.body.appendChild(modal);
        
        // Show modal with animation
        setTimeout(() => {
            modal.classList.add('active');
        }, 10);

        // Setup form submission
        const form = modal.querySelector('#registerForm');
        form.addEventListener('submit', (e) => this.handleRegister(e, modal));

        // Setup close button
        modal.querySelector('.modal-close').addEventListener('click', () => {
            this.closeModal(modal);
        });

        // Close on overlay click
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                this.closeModal(modal);
            }
        });

        // Switch to login
        modal.querySelector('.switch-to-login').addEventListener('click', (e) => {
            e.preventDefault();
            this.closeModal(modal);
            setTimeout(() => this.showLoginModal(), 300);
        });
    }

    createLoginModal() {
        const modal = document.createElement('div');
        modal.className = 'auth-modal';
        modal.innerHTML = `
            <div class="auth-modal-content">
                <button class="modal-close" aria-label="Close modal">&times;</button>
                <h2 class="auth-modal-title">Login to GIIP</h2>
                <p class="auth-modal-subtitle">Welcome back! Please login to your account.</p>
                
                <form id="loginForm" class="auth-form">
                    <div class="form-group">
                        <label for="loginEmail">Email Address</label>
                        <input 
                            type="email" 
                            id="loginEmail" 
                            name="email" 
                            required 
                            placeholder="your.email@giip.info"
                            autocomplete="email"
                        >
                    </div>
                    
                    <div class="form-group">
                        <label for="loginPassword">Password</label>
                        <input 
                            type="password" 
                            id="loginPassword" 
                            name="password" 
                            required 
                            placeholder="Enter your password"
                            autocomplete="current-password"
                            minlength="6"
                        >
                    </div>
                    
                    <div class="form-message"></div>
                    
                    <button type="submit" class="auth-submit-btn">
                        <span class="btn-text">Login</span>
                        <span class="btn-loader" style="display: none;">
                            <i class="fas fa-spinner fa-spin"></i> Logging in...
                        </span>
                    </button>
                </form>
                
                <p class="auth-switch">
                    Don't have an account? 
                    <a href="#" class="switch-to-register">Register here</a>
                </p>
            </div>
        `;
        return modal;
    }

    createRegisterModal() {
        const modal = document.createElement('div');
        modal.className = 'auth-modal';
        modal.innerHTML = `
            <div class="auth-modal-content">
                <button class="modal-close" aria-label="Close modal">&times;</button>
                <h2 class="auth-modal-title">Create Account</h2>
                <p class="auth-modal-subtitle">Join GIIP community today!</p>
                
                <form id="registerForm" class="auth-form">
                    <div class="form-group">
                        <label for="registerFullName">Full Name</label>
                        <input 
                            type="text" 
                            id="registerFullName" 
                            name="fullName" 
                            required 
                            placeholder="Enter your full name"
                            autocomplete="name"
                        >
                    </div>
                    
                    <div class="form-group">
                        <label for="registerEmail">Email Address</label>
                        <input 
                            type="email" 
                            id="registerEmail" 
                            name="email" 
                            required 
                            placeholder="your.email@giip.info"
                            autocomplete="email"
                        >
                    </div>
                    
                    <div class="form-group">
                        <label for="registerPassword">Password</label>
                        <input 
                            type="password" 
                            id="registerPassword" 
                            name="password" 
                            required 
                            placeholder="Create a strong password"
                            autocomplete="new-password"
                            minlength="6"
                        >
                        <small class="form-hint">Minimum 6 characters</small>
                    </div>
                    
                    <div class="form-group">
                        <label for="registerPasswordConfirm">Confirm Password</label>
                        <input 
                            type="password" 
                            id="registerPasswordConfirm" 
                            name="passwordConfirm" 
                            required 
                            placeholder="Re-enter your password"
                            autocomplete="new-password"
                            minlength="6"
                        >
                    </div>
                    
                    <div class="form-message"></div>
                    
                    <button type="submit" class="auth-submit-btn">
                        <span class="btn-text">Create Account</span>
                        <span class="btn-loader" style="display: none;">
                            <i class="fas fa-spinner fa-spin"></i> Creating account...
                        </span>
                    </button>
                </form>
                
                <p class="auth-switch">
                    Already have an account? 
                    <a href="#" class="switch-to-login">Login here</a>
                </p>
            </div>
        `;
        return modal;
    }

    async handleLogin(e, modal) {
        e.preventDefault();
        
        const form = e.target;
        const submitBtn = form.querySelector('.auth-submit-btn');
        const btnText = submitBtn.querySelector('.btn-text');
        const btnLoader = submitBtn.querySelector('.btn-loader');
        const messageDiv = form.querySelector('.form-message');
        
        const email = form.email.value.trim();
        const password = form.password.value;
        
        // Show loading state
        submitBtn.disabled = true;
        btnText.style.display = 'none';
        btnLoader.style.display = 'inline-block';
        messageDiv.textContent = '';
        messageDiv.className = 'form-message';
        
        try {
            const response = await AuthAPI.login({ email, password });
            
            if (response.success) {
                // Store token and user info
                this.token = response.token;
                this.user = response.user;
                localStorage.setItem('authToken', this.token);
                localStorage.setItem('user', JSON.stringify(this.user));
                
                // Show success message
                messageDiv.textContent = 'Login successful! Redirecting...';
                messageDiv.className = 'form-message success';
                
                // Update UI and redirect
                setTimeout(() => {
                    this.closeModal(modal);
                    this.updateAuthUI();
                    
                    // Check for intended destination (from authentication gate)
                    const intendedDestination = sessionStorage.getItem('intendedDestination');
                    if (intendedDestination) {
                        // Clear the stored destination
                        sessionStorage.removeItem('intendedDestination');
                        // Redirect to the intended destination
                        window.location.href = intendedDestination;
                    } else if (this.user.role === 'admin' || this.user.role === 'editor') {
                        // Redirect to admin panel if user is admin or editor
                        window.location.href = '/admin.html';
                    } else {
                        this.showWelcomeMessage();
                    }
                }, 1000);
            } else {
                throw new Error(response.error?.message || 'Login failed');
            }
        } catch (error) {
            console.error('Login error:', error);
            messageDiv.textContent = error.message || 'Login failed. Please check your credentials.';
            messageDiv.className = 'form-message error';
            
            // Reset button state
            submitBtn.disabled = false;
            btnText.style.display = 'inline-block';
            btnLoader.style.display = 'none';
        }
    }

    async handleRegister(e, modal) {
        e.preventDefault();
        
        const form = e.target;
        const submitBtn = form.querySelector('.auth-submit-btn');
        const btnText = submitBtn.querySelector('.btn-text');
        const btnLoader = submitBtn.querySelector('.btn-loader');
        const messageDiv = form.querySelector('.form-message');
        
        const fullName = form.fullName.value.trim();
        const email = form.email.value.trim();
        const password = form.password.value;
        const passwordConfirm = form.passwordConfirm.value;
        
        // Validate passwords match
        if (password !== passwordConfirm) {
            messageDiv.textContent = 'Passwords do not match!';
            messageDiv.className = 'form-message error';
            return;
        }
        
        // Show loading state
        submitBtn.disabled = true;
        btnText.style.display = 'none';
        btnLoader.style.display = 'inline-block';
        messageDiv.textContent = '';
        messageDiv.className = 'form-message';
        
        try {
            const response = await AuthAPI.register({ fullName, email, password });
            
            if (response.success) {
                // Show success message
                messageDiv.textContent = 'Account created successfully! Please login.';
                messageDiv.className = 'form-message success';
                
                // Note: intendedDestination is preserved in sessionStorage
                // It will be used after the user logs in
                
                // Switch to login after delay
                setTimeout(() => {
                    this.closeModal(modal);
                    setTimeout(() => this.showLoginModal(), 300);
                }, 2000);
            } else {
                throw new Error(response.error?.message || 'Registration failed');
            }
        } catch (error) {
            console.error('Registration error:', error);
            messageDiv.textContent = error.message || 'Registration failed. Please try again.';
            messageDiv.className = 'form-message error';
            
            // Reset button state
            submitBtn.disabled = false;
            btnText.style.display = 'inline-block';
            btnLoader.style.display = 'none';
        }
    }

    logout() {
        // Clear stored data
        this.token = null;
        this.user = null;
        localStorage.removeItem('authToken');
        localStorage.removeItem('user');
        
        // Update UI
        this.updateAuthUI();
        
        // Show logout message
        this.showMessage('You have been logged out successfully.', 'info');
    }

    updateAuthUI() {
        // Update desktop auth UI
        const loggedOutEl = document.getElementById('auth-logged-out');
        const loggedInEl = document.getElementById('auth-logged-in');
        
        if (loggedOutEl && loggedInEl) {
            if (this.isAuthenticated()) {
                // Show logged in state
                loggedOutEl.classList.add('hidden');
                loggedInEl.classList.remove('hidden');
                
                // Update user info
                const userEmail = this.user.email;
                const userRole = this.user.role;
                const avatarText = userEmail.charAt(0).toUpperCase();
                
                document.getElementById('user-avatar-text').textContent = avatarText;
                document.getElementById('user-email').textContent = userEmail;
                document.getElementById('dropdown-email').textContent = userEmail;
                document.getElementById('dropdown-role').textContent = `(${userRole.charAt(0).toUpperCase() + userRole.slice(1)})`;
                
                // Setup user menu dropdown
                this.setupUserMenuDropdown();
            } else {
                // Show logged out state
                loggedOutEl.classList.remove('hidden');
                loggedInEl.classList.add('hidden');
            }
        }
        
        // Update mobile auth UI
        const authLinksMobile = document.querySelector('.auth-links-mobile');
        if (authLinksMobile) {
            if (this.isAuthenticated()) {
                const showAdminLink = this.user.role === 'admin' || this.user.role === 'editor';
                authLinksMobile.innerHTML = `
                    <div class="text-white text-sm mb-3 pb-3 border-b border-white/10">
                        <p class="font-semibold">${this.user.email}</p>
                        <p class="text-xs text-white/70">(${this.user.role})</p>
                    </div>
                    ${showAdminLink ? `
                        <a href="admin.html" class="text-white no-underline text-base py-3 px-3 block mb-3 border border-white/30 rounded-md text-center transition-all duration-300 hover:bg-white hover:text-primary-dark">
                            <i class="fas fa-cog mr-2"></i>Admin Dashboard
                        </a>
                    ` : ''}
                    <button class="logout-btn w-full bg-red-600 text-white no-underline text-base py-3 px-3 block rounded-md text-center transition-all duration-300 hover:bg-red-700">
                        <i class="fas fa-sign-out-alt mr-2"></i>Logout
                    </button>
                `;
            } else {
                authLinksMobile.innerHTML = `
                    <a href="#login" class="text-white no-underline block text-[16px] !leading-[11.2px] py-[10px] px-3 mb-3 border border-white/30 rounded-md text-center transition-all duration-300 hover:bg-white hover:text-primary-dark">Login</a>
                    <a href="#register" class="bg-accent text-white no-underline block text-[16px] !leading-[11.2px] py-[10px] px-3 rounded-md text-center transition-all duration-300 hover:bg-accent/90">Register</a>
                `;
            }
        }
    }
    
    setupUserMenuDropdown() {
        const menuButton = document.getElementById('user-menu-button');
        const dropdown = document.getElementById('user-dropdown');
        const logoutButton = document.getElementById('logout-button');
        
        if (!menuButton || !dropdown) return;
        
        // Remove old listeners by cloning (prevents duplicate listeners)
        const newMenuButton = menuButton.cloneNode(true);
        menuButton.parentNode.replaceChild(newMenuButton, menuButton);
        
        // Toggle dropdown
        newMenuButton.addEventListener('click', (e) => {
            e.stopPropagation();
            const isHidden = dropdown.classList.contains('hidden');
            dropdown.classList.toggle('hidden');
            newMenuButton.setAttribute('aria-expanded', !isHidden);
        });
        
        // Close dropdown when clicking outside (use a named function to avoid duplicates)
        if (!this._closeDropdownHandler) {
            this._closeDropdownHandler = (e) => {
                const currentButton = document.getElementById('user-menu-button');
                const currentDropdown = document.getElementById('user-dropdown');
                if (currentButton && currentDropdown && 
                    !currentButton.contains(e.target) && !currentDropdown.contains(e.target)) {
                    currentDropdown.classList.add('hidden');
                    currentButton.setAttribute('aria-expanded', 'false');
                }
            };
            document.addEventListener('click', this._closeDropdownHandler);
        }
        
        // Logout button
        if (logoutButton) {
            const newLogoutButton = logoutButton.cloneNode(true);
            logoutButton.parentNode.replaceChild(newLogoutButton, logoutButton);
            newLogoutButton.addEventListener('click', () => {
                this.logout();
            });
        }
    }

    closeModal(modal) {
        modal.classList.remove('active');
        setTimeout(() => {
            modal.remove();
        }, 300);
    }

    isAuthenticated() {
        return !!this.token && !!this.user;
    }

    getToken() {
        return this.token;
    }

    getUser() {
        return this.user;
    }

    showWelcomeMessage() {
        this.showMessage(`Welcome back, ${this.user.email}!`, 'success');
    }

    showMessage(message, type = 'info') {
        const messageDiv = document.createElement('div');
        messageDiv.className = `toast-message toast-${type}`;
        messageDiv.innerHTML = `
            <i class="fas fa-${type === 'success' ? 'check-circle' : type === 'error' ? 'exclamation-circle' : 'info-circle'}"></i>
            <span>${message}</span>
        `;
        
        document.body.appendChild(messageDiv);
        
        setTimeout(() => {
            messageDiv.classList.add('show');
        }, 10);
        
        setTimeout(() => {
            messageDiv.classList.remove('show');
            setTimeout(() => messageDiv.remove(), 300);
        }, 3000);
    }
}

// Initialize auth manager when DOM is ready
let authManager;

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        authManager = new AuthManager();
    });
} else {
    authManager = new AuthManager();
}

// Export for ES modules
export { authManager, AuthManager };

// Also make available globally for debugging
window.authManager = authManager;
