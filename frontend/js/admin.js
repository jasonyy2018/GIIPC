/**
 * Admin Dashboard Module
 * Handles admin interface functionality
 */

import { AuthAPI, NewsAPI, EventsAPI, ConferencesAPI, AdminAPI } from './api-client.js';
import { 
    formatDate, 
    formatDateTime, 
    formatDateTimeLocal,
    computeStatus,
    validateDateRange,
    utcToLocal,
    localToUtc
} from './timezone-utils.js';

class AdminDashboard {
    constructor() {
        this.token = localStorage.getItem('authToken');
        this.user = JSON.parse(localStorage.getItem('user') || 'null');
        
        // Check authentication
        if (!this.token || !this.user) {
            window.location.href = '/index.html';
            return;
        }
        
        // Check if user has admin permissions
        if (this.user.role !== 'admin' && this.user.role !== 'editor') {
            alert('You do not have permission to access the admin dashboard');
            window.location.href = '/index.html';
            return;
        }
        
        // Initialize filter states
        this.eventsFilter = 'all';
        this.conferencesFilter = 'all';
        
        this.init();
    }
    
    init() {
        this.setupEventListeners();
        this.loadDashboardData();
        document.getElementById('adminUserEmail').textContent = this.user.email;
    }
    
    setupEventListeners() {
        // Sidebar toggle for mobile
        document.getElementById('sidebarToggle')?.addEventListener('click', () => {
            document.getElementById('adminSidebar').classList.toggle('hidden-mobile');
        });
        
        // Logout button
        document.getElementById('logoutBtn').addEventListener('click', () => {
            this.logout();
        });
        
        // Tab navigation
        document.querySelectorAll('.nav-tab').forEach(tab => {
            tab.addEventListener('click', (e) => {
                const tabName = e.currentTarget.dataset.tab;
                this.switchTab(tabName);
            });
        });
        

    }
    
    switchTab(tabName) {
        // Update active tab button
        document.querySelectorAll('.nav-tab').forEach(tab => {
            tab.classList.remove('active', 'bg-gray-100');
            if (tab.dataset.tab === tabName) {
                tab.classList.add('active', 'bg-gray-100');
            }
        });
        
        // Update active content
        document.querySelectorAll('.tab-content').forEach(content => {
            content.classList.remove('active');
        });
        document.getElementById(tabName).classList.add('active');
        
        // Load data for the tab
        switch(tabName) {
            case 'news':
                this.loadNews();
                break;
            case 'events':
                this.loadEvents();
                break;
            case 'conferences':
                this.loadConferences();
                break;
            case 'users':
                this.loadUsers();
                break;
        }
    }
    
    async loadDashboardData() {
        try {
            const [news, events, conferences, users] = await Promise.all([
                NewsAPI.getAll(),
                EventsAPI.getAll(),
                ConferencesAPI.getAll(),
                this.user.role === 'admin' ? AdminAPI.getUsers() : Promise.resolve({ success: true, data: [] })
            ]);
            
            console.log('Dashboard data loaded:', { news, events, conferences, users });
            
            document.getElementById('newsCount').textContent = news.data?.length || 0;
            document.getElementById('eventsCount').textContent = events.data?.length || 0;
            document.getElementById('conferencesCount').textContent = conferences.data?.length || 0;
            document.getElementById('usersCount').textContent = users.data?.length || 0;
        } catch (error) {
            console.error('Error loading dashboard data:', error);
            this.showMessage('Failed to load dashboard data', 'error');
        }
    }
    
    async loadNews() {
        try {
            const response = await NewsAPI.getAll();
            const tbody = document.getElementById('newsTableBody');
            
            if (!response.data || response.data.length === 0) {
                tbody.innerHTML = '<tr><td colspan="3" class="px-6 py-4 text-center text-gray-500">No news found</td></tr>';
                return;
            }
            
            tbody.innerHTML = response.data.map(item => `
                <tr>
                    <td class="px-6 py-4">${this.escapeHtml(item.title)}</td>
                    <td class="px-6 py-4">${formatDate(item.date || item.published_date)}</td>
                    <td class="px-6 py-4">
                        <button onclick="adminDashboard.editNews(${item.id})" class="text-blue-600 hover:text-blue-800 mr-3">
                            <i class="fas fa-edit"></i> Edit
                        </button>
                        <button onclick="adminDashboard.deleteNews(${item.id})" class="text-red-600 hover:text-red-800">
                            <i class="fas fa-trash"></i> Delete
                        </button>
                    </td>
                </tr>
            `).join('');
        } catch (error) {
            console.error('Error loading news:', error);
            this.showMessage('Failed to load news', 'error');
        }
    }
    
    async loadEvents() {
        try {
            const response = await EventsAPI.getAll();
            const tbody = document.getElementById('eventsTableBody');
            
            if (!response.data || response.data.length === 0) {
                tbody.innerHTML = '<tr><td colspan="6" class="px-6 py-4 text-center text-gray-500">No events found</td></tr>';
                return;
            }
            
            // Filter events based on current filter
            let filteredEvents = response.data;
            if (this.eventsFilter !== 'all') {
                filteredEvents = response.data.filter(item => {
                    const status = computeStatus(item.end_date);
                    return status === this.eventsFilter;
                });
            }
            
            if (filteredEvents.length === 0) {
                tbody.innerHTML = '<tr><td colspan="6" class="px-6 py-4 text-center text-gray-500">No events found for this filter</td></tr>';
                return;
            }
            
            tbody.innerHTML = filteredEvents.map(item => {
                const status = computeStatus(item.end_date);
                const statusBadge = this.getStatusBadge(status);
                
                return `
                    <tr>
                        <td class="px-6 py-4">${this.escapeHtml(item.title)}</td>
                        <td class="px-6 py-4">${item.start_date ? formatDateTime(item.start_date) : 'N/A'}</td>
                        <td class="px-6 py-4">${item.end_date ? formatDateTime(item.end_date) : 'N/A'}</td>
                        <td class="px-6 py-4">${statusBadge}</td>
                        <td class="px-6 py-4">${this.escapeHtml(item.location)}</td>
                        <td class="px-6 py-4">
                            <button onclick="adminDashboard.editEvent(${item.id})" class="text-blue-600 hover:text-blue-800 mr-3">
                                <i class="fas fa-edit"></i> Edit
                            </button>
                            <button onclick="adminDashboard.deleteEvent(${item.id})" class="text-red-600 hover:text-red-800">
                                <i class="fas fa-trash"></i> Delete
                            </button>
                        </td>
                    </tr>
                `;
            }).join('');
        } catch (error) {
            console.error('Error loading events:', error);
            this.showMessage('Failed to load events', 'error');
        }
    }
    
    async loadConferences() {
        try {
            const response = await ConferencesAPI.getAll();
            const tbody = document.getElementById('conferencesTableBody');
            
            if (!response.data || response.data.length === 0) {
                tbody.innerHTML = '<tr><td colspan="6" class="px-6 py-4 text-center text-gray-500">No conferences found</td></tr>';
                return;
            }
            
            // Filter conferences based on current filter
            let filteredConferences = response.data;
            if (this.conferencesFilter !== 'all') {
                filteredConferences = response.data.filter(item => {
                    const status = computeStatus(item.end_date);
                    return status === this.conferencesFilter;
                });
            }
            
            if (filteredConferences.length === 0) {
                tbody.innerHTML = '<tr><td colspan="6" class="px-6 py-4 text-center text-gray-500">No conferences found for this filter</td></tr>';
                return;
            }
            
            tbody.innerHTML = filteredConferences.map(item => {
                const status = computeStatus(item.end_date);
                const statusBadge = this.getStatusBadge(status);
                
                return `
                    <tr>
                        <td class="px-6 py-4">${this.escapeHtml(item.title)}</td>
                        <td class="px-6 py-4">${item.start_date ? formatDateTime(item.start_date) : 'N/A'}</td>
                        <td class="px-6 py-4">${item.end_date ? formatDateTime(item.end_date) : 'N/A'}</td>
                        <td class="px-6 py-4">${statusBadge}</td>
                        <td class="px-6 py-4">${this.escapeHtml(item.location)}</td>
                        <td class="px-6 py-4">
                            <button onclick="adminDashboard.editConference(${item.id})" class="text-blue-600 hover:text-blue-800 mr-3">
                                <i class="fas fa-edit"></i> Edit
                            </button>
                            <button onclick="adminDashboard.deleteConference(${item.id})" class="text-red-600 hover:text-red-800">
                                <i class="fas fa-trash"></i> Delete
                            </button>
                        </td>
                    </tr>
                `;
            }).join('');
        } catch (error) {
            console.error('Error loading conferences:', error);
            this.showMessage('Failed to load conferences', 'error');
        }
    }
    
    async loadUsers() {
        if (this.user.role !== 'admin') {
            document.getElementById('usersTableBody').innerHTML = 
                '<tr><td colspan="4" class="px-6 py-4 text-center text-gray-500">You do not have permission to view users</td></tr>';
            return;
        }
        
        try {
            const response = await AdminAPI.getUsers();
            const tbody = document.getElementById('usersTableBody');
            
            if (!response.data || response.data.length === 0) {
                tbody.innerHTML = '<tr><td colspan="4" class="px-6 py-4 text-center text-gray-500">No users found</td></tr>';
                return;
            }
            
            tbody.innerHTML = response.data.map(user => `
                <tr>
                    <td class="px-6 py-4">${this.escapeHtml(user.email)}</td>
                    <td class="px-6 py-4">
                        <span class="px-2 py-1 rounded text-sm ${
                            user.role === 'admin' ? 'bg-red-100 text-red-800' :
                            user.role === 'editor' ? 'bg-blue-100 text-blue-800' :
                            'bg-gray-100 text-gray-800'
                        }">
                            ${user.role}
                        </span>
                    </td>
                    <td class="px-6 py-4">${formatDate(user.created_at)}</td>
                    <td class="px-6 py-4">
                        ${user.id !== this.user.id ? `
                            <button onclick="adminDashboard.changeUserRole(${user.id}, '${user.email}')" class="text-blue-600 hover:text-blue-800">
                                <i class="fas fa-user-edit"></i> Change Role
                            </button>
                        ` : '<span class="text-gray-400">Current User</span>'}
                    </td>
                </tr>
            `).join('');
        } catch (error) {
            console.error('Error loading users:', error);
            this.showMessage('Failed to load users', 'error');
        }
    }
    
    // News operations
    showAddNewsModal() {
        const modal = this.createModal('Add News', `
            <form id="newsForm" class="space-y-4">
                <div>
                    <label class="block text-sm font-medium mb-2">Title *</label>
                    <input type="text" id="newsTitle" required class="w-full px-3 py-2 border rounded-lg">
                </div>
                <div>
                    <label class="block text-sm font-medium mb-2">Content *</label>
                    <textarea id="newsContent" required rows="4" class="w-full px-3 py-2 border rounded-lg"></textarea>
                </div>
                <div>
                    <label class="block text-sm font-medium mb-2">Image URL</label>
                    <input type="url" id="newsImageUrl" class="w-full px-3 py-2 border rounded-lg">
                </div>
                <div>
                    <label class="block text-sm font-medium mb-2">Published Date *</label>
                    <input type="date" id="newsDate" required class="w-full px-3 py-2 border rounded-lg">
                </div>
                <div class="flex justify-end gap-3">
                    <button type="button" onclick="adminDashboard.closeModal()" class="px-4 py-2 border rounded-lg">Cancel</button>
                    <button type="submit" class="px-4 py-2 bg-[#0B4D3E] text-white rounded-lg">Create</button>
                </div>
            </form>
        `);
        
        document.getElementById('newsForm').addEventListener('submit', async (e) => {
            e.preventDefault();
            await this.createNews();
        });
    }
    
    async createNews() {
        const data = {
            title: document.getElementById('newsTitle').value,
            content: document.getElementById('newsContent').value,
            image_url: document.getElementById('newsImageUrl').value,
            published_date: document.getElementById('newsDate').value
        };
        
        try {
            await NewsAPI.create(data);
            this.showMessage('News created successfully', 'success');
            this.closeModal();
            this.loadNews();
            this.loadDashboardData();
        } catch (error) {
            this.showMessage('Failed to create news', 'error');
        }
    }
    
    async editNews(id) {
        try {
            const response = await NewsAPI.getById(id);
            const news = response.data;
            
            const modal = this.createModal('Edit News', `
                <form id="newsEditForm" class="space-y-4">
                    <div>
                        <label class="block text-sm font-medium mb-2">Title *</label>
                        <input type="text" id="editNewsTitle" required class="w-full px-3 py-2 border rounded-lg" value="${this.escapeHtml(news.title)}">
                    </div>
                    <div>
                        <label class="block text-sm font-medium mb-2">Content *</label>
                        <textarea id="editNewsContent" required rows="4" class="w-full px-3 py-2 border rounded-lg">${this.escapeHtml(news.content)}</textarea>
                    </div>
                    <div>
                        <label class="block text-sm font-medium mb-2">Image URL</label>
                        <input type="url" id="editNewsImageUrl" class="w-full px-3 py-2 border rounded-lg" value="${news.image_url || ''}">
                    </div>
                    <div>
                        <label class="block text-sm font-medium mb-2">Published Date *</label>
                        <input type="date" id="editNewsDate" required class="w-full px-3 py-2 border rounded-lg" value="${news.published_date}">
                    </div>
                    <div class="flex justify-end gap-3">
                        <button type="button" onclick="adminDashboard.closeModal()" class="px-4 py-2 border rounded-lg">Cancel</button>
                        <button type="submit" class="px-4 py-2 bg-[#0B4D3E] text-white rounded-lg">Update</button>
                    </div>
                </form>
            `);
            
            document.getElementById('newsEditForm').addEventListener('submit', async (e) => {
                e.preventDefault();
                await this.updateNews(id);
            });
        } catch (error) {
            this.showMessage('Failed to load news', 'error');
        }
    }
    
    async updateNews(id) {
        const data = {
            title: document.getElementById('editNewsTitle').value,
            content: document.getElementById('editNewsContent').value,
            image_url: document.getElementById('editNewsImageUrl').value,
            published_date: document.getElementById('editNewsDate').value
        };
        
        try {
            await NewsAPI.update(id, data);
            this.showMessage('News updated successfully', 'success');
            this.closeModal();
            this.loadNews();
        } catch (error) {
            this.showMessage('Failed to update news', 'error');
        }
    }
    
    async deleteNews(id) {
        if (!confirm('Are you sure you want to delete this news item?')) return;
        
        try {
            await NewsAPI.delete(id);
            this.showMessage('News deleted successfully', 'success');
            this.loadNews();
            this.loadDashboardData();
        } catch (error) {
            console.error('Error deleting news:', error);
            this.showMessage('Failed to delete news', 'error');
        }
    }
    
    // Event operations
    showAddEventModal() {
        const modal = this.createModal('Add Event', `
            <form id="eventForm" class="space-y-4">
                <div>
                    <label class="block text-sm font-medium mb-2">Title *</label>
                    <input type="text" id="eventTitle" required class="w-full px-3 py-2 border rounded-lg">
                </div>
                <div>
                    <label class="block text-sm font-medium mb-2">Description *</label>
                    <textarea id="eventDescription" required rows="3" class="w-full px-3 py-2 border rounded-lg"></textarea>
                </div>
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label class="block text-sm font-medium mb-2">Start Date & Time *</label>
                        <input type="datetime-local" id="eventStartDate" required class="w-full px-3 py-2 border rounded-lg">
                    </div>
                    <div>
                        <label class="block text-sm font-medium mb-2">End Date & Time *</label>
                        <input type="datetime-local" id="eventEndDate" required class="w-full px-3 py-2 border rounded-lg">
                    </div>
                </div>
                <div id="eventDateError" class="text-red-600 text-sm hidden">End date must be after start date</div>
                <div>
                    <label class="block text-sm font-medium mb-2">Location *</label>
                    <input type="text" id="eventLocation" required class="w-full px-3 py-2 border rounded-lg">
                </div>
                <div>
                    <label class="block text-sm font-medium mb-2">Capacity</label>
                    <input type="number" id="eventCapacity" min="1" class="w-full px-3 py-2 border rounded-lg">
                </div>
                <div class="flex justify-end gap-3">
                    <button type="button" onclick="adminDashboard.closeModal()" class="px-4 py-2 border rounded-lg">Cancel</button>
                    <button type="submit" class="px-4 py-2 bg-[#0B4D3E] text-white rounded-lg">Create</button>
                </div>
            </form>
        `);
        
        // Add date validation
        const startDateInput = document.getElementById('eventStartDate');
        const endDateInput = document.getElementById('eventEndDate');
        const errorDiv = document.getElementById('eventDateError');
        
        const validateDates = () => {
            if (startDateInput.value && endDateInput.value) {
                const startDate = new Date(startDateInput.value);
                const endDate = new Date(endDateInput.value);
                
                if (endDate <= startDate) {
                    errorDiv.classList.remove('hidden');
                    return false;
                } else {
                    errorDiv.classList.add('hidden');
                    return true;
                }
            }
            return true;
        };
        
        startDateInput.addEventListener('change', validateDates);
        endDateInput.addEventListener('change', validateDates);
        
        document.getElementById('eventForm').addEventListener('submit', async (e) => {
            e.preventDefault();
            if (validateDates()) {
                await this.createEvent();
            }
        });
    }
    
    async createEvent() {
        const startDateLocal = document.getElementById('eventStartDate').value;
        const endDateLocal = document.getElementById('eventEndDate').value;
        
        // Convert local time to UTC
        const startDateUTC = new Date(startDateLocal).toISOString();
        const endDateUTC = new Date(endDateLocal).toISOString();
        
        const data = {
            title: document.getElementById('eventTitle').value,
            description: document.getElementById('eventDescription').value,
            start_date: startDateUTC,
            end_date: endDateUTC,
            location: document.getElementById('eventLocation').value,
            capacity: document.getElementById('eventCapacity').value || null
        };
        
        try {
            await EventsAPI.create(data);
            this.showMessage('Event created successfully', 'success');
            this.closeModal();
            this.loadEvents();
            this.loadDashboardData();
        } catch (error) {
            console.error('Error creating event:', error);
            // Show detailed error message from API
            const errorMessage = error.details 
                ? `Failed to create event: ${error.details.map(d => d.message).join(', ')}`
                : (error.message || 'Failed to create event. Please check your input and try again.');
            this.showMessage(errorMessage, 'error');
        }
    }
    
    async editEvent(id) {
        try {
            const response = await EventsAPI.getById(id);
            const event = response.data;
            
            // Convert UTC to local datetime-local format using timezone utility
            const startDateLocal = event.start_date ? formatDateTimeLocal(event.start_date) : '';
            const endDateLocal = event.end_date ? formatDateTimeLocal(event.end_date) : '';
            
            const modal = this.createModal('Edit Event', `
                <form id="eventEditForm" class="space-y-4">
                    <div>
                        <label class="block text-sm font-medium mb-2">Title *</label>
                        <input type="text" id="editEventTitle" required class="w-full px-3 py-2 border rounded-lg" value="${this.escapeHtml(event.title)}">
                    </div>
                    <div>
                        <label class="block text-sm font-medium mb-2">Description *</label>
                        <textarea id="editEventDescription" required rows="3" class="w-full px-3 py-2 border rounded-lg">${this.escapeHtml(event.description)}</textarea>
                    </div>
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label class="block text-sm font-medium mb-2">Start Date & Time *</label>
                            <input type="datetime-local" id="editEventStartDate" required class="w-full px-3 py-2 border rounded-lg" value="${startDateLocal}">
                        </div>
                        <div>
                            <label class="block text-sm font-medium mb-2">End Date & Time *</label>
                            <input type="datetime-local" id="editEventEndDate" required class="w-full px-3 py-2 border rounded-lg" value="${endDateLocal}">
                        </div>
                    </div>
                    <div id="editEventDateError" class="text-red-600 text-sm hidden">End date must be after start date</div>
                    <div>
                        <label class="block text-sm font-medium mb-2">Location *</label>
                        <input type="text" id="editEventLocation" required class="w-full px-3 py-2 border rounded-lg" value="${this.escapeHtml(event.location)}">
                    </div>
                    <div>
                        <label class="block text-sm font-medium mb-2">Capacity</label>
                        <input type="number" id="editEventCapacity" min="1" class="w-full px-3 py-2 border rounded-lg" value="${event.capacity || ''}">
                    </div>
                    <div class="flex justify-end gap-3">
                        <button type="button" onclick="adminDashboard.closeModal()" class="px-4 py-2 border rounded-lg">Cancel</button>
                        <button type="submit" class="px-4 py-2 bg-[#0B4D3E] text-white rounded-lg">Update</button>
                    </div>
                </form>
            `);
            
            // Add date validation
            const startDateInput = document.getElementById('editEventStartDate');
            const endDateInput = document.getElementById('editEventEndDate');
            const errorDiv = document.getElementById('editEventDateError');
            
            const validateDates = () => {
                if (startDateInput.value && endDateInput.value) {
                    const startDate = new Date(startDateInput.value);
                    const endDate = new Date(endDateInput.value);
                    
                    if (endDate <= startDate) {
                        errorDiv.classList.remove('hidden');
                        return false;
                    } else {
                        errorDiv.classList.add('hidden');
                        return true;
                    }
                }
                return true;
            };
            
            startDateInput.addEventListener('change', validateDates);
            endDateInput.addEventListener('change', validateDates);
            
            document.getElementById('eventEditForm').addEventListener('submit', async (e) => {
                e.preventDefault();
                if (validateDates()) {
                    await this.updateEvent(id);
                }
            });
        } catch (error) {
            this.showMessage('Failed to load event', 'error');
        }
    }
    
    async updateEvent(id) {
        const startDateLocal = document.getElementById('editEventStartDate').value;
        const endDateLocal = document.getElementById('editEventEndDate').value;
        
        // Convert local time to UTC
        const startDateUTC = new Date(startDateLocal).toISOString();
        const endDateUTC = new Date(endDateLocal).toISOString();
        
        const data = {
            title: document.getElementById('editEventTitle').value,
            description: document.getElementById('editEventDescription').value,
            start_date: startDateUTC,
            end_date: endDateUTC,
            location: document.getElementById('editEventLocation').value,
            capacity: document.getElementById('editEventCapacity').value || null
        };
        
        try {
            await EventsAPI.update(id, data);
            this.showMessage('Event updated successfully', 'success');
            this.closeModal();
            this.loadEvents();
        } catch (error) {
            console.error('Error updating event:', error);
            // Show detailed error message from API
            const errorMessage = error.details 
                ? `Failed to update event: ${error.details.map(d => d.message).join(', ')}`
                : (error.message || 'Failed to update event. Please check your input and try again.');
            this.showMessage(errorMessage, 'error');
        }
    }
    
    async deleteEvent(id) {
        if (!confirm('Are you sure you want to delete this event?')) return;
        
        try {
            await EventsAPI.delete(id);
            this.showMessage('Event deleted successfully', 'success');
            this.loadEvents();
            this.loadDashboardData();
        } catch (error) {
            console.error('Error deleting event:', error);
            this.showMessage('Failed to delete event', 'error');
        }
    }
    
    // Conference operations
    showAddConferenceModal() {
        const modal = this.createModal('Add Conference', `
            <form id="conferenceForm" class="space-y-4">
                <div>
                    <label class="block text-sm font-medium mb-2">Title *</label>
                    <input type="text" id="conferenceTitle" required class="w-full px-3 py-2 border rounded-lg">
                </div>
                <div>
                    <label class="block text-sm font-medium mb-2">Description *</label>
                    <textarea id="conferenceDescription" required rows="3" class="w-full px-3 py-2 border rounded-lg"></textarea>
                </div>
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label class="block text-sm font-medium mb-2">Start Date & Time *</label>
                        <input type="datetime-local" id="conferenceStartDate" required class="w-full px-3 py-2 border rounded-lg">
                    </div>
                    <div>
                        <label class="block text-sm font-medium mb-2">End Date & Time *</label>
                        <input type="datetime-local" id="conferenceEndDate" required class="w-full px-3 py-2 border rounded-lg">
                    </div>
                </div>
                <div id="conferenceDateError" class="text-red-600 text-sm hidden">End date must be after start date</div>
                <div>
                    <label class="block text-sm font-medium mb-2">Location *</label>
                    <input type="text" id="conferenceLocation" required class="w-full px-3 py-2 border rounded-lg">
                </div>
                <div>
                    <label class="block text-sm font-medium mb-2">Summary</label>
                    <textarea id="conferenceSummary" rows="2" class="w-full px-3 py-2 border rounded-lg"></textarea>
                </div>
                <div>
                    <label class="block text-sm font-medium mb-2">Image URL</label>
                    <input type="url" id="conferenceImageUrl" class="w-full px-3 py-2 border rounded-lg">
                </div>
                <div class="flex justify-end gap-3">
                    <button type="button" onclick="adminDashboard.closeModal()" class="px-4 py-2 border rounded-lg">Cancel</button>
                    <button type="submit" class="px-4 py-2 bg-[#0B4D3E] text-white rounded-lg">Create</button>
                </div>
            </form>
        `);
        
        // Add date validation
        const startDateInput = document.getElementById('conferenceStartDate');
        const endDateInput = document.getElementById('conferenceEndDate');
        const errorDiv = document.getElementById('conferenceDateError');
        
        const validateDates = () => {
            if (startDateInput.value && endDateInput.value) {
                const startDate = new Date(startDateInput.value);
                const endDate = new Date(endDateInput.value);
                
                if (endDate <= startDate) {
                    errorDiv.classList.remove('hidden');
                    return false;
                } else {
                    errorDiv.classList.add('hidden');
                    return true;
                }
            }
            return true;
        };
        
        startDateInput.addEventListener('change', validateDates);
        endDateInput.addEventListener('change', validateDates);
        
        document.getElementById('conferenceForm').addEventListener('submit', async (e) => {
            e.preventDefault();
            if (validateDates()) {
                await this.createConference();
            }
        });
    }
    
    async createConference() {
        const startDateLocal = document.getElementById('conferenceStartDate').value;
        const endDateLocal = document.getElementById('conferenceEndDate').value;
        
        // Convert local time to UTC
        const startDateUTC = new Date(startDateLocal).toISOString();
        const endDateUTC = new Date(endDateLocal).toISOString();
        
        const data = {
            title: document.getElementById('conferenceTitle').value,
            description: document.getElementById('conferenceDescription').value,
            start_date: startDateUTC,
            end_date: endDateUTC,
            location: document.getElementById('conferenceLocation').value,
            summary: document.getElementById('conferenceSummary').value || null,
            image_url: document.getElementById('conferenceImageUrl').value || null
        };
        
        try {
            await ConferencesAPI.create(data);
            this.showMessage('Conference created successfully', 'success');
            this.closeModal();
            this.loadConferences();
            this.loadDashboardData();
        } catch (error) {
            console.error('Error creating conference:', error);
            // Show detailed error message from API
            const errorMessage = error.details 
                ? `Failed to create conference: ${error.details.map(d => d.message).join(', ')}`
                : (error.message || 'Failed to create conference. Please check your input and try again.');
            this.showMessage(errorMessage, 'error');
        }
    }
    
    async editConference(id) {
        try {
            const response = await ConferencesAPI.getById(id);
            const conference = response.data;
            
            // Convert UTC to local datetime-local format using timezone utility
            const startDateLocal = conference.start_date ? formatDateTimeLocal(conference.start_date) : '';
            const endDateLocal = conference.end_date ? formatDateTimeLocal(conference.end_date) : '';
            
            const modal = this.createModal('Edit Conference', `
                <form id="conferenceEditForm" class="space-y-4">
                    <div>
                        <label class="block text-sm font-medium mb-2">Title *</label>
                        <input type="text" id="editConferenceTitle" required class="w-full px-3 py-2 border rounded-lg" value="${this.escapeHtml(conference.title)}">
                    </div>
                    <div>
                        <label class="block text-sm font-medium mb-2">Description *</label>
                        <textarea id="editConferenceDescription" required rows="3" class="w-full px-3 py-2 border rounded-lg">${this.escapeHtml(conference.description)}</textarea>
                    </div>
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label class="block text-sm font-medium mb-2">Start Date & Time *</label>
                            <input type="datetime-local" id="editConferenceStartDate" required class="w-full px-3 py-2 border rounded-lg" value="${startDateLocal}">
                        </div>
                        <div>
                            <label class="block text-sm font-medium mb-2">End Date & Time *</label>
                            <input type="datetime-local" id="editConferenceEndDate" required class="w-full px-3 py-2 border rounded-lg" value="${endDateLocal}">
                        </div>
                    </div>
                    <div id="editConferenceDateError" class="text-red-600 text-sm hidden">End date must be after start date</div>
                    <div>
                        <label class="block text-sm font-medium mb-2">Location *</label>
                        <input type="text" id="editConferenceLocation" required class="w-full px-3 py-2 border rounded-lg" value="${this.escapeHtml(conference.location)}">
                    </div>
                    <div>
                        <label class="block text-sm font-medium mb-2">Summary</label>
                        <textarea id="editConferenceSummary" rows="2" class="w-full px-3 py-2 border rounded-lg">${this.escapeHtml(conference.summary || '')}</textarea>
                    </div>
                    <div>
                        <label class="block text-sm font-medium mb-2">Image URL</label>
                        <input type="url" id="editConferenceImageUrl" class="w-full px-3 py-2 border rounded-lg" value="${conference.image_url || ''}">
                    </div>
                    <div class="flex justify-end gap-3">
                        <button type="button" onclick="adminDashboard.closeModal()" class="px-4 py-2 border rounded-lg">Cancel</button>
                        <button type="submit" class="px-4 py-2 bg-[#0B4D3E] text-white rounded-lg">Update</button>
                    </div>
                </form>
            `);
            
            // Add date validation
            const startDateInput = document.getElementById('editConferenceStartDate');
            const endDateInput = document.getElementById('editConferenceEndDate');
            const errorDiv = document.getElementById('editConferenceDateError');
            
            const validateDates = () => {
                if (startDateInput.value && endDateInput.value) {
                    const startDate = new Date(startDateInput.value);
                    const endDate = new Date(endDateInput.value);
                    
                    if (endDate <= startDate) {
                        errorDiv.classList.remove('hidden');
                        return false;
                    } else {
                        errorDiv.classList.add('hidden');
                        return true;
                    }
                }
                return true;
            };
            
            startDateInput.addEventListener('change', validateDates);
            endDateInput.addEventListener('change', validateDates);
            
            document.getElementById('conferenceEditForm').addEventListener('submit', async (e) => {
                e.preventDefault();
                if (validateDates()) {
                    await this.updateConference(id);
                }
            });
        } catch (error) {
            this.showMessage('Failed to load conference', 'error');
        }
    }
    
    async updateConference(id) {
        const startDateLocal = document.getElementById('editConferenceStartDate').value;
        const endDateLocal = document.getElementById('editConferenceEndDate').value;
        
        // Convert local time to UTC
        const startDateUTC = new Date(startDateLocal).toISOString();
        const endDateUTC = new Date(endDateLocal).toISOString();
        
        const data = {
            title: document.getElementById('editConferenceTitle').value,
            description: document.getElementById('editConferenceDescription').value,
            start_date: startDateUTC,
            end_date: endDateUTC,
            location: document.getElementById('editConferenceLocation').value,
            summary: document.getElementById('editConferenceSummary').value || null,
            image_url: document.getElementById('editConferenceImageUrl').value || null
        };
        
        try {
            await ConferencesAPI.update(id, data);
            this.showMessage('Conference updated successfully', 'success');
            this.closeModal();
            this.loadConferences();
        } catch (error) {
            console.error('Error updating conference:', error);
            // Show detailed error message from API
            const errorMessage = error.details 
                ? `Failed to update conference: ${error.details.map(d => d.message).join(', ')}`
                : (error.message || 'Failed to update conference. Please check your input and try again.');
            this.showMessage(errorMessage, 'error');
        }
    }
    
    async deleteConference(id) {
        if (!confirm('Are you sure you want to delete this conference?')) return;
        
        try {
            await ConferencesAPI.delete(id);
            this.showMessage('Conference deleted successfully', 'success');
            this.loadConferences();
            this.loadDashboardData();
        } catch (error) {
            console.error('Error deleting conference:', error);
            this.showMessage('Failed to delete conference', 'error');
        }
    }
    

    // User operations
    async changeUserRole(userId, userEmail) {
        const newRole = prompt(`Enter new role (admin/editor/user) for ${userEmail}:`);
        
        if (!newRole || !['admin', 'editor', 'user'].includes(newRole)) {
            this.showMessage('Invalid role', 'error');
            return;
        }
        
        try {
            await AdminAPI.updateUserRole(userId, newRole);
            this.showMessage('User role updated successfully', 'success');
            this.loadUsers();
        } catch (error) {
            console.error('Error updating user role:', error);
            this.showMessage('Failed to update user role', 'error');
        }
    }
    
    logout() {
        localStorage.removeItem('authToken');
        localStorage.removeItem('user');
        window.location.href = '/index.html';
    }
    
    // Filter functions
    filterEvents(status) {
        this.eventsFilter = status;
        
        // Update button styles
        document.getElementById('eventsFilterAll').className = status === 'all' 
            ? 'px-4 py-2 rounded bg-[#0B4D3E] text-white' 
            : 'px-4 py-2 rounded bg-gray-200 text-gray-700 hover:bg-gray-300';
        document.getElementById('eventsFilterActive').className = status === 'active' 
            ? 'px-4 py-2 rounded bg-[#0B4D3E] text-white' 
            : 'px-4 py-2 rounded bg-gray-200 text-gray-700 hover:bg-gray-300';
        document.getElementById('eventsFilterPast').className = status === 'past' 
            ? 'px-4 py-2 rounded bg-[#0B4D3E] text-white' 
            : 'px-4 py-2 rounded bg-gray-200 text-gray-700 hover:bg-gray-300';
        
        // Reload events with filter
        this.loadEvents();
    }
    
    filterConferences(status) {
        this.conferencesFilter = status;
        
        // Update button styles
        document.getElementById('conferencesFilterAll').className = status === 'all' 
            ? 'px-4 py-2 rounded bg-[#0B4D3E] text-white' 
            : 'px-4 py-2 rounded bg-gray-200 text-gray-700 hover:bg-gray-300';
        document.getElementById('conferencesFilterActive').className = status === 'active' 
            ? 'px-4 py-2 rounded bg-[#0B4D3E] text-white' 
            : 'px-4 py-2 rounded bg-gray-200 text-gray-700 hover:bg-gray-300';
        document.getElementById('conferencesFilterPast').className = status === 'past' 
            ? 'px-4 py-2 rounded bg-[#0B4D3E] text-white' 
            : 'px-4 py-2 rounded bg-gray-200 text-gray-700 hover:bg-gray-300';
        
        // Reload conferences with filter
        this.loadConferences();
    }
    
    // Utility functions
    getStatusBadge(status) {
        if (status === 'active') {
            return '<span class="px-2 py-1 rounded text-sm bg-green-100 text-green-800">Active</span>';
        } else {
            return '<span class="px-2 py-1 rounded text-sm bg-gray-100 text-gray-800">Past</span>';
        }
    }
    
    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }
    
    createModal(title, content) {
        const modal = document.createElement('div');
        modal.className = 'modal active';
        modal.innerHTML = `
            <div class="modal-content p-6">
                <div class="flex justify-between items-center mb-4">
                    <h3 class="text-xl font-bold text-[#0B4D3E]">${title}</h3>
                    <button onclick="adminDashboard.closeModal()" class="text-gray-500 hover:text-gray-700">
                        <i class="fas fa-times text-xl"></i>
                    </button>
                </div>
                ${content}
            </div>
        `;
        document.getElementById('modalContainer').appendChild(modal);
        return modal;
    }
    
    closeModal() {
        const modal = document.querySelector('.modal');
        if (modal) modal.remove();
    }
    
    showMessage(message, type = 'info') {
        const messageDiv = document.createElement('div');
        messageDiv.className = `fixed top-4 right-4 px-6 py-3 rounded-lg shadow-lg z-50 ${type === 'success' ? 'bg-green-500' : 'bg-red-500'} text-white`;
        messageDiv.innerHTML = `
            <i class="fas fa-${type === 'success' ? 'check-circle' : 'exclamation-circle'} mr-2"></i>
            <span>${message}</span>
        `;
        
        document.body.appendChild(messageDiv);
        setTimeout(() => messageDiv.remove(), 3000);
    }
}

// Global functions for onclick handlers
window.switchTab = function(tabName) {
    if (window.adminDashboard) {
        window.adminDashboard.switchTab(tabName);
    }
};

window.showAddNewsModal = function() {
    if (window.adminDashboard) window.adminDashboard.showAddNewsModal();
};

window.showAddEventModal = function() {
    if (window.adminDashboard) window.adminDashboard.showAddEventModal();
};

window.showAddConferenceModal = function() {
    if (window.adminDashboard) window.adminDashboard.showAddConferenceModal();
};

// Initialize admin dashboard
let adminDashboard;

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        adminDashboard = new AdminDashboard();
        window.adminDashboard = adminDashboard;
    });
} else {
    adminDashboard = new AdminDashboard();
    window.adminDashboard = adminDashboard;
}

export { adminDashboard, AdminDashboard };
