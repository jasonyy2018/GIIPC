/**
 * 增强版 Events 表单代码
 * 可以直接替换 frontend/js/admin.js 中的相关方法
 */

// ============================================
// 1. 显示增强版添加活动表单
// ============================================
showAddEventModal() {
    const modal = this.createModal('Add Event', `
        <form id="eventForm" class="space-y-6 max-h-[70vh] overflow-y-auto px-1">
            <!-- 基本信息 -->
            <div class="border-b pb-4">
                <h3 class="text-lg font-semibold mb-4 text-[#0B4D3E]">
                    <i class="fas fa-info-circle mr-2"></i>Basic Information
                </h3>
                
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div class="md:col-span-2">
                        <label class="block text-sm font-medium mb-2">Event Title *</label>
                        <input type="text" id="eventTitle" required 
                            class="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-[#0B4D3E] focus:border-transparent"
                            placeholder="The 3rd Conference on Global Innovation...">
                    </div>
                    
                    <div class="md:col-span-2">
                        <label class="block text-sm font-medium mb-2">Description *</label>
                        <textarea id="eventDescription" required rows="4" 
                            class="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-[#0B4D3E] focus:border-transparent"
                            placeholder="Brief description of the event..."></textarea>
                    </div>
                    
                    <div>
                        <label class="block text-sm font-medium mb-2">Event Type *</label>
                        <select id="eventType" required class="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-[#0B4D3E] focus:border-transparent">
                            <option value="">Select type...</option>
                            <option value="conference">Conference</option>
                            <option value="workshop">Workshop</option>
                            <option value="seminar">Seminar</option>
                            <option value="symposium">Symposium</option>
                            <option value="forum">Forum</option>
                            <option value="lecture">Lecture</option>
                            <option value="other">Other</option>
                        </select>
                    </div>
                    
                    <div>
                        <label class="block text-sm font-medium mb-2">Capacity</label>
                        <input type="number" id="eventCapacity" min="1" 
                            class="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-[#0B4D3E] focus:border-transparent"
                            placeholder="100">
                    </div>
                </div>
            </div>
            
            <!-- 日期和时间 -->
            <div class="border-b pb-4">
                <h3 class="text-lg font-semibold mb-4 text-[#0B4D3E]">
                    <i class="fas fa-calendar mr-2"></i>Date & Time
                </h3>
                
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label class="block text-sm font-medium mb-2">Start Date *</label>
                        <input type="date" id="eventStartDate" required 
                            class="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-[#0B4D3E] focus:border-transparent">
                    </div>
                    
                    <div>
                        <label class="block text-sm font-medium mb-2">End Date</label>
                        <input type="date" id="eventEndDate" 
                            class="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-[#0B4D3E] focus:border-transparent">
                        <p class="text-xs text-gray-500 mt-1">Leave empty for single-day event</p>
                    </div>
                    
                    <div>
                        <label class="block text-sm font-medium mb-2">Start Time</label>
                        <input type="time" id="eventStartTime" 
                            class="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-[#0B4D3E] focus:border-transparent"
                            placeholder="09:00">
                    </div>
                    
                    <div>
                        <label class="block text-sm font-medium mb-2">End Time</label>
                        <input type="time" id="eventEndTime" 
                            class="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-[#0B4D3E] focus:border-transparent"
                            placeholder="17:00">
                    </div>
                </div>
            </div>
            
            <!-- 地点信息 -->
            <div class="border-b pb-4">
                <h3 class="text-lg font-semibold mb-4 text-[#0B4D3E]">
                    <i class="fas fa-map-marker-alt mr-2"></i>Location
                </h3>
                
                <div class="grid grid-cols-1 gap-4">
                    <div>
                        <label class="block text-sm font-medium mb-2">Venue *</label>
                        <input type="text" id="eventLocation" required 
                            class="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-[#0B4D3E] focus:border-transparent"
                            placeholder="School of Management, Fudan University">
                    </div>
                    
                    <div>
                        <label class="block text-sm font-medium mb-2">Address</label>
                        <input type="text" id="eventAddress" 
                            class="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-[#0B4D3E] focus:border-transparent"
                            placeholder="No. XXX Zhengli Road, Shanghai, China">
                    </div>
                    
                    <div>
                        <label class="block text-sm font-medium mb-2">Room/Building</label>
                        <input type="text" id="eventRoom" 
                            class="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-[#0B4D3E] focus:border-transparent"
                            placeholder="Room F, Building B">
                    </div>
                </div>
            </div>
            
            <!-- 组织者信息 -->
            <div class="border-b pb-4">
                <h3 class="text-lg font-semibold mb-4 text-[#0B4D3E]">
                    <i class="fas fa-users mr-2"></i>Organizer Information
                </h3>
                
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div class="md:col-span-2">
                        <label class="block text-sm font-medium mb-2">Organizer</label>
                        <input type="text" id="eventOrganizer" 
                            class="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-[#0B4D3E] focus:border-transparent"
                            placeholder="School of Management, Fudan University">
                    </div>
                    
                    <div>
                        <label class="block text-sm font-medium mb-2">Contact Email</label>
                        <input type="email" id="eventContactEmail" 
                            class="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-[#0B4D3E] focus:border-transparent"
                            placeholder="contact@giip.info">
                    </div>
                    
                    <div>
                        <label class="block text-sm font-medium mb-2">Contact Phone</label>
                        <input type="tel" id="eventContactPhone" 
                            class="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-[#0B4D3E] focus:border-transparent"
                            placeholder="+86-21-XXXX-XXXX">
                    </div>
                </div>
            </div>
            
            <!-- 链接和资源 -->
            <div class="border-b pb-4">
                <h3 class="text-lg font-semibold mb-4 text-[#0B4D3E]">
                    <i class="fas fa-link mr-2"></i>Links & Resources
                </h3>
                
                <div class="grid grid-cols-1 gap-4">
                    <div>
                        <label class="block text-sm font-medium mb-2">Registration URL</label>
                        <input type="url" id="eventRegistrationUrl" 
                            class="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-[#0B4D3E] focus:border-transparent"
                            placeholder="https://giip.info/register">
                    </div>
                    
                    <div>
                        <label class="block text-sm font-medium mb-2">Agenda/Program URL</label>
                        <input type="url" id="eventAgendaUrl" 
                            class="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-[#0B4D3E] focus:border-transparent"
                            placeholder="https://giip.info/agenda.pdf">
                    </div>
                    
                    <div>
                        <label class="block text-sm font-medium mb-2">Event Website</label>
                        <input type="url" id="eventWebsite" 
                            class="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-[#0B4D3E] focus:border-transparent"
                            placeholder="https://giip.info">
                    </div>
                </div>
            </div>
            
            <!-- 详细议程 -->
            <div class="border-b pb-4">
                <h3 class="text-lg font-semibold mb-4 text-[#0B4D3E]">
                    <i class="fas fa-list-alt mr-2"></i>Detailed Agenda (Optional)
                </h3>
                
                <div>
                    <label class="block text-sm font-medium mb-2">Agenda Content</label>
                    <textarea id="eventDetailedAgenda" rows="8" 
                        class="w-full px-3 py-2 border rounded-lg font-mono text-sm focus:ring-2 focus:ring-[#0B4D3E] focus:border-transparent"
                        placeholder="Paste detailed agenda here...

Example:
9:00 - 10:30 am SESSION 1: SECRET PATENTING
- Paper 1 by Author A
- Paper 2 by Author B

10:30 - 11:00 am TEA BREAK"></textarea>
                    <p class="text-xs text-gray-500 mt-1">You can paste the full agenda text here</p>
                </div>
            </div>
            
            <!-- 演讲者信息 -->
            <div class="border-b pb-4">
                <h3 class="text-lg font-semibold mb-4 text-[#0B4D3E]">
                    <i class="fas fa-microphone mr-2"></i>Speakers/Presenters (Optional)
                </h3>
                
                <div>
                    <label class="block text-sm font-medium mb-2">Speaker List</label>
                    <textarea id="eventSpeakers" rows="6" 
                        class="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-[#0B4D3E] focus:border-transparent"
                        placeholder="List speakers, one per line:

Dr. John Smith - Harvard University
Prof. Jane Doe - MIT
Dr. Wang Wei - Fudan University"></textarea>
                    <p class="text-xs text-gray-500 mt-1">Enter speakers, one per line</p>
                </div>
            </div>
            
            <!-- 附加信息 -->
            <div>
                <h3 class="text-lg font-semibold mb-4 text-[#0B4D3E]">
                    <i class="fas fa-cog mr-2"></i>Additional Information
                </h3>
                
                <div class="grid grid-cols-1 gap-4">
                    <div>
                        <label class="block text-sm font-medium mb-2">Tags</label>
                        <input type="text" id="eventTags" 
                            class="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-[#0B4D3E] focus:border-transparent"
                            placeholder="innovation, IP, conference (comma-separated)">
                    </div>
                    
                    <div>
                        <label class="block text-sm font-medium mb-2">Status</label>
                        <select id="eventStatus" class="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-[#0B4D3E] focus:border-transparent">
                            <option value="draft">Draft</option>
                            <option value="published" selected>Published</option>
                            <option value="cancelled">Cancelled</option>
                        </select>
                    </div>
                    
                    <div class="flex items-center">
                        <input type="checkbox" id="eventFeatured" class="mr-2 w-4 h-4 text-[#0B4D3E] focus:ring-[#0B4D3E]">
                        <label for="eventFeatured" class="text-sm text-gray-700">
                            <i class="fas fa-star text-yellow-500 mr-1"></i>Featured Event (Display prominently on homepage)
                        </label>
                    </div>
                </div>
            </div>
            
            <!-- 提交按钮 -->
            <div class="flex justify-end gap-3 pt-4 border-t sticky bottom-0 bg-white">
                <button type="button" onclick="adminDashboard.closeModal()" 
                    class="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition">
                    <i class="fas fa-times mr-2"></i>Cancel
                </button>
                <button type="submit" 
                    class="px-6 py-2 bg-[#0B4D3E] text-white rounded-lg hover:bg-[#0a3d32] transition">
                    <i class="fas fa-save mr-2"></i>Create Event
                </button>
            </div>
        </form>
    `, 'max-w-4xl'); // 使用更宽的模态框
    
    document.getElementById('eventForm').addEventListener('submit', async (e) => {
        e.preventDefault();
        await this.createEvent();
    });
}

// ============================================
// 2. 创建活动（收集所有字段）
// ============================================
async createEvent() {
    // 收集基本字段
    const basicData = {
        title: document.getElementById('eventTitle').value,
        description: document.getElementById('eventDescription').value,
        date: document.getElementById('eventStartDate').value,
        location: document.getElementById('eventLocation').value,
        capacity: document.getElementById('eventCapacity').value || null
    };
    
    // 收集扩展字段
    const extendedInfo = {
        event_type: document.getElementById('eventType').value,
        end_date: document.getElementById('eventEndDate').value || null,
        start_time: document.getElementById('eventStartTime').value || null,
        end_time: document.getElementById('eventEndTime').value || null,
        address: document.getElementById('eventAddress').value || null,
        room: document.getElementById('eventRoom').value || null,
        organizer: document.getElementById('eventOrganizer').value || null,
        contact_email: document.getElementById('eventContactEmail').value || null,
        contact_phone: document.getElementById('eventContactPhone').value || null,
        registration_url: document.getElementById('eventRegistrationUrl').value || null,
        agenda_url: document.getElementById('eventAgendaUrl').value || null,
        website: document.getElementById('eventWebsite').value || null,
        detailed_agenda: document.getElementById('eventDetailedAgenda').value || null,
        speakers: document.getElementById('eventSpeakers').value || null,
        tags: document.getElementById('eventTags').value || null,
        status: document.getElementById('eventStatus').value,
        featured: document.getElementById('eventFeatured').checked
    };
    
    // 合并数据（将扩展信息存储在 description 中或作为 JSON 字段）
    // 方案1：将扩展信息附加到 description
    const fullDescription = basicData.description + '\n\n' + 
        '<!-- Extended Info: ' + JSON.stringify(extendedInfo) + ' -->';
    
    const data = {
        ...basicData,
        description: fullDescription
    };
    
    // 方案2：如果后端支持，直接发送所有字段
    // const data = {
    //     ...basicData,
    //     ...extendedInfo
    // };
    
    try {
        await EventsAPI.create(data);
        this.showMessage('Event created successfully', 'success');
        this.closeModal();
        this.loadEvents();
        this.loadDashboardData();
    } catch (error) {
        this.showMessage('Failed to create event: ' + error.message, 'error');
    }
}

// ============================================
// 3. 编辑活动（预填充所有字段）
// ============================================
async editEvent(id) {
    try {
        const response = await EventsAPI.getById(id);
        const event = response.data || response;
        
        // 尝试从 description 中提取扩展信息
        let extendedInfo = {};
        try {
            const match = event.description.match(/<!-- Extended Info: (.*?) -->/);
            if (match) {
                extendedInfo = JSON.parse(match[1]);
                // 移除扩展信息标记，只保留原始描述
                event.description = event.description.replace(/\n\n<!-- Extended Info:.*?-->/, '');
            }
        } catch (e) {
            console.log('No extended info found');
        }
        
        const modal = this.createModal('Edit Event', `
            <form id="editEventForm" class="space-y-6 max-h-[70vh] overflow-y-auto px-1">
                <!-- 与添加表单相同的结构，但使用 editEvent 前缀的 ID -->
                <!-- 这里省略重复代码，实际使用时需要完整复制 -->
                
                <div class="flex justify-end gap-3 pt-4 border-t sticky bottom-0 bg-white">
                    <button type="button" onclick="adminDashboard.closeModal()" 
                        class="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition">
                        <i class="fas fa-times mr-2"></i>Cancel
                    </button>
                    <button type="submit" 
                        class="px-6 py-2 bg-[#0B4D3E] text-white rounded-lg hover:bg-[#0a3d32] transition">
                        <i class="fas fa-save mr-2"></i>Update Event
                    </button>
                </div>
            </form>
        `, 'max-w-4xl');
        
        // 预填充基本字段
        document.getElementById('editEventTitle').value = event.title;
        document.getElementById('editEventDescription').value = event.description;
        document.getElementById('editEventStartDate').value = event.date;
        document.getElementById('editEventLocation').value = event.location;
        document.getElementById('editEventCapacity').value = event.capacity || '';
        
        // 预填充扩展字段
        if (extendedInfo.event_type) document.getElementById('editEventType').value = extendedInfo.event_type;
        if (extendedInfo.end_date) document.getElementById('editEventEndDate').value = extendedInfo.end_date;
        if (extendedInfo.start_time) document.getElementById('editEventStartTime').value = extendedInfo.start_time;
        if (extendedInfo.end_time) document.getElementById('editEventEndTime').value = extendedInfo.end_time;
        if (extendedInfo.address) document.getElementById('editEventAddress').value = extendedInfo.address;
        if (extendedInfo.room) document.getElementById('editEventRoom').value = extendedInfo.room;
        if (extendedInfo.organizer) document.getElementById('editEventOrganizer').value = extendedInfo.organizer;
        if (extendedInfo.contact_email) document.getElementById('editEventContactEmail').value = extendedInfo.contact_email;
        if (extendedInfo.contact_phone) document.getElementById('editEventContactPhone').value = extendedInfo.contact_phone;
        if (extendedInfo.registration_url) document.getElementById('editEventRegistrationUrl').value = extendedInfo.registration_url;
        if (extendedInfo.agenda_url) document.getElementById('editEventAgendaUrl').value = extendedInfo.agenda_url;
        if (extendedInfo.website) document.getElementById('editEventWebsite').value = extendedInfo.website;
        if (extendedInfo.detailed_agenda) document.getElementById('editEventDetailedAgenda').value = extendedInfo.detailed_agenda;
        if (extendedInfo.speakers) document.getElementById('editEventSpeakers').value = extendedInfo.speakers;
        if (extendedInfo.tags) document.getElementById('editEventTags').value = extendedInfo.tags;
        if (extendedInfo.status) document.getElementById('editEventStatus').value = extendedInfo.status;
        if (extendedInfo.featured) document.getElementById('editEventFeatured').checked = extendedInfo.featured;
        
        document.getElementById('editEventForm').addEventListener('submit', async (e) => {
            e.preventDefault();
            await this.updateEvent(id);
        });
    } catch (error) {
        this.showMessage('Failed to load event', 'error');
    }
}

// ============================================
// 4. 辅助方法：创建模态框（支持自定义宽度）
// ============================================
createModal(title, content, maxWidth = 'max-w-2xl') {
    const modal = document.createElement('div');
    modal.className = 'modal active';
    modal.innerHTML = `
        <div class="modal-content ${maxWidth} w-full">
            <div class="flex justify-between items-center p-6 border-b">
                <h2 class="text-2xl font-bold text-[#0B4D3E]">${title}</h2>
                <button onclick="adminDashboard.closeModal()" class="text-gray-500 hover:text-gray-700">
                    <i class="fas fa-times text-xl"></i>
                </button>
            </div>
            <div class="p-6">
                ${content}
            </div>
        </div>
    `;
    document.body.appendChild(modal);
    return modal;
}
