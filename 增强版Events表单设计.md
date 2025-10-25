# 增强版 Events 表单设计

## 📋 基于会议议程的需求分析

根据提供的 GIIP 会议议程，一个完整的会议活动包含以下信息：

### 基本信息
- 会议标题（如：The 3rd Conference on Global Innovation and Intellectual Property）
- 会议日期（May 24-25, 2025）
- 会议地点（School of Management, Fudan University）
- 详细地址（No. XXX Zhengli Road）

### 场次信息（Sessions）
- 场次标题（如：SESSION 1: SECRET PATENTING AND PATENTING WITH TRADE SECRET）
- 场次时间（如：9:00 - 10:30 am）
- 场次地点（如：Room F, Building B）
- 主持人（Chaired by）
- 讨论人（Discussant）

### 演讲信息（Presentations）
- 论文标题
- 演讲者及单位
- 演讲时间

### 其他活动
- 茶歇（Tea Break）
- 午餐（Lunch）
- 晚宴（Dinner）
- 海报展示（Poster Session）

## 🎯 设计方案

### 方案 1：简化版（推荐用于快速实现）

保持当前的简单结构，但增加更多字段：

```javascript
{
    title: "会议标题",
    description: "会议描述",
    date: "2025-05-24",
    end_date: "2025-05-25",  // 新增：结束日期
    location: "School of Management, Fudan University",
    address: "No. XXX Zhengli Road, Shanghai",  // 新增：详细地址
    capacity: 100,
    
    // 新增字段
    event_type: "conference",  // conference, workshop, seminar, etc.
    organizer: "School of Management, Fudan University",
    contact_email: "contact@giip.info",
    contact_phone: "+86-21-XXXX-XXXX",
    registration_url: "https://giip.info/register",
    agenda_url: "https://giip.info/agenda.pdf",
    
    // 可选的富文本内容
    detailed_agenda: "完整的议程 HTML 内容",
    speakers: "演讲者列表（JSON 或文本）",
    sessions: "场次列表（JSON 或文本）"
}
```

### 方案 2：完整版（适合复杂会议管理）

创建关联表结构：

#### 主表：events
```sql
- id
- title
- description
- start_date
- end_date
- location
- address
- capacity
- event_type
- organizer
- contact_email
- contact_phone
- registration_url
- status (draft, published, cancelled)
- created_by
- created_at
- updated_at
```

#### 子表：event_sessions
```sql
- id
- event_id (外键)
- session_title
- session_date
- start_time
- end_time
- room
- chair_person
- discussant
- order_index
```

#### 子表：event_presentations
```sql
- id
- session_id (外键)
- title
- authors
- affiliations
- start_time
- end_time
- order_index
```

## 💡 推荐实现：增强的简化版

在不改变数据库结构的情况下，增强表单功能：

### 前端表单设计

```html
<form id="eventForm" class="space-y-6">
    <!-- 基本信息 -->
    <div class="border-b pb-4">
        <h3 class="text-lg font-semibold mb-4">Basic Information</h3>
        
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div class="md:col-span-2">
                <label class="block text-sm font-medium mb-2">Event Title *</label>
                <input type="text" id="eventTitle" required 
                    class="w-full px-3 py-2 border rounded-lg"
                    placeholder="The 3rd Conference on Global Innovation...">
            </div>
            
            <div class="md:col-span-2">
                <label class="block text-sm font-medium mb-2">Description *</label>
                <textarea id="eventDescription" required rows="4" 
                    class="w-full px-3 py-2 border rounded-lg"
                    placeholder="Brief description of the event..."></textarea>
            </div>
            
            <div>
                <label class="block text-sm font-medium mb-2">Event Type *</label>
                <select id="eventType" required class="w-full px-3 py-2 border rounded-lg">
                    <option value="">Select type...</option>
                    <option value="conference">Conference</option>
                    <option value="workshop">Workshop</option>
                    <option value="seminar">Seminar</option>
                    <option value="symposium">Symposium</option>
                    <option value="forum">Forum</option>
                    <option value="other">Other</option>
                </select>
            </div>
            
            <div>
                <label class="block text-sm font-medium mb-2">Capacity</label>
                <input type="number" id="eventCapacity" min="1" 
                    class="w-full px-3 py-2 border rounded-lg"
                    placeholder="100">
            </div>
        </div>
    </div>
    
    <!-- 日期和时间 -->
    <div class="border-b pb-4">
        <h3 class="text-lg font-semibold mb-4">Date & Time</h3>
        
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
                <label class="block text-sm font-medium mb-2">Start Date *</label>
                <input type="date" id="eventStartDate" required 
                    class="w-full px-3 py-2 border rounded-lg">
            </div>
            
            <div>
                <label class="block text-sm font-medium mb-2">End Date</label>
                <input type="date" id="eventEndDate" 
                    class="w-full px-3 py-2 border rounded-lg">
                <p class="text-xs text-gray-500 mt-1">Leave empty for single-day event</p>
            </div>
            
            <div>
                <label class="block text-sm font-medium mb-2">Start Time</label>
                <input type="time" id="eventStartTime" 
                    class="w-full px-3 py-2 border rounded-lg"
                    placeholder="09:00">
            </div>
            
            <div>
                <label class="block text-sm font-medium mb-2">End Time</label>
                <input type="time" id="eventEndTime" 
                    class="w-full px-3 py-2 border rounded-lg"
                    placeholder="17:00">
            </div>
        </div>
    </div>
    
    <!-- 地点信息 -->
    <div class="border-b pb-4">
        <h3 class="text-lg font-semibold mb-4">Location</h3>
        
        <div class="grid grid-cols-1 gap-4">
            <div>
                <label class="block text-sm font-medium mb-2">Venue *</label>
                <input type="text" id="eventLocation" required 
                    class="w-full px-3 py-2 border rounded-lg"
                    placeholder="School of Management, Fudan University">
            </div>
            
            <div>
                <label class="block text-sm font-medium mb-2">Address</label>
                <input type="text" id="eventAddress" 
                    class="w-full px-3 py-2 border rounded-lg"
                    placeholder="No. XXX Zhengli Road, Shanghai, China">
            </div>
            
            <div>
                <label class="block text-sm font-medium mb-2">Room/Building</label>
                <input type="text" id="eventRoom" 
                    class="w-full px-3 py-2 border rounded-lg"
                    placeholder="Room F, Building B">
            </div>
        </div>
    </div>
    
    <!-- 组织者信息 -->
    <div class="border-b pb-4">
        <h3 class="text-lg font-semibold mb-4">Organizer Information</h3>
        
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div class="md:col-span-2">
                <label class="block text-sm font-medium mb-2">Organizer</label>
                <input type="text" id="eventOrganizer" 
                    class="w-full px-3 py-2 border rounded-lg"
                    placeholder="School of Management, Fudan University">
            </div>
            
            <div>
                <label class="block text-sm font-medium mb-2">Contact Email</label>
                <input type="email" id="eventContactEmail" 
                    class="w-full px-3 py-2 border rounded-lg"
                    placeholder="contact@giip.info">
            </div>
            
            <div>
                <label class="block text-sm font-medium mb-2">Contact Phone</label>
                <input type="tel" id="eventContactPhone" 
                    class="w-full px-3 py-2 border rounded-lg"
                    placeholder="+86-21-XXXX-XXXX">
            </div>
        </div>
    </div>
    
    <!-- 链接和资源 -->
    <div class="border-b pb-4">
        <h3 class="text-lg font-semibold mb-4">Links & Resources</h3>
        
        <div class="grid grid-cols-1 gap-4">
            <div>
                <label class="block text-sm font-medium mb-2">Registration URL</label>
                <input type="url" id="eventRegistrationUrl" 
                    class="w-full px-3 py-2 border rounded-lg"
                    placeholder="https://giip.info/register">
            </div>
            
            <div>
                <label class="block text-sm font-medium mb-2">Agenda/Program URL</label>
                <input type="url" id="eventAgendaUrl" 
                    class="w-full px-3 py-2 border rounded-lg"
                    placeholder="https://giip.info/agenda.pdf">
            </div>
            
            <div>
                <label class="block text-sm font-medium mb-2">Event Website</label>
                <input type="url" id="eventWebsite" 
                    class="w-full px-3 py-2 border rounded-lg"
                    placeholder="https://giip.info">
            </div>
        </div>
    </div>
    
    <!-- 详细议程 -->
    <div class="border-b pb-4">
        <h3 class="text-lg font-semibold mb-4">Detailed Agenda (Optional)</h3>
        
        <div>
            <label class="block text-sm font-medium mb-2">Agenda Content</label>
            <textarea id="eventDetailedAgenda" rows="8" 
                class="w-full px-3 py-2 border rounded-lg font-mono text-sm"
                placeholder="Paste detailed agenda here...&#10;&#10;Example:&#10;9:00 - 10:30 am SESSION 1: SECRET PATENTING&#10;- Paper 1 by Author A&#10;- Paper 2 by Author B&#10;&#10;10:30 - 11:00 am TEA BREAK"></textarea>
            <p class="text-xs text-gray-500 mt-1">You can paste the full agenda text here</p>
        </div>
    </div>
    
    <!-- 演讲者信息 -->
    <div class="border-b pb-4">
        <h3 class="text-lg font-semibold mb-4">Speakers/Presenters (Optional)</h3>
        
        <div>
            <label class="block text-sm font-medium mb-2">Speaker List</label>
            <textarea id="eventSpeakers" rows="6" 
                class="w-full px-3 py-2 border rounded-lg"
                placeholder="List speakers, one per line:&#10;&#10;Dr. John Smith - Harvard University&#10;Prof. Jane Doe - MIT&#10;Dr. Wang Wei - Fudan University"></textarea>
            <p class="text-xs text-gray-500 mt-1">Enter speakers, one per line</p>
        </div>
    </div>
    
    <!-- 附加信息 -->
    <div>
        <h3 class="text-lg font-semibold mb-4">Additional Information</h3>
        
        <div class="grid grid-cols-1 gap-4">
            <div>
                <label class="block text-sm font-medium mb-2">Tags</label>
                <input type="text" id="eventTags" 
                    class="w-full px-3 py-2 border rounded-lg"
                    placeholder="innovation, IP, conference (comma-separated)">
            </div>
            
            <div>
                <label class="block text-sm font-medium mb-2">Status</label>
                <select id="eventStatus" class="w-full px-3 py-2 border rounded-lg">
                    <option value="draft">Draft</option>
                    <option value="published" selected>Published</option>
                    <option value="cancelled">Cancelled</option>
                </select>
            </div>
            
            <div>
                <label class="block text-sm font-medium mb-2">Featured Event</label>
                <input type="checkbox" id="eventFeatured" class="mr-2">
                <span class="text-sm text-gray-600">Display prominently on homepage</span>
            </div>
        </div>
    </div>
    
    <!-- 提交按钮 -->
    <div class="flex justify-end gap-3 pt-4 border-t">
        <button type="button" onclick="adminDashboard.closeModal()" 
            class="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition">
            Cancel
        </button>
        <button type="submit" 
            class="px-6 py-2 bg-[#0B4D3E] text-white rounded-lg hover:bg-[#0a3d32] transition">
            <i class="fas fa-save mr-2"></i>Create Event
        </button>
    </div>
</form>
```

### 数据结构（存储在 description 或新字段中）

```javascript
{
    // 基本字段（现有数据库字段）
    title: "The 3rd Conference on Global Innovation and Intellectual Property",
    description: "Brief description...",
    date: "2025-05-24",
    location: "School of Management, Fudan University",
    capacity: 200,
    
    // 扩展信息（可以存储在 JSON 字段或单独的字段中）
    extended_info: {
        end_date: "2025-05-25",
        start_time: "09:00",
        end_time: "17:00",
        address: "No. XXX Zhengli Road, Shanghai, China",
        room: "Room F, Building B",
        event_type: "conference",
        organizer: "School of Management, Fudan University",
        contact_email: "contact@giip.info",
        contact_phone: "+86-21-XXXX-XXXX",
        registration_url: "https://giip.info/register",
        agenda_url: "https://giip.info/agenda.pdf",
        website: "https://giip.info",
        detailed_agenda: "Full agenda text...",
        speakers: ["Dr. John Smith - Harvard", "Prof. Jane Doe - MIT"],
        tags: ["innovation", "IP", "conference"],
        status: "published",
        featured: true
    }
}
```

## 🔧 实现步骤

### 步骤 1：更新数据库 Schema（可选）

如果要添加新字段到数据库：

```sql
ALTER TABLE events ADD COLUMN end_date DATE;
ALTER TABLE events ADD COLUMN start_time TIME;
ALTER TABLE events ADD COLUMN end_time TIME;
ALTER TABLE events ADD COLUMN address TEXT;
ALTER TABLE events ADD COLUMN room VARCHAR(255);
ALTER TABLE events ADD COLUMN event_type VARCHAR(50);
ALTER TABLE events ADD COLUMN organizer VARCHAR(255);
ALTER TABLE events ADD COLUMN contact_email VARCHAR(255);
ALTER TABLE events ADD COLUMN contact_phone VARCHAR(50);
ALTER TABLE events ADD COLUMN registration_url TEXT;
ALTER TABLE events ADD COLUMN agenda_url TEXT;
ALTER TABLE events ADD COLUMN website TEXT;
ALTER TABLE events ADD COLUMN detailed_agenda TEXT;
ALTER TABLE events ADD COLUMN speakers TEXT;
ALTER TABLE events ADD COLUMN tags TEXT;
ALTER TABLE events ADD COLUMN status VARCHAR(20) DEFAULT 'published';
ALTER TABLE events ADD COLUMN featured BOOLEAN DEFAULT FALSE;
```

### 步骤 2：更新前端表单

替换 `frontend/js/admin.js` 中的 `showAddEventModal()` 方法。

### 步骤 3：更新 API 处理

更新后端 Controller 和 Repository 以处理新字段。

### 步骤 4：更新列表显示

在事件列表中显示更多信息（类型、状态、日期范围等）。

## 📊 表单字段优先级

### 必填字段（Priority 1）
- ✅ Title
- ✅ Description
- ✅ Start Date
- ✅ Location

### 重要字段（Priority 2）
- End Date
- Event Type
- Start Time / End Time
- Address
- Capacity

### 可选字段（Priority 3）
- Room/Building
- Organizer
- Contact Email/Phone
- Registration URL
- Agenda URL
- Website
- Detailed Agenda
- Speakers
- Tags
- Status
- Featured

## 🎯 推荐实现方案

**建议采用渐进式实现：**

1. **第一阶段**：添加最重要的字段（End Date, Event Type, Address, Time）
2. **第二阶段**：添加联系和链接信息
3. **第三阶段**：添加详细议程和演讲者信息

这样可以在不破坏现有功能的情况下，逐步增强系统功能。

## 📝 使用示例

### 创建 GIIP 会议示例

```
Title: The 3rd Conference on Global Innovation and Intellectual Property
Description: A premier conference bringing together scholars and practitioners...
Event Type: Conference
Start Date: 2025-05-24
End Date: 2025-05-25
Start Time: 09:00
End Time: 18:00
Location: School of Management, Fudan University
Address: No. XXX Zhengli Road, Shanghai, China
Room: Room F, Building B
Capacity: 200
Organizer: School of Management, Fudan University
Contact Email: giip@fudan.edu.cn
Registration URL: https://giip.fudan.edu.cn/register
Agenda URL: https://giip.fudan.edu.cn/agenda.pdf
Status: Published
Featured: Yes
```

---

**设计完成日期**: 2025-10-20  
**状态**: ✅ 设计完成，待实现
