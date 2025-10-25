# 用户菜单实现

## ✨ 新功能

将桌面端的 Login/Register 按钮改为用户头像下拉菜单。

## 🎨 UI 设计

### 未登录状态
```
[Login] [Register]  ← 右对齐
```

### 登录状态
```
[A] admin@giip.info ▼  ← 右对齐，点击显示下拉菜单
```

### 下拉菜单内容
```
┌─────────────────────────┐
│ Signed in as            │
│ admin@giip.info         │
│ (Admin)                 │
├─────────────────────────┤
│ ⚙ Admin Dashboard       │
│ 🚪 Logout               │
└─────────────────────────┘
```

## 📝 实现细节

### 1. HTML 结构 (index.html)

```html
<!-- User Menu (Desktop) -->
<div class="auth-links ml-[40px] relative">
    <!-- Logged Out State -->
    <div id="auth-logged-out" class="flex items-center gap-3">
        <a href="#login">Login</a>
        <a href="#register">Register</a>
    </div>
    
    <!-- Logged In State (Hidden by default) -->
    <div id="auth-logged-in" class="hidden">
        <button id="user-menu-button">
            <div class="w-10 h-10 rounded-full bg-accent">
                <span id="user-avatar-text">A</span>
            </div>
            <span id="user-email">admin@giip.info</span>
            <i class="fas fa-chevron-down"></i>
        </button>
        
        <!-- Dropdown Menu -->
        <div id="user-dropdown" class="hidden absolute right-0">
            <div class="user-info">...</div>
            <a href="admin.html">Admin Dashboard</a>
            <button id="logout-button">Logout</button>
        </div>
    </div>
</div>
```

### 2. JavaScript 逻辑 (auth.js)

#### updateAuthUI()
- 检查用户登录状态
- 显示/隐藏相应的UI元素
- 更新用户信息（邮箱、角色、头像）

#### setupUserMenuDropdown()
- 监听菜单按钮点击事件
- 切换下拉菜单显示/隐藏
- 点击外部区域关闭菜单
- 处理 Logout 按钮点击

## 🎯 功能特性

### 桌面端

#### 未登录
- ✅ 显示 Login 和 Register 按钮
- ✅ 右对齐显示
- ✅ 点击弹出登录/注册模态框

#### 已登录
- ✅ 显示用户头像（首字母）
- ✅ 显示用户邮箱
- ✅ 点击显示下拉菜单
- ✅ 下拉菜单包含：
  - 用户信息（邮箱、角色）
  - Admin Dashboard 链接（仅管理员/编辑）
  - Logout 按钮
- ✅ 点击外部区域关闭菜单
- ✅ Logout 后返回未登录状态

### 移动端

#### 未登录
- ✅ 显示 Login 和 Register 按钮
- ✅ 在移动端菜单底部

#### 已登录
- ✅ 显示用户信息（邮箱、角色）
- ✅ 显示 Admin Dashboard 按钮（仅管理员/编辑）
- ✅ 显示 Logout 按钮
- ✅ 在移动端菜单底部

## 🎨 样式说明

### 头像
- 圆形背景（bg-accent）
- 显示邮箱首字母
- 大小：40x40px

### 下拉菜单
- 白色背景
- 圆角阴影
- 右对齐
- 宽度：224px (w-56)
- z-index: 50

### 菜单项
- Hover 效果：灰色背景
- Admin Dashboard：灰色文字
- Logout：红色文字

## 📱 响应式设计

### 桌面端 (≥768px)
- 显示用户头像下拉菜单
- 右对齐在导航栏

### 移动端 (<768px)
- 在移动端菜单底部显示
- 垂直布局
- 全宽按钮

## 🔧 使用方法

### 登录后自动更新
```javascript
// 登录成功后
authManager.updateAuthUI();
```

### 手动触发更新
```javascript
// 页面加载时
authManager.init();
```

### 登出
```javascript
// 点击 Logout 按钮
authManager.logout();
```

## 🧪 测试步骤

### 1. 未登录状态
```
1. 打开 index.html
2. 查看右上角
3. 应该看到 Login 和 Register 按钮
4. 右对齐显示
```

### 2. 登录
```
1. 点击 Login 按钮
2. 输入：admin@giip.info / admin123
3. 登录成功
4. 右上角应该显示用户头像和邮箱
```

### 3. 用户菜单
```
1. 点击用户头像/邮箱
2. 应该显示下拉菜单
3. 包含：
   - 用户信息
   - Admin Dashboard 链接
   - Logout 按钮
```

### 4. 下拉菜单交互
```
1. 点击菜单外部
2. 菜单应该关闭
3. 点击 Admin Dashboard
4. 应该跳转到 admin.html
```

### 5. 登出
```
1. 点击 Logout 按钮
2. 应该返回未登录状态
3. 显示 Login 和 Register 按钮
```

### 6. 移动端测试
```
1. F12 → Ctrl+Shift+M (移动端视图)
2. 点击菜单按钮
3. 滚动到底部
4. 应该看到用户信息和 Logout 按钮
```

## 📊 状态管理

### LocalStorage
```javascript
{
    authToken: "jwt_token_here",
    user: {
        email: "admin@giip.info",
        role: "admin"
    }
}
```

### UI 状态
- `#auth-logged-out` - 未登录时显示
- `#auth-logged-in` - 登录后显示
- `#user-dropdown` - 下拉菜单（默认隐藏）

## 🎯 总结

**实现的功能：**
1. ✅ 用户头像显示（首字母）
2. ✅ 用户邮箱显示
3. ✅ 下拉菜单（点击切换）
4. ✅ Admin Dashboard 链接
5. ✅ Logout 功能
6. ✅ 点击外部关闭菜单
7. ✅ 登录/登出状态切换
8. ✅ 移动端适配
9. ✅ 右对齐显示

**用户体验：**
- 清晰的登录状态指示
- 便捷的菜单访问
- 流畅的交互动画
- 响应式设计
