# GIIP Frontend

Global Innovation and Intellectual Property (GIIP) 网站前端

## 快速开始

### 本地开发

1. **使用 Python 启动本地服务器**:
   ```bash
   python -m http.server 8000
   ```
   访问: http://localhost:8000

2. **使用 Node.js 启动**:
   ```bash
   npx http-server -p 8000
   ```
   访问: http://localhost:8000

3. **使用 VS Code Live Server**:
   - 右键点击 `index.html`
   - 选择 "Open with Live Server"

### Docker 部署

```bash
# 从项目根目录运行
docker-compose up frontend
```

访问: http://localhost:3000

## 文件结构

```
frontend/
├── index.html              # 首页 ⭐ 主入口
├── about.html              # 关于页面
├── contact.html            # 联系页面
├── admin.html              # 管理后台
├── privacy.html            # 隐私政策
├── terms.html              # 服务条款
├── sitemap.html            # 网站地图
│
├── css/
│   ├── typography.css      # 字体系统（必需）
│   └── auth.css           # 认证样式
│
├── js/
│   ├── common.js          # 通用功能
│   ├── auth.js            # 用户认证
│   ├── admin.js           # 管理功能
│   ├── api-client.js      # API 客户端
│   └── data-renderer.js   # 数据渲染
│
└── images/
    └── giip-logo.png      # 网站 Logo & Favicon
```

## 主要页面

| 页面 | 文件 | 描述 |
|------|------|------|
| 首页 | `index.html` | 包含新闻、活动、会议等所有内容 |
| 关于 | `about.html` | 关于 GIIP 的信息 |
| 联系 | `contact.html` | 联系方式和表单 |
| 管理 | `admin.html` | 管理后台（需要登录） |

## 功能特性

### ✅ 已实现功能

1. **响应式设计**
   - 桌面端（≥768px）
   - 移动端（<768px）
   - 平板适配

2. **导航系统**
   - 桌面端水平导航
   - 移动端侧边抽屉菜单
   - 7个主要菜单项

3. **内容区块**
   - 新闻展示（轮播）
   - 活动列表
   - 会议历史（轮播）
   - 亮点展示
   - 关于我们
   - 联系信息

4. **用户认证**
   - 登录/注册模态框
   - JWT Token 管理
   - 角色权限控制

5. **管理后台**
   - 新闻管理（CRUD）
   - 活动管理（CRUD）
   - 会议管理（CRUD）
   - 用户管理

6. **字体系统**
   - Helvetica Neue 字体栈
   - 移动端系统字体优化
   - 完整的字体大小和行高规范

## 技术栈

- **HTML5**: 语义化标签，无障碍支持
- **Tailwind CSS**: 实用优先的 CSS 框架
- **Vanilla JavaScript**: 无框架依赖，轻量高效
- **Font Awesome 6.4**: 图标库
- **Typography System**: 自定义字体系统

## 样式系统

### CSS 文件加载顺序

```html
<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
<link rel="stylesheet" href="css/typography.css">  <!-- 必需 -->
<link rel="stylesheet" href="css/auth.css">
<script src="https://cdn.tailwindcss.com"></script>
```

### 颜色系统

```javascript
colors: {
    'primary-dark': '#0B4D3E',  // 深绿色
    'primary': '#1B5E20',        // 主绿色
    'primary-light': '#2E7D32',  // 浅绿色
    'accent': '#E63946',         // 强调红色
    'light': '#C8E6C9',          // 浅色背景
    'text': '#424242',           // 文字颜色
}
```

### 字体系统

- **桌面端**: `'Helvetica Neue', Helvetica, Arial, sans-serif`
- **移动端**: 系统字体栈（性能优化）
- **基础字号**: 16px
- **行高**: 1.6（正文）

详见: `TYPOGRAPHY_GUIDE.md`

## API 集成

### 后端 API 地址

- **开发环境**: `http://localhost:5000`
- **生产环境**: 配置在 `js/api-client.js`

### API 端点

```javascript
// 新闻
GET    /api/news
GET    /api/news/:id
POST   /api/news          (需要认证)
PUT    /api/news/:id      (需要认证)
DELETE /api/news/:id      (需要认证)

// 活动
GET    /api/events
GET    /api/events/:id
POST   /api/events        (需要认证)
PUT    /api/events/:id    (需要认证)
DELETE /api/events/:id    (需要认证)

// 会议
GET    /api/conferences
GET    /api/conferences/:id
POST   /api/conferences   (需要认证)
PUT    /api/conferences/:id    (需要认证)
DELETE /api/conferences/:id    (需要认证)

// 认证
POST   /api/auth/register
POST   /api/auth/login
GET    /api/auth/me       (需要认证)
```

## 开发指南

### 添加新页面

1. 复制 `index.html` 作为模板
2. 修改页面内容
3. 更新所有页面的导航菜单
4. 添加到 `sitemap.html`

### 修改样式

1. **全局样式**: 修改 Tailwind 配置
2. **字体样式**: 修改 `css/typography.css`
3. **认证样式**: 修改 `css/auth.css`
4. **自定义样式**: 在 `<style>` 标签中添加

### 添加新功能

1. 在 `js/` 目录创建新的 JS 文件
2. 在 HTML 中引入: `<script src="js/your-file.js"></script>`
3. 使用模块化方式组织代码

## 测试

### 手动测试

1. **桌面端测试**
   - Chrome, Firefox, Safari, Edge
   - 不同分辨率（1920x1080, 1366x768）

2. **移动端测试**
   - iOS Safari
   - Android Chrome
   - 使用浏览器开发者工具

3. **功能测试**
   - 导航菜单
   - 表单提交
   - 用户认证
   - 数据加载

### 测试文件

- `test-frontend.html` - 前端功能测试
- `test-mobile-menu.html` - 移动端菜单测试
- `test-api.html` - API 集成测试

## 性能优化

### 已实现优化

1. **图片优化**
   - 使用 CDN 加载外部图片
   - Logo 使用本地文件

2. **字体优化**
   - 移动端使用系统字体
   - 减少字体加载时间

3. **CSS 优化**
   - 使用 Tailwind CSS（按需加载）
   - 最小化自定义 CSS

4. **JavaScript 优化**
   - 无框架依赖
   - 按需加载脚本

## 无障碍访问

- ✅ 语义化 HTML 标签
- ✅ ARIA 标签支持
- ✅ 键盘导航支持
- ✅ 屏幕阅读器友好
- ✅ 焦点指示器
- ✅ Skip to main content 链接

详见: `ACCESSIBILITY_TEST_CHECKLIST.md`

## 浏览器支持

| 浏览器 | 最低版本 |
|--------|----------|
| Chrome | 90+ |
| Firefox | 88+ |
| Safari | 14+ |
| Edge | 90+ |
| iOS Safari | 14+ |
| Android Chrome | 90+ |

## 常见问题

### Q: Logo 不显示？
**A**: 检查 `images/giip-logo.png` 文件是否存在。

### Q: 菜单链接 404？
**A**: 确保从 `frontend/index.html` 打开，不是根目录。

### Q: API 请求失败？
**A**: 确保后端服务运行在 `http://localhost:5000`。

### Q: 移动端菜单不工作？
**A**: 检查 `js/common.js` 是否正确加载。

### Q: 样式不正确？
**A**: 确保 `css/typography.css` 在 Tailwind 之前加载。

## 部署

### 静态文件部署

1. 将整个 `frontend` 目录上传到服务器
2. 配置 Web 服务器指向 `index.html`
3. 确保 MIME 类型正确配置

### Nginx 配置示例

```nginx
server {
    listen 80;
    server_name giip.info;
    root /var/www/giip/frontend;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }

    location ~* \.(css|js|jpg|jpeg|png|gif|ico|svg)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
}
```

### Docker 部署

使用项目根目录的 `docker-compose.yml`:

```bash
docker-compose up -d frontend
```

## 相关文档

- `TYPOGRAPHY_GUIDE.md` - 字体系统完整指南
- `MOBILE_MENU_FIX.md` - 移动端菜单修复说明
- `LOGO_AND_MENU_UPDATE.md` - Logo 和菜单更新记录
- `ACCESSIBILITY.md` - 无障碍访问指南
- `API_INTEGRATION_SUMMARY.md` - API 集成说明

## 维护

### 定期检查

- [ ] 检查外部 CDN 链接是否有效
- [ ] 更新依赖版本（Font Awesome, Tailwind）
- [ ] 测试所有浏览器兼容性
- [ ] 验证 API 端点
- [ ] 检查图片加载

### 更新日志

查看项目根目录的更新文档了解最新变更。

## 支持

如有问题，请查看：
1. 项目文档
2. 测试文件
3. 浏览器控制台错误信息

---

**版本**: 1.0.0  
**最后更新**: 2025年10月19日  
**维护者**: GIIP 开发团队
