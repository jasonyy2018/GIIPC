# 如何访问 GIIP 网站

## 网站入口

所有网站文件都位于 `frontend` 目录下。

### 主要页面

1. **首页**: `frontend/index.html`
2. **关于页面**: `frontend/about.html`
3. **联系页面**: `frontend/contact.html`
4. **管理后台**: `frontend/admin.html`

## 本地访问方法

### 方法 1: 直接打开文件（推荐用于快速预览）

在文件浏览器中，导航到 `frontend` 目录，然后双击 `index.html` 文件。

### 方法 2: 使用本地服务器（推荐用于开发）

#### 使用 Python
```bash
cd frontend
python -m http.server 8000
```
然后在浏览器中访问: `http://localhost:8000`

#### 使用 Node.js (http-server)
```bash
cd frontend
npx http-server -p 8000
```
然后在浏览器中访问: `http://localhost:8000`

#### 使用 VS Code Live Server
1. 在 VS Code 中打开 `frontend` 目录
2. 右键点击 `index.html`
3. 选择 "Open with Live Server"

### 方法 3: 使用 Docker（推荐用于生产环境测试）

```bash
# 启动完整的应用栈
docker-compose up

# 或者只启动前端
docker-compose up frontend
```

前端将在 `http://localhost:3000` 上运行

## 文件结构

```
frontend/
├── index.html              # 首页
├── about.html              # 关于页面
├── contact.html            # 联系页面
├── admin.html              # 管理后台
├── privacy.html            # 隐私政策
├── terms.html              # 服务条款
├── sitemap.html            # 网站地图
├── css/
│   ├── typography.css      # 字体系统
│   └── auth.css           # 认证样式
├── js/
│   ├── common.js          # 通用脚本
│   ├── auth.js            # 认证脚本
│   ├── admin.js           # 管理后台脚本
│   ├── api-client.js      # API 客户端
│   └── data-renderer.js   # 数据渲染
└── images/
    └── giip-logo.png      # 网站 Logo

```

## 重要提示

1. **Logo 和 Favicon**: 已配置使用 `images/giip-logo.png`
2. **菜单链接**: 所有页面的菜单都已正确配置
3. **响应式设计**: 网站支持桌面端和移动端
4. **字体系统**: 使用 Helvetica Neue 字体栈，移动端使用系统字体

## 导航菜单

所有页面都包含以下菜单项：
- Home（首页）
- News（新闻）
- Events（活动）
- Conferences（会议）
- Highlights（亮点）
- About（关于）
- Contact（联系）

## 开发说明

### 修改页面
- 所有 HTML 文件都在 `frontend` 目录下
- CSS 文件在 `frontend/css` 目录下
- JavaScript 文件在 `frontend/js` 目录下

### 添加新页面
1. 在 `frontend` 目录下创建新的 HTML 文件
2. 复制现有页面的头部和导航结构
3. 在所有页面的菜单中添加新页面的链接

### 更新 Logo
替换 `frontend/images/giip-logo.png` 文件即可

## 常见问题

### Q: 为什么 about.html 和 contact.html 显示 404？
A: 确保您是从 `frontend/index.html` 打开的网站，而不是从根目录的其他文件。

### Q: Logo 不显示怎么办？
A: 检查 `frontend/images/giip-logo.png` 文件是否存在。

### Q: 如何测试移动端效果？
A: 
1. 在浏览器中按 F12 打开开发者工具
2. 点击设备工具栏图标（或按 Ctrl+Shift+M）
3. 选择移动设备进行测试

### Q: 如何连接后端 API？
A: 后端 API 运行在 `http://localhost:5000`，前端会自动连接。确保后端服务已启动。

## 部署说明

### 生产环境部署
1. 将 `frontend` 目录的所有文件上传到 Web 服务器
2. 配置 Web 服务器（Nginx/Apache）指向 `index.html`
3. 确保所有静态资源路径正确

### 使用 Docker 部署
```bash
docker-compose up -d
```

这将启动前端（端口 3000）和后端（端口 5000）服务。

## 技术栈

- **HTML5**: 语义化标签
- **Tailwind CSS**: 实用优先的 CSS 框架
- **Vanilla JavaScript**: 无框架依赖
- **Font Awesome**: 图标库
- **Responsive Design**: 移动优先设计

## 浏览器支持

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+
- iOS Safari 14+
- Android Chrome 90+

## 相关文档

- `TYPOGRAPHY_GUIDE.md` - 字体系统指南
- `MOBILE_MENU_FIX.md` - 移动端菜单修复说明
- `LOGO_AND_MENU_UPDATE.md` - Logo 和菜单更新说明
- `ACCESSIBILITY.md` - 无障碍访问指南

---

**最后更新**: 2025年10月19日  
**维护者**: GIIP 开发团队
