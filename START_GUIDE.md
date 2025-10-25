# GIIP 项目启动指南

## 快速开始

### 方法 1: 使用 Docker（推荐用于完整测试）

#### 启动所有服务
```bash
docker-compose up --build
```

#### 访问地址
- **前端**: http://localhost （自动显示 index.html）
- **后端 API**: http://localhost:3000
- **数据库**: localhost:5432

#### 停止服务
```bash
docker-compose down
```

#### 重新构建
```bash
docker-compose build
docker-compose up
```

### 方法 2: 仅启动前端（推荐用于前端开发）

#### Windows
```bash
# 使用提供的脚本
test-frontend-access.bat

# 或手动启动
cd frontend
python -m http.server 8000
```

#### Linux/Mac
```bash
cd frontend
python3 -m http.server 8000
```

#### 访问地址
- **首页**: http://localhost:8000/index.html
- **关于**: http://localhost:8000/about.html
- **联系**: http://localhost:8000/contact.html
- **诊断**: http://localhost:8000/test-paths.html

### 方法 3: 使用 Node.js

```bash
cd frontend
npx http-server -p 8000
```

访问: http://localhost:8000

## Docker 配置说明

### 服务架构

```
┌─────────────────────────────────────────┐
│  http://localhost (端口 80)             │
│  ┌───────────────────────────────────┐  │
│  │  Frontend (Nginx)                 │  │
│  │  - index.html                     │  │
│  │  - about.html                     │  │
│  │  - contact.html                   │  │
│  │  - images/giip-logo.png           │  │
│  └───────────────────────────────────┘  │
└─────────────────────────────────────────┘
              ↓ API 请求
┌─────────────────────────────────────────┐
│  http://localhost:3000                  │
│  ┌───────────────────────────────────┐  │
│  │  Backend (Node.js/Express)        │  │
│  │  - /api/news                      │  │
│  │  - /api/events                    │  │
│  │  - /api/conferences               │  │
│  │  - /api/auth                      │  │
│  └───────────────────────────────────┘  │
└─────────────────────────────────────────┘
              ↓ 数据库连接
┌─────────────────────────────────────────┐
│  localhost:5432                         │
│  ┌───────────────────────────────────┐  │
│  │  Database (PostgreSQL)            │  │
│  └───────────────────────────────────┘  │
└─────────────────────────────────────────┘
```

### Nginx 配置

**文件**: `frontend/nginx.conf`

```nginx
server {
    listen 80;
    server_name localhost;
    root /usr/share/nginx/html;
    index index.html;  # ← 默认首页
    
    location / {
        try_files $uri $uri/ /index.html;  # ← 找不到文件时返回 index.html
    }
}
```

**说明**:
- 访问 `http://localhost` 自动显示 `index.html`
- 访问 `http://localhost/about.html` 显示关于页面
- 访问 `http://localhost/contact.html` 显示联系页面

### Dockerfile 配置

**文件**: `frontend/Dockerfile`

已更新为复制所有必要文件：
- ✅ index.html
- ✅ about.html
- ✅ contact.html
- ✅ admin.html
- ✅ privacy.html
- ✅ terms.html
- ✅ sitemap.html
- ✅ images/ 目录（包含 logo）
- ✅ css/ 目录
- ✅ js/ 目录

## 验证步骤

### 1. 使用 Docker

```bash
# 启动服务
docker-compose up --build

# 在浏览器中测试
# 1. 打开 http://localhost
# 2. 应该看到 GIIP 首页
# 3. 检查 logo 是否显示
# 4. 点击 About 菜单
# 5. 点击 Contact 菜单
```

### 2. 使用本地服务器

```bash
# 启动服务
cd frontend
python -m http.server 8000

# 在浏览器中测试
# 1. 打开 http://localhost:8000
# 2. 应该看到 GIIP 首页
# 3. 检查 logo 是否显示
# 4. 点击 About 菜单
# 5. 点击 Contact 菜单
```

### 3. 诊断测试

如果有问题，访问诊断页面：

**Docker**: http://localhost/test-paths.html  
**本地服务器**: http://localhost:8000/test-paths.html

## 常见问题

### Q1: Docker 启动后访问 localhost 显示 404

**原因**: 
- Dockerfile 没有复制所有文件
- 需要重新构建镜像

**解决方案**:
```bash
# 停止并删除容器
docker-compose down

# 重新构建
docker-compose build --no-cache

# 启动
docker-compose up
```

### Q2: Logo 不显示

**检查**:
1. 确认 `frontend/images/giip-logo.png` 文件存在
2. 如果使用 Docker，重新构建镜像
3. 检查浏览器控制台是否有 404 错误

**Docker 解决方案**:
```bash
# 重新构建前端镜像
docker-compose build web
docker-compose up web
```

### Q3: about.html 和 contact.html 显示 404

**检查**:
1. 确认文件存在于 `frontend/` 目录
2. 如果使用 Docker，确认 Dockerfile 复制了这些文件
3. 重新构建镜像

**解决方案**:
```bash
# 检查文件是否存在
ls frontend/about.html
ls frontend/contact.html

# 如果使用 Docker，重新构建
docker-compose build web
docker-compose up web
```

### Q4: 访问 localhost 没有自动显示 index.html

**检查 nginx 配置**:
```nginx
# 应该有这两行
index index.html;
location / {
    try_files $uri $uri/ /index.html;
}
```

**解决方案**:
1. 检查 `frontend/nginx.conf` 配置
2. 重新构建 Docker 镜像

## 端口说明

### Docker 模式
- **80**: 前端 (Nginx)
- **3000**: 后端 API (Express)
- **5432**: 数据库 (PostgreSQL)

### 本地开发模式
- **8000**: 前端 (Python HTTP Server)
- **5000**: 后端 API (如果单独启动)

## 环境变量

复制 `.env.example` 到 `.env` 并配置：

```bash
cp .env.example .env
```

**必需的环境变量**:
```env
DB_NAME=giip_db
DB_USER=giip_user
DB_PASSWORD=your_secure_password
JWT_SECRET=your_jwt_secret_key
```

## 开发工作流

### 前端开发
```bash
# 1. 修改前端文件
# 2. 刷新浏览器查看更改
# 3. 不需要重启服务器
```

### 前端 + Docker
```bash
# 1. 修改前端文件
# 2. 重新构建镜像
docker-compose build web
# 3. 重启服务
docker-compose up web
```

### 全栈开发
```bash
# 1. 启动所有服务
docker-compose up

# 2. 修改代码后重新构建
docker-compose build
docker-compose up
```

## 测试清单

### 前端测试
- [ ] 访问 http://localhost 显示首页
- [ ] Logo 在导航栏显示
- [ ] Logo 在页脚显示
- [ ] Favicon 在浏览器标签显示
- [ ] 点击 About 链接正常
- [ ] 点击 Contact 链接正常
- [ ] 移动端菜单正常工作
- [ ] 响应式设计正常

### 后端测试
- [ ] 访问 http://localhost:3000/api/health 返回 OK
- [ ] API 端点正常响应
- [ ] 数据库连接正常

### 集成测试
- [ ] 前端可以调用后端 API
- [ ] 用户认证功能正常
- [ ] 数据加载和显示正常

## 日志查看

### Docker 日志
```bash
# 查看所有服务日志
docker-compose logs

# 查看前端日志
docker-compose logs web

# 查看后端日志
docker-compose logs api

# 实时查看日志
docker-compose logs -f
```

## 清理和重置

### 停止服务
```bash
docker-compose down
```

### 删除数据卷
```bash
docker-compose down -v
```

### 完全清理
```bash
# 停止并删除所有容器、网络、数据卷
docker-compose down -v

# 删除镜像
docker rmi giip-frontend giip-backend

# 重新开始
docker-compose up --build
```

## 生产部署

### 构建生产镜像
```bash
docker-compose -f docker-compose.yml build
```

### 推送到仓库
```bash
docker tag giip-frontend your-registry/giip-frontend:latest
docker push your-registry/giip-frontend:latest
```

## 相关文档

- `FINAL_FIX_SUMMARY.md` - 最新修复说明
- `HOW_TO_ACCESS.md` - 访问指南
- `frontend/README.md` - 前端文档
- `backend/README.md` - 后端文档
- `DOCKER_GUIDE.md` - Docker 详细指南

---

**最后更新**: 2025年10月19日  
**状态**: ✅ 所有配置已更新和验证
