# GIIP 全栈应用

全球创新与知识产权 (GIIP) 平台 - 一个现代化的全栈 Web 应用系统。

## 技术栈

### 前端
- Tailwind CSS v3.4+
- Vanilla JavaScript
- Font Awesome 6.4.0

### 后端
- Node.js v18+
- Express v4.18+
- PostgreSQL v16
- JWT 认证
- RBAC 权限控制

### 部署
- Docker & Docker Compose
- Nginx

## 功能特性

- 🔐 用户认证和授权 (JWT + RBAC)
- 📰 新闻内容管理
- 📅 活动管理
- 🎤 会议管理
- 👥 用户和角色管理
- 📱 响应式设计
- 🐳 Docker 容器化部署

## 快速开始

### 前置要求

- Docker 和 Docker Compose
- Node.js v18+ (本地开发)
- PostgreSQL v16 (本地开发)

### 使用 Docker 运行 (推荐)

#### 方式 1: 使用快速启动脚本

**Linux/Mac:**
```bash
chmod +x start-docker.sh
./start-docker.sh
```

**Windows:**
```cmd
start-docker.bat
```

#### 方式 2: 手动启动

1. 克隆仓库
```bash
git clone <repository-url>
cd giip-fullstack-app
```

2. 配置环境变量
```bash
cp .env.example .env
# 编辑 .env 文件,设置数据库密码和 JWT 密钥
# 生成强 JWT 密钥: openssl rand -base64 32
```

3. 启动所有服务
```bash
docker-compose up -d
```

4. 检查服务状态
```bash
docker-compose ps
```

5. 访问应用
- 前端: http://localhost
- 前端健康检查: http://localhost/health
- API: http://localhost:3000
- API 健康检查: http://localhost:3000/api/health
- 数据库: localhost:5432

### 默认测试账户

系统预置了三个测试账户,密码均为 `password`:

| 角色 | 邮箱 | 权限 |
|------|------|------|
| Admin | admin@giip.com | 所有权限 |
| Editor | editor@giip.com | 读写新闻、活动、会议 |
| User | user@giip.com | 只读权限 |

**示例登录**:
```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@giip.com","password":"password"}'
```

⚠️ **生产环境请务必修改这些默认密码!**

6. 查看日志
```bash
# 所有服务
docker-compose logs -f

# 特定服务
docker-compose logs -f api
```

7. 停止服务
```bash
docker-compose down
```

📖 **详细的 Docker 使用指南请参考 [DOCKER_GUIDE.md](DOCKER_GUIDE.md)**

### 本地开发

#### 后端开发

```bash
cd backend
npm install
npm run dev
```

#### 前端开发

前端使用静态 HTML,直接在浏览器中打开 `frontend/index.html` 或使用本地服务器:

```bash
cd frontend
# 使用 Python
python -m http.server 8000

# 或使用 Node.js
npx serve
```

## 项目结构

```
giip-fullstack-app/
├── frontend/              # 前端应用
│   ├── index.html        # 主页面
│   ├── css/              # 样式文件
│   └── js/               # JavaScript 文件
├── backend/              # 后端 API
│   ├── src/
│   │   ├── config/       # 配置文件
│   │   ├── controllers/  # 控制器
│   │   ├── middleware/   # 中间件
│   │   ├── services/     # 业务逻辑
│   │   ├── repositories/ # 数据访问层
│   │   └── routes/       # 路由定义
│   ├── schema.sql        # 数据库架构
│   ├── seeds/            # 种子数据
│   └── package.json
├── docker-compose.yml    # Docker Compose 配置
├── .env.example          # 环境变量示例
└── README.md
```

## API 文档

完整的 API 文档请参考 **[API_DOCUMENTATION.md](./API_DOCUMENTATION.md)**

### 快速参考

#### 认证端点
- `POST /api/auth/register` - 用户注册
- `POST /api/auth/login` - 用户登录

#### 内容管理端点
- `GET /api/news` - 获取新闻列表
- `POST /api/news` - 创建新闻 (需要 `write:news` 权限)
- `PUT /api/news/:id` - 更新新闻 (需要所有权或 `edit:news` 权限)
- `DELETE /api/news/:id` - 删除新闻 (需要 `delete:news` 权限)

- `GET /api/events` - 获取活动列表
- `POST /api/events` - 创建活动 (需要 `write:events` 权限)
- `PUT /api/events/:id` - 更新活动
- `DELETE /api/events/:id` - 删除活动

- `GET /api/conferences` - 获取会议列表
- `POST /api/conferences` - 创建会议 (需要 `write:conferences` 权限)
- `PUT /api/conferences/:id` - 更新会议
- `DELETE /api/conferences/:id` - 删除会议

#### 管理员端点
- `GET /api/admin/users` - 获取所有用户 (仅 admin)
- `PUT /api/admin/users/:id/role` - 修改用户角色 (仅 admin)
- `POST /api/admin/roles` - 创建角色 (仅 admin)
- `POST /api/admin/roles/:id/permissions` - 分配权限 (仅 admin)

### API 使用示例

```bash
# 1. 注册用户
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"user@giip.info","password":"SecurePass123!"}'

# 2. 登录获取 token
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"user@giip.info","password":"SecurePass123!"}'

# 3. 使用 token 访问受保护资源
curl http://localhost:3000/api/news \
  -H "Authorization: Bearer YOUR_TOKEN"
```

## 环境变量

查看 `.env.example` 文件了解所有必需的环境变量。

主要配置项:
- `DB_NAME` - 数据库名称
- `DB_USER` - 数据库用户
- `DB_PASSWORD` - 数据库密码
- `JWT_SECRET` - JWT 签名密钥
- `FRONTEND_URL` - 前端 URL (用于 CORS)

## 📚 文档

**完整文档索引**: [DOCUMENTATION_INDEX.md](./DOCUMENTATION_INDEX.md) - 所有文档的导航和分类

### 核心文档
- **[API 文档](./API_DOCUMENTATION.md)** - 完整的 API 端点文档
- **[贡献指南](./CONTRIBUTING.md)** - 开发规范和贡献流程
- **[Docker 指南](./DOCKER_GUIDE.md)** - Docker 部署详细说明
- **[生产部署指南](./DEPLOYMENT.md)** - 生产环境部署完整指南
- **[可访问性](./ACCESSIBILITY.md)** - 可访问性实现说明

### 后端文档
- **[后端 README](./backend/README.md)** - 后端概述
- **[RBAC 快速入门](./backend/docs/RBAC_QUICKSTART.md)** - 权限系统快速上手
- **[RBAC 完整指南](./backend/docs/RBAC_GUIDE.md)** - 权限系统详细文档
- **[安全实现](./backend/docs/SECURITY_IMPLEMENTATION.md)** - 安全措施文档
- **[错误处理](./backend/docs/ERROR_HANDLING.md)** - 错误处理指南
- **[性能优化](./backend/docs/PERFORMANCE_OPTIMIZATION.md)** - 性能优化指南
- **[性能测试](./backend/docs/PERFORMANCE_TESTING.md)** - 性能测试说明

### 前端文档
- **[使用指南](./frontend/USAGE_GUIDE.md)** - 前端使用说明
- **[API 集成](./frontend/API_INTEGRATION_SUMMARY.md)** - API 集成文档

## 开发指南

详细的开发指南请参考 **[CONTRIBUTING.md](./CONTRIBUTING.md)**

### 快速参考

#### 代码规范
- 使用 ES6+ 语法
- 遵循 RESTful API 设计原则
- 所有 API 响应使用统一的 JSON 格式
- 使用 Zod 进行输入验证
- 使用 2 空格缩进
- 使用参数化查询防止 SQL 注入

#### 安全最佳实践
- ✅ 所有密码使用 bcrypt 哈希 (salt rounds = 10)
- ✅ JWT token 有效期为 1 小时
- ✅ 使用参数化查询防止 SQL 注入
- ✅ 实施 CORS 和安全 HTTP 头 (Helmet.js)
- ✅ 敏感配置存储在环境变量中
- ✅ 输入验证和清理 (Zod)
- ✅ 速率限制 (登录: 5次/15分钟, API: 100次/15分钟)

#### 提交规范
使用 Conventional Commits 格式:
```bash
feat(auth): add JWT token refresh endpoint
fix(news): resolve pagination issue
docs(api): update authentication documentation
```

## 测试

### 单元和集成测试

```bash
# 后端测试
cd backend
npm test

# 运行特定测试
npm test -- auth.test.js
```

### 性能测试

```bash
# 基础性能测试 (公共端点)
node backend/test-performance.js

# 带认证的性能测试
JWT_TOKEN="your_token" node backend/test-performance.js

# 自定义配置
CONCURRENT_REQUESTS=100 TEST_DURATION_MS=30000 node backend/test-performance.js
```

详细的性能测试指南请参考 **[backend/docs/PERFORMANCE_TESTING.md](./backend/docs/PERFORMANCE_TESTING.md)**

## 部署

### 生产环境部署

1. 设置生产环境变量
2. 构建 Docker 镜像
3. 使用 Docker Compose 部署

```bash
docker-compose -f docker-compose.yml up -d
```

## 🤝 贡献

我们欢迎所有形式的贡献! 请阅读 **[贡献指南](./CONTRIBUTING.md)** 了解详细信息。

### 快速开始贡献

1. Fork 项目
2. 创建特性分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'feat: add some amazing feature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 开启 Pull Request

### 贡献类型

- 🐛 报告 Bug
- 💡 建议新功能
- 📝 改进文档
- 🔧 提交代码
- ✅ 编写测试

## 🔒 安全

如果发现安全漏洞,请不要公开提交 Issue。请直接联系项目维护者。

## 📄 许可证

本项目采用 MIT 许可证 - 详见 [LICENSE](LICENSE) 文件

## 👥 维护者

- 项目维护者: [添加维护者信息]

## 🙏 致谢

感谢所有为这个项目做出贡献的开发者!

## 📞 联系方式

- 项目主页: [添加项目主页]
- Issue 追踪: [添加 Issue 链接]
- 邮箱: [添加联系邮箱]

## 🗺️ 路线图

### 已完成 ✅
- 用户认证和授权 (JWT + RBAC)
- 新闻、活动、会议管理
- 响应式前端界面
- Docker 容器化部署
- 完整的 API 文档
- 安全措施实施
- 性能优化 (缓存、索引、压缩)

### 计划中 🚧
- 文件上传功能
- 实时通知系统
- 全文搜索
- 多语言支持
- 数据分析仪表板
- 移动应用

## ❓ 常见问题

### 如何重置数据库?
```bash
docker-compose down -v
docker-compose up -d
```

### 如何查看日志?
```bash
# 所有服务
docker-compose logs -f

# 特定服务
docker-compose logs -f api
```

### 如何生成 JWT 密钥?
```bash
openssl rand -base64 32
```

### 如何添加新的权限?
参考 [RBAC 完整指南](./backend/docs/RBAC_GUIDE.md)

### 前端无法连接后端?
1. 检查 API 健康: http://localhost:3000/api/health
2. 检查 CORS 配置
3. 查看浏览器控制台错误

## 📊 项目统计

- 语言: JavaScript (Node.js)
- 框架: Express, Tailwind CSS
- 数据库: PostgreSQL
- 部署: Docker
- 测试: Jest, Supertest

---

**⭐ 如果这个项目对您有帮助,请给我们一个 Star!**
