# 贡献指南

感谢您对 GIIP 全栈应用项目的关注! 我们欢迎所有形式的贡献。

## 目录

- [行为准则](#行为准则)
- [如何贡献](#如何贡献)
- [开发环境设置](#开发环境设置)
- [开发工作流](#开发工作流)
- [代码规范](#代码规范)
- [提交规范](#提交规范)
- [测试指南](#测试指南)
- [文档规范](#文档规范)

## 行为准则

### 我们的承诺

为了营造一个开放和友好的环境,我们承诺:

- 使用友好和包容的语言
- 尊重不同的观点和经验
- 优雅地接受建设性批评
- 关注对社区最有利的事情
- 对其他社区成员表示同理心

### 不可接受的行为

- 使用性化的语言或图像
- 挑衅、侮辱或贬损性评论
- 公开或私下骚扰
- 未经许可发布他人的私人信息
- 其他在专业环境中不适当的行为

## 如何贡献

### 报告 Bug

在提交 Bug 报告之前:

1. 检查是否已有相关 Issue
2. 确保使用最新版本
3. 收集相关信息 (错误消息、日志、截图等)

提交 Bug 报告时,请包含:

- **清晰的标题和描述**
- **重现步骤**
- **预期行为**
- **实际行为**
- **环境信息** (操作系统、Node.js 版本、浏览器等)
- **相关日志或截图**

### 建议新功能

提交功能建议时,请包含:

- **功能描述**: 清晰描述建议的功能
- **使用场景**: 说明为什么需要这个功能
- **可能的实现**: 如果有想法,描述如何实现
- **替代方案**: 考虑过的其他解决方案

### 提交 Pull Request

1. Fork 项目仓库
2. 创建功能分支 (`git checkout -b feature/AmazingFeature`)
3. 进行更改并提交
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 开启 Pull Request

## 开发环境设置

### 前置要求

- **Node.js**: v18 或更高版本
- **npm**: v9 或更高版本
- **PostgreSQL**: v16 或更高版本
- **Docker**: v20.10+ (可选,用于容器化开发)
- **Git**: 最新版本

### 本地开发设置

#### 1. 克隆仓库

```bash
git clone https://github.com/your-username/giip-fullstack-app.git
cd giip-fullstack-app
```

#### 2. 安装后端依赖

```bash
cd backend
npm install
```

#### 3. 配置环境变量

```bash
cp .env.example .env
```

编辑 `.env` 文件,设置:

```env
DB_NAME=giip_db
DB_USER=giip_user
DB_PASSWORD=your_password
DB_HOST=localhost
DB_PORT=5432

JWT_SECRET=your_jwt_secret_key
JWT_EXPIRES_IN=1h

FRONTEND_URL=http://localhost:8000

NODE_ENV=development
PORT=3000
```

生成强 JWT 密钥:
```bash
openssl rand -base64 32
```

#### 4. 设置数据库

**创建数据库**:
```bash
psql -U postgres
CREATE DATABASE giip_db;
CREATE USER giip_user WITH PASSWORD 'your_password';
GRANT ALL PRIVILEGES ON DATABASE giip_db TO giip_user;
\q
```

**运行迁移**:
```bash
psql -U giip_user -d giip_db -f schema.sql
psql -U giip_user -d giip_db -f seeds/seed.sql
```

#### 5. 启动开发服务器

**后端**:
```bash
cd backend
npm run dev
```

**前端**:
```bash
cd frontend
# 使用 Python
python -m http.server 8000

# 或使用 Node.js
npx serve -p 8000
```

#### 6. 验证设置

访问:
- 前端: http://localhost:8000
- API: http://localhost:3000
- API 健康检查: http://localhost:3000/api/health

### 使用 Docker 开发

```bash
# 启动所有服务
docker-compose up -d

# 查看日志
docker-compose logs -f

# 停止服务
docker-compose down
```

## 开发工作流

### 分支策略

- `main`: 生产就绪代码
- `develop`: 开发分支
- `feature/*`: 新功能分支
- `bugfix/*`: Bug 修复分支
- `hotfix/*`: 紧急修复分支

### 工作流程

1. **创建分支**
   ```bash
   git checkout -b feature/your-feature-name
   ```

2. **进行更改**
   - 编写代码
   - 添加测试
   - 更新文档

3. **提交更改**
   ```bash
   git add .
   git commit -m "feat: add amazing feature"
   ```

4. **保持同步**
   ```bash
   git fetch origin
   git rebase origin/develop
   ```

5. **推送分支**
   ```bash
   git push origin feature/your-feature-name
   ```

6. **创建 Pull Request**
   - 提供清晰的描述
   - 关联相关 Issue
   - 请求代码审查

## 代码规范

### JavaScript/Node.js 规范

#### 通用规则

- 使用 **ES6+** 语法
- 使用 **2 空格** 缩进
- 使用 **单引号** 表示字符串
- 使用 **分号** 结束语句
- 使用 **驼峰命名法** (camelCase) 命名变量和函数
- 使用 **帕斯卡命名法** (PascalCase) 命名类

#### 示例

```javascript
// ✅ 好的示例
const getUserById = async (userId) => {
  try {
    const user = await userRepository.findById(userId);
    return user;
  } catch (error) {
    logger.error('Error fetching user:', error);
    throw error;
  }
};

// ❌ 避免
function get_user(id) {
  var user = userRepository.findById(id)
  return user
}
```

### 后端代码规范

#### 文件结构

```
backend/src/
├── config/          # 配置文件
├── controllers/     # 控制器 (处理请求)
├── middleware/      # 中间件
├── services/        # 业务逻辑
├── repositories/    # 数据访问层
├── routes/          # 路由定义
├── validators/      # 输入验证
└── utils/           # 工具函数
```

#### 控制器规范

```javascript
// controllers/userController.js
export const getUser = async (req, res, next) => {
  try {
    const { id } = req.params;
    const user = await userService.getUserById(id);
    
    res.json({
      success: true,
      data: user
    });
  } catch (error) {
    next(error);
  }
};
```

#### 服务层规范

```javascript
// services/userService.js
export const getUserById = async (userId) => {
  const user = await userRepository.findById(userId);
  
  if (!user) {
    throw new NotFoundError('User not found');
  }
  
  // 移除敏感信息
  delete user.password;
  
  return user;
};
```

#### 仓储层规范

```javascript
// repositories/userRepository.js
export const findById = async (userId) => {
  const query = 'SELECT * FROM users WHERE id = $1';
  const result = await db.query(query, [userId]);
  return result.rows[0];
};
```

### 前端代码规范

#### HTML 规范

- 使用语义化标签
- 添加 ARIA 标签提高可访问性
- 所有图片必须有 `alt` 属性

```html
<!-- ✅ 好的示例 -->
<article class="news-card">
  <img src="image.jpg" alt="AI and IP Innovation">
  <h3>Article Title</h3>
  <p>Article content...</p>
</article>

<!-- ❌ 避免 -->
<div class="card">
  <img src="image.jpg">
  <div>Title</div>
  <div>Content</div>
</div>
```

#### CSS/Tailwind 规范

- 优先使用 Tailwind 实用类
- 自定义样式放在单独的 CSS 文件中
- 使用响应式设计

```html
<!-- ✅ 好的示例 -->
<button class="bg-primary-dark hover:bg-primary-light text-white px-6 py-3 rounded-lg transition-colors">
  Click Me
</button>

<!-- ❌ 避免内联样式 -->
<button style="background: #0B4D3E; color: white;">
  Click Me
</button>
```

#### JavaScript 规范

- 使用模块化代码
- 避免全局变量
- 使用 `async/await` 处理异步操作

```javascript
// ✅ 好的示例
const fetchNews = async () => {
  try {
    const response = await fetch('/api/news');
    const data = await response.json();
    renderNews(data);
  } catch (error) {
    console.error('Error fetching news:', error);
    showErrorMessage('Failed to load news');
  }
};

// ❌ 避免
function getNews() {
  fetch('/api/news').then(function(response) {
    return response.json();
  }).then(function(data) {
    // 处理数据
  });
}
```

### 数据库规范

#### 查询规范

- **始终使用参数化查询** 防止 SQL 注入
- 使用有意义的表名和列名
- 添加适当的索引

```javascript
// ✅ 好的示例 - 参数化查询
const query = 'SELECT * FROM users WHERE email = $1';
const result = await db.query(query, [email]);

// ❌ 危险 - SQL 注入风险
const query = `SELECT * FROM users WHERE email = '${email}'`;
const result = await db.query(query);
```

#### 迁移规范

- 每个迁移文件应该是幂等的
- 包含 `up` 和 `down` 迁移
- 添加清晰的注释

```sql
-- 创建用户表
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    role_id INTEGER REFERENCES roles(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 添加索引
CREATE INDEX idx_users_email ON users(email);
```

## 提交规范

### Commit Message 格式

使用 [Conventional Commits](https://www.conventionalcommits.org/) 规范:

```
<type>(<scope>): <subject>

<body>

<footer>
```

### Type 类型

- `feat`: 新功能
- `fix`: Bug 修复
- `docs`: 文档更新
- `style`: 代码格式 (不影响功能)
- `refactor`: 重构 (不是新功能也不是 Bug 修复)
- `perf`: 性能优化
- `test`: 添加或修改测试
- `chore`: 构建过程或辅助工具的变动

### 示例

```bash
# 新功能
git commit -m "feat(auth): add JWT token refresh endpoint"

# Bug 修复
git commit -m "fix(news): resolve pagination issue"

# 文档
git commit -m "docs(api): update authentication documentation"

# 重构
git commit -m "refactor(db): optimize database connection pooling"
```

### Commit Message 最佳实践

- 使用现在时态 ("add" 而不是 "added")
- 首字母小写
- 不要以句号结尾
- 主题行不超过 50 个字符
- 正文每行不超过 72 个字符
- 解释 "为什么" 而不仅仅是 "做了什么"

## 测试指南

### 测试类型

#### 单元测试

测试单个函数或模块:

```javascript
// tests/services/authService.test.js
import { describe, it, expect } from 'vitest';
import { hashPassword, comparePassword } from '../services/authService.js';

describe('authService', () => {
  describe('hashPassword', () => {
    it('should hash password correctly', async () => {
      const password = 'SecurePass123!';
      const hashed = await hashPassword(password);
      
      expect(hashed).toBeDefined();
      expect(hashed).not.toBe(password);
    });
  });
  
  describe('comparePassword', () => {
    it('should return true for correct password', async () => {
      const password = 'SecurePass123!';
      const hashed = await hashPassword(password);
      const isMatch = await comparePassword(password, hashed);
      
      expect(isMatch).toBe(true);
    });
  });
});
```

#### 集成测试

测试 API 端点:

```javascript
// tests/integration/auth.test.js
import request from 'supertest';
import app from '../src/server.js';

describe('POST /api/auth/register', () => {
  it('should register a new user', async () => {
    const response = await request(app)
      .post('/api/auth/register')
      .send({
        email: 'test@example.com',
        password: 'SecurePass123!'
      });
    
    expect(response.status).toBe(201);
    expect(response.body.success).toBe(true);
    expect(response.body.data.email).toBe('test@example.com');
  });
});
```

### 运行测试

```bash
# 运行所有测试
npm test

# 运行特定测试文件
npm test -- auth.test.js

# 运行测试并生成覆盖率报告
npm run test:coverage

# 监视模式
npm run test:watch
```

### 测试覆盖率目标

- **核心业务逻辑**: 80%+
- **API 端点**: 100%
- **权限验证**: 100%

## 文档规范

### 代码注释

#### JSDoc 注释

```javascript
/**
 * 根据 ID 获取用户
 * @param {number} userId - 用户 ID
 * @returns {Promise<Object>} 用户对象
 * @throws {NotFoundError} 当用户不存在时
 */
export const getUserById = async (userId) => {
  // 实现...
};
```

#### 内联注释

```javascript
// 验证用户权限
const hasPermission = await checkPermission(user.role_id, 'write:news');

// 不要过度注释明显的代码
// ❌ 避免
const user = getUser(); // 获取用户
```

### API 文档

- 所有 API 端点必须在 `API_DOCUMENTATION.md` 中记录
- 包含请求/响应示例
- 说明权限要求
- 列出可能的错误响应

### README 更新

当添加新功能时,更新相关 README:

- 主 `README.md`: 项目概述和快速开始
- `backend/README.md`: 后端特定文档
- `backend/docs/`: 详细技术文档

## Pull Request 检查清单

提交 PR 前,确保:

- [ ] 代码遵循项目代码规范
- [ ] 所有测试通过
- [ ] 添加了新功能的测试
- [ ] 更新了相关文档
- [ ] Commit message 遵循规范
- [ ] 没有合并冲突
- [ ] 代码已经过自我审查
- [ ] 添加了必要的注释
- [ ] 没有遗留的 console.log 或调试代码

## 代码审查指南

### 审查者

- 检查代码质量和可读性
- 验证功能是否符合需求
- 确保测试覆盖充分
- 检查安全问题
- 提供建设性反馈

### 被审查者

- 及时响应审查意见
- 解释设计决策
- 虚心接受建议
- 进行必要的修改

## 发布流程

1. 更新版本号 (`package.json`)
2. 更新 CHANGELOG
3. 创建 release 分支
4. 运行完整测试套件
5. 创建 Git tag
6. 合并到 main 分支
7. 部署到生产环境

## 获取帮助

如有问题:

- 查看 [README.md](./README.md)
- 查看 [API 文档](./API_DOCUMENTATION.md)
- 查看 [后端文档](./backend/docs/)
- 提交 Issue
- 联系维护者

## 许可证

通过贡献代码,您同意您的贡献将在与项目相同的许可证下发布。

---

感谢您的贡献! 🎉

