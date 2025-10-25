# GIIP API 文档

## 基础信息

**Base URL**: `http://localhost:3000/api`

**认证方式**: JWT Bearer Token

**请求格式**: JSON

**响应格式**: JSON

## 认证流程

所有受保护的端点都需要在请求头中包含 JWT token:

```
Authorization: Bearer <your_jwt_token>
```

## 标准响应格式

### 成功响应
```json
{
  "success": true,
  "data": { ... },
  "message": "操作成功"
}
```

### 错误响应
```json
{
  "success": false,
  "error": {
    "code": "ERROR_CODE",
    "message": "错误描述",
    "details": []
  }
}
```

## HTTP 状态码

- `200 OK` - 请求成功
- `201 Created` - 资源创建成功
- `204 No Content` - 删除成功
- `400 Bad Request` - 请求参数错误
- `401 Unauthorized` - 未认证或 token 无效
- `403 Forbidden` - 权限不足
- `404 Not Found` - 资源不存在
- `409 Conflict` - 资源冲突
- `429 Too Many Requests` - 请求过于频繁
- `500 Internal Server Error` - 服务器错误

---

## 认证端点

### 用户注册

注册新用户账户。

**端点**: `POST /auth/register`

**权限**: 公开

**请求体**:
```json
{
  "email": "user@example.com",
  "password": "SecurePass123!"
}
```

**验证规则**:
- `email`: 必须是有效的邮箱格式
- `password`: 最少 8 个字符,包含大小写字母和数字

**成功响应** (201):
```json
{
  "success": true,
  "message": "用户注册成功",
  "data": {
    "userId": 1,
    "email": "user@example.com",
    "role": "user"
  }
}
```

**错误响应**:
- `400` - 验证失败
- `409` - 邮箱已存在

**示例**:
```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "SecurePass123!"
  }'
```

---

### 用户登录

使用邮箱和密码登录,获取 JWT token。

**端点**: `POST /auth/login`

**权限**: 公开

**请求体**:
```json
{
  "email": "user@example.com",
  "password": "SecurePass123!"
}
```

**成功响应** (200):
```json
{
  "success": true,
  "message": "登录成功",
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "id": 1,
      "email": "user@example.com",
      "role": "user"
    }
  }
}
```

**Token 有效期**: 1 小时

**错误响应**:
- `400` - 验证失败
- `401` - 邮箱或密码错误

**速率限制**: 5 次/15 分钟

**示例**:
```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "SecurePass123!"
  }'
```

---

## 新闻管理端点

### 获取新闻列表

获取所有已发布的新闻。

**端点**: `GET /news`

**权限**: `read:news` (所有角色)

**查询参数**:
- `page` (可选): 页码,默认 1
- `limit` (可选): 每页数量,默认 10

**成功响应** (200):
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "title": "人工智能与知识产权",
      "content": "探讨 AI 技术对知识产权的影响...",
      "image_url": "https://example.com/image.jpg",
      "published_date": "2025-10-15",
      "created_by": 1,
      "created_at": "2025-10-15T10:00:00Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 25
  }
}
```

**示例**:
```bash
curl http://localhost:3000/api/news \
  -H "Authorization: Bearer YOUR_TOKEN"
```

---

### 创建新闻

创建新的新闻文章。

**端点**: `POST /news`

**权限**: `write:news` (editor, admin)

**请求体**:
```json
{
  "title": "新闻标题",
  "content": "新闻内容...",
  "image_url": "https://example.com/image.jpg",
  "published_date": "2025-10-18"
}
```

**验证规则**:
- `title`: 必填,最少 3 个字符
- `content`: 必填,最少 10 个字符
- `image_url`: 可选,必须是有效 URL
- `published_date`: 必填,ISO 8601 日期格式

**成功响应** (201):
```json
{
  "success": true,
  "message": "新闻创建成功",
  "data": {
    "id": 2,
    "title": "新闻标题",
    "content": "新闻内容...",
    "image_url": "https://example.com/image.jpg",
    "published_date": "2025-10-18",
    "created_by": 1,
    "created_at": "2025-10-18T10:00:00Z"
  }
}
```

**错误响应**:
- `400` - 验证失败
- `401` - 未认证
- `403` - 权限不足

**示例**:
```bash
curl -X POST http://localhost:3000/api/news \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "新闻标题",
    "content": "新闻内容...",
    "image_url": "https://example.com/image.jpg",
    "published_date": "2025-10-18"
  }'
```

---

### 更新新闻

更新现有新闻文章。

**端点**: `PUT /news/:id`

**权限**: 新闻所有者或 `edit:news` (editor, admin)

**路径参数**:
- `id`: 新闻 ID

**请求体**: 与创建新闻相同

**成功响应** (200):
```json
{
  "success": true,
  "message": "新闻更新成功",
  "data": { ... }
}
```

**错误响应**:
- `400` - 验证失败
- `401` - 未认证
- `403` - 权限不足
- `404` - 新闻不存在

**示例**:
```bash
curl -X PUT http://localhost:3000/api/news/1 \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "更新的标题",
    "content": "更新的内容..."
  }'
```

---

### 删除新闻

删除新闻文章。

**端点**: `DELETE /news/:id`

**权限**: `delete:news` (admin)

**路径参数**:
- `id`: 新闻 ID

**成功响应** (200):
```json
{
  "success": true,
  "message": "新闻删除成功"
}
```

**错误响应**:
- `401` - 未认证
- `403` - 权限不足
- `404` - 新闻不存在

**示例**:
```bash
curl -X DELETE http://localhost:3000/api/news/1 \
  -H "Authorization: Bearer YOUR_TOKEN"
```

---

## 活动管理端点

### 获取活动列表

获取所有活动。

**端点**: `GET /events`

**权限**: `read:events` (所有角色)

**查询参数**:
- `page` (可选): 页码,默认 1
- `limit` (可选): 每页数量,默认 10

**成功响应** (200):
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "title": "知识产权研讨会",
      "description": "探讨最新的知识产权趋势...",
      "date": "2025-11-15",
      "location": "北京国际会议中心",
      "capacity": 200,
      "created_by": 1,
      "created_at": "2025-10-15T10:00:00Z"
    }
  ]
}
```

**示例**:
```bash
curl http://localhost:3000/api/events \
  -H "Authorization: Bearer YOUR_TOKEN"
```

---

### 创建活动

创建新活动。

**端点**: `POST /events`

**权限**: `write:events` (editor, admin)

**请求体**:
```json
{
  "title": "活动标题",
  "description": "活动描述...",
  "date": "2025-11-15",
  "location": "活动地点",
  "capacity": 200
}
```

**验证规则**:
- `title`: 必填,最少 3 个字符
- `description`: 必填,最少 10 个字符
- `date`: 必填,ISO 8601 日期格式
- `location`: 必填,最少 3 个字符
- `capacity`: 可选,正整数

**成功响应** (201):
```json
{
  "success": true,
  "message": "活动创建成功",
  "data": { ... }
}
```

**示例**:
```bash
curl -X POST http://localhost:3000/api/events \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "知识产权研讨会",
    "description": "探讨最新的知识产权趋势...",
    "date": "2025-11-15",
    "location": "北京国际会议中心",
    "capacity": 200
  }'
```

---

### 更新活动

更新现有活动。

**端点**: `PUT /events/:id`

**权限**: 活动所有者或 `edit:events` (editor, admin)

**路径参数**:
- `id`: 活动 ID

**请求体**: 与创建活动相同

**成功响应** (200):
```json
{
  "success": true,
  "message": "活动更新成功",
  "data": { ... }
}
```

---

### 删除活动

删除活动。

**端点**: `DELETE /events/:id`

**权限**: `delete:events` (admin)

**路径参数**:
- `id`: 活动 ID

**成功响应** (200):
```json
{
  "success": true,
  "message": "活动删除成功"
}
```

---

## 会议管理端点

### 获取会议列表

获取所有会议。

**端点**: `GET /conferences`

**权限**: `read:conferences` (所有角色)

**查询参数**:
- `page` (可选): 页码,默认 1
- `limit` (可选): 每页数量,默认 10

**成功响应** (200):
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "title": "2025 全球知识产权峰会",
      "description": "年度最大的知识产权会议...",
      "date_range": "2025-12-10 至 2025-12-12",
      "location": "上海国际会展中心",
      "summary": "汇聚全球知识产权专家...",
      "created_by": 1,
      "created_at": "2025-10-15T10:00:00Z"
    }
  ]
}
```

**示例**:
```bash
curl http://localhost:3000/api/conferences \
  -H "Authorization: Bearer YOUR_TOKEN"
```

---

### 创建会议

创建新会议。

**端点**: `POST /conferences`

**权限**: `write:conferences` (editor, admin)

**请求体**:
```json
{
  "title": "会议标题",
  "description": "会议描述...",
  "date_range": "2025-12-10 至 2025-12-12",
  "location": "会议地点",
  "summary": "会议摘要..."
}
```

**验证规则**:
- `title`: 必填,最少 3 个字符
- `description`: 必填,最少 10 个字符
- `date_range`: 必填,最少 3 个字符
- `location`: 必填,最少 3 个字符
- `summary`: 可选

**成功响应** (201):
```json
{
  "success": true,
  "message": "会议创建成功",
  "data": { ... }
}
```

**示例**:
```bash
curl -X POST http://localhost:3000/api/conferences \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "2025 全球知识产权峰会",
    "description": "年度最大的知识产权会议...",
    "date_range": "2025-12-10 至 2025-12-12",
    "location": "上海国际会展中心",
    "summary": "汇聚全球知识产权专家..."
  }'
```

---

### 更新会议

更新现有会议。

**端点**: `PUT /conferences/:id`

**权限**: 会议所有者或 `edit:conferences` (editor, admin)

**路径参数**:
- `id`: 会议 ID

**请求体**: 与创建会议相同

**成功响应** (200):
```json
{
  "success": true,
  "message": "会议更新成功",
  "data": { ... }
}
```

---

### 删除会议

删除会议。

**端点**: `DELETE /conferences/:id`

**权限**: `delete:conferences` (admin)

**路径参数**:
- `id`: 会议 ID

**成功响应** (200):
```json
{
  "success": true,
  "message": "会议删除成功"
}
```

---

## 管理员端点

### 获取所有用户

获取系统中所有用户的列表。

**端点**: `GET /admin/users`

**权限**: `admin` 角色

**成功响应** (200):
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "email": "user@example.com",
      "role_id": 3,
      "role_name": "user",
      "created_at": "2025-10-15T10:00:00Z"
    }
  ]
}
```

**注意**: 响应中不包含密码字段

**示例**:
```bash
curl http://localhost:3000/api/admin/users \
  -H "Authorization: Bearer ADMIN_TOKEN"
```

---

### 修改用户角色

更改用户的角色。

**端点**: `PUT /admin/users/:id/role`

**权限**: `admin` 角色

**路径参数**:
- `id`: 用户 ID

**请求体**:
```json
{
  "role_id": 2
}
```

**有效角色 ID**:
- `1`: admin
- `2`: editor
- `3`: user

**成功响应** (200):
```json
{
  "success": true,
  "message": "用户角色更新成功",
  "data": {
    "id": 1,
    "email": "user@example.com",
    "role_id": 2,
    "role_name": "editor"
  }
}
```

**错误响应**:
- `400` - 无效的角色 ID
- `401` - 未认证
- `403` - 权限不足
- `404` - 用户不存在

**示例**:
```bash
curl -X PUT http://localhost:3000/api/admin/users/1/role \
  -H "Authorization: Bearer ADMIN_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"role_id": 2}'
```

---

### 创建角色

创建新的用户角色。

**端点**: `POST /admin/roles`

**权限**: `admin` 角色

**请求体**:
```json
{
  "name": "moderator",
  "description": "内容审核员"
}
```

**验证规则**:
- `name`: 必填,唯一,最少 3 个字符
- `description`: 可选

**成功响应** (201):
```json
{
  "success": true,
  "message": "角色创建成功",
  "data": {
    "id": 4,
    "name": "moderator",
    "description": "内容审核员"
  }
}
```

**示例**:
```bash
curl -X POST http://localhost:3000/api/admin/roles \
  -H "Authorization: Bearer ADMIN_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "moderator",
    "description": "内容审核员"
  }'
```

---

### 分配权限给角色

为角色分配权限。

**端点**: `POST /admin/roles/:id/permissions`

**权限**: `admin` 角色

**路径参数**:
- `id`: 角色 ID

**请求体**:
```json
{
  "permission_ids": [1, 2, 3]
}
```

**成功响应** (200):
```json
{
  "success": true,
  "message": "权限分配成功",
  "data": {
    "role_id": 4,
    "permissions": [
      {
        "id": 1,
        "name": "read:news"
      },
      {
        "id": 2,
        "name": "write:news"
      }
    ]
  }
}
```

**示例**:
```bash
curl -X POST http://localhost:3000/api/admin/roles/4/permissions \
  -H "Authorization: Bearer ADMIN_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"permission_ids": [1, 2, 3]}'
```

---

## 健康检查端点

### API 健康检查

检查 API 服务和数据库连接状态。

**端点**: `GET /health`

**权限**: 公开

**成功响应** (200):
```json
{
  "status": "healthy",
  "timestamp": "2025-10-18T10:00:00Z",
  "services": {
    "api": "up",
    "database": "up"
  }
}
```

**示例**:
```bash
curl http://localhost:3000/api/health
```

---

## 权限系统

### 角色和权限映射

#### Admin 角色
- `read:news`, `write:news`, `edit:news`, `delete:news`
- `read:events`, `write:events`, `edit:events`, `delete:events`
- `read:conferences`, `write:conferences`, `edit:conferences`, `delete:conferences`
- `manage:users`, `manage:roles`

#### Editor 角色
- `read:news`, `write:news`, `edit:news`
- `read:events`, `write:events`, `edit:events`
- `read:conferences`, `write:conferences`, `edit:conferences`

#### User 角色
- `read:news`
- `read:events`
- `read:conferences`

### 权限检查流程

1. 客户端发送请求,包含 JWT token
2. `authGuard` 中间件验证 token
3. `permissionGuard` 中间件检查用户权限
4. 如果权限验证通过,执行请求处理器
5. 返回响应

---

## 错误代码

| 错误代码 | 描述 |
|---------|------|
| `VALIDATION_ERROR` | 输入验证失败 |
| `UNAUTHORIZED` | 未认证或 token 无效 |
| `FORBIDDEN` | 权限不足 |
| `NOT_FOUND` | 资源不存在 |
| `CONFLICT` | 资源冲突 (如邮箱已存在) |
| `RATE_LIMIT_EXCEEDED` | 超过速率限制 |
| `INTERNAL_ERROR` | 服务器内部错误 |

---

## 速率限制

### 登录端点
- **限制**: 5 次请求 / 15 分钟
- **适用端点**: `/auth/login`

### API 端点
- **限制**: 100 次请求 / 15 分钟
- **适用端点**: 所有 `/api/*` 端点

### 超出限制响应
```json
{
  "success": false,
  "error": {
    "code": "RATE_LIMIT_EXCEEDED",
    "message": "请求过于频繁,请稍后再试"
  }
}
```

---

## 安全最佳实践

### 客户端
1. **安全存储 Token**: 使用 `localStorage` 或 `sessionStorage`
2. **Token 刷新**: 在 token 过期前刷新
3. **HTTPS**: 生产环境必须使用 HTTPS
4. **输入验证**: 客户端也应验证输入

### 服务端
1. **密码哈希**: 使用 bcrypt (salt rounds = 10)
2. **参数化查询**: 防止 SQL 注入
3. **输入清理**: 防止 XSS 攻击
4. **CORS**: 限制允许的源
5. **安全头**: 使用 Helmet.js

---

## 测试端点

系统提供测试端点用于验证认证和权限:

- `GET /test/protected` - 需要认证
- `GET /test/news-reader` - 需要 `read:news` 权限
- `GET /test/admin-only` - 需要 `admin` 角色

**示例**:
```bash
curl http://localhost:3000/api/test/protected \
  -H "Authorization: Bearer YOUR_TOKEN"
```

---

## 完整示例工作流

### 1. 注册新用户
```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "newuser@example.com",
    "password": "SecurePass123!"
  }'
```

### 2. 登录获取 Token
```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "newuser@example.com",
    "password": "SecurePass123!"
  }'
```

### 3. 使用 Token 访问受保护资源
```bash
TOKEN="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."

curl http://localhost:3000/api/news \
  -H "Authorization: Bearer $TOKEN"
```

### 4. 创建新闻 (需要 editor 或 admin 角色)
```bash
curl -X POST http://localhost:3000/api/news \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "新闻标题",
    "content": "新闻内容...",
    "image_url": "https://example.com/image.jpg",
    "published_date": "2025-10-18"
  }'
```

---

## 更多资源

- [RBAC 快速入门](./backend/docs/RBAC_QUICKSTART.md)
- [RBAC 完整指南](./backend/docs/RBAC_GUIDE.md)
- [安全实现文档](./backend/docs/SECURITY_IMPLEMENTATION.md)
- [错误处理文档](./backend/docs/ERROR_HANDLING.md)
- [Docker 部署指南](./DOCKER_GUIDE.md)

---

## 支持

如有问题或需要帮助,请参考:
- 项目 README
- 后端文档目录 (`backend/docs/`)
- 提交 Issue

