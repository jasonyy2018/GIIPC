# GIIP 认证系统完整指南

## ✅ 系统状态

所有服务运行正常：
- ✅ 前端 (Nginx): http://localhost
- ✅ 后端 API (Node.js): http://localhost:3000
- ✅ 数据库 (PostgreSQL): localhost:5432

## 🔐 测试账号

系统预设了以下测试账号：

| 邮箱 | 密码 | 角色 | 权限 |
|------|------|------|------|
| `admin@giip.info` | `Password123!` | admin | 完全访问权限 |
| `editor@giip.info` | `Password123!` | editor | 内容编辑权限 |
| `user@giip.info` | `Password123!` | user | 只读权限 |

## 🚀 快速开始

### 1. 访问前端

打开浏览器访问：http://localhost

### 2. 登录

1. 点击右上角的 **"Login"** 按钮
2. 输入邮箱：`admin@giip.info`
3. 输入密码：`Password123!`
4. 点击 **"Login"**

### 3. 注册新用户

1. 点击右上角的 **"Register"** 按钮
2. 输入邮箱（例如：`yourname@giip.info`）
3. 输入密码（至少 6 个字符）
4. 确认密码
5. 点击 **"Create Account"**

## 📋 功能清单

### ✅ 已实现功能

- [x] 用户注册
- [x] 用户登录
- [x] JWT Token 认证
- [x] 登录状态持久化
- [x] 用户登出
- [x] 密码加密（bcrypt）
- [x] 表单验证
- [x] 错误处理
- [x] 速率限制
- [x] CORS 配置
- [x] 响应式设计
- [x] 模态对话框
- [x] Toast 消息提示

### 🎨 UI 特性

- 美观的模态对话框
- 平滑的动画效果
- 加载状态指示器
- 实时表单验证
- 错误和成功消息
- 移动端适配

## 🔧 API 端点

### 认证相关

#### 注册
```http
POST /api/auth/register
Content-Type: application/json

{
  "email": "user@giip.info",
  "password": "YourPassword123!"
}
```

**响应：**
```json
{
  "success": true,
  "message": "User registered successfully",
  "data": {
    "id": 1,
    "email": "user@giip.info",
    "role": "user",
    "created_at": "2025-10-18T06:00:00.000Z"
  }
}
```

#### 登录
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "admin@giip.info",
  "password": "Password123!"
}
```

**响应：**
```json
{
  "success": true,
  "message": "Login successful",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 5,
    "email": "admin@giip.info",
    "role": "admin"
  }
}
```

### 受保护的资源

使用 Token 访问受保护的资源：

```http
GET /api/news
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

## 🧪 测试步骤

### 方法 1：浏览器测试

1. **打开前端**
   ```
   http://localhost
   ```

2. **测试注册**
   - 点击 "Register"
   - 填写表单
   - 提交

3. **测试登录**
   - 点击 "Login"
   - 使用测试账号登录
   - 验证右上角显示用户信息

4. **测试登出**
   - 点击 "Logout"
   - 验证返回登录/注册按钮

### 方法 2：命令行测试

运行自动化测试脚本：

```bash
node test-full-stack-auth.js
```

### 方法 3：API 测试

使用 curl 或 Postman 测试 API：

```bash
# 注册
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@giip.info","password":"Test123!"}'

# 登录
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@giip.info","password":"Password123!"}'

# 访问受保护资源
curl http://localhost:3000/api/news \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

## 🔒 安全特性

### 密码安全
- ✅ bcrypt 哈希（10 rounds）
- ✅ 最小长度要求（6 字符）
- ✅ 密码确认验证

### Token 安全
- ✅ JWT 签名验证
- ✅ Token 过期时间（1 小时）
- ✅ 安全的 Token 存储（localStorage）

### API 安全
- ✅ 速率限制
  - 登录：5 次/15 分钟
  - 注册：3 次/小时
  - API：100 次/15 分钟
- ✅ CORS 配置
- ✅ 输入验证
- ✅ SQL 注入防护
- ✅ XSS 防护

## 🐛 常见问题

### Q: 点击登录/注册按钮没有反应？

**A:** 检查以下几点：
1. 打开浏览器开发者工具（F12）查看控制台错误
2. 确认所有服务正在运行：`docker-compose ps`
3. 清除浏览器缓存并刷新页面
4. 确认 JavaScript 文件已正确加载

### Q: 登录失败，提示"Invalid email or password"？

**A:** 
1. 确认使用正确的测试账号：
   - 邮箱：`admin@giip.info`
   - 密码：`Password123!`（注意大小写）
2. 检查数据库是否有用户数据：
   ```bash
   docker-compose exec db psql -U giip_user -d giip_db -c "SELECT email FROM users;"
   ```

### Q: 提示"Too many login attempts"？

**A:** 触发了速率限制。等待 15 分钟或重启后端服务：
```bash
docker-compose restart api
```

### Q: 登录后刷新页面，登录状态丢失？

**A:** 这不应该发生。检查：
1. 浏览器是否禁用了 localStorage
2. 是否在隐私/无痕模式下浏览
3. 打开开发者工具 → Application → Local Storage 查看是否有 `authToken`

### Q: CORS 错误？

**A:** 
1. 确认后端 CORS 配置正确
2. 检查 `backend/src/config/security.js`
3. 重启后端服务：`docker-compose restart api`

## 📊 系统架构

```
┌─────────────┐
│   Browser   │
│ (Frontend)  │
└──────┬──────┘
       │ HTTP/HTTPS
       │
┌──────▼──────┐
│    Nginx    │
│  (Port 80)  │
└──────┬──────┘
       │
       │ Static Files
       │ (HTML, CSS, JS)
       │
┌──────▼──────────────┐
│  JavaScript Modules │
│  - auth.js          │
│  - api-client.js    │
│  - data-renderer.js │
└──────┬──────────────┘
       │ Fetch API
       │
┌──────▼──────────┐
│   Express API   │
│  (Port 3000)    │
│  - Auth Routes  │
│  - Middleware   │
│  - Controllers  │
└──────┬──────────┘
       │ SQL Queries
       │
┌──────▼──────────┐
│   PostgreSQL    │
│  (Port 5432)    │
│  - Users        │
│  - Roles        │
│  - Permissions  │
└─────────────────┘
```

## 🎯 下一步

系统已完全打通，可以：

1. **开发新功能**
   - 添加用户资料页面
   - 实现密码重置
   - 添加社交登录

2. **增强安全性**
   - 实现两步验证（2FA）
   - 添加登录历史记录
   - 实现会话管理

3. **改进 UI/UX**
   - 添加更多动画效果
   - 实现主题切换
   - 优化移动端体验

4. **后台管理**
   - 创建管理员面板
   - 实现用户管理
   - 添加内容管理功能

## 📞 支持

如有问题或建议：
- 📧 Email: support@giip.info
- 📝 文档: 查看项目根目录的 README.md
- 🐛 Bug 报告: 创建 GitHub Issue

---

**最后更新**: 2025年10月18日  
**版本**: 1.0.0  
**状态**: ✅ 生产就绪
