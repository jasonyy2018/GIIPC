# GIIP Backend 文档

## 📚 文档索引

### RBAC 权限系统

1. **[快速入门](./RBAC_QUICKSTART.md)** ⚡
   - 5 分钟快速上手
   - 常用代码模式
   - 快速参考

2. **[完整指南](./RBAC_GUIDE.md)** 📖
   - 详细的 API 文档
   - 使用示例
   - 最佳实践
   - 故障排除

3. **[流程图](./RBAC_FLOW.md)** 🔄
   - 认证流程
   - 权限验证流程
   - 缓存机制
   - 数据库关系图

4. **[实现总结](./RBAC_IMPLEMENTATION_SUMMARY.md)** ✅
   - 已完成的功能
   - 创建的文件
   - 技术实现细节
   - 测试方法

## 🚀 快速开始

### 基础使用

```javascript
import { authGuard, permissionGuard } from './middleware/index.js';

// 保护路由
router.get('/protected', authGuard, handler);
router.post('/news', authGuard, permissionGuard('write:news'), handler);
```

### 测试 API

```bash
# 1. 登录
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"user@example.com","password":"password"}'

# 2. 使用 token
curl http://localhost:3000/api/test/protected \
  -H "Authorization: Bearer YOUR_TOKEN"
```

## 📋 文档结构

```
docs/
├── README.md                          # 本文件 - 文档索引
├── RBAC_QUICKSTART.md                 # 快速入门指南
├── RBAC_GUIDE.md                      # 完整使用指南
├── RBAC_FLOW.md                       # 流程图和架构图
└── RBAC_IMPLEMENTATION_SUMMARY.md     # 实现总结
```

## 🎯 推荐阅读顺序

### 新手开发者
1. 先读 **快速入门** - 了解基本用法
2. 再读 **完整指南** - 深入理解系统
3. 参考 **流程图** - 理解内部机制

### 有经验的开发者
1. 快速浏览 **快速入门** - 了解 API
2. 查看 **实现总结** - 了解架构
3. 需要时参考 **完整指南**

### 系统维护者
1. 阅读 **实现总结** - 了解系统组件
2. 研究 **流程图** - 理解数据流
3. 参考 **完整指南** - 维护和优化

## 🔑 核心概念

### 认证 (Authentication)
验证用户身份 - "你是谁?"
- 使用 JWT token
- `authGuard` 中间件

### 授权 (Authorization)
验证用户权限 - "你能做什么?"
- 基于角色和权限
- `permissionGuard` 中间件

### 缓存 (Caching)
提高性能
- 内存缓存权限
- 5 分钟 TTL

## 🛠️ 主要组件

### 中间件
- `authGuard` - JWT 认证
- `permissionGuard` - 权限检查
- `roleGuard` - 角色检查

### 服务
- `roleService` - 权限查询和缓存
- `authService` - 认证逻辑

### 仓储
- `roleRepository` - 数据库查询
- `userRepository` - 用户数据

## 📊 系统架构

```
Request
  ↓
authGuard (验证 JWT)
  ↓
permissionGuard (检查权限)
  ↓
roleService (查询权限 + 缓存)
  ↓
roleRepository (数据库)
  ↓
Response
```

## 🔐 安全特性

- ✅ JWT 签名验证
- ✅ Token 过期检查
- ✅ 参数化查询 (防 SQL 注入)
- ✅ 权限白名单
- ✅ 错误信息安全

## ⚡ 性能特性

- 🚀 内存缓存 (5 分钟 TTL)
- 📊 数据库索引优化
- 🔄 自动缓存刷新
- 📈 可监控的缓存统计

## 🧪 测试端点

系统提供测试端点:

- `GET /api/test/protected` - 需要认证
- `GET /api/test/news-reader` - 需要 read:news 权限
- `GET /api/test/admin-only` - 需要 admin 角色

## 📝 代码示例

### 基础路由保护
```javascript
router.get('/data', authGuard, getData);
```

### 权限保护
```javascript
router.post('/news', 
  authGuard, 
  permissionGuard('write:news'), 
  createNews
);
```

### 角色保护
```javascript
router.get('/admin', 
  authGuard, 
  roleGuard('admin'), 
  adminPanel
);
```

## 🐛 调试

### 查看 Token 内容
```javascript
import jwt from 'jsonwebtoken';
const decoded = jwt.decode(token);
console.log(decoded);
```

### 查看用户权限
```javascript
import { getPermissionsForRole } from './services/roleService.js';
const perms = await getPermissionsForRole(roleId);
console.log(perms);
```

### 缓存统计
```javascript
import { getCacheStats } from './services/roleService.js';
console.log(getCacheStats());
```

## 🔗 相关资源

- [Express 文档](https://expressjs.com/)
- [JWT 文档](https://jwt.io/)
- [PostgreSQL 文档](https://www.postgresql.org/docs/)
- [Zod 文档](https://zod.dev/)

## 💡 最佳实践

1. **始终先使用 authGuard**
   ```javascript
   router.get('/data', authGuard, permissionGuard('read:data'), handler);
   ```

2. **使用权限而非角色**
   ```javascript
   // ✅ 好
   permissionGuard('write:news')
   
   // ❌ 避免
   roleGuard('editor')
   ```

3. **权限更新后清除缓存**
   ```javascript
   await updatePermissions(roleId);
   clearRoleCache(roleId);
   ```

4. **记录权限拒绝事件**
   ```javascript
   if (!hasPermission) {
     logger.warn(`Access denied: ${user.email} -> ${permission}`);
   }
   ```

## 🆘 获取帮助

遇到问题?

1. 查看 [完整指南](./RBAC_GUIDE.md) 的故障排除部分
2. 检查 [流程图](./RBAC_FLOW.md) 理解系统流程
3. 查看 [实现总结](./RBAC_IMPLEMENTATION_SUMMARY.md) 了解系统组件

## 📈 下一步

实现更多功能:
- ✅ RBAC 权限系统 (已完成)
- ⏭️ 新闻管理 API
- ⏭️ 活动管理 API
- ⏭️ 会议管理 API
- ⏭️ 管理员 API

## 🎉 总结

RBAC 权限系统提供:
- 🔒 安全的认证和授权
- ⚡ 高性能的权限查询
- 🎯 灵活的权限控制
- 📚 完整的文档
- 🧪 可测试的端点

开始使用: [快速入门指南](./RBAC_QUICKSTART.md)
