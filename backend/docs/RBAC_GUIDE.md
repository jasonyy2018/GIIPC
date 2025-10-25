# RBAC 权限系统使用指南

## 概述

本系统实现了完整的基于角色的访问控制 (RBAC) 系统,包括:
- JWT 认证中间件
- 权限验证中间件
- 角色权限查询服务
- 内存缓存机制

## 架构组件

### 1. 认证中间件 (authMiddleware.js)

**authGuard** - 验证 JWT token 并提取用户信息

```javascript
import { authGuard } from './middleware/index.js';

// 使用示例
router.get('/protected', authGuard, (req, res) => {
  // req.user 包含: { userId, email, roleId, role }
  res.json({ user: req.user });
});
```

**功能:**
- 从 `Authorization: Bearer <token>` header 提取 token
- 验证 token 有效性和过期时间
- 将解码的用户信息附加到 `req.user`
- 返回 401 错误处理无效/过期 token

### 2. 权限中间件 (permissionMiddleware.js)

#### permissionGuard(permission)
检查用户是否拥有特定权限

```javascript
import { authGuard, permissionGuard } from './middleware/index.js';

// 需要 'read:news' 权限
router.get('/news', authGuard, permissionGuard('read:news'), (req, res) => {
  // 只有拥有 read:news 权限的用户可以访问
});
```

#### anyPermissionGuard(permissions)
检查用户是否拥有任意一个权限

```javascript
import { authGuard, anyPermissionGuard } from './middleware/index.js';

// 需要 'edit:news' 或 'delete:news' 权限之一
router.delete('/news/:id', 
  authGuard, 
  anyPermissionGuard(['edit:news', 'delete:news']), 
  (req, res) => {
    // 用户至少拥有一个权限
  }
);
```

#### allPermissionsGuard(permissions)
检查用户是否拥有所有指定权限

```javascript
import { authGuard, allPermissionsGuard } from './middleware/index.js';

// 需要同时拥有两个权限
router.post('/admin/critical', 
  authGuard, 
  allPermissionsGuard(['manage:users', 'manage:roles']), 
  (req, res) => {
    // 用户拥有所有权限
  }
);
```

#### roleGuard(roles)
基于角色的简单访问控制

```javascript
import { authGuard, roleGuard } from './middleware/index.js';

// 只允许 admin 角色
router.get('/admin/dashboard', authGuard, roleGuard('admin'), (req, res) => {
  // 只有 admin 可以访问
});

// 允许多个角色
router.get('/content', authGuard, roleGuard(['admin', 'editor']), (req, res) => {
  // admin 或 editor 可以访问
});
```

### 3. 角色权限服务 (roleService.js)

提供权限查询和缓存功能

```javascript
import {
  checkPermission,
  checkAnyPermission,
  checkAllPermissions,
  getPermissionsForRole,
  clearRoleCache,
  getCacheStats
} from './services/roleService.js';

// 检查单个权限
const hasPermission = await checkPermission(roleId, 'read:news');

// 检查任意权限
const hasAny = await checkAnyPermission(roleId, ['edit:news', 'delete:news']);

// 检查所有权限
const hasAll = await checkAllPermissions(roleId, ['read:news', 'write:news']);

// 获取角色的所有权限
const permissions = await getPermissionsForRole(roleId);

// 清除缓存
clearRoleCache(roleId); // 清除特定角色
clearAllCache(); // 清除所有缓存

// 查看缓存统计
const stats = getCacheStats();
```

### 4. 角色权限仓储 (roleRepository.js)

数据库查询层

```javascript
import {
  getRolePermissions,
  roleHasPermission,
  getRoleById,
  getRoleByName,
  getAllRoles,
  getAllPermissions
} from './repositories/roleRepository.js';

// 获取角色的所有权限
const permissions = await getRolePermissions(roleId);

// 检查角色是否有权限
const hasPermission = await roleHasPermission(roleId, 'read:news');

// 获取角色信息
const role = await getRoleById(1);
const adminRole = await getRoleByName('admin');

// 获取所有角色和权限
const allRoles = await getAllRoles();
const allPermissions = await getAllPermissions();
```

## 使用示例

### 完整的路由保护示例

```javascript
import express from 'express';
import { authGuard, permissionGuard, roleGuard } from './middleware/index.js';

const router = express.Router();

// 1. 只需要认证
router.get('/profile', authGuard, (req, res) => {
  res.json({ user: req.user });
});

// 2. 需要特定权限
router.get('/news', authGuard, permissionGuard('read:news'), getNews);
router.post('/news', authGuard, permissionGuard('write:news'), createNews);
router.put('/news/:id', authGuard, permissionGuard('edit:news'), updateNews);
router.delete('/news/:id', authGuard, permissionGuard('delete:news'), deleteNews);

// 3. 需要特定角色
router.get('/admin/users', authGuard, roleGuard('admin'), listUsers);

// 4. 组合使用 - 所有者或管理员可以编辑
router.put('/news/:id', authGuard, async (req, res, next) => {
  const news = await getNewsById(req.params.id);
  
  // 检查是否是所有者
  if (news.created_by === req.user.userId) {
    return next();
  }
  
  // 检查是否有编辑权限
  const hasPermission = await checkPermission(req.user.roleId, 'edit:news');
  if (hasPermission) {
    return next();
  }
  
  // 拒绝访问
  return res.status(403).json({
    success: false,
    error: { code: 'FORBIDDEN', message: 'Access denied' }
  });
}, updateNews);

export default router;
```

## 权限命名约定

权限名称遵循 `action:resource` 格式:

- `read:news` - 读取新闻
- `write:news` - 创建新闻
- `edit:news` - 编辑新闻
- `delete:news` - 删除新闻
- `read:events` - 读取活动
- `write:events` - 创建活动
- `manage:users` - 管理用户
- `manage:roles` - 管理角色

## 错误响应

### 401 Unauthorized (未认证)

```json
{
  "success": false,
  "error": {
    "code": "NO_TOKEN",
    "message": "No authorization token provided"
  }
}
```

```json
{
  "success": false,
  "error": {
    "code": "TOKEN_EXPIRED",
    "message": "Token has expired"
  }
}
```

### 403 Forbidden (无权限)

```json
{
  "success": false,
  "error": {
    "code": "FORBIDDEN",
    "message": "Access denied. Required permission: write:news",
    "details": {
      "userRole": "user",
      "requiredPermission": "write:news"
    }
  }
}
```

## 缓存机制

### 工作原理

- 权限查询结果缓存在内存中
- 默认 TTL: 5 分钟
- 自动过期和刷新
- 减少数据库查询,提高性能

### 缓存管理

```javascript
import { clearRoleCache, clearAllCache, getCacheStats } from './services/roleService.js';

// 当角色权限更新时,清除缓存
await updateRolePermissions(roleId, newPermissions);
clearRoleCache(roleId);

// 系统维护时清除所有缓存
clearAllCache();

// 监控缓存状态
const stats = getCacheStats();
console.log(`Cache size: ${stats.size}, TTL: ${stats.ttl}ms`);
```

## 测试端点

系统提供了测试端点来验证 RBAC 功能:

```bash
# 1. 注册用户
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"Test123!"}'

# 2. 登录获取 token
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"Test123!"}'

# 3. 访问受保护的端点
curl http://localhost:3000/api/test/protected \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"

# 4. 测试权限检查
curl http://localhost:3000/api/test/news-reader \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"

# 5. 测试角色检查
curl http://localhost:3000/api/test/admin-only \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

## 最佳实践

1. **始终先使用 authGuard**
   ```javascript
   // ✅ 正确
   router.get('/news', authGuard, permissionGuard('read:news'), handler);
   
   // ❌ 错误 - permissionGuard 需要 req.user
   router.get('/news', permissionGuard('read:news'), handler);
   ```

2. **使用权限而非角色检查**
   ```javascript
   // ✅ 推荐 - 更灵活
   router.post('/news', authGuard, permissionGuard('write:news'), handler);
   
   // ⚠️ 不推荐 - 耦合到特定角色
   router.post('/news', authGuard, roleGuard('editor'), handler);
   ```

3. **组合中间件处理复杂逻辑**
   ```javascript
   // 所有者或有权限的用户可以编辑
   router.put('/news/:id', authGuard, checkOwnerOrPermission('edit:news'), handler);
   ```

4. **定期清理缓存**
   ```javascript
   // 当权限更新时
   await assignPermissionToRole(roleId, permissionId);
   clearRoleCache(roleId);
   ```

## 数据库结构

### roles 表
```sql
CREATE TABLE roles (
    id SERIAL PRIMARY KEY,
    name VARCHAR(50) UNIQUE NOT NULL,
    description TEXT
);
```

### permissions 表
```sql
CREATE TABLE permissions (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) UNIQUE NOT NULL,
    description TEXT
);
```

### role_permissions 表
```sql
CREATE TABLE role_permissions (
    role_id INTEGER REFERENCES roles(id),
    permission_id INTEGER REFERENCES permissions(id),
    PRIMARY KEY (role_id, permission_id)
);
```

### users 表
```sql
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    role_id INTEGER REFERENCES roles(id)
);
```

## 故障排除

### Token 无效
- 检查 JWT_SECRET 环境变量是否设置
- 确认 token 格式: `Bearer <token>`
- 验证 token 未过期 (默认 1 小时)

### 权限检查失败
- 确认用户角色已分配权限
- 检查权限名称拼写
- 查看缓存是否需要清除

### 性能问题
- 监控缓存命中率
- 考虑增加缓存 TTL
- 优化数据库查询索引
