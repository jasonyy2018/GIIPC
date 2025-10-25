# RBAC 快速入门指南

## 5 分钟快速上手

### 1. 导入中间件

```javascript
import { authGuard, permissionGuard, roleGuard } from './middleware/index.js';
```

### 2. 保护路由

```javascript
// 只需要登录
router.get('/profile', authGuard, getProfile);

// 需要特定权限
router.post('/news', authGuard, permissionGuard('write:news'), createNews);

// 需要特定角色
router.get('/admin', authGuard, roleGuard('admin'), adminDashboard);
```

### 3. 测试

```bash
# 登录获取 token
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"user@example.com","password":"password"}'

# 使用 token 访问
curl http://localhost:3000/api/test/protected \
  -H "Authorization: Bearer YOUR_TOKEN"
```

## 常用模式

### 模式 1: 基础认证
```javascript
router.get('/data', authGuard, (req, res) => {
  // req.user 包含用户信息
  res.json({ userId: req.user.userId });
});
```

### 模式 2: 权限检查
```javascript
router.post('/content', 
  authGuard, 
  permissionGuard('write:content'),
  createContent
);
```

### 模式 3: 多权限 (任意一个)
```javascript
import { authGuard, anyPermissionGuard } from './middleware/index.js';

router.delete('/item/:id',
  authGuard,
  anyPermissionGuard(['delete:item', 'manage:all']),
  deleteItem
);
```

### 模式 4: 所有者或管理员
```javascript
router.put('/post/:id', authGuard, async (req, res, next) => {
  const post = await getPost(req.params.id);
  
  // 检查是否是所有者
  if (post.created_by === req.user.userId) {
    return next();
  }
  
  // 检查是否有管理权限
  const { checkPermission } = await import('./services/roleService.js');
  const hasPermission = await checkPermission(req.user.roleId, 'manage:posts');
  
  if (hasPermission) {
    return next();
  }
  
  return res.status(403).json({
    success: false,
    error: { code: 'FORBIDDEN', message: 'Access denied' }
  });
}, updatePost);
```

## 权限命名

遵循 `action:resource` 格式:

```javascript
// 新闻
'read:news'
'write:news'
'edit:news'
'delete:news'

// 活动
'read:events'
'write:events'
'edit:events'
'delete:events'

// 管理
'manage:users'
'manage:roles'
```

## 错误响应

### 401 - 未认证
```json
{
  "success": false,
  "error": {
    "code": "TOKEN_EXPIRED",
    "message": "Token has expired"
  }
}
```

### 403 - 无权限
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

## 在控制器中使用

```javascript
export async function createNews(req, res) {
  try {
    // req.user 由 authGuard 提供
    const { userId, email, role } = req.user;
    
    const newsData = {
      ...req.body,
      created_by: userId
    };
    
    const news = await newsService.create(newsData);
    
    res.status(201).json({
      success: true,
      data: news
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: { message: error.message }
    });
  }
}
```

## 缓存管理

```javascript
import { clearRoleCache, clearAllCache } from './services/roleService.js';

// 更新角色权限后清除缓存
async function updateRolePermissions(roleId, permissions) {
  await savePermissions(roleId, permissions);
  clearRoleCache(roleId); // 清除该角色的缓存
}

// 系统维护时清除所有缓存
clearAllCache();
```

## 调试技巧

### 1. 检查 token
```javascript
import jwt from 'jsonwebtoken';

const token = 'your_token_here';
const decoded = jwt.decode(token);
console.log(decoded);
```

### 2. 查看用户权限
```javascript
import { getPermissionsForRole } from './services/roleService.js';

const permissions = await getPermissionsForRole(roleId);
console.log('User permissions:', permissions);
```

### 3. 测试权限
```javascript
import { checkPermission } from './services/roleService.js';

const hasPermission = await checkPermission(roleId, 'write:news');
console.log('Has permission:', hasPermission);
```

## 完整示例

```javascript
import express from 'express';
import { authGuard, permissionGuard, roleGuard } from './middleware/index.js';
import {
  getNews,
  createNews,
  updateNews,
  deleteNews
} from './controllers/newsController.js';

const router = express.Router();

// 公开访问
router.get('/news/public', getNews);

// 需要登录
router.get('/news', authGuard, getNews);

// 需要写权限
router.post('/news', 
  authGuard, 
  permissionGuard('write:news'), 
  createNews
);

// 需要编辑权限
router.put('/news/:id',
  authGuard,
  permissionGuard('edit:news'),
  updateNews
);

// 需要删除权限
router.delete('/news/:id',
  authGuard,
  permissionGuard('delete:news'),
  deleteNews
);

// 只有管理员
router.get('/admin/stats',
  authGuard,
  roleGuard('admin'),
  getStats
);

export default router;
```

## 下一步

- 📖 阅读 [完整文档](./RBAC_GUIDE.md)
- 🔄 查看 [流程图](./RBAC_FLOW.md)
- 📝 查看 [实现总结](./RBAC_IMPLEMENTATION_SUMMARY.md)
- 🧪 测试 `/api/test/*` 端点

## 常见问题

**Q: 如何添加新权限?**
```sql
INSERT INTO permissions (name, description) 
VALUES ('new:permission', 'Description');

INSERT INTO role_permissions (role_id, permission_id)
VALUES (1, (SELECT id FROM permissions WHERE name = 'new:permission'));
```

**Q: 如何更改用户角色?**
```sql
UPDATE users SET role_id = 2 WHERE id = 1;
```

**Q: 缓存多久过期?**
默认 5 分钟,在 `roleService.js` 中配置 `CACHE_TTL`

**Q: 如何禁用缓存?**
设置 `CACHE_TTL = 0` 或每次查询后调用 `clearRoleCache()`
