# 🚀 GIIP 系统快速开始指南

## ✅ 系统已就绪

所有服务正常运行，认证系统完全打通！

## 🔐 测试账号

| 邮箱 | 密码 | 角色 | 后台访问 |
|------|------|------|----------|
| `admin@giip.info` | `admin123` | 管理员 | ✅ 完整权限 |
| `editor@giip.info` | `editor123` | 编辑 | ✅ 内容管理 |
| `user@giip.info` | `user123` | 用户 | ❌ 无权限 |

## 📝 使用步骤

### 1. 访问系统

打开浏览器访问：**http://localhost**

### 2. 登录

1. 点击右上角的 **"Login"** 按钮
2. 输入测试账号：
   ```
   邮箱: admin@giip.info
   密码: admin123
   ```
3. 点击 **"Login"**
4. 登录成功后：
   - 管理员/编辑会自动跳转到 **后台管理界面**
   - 普通用户停留在前台，右上角显示用户信息和 **"Logout"** 按钮

### 3. 注册新用户

1. 点击右上角的 **"Register"** 按钮
2. 输入新邮箱（例如：`yourname@giip.info`）
3. 输入密码（至少 6 个字符）
4. 确认密码
5. 点击 **"Create Account"**
6. 注册成功后会自动跳转到登录页面

### 4. 登出

点击右上角的 **"Logout"** 按钮即可登出

## 🎯 功能特性

### 前台功能
- ✅ 用户注册和登录
- ✅ JWT Token 认证
- ✅ 登录状态持久化（刷新页面保持登录）
- ✅ 美观的模态对话框
- ✅ 响应式设计

### 后台管理功能（管理员/编辑）
- ✅ 仪表板统计数据
- ✅ 新闻管理（查看、删除）
- ✅ 活动管理（查看、删除）
- ✅ 会议管理（查看、删除）
- ✅ 用户管理（仅管理员，查看、修改角色）
- ✅ 自动权限检查和跳转

## 🔧 访问后台管理

### 方式一：登录后自动跳转
使用管理员或编辑账号登录，系统会自动跳转到后台管理界面。

### 方式二：直接访问
访问：**http://localhost/admin.html**

### 方式三：通过用户菜单
登录后，点击右上角用户菜单中的 **"后台管理"** 链接。

## 📚 详细文档

- [后台管理界面使用指南](./ADMIN_INTERFACE_GUIDE.md)
- [认证系统指南](./AUTHENTICATION_GUIDE.md)
- [API 文档](./API_DOCUMENTATION.md)
- ✅ 实时表单验证
- ✅ 错误提示和成功消息
- ✅ 响应式设计（支持移动端）
- ✅ 安全的密码加密（bcrypt）
- ✅ 速率限制（防止暴力破解）

## 🔧 系统访问地址

- **前端**: http://localhost
- **后端 API**: http://localhost:3000
- **API 健康检查**: http://localhost:3000/api/health

## 🐛 常见问题

### Q: 点击登录按钮没有反应？

**A**: 
1. 按 F12 打开浏览器开发者工具查看控制台错误
2. 刷新页面（Ctrl+F5 强制刷新）
3. 清除浏览器缓存

### Q: 登录失败？

**A**: 
1. 确认邮箱是 `admin@giip.info`（注意后缀是 .info）
2. 确认密码是 `Password123!`（注意大小写和感叹号）
3. 如果提示速率限制，等待 15 分钟或运行：
   ```bash
   docker-compose restart api
   ```

### Q: 如何查看系统状态？

**A**: 运行以下命令：
```bash
docker-compose ps
```

所有服务应该显示 "healthy" 状态。

## 📊 验证系统

运行验证脚本：
```bash
.\verify-full-stack.bat
```

或手动测试登录：
```bash
curl -X POST http://localhost:3000/api/auth/login ^
  -H "Content-Type: application/json" ^
  -d "{\"email\":\"admin@giip.info\",\"password\":\"Password123!\"}"
```

## 📖 详细文档

- **认证指南**: `AUTHENTICATION_GUIDE.md`
- **最终验证**: `FINAL_VERIFICATION.md`
- **测试指南**: `test-auth-frontend.html`

## 🎉 开始使用

现在就访问 **http://localhost** 开始使用 GIIP 系统吧！

---

**提示**: 首次使用建议用管理员账号 `admin@giip.info` 登录，体验完整功能。
