# 认证功能实现文档

## 概述

前端已实现完整的用户认证功能，包括登录、注册和用户状态管理。

## 功能特性

### ✅ 已实现功能

1. **用户注册**
   - 邮箱和密码注册
   - 密码确认验证
   - 实时表单验证
   - 成功后自动跳转到登录

2. **用户登录**
   - 邮箱和密码登录
   - 记住登录状态（localStorage）
   - 自动 token 管理
   - 登录成功后显示欢迎消息

3. **用户状态管理**
   - 登录状态持久化
   - 自动更新 UI（显示用户信息）
   - 登出功能
   - Token 自动附加到 API 请求

4. **UI/UX 特性**
   - 美观的模态对话框
   - 平滑的动画效果
   - 加载状态指示器
   - 错误和成功消息提示
   - 响应式设计（移动端适配）
   - 无障碍访问支持

## 文件结构

```
frontend/
├── index.html              # 主页面（已更新）
├── css/
│   └── auth.css           # 认证相关样式
└── js/
    ├── api-client.js      # API 客户端（已存在）
    ├── data-renderer.js   # 数据渲染（已存在）
    └── auth.js            # 认证管理器（新增）
```

## 使用方法

### 1. 注册新用户

1. 点击页面右上角的 "Register" 按钮
2. 填写邮箱地址（例如：user@giip.info）
3. 输入密码（至少 6 个字符）
4. 确认密码
5. 点击 "Create Account"
6. 注册成功后会自动跳转到登录页面

### 2. 用户登录

1. 点击页面右上角的 "Login" 按钮
2. 输入注册时使用的邮箱
3. 输入密码
4. 点击 "Login"
5. 登录成功后会显示用户信息

### 3. 登出

1. 登录后，右上角会显示用户邮箱和角色
2. 点击 "Logout" 按钮
3. 系统会清除登录状态并刷新 UI

## API 集成

认证功能使用以下 API 端点：

### 注册
```
POST /api/auth/register
Content-Type: application/json

{
  "email": "user@giip.info",
  "password": "yourpassword"
}
```

### 登录
```
POST /api/auth/login
Content-Type: application/json

{
  "email": "user@giip.info",
  "password": "yourpassword"
}
```

### 响应格式
```json
{
  "success": true,
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "id": 1,
      "email": "user@giip.info",
      "role": "user"
    }
  }
}
```

## 本地存储

认证信息存储在浏览器的 localStorage 中：

- `authToken`: JWT 认证令牌
- `user`: 用户信息（JSON 字符串）

## 安全特性

1. **密码验证**
   - 最小长度要求（6 个字符）
   - 密码确认匹配验证

2. **Token 管理**
   - JWT token 自动存储
   - Token 自动附加到 API 请求头
   - 登出时清除 token

3. **输入验证**
   - 邮箱格式验证
   - 必填字段验证
   - 客户端和服务器端双重验证

4. **错误处理**
   - 友好的错误消息
   - 网络错误处理
   - 速率限制提示

## 样式定制

认证模态框的样式可以在 `frontend/css/auth.css` 中自定义：

- `.auth-modal`: 模态框容器
- `.auth-modal-content`: 模态框内容
- `.auth-form`: 表单样式
- `.user-menu`: 用户菜单样式

## 测试步骤

### 1. 测试注册功能

```bash
# 访问前端
http://localhost

# 点击 Register 按钮
# 填写表单：
# - Email: test@giip.info
# - Password: Test123!
# - Confirm Password: Test123!
# 提交表单
```

### 2. 测试登录功能

```bash
# 点击 Login 按钮
# 填写表单：
# - Email: test@giip.info
# - Password: Test123!
# 提交表单
```

### 3. 验证登录状态

```javascript
// 在浏览器控制台中检查
console.log(localStorage.getItem('authToken'));
console.log(localStorage.getItem('user'));
```

### 4. 测试登出功能

```bash
# 登录后点击 Logout 按钮
# 验证 UI 已更新
# 验证 localStorage 已清空
```

## 常见问题

### Q: 点击登录/注册按钮没有反应？

A: 检查以下几点：
1. 确保 `auth.js` 已正确加载
2. 检查浏览器控制台是否有错误
3. 确认 API 服务器正在运行（http://localhost:3000）

### Q: 登录后刷新页面，登录状态丢失？

A: 这不应该发生。登录状态存储在 localStorage 中，刷新页面后会自动恢复。如果丢失，检查：
1. 浏览器是否禁用了 localStorage
2. 是否在隐私模式下浏览

### Q: 注册时提示"Email already registered"？

A: 该邮箱已被注册。请使用其他邮箱或直接登录。

### Q: 登录时提示"Invalid email or password"？

A: 检查：
1. 邮箱拼写是否正确
2. 密码是否正确
3. 是否已完成注册

## 浏览器兼容性

- ✅ Chrome 90+
- ✅ Firefox 88+
- ✅ Safari 14+
- ✅ Edge 90+
- ✅ 移动浏览器（iOS Safari, Chrome Mobile）

## 下一步改进

可选的功能增强：

1. **密码重置**
   - 忘记密码功能
   - 邮件验证

2. **社交登录**
   - Google OAuth
   - GitHub OAuth

3. **用户资料**
   - 个人资料页面
   - 头像上传
   - 资料编辑

4. **会话管理**
   - 记住我功能
   - 多设备登录管理
   - 自动登出（token 过期）

5. **安全增强**
   - 两步验证（2FA）
   - 登录历史记录
   - 可疑活动检测

## 技术栈

- **前端框架**: 原生 JavaScript (ES6+)
- **样式**: CSS3 + Tailwind CSS
- **图标**: Font Awesome 6.4.0
- **API 通信**: Fetch API
- **状态管理**: localStorage
- **模块化**: ES6 Modules

## 支持

如有问题或建议，请联系：
- Email: support@giip.info
- GitHub Issues: [项目仓库]

---

**最后更新**: 2025年10月18日  
**版本**: 1.0.0  
**状态**: ✅ 生产就绪
