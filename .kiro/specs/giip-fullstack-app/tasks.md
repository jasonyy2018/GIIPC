# 实施计划

## 项目结构设置

- [x] 1. 初始化项目结构和配置文件





  - 创建根目录结构: frontend/, backend/, docker-compose.yml
  - 创建 .gitignore, .dockerignore 文件
  - 创建 README.md 和 .env.example
  - _需求: 14.1, 14.2, 14.4_

## 数据库层实施

- [x] 2. 设置 PostgreSQL 数据库架构





  - 编写 schema.sql 创建所有表 (users, roles, permissions, role_permissions, news, events, conferences)
  - 添加外键约束和索引
  - 编写 seed.sql 插入初始角色、权限和示例数据
  - _需求: 8.1, 8.2, 8.3, 8.4, 8.5, 13.1, 13.2, 13.3, 13.4, 13.5_

- [x] 3. 实现数据库连接和配置





  - 创建 backend/src/config/db.js 配置 PostgreSQL 连接池
  - 实现数据库健康检查函数
  - 处理连接错误和重试逻辑
  - _需求: 10.4_

## 后端核心功能

- [x] 4. 实现认证系统





- [x] 4.1 创建用户注册功能


  - 实现 POST /api/auth/register 端点
  - 使用 bcrypt 哈希密码 (salt rounds = 10)
  - 验证邮箱唯一性
  - 使用 Zod 验证输入 (邮箱格式、密码强度)
  - 默认分配 'user' 角色
  - _需求: 3.1, 3.3, 3.4, 9.1, 11.1_

- [x] 4.2 创建用户登录功能

  - 实现 POST /api/auth/login 端点
  - 验证用户凭证 (bcrypt.compare)
  - 生成 JWT (1 小时过期)
  - 返回 token 和用户信息 (不含密码)
  - _需求: 3.2, 3.5, 11.2_

- [x] 5. 实现 RBAC 权限系统





- [x] 5.1 创建认证中间件


  - 实现 authGuard 中间件验证 JWT
  - 从 Authorization header 提取 token
  - 解码 JWT 并附加 req.user
  - 处理过期和无效 token (返回 401)
  - _需求: 4.3_

- [x] 5.2 创建权限中间件


  - 实现 permissionGuard(permission) 中间件
  - 查询用户角色的权限列表
  - 验证用户是否拥有所需权限
  - 拒绝未授权访问 (返回 403)
  - _需求: 4.3, 4.5_

- [x] 5.3 实现角色权限查询服务


  - 创建 RoleService 查询角色权限映射
  - 实现权限缓存机制 (内存缓存)
  - 提供权限检查辅助函数
  - _需求: 4.2_

## 内容管理功能

- [x] 6. 实现新闻管理 API




- [x] 6.1 创建新闻 CRUD 端点


  - 实现 GET /api/news (公开访问,需 read:news 权限)
  - 实现 POST /api/news (需 write:news 权限)
  - 实现 PUT /api/news/:id (所有者或 edit:news 权限)
  - 实现 DELETE /api/news/:id (需 delete:news 权限)
  - _需求: 5.1, 5.2, 5.3, 5.4, 11.3_

- [x] 6.2 实现新闻数据验证和存储


  - 使用 Zod 验证新闻输入 (标题、内容、图片 URL、日期)
  - 创建 NewsRepository 处理数据库操作
  - 记录 created_by 字段
  - 实现分页查询
  - _需求: 5.5, 3.4_

- [x] 7. 实现活动管理 API




- [x] 7.1 创建活动 CRUD 端点


  - 实现 GET /api/events
  - 实现 POST /api/events (需相应权限)
  - 实现 PUT /api/events/:id
  - 实现 DELETE /api/events/:id
  - _需求: 6.1, 6.2, 6.4, 11.4_

- [x] 7.2 实现活动数据验证和存储


  - 验证活动字段 (标题、描述、日期、地点、容量)
  - 创建 EventRepository
  - 验证日期格式和容量数值
  - _需求: 6.5_

- [x] 8. 实现会议管理 API





- [x] 8.1 创建会议 CRUD 端点


  - 实现 GET /api/conferences
  - 实现 POST /api/conferences (需相应权限)
  - 实现 PUT /api/conferences/:id
  - 实现 DELETE /api/conferences/:id
  - _需求: 6.3, 6.4, 11.4_

- [x] 8.2 实现会议数据验证和存储


  - 验证会议字段 (标题、描述、日期范围、地点、摘要)
  - 创建 ConferenceRepository
  - _需求: 6.5_

## 管理员功能

- [x] 9. 实现管理员 API



- [x] 9.1 创建用户管理端点





  - 实现 GET /api/admin/users (仅 admin,返回所有用户不含密码)
  - 实现 PUT /api/admin/users/:id/role (仅 admin,修改用户角色)
  - 添加 admin 权限检查
  - _需求: 7.1, 7.2, 7.5_

- [x] 9.2 创建角色和权限管理端点





  - 实现 POST /api/admin/roles (仅 admin,创建新角色)
  - 实现 POST /api/admin/roles/:id/permissions (仅 admin,分配权限)
  - 验证角色和权限的有效性
  - _需求: 7.3, 7.4_

## 安全和错误处理

- [x] 10. 实现安全措施



- [x] 10.1 配置安全中间件


  - 集成 Helmet.js 设置安全 HTTP 头
  - 配置 CORS 限制前端域名
  - 实现 Content Security Policy
  - _需求: 9.2, 9.3_

- [x] 10.2 实现输入验证和防护


  - 使用 Zod 创建所有输入验证 schema
  - 使用参数化查询防止 SQL 注入
  - 转义用户输入防止 XSS
  - _需求: 9.4_

- [x] 10.3 实现速率限制






  - 为登录端点添加速率限制 (5 次/15 分钟)
  - 为 API 端点添加速率限制 (100 次/15 分钟)
  - _需求: 9.4_

- [x] 11. 实现全局错误处理





  - 创建统一错误响应格式
  - 实现全局错误处理中间件
  - 处理验证错误、认证错误、权限错误
  - 记录错误日志
  - 返回适当的 HTTP 状态码
  - _需求: 11.5_

## 前端实施

- [x] 12. 重构 HTML 结构使用 Tailwind CSS





- [x] 12.1 设置 Tailwind CSS


  - 在 index.html 中引入 Tailwind CDN 或配置 PostCSS
  - 配置 tailwind.config.js 扩展颜色主题
  - 定义自定义颜色: primary-dark (#0B4D3E), accent (#E63946) 等
  - _需求: 1.1, 1.4_

- [x] 12.2 转换导航栏

  - 使用 Tailwind 类重写 header 和 navbar
  - 实现桌面端水平导航样式
  - 实现移动端汉堡菜单和侧边抽屉
  - 保留所有原始颜色和间距
  - _需求: 1.2, 1.3_

- [x] 12.3 转换英雄区

  - 使用 Tailwind 类重写 hero section
  - 实现背景渐变和图片
  - 响应式文字大小和按钮样式
  - _需求: 1.2, 1.3_

- [x] 12.4 转换内容区块

  - 使用 Tailwind 重写新闻、会议、活动、关于、亮点、联系区块
  - 实现响应式网格布局
  - 转换所有卡片样式和悬停效果
  - _需求: 1.2, 1.3_

- [x] 12.5 转换页脚

  - 使用 Tailwind 类重写 footer
  - 实现响应式列布局
  - 移动端隐藏特定列
  - _需求: 1.2, 1.3_

- [x] 13. 实现前端交互功能






- [x] 13.1 实现移动端导航菜单

  - 编写 JavaScript 处理汉堡菜单点击
  - 实现侧边抽屉显示/隐藏动画
  - 实现遮罩层点击关闭
  - _需求: 2.1, 2.2_

- [x] 13.2 实现卡片滑块

  - 编写 JavaScript 实现自动轮播 (5 秒间隔)
  - 实现触摸滑动支持
  - 实现指示器点击切换
  - 应用于新闻和会议区块
  - _需求: 2.3, 2.4_


- [x] 13.3 实现返回顶部按钮





  - 编写 JavaScript 监听滚动事件
  - 滚动超过 300px 显示按钮
  - 实现平滑滚动到顶部
  - _需求: 2.5_


- [x] 13.4 实现平滑锚点滚动





  - 为所有导航链接添加平滑滚动
  - 设置 -70px 偏移量适应固定头部
  - _需求: 1.5_

- [x] 14. 实现前端 API 集成





- [x] 14.1 创建 API 客户端模块


  - 编写 fetch 封装函数
  - 实现 JWT token 管理 (localStorage)
  - 在请求头中自动添加 Authorization
  - _需求: 12.5_

- [x] 14.2 实现数据获取和渲染


  - 从 /api/news 获取新闻数据并渲染
  - 从 /api/events 获取活动数据并渲染
  - 从 /api/conferences 获取会议数据并渲染
  - 实现加载状态和错误处理
  - _需求: 12.1, 12.2, 12.3, 12.4_

## 可访问性

- [x] 15. 实现可访问性功能





  - 为移动导航添加 ARIA 标签 (aria-label, aria-expanded)
  - 确保所有图片有 alt 属性
  - 使用语义化 HTML 标签
  - 确保键盘可访问性 (tabindex, focus 样式)
  - 验证颜色对比度符合 WCAG 标准
  - _需求: 15.1, 15.2, 15.3, 15.4, 15.5_

## Docker 容器化

- [x] 16. 创建 Docker 配置








- [x] 16.1 创建前端 Dockerfile


  - 编写 Dockerfile.frontend 使用 Nginx
  - 配置 Nginx 服务静态文件
  - 复制 index.html 和资源文件
  - _需求: 10.1_

- [x] 16.2 创建后端 Dockerfile


  - 编写 Dockerfile.backend 使用 Node.js
  - 安装依赖并复制源代码
  - 设置启动命令
  - _需求: 10.1_

- [x] 16.3 创建 Docker Compose 配置


  - 编写 docker-compose.yml 定义三个服务 (web, api, db)
  - 配置服务依赖和网络
  - 配置 PostgreSQL 持久化卷
  - 设置环境变量
  - 添加健康检查
  - _需求: 10.1, 10.2, 10.3, 10.4, 10.5_

- [x] 16.4 创建环境变量配置


  - 编写 .env.example 列出所有必需变量
  - 包含数据库配置、JWT 密钥、前端 URL
  - _需求: 10.4, 14.4_

## 文档和测试

- [x] 17. 编写项目文档






  - 编写 README.md 包含项目介绍、技术栈、安装步骤
  - 添加 Docker 启动说明 (docker-compose up)
  - 添加 API 端点文档或 Swagger 配置
  - 添加开发指南和贡献指南
  - _需求: 14.3_

- [x] 18. 编写后端单元测试





  - 为认证中间件编写测试
  - 为权限中间件编写测试
  - 为服务层业务逻辑编写测试
  - 使用 Jest + Supertest
  - _需求: 测试策略_

- [x] 19. 编写后端集成测试





  - 测试所有 API 端点 (认证、新闻、活动、会议、管理员)
  - 测试权限验证场景
  - 测试错误处理
  - 使用测试数据库
  - _需求: 测试策略_

- [x] 20. 进行前端测试






  - 跨浏览器测试 (Chrome, Firefox, Safari, Edge)
  - 响应式测试 (桌面 1920px, 平板 768px, 手机 375px)
  - 交互功能测试 (导航、滑块、表单、按钮)
  - 可访问性测试 (键盘导航、屏幕阅读器)
  - _需求: 测试策略_

## 最终集成和验证

- [x] 21. 集成和端到端测试




  - 使用 docker-compose 启动完整系统
  - 验证前端可以访问后端 API
  - 测试完整的用户流程 (注册、登录、浏览内容、创建内容)
  - 验证 RBAC 权限控制
  - 测试错误场景和边界情况
  - _需求: 所有需求_

- [x] 22. 性能优化






  - 优化前端资源加载 (压缩、缓存)
  - 优化数据库查询 (添加索引)
  - 实现 API 响应缓存
  - 测试并发性能
  - _需求: 性能优化_

- [x] 23. 安全审计






  - 检查所有安全措施是否到位
  - 测试常见安全漏洞 (SQL 注入、XSS、CSRF)
  - 验证密码哈希和 JWT 安全性
  - 检查敏感信息是否泄露
  - _需求: 9.1, 9.2, 9.3, 9.4, 9.5_
