# 需求文档

## 简介

本项目旨在开发一个完整的全栈 Web 应用系统,用于全球创新与知识产权 (GIIP) 平台。系统包括使用 Tailwind CSS 重构的响应式前端界面,以及基于 RBAC (基于角色的访问控制) 的 Node.js + Express + PostgreSQL 后端 API。整个系统支持 Docker 容器化部署,提供新闻、活动、会议管理等核心功能。

## 术语表

- **GIIP_System**: 全球创新与知识产权管理系统
- **Frontend_App**: 使用 Tailwind CSS 构建的前端应用
- **Backend_API**: Node.js + Express 构建的 RESTful API 服务
- **Database**: PostgreSQL 数据库系统
- **RBAC**: 基于角色的访问控制机制
- **JWT**: JSON Web Token,用于身份验证
- **Docker_Container**: Docker 容器化服务
- **User**: 系统用户实体
- **Role**: 用户角色 (admin, editor, user)
- **Permission**: 系统权限 (如 read:news, write:events)
- **News**: 新闻内容实体
- **Event**: 活动事件实体
- **Conference**: 会议实体

## 需求

### 需求 1: 前端界面重构

**用户故事:** 作为网站访问者,我希望看到一个现代化、响应式的界面,以便在任何设备上都能获得良好的浏览体验

#### 验收标准

1. WHEN 访问者打开网站, THE Frontend_App SHALL 使用 Tailwind CSS v3.4+ 渲染所有页面元素
2. THE Frontend_App SHALL 保留原始设计的所有视觉元素、布局、颜色 (#0B4D3E, #E63946 等)、间距和阴影效果
3. WHEN 屏幕宽度小于或等于 768px, THE Frontend_App SHALL 显示汉堡菜单并调整为垂直卡片布局
4. THE Frontend_App SHALL 将所有自定义 CSS 变量转换为 Tailwind 实用类 (如 bg-[#0B4D3E], text-[#0B4D3E])
5. THE Frontend_App SHALL 实现平滑锚点滚动,偏移量为 -70px 以适应固定头部

### 需求 2: 移动端交互功能

**用户故事:** 作为移动设备用户,我希望能够方便地导航和浏览内容,以便快速找到我需要的信息

#### 验收标准

1. WHEN 用户点击汉堡菜单按钮, THE Frontend_App SHALL 显示侧边导航菜单并显示遮罩层
2. WHEN 用户点击遮罩层, THE Frontend_App SHALL 关闭侧边导航菜单
3. WHEN 用户在移动端查看"最新新闻"或"往届会议", THE Frontend_App SHALL 每 5 秒自动切换到下一张卡片
4. THE Frontend_App SHALL 支持触摸滑动切换新闻和会议卡片
5. WHEN 用户向下滚动超过 300px, THE Frontend_App SHALL 显示"返回顶部"按钮

### 需求 3: 用户认证系统

**用户故事:** 作为系统用户,我希望能够安全地注册和登录账户,以便访问系统功能

#### 验收标准

1. WHEN 用户提交注册信息, THE Backend_API SHALL 使用 bcrypt 哈希密码并创建新用户记录,默认角色为 'user'
2. WHEN 用户提交登录凭证, THE Backend_API SHALL 验证凭证并返回有效期为 1 小时的 JWT
3. THE Backend_API SHALL 验证用户邮箱的唯一性
4. THE Backend_API SHALL 使用 Zod 或 express-validator 验证所有输入数据
5. WHEN JWT 过期, THE Backend_API SHALL 返回 401 未授权状态码

### 需求 4: RBAC 权限管理

**用户故事:** 作为系统管理员,我希望能够管理用户角色和权限,以便控制不同用户对系统资源的访问

#### 验收标准

1. THE Backend_API SHALL 支持三种预定义角色: admin, editor, user
2. THE Backend_API SHALL 维护角色与权限的多对多关系映射
3. WHEN 用户请求受保护资源, THE Backend_API SHALL 验证用户的 JWT 和所需权限
4. WHEN admin 用户请求修改用户角色, THE Backend_API SHALL 更新目标用户的角色
5. THE Backend_API SHALL 拒绝未授权用户访问受保护资源并返回 403 禁止访问状态码

### 需求 5: 新闻内容管理

**用户故事:** 作为内容编辑,我希望能够创建、编辑和删除新闻文章,以便及时发布最新信息

#### 验收标准

1. WHEN 具有 'read:news' 权限的用户请求新闻列表, THE Backend_API SHALL 返回所有已发布的新闻记录
2. WHEN 具有 'write:news' 权限的用户提交新闻内容, THE Backend_API SHALL 创建新的新闻记录并记录创建者
3. WHEN 新闻所有者或具有 'edit:news' 权限的用户请求更新, THE Backend_API SHALL 修改指定新闻记录
4. WHEN 具有 'delete:news' 权限的用户请求删除, THE Backend_API SHALL 移除指定新闻记录
5. THE Backend_API SHALL 在新闻记录中存储标题、内容、图片 URL、发布日期和创建者 ID

### 需求 6: 活动和会议管理

**用户故事:** 作为活动组织者,我希望能够管理活动和会议信息,以便参与者了解详细信息

#### 验收标准

1. WHEN 用户请求活动列表, THE Backend_API SHALL 返回包含标题、描述、日期、地点和容量的活动记录
2. WHEN 具有相应权限的用户创建活动, THE Backend_API SHALL 存储活动信息并记录创建者
3. WHEN 用户请求会议列表, THE Backend_API SHALL 返回包含标题、描述、日期范围、地点和摘要的会议记录
4. THE Backend_API SHALL 支持活动和会议的 CRUD 操作,并根据权限控制访问
5. THE Backend_API SHALL 验证日期格式和容量数值的有效性

### 需求 7: 管理员功能

**用户故事:** 作为系统管理员,我希望能够管理所有用户、角色和权限,以便维护系统安全和秩序

#### 验收标准

1. WHEN admin 用户请求用户列表, THE Backend_API SHALL 返回所有用户的信息 (不包含密码)
2. WHEN admin 用户修改用户角色, THE Backend_API SHALL 更新指定用户的 role_id
3. WHEN admin 用户创建新角色, THE Backend_API SHALL 在 Role 表中插入新记录
4. WHEN admin 用户为角色分配权限, THE Backend_API SHALL 在 RolePermission 表中创建关联记录
5. THE Backend_API SHALL 拒绝非 admin 用户访问管理端点并返回 403 状态码

### 需求 8: 数据库架构

**用户故事:** 作为系统架构师,我希望有一个规范的数据库结构,以便支持所有业务功能和数据完整性

#### 验收标准

1. THE Database SHALL 包含 User 表,字段包括 id, email (唯一), password (哈希), role_id (外键), created_at
2. THE Database SHALL 包含 Role 表,字段包括 id, name, description
3. THE Database SHALL 包含 Permission 表,字段包括 id, name, description
4. THE Database SHALL 包含 RolePermission 表,字段包括 role_id, permission_id (复合主键)
5. THE Database SHALL 包含 News, Event, Conference 表,每个表都包含 created_by 外键关联到 User 表

### 需求 9: 安全性要求

**用户故事:** 作为安全工程师,我希望系统实施多层安全措施,以便保护用户数据和防止攻击

#### 验收标准

1. THE Backend_API SHALL 使用 bcrypt 哈希所有用户密码,不得存储明文密码
2. THE Backend_API SHALL 使用 Helmet.js 设置安全的 HTTP 响应头
3. THE Backend_API SHALL 配置 CORS 仅允许前端域名访问
4. THE Backend_API SHALL 验证所有用户输入以防止 SQL 注入和 XSS 攻击
5. THE Backend_API SHALL 在环境变量中存储敏感配置 (JWT 密钥、数据库凭证)

### 需求 10: Docker 容器化部署

**用户故事:** 作为 DevOps 工程师,我希望系统能够通过 Docker 快速部署,以便简化环境配置和扩展

#### 验收标准

1. THE Docker_Container SHALL 包含三个服务: web (前端 Nginx), api (Node.js 后端), db (PostgreSQL)
2. THE Docker_Container SHALL 为 PostgreSQL 配置持久化卷以保存数据
3. WHEN 执行 docker-compose up 命令, THE GIIP_System SHALL 启动所有服务并建立网络连接
4. THE Docker_Container SHALL 通过环境变量配置数据库连接和 JWT 密钥
5. THE Docker_Container SHALL 包含健康检查以监控服务状态

### 需求 11: API 端点规范

**用户故事:** 作为前端开发者,我希望有清晰的 API 文档,以便正确调用后端服务

#### 验收标准

1. THE Backend_API SHALL 提供 POST /api/auth/register 端点用于用户注册
2. THE Backend_API SHALL 提供 POST /api/auth/login 端点用于用户登录
3. THE Backend_API SHALL 提供 GET /api/news, POST /api/news, PUT /api/news/:id, DELETE /api/news/:id 端点
4. THE Backend_API SHALL 提供类似的 CRUD 端点用于 events 和 conferences 资源
5. THE Backend_API SHALL 为所有端点返回标准的 JSON 响应格式和适当的 HTTP 状态码

### 需求 12: 前端数据集成

**用户故事:** 作为前端开发者,我希望前端能够从后端 API 获取数据,以便显示动态内容

#### 验收标准

1. THE Frontend_App SHALL 使用 Fetch API 从 /api/news 获取新闻数据
2. THE Frontend_App SHALL 使用 Fetch API 从 /api/events 获取活动数据
3. THE Frontend_App SHALL 使用 Fetch API 从 /api/conferences 获取会议数据
4. WHEN API 请求失败, THE Frontend_App SHALL 显示友好的错误消息
5. THE Frontend_App SHALL 在请求头中包含 JWT 以访问受保护资源

### 需求 13: 数据库种子数据

**用户故事:** 作为开发者,我希望有初始测试数据,以便快速开始开发和测试

#### 验收标准

1. THE Database SHALL 预填充三个角色: admin, editor, user
2. THE Database SHALL 预填充权限并映射到相应角色
3. THE Database SHALL 包含至少 3 条示例新闻记录
4. THE Database SHALL 包含至少 3 条示例活动记录
5. THE Database SHALL 包含至少 2 条示例会议记录

### 需求 14: 项目结构和文档

**用户故事:** 作为新加入的开发者,我希望有清晰的项目结构和文档,以便快速理解和上手项目

#### 验收标准

1. THE GIIP_System SHALL 包含 frontend/ 和 backend/ 两个主要目录
2. THE GIIP_System SHALL 在根目录提供 docker-compose.yml 文件
3. THE GIIP_System SHALL 提供 README.md 文件,包含设置和运行说明
4. THE GIIP_System SHALL 提供 .env.example 文件,列出所有必需的环境变量
5. THE GIIP_System SHALL 使用 ES Modules 或 CommonJS 保持一致的模块系统

### 需求 15: 可访问性和用户体验

**用户故事:** 作为有辅助需求的用户,我希望网站具有良好的可访问性,以便我能够正常使用所有功能

#### 验收标准

1. THE Frontend_App SHALL 为移动导航菜单添加 ARIA 标签
2. THE Frontend_App SHALL 使用语义化 HTML 标签 (header, nav, main, section, footer)
3. THE Frontend_App SHALL 确保所有交互元素可通过键盘访问
4. THE Frontend_App SHALL 为图片提供 alt 属性描述
5. THE Frontend_App SHALL 保持足够的颜色对比度以符合 WCAG 标准
