# 📚 文档索引

GIIP 全栈应用完整文档导航。

## 🚀 快速开始

新用户推荐阅读顺序:

1. **[README.md](./README.md)** - 项目概述和快速开始
2. **[DOCKER_GUIDE.md](./DOCKER_GUIDE.md)** - Docker 部署指南
3. **[API_DOCUMENTATION.md](./API_DOCUMENTATION.md)** - API 使用文档

## 📖 核心文档

### 项目概述
- **[README.md](./README.md)**
  - 项目介绍
  - 技术栈
  - 快速开始
  - 项目结构
  - 环境变量配置

### API 文档
- **[API_DOCUMENTATION.md](./API_DOCUMENTATION.md)**
  - 完整的 API 端点文档
  - 请求/响应示例
  - 认证流程
  - 权限系统说明
  - 错误代码参考
  - 速率限制说明

### 部署文档
- **[DOCKER_GUIDE.md](./DOCKER_GUIDE.md)**
  - Docker 快速开始
  - 常用命令
  - 数据库管理
  - 故障排除
  - 开发 vs 生产环境

- **[DEPLOYMENT.md](./DEPLOYMENT.md)**
  - 生产环境部署完整指南
  - 系统要求
  - 环境配置
  - 反向代理配置 (Nginx)
  - SSL/TLS 配置
  - 数据库优化
  - 监控和日志
  - 备份策略
  - 安全加固
  - 性能优化

### 开发文档
- **[CONTRIBUTING.md](./CONTRIBUTING.md)**
  - 贡献指南
  - 开发环境设置
  - 代码规范
  - 提交规范
  - 测试指南
  - Pull Request 流程

### 可访问性
- **[ACCESSIBILITY.md](./ACCESSIBILITY.md)**
  - ARIA 标签实现
  - 语义化 HTML
  - 键盘可访问性
  - 颜色对比度
  - WCAG 合规性

## 🔧 后端文档

### 概述
- **[backend/README.md](./backend/README.md)**
  - 后端架构概述
  - 文档索引
  - 快速开始

### RBAC 权限系统
- **[backend/docs/RBAC_QUICKSTART.md](./backend/docs/RBAC_QUICKSTART.md)**
  - 5 分钟快速上手
  - 常用代码模式
  - 快速参考

- **[backend/docs/RBAC_GUIDE.md](./backend/docs/RBAC_GUIDE.md)**
  - 完整使用指南
  - 详细 API 文档
  - 最佳实践
  - 故障排除

- **[backend/docs/RBAC_FLOW.md](./backend/docs/RBAC_FLOW.md)**
  - 认证流程图
  - 权限验证流程
  - 缓存机制
  - 数据库关系图

- **[backend/docs/RBAC_IMPLEMENTATION_SUMMARY.md](./backend/docs/RBAC_IMPLEMENTATION_SUMMARY.md)**
  - 实现总结
  - 创建的文件列表
  - 技术实现细节

### 内容管理 API
- **[backend/docs/NEWS_API.md](./backend/docs/NEWS_API.md)**
  - 新闻管理 API 文档
  - CRUD 操作
  - 权限要求

- **[backend/docs/EVENTS_API.md](./backend/docs/EVENTS_API.md)**
  - 活动管理 API 文档
  - CRUD 操作
  - 权限要求

- **[backend/docs/CONFERENCES_API.md](./backend/docs/CONFERENCES_API.md)**
  - 会议管理 API 文档
  - CRUD 操作
  - 权限要求

### 管理员 API
- **[backend/docs/ADMIN_API.md](./backend/docs/ADMIN_API.md)**
  - 用户管理
  - 角色管理
  - 权限分配

### 安全文档
- **[backend/docs/SECURITY_IMPLEMENTATION.md](./backend/docs/SECURITY_IMPLEMENTATION.md)**
  - 安全措施概述
  - 认证安全
  - 输入验证
  - SQL 注入防护
  - XSS 防护
  - CSRF 防护

- **[backend/docs/SECURITY_QUICK_REFERENCE.md](./backend/docs/SECURITY_QUICK_REFERENCE.md)**
  - 安全快速参考
  - 常用安全模式

- **[backend/docs/SQL_INJECTION_PREVENTION.md](./backend/docs/SQL_INJECTION_PREVENTION.md)**
  - SQL 注入防护详解
  - 参数化查询示例

- **[backend/docs/RATE_LIMITING.md](./backend/docs/RATE_LIMITING.md)**
  - 速率限制配置
  - 自定义限制规则

### 错误处理
- **[backend/docs/ERROR_HANDLING.md](./backend/docs/ERROR_HANDLING.md)**
  - 错误处理架构
  - 自定义错误类
  - 全局错误处理器
  - 最佳实践

- **[backend/docs/ERROR_HANDLING_QUICK_REFERENCE.md](./backend/docs/ERROR_HANDLING_QUICK_REFERENCE.md)**
  - 错误处理快速参考
  - 常用错误模式

### 性能优化
- **[backend/docs/PERFORMANCE_OPTIMIZATION.md](./backend/docs/PERFORMANCE_OPTIMIZATION.md)**
  - 性能优化概述
  - 前端资源优化 (压缩、缓存)
  - 数据库查询优化 (索引策略)
  - API 响应缓存
  - 性能监控
  - 最佳实践

- **[backend/docs/PERFORMANCE_TESTING.md](./backend/docs/PERFORMANCE_TESTING.md)**
  - 性能测试指南
  - 运行性能测试
  - 理解测试结果
  - 性能基准
  - 故障排除

## 🎨 前端文档

- **[frontend/USAGE_GUIDE.md](./frontend/USAGE_GUIDE.md)**
  - 前端使用指南
  - 组件说明
  - 交互功能

- **[frontend/API_INTEGRATION_SUMMARY.md](./frontend/API_INTEGRATION_SUMMARY.md)**
  - API 集成说明
  - 数据获取和渲染
  - 错误处理

- **[frontend/js/README.md](./frontend/js/README.md)**
  - JavaScript 模块说明
  - API 客户端使用
  - 数据渲染器使用

## 📋 实现总结文档

- **[DOCKER_IMPLEMENTATION_SUMMARY.md](./DOCKER_IMPLEMENTATION_SUMMARY.md)**
  - Docker 实现总结
  - 配置说明

- **[DOCKER_VERIFICATION_CHECKLIST.md](./DOCKER_VERIFICATION_CHECKLIST.md)**
  - Docker 验证清单
  - 测试步骤

- **[backend/docs/TASK_10_SUMMARY.md](./backend/docs/TASK_10_SUMMARY.md)**
  - 安全措施实现总结

- **[backend/docs/TASK_10.3_IMPLEMENTATION.md](./backend/docs/TASK_10.3_IMPLEMENTATION.md)**
  - 速率限制实现详情

- **[backend/docs/TASK_11_IMPLEMENTATION.md](./backend/docs/TASK_11_IMPLEMENTATION.md)**
  - 错误处理实现详情

## 🔍 按主题查找

### 认证和授权
- [API 文档 - 认证端点](./API_DOCUMENTATION.md#认证端点)
- [RBAC 快速入门](./backend/docs/RBAC_QUICKSTART.md)
- [RBAC 完整指南](./backend/docs/RBAC_GUIDE.md)
- [RBAC 流程图](./backend/docs/RBAC_FLOW.md)

### 内容管理
- [新闻 API](./backend/docs/NEWS_API.md)
- [活动 API](./backend/docs/EVENTS_API.md)
- [会议 API](./backend/docs/CONFERENCES_API.md)

### 安全
- [安全实现](./backend/docs/SECURITY_IMPLEMENTATION.md)
- [SQL 注入防护](./backend/docs/SQL_INJECTION_PREVENTION.md)
- [速率限制](./backend/docs/RATE_LIMITING.md)
- [安全加固 (部署)](./DEPLOYMENT.md#安全加固)

### 性能
- [性能优化指南](./backend/docs/PERFORMANCE_OPTIMIZATION.md)
- [性能测试](./backend/docs/PERFORMANCE_TESTING.md)
- [数据库优化 (部署)](./DEPLOYMENT.md#数据库优化)

### 部署和运维
- [Docker 指南](./DOCKER_GUIDE.md)
- [生产部署](./DEPLOYMENT.md)
- [监控和日志](./DEPLOYMENT.md#监控和日志)
- [备份策略](./DEPLOYMENT.md#备份策略)

### 开发
- [贡献指南](./CONTRIBUTING.md)
- [代码规范](./CONTRIBUTING.md#代码规范)
- [测试指南](./CONTRIBUTING.md#测试指南)

### 故障排除
- [Docker 故障排除](./DOCKER_GUIDE.md#troubleshooting)
- [部署故障排除](./DEPLOYMENT.md#故障排除)
- [RBAC 故障排除](./backend/docs/RBAC_GUIDE.md#故障排除)

## 🎯 按角色推荐

### 新手开发者
1. [README.md](./README.md) - 了解项目
2. [DOCKER_GUIDE.md](./DOCKER_GUIDE.md) - 快速启动
3. [API_DOCUMENTATION.md](./API_DOCUMENTATION.md) - 学习 API
4. [RBAC_QUICKSTART.md](./backend/docs/RBAC_QUICKSTART.md) - 理解权限系统

### 前端开发者
1. [frontend/USAGE_GUIDE.md](./frontend/USAGE_GUIDE.md)
2. [frontend/API_INTEGRATION_SUMMARY.md](./frontend/API_INTEGRATION_SUMMARY.md)
3. [API_DOCUMENTATION.md](./API_DOCUMENTATION.md)
4. [ACCESSIBILITY.md](./ACCESSIBILITY.md)

### 后端开发者
1. [backend/README.md](./backend/README.md)
2. [RBAC_GUIDE.md](./backend/docs/RBAC_GUIDE.md)
3. [SECURITY_IMPLEMENTATION.md](./backend/docs/SECURITY_IMPLEMENTATION.md)
4. [ERROR_HANDLING.md](./backend/docs/ERROR_HANDLING.md)
5. [PERFORMANCE_OPTIMIZATION.md](./backend/docs/PERFORMANCE_OPTIMIZATION.md)
6. [CONTRIBUTING.md](./CONTRIBUTING.md)

### DevOps 工程师
1. [DOCKER_GUIDE.md](./DOCKER_GUIDE.md)
2. [DEPLOYMENT.md](./DEPLOYMENT.md)
3. [DOCKER_VERIFICATION_CHECKLIST.md](./DOCKER_VERIFICATION_CHECKLIST.md)

### 系统管理员
1. [DEPLOYMENT.md](./DEPLOYMENT.md)
2. [ADMIN_API.md](./backend/docs/ADMIN_API.md)
3. [SECURITY_IMPLEMENTATION.md](./backend/docs/SECURITY_IMPLEMENTATION.md)

### 项目经理
1. [README.md](./README.md)
2. [API_DOCUMENTATION.md](./API_DOCUMENTATION.md)
3. [DEPLOYMENT.md](./DEPLOYMENT.md)

## 📝 文档维护

### 更新文档
当进行以下更改时,请更新相应文档:

- **添加新 API 端点** → 更新 [API_DOCUMENTATION.md](./API_DOCUMENTATION.md)
- **修改权限系统** → 更新 RBAC 相关文档
- **更改部署流程** → 更新 [DEPLOYMENT.md](./DEPLOYMENT.md)
- **添加新功能** → 更新 [README.md](./README.md)
- **修改代码规范** → 更新 [CONTRIBUTING.md](./CONTRIBUTING.md)

### 文档规范
- 使用 Markdown 格式
- 包含代码示例
- 添加目录 (长文档)
- 使用清晰的标题层级
- 包含实际的命令和输出示例

## 🆘 获取帮助

找不到需要的信息?

1. 使用 GitHub 搜索功能搜索关键词
2. 查看相关主题的文档
3. 查看 [常见问题](./README.md#常见问题)
4. 提交 Issue

## 📊 文档统计

- **总文档数**: 32+
- **核心文档**: 5
- **后端文档**: 17+
- **前端文档**: 3
- **部署文档**: 3
- **实现总结**: 5+

## 🔗 外部资源

- [Express 文档](https://expressjs.com/)
- [PostgreSQL 文档](https://www.postgresql.org/docs/)
- [Docker 文档](https://docs.docker.com/)
- [Tailwind CSS 文档](https://tailwindcss.com/docs)
- [JWT 文档](https://jwt.io/)
- [WCAG 指南](https://www.w3.org/WAI/WCAG21/quickref/)

---

**文档持续更新中... 最后更新: 2025-10-18**

