# Requirements Document

## Introduction

本功能旨在为 GIIP 全栈应用添加基于时间的事件和会议分类逻辑。系统将根据活动的开始和结束时间，自动将正在进行或即将开始的活动显示在 Events 页面，将已结束的活动显示在 Past Conferences 页面，从而实现更清晰的内容组织和用户体验。

## Glossary

- **System**: GIIP 全栈应用系统，包括前端和后端
- **Event**: 事件或活动，包含开始时间和结束时间的内容项
- **Conference**: 会议，包含开始时间和结束时间的内容项
- **News**: 新闻内容项，不受时间分类影响
- **Events Page**: 展示正在进行和即将开始的活动的前端页面
- **Past Conferences Page**: 展示已结束活动的前端页面
- **Active Event**: 当前时间在开始时间和结束时间之间，或结束时间在未来的事件
- **Past Event**: 结束时间已过的事件
- **Backend API**: 提供数据查询和过滤的后端服务接口
- **Frontend Renderer**: 前端数据渲染组件

## Requirements

### Requirement 1

**User Story:** 作为网站访问者，我希望在 Events 页面只看到正在进行或即将开始的活动，以便了解当前和未来的活动信息

#### Acceptance Criteria

1. WHEN 用户访问 Events 页面，THE System SHALL 仅显示结束时间在当前时间之后的事件和会议
2. THE System SHALL 按照开始时间降序排列 Events 页面中的活动
3. WHEN 事件的结束时间已过，THE System SHALL 自动将该事件从 Events 页面移除
4. THE System SHALL 在 Events 页面显示每个活动的开始时间和结束时间
5. IF 活动没有设置结束时间，THEN THE System SHALL 将该活动视为 Active Event

### Requirement 2

**User Story:** 作为网站访问者，我希望在 Past Conferences 页面看到所有已结束的活动，以便查阅历史活动信息

#### Acceptance Criteria

1. WHEN 用户访问 Past Conferences 页面，THE System SHALL 仅显示结束时间在当前时间之前的事件和会议
2. THE System SHALL 按照结束时间降序排列 Past Conferences 页面中的活动
3. WHEN 事件的结束时间到达，THE System SHALL 自动将该事件移至 Past Conferences 页面
4. THE System SHALL 在 Past Conferences 页面显示每个活动的开始时间和结束时间

### Requirement 3

**User Story:** 作为系统管理员，我希望后端 API 提供基于时间的过滤功能，以便前端能够正确分类和显示活动

#### Acceptance Criteria

1. THE Backend API SHALL 提供查询参数用于过滤 Active Event 和 Past Event
2. WHEN 前端请求 Active Event，THE Backend API SHALL 返回结束时间在当前时间之后的所有事件
3. WHEN 前端请求 Past Event，THE Backend API SHALL 返回结束时间在当前时间之前的所有事件
4. THE Backend API SHALL 在响应中包含事件的开始时间和结束时间字段
5. THE Backend API SHALL 支持按时间排序的查询参数

### Requirement 4

**User Story:** 作为系统管理员，我希望在管理后台创建或编辑活动时能够设置开始和结束时间，以便系统能够正确分类活动

#### Acceptance Criteria

1. THE System SHALL 在管理后台的事件创建表单中提供开始时间和结束时间输入字段
2. THE System SHALL 验证结束时间必须晚于开始时间
3. WHEN 管理员保存事件，THE System SHALL 将时间信息存储到数据库
4. THE System SHALL 允许管理员编辑已存在事件的时间信息
5. THE System SHALL 在管理后台列表中显示事件的当前状态（Active 或 Past）

### Requirement 5

**User Story:** 作为网站访问者，我希望 News 页面不受时间分类影响，以便查看所有新闻内容

#### Acceptance Criteria

1. THE System SHALL 在 News 页面显示所有新闻内容，不进行时间过滤
2. THE System SHALL 按照发布时间降序排列 News 页面中的内容
3. THE System SHALL 保持 News 内容类型与 Events 和 Conferences 的独立性

### Requirement 6

**User Story:** 作为开发人员，我希望系统能够处理时区问题，以便正确判断活动的时间状态

#### Acceptance Criteria

1. THE System SHALL 使用 UTC 时间存储所有事件的开始和结束时间
2. THE Backend API SHALL 使用服务器当前 UTC 时间进行时间比较
3. THE Frontend Renderer SHALL 将 UTC 时间转换为用户本地时区显示
4. THE System SHALL 确保时间比较逻辑在前后端保持一致
