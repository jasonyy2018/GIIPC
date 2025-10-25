# Implementation Plan

- [x] 1. 数据库架构更新





  - 为 events 和 conferences 表添加时间字段
  - 创建数据库迁移脚本，添加 start_date 和 end_date 列
  - 迁移现有数据，将旧的 date 字段数据复制到新字段
  - 添加数据库约束确保 end_date >= start_date
  - 创建索引优化时间查询性能
  - _Requirements: 1.1, 2.1, 3.2, 6.1_

- [x] 2. 后端 API 扩展 - Events





  - 更新 Event 验证器，添加 start_date 和 end_date 字段验证
  - 修改 Event Controller，添加 status 过滤逻辑（active/past）
  - 实现时间范围验证（end_date >= start_date）
  - 添加 sortBy 和 sortOrder 查询参数支持
  - 在响应中添加计算的 status 字段
  - _Requirements: 1.1, 1.2, 1.3, 3.1, 3.2, 3.3, 6.2, 6.4_

- [x] 3. 后端 API 扩展 - Conferences





  - 更新 Conference 验证器，添加 start_date 和 end_date 字段验证
  - 修改 Conference Controller，添加 status 过滤逻辑（active/past）
  - 实现时间范围验证（end_date >= start_date）
  - 添加 sortBy 和 sortOrder 查询参数支持
  - 在响应中添加计算的 status 字段
  - _Requirements: 2.1, 2.2, 2.3, 3.1, 3.2, 3.3, 6.2, 6.4_

- [x] 4. 前端 API Client 更新





  - 扩展 EventsAPI，添加 getActive() 和 getPast() 方法
  - 扩展 ConferencesAPI，添加 getActive() 和 getPast() 方法
  - 实现查询参数构建逻辑
  - _Requirements: 1.1, 2.1, 3.4_

- [x] 5. 前端 Events 页面更新





  - 修改 EventsRenderer.render() 方法，同时获取活跃的 events 和 conferences
  - 合并并排序活跃事件列表
  - 更新 renderItem() 方法，显示 start_date 和 end_date
  - 添加日期范围格式化函数
  - 添加活跃状态标识显示
  - _Requirements: 1.1, 1.2, 1.4, 1.5, 6.3_

- [x] 6. 前端 Past Conferences 页面更新





  - 修改 ConferencesRenderer.render() 方法，同时获取过去的 events 和 conferences
  - 合并并排序过去事件列表
  - 更新 renderCard() 方法，显示 start_date 和 end_date
  - 添加日期范围格式化函数
  - _Requirements: 2.1, 2.2, 2.4, 6.3_

- [x] 7. 管理后台表单更新 - Events





  - 在 Event 创建表单添加 start_date 和 end_date 输入字段
  - 在 Event 编辑表单添加 start_date 和 end_date 输入字段
  - 实现前端时间验证（end_date > start_date）
  - 添加时间选择器 UI 组件
  - 实现表单数据提交时的时间格式转换（本地时间 -> UTC）
  - _Requirements: 4.1, 4.2, 4.3, 6.3_

- [x] 8. 管理后台表单更新 - Conferences





  - 在 Conference 创建表单添加 start_date 和 end_date 输入字段
  - 在 Conference 编辑表单添加 start_date 和 end_date 输入字段
  - 实现前端时间验证（end_date > start_date）
  - 添加时间选择器 UI 组件
  - 实现表单数据提交时的时间格式转换（本地时间 -> UTC）
  - _Requirements: 4.1, 4.2, 4.3, 6.3_

- [x] 9. 管理后台列表视图更新





  - 在 Events 列表中显示 start_date 和 end_date
  - 在 Conferences 列表中显示 start_date 和 end_date
  - 添加状态标识（Active/Past）显示
  - 实现按状态过滤功能
  - _Requirements: 4.5_

- [x] 10. 时区处理和显示优化





  - 实现 UTC 时间到本地时间的转换函数
  - 在所有前端显示位置应用时间转换
  - 添加时间格式化工具函数（formatDateRange, formatDateTime）
  - 确保时间显示的一致性
  - _Requirements: 6.1, 6.2, 6.3, 6.4_

- [x] 11. 错误处理和边界情况




  - 实现时间验证错误的友好提示
  - 处理缺失时间字段的旧数据兼容性
  - 添加 API 错误处理和重试逻辑
  - 实现加载状态和错误状态的 UI 显示
  - _Requirements: 1.5, 3.4_

- [x] 12. News 页面验证





  - 验证 News 页面功能不受影响
  - 确保 NewsRenderer 保持原有逻辑
  - 测试 News API 正常工作
  - _Requirements: 5.1, 5.2, 5.3_

- [x] 13. 测试和验证





- [x] 13.1 编写后端单元测试


  - 测试 Event Controller 的 status 过滤功能
  - 测试 Conference Controller 的 status 过滤功能
  - 测试时间范围验证逻辑
  - 测试 status 计算函数
  - _Requirements: 所有需求_

- [x] 13.2 编写前端单元测试


  - 测试 EventsAPI.getActive() 和 getPast() 方法
  - 测试 ConferencesAPI.getActive() 和 getPast() 方法
  - 测试时间格式化函数
  - 测试日期范围显示逻辑
  - _Requirements: 所有需求_

- [x] 13.3 执行集成测试


  - 测试完整的创建-显示流程
  - 测试事件从 active 到 past 的自动转换
  - 测试多个事件的排序和过滤
  - 测试管理后台的 CRUD 操作
  - _Requirements: 所有需求_

- [x] 13.4 执行手动测试


  - 在 Events 页面验证只显示活跃事件
  - 在 Past Conferences 页面验证只显示过去的事件
  - 验证时间显示正确转换为本地时区
  - 验证表单验证功能正常
  - 验证移动端响应式显示
  - 验证旧数据的兼容性
  - _Requirements: 所有需求_
