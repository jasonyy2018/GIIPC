# 快速验证指南 - Mobile Menu Typography in Docker

## 🚀 一键验证

```bash
# Windows - 运行验证脚本
verify-nginx-docker.bat
```

这将自动检查:
- ✓ Docker安装和运行状态
- ✓ 容器健康状态
- ✓ Nginx配置
- ✓ 移动端菜单字体更新
- ✓ 所有前端文件

## 🔄 重建容器（如需要）

```bash
# Windows - 一键重建
rebuild-docker.bat
```

或手动执行:
```bash
docker-compose down
docker-compose build --no-cache
docker-compose up -d
```

## 🧪 在线测试

访问测试页面查看实时结果:
- **完整测试:** http://localhost/test-mobile-menu-docker.html
- **字体测试:** http://localhost/test-mobile-menu-typography.html

## ✅ 快速检查清单

### 1. 容器运行中？
```bash
docker ps --filter "name=giip"
```
应该看到3个容器: giip-frontend, giip-backend, giip-database

### 2. 前端可访问？
```bash
curl http://localhost/health
```
应返回: `healthy`

### 3. 移动端菜单正确？
1. 打开 http://localhost
2. 按 F12 打开开发者工具
3. 按 Ctrl + Shift + M 切换移动设备模式
4. 点击汉堡菜单 (☰)
5. 检查字体大小:
   - 按钮: 20px ✓
   - 菜单项: 16px ✓
   - 行高: 1.6 ✓

## 📊 验证结果

### 预期结果:
- ✅ 菜单按钮字体: 20px
- ✅ 菜单项字体: 16px  
- ✅ 行高: 1.6
- ✅ 字体族: 系统字体
- ✅ Gzip压缩: 启用
- ✅ 缓存头: 配置正确

## 🔧 如果出现问题

### 更改未显示？
```bash
# 清除Docker缓存重建
docker-compose down
docker-compose build --no-cache web
docker-compose up -d

# 清除浏览器缓存
# Chrome/Edge: Ctrl + Shift + Delete
# 然后硬刷新: Ctrl + F5
```

### 容器无法启动？
```bash
# 查看日志
docker-compose logs web

# 检查端口占用
netstat -ano | findstr :80
```

### CSS未加载？
```bash
# 检查文件是否在容器中
docker exec giip-frontend ls -la /usr/share/nginx/html/css/
```

## 📱 移动端测试

### 方法1: 浏览器模拟器
1. F12 → Ctrl + Shift + M
2. 选择设备 (iPhone 12, Galaxy S20等)
3. 测试菜单

### 方法2: 真实设备
1. 确保设备和电脑在同一网络
2. 访问 http://[你的电脑IP]
3. 测试菜单

### 方法3: 使用测试页面
访问 http://localhost/test-mobile-menu-docker.html

## 📚 详细文档

- **完整验证指南:** `NGINX_DOCKER_VERIFICATION.md`
- **字体更新文档:** `MOBILE_MENU_TYPOGRAPHY_UPDATE.md`
- **Docker最终验证:** `MOBILE_MENU_DOCKER_FINAL.md`

## 🎯 成功标准

所有以下项目应该通过:
- [x] Docker容器运行正常
- [x] Nginx配置有效
- [x] 移动端菜单按钮 20px
- [x] 移动端菜单文字 16px
- [x] 行高 1.6
- [x] 系统字体加载
- [x] Gzip压缩启用
- [x] 缓存头配置

## 💡 提示

- 每次修改前端文件后需要重建容器
- 使用 `--no-cache` 确保使用最新代码
- 清除浏览器缓存查看最新更改
- 使用测试页面自动验证所有项目

---

**需要帮助？** 查看 `NGINX_DOCKER_VERIFICATION.md` 获取详细故障排除指南。
