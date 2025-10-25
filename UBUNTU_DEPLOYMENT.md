# Ubuntu 24 部署指南

## 问题

在Ubuntu 24下运行 `docker-compose build` 时出现错误：
```
npm ci` command can only install with an existing package-lock.json
```

## 解决方案

### 修改了 `backend/Dockerfile`

**之前：**
```dockerfile
RUN npm ci --omit=dev && \
    npm cache clean --force
```

**之后：**
```dockerfile
RUN npm install --production --no-optional && \
    npm cache clean --force
```

### 为什么这样修改？

1. **`npm ci` 更严格**
   - 需要 `package-lock.json` 完全匹配
   - 在某些环境下可能失败

2. **`npm install --production` 更兼容**
   - 只安装生产依赖
   - 更宽松的依赖解析
   - 在各种环境下都能工作

3. **`--no-optional` 标志**
   - 跳过可选依赖
   - 减少构建时间
   - 避免可选依赖导致的失败

## 部署步骤

### 方法1：使用脚本（推荐）

```bash
chmod +x deploy-ubuntu.sh
./deploy-ubuntu.sh
```

### 方法2：手动部署

```bash
# 1. 停止容器
docker-compose down

# 2. 清理镜像
docker rmi giipc-web giipc-api

# 3. 重新构建
docker-compose build --no-cache

# 4. 启动服务
docker-compose up -d

# 5. 检查状态
docker-compose ps
```

## 验证部署

### 1. 检查容器状态

```bash
docker-compose ps
```

应该看到3个容器都在运行：
- giip-frontend (healthy)
- giip-backend (healthy)
- giip-database (healthy)

### 2. 检查日志

```bash
# 前端日志
docker logs giip-frontend

# 后端日志
docker logs giip-backend

# 数据库日志
docker logs giip-database
```

### 3. 测试服务

```bash
# 测试前端
curl http://localhost

# 测试后端API
curl http://localhost:3000/api/health

# 测试数据库连接
docker exec giip-database psql -U giip_user -d giip_db -c "SELECT 1;"
```

### 4. 浏览器测试

打开浏览器访问：
- 前端：http://localhost
- 后端API：http://localhost:3000/api/health

**重要：清除浏览器缓存！**
- 方法1：隐私模式 `Ctrl+Shift+N`
- 方法2：硬刷新 `Ctrl+F5`
- 方法3：清除缓存 `Ctrl+Shift+Delete`

## 故障排除

### 问题：构建仍然失败

**检查步骤：**

1. **验证package-lock.json存在**
   ```bash
   ls -la backend/package-lock.json
   ```

2. **检查Docker版本**
   ```bash
   docker --version
   docker-compose --version
   ```
   
   推荐版本：
   - Docker: 20.10+
   - Docker Compose: 2.0+

3. **清理Docker缓存**
   ```bash
   docker system prune -a
   ```

4. **查看详细构建日志**
   ```bash
   docker-compose build --no-cache --progress=plain
   ```

### 问题：容器启动失败

**检查步骤：**

1. **查看容器日志**
   ```bash
   docker logs giip-backend
   ```

2. **检查端口占用**
   ```bash
   sudo netstat -tulpn | grep -E '80|3000|5432'
   ```

3. **验证环境变量**
   ```bash
   cat .env
   ```

4. **检查数据库连接**
   ```bash
   docker exec giip-database pg_isready -U giip_user
   ```

### 问题：前端样式丢失

**解决方案：**

1. **清除浏览器缓存**（最常见原因）
   - 使用隐私模式测试

2. **检查CSS文件**
   ```bash
   docker exec giip-frontend ls -la /usr/share/nginx/html/css/
   ```

3. **验证Nginx配置**
   ```bash
   docker exec giip-frontend nginx -t
   ```

## Ubuntu 24 特定注意事项

### 1. 权限问题

如果遇到权限错误：
```bash
sudo usermod -aG docker $USER
newgrp docker
```

### 2. 防火墙设置

确保端口开放：
```bash
sudo ufw allow 80/tcp
sudo ufw allow 3000/tcp
sudo ufw allow 5432/tcp
```

### 3. SELinux（如果启用）

临时禁用：
```bash
sudo setenforce 0
```

永久禁用（编辑 `/etc/selinux/config`）：
```
SELINUX=disabled
```

## 性能优化

### 1. Docker资源限制

在 `docker-compose.yml` 中添加：
```yaml
services:
  api:
    deploy:
      resources:
        limits:
          cpus: '1'
          memory: 512M
```

### 2. 数据库优化

```bash
docker exec giip-database psql -U giip_user -d giip_db -c "VACUUM ANALYZE;"
```

### 3. 日志轮转

配置Docker日志大小：
```json
{
  "log-driver": "json-file",
  "log-opts": {
    "max-size": "10m",
    "max-file": "3"
  }
}
```

## 生产环境建议

### 1. 使用环境变量

不要在代码中硬编码敏感信息：
```bash
# .env
DB_PASSWORD=your_secure_password
JWT_SECRET=your_jwt_secret
```

### 2. 启用HTTPS

使用Let's Encrypt：
```bash
sudo apt install certbot python3-certbot-nginx
sudo certbot --nginx -d yourdomain.com
```

### 3. 设置备份

自动备份数据库：
```bash
# 添加到crontab
0 2 * * * docker exec giip-database pg_dump -U giip_user giip_db > /backup/db_$(date +\%Y\%m\%d).sql
```

### 4. 监控

安装监控工具：
```bash
docker run -d --name=cadvisor \
  -p 8080:8080 \
  -v /:/rootfs:ro \
  -v /var/run:/var/run:ro \
  -v /sys:/sys:ro \
  -v /var/lib/docker/:/var/lib/docker:ro \
  google/cadvisor:latest
```

## 相关文件

- `backend/Dockerfile` - 后端Docker配置（已修改）
- `deploy-ubuntu.sh` - Ubuntu部署脚本
- `docker-compose.yml` - Docker Compose配置
- `.env` - 环境变量

## 总结

通过将 `npm ci` 改为 `npm install --production --no-optional`，我们解决了Ubuntu 24下的构建问题。这个修改：

✅ 更兼容各种环境  
✅ 只安装生产依赖  
✅ 跳过可选依赖  
✅ 减少构建失败  

立即部署并测试！
