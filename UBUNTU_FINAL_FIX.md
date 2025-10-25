# Ubuntu 24 最终修复方案

## 问题

1. **环境变量警告** - Docker Compose无法读取 `.env` 文件
2. **数据库不健康** - `giip-database is unhealthy`

## 解决方案

### 1. 更新 `docker-compose.yml`

添加显式的 `env_file` 配置：

```yaml
api:
  env_file:
    - .env
  environment:
    - DB_NAME=${DB_NAME}
    # ...

db:
  env_file:
    - .env
  environment:
    - POSTGRES_DB=${DB_NAME}
    # ...
```

### 2. 使用修复脚本

创建了 `fix-ubuntu-env.sh`，它会：
- 显式导出环境变量
- 清理旧容器和卷
- 使用 `--env-file .env` 参数构建和启动

## 立即部署

```bash
chmod +x fix-ubuntu-env.sh
./fix-ubuntu-env.sh
```

## 验证部署

### 1. 检查容器状态

```bash
docker-compose ps
```

应该看到：
```
NAME            STATUS
giip-frontend   Up (healthy)
giip-backend    Up (healthy)
giip-database   Up (healthy)
```

### 2. 检查环境变量

```bash
# 检查后端容器的环境变量
docker exec giip-backend env | grep -E 'DB_|JWT_'

# 检查数据库容器的环境变量
docker exec giip-database env | grep POSTGRES_
```

### 3. 测试数据库连接

```bash
docker exec giip-database psql -U giip_user -d giip_db -c "SELECT version();"
```

### 4. 测试API

```bash
curl http://localhost:3000/api/health
```

## 故障排除

### 问题：数据库仍然不健康

**检查数据库日志：**
```bash
docker logs giip-database
```

**常见原因：**

1. **端口冲突**
   ```bash
   sudo netstat -tulpn | grep 5432
   ```
   如果端口被占用，停止其他PostgreSQL服务：
   ```bash
   sudo systemctl stop postgresql
   ```

2. **权限问题**
   ```bash
   # 检查数据卷权限
   docker volume inspect giipc_postgres-data
   
   # 重新创建卷
   docker-compose down -v
   docker volume rm giipc_postgres-data
   docker-compose up -d
   ```

3. **初始化脚本错误**
   ```bash
   # 检查schema.sql和seed.sql
   docker exec giip-database psql -U giip_user -d giip_db -c "\dt"
   ```

### 问题：环境变量仍然显示警告

**解决方案：**

1. **检查 .env 文件格式**
   ```bash
   cat -A .env  # 显示隐藏字符
   ```
   确保：
   - 使用Unix换行符（LF，不是CRLF）
   - 没有BOM标记
   - 没有多余空格

2. **转换文件格式**
   ```bash
   dos2unix .env  # 如果安装了dos2unix
   # 或
   sed -i 's/\r$//' .env
   ```

3. **使用显式导出**
   ```bash
   export $(cat .env | grep -v '^#' | xargs)
   docker-compose up -d
   ```

### 问题：后端无法连接数据库

**检查步骤：**

1. **验证网络**
   ```bash
   docker network inspect giipc_giip-network
   ```

2. **测试连接**
   ```bash
   docker exec giip-backend ping -c 3 db
   ```

3. **检查后端日志**
   ```bash
   docker logs giip-backend
   ```

## Ubuntu 24 特定配置

### 1. Docker Compose版本

确保使用 Docker Compose V2：
```bash
docker compose version  # 注意：compose 不是 docker-compose
```

如果使用旧版本：
```bash
# 安装Docker Compose V2
sudo apt-get update
sudo apt-get install docker-compose-plugin
```

### 2. 文件权限

```bash
# 设置正确的权限
chmod 644 .env
chmod 644 docker-compose.yml
chmod +x *.sh
```

### 3. SELinux/AppArmor

如果启用了安全模块，可能需要调整：
```bash
# 检查SELinux状态
getenforce

# 临时禁用（测试用）
sudo setenforce 0
```

## 完整部署流程

### 方法1：使用修复脚本（推荐）

```bash
chmod +x fix-ubuntu-env.sh
./fix-ubuntu-env.sh
```

### 方法2：手动步骤

```bash
# 1. 导出环境变量
export $(cat .env | grep -v '^#' | xargs)

# 2. 停止并清理
docker-compose down -v

# 3. 构建
docker-compose --env-file .env build --no-cache

# 4. 启动
docker-compose --env-file .env up -d

# 5. 等待
sleep 30

# 6. 检查
docker-compose ps
docker logs giip-database
```

## 数据库健康检查

如果数据库不健康，手动检查：

```bash
# 1. 查看日志
docker logs giip-database

# 2. 进入容器
docker exec -it giip-database sh

# 3. 测试连接
psql -U giip_user -d giip_db

# 4. 检查表
\dt

# 5. 退出
\q
exit
```

## 相关文件

- `.env` - 环境变量配置（已更新）
- `docker-compose.yml` - Docker Compose配置（已添加env_file）
- `fix-ubuntu-env.sh` - Ubuntu修复脚本
- `UBUNTU_FINAL_FIX.md` - 本文档

## 总结

通过以下修改解决Ubuntu 24的环境变量问题：

✅ 在 `docker-compose.yml` 中添加 `env_file: - .env`  
✅ 创建 `fix-ubuntu-env.sh` 脚本显式导出变量  
✅ 更新 `.env` 文件包含所有必需变量  
✅ 添加数据库健康检查故障排除步骤  

立即运行 `./fix-ubuntu-env.sh` 部署！
