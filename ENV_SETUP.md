# 环境变量设置指南

## 问题

Docker Compose显示警告：
```
WARN[0000] The "DB_NAME" variable is not set. Defaulting to a blank string.
WARN[0000] The "DB_USER" variable is not set. Defaulting to a blank string.
WARN[0000] The "DB_PASSWORD" variable is not set. Defaulting to a blank string.
WARN[0000] The "JWT_SECRET" variable is not set. Defaulting to a blank string.
```

## 解决方案

### 方法1：使用预设的 .env 文件（推荐）

项目已经包含了一个配置好的 `.env` 文件，包含以下预设值：

```env
# Database Configuration
DB_NAME=giip_db
DB_USER=giip_user
DB_PASSWORD=giip_secure_password_2025
DB_HOST=db
DB_PORT=5432

# JWT Configuration
JWT_SECRET=giip_jwt_secret_key_minimum_256_bits_change_in_production_2025
JWT_EXPIRES_IN=1h

# Frontend Configuration
FRONTEND_URL=http://localhost

# Node Environment
NODE_ENV=production
PORT=3000

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
LOGIN_RATE_LIMIT_MAX=5
```

### 方法2：验证环境变量

**Linux/Mac：**
```bash
chmod +x check-env.sh
./check-env.sh
```

**Windows：**
```bash
check-env.bat
```

### 方法3：手动创建 .env 文件

如果 `.env` 文件丢失，从模板创建：

**Linux/Mac：**
```bash
cp .env.example .env
```

**Windows：**
```bash
copy .env.example .env
```

然后编辑 `.env` 文件，设置你的值。

## 环境变量说明

### 必需变量

| 变量 | 说明 | 预设值 |
|------|------|--------|
| `DB_NAME` | 数据库名称 | `giip_db` |
| `DB_USER` | 数据库用户名 | `giip_user` |
| `DB_PASSWORD` | 数据库密码 | `giip_secure_password_2025` |
| `JWT_SECRET` | JWT密钥（至少32字符） | `giip_jwt_secret_key_minimum_256_bits_change_in_production_2025` |

### 可选变量

| 变量 | 说明 | 默认值 |
|------|------|--------|
| `DB_HOST` | 数据库主机 | `db` |
| `DB_PORT` | 数据库端口 | `5432` |
| `JWT_EXPIRES_IN` | JWT过期时间 | `1h` |
| `FRONTEND_URL` | 前端URL | `http://localhost` |
| `NODE_ENV` | Node环境 | `production` |
| `PORT` | 后端端口 | `3000` |
| `RATE_LIMIT_WINDOW_MS` | 限流窗口（毫秒） | `900000` (15分钟) |
| `RATE_LIMIT_MAX_REQUESTS` | 最大请求数 | `100` |
| `LOGIN_RATE_LIMIT_MAX` | 登录最大尝试次数 | `5` |

## 部署步骤

### 1. 验证环境变量

```bash
# Linux/Mac
./check-env.sh

# Windows
check-env.bat
```

### 2. 启动服务

```bash
docker-compose up -d
```

### 3. 验证部署

```bash
# 检查容器状态
docker-compose ps

# 查看日志
docker logs giip-backend

# 测试API
curl http://localhost:3000/api/health
```

## 生产环境安全建议

### 1. 更改默认密码

**重要！** 在生产环境中，必须更改默认密码：

```env
# 使用强密码
DB_PASSWORD=your_very_strong_password_here_with_special_chars_123!@#

# 使用长JWT密钥（至少64字符）
JWT_SECRET=your_very_long_jwt_secret_key_at_least_64_characters_for_production_use_123456789
```

### 2. 生成安全的密钥

**Linux/Mac：**
```bash
# 生成随机密码
openssl rand -base64 32

# 生成JWT密钥
openssl rand -base64 64
```

**Windows (PowerShell)：**
```powershell
# 生成随机密码
[Convert]::ToBase64String((1..32 | ForEach-Object { Get-Random -Maximum 256 }))

# 生成JWT密钥
[Convert]::ToBase64String((1..64 | ForEach-Object { Get-Random -Maximum 256 }))
```

### 3. 保护 .env 文件

```bash
# 设置文件权限（Linux/Mac）
chmod 600 .env

# 确保 .env 在 .gitignore 中
echo ".env" >> .gitignore
```

### 4. 使用环境变量管理工具

生产环境推荐使用：
- Docker Secrets
- Kubernetes Secrets
- AWS Secrets Manager
- Azure Key Vault
- HashiCorp Vault

## 故障排除

### 问题：环境变量仍然显示警告

**解决方案：**

1. **确认 .env 文件位置**
   ```bash
   ls -la .env
   ```
   `.env` 文件必须在项目根目录（与 `docker-compose.yml` 同级）

2. **检查文件格式**
   - 确保没有BOM标记
   - 使用 `=` 连接变量和值
   - 不要在 `=` 两边加空格
   - 每行一个变量

3. **验证文件内容**
   ```bash
   cat .env
   ```

4. **重新加载环境变量**
   ```bash
   docker-compose down
   docker-compose up -d
   ```

### 问题：数据库连接失败

**检查步骤：**

1. **验证数据库凭据**
   ```bash
   docker exec giip-database psql -U giip_user -d giip_db -c "SELECT 1;"
   ```

2. **检查环境变量是否传递**
   ```bash
   docker exec giip-backend env | grep DB_
   ```

3. **查看后端日志**
   ```bash
   docker logs giip-backend
   ```

### 问题：JWT认证失败

**检查步骤：**

1. **验证JWT_SECRET设置**
   ```bash
   docker exec giip-backend env | grep JWT_SECRET
   ```

2. **确保JWT_SECRET足够长**
   - 最少32字符
   - 推荐64字符或更长

## 开发环境 vs 生产环境

### 开发环境（当前预设）

```env
DB_PASSWORD=giip_secure_password_2025
JWT_SECRET=giip_jwt_secret_key_minimum_256_bits_change_in_production_2025
NODE_ENV=production
```

### 生产环境（推荐）

```env
DB_PASSWORD=<使用openssl生成的强密码>
JWT_SECRET=<使用openssl生成的长密钥>
NODE_ENV=production
FRONTEND_URL=https://yourdomain.com
```

## 相关文件

- `.env` - 环境变量配置（已预设）
- `.env.example` - 环境变量模板
- `check-env.sh` - Linux/Mac环境变量检查脚本
- `check-env.bat` - Windows环境变量检查脚本
- `docker-compose.yml` - Docker Compose配置

## 总结

项目已经包含了预设的 `.env` 文件，包含所有必需的环境变量。你可以：

✅ **直接使用** - 开发环境可以直接使用预设值  
✅ **验证配置** - 运行 `check-env.sh` 或 `check-env.bat`  
✅ **生产部署** - 更改密码和密钥后部署  

立即运行 `docker-compose up -d` 开始使用！
