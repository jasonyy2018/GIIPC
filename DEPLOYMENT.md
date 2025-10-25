# 生产环境部署指南

本文档提供 GIIP 全栈应用在生产环境中部署的详细指南。

## 目录

- [部署前准备](#部署前准备)
- [环境配置](#环境配置)
- [Docker 部署](#docker-部署)
- [反向代理配置](#反向代理配置)
- [SSL/TLS 配置](#ssltls-配置)
- [数据库优化](#数据库优化)
- [监控和日志](#监控和日志)
- [备份策略](#备份策略)
- [安全加固](#安全加固)
- [性能优化](#性能优化)
- [故障排除](#故障排除)

## 部署前准备

### 系统要求

**最低配置**:
- CPU: 2 核
- 内存: 4GB RAM
- 存储: 20GB SSD
- 操作系统: Ubuntu 20.04+ / CentOS 8+ / Debian 11+

**推荐配置**:
- CPU: 4 核
- 内存: 8GB RAM
- 存储: 50GB SSD
- 操作系统: Ubuntu 22.04 LTS

### 软件要求

- Docker Engine 20.10+
- Docker Compose 2.0+
- Nginx (用于反向代理)
- Certbot (用于 SSL 证书)

### 安装 Docker

```bash
# Ubuntu/Debian
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh
sudo usermod -aG docker $USER

# 安装 Docker Compose
sudo curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose

# 验证安装
docker --version
docker-compose --version
```

## 环境配置

### 1. 创建生产环境配置

```bash
# 克隆仓库
git clone https://github.com/your-org/giip-fullstack-app.git
cd giip-fullstack-app

# 创建生产环境配置
cp .env.example .env.production
```

### 2. 配置环境变量

编辑 `.env.production`:

```env
# 环境
NODE_ENV=production

# 数据库配置
DB_NAME=giip_db
DB_USER=giip_user
DB_PASSWORD=<生成强密码>
DB_HOST=db
DB_PORT=5432

# JWT 配置
JWT_SECRET=<生成强密钥>
JWT_EXPIRES_IN=1h

# 前端配置
FRONTEND_URL=https://yourdomain.com

# API 配置
PORT=3000

# 日志级别
LOG_LEVEL=info
```

### 3. 生成安全密钥

```bash
# 生成 JWT 密钥 (至少 256 位)
openssl rand -base64 32

# 生成数据库密码
openssl rand -base64 24
```

### 4. 更新 docker-compose.yml

创建 `docker-compose.prod.yml`:

```yaml
version: '3.8'

services:
  web:
    build:
      context: ./frontend
      dockerfile: Dockerfile
    restart: always
    ports:
      - "80:80"
    depends_on:
      - api
    networks:
      - giip-network
    logging:
      driver: "json-file"
      options:
        max-size: "10m"
        max-file: "3"

  api:
    build:
      context: ./backend
      dockerfile: Dockerfile
    restart: always
    ports:
      - "3000:3000"
    env_file:
      - .env.production
    depends_on:
      db:
        condition: service_healthy
    networks:
      - giip-network
    logging:
      driver: "json-file"
      options:
        max-size: "10m"
        max-file: "3"
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:3000/api/health"]
      interval: 30s
      timeout: 10s
      retries: 3
      start_period: 40s

  db:
    image: postgres:16-alpine
    restart: always
    env_file:
      - .env.production
    environment:
      POSTGRES_DB: ${DB_NAME}
      POSTGRES_USER: ${DB_USER}
      POSTGRES_PASSWORD: ${DB_PASSWORD}
    volumes:
      - postgres-data:/var/lib/postgresql/data
      - ./backend/schema.sql:/docker-entrypoint-initdb.d/1-schema.sql
      - ./backend/seeds/seed.sql:/docker-entrypoint-initdb.d/2-seed.sql
      - ./backups:/backups
    networks:
      - giip-network
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U ${DB_USER}"]
      interval: 10s
      timeout: 5s
      retries: 5
    logging:
      driver: "json-file"
      options:
        max-size: "10m"
        max-file: "3"

volumes:
  postgres-data:
    driver: local

networks:
  giip-network:
    driver: bridge
```

## Docker 部署

### 1. 构建和启动服务

```bash
# 使用生产配置启动
docker-compose -f docker-compose.prod.yml up -d --build

# 查看服务状态
docker-compose -f docker-compose.prod.yml ps

# 查看日志
docker-compose -f docker-compose.prod.yml logs -f
```

### 2. 验证部署

```bash
# 检查 API 健康
curl http://localhost:3000/api/health

# 检查前端
curl http://localhost/health

# 检查数据库连接
docker-compose -f docker-compose.prod.yml exec db psql -U giip_user -d giip_db -c "SELECT 1;"
```

### 3. 修改默认密码

⚠️ **重要**: 立即修改默认测试账户密码!

```bash
# 连接到数据库
docker-compose -f docker-compose.prod.yml exec db psql -U giip_user -d giip_db

# 更新密码 (使用 bcrypt 哈希)
# 首先在本地生成新密码的哈希值
node -e "const bcrypt = require('bcrypt'); bcrypt.hash('NewSecurePassword123!', 10, (err, hash) => console.log(hash));"

# 然后在数据库中更新
UPDATE users SET password = '<bcrypt_hash>' WHERE email = 'admin@giip.com';
UPDATE users SET password = '<bcrypt_hash>' WHERE email = 'editor@giip.com';
UPDATE users SET password = '<bcrypt_hash>' WHERE email = 'user@giip.com';
```

## 反向代理配置

### Nginx 配置

创建 `/etc/nginx/sites-available/giip`:

```nginx
# HTTP - 重定向到 HTTPS
server {
    listen 80;
    listen [::]:80;
    server_name yourdomain.com www.yourdomain.com;
    
    # Let's Encrypt 验证
    location /.well-known/acme-challenge/ {
        root /var/www/certbot;
    }
    
    # 重定向到 HTTPS
    location / {
        return 301 https://$server_name$request_uri;
    }
}

# HTTPS
server {
    listen 443 ssl http2;
    listen [::]:443 ssl http2;
    server_name yourdomain.com www.yourdomain.com;
    
    # SSL 证书
    ssl_certificate /etc/letsencrypt/live/yourdomain.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/yourdomain.com/privkey.pem;
    
    # SSL 配置
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers HIGH:!aNULL:!MD5;
    ssl_prefer_server_ciphers on;
    ssl_session_cache shared:SSL:10m;
    ssl_session_timeout 10m;
    
    # 安全头
    add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;
    
    # 前端
    location / {
        proxy_pass http://localhost:80;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
    
    # API
    location /api/ {
        proxy_pass http://localhost:3000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        
        # WebSocket 支持 (如果需要)
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
        
        # 超时设置
        proxy_connect_timeout 60s;
        proxy_send_timeout 60s;
        proxy_read_timeout 60s;
    }
    
    # 日志
    access_log /var/log/nginx/giip_access.log;
    error_log /var/log/nginx/giip_error.log;
}
```

启用配置:

```bash
# 创建符号链接
sudo ln -s /etc/nginx/sites-available/giip /etc/nginx/sites-enabled/

# 测试配置
sudo nginx -t

# 重启 Nginx
sudo systemctl restart nginx
```

## SSL/TLS 配置

### 使用 Let's Encrypt

```bash
# 安装 Certbot
sudo apt update
sudo apt install certbot python3-certbot-nginx

# 获取证书
sudo certbot --nginx -d yourdomain.com -d www.yourdomain.com

# 自动续期
sudo certbot renew --dry-run

# 设置自动续期 cron 任务
sudo crontab -e
# 添加: 0 0 * * * certbot renew --quiet
```

### 手动证书配置

如果使用其他 SSL 证书提供商:

```bash
# 将证书文件放置在
/etc/ssl/certs/yourdomain.com.crt
/etc/ssl/private/yourdomain.com.key

# 更新 Nginx 配置中的证书路径
ssl_certificate /etc/ssl/certs/yourdomain.com.crt;
ssl_certificate_key /etc/ssl/private/yourdomain.com.key;
```

## 数据库优化

### PostgreSQL 配置优化

编辑 `postgresql.conf`:

```conf
# 连接设置
max_connections = 100
shared_buffers = 256MB
effective_cache_size = 1GB
maintenance_work_mem = 64MB
checkpoint_completion_target = 0.9
wal_buffers = 16MB
default_statistics_target = 100
random_page_cost = 1.1
effective_io_concurrency = 200
work_mem = 2621kB
min_wal_size = 1GB
max_wal_size = 4GB

# 日志设置
logging_collector = on
log_directory = 'log'
log_filename = 'postgresql-%Y-%m-%d_%H%M%S.log'
log_rotation_age = 1d
log_rotation_size = 100MB
log_line_prefix = '%t [%p]: [%l-1] user=%u,db=%d,app=%a,client=%h '
log_checkpoints = on
log_connections = on
log_disconnections = on
log_duration = off
log_lock_waits = on
```

### 创建索引

```sql
-- 用户表索引
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_role_id ON users(role_id);

-- 新闻表索引
CREATE INDEX IF NOT EXISTS idx_news_published_date ON news(published_date DESC);
CREATE INDEX IF NOT EXISTS idx_news_created_by ON news(created_by);

-- 活动表索引
CREATE INDEX IF NOT EXISTS idx_events_date ON events(date);
CREATE INDEX IF NOT EXISTS idx_events_created_by ON events(created_by);

-- 会议表索引
CREATE INDEX IF NOT EXISTS idx_conferences_created_by ON conferences(created_by);
```

## 监控和日志

### 应用监控

#### 使用 PM2 (可选,如果不使用 Docker)

```bash
# 安装 PM2
npm install -g pm2

# 启动应用
pm2 start backend/src/server.js --name giip-api

# 监控
pm2 monit

# 查看日志
pm2 logs giip-api

# 设置开机自启
pm2 startup
pm2 save
```

#### Docker 日志管理

```bash
# 查看实时日志
docker-compose -f docker-compose.prod.yml logs -f api

# 查看最近 100 行
docker-compose -f docker-compose.prod.yml logs --tail=100 api

# 导出日志
docker-compose -f docker-compose.prod.yml logs api > api.log
```

### 系统监控

#### 安装监控工具

```bash
# 安装 htop
sudo apt install htop

# 安装 netdata (可选)
bash <(curl -Ss https://my-netdata.io/kickstart.sh)
```

#### 监控脚本

创建 `monitor.sh`:

```bash
#!/bin/bash

# 检查服务状态
check_service() {
    service=$1
    status=$(docker-compose -f docker-compose.prod.yml ps -q $service)
    if [ -z "$status" ]; then
        echo "❌ $service is down"
        # 发送告警 (邮件、Slack 等)
        return 1
    else
        echo "✅ $service is running"
        return 0
    fi
}

# 检查 API 健康
check_api() {
    response=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:3000/api/health)
    if [ "$response" = "200" ]; then
        echo "✅ API is healthy"
        return 0
    else
        echo "❌ API health check failed (HTTP $response)"
        return 1
    fi
}

# 检查磁盘空间
check_disk() {
    usage=$(df -h / | awk 'NR==2 {print $5}' | sed 's/%//')
    if [ "$usage" -gt 80 ]; then
        echo "⚠️  Disk usage is high: ${usage}%"
        return 1
    else
        echo "✅ Disk usage is OK: ${usage}%"
        return 0
    fi
}

# 执行检查
echo "=== System Health Check ==="
check_service "web"
check_service "api"
check_service "db"
check_api
check_disk
```

设置定时任务:

```bash
# 每 5 分钟检查一次
crontab -e
# 添加: */5 * * * * /path/to/monitor.sh >> /var/log/giip-monitor.log 2>&1
```

## 备份策略

### 数据库备份

#### 自动备份脚本

创建 `backup.sh`:

```bash
#!/bin/bash

# 配置
BACKUP_DIR="/backups"
DATE=$(date +%Y%m%d_%H%M%S)
BACKUP_FILE="giip_db_${DATE}.sql"
RETENTION_DAYS=7

# 创建备份目录
mkdir -p $BACKUP_DIR

# 备份数据库
docker-compose -f docker-compose.prod.yml exec -T db pg_dump -U giip_user giip_db > "${BACKUP_DIR}/${BACKUP_FILE}"

# 压缩备份
gzip "${BACKUP_DIR}/${BACKUP_FILE}"

# 删除旧备份
find $BACKUP_DIR -name "giip_db_*.sql.gz" -mtime +$RETENTION_DAYS -delete

echo "Backup completed: ${BACKUP_FILE}.gz"
```

设置定时备份:

```bash
# 每天凌晨 2 点备份
crontab -e
# 添加: 0 2 * * * /path/to/backup.sh >> /var/log/giip-backup.log 2>&1
```

#### 恢复数据库

```bash
# 解压备份
gunzip giip_db_20251018_020000.sql.gz

# 恢复数据库
docker-compose -f docker-compose.prod.yml exec -T db psql -U giip_user -d giip_db < giip_db_20251018_020000.sql
```

### 远程备份

```bash
# 上传到 S3 (需要 AWS CLI)
aws s3 cp ${BACKUP_DIR}/${BACKUP_FILE}.gz s3://your-bucket/backups/

# 或使用 rsync 到远程服务器
rsync -avz ${BACKUP_DIR}/ user@backup-server:/backups/giip/
```

## 安全加固

### 防火墙配置

```bash
# 安装 UFW
sudo apt install ufw

# 默认策略
sudo ufw default deny incoming
sudo ufw default allow outgoing

# 允许 SSH
sudo ufw allow 22/tcp

# 允许 HTTP/HTTPS
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp

# 启用防火墙
sudo ufw enable

# 查看状态
sudo ufw status
```

### Fail2Ban 配置

```bash
# 安装 Fail2Ban
sudo apt install fail2ban

# 创建配置
sudo nano /etc/fail2ban/jail.local
```

添加配置:

```ini
[DEFAULT]
bantime = 3600
findtime = 600
maxretry = 5

[sshd]
enabled = true

[nginx-http-auth]
enabled = true

[nginx-limit-req]
enabled = true
```

启动服务:

```bash
sudo systemctl enable fail2ban
sudo systemctl start fail2ban
```

### 系统更新

```bash
# 定期更新系统
sudo apt update
sudo apt upgrade -y

# 自动安全更新
sudo apt install unattended-upgrades
sudo dpkg-reconfigure -plow unattended-upgrades
```

## 性能优化

### 应用层优化

1. **启用 Gzip 压缩** (Nginx)

```nginx
gzip on;
gzip_vary on;
gzip_min_length 1024;
gzip_types text/plain text/css text/xml text/javascript application/json application/javascript application/xml+rss;
```

2. **启用缓存**

```nginx
# 静态资源缓存
location ~* \.(jpg|jpeg|png|gif|ico|css|js)$ {
    expires 1y;
    add_header Cache-Control "public, immutable";
}
```

3. **连接池优化**

在 `backend/src/config/db.js` 中:

```javascript
const pool = new Pool({
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
});
```

### 数据库优化

```sql
-- 定期清理
VACUUM ANALYZE;

-- 重建索引
REINDEX DATABASE giip_db;

-- 查看慢查询
SELECT * FROM pg_stat_statements ORDER BY total_time DESC LIMIT 10;
```

### CDN 配置

使用 CDN 加速静态资源:

1. 将静态资源上传到 CDN
2. 更新前端资源 URL
3. 配置 CDN 缓存策略

## 故障排除

### 常见问题

#### 1. 容器无法启动

```bash
# 查看详细日志
docker-compose -f docker-compose.prod.yml logs api

# 检查配置
docker-compose -f docker-compose.prod.yml config

# 重新构建
docker-compose -f docker-compose.prod.yml up -d --build --force-recreate
```

#### 2. 数据库连接失败

```bash
# 检查数据库状态
docker-compose -f docker-compose.prod.yml exec db pg_isready -U giip_user

# 查看数据库日志
docker-compose -f docker-compose.prod.yml logs db

# 测试连接
docker-compose -f docker-compose.prod.yml exec db psql -U giip_user -d giip_db -c "SELECT 1;"
```

#### 3. 内存不足

```bash
# 查看资源使用
docker stats

# 限制容器内存
# 在 docker-compose.prod.yml 中添加:
services:
  api:
    deploy:
      resources:
        limits:
          memory: 512M
```

#### 4. 磁盘空间不足

```bash
# 清理 Docker 资源
docker system prune -a

# 清理日志
sudo truncate -s 0 /var/log/nginx/*.log
docker-compose -f docker-compose.prod.yml logs --tail=0 -f > /dev/null
```

### 紧急恢复

```bash
# 1. 停止所有服务
docker-compose -f docker-compose.prod.yml down

# 2. 恢复数据库
docker-compose -f docker-compose.prod.yml up -d db
# 等待数据库启动
sleep 10
# 恢复备份
docker-compose -f docker-compose.prod.yml exec -T db psql -U giip_user -d giip_db < backup.sql

# 3. 重启所有服务
docker-compose -f docker-compose.prod.yml up -d
```

## 检查清单

部署前检查:

- [ ] 环境变量已正确配置
- [ ] JWT 密钥已生成并设置
- [ ] 数据库密码已更改
- [ ] 默认用户密码已修改
- [ ] SSL 证书已配置
- [ ] 防火墙规则已设置
- [ ] 备份脚本已配置
- [ ] 监控已设置
- [ ] 日志轮转已配置
- [ ] 域名 DNS 已配置
- [ ] CORS 设置已更新
- [ ] 速率限制已启用

部署后验证:

- [ ] 所有服务正常运行
- [ ] API 健康检查通过
- [ ] 前端可以访问
- [ ] 数据库连接正常
- [ ] SSL 证书有效
- [ ] 日志正常记录
- [ ] 备份正常执行
- [ ] 监控正常工作

## 支持

如需帮助:

- 查看 [README.md](./README.md)
- 查看 [故障排除文档](./TROUBLESHOOTING.md)
- 提交 Issue
- 联系技术支持

---

**祝部署顺利! 🚀**

