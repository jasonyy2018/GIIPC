#!/bin/bash

echo "=========================================="
echo "Ubuntu 后端快速修复脚本"
echo "=========================================="
echo ""

# 确保 .env 文件存在
if [ ! -f .env ]; then
    echo "创建 .env 文件..."
    JWT_SECRET=$(openssl rand -base64 32)
    DB_PASSWORD=$(openssl rand -base64 24)
    
    cat > .env << EOF
DB_NAME=giip_db
DB_USER=giip_user
DB_PASSWORD=${DB_PASSWORD}
DB_HOST=db
DB_PORT=5432
JWT_SECRET=${JWT_SECRET}
JWT_EXPIRES_IN=1h
FRONTEND_URL=http://localhost
NODE_ENV=production
PORT=3000
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
LOGIN_RATE_LIMIT_MAX=5
EOF
    echo "✓ .env 文件已创建"
fi

# 停止并清理
echo ""
echo "停止现有容器..."
docker-compose down -v

# 重新构建
echo ""
echo "重新构建容器..."
docker-compose build --no-cache

# 启动
echo ""
echo "启动服务..."
docker-compose up -d

# 等待
echo ""
echo "等待服务启动（40秒）..."
for i in {1..40}; do
    echo -n "."
    sleep 1
done
echo ""

# 检查状态
echo ""
echo "=========================================="
echo "服务状态："
docker-compose ps

echo ""
echo "=========================================="
echo "后端日志（最后30行）："
docker-compose logs --tail=30 api

echo ""
echo "=========================================="
echo "数据库日志（最后20行）："
docker-compose logs --tail=20 db

echo ""
echo "=========================================="
echo "测试 API："
echo ""
echo "健康检查："
curl -s http://localhost:3000/api/health && echo "" || echo "失败"

echo ""
echo "获取事件："
curl -s http://localhost:3000/api/events | head -c 200 && echo "..."

echo ""
echo "=========================================="
echo "如果仍有问题，运行："
echo "  docker-compose logs -f api"
echo "=========================================="
