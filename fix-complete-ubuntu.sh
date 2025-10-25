#!/bin/bash

echo "=========================================="
echo "完整修复脚本 - Ubuntu 部署"
echo "=========================================="
echo ""

# 1. 确保 .env 文件存在
if [ ! -f .env ]; then
    echo "1. 创建 .env 文件..."
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
else
    echo "1. ✓ .env 文件已存在"
fi

echo ""
echo "2. 停止所有容器并删除数据卷（重新初始化数据库）..."
docker-compose down -v

echo ""
echo "3. 删除旧的容器和镜像..."
docker-compose rm -f
docker rmi giip-backend giip-frontend 2>/dev/null || true

echo ""
echo "4. 重新构建所有容器..."
docker-compose build --no-cache

echo ""
echo "5. 启动数据库..."
docker-compose up -d db

echo ""
echo "等待数据库初始化（30秒）..."
for i in {1..30}; do
    echo -n "."
    sleep 1
done
echo ""

echo ""
echo "6. 检查数据库日志..."
docker-compose logs db | tail -20

echo ""
echo "7. 启动后端..."
docker-compose up -d api

echo ""
echo "等待后端启动（30秒）..."
for i in {1..30}; do
    echo -n "."
    sleep 1
done
echo ""

echo ""
echo "8. 检查后端日志..."
docker-compose logs api | tail -30

echo ""
echo "9. 启动前端..."
docker-compose up -d web

echo ""
echo "等待前端启动（10秒）..."
for i in {1..10}; do
    echo -n "."
    sleep 1
done
echo ""

echo ""
echo "=========================================="
echo "最终状态检查"
echo "=========================================="
echo ""
docker-compose ps

echo ""
echo "=========================================="
echo "API 测试"
echo "=========================================="
echo ""
echo "测试健康检查："
curl -s http://localhost:3000/api/health && echo "" || echo "✗ 失败"

echo ""
echo "测试事件 API："
curl -s http://localhost:3000/api/events | head -c 100 && echo "..."

echo ""
echo "测试前端："
curl -s http://localhost/ | head -c 100 && echo "..."

echo ""
echo "=========================================="
echo "完成！"
echo "=========================================="
echo ""
echo "访问应用："
echo "  前端: http://localhost"
echo "  API:  http://localhost:3000/api"
echo ""
echo "查看日志："
echo "  docker-compose logs -f"
echo ""
echo "如果仍有问题："
echo "  docker-compose logs api"
echo "  docker-compose logs db"
echo "=========================================="
