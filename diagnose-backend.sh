#!/bin/bash

echo "=========================================="
echo "后端容器诊断脚本"
echo "=========================================="
echo ""

# 1. 检查 .env 文件
echo "1. 检查 .env 文件..."
if [ -f .env ]; then
    echo "✓ .env 文件存在"
    echo ""
    echo "环境变量内容（隐藏敏感信息）："
    cat .env | grep -v PASSWORD | grep -v SECRET
else
    echo "✗ .env 文件不存在！"
    echo ""
    echo "创建 .env 文件..."
    cat > .env << 'EOF'
# Database Configuration
DB_NAME=giip_db
DB_USER=giip_user
DB_PASSWORD=giip_secure_password_2024
DB_HOST=db
DB_PORT=5432

# JWT Configuration
JWT_SECRET=your_jwt_secret_key_minimum_256_bits_here_change_this_in_production
JWT_EXPIRES_IN=1h

# Frontend Configuration
FRONTEND_URL=http://localhost

# Node Environment
NODE_ENV=production
PORT=3000

# Rate Limiting (optional)
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
LOGIN_RATE_LIMIT_MAX=5
EOF
    echo "✓ .env 文件已创建"
fi

echo ""
echo "=========================================="
echo "2. 停止所有容器..."
docker-compose down

echo ""
echo "=========================================="
echo "3. 清理旧容器和镜像（可选）..."
docker-compose rm -f

echo ""
echo "=========================================="
echo "4. 重新构建后端容器..."
docker-compose build --no-cache api

echo ""
echo "=========================================="
echo "5. 启动数据库..."
docker-compose up -d db

echo ""
echo "等待数据库启动（30秒）..."
sleep 30

echo ""
echo "=========================================="
echo "6. 检查数据库状态..."
docker-compose ps db
docker-compose logs --tail=20 db

echo ""
echo "=========================================="
echo "7. 启动后端..."
docker-compose up -d api

echo ""
echo "等待后端启动（20秒）..."
sleep 20

echo ""
echo "=========================================="
echo "8. 检查后端状态..."
docker-compose ps api

echo ""
echo "=========================================="
echo "9. 查看后端日志..."
docker-compose logs --tail=50 api

echo ""
echo "=========================================="
echo "10. 测试后端健康检查..."
echo "尝试访问: http://localhost:3000/api/health"
curl -f http://localhost:3000/api/health || echo "健康检查失败"

echo ""
echo "=========================================="
echo "11. 如果后端仍然失败，查看详细日志："
echo "    docker-compose logs -f api"
echo ""
echo "12. 进入容器调试："
echo "    docker exec -it giip-backend sh"
echo ""
echo "13. 检查数据库连接："
echo "    docker exec -it giip-database psql -U giip_user -d giip_db"
echo ""
echo "=========================================="
