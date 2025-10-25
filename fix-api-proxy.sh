#!/bin/bash

echo "修复 API 代理配置..."
echo ""

# 停止容器
echo "1. 停止现有容器..."
docker-compose down

# 重新构建前端（因为 nginx.conf 已更新）
echo ""
echo "2. 重新构建前端容器..."
docker-compose build web

# 启动所有服务
echo ""
echo "3. 启动所有服务..."
docker-compose up -d

# 等待服务启动
echo ""
echo "4. 等待服务启动..."
sleep 10

# 检查服务状态
echo ""
echo "5. 检查服务状态..."
docker-compose ps

echo ""
echo "✓ 修复完成！"
echo ""
echo "检查日志："
echo "  docker-compose logs -f api"
echo "  docker-compose logs -f web"
echo ""
echo "测试 API："
echo "  curl http://localhost/api/health"
echo "  curl http://localhost/api/events"
