@echo off
echo ========================================
echo GIIP 全栈系统验证
echo ========================================
echo.

echo 检查 Docker 服务状态...
docker-compose ps
echo.

echo ========================================
echo 测试后端 API
echo ========================================
echo.

echo 1. 健康检查...
curl -s http://localhost:3000/api/health
echo.
echo.

echo 2. 测试登录...
curl -s -X POST http://localhost:3000/api/auth/login ^
  -H "Content-Type: application/json" ^
  -d "{\"email\":\"admin@giip.info\",\"password\":\"Password123!\"}"
echo.
echo.

echo ========================================
echo 测试前端文件
echo ========================================
echo.

echo 1. 主页...
curl -s -o nul -w "HTTP Status: %%{http_code}\n" http://localhost/
echo.

echo 2. API 客户端...
curl -s -o nul -w "HTTP Status: %%{http_code}\n" http://localhost/js/api-client.js
echo.

echo 3. 认证模块...
curl -s -o nul -w "HTTP Status: %%{http_code}\n" http://localhost/js/auth.js
echo.

echo 4. 认证样式...
curl -s -o nul -w "HTTP Status: %%{http_code}\n" http://localhost/css/auth.css
echo.

echo ========================================
echo 验证完成！
echo ========================================
echo.
echo 测试账号：
echo   邮箱: admin@giip.info
echo   密码: Password123!
echo.
echo 访问地址：
echo   前端: http://localhost
echo   后端: http://localhost:3000
echo.
echo 按任意键退出...
pause >nul
