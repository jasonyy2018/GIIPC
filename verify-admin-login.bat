@echo off
chcp 65001 >nul
echo ==========================================
echo 验证管理后台登录和数据
echo ==========================================
echo.

echo [1/4] 测试登录 API...
curl -s -X POST http://localhost:3000/api/auth/login -H "Content-Type: application/json" -d "{\"email\":\"admin@giip.info\",\"password\":\"admin123\"}" > temp_login.json

findstr "success.*true" temp_login.json >nul
if %ERRORLEVEL% EQU 0 (
    echo [OK] 登录成功
) else (
    echo [ERROR] 登录失败
    type temp_login.json
    del temp_login.json
    pause
    exit /b 1
)
echo.

echo [2/4] 检查数据库数据...
echo News 记录:
docker exec giip-database psql -U giip_user -d giip_db -t -c "SELECT id, title FROM news ORDER BY id;"
echo.
echo Events 记录:
docker exec giip-database psql -U giip_user -d giip_db -t -c "SELECT id, title FROM events ORDER BY id;"
echo.

echo [3/4] 测试 API 访问（无认证）...
curl -s http://localhost:3000/api/news | findstr "success.*true" >nul
if %ERRORLEVEL% EQU 0 (
    echo [OK] News API 可以公开访问
) else (
    echo [ERROR] News API 无法访问
)

curl -s http://localhost:3000/api/events | findstr "success.*true" >nul
if %ERRORLEVEL% EQU 0 (
    echo [OK] Events API 可以公开访问
) else (
    echo [ERROR] Events API 无法访问
)
echo.

echo [4/4] 检查前端文件...
docker exec giip-frontend grep "import.*NewsAPI" /usr/share/nginx/html/js/data-renderer.js >nul 2>&1
if %ERRORLEVEL% EQU 0 (
    echo [OK] data-renderer.js 包含正确的 import 语句
) else (
    echo [ERROR] data-renderer.js 缺少 import 语句
)
echo.

del temp_login.json 2>nul

echo ==========================================
echo ✅ 验证完成！
echo ==========================================
echo.
echo 📋 现在可以测试：
echo.
echo 1. 访问管理后台: http://localhost/admin.html
echo    - 邮箱: admin@giip.info
echo    - 密码: admin123
echo    - 应该成功登录
echo.
echo 2. 检查 Dashboard
echo    - 应该显示统计数据
echo    - News Count: 3
echo    - Events Count: 3-4
echo.
echo 3. 检查 News Management
echo    - 点击 "News Management" 标签
echo    - 应该显示 3 条记录
echo.
echo 4. 检查 Events Management
echo    - 点击 "Events Management" 标签
echo    - 应该显示 3-4 条记录
echo.
echo 5. 测试前端首页: http://localhost
echo    - 应该显示新闻和活动
echo    - 按 F12 检查控制台
echo    - 应该没有 "NewsAPI is not defined" 错误
echo.
echo ==========================================
echo 详细文档: 管理后台修复总结.md
echo ==========================================
echo.
pause
