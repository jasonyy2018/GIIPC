@echo off
echo ========================================
echo 验证当前系统状态
echo ========================================
echo.

echo 1. 检查 Docker 容器状态...
docker ps --format "table {{.Names}}\t{{.Status}}\t{{.Ports}}"
echo.

echo 2. 检查前端文件是否存在...
if exist "frontend\index.html" (
    echo [OK] index.html 存在
) else (
    echo [ERROR] index.html 不存在
)

if exist "frontend\about.html" (
    echo [OK] about.html 存在
) else (
    echo [ERROR] about.html 不存在
)

if exist "frontend\contact.html" (
    echo [OK] contact.html 存在
) else (
    echo [ERROR] contact.html 不存在
)

if exist "frontend\js\auth.js" (
    echo [OK] auth.js 存在
) else (
    echo [ERROR] auth.js 不存在
)

if exist "frontend\js\common.js" (
    echo [OK] common.js 存在
) else (
    echo [ERROR] common.js 不存在
)
echo.

echo 3. 测试前端访问...
echo 打开浏览器访问: http://localhost
echo.

echo 4. 测试后端 API...
curl -s http://localhost:3000/api/health
echo.
echo.

echo ========================================
echo 验证完成！
echo ========================================
echo.
echo 下一步操作：
echo 1. 在浏览器中打开 http://localhost
echo 2. 测试登录功能（admin@giip.info / admin123）
echo 3. 检查右上角是否显示用户头像
echo 4. 测试移动端菜单（F12 切换到移动视图）
echo.
pause
