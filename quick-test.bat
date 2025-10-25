@echo off
chcp 65001 >nul
echo ========================================
echo GIIP 系统快速测试
echo ========================================
echo.

echo [1/5] 检查 Docker 容器状态...
docker ps --format "table {{.Names}}\t{{.Status}}" | findstr "giip"
if %ERRORLEVEL% NEQ 0 (
    echo [ERROR] Docker 容器未运行！
    echo 请运行: docker-compose up -d
    pause
    exit /b 1
)
echo [OK] Docker 容器运行正常
echo.

echo [2/5] 测试前端访问...
curl -s -o nul -w "HTTP 状态码: %%{http_code}\n" http://localhost
if %ERRORLEVEL% NEQ 0 (
    echo [ERROR] 前端无法访问！
    pause
    exit /b 1
)
echo [OK] 前端访问正常
echo.

echo [3/5] 测试后端 API 健康检查...
curl -s http://localhost:3000/api/health | findstr "ok" >nul
if %ERRORLEVEL% NEQ 0 (
    echo [ERROR] 后端 API 异常！
    pause
    exit /b 1
)
echo [OK] 后端 API 正常
echo.

echo [4/5] 测试数据库连接...
docker exec giip-database psql -U giip_user -d giip_db -c "SELECT 1;" >nul 2>&1
if %ERRORLEVEL% NEQ 0 (
    echo [ERROR] 数据库连接失败！
    pause
    exit /b 1
)
echo [OK] 数据库连接正常
echo.

echo [5/5] 检查关键文件...
set FILES_OK=1

if not exist "frontend\index.html" (
    echo [ERROR] frontend\index.html 不存在
    set FILES_OK=0
)

if not exist "frontend\about.html" (
    echo [ERROR] frontend\about.html 不存在
    set FILES_OK=0
)

if not exist "frontend\contact.html" (
    echo [ERROR] frontend\contact.html 不存在
    set FILES_OK=0
)

if not exist "frontend\js\auth.js" (
    echo [ERROR] frontend\js\auth.js 不存在
    set FILES_OK=0
)

if not exist "frontend\js\common.js" (
    echo [ERROR] frontend\js\common.js 不存在
    set FILES_OK=0
)

if %FILES_OK%==0 (
    echo [ERROR] 关键文件缺失！
    pause
    exit /b 1
)
echo [OK] 所有关键文件存在
echo.

echo ========================================
echo ✅ 自动化测试全部通过！
echo ========================================
echo.
echo 📋 手动测试清单：
echo.
echo 1. 打开浏览器访问: http://localhost
echo    - 检查页面是否正常显示
echo    - 检查右上角是否有 Login/Register 按钮
echo.
echo 2. 测试登录功能
echo    - 邮箱: admin@giip.info
echo    - 密码: admin123
echo    - 登录后应该显示用户头像
echo.
echo 3. 测试用户菜单
echo    - 点击头像应该显示下拉菜单
echo    - 菜单应该包含用户信息和 Logout 按钮
echo.
echo 4. 测试移动端 (F12 → Ctrl+Shift+M)
echo    - 点击汉堡菜单应该显示侧边栏
echo    - 登录后应该显示用户信息
echo.
echo 5. 测试其他页面
echo    - http://localhost/about.html
echo    - http://localhost/contact.html
echo    - http://localhost/admin.html (需要登录)
echo.
echo ========================================
echo 详细测试指南请查看: 快速测试指南.md
echo ========================================
echo.
pause
