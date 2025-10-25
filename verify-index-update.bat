@echo off
chcp 65001 >nul
echo ========================================
echo 验证 index.html 用户菜单更新
echo ========================================
echo.

echo [1/4] 检查 Docker 容器状态...
docker ps --format "{{.Names}} - {{.Status}}" | findstr giip
echo.

echo [2/4] 验证容器中的 index.html...
docker exec giip-frontend sh -c "grep -c 'auth-logged-in' /usr/share/nginx/html/index.html"
if %ERRORLEVEL% EQU 0 (
    echo [OK] index.html 包含 auth-logged-in
) else (
    echo [ERROR] index.html 不包含 auth-logged-in
)
echo.

echo [3/4] 验证容器中的 about.html...
docker exec giip-frontend sh -c "grep -c 'auth-logged-in' /usr/share/nginx/html/about.html"
if %ERRORLEVEL% EQU 0 (
    echo [OK] about.html 包含 auth-logged-in
) else (
    echo [ERROR] about.html 不包含 auth-logged-in
)
echo.

echo [4/4] 验证容器中的 contact.html...
docker exec giip-frontend sh -c "grep -c 'auth-logged-in' /usr/share/nginx/html/contact.html"
if %ERRORLEVEL% EQU 0 (
    echo [OK] contact.html 包含 auth-logged-in
) else (
    echo [ERROR] contact.html 不包含 auth-logged-in
)
echo.

echo ========================================
echo ✅ 验证完成！
echo ========================================
echo.
echo 📋 手动测试步骤：
echo.
echo 1. 打开浏览器访问: http://localhost
echo    - 检查右上角是否有 Login/Register 按钮
echo.
echo 2. 登录测试
echo    - 邮箱: admin@giip.info
echo    - 密码: admin123
echo    - 登录后应该显示用户头像和邮箱
echo.
echo 3. 测试用户菜单
echo    - 点击头像应该显示下拉菜单
echo    - 菜单包含: 用户信息, Admin Dashboard, Logout
echo.
echo 4. 测试移动端 (F12 切换到移动视图)
echo    - 点击汉堡菜单 ☰
echo    - 登录后底部应该显示用户信息
echo.
echo 5. 测试其他页面
echo    - http://localhost/about.html
echo    - http://localhost/contact.html
echo    - 功能应该与 index.html 一致
echo.
echo ========================================
echo 详细文档: INDEX_用户菜单更新完成.md
echo ========================================
echo.
pause
