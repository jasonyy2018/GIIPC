@echo off
echo ========================================
echo 验证管理后台修复
echo ========================================
echo.

echo 1. 测试 API 端点...
node test-api-endpoints.js
echo.

echo ========================================
echo 2. 检查文件是否已更新...
echo ========================================
docker exec giip-frontend ls -lh /usr/share/nginx/html/js/admin.js
docker exec giip-frontend ls -lh /usr/share/nginx/html/js/api-client.js
echo.

echo ========================================
echo 3. 清除浏览器缓存并测试
echo ========================================
echo 请执行以下步骤:
echo.
echo 1. 打开浏览器访问: http://localhost/admin.html
echo 2. 按 Ctrl+Shift+R 强制刷新页面
echo 3. 使用以下凭据登录:
echo    邮箱: admin@giip.info
echo    密码: admin123
echo 4. 检查 Dashboard 是否显示正确的数据
echo 5. 检查 News Management 和 Events Management 是否显示数据
echo.
echo 如果仍有问题，请按 F12 打开开发者工具查看控制台错误
echo.

pause
