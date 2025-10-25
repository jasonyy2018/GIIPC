@echo off
chcp 65001 >nul
echo.
echo ╔════════════════════════════════════════════════════════════╗
echo ║          管理后台修复 - 快速验证                          ║
echo ╚════════════════════════════════════════════════════════════╝
echo.

echo [1/4] 检查 Docker 容器状态...
docker ps --filter "name=giip" --format "table {{.Names}}\t{{.Status}}"
echo.

echo [2/4] 测试 API 端点...
echo.
curl -s http://localhost:3000/api/news | findstr "success"
if %errorlevel% equ 0 (
    echo ✅ News API 正常
) else (
    echo ❌ News API 异常
)

curl -s http://localhost:3000/api/events | findstr "success"
if %errorlevel% equ 0 (
    echo ✅ Events API 正常
) else (
    echo ❌ Events API 异常
)
echo.

echo [3/4] 检查文件更新时间...
docker exec giip-frontend ls -lh /usr/share/nginx/html/js/admin.js
docker exec giip-frontend ls -lh /usr/share/nginx/html/js/api-client.js
echo.

echo [4/4] 验证步骤
echo ════════════════════════════════════════════════════════════
echo.
echo 📌 请按照以下步骤验证：
echo.
echo 1. 打开浏览器访问: http://localhost/admin.html
echo.
echo 2. 🚨 重要：按 Ctrl+Shift+R 强制刷新（清除缓存）
echo.
echo 3. 使用以下凭据登录:
echo    📧 邮箱: admin@giip.info
echo    🔑 密码: admin123
echo.
echo 4. 检查 Dashboard 统计数据:
echo    ✓ Total News: 应显示 3
echo    ✓ Total Events: 应显示 4
echo    ✓ Total Conferences: 应显示 3
echo    ✓ Total Users: 应显示 5
echo.
echo 5. 点击 "News Management" 查看新闻列表（应显示 3 条）
echo.
echo 6. 点击 "Events Management" 查看活动列表（应显示 4 条）
echo.
echo ════════════════════════════════════════════════════════════
echo.
echo 💡 提示：如果仍然看到错误，请：
echo    - 按 F12 打开开发者工具查看控制台错误
echo    - 确认已清除浏览器缓存
echo    - 查看 Network 标签中的 API 请求响应
echo.
echo 📄 详细文档：
echo    - 修复完成-请验证.md
echo    - 管理后台修复总结-最终版.md
echo    - 管理后台问题诊断.md
echo.

pause
