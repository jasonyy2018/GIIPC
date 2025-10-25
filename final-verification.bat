@echo off
chcp 65001 >nul
echo ==========================================
echo 最终验证 - News 和 Events 数据
echo ==========================================
echo.

echo [1/6] 检查 Docker 容器...
docker ps --format "{{.Names}} - {{.Status}}" | findstr giip
echo.

echo [2/6] 检查数据库数据...
echo News 记录数:
docker exec giip-database psql -U giip_user -d giip_db -t -c "SELECT COUNT(*) FROM news;"
echo Events 记录数:
docker exec giip-database psql -U giip_user -d giip_db -t -c "SELECT COUNT(*) FROM events;"
echo.

echo [3/6] 测试 News API...
curl -s http://localhost:3000/api/news | findstr "success.*true" >nul
if %ERRORLEVEL% EQU 0 (
    echo [OK] News API 返回成功
) else (
    echo [ERROR] News API 失败
)
echo.

echo [4/6] 测试 Events API...
curl -s http://localhost:3000/api/events | findstr "success.*true" >nul
if %ERRORLEVEL% EQU 0 (
    echo [OK] Events API 返回成功
) else (
    echo [ERROR] Events API 失败
)
echo.

echo [5/6] 检查前端 import 语句...
docker exec giip-frontend grep "import.*NewsAPI" /usr/share/nginx/html/js/data-renderer.js >nul 2>&1
if %ERRORLEVEL% EQU 0 (
    echo [OK] data-renderer.js 包含 import 语句
) else (
    echo [ERROR] data-renderer.js 缺少 import 语句
)
echo.

echo [6/6] 测试前端访问...
curl -s -o nul -w "前端状态码: %%{http_code}\n" http://localhost
echo.

echo ==========================================
echo ✅ 自动验证完成！
echo ==========================================
echo.
echo 📋 手动验证步骤：
echo.
echo 1. 打开浏览器访问: http://localhost
echo    - 按 F12 打开开发者工具
echo    - 查看 Console 标签
echo    - 应该没有 "NewsAPI is not defined" 错误
echo    - 首页应该显示新闻和活动
echo.
echo 2. 访问管理后台: http://localhost/admin.html
echo    - 登录: admin@giip.info / admin123
echo    - News Management 应该显示 3 条记录
echo    - Events Management 应该显示 4 条记录
echo.
echo 3. 测试创建功能
echo    - 尝试添加新的 News
echo    - 尝试添加新的 Event
echo.
echo ==========================================
echo 📚 相关文档：
echo    - 最终修复总结.md
echo    - API修复总结.md
echo    - GIIP会议创建指南.md
echo ==========================================
echo.
pause
