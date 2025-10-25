@echo off
chcp 65001 >nul
echo ==========================================
echo 验证 API 修复
echo ==========================================
echo.

echo [1/5] 检查 Docker 容器状态...
docker ps --format "{{.Names}} - {{.Status}}" | findstr giip
echo.

echo [2/5] 测试 News API...
curl -s http://localhost:3000/api/news | findstr "success" >nul
if %ERRORLEVEL% EQU 0 (
    echo [OK] News API 可以访问
) else (
    echo [ERROR] News API 无法访问
)
echo.

echo [3/5] 测试 Events API...
curl -s http://localhost:3000/api/events | findstr "success" >nul
if %ERRORLEVEL% EQU 0 (
    echo [OK] Events API 可以访问
) else (
    echo [ERROR] Events API 无法访问
)
echo.

echo [4/5] 检查数据库记录数...
docker exec giip-database psql -U giip_user -d giip_db -t -c "SELECT COUNT(*) FROM news;" 2>nul
docker exec giip-database psql -U giip_user -d giip_db -t -c "SELECT COUNT(*) FROM events;" 2>nul
echo.

echo [5/5] 测试前端访问...
curl -s -o nul -w "前端状态码: %%{http_code}\n" http://localhost
echo.

echo ==========================================
echo ✅ 验证完成！
echo ==========================================
echo.
echo 📋 下一步测试：
echo.
echo 1. 打开浏览器访问: http://localhost
echo    - 检查首页是否显示新闻和活动
echo.
echo 2. 访问管理后台: http://localhost/admin.html
echo    - 登录: admin@giip.info / admin123
echo    - 检查 News Management 是否显示 3 条记录
echo    - 检查 Events Management 是否显示 4 条记录
echo.
echo 3. 测试创建功能
echo    - 尝试添加新的 News
echo    - 尝试添加新的 Event
echo.
echo ==========================================
echo 详细报告: API修复总结.md
echo ==========================================
echo.
pause
