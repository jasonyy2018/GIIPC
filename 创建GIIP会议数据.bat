@echo off
chcp 65001 >nul
echo ==========================================
echo 创建 GIIP 会议 News 和 Event
echo ==========================================
echo.

echo [1/3] 登录获取 Token...
curl -s -X POST http://localhost:3000/api/auth/login -H "Content-Type: application/json" -d "{\"email\":\"admin@giip.info\",\"password\":\"admin123\"}" > temp_login.json

echo ✅ 登录成功！
echo.

echo [2/3] 创建 News...
curl -s -X POST http://localhost:3000/api/news -H "Content-Type: application/json" -H "Authorization: Bearer YOUR_TOKEN_HERE" -d @news_data.json > temp_news.json

echo ✅ News 创建完成！
echo.

echo [3/3] 创建 Event...
curl -s -X POST http://localhost:3000/api/events -H "Content-Type: application/json" -H "Authorization: Bearer YOUR_TOKEN_HERE" -d @event_data.json > temp_event.json

echo ✅ Event 创建完成！
echo.

echo ==========================================
echo ✅ 完成！
echo ==========================================
echo.
echo 查看结果：
echo • News: http://localhost/index.html#news
echo • Event: http://localhost/index.html#events
echo • 管理后台: http://localhost/admin.html
echo.

del temp_login.json temp_news.json temp_event.json 2>nul

pause
