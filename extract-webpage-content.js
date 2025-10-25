/**
 * 网页内容提取工具
 * 用于从复旦大学管理学院网站提取新闻/活动内容
 */

// 使用方法：
// 1. 在浏览器中打开网页
// 2. 按 F12 打开开发者工具
// 3. 切换到 Console 标签
// 4. 复制并粘贴下面的代码
// 5. 按 Enter 执行

(function() {
    console.log('=== 网页内容提取工具 ===\n');
    
    // 提取标题
    const title = document.querySelector('h1, .title, .news-title, .article-title')?.innerText?.trim() 
        || document.querySelector('title')?.innerText?.trim()
        || '未找到标题';
    
    // 提取日期
    const dateElement = document.querySelector('.date, .publish-date, .news-date, time');
    const date = dateElement?.innerText?.trim() 
        || dateElement?.getAttribute('datetime')
        || '未找到日期';
    
    // 提取正文内容
    const contentElement = document.querySelector('.content, .article-content, .news-content, .main-content, article');
    let content = contentElement?.innerText?.trim() || '未找到内容';
    
    // 清理内容（移除多余的空行）
    content = content.replace(/\n{3,}/g, '\n\n');
    
    // 提取图片
    const images = Array.from(document.querySelectorAll('img'))
        .map(img => img.src)
        .filter(src => src && !src.includes('logo') && !src.includes('icon'));
    
    const mainImage = images[0] || '';
    
    // 提取地点信息（如果有）
    const locationElement = document.querySelector('.location, .venue, .address');
    const location = locationElement?.innerText?.trim() || '';
    
    // 判断是新闻还是活动
    const isEvent = content.toLowerCase().includes('conference') 
        || content.toLowerCase().includes('workshop')
        || content.toLowerCase().includes('seminar')
        || content.toLowerCase().includes('event')
        || content.toLowerCase().includes('session')
        || title.toLowerCase().includes('conference')
        || title.toLowerCase().includes('workshop');
    
    // 生成数据
    const data = {
        type: isEvent ? 'event' : 'news',
        title: title,
        date: date,
        content: content,
        image_url: mainImage,
        location: location,
        source_url: window.location.href
    };
    
    // 输出结果
    console.log('提取的数据：\n');
    console.log('类型:', data.type === 'event' ? '活动 (Event)' : '新闻 (News)');
    console.log('标题:', data.title);
    console.log('日期:', data.date);
    console.log('图片:', data.image_url);
    if (data.location) console.log('地点:', data.location);
    console.log('\n正文内容:');
    console.log(data.content);
    console.log('\n=== JSON 格式 ===\n');
    console.log(JSON.stringify(data, null, 2));
    
    // 生成 API 创建命令
    console.log('\n=== API 创建命令 ===\n');
    
    if (data.type === 'news') {
        const newsData = {
            title: data.title,
            content: data.content,
            published_date: formatDate(data.date),
            image_url: data.image_url
        };
        
        console.log('创建 News 的 curl 命令：\n');
        console.log(`curl -X POST http://localhost:3000/api/news \\
  -H "Content-Type: application/json" \\
  -H "Authorization: Bearer YOUR_TOKEN" \\
  -d '${JSON.stringify(newsData, null, 2)}'`);
    } else {
        const eventData = {
            title: data.title,
            description: data.content.substring(0, 500) + '...',
            date: formatDate(data.date),
            location: data.location || 'TBD',
            capacity: 100
        };
        
        console.log('创建 Event 的 curl 命令：\n');
        console.log(`curl -X POST http://localhost:3000/api/events \\
  -H "Content-Type: application/json" \\
  -H "Authorization: Bearer YOUR_TOKEN" \\
  -d '${JSON.stringify(eventData, null, 2)}'`);
    }
    
    // 生成管理后台操作指南
    console.log('\n=== 管理后台操作 ===\n');
    console.log('1. 访问: http://localhost/admin.html');
    console.log('2. 登录: admin@giip.info / admin123');
    console.log(`3. 点击: ${data.type === 'news' ? 'News Management' : 'Events Management'}`);
    console.log(`4. 点击: Add ${data.type === 'news' ? 'News' : 'Event'}`);
    console.log('5. 填写表单（复制上面的数据）');
    console.log('6. 点击: Create');
    
    // 辅助函数：格式化日期
    function formatDate(dateStr) {
        try {
            const date = new Date(dateStr);
            if (!isNaN(date.getTime())) {
                return date.toISOString().split('T')[0];
            }
        } catch (e) {}
        
        // 尝试解析中文日期格式
        const match = dateStr.match(/(\d{4})[年\-\/](\d{1,2})[月\-\/](\d{1,2})/);
        if (match) {
            const [, year, month, day] = match;
            return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
        }
        
        return new Date().toISOString().split('T')[0];
    }
    
    // 将数据保存到剪贴板
    const copyData = JSON.stringify(data, null, 2);
    navigator.clipboard.writeText(copyData).then(() => {
        console.log('\n✅ 数据已复制到剪贴板！');
    }).catch(() => {
        console.log('\n⚠️ 无法自动复制，请手动复制上面的数据');
    });
    
    return data;
})();
