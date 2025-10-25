/**
 * Test API Endpoints
 * 测试所有 API 端点是否正常工作
 */

const API_BASE = 'http://localhost:3000/api';

async function testEndpoint(name, url, options = {}) {
    try {
        console.log(`\n测试: ${name}`);
        console.log(`URL: ${url}`);
        
        const response = await fetch(url, options);
        const data = await response.json();
        
        console.log(`状态: ${response.status} ${response.statusText}`);
        console.log('响应:', JSON.stringify(data, null, 2));
        
        return { success: response.ok, data, status: response.status };
    } catch (error) {
        console.error(`错误: ${error.message}`);
        return { success: false, error: error.message };
    }
}

async function runTests() {
    console.log('='.repeat(60));
    console.log('开始测试 API 端点');
    console.log('='.repeat(60));
    
    // 1. 测试健康检查
    await testEndpoint('健康检查', `${API_BASE}/health`);
    
    // 2. 测试新闻 API
    const newsResult = await testEndpoint('获取所有新闻', `${API_BASE}/news`);
    if (newsResult.success && newsResult.data.data) {
        console.log(`\n✅ 新闻数量: ${newsResult.data.data.length}`);
    }
    
    // 3. 测试活动 API
    const eventsResult = await testEndpoint('获取所有活动', `${API_BASE}/events`);
    if (eventsResult.success && eventsResult.data.data) {
        console.log(`\n✅ 活动数量: ${eventsResult.data.data.length}`);
    }
    
    // 4. 测试会议 API
    const conferencesResult = await testEndpoint('获取所有会议', `${API_BASE}/conferences`);
    if (conferencesResult.success && conferencesResult.data.data) {
        console.log(`\n✅ 会议数量: ${conferencesResult.data.data.length}`);
    }
    
    // 5. 测试登录
    const loginResult = await testEndpoint('管理员登录', `${API_BASE}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            email: 'admin@giip.info',
            password: 'admin123'
        })
    });
    
    if (loginResult.success && loginResult.data.token) {
        console.log('\n✅ 登录成功，获得 Token');
        const token = loginResult.data.token;
        
        // 6. 测试需要认证的端点
        await testEndpoint('获取用户列表 (需要认证)', `${API_BASE}/admin/users`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });
    }
    
    console.log('\n' + '='.repeat(60));
    console.log('测试完成');
    console.log('='.repeat(60));
}

// 运行测试
runTests().catch(console.error);
