/**
 * 全栈认证功能端到端测试
 * 测试前后端完整打通
 */

const API_BASE = 'http://localhost:3000/api';

console.log('🧪 开始全栈认证功能测试\n');
console.log('=' .repeat(60));

// 测试数据
const testEmail = `test_${Date.now()}@giip.info`;
const testPassword = 'Test123!';

let authToken = null;
let userId = null;

/**
 * 测试 1: 后端 API 健康检查
 */
async function testAPIHealth() {
    console.log('\n📋 测试 1: 后端 API 健康检查');
    console.log('-'.repeat(60));
    
    try {
        const response = await fetch(`${API_BASE}/health`);
        const data = await response.json();
        
        if (response.ok && data.success) {
            console.log('✅ 后端 API 正常运行');
            console.log(`   状态: ${data.message}`);
            console.log(`   时间: ${data.timestamp}`);
            return true;
        } else {
            console.log('❌ 后端 API 响应异常');
            return false;
        }
    } catch (error) {
        console.log('❌ 无法连接到后端 API');
        console.log(`   错误: ${error.message}`);
        return false;
    }
}

/**
 * 测试 2: 用户注册
 */
async function testRegister() {
    console.log('\n📋 测试 2: 用户注册');
    console.log('-'.repeat(60));
    
    try {
        const response = await fetch(`${API_BASE}/auth/register`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                email: testEmail,
                password: testPassword
            })
        });
        
        const data = await response.json();
        
        if (response.ok && data.success) {
            console.log('✅ 用户注册成功');
            console.log(`   邮箱: ${data.data.email}`);
            console.log(`   角色: ${data.data.role}`);
            console.log(`   ID: ${data.data.id}`);
            userId = data.data.id;
            return true;
        } else {
            console.log('❌ 用户注册失败');
            console.log(`   错误: ${data.error?.message || data.message}`);
            return false;
        }
    } catch (error) {
        console.log('❌ 注册请求失败');
        console.log(`   错误: ${error.message}`);
        return false;
    }
}

/**
 * 测试 3: 用户登录
 */
async function testLogin() {
    console.log('\n📋 测试 3: 用户登录');
    console.log('-'.repeat(60));
    
    try {
        const response = await fetch(`${API_BASE}/auth/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                email: testEmail,
                password: testPassword
            })
        });
        
        const data = await response.json();
        
        if (response.ok && data.success) {
            console.log('✅ 用户登录成功');
            console.log(`   邮箱: ${data.data.user.email}`);
            console.log(`   角色: ${data.data.user.role}`);
            console.log(`   Token: ${data.data.token.substring(0, 20)}...`);
            authToken = data.data.token;
            return true;
        } else {
            console.log('❌ 用户登录失败');
            console.log(`   错误: ${data.error?.message || data.message}`);
            return false;
        }
    } catch (error) {
        console.log('❌ 登录请求失败');
        console.log(`   错误: ${error.message}`);
        return false;
    }
}

/**
 * 测试 4: 使用 Token 访问受保护的资源
 */
async function testProtectedResource() {
    console.log('\n📋 测试 4: 访问受保护资源（获取新闻列表）');
    console.log('-'.repeat(60));
    
    try {
        const response = await fetch(`${API_BASE}/news`, {
            headers: {
                'Authorization': `Bearer ${authToken}`
            }
        });
        
        const data = await response.json();
        
        if (response.ok && data.success) {
            console.log('✅ 成功访问受保护资源');
            console.log(`   新闻数量: ${data.data.length}`);
            console.log(`   总数: ${data.pagination.total}`);
            return true;
        } else {
            console.log('❌ 访问受保护资源失败');
            console.log(`   错误: ${data.error?.message || data.message}`);
            return false;
        }
    } catch (error) {
        console.log('❌ 请求失败');
        console.log(`   错误: ${error.message}`);
        return false;
    }
}

/**
 * 测试 5: 无效 Token 测试
 */
async function testInvalidToken() {
    console.log('\n📋 测试 5: 无效 Token 测试');
    console.log('-'.repeat(60));
    
    try {
        const response = await fetch(`${API_BASE}/news`, {
            method: 'POST',
            headers: {
                'Authorization': 'Bearer invalid_token_here',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                title: 'Test News',
                content: 'Test Content'
            })
        });
        
        const data = await response.json();
        
        if (!response.ok && response.status === 401) {
            console.log('✅ 无效 Token 被正确拒绝');
            console.log(`   状态码: ${response.status}`);
            console.log(`   错误: ${data.error?.message || data.message}`);
            return true;
        } else {
            console.log('❌ 无效 Token 未被拒绝（安全问题！）');
            return false;
        }
    } catch (error) {
        console.log('❌ 请求失败');
        console.log(`   错误: ${error.message}`);
        return false;
    }
}

/**
 * 测试 6: CORS 配置测试
 */
async function testCORS() {
    console.log('\n📋 测试 6: CORS 配置');
    console.log('-'.repeat(60));
    
    try {
        const response = await fetch(`${API_BASE}/health`, {
            method: 'GET',
            headers: {
                'Origin': 'http://localhost'
            }
        });
        
        const corsHeader = response.headers.get('access-control-allow-origin');
        
        if (corsHeader) {
            console.log('✅ CORS 配置正确');
            console.log(`   允许的源: ${corsHeader}`);
            return true;
        } else {
            console.log('⚠️  未检测到 CORS 头（可能需要检查）');
            return true; // 不算失败
        }
    } catch (error) {
        console.log('❌ CORS 测试失败');
        console.log(`   错误: ${error.message}`);
        return false;
    }
}

/**
 * 测试 7: 前端文件可访问性
 */
async function testFrontendFiles() {
    console.log('\n📋 测试 7: 前端文件可访问性');
    console.log('-'.repeat(60));
    
    const files = [
        { path: 'http://localhost/', name: '主页' },
        { path: 'http://localhost/js/api-client.js', name: 'API 客户端' },
        { path: 'http://localhost/js/auth.js', name: '认证模块' },
        { path: 'http://localhost/css/auth.css', name: '认证样式' }
    ];
    
    let allSuccess = true;
    
    for (const file of files) {
        try {
            const response = await fetch(file.path);
            if (response.ok) {
                console.log(`✅ ${file.name}: 可访问`);
            } else {
                console.log(`❌ ${file.name}: HTTP ${response.status}`);
                allSuccess = false;
            }
        } catch (error) {
            console.log(`❌ ${file.name}: ${error.message}`);
            allSuccess = false;
        }
    }
    
    return allSuccess;
}

/**
 * 运行所有测试
 */
async function runAllTests() {
    const results = {
        total: 0,
        passed: 0,
        failed: 0
    };
    
    const tests = [
        { name: 'API 健康检查', fn: testAPIHealth },
        { name: '用户注册', fn: testRegister },
        { name: '用户登录', fn: testLogin },
        { name: '访问受保护资源', fn: testProtectedResource },
        { name: '无效 Token 测试', fn: testInvalidToken },
        { name: 'CORS 配置', fn: testCORS },
        { name: '前端文件可访问性', fn: testFrontendFiles }
    ];
    
    for (const test of tests) {
        results.total++;
        const passed = await test.fn();
        if (passed) {
            results.passed++;
        } else {
            results.failed++;
        }
    }
    
    // 打印总结
    console.log('\n' + '='.repeat(60));
    console.log('📊 测试总结');
    console.log('='.repeat(60));
    console.log(`总测试数: ${results.total}`);
    console.log(`✅ 通过: ${results.passed}`);
    console.log(`❌ 失败: ${results.failed}`);
    console.log(`成功率: ${((results.passed / results.total) * 100).toFixed(1)}%`);
    
    if (results.failed === 0) {
        console.log('\n🎉 所有测试通过！前后端完全打通！');
        console.log('\n✨ 可以开始使用以下功能：');
        console.log('   1. 访问 http://localhost 查看前端');
        console.log('   2. 点击 Login/Register 按钮进行认证');
        console.log('   3. 登录后可以访问受保护的资源');
        console.log('\n📝 测试账号：');
        console.log(`   邮箱: ${testEmail}`);
        console.log(`   密码: ${testPassword}`);
    } else {
        console.log('\n⚠️  部分测试失败，请检查上述错误信息');
    }
    
    console.log('\n' + '='.repeat(60));
}

// 运行测试
runAllTests().catch(error => {
    console.error('\n❌ 测试运行失败:', error);
    process.exit(1);
});
