/**
 * Admin Interface Test Script
 * Tests the admin dashboard functionality
 */

const API_BASE_URL = 'http://localhost:3000/api';

// Test credentials
const ADMIN_CREDENTIALS = {
    email: 'admin@giip.info',
    password: 'admin123'
};

const EDITOR_CREDENTIALS = {
    email: 'editor@giip.info',
    password: 'editor123'
};

const USER_CREDENTIALS = {
    email: 'user@giip.info',
    password: 'user123'
};

// Helper function to make API requests
async function apiRequest(endpoint, options = {}) {
    const url = `${API_BASE_URL}${endpoint}`;
    const response = await fetch(url, {
        headers: {
            'Content-Type': 'application/json',
            ...options.headers
        },
        ...options
    });
    
    const data = await response.json();
    return { status: response.status, data };
}

// Test functions
async function testAdminLogin() {
    console.log('\n=== Testing Admin Login ===');
    
    const result = await apiRequest('/auth/login', {
        method: 'POST',
        body: JSON.stringify(ADMIN_CREDENTIALS)
    });
    
    if (result.status === 200 && result.data.success) {
        console.log('✅ Admin login successful');
        console.log('   Token:', result.data.token.substring(0, 20) + '...');
        console.log('   User:', result.data.user.email);
        console.log('   Role:', result.data.user.role);
        return result.data.token;
    } else {
        console.log('❌ Admin login failed:', result.data.error?.message);
        return null;
    }
}

async function testEditorLogin() {
    console.log('\n=== Testing Editor Login ===');
    
    const result = await apiRequest('/auth/login', {
        method: 'POST',
        body: JSON.stringify(EDITOR_CREDENTIALS)
    });
    
    if (result.status === 200 && result.data.success) {
        console.log('✅ Editor login successful');
        console.log('   Token:', result.data.token.substring(0, 20) + '...');
        console.log('   User:', result.data.user.email);
        console.log('   Role:', result.data.user.role);
        return result.data.token;
    } else {
        console.log('❌ Editor login failed:', result.data.error?.message);
        return null;
    }
}

async function testUserLogin() {
    console.log('\n=== Testing User Login ===');
    
    const result = await apiRequest('/auth/login', {
        method: 'POST',
        body: JSON.stringify(USER_CREDENTIALS)
    });
    
    if (result.status === 200 && result.data.success) {
        console.log('✅ User login successful');
        console.log('   Token:', result.data.token.substring(0, 20) + '...');
        console.log('   User:', result.data.user.email);
        console.log('   Role:', result.data.user.role);
        return result.data.token;
    } else {
        console.log('❌ User login failed:', result.data.error?.message);
        return null;
    }
}

async function testGetUsers(token) {
    console.log('\n=== Testing Get Users (Admin Only) ===');
    
    const result = await apiRequest('/admin/users', {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${token}`
        }
    });
    
    if (result.status === 200) {
        console.log('✅ Get users successful');
        console.log('   Total users:', result.data.data?.length || 0);
        if (result.data.data && result.data.data.length > 0) {
            console.log('   Sample user:', result.data.data[0].email, '-', result.data.data[0].role);
        }
    } else {
        console.log('❌ Get users failed:', result.data.error?.message);
    }
}

async function testGetNews(token) {
    console.log('\n=== Testing Get News ===');
    
    const result = await apiRequest('/news', {
        method: 'GET',
        headers: token ? {
            'Authorization': `Bearer ${token}`
        } : {}
    });
    
    if (result.status === 200) {
        console.log('✅ Get news successful');
        console.log('   Total news:', result.data.data?.length || 0);
    } else {
        console.log('❌ Get news failed:', result.data.error?.message);
    }
}

async function testGetEvents(token) {
    console.log('\n=== Testing Get Events ===');
    
    const result = await apiRequest('/events', {
        method: 'GET',
        headers: token ? {
            'Authorization': `Bearer ${token}`
        } : {}
    });
    
    if (result.status === 200) {
        console.log('✅ Get events successful');
        console.log('   Total events:', result.data.data?.length || 0);
    } else {
        console.log('❌ Get events failed:', result.data.error?.message);
    }
}

async function testGetConferences(token) {
    console.log('\n=== Testing Get Conferences ===');
    
    const result = await apiRequest('/conferences', {
        method: 'GET',
        headers: token ? {
            'Authorization': `Bearer ${token}`
        } : {}
    });
    
    if (result.status === 200) {
        console.log('✅ Get conferences successful');
        console.log('   Total conferences:', result.data.data?.length || 0);
    } else {
        console.log('❌ Get conferences failed:', result.data.error?.message);
    }
}

async function testEditorAccessToUsers(token) {
    console.log('\n=== Testing Editor Access to Users (Should Fail) ===');
    
    const result = await apiRequest('/admin/users', {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${token}`
        }
    });
    
    if (result.status === 403) {
        console.log('✅ Editor correctly denied access to users');
    } else if (result.status === 200) {
        console.log('❌ Editor should not have access to users');
    } else {
        console.log('⚠️  Unexpected response:', result.status, result.data.error?.message);
    }
}

async function testUserAccessToUsers(token) {
    console.log('\n=== Testing User Access to Users (Should Fail) ===');
    
    const result = await apiRequest('/admin/users', {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${token}`
        }
    });
    
    if (result.status === 403) {
        console.log('✅ User correctly denied access to users');
    } else if (result.status === 200) {
        console.log('❌ User should not have access to users');
    } else {
        console.log('⚠️  Unexpected response:', result.status, result.data.error?.message);
    }
}

// Main test runner
async function runTests() {
    console.log('╔════════════════════════════════════════════════════════════╗');
    console.log('║         GIIP Admin Interface Test Suite                   ║');
    console.log('╚════════════════════════════════════════════════════════════╝');
    
    try {
        // Test admin login and permissions
        const adminToken = await testAdminLogin();
        if (adminToken) {
            await testGetUsers(adminToken);
            await testGetNews(adminToken);
            await testGetEvents(adminToken);
            await testGetConferences(adminToken);
        }
        
        // Test editor login and permissions
        const editorToken = await testEditorLogin();
        if (editorToken) {
            await testEditorAccessToUsers(editorToken);
            await testGetNews(editorToken);
            await testGetEvents(editorToken);
            await testGetConferences(editorToken);
        }
        
        // Test user login and permissions
        const userToken = await testUserLogin();
        if (userToken) {
            await testUserAccessToUsers(userToken);
            await testGetNews(userToken);
        }
        
        console.log('\n╔════════════════════════════════════════════════════════════╗');
        console.log('║                    Test Summary                            ║');
        console.log('╚════════════════════════════════════════════════════════════╝');
        console.log('\n✅ All tests completed!');
        console.log('\n📝 Next Steps:');
        console.log('   1. Open http://localhost in your browser');
        console.log('   2. Click "Login" and use admin@giip.info / admin123');
        console.log('   3. You should be redirected to /admin.html');
        console.log('   4. Explore the admin dashboard and management features');
        console.log('\n🔐 Test Accounts:');
        console.log('   Admin:  admin@giip.info  / admin123');
        console.log('   Editor: editor@giip.info / editor123');
        console.log('   User:   user@giip.info   / user123');
        
    } catch (error) {
        console.error('\n❌ Test suite failed:', error.message);
        console.error(error.stack);
    }
}

// Run tests
runTests();
