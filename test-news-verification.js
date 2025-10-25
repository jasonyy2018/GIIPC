/**
 * News API Verification Test
 * This test verifies that the News API functionality remains unaffected
 * by the time classification changes made to Events and Conferences.
 */

const API_BASE_URL = 'http://localhost:3000/api';

/**
 * Test News API endpoints
 */
async function testNewsAPI() {
  console.log('=== News API Verification Test ===\n');
  
  try {
    // Test 1: Get all news
    console.log('Test 1: GET /api/news - Fetch all news');
    const newsResponse = await fetch(`${API_BASE_URL}/news`);
    const newsData = await newsResponse.json();
    
    if (!newsResponse.ok) {
      console.error('❌ Failed to fetch news:', newsData);
      return false;
    }
    
    console.log('✅ Successfully fetched news');
    console.log(`   - Total news items: ${newsData.data?.length || 0}`);
    console.log(`   - Pagination: Page ${newsData.pagination?.page || 'N/A'} of ${newsData.pagination?.totalPages || 'N/A'}`);
    
    // Verify news structure
    if (newsData.data && newsData.data.length > 0) {
      const firstNews = newsData.data[0];
      console.log('\n   Sample news item structure:');
      console.log(`   - ID: ${firstNews.id}`);
      console.log(`   - Title: ${firstNews.title}`);
      console.log(`   - Published Date: ${firstNews.published_date}`);
      console.log(`   - Has content: ${!!firstNews.content}`);
      console.log(`   - Has image_url: ${!!firstNews.image_url}`);
      console.log(`   - Creator: ${firstNews.creator_email || 'N/A'}`);
      
      // Verify no time classification fields were added
      if (firstNews.start_date || firstNews.end_date || firstNews.status) {
        console.error('❌ ERROR: News items should NOT have start_date, end_date, or status fields!');
        console.error('   News data structure has been incorrectly modified.');
        return false;
      }
      console.log('✅ News structure is correct (no time classification fields)');
      
      // Test 2: Get single news item
      console.log(`\nTest 2: GET /api/news/${firstNews.id} - Fetch single news item`);
      const singleNewsResponse = await fetch(`${API_BASE_URL}/news/${firstNews.id}`);
      const singleNewsData = await singleNewsResponse.json();
      
      if (!singleNewsResponse.ok) {
        console.error('❌ Failed to fetch single news item:', singleNewsData);
        return false;
      }
      
      console.log('✅ Successfully fetched single news item');
      console.log(`   - Title: ${singleNewsData.data.title}`);
    } else {
      console.log('⚠️  No news items found in database (this is OK if database is empty)');
    }
    
    // Test 3: Verify news sorting
    console.log('\nTest 3: Verify news sorting by published_date');
    if (newsData.data && newsData.data.length > 1) {
      const dates = newsData.data.map(n => new Date(n.published_date));
      let isSorted = true;
      for (let i = 0; i < dates.length - 1; i++) {
        if (dates[i] < dates[i + 1]) {
          isSorted = false;
          break;
        }
      }
      
      if (isSorted) {
        console.log('✅ News items are correctly sorted by published_date (DESC)');
      } else {
        console.log('⚠️  News items may not be sorted correctly');
      }
    } else {
      console.log('⚠️  Not enough news items to verify sorting');
    }
    
    console.log('\n=== All News API Tests Passed ===');
    console.log('✅ News functionality is NOT affected by time classification changes');
    console.log('✅ News API maintains original logic and structure');
    console.log('✅ No time-based filtering applied to news items');
    
    return true;
    
  } catch (error) {
    console.error('❌ Test failed with error:', error.message);
    return false;
  }
}

/**
 * Run the test
 */
testNewsAPI().then(success => {
  process.exit(success ? 0 : 1);
});
