import fetch from 'node-fetch';

const URLS = {
  production: 'https://steamreport.lauriecrean.dev/api',
  development: 'http://localhost:8000'
};

async function testAPI(environment) {
  const baseUrl = URLS[environment];
  console.log(`\nTesting ${environment} API at ${baseUrl}`);
  
  try {
    // Test network board endpoint
    console.log(`Fetching ${baseUrl}/api/network-board...`);
    const response = await fetch(`${baseUrl}/api/network-board`);
    
    console.log('Response status:', response.status);
    console.log('Response headers:', response.headers.raw());
    
    if (!response.ok) {
      const text = await response.text();
      console.error('Error response body:', text);
      throw new Error(`Request failed with status ${response.status}`);
    }

    const data = await response.json();
    console.log('✅ Success! Data count:', data.length);
    return true;

  } catch (error) {
    console.error(`❌ ${environment} API test failed:`, {
      message: error.message,
      url: `${baseUrl}/api/network-board`,
      cause: error.cause
    });
    return false;
  }
}

async function runTests() {
  // Test both environments
  const prodResult = await testAPI('production');
  const devResult = await testAPI('development');
  
  console.log('\nTest Summary:');
  console.log('Production:', prodResult ? '✅ Working' : '❌ Failed');
  console.log('Development:', devResult ? '✅ Working' : '❌ Failed');
  
  // Exit with error if production fails
  if (!prodResult) process.exit(1);
}

runTests(); 