import fetch from 'node-fetch';

describe('Production API Health Check', () => {
  const PROD_API_URL = 'https://steamreport.lauriecrean.dev/api';

  test('health endpoint returns OK status', async () => {
    console.log('Testing production health endpoint:', `${PROD_API_URL}/health`);
    
    const response = await fetch(`${PROD_API_URL}/health`);
    console.log('Response status:', response.status);
    console.log('Response headers:', response.headers.raw());
    
    // If not JSON, get the text content to see what we received
    if (!response.headers.get('content-type')?.includes('application/json')) {
      const textContent = await response.text();
      console.log('Received non-JSON response:', textContent.substring(0, 500));
      throw new Error('Expected JSON response but received HTML/text');
    }

    const data = await response.json();
    console.log('Response data:', data);
    
    expect(response.status).toBe(200);
    expect(data.status).toBe('ok');
    expect(data.timestamp).toBeDefined();
    expect(data.aws).toBeDefined();
  });
});
