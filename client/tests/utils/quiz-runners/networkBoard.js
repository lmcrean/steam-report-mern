import { test, expect } from '@playwright/test';

// Helper function to extract scores from career recommendation data
async function calculateTestScores(testCase) {
  // Get the top scores string from career recommendation
  const [maxSubjectScore, maxPersonalityScore] = testCase.topScores.split(' and ');

  return {
    bestSubject: maxSubjectScore,
    subjectScore: testCase.subjectScore,
    bestPersonalityTrait: maxPersonalityScore, 
    personalityScore: testCase.personalityScore
  };
}

// Network Board API Tests
test.describe('NetworkBoard API Integration', () => {
  test('should submit quiz results to network board', async ({ page }, testInfo) => {
    // Get the test case data
    const testCase = testInfo.testCase;
    
    // Calculate scores from test results
    const scores = await calculateTestScores(testCase);
    
    // Prepare user result data
    const userResultData = {
      username: 'test_user_' + Date.now(),
      ...scores,
      preferredEnvironment: testCase.preferredEnvironment || 'Not Specified',
      dateOfSubmission: new Date().toISOString()
    };

    // Submit results to network board
    const postResponse = await page.request.post('/user-result', {
      data: userResultData
    });
    
    // Verify submission was successful
    expect(postResponse.ok()).toBeTruthy();
    
    // Fetch network board data
    const getResponse = await page.request.get('/network-board');
    expect(getResponse.ok()).toBeTruthy();
    
    const networkBoardData = await getResponse.json();
    
    // Verify submitted data appears on network board
    const userEntry = networkBoardData.find(entry => entry.username === userResultData.username);
    expect(userEntry).toBeTruthy();
    expect(userEntry.bestSubject).toBe(userResultData.bestSubject);
    expect(userEntry.bestPersonalityTrait).toBe(userResultData.bestPersonalityTrait);
    expect(userEntry.subjectScore).toBe(userResultData.subjectScore);
    expect(userEntry.personalityScore).toBe(userResultData.personalityScore);
  });

  test('should retrieve and verify network board data structure', async ({ page }) => {
    const response = await page.request.get('/network-board');
    expect(response.ok()).toBeTruthy();
    
    const networkBoardData = await response.json();
    
    // Verify data structure
    expect(Array.isArray(networkBoardData)).toBeTruthy();
    if (networkBoardData.length > 0) {
      const entry = networkBoardData[0];
      expect(entry).toHaveProperty('username');
      expect(entry).toHaveProperty('bestSubject');
      expect(entry).toHaveProperty('subjectScore');
      expect(entry).toHaveProperty('bestPersonalityTrait');
      expect(entry).toHaveProperty('personalityScore');
      expect(entry).toHaveProperty('preferredEnvironment');
      expect(entry).toHaveProperty('dateOfSubmission');
    }
  });
});

