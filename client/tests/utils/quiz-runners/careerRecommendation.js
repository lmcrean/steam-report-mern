import { feedbackDatabase } from '../../../src/data/feedbackDatabase';

export async function verifyCareerRecommendations(page, testCase) {
  // Get the expected combination from testCase.topScores e.g. "Math and Extraversion"
  const expectedKey = testCase.topScores;
  
  // Get the expected careers from feedbackDatabase using the expectedKey
  const expectedCareers = feedbackDatabase[expectedKey]?.recommendedCareers;
  
  if (!expectedCareers) {
    throw new Error(`No career recommendations found for combination: ${expectedKey}`);
  }

  // Verify each career appears in the results
  // we should see "Math and Extraversion" in the results if those are the top scores
  for (const career of expectedCareers) {
    await page.waitForSelector(`text=${career}`, {
      state: 'visible',
      timeout: 2000
    });
  }

  console.log(`✓ Verified career recommendations for ${expectedKey}`);
}
