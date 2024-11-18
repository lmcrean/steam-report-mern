import { feedbackDatabase } from '../../../src/data/feedbackDatabase';

export async function verifyCareerRecommendations(page, testCase) {
  // Fix: Ensure expectedKey matches database format (Subject and Trait)
  const [subject, trait] = testCase.topScores.split(' and ');
  const expectedKey = `${subject} and ${trait}`;
  
  const expectedCareers = feedbackDatabase[expectedKey]?.recommendedCareers;
  
  if (!expectedCareers) {
    throw new Error(`No career recommendations found for combination: ${expectedKey}`);
  }

  // Verify the top scores text appears correctly
  await page.waitForSelector(`text=${expectedKey}`, {
    state: 'visible',
    timeout: 2000
  });

  // Verify each career appears
  for (const career of expectedCareers) {
    await page.waitForSelector(`text=${career}`, {
      state: 'visible',
      timeout: 2000
    });
  }

  console.log(`✓ Verified career recommendations for ${expectedKey}`);
}
