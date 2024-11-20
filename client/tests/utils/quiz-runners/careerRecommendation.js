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

  // Wait for and click the submit to network board button
  const submitButton = await page.waitForSelector('button:has-text("Submit to Network Board")', {
    state: 'visible',
    timeout: 2000
  });
  
  await submitButton.click();
  
  // Wait for success message or network board redirect
  await page.waitForSelector('.network-board', {
    state: 'visible',
    timeout: 5000
  });

  console.log(`✓ Verified career recommendations for ${expectedKey}`);
  console.log('✓ Successfully submitted results to network board');
}
