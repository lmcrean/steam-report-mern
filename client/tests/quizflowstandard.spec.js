// @ts-check
import { test } from '@playwright/test';
import { runQuizTest } from './utils/quiz-test-standard-input';

test.describe('Quiz Application Flow', () => {
  test('complete quiz journey', async ({ page }) => {
    // Increase timeout for this test
    test.setTimeout(120000); // 2 minutes
    console.log('in this test we are expecting the following results:');
    console.log('Openness: 78%, Conscientiousness: 67%, Extraversion: 100%, Agreeableness: 56%, Neuroticism: 44%');
    console.log('Science: 60%, Technology: 50%, English: 40%, Art: 30%, Math: 100%');
    // console.log('Extraversion should be the highest personality score (highlighted green)');
    // console.log('Math should be the highest subject score (highlighted green)');
    // console.log('All other scores should be lower (highlighted blue)');
    await runQuizTest(page);
  });
});