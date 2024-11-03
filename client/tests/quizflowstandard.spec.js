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
    console.log('  Science: [true, true, true, true, true, true, false, false, false, false], // 6/10 = 60%');
    console.log('  Technology: [true, true, true, true, true, false, false, false, false, false], // 5/10 = 50%');
    console.log('  English: [true, true, true, true, false, false, false, false, false, false],   // 4/10 = 40%');
    console.log('  Art: [true, true, true, false, false, false, false, false, false, false],    // 3/10 = 30%');
    console.log('  Math: [true, true, true, true, true, true, true, true, true, true],    // 10/10 = 100%');
    console.log('--------------------------------------------');
    // console.log('Extraversion should be the highest personality score (highlighted green)');
    // console.log('Math should be the highest subject score (highlighted green)');
    // console.log('All other scores should be lower (highlighted blue)');
    await runQuizTest(page);
  });
});