// @ts-check
import { test } from '@playwright/test';
import { runQuizTest } from './quiz-test-standard-utils';

test.describe('Quiz Application Flow', () => {
  test('complete quiz journey', async ({ page }) => {
    // Increase timeout for this test
    test.setTimeout(120000); // 2 minutes
    
    await runQuizTest(page);
  });
});