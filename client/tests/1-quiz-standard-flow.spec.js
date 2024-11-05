import { test } from '@playwright/test';
import { runQuizTestCase } from './utils/quiz-test-runner';
import { TEST_CASES } from './testCases/quizInputs';

test.describe('Set 1: Standard Quiz Flow', () => {
  for (const [caseName, testCase] of Object.entries(TEST_CASES.set1_standardFlow)) {
    test(testCase.description, async ({ page }) => {
      console.log('\n=== Test Case Details ===');
      console.log(`Running: ${caseName}`);
      console.log(`Description: ${testCase.description}`);

      // Calculate expected results
      const personalityScores = Object.entries(testCase.personalityAnswers)
        .map(([trait, scores]) => ({
          trait,
          total: scores.reduce((sum, score) => sum + score, 0)
        }));
      const subjectScores = Object.entries(testCase.subjectAnswers)
        .map(([subject, scores]) => ({
          subject,
          total: scores.filter(Boolean).length
        }));

      console.log('\n=== Rendered Results Will Be ===');
      const personalityPercentages = personalityScores
        .map(({trait, total}) => `${(total * 10)}% ${trait}`)
        .join(', ');
      const subjectPercentages = subjectScores
        .map(({subject, total}) => `${(total * 20)}% ${subject}`)
        .join(', ');
      console.log(personalityPercentages);
      console.log(subjectPercentages);

      await runQuizTestCase(page, testCase);
      
      console.log('\n=== Test Complete ===');
      console.log('✓ Verified standard flow completed successfully');
    });
  }
}); 