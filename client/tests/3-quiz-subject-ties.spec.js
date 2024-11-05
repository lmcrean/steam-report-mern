import { test, expect } from '@playwright/test';
import { runQuizTestCase } from './utils/quiz-test-runner';
import { TEST_CASES } from './testCases/quizInputs';

test.describe('Set 3: Subject Tie Cases', () => {
  test.setTimeout(120000);

  for (const [caseName, testCase] of Object.entries(TEST_CASES.set3_subjectTieOnly)) {
    test(testCase.description, async ({ page }) => {
      console.log('\n=== Test Case Details ===');
      console.log(`Running: ${caseName}`);
      console.log(`Description: ${testCase.description}`);
      
      // Calculate and log tied subjects
      const expectedSubjectTies = Object.entries(testCase.subjectAnswers)
        .filter(([subject, scores]) => 
          scores.filter(Boolean).length === 
          Math.max(...Object.values(testCase.subjectAnswers).map(scores => 
            scores.filter(Boolean).length))
        ).map(([subject]) => subject);
      
      console.log('\n=== Expected Subject Ties ===');
      console.log('Subject ties:', expectedSubjectTies);
      console.log(`User will select preferred subject: ${testCase.preferredSubject}`);

      // Add new percentage-based logging
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
      await expect(page.getByText(`Subject Area: ${testCase.preferredSubject}`)).toBeVisible();
      await expect(page.getByText(testCase.preferredSubject, { exact: true })).toHaveClass(/text-green-600/);
      
      console.log('\n=== Test Complete ===');
      console.log(`✓ Verified ${testCase.preferredSubject} was selected and highlighted`);
    });
  }
}); 