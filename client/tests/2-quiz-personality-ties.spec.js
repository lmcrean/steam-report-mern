import { test } from '@playwright/test';
import { runQuizTestCase } from './utils/quiz-test-runner';
import { TEST_CASES } from './testCases/quizInputs';

test.describe('Set 2: Personality Tie Cases', () => {
  test.setTimeout(120000);

  for (const [caseName, testCase] of Object.entries(TEST_CASES.set2_personalityTieOnly)) {
    test(testCase.description, async ({ page }) => {
      console.log('\n=== Test Case Details ===');
      console.log(`Running: ${caseName}`);
      console.log(`Description: ${testCase.description}`);
      
      // Calculate and log tied traits
      const expectedPersonalityTies = Object.entries(testCase.personalityAnswers)
        .filter(([_trait, scores]) => 
          scores.reduce((sum, score) => sum + score, 0) === 
          Math.max(...Object.values(testCase.personalityAnswers).map(scores => 
            scores.reduce((sum, score) => sum + score, 0)))
        ).map(([trait]) => trait);
      
      console.log('\n=== Expected Personality Ties ===');
      console.log('Personality ties:', expectedPersonalityTies);
      console.log(`User will select preferred trait: ${testCase.preferredTrait}`);

      console.log('\n=== Expected Final Results ===');
      console.log(`${testCase.preferredTrait} will receive 1 bonus point and be highlighted in purple`);
      
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
      await expect(page.getByText(`Personality Trait: ${testCase.preferredTrait}`)).toBeVisible();
      await expect(page.getByText(testCase.preferredTrait, { exact: true })).toHaveClass(/text-green-600/);
      
      console.log('\n=== Test Complete ===');
      console.log(`✓ Verified ${testCase.preferredTrait} was selected and highlighted`);
    });
  }
}); 