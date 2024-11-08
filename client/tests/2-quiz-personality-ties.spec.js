import { test } from '@playwright/test';
import { runQuizTestCase } from './utils/quiz-test-runner';
import { TEST_CASES } from './testCases/quizInputs';
import { subjects } from '../src/data/subjectQuestions';

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
      console.log('Personality ties:', expectedPersonalityTies.map(trait => `\x1b[33m${trait}\x1b[0m`).join(', '));
      console.log(`User will select preferred trait: \x1b[35m${testCase.preferredTrait}\x1b[0m, therefore we will add 1 point to this trait`);

      // Calculate initial personality scores
      const initialPersonalityScores = Object.entries(testCase.personalityAnswers)
        .map(([trait, scores]) => ({
          trait,
          total: Math.round((scores.reduce((sum, score) => sum + score, 0) / 45) * 100)
        }));

      // Calculate updated personality scores (with +1 point for preferred trait)
      const updatedPersonalityScores = Object.entries(testCase.personalityAnswers)
        .map(([trait, scores]) => ({
          trait,
          total: Math.round(((scores.reduce((sum, score) => sum + score, 0) + 
            (trait === testCase.preferredTrait ? 1 : 0)) / 45) * 100)
        }));

      const subjectScores = Object.entries(testCase.subjectAnswers)
        .map(([subject, scores]) => ({
          subject,
          total: Math.round((scores.filter(Boolean).length / scores.length) * 100)
        }));

      console.log('\n=== Rendered Results Will Be ===');
      const initialPersonalityPercentages = initialPersonalityScores
        .map(({trait, total}) => `${total}% ${expectedPersonalityTies.includes(trait) ? '\x1b[33m' + trait + '\x1b[0m' : trait}`)
        .join(', ');
      const updatedPersonalityPercentages = updatedPersonalityScores
        .map(({trait, total}) => `${total}% ${trait === testCase.preferredTrait ? '\x1b[35m' + trait + '\x1b[0m' : trait}`)
        .join(', ');

      const subjectPercentages = subjectScores
        .map(({subject, total}) => `${total}% ${subject === 'Science' ? '\x1b[32m' + subject + '\x1b[0m' : subject}`)
        .join(', ');
      
      console.log(`${initialPersonalityPercentages} (initial calculation)`);
      console.log(`${updatedPersonalityPercentages} (after adding 1 point to ${testCase.preferredTrait})`);
      console.log(subjectPercentages);

      await runQuizTestCase(page, testCase, subjects);
      await expect(page.getByText(`Personality Trait: ${testCase.preferredTrait}`)).toBeVisible();
      await expect(page.getByText(testCase.preferredTrait, { exact: true })).toHaveClass(/text-green-600/);
      
      console.log('\n=== Test Complete ===');
      console.log(`✓ Verified ${testCase.preferredTrait} was selected and highlighted`);
    });
  }
}); 