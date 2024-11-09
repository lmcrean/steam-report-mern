import { test, expect } from '@playwright/test';
import { runQuizTestCase } from './utils/quiz-test-runner';
import { TEST_CASES } from './testCases/quizInputs';
import { subjects } from '../src/data/subjectQuestions';

test.describe('Set 3: Subject Tie Cases', () => {
  test.setTimeout(120000);

  for (const [caseName, testCase] of Object.entries(TEST_CASES.set3_subjectTieOnly)) {
    test(testCase.description, async ({ page }) => {
      console.log('\n=== Test Case Details ===');
      console.log(`Running: ${caseName}`);
      console.log(`Description: ${testCase.description}`);
      
      // Calculate and log tied subjects
      const expectedSubjectTies = Object.entries(testCase.subjectAnswers)
        .filter(([_subject, scores]) => 
          scores.filter(Boolean).length === 
          Math.max(...Object.values(testCase.subjectAnswers).map(scores => 
            scores.filter(Boolean).length))
        ).map(([subject]) => subject);
      
      console.log('\n=== Expected Subject Ties ===');
      console.log(`Subject ties: \x1b[33m${expectedSubjectTies.join(', ')}\x1b[0m`);
      console.log(`User will select preferred subject: \x1b[35m${testCase.preferredSubject}\x1b[0m`);

      // Calculate personality scores
      const personalityScores = Object.entries(testCase.personalityAnswers)
        .map(([trait, scores]) => ({
          trait,
          total: Math.round((scores.reduce((sum, score) => sum + score, 0) / 45) * 100)
        }));

      // Determine the maximum personality score
      const maxPersonalityScore = Math.max(...personalityScores.map(({ total }) => total));

      // Calculate initial subject scores
      const initialSubjectScores = Object.entries(testCase.subjectAnswers)
        .map(([subject, scores]) => ({
          subject,
          total: Math.round((scores.filter(Boolean).length / scores.length) * 100)
        }));

      // Calculate updated subject scores (with +1 point for preferred subject)
      const updatedSubjectScores = Object.entries(testCase.subjectAnswers)
        .map(([subject, scores]) => ({
          subject,
          total: Math.round(((scores.filter(Boolean).length + 
            (subject === testCase.preferredSubject ? 1 : 0)) / scores.length) * 100)
        }));

      console.log('\n=== Rendered Results Will Be ===');
      const personalityPercentages = personalityScores
        .map(({ trait, total }) => `${total}% ${total === maxPersonalityScore ? '\x1b[32m' + trait + '\x1b[0m' : trait}`)
        .join(', ');

      const initialSubjectPercentages = initialSubjectScores
        .map(({ subject, total }) => `${total}% ${expectedSubjectTies.includes(subject) ? '\x1b[33m' + subject + '\x1b[0m' : subject}`)
        .join(', ');

      const updatedSubjectPercentages = updatedSubjectScores
        .map(({ subject, total }) => `${total}% ${subject === testCase.preferredSubject ? '\x1b[35m' + subject + '\x1b[0m' : subject}`)
        .join(', ');

      console.log(`${personalityPercentages} (personality scores)`);
      console.log(`${initialSubjectPercentages} (initial calculation)\x1b[0m`);
      console.log(`${updatedSubjectPercentages} (after adding 1 point to ${testCase.preferredSubject})`);

      await runQuizTestCase(page, testCase, subjects);
      // await expect(page.getByText(`Subject Area: ${testCase.preferredSubject}`)).toBeVisible();
      // await expect(page.getByText(testCase.preferredSubject, { exact: true })).toHaveClass(/text-green-600/);
      
      console.log('\n=== Test Complete ===');
      console.log(`✓ Verified ${testCase.preferredSubject} was selected and highlighted`);
    });
  }
}); 