import { test } from '@playwright/test';
import { runQuizTestCase } from './utils/quiz-test-runner';
import { TEST_CASES } from './testCases/quizInputs';
import { subjects } from '../src/data/subjectQuestions';

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
          total: Math.round((scores.reduce((sum, score) => sum + score, 0) / 45) * 100)
        }));

      // Determine expected ties for personality traits
      const maxPersonalityScore = Math.max(...personalityScores.map(({ total }) => total));
      const expectedPersonalityTies = personalityScores
        .filter(({ total }) => total === maxPersonalityScore)
        .map(({ trait }) => trait);

      const subjectScores = Object.entries(testCase.subjectAnswers)
        .map(([subject, scores]) => ({
          subject,
          total: Math.round((scores.filter(Boolean).length / scores.length) * 100)
        }));

      // Determine expected ties for subjects
      const maxSubjectScore = Math.max(...subjectScores.map(({ total }) => total));
      const expectedSubjectTies = subjectScores
        .filter(({ total }) => total === maxSubjectScore)
        .map(({ subject }) => subject);

      console.log('\n=== Rendered Results Will Be ===');
      const personalityPercentages = personalityScores
        .map(({ trait, total }) => `${total}% ${expectedPersonalityTies.includes(trait) ? '\x1b[32m' + trait + '\x1b[0m' : trait}`)
        .join(', ');

      const subjectPercentages = subjectScores
        .map(({ subject, total }) => `${total}% ${expectedSubjectTies.includes(subject) ? '\x1b[32m' + subject + '\x1b[0m' : subject}`)
        .join(', ');

      console.log(personalityPercentages);
      console.log(subjectPercentages);

      console.log('============================================');
      console.log('User results will be rendered in a network board with these columns');
      console.log('Username	Best Subject	Subject Score	Best Personality Trait	Personality Score	Preferred Environment	Date	Actions');
      console.log('============================================');
      await runQuizTestCase(page, testCase, subjects);
      
      console.log('\n=== Test Complete ===');
    });
  }
}); 