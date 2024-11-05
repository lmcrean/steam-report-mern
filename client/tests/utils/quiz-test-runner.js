// Import test cases
import { TEST_CASES } from '../testCases/quizInputs';
import { createQuizContextMonitor } from './quiz-context-check';

// Base test runner that handles all cases
export async function runQuizTestCase(page, testCase) {
  const contextMonitor = createQuizContextMonitor();
  
  // Add monitoring to page
  await page.exposeFunction('monitorQuizContext', (key, value) => {
    contextMonitor.logStateChange(key, value);
  });

  await startQuiz(page);
  await completePersonalitySection(page, testCase.personalityAnswers);
  await completeSubjectSection(page, testCase.subjectAnswers);
  
  // Handle different tie scenarios
  if (testCase.preferredTrait && testCase.preferredSubject) {
    await handleBothTies(page, testCase);
  } else if (testCase.preferredTrait) {
    await handlePersonalityTie(page, testCase);
  } else if (testCase.preferredSubject) {
    await handleSubjectTie(page, testCase);
  }

  await verifyResults(page, testCase);
}

async function startQuiz(page) {
  // Navigate to homepage and start quiz
  await page.goto('/');
  
  // Wait for and click the start button
  await page.getByRole('button', { name: 'Start Quiz' }).click();
  
  // Enter username and continue
  await page.getByPlaceholder('Enter your username').fill('TestUser');
  await page.getByRole('button', { name: 'Continue' }).click();
  
  // Log the navigation
  console.log('\n=== Starting Quiz ===');
  console.log('✓ Navigated to homepage');
  console.log('✓ Clicked Start Quiz');
  console.log('✓ Entered username: TestUser');
  console.log('✓ Clicked Continue');
}

async function completePersonalitySection(page, answers) {
  for (const trait of Object.keys(answers)) {
    for (const answer of answers[trait]) {
      await page.getByRole('radio', { name: String(answer) }).click();
      await page.getByRole('button', { name: 'Next' }).click();
    }
  }
}

async function completeSubjectSection(page, answers) {
  for (const subject of Object.keys(answers)) {
    for (const answer of answers[subject]) {
      const options = await page.$$('.relative.flex.items-center');
      await options[answer ? 0 : 1].click();
      await page.getByRole('button', { name: 'Next' }).click();
    }
  }
}

async function handlePreferenceSelection(page, testCase) {
  if (testCase.preferredTrait) {
    await page.getByRole('radio', { name: testCase.preferredTrait }).click();
    await page.getByRole('button', { name: 'Confirm Selection' }).click();
  }
  
  if (testCase.preferredSubject) {
    await page.getByRole('radio', { name: testCase.preferredSubject }).click();
    await page.getByRole('button', { name: 'Confirm Selection' }).click();
  }
} 