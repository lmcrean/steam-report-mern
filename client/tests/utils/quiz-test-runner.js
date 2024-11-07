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
}

async function startQuiz(page) {
  // Navigate to homepage and start quiz
  await page.goto('/');
  
  // Wait for and click the start button
  await page.getByRole('button', { name: 'Start Quiz' }).click();
  
  // Enter username and continue
  await page.getByPlaceholder('Enter your username').fill('TestUser');
  await page.getByRole('button', { name: 'Continue' }).click();
}

async function completePersonalitySection(page, answers) {
  for (const trait of Object.keys(answers)) {
    for (const answer of answers[trait]) {
      await page.getByRole('radio', { name: String(answer) }).click();
      await page.getByRole('button', { name: 'Next' }).click();
    }
  }
  
  // Verify section transition using actual component structure
  try {
    // Wait for STEAM Subject Quiz heading to appear
    await page.waitForSelector('h2:has-text("STEAM Subject Quiz")', { timeout: 5000 });
    // Double-check we're on first Science question
    await page.waitForSelector('p:has-text("Science - Question 1 of 10")', { timeout: 5000 });
    console.log('✓ Successfully transitioned to subject section');
  } catch (error) {
    console.error('❌ Failed to transition to subject section');
    throw new Error('Quiz failed to transition from personality to subject section');
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