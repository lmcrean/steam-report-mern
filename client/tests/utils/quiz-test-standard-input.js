// @ts-check
import { test, expect } from '@playwright/test';

// Predefined answers to ensure Extraversion is highest OCEAN trait
const personalityAnswers = {
  Openness: [7, 7, 7, 7, 7],           // 35/45 = ~78%
  Conscientiousness: [6, 6, 6, 6, 6],  // 30/45 = ~67%
  Extraversion: [9, 9, 9, 9, 9],       // 45/45 = 100%
  Agreeableness: [5, 5, 5, 5, 5],      // 25/45 = ~56%
  Neuroticism: [4, 4, 4, 4, 4]         // 20/45 = ~44%
};

// Subject scores should make Math clearly highest
const subjectAnswers = {
  Science: [true, true, true, true, true, true, false, false, false, false], // 6/10 = 60%
  Technology: [true, true, true, true, true, false, false, false, false, false], // 5/10 = 50%
  English: [true, true, true, true, false, false, false, false, false, false],   // 4/10 = 40%
  Art: [true, true, true, false, false, false, false, false, false, false],    // 3/10 = 30%
  Math: [true, true, true, true, true, true, true, true, true, true],    // 10/10 = 100%
};

// Helper function to complete personality quiz with predetermined answers
async function completePersonalityQuiz(page) {
  await expect(page.getByRole('heading', { name: 'OCEAN Personality Test' })).toBeVisible();
  
  let questionIndex = 0;
  for (const trait of Object.keys(personalityAnswers)) {
    for (const answer of personalityAnswers[trait]) {
      // Wait for question to be visible
      await expect(page.getByText(`Question ${questionIndex + 1}`)).toBeVisible();
      
      // Select predetermined answer
      await page.getByRole('radio', { name: String(answer) }).click();
      
      // Wait for Next button and click it
      const nextButton = page.getByRole('button', { name: 'Next' });
      await nextButton.waitFor({ state: 'visible' });
      await nextButton.click();
      
      questionIndex++;
    }
  }
}

// Helper function to complete subject quiz with predetermined answers
async function completeSubjectQuiz(page) {
  for (const subject of Object.keys(subjectAnswers)) {
    console.log(`\nStarting ${subject} section`);
    
    for (let i = 0; i < 10; i++) {
      // Wait for question to be visible
      await expect(page.getByText(`${subject} - Question ${i + 1} of 10`)).toBeVisible();
      
      // Wait for options to be visible
      await page.waitForSelector('.relative.flex.items-center', { 
        state: 'visible',
        timeout: 5000 
      });
      
      // Get all answer options
      const options = await page.$$('.relative.flex.items-center');
      
      // Select first option if answer should be true, second if false
      const answerIndex = subjectAnswers[subject][i] ? 0 : 1;
      await options[answerIndex].click();
      
      // Wait for Next button to be enabled and click it
      await page.waitForSelector('button:not([disabled])[name="Next"]', {
        state: 'visible',
        timeout: 5000
      });
      await page.click('button[name="Next"]');
      
      console.log(`Completed ${subject} question ${i + 1}`);
    }
  }
}

// Main test function that uses the helpers above
async function runQuizTest(page) {
  // 1. Start page
  await page.goto('/');
  await expect(page.getByRole('heading', { name: 'Welcome to STEAM Career Quiz' })).toBeVisible();
  
  // 2. Start quiz
  await page.getByRole('button', { name: 'Start Quiz' }).click();
  
  // 3. Username entry
  await expect(page.getByPlaceholder('Enter your username')).toBeVisible();
  await page.getByPlaceholder('Enter your username').fill('TestUser');
  await page.getByRole('button', { name: 'Continue' }).click();
  
  // 4. Complete personality quiz
  await completePersonalityQuiz(page);
  
  // 5. Complete subject quiz
  await completeSubjectQuiz(page);

  // 6. Verify that we go directly to results without preference selection
  const strongestTraitsHeading = page.getByRole('heading', { name: 'Your Strongest Traits' });
  const strongestSubjectsHeading = page.getByRole('heading', { name: 'Your Strongest Subjects' });

  await expect(strongestTraitsHeading).not.toBeVisible().catch(() => {
    throw new Error('Unexpected "Your Strongest Traits" heading found');
  });

  await expect(strongestSubjectsHeading).not.toBeVisible().catch(() => {
    throw new Error('Unexpected "Your Strongest Subjects" heading found');
  });

  // 7. Verify results
  await expect(page.getByRole('heading', { name: 'Your Results' })).toBeVisible();
  await expect(page.getByText('Personality Profile')).toBeVisible();


  // Verify Correct Personality scores
  expect(await page.getByText('100%').count()).toBeGreaterThan(0); // Extraversion
  expect(await page.getByText('78%').count()).toBeGreaterThan(0);  // Openness
  expect(await page.getByText('67%').count()).toBeGreaterThan(0);  // Conscientiousness
  expect(await page.getByText('56%').count()).toBeGreaterThan(0);  // Agreeableness
  expect(await page.getByText('44%').count()).toBeGreaterThan(0);  // Neuroticism

  // Verify Correct Subject scores
  expect(await page.getByText('100%').count()).toBeGreaterThan(0); // Math
  expect(await page.getByText('60%').count()).toBeGreaterThan(0);  // Science
  expect(await page.getByText('50%').count()).toBeGreaterThan(0);  // Technology
  expect(await page.getByText('40%').count()).toBeGreaterThan(0);  // English
  expect(await page.getByText('30%').count()).toBeGreaterThan(0);  // Art

  await expect(page.getByText('Math', { exact: true })).toBeVisible();
  await expect(page.getByText('Extraversion', { exact: true })).toBeVisible();
}

export {
  personalityAnswers,
  subjectAnswers,
  completePersonalityQuiz,
  completeSubjectQuiz,
  runQuizTest
};