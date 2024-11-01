// @ts-check
import { test, expect } from '@playwright/test';

// Predefined answers to ensure Extraversion is highest OCEAN trait
const personalityAnswers = {
  // Give Extraversion highest scores (mostly 9s)
  Extraversion: [9, 9, 8, 9, 9],
  // Give other traits lower but varying scores
  Openness: [6, 7, 6, 7, 6],
  Conscientiousness: [5, 6, 5, 6, 5],
  Agreeableness: [4, 5, 4, 5, 4],
  Neuroticism: [3, 4, 3, 4, 3]
};

// Predefined answers to ensure Math is highest STEAM subject
const subjectAnswers = {
  Science: [true, true, false, true, false, true, false, true, false, true], // 6/10
  Technology: [true, false, true, true, false, true, false, true, false, true], // 6/10
  English: [true, false, true, false, true, false, true, false, true, false], // 5/10
  Art: [true, false, true, false, true, false, true, false, true, false], // 5/10
  Math: [true, true, true, true, false, true, true, true, true, true] // 9/10
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
  
  // 6. Verify results
  await expect(page.getByRole('heading', { name: 'Your Results' })).toBeVisible();
  await expect(page.getByText('Personality Profile')).toBeVisible();
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