// @ts-check
import { test, expect } from '@playwright/test';
import { subjects } from '../../src/data/subjectQuestions.js';

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
    // Get all questions for this subject
    const questions = subjects[subject].questions;
    
    for (let i = 0; i < 10; i++) {
      // Log the intention for this question
      // console.log(`Q${i + 1}: intention - ${subjectAnswers[subject][i] ? 'True' : 'False'}`);
      
      // Wait for question to be visible and get its text
      const questionElement = await page.getByText(`${subject} - Question ${i + 1} of 10`);
      await expect(questionElement).toBeVisible();
      const questionText = await page.locator('.text-lg.font-medium').textContent();
      
      // Find matching question in our database
      const currentQuestion = questions.find(q => q.question === questionText);
      // console.log('Found question:', currentQuestion);
      
      // Get all answer options and find the correct one
      const options = await page.$$('.relative.flex.items-center');
      const optionTexts = await Promise.all(
        options.map(async (option) => await option.textContent())
      );
      
      // Find index of correct answer
      const correctAnswerIndex = optionTexts.findIndex(
        text => text === currentQuestion.correct_answer
      );
      
      // Select based on our intention (true = correct, false = incorrect)
      const shouldSelectCorrect = subjectAnswers[subject][i];
      const answerIndex = shouldSelectCorrect ? correctAnswerIndex : 
        (correctAnswerIndex === 0 ? 1 : 0);
      
      await options[answerIndex].click();
      await page.click('button[name="Next"]');
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