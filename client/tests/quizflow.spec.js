// @ts-check
import { test, expect } from '@playwright/test';

test.describe('Quiz Application Flow', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('complete quiz journey', async ({ page }) => {
    // Increase timeout for this test
    test.setTimeout(120000); // 2 minutes

    // 1. Landing page and menu 
    await expect(page.getByRole('heading', { name: 'Welcome to STEAM Career Quiz' })).toBeVisible();
    await expect(page.getByText('Discover your ideal career path through personality assessment and subject knowledge evaluation')).toBeVisible();
    
    const startButton = page.getByRole('button', { name: 'Start Quiz' });
    await expect(startButton).toBeVisible();
    await startButton.click();

    // 2. Username Entry (from UsernameEntry.jsx)
    const usernameInput = page.getByPlaceholder('Enter your username');
    await expect(usernameInput).toBeVisible();
    await usernameInput.fill('TestUser');
    await page.getByRole('button', { name: 'Continue' }).click();

    // 3. Personality Quiz Section (from PersonalityQuiz.jsx)
    await expect(page.getByRole('heading', { name: 'OCEAN Personality Test' })).toBeVisible();
    
    // Complete 25 personality questions (5 traits × 5 questions each)
    for (let i = 0; i < 25; i++) {
      const randomAnswer = Math.floor(Math.random() * 9) + 1;
      // The RadioGroup component renders inputs with values 1-9
      await page.getByRole('radio', { name: String(randomAnswer) }).click();
      await page.getByRole('button', { name: 'Next' }).click();
      console.log(`Completed personality question ${i + 1} of 25`);
    }

    // 4. Subject Quiz Section
    await expect(page.getByRole('heading', { name: 'STEAM Subject Quiz' })).toBeVisible();
    
    // Wait for first subject to load
    await expect(page.getByText('Science - Question 1 of 10')).toBeVisible();

    // Helper function to complete a subject quiz question
    const completeSubjectQuestion = async (subject, questionNumber) => {
      try {
        // Wait for the question text to be visible
        await page.waitForSelector('.text-lg.font-medium', { state: 'visible', timeout: 5000 });
        
        // Log current question for debugging
        const questionText = await page.$eval('.text-lg.font-medium', el => el.textContent);
        console.log(`Current question: ${questionText}`);

        // Wait for answer options to be visible
        // Based on the RadioGroup component structure, options are rendered as labels
        await page.waitForSelector('.relative.flex.items-center', { state: 'visible', timeout: 5000 });

        // Get all answer options
        const options = await page.$$('.relative.flex.items-center');
        console.log(`Found ${options.length} answer options`);

        if (options.length === 0) {
          throw new Error(`No answer options found for ${subject} question ${questionNumber}`);
        }

        // Select a random option
        const randomIndex = Math.floor(Math.random() * options.length);
        await options[randomIndex].click();
        console.log(`Selected option ${randomIndex + 1}`);

        // Wait a moment for the selection to register
        await page.waitForTimeout(100);

        // Wait for Next button to be enabled and visible
        await page.waitForSelector('button:not([disabled])[name="Next"]', {
          state: 'visible',
          timeout: 5000
        });

        // Click Next
        await page.click('button[name="Next"]');

        console.log(`Completed ${subject} question ${questionNumber}`);

        // Wait for next question to load or section to change
        if (questionNumber < 10) {
          await expect(page.getByText(`${subject} - Question ${questionNumber + 1} of 10`)).toBeVisible();
        }

      } catch (error) {
        console.error(`Error on ${subject} question ${questionNumber}:`, error);
        // Take a screenshot on error for debugging
        await page.screenshot({ path: `error-${subject}-q${questionNumber}.png` });
        throw error;
      }
    };

    // Complete all subjects
    const subjects = ['Science', 'Technology', 'English', 'Art', 'Math'];
    
    for (const subject of subjects) {
      console.log(`\nStarting ${subject} section`);
      
      // Complete 10 questions for this subject
      for (let i = 1; i <= 10; i++) {
        console.log(`\nAttempting ${subject} question ${i}`);
        await completeSubjectQuestion(subject, i);
      }
    }

    // 5. Results Page
    await expect(page.getByRole('heading', { name: 'Your Results' })).toBeVisible();
    
    // Check for results sections
    await expect(page.getByText('Personality Profile')).toBeVisible();
    // await expect(page.getByText('Subject Performance')).toBeVisible();
    // await expect(page.getByText('Career Recommendations')).toBeVisible();

    // // 6. View Leaderboard
    // const leaderboardButton = page.getByRole('button', { name: 'View Leaderboard' });
    // await expect(leaderboardButton).toBeVisible();
    // await leaderboardButton.click();
    
    // // Check leaderboard content (from QuizLeaderboard.jsx)
    // await expect(page.getByRole('heading', { name: 'Leaderboard' })).toBeVisible();
    // await expect(page.getByText('TestUser')).toBeVisible();
  });
});