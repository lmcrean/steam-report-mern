// @ts-check
import { test, expect } from '@playwright/test';

test.describe('Quiz Application Flow', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('complete quiz journey', async ({ page }) => {
    // 1. Landing page and menu
    
    // From MenuScreen.jsx -> QuizCard title prop
    await expect(page.getByRole('heading', { name: 'Welcome to STEAM Career Quiz' })).toBeVisible();
    
    // Description text from MenuScreen.jsx
    await expect(page.getByText('Discover your ideal career path through personality assessment and subject knowledge evaluation')).toBeVisible();
    
    // Button text from menuItems array in MenuScreen.jsx
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
    }

    // 4. Subject Quiz Section (from SubjectQuiz.jsx)
    await expect(page.getByRole('heading', { name: 'STEAM Subject Quiz' })).toBeVisible();
    
    // 50 questions total (10 questions × 5 subjects)
    for (let i = 0; i < 50; i++) {
      // Multiple choice options (4 choices per question)
      const randomAnswer = Math.floor(Math.random() * 4) + 1;
      await page.getByRole('radio', { name: String(randomAnswer) }).click();
      await page.getByRole('button', { name: 'Next' }).click();
    }

    // 5. Results Page (from QuizResults.jsx)
    const resultsTitle = page.getByRole('heading', { name: 'Your Results' });
    await expect(resultsTitle).toBeVisible();
    
    // Check for the three main sections of results
    await expect(page.getByText('Personality Profile')).toBeVisible();
    await expect(page.getByText('Subject Performance')).toBeVisible();
    await expect(page.getByText('Career Recommendations')).toBeVisible();

    // 6. View Leaderboard
    const leaderboardButton = page.getByRole('button', { name: 'View Leaderboard' });
    await expect(leaderboardButton).toBeVisible();
    await leaderboardButton.click();
    
    // Check leaderboard content (from QuizLeaderboard.jsx)
    await expect(page.getByRole('heading', { name: 'Leaderboard' })).toBeVisible();
    await expect(page.getByText('TestUser')).toBeVisible();
  });
});