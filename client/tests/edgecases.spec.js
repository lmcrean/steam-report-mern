// tests/edge-cases.spec.js
import { test, expect } from '@playwright/test';

test.describe('Equal Scores Edge Case', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('complete quiz flow with equal top scores', async ({ page }) => {
    // Start quiz
    await page.getByRole('button', { name: 'Start Quiz' }).click();

    // Enter username
    await page.getByPlaceholder('Enter your username').fill('EdgeTest');
    await page.getByRole('button', { name: 'Continue' }).click();

    // --- Personality Quiz ---
    // Create three-way tie between Openness, Extraversion, and Agreeableness at ~88.9%
    // while keeping Conscientiousness and Neuroticism lower at ~55.6%
    const mockAnswers = {
      Openness: [8, 8, 8, 8, 8],         // Score: 40/45 = ~88.9%
      Conscientiousness: [5, 5, 5, 5, 5], // Score: 25/45 = ~55.6%
      Extraversion: [8, 8, 8, 8, 8],     // Score: 40/45 = ~88.9%
      Agreeableness: [8, 8, 8, 8, 8],    // Score: 40/45 = ~88.9%
      Neuroticism: [5, 5, 5, 5, 5]       // Score: 25/45 = ~55.6%
    };

    // Input all personality answers
    for (const trait of Object.keys(mockAnswers)) {
      for (const answer of mockAnswers[trait]) {
        await page.getByRole('radio', { name: String(answer) }).click();
        await page.getByRole('button', { name: 'Next' }).click();
      }
    }

    // --- Subject Quiz ---
    // Set up to create three-way tie between Science, Technology, Math at 70%
    // while keeping English and Art lower at 50%
    const targetScores = {
      'Science': 7,     // 7/10 = 70%
      'Technology': 7,  // 7/10 = 70%
      'English': 5,     // 5/10 = 50%
      'Art': 5,        // 5/10 = 50%
      'Math': 7        // 7/10 = 70%
    };

    // For each subject section
    for (const subject of ['Science', 'Technology', 'English', 'Art', 'Math']) {
      console.log(`\nStarting ${subject} section`);
      const correctToGet = targetScores[subject];
      let correctAnswered = 0;
      
      // Answer 10 questions for each subject
      for (let q = 0; q < 10; q++) {
        const questionText = await page.locator('.text-lg.font-medium').textContent();
        const needCorrect = correctAnswered < correctToGet;
        const options = await page.locator('.relative.flex.items-center').all();

        if (needCorrect) {
          await options[0].click();
          correctAnswered++;
        } else {
          await options[1].click();
        }

        await page.getByRole('button', { name: 'Next' }).click();
      }
    }

    // --- Personality Preference Selection ---
    await expect(page.getByRole('heading', { name: 'Your Strongest Traits' })).toBeVisible();
    await expect(page.getByText('Multiple traits show equal highest scores')).toBeVisible();

    // Verify only the three top scoring traits are present (88.9% each)
    await expect(page.getByText('Openness')).toBeVisible();
    await expect(page.getByText('Extraversion')).toBeVisible();
    await expect(page.getByText('Agreeableness')).toBeVisible();

    // Verify lower scoring traits are not shown
    await expect(page.getByText('Conscientiousness')).not.toBeVisible();
    await expect(page.getByText('Neuroticism')).not.toBeVisible();

    // Select Extraversion as preference
    await page.getByRole('radio', { name: 'Extraversion' }).click();
    await page.getByRole('button', { name: 'Confirm Selection' }).click();

    // --- Subject Preference Selection ---
    await expect(page.getByRole('heading', { name: 'Your Strongest Subjects' })).toBeVisible();
    await expect(page.getByText('Multiple subjects show equal highest scores')).toBeVisible();

    // Verify top scoring subjects (70% each)
    await expect(page.getByText('Science')).toBeVisible();
    await expect(page.getByText('Technology')).toBeVisible();
    await expect(page.getByText('Math')).toBeVisible();
    
    // Verify lower scoring subjects are not shown
    await expect(page.getByText('English')).not.toBeVisible();
    await expect(page.getByText('Art')).not.toBeVisible();

    // Select Technology as preference
    await page.getByRole('radio', { name: 'Technology' }).click();
    await page.getByRole('button', { name: 'Confirm Selection' }).click();

    // --- Final Results ---
    await expect(page.getByRole('heading', { name: 'Your Results' })).toBeVisible();

    // Verify preference indicator is shown
    await expect(page.getByText('Your Selected Preferences:')).toBeVisible();
    await expect(page.getByText('• Personality Trait: Extraversion')).toBeVisible();
    await expect(page.getByText('• Subject Area: Technology')).toBeVisible();

    // Verify Extraversion scores
    const extraversion = page.getByText('Extraversion').first();
    await expect(extraversion).toBeVisible();
    await expect(extraversion.locator('..').getByText('97.8%')).toBeVisible(); // 88.9% + 10% bonus
    await expect(page.getByText('(Preferred)').first()).toBeVisible();

    // Verify other top personality scores remain at 88.9%
    await expect(page.getByText('88.9%')).toBeVisible();

    // Verify Technology scores
    const technology = page.getByText('Technology').first();
    await expect(technology).toBeVisible();
    await expect(technology.locator('..').getByText('77.0%')).toBeVisible(); // 70% + 10% bonus
    await expect(page.getByText('(Preferred)').nth(1)).toBeVisible();

    // Verify other subject scores
    await expect(page.getByText('70.0%')).toBeVisible(); // Other top subjects
    await expect(page.getByText('50.0%')).toBeVisible(); // Lower subjects

    // Verify final career recommendation
    await expect(page.getByText(/Technology and Extraversion/)).toBeVisible();
    
    // Verify completion state
    await expect(
      page.getByText('Sections completed: Personality Assessment, Subject Knowledge, Preference Selection')
    ).toBeVisible();
  });
});