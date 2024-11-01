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
    const personalityResponses = Array(25).fill(null).map((_, i) => {
      const traitIndex = i % 5;
      const value = [0, 2, 3].includes(traitIndex) ? 8 : 5;
      return { value, questionIndex: i };
    });

    console.log('Personality Quiz Plan:', JSON.stringify(personalityResponses, null, 2));

    // Input all personality answers
    for (const { value } of personalityResponses) {
      const radioButton = page.getByRole('radio', { name: String(value) });
      await expect(radioButton).toBeVisible();
      await radioButton.click();
      
      const nextButton = page.getByRole('button', { name: 'Next' });
      await expect(nextButton).toBeEnabled();
      await nextButton.click();
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
    await page.waitForLoadState('networkidle');
    await expect(page.getByRole('heading', { name: 'Your Results' })).toBeVisible();

    // Verify preference indicator is shown
    await expect(page.getByText('Your Selected Preferences:')).toBeVisible();
    await expect(page.getByText('• Personality Trait: Extraversion')).toBeVisible();
    await expect(page.getByText('• Subject Area: Technology')).toBeVisible();

    // Verify Extraversion scores with bonus
    const extraversion = page.getText('Extraversion').first();
    await expect(extraversion).toBeVisible();
    await expect(extraversion.locator('..').getByText('97.8%')).toBeVisible(); // 88.9% + 10% bonus
    await expect(page.getByText('(Preferred)').first()).toBeVisible();

    // Verify other personality scores remain at base level
    await expect(page.getByText('88.9%')).toBeVisible();
    console.log('Test completed successfully');
  });
});