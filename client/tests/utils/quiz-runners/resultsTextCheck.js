import { expect } from '@playwright/test';

export async function verifyResultsText(page, testCase) {
  // Wait for results section to be visible
  await page.waitForSelector('h2:has-text("Your Results")', { timeout: 5000 });

  // Extract personality scores from the rendered page
  const scores = await page.$$eval('.space-y-2 > div', elements => 
    elements.map(el => {
      const trait = el.querySelector('span').textContent; // Get the trait name
      const score = el.querySelector('span:nth-child(2)').textContent; // Get the score
      return { trait, score };
    })
  );
}
