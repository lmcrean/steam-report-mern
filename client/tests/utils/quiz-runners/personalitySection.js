export async function completePersonalitySection(page, answers) {
  // Complete all personality questions
  for (const trait of Object.keys(answers)) {
    for (const answer of answers[trait]) {
      await page.getByRole('radio', { name: String(answer) }).click();
    }
  }
  
  // Wait for EITHER screen to appear
  await Promise.race([
    page.waitForSelector('h2:has-text("We Found a Tie!")', { 
      timeout: 2000,
      state: 'visible' 
    }).catch(() => null),
    page.waitForSelector('h2:has-text("STEAM Subject Quiz")', { 
      timeout: 2000,
      state: 'visible'
    }).catch(() => null)
  ]);

  // Let the test runner handle which path to take
}
