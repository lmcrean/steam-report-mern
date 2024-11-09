export async function handleSubjectTieBreaker(page, preferredSubject) {
  try {
    await page.waitForSelector('h2:has-text("Your Strongest Subjects")', { timeout: 5000 });
    await page.getByRole('button', { name: preferredSubject }).click();
    await page.getByRole('button', { name: 'Confirm Selection' }).click();
    await page.waitForSelector('h2:has-text("Your Results")', { timeout: 5000 });
    console.log(`✓ Successfully handled subject tie breaker - selected ${preferredSubject}`);
  } catch (error) {
    console.error('❌ Failed to handle subject tie breaker:', error);
    throw new Error('Failed to handle subject tie breaker');
  }
}
