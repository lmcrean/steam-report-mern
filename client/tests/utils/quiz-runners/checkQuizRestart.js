/**
 * Verifies that the quiz has properly restarted and returned to menu
 * @param {Page} page - Playwright page object
 */
export async function checkQuizRestart(page) {
  // Wait for navigation to menu
  await page.waitForURL('**/menu', { timeout: 5000 });
  
  // Verify we're on the menu page
  const menuVisible = await page.isVisible('h1:has-text("Career Quiz")');
  if (!menuVisible) {
    throw new Error('Quiz did not restart - menu page not visible');
  }

  // Verify start button is available
  const startButton = await page.isVisible('button:has-text("Start Quiz")');
  if (!startButton) {
    throw new Error('Quiz did not restart properly - start button not found');
  }

  console.log(`
🔄 Quiz Restart Verification:
   • URL: ✅ Redirected to menu
   • Menu Page: ✅ Visible
   • Start Button: ✅ Available
  `);

  return true;
}
