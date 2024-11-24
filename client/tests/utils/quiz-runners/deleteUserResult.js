/**
 * Handles restarting the quiz and deleting the current user's result
 * @param {Page} page - Playwright page object
 */
export async function deleteUserResult(page) {
  await page.waitForSelector('.network-board table');
  // Wait for the restart button to be visible
  await page.waitForSelector('.restart-quiz-button');

  // Click the restart button
  await page.click('.restart-quiz-button');

  // Wait for modal to appear and click confirm
  await page.waitForSelector('.modal');
  
  // Click the danger button to confirm restart
  const [deleteResponse] = await Promise.all([
    page.waitForResponse(response => 
      response.url().includes('/api/user-result/') && 
      response.request().method() === 'DELETE'
    ),
    page.click('.confirm-delete')  // Note: click comes second in the array
  ]);

  // Extract count information from DELETE response
  const deleteData = await deleteResponse.json();
  const { counts } = deleteData;
  
  if (counts) {
    console.log(`
🧪 Delete Verification:
   • Initial Count: ${counts.before}
   • Final Count: ${counts.after}
   • Difference: ${counts.difference}
   • Status: ${counts.difference === 1 ? '✅ Success' : '❌ Failed'}
    `);

    // Verify exactly one record was deleted
    if (counts.difference !== 1) {
      throw new Error(`Expected 1 record to be deleted, but ${counts.difference} were deleted`);
    }
  }

  // Wait for network idle
  await page.waitForLoadState('networkidle');

  return true;
}
