/**
 * Handles deleting the current user's result from the network board
 * @param {Page} page - Playwright page object
 */
export async function deleteUserResult(page) {
  // Wait for the network board table to be visible
  await page.waitForSelector('.network-board table');

  // Find and click the first "Delete my result" button
  const deleteButton = await page.locator('button:has-text("Delete my result")').first();
  
  // Verify the button exists before clicking
  if (await deleteButton.count() === 0) {
    throw new Error('No delete button found - current user result may not be in the table');
  }

  // Click delete and wait for DELETE response
  const deleteResponse = await Promise.all([
    page.waitForResponse(response => 
      response.url().includes('/api/user-result/') && 
      response.request().method() === 'DELETE'
    ),
    deleteButton.click()
  ]);

  // Extract count information from DELETE response
  const deleteData = await deleteResponse[0].json();
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
