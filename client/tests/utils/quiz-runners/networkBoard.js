export async function verifyNetworkBoard(page, testCase) {
  try {
    // Wait for network board table to be visible
    await page.waitForSelector('.network-board table');

    // Verify our test user's data appears in the table
    const userRow = await page.locator(`tr:has-text("${testCase.username}")`);
    if (!await userRow.isVisible()) {
      throw new Error('User entry not found in network board table');
    }

    console.log(`✓ Network board entry verified for test user: ${testCase.username}`);


    const deleteButton = await userRow.locator('.delete-button');
    if (await deleteButton.isVisible()) {
      await deleteButton.click();
      console.log(`✓ Clicked delete button for test entry`);
    }

  } catch (error) {
    console.error('Network board verification failed:', error);
    throw error;
  }
}

