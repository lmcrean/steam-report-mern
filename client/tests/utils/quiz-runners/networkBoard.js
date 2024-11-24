export async function verifyNetworkBoard(page) {  
  // Get all rows from the network board table, after network idle
  await page.waitForLoadState('networkidle');
  const rows = await page.$$('table tbody tr');
  const rowCount = rows.length;
  console.log(`📊 Initial network board state: ${rowCount} rows`);
  
  // Store the row count in the page object for later comparison
  await page.evaluate((count) => {
    window._initialRowCount = count;
  }, rowCount);

  return true;
}

