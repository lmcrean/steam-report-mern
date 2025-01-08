export async function verifyPieChartToggle(page) {
  console.log('Starting pie chart verification...');

  // Find and click the toggle switch
  const toggleSwitch = await page.$('label:has(input[type="checkbox"].sr-only)');
  if (!toggleSwitch) {
    throw new Error('Toggle switch not found');
  }

  // Scroll the toggle switch into view and click it
  await toggleSwitch.scrollIntoViewIfNeeded();
  await toggleSwitch.click();
  console.log('Clicked toggle switch');

  // Wait for pie charts to be rendered
  try {
    await page.waitForSelector('canvas', {
      state: 'visible',
      timeout: 2000
    });
    console.log('Found Chart.js canvas');
  } catch (error) {
    console.error('Failed to find Chart.js canvas:', error);
    await page.screenshot({ path: 'pie-chart-debug.png' });
    throw error;
  }

  // Verify that both pie charts are present
  const pieCharts = await page.$$('canvas');
  console.log(`Found ${pieCharts.length} pie charts`);
  if (pieCharts.length !== 2) {
    throw new Error(`Expected 2 pie charts, but found ${pieCharts.length}`);
  }

  // Find and scroll to full screen button
  const fullScreenButton = await page.$('button[aria-label="View full screen"]');
  if (!fullScreenButton) {
    throw new Error('Full screen button not found');
  }
  await fullScreenButton.scrollIntoViewIfNeeded();
  await fullScreenButton.click();
  console.log('Clicked full screen button');

  // Verify modal is shown
  try {
    await page.waitForSelector('div[class*="fixed inset-0"]', {
      state: 'visible',
      timeout: 2000
    });
    console.log('Modal appeared');

    // Just verify modal is visible
    const modalVisible = await page.$('div[class*="fixed inset-0"]');
    if (!modalVisible) {
      throw new Error('Modal not visible');
    }

  } catch (error) {
    console.error('Failed to verify modal:', error);
    await page.screenshot({ path: 'modal-debug.png' });
    throw error;
  }

  // Close modal
  const closeButton = await page.$('button[aria-label="Close modal"]');
  if (!closeButton) {
    throw new Error('Close modal button not found');
  }
  await closeButton.click();
  console.log('Clicked close modal button');

  // Wait for modal to be fully closed and DOM to be stable
  await page.waitForSelector('div[class*="fixed inset-0"]', {
    state: 'hidden',
    timeout: 2000
  });
  console.log('Modal closed');

  // Wait a bit for any animations to complete
  await page.waitForTimeout(500);

  // Find the toggle switch again since the DOM has been updated
  const newToggleSwitch = await page.$('label:has(input[type="checkbox"].sr-only)');
  if (!newToggleSwitch) {
    throw new Error('Toggle switch not found after closing modal');
  }
  await newToggleSwitch.scrollIntoViewIfNeeded();
  await newToggleSwitch.click();
  console.log('Clicked toggle switch again');

  // Verify that percentage breakdowns are visible again
  await page.waitForSelector('div.flex.justify-between', {
    state: 'visible',
    timeout: 2000
  });
  console.log('Percentage breakdowns visible');
} 