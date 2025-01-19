export async function verifyPieChartToggle(page) {
  console.log('Starting pie chart verification...');

  // Wait for charts container to appear
  try {
    await page.waitForSelector('[data-testid="charts-container"]', {
      state: 'visible',
      timeout: 2000
    });
    console.log('Found charts container');
  } catch (error) {
    console.error('Failed to find charts container:', error);
    await page.screenshot({ path: 'charts-container-debug.png' });
    throw error;
  }

  // Verify that both charts are present
  try {
    const personalityChart = await page.$('[data-testid="personality-traits-chart"]');
    const subjectChart = await page.$('[data-testid="subject-areas-chart"]');

    if (!personalityChart || !subjectChart) {
      throw new Error('Missing one or both charts');
    }
    console.log('Found both charts');
  } catch (error) {
    console.error('Failed to find individual charts:', error);
    await page.screenshot({ path: 'charts-debug.png' });
    throw error;
  }

  // Verify titles
  try {
    const titles = await page.$$('h3');
    const titleTexts = await Promise.all(
      titles.map(title => title.textContent())
    );
    
    if (!titleTexts.includes('Personality Traits') || !titleTexts.includes('Subject Areas')) {
      throw new Error('Missing chart titles');
    }
    console.log('Found chart titles');
  } catch (error) {
    console.error('Failed to verify titles:', error);
    await page.screenshot({ path: 'titles-debug.png' });
    throw error;
  }

  console.log('Pie chart verification complete');
} 