export async function handleSubjectTieBreaker(page, preferredSubject) {
  try {
    // Wait for and verify tie breaker screen
    const header = await page.waitForSelector('h2:has-text("Your Strongest Subjects")', { timeout: 5000 });
    console.log('✓ Subject tie breaker screen found');
    
    // First select the radio option for the preferred subject
    await page.getByRole('radio', { name: preferredSubject }).click();
    console.log(`✓ Selected subject: ${preferredSubject}`);
    
    // Then click the "Confirm Selection" button
    await page.getByRole('button', { name: 'Confirm Selection' }).click();
    console.log('✓ Confirmed selection');
    
    // Wait for results screen
    // await page.waitForSelector('h2:has-text("Your Results")', { timeout: 5000 });
    console.log(`✓ Successfully handled subject tie breaker - selected ${preferredSubject}`);
  } catch (error) {
    console.error('❌ Failed to handle subject tie breaker:', error);
    // Add more detailed error logging
    const buttons = await page.$$('button');
    console.error('Available buttons:', await Promise.all(
      buttons.map(button => button.textContent())
    ));
    console.error('Current URL:', page.url());
    throw error;
  }
}
