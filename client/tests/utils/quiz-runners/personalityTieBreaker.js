export async function handlePersonalityTieBreaker(page, preferredTrait) {
  try {

    
    const tieBreaker = await page.waitForSelector('h2:has-text("We Found a Tie!")', { 
      timeout: 5000,
      state: 'visible'
    });
    
    if (!tieBreaker) {
      throw new Error('Tie breaker component not found');
    }
    
    const traitButton = await page.getByRole('button', { 
      name: preferredTrait,
      exact: true 
    });
    
    if (!traitButton) {
      const buttons = await page.$$('button');
      const buttonTexts = await Promise.all(
        buttons.map(button => button.textContent())
      );
      throw new Error(`Button for trait "${preferredTrait}" not found. Available buttons: ${buttonTexts.join(', ')}`);
    }
    
    await traitButton.click();

    
    await page.waitForTimeout(100);
    
    const confirmButton = await page.getByRole('button', { 
      name: 'Confirm Selection',
      exact: true
    });
    
    if (!confirmButton) {
      throw new Error('Confirm Selection button not found');
    }
    
    await confirmButton.click();

    
    await page.waitForSelector('h2:has-text("STEAM Subject Quiz")', { 
      timeout: 5000,
      state: 'visible'
    });
    

  } catch (error) {
    console.error('❌ Failed to handle personality tie breaker:', error);
    await page.screenshot({ path: 'personality-tie-breaker-error.png' });
    const html = await page.content();

    throw error;
  }
}
