// Base test runner that handles all cases
export async function runQuizTestCase(page, testCase, subjectsData) {
  
  // Add monitoring to page
  await page.exposeFunction('monitorQuizContext', (key, value) => {
    contextMonitor.logStateChange(key, value);
  });

  await startQuiz(page);
  await completePersonalitySection(page, testCase.personalityAnswers);
  
  // Handle personality tie breaker if needed
  if (testCase.preferredTrait) {
    await handlePersonalityTieBreaker(page, testCase.preferredTrait);
  }
  
  await completeSubjectSection(page, testCase.subjectAnswers, subjectsData);
  
  // Handle subject tie breaker if needed
  if (testCase.preferredSubject) {
    await handleSubjectTieBreaker(page, testCase.preferredSubject);
  }
}

async function startQuiz(page) {
  // Navigate to homepage and start quiz
  await page.goto('/');
  
  // Wait for and click the start button
  await page.getByRole('button', { name: 'Start Quiz' }).click();
  
  // Enter username and continue
  await page.getByPlaceholder('Enter your username').fill('TestUser');
  await page.getByRole('button', { name: 'Continue' }).click();
}

async function completePersonalitySection(page, answers) {
  // Complete all personality questions
  for (const trait of Object.keys(answers)) {
    for (const answer of answers[trait]) {
      await page.getByRole('radio', { name: String(answer) }).click();
      await page.getByRole('button', { name: 'Next' }).click();
    }
  }
  
  // Wait for either the tie breaker screen OR the subject quiz screen
  try {
    const [tieBreaker, subjectQuiz] = await Promise.race([
      Promise.all([
        page.waitForSelector('h2:has-text("We Found a Tie!")', { timeout: 2000 }),
        Promise.resolve(null)
      ]),
      Promise.all([
        Promise.resolve(null),
        page.waitForSelector('h2:has-text("STEAM Subject Quiz")', { timeout: 2000 })
      ])
    ]);

    if (tieBreaker) {
      console.log('✓ Detected personality tie breaker screen');
      return; // Exit here and let the tie breaker handler take over
    } else if (subjectQuiz) {
      console.log('✓ No personality tie breaker detected, proceeding to subject section');
      return;
    }
  } catch (error) {
    console.error('❌ Failed to detect next screen after personality section');
    throw new Error('Quiz failed to transition properly after personality section');
  }
}

async function completeSubjectSection(page, answers, subjectsData) {
  for (const subject of Object.keys(answers)) {
    console.log(`📝 Starting ${subject} questions...`);
    
    // Get questions for this subject from the passed data
    const subjectQuestions = subjectsData[subject].questions;
    
    for (let i = 0; i < answers[subject].length; i++) {
      const shouldBeCorrect = answers[subject][i] === 1;
      const question = subjectQuestions[i];
      
      // Wait for options to be visible
      const options = await page.$$('.relative.flex.items-center');
      
      // Log for debugging
      console.log(`Q${i + 1}: ${shouldBeCorrect ? 'Should select correct' : 'Should select incorrect'}`);
      console.log(`Correct answer: ${question.correct_answer}`);
      
      if (shouldBeCorrect) {
        // Click the correct answer
        await page.getByText(question.correct_answer).click();
      } else {
        // Click the first incorrect answer
        await page.getByText(question.incorrect_answers[0]).click();
      }
      
      await page.getByRole('button', { name: 'Next' }).click();
    }
  }
}

async function handlePersonalityTieBreaker(page, preferredTrait) {
  try {
    console.log(`\nAttempting to handle personality tie breaker - will select ${preferredTrait}`);
    
    // Wait for the tie breaker component and verify it's visible
    const tieBreaker = await page.waitForSelector('h2:has-text("We Found a Tie!")', { 
      timeout: 5000,
      state: 'visible'
    });
    
    if (!tieBreaker) {
      throw new Error('Tie breaker component not found');
    }
    
    // Log available buttons for debugging
    const buttons = await page.$$('button');
    const buttonTexts = await Promise.all(
      buttons.map(button => button.textContent())
    );
    console.log('Available buttons:', buttonTexts);
    
    // Find and click the button with the preferred trait
    const traitButton = await page.getByRole('button', { 
      name: preferredTrait,
      exact: true 
    });
    
    if (!traitButton) {
      throw new Error(`Button for trait "${preferredTrait}" not found. Available buttons: ${buttonTexts.join(', ')}`);
    }
    
    await traitButton.click();
    console.log(`✓ Selected preferred trait: ${preferredTrait}`);
    
    // Wait for button state to update
    await page.waitForTimeout(100);
    
    // Find and click the confirm button
    const confirmButton = await page.getByRole('button', { 
      name: 'Confirm Selection',
      exact: true
    });
    
    if (!confirmButton) {
      throw new Error('Confirm Selection button not found');
    }
    
    await confirmButton.click();
    console.log('✓ Clicked confirm selection');
    
    // Wait for transition to subject section
    await page.waitForSelector('h2:has-text("STEAM Subject Quiz")', { 
      timeout: 5000,
      state: 'visible'
    });
    
    console.log('✓ Successfully transitioned to subject section after tie breaker');
  } catch (error) {
    console.error('❌ Failed to handle personality tie breaker:', error);
    // Take a screenshot and log the page HTML for debugging
    await page.screenshot({ path: 'personality-tie-breaker-error.png' });
    const html = await page.content();
    console.log('Page HTML:', html);
    throw error;
  }
}

async function handleSubjectTieBreaker(page, preferredSubject) {
  try {
    // Wait for the subject tie breaker component to appear
    await page.waitForSelector('h2:has-text("Subject Tie Detected!")', { timeout: 5000 });
    
    // Select the preferred subject
    await page.getByRole('button', { name: preferredSubject }).click();
    
    // Click confirm selection
    await page.getByRole('button', { name: 'Confirm Selection' }).click();
    
    // Wait for results page
    await page.waitForSelector('h2:has-text("Your Results")', { timeout: 5000 });
    
    console.log(`✓ Successfully handled subject tie breaker - selected ${preferredSubject}`);
  } catch (error) {
    console.error('❌ Failed to handle subject tie breaker:', error);
    throw new Error('Failed to handle subject tie breaker');
  }
}