export async function completeSubjectSection(page, answers, subjectsData) {
  for (const subject of Object.keys(answers)) {
    // console.log(`\n��� Starting ${subject} questions...`);
    
    for (let i = 0; i < answers[subject].length; i++) {
      const shouldBeCorrect = answers[subject][i] === 1;
      
      await page.waitForSelector('.bg-white', { timeout: 5000 });
      const headerText = await page.locator('.text-gray-600').first().textContent();
      // console.log(`\nHeader: ${headerText}`);
      
      const questionText = await page.locator('.bg-gray-50 p.text-lg').textContent();
      // console.log('\n=== Question Details ===');
      // console.log(`Question: ${questionText.trim()}`);
      
      const questionData = subjectsData[subject].questions.find(q => 
        q.question.trim() === questionText.trim()
      );
      
      if (!questionData) {
        throw new Error(`Could not find question data for: ${questionText}`);
      }

      const radioLabels = await page.$$('label');
      const options = await Promise.all(
        radioLabels.map(async label => ({
          text: (await label.textContent()).trim(),
          element: label
        }))
      );
      
      // console.log('\nAvailable answers on screen:');
      options.forEach(option => {
        const isCorrect = option.text === questionData.correct_answer;
        // console.log(`${isCorrect ? '✓' : ' '} ${option.text}${isCorrect ? ' (correct)' : ''}`);
      });
      
      // console.log(`\nAction: Will select ${shouldBeCorrect ? 'correct' : 'incorrect'} answer`);
      
      try {
        if (shouldBeCorrect) {
          const correctOption = options.find(opt => 
            opt.text === questionData.correct_answer
          );
          await correctOption.element.click();
          // console.log(`Selected: ✓ ${correctOption.text}`);
        } else {
          const incorrectOption = options.find(opt => 
            opt.text !== questionData.correct_answer
          );
          await incorrectOption.element.click();
          // console.log(`Selected: ${incorrectOption.text}`);
        }
        
        await page.waitForTimeout(100);
        await page.getByRole('button', { name: 'Next' }).click();
        // console.log('Clicked: Next\n------------------------');
        await page.waitForTimeout(200);
        
      } catch (error) {
        console.error(`\n❌ Failed to answer question ${i + 1} for ${subject}:`, error);
        console.log('\nCurrent page state:');
        const html = await page.content();
        console.log(html);
        throw error;
      }
    }
    console.log(`\n✓ Completed ${subject} section`);
  }
}
