export async function completeSubjectSection(page, answers, subjectsData) {
  for (const subject of Object.keys(answers)) {
    console.log(`\n📚 Starting ${subject} section...`);
    
    for (let i = 0; i < answers[subject].length; i++) {
      const shouldBeCorrect = answers[subject][i] === 1;
      
      // Wait for question to load
      await page.waitForSelector('.bg-white', { timeout: 5000 });
      const headerText = await page.locator('.text-gray-600').first().textContent();
      const questionText = await page.locator('.bg-gray-50 p.text-lg').textContent();
      
      // Improved question matching with fuzzy matching
      const questionData = findMatchingQuestion(questionText, subjectsData[subject].questions);
      
      if (!questionData) {
        logQuestionMatchingError(questionText, subject, subjectsData[subject].questions);
        throw new Error(`Could not find question data for: ${questionText}`);
      }

      // Get and process answer options
      const options = await getAnswerOptions(page);
      
      try {
        // Select and click the appropriate answer
        await selectAnswer(options, questionData, shouldBeCorrect);
        
        // Navigate to next question
        await navigateToNext(page);
        
      } catch (error) {
        await handleAnswerError(error, page, subject, i);
      }
    }
    console.log(`✅ Completed ${subject} section`);
  }
}

// Helper functions
function findMatchingQuestion(questionText, questions) {
  const normalizedSearchText = normalizeText(questionText);
  
  return questions.find(q => {
    const normalizedQuestion = normalizeText(q.question);
    return (
      normalizedQuestion === normalizedSearchText ||
      normalizedQuestion.includes(normalizedSearchText) ||
      normalizedSearchText.includes(normalizedQuestion)
    );
  });
}

function normalizeText(text) {
  return text
    .toLowerCase()
    .trim()
    .replace(/\s+/g, ' ')
    .replace(/['".,?]/g, '');
}

async function getAnswerOptions(page) {
  const radioLabels = await page.$$('label');
  return Promise.all(
    radioLabels.map(async label => ({
      text: (await label.textContent()).trim(),
      element: label
    }))
  );
}

async function selectAnswer(options, questionData, shouldBeCorrect) {
  if (shouldBeCorrect) {
    const correctOption = options.find(opt => 
      normalizeText(opt.text) === normalizeText(questionData.correct_answer)
    );
    if (!correctOption) {
      throw new Error(`Could not find correct answer: ${questionData.correct_answer}`);
    }
    await correctOption.element.click();
  } else {
    const incorrectOption = options.find(opt => 
      normalizeText(opt.text) !== normalizeText(questionData.correct_answer)
    );
    if (!incorrectOption) {
      throw new Error('Could not find incorrect answer option');
    }
    await incorrectOption.element.click();
  }
}

async function navigateToNext(page) {
  await page.waitForTimeout(100);
  await page.getByRole('button', { name: 'Next' }).click();
  await page.waitForTimeout(200);
}

function logQuestionMatchingError(questionText, subject, availableQuestions) {
  console.error('\n❌ Question Matching Error');
  console.error('--------------------');
  console.error(`Subject: ${subject}`);
  console.error(`Looking for: "${questionText.trim()}"`);
  console.error('\nAvailable questions:');
  availableQuestions.forEach((q, index) => {
    console.error(`${index + 1}. "${q.question}"`);
  });
  console.error('\nNormalized search:');
  console.error(`Search text: "${normalizeText(questionText)}"`);
  console.error('Normalized available questions:');
  availableQuestions.forEach((q, index) => {
    console.error(`${index + 1}. "${normalizeText(q.question)}"`);
  });
}

async function handleAnswerError(error, page, subject, questionIndex) {
  console.error(`\n❌ Failed to answer question ${questionIndex + 1} for ${subject}:`);
  console.error(error);
  console.error('\nCurrent page state:');
  const html = await page.content();
  console.error(html);
  throw error;
}
