import { INITIAL_STATE } from '../../../src/context/quizConstants';

/**
 * Verifies that the quiz context has been reset to initial state
 * @param {Page} page - Playwright page object
 * @returns {Promise<boolean>} - True if context matches initial state
 */
export async function checkContextRestarted(page) {
  // Get the current quiz context state
  const quizContext = await page.evaluate(() => {
    return window.quizContext?.state || {};
  });

  // Fields to verify (excluding implementation-specific fields)
  const fieldsToCheck = [
    'section',
    'username',
    'traitPercentages',
    'needsPersonalityTieBreaker',
    'personalityTies',
    'preferredTrait',
    'subjectPercentages',
    'needsSubjectTieBreaker',
    'subjectTies',
    'preferredSubject',
    'preferredSubjectScore',
    'preferredTraitScore',
    'preferredEnvironment',
  ];

  // Check each field matches initial state
  const mismatches = [];
  for (const field of fieldsToCheck) {
    const expected = INITIAL_STATE[field];
    const actual = quizContext[field];
    
    if (JSON.stringify(actual) !== JSON.stringify(expected)) {
      mismatches.push({
        field,
        expected,
        actual
      });
    }
  }

  // Log verification results
  console.log(`
🔄 Context Reset Verification:
   • Fields Checked: ${fieldsToCheck.length}
   • Mismatches: ${mismatches.length}
   • Status: ${mismatches.length === 0 ? '✅ Success' : '❌ Failed'}
  `);

  // Log any mismatches for debugging
  if (mismatches.length > 0) {
    console.log('Mismatched Fields:');
    mismatches.forEach(({ field, expected, actual }) => {
      console.log(`   • ${field}:
      Expected: ${JSON.stringify(expected)}
      Actual: ${JSON.stringify(actual)}`);
    });
    throw new Error('Quiz context was not properly reset');
  }

  return true;
}
