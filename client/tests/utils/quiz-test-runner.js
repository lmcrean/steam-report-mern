import { startQuiz } from './quiz-runners/startQuiz';
import { completePersonalitySection } from './quiz-runners/personalitySection';
import { completeSubjectSection } from './quiz-runners/subjectSection';
import { 
  handlePersonalityTieBreaker 
} from './quiz-runners/personalityTieBreaker';
import { 
  handleSubjectTieBreaker 
} from './quiz-runners/subjectTieBreaker';
import { verifyResultsText } from './quiz-runners/resultsTextCheck';

export async function runQuizTestCase(page, testCase, subjectsData) {
  // Add monitoring to page
  await page.exposeFunction('monitorQuizContext', (key, value) => {
    contextMonitor.logStateChange(key, value);
  });

  await startQuiz(page);
  await completePersonalitySection(page, testCase.personalityAnswers);
  
  if (testCase.preferredTrait) {
    await handlePersonalityTieBreaker(page, testCase.preferredTrait);
  }
  
  await completeSubjectSection(page, testCase.subjectAnswers, subjectsData);
  
  if (testCase.preferredSubject) {
    await handleSubjectTieBreaker(page, testCase.preferredSubject);
  }

  // Verify the final results
  await verifyResultsText(page, testCase);
}
