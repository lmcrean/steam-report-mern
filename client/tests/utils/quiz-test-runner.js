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
import { verifyCareerRecommendations } from './quiz-runners/careerRecommendation';

export async function runQuizTestCase(page, testCase, subjectsData) {
  await startQuiz(page);
  await completePersonalitySection(page, testCase.personalityAnswers);
  
  const tieBreakerVisible = await page.isVisible('h2:has-text("We Found a Tie!")');
  if (tieBreakerVisible) {
    if (!testCase.preferredTrait) {
      throw new Error('Tie breaker screen shown but no preferred trait specified in test case');
    }
    await handlePersonalityTieBreaker(page, testCase.preferredTrait);
  } else {
    await page.waitForSelector('h2:has-text("STEAM Subject Quiz")', { 
      timeout: 2000,
      state: 'visible'
    });
  }
  
  await completeSubjectSection(page, testCase.subjectAnswers, subjectsData);
  
  const subjectTieBreakerVisible = await page.isVisible('h2:has-text("Your Strongest Subjects")');
  if (subjectTieBreakerVisible) {
    if (!testCase.preferredSubject) {
      throw new Error('Subject tie breaker screen shown but no preferred subject specified in test case');
    }
    await handleSubjectTieBreaker(page, testCase.preferredSubject);
  }

  await verifyResultsText(page, testCase);
  await verifyCareerRecommendations(page, testCase);
}
